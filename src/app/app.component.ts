import { Component } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { SocialAuthService } from '@abacritt/angularx-social-login';
import { without, pull, pullAllBy, xorBy, difference } from 'lodash';

import { ApiService } from './services/api.service';
import { AuthService, AuthProvider, type AuthTokens } from './services/auth.service';
import { JwtService } from './services/jwt.service';
import type { Image } from './types';
import { placeholderImage } from './constants';

// TODO: Need to break this into separate routes
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private spinner: NgxSpinnerService,
    private socialAuthService: SocialAuthService,
    private jwtService: JwtService,
  ) {}

  title = 'Photo Manager';
  userId = '';
  username = '';
  email = '';
  isLoggedIn = false;
  hasChanges = false;
  submitButtonLabel = 'Save files';

  savedImages: Image[] = [];
  attachedImages: Image[] = [];
  imagesToDelete: Image[] = [];
  modifiedImages: Image[] = [];
  selectedImage: Image = this.savedImages[0] || placeholderImage;

  ngOnInit() {
    const accessToken = localStorage.getItem('accessToken');

    const loginObserver = {
      next: this.onLoginSuccess,
      error: () => this.spinner.hide()
    };

    if (accessToken) {
      this.spinner.show();
      this.authService.silentLogin().subscribe(loginObserver);
    }

    this.socialAuthService.authState.subscribe(({ idToken, provider }) => {
      if (idToken) {
        this.spinner.show();
        this.authService.login(idToken, provider as AuthProvider).subscribe(loginObserver);
      }
    });
  }

  onLoginSuccess = (tokens: AuthTokens) => {
    const { userId, name } = this.jwtService.saveTokens(tokens);

    this.isLoggedIn = true;
    this.userId = userId;
    this.username = name;

    this.getAllImages(userId);
  }

  logout = () => {
    this.spinner.show();

    this.authService.logout().subscribe({
      next: () => {
        this.jwtService.clearSession();
        this.resetFiles();

        this.isLoggedIn = false;
        this.userId = '';
        this.savedImages = [];
        this.attachedImages = [];
        this.selectedImage = placeholderImage;
      },
      complete: () => this.spinner.hide()
    });
  }

  handleImageSelect = (image: Image) => {
    this.selectedImage.isSelected = false;
    this.selectedImage = image;
    this.selectedImage.isSelected = true;
  };

  onFilesDrop = (files: File[]) => files.forEach(this.handleFileDrop);

  handleFileDrop = (file: File) => {
    if (file) {
      const { name, lastModified } = file;
      const reader = new FileReader();

      reader.onloadend = () => {
        const systemTag = {
          label: name.slice(name.lastIndexOf('.') + 1),
          isSystemTag: true,
        };

        const image: Image = {
          content: reader.result as string,
          tags: [systemTag],
          initialTags: [systemTag],
          lastModified,
          name
        };

        this.handleImageSelect(image);
        this.attachedImages.unshift(image);
        this.hasChanges = true;
      }

      reader.readAsDataURL(file);
    }
  };

  getAllImages = (userId: string) => {
    this.apiService.getAllImages(userId).subscribe({
      next: (images) => {
        if (images.length) {
          this.savedImages = images.map((image) => ({
            ...image,
            initialTags: [ ...image.tags ]
          }));

          this.handleImageSelect(this.savedImages[0]);
        }
      },
      complete: () => this.spinner.hide(),
    });
  };

  submitFiles = () => {
    const reqsCount = this.attachedImages.length + this.imagesToDelete.length + this.modifiedImages.length;
    let completedReqsCount = 0;

    const requestCallback = () => {
      completedReqsCount++;

      if (completedReqsCount === reqsCount) {
        this.submitButtonLabel = 'Saved!';

        setTimeout(() => {
          this.submitButtonLabel = 'Save files';
        }, 2000);
      }
    };

    this.hasChanges = false;
    this.submitButtonLabel = 'Saving...';
    this.attachedImages.forEach(this.saveImage(requestCallback));
    this.imagesToDelete.forEach(this.deleteImage(requestCallback));
    difference(this.modifiedImages, this.imagesToDelete).forEach(this.updateImage(requestCallback));
  };

  resetFiles = () => {
    this.hasChanges = false;
    this.attachedImages = [];
    this.imagesToDelete = [];
    this.modifiedImages = [];

    this.savedImages.forEach((savedImage) => {
      savedImage.toDelete = false;
      savedImage.tags = [ ...savedImage.initialTags ];
    });
  };

  saveImage = (callback: () => void) => (image: Image) => {
    const { name, content, tags } = image;

    this.apiService.addImage(this.userId, { name, content, tags })
      .subscribe({
        next: ({ _id, tags, createdAt }) => {
          image._id = _id;
          image.tags = [ ...tags ];
          image.initialTags = [ ...tags ];
          image.createdAt = createdAt;

          this.savedImages.unshift(image);
          this.selectedImage.isSelected = false;
          this.selectedImage = this.savedImages[0];
          this.selectedImage.isSelected = true;
          pull(this.attachedImages, image);

          callback();
        },
        error: () => {
          console.error('Failed to save file ', name);

          image.isError = true;

          callback();
        }
      });
  };

  deleteImage = (callback: () => void) => ({ _id }: Image) => {
    this.apiService.deleteImage(this.userId, _id as string).subscribe({
      next: () => {
        pullAllBy(this.savedImages, [{ _id }], '_id');

        if (this.selectedImage._id === _id) {
          this.handleNoSelectedImage();
        }

        callback();
      },
      error: () => {
        console.error('Failed to remove file with id ', _id);

        callback();
      }
    });
  };

  updateImage = (callback: () => void) => (image: Image) => {
    this.apiService.updateImage(
      this.userId,
      image._id as string,
      { tags: image.tags }
    )
      .subscribe({
        next: () => {
          pullAllBy(this.modifiedImages, [{ _id: image._id }] , '_id');
          image.initialTags = [ ...image.tags ];
          callback();
        },
        error: () => {
          image.tags = [ ...image.initialTags ];
          callback();
        },
      });
  };

  removeAttachedImage = (image: Image) => {
    this.attachedImages = without(this.attachedImages, image);

    if (this.selectedImage === image) {
      this.handleNoSelectedImage();
    }

    this.checkForChanges();
  };

  deleteSavedImage = (image: Image) => {
    image.toDelete = true;

    this.imagesToDelete.push(image);
    this.hasChanges = true;
  };

  recoverSavedImage = (image: Image) => {
    image.toDelete = false;

    pull(this.imagesToDelete, image);
    this.checkForChanges();
  };

  checkForChanges = () => {
    this.hasChanges = !!(
      this.attachedImages.length || this.imagesToDelete.length || this.modifiedImages.length
    );
  };

  handleNoSelectedImage = () => {
    this.selectedImage = this.attachedImages[0] || this.savedImages[0] || placeholderImage;

    if (this.selectedImage !== placeholderImage) {
      this.selectedImage.isSelected = true;
    }
  };

  onSavedImageTagsChange = (imageId: string) => {
    const image = this.savedImages.find(({ _id }) => _id === imageId);

    if (image) {
      const changedTags = xorBy(image.tags, image.initialTags, 'label');
      const markedAsChanged = this.modifiedImages.some(({ _id }) => _id === image._id);

      if (changedTags.length) {
        if (!markedAsChanged) {
          this.modifiedImages.push(image);
        }

        this.hasChanges = true;
      } else {
        if (markedAsChanged) {
          pullAllBy(this.modifiedImages, [{ _id: image._id }] , '_id');
        }

        this.checkForChanges();
      }
    }
  };
}
