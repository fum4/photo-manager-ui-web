import { Component } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { without, pull, pullAllBy, xorBy, difference } from 'lodash';

import { ApiService } from './services/api.service';
import type { Image, Tag } from './types';
import { placeholderImage } from './constants';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private apiService: ApiService, private spinner: NgxSpinnerService) {}

  title = 'Photo Manager';

  savedImages: Image[] = [];
  attachedImages: Image[] = [];
  selectedImage: Image = this.savedImages[0] || placeholderImage;
  imagesToDelete: Image[] = [];
  imagesWithModifiedTags: Image[] = [];

  saveImagesButtonState = {
    label: 'Save files',
    disabled: true
  };

  ngOnInit() {
    this.spinner.show();
    this.getImages();
  }

  onImageSelect = (image: Image) => {
    this.selectedImage.isSelected = false;

    if (image !== placeholderImage) {
      image.isSelected = true;
    }

    this.selectedImage = image;
  };

  onSavedImageTagsChange = (image: Image) => {
    const changedTags = xorBy(image.tags, image.initialTags, 'label');
    const markedAsChanged = this.imagesWithModifiedTags.some(({ _id }) => _id === image._id);

    if (changedTags.length) {
      if (!markedAsChanged) {
        this.imagesWithModifiedTags.push(image);
      }

      this.saveImagesButtonState.disabled = false;
    } else {
      if (markedAsChanged) {
        pullAllBy(this.imagesWithModifiedTags, [{ _id: image._id }] , '_id');
      }

      if (!this.attachedImages.length && !this.imagesToDelete.length) {
        this.saveImagesButtonState.disabled = true;
      }
    }
  };

  onFilesDrop = (files: File[]) => {
    files.forEach(this.handleFileDrop);
  }

  handleFileDrop = (file: File) => {
    if (file) {
      const { name, lastModified } = file;
      const reader = new FileReader();

      reader.onloadend = () => {
        const systemTag = {
          label: name.slice(name.lastIndexOf('.') + 1),
          system: true,
        };

        const image: Image = {
          content: reader.result as string,
          isSelected: true,
          tags: [systemTag],
          lastModified,
          name
        };

        this.selectedImage.isSelected = false;
        this.selectedImage = image;
        this.attachedImages.unshift(image);

        if (this.attachedImages.length) {
          this.saveImagesButtonState.disabled = false;
        }
      }

      reader.readAsDataURL(file);
    }
  };

  getImages = () => {
    this.apiService.getImages().subscribe({
      next: (images) => {
        if (images.length) {
          this.savedImages = images.reverse().map((image: Image) => ({
            ...image,
            initialTags: [...image.tags]
          }));

          this.selectedImage = this.savedImages[0];
          this.selectedImage.isSelected = true;
        }
      },
      complete: () => this.spinner.hide(),
    });
  };

  saveFiles = () => {
    const reqsCount = this.attachedImages.length + this.imagesToDelete.length + this.imagesWithModifiedTags.length;
    let completedReqsCount = 0;

    const requestCallback = () => {
      completedReqsCount++;

      if (completedReqsCount === reqsCount) {
        this.saveImagesButtonState.label = 'Saved!';

        setTimeout(() => {
          this.saveImagesButtonState.label = 'Save files';
        }, 2000);
      }
    };

    this.saveImagesButtonState = {
      label: 'Saving...',
      disabled: true,
    };

    this.attachedImages.forEach((image: any) => {
      const { name, content, tags } = image;
      const payload = { name, content, tags };

      this.apiService.addImage(payload)
        .subscribe({
          next: ({ _id, tags, createdAt }) => {
            this.savedImages.unshift({ ...payload, _id, tags, createdAt });
            this.attachedImages = without(this.attachedImages, image);
            this.selectedImage.isSelected = false;
            this.selectedImage = this.savedImages[0];
            this.selectedImage.isSelected = true;

            image._id = _id;
            image.tags = tags;
            image.createdAt = createdAt;

            requestCallback();
          },
          error: () => {
            console.error('Failed to save file ', name);

            image.isError = true;

            requestCallback();
          }
        });
    })

    this.imagesToDelete.forEach((image) => {
      this.apiService.removeImage(image._id as string).subscribe({
        next: ({ _id }) => {
          pullAllBy(this.savedImages, [{ _id }], '_id');

          if (this.selectedImage._id === _id) {
            this.selectedImage = this.attachedImages[0] || this.savedImages[0] || placeholderImage;

            if (this.selectedImage !== placeholderImage) {
              this.selectedImage.isSelected = true;
            }
          }

          requestCallback();
        },
        error: () => {
          console.error('Failed to remove file with id ', image._id);

          requestCallback();
        }
      });
    });

    difference(this.imagesWithModifiedTags, this.imagesToDelete).forEach(({ _id, tags }) => {
      this.apiService.updateImage(_id as string, { tags }).subscribe({
        next: () => requestCallback(),
        error: () => requestCallback(),
      });
    })
  };

  removeAttachedImage = (image: Image) => {
    this.attachedImages = without(this.attachedImages, image);

    if (this.selectedImage === image) {
      this.selectedImage = this.attachedImages[0] || this.savedImages[0] || placeholderImage;

      if (this.selectedImage !== placeholderImage) {
        this.selectedImage.isSelected = true;
      }
    }

    if (!this.attachedImages.length && !this.imagesToDelete.length) {
      this.saveImagesButtonState.disabled = true;
    }
  };

  toggleRemoveSavedImage = (image: Image) => {
    image.toDelete = !image.toDelete;

    if (image.toDelete) {
      this.imagesToDelete.push(image);
    } else {
      pull(this.imagesToDelete, image);
    }

    if (this.imagesToDelete.length) {
      this.saveImagesButtonState.disabled = false;
    } else if (!this.attachedImages.length) {
      this.saveImagesButtonState.disabled = true;
    }
  };

  removeTag = (image: Image, tagToRemove: Tag) => {
    pull(image.tags, tagToRemove);

    if (image._id) {
      this.onSavedImageTagsChange(image);
    }
  }
}
