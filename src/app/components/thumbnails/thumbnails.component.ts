import { Component, Input } from '@angular/core';

import type { Image, Tag } from '../../types';

@Component({
  selector: 'app-thumbnails',
  templateUrl: './thumbnails.component.html',
  styleUrls: ['./thumbnails.component.scss']
})
export class ThumbnailsComponent {
  @Input() attachedImages: Image[] = [];
  @Input() savedImages: (Image & { _id: string })[] = [];
  @Input() onImageSelect = (_image: Image) => {};
  @Input() onFilesDrop = (_files: File[]) => {};
  @Input() removeTag = (_imageId: string, _tag: Tag) => {};
  @Input() removeAttachedImage = (_image: Image) => {};
  @Input() toggleRemoveSavedImage = (_image: Image) => {};
  @Input() onSavedImageTagsChange = (_imageId: string) => {};

  uploadFile = () => {
    document.getElementById('upload-input')?.click();
  }

  onFileUpload = (event: Event) => {
    const { files } = event.target as HTMLInputElement;

    if (files) {
      this.onFilesDrop(Array.from(files));
    }
  }

  onTagsChange = (imageId: string) => {
    return () => {
      this.onSavedImageTagsChange(imageId);
    }
  }
}
