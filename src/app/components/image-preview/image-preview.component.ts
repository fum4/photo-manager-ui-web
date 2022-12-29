import { Component, Input } from '@angular/core';

import type { Image, Tag } from '../../types';
import { placeholderImage } from '../../constants';

@Component({
  selector: 'app-image-preview',
  templateUrl: './image-preview.component.html',
  styleUrls: ['./image-preview.component.scss']
})
export class ImagePreviewComponent {
  @Input() image: Image = placeholderImage;
  @Input() onFilesDrop = (_files: File[]) => {};
  @Input() onSavedImageTagsChange = (_image: Image) => {};
  @Input() removeTag = (_image: Image, _tag: Tag) => {};

  isAddingTags = false;
  isInvalidNewTag = false;
  newTagLabel = '';

  ngOnChanges() {
    this.cancelAddTag();
  }

  onTagInputKeyDown = (event: KeyboardEvent) => {
    this.isInvalidNewTag = false;

    if (event.key === 'Enter') {
      this.saveTag();
    }
  }

  addTag = () => {
    this.isAddingTags = true;

    setTimeout(() => {
      (document.querySelector('.tag-input') as HTMLInputElement)?.focus();
    });
  }

  cancelAddTag = () => {
    this.isInvalidNewTag = false;
    this.isAddingTags = false;
    this.newTagLabel = '';
  }

  saveTag = () => {
    const isDuplicate = this.image.tags.some((tag) => tag.label === this.newTagLabel);

    if (isDuplicate) {
      this.isInvalidNewTag = true;
    } else {
      const newTag = { label: this.newTagLabel };

      if (this.image.tags) {
        this.image.tags.push(newTag);
      } else {
        this.image.tags = [newTag];
      }

      this.newTagLabel = '';
      this.isAddingTags = false;

      if (this.image._id) {
        this.onSavedImageTagsChange(this.image);
      }
    }
  }
}
