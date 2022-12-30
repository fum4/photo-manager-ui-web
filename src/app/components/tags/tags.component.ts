import { Component, Input } from '@angular/core';

import type { Tag } from '../../types';
import {pull} from "lodash";

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss']
})
export class TagsComponent {
  @Input() tags: Tag[] = [];
  @Input() onChange = () => {};
  @Input() isSavedImage = false;
  @Input() canAddTags = false;

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

  removeTag = (tagToRemove: Tag) => {
    pull(this.tags, tagToRemove);

    this.onChange();
  }

  saveTag = () => {
    const isDuplicate = this.tags.some((tag) => tag.label === this.newTagLabel);

    if (isDuplicate) {
      this.isInvalidNewTag = true;
    } else {
      const newTag = { label: this.newTagLabel };

      if (this.tags) {
        this.tags.push(newTag);
      } else {
        this.tags = [newTag];
      }

      this.newTagLabel = '';
      this.isAddingTags = false;

      this.onChange();
    }
  }
}
