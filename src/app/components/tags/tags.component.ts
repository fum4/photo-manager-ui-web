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
  @Input() canAddTags = false;
  @Input() isSavedImage = false;
  @Input() onChange = () => {};

  isAddingTag = false;
  isInvalidNewTag = false;
  newTagLabel = '';

  ngOnChanges() {
    this.hideTagInput();
  }

  onKeyDown = (event: KeyboardEvent) => {
    this.isInvalidNewTag = false;

    if (event.key === 'Enter') {
      this.saveTag();
    }
  };

  showTagInput = () => {
    this.isAddingTag = true;

    setTimeout(() => {
      (document.querySelector('.tag-input') as HTMLInputElement)?.focus();
    });
  };

  hideTagInput = () => {
    this.isInvalidNewTag = false;
    this.isAddingTag = false;
    this.newTagLabel = '';
  };

  removeTag = (tagToRemove: Tag) => {
    pull(this.tags, tagToRemove);

    this.onChange();
  };

  saveTag = () => {
    if (this.newTagLabel) {
      const isDuplicate = this.tags.some((tag) => tag.label === this.newTagLabel);

      if (isDuplicate) {
        this.isInvalidNewTag = true;
      } else {
        const newTag = { label: this.newTagLabel };

        this.tags.push(newTag);
        this.isAddingTag = false;
        this.newTagLabel = '';

        this.onChange();
      }
    }
  };
}
