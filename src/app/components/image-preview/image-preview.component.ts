import { Component, Input } from '@angular/core';

import type { Image } from '../../types';
import { placeholderImage } from '../../constants';

@Component({
  selector: 'app-image-preview',
  templateUrl: './image-preview.component.html',
  styleUrls: ['./image-preview.component.scss']
})
export class ImagePreviewComponent {
  @Input() image: Image = placeholderImage;
  @Input() onFilesDrop = (_files: File[]) => {};
  @Input() onSavedImageTagsChange = (_imageId: string) => {};

  onTagsChange = () => {
    this.image._id && this.onSavedImageTagsChange(this.image._id);
  }
}
