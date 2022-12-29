import { EventEmitter, Directive, HostBinding, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[dnd]'
})
export class DragAndDropDirective {
  @HostBinding('class.dragging-over') isDraggingOver = false;
  @Output() fileDropped = new EventEmitter<File[]>();

  @HostListener('dragover', ['$event']) onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();

    this.isDraggingOver = true;
  }

  @HostListener('dragleave', ['$event']) public onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();

    this.isDraggingOver = false;
  }

  @HostListener('drop', ['$event']) public onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();

    this.isDraggingOver = false;

    const { files } = event.dataTransfer || {};

    if (files?.length) {
      const validFiles = Array.from(files).filter((file) => file.type.startsWith('image'));

      this.fileDropped.emit(validFiles);
    }
  }
}
