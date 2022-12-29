import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'date'
})
export class FormatDatePipe implements PipeTransform {
  transform(timestamp?: number) {
    if (timestamp) {
      return new Date(timestamp).toDateString();
    }

    return '';
  }
}
