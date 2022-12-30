import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'date'
})
export class FormatDatePipe implements PipeTransform {
  transform(timestamp?: number | string) {
    if (timestamp) {
      return new Date(timestamp).toDateString();
    }

    return '';
  }
}
