import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sortRating'
})
export class SortRatingPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    if (!Array.isArray(value)) {
      return;
    }
    value.sort((a: any, b: any) => {
      if (a.rating < b.rating) {
        return 1;
      } else if (a.rating > b.rating) {
        return -1;
      } else {
        return 0;
      }
    });
    return value;
  }

}
