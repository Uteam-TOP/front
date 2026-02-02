import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sortBy',
  standalone: true
})
export class SortByPipe implements PipeTransform {

  transform(value: any[], sortBy: string = 'createdAt', type: 'asc' | 'desc' = 'desc'): any[] {
    return value.sort((n1,n2) =>
    {
      if (type === 'desc') {
        return n2[sortBy] - n1[sortBy];
      } else {
        return n1[sortBy] - n2[sortBy];
      }
    });
  }

}
