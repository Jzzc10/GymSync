import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'orderBy'
})
export class OrderByPipe implements PipeTransform {
  transform(array: any[], field: string, reverse = false): any[] {
    if (!Array.isArray(array)) return array;
    
    const sorted = array.sort((a, b) => {
      const valA = a[field];
      const valB = b[field];
      
      if (typeof valA === 'string' && typeof valB === 'string') {
        return valA.localeCompare(valB);
      }
      
      return valA - valB;
    });
    
    return reverse ? sorted.reverse() : sorted;
  }
}