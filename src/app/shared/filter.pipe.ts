import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {
  transform(items: any[], searchText: string): any[] {
    if(!items) return [];
    if(!searchText) return items;
    searchText = searchText.trim();
    searchText = searchText.toLowerCase();
    return items.filter( it => {
      // Receives Array<Object> with a defined searchField
      return it.searchField.toLowerCase().includes(searchText);
    });
   }
}