import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'nric'
})
export class NricPipe implements PipeTransform {

  transform(value: string): string {
    const numberRegex = new RegExp(/[^0-9]/g);
    value = value.replaceAll('-', '');
    value = value.replaceAll(numberRegex, '');
    if (value.length < 7) {
      return value;
    } else if (value.length < 9) {
      const newValue = value.substring(0, 6) + '-' + value.substring(6, 8);
      return newValue;
    } else {
      const newValue = value.substring(0, 6) + '-' + value.substring(6, 8) + '-' + value.substring(8, 12);
      return newValue;
    }
  }

}
