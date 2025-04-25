import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'nric'
})
export class NricPipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): string {
    value = value.replaceAll('-', '');
    if (value.length < 7) {
      return value;
    } else if (value.length < 9) {
      return value.substring(0, 6) + '-' + value.substring(6, 8);
    } else {
      return value.substring(0, 6) + '-' + value.substring(6, 8) + '-' + value.substring(8, 12);
    }

  }

}
