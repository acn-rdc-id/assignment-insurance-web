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

  validateNric(nric: string, gender: string, dob: string): boolean {
    const digits: string = nric.replace(/\D/g, '');
    if (digits.length !== 12) return false;

    const nricDob = digits.slice(0, 6);
    const isMale = gender.toLowerCase() === 'male';
    const lastDigit = parseInt(digits.slice(-1), 10);

    if (isNaN(lastDigit)) return false;
    const genderMatches = isMale ? lastDigit % 2 === 1 : lastDigit % 2 === 0;

    const parsedDob = this.formatDobToNric(dob);
    const dobMatches = parsedDob === nricDob;

    return genderMatches && dobMatches;
  }

  private formatDobToNric(dob: string): string {
    const [d, m, y] = dob.includes('/') ? dob.split('/') : dob.split('-').reverse();
    return y.slice(-2) + m.padStart(2, '0') + d.padStart(2, '0');
  }
}
