import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";
import { Regex } from "../enums/regex.enum";
import { DatePipe } from "@angular/common";

export function nricValidator(): ValidatorFn {
  return (control: AbstractControl<string>): ValidationErrors | null => {
    const value = control.value;
    const nricRegex = new RegExp(Regex.Nric);
    const datePipe = new DatePipe('en-US');
    
    if (!value)
      return null;

    const isNricRegex: boolean = nricRegex.test(value);

    if (value.length > 6 && typeof value === 'string') {
      const dateString = `${value.substring(0, 2)}-${value.substring(2, 4)}-${value.substring(4, 6)}`;
      try {
        const date = new Date();
        date.setMonth(parseInt(value.substring(2, 4)) - 1, parseInt(value.substring(4, 6)));
        date.setFullYear(parseInt('20' + value.substring(0, 2)));
        const formattedDate: string | null = datePipe.transform(date, 'yy-MM-dd');
        const isValidDate: boolean = formattedDate === dateString;
        
        const isValidNric = isNricRegex && isValidDate;
        return !isValidNric ? {invalidNric: true} : null;
      } catch (error) {
        return {invalidNric: true};
      }
    } else {
      return {invalidNric: true};
    }
  };
}