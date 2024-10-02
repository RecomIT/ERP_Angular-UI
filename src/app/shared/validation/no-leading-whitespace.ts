import { Directive } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, Validator, ValidatorFn } from '@angular/forms';

export function noLeadingWhitespace(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const value = control.value;
    if (value && typeof value === 'string' && value.trim() !== value) {
      return { leadingWhitespace: true };
    }
    return null;
  };
}

@Directive({
  selector: '[noLeadingWhitespace][ngModel]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: NoLeadingWhitespaceDirective,
      multi: true,
    },
  ],
})
export class NoLeadingWhitespaceDirective implements Validator {
  validate(control: AbstractControl): { [key: string]: any } | null {
    return noLeadingWhitespace()(control);
  }
}
