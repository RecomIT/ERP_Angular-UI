import { Directive } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl, ValidationErrors } from '@angular/forms';
@Directive({
  selector: '[appCustomEmailValidator]',
  providers: [{ provide: NG_VALIDATORS, useExisting: CustomEmailValidatorDirective, multi: true }]
})
export class CustomEmailValidatorDirective implements Validator {
  validate(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null;
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(control.value)) {
      return { 'invalidEmail': true };
    }
    return null;
  }
}