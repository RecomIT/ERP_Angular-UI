import { AbstractControl, AsyncValidatorFn, ValidationErrors } from "@angular/forms";
import { Observable } from "rxjs";
import { debounceTime, first, map, switchMap } from "rxjs/operators";
import { EmployeeInfoService } from "../employee/employee-info.service";


export function officeEmailValidator(validatorService: EmployeeInfoService): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
        return control.valueChanges.pipe(
            debounceTime(300),
            switchMap(value =>
                validatorService.IsOfficeEmailAvailable(value)
            ),
            map(isAvailable =>
                (!isAvailable ? null : { taken: true })),
            first()
        );
    };
}

export function officeEmailInEditValidator(id: any, validatorService: EmployeeInfoService): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
        return control.valueChanges.pipe(
            debounceTime(300),
            switchMap(value =>
                validatorService.IsOfficeEmailInEditAvailable(id,value)
            ),
            map(isAvailable =>
                (!isAvailable ? null : { taken: true })),
            first()
        );
    };
}

