import { AbstractControl, AsyncValidatorFn, ValidationErrors } from "@angular/forms";
import { EmployeeInfoService } from "../employee/employee-info.service";
import { Observable } from "rxjs";
import { debounceTime, first, map, switchMap } from "rxjs/operators";


export function employeeCodeValidator(validatorService: EmployeeInfoService): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
        return control.valueChanges.pipe(
            debounceTime(300),
            switchMap(value =>
                validatorService.IsEmployeeCodeAvailable(value)
            ),
            map(isAvailable =>
                (!isAvailable ? null : { taken: true })),
            first()
        );
    };
}

export function employeeCodeInEditValidator(id: any, validatorService: EmployeeInfoService): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
        return control.valueChanges.pipe(
            debounceTime(300),
            switchMap(value =>
                validatorService.IsEmployeeCodeAvailableInEdit(id, value)
            ),
            map(isAvailable =>
                (!isAvailable ? null : { taken: true })),
            first()
        );
    };
}