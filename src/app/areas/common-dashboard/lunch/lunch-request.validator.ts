import { AbstractControl, AsyncValidatorFn, ValidationErrors } from "@angular/forms";
import { LunchService } from "./lunch-request-service";
import { Observable } from "rxjs";
import { debounceTime, first, map, switchMap } from "rxjs/operators";


export function requestExist(validatorService: LunchService): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
        return control.valueChanges.pipe(
            debounceTime(300),
            switchMap(value =>
                validatorService.requestExist(value)
            ),
            map(isExist =>
                (!isExist ? null : { exist: true })),
            first()
        );
    };
}

