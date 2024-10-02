import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { AreasHttpService } from "src/app/areas/areas.http.service";
import { ApiArea } from "src/app/shared/constants";

@Injectable({
    providedIn:'root'
})

export class EmployeeRousterService{
    constructor(private areasHttpService: AreasHttpService) {
    }
    private Source_of_data = new BehaviorSubject<any[]>([]);
    ddl$ = this.Source_of_data.asObservable();

    get(params: any){
        return this.areasHttpService.observable_get<any>((ApiArea.hrms + "/Attendance/EmployeeShift" + "/GetEmployeeWorkShifts"), {
            responseType: "json", observe: 'response', params: params
        });
    }

    save(params: any){
        return this.areasHttpService.observable_post<any>((ApiArea.hrms + "/Attendance/EmployeeShift" + "/SaveEmployeesWorkShift"), params, {
            responseType: "json"
        });
    }

    approval(params: any){
        return this.areasHttpService.observable_post<any>((ApiArea.hrms + "/Attendance/EmployeeShift" + "/SaveEmployeesWorkShiftChecking"), params, {
            responseType: "json"
        });
    }
}