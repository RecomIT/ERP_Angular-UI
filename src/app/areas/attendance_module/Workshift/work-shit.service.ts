import { Injectable } from "@angular/core";
import { AreasHttpService } from "../../areas.http.service";
import { BehaviorSubject } from "rxjs";
import { ApiArea } from "src/app/shared/constants";

@Injectable({
    providedIn: 'root'
})

export class WorkShiftService {
    constructor(private areasHttpService: AreasHttpService) {
    }
    private Source_of_data = new BehaviorSubject<any[]>([]);
    ddl$ = this.Source_of_data.asObservable();


    get(params: any){
        return this.areasHttpService.observable_get<any>((ApiArea.hrms + "/Attendance/Workshift" + "/GetWorkShiftsAsync"), {
            responseType: "json", observe: 'response', params: params
        });
    }

    save(params: any) {
        return this.areasHttpService.observable_post<any>((ApiArea.hrms + "/Attendance/Workshift" + "/SaveWorkShift"), params, {
            responseType: "json"
        });
    }

    approval(params: any) {
        return this.areasHttpService.observable_post<any>((ApiArea.hrms + "/Attendance/Workshift" + "/SaveWorkShiftChecking"), params, {
            responseType: "json"
        });
    }

    getWorkShiftDropdown() {
        return this.areasHttpService.promise_get<any[]>((ApiArea.hrms + "/Attendance/Workshift" + "/GetWorkShiftDropdown"), {
            responseType: "json"
        });
    }

    loadWorkShiftDropdown() {
        this.getWorkShiftDropdown().then((data) => {
            console.log("data >>>", data);
            this.Source_of_data.next(data);
        })
            .catch((error) => {
                console.error('Error while fetching grades:', error);
            });
    }
}