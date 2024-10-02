import { Injectable } from "@angular/core";
import { ApiArea } from "src/app/shared/constants";
import { AreasHttpService } from "src/app/areas/areas.http.service";

@Injectable({
    providedIn: 'root'
})

export class SelfManualAttendanceService {
    constructor(private areasHttpService: AreasHttpService) { }

    get(params: any) {
        return this.areasHttpService.observable_get<any>((ApiArea.hrms + "/Attendance/ManualAttendance" + "/GetEmployeeManualAttendances"), {
            responseType: "json", observe: 'response', params: params
        })
    }

    getById(params: any) {
        return this.areasHttpService.observable_get<any>((ApiArea.hrms + "/Attendance/ManualAttendance" + "/GetEmployeeManualAttendances"), {
            responseType: "json", observe: 'response', params: params
        })
    }

    save(params: any) {
        return this.areasHttpService.observable_post<any>((ApiArea.hrms + "/Attendance/ManualAttendance" + "/SaveManualAttendance"), params, {
            responseType: "json"
        });
    }

    delete(params: any) {
        return this.areasHttpService.observable_post<any>((ApiArea.hrms + "/Attendance/ManualAttendance" + "/DeleteManualAttendance"), params, {
            responseType: "json"
        });
    }
}