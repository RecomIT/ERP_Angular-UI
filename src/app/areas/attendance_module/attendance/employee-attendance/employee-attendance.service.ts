import { Injectable } from "@angular/core";
import { AreasHttpService } from "src/app/areas/areas.http.service";
import { ApiArea } from "src/app/shared/constants";

@Injectable({
    'providedIn': 'root'
})

export class EmployeeAttendanceService {
    constructor(private areasHttpService: AreasHttpService) { }
    get(params: any) {
        return this.areasHttpService.observable_get<any>((ApiArea.hrms + "/Attendance/EmployeeAttendance" + "/GetEmployeesAttendanceSummery"), {
            responseType: "json", observe: 'response', params: params
        })
    }
    getById(params: any) {
        return this.areasHttpService.observable_get<any>((ApiArea.hrms + "/Attendance/EmployeeAttendance" + "/GetEmployeesDailyAttendance"), {
            responseType: "json", observe: 'response', params: params
        })
    }

    employeeReport(params: any) {
        return this.areasHttpService.observable_get<any>((ApiArea.hrms + "/Attendance/Report" + "/EmployeeAttendanceReport"), {
            responseType: 'blob',
            params: params
        })
    }

    dateRangeReport(params: any) {
        return this.areasHttpService.observable_get<any>((ApiArea.hrms + "/Attendance/Report" + "/DailyAttendanceReport"), {
            responseType: 'blob',
            params: params
        })
    }
}