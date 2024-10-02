import { Injectable } from "@angular/core";
import { AreasHttpService } from "src/app/areas/areas.http.service";
import { ApiArea } from "src/app/shared/constants";

@Injectable({
    providedIn:'root'
})

export class AttendanceProcessService{
    constructor(private areasHttpService: AreasHttpService){}

    process(params: any){
        return this.areasHttpService.observable_post<any>((ApiArea.hrms + "/Attendance/AttendanceProcess" + "/Process"), params, {
            responseType: "json"
        });
    }

    get(params: any){
       return this.areasHttpService.observable_get<any>((ApiArea.hrms + "/Attendance/AttendanceProcess" + "/GetAttendanceProcessInfos"), {
            responseType: "json", observe: 'response', params: params
          })
    }

    lock(params: any){
        return this.areasHttpService.observable_post<any>((ApiArea.hrms + "/Attendance/AttendanceProcess" + "/LockAttendanceProcess"), params, {
            responseType: "json"
        });
    }

    unlock(params: any){
        return this.areasHttpService.observable_post<any>((ApiArea.hrms + "/Attendance/AttendanceProcess" + "/UnLockAttendanceProcess"), params, {
            responseType: "json"
        });
    }

    upload(params: any){
        return this.areasHttpService.observable_post<any>((ApiArea.hrms + "/Attendance/AttendanceProcess" + "/UploadRowAttendanceData"), params,{});
    }
    
}