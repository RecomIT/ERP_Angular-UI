import { Injectable } from "@angular/core";
import { AreasHttpService } from "src/app/areas/areas.http.service";
import { ApiArea } from "src/app/shared/constants";

@Injectable({
    providedIn:'root'
})

export class HolidaySetupService {
    constructor(private areasHttpService: AreasHttpService) {
    }

    // public holiday
    getPublicHolidays(params: any) {
       return this.areasHttpService.observable_get<any>((ApiArea.hrms + "/Attendance/PublicHoliday" + "/GetPublicHolidays"), {
            responseType: "json",observe: 'response', params: params
          })
    }

    savePublicHoliday(params: any){
        return this.areasHttpService.observable_post<any>((ApiArea.hrms + "/Attendance/PublicHoliday" + "/SavePublicHoliday"), params, {
            responseType: "json"
        });
    }

     // yearly holiday 
     getAssignYearlyHoliday(params: any) {
       return this.areasHttpService.observable_get<any>((ApiArea.hrms + "/Attendance/YearlyHoliday" + "/GetAssignYearlyHoliday"), {
            responseType: "json",observe: 'response', params: params
          })
    }

    getYearlyHolidays(params: any) {
        return this.areasHttpService.observable_get<any>((ApiArea.hrms + "/Attendance/YearlyHoliday" + "/GetYearlyHolidays"), {
             responseType: "json",observe: 'response', params: params
           })
     }

    saveYearlyHoliday(params: any){
        return this.areasHttpService.observable_post<any>((ApiArea.hrms + "/Attendance/YearlyHoliday" + "/SaveYearlyHoliday"), params, {
            responseType: "json"
        });
    }

    saveYearlyPublicHoliday(params: any){
        return this.areasHttpService.observable_post<any>((ApiArea.hrms + "/Attendance/YearlyHoliday" + "/SaveYearlyPublicHoliday"), params, {
            responseType: "json"
        });
    }


}

   