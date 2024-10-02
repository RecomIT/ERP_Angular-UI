import { Injectable } from "@angular/core";
import { AreasHttpService } from "../../areas.http.service";
import { ApiArea } from "src/app/shared/constants";
import { BehaviorSubject } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class LeaveReportService {
    private apiRoot: string=ApiArea.hrms +"/Leave/LeaveReport";
    constructor(private areasHttpService: AreasHttpService) { }

    private Source_of_data = new BehaviorSubject<any[]>([]);
    ddl$ = this.Source_of_data.asObservable();

    generateEmployeeLeaveCard(params: any) {
        return this.areasHttpService.observable_get<any>((this.apiRoot+ "/EmployeeLeaveCard"), {
            responseType: 'blob',
            params: params
        })
    }


    generateMonthlyLeaveReport(params: any) {
        return this.areasHttpService.observable_get<any>((this.apiRoot + "/MonthlyLeaveReport"), {
            responseType: 'blob',
            params: params
        })
    }

    generateYearlyLeaveReport(params: any) {
        return this.areasHttpService.observable_get<any>((this.apiRoot + "/YearlyLeaveReport"), {
            responseType: 'blob',
            params: params
        })
    }

    generateEmployeeWiseLeaveBalanceSummaryReport(params: any) {
        return this.areasHttpService.observable_get<any>((this.apiRoot + "/EmployeeWiseLeaveBalanceSummary"), {
            responseType: 'blob',
            params: params
        })
    }

    generateDateRangeWiseLeaveReport(params: any) {
        return this.areasHttpService.observable_get<any>((this.apiRoot + "/DateRangeWiseLeaveReport"), {
            responseType: 'blob',
            params: params
        })
    }

    generateIndividualYearlyStatusReport(params: any) {
        return this.areasHttpService.observable_get<any>((this.apiRoot + "/IndividualYearlyStatus"), {
            responseType: 'blob',
            params: params
        })
    }

    getLeaveYearDropdown() {
        return this.areasHttpService.promise_get<any[]>((this.apiRoot + "/GetLeaveYearDropdown"), {
             responseType: "json"
         });
     }
 
     loadLeaveYearDropdown(){
         this.getLeaveYearDropdown().then((data) => {
         this.Source_of_data.next(data);
         })
         .catch((error) => {
         console.error('Error while fetching grades:', error);
         });
     }

}