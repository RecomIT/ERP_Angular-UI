import { BehaviorSubject } from "rxjs";
import { Injectable } from "@angular/core";
import { ApiArea } from "src/app/shared/constants";
import { AreasHttpService } from "../../areas.http.service";
import { NotifyService } from "src/app/shared/services/notify-service/notify.service";

@Injectable({
    providedIn:'root'
})

export class LeaveBalanceService{
    private apiRoot: string =ApiArea.hrms+"/leave/employeeLeaveBalance";
   
    constructor(
        private areasHttpService: AreasHttpService,
        private notifyService: NotifyService
        ) {}

    private Source_of_data = new BehaviorSubject<any[]>([]);
    ddl$ = this.Source_of_data.asObservable();

    private Source_of_data_2 = new BehaviorSubject<any[]>([]);
    ddl$_2 = this.Source_of_data_2.asObservable();


    
    getEmployeeLeaveBalances(params: any) {
        return this.areasHttpService.observable_get<any[]>((this.apiRoot+ "/getEmployeeLeaveBalances"), {
            responseType: "json", params: params
        });
    }

    getLeaveBalanceAsync(employeeId: number){
        return this.areasHttpService.observable_get<any[]>((this.apiRoot+ "/GetLeaveBalance"), {
            responseType: "json", params: {employeeId: employeeId}
        });
    }

    getEmployeeLeaveBalancesDropdown(params: any) {
        return this.areasHttpService.promise_get<any[]>(( this.apiRoot+ "/GetEmployeeLeaveBalancesDropdown"), {
            responseType: "json", params: params
        });
    }

    loadEmployeeLeaveBalanceDropdown(params: any){
        this.getEmployeeLeaveBalancesDropdown(params).then((data) => {
        this.Source_of_data.next(data);
        })
        .catch((error) => {
        // console.error('Error while fetching grades:', error);
        this.notifyService.handleApiError(error);
        });
    }

    getEmployeeLeaveBalancesDropdownInEdit(params: any) {
        return this.areasHttpService.promise_get<any[]>(( this.apiRoot+ "/GetEmployeeLeaveBalancesDropdownInEdit"), {
            responseType: "json", params: params
        });
    }

    loadEmployeeLeaveBalanceDropdownInEdit(params: any){
        this.getEmployeeLeaveBalancesDropdownInEdit(params).then((data) => {
            // console.log("loadEmployeeLeaveBalanceDropdownInEdit >>",data);
        this.Source_of_data_2.next(data);
        })
        .catch((error) => {
        // console.error('Error while fetching grades:', error);
        this.notifyService.handleApiError(error);
        });
    }
}