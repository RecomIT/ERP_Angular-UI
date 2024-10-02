import { Injectable } from "@angular/core";
import { AreasHttpService } from "src/app/areas/areas.http.service";
import { ApiArea } from "src/app/shared/constants";

@Injectable({
    providedIn:'root'
})

export class SalaryProcessService{
    private apiRoot: string = ApiArea.payroll + "/Salary/SalaryProcess";
    constructor(private areasHttpService: AreasHttpService) { }

    salaryProcess(params: any){
        return this.areasHttpService.observable_post<any>((this.apiRoot + "/SalaryProcess"), params, {
            responseType: "json"
        });
    }

    executesalaryProcess(params: any){
        return this.areasHttpService.observable_post<any>((this.apiRoot + "/ExecuteSalaryProcess"), params, {
            responseType: "json"
        });
    }

    getSalaryProcessInfos(params: any){
        return this.areasHttpService.observable_get<any>((this.apiRoot + "/GetSalaryProcessInfos"), {
            responseType: "json", observe: 'response', params: params
        });
    }

    getSalaryProcessDetails(params: any){
        return this.areasHttpService.observable_get<any>((this.apiRoot + "/GetSalaryProcessDetails"), {
            responseType: "json", observe: 'response', params: params
        });
    }

    getEmployeeSalaryAllowanceById(params: any){
        return this.areasHttpService.observable_get<any>((this.apiRoot + "/GetEmployeeSalaryAllowanceById"), {
            responseType: "json", observe: 'response', params: params
        });
    }

    getEmployeeSalaryDeductionById(params: any){
        return this.areasHttpService.observable_get<any>((this.apiRoot + "/getEmployeeSalaryDeductionById"), {
            responseType: "json", observe: 'response', params: params
        });
    }

    salaryProcessDisbursedOrUndo(params: any){
        return this.areasHttpService.observable_post<any>((this.apiRoot + "/SalaryProcessDisbursedOrUndo"), params, {
            responseType: "json"
        });
    }

    getSalaryProcessBatchNoDropdown(params: any){
        return this.areasHttpService.promise_get<any[]>((this.apiRoot + "/GetSalaryProcessBatchNoDropdown"), {
            responseType: "json",params: params
        });
    }

    salaryReprocess(params: any){
        return this.areasHttpService.observable_post<any>((this.apiRoot + "/SalaryReprocess"), params, {
            responseType: "json"
        });
    }

    

}