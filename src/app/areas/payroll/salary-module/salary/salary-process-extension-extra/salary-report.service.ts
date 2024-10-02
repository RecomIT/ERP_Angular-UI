import { Injectable } from "@angular/core";
import { AreasHttpService } from "src/app/areas/areas.http.service";
import { ApiArea } from "src/app/shared/constants";

@Injectable({
    providedIn:'root'
})

export class SalaryReportService{
    private apiRoot: string = ApiArea.payroll + "/Salary/SalaryReport";
    constructor(private areasHttpService: AreasHttpService) { }

    downloadActualSalarySheet(params:any) {
        return this.areasHttpService.observable_get<any>((this.apiRoot + "/DownloadActualSalarySheet"), {
           responseType: "blob", params:params
         });
    }

    getSalarySheet(params: any){
        return this.areasHttpService.observable_get<any>((this.apiRoot + "/GetSalarySheet"), {
            responseType: "json", observe: 'response', params: params
        });
    }

    downloadSalarySheet(params: any){
        return this.areasHttpService.observable_get<any>((this.apiRoot + "/DownloadSalarySheet"), {
            responseType: "blob", params:params
          });
    }

    payslipExtension(params: any){
        return this.areasHttpService.observable_get<any>((this.apiRoot + "/PayslipExtension"), {
            responseType: "json", observe: 'response', params: params
        });
    }

    downloadPayslip(params: any){
        return this.areasHttpService.observable_get<any>((this.apiRoot + "/DownloadPayslip"), {
            responseType: "blob", observe: 'response', params: params
        });
    }

    downloadBankStatement(params:any) {
        return this.areasHttpService.observable_get<any>((this.apiRoot + "/DownloadBankStatement"), {
           responseType: "blob", params:params
         });
    }

   
}