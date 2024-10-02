import { Injectable } from "@angular/core";
import { ApiArea } from "src/app/shared/constants";
import { AreasHttpService } from "src/app/areas/areas.http.service";

@Injectable({
    providedIn: 'root'
})

export class EmployeePayslipService {
    private apiRoot = ApiArea.payroll + "/Salary/SalarySelfService";
    constructor(private areasHttpService: AreasHttpService) {
    }

    showPayslip(params: any) {
      return  this.areasHttpService.observable_get((this.apiRoot + "/ShowPayslip"), {
            responseType: 'json',
            params: params
        })
    }

    downloadPayslip(params: any) {
        return  this.areasHttpService.observable_get((this.apiRoot + "/DownloadPayslip"), {
            responseType: 'blob',
            params: params
        })
    }

    downloadPayslipByDateRange(params: any){
        return this.areasHttpService.observable_get((this.apiRoot + "/DownloadPayslipByDateRange"), {
            responseType: 'blob',
            params: params
        })
    }

    downloadSalarySheetByDateRange(params: any){
        return this.areasHttpService.observable_get((this.apiRoot + "/DownloadSalarySheet"), {
            responseType: 'blob',
            params: params
        })
    }

}