import { Injectable } from "@angular/core";
import { UtilityService } from "src/app/shared/services/utility.service";
import { ApiArea } from "src/app/shared/constants";
import { AreasHttpService } from "src/app/areas/areas.http.service";


@Injectable({
    providedIn: 'root'
})

export class EmployeeYearlyInvestmentService{
    constructor(private utilityService: UtilityService, 
        private areasHttpService: AreasHttpService){
    }

    getEmployeeYearlyInvestments(params: any) {
        return this.areasHttpService.observable_get<any>((ApiArea.payroll + "/Tax/InvestmentSubmission" + "/GetEmployeeYearlyInvestments"), {
             responseType: "json", observe: 'response',  params: params
         });       
    }

     saveEmployeeYearlyInvestment(params: any) {
        return this.areasHttpService.observable_post<any>((ApiArea.payroll + "/Tax/InvestmentSubmission" + "/SaveEmployeeYearlyInvestment"),params, {
             responseType: "json",observe: 'response'
         });
    }

     deleteEmployeeYearlyInvestment(params: any) {
        return this.areasHttpService.observable_post<any>((ApiArea.payroll + "/Tax/InvestmentSubmission" + "/DeleteEmployeeYearlyInvestment"),params, {
             responseType: "json",observe: 'response'
         });
    }

     getCurrentFiscalYear<T>(): Promise<T> {
        return this.areasHttpService.promise_get<T>((ApiArea.payroll + "/Salary/FiscalYear" + "/GetCurrentFiscalYear"), {
            responseType: "json"
        });
    }

    getEmployeeYearlyInvestmentByIdAsync(params: any){
        return this.areasHttpService.observable_get<any>(ApiArea.payroll + "/Tax/InvestmentSubmission"+ "/GetEmployeeYearlyInvestmentById",{
            responseType: "json", params: params
        });
    }

    
    downloadEmployeeYearlyInvestmentExcelFile(params: any){
        return this.areasHttpService.observable_get<any>(ApiArea.payroll + "/Tax/InvestmentSubmission" + "/DownloadEmployeeYearlyInvestmentExcelFile",{
            responseType: "blob", params: params
        });
    }

    uploadEmployeeYearlyInvestmentExcel(formData: any){
        return this.areasHttpService.observable_post<any>(ApiArea.payroll+ "/Tax/InvestmentSubmission" +"/UploadEmployeeYearlyInvestmentExcel", formData,{});
    }

}