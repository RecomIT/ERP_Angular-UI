import { Injectable } from "@angular/core";
import { AreasHttpService } from "src/app/areas/areas.http.service";
import { ApiArea } from "src/app/shared/constants";

@Injectable({
    providedIn: 'root'
})


export class IncomeTaxReportService {
    private apiRoot: string = ApiArea.payroll + "/Tax/TaxReport";
    constructor(private areasHttpService: AreasHttpService) { }

    getTaxcardInformation(params: any) {
        return this.areasHttpService.observable_get<any>((this.apiRoot + "/GetTaxcardInformation"), {
            responseType: "json", observe: 'response', params: params
        });
    }

    downloadTaxCard(params: any) {
        return this.areasHttpService.observable_get<any>((this.apiRoot + "/TaxCardReport"), {
            responseType: 'blob',
            params: params
        })
    }

    downloadTaxSheetDetailsExcel(params: any) {
        return this.areasHttpService.observable_get<any>((this.apiRoot + "/DownloadTaxSheetDetails"), {
            responseType: 'blob',
            params: params
        })
    }
    downloadTaxDeductionExcel(params: any) {
        return this.areasHttpService.observable_get<any>((this.apiRoot + "/DownloadTaxDeductionExcel"), {
            responseType: 'blob',
            params: params
        })
    }

 
    uploadActualTaxDeductionExcel(data: any){
        return this.areasHttpService.observable_post<any>(this.apiRoot + "/UploadActualTaxDeductionExcel",data,{});
    }

    updateActaulTaxDeductionInSalaryAndTax(data: any){
        return this.areasHttpService.observable_post<any>(this.apiRoot + "/UpdateActaulTaxDeductionInSalaryAndTax",data,{});
    }

    // updateActaulTaxDeductionInSalaryAndTax(params: any){
    //     return this.areasHttpService.observable_post<any>((this.apiRoot + "/UpdateActaulTaxDeductionInSalaryAndTax"), params, {
    //         responseType: "json"
    //     });
    // }

    bulkTaxCardDownload(params: any){
        return this.areasHttpService.observable_get<any>((this.apiRoot + "/BulkTaxCardDownload"), {
            responseType: 'blob',
            params: params
        })
    }

}