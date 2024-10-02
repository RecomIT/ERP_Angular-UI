import { Injectable } from "@angular/core";
import { AreasHttpService } from "../../../areas.http.service";
import { ApiArea } from "src/app/shared/constants";

@Injectable({
    providedIn: 'root'
})

export class IncomeTaxProcessService {
    private apiRoot: string=ApiArea.payroll+"/Tax"+"/TaxProcess"
    constructor(private areasHttpService: AreasHttpService) {}

    getIncomeTaxProcessInfo(params:any) {
        return this.areasHttpService.observable_get<any>((this.apiRoot + "/GetTaxProcessSummeryInfos"), {
            responseType: "json", observe: 'response', params: params
        });
    }

    getIncomeTaxProcessDetail(params: any) {
        return this.areasHttpService.observable_get<any>((this.apiRoot + "/GetEmployeeTaxProcessDetailInfos"), {
            responseType: "json", observe: 'response', params: params
        });
    }

    viewDetails() {

    }

    deleteIncomeTaxInfo(params: any) {
        return this.areasHttpService.observable_post<any>((this.apiRoot + "/DeleteTaxInfo"), params, {
            responseType: "json"
        });
    }

    taxProcess(params: any){
        return this.areasHttpService.observable_post<any>((this.apiRoot + "/Process"), params, {
            responseType: "json"
        });
    }

    reprocessIncomeTax() {

    }

    uploadActualTaxDeductedAmount() {

    }

    downloadIncomeTaxChallanFormat(){
        return this.areasHttpService.observable_get<any>((this.apiRoot + "/DownloadIncomeTaxChallanFormat"), {
            responseType: 'blob'
        })
    }
  
    uploadChallan(params: any){
        return this.areasHttpService.observable_post<any>((this.apiRoot + "/UploadIncomeTaxChallan"), params, {
        });
    }

    downloadTaxCard(params: any) {
        return this.areasHttpService.observable_get((ApiArea.payroll + "/Tax/TaxReport" + "/TaxCardReport"), {
            responseType: 'blob',
            params: params
        })
    }

    executeProcess(params: any){
        return this.areasHttpService.observable_post<any>((this.apiRoot + "/ExecuteTaxProcess"), params, {
            responseType: "json"
        });
    }
}