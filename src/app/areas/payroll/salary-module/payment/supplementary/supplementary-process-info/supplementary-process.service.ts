import { Injectable } from "@angular/core";
import { ApiArea } from "src/app/shared/constants";
import { AreasHttpService } from "src/app/areas/areas.http.service";

@Injectable({
    providedIn: 'root'
})

export class SupplementaryProcessService {
    private apiRoot = ApiArea.payroll + "/Salary/SupplementaryPayment";
    constructor(
        private areasHttpService: AreasHttpService) {
    }

    executeProcessAsync(data: any) {
        return this.areasHttpService.observable_post<any>(this.apiRoot + "/SaveSupplementaryProcess", data, {});
    }

    getSupplementaryProcessInfosAsync(params: any) {
        return this.areasHttpService.observable_get<any>(this.apiRoot + "/GetSupplementaryPaymentProcessInfos", {
            responseType: "json", observe: 'response', params: params
        });
    }

    getSupplementaryAmountsForProces(params: any) {
        return this.areasHttpService.observable_get<any>(this.apiRoot + "/GetSupplementaryPaymentAmountsForProcess", {
            responseType: "json", observe: 'response', params: params
        });
    }

    downloadExcelFile(params: any){           
        return this.areasHttpService.observable_get<any>(ApiArea.payroll + "/Salary/SupplementaryPayment" + "/DownloadExcelSupplementaryPaymentAmount",{
            responseType: "blob", params: params
        });
    }

    downloadSupplementaryTaxSheetDetailsExcel(params: any) {
        return this.areasHttpService.observable_get<any>((this.apiRoot + "/DownloadSupplementaryTaxSheetDetails"), {
            responseType: 'blob',
            params: params
        })
    }

    downloadSupplementaryPaymentSheet(params: any) {
        return this.areasHttpService.observable_get<any>((this.apiRoot + "/DownloadSupplementaryPaymentReport"), {
            responseType: 'blob',
            params: params
        })
    }

    process(params: any) {
        return this.areasHttpService.observable_post<any>((this.apiRoot + "/SupplementaryPaymentProcess"), params, {
            responseType: "json"
        });
    }

    undisbursedPayments(id: number){
        return this.areasHttpService.observable_get<any>(this.apiRoot + "/UndisbursedSupplementaryPaymentInfo/"+id, {
            responseType: "json", observe: 'response'
        });
    }

    disbursedOrUndo(params: any){
        return this.areasHttpService.observable_post<any>((this.apiRoot + "/DisbursedOrUndoPayment"), params, {
            responseType: "json"
        });
    }

    getInfoAndDetails(params: any){
        return this.areasHttpService.observable_post<any>((this.apiRoot + "/GetSupplementaryPaymentInfoAndDetails"), params, {
            responseType: "json"
        });
    }

    deletePayment(params: any){
        return this.areasHttpService.observable_post<any>((this.apiRoot + "/DeleteSupplementaryAmount"), params, {
            responseType: "json"
        });
    }

    downloadPayslip(params: any){
        return this.areasHttpService.observable_get<any>((ApiArea.payroll + "/Salary/SupplementaryPaymentReport" + "/DownloadPayslip"), {
            responseType: 'blob' as 'json', params: params
        });
    }

    downloadTaxCard(params: any){
        return this.areasHttpService.observable_get<any>((ApiArea.payroll + "/Tax/TaxReport" + "/DownloadSupplementaryTaxCard"), {
            responseType: 'blob' as 'json', params: params
        });
    }

    updatePaymentAmount(params: any){
        return this.areasHttpService.observable_post<any>((this.apiRoot + "/UpdatePaymentAmount"), params, {
            responseType: "json"
        });
    }

    uploadDeductedTaxAmount(params: any){
        return this.areasHttpService.observable_post<any>((this.apiRoot + "/UploadDeductedTaxAmount"), params, {
            responseType: "json"
        });
    }

    emailing(params: any){
        return this.areasHttpService.observable_get<any>(ApiArea.payroll + "/Salary/SupplementaryPaymentReport/Emailing", {
            responseType: "json", params: params
        });
    }
}