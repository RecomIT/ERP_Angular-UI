import { Injectable } from "@angular/core";
import { ApiArea } from "src/app/shared/constants";
import { AreasHttpService } from "src/app/areas/areas.http.service";

@Injectable({
    providedIn:'root'
})

export class EmployeeTaxRefundSubmissionService{
    private apiRoot: string=ApiArea.payroll+"/Tax/TaxRefund"
    private apiSelfRoot: string=ApiArea.payroll+"/Tax/TaxSelfService"
    constructor(private areasHttpService: AreasHttpService){
    }

    // get(params: any) {
    //     return this.areasHttpService.observable_get<any>(this.apiRoot + "/GetEmployeeTaxDocuments", {
    //         responseType: 'json', observe: 'response', params: params
    //     })
    // }

    // download(params){
    //     return this.areasHttpService.observable_get<any>((this.apiRoot + "/GetEmployeeTaxDocumentFile"), {
    //         responseType: "blob", params:params
    //       });
    // }

    // getById(params: any){
    //     return this.areasHttpService.observable_get<any>(this.apiRoot + "/GetEmployeeTaxDocumentById", {
    //         responseType: 'json',observe: 'response', params: params
    //     })
    // }

    // save(params : any){
    //     return this.areasHttpService.observable_post<any>(this.apiRoot +"/SaveEmployeeTaxDocument",params,{});
    // }

    // Self Service
    getTaxRefundInfos(params: any){
        return this.areasHttpService.observable_get<any>(this.apiSelfRoot + "/GetTaxRefundInfos", {
            responseType: 'json',observe: 'response', params: params
        })
    }

    getTaxRefundById(params: any){
        return this.areasHttpService.observable_get<any>(this.apiSelfRoot + "/GetTaxRefundById", {
            responseType: 'json',observe: 'response', params: params
        })
    }

    saveBySelf(params : any){
        return this.areasHttpService.observable_post<any>(this.apiSelfRoot +"/SaveTaxRefund",params,{});
    }
}