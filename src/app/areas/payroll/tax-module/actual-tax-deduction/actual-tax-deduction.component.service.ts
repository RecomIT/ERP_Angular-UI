import { Injectable } from "@angular/core";
import { AreasHttpService } from "../../../areas.http.service";
import { ApiArea } from "src/app/shared/constants";

@Injectable({
    providedIn:'root'
})


export class ActualTaxDeductionService{
    private apiRoot: string=ApiArea.payroll+"/Tax/ActualTaxDeduction"
    constructor(private areasHttpService: AreasHttpService){
    }

    getActualTaxDeductionInfos(params: any) {
        return this.areasHttpService.observable_get<any[]>(this.apiRoot + "/GetActualTaxDeductionInfos", {
            responseType: 'json', params: params
        })
    }

    getActualTaxDeductionById(params: any) {
        return this.areasHttpService.observable_get<any>(this.apiRoot + "/GetActualTaxDeductionById", {
            responseType: 'json', params: params
        })
    }

    uploadActualDeductedTax(data){
        return this.areasHttpService.observable_post<any>(this.apiRoot +"/SaveUploadActualTaxDeductionAmount",data,{});
    }

    saveActualTaxDeduction(data){
        return this.areasHttpService.observable_post<any>(this.apiRoot +"/SaveActualTaxDeduction",data,{});
    }

    saveActualTaxApproval(data){
        return this.areasHttpService.observable_post<any>(this.apiRoot +"/saveActualTaxApproval",data,{});
    }
}