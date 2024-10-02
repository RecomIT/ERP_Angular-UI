import { Injectable } from "@angular/core";
import { UtilityService } from "src/app/shared/services/utility.service";

import { ApiArea } from "src/app/shared/constants";
import { AreasHttpService } from "src/app/areas/areas.http.service";

@Injectable({
    providedIn: 'root'
})
export class SupplementaryAmountService{
    private apiRoot = ApiArea.payroll + "/Salary/SupplementaryPayment";
    constructor(private areasHttpService: AreasHttpService){
        
    }
    get(params: any){
        return this.areasHttpService.observable_get<any>((this.apiRoot + "/GetSupplementaryPaymentAmountInfos"), {
            responseType: "json",observe: 'response', params: params
        });
    }

    save(params: any){
        return this.areasHttpService.observable_post<any>((this.apiRoot + "/SaveSupplementaryPaymentAmount"), params, {
            responseType: "json"
        });
    }

    bulkSave(params: any){
        return this.areasHttpService.observable_post<any>((this.apiRoot + "/SaveBulkSupplementaryPaymentAmount"), params, {
            responseType: "json"
        });
    }

    getById(params: any){
        return this.areasHttpService.observable_get<any>((this.apiRoot + "/GetSupplementaryAmountById"), {
            responseType: "json",observe: 'response', params: params
        });
    }
}