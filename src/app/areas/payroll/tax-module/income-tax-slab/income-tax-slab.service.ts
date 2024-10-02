import { Injectable } from "@angular/core";
import { AreasHttpService } from "src/app/areas/areas.http.service";
import { ApiArea } from "src/app/shared/constants";

@Injectable({
    providedIn:'root'
})
export class IncomeTaxSlabService {
    private apiRoot: string = ApiArea.payroll + "/Tax/IncomeTaxSlab"
    constructor(private areasHttpService: AreasHttpService) {
    }

    get(params: any) {
        return this.areasHttpService.observable_get<any>(this.apiRoot + "/GetIncomeTaxSlabsAsync", {
            responseType: 'json', observe: 'response', params: params
        })
    }

    save(params : any){
        return this.areasHttpService.observable_post<any>(this.apiRoot +"/SaveIncomeTaxSlab",params,{});
    }

    getIncomeTaxSlabsData(params : any){
        return this.areasHttpService.observable_get<any>(this.apiRoot + "/GetIncomeTaxSlabsData", {
            responseType: 'json', observe: 'response', params: params
        })
    }

    update(params: any){
        return this.areasHttpService.observable_post<any>(this.apiRoot +"/UpdateIncomeTaxSlab",params,{});
    }
}