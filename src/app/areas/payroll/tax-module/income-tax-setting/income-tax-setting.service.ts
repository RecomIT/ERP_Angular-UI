import { Injectable } from "@angular/core";
import { AreasHttpService } from "src/app/areas/areas.http.service";
import { ApiArea } from "src/app/shared/constants";

@Injectable({
    providedIn: 'root'
})
export class IncomeTaxSettingService {
    private apiRoot: string = ApiArea.payroll + "/Tax/TaxSetting"
    constructor(private areasHttpService: AreasHttpService) {
    }

    get(params: any) {
        return this.areasHttpService.observable_get<any>((this.apiRoot + "/GetTaxSettings"), {
            responseType: "json", observe: 'response', params: params
        });
    }

    save(params: any) {
        return this.areasHttpService.observable_post<any>((this.apiRoot + "/SaveTaxSetting"), params, {
            responseType: "json"
        });
    }

    getById(params: any) {
        return this.areasHttpService.observable_get<any>((this.apiRoot + "/GetTaxSettingById"), {
            responseType: "json", observe: 'response', params: params
        });
    }
}