import { Injectable } from "@angular/core";
import { ApiArea } from "src/app/shared/constants";
import { AreasHttpService } from "src/app/areas/areas.http.service";

@Injectable({
    providedIn: 'root'
})

export class TaxCardService {
    private selfService_apiRoot = ApiArea.payroll + "/Tax/TaxSelfService";
    constructor(private areasHttpService: AreasHttpService) {
    }

    showTaxCardInfo(params: any) {
        return this.areasHttpService.observable_get<any>((this.selfService_apiRoot + "/ShowTaxCardInfo"), {
            responseType: 'json',
            params: params,
            observe:"response"
        })
    }


    downloadTaxCard(params: any) {
        return this.areasHttpService.observable_get((this.selfService_apiRoot + "/DownloadTaxCard"), {
            responseType: 'blob',
            params: params
        })
    }



}