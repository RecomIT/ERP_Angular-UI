import { Injectable } from "@angular/core";
import { AreasHttpService } from "src/app/areas/areas.http.service";
import { ApiArea } from "src/app/shared/constants";

@Injectable({
    'providedIn':'root'
})

export class EmployeeTaxRefundService {
    private apiRoot: string = ApiArea.payroll + "/Tax/TaxRefund"
    constructor(private areasHttpService: AreasHttpService) {
    }

    save(params: any) {
        return this.areasHttpService.observable_post<any>(this.apiRoot + "/Save", params, {});
    }

    get(params: any) {
        return this.areasHttpService.observable_get<any>(this.apiRoot + "/GetAll", {
            responseType: 'json', observe: 'response', params: params
        })
    }

    getById(params: any) {
        return this.areasHttpService.observable_get<any>(this.apiRoot + "/GetById", {
            responseType: 'json', observe: 'response', params: params
        })
    }

    uploadRefund(params: any) {
        return this.areasHttpService.observable_post<any>(this.apiRoot + "/UploadRefund", params, {});
    }

    delete(id: any){
        return this.areasHttpService.observable_post<any>(this.apiRoot + "/DeleteRefund?id=" + id, null, {});
    }
}