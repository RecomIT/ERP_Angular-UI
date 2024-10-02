import { Injectable } from "@angular/core";
import { ApiArea } from "src/app/shared/constants";
import { AreasHttpService } from "src/app/areas/areas.http.service";

@Injectable({
    providedIn: 'root'
})

export class EmployeeAdvancedIncomeTaxSubmissionService {
    private apiRoot: string = ApiArea.payroll + "/Tax/TaxAIT"
    private apiSelfRoot: string = ApiArea.payroll + "/Tax/TaxSelfService"
    constructor(private areasHttpService: AreasHttpService) {
    }

    get(params: any) {
        return this.areasHttpService.observable_get<any>(this.apiRoot + "/GetEmployeeAITDocuments", {
            responseType: 'json', observe: 'response', params: params
        })
    }

    download(params) {
        return this.areasHttpService.observable_get<any>((this.apiRoot + "/GetEmployeeTaxDocumentFile"), {
            responseType: "blob", params: params
        });
    }

    getById(params: any) {
        return this.areasHttpService.observable_get<any>(this.apiRoot + "/GetEmployeeAITDocumentById", {
            responseType: 'json', observe: 'response', params: params
        })
    }

    save(params: any) {
        return this.areasHttpService.observable_post<any>(this.apiRoot + "/SaveAIT", params, {});
    }

    uploadAIT(params: any) {
        return this.areasHttpService.observable_post<any>(this.apiRoot + "/UploadAIT", params, {});
    }

    delete(id: any) {
        return this.areasHttpService.observable_post<any>(this.apiRoot + "/DeleteAIT?id=" + id, null, {});
    }

    // Self Service
    getAITInfos(params: any) {
        return this.areasHttpService.observable_get<any>(this.apiSelfRoot + "/GetAITInfos", {
            responseType: 'json', observe: 'response', params: params
        })
    }

    getAITById(params: any) {
        return this.areasHttpService.observable_get<any>(this.apiSelfRoot + "/GetAITById", {
            responseType: 'json', observe: 'response', params: params
        })
    }

    saveBySelf(params: any) {
        return this.areasHttpService.observable_post<any>(this.apiSelfRoot + "/SaveAIT", params, {});
    }
}