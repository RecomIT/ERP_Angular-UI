import { Injectable } from "@angular/core";
import { AreasHttpService } from "src/app/areas/areas.http.service";
import { ApiArea } from "src/app/shared/constants";

@Injectable({
    providedIn: 'root'
})

export class FinalTaxCardService {
    private apiRoot: string = ApiArea.payroll + "/Tax" + "/FinalTaxProcess"
    constructor(private areasHttpService: AreasHttpService) { }

    getEmployee(params: any) {
        return this.areasHttpService.observable_get<any>((this.apiRoot + "/GetEmployees"), {
            responseType: "json", observe: 'response', params: params
        });
    }

    runProcess(params: any) {
        return this.areasHttpService.observable_post<any>((this.apiRoot + "/RunProcess"), params, {
            responseType: "json"
        });
    }

    getFinalTaxProcessSummary(params: any){
        return this.areasHttpService.observable_get<any>((this.apiRoot + "/GetFinalTaxProcessSummary"), {
            responseType: "json", observe: 'response', params: params
        });
    }

    getFinalTaxProcesSummaries(params: any){
        return this.areasHttpService.observable_get<any>((this.apiRoot + "/GetFinalTaxProcesSummaries"), {
            responseType: "json", observe: 'response', params: params
        });
    }

    downloadTaxCard(params: any) {
        return this.areasHttpService.observable_get<any>((ApiArea.payroll + "/Tax" + "/TaxReport" + "/DownloadFinalTaxCard"), {
            responseType: 'blob' as 'json',
            params: params
        })
    }

    downloadTaxCardFromSelfService(params: any) {
        return this.areasHttpService.observable_get<any>((ApiArea.payroll + "/Tax" + "/TaxReport" + "/GenerateFinalTaxCard"), {
            responseType: 'blob' as 'json',
            params: params
        })
    }

    downloadTaxCardFromAdminPart(params: any) {
        return this.areasHttpService.observable_get<any>((ApiArea.payroll + "/Tax" + "/TaxReport" + "/GenerateEmployeeFinalTaxCard"), {
            responseType: 'blob' as 'json',
            params: params
        })
    }

    download108Report(params: any){
        return this.areasHttpService.observable_get<any>((this.apiRoot + "/Download108Report"), {
            responseType: 'blob' as 'json',
            params: params
        })
    }
}