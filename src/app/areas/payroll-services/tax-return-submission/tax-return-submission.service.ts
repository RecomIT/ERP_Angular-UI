import { Injectable } from "@angular/core";
import { UtilityService } from "src/app/shared/services/utility.service";
import { AreasHttpService } from "../../areas.http.service";
import { ApiArea } from "src/app/shared/constants";


@Injectable({
    providedIn: 'root'
})
export class TaxReturnSubmissioinService {
    constructor(private utilityService: UtilityService,
        private areasHttpService: AreasHttpService) { }

    getEmployeeTaxReturnSubmissionAsync(params: any) {
        return this.areasHttpService.observable_get<any[]>((ApiArea.payroll + "/Tax/TaxReturnSubmission" + "/GetEmployeeTaxReturnSubmission"), {
            responseType: "json", params: params
        });
    }

    saveEmployeeTaxReturnSubmission(data: any) {
        return this.areasHttpService.observable_post<any>((ApiArea.payroll + "/Tax/TaxReturnSubmission" + "/SaveEmployeeTaxReturnSubmission"), data, {});
    }

    deleteEmployeeTaxReturnSubmission(data: any) {
        return this.areasHttpService.observable_post<any>((ApiArea.payroll + "/Tax/TaxReturnSubmission" + "/DeleteEmployeeTaxReturnSubmission"), data, {
            responseType: "json", observe: 'response'
        });
    }

    downloadEmployeeTaxReturnFile(path: string) {
        return this.areasHttpService.observable_get<any>((ApiArea.payroll + "/Tax/TaxReturnSubmission" + "/DownloadEmployeeTaxReturnFile"), {
            responseType: "blob", params: {path:path}
        });
    }

    getById(params: any){
        return this.areasHttpService.observable_get<any>(ApiArea.payroll + "/Tax/TaxReturnSubmission" + "/GetEmployeeTaxReturnSubmissionById", {
            responseType: 'json',observe: 'response', params: params
        })
    }

}