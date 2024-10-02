import { Injectable } from "@angular/core";
import { AreasHttpService } from "src/app/areas/areas.http.service";
import { ApiArea } from "src/app/shared/constants";

@Injectable({
    providedIn: 'root'
})

export class TaxChallanService {
    private apiRoot: string = ApiArea.payroll + "/Tax" + "/TaxChallan"
    constructor(private areasHttpService: AreasHttpService) { }

    uploadChallan(params: any) {
        return this.areasHttpService.observable_post<any>((this.apiRoot + "/UploadIncomeTaxChallan"), params, {
        });
    }

    downloadIncomeTaxChallanFormat() {
        return this.areasHttpService.observable_get<any>((this.apiRoot + "/DownloadIncomeTaxChallanFormat"), {
            responseType: 'blob'
        })
    }

    bulkSubmit(params: any) {
        return this.areasHttpService.observable_post<any>((this.apiRoot + "/BulkSave"), params, {
            responseType: "json", observe:"response"
        });
    }
}