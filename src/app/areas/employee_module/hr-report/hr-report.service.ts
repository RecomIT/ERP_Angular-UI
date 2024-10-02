import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { AreasHttpService } from "src/app/areas/areas.http.service";
import { ApiArea } from "src/app/shared/constants";

@Injectable({
    providedIn:'root'
})

export class HrReportService {
    constructor(private areasHttpService: AreasHttpService) {
    }

    private apiRoot: string = ApiArea.hrms + "/Employee/HrReport";

    getSalarySheet(params: any) {
        return this.areasHttpService.observable_get<any>((this.apiRoot + "/GetSalarySheet"), {
            responseType: "json", observe: 'response', params: params
        });
    }

    downloadEmploymentCertificate(params: any) {
        return this.areasHttpService.observable_get<any>((this.apiRoot + "/DownloadEmploymentCertificate"), {
            responseType: "blob", observe: 'response', params: params
        });
    }

    downloadConfirmationOfService(params: any) {
        return this.areasHttpService.observable_get<any>((this.apiRoot + "/DownloadEmploymentCertificate"), {
            responseType: "blob", observe: 'response', params: params
        });
    }

    downloadNewJoinerReport(params: any) {
        return this.areasHttpService.observable_get<any>((this.apiRoot + "/DownloadNewJoinerReport"), {
            responseType: "blob", observe: 'response', params: params
        });
    }

    downloadConfirmationReport(params: any) {
        return this.areasHttpService.observable_get<any>((this.apiRoot + "/DownloadConfirmationReport"), {
            responseType: "blob", observe: 'response', params: params
        });
    }

}