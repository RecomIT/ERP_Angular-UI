import { Injectable, OnInit } from "@angular/core";
import { AreasHttpService } from "src/app/areas/areas.http.service";
import { ApiArea } from "src/app/shared/constants";
import { UtilityService } from "src/app/shared/services/utility.service";

@Injectable({
    providedIn: 'root'
})
export class PfReportService{

    constructor(private utilityService: UtilityService, private areasHttpService: AreasHttpService){}
    downloadPFCardSummery(params:any){
        return this.areasHttpService.observable_get<any[]>(("/Fund" + "/External" + "/DownloadPFSummary"), {
            responseType: 'blob' as 'json', params: params
        });
    }

    downloadPFLetter(params:any){
        return this.areasHttpService.observable_get<any[]>(("/Fund" + "/External" + "/DownloadPFLetter"), {
            responseType: 'blob' as 'json', params: params
        });
    }

    downloadPFLoan(params:any){
        return this.areasHttpService.observable_get<any[]>(("/Fund" + "/External" + "/DownloadLoanCard"), {
            responseType: 'blob' as 'json', params: params
        });
    }

}