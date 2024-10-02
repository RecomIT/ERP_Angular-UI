import { Injectable } from "@angular/core";
import { AreasHttpService } from "../../areas.http.service";
import { ApiArea } from "src/app/shared/constants";
import { BehaviorSubject } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class ReportService {
    private apiRoot: string=ApiArea.asset +"/Report/Report";
    constructor(private areasHttpService: AreasHttpService) { }
 

    generateAssetReport(params: any) {
        return this.areasHttpService.observable_get<any>((this.apiRoot + "/DownloadAssetReport"), {
            responseType: "blob", observe : 'response',  params:params
        })
    }


    generateAssigningReport(params: any) {
        return this.areasHttpService.observable_get<any>((this.apiRoot + "/DownloadAssigningReport"), {
            responseType: "blob", observe : 'response',  params:params
        })
    }

    generateServicingReport(params: any) {
        return this.areasHttpService.observable_get<any>((this.apiRoot + "/DownloadServicingReport"), {
            responseType: "blob", observe : 'response',  params:params
        })
    }

    generateReplacementReport(params: any) {
        return this.areasHttpService.observable_get<any>((this.apiRoot + "/DownloadReplacementReport"), {
            responseType: "blob", observe : 'response',  params:params
        })
    }
    
    
    generateHandoverReport(params: any) {
        return this.areasHttpService.observable_get<any>((this.apiRoot + "/DownloadHandoverReport"), {
            responseType: "blob", observe : 'response',  params:params
        })
    }    

    generateDamageReport(params: any) {
        return this.areasHttpService.observable_get<any>((this.apiRoot + "/DownloadDamageReport"), {
            responseType: "blob", observe : 'response',  params:params
        })
    }

    generateRepairedReport(params: any) {
        return this.areasHttpService.observable_get<any>((this.apiRoot + "/DownloadRepairedReport"), {
            responseType: "blob", observe : 'response',  params:params
        })
    }
    

    generateStockReport(params: any) {
        return this.areasHttpService.observable_get<any>((this.apiRoot + "/DownloadStockReport"), {
            responseType: "blob", observe : 'response',  params:params
        })
    }

}