import { Injectable, OnInit } from "@angular/core";
import { AreasHttpService } from "src/app/areas/areas.http.service";
import { ApiArea } from "src/app/shared/constants";
import { UtilityService } from "src/app/shared/services/utility.service";

@Injectable({
    providedIn: 'root'
})
export class PfCardService{

    constructor(private utilityService: UtilityService, private areasHttpService: AreasHttpService){}
    getEmployeePFCardSummery(params:any){
        return this.areasHttpService.observable_get<any[]>(("/Fund" + "/PF/External" + "/GetPFSummaryPdf"), {
            responseType: 'blob', params: params
        });
    }

    getEmployeePFCardLetter(params:any){
        return this.areasHttpService.observable_get<any[]>(("/Fund" + "/PF/External" + "/GetPFCardLetterPdf"), {
            responseType: 'blob', params: params
        });
    }

}