import { Injectable } from "@angular/core";
import { AreasHttpService } from "src/app/areas/areas.http.service";
import { ApiArea } from "src/app/shared/constants";
@Injectable({
    providedIn:'root'
})
export class EmploymentPromotionSerivce{
    constructor(private areasHttpService: AreasHttpService) {
    }

    get(params: any){
        return this.areasHttpService.observable_get<any>((ApiArea.hrms + "/Employee/Promotion" + "/GetEmployeePromotionProposals"), {
            responseType: "json", observe: 'response', params: params
        });
    }

    save(params: any){
        return this.areasHttpService.observable_post<any>((ApiArea.hrms + "/Employee/Promotion" + "/SavePromotionProposal"), params, {
            responseType: "json"
        });
    }

    approval(params: any){
        return this.areasHttpService.observable_post<any>((ApiArea.hrms + "/Employee/Promotion" + "/ApprovalProposal"), params, {
            responseType: "json"
        });
    }

    getById(params: any){
        return this.areasHttpService.observable_get<any>((ApiArea.hrms + "/Employee/Promotion" + "/GetEmployeePromotionProposalById"), {
            responseType: "json", observe: 'response', params: params
        });
    }

    delete(params: any){
        return this.areasHttpService.observable_post<any>((ApiArea.hrms + "/Employee/Promotion" + "/DeleteEmployeePendingProposal"), params, {
            responseType: "json"
        });
    }
}