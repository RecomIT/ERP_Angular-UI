import { Inject, Injectable } from "@angular/core";
import { ApiArea } from "src/app/shared/constants";
import { AreasHttpService } from "../../areas.http.service";

@Injectable({
    providedIn: 'root'
})

export class SubordinatesLeaveRequestApprovalService {
    private apiRoot: string = ApiArea.hrms + "/Leave/LeaveRequest";
    constructor(private areasHttpService: AreasHttpService) { }

    get(params: any){
        return this.areasHttpService.observable_get<any>((this.apiRoot + "/GetSubordinatesLeaveRequests"), {
            responseType: "json", observe: 'response', params: params
        });
    }

    approval(params: any) {
        return this.areasHttpService.observable_post<any>((this.apiRoot + "/LeaveRequestApproval"), params, {
            responseType: "json"
        });
    }
    
}