import { Injectable } from "@angular/core";
import { ApiArea } from "src/app/shared/constants";
import { AreasHttpService } from "../../areas.http.service";

@Injectable({
    providedIn: 'root'
})

export class LeaveSettingSerive {
    private apiRoot: string = ApiArea.hrms + "/leave/leaveSetting";
    constructor(private areasHttpService: AreasHttpService) { }

    get(params: any) {
        return this.areasHttpService.observable_get<any[]>((this.apiRoot + "/GetLeaveSettings"), {
            responseType: "json", params: params
        });
    }

    getById(params: any) {
        return this.areasHttpService.observable_get<any>((this.apiRoot + "/GetLeaveSettingById"), {
            responseType: "json", params: params
        });
    }

    save(params: any) {
        return this.areasHttpService.observable_post<any>((this.apiRoot + "/SaveLeaveSetting"), params, {
            responseType: "json"
        });
    }

    getLeaveTypeSetting(params: any) {
        return this.areasHttpService.observable_get<any>((this.apiRoot + "/GetLeaveTypeSetting"), {
            responseType: "json", params: params
        });
    }

    getLeavePeriod(params: any) {
        return this.areasHttpService.observable_get<any>((this.apiRoot + "/GetLeavePeriod"), {
            responseType: "json", params: params
        });
    }

    getTotalRequestDays(params: any){
        return this.areasHttpService.observable_get<any>((this.apiRoot + "/GetTotalRequestDays"), {
            responseType: "json", params: params
        });
    }

}