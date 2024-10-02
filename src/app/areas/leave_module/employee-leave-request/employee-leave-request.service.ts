import { Injectable } from "@angular/core";
import { ApiArea } from "src/app/shared/constants";
import { AreasHttpService } from "../../areas.http.service";
import { HttpHeaders } from "@angular/common/http";

@Injectable({
    providedIn: 'root'
})
export class EmployeeLeaveRequestService {
    private apiRoot: string = ApiArea.hrms + "/leave/LeaveRequest";
    constructor(private areasHttpService: AreasHttpService) { }

    get(params: any) {
        return this.areasHttpService.observable_get<any>((this.apiRoot + "/GetEmployeeLeaveRequests"), {
            responseType: "json", observe: 'response', params: params
        });
    }

    getById(params: any) {
        return this.areasHttpService.observable_get<any>((this.apiRoot + "/GetEmployeeLeaveRequestById"), {
            responseType: "json", observe: 'response', params: params
        });
    }

    save(params: any) {
        return this.areasHttpService.observable_post<any>((this.apiRoot + "/SaveEmployeeLeaveRequest"), params, {
            responseType: "json"
        });
    }

    save2(params: any) {
        return this.areasHttpService.observable_post<any>((this.apiRoot + "/SaveEmployeeLeaveRequest2"), params, {
            responseType: "json"
        });
    }

    save3(requestData: any) {
        // Send the request with headers
        return this.areasHttpService.observable_post<any>((this.apiRoot + "/SaveEmployeeLeaveRequest3"), requestData, {
            responseType: "json"
        });
    }

    

    // approval(params: any) {
    //     return this.areasHttpService.observable_post<any>((this.apiRoot + "/SaveEmployeeLeaveRequestStatus"), params, {
    //         responseType: "json"
    //     });
    // }

    approval(params: any) {
        return this.areasHttpService.observable_post<any>((this.apiRoot + "/LeaveRequestApproval"), params, {
            responseType: "json"
        });
    }

    approvalByEmail(params: any) {
        return this.areasHttpService.observable_post<any>((ApiArea.hrms + "/leave/EmailApproval" + "/LeaveRequestApproval"), params, {
            responseType: "json"
        });
    }

    sendEmail(params: any) {
        return this.areasHttpService.observable_get<any>((this.apiRoot + "/LeaveRequestEmailSend"), {
            responseType: "json", observe: 'response', params: params
        });
    }

    sendEmailNew(params: any) {
        return this.areasHttpService.observable_post<any>((this.apiRoot + "/SendLeaveEmail"), params, {
            responseType: "json"
        });
    }

    delete(params: any){
        return this.areasHttpService.observable_post<any>((this.apiRoot + "/DeleteEmployeeLeaveRequest"), params, {
            responseType: "json"
        });
    }

    history(params: any){
        return this.areasHttpService.observable_get<any>((this.apiRoot + "/GetEmployeeLeaveHistory"), {
            responseType: "json", observe: 'response', params: params
        });
    }

    getInfoAndDetailById(params: any){
        return this.areasHttpService.observable_get<any>((this.apiRoot + "/GetEmployeeLeaveRequestInfoAndDetailById"), {
            responseType: "json", observe: 'response', params: params
        });
    }

    approvedLeaveCancellation(params: any){
        return this.areasHttpService.observable_post<any>((this.apiRoot + "/ApprovedLeaveCancellation"), params, {
            responseType: "json"
        });
    }
}