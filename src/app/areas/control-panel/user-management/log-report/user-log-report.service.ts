import { Injectable } from "@angular/core";
import { AreasHttpService } from "src/app/areas/areas.http.service";
import { ApiArea } from "src/app/shared/constants";

@Injectable({
    providedIn: 'root'
})

export class UserLogReportService {

    private apiRoot: string = ApiArea.controlpanel + "/UserLogReport";
    constructor(private areasHttpService: AreasHttpService) {
    }

    userAccessReport(params: any) {
        return this.areasHttpService.observable_get<any>((this.apiRoot + "/UserAccessReport"), {
            responseType: 'blob' as 'json', params: params
        });
    }

    userPrivilegeReport(params: any) {
        return this.areasHttpService.observable_get<any>((this.apiRoot + "/UserPrivilegeReport"), {
            responseType: 'blob' as 'json', params: params
        });
    }

    userRolePrivilegeReport(params: any) {
        return this.areasHttpService.observable_get<any>((this.apiRoot + "/UserRolePrivilegeReport"), {
            responseType: 'blob' as 'json', params: params
        });
    }
}