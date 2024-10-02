import { BehaviorSubject } from "rxjs";
import { AreasHttpService } from "../../areas.http.service";
import { ApiArea } from "src/app/shared/constants";
import { Injectable } from "@angular/core";
@Injectable({
    providedIn:'root'
})

export class ApprovalSerive{
    private apiRoot = ApiArea.asset + "/Approval/Approval";
    constructor(private areasHttpService: AreasHttpService) {
    }

    private Source_of_data = new BehaviorSubject<any[]>([]);
    ddl$ = this.Source_of_data.asObservable();


    save(params: any) {
        return this.areasHttpService.observable_post<any>((this.apiRoot+ "/ApprovedAsset"), params, {
            responseType: "json", observe: 'response',params: params
        });
    }

    sendEmail(params: any) {
        return this.areasHttpService.observable_get<any>((this.apiRoot + "/SendEmail"), {
            responseType: "json",params: params
        });
    }

}