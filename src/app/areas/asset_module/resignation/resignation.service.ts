import { BehaviorSubject } from "rxjs";
import { AreasHttpService } from "../../areas.http.service";
import { ApiArea } from "src/app/shared/constants";
import { Injectable } from "@angular/core";
@Injectable({
    providedIn:'root'
})

export class ResignationSerive{
    private apiRoot = ApiArea.asset + "/Resignation/Resignation";
    constructor(private areasHttpService: AreasHttpService) {
    }

    private Source_of_data = new BehaviorSubject<any[]>([]);
    ddl$ = this.Source_of_data.asObservable();

    getEmployeeResignation(params: any) {
        return this.areasHttpService.observable_get<any>((this.apiRoot + "/GetEmployeeResignation"), {
            responseType: "json", observe: 'response', params: params
        });
    }

    get(params: any) {
        return this.areasHttpService.observable_get<any>((this.apiRoot + "/GetAssignedData"), {
            responseType: "json", observe: 'response', params: params
        });
    }

    getById(params: any) {
        return this.areasHttpService.observable_get<any>((this.apiRoot + "/GetAssetById"), {
            responseType: "json", params: params
        });
    }

    getProduct(params: any) {
        return this.areasHttpService.observable_get<any>((this.apiRoot + "/GetProduct"), {
            responseType: "json", params: params
        });
    }

    save(params: any) {
        return this.areasHttpService.observable_post<any>((this.apiRoot+ "/SaveAsset"), params, {
            responseType: "json", observe: 'response'
        });
    }


    sendEmail() {
        return this.areasHttpService.observable_get<any>((this.apiRoot + "/SendEmail"), {
            responseType: "json"
        });
    }


}