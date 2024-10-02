import { Injectable } from "@angular/core";
import { AreasHttpService } from "src/app/areas/areas.http.service";
import { ApiArea } from "src/app/shared/constants";

@Injectable({
    providedIn:'root'
})

export class EmailConfigService{
    private apiRoot: string= ApiArea.hrms +"/Employee/EmailSendingConfiguration";
    constructor(private areasHttpService: AreasHttpService) {
    }

    get(params: any){
        return this.areasHttpService.observable_get<any>((this.apiRoot + "/GetEmailSendingConfiguration"), {
            responseType: "json", observe: 'response', params: params
        });
    }

    save(params: any){
        return this.areasHttpService.observable_post<any>((this.apiRoot + "/SaveEmailSendingConfiguration"), params, {
            responseType: "json"
        });
    }

    loadModule(){
        return this.areasHttpService.promise_get<any[]>((this.apiRoot + "/LoadModuleName"), {
            responseType: "json"
        });
    }
}