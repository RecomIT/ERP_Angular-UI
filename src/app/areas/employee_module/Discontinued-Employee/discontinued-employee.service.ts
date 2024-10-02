import { Injectable } from "@angular/core";
import { AreasHttpService } from "src/app/areas/areas.http.service";
import { ApiArea } from "src/app/shared/constants";

@Injectable({
    'providedIn':'root'
})

export class DiscontinuedEmployeeService{
    constructor(private areasHttpService: AreasHttpService){}

    private apiRoot: string=ApiArea.hrms+"/Employee"+"/DiscontinuedEmployee";
    get(params: any){
        return this.areasHttpService.observable_get<any>((this.apiRoot + "/GetDiscontinuedEmployees"), {
            responseType: "json", observe: 'response', params: params
        });
    }

    getById(params: any) {
        return this.areasHttpService.observable_get<any>((this.apiRoot + "/GetDiscontinuedEmployeeById"), {
            responseType: "json", observe: 'response', params: params
        });
    }

    save(params: any) {
        return this.areasHttpService.observable_post<any>((this.apiRoot + "/SaveDiscontinuedEmployee"), params, {
            responseType: "json", observe: 'response'
        });
    }

    delete(params: any){
        return this.areasHttpService.observable_post<any>((this.apiRoot + "/DeleteDiscontinuedEmployee"), params, {
            responseType: "json", observe: 'response'
        });
    }

    approval(params: any){
        return this.areasHttpService.observable_post<any>((this.apiRoot + "/ApprovalDiscontinuedEmployee"), params, {
            responseType: "json", observe: 'response'
        });
    }
}