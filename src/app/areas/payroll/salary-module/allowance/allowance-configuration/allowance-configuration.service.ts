import { Injectable } from "@angular/core";
import { ApiArea } from "src/app/shared/constants";
import { AreasHttpService } from "src/app/areas/areas.http.service";

@Injectable({
    providedIn:'root'
})

export class AllowanceConfigurationService{
    private root = ApiArea.payroll + "/Salary/AllowanceConfig";
    constructor(private areasHttpService:AreasHttpService){
    }

    get(params: any) {
        return this.areasHttpService.observable_get<any>((this.root + "/GetAllownaceConfigurations"), {
            responseType: "json", observe: 'response', params: params
        });
    }

    getById(params: any){
        return this.areasHttpService.observable_get<any>((this.root + "/GetAllownaceConfigurationById"), {
            responseType: "json", observe: 'response', params: params
        });
    }

    save(params: any){
        return this.areasHttpService.observable_post<any>((this.root + "/SaveAllowanceConfig"), params, {
            responseType: "json"
        });
    }

    approval(params: any){
        return this.areasHttpService.observable_post<any>((this.root + "/SaveAllowanceConfigStatus"), params, {
            responseType: "json"
        });
    }
}