import { Injectable } from "@angular/core";
import { AreasHttpService } from "src/app/areas/areas.http.service";
import { ApiArea } from "src/app/shared/constants";

@Injectable({
    providedIn:'root'
})

export class EmployeeAccountService{
    constructor(private areasHttpService: AreasHttpService) {
    }

    get(params: any){
        return this.areasHttpService.observable_get<any>((ApiArea.hrms + "/Employee/EmployeeAccountInfo" + "/GetEmployeeAccountInfos"), {
            responseType: "json", observe: 'response', params: params
        });
    }

    getById(params: any) {
        return this.areasHttpService.observable_get<any>((ApiArea.hrms + "/Employee/EmployeeAccountInfo" + "/GetEmployeeAccountInfoById"), {
            responseType: "json", observe: 'response', params: params
        });
    }

    save(params: any) {
        return this.areasHttpService.observable_post<any>((ApiArea.hrms + "/Employee/EmployeeAccountInfo" + "/SaveEmployeeAccountInfo"), params, {
            responseType: "json", observe: 'response'
        });
    }

    delete(params: any){
        return this.areasHttpService.observable_post<any>((ApiArea.hrms + "/Employee/EmployeeAccountInfo" + "/DeleteEmployeeAccount"), params, {
            responseType: "json", observe: 'response'
        });
    }

    approval(params: any){
        return this.areasHttpService.observable_post<any>((ApiArea.hrms + "/Employee/EmployeeAccountInfo" + "/SaveEmployeeAccountStatus"), params, {
            responseType: "json", observe: 'response'
        });
    }

}
