import { Injectable } from "@angular/core";
import { AreasHttpService } from "src/app/areas/areas.http.service";
import { ApiArea } from "src/app/shared/constants";
@Injectable({
    providedIn:'root'
})
export class EmploymentConfirmationSerivce{
    constructor(private areasHttpService: AreasHttpService) {
    }

    get(params: any){
        return this.areasHttpService.observable_get<any>((ApiArea.hrms + "/Employee/Confirmation" + "/GetEmploymentConfirmations"), {
            responseType: "json", observe: 'response', params: params
        });
    }

    save(params: any){
        return this.areasHttpService.observable_post<any>((ApiArea.hrms + "/Employee/Confirmation" + "/SaveEmploymentConfirmation"), params, {
            responseType: "json"
        });
    }

    approval(params: any){
        return this.areasHttpService.observable_post<any>((ApiArea.hrms + "/Employee/Confirmation" + "/SaveEmploymentConfirmationStatus"), params, {
            responseType: "json"
        });
    }

    getById(params: any){
        return this.areasHttpService.observable_get<any>((ApiArea.hrms + "/Employee/Confirmation" + "/GetEmploymentConfirmationById"), {
            responseType: "json", observe: 'response', params: params
        });
    }

    getUnconfirmedEmployeeInfosInApply(){
        return this.areasHttpService.observable_get<any>((ApiArea.hrms + "/Employee/Confirmation" + "/getUnconfirmedEmployeeInfosInApply"), {
            responseType: "json", observe: 'response'
        });
    }

    getUnconfirmedEmployeeInfosInUpdate(){
        return this.areasHttpService.observable_get<any>((ApiArea.hrms + "/Employee/Confirmation" + "/getUnconfirmedEmployeeInfosInUpdate"), {
            responseType: "json", observe: 'response'
        });
    }
}