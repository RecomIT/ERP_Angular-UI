import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { AreasHttpService } from "src/app/areas/areas.http.service";
import { ApiArea } from "src/app/shared/constants";

@Injectable({
    providedIn:'root'
})


export class EmployeePFActivationService{
    private apiRoot: string=ApiArea.hrms+"/Employee/PFActivation";
    constructor(private areasHttpService: AreasHttpService) {
    }
    private Source_of_data = new BehaviorSubject<any[]>([]);
    ddl_data$ = this.Source_of_data.asObservable();
    ddl$: any;

    get(params: any){
        return this.areasHttpService.observable_get<any>((this.apiRoot + "/GetEmployeePFActivationList"), {
            responseType: "json", observe: 'response', params: params
        });
    }

    getById(params: any){
        return this.areasHttpService.observable_get<any>((this.apiRoot + "/GetEmployeePFActivationById"), {
            responseType: "json", observe: 'response', params: params
        });
    }

    save(params: any){
        return this.areasHttpService.observable_post<any>((this.apiRoot + "/SavePFActivation"), params, {
            responseType: "json"
        });
    }

    approval(params: any){
        return this.areasHttpService.observable_post<any>((this.apiRoot + "/SavePFActivationApproval"), params, {
            responseType: "json"
        });
    }

    loadConfirmedEmployeeDrodown(params: any){
        return this.areasHttpService.promise_get<any[]>((this.apiRoot + "/GetConfirmedEmployeesToAssignPF"), {
            responseType: "json", params: params
        });
    }

    loadBaseAmountDropdown(params: any){
        return this.areasHttpService.promise_get<any[]>((this.apiRoot + "/GetPFBasedAmountDropdown"), {
            responseType: "json", params: params
        });
    }
}