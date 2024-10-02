import { Injectable } from "@angular/core";
import { AreasHttpService } from "src/app/areas/areas.http.service";
import { ApiArea } from "src/app/shared/constants";

@Injectable({
    providedIn: 'root'
})

export class PeriodicalVariableAllowanceService {
    private apiRoot: string = ApiArea.payroll + "/Salary/PeriodicalAllowance";
    constructor(private areasHttpService: AreasHttpService) { }

    save(params: any) {
        return this.areasHttpService.observable_post<any>((this.apiRoot + "/Save"), params, {
            responseType: "json", observe: "response"
        });
    }

    getAll(params: any) {
        return this.areasHttpService.observable_get<any>((this.apiRoot + "/GetAll"), {
            responseType: "json", observe: 'response', params: params
        });
    }

    getHeadInfos(id: any) {
        return this.areasHttpService.observable_get<any>((this.apiRoot + "/GetHeadInfos/" + id), {
            responseType: "json", observe: 'response'
        });
    }

    getPendingPrincipleAmountInfos(id:any){
        return this.areasHttpService.observable_get<any>((this.apiRoot + "/GetPendingPrincipleAmountInfos/" + id), {
            responseType: "json", observe: 'response'
        });
    }

}