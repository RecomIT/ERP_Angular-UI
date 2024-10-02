import { Injectable } from "@angular/core";
import { AreasHttpService } from "src/app/areas/areas.http.service";
import { ApiArea } from "src/app/shared/constants";


@Injectable({
    providedIn: 'root'
})

export class ConditionalProjectedPaymentService {
    private apiRoot: string = ApiArea.payroll + "/Salary/ConditionalProjectedAllowance";

    constructor(private areasHttpService: AreasHttpService) { }

    get(params: any) {
        return this.areasHttpService.observable_get<any>((this.apiRoot + "/GetConditionalProjectedPayments"), {
            responseType: "json", observe: 'response', params: params
        });
    }

    getById(id: any) {
        return this.areasHttpService.observable_get<any>((this.apiRoot + "/GetById/" + id), {
            responseType: "json", observe: 'response'
        });
    }

    save(params: any) {
        return this.areasHttpService.observable_post<any>((this.apiRoot + "/Save"), params, {
            responseType: "json"
        });
    }

    approval(params: any) {
        return this.areasHttpService.observable_post<any>((this.apiRoot + "/Approval"), params, {
            responseType: "json"
        });
    }
}