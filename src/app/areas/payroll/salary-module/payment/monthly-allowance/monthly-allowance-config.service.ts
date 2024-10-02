import { Injectable } from "@angular/core";
import { AreasHttpService } from "src/app/areas/areas.http.service";
import { ApiArea } from "src/app/shared/constants";


@Injectable({
    providedIn: 'root'
})

export class MonthlyAllowanceConfigService {
    private apiRoot: string = ApiArea.payroll + "/Salary/MonthlyAllowanceConfig";

    constructor(private areasHttpService: AreasHttpService) { }

    get(params: any) {
        return this.areasHttpService.observable_get<any>((this.apiRoot + "/GetMonthlyAllowanceConfigs"), {
            responseType: "json", observe: 'response', params: params
        });
    }
}