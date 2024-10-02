import { Injectable } from "@angular/core";
import { AreasHttpService } from "../../../../areas.http.service";
import { ApiArea } from "src/app/shared/constants";

@Injectable({
    providedIn: 'root'
})

export class EmployeeSalaryHoldService {
    private apiRoot: string = ApiArea.payroll + "/salary/salaryHold";
    constructor(private areaHttpService: AreasHttpService) {
    }

    getSalaryHoldInfos(params: any) {
        return this.areaHttpService.observable_get<any[]>(this.apiRoot + "/GetSalaryHoldInfos", {
            responseType: 'json', params: params
        })
    }

    SaveSalaryHold(data: any) {
        return this.areaHttpService.observable_post<any>(this.apiRoot + "/SaveSalaryHold", data, {});
    }

    UploadSalaryHold(data: any) {
        return this.areaHttpService.observable_post<any>(this.apiRoot + "/SaveUploadHoldSalary", data, {});
    }

    getSalaryHoldInfoById(params: any) {
        return this.areaHttpService.observable_get<any[]>(this.apiRoot + "/GetSalaryHoldInfoById", {
            responseType: 'json', params: params
        })
    }
}