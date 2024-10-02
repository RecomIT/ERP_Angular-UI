import { Injectable } from "@angular/core";
import { AreasHttpService } from "src/app/areas/areas.http.service";
import { ApiArea } from "src/app/shared/constants";

@Injectable({
    providedIn: 'root'
})

export class MonthlyVariableAllowanceService {

    private root = ApiArea.payroll + "/Salary/VariableAllowance";
    constructor(private areasHttpService: AreasHttpService) {
    }

    get(params: any) {
        return this.areasHttpService.observable_get<any>((this.root + "/GetMonthlyVariableAllowances"), {
            responseType: "json", observe: 'response', params: params
        });
    }

    getById(id: number) {
        return this.areasHttpService.observable_get<any>((this.root + "/GetById/" + id), {
            responseType: "json", observe: 'response'
        });
    }

    save(params: any) {
        return this.areasHttpService.observable_post<any>((this.root + "/SaveMonthlyVariableAllowances"), params, {
            responseType: "json"
        });
    }

    delete(id: any) {
        return this.areasHttpService.observable_post<any>((this.root + "/DeletePendingMonthlyVariableAllowance/" + id), null, {
            responseType: "json"
        });
    }

    update(params: any) {
        return this.areasHttpService.observable_post<any>((this.root + "/UpdateMonthlyVariableAllowance"), params, {
            responseType: "json"
        });
    }

    approval(params: any) {
        return this.areasHttpService.observable_post<any>((this.root + "/SaveMonthlyVariableAllowanceStatus"), params, {
            responseType: "json"
        });
    }

    upload(formData: any) {
        return this.areasHttpService.observable_post<any>((this.root + "/UploadMonthlyVariableAllowances"),
            formData, {})
    }

    updateApprovedAllowance(params: any) {
        return this.areasHttpService.observable_post<any>((this.root + "/UpdateApprovedAllowance"), params, {
            responseType: "json"
        });
    }
}