import { Injectable } from "@angular/core";
import { AreasHttpService } from "src/app/areas/areas.http.service";
import { ApiArea } from "src/app/shared/constants";
@Injectable({
    providedIn:'root'
})

export class MonthlyVariableDeductionService{
    private root = ApiArea.payroll + "/Salary/VariableDeduction";
    constructor(private areasHttpService: AreasHttpService) {
    }

    get(params: any) {
        return this.areasHttpService.observable_get<any>((this.root + "/GetMonthlyVariableDeductions"), {
            responseType: "json", observe: 'response', params: params
        });
    }

    getById(params: any) {
        return this.areasHttpService.observable_get<any>((this.root + "/GetMonthlyVariableDeductionById"), {
            responseType: "json", observe: 'response', params: params
        });
    }

    save(params: any) {
        return this.areasHttpService.observable_post<any>((this.root + "/SaveMonthlyVariableDeductions"), params, {
            responseType: "json"
        });
    }

    update(params: any) {
        return this.areasHttpService.observable_post<any>((this.root + "/UpdateMonthlyVariableDeduction"), params, {
            responseType: "json"
        });
    }

    delete(id: any) {
        return this.areasHttpService.observable_post<any>((this.root + "/DeletePendingMonthlyVariableDeduction/" + id), null, {
            responseType: "json"
        });
    }

    approval(params: any) {
        return this.areasHttpService.observable_post<any>((this.root + "/SaveMonthlyVariableDeductionStatus"), params, {
            responseType: "json"
        });
    }

    upload(formData: any) {
        return this.areasHttpService.observable_post<any>((this.root + "/UploadMonthlyVariableDeductions"),
            formData, {})
    }
}