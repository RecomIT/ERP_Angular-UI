import { BehaviorSubject } from "rxjs";
import { Injectable } from "@angular/core";
import { ApiArea } from "src/app/shared/constants";
import { AreasHttpService } from "src/app/areas/areas.http.service";

@Injectable({
    providedIn: 'root'
})

export class AllowanceArrearAdjustmentService {
    private root = ApiArea.payroll + "/Salary/SalaryAllowanceArrearAdjustment";
    constructor(private areasHttpService: AreasHttpService) {
    }


    get(params: any) {
        return this.areasHttpService.observable_get<any>((this.root + "/GetSalaryAllowanceArrearAdjustmentList"), {
            responseType: "json", observe: 'response', params: params
        });
    }

    getById(params: any) {
        return this.areasHttpService.observable_get<any>((this.root + "/GetSalaryAllowanceArrearAdjustmentById"), {
            responseType: "json", observe: 'response', params: params
        });
    }

    save(params: any) {
        return this.areasHttpService.observable_post<any>((this.root + "/Save"), params, {
            responseType: "json"
        });
    }

    update(params: any) {
        return this.areasHttpService.observable_put<any>((this.root + "/UpdateSalaryAllowanceArrearAdjustment"), JSON.stringify(params), {
            'headers': {
                'Content-Type': 'application/json'
            }
        });
    }

    delete(params: any) {
        return this.areasHttpService.observable_post<any>((this.root + "/DeleteSalaryAllowanceArrearAdjustment"), params, {
            responseType: "json"
        });
    }

    approval(params: any) {
        return this.areasHttpService.observable_post<any>((this.root + "/ArrearAdjustmentApproval"), params, {
            responseType: "json"
        });
    }

    uploadExcel(formData: any) {
        return this.areasHttpService.observable_post<any>((this.root + "/UploadSalaryAllowanceArrearAdj"),
            formData, {})
    }

    downloadExcelFormat(params: any) {
        return this.areasHttpService.observable_get<any>(this.root + "/DownloadSalaryAllowanceArrearAdj", {
            responseType: "blob", params: params
        });
    }

    getPendingItems(params: any) {
        return this.areasHttpService.observable_get<any>((this.root + "/GetPendingSalaryAllowanceArrearAdjustment"), {
            responseType: "json", observe: 'response', params: params
        });
    }


}