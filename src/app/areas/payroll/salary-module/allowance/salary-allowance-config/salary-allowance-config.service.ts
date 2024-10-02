import { Injectable } from "@angular/core";
import { AreasHttpService } from "src/app/areas/areas.http.service";
import { ApiArea } from "src/app/shared/constants";

@Injectable({
    providedIn: 'root'
})

export class SalaryAllowanceConfigService {
    private root = ApiArea.payroll + "/Salary/SalaryAllowanceConfig";
    constructor(private areasHttpService: AreasHttpService) {
    }

    get(params: any) {
        return this.areasHttpService.observable_get<any>((this.root + "/GetSalaryAllowanceConfigurationInfos"), {
            responseType: "json", observe: 'response', params: params
        });
    }

    detail(params: any) {
        return this.areasHttpService.observable_get<any>((this.root + "/GetSalaryAllowanceConfigurationDetails"), {
            responseType: "json", observe: 'response', params: params
        });
    }

    getById(params: any) {
        return this.areasHttpService.observable_get<any>((this.root + "/GetAllownaceConfigurationById"), {
            responseType: "json", observe: 'response', params: params
        });
    }

    save(params: any) {
        return this.areasHttpService.observable_post<any>((this.root + "/SaveSalaryAllowanceConfig"), params, {
            responseType: "json"
        });
    }

    approval(params: any) {
        return this.areasHttpService.observable_post<any>((this.root + "/SaveSalaryAllowanceConfigStatus"), params, {
            responseType: "json"
        });
    }

    // New

    save2(params: any) {
        return this.areasHttpService.observable_post<any>((this.root + "/Save"), params, {
            responseType: "json", observe: "response"
        });
    }

    getAll(params: any) {
        return this.areasHttpService.observable_get<any>((this.root + "/GetAll"), {
            responseType: "json", observe: 'response', params: params
        });
    }

    getHeadsInfo(params: any) {
        return this.areasHttpService.observable_get<any>((this.root + "/GetHeadsInfo"), {
            responseType: "json", observe: 'response', params: params
        });
    }

    delete(id: any) {
        return this.areasHttpService.observable_post<any>(this.root + "/DeletePendingConfig?id=" + id, null, {});
    }

    approved(params: any) {
        return this.areasHttpService.observable_post<any>((this.root + "/ApprovedPendingConfig"), params, {
            responseType: "json", observe: "response"
        });
    }
}