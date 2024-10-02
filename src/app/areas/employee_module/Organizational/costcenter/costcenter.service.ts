import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { AreasHttpService } from "src/app/areas/areas.http.service";
import { ApiArea } from "src/app/shared/constants";

@Injectable({
    providedIn:'root'
})

export class CostCenterService{
    constructor(private areasHttpService: AreasHttpService) {
    }

    private Source_of_data = new BehaviorSubject<any[]>([]);
    ddl$ = this.Source_of_data.asObservable();

    get(params: any) {
        return this.areasHttpService.observable_get<any[]>((ApiArea.hrms + "/Employee/CostCenter" + "/GetCostCenters"), {
            responseType: "json", params: params
        });
    }

    getById(params: any) {
        return this.areasHttpService.observable_get<any[]>((ApiArea.hrms + "/Employee/CostCenter" + "/GetCostCenterById"), {
            responseType: "json", params: params
        });
    }

    save(params: any) {
        return this.areasHttpService.observable_post<any>((ApiArea.hrms + "/Employee/CostCenter" + "/SaveCostCenter"), params, {
            responseType: "json", observe: 'response'
        });
    }

    getCostCenterDropdown() {
       return this.areasHttpService.promise_get<any[]>((ApiArea.hrms + "/Employee/CostCenter" + "/GetCostCenterDropdown"), {
            responseType: "json"
        });
    }

    loadCostCenterDropdown(){
        this.getCostCenterDropdown().then((data) => {
        this.Source_of_data.next(data);
        })
        .catch((error) => {
        console.error('Error while fetching grades:', error);
        });
    }
}