import { BehaviorSubject } from "rxjs";
import { Injectable } from "@angular/core";
import { ApiArea } from "src/app/shared/constants";
import { AreasHttpService } from "src/app/areas/areas.http.service";

@Injectable({
    providedIn:'root'
})

export class DeductionHeadService{
    private root = ApiArea.payroll + "/Salary/DeductionHead";
    constructor(private areasHttpService: AreasHttpService) {
    }
    private Source_of_data = new BehaviorSubject<any[]>([]);
    ddl$ = this.Source_of_data.asObservable();

    get(params: any) {
        return this.areasHttpService.observable_get<any>((this.root + "/GetDeductionHeads"), {
            responseType: "json", observe: 'response', params: params
        });
    }

    getById(params: any) {
        return this.areasHttpService.observable_get<any[]>((this.root + "/GetDeductionHeadById"), {
            responseType: "json", observe: 'response', params: params
        });
    }

    save(data: any) {
        return this.areasHttpService.observable_post<any>((this.root + "/SaveDeductionHead"), data, {
            responseType: "json"
        });
    }

    getDeductionHeadDropdown() {
        return this.areasHttpService.promise_get<any[]>((this.root + "/GetDeductionHeadDropdown"), {
            responseType: "json", observe: 'response'
        });
    }

    loadDeductionHeadDropdown() {
        this.getDeductionHeadDropdown().then((data) => {
            this.Source_of_data.next(data);
        })
        .catch((error) => {
            console.error('Error while fetching grades:', error);
        });
    }

}