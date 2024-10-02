import { BehaviorSubject } from "rxjs";
import { Injectable } from "@angular/core";
import { ApiArea } from "src/app/shared/constants";
import { AreasHttpService } from "src/app/areas/areas.http.service";

@Injectable({
    providedIn:'root'
})

export class DeductionNameService{
    private root = ApiArea.payroll + "/Salary/DeductionName";
    constructor(private areasHttpService: AreasHttpService) {
    }
    private Source_of_data = new BehaviorSubject<any[]>([]);
    ddl$ = this.Source_of_data.asObservable();

    get(params: any) {
        return this.areasHttpService.observable_get<any>((this.root + "/GetDeductionNames"), {
            responseType: "json", observe: 'response', params: params
        });
    }

    getById(params: any) {
        return this.areasHttpService.observable_get<any[]>((this.root + "/GetDeductionNameById"), {
            responseType: "json", observe: 'response', params: params
        });
    }

    save(data: any) {
        return this.areasHttpService.observable_post<any>((this.root + "/SaveDeductionName"), data, {
            responseType: "json"
        });
    }

    getDeductionNameDropdown() {
        return this.areasHttpService.promise_get<any[]>((this.root + "/GetDeductionNameDropdown"), {
            responseType: "json"
        });
    }

    loadDeductionNameDropdown() {
        this.getDeductionNameDropdown().then((data) => {
            this.Source_of_data.next(data);
        })
        .catch((error) => {
            console.error('Error while fetching grades:', error);
        });
    }

}