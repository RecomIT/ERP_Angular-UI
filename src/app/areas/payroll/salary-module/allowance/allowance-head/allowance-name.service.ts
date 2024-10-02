import { BehaviorSubject } from "rxjs";
import { Injectable } from "@angular/core";
import { ApiArea } from "src/app/shared/constants";
import { AreasHttpService } from "src/app/areas/areas.http.service";

@Injectable({
    providedIn: 'root'
})

export class AllowanceNameService {
    private root = ApiArea.payroll + "/Salary/AllowanceName";
    constructor(private areasHttpService: AreasHttpService) {
    }
    private Source_of_data = new BehaviorSubject<any[]>([]);
    ddl$ = this.Source_of_data.asObservable();

    get(params: any) {
        return this.areasHttpService.observable_get<any>((this.root + "/GetAllowanceNames"), {
            responseType: "json", observe: 'response', params: params
        });
    }

    getById(params: any) {
        return this.areasHttpService.observable_get<any[]>((this.root + "/GetAllowanceNameById"), {
            responseType: "json", observe: 'response', params: params
        });
    }

    save(data: any) {
        return this.areasHttpService.observable_post<any>((this.root + "/SaveAllowanceName"), data, {
            responseType: "json"
        });
    }

    getAllowanceNameDropdown() {
        return this.areasHttpService.promise_get<any[]>((this.root + "/GetAllowanceNameDropdown"), {
            responseType: "json"
        });
    }

    loadAllowanceNameDropdown() {
        this.getAllowanceNameDropdown().then((data) => {
            this.Source_of_data.next(data);
        })
        .catch((error) => {
            console.error('Error while fetching grades:', error);
        });
    }
}