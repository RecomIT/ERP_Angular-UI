import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { AreasHttpService } from "src/app/areas/areas.http.service";
import { ApiArea } from "src/app/shared/constants";

@Injectable({
    providedIn: 'root'
})

export class AllowanceHeadService {
    private root = ApiArea.payroll + "/Salary/AllowanceHead";
    constructor(private areasHttpService: AreasHttpService) {
    }
    private Source_of_data = new BehaviorSubject<any[]>([]);
    ddl$ = this.Source_of_data.asObservable();

    get(params: any) {
        return this.areasHttpService.observable_get<any>((this.root + "/GetAllowanceHeads"), {
            responseType: "json", observe: 'response', params: params
        });
    }

    getById(params: any) {
        return this.areasHttpService.observable_get<any[]>((this.root + "/GetAllowanceHeadById"), {
            responseType: "json", observe: 'response', params: params
        });
    }

    save(data: any) {
        return this.areasHttpService.observable_post<any>((this.root + "/SaveAllowanceHead"), data, {
            responseType: "json"
        });
    }

    getAllowanceHeadDropdown() {
        return this.areasHttpService.promise_get<any[]>((this.root + "/GetAllowanceHeadDropdown"), {
            responseType: "json", observe: 'response'
        });
    }

    loadAllowanceHeadDropdown() {
        this.getAllowanceHeadDropdown().then((data) => {
            this.Source_of_data.next(data);
        })
        .catch((error) => {
            console.error('Error while fetching grades:', error);
        });
    }
}