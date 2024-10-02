import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { AreasHttpService } from "src/app/areas/areas.http.service";
import { ApiArea } from "src/app/shared/constants";

@Injectable({
    providedIn: 'root'
})

export class EmployeeHierarchyService {
    private apiRoot: string = ApiArea.hrms + "/Employee/Hierarchy";
    constructor(private areasHttpService: AreasHttpService) {
    }
    private Source_of_data = new BehaviorSubject<any[]>([]);
    ddl_data$ = this.Source_of_data.asObservable();
    ddl$: any;

    getActiveHierarchy(id: number) {
        return this.areasHttpService.observable_get<any>((this.apiRoot + "/GetEmployeeActiveHierarchy"), {
            responseType: "json", observe: 'response', params: { id: id }
        });
    }


    getSubordinates(id: any) {
        return this.areasHttpService.promise_get<any[]>((ApiArea.hrms + "/Employee/Hierarchy" + "/GetSubordinates/" + id), {
            responseType: "json"
        });
    }

    loadDropdownData(params: any) {
        this.getSubordinates(params).then((data) => {
            this.Source_of_data.next(data);
        })
            .catch((error) => {
                console.error('Error while fetching data:', error);
            });
    }
}