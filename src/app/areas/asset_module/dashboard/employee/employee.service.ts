import { Injectable } from "@angular/core";
import { ApiArea } from "src/app/shared/constants";
import { BehaviorSubject } from "rxjs";
import { AreasHttpService } from "src/app/areas/areas.http.service";

@Injectable({
    providedIn: 'root'
})

export class EmployeeService {
    private apiRoot: string=ApiArea.asset +"/Dashboard/Employee";
    constructor(private areasHttpService: AreasHttpService) { }

    private Source_of_data = new BehaviorSubject<any[]>([]);
    ddl$ = this.Source_of_data.asObservable();

    get() {
        return this.areasHttpService.observable_get<any>((this.apiRoot + "/GetEmployeeAssetList"), {
            responseType: "json", observe: 'response'
        });
    }




}