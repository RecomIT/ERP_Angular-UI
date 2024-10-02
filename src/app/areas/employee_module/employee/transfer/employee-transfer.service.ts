import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { AreasHttpService } from "src/app/areas/areas.http.service";
import { ApiArea } from "src/app/shared/constants";

@Injectable({
    providedIn: 'root'
})

export class EmployeeTransferService {
    private apiRoot: string = ApiArea.hrms + "/Employee/Transfer";
    constructor(private areasHttpService: AreasHttpService) {
    }
    private Source_of_data = new BehaviorSubject<any[]>([]);
    ddl_employee_data$ = this.Source_of_data.asObservable();
    ddl$: any;

    get(params: any) {
        return this.areasHttpService.observable_get<any>((this.apiRoot + "/GetEmployeeTransferProposals"), {
            responseType: "json", observe: 'response', params: params
        });
    }

    getById(params: any) {
        return this.areasHttpService.observable_get<any>((this.apiRoot + "/GetEmployeeTransferProposalById"), {
            responseType: "json", observe: 'response', params: params
        });
    }

    save(params: any) {
        return this.areasHttpService.observable_post<any>((this.apiRoot + "/SaveTransferProposal"), params, {
            responseType: "json"
        });
    }
}