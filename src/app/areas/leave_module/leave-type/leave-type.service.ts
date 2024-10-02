import { BehaviorSubject } from "rxjs";
import { AreasHttpService } from "../../areas.http.service";
import { ApiArea } from "src/app/shared/constants";
import { Injectable } from "@angular/core";
@Injectable({
    providedIn:'root'
})

export class LeaveTypeSerive{
    private apiRoot: string =ApiArea.hrms+"/leave/leaveType";
    constructor(private areasHttpService: AreasHttpService) {
    }

    private Source_of_data = new BehaviorSubject<any[]>([]);
    ddl$ = this.Source_of_data.asObservable();

    get(params: any) {
        return this.areasHttpService.observable_get<any[]>((this.apiRoot+ "/GetLeaveTypes"), {
            responseType: "json", params: params
        });
    }

    getById(params: any) {
        return this.areasHttpService.observable_get<any>(( this.apiRoot+ "/GetLeaveTypeById"), {
            responseType: "json", params: params
        });
    }

    save(params: any) {
        return this.areasHttpService.observable_post<any>((this.apiRoot+ "/SaveLeaveType"), params, {
            responseType: "json", observe: 'response'
        });
    }

    getLeaveTypeDropdown() {
       return this.areasHttpService.promise_get<any[]>((this.apiRoot + "/GetLeaveTypesDropdown"), {
            responseType: "json"
        });
    }

    loadLeaveTypeDropdown(){
        this.getLeaveTypeDropdown().then((data) => {
        this.Source_of_data.next(data);
        })
        .catch((error) => {
        console.error('Error while fetching grades:', error);
        });
    }
}