import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { AreasHttpService } from "src/app/areas/areas.http.service";
import { ApiArea } from "src/app/shared/constants";

@Injectable({
    providedIn:'root'
})

export class EmployeeExperienceService{
    constructor(private areasHttpService: AreasHttpService) {

    }
    private Source_of_data = new BehaviorSubject<any[]>([]);
    ddl_data$ = this.Source_of_data.asObservable();
    ddl$: any;

    get(params: any){
        return this.areasHttpService.observable_get<any>((ApiArea.hrms + "/Employee/Experience" + "/GetEmployeeExperiences"), {
            responseType: "json", observe: 'response', params: params
        });
    }

    getById(params: any){
        return this.areasHttpService.observable_get<any>((ApiArea.hrms + "/Employee/Experience" + "/GetEmployeeExperienceById"), {
            responseType: "json", observe: 'response', params: params
        });
    }

    save(params: any){
        return this.areasHttpService.observable_post<any>((ApiArea.hrms + "/Employee/Experience" + "/SaveEmployeeExperience"), params, {
            responseType: "json"
        });
    }

    delete(params: any){
        return this.areasHttpService.observable_post<any>((ApiArea.hrms + "/Employee/Experience" + "/DeleteEmployeeExperience"), params, {
            responseType: "json"
        });
    }
}