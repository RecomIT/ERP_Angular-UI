import { BehaviorSubject } from "rxjs";
import { Injectable } from "@angular/core";
import { ApiArea } from "src/app/shared/constants";
import { AreasHttpService } from "src/app/areas/areas.http.service";

@Injectable({
    providedIn:'root'
})

export class EmployeeSkillService{
    constructor(private areasHttpService: AreasHttpService) {
    }

    private Source_of_data = new BehaviorSubject<any[]>([]);
    ddl_data$ = this.Source_of_data.asObservable();
    ddl$: any;

    get(params: any){
        return this.areasHttpService.observable_get<any>((ApiArea.hrms + "/Employee/Skill" + "/GetEmployeeSkills"), {
            responseType: "json", observe: 'response', params: params
        });
    }

    getById(params: any){
        return this.areasHttpService.observable_get<any>((ApiArea.hrms + "/Employee/Skill" + "/GetEmployeeSkillById"), {
            responseType: "json", observe: 'response', params: params
        });
    }

    save(params: any){
        return this.areasHttpService.observable_post<any>((ApiArea.hrms + "/Employee/Skill" + "/SaveEmployeeSkill"), params, {
            responseType: "json"
        });
    }

    delete(params: any){
        return this.areasHttpService.observable_post<any>((ApiArea.hrms + "/Employee/Skill" + "/DeleteEmployeeSkill"), params, {
            responseType: "json"
        });
    }
}