import { Injectable } from "@angular/core";
import { AreasHttpService } from "src/app/areas/areas.http.service";
import { ApiArea } from "src/app/shared/constants";
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class DepartmentService {
    constructor(private areasHttpService: AreasHttpService) {
    }

    private Source_of_data = new BehaviorSubject<any[]>([]);
    ddl$ = this.Source_of_data.asObservable();

    get(params: any) {
        return this.areasHttpService.observable_get<any[]>((ApiArea.hrms + "/Employee/Department" + "/GetDepartments"), {
            responseType: "json", params: params
        });
    }

    getById(params: any) {
        return this.areasHttpService.observable_get<any[]>((ApiArea.hrms + "/Employee/Department" + "/GetDepartmentById"), {
            responseType: "json", params: params
        });
    }

    save(params: any) {
        return this.areasHttpService.observable_post<any>((ApiArea.hrms + "/Employee/Department" + "/SaveDepartment"), params, {
            responseType: "json", observe: 'response'
        });
    }

    getDepartmentDropdown() {
       return this.areasHttpService.promise_get<any[]>((ApiArea.hrms + "/Employee/Department" + "/GetDepartmentDropdown"), {
            responseType: "json"
        });
    }

    loadDepartmentDropdown(){
        this.getDepartmentDropdown().then((data) => {
        this.Source_of_data.next(data);
        })
        .catch((error) => {
        console.error('Error while fetching grades:', error);
        });
    }

    // To use dropdown
    // ddlDepartment: any; declare component scope
    // this.loadDropdown(); call in ngOnInit

    // loadDropdown(){
    //     this.gradeService.loadDepartmentDropdown();
    //     this.ddlDepartment = this.gradeService.ddl$;
    //     console.log("ddlDepartment >>>", this.ddlDepartment);
    // }
}