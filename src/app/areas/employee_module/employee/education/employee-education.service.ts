import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { AreasHttpService } from "src/app/areas/areas.http.service";
import { ApiArea } from "src/app/shared/constants";

@Injectable({
    providedIn: 'root'
})

export class EmployeeEducationService {
    constructor(private areasHttpService: AreasHttpService) {
    }

    private educationLevel_Source_of_data = new BehaviorSubject<any[]>([]);
    ddl_educationLevel$ = this.educationLevel_Source_of_data.asObservable();

    private educationDegree_Source_of_data = new BehaviorSubject<any[]>([]);
    ddl_educationDegree$ = this.educationDegree_Source_of_data.asObservable();


    get(params: any) {
        return this.areasHttpService.observable_get<any>((ApiArea.hrms + "/Employee/Education" + "/GetEmployeeEducations"), {
            responseType: "json", observe: 'response', params: params
        });
    }

    getById(params: any) {
        return this.areasHttpService.observable_get<any>((ApiArea.hrms + "/Employee/Education" + "/GetEmployeeEducationById"), {
            responseType: "json", observe: 'response', params: params
        });
    }

    save(params: any) {
        return this.areasHttpService.observable_post<any>((ApiArea.hrms + "/Employee/Education" + "/SaveEmployeeEducation"), params, {
            responseType: "json"
        });
    }

    delete(params: any) {
        return this.areasHttpService.observable_post<any>((ApiArea.hrms + "/Employee/Education" + "/DeleteEmployeeEducation"), params, {
            responseType: "json"
        });
    }

    getEducationLevel() {
        return this.areasHttpService.promise_get<any>((ApiArea.hrms + "/Education/EducationLevel" + "/GetLevelOfEducationsDropdown"), {
            responseType: "json"
        });
    }

    loadEducationLevelDropdown() {
        this.getEducationLevel().then((data) => {
            this.educationLevel_Source_of_data.next(data);
        })
            .catch((error) => {
                console.error('Error while fetching data:', error);
            });
    }

    getEducationDegreeDropdown(id: number) {
        return this.areasHttpService.promise_get<any>((ApiArea.hrms + "/Education/EducationalDegree" + "/GetEducationDegreeDropdown/"+id), {
            responseType: "json"
        });
    }

    loadEducationDegreeDropdown(id: number) {
        this.getEducationDegreeDropdown(id).then((data) => {
            this.educationDegree_Source_of_data.next(data);
        })
            .catch((error) => {
                console.error('Error while fetching data:', error);
            });
    }

    
}