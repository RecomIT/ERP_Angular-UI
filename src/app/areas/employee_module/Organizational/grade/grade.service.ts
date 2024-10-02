import { Injectable } from "@angular/core";
import { AreasHttpService } from "src/app/areas/areas.http.service";
import { ApiArea } from "src/app/shared/constants";
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class  GradeService{
    constructor(private areasHttpService: AreasHttpService) {
    }

    private Source_of_data = new BehaviorSubject<any[]>([]);
    ddl$ = this.Source_of_data.asObservable();

    get(params: any) {
        return this.areasHttpService.observable_get<any[]>((ApiArea.hrms + "/Employee/Grade" + "/GetGrades"), {
            responseType: "json", params: params
        });
    }

    getById(params: any) {
        return this.areasHttpService.observable_get<any[]>((ApiArea.hrms + "/Employee/Grade" + "/GetGradeById"), {
            responseType: "json", params: params
        });
    }

    save(params: any) {
        return this.areasHttpService.observable_post<any>((ApiArea.hrms + "/Employee/Grade" + "/SaveGrade"), params, {
            responseType: "json", observe: 'response'
        });
    }

    getGradeDropdown() {
       return this.areasHttpService.promise_get<any[]>((ApiArea.hrms + "/Employee/Grade" + "/GetGradeDropdown"), {
            responseType: "json"
        });
    }

    loadGradeDropdown(){
        this.getGradeDropdown().then((data) => {
        this.Source_of_data.next(data);
        })
        .catch((error) => {
        console.error('Error while fetching grades:', error);
        });
    }
}