import { Injectable } from "@angular/core";
import { AreasHttpService } from "src/app/areas/areas.http.service";
import { ApiArea } from "src/app/shared/constants";
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class DesignationService {
    constructor(private areasHttpService: AreasHttpService) {
    }

    private Source_of_data = new BehaviorSubject<any[]>([]);
    ddl$ = this.Source_of_data.asObservable();

    get(params: any) {
        return this.areasHttpService.observable_get<any[]>((ApiArea.hrms + "/Employee/Designation" + "/GetDesignations"), {
            responseType: "json", params: params
        });
    }

    getById(params: any) {
        return this.areasHttpService.observable_get<any[]>((ApiArea.hrms + "/Employee/Designation" + "/GetDesignationById"), {
            responseType: "json", params: params
        });
    }

    save(params: any) {
        return this.areasHttpService.observable_post<any>((ApiArea.hrms + "/Employee/Designation" + "/SaveDesignation"), params, {
            responseType: "json", observe: 'response'
        });
    }

    getDesignationDropdown() {
       return this.areasHttpService.promise_get<any[]>((ApiArea.hrms + "/Employee/Designation" + "/GetDesignationDropdown"), {
            responseType: "json"
        });
    }

    loadDesignationDropdown(){
        this.getDesignationDropdown().then((data) => {
        this.Source_of_data.next(data);
        })
        .catch((error) => {
        console.error('Error while fetching grades:', error);
        });
    }

    // To use dropdown
    // ddlDesignation: any; declare component scope
    // this.loadDropdown(); call in ngOnInit

    // loadDropdown(){
    //     this.gradeService.loadDesignationDropdown();
    //     this.ddlDesignation = this.gradeService.ddl$;
    //     console.log("ddlDesignation >>>", this.ddlDesignation);
    // }
}