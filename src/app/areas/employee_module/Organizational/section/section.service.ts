import { Injectable } from "@angular/core";
import { AreasHttpService } from "src/app/areas/areas.http.service";
import { ApiArea } from "src/app/shared/constants";
import { UtilityService } from "src/app/shared/services/utility.service";
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class SectionService {
    constructor(private utilityService: UtilityService, private areasHttpService: AreasHttpService) {
    }

    private Source_of_data = new BehaviorSubject<any[]>([]);
    ddl$ = this.Source_of_data.asObservable();

    get(params: any) {
        return this.areasHttpService.observable_get<any[]>((ApiArea.hrms + "/Employee/Section" + "/GetSections"), {
            responseType: "json", params: params
        });
    }

    getById(params: any) {
        return this.areasHttpService.observable_get<any[]>((ApiArea.hrms + "/Employee/Section" + "/GetSectionById"), {
            responseType: "json", params: params
        });
    }

    save(params: any) {
        return this.areasHttpService.observable_post<any>((ApiArea.hrms + "/Employee/Section" + "/SaveSection"), params, {
            responseType: "json", observe: 'response'
        });
    }

    getSectionDropdown(params: any) {
       return this.areasHttpService.promise_get<any[]>((ApiArea.hrms + "/Employee/Section" + "/GetSectionDropdown"), {
            responseType: "json", params: params
        });
    }

    loadSectionDropdown(params: any){
        this.getSectionDropdown(params).then((data) => {
        this.Source_of_data.next(data);
        })
        .catch((error) => {
        console.error('Error while fetching grades:', error);
        });
    }

    // To use dropdown
    // ddlSection: any; declare component scope
    // this.loadDropdown(); call in ngOnInit

    // loadDropdown(){
    //     this.gradeService.loadSectionDropdown();
    //     this.ddlSection = this.gradeService.ddl$;
    //     console.log("ddlSection >>>", this.ddlSection);
    // }
}