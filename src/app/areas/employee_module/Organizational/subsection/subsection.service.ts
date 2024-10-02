import { Injectable } from "@angular/core";
import { AreasHttpService } from "src/app/areas/areas.http.service";
import { ApiArea } from "src/app/shared/constants";
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class SubSectionService {
    constructor(private areasHttpService: AreasHttpService) {
    }

    private Source_of_data = new BehaviorSubject<any[]>([]);
    ddl$ = this.Source_of_data.asObservable();

    get(params: any) {
        return this.areasHttpService.observable_get<any[]>((ApiArea.hrms + "/Employee/SubSection" + "/GetSubSections"), {
            responseType: "json", params: params
        });
    }

    getById(params: any) {
        return this.areasHttpService.observable_get<any[]>((ApiArea.hrms + "/Employee/SubSection" + "/GetSubSectionById"), {
            responseType: "json", params: params
        });
    }

    save(params: any) {
        return this.areasHttpService.observable_post<any>((ApiArea.hrms + "/Employee/SubSection" + "/SaveSubSection"), params, {
            responseType: "json", observe: 'response'
        });
    }

    getSubSectionDropdown(params: any) {
       return this.areasHttpService.promise_get<any[]>((ApiArea.hrms + "/Employee/SubSection" + "/GetSubSectionDropdown"), {
            responseType: "json",params : params
        });
    }

    loadSubSectionDropdown(params: any){
        this.getSubSectionDropdown(params).then((data) => {
        this.Source_of_data.next(data);
        })
        .catch((error) => {
        console.error('Error while fetching grades:', error);
        });
    }

    // To use dropdown
    // ddlSubSection: any; declare component scope
    // this.loadDropdown(); call in ngOnInit

    // loadDropdown(){
    //     this.gradeService.loadSubSectionDropdown();
    //     this.ddlSubSection = this.gradeService.ddl$;
    //     console.log("ddlSubSection >>>", this.ddlSubSection);
    // }
}