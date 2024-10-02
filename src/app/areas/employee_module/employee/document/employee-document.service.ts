import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { AreasHttpService } from "src/app/areas/areas.http.service";
import { ApiArea } from "src/app/shared/constants";

@Injectable({
    providedIn:'root'
})

export class EmployeeDocumentService{
    constructor(private areasHttpService: AreasHttpService){
    }

    private Source_of_data = new BehaviorSubject<any[]>([]);
    ddl$ = this.Source_of_data.asObservable();

    get(params: any){
        return this.areasHttpService.observable_get<any>((ApiArea.hrms + "/Employee/Document" + "/GetEmployeeDocuments"), {
            responseType: "json", observe: 'response', params: params
        });
    }

    getById(params: any){
        return this.areasHttpService.observable_get<any>((ApiArea.hrms + "/Employee/Document" + "/GetEmployeeDocumentById"), {
            responseType: "json", observe: 'response', params: params
        });
    }

    save(params: any){
        return this.areasHttpService.observable_post<any>((ApiArea.hrms + "/Employee/Document" + "/SaveEmployeeDocument"), params, {
        });
    }

    delete(params: any){
        return this.areasHttpService.observable_post<any>((ApiArea.hrms + "/Employee/Document" + "/DeleteEmployeeSkill"), params, {
            responseType: "json"
        });
    }

    getFile(params: any){
      return  this.areasHttpService.observable_get<any>((ApiArea.hrms +"/Employee/Document"+ "/GetDocument"), {
            responseType: 'blob',
            params: params
        })
    }
}