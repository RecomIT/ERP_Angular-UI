import { Injectable } from "@angular/core";
import { AreasHttpService } from "src/app/areas/areas.http.service";
import { ApiArea } from "src/app/shared/constants";

@Injectable({
    'providedIn':'root'
})

export class EmployeeLogService{
    apiRoot: string =ApiArea.hrms+"/Employee/EmployeeLogger";
    constructor(private areasHttpService: AreasHttpService){}

    get(params: any){
        return this.areasHttpService.observable_get<any>((this.apiRoot + "/GetEmployeeLogReport"), {
            responseType: 'blob' as 'json', params: params
        });
    }
}