import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { AreasHttpService } from "src/app/areas/areas.http.service";
import { ApiArea } from "src/app/shared/constants";
import { UtilityService } from "src/app/shared/services/utility.service";

@Injectable({
    providedIn:'root'
})

export class AllowanceNameService{
    constructor(private utilityService: UtilityService, private areasHttpService: AreasHttpService){
    }
    private root = ApiArea.payroll+"/salary_module/AllowanceName";


    private Source_of_data = new BehaviorSubject<any[]>([]);
    ddl$ = this.Source_of_data.asObservable();


    getAllowanceNames(params: any){
        return this.areasHttpService.observable_get<any[]>((this.root + "/GetAllowanceNames"), {
            responseType: "json", params: params
        });
    }

    getAllowanceNameById(params: any){
        return this.areasHttpService.observable_get<any[]>((this.root + "/GetAllowanceNameById"), {
            responseType: "json", params: params
        });
    }

    saveAllowanceName(data: any){
        return this.areasHttpService.observable_post<any>((this.root +"/SaveAllowanceName"), data, {
            responseType: "json", observe: 'response'
        });
    }

    saveAllowanceWithConfig(data: any){
        return this.areasHttpService.observable_post<any>((this.root +"/SaveAllowanceNameWithConfig"), data, {
            responseType: "json", observe: 'response'
        });
    }
    
    loadAllowanceNameDropdown(){
    }
}