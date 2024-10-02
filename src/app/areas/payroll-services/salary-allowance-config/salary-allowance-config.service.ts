import { UtilityService } from "src/app/shared/services/utility.service";
import { AreasHttpService } from "../../areas.http.service";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})

export class SalaryAllowanceConfigService{
    
    private apiRoot: string ="";
    constructor(private utilityService: UtilityService, private areasHttpService: AreasHttpService){
    }

    save(params: any){
        
    }

}