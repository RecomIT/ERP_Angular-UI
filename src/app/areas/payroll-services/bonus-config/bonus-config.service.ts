import { Injectable } from "@angular/core";
import { UtilityService } from "src/app/shared/services/utility.service";
import { AreasHttpService } from "../../areas.http.service";
import { ApiArea, ApiController } from "src/app/shared/constants";


@Injectable({
    providedIn: 'root'
})

export class BonusConfigService{
    constructor(private utilityService: UtilityService, private areasHttpService: AreasHttpService){
    }

    getExcludedEmployeesFromBonus(params:any) {
        return this.areasHttpService.observable_get<any[]>((ApiArea.payroll + "/Salary/BonusProcess" + "/GetExcludedEmployeesFromBonus"), {
             responseType: "json", params: params
         });
     }

     saveExcludeEmployeeFromBonus(params:any) {
        return this.areasHttpService.observable_post<any>((ApiArea.payroll + "/Salary/BonusProcess" + "/SaveExcludeEmployeeFromBonus"),params, {
             responseType: "json",observe: 'response'
         });
     }

     deleteEmployeeFromExcludeListAsync(params:any) {
        return this.areasHttpService.observable_post<any>((ApiArea.payroll + "/Salary/BonusProcess" + "/DeleteEmployeeFromExcludeList"),params, {
             responseType: "json",observe: 'response'
         });
     }
}

