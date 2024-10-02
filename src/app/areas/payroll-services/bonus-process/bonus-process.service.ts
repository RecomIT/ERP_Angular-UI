import { Injectable } from "@angular/core";
import { UtilityService } from "src/app/shared/services/utility.service";
import { AreasHttpService } from "../../areas.http.service";
import { ApiArea, ApiController } from "src/app/shared/constants";

@Injectable({
    providedIn: 'root'
})
export class BonusProcessService {

    constructor(private utilityService: UtilityService, private areasHttpService: AreasHttpService){
    }

    getBonusProcessesInfo(params:any) {
       return this.areasHttpService.observable_get<any[]>((ApiArea.payroll + "/Salary/BonusProcess" + "/GetBonusProcessInfo"), {
            responseType: "json",observe: 'response', params: params
        });
    }

    getBonusProcessDetails(params:any) {
        return this.areasHttpService.observable_get<any[]>((ApiArea.payroll + "/Salary/BonusProcess" + "/GetBonusProcessDetails"), {
             responseType: "json",observe: 'response', params: params
         });
     }

     disbursedBonus(data: any,params: any){
        return this.areasHttpService.observable_post<any>((ApiArea.payroll + "/Salary/BonusProcess" + "/DisbursedBonus"),data,{
            params: params
        })
     }

     undoBonus(data: any,params: any){
        return this.areasHttpService.observable_post<any>((ApiArea.payroll +  "/Salary/BonusProcess" + "/UndoBonus"),data,{
            params: params
        })
     }

     undoEmployeeBonus(data: any,params: any){
        return this.areasHttpService.observable_post<any>((ApiArea.payroll + "/Salary/BonusProcess" + "/UndoEmployeeBonus"),data,{
            params: params
        })
     }
    
}