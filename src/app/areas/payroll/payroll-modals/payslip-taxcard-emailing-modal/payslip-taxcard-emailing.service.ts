import { Injectable, OnInit } from "@angular/core";
import { AreasHttpService } from "src/app/areas/areas.http.service";
import { ApiArea } from "src/app/shared/constants";
import { UtilityService } from "src/app/shared/services/utility.service";

@Injectable({
    providedIn: 'root'
})

export class PayslipTaxCardEmailingServiceModel{

    constructor(private utilityService: UtilityService, private areasHttpService: AreasHttpService){
    }

    sendEmail(params:any) {
        return this.areasHttpService.observable_get<any[]>((ApiArea.payroll + "/Salary/SalaryReport" + "/PayslipOrTaxCardEmailing"), {
             responseType: "json", params: params
         });
     }
}