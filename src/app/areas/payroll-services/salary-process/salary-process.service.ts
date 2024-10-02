import { Injectable } from "@angular/core";
import { AreasHttpService } from "../../areas.http.service";
import { ApiArea, ApiController } from "src/app/shared/constants";

@Injectable({
    providedIn: 'root'
})
export class SalaryProcessService {
    constructor(private areasHttpService: AreasHttpService){

    }

    downloadActualSalarySheet(params:any) {
         return this.areasHttpService.observable_get<any>((ApiArea.payroll + "/SalaryReport" + "/DownloadActualSalarySheet"), {
            responseType: "blob", params:params
          });
     }

     downloadPWCActualSalarySheet(params:any) {
        return this.areasHttpService.observable_get<any>((ApiArea.payroll + "/SalaryReport" + "/DownloadPWCSalarySheet"), {
           responseType: "blob", params:params
         });
    }

  
}