import { Injectable } from "@angular/core";
import { AreasHttpService } from "src/app/areas/areas.http.service";
import { ApiArea, ApiController } from "src/app/shared/constants";
import { HrWebService } from "src/app/shared/services/hr-web.service";
import { PayrollWebService } from "src/app/shared/services/payroll-web.service";
import { UserService } from "src/app/shared/services/user.service";
import { UtilityService } from "src/app/shared/services/utility.service";

@Injectable({
    providedIn:'root'
})

export class CashSalaryService{
    private apiRoot: string = ApiArea.payroll + "/Salary";
    constructor( private userService: UserService,
        public utilityService: UtilityService,
        private areasHttpService : AreasHttpService,
        private hrWebService: HrWebService,
        private payrollWebService: PayrollWebService,){}   
        
        User() {
            return this.userService.User();
        }
      
        // ddlBanks: any[] = [];
        // loadBanks() {
        //     this.areasHttpService.observable_get<any>((ApiArea.hrms + ApiController.hr + "/GetBanks"), {
        //         responseType: "json", params: {
        //             ComId: this.User().ComId, OrgId: this.User().OrgId, UserId: this.User().UserId
        //         }
        //     }).subscribe(data => {
        //         this.ddlBanks = data as any[];
        //     })
        // }

        downloadCashSalarySheetAsync(params: any){
            return this.areasHttpService.observable_get<any>(ApiArea.payroll + "/Salary/CashSalary" + "/DownloadCashSalarySheet",{
                responseType: "blob", params: params
            });
         }

         downloadActualCashSalarySheetAsync(params: any){
            return this.areasHttpService.observable_get<any>(ApiArea.payroll + "/Salary/CashSalary" + "/DownloadActualCashSalarySheet",{
                responseType: "blob", params: params
            });
         }

        // SavePayrollCardInfoAsync(data: any){
        // return this.areasHttpService.observable_post<any>(ApiArea.payroll+ ApiController.cash_Salary +"/SavePayrollCardInfo",data,{});
      // }
    
}