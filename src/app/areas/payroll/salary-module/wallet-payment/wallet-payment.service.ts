import { Injectable } from "@angular/core";
import { AreasHttpService } from "src/app/areas/areas.http.service";
import { ApiArea, ApiController } from "src/app/shared/constants";
import { UserService } from "src/app/shared/services/user.service";
import { UtilityService } from "src/app/shared/services/utility.service";

@Injectable({
    providedIn:'root'
})

export class WalletPaymentService{
    constructor( private userService: UserService,
        public utilityService: UtilityService,
        private areasHttpService : AreasHttpService
    ){}   
 
    getInternalDesignations<T>(internalDesignationId: number = 0): Promise<T> {
        return this.areasHttpService.promise_get<T>((ApiArea.payroll + "/Salary/WalletPayment" + "/GetInternalDesignationExtension"),
            {
                responseType: "json",
                params: {
                    internalDesignationId: internalDesignationId                  
                }
            });
    }

    getWalletConfigs(params: any){
        return this.areasHttpService.observable_get<any>((ApiArea.payroll + "/Salary/WalletPayment" + "/GetWalletPaymentConfigurations"), {
            responseType: "json",observe: 'response', params: params
        });
    }

    saveWalletPaymentConfig(data: any){
        return this.areasHttpService.observable_post<any>(ApiArea.payroll+ "/Salary/WalletPayment" +"/SaveWalletPaymentConfigurations",data,{});
    }

    updateWalletPaymentConfig(data: any){
        return this.areasHttpService.observable_put<any>(ApiArea.payroll+ "/Salary/WalletPayment" +"/UpdateWalletPaymentConfigurations",data,{
            // 'headers': { 'Content-Type': 'application/json' }
        });
    }

    getWalletPaymentConfigById(params: any){
        return this.areasHttpService.observable_get<any>((ApiArea.payroll + "/Salary/WalletPayment" + "/GetWalletPaymentConfigById"), {
            responseType: "json", params: params         
        });
    }

}