import { Injectable } from "@angular/core";
import { AreasHttpService } from "src/app/areas/areas.http.service";
import { ApiArea } from "src/app/shared/constants";
import { UserService } from "src/app/shared/services/user.service";
import { UtilityService } from "src/app/shared/services/utility.service";

@Injectable({
    providedIn:'root'
})

export class AddSupplementaryAmountService{
    constructor( private userService: UserService,
        public utilityService: UtilityService,
        private areasHttpService : AreasHttpService){}
    
    saveBulk(data: any[]){
        return this.areasHttpService.observable_post<any>(ApiArea.payroll+"/Salary/SupplementaryPayment"+"/SaveBulkSupplementaryPaymentAmount",data,{});
    }

    save(data: any){
        return this.areasHttpService.observable_post<any>(ApiArea.payroll+"/Salary//SupplementaryPayment"+"/SaveSupplementaryPaymentAmount",data,{});
    }
}