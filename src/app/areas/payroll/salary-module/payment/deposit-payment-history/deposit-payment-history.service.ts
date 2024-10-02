import { Injectable } from "@angular/core";
import { AreasHttpService } from "src/app/areas/areas.http.service";
import { ApiArea } from "src/app/shared/constants";

@Injectable({
    providedIn: 'root'
})

export class DepositPaymentHistoryService {
    private apiRoot: string = ApiArea.payroll + "/Salary/DepositAllowancePaymentHistory";
    constructor(private areasHttpService: AreasHttpService) { }

    save(params: any){
        return this.areasHttpService.observable_post<any>((this.apiRoot + "/SavePaymentOfDepositAmount"), params, {
            responseType: "json"
          });
    }
}