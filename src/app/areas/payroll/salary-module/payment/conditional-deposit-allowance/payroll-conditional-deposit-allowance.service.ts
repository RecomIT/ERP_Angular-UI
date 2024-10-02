import { Injectable } from '@angular/core';
import { ApiArea } from 'src/app/shared/constants';
import { AreasHttpService } from 'src/app/areas/areas.http.service';

@Injectable({
  providedIn: 'root'
})
export class PayrollConditionalDepositAllowanceService {

  private apiRoot: string = ApiArea.payroll + "/Salary/ConditionalDeposit";
  constructor(private areasHttpService: AreasHttpService) { }

  get(params: any) {
    return this.areasHttpService.observable_get<any>((this.apiRoot + "/GetConditionalDepositAllowanceConfigs"), {
      responseType: "json", observe: 'response', params: params
    });
  }

  getById(params: any) {
    return this.areasHttpService.observable_get<any>((this.apiRoot + "/GetConditionalDepositAllowanceConfigById"), {
      responseType: "json", observe: 'response', params: params
    });
  }

  save(params: any) {
    return this.areasHttpService.observable_post<any>((this.apiRoot + "/Save"), params, {
      responseType: "json"
    });
  }

  getEmployeeEligibleDepositPayment(params: any){
    return this.areasHttpService.observable_get<any>((this.apiRoot + "/GetEmployeeEligibleDepositPayment"), {
      responseType: "json", observe: 'response', params: params
    });
  }

  getEligibleEmployeesByConfigId(id: any){
    return this.areasHttpService.promise_get<any[]>((this.apiRoot + "/GetEligibleEmployeesByConfigId"), {
      responseType: "json", params: {configId:id}
    });
  }

}
