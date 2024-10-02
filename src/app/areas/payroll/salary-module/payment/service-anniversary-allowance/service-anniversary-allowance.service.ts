import { Injectable } from '@angular/core';
import { ApiArea } from 'src/app/shared/constants';
import { AreasHttpService } from 'src/app/areas/areas.http.service';

@Injectable({
  providedIn: 'root'
})

export class ServiceAnniversaryAllowanceService {
  private apiRoot: string = ApiArea.payroll + "/Salary/ServiceAnniversaryAllowance";
  constructor(private areasHttpService: AreasHttpService) { }

  get(params: any){
    return this.areasHttpService.observable_get<any>((this.apiRoot + "/GetServiceAnniversaryAllowances"), {
        responseType: "json",observe: 'response', params: params
    });
  }

}
