import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AreasHttpService } from 'src/app/areas/areas.http.service';
import { ApiArea } from 'src/app/shared/constants';

@Injectable({
  providedIn: 'root'
})
export class SettlementSetupRoutingService {

  constructor(
    private areasHttpService: AreasHttpService
  ) { }



  save(params: any){
    return this.areasHttpService.observable_post<any>((ApiArea.hrms + "/Separation_Module/EmployeeSettlementSetup" + "/SaveEmployeeSettlementSetup"), params, {
        responseType: "json"
    });
  }




  
  routePrefix = 'Separation_Module';
  controllerName = 'EmployeeSettlementSetup';
  actionName: string;


  getPendingSettlementSetupEmployeesApi<T>(params: any | null): Observable<T> {
    this.actionName = 'GetPendingSettlementSetupEmployees';
  
    const urlEndpoint = `${this.routePrefix}/${this.controllerName}/${this.actionName}`;
  
    return this.areasHttpService.observable_get<T>(
      `${ApiArea.hrms}/${urlEndpoint}`,
      {
        params: params,
        responseType: 'json'
      }
    );
  }





  
  getResignationSetupEmployeeListApi<T>(params: any | null): Observable<T> {
    this.actionName = 'GetResignationSetupEmployees';
  
    const urlEndpoint = `${this.routePrefix}/${this.controllerName}/${this.actionName}`;
  
    return this.areasHttpService.observable_get<T>(
      `${ApiArea.hrms}/${urlEndpoint}`,
      {
        params: params,
        responseType: 'json'
      }
    );
  }



  
  getEmployeeSettlementSetup<T>(params: any | null): Observable<T> {
    this.actionName = 'GetSettlementSetup';

    const urlEndpoint = `${this.routePrefix}/${this.controllerName}/${this.actionName}`;

    return this.areasHttpService.observable_get<T>(
      `${ApiArea.hrms}/${urlEndpoint}`,
      {
        params: params,
        responseType: 'json',
        observe:"response"
      }
    );
  }



  getPendingEmployeeSettlementSetup<T>(params: any | null): Observable<T> {
    this.actionName = 'GetPendingSettlementSetupList';

    const urlEndpoint = `${this.routePrefix}/${this.controllerName}/${this.actionName}`;

    return this.areasHttpService.observable_get<T>(
      `${ApiArea.hrms}/${urlEndpoint}`,
      {
        params: params,
        responseType: 'json',
        observe:"response"
      }
    );
  }

  




}
