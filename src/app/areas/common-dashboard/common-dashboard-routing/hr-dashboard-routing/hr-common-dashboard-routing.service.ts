import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AreasHttpService } from 'src/app/areas/areas.http.service';
import { ApiArea } from 'src/app/shared/constants';

@Injectable({
  providedIn: 'root'
})
export class HrCommonDashboardRoutingService {

 
  constructor(
    private areasHttpService: AreasHttpService
    ) {}


    routePrefix = 'dashboard';
    controllerName = 'HrDashboard';
    actionName: string;


    
    getTotalEmployeesApi<T>(params: any | null): Observable<T> {
      this.actionName = 'GetTotalEmployees';
    
      const urlEndpoint = `${this.routePrefix}/${this.controllerName}/${this.actionName}`;
    
      return this.areasHttpService.observable_get<T>(
        `${ApiArea.hrms}/${urlEndpoint}`,
        {
          params: params,
          responseType: 'json'
        }
      );
    }


    
    getReligionsApi<T>(params: any | null): Observable<T> {
      this.actionName = 'GetReligions';
    
      const urlEndpoint = `${this.routePrefix}/${this.controllerName}/${this.actionName}`;
    
      return this.areasHttpService.observable_get<T>(
        `${ApiArea.hrms}/${urlEndpoint}`,
        {
          params: params,
          responseType: 'json'
        }
      );
    }


    
    getAverageEmployeeApi<T>(params: any | null): Observable<T> {
      this.actionName = 'GetAverageEmployeeDetails';
    
      const urlEndpoint = `${this.routePrefix}/${this.controllerName}/${this.actionName}`;
    
      return this.areasHttpService.observable_get<T>(
        `${ApiArea.hrms}/${urlEndpoint}`,
        {
          params: params,
          responseType: 'json'
        }
      );
    }



    getHrDashboardDetailsApi<T>(params: any | null): Observable<T> {
      this.actionName = 'GetHrDashboardDetails';
    
      const urlEndpoint = `${this.routePrefix}/${this.controllerName}/${this.actionName}`;
    
      return this.areasHttpService.observable_get<T>(
        `${ApiArea.hrms}/${urlEndpoint}`,
        {
          params: params,
          responseType: 'json'
        }
      );
    }


}
