import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AreasHttpService } from 'src/app/areas/areas.http.service';
import { ApiArea } from 'src/app/shared/constants';

@Injectable({
  providedIn: 'root'
})
export class SubordinatesLeaveDashboardRoutingService {

  constructor(
    private areasHttpService: AreasHttpService
    ) {}


    routePrefix = 'dashboard';
    controllerName = 'SubordinatesLeave';
    actionName: string;


    
   getIsSupervisorOrFinalApprovalApi<T>(params: any | null): Observable<T> {
      this.actionName = 'IsSupervisorOrFinalApproval';
    
      const urlEndpoint = `${this.routePrefix}/${this.controllerName}/${this.actionName}`;
    
      return this.areasHttpService.observable_get<T>(
        `${ApiArea.hrms}/${urlEndpoint}`,
        {
          params: params,
          responseType: 'json'
        }
      );
    }


    getSubordinatesEmployeesApi<T>(params: any | null): Observable<T> {
      this.actionName = 'GetSubordinatesEmployees';
    
      const urlEndpoint = `${this.routePrefix}/${this.controllerName}/${this.actionName}`;
    
      return this.areasHttpService.observable_get<T>(
        `${ApiArea.hrms}/${urlEndpoint}`,
        {
          params: params,
          responseType: 'json'
        }
      );
    }



    getSubordinatesLeaveDetailsApi<T>(params: any | null): Observable<T> {
      this.actionName = 'GetSubordinatesLeaveDetails';
    
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



    
    getSubordinatesLeaveApprovalApi<T>(params: any | null): Observable<T> {
      this.actionName = 'GetSubordinatesLeaveApproval';
    
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
