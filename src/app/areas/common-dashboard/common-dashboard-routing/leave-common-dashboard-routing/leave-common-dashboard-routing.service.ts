import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AreasHttpService } from 'src/app/areas/areas.http.service';
import { ApiArea } from 'src/app/shared/constants';

@Injectable({
  providedIn: 'root'
})
export class LeaveCommonDashboardRoutingService {

  constructor(
    private areasHttpService: AreasHttpService
    ) {}


    routePrefix = 'dashboard';
    controllerName = 'LeaveCommonDashboard';
    actionName: string;


    getMyLeaveSummaryApi<T>(params: any | null): Observable<T> {
      this.actionName = 'GetMyleaveSummary';
    
      const urlEndpoint = `${this.routePrefix}/${this.controllerName}/${this.actionName}`;
    
      return this.areasHttpService.observable_get<T>(
        `${ApiArea.hrms}/${urlEndpoint}`,
        {
          params: params,
          responseType: 'json'
        }
      );
    }


    getMyLeaveTypeSummaryApi<T>(params: any | null): Observable<T> {
      this.actionName = 'GetMyLeaveTypeSummery';
    
      const urlEndpoint = `${this.routePrefix}/${this.controllerName}/${this.actionName}`;
    
      return this.areasHttpService.observable_get<T>(
        `${ApiArea.hrms}/${urlEndpoint}`,
        {
          params: params,
          responseType: 'json'
        }
      );
    }



    
    getMyLeaveAppliedRecordsApi<T>(params: any | null): Observable<T> {
      this.actionName = 'GetMyLeaveAppliedRecords';
    
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
