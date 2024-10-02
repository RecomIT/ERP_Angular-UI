import { Injectable } from '@angular/core';
import { AttendanceCommonDashboardRoutingService } from './attendance-common-dashboard-routing/attendance-common-dashboard-routing.service';
import { AreasHttpService } from '../../areas.http.service';
import { Observable } from 'rxjs';
import { ApiArea } from 'src/app/shared/constants';
import { LeaveCommonDashboardRoutingService } from './leave-common-dashboard-routing/leave-common-dashboard-routing.service';

@Injectable({
  providedIn: 'root'
})
export class CommonDashboardRoutingService {

  constructor(
    private areasHttpService: AreasHttpService, 
    private myAttendanceApi: AttendanceCommonDashboardRoutingService,
    private myLeaveApi: LeaveCommonDashboardRoutingService
  ) {}


  routePrefix = 'dashboard';
  controllerName = 'CommonDashboard';
  actionName: string;
  
  
  getCompanyHolidayAndEventsApi<T>(params: any | null): Observable<T> {
    this.actionName = 'GetCompanyHolidayAndEvents';
  
    const urlEndpoint = `${this.routePrefix}/${this.controllerName}/${this.actionName}`;
  
    return this.areasHttpService.observable_get<T>(
      `${ApiArea.hrms}/${urlEndpoint}`,
      {
        params: params,
        responseType: 'json'
      }
    );
  }




  private apiRoot: string=ApiArea.hrms+"/dashboard/CommonDashboard";
  save(params: any){
    return this.areasHttpService.observable_post<any>((this.apiRoot + "/SaveCompanyEvent"), params, {
        responseType: "json"
    });
  }



  
  getEmployeeBloodGroupsApi<T>(params: any | null): Observable<T> {
    this.actionName = 'GetBloodGroups';
  
    const urlEndpoint = `${this.routePrefix}/${this.controllerName}/${this.actionName}`;
  
    return this.areasHttpService.observable_get<T>(
      `${ApiArea.hrms}/${urlEndpoint}`,
      {
        params: params,
        responseType: 'json'
      }
    );
  }




  getEmployeeContactApi<T>(params: any | null): Observable<T> {
    this.actionName = 'GetEmployeeContact';
  
    const urlEndpoint = `${this.routePrefix}/${this.controllerName}/${this.actionName}`;
  
    return this.areasHttpService.observable_get<T>(
      `${ApiArea.hrms}/${urlEndpoint}`,
      {
        params: params,
        responseType: 'json'
      }
    );
  }

  getMyAttendanceYearsApi<T>(params: any | null): Observable<T> {
    return this.myAttendanceApi.getMyAttendanceYearsApi<T>(params);
  }

  getMyAttendanceMonthsByYearApi<T>(params: any | null): Observable<T> {
    return this.myAttendanceApi.getMyAttendanceMonthsByYearApi<T>(params);
  }

  getMyAttendanceApi<T>(params: any | null): Observable<T> {
    return this.myAttendanceApi.getMyAttendanceApi<T>(params);
  }


  getMyRecentAttendanceApi<T>(params: any | null): Observable<T> {
    return this.myAttendanceApi.getMyRecentAttendanceApi<T>(params);
  }

  getMyLeaveSummaryApi<T>(params: any | null): Observable<T> {
    return this.myLeaveApi.getMyLeaveSummaryApi<T>(params);
  }


  getMyLeaveTypeSummaryApi<T>(params: any | null): Observable<T> {
    return this.myLeaveApi.getMyLeaveTypeSummaryApi<T>(params);
  }


  getEmployeeWorkShiftApi<T>(params: any | null): Observable<T> {
    return this.myAttendanceApi.getEmployeeWorkShiftApi<T>(params);
  }


  
  getCheckPunchInAndPunchOutApi<T>(params: any | null): Observable<T> {
    return this.myAttendanceApi.getCheckPunchInPunchOutApi<T>(params);
  }

}
