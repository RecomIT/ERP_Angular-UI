import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AreasHttpService } from 'src/app/areas/areas.http.service';
import { ApiArea } from 'src/app/shared/constants';

@Injectable({
  providedIn: 'root'
})
export class AttendanceCommonDashboardRoutingService {

  constructor(
    private areasHttpService: AreasHttpService, 
    ) {}
  
    routePrefix = 'dashboard';
    controllerName = 'AttendanceCommonDashboard';
    actionName: string;

    getMyAttendanceYearsApi<T>(params: any | null): Observable<T> {
      this.actionName = 'GetEmployeeAttendanceYears';
    
      const urlEndpoint = `${this.routePrefix}/${this.controllerName}/${this.actionName}`;
    
      return this.areasHttpService.observable_get<T>(
        `${ApiArea.hrms}/${urlEndpoint}`,
        {
          params: params,
          responseType: 'json'
        }
      );
    }


    getMyAttendanceMonthsByYearApi<T>(params: any | null): Observable<T> {
      this.actionName = 'GetAttendanceMonthWithDataByYear';
    
      const urlEndpoint = `${this.routePrefix}/${this.controllerName}/${this.actionName}`;
    
      return this.areasHttpService.observable_get<T>(
        `${ApiArea.hrms}/${urlEndpoint}`,
        {
          params: params,
          responseType: 'json'
        }
      );
    }


    getMyAttendanceApi<T>(params: any | null): Observable<T> {
      this.actionName = 'GetMyAttendanceSummary';
    
      const urlEndpoint = `${this.routePrefix}/${this.controllerName}/${this.actionName}`;
    
      return this.areasHttpService.observable_get<T>(
        `${ApiArea.hrms}/${urlEndpoint}`,
        {
          params: params,
          responseType: 'json'
        }
      );
    }

    
    getMyRecentAttendanceApi<T>(params: any | null): Observable<T> {
      this.actionName = 'GetGeoLocationAttendanceData';
    
      const urlEndpoint = `${this.routePrefix}/${this.controllerName}/${this.actionName}`;
    
      return this.areasHttpService.observable_get<T>(
        `${ApiArea.hrms}/${urlEndpoint}`,
        {
          params: params,
          responseType: 'json'
        }
      );
    }




    
    getEmployeeWorkShiftApi<T>(params: any | null): Observable<T> {
      this.actionName = 'GetEmployeeWorkShift';
    
      const urlEndpoint = `${this.routePrefix}/${this.controllerName}/${this.actionName}`;
    
      return this.areasHttpService.observable_get<T>(
        `${ApiArea.hrms}/${urlEndpoint}`,
        {
          params: params,
          responseType: 'json'
        }
      );
    }





    
    getCheckPunchInPunchOutApi<T>(params: any | null): Observable<T> {
      this.actionName = 'CheckPunchInAndPunchOut';
    
      const urlEndpoint = `${this.routePrefix}/${this.controllerName}/${this.actionName}`;
    
      return this.areasHttpService.observable_get<T>(
        `${ApiArea.hrms}/${urlEndpoint}`,
        {
          params: params,
          responseType: 'json'
        }
      );
    }





    
    getMyGeoLocationAttendanceApi<T>(params: any | null): Observable<T> {
      this.actionName = 'GetMyGeoLocationAttendance';
    
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
    
    



    employeeControllerName = 'EmployeeLeaveDetails';
    getEmployeesAsync<T>(params: any | null): Observable<T> {
      this.actionName = 'GetEmployees';
    
      const urlEndpoint = `${this.routePrefix}/${this.employeeControllerName}/${this.actionName}`;
    
      return this.areasHttpService.observable_get<T>(
        `${ApiArea.hrms}/${urlEndpoint}`,
        {
          params: params,
          responseType: 'json'
        }
      );
    }
    
    
}
