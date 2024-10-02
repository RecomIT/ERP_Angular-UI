import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AreasHttpService } from 'src/app/areas/areas.http.service';
import { ApiArea } from 'src/app/shared/constants';

@Injectable({
  providedIn: 'root'
})
export class EmployeeLeaveDashboardRoutingService {

  constructor(
    private areasHttpService: AreasHttpService
  ) { }

  routePrefix = 'dashboard';
  controllerName = 'EmployeeLeaveDetails';
  actionName: string;

  getEmployeesAsync<T>(params: any | null): Observable<T> {
    this.actionName = 'GetEmployees';

    const urlEndpoint = `${this.routePrefix}/${this.controllerName}/${this.actionName}`;

    return this.areasHttpService.observable_get<T>(
      `${ApiArea.hrms}/${urlEndpoint}`,
      {
        params: params,
        responseType: 'json'
      }
    );
  }

  getEmployeesLeaveDetailsApi<T>(params: any | null): Observable<T> {
    this.actionName = 'GetEmplloyeesLeaveDetails';

    const urlEndpoint = `${this.routePrefix}/${this.controllerName}/${this.actionName}`;

    return this.areasHttpService.observable_get<T>(
      `${ApiArea.hrms}/${urlEndpoint}`,
      {
        params: params,
        responseType: 'json',
        observe: "response"
      }
    );
  }

  getEmployeesLeaveApprovalApi<T>(params: any | null): Observable<T> {
    this.actionName = 'GetEmployeesLeaveApproval';

    const urlEndpoint = `${this.routePrefix}/${this.controllerName}/${this.actionName}`;

    return this.areasHttpService.observable_get<T>(
      `${ApiArea.hrms}/${urlEndpoint}`,
      {
        params: params,
        responseType: 'json',
        observe: "response"
      }
    );
  }

  downloadLeaveCard<T>(employeeId): Observable<T> {
    const urlEndpoint = `leave/leaveReport/GetEmployeeLeaveCard?employeeId=` + employeeId;
    return this.areasHttpService.observable_get<any>(`${ApiArea.hrms}/${urlEndpoint}`, {
      responseType: 'blob' as 'json'
    });
  }

  leave = 'leave';
  emailApproval = 'EmailApproval';
  getEmployeesLeaveApprovalApiForEmail<T>(params: any | null): Observable<T> {
    this.actionName = 'GetEmployeesLeaveApproval';

    const urlEndpoint = `${this.leave}/${this.emailApproval}/${this.actionName}`;

    return this.areasHttpService.observable_get<T>(
      `${ApiArea.hrms}/${urlEndpoint}`,
      {
        params: params,
        responseType: 'json',
        observe: "response"
      }
    );
  }


  getLeavePeriodYearAsync<T>(params: any | null): Observable<T> {
    this.actionName = 'GetLeavePeriodsYears';

    const urlEndpoint = `${this.routePrefix}/${'MyLeaveHistory'}/${this.actionName}`;

    return this.areasHttpService.observable_get<T>(
      `${ApiArea.hrms}/${urlEndpoint}`,
      {
        params: params,
        responseType: 'json'
      }
    );
  }



  getLeavePeriodMonthAsync<T>(params: any | null): Observable<T> {
    this.actionName = 'GetLeavePeriodMonths';

    const urlEndpoint = `${this.routePrefix}/${'MyLeaveHistory'}/${this.actionName}`;

    return this.areasHttpService.observable_get<T>(
      `${ApiArea.hrms}/${urlEndpoint}`,
      {
        params: params,
        responseType: 'json'
      }
    );
  }



  getMyLeaveHistoryAsync<T>(params: any | null): Observable<T> {
    this.actionName = 'GetMyLeaveHistory';

    const urlEndpoint = `${this.routePrefix}/${'MyLeaveHistory'}/${this.actionName}`;

    return this.areasHttpService.observable_get<T>(
      `${ApiArea.hrms}/${urlEndpoint}`,
      {
        params: params,
        responseType: 'json'
      }
    );
  }

}
