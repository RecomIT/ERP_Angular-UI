import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AreasHttpService } from 'src/app/areas/areas.http.service';
import { ApiArea } from 'src/app/shared/constants';

@Injectable({
  providedIn: 'root'
})
export class LeaveBalanceRoutingService {

  

  constructor(
    private areasHttpService: AreasHttpService
  ) { }


  routePrefix = 'Leave';
  controllerName = 'EmployeeLeaveBalance';
  actionName = 'SaveLeaveBalance';



  getEmployeeLeaveBalances(params: any): Observable<any> {
    const url = `${ApiArea.hrms}/${this.routePrefix}/${this.controllerName}/${'EmployeeLeaveBalances'}`;
    return this.areasHttpService.observable_post<any>(url, params, {
        responseType: 'json'
    });
  }


  getAllEmployeeLeaveBalances(): Observable<any> {
    const url = `${ApiArea.hrms}/${this.routePrefix}/${this.controllerName}/GetAllEmployeeLeaveBalances`;
    const httpOptions = {}; 
    return this.areasHttpService.observable_get<any>(url, httpOptions);
  }


  save(params: any): Observable<any> {
    const url = `${ApiArea.hrms}/${this.routePrefix}/${this.controllerName}/${this.actionName}`;
    return this.areasHttpService.observable_post<any>(url, params, {
        responseType: 'json'
    });
  }


  update(params: any): Observable<any> {
    const url = `${ApiArea.hrms}/${this.routePrefix}/${this.controllerName}/${this.actionName}`;
    return this.areasHttpService.observable_post<any>(url, params, {
        responseType: 'json'
    });
  }



  cancel(params: any){
    return this.areasHttpService.observable_post<any>((ApiArea.hrms + "/Separation_Module/ResignationRequest" + "/CancelResignationRequest"), params, {
        responseType: "json"
    });
  }


  approve(params: any){
    return this.areasHttpService.observable_post<any>((ApiArea.hrms + "/Separation_Module/ResignationRequest" + "/CancelResignationRequest"), params, {
        responseType: "json"
    });
  }



  
}
