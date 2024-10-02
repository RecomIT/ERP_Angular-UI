import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AreasHttpService } from 'src/app/areas/areas.http.service';
import { ApiArea } from 'src/app/shared/constants';

@Injectable({
  providedIn: 'root'
})
export class LeaveTypeRoutingService {

  
  constructor(
    private areasHttpService: AreasHttpService
  ) { }


  routePrefix = 'Leave';
  controllerName = 'LeaveTypes';
  leaveSelect2Action = 'GetSelect2LeaveTypes';


  getSelect2LeaveType(params: any): Observable<any> {
    const url = `${ApiArea.hrms}/${this.routePrefix}/${this.controllerName}/${this.leaveSelect2Action}`;
    return this.areasHttpService.observable_get<any>(url, params);
  }


  encashableLeaveSelect2Action = 'GetSelect2EncashableLeaveTypes';
  getSelect2EncashableLeaveType(params: any): Observable<any> {
    const url = `${ApiArea.hrms}/${this.routePrefix}/${this.controllerName}/${this.encashableLeaveSelect2Action}`;
    return this.areasHttpService.observable_get<any>(url, params);
  }

  encashableLeaveSettingsAction = 'GetEncashableLeaveSettings';

  getEncashableLeaveSettings(params: any): Observable<any> {
    const url = `${ApiArea.hrms}/${this.routePrefix}/${this.controllerName}/${this.encashableLeaveSettingsAction}`;
  
    // Example of httpOptions - adjust as per your API requirements
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        // Add more headers if needed (e.g., Authorization)
      })
    };
  
    return this.areasHttpService.observable_post<any>(url, params, httpOptions);
  }
  


}
