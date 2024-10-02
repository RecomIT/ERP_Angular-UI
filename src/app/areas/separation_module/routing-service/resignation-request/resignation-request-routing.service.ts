import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AreasHttpService } from 'src/app/areas/areas.http.service';
import { ApiArea } from 'src/app/shared/constants';

@Injectable({
  providedIn: 'root'
})
export class ResignationRequestRoutingService {


  constructor(
    private areasHttpService: AreasHttpService,
    private http: HttpClient
  ) { }



  routePrefix = 'Separation_Module';
  controllerName = 'ResignationRequest';
  actionName: string;


  getEmployeeDetails<T>(params: any | null): Observable<T> {
    this.actionName = 'GetEmployeeDetails';
  
    const urlEndpoint = `${this.routePrefix}/${this.controllerName}/${this.actionName}`;
  
    return this.areasHttpService.observable_get<T>(
      `${ApiArea.hrms}/${urlEndpoint}`,
      {
        params: params,
        responseType: 'json'
      }
    );
  }



  
  getEmployeesDetailsAsync<T>(params: any | null): Observable<T> {
    this.actionName = 'GetEmployeesDetails';
  
    const urlEndpoint = `${this.routePrefix}/${this.controllerName}/${this.actionName}`;
  
    return this.areasHttpService.observable_get<T>(
      `${ApiArea.hrms}/${urlEndpoint}`,
      {
        params: params,
        responseType: 'json'
      }
    );
  }



  
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



  save(params: any){
    return this.areasHttpService.observable_post<any>((ApiArea.hrms + "/Separation_Module/ResignationRequest" + "/SubmitResignationRequest"), params, {
        responseType: "json"
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



  
  getEmployeeResignationListAsync<T>(params: any | null): Observable<T> {
    this.actionName = 'GetEmployeeResignationList';
  
    const urlEndpoint = `${this.routePrefix}/${this.controllerName}/${this.actionName}`;
  
    return this.areasHttpService.observable_get<T>(
      `${ApiArea.hrms}/${urlEndpoint}`,
      {
        params: params,
        responseType: 'json'
      }
    );
  }



  // ------------------------------- User

  getUserResignationListAsync<T>(params: any | null): Observable<T> {
    this.actionName = 'GetUserResignationList';
  
    const urlEndpoint = `${this.routePrefix}/${this.controllerName}/${this.actionName}`;
  
    return this.areasHttpService.observable_get<T>(
      `${ApiArea.hrms}/${urlEndpoint}`,
      {
        params: params,
        responseType: 'json'
      }
    );
  }



  
  getEmployeeResignationListForSupervisorAsync<T>(params: any | null): Observable<T> {
    this.actionName = 'GetEmployeeResignationListForSupervisor';
  
    const urlEndpoint = `${this.routePrefix}/${this.controllerName}/${this.actionName}`;
  
    return this.areasHttpService.observable_get<T>(
      `${ApiArea.hrms}/${urlEndpoint}`,
      {
        params: params,
        responseType: 'json'
      }
    );
  }


  downloadFile<T>(params: any | null): Observable<Blob> {
     this.actionName = 'DownloadFile';

    const urlEndpoint = `${this.routePrefix}/${this.controllerName}/${this.actionName}`;

    return this.areasHttpService.observable_get<Blob>(
      `${ApiArea.hrms}/${urlEndpoint}`,
      {
        params,
        responseType: 'blob' as 'json',
      }
    );
 
  }
  
  

}
