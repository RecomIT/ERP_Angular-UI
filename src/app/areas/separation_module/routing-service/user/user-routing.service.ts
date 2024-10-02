import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AreasHttpService } from 'src/app/areas/areas.http.service';
import { ApiArea } from 'src/app/shared/constants';

@Injectable({
  providedIn: 'root'
})
export class UserRoutingService {

  constructor(
    private areasHttpService: AreasHttpService
    ) {}

    routePrefix = 'Separation_Module';
    controllerName = 'EmployeeInfo';
    actionName: string;


    getEmployeeInfoApi<T>(params: any | null): Observable<T> {
      this.actionName = 'GetEmployeeInfo';
    
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


    userResignationRequestController = 'UserResignationRequest';
    getUserResignationRequestsApi<T>(params: any | null): Observable<T> {
      this.actionName = 'GetUserResignations';
    
      const urlEndpoint = `${this.routePrefix}/${this.userResignationRequestController}/${this.actionName}`;
    
      return this.areasHttpService.observable_get<T>(
        `${ApiArea.hrms}/${urlEndpoint}`,
        {
          params: params,
          responseType: 'json',
          observe:"response"
        }
      );
    }





    // ----------------------

    
    getEmployeesAsync<T>(params: any | null): Observable<T> {
      this.actionName = 'GetAllEmployees';
    
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
