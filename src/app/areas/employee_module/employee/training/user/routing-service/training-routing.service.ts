
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AreasHttpService } from 'src/app/areas/areas.http.service';
import { ApiArea } from 'src/app/shared/constants';

@Injectable({
  providedIn: 'root'
})
export class TrainingRoutingService {

 
  constructor(
    private areasHttpService: AreasHttpService
  ) { }


  routePrefix = 'Employee_Module';
  controllerName = 'TrainingRequest';
  actionName: string;


  getAllTrainingApi<T>(params: any | null): Observable<T> {
    this.actionName = 'GetAllTraining';
  
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



  save(params: any){
    return this.areasHttpService.observable_post<any>((ApiArea.hrms + "/Employee_Module/TrainingRequest" + "/SubmitTrainingRequest"), params, {
        responseType: "json"
    });
  }




  
  getAllTrainingRequestsApi<T>(params: any | null): Observable<T> {
    this.actionName = 'GetTrainingRequests';
  
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








  subordinateRoutePrefix = 'dashboard';
  subordinateControllerName = 'SubordinatesLeave';

  
  getSubordinatesEmployeesApi<T>(params: any | null): Observable<T> {
    this.actionName = 'GetSubordinatesEmployees';
  
    const urlEndpoint = `${this.subordinateRoutePrefix}/${this.subordinateControllerName}/${this.actionName}`;
  
    return this.areasHttpService.observable_get<T>(
      `${ApiArea.hrms}/${urlEndpoint}`,
      {
        params: params,
        responseType: 'json'
      }
    );
  }

}
