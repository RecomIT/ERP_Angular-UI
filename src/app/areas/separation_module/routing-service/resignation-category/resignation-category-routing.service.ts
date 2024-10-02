import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AreasHttpService } from 'src/app/areas/areas.http.service';
import { ApiArea } from 'src/app/shared/constants';

@Injectable({
  providedIn: 'root'
})
export class ResignationCategoryRoutingService {

  constructor(
    private areasHttpService: AreasHttpService
  ) { }

  routePrefix = 'Separation_Module';
  controllerName = 'ResignationCategory';
  actionName: string;


  getResignationCategory<T>(params: any | null): Observable<T> {
    this.actionName = 'GetResignationCategory';
  
    const urlEndpoint = `${this.routePrefix}/${this.controllerName}/${this.actionName}`;
  
    return this.areasHttpService.observable_get<T>(
      `${ApiArea.hrms}/${urlEndpoint}`,
      {
        params: params,
        responseType: 'json'
      }
    );
  }


  
  getResignationSubCategory<T>(params: any | null): Observable<T> {
    this.actionName = 'GetResignationSubCategory';
  
    const urlEndpoint = `${this.routePrefix}/${this.controllerName}/${this.actionName}`;
  
    return this.areasHttpService.observable_get<T>(
      `${ApiArea.hrms}/${urlEndpoint}`,
      {
        params: params,
        responseType: 'json'
      }
    );
  }


  
  getResignationNoticePeriod<T>(params: any | null): Observable<T> {
    this.actionName = 'GetResignationNoticePeriod';
  
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
