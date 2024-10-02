import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AreasHttpService } from 'src/app/areas/areas.http.service';
import { ApiArea } from 'src/app/shared/constants';

@Injectable({
  providedIn: 'root'
})
export class SupervisorRoutingService {

  constructor(
    private areasHttpService: AreasHttpService
    ) {}

  routePrefix = 'Separation_Module';
  controllerName = 'RRApprovalForSupervisor';
  actionName: string;


  getUserResignationRequestsForSupervisor<T>(params: any | null): Observable<T> {
    this.actionName = 'GetUserResignationsForSupervisor';
  
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
