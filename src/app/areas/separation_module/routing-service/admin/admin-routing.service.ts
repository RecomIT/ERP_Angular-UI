import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AreasHttpService } from 'src/app/areas/areas.http.service';
import { ApiArea } from 'src/app/shared/constants';

@Injectable({
  providedIn: 'root'
})
export class AdminRoutingService {


  constructor(
    private areasHttpService: AreasHttpService
    ) {}

  routePrefix = 'Separation_Module';
  controllerName = 'RRApprovalForAdmin';
  actionName: string;


  getApprovedResignationRequestsBySupervisorApi<T>(params: any | null): Observable<T> {
    this.actionName = 'GetUserApprovedResignationsBySupervisor';
  
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
