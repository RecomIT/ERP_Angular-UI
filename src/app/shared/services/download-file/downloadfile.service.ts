import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AreasHttpService } from 'src/app/areas/areas.http.service';
import { ApiArea } from '../../constants';

@Injectable({
  providedIn: 'root'
})
export class DownloadfileService {

  constructor(
    private areasHttpService: AreasHttpService,
    private http: HttpClient
  ) { }



  //routePrefix = 'Separation_Module';
  controllerName = 'Download';
  actionName: string;

  
  downloadFile<T>(params: any | null): Observable<Blob> {
    this.actionName = 'DownloadFile';

   const urlEndpoint = `${this.controllerName}/${this.actionName}`;

   return this.areasHttpService.observable_get<Blob>(
     `${ApiArea.hrms}/${urlEndpoint}`,
     {
       params,
       responseType: 'blob' as 'json',
     }
   );

 }


}
