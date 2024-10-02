import { Injectable } from '@angular/core';
import { ApiArea } from 'src/app/shared/constants';
import { AreasHttpService } from '../../areas.http.service';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class LunchService {
  private apiRoot: string = ApiArea.hrms + '/LunchRequest';

  constructor(private areasHttpService: AreasHttpService, private datePipe: DatePipe) { }

  getTotalLunchRequestsForDate(date: any) {
    return this.areasHttpService.observable_get<any>(
      this.apiRoot + '/total-lunches?date=' + date,
      {
        responseType: 'json',
        observe: 'response',
      }
    );
  }

  addLunchRequest(params: any) {
    return this.areasHttpService.observable_post<any>(
      this.apiRoot + '/create', params,
      {
        responseType: 'json',
      }
    );
  }

  requestExist(date: any) {
    let val = this.datePipe.transform(date, "yyyy-MM-dd");
    return this.areasHttpService.observable_get<boolean>(
      this.apiRoot + '/request-exist?date=' + val, {}
    );
  }
g
  GetLunchDetails(date: any) {
    return this.areasHttpService.observable_get<any>(
      this.apiRoot + '/getLunchDetails?date=' + date,
      {
        responseType: 'json',
        observe: 'response',
      }
    );
  }
}
