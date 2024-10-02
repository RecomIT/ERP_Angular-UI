import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { NoticePeriodRoutingService } from '../../routing-service/notice-period/notice-period-routing.service';

@Injectable({
  providedIn: 'root'
})
export class NoticePeriodService {

  constructor(
    private noticePeriodRoutingService: NoticePeriodRoutingService
  ) { }




  





  private resignationNoticePeriod: any;
  
  fetchResignationNoticePeriod(params: any): Observable<any> {
    return this.noticePeriodRoutingService.getResignationNoticePeriodApi<any>(params);
  }


  

  getResignationNoticePeriod(params: any): Observable<any> {
    if (this.resignationNoticePeriod.length === 0) {
      return this.fetchResignationNoticePeriod(params);
    } else {
      return new Observable(observer => {
        observer.next(this.resignationNoticePeriod);
        observer.complete();
      });
    }
  }

}
