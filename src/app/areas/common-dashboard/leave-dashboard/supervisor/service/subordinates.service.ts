import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SubordinatesService {

  constructor() { }

  private totalApprovalEmployeesSource = new BehaviorSubject<number>(0);
  totalApprovalEmployees$ = this.totalApprovalEmployeesSource.asObservable();

  setApprovalEmployees(totalRows: number) {
    this.totalApprovalEmployeesSource.next(totalRows);
  }


  
  private totalLeaveHistoryCountSource = new BehaviorSubject<number>(0);
  totalLeaveHistoryCount$ = this.totalLeaveHistoryCountSource.asObservable();

  setLeaveHistoryCount(totalRows: number) {
    this.totalLeaveHistoryCountSource.next(totalRows);
  }


}
