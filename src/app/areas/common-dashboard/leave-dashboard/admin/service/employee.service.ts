import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor() { }


  /// ----------------------
  /// Approval
  /// ----------------------

  private totalApprovalEmployeesSource = new BehaviorSubject<number>(0);
  totalApprovalEmployees$ = this.totalApprovalEmployeesSource.asObservable();

  setApprovalEmployees(totalRows: number) {
    this.totalApprovalEmployeesSource.next(totalRows);
  }


  /// ----------------------
  /// History
  /// ----------------------

  private totalLeaveHistoryCountSource = new BehaviorSubject<number>(0);
  totalLeaveHistoryCount$ = this.totalLeaveHistoryCountSource.asObservable();

  setLeaveHistoryCount(totalRows: number) {
    this.totalLeaveHistoryCountSource.next(totalRows);
  }



  
}
