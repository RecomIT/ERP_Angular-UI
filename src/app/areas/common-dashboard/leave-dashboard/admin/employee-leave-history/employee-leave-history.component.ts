import { Component, OnInit, OnDestroy } from '@angular/core';
import { EmployeeService } from '../service/employee.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-employee-leave-history',
  templateUrl: './employee-leave-history.component.html',
  styleUrls: ['./employee-leave-history.component.css']
})
export class EmployeeLeaveHistoryComponent implements OnInit, OnDestroy {

  totalApprovalEmployees: number = 0;
  leaveHistoryCount: number = 0;
  totalApprovalEmployeesSubscription: Subscription;
  leaveHistoryCountSubscription: Subscription;

  constructor(private employeeService: EmployeeService) {}

  ngOnInit(): void {
    this.totalApprovalEmployeesSubscription = this.employeeService.totalApprovalEmployees$.subscribe(totalEmployees => {
      this.totalApprovalEmployees = totalEmployees;
    });

    this.leaveHistoryCountSubscription = this.employeeService.totalLeaveHistoryCount$.subscribe(totalEmployees => {
      this.leaveHistoryCount = totalEmployees;
    });
  }

  ngOnDestroy(): void {
    if (this.totalApprovalEmployeesSubscription) {
      this.totalApprovalEmployeesSubscription.unsubscribe();
    }
    if (this.leaveHistoryCountSubscription) {
      this.leaveHistoryCountSubscription.unsubscribe();
    }
  }
}
