import { Component, Input, OnInit } from '@angular/core';
import { SubordinatesService } from '../service/subordinates.service';

@Component({
  selector: 'app-subordinates-leave-dashboard',
  templateUrl: './subordinates-leave-dashboard.component.html',
  styleUrls: ['./subordinates-leave-dashboard.component.css']
})
export class SubordinatesLeaveDashboardComponent implements OnInit {


  totalApprovalEmployees: number = 0;

  leaveHistoryCount: number = 0;

  constructor(
    private subordinatesService: SubordinatesService
    ) {}

  ngOnInit(): void {
    this.subordinatesService.totalApprovalEmployees$.subscribe(totalEmployees => {
      this.totalApprovalEmployees = totalEmployees;
    });


    this.subordinatesService.totalLeaveHistoryCount$.subscribe(totalEmployees => {
      
      this.leaveHistoryCount = totalEmployees;
    });

  }




}
