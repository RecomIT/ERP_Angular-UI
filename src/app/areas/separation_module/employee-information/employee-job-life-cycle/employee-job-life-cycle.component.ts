
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-employee-job-life-cycle',
  templateUrl: './employee-job-life-cycle.component.html',
  styleUrls: ['./employee-job-life-cycle.component.css','./expansion-panel.css']
 
})
export class EmployeeJobLifeCycleComponent implements OnInit {

  @Input() employeeId: number = 0;
  
  constructor(
    ) {      
  }

  ngOnInit(): void {
  }

  events = [
    { EmployeeId: 174, date: new Date('2017-07-01'), label: 'Joining', description: 'Employee hired on this date.' },
    { EmployeeId: 174, date: new Date('2017-10-01'), label: 'Confirmation', description: 'Employee Confirm on this date.' },
    { EmployeeId: 174, date: new Date('2017-11-01'), label: 'PF Start', description: 'PF Start on this date.' },
    { EmployeeId: 174, date: new Date('2018-01-01'), label: 'Annual Increment', description: 'Get a salary increment on this date' },
    { EmployeeId: 174, date: new Date('2018-07-01'), label: 'Promoted & Salary Review', description: 'Received an award for outstanding performance on this date.' },
    { EmployeeId: 174, date: new Date('2019-06-01'), label: 'Transfer', description: 'Transferred to a different department on this date.' },
    { EmployeeId: 174, date: new Date('2020-01-01'), label: 'Annual Increment', description: 'Successfully completed a major project on this date.' },
    { EmployeeId: 174, date: new Date('2021-01-01'), label: 'Promoted & Salary Review', description: 'Received recognition for contributions to the team on this date.' },
    { EmployeeId: 174, date: new Date('2022-09-01'), label: 'Resign', description: 'Participated in a workshop for professional development on this date.' },
    { EmployeeId: 174, date: new Date('2022-10-01'), label: 'Inactive', description: 'Promoted to a higher position on this date.' },
   
  ];
  




}
