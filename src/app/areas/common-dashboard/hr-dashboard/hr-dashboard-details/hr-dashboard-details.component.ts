import { Component, OnInit } from '@angular/core';
import { HrCommonDashboardRoutingService } from '../../common-dashboard-routing/hr-dashboard-routing/hr-common-dashboard-routing.service';
import { religion } from 'src/models/hrm/miscellaneous-model';

@Component({
  selector: 'app-hr-dashboard-details',
  templateUrl: './hr-dashboard-details.component.html',
  styleUrls: ['./hr-dashboard-details.component.css']
})
export class HrDashboardDetailsComponent implements OnInit {

  constructor(
    private hrCommonDashboardRouting: HrCommonDashboardRoutingService
  ) { }

  ngOnInit(): void {
    this.getTotalEmployees();
    this.getReligionsWithEmployee();
    this.getAverageEmployeesDetails();
  }



  totalEmployees: any[] = [];
  getTotalEmployees() {

    this.hrCommonDashboardRouting.getTotalEmployeesApi<any>(null).subscribe({
      next: (response) => {
        if (Array.isArray(response)) {
          this.totalEmployees = response;

      }},
      error: (error: any) => {
        console.error(error);
        
      }
    });
    
  }
  
  getTotalHeadCount(gender: string): number {
    const employees = this.totalEmployees.find(e => e.Gender === gender);
    return employees ? employees.TotalHeadCount : 0;
  }
  
  getGenders(): string[] {
    return Array.from(new Set(this.totalEmployees.map(e => e.Gender)));
  }
  

  getGenderDetails(gender: string): any[] {
    return this.totalEmployees.filter(e => e.Gender === gender && e.Gender !== null);
  }





  
  religions: any[] = [];
  getReligionsWithEmployee() {

    this.hrCommonDashboardRouting.getReligionsApi<any>(null).subscribe({
      next: (response) => {
        if (Array.isArray(response)) {
          this.religions = response;

      }},
      error: (error: any) => {
        console.error(error);
      }
    });
    
  }


  getReligions(): string[] {
    return Array.from(new Set(this.religions.map(e => e.Religion)));
  }

  getReligionDetails(religion: string): any[] {
    // Filter out entries where Religion is not null
    return this.religions.filter(e => e.Religion === religion && e.Religion !== null);
  }

  
  // getReligionDetails(religion: string): any[] {
  //   return this.religions.filter(e => e.Religion === religion);
  // }





// <!-- Average Age / Average Tenure / Total Department -->

averageEmployeeDetails: { averageAge: number, averageTenure: number, totalDepartments: number } = {
  averageAge: 0,
  averageTenure: 0,
  totalDepartments: 0
};

getAverageEmployeesDetails() {
  this.hrCommonDashboardRouting.getAverageEmployeeApi<any>(null).subscribe({
    next: (response) => {
      if (Array.isArray(response) && response.length > 0) {
        this.averageEmployeeDetails = response[0];

      } else {
        console.error('Invalid response format:', response);
      }
    },
    error: (error: any) => {
      console.error(error);
    }
  });
}

  



  hrCommonDashboardDetails: any[] = [];

  getHrDashboardDetails() {

    this.hrCommonDashboardRouting.getHrDashboardDetailsApi<any>(null).subscribe({
      next: (response) => {
        if (Array.isArray(response)) {
          this.hrCommonDashboardDetails = response;

      }},
      error: (error: any) => {
        console.error(error);
        
      }
    });
    
  }



  
  getUniqueReligion(): string[] {
    return Array.from(new Set(this.hrCommonDashboardDetails.map(leaveDetail => leaveDetail.Religion)));
  }
  


}
