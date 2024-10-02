import { Component, OnInit } from '@angular/core';
import { CommonDashboardRoutingService } from '../common-dashboard-routing/common-dashboard-routing.service';
import { SnackbarService } from 'src/app/shared/services/Snackbar/snackbar.service';
import { Select2ConfigService } from 'src/app/shared/services/Select2/select2-config.service';

@Component({
  selector: 'app-employee-contact',
  templateUrl: './employee-contact.component.html',
  styleUrls: ['./employee-contact.component.css']
})
export class EmployeeContactComponent implements OnInit {

  
  constructor(   
    private apiEndpointsService: CommonDashboardRoutingService,
    private notifyService: SnackbarService,
    private select2ConfigService: Select2ConfigService
  ) { }


  employeeContactSelect2Options:any = [];
  employeeBloodGroupsSelect2Options:any = [];


  ImagePath: any;


  ngOnInit(){
    this.ImagePath = "assets/img/user.png";


    this.getEmployeeBloodGroups();

    this.getEmployeeContact();
    this.employeeContactSelect2Options = this.select2ConfigService.getDefaultConfig();

    this.employeeBloodGroupsSelect2Options = this.select2ConfigService.getDefaultConfig();
  
  }

  

  searchByBloodGroupId: any = null;
  bloodGroups: any[] = [];

  getEmployeeBloodGroups() {
    this.apiEndpointsService.getEmployeeBloodGroupsApi<any>(null).subscribe({
      next: (response) => {
        if (Array.isArray(response)) {
          this.bloodGroups = response;
    
      }},
      error: (error: any) => {
        console.error(error);
        this.notifyService.handleApiError(error);
      }
    });
    
  }


  bloodGroup: string;
  
  onBloodGroupSelectionChange(selectedBlood: any) {

    this.bloodGroup = selectedBlood;

    this.getEmployeeContact();
  
  
  }



  

  searchEmployeeId: any = null;
  listOfEmployee: any[] = [];
  employeeData: any[] = [];

  // getEmployeeContact() {

  //   const params: any = {};


  //   if (this.bloodGroup && this.bloodGroup != null) {
  //     params['bloodGroup'] = this.bloodGroup;
  //   }

  //   this.apiEndpointsService.getEmployeeContactApi<any>(params).subscribe({
  //     next: (response) => {
  //       if (Array.isArray(response)) {
  //         this.listOfEmployee = response;
    
  //     }},
  //     error: (error: any) => {
  //       console.error(error);
  //       this.notifyService.handleApiError(error);
  //     }
  //   });
    
  // }


  getEmployeeContact() {
    const params: any = {};

    if (this.bloodGroup && this.bloodGroup != null) {
      params['bloodGroup'] = encodeURIComponent(this.bloodGroup) ;
    }

    this.apiEndpointsService.getEmployeeContactApi<any>(params).subscribe({
      next: (response) => {
        if (Array.isArray(response)) {
          this.listOfEmployee = response;
          
    
      }},
      error: (error: any) => {
        console.error(error);
        this.notifyService.handleApiError(error);
      }
    });
    
  }


  
  onEmployeeSelectionChange(selectedEmployee: any) {
  
    // Filter employeesDataList based on the selected employee if it's not null
    if (selectedEmployee) {
      this.employeeData = this.listOfEmployee.filter(item => item.id === selectedEmployee);
    } else {
      // If no employee is selected, show all employees
      this.employeeData = this.listOfEmployee;
    }

  }

}
