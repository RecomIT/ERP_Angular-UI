import { Component, OnInit } from '@angular/core';
import { HrWebService } from 'src/app/shared/services/hr-web.service';
import { EmployeeInfoService } from '../../employee_module/employee/employee-info.service';

@Component({
  selector: 'app-leave-encashment-process',
  templateUrl: './leave-encashment-process.component.html',
  styleUrls: ['./leave-encashment-process.component.css']
})
export class LeaveEncashmentProcessComponent implements OnInit {

  constructor(  
    private employeeInfoService: EmployeeInfoService
  ) { }

  ngOnInit(): void {
    this.loadEmployees();
  }



  select2Options = {
    width: "100%",
    containerCssClass: "form-control form-control-sm text-x-small font-bold",
    theme: "bootstrap4"
  }


  ddlEmployees: any[];
  loadEmployees() {
    this.employeeInfoService.loadDropdownData({});
    this.employeeInfoService.ddl_employee_data$.subscribe(data => {
      this.employeeInfoService.loadDropdown(data);
      this.ddlEmployees = this.employeeInfoService.ddl$;
    }, error => {
      console.error('Error while fetching data:', error);
    });
  }
}
