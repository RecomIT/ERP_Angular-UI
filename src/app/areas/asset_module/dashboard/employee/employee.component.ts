import { Component, OnInit } from '@angular/core';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { UserService } from 'src/app/shared/services/user.service';
import { transition, trigger, useAnimation } from '@angular/animations';
import { bounceIn, fadeIn, fadeInRight, slideInUp } from 'ng-animate';
import { EmployeeService } from './employee.service';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css'],
  animations: [
    trigger('slideInUp', [transition('* => *', useAnimation(slideInUp, { params: { timing: 0.5 } }))]),
    trigger('fadeIn', [transition('void => *', useAnimation(fadeIn, { params: { timing: 0.3 } }))]),
    trigger('fadeInRight', [transition('void => *', useAnimation(fadeInRight, { params: { timing: 0.5 } }))]),
    trigger('bounceIn', [transition('void => *', useAnimation(bounceIn, { params: { timing: 1 } }))]),
  ],
})
export class EmployeeComponent implements OnInit {

  constructor(
    private employeeService: EmployeeService, 
    private utilityService:UtilityService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.getAssetData();
  }

  logger(msg: any, options: any) {
    this.utilityService.consoleLog(msg, options);
  }

  User() {
    return this.userService.User();
  }

  list: any[] = [];
  list_loading_label: string = null;
  getAssetData() {
    let params = "";
    this.list = []
    this.employeeService.get().subscribe(response => {
      if ((response.body).length > 0) {
        this.list = response.body;
      }
      else {
        this.list_loading_label = "No record(s) found";
      }

    }, (error) => {
      this.utilityService.fail("Something went wrong", "Server Response")
      console.log("error >>>", error);
    })
  }

}
