import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import 'metismenu'
import { ApiArea, ApiController } from 'src/app/shared/constants';
import { CustomModalService } from 'src/app/shared/services/custom-modal.service';
import { UserService } from 'src/app/shared/services/user.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AreasHttpService } from '../areas.http.service';
import { SharedmethodService } from 'src/app/shared/services/shared-method/sharedmethod.service';


@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html'
 
})

export class AppHeaderComponent implements OnInit, AfterViewInit {

  @ViewChild("changePasswordModal", { static: false }) changePasswordModal !: ElementRef;
  @ViewChild("changeDefaultPasswordModal", { static: false }) changeDefaultPasswordModal !: ElementRef;
  userInfo: any = null;
  constructor(private jwtHelper: JwtHelperService, private userService: UserService, private areasHttpService: AreasHttpService, private router: Router, private modalService: CustomModalService, private utilityService: UtilityService) { }

  photoPath : string="";
  ngOnInit(): void {
    this.getUserInfo();
    this.clearChangePasswordObj();

    
    if(this.User().PhotoPath == null || this.User().PhotoPath=="" || this.User().PhotoPath == 'default'){
      this.photoPath= "assets/img/user.png";
    }
    else{
      this.photoPath = `${this.areasHttpService.imageRoot}/${this.User().PhotoPath}`;
      
    }
    console.log("this.User()", this.User());
  }

  User() {
    return this.userService.User();
  }

  logger(msg: any, options: any) {
    this.utilityService.consoleLog(msg, options);
  }

  ngAfterViewInit(): void {
    const isDefault = this.userService.isUserInDefaultPassword();
    if (isDefault != null && isDefault) {
      this.modalService.open(this.changeDefaultPasswordModal, "sm");
    }
    else {
      this.modalService.service.dismissAll();
    }
  }

  isCurrentPasswordView: boolean;
  click_CurrentPasswordView() {
    this.isCurrentPasswordView = !this.isCurrentPasswordView
  }

  isNewPasswordView: boolean;
  click_NewPasswordView() {
    this.isNewPasswordView = !this.isNewPasswordView
  }

  isConfirmPasswordView: boolean;
  click_ConfirmPasswordView() {
    this.isConfirmPasswordView = !this.isConfirmPasswordView
  }

 

  logOut = () => {
    localStorage.removeItem("jwt");
    localStorage.removeItem("userprivileges");
    this.router.navigate(["/login"]);
  }

  isUserAuthenticated = (): boolean => {
    const token = localStorage.getItem("jwt");
    if (token && !this.jwtHelper.isTokenExpired(token)) {
      return true;
    }
    return false;
  }

  getUserInfo() {
    this.userInfo = this.userService.getUserInfo();
    this.logger("this.userInfo >>>", this.userInfo);
  }

  btnChangePassword: boolean = false;

  openChangePasswordModal() {
    this.clearChangePasswordObj();
    this.modalService.open(this.changePasswordModal, "sm");
    //this.modalService.open(this.changeDefaultPasswordModal,"sm");
  }

  changePassword: any = {
    userId: this.User().UserId,
    username: this.userService.getUserName(),
    currentPassword: null,
    newPassword: null,
    confirmPassword: null,
    companyId: this.User().ComId,
    organizationId: this.User().OrgId
  }

  clearChangePasswordObj() {
    this.changePassword = {
      userId: this.User().UserId,
      username: this.userService.getUserName(),
      currentPassword: null,
      newPassword: null,
      confirmPassword: null,
      companyId: this.User().ComId,
      organizationId: this.User().OrgId
    }
  }

  submitChangeDefaultPassword(form: NgForm) {
    if (form.valid) {
      this.btnChangePassword = true;
      this.areasHttpService.observable_post((ApiArea.controlpanel + ApiController.administration + "/ChangeUserDefaultPassword"), JSON.stringify(this.changePassword), {
        'headers': {
          'Content-Type': 'application/json'
        },
      }).subscribe((result) => {
        this.logger("Submit result >>", result);
        var data = result as any;
        this.btnChangePassword = false;
        if (data.status) {
          localStorage.removeItem("x-site-session")
          this.utilityService.success(data.msg, "Server Response");
          this.modalService.service.dismissAll();
        }
        else {
          this.utilityService.fail(data.msg, "Server Response");
        }
      }, (error) => {
        this.utilityService.fail("Something went wrong", "Server Response")
        this.btnChangePassword = false;
      })
    }
    else {
      this.utilityService.fail("Invalid Form Values","Site Response");
    }
  }

  submitChangePassword(form: NgForm) {
    if (form.valid) {
      this.btnChangePassword = true;
      this.areasHttpService.observable_post((ApiArea.controlpanel + ApiController.administration + "/ChangeUserPassword"), JSON.stringify(this.changePassword), {
        'headers': {
          'Content-Type': 'application/json'
        },
      }).subscribe((result) => {
        this.logger("Submit result >>", result);
        var data = result as any;
        this.btnChangePassword = false;
        if (data.status) {
          localStorage.removeItem("x-site-session")
          this.utilityService.success(data.msg, "Server Response");
          this.modalService.service.dismissAll();
        }
        else {
          this.utilityService.fail(data.msg, "Server Response");
        }
      }, (error) => {
        this.utilityService.fail("Something went wrong", "Server Response")
        this.btnChangePassword = false;
      })
    }
    else {
      this.utilityService.fail("Invalid Form Values","Site Response");
    }
  }

}