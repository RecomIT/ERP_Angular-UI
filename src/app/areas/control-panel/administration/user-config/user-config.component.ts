import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AreasHttpService } from 'src/app/areas/areas.http.service';
import { UserService } from 'src/app/shared/services/user.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { CustomModalService } from 'src/app/shared/services/custom-modal.service';
import { appMainMenuForPermission, appUser, appUserData } from 'src/models/control-panel/user-config.model';
import { ApiArea, ApiController } from 'src/app/shared/constants';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators'
import { Observable } from 'rxjs';
import { ControlPanelWebService } from 'src/app/shared/services/control-panel.service';
import { Role } from 'src/models/control-panel/org-config.model';
import { transition, trigger, useAnimation } from '@angular/animations';
import { slideInUp } from 'ng-animate';

@Component({
  selector: 'app-user-config',
  templateUrl: './user-config.component.html',
  animations: [
    trigger('slideInUp', [transition('* => *', useAnimation(slideInUp, { params: { timing: 0.5 } }))]),]
})
export class UserConfigComponent implements OnInit {

  datePickerConfig: Partial<BsDatepickerConfig> = this.utilityService.datePickerConfig();
  userEditEnabled: boolean = false;
  entryPageTitle: string = "";
  pagePrivilege: any = this.userService.getPrivileges();
  constructor(public modalService: CustomModalService, private areasHttpService: AreasHttpService, public toastr: ToastrService, private userService: UserService, public utilityService: UtilityService, private httpClient: HttpClient, private controlPanelWebService: ControlPanelWebService) { }

  ngOnInit(): void {
    this.getApplicationUsers();
    this.getApplicationRoles();
  }

  touchedSelect2(select2: any) {
    select2.control.touched = true;
  }

  select2Options = {
    width: "100%",
    containerCssClass: "form-control form-control-sm text-x-small",
    theme: "bootstrap4",
  }

  User() {
    return this.userService.User();
  }

  listPages: boolean = true;
  userEntryPage: boolean = false;
  roleAuthEntryPage: boolean = false;
  customAuthPage: boolean = false;

  openUserConfigModal() {
  }

  branchWithCompanyAndOrganization: string = null;

  //#region User-Entry

  appUser: any = {
    id: null,
    branchId: 0,
    divisionId: 0,
    companyId: 0,
    organizationId: 0,
    employeeId: null,
    employeeCode: "",
    fullName: "",
    email: "",
    address: "",
    currentState: "",
    userName: "",
    isActive: false,
    isRoleActive: false,
    phoneNumber: "",
    // password: "",
    // confirmPassword: "",
    roleId: "",
    roleName: "",
    profilePic: null,
    createdBy: "",
    createdDate: null,
    UpdatedBy: "",
    UpdatedDate: null,
    branchName: "",
    companyName: "",
    divisionName: "",
    organizationName: ""
  }
  clearAppUser() {
    this.appUser = {
      id: null,
      branchId: 0,
      divisionId: 0,
      companyId: 0,
      organizationId: 0,
      employeeId: null,
      employeeCode: "",
      fullName: "",
      email: "",
      address: "",
      currentState: "",
      userName: "",
      isActive: false,
      isRoleActive: false,
      phoneNumber: "",
      // password: "",
      // confirmPassword: "",
      roleId: "",
      roleName: "",
      profilePic: null,
      createdBy: "",
      createdDate: null,
      UpdatedBy: "",
      UpdatedDate: null,
      branchName: "",
      companyName: "",
      divisionName: "",
      organizationName: ""
    }
    this.branchWithCompanyAndOrganization = null;
    this.ddlEmployees = [];
    this.ddlRole = [];
    this.ddlBranchWithCompanyAndOrganization = [];
    this.menusData = [];
  }

  ddlBranchWithCompanyAndOrganization: any[] = [];

  loadBranch() {
    this.ddlBranchWithCompanyAndOrganization = [];
    this.getBranches({ flag: "6", ComId: this.User().ComId, OrgId: this.User().OrgId }).subscribe(res => {
      this.ddlBranchWithCompanyAndOrganization = res;
    })
  }

  createUser() {
    this.entryPageTitle = "Add New User";
    this.clearAppUser();
    this.userEntryPage = true;
    this.listPages = false;
    this.roleAuthEntryPage = false;
    this.userEditEnabled = false;
    this.loadBranch();
    this.menusData = [];
  }

  ddlEmployees: any[] = [];
  ddlRole: any[] = [];
  menusData: appMainMenuForPermission[] = [];

  loadEmployeeAndRole() {
    this.ddlEmployees = [];
    this.ddlRole = [];
    this.menusData = [];

    let roleIdForMenu = "";
    let userIdForMenu = "";

    if (this.appUser.id == null || this.appUser.id.toString() == "00000000-0000-0000-0000-000000000000") {
      this.appUser.employeeId = null;
      this.appUser.roleId = "";
    }
    else {
      userIdForMenu = this.appUser.id.toString();
      roleIdForMenu = this.appUser.roleId;
    }

    if (this.branchWithCompanyAndOrganization != null) {
      let values = this.branchWithCompanyAndOrganization.split("#");
      let company = values[2];
      let organization = values[3];


      // Employee Code
      this.areasHttpService.observable_get((ApiArea.hrms + "/Employee/Info" + "/GetClientEmployees"), {
        responseType: "json", params: { clientCompany: company, clientOrganization: organization }
      }).subscribe((data) => {
        //console.log("employees >>>", data)
        let emps = data as any[];
        let arrays: any = [];
        emps.forEach(emp => {
          arrays.push({ id: emp.employeeId, text: (emp.employeeName + "~" + emp.employeeCode) })
        });
        //console.log("arrays >>>",arrays);
        this.ddlEmployees = arrays;
      },
        (error) => {
          this.toastr.error("Something went wrong", "Server Response", { timeOut: 1000 })
        })
      // Role
      // this.areasHttpService.observable_get((ApiArea.controlpanel + ApiController.administration + "/GetApplicationRoles"),
      // { responseType: "json", params: { RoleName: "", RoleOrgId: organization, RoleComId: company } }).
      // subscribe(data => {
      // this.ddlRole = data as any[];
      // })
      //console.log("organization >>>", organization);
      //console.log("company >>>", company);
      this.getRoles({ orgId: organization, comId: company }).subscribe(res => {
        this.ddlRole = res as any[];
      })

      // App-menus
      this.areasHttpService.observable_get((ApiArea.controlpanel + ApiController.administration + "/GetAppMenusForPermission"),
        { responseType: "json", params: { userId: userIdForMenu, roleId: roleIdForMenu, companyId: company, organizationId: organization, flag: (this.appUser.isRoleActive ? "Role" : "Custom") } }).
        subscribe(data => {
          this.menusData = data as any[];
        })
    }
  }

  loadUserInfoById(id: any) {
    if (id != null && id != '') {
      this.areasHttpService.observable_get((ApiArea.controlpanel + ApiController.administration + "/GetUserInfoById"), {
        responseType: "json", params: {
          id: id
        }
      }).subscribe({
        next: (response: any) => {
          this.appUser.fullName = response?.fullName;
          this.appUser.email = response?.email;
          this.appUser.address = response?.address;
          this.appUser.phoneNumber = response?.phoneNumber;
        },
        error: (error: any) => {
          this.utilityService.fail(error);
        }
      })
    }
  }

  loadUserInfoFromEmployee(event: any) {
    if (this.appUser.employeeId != null && this.appUser.employeeId > 0 && this.branchWithCompanyAndOrganization != "" && this.branchWithCompanyAndOrganization != null) {
      this.areasHttpService.observable_get((ApiArea.hrms + "/Employee/Info" + "/GetClientEmployeeById"), {
        responseType: "json", params: {
          employeeId: this.appUser.employeeId, clientCompany: this.branchWithCompanyAndOrganization.split("#")[2], clientOrganization: this.branchWithCompanyAndOrganization.split("#")[3]
        }
      }).subscribe((data) => {
        let values = data as any;
        if (this.appUser.id == null || (this.appUser.id != null && this.userEditEnabled)) {
          this.appUser.fullName = values.fullName;
          this.appUser.email = values.officeEmail;
          this.appUser.address = values.presentAddress;
          this.appUser.phoneNumber = values.officeMobile;
        }
        this.userEditEnabled = this.appUser.id != null;
      },
        (error) => {
          this.toastr.error("Something went wrong", "Server Response", { timeOut: 1000 })
        })
    }
    else {
      this.loadUserInfoById(this.appUser.id);
    }
  }

  permissionChanged(i: number, j: number) {
    this.menusData[i].appSubmenuForPermissions[j].isAll =
      (this.menusData[i].appSubmenuForPermissions[j].isAdd &&
        this.menusData[i].appSubmenuForPermissions[j].isEdit &&
        this.menusData[i].appSubmenuForPermissions[j].isDelete &&
        this.menusData[i].appSubmenuForPermissions[j].isDetail &&
        this.menusData[i].appSubmenuForPermissions[j].isApproval &&
        this.menusData[i].appSubmenuForPermissions[j].isReport &&
        this.menusData[i].appSubmenuForPermissions[j].isUpload)
    console.log("this.menusData >>>", this.menusData);
  }

  allPermissionChanged(i: number, j: number) {
    this.menusData[i].appSubmenuForPermissions[j].isAdd = this.menusData[i].appSubmenuForPermissions[j].isAll;
    this.menusData[i].appSubmenuForPermissions[j].isEdit = this.menusData[i].appSubmenuForPermissions[j].isAll;
    this.menusData[i].appSubmenuForPermissions[j].isDelete = this.menusData[i].appSubmenuForPermissions[j].isAll;
    this.menusData[i].appSubmenuForPermissions[j].isDetail = this.menusData[i].appSubmenuForPermissions[j].isAll;
    this.menusData[i].appSubmenuForPermissions[j].isApproval = this.menusData[i].appSubmenuForPermissions[j].isAll;
    this.menusData[i].appSubmenuForPermissions[j].isReport = this.menusData[i].appSubmenuForPermissions[j].isAll;
    this.menusData[i].appSubmenuForPermissions[j].isUpload = this.menusData[i].appSubmenuForPermissions[j].isAll;
  }

  checkedRowColor(i: number, j: number): boolean {
    return this.menusData[i].appSubmenuForPermissions[j].isAdd || this.menusData[i].appSubmenuForPermissions[j].isEdit || this.menusData[i].appSubmenuForPermissions[j].isDelete || this.menusData[i].appSubmenuForPermissions[j].isDetail || this.menusData[i].appSubmenuForPermissions[j].isApproval || this.menusData[i].appSubmenuForPermissions[j].isReport || this.menusData[i].appSubmenuForPermissions[j].isUpload
  }

  appUserData: appUserData = {
    appUserInfo: this.appUser,
    appUserMenuPermission: this.menusData
  }

  duplicateUsername: string = "";
  duplicateEmployee: string = "";
  duplicateUserEmail: string = "";
  duplicateUserPhone: string = "";
  btnAppUserMenu: boolean = false;

  submitUser(UserForm: NgForm) {
    this.btnAppUserMenu = true;
    var values = this.branchWithCompanyAndOrganization.split("#");
    var branchId = values[0];
    var divisionId = values[1];
    var companyId = values[2];
    var organizationId = values[3];

    this.appUser.branchId = parseInt(branchId);
    this.appUser.divisionId = parseInt(divisionId);
    this.appUser.companyId = parseInt(companyId);
    this.appUser.organizationId = parseInt(organizationId);

    this.appUserData.appUserInfo = this.appUser;
    this.appUserData.appUserMenuPermission = this.menusData;
    this.areasHttpService.observable_post((ApiArea.controlpanel + ApiController.administration + "/SaveUserAuth"), this.appUserData, {
      params: {
        BranchId: this.User().BranchId, ComId: this.User().ComId, OrgId: this.User().OrgId, UserId: this.User().UserId
      }
    }).subscribe((result) => {
      var data = result as any;
      this.btnAppUserMenu = false;
      if (data.status) {
        this.toastr.success("Saved Successfull", "Server Response", { timeOut: 800 })
        //this.getApplicationUsers();
      }
      else {
        if (data.msg == "Validation Error") {
          console.log("data.errors >>>", data.errors);
          this.duplicateUsername = data.errors.duplicateUsername;
          this.duplicateEmployee = data.errors.duplicateEmployee;
          this.duplicateUserEmail = data.errors.duplicateUserEmail;
          this.duplicateUserPhone = data.errors.duplicatePhone;
          console.log("this.duplicateUserPhone >>>", this.duplicateUserPhone);
        }
        else {
          this.toastr.error(data.msg, "Server Response", { timeOut: 800 })
        }
      }
    },
      (error) => {
        this.toastr.error("Something went wrong", "Server Response", { timeOut: 1000 })
      })
    //}
  }

  //#endregion

  //#region user-list
  appUserList: appUser[] = null;
  getApplicationUsers() {
    this.listPages = true; this.userEntryPage = false; this.roleAuthEntryPage = false; this.customAuthPage = false; this.userEditEnabled = false;
    var params = {};
    this.areasHttpService.observable_get((ApiArea.controlpanel + ApiController.administration + "/GetApplicationUsers"),
      { responseType: "json" }).
      subscribe(data => {
        this.appUserList = data as appUser[];
      },
        (error) => {
          console.log("error......")
        })
  }

  // Edit User
  editUser(id: any) {
    this.createUser();
    console.log("id >>>", id);
    console.log("this.appUserList >> ", this.appUserList);

    this.entryPageTitle = "Update User";
    this.appUser = Object.assign({}, this.appUserList.find(a => a.id == id));
    this.branchWithCompanyAndOrganization = (this.appUser.branchId.toString() + "#" +
      this.appUser.divisionId.toString() + "#" +
      this.appUser.companyId.toString() + "#" +
      this.appUser.organizationId.toString());

    console.log("appUser edit>>> ", this.appUser);
    console.log("userEditEnabled edit", this.userEditEnabled)

  }
  //#endregion

  getBranches(params: any): Observable<any[]> {
    return this.httpClient.get<any[]>((this.areasHttpService.apiRoot + ApiArea.webservice + ApiController.controlPanelService + "/GetBranchExtension"), { responseType: "json", params: params }).pipe(map(res => {
      var values = res as any[];
      let arrays: any = [];
      values.forEach(v => {
        arrays.push({ id: v.value, text: v.text });
      });
      return arrays;
    }))
  }

  getRoles(params: any): Observable<any[]> {
    return this.httpClient.get<any[]>((this.areasHttpService.apiRoot + ApiArea.webservice + ApiController.controlPanelService + "/GetUserRoles"), { responseType: "json", params: params }).pipe(map(res => {
      return res;
    }));
  }

  //#region Role-Auth

  roleAuthOrgId: number = 0;
  roleAuthComId: number = 0;
  roleAuthRoleId: string = "";
  roleAuth() {
    this.entryPageTitle = "Add Role Auth";
    this.userEntryPage = false;
    this.listPages = false;
    this.roleAuthEntryPage = true;
    this.userEditEnabled = false;
    this.loadOrganization();
    this.menusData = [];
    //this.loadBranch();
  }

  ddlOrganization: any[] = [];
  loadOrganization() {
    this.ddlOrganization = [];
    this.ddlCompany = [];
    this.controlPanelWebService.GetOrganization<any[]>().then((data) => {
      this.ddlOrganization = data;
    })
  }

  ddlCompany: any[] = [];
  loadCompany(orgId: any) {
    this.ddlCompany = [];
    this.ddlUserRoles = [];
    this.controlPanelWebService.GetCompany<any[]>(orgId).then((data) => {
      this.ddlCompany = data;
    })
    this.getMenusForRolesAuth();
  }

  ddlUserRoles: any[] = [];
  loadRoles(orgId: number, comId: number) {
    this.ddlUserRoles = [];
    this.controlPanelWebService.GetUserRoles<any[]>(orgId, comId).then((data) => {
      this.ddlUserRoles = data;
    })
    this.getMenusForRolesAuth();
  }

  getMenusForRolesAuth() {
    this.menusData = [];
    if (this.roleAuthComId > 0 && this.roleAuthOrgId > 0) {
      this.areasHttpService.observable_get((ApiArea.controlpanel + ApiController.administration + "/GetAppMenusForPermission"),
        {
          responseType: "json", params: {
            roleId: this.roleAuthRoleId, companyId: this.roleAuthComId, organizationId: this.roleAuthOrgId, flag: "Role"
          }
        }).
        subscribe(data => {
          this.menusData = data as any[];
          console.log("this.menusData >>>", this.menusData)
        })
    }
  }

  roleList: Role[] = null;
  getApplicationRoles() {
    this.areasHttpService.observable_get((ApiArea.controlpanel + ApiController.administration + "/GetApplicationRoles"),
      { params: { RoleName: '', RoleOrgId: 0, RoleComId: 0 } }).
      subscribe(data => {
        this.roleList = data as Role[];
        console.log("Role List >>>> ", data)
      })
  }
  btnRoleAuthMenu: boolean = false;
  submitRoleAuth(roleAuthForm: NgForm) {
    if (roleAuthForm.valid) {
      this.btnRoleAuthMenu = true;
      this.areasHttpService.observable_post((ApiArea.controlpanel + ApiController.administration + "/SaveRoleAuth"), this.menusData, {
        params: {
          RoleId: this.roleAuthRoleId, BranchId: 0, CompanyId: this.roleAuthComId, OrganizationId: this.roleAuthOrgId, UserId:
            this.User().UserId
        }
      }).subscribe((result) => {
        var data = result as any;
        this.btnRoleAuthMenu = false;
        if (data.status) {
          this.menusData = [];
          this.toastr.success("Saved Successfull", "Server Response", { timeOut: 800 })
          //this.getApplicationUsers();
        }
        else {
          if (data.msg == "Validation Error") {
            this.duplicateUsername = data.errors.duplicateUsername;
            this.duplicateEmployee = data.errors.duplicateEmployee;
            this.duplicateUserEmail = data.errors.duplicateUserEmail;
            this.duplicateUserPhone = data.errors.duplicateUserPhone;
            //console.log("Validation Error");
          }
          else {
            this.toastr.error(data.msg, "Server Response", { timeOut: 800 })
          }
        }
      },
        (error) => {
          this.toastr.error("Something went wrong", "Server Response", { timeOut: 1000 })
        })
    }
  }

  loadRoleAuth(id: any, companyId: number, organizationId: number) {
    this.menusData = [];
    this.roleAuthRoleId = id.toString();
    this.roleAuthComId = companyId;
    this.roleAuthOrgId = organizationId;
    this.roleAuth();
    this.loadCompany(this.roleAuthOrgId);
    this.loadRoles(this.roleAuthOrgId, this.roleAuthComId);
  }
  //#end Role-Auth

}
