import { transition, trigger, useAnimation } from '@angular/animations';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Guid } from 'guid-typescript';
import { bounceIn, fadeIn, fadeInRight, slideInUp } from 'ng-animate';
import { ToastrService } from 'ngx-toastr';
import { AreasHttpService } from 'src/app/areas/areas.http.service';
import { ApiArea, ApiController } from 'src/app/shared/constants';
import { ControlPanelWebService } from 'src/app/shared/services/control-panel.service';
import { UserService } from 'src/app/shared/services/user.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AuthApp, Role } from 'src/models/control-panel/org-config.model';
import { company, organization } from 'src/models/control-panel/org-init.model';

@Component({
  selector: 'app-org-config',
  templateUrl: './org-config.component.html',
  animations: [
    trigger('slideInUp', [transition('* => *', useAnimation(slideInUp, { params: { timing: 0.5 } }))]),
    trigger('fadeIn', [transition('void => *', useAnimation(fadeIn, { params: { timing: 0.3 } }))]),
    trigger('fadeInRight', [transition('void => *', useAnimation(fadeInRight, { params: { timing: 0.5 } }))]),
    trigger('bounceIn', [transition('void => *', useAnimation(bounceIn, { params: { timing: 1 } }))]),
  ]

})
export class OrgConfigComponent implements OnInit {

  @ViewChild('roleModal', { static: true }) roleModal!: ElementRef;
  userData: any = { OrgId: 0, ComId: 0, BranchId: 0, UserId: "1234567890" };
  modalTitle: string = "";
  closeResult: string = "";
  pagePrivilege: any= this.userService.getPrivileges();
  constructor(private areasHttpService: AreasHttpService, public toastr: ToastrService, public modalService: NgbModal, public controlPanelWebService: ControlPanelWebService, private userService: UserService, private utilityService: UtilityService) { }

  User() {
    return this.userService.User();
  }

  logger(msg: any, optionsParams: any) {
    this.utilityService.consoleLog(msg, optionsParams)
  }

  ngOnInit(): void {
    this.getOrganizations();
    this.getApplicationRoles();
  }

  // modal execution
  open(content: any, size: string) {
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title', size: size, backdrop:
        'static', keyboard: false
    }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`
    });
  }
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  //#region Org-Auth
  orgList: organization[] = null;
  organizationId: number = 0;

  getOrganizations() {
    this.areasHttpService.observable_get((ApiArea.controlpanel + ApiController.administration + "/GetOrganizations"), { params: this.userData }).subscribe(data => {
      this.orgList = data as organization[];
      this.getCompanies();
    })
  }

  orgAuthApp: AuthApp = {
    appId: 0,
    appName: "",
    modules: [],
  };

  getGetOrgAuths() {
    console.log("organizationId >>> ", this.organizationId);
    this.orgAuthApp = {
      appId: 0,
      appName: "",
      modules: [],
    };
    this.areasHttpService.observable_get((ApiArea.controlpanel + ApiController.administration + "/GetOrgAuths"),
      { params: { OrgId: this.organizationId } }).subscribe(data => {
        this.orgAuthApp = data as AuthApp;
        console.log("AuthApp >>>> ", data)
      })
  }

  saveOrgAuth() {
    console.log(this.orgAuthApp);
    this.areasHttpService.observable_post((ApiArea.controlpanel + ApiController.administration + "/SaveOrgAuth"),
      JSON.stringify(this.orgAuthApp),
      {
        'headers': {
          'Content-Type': 'application/json'
        },
        params: { AuthOrgId: this.organizationId, OrgId: 1, ComId: 1, BranchId: 1, UserId: "1234567890" }
      }).subscribe(status => {
        if (status) {
          this.toastr.success("Saved Successfull", "Server Response", { timeOut: 800 })
        }
        else {
          this.toastr.error("Somthing went wrong", "Server Response", { timeOut: 800 })
        }
      })
  }

  //#endregion

  //#region company-auth
  comOrgId: number = 0;
  authCompanyId: number = 0;
  companyList: any[];
  comAuthApp: AuthApp = {
    appId: 0,
    appName: "",
    modules: [],
  };

  saveComAuth() {
    console.log(this.comAuthApp);
    this.areasHttpService.observable_post((ApiArea.controlpanel + ApiController.administration + "/SaveComAuth"),
      JSON.stringify(this.comAuthApp),
      {
        'headers': {
          'Content-Type': 'application/json'
        },
        params: { AuthOrgId: this.comOrgId, AuthComId: this.authCompanyId, OrgId: 1, ComId: 1, BranchId: 1, UserId: "1234567890" }
      }).subscribe(status => {
        if (status) {
          this.toastr.success("Saved Successfull", "Server Response", { timeOut: 800 })
        }
        else {
          this.toastr.error("Somthing went wrong", "Server Response", { timeOut: 800 })
        }
      })
  }

  roleComList: any[];
  getCompanyByOrg(label: string) {
    let orgId = 0;
    if (label == "comAuth") {
      orgId = this.comOrgId;
      this.comAuthApp = {
        appId: 0,
        appName: "",
        modules: [],
      };
      this.authCompanyId = 0;
      if (this.comOrgId == 0) {
        this.companyList = [];
        return;
      }
      this.areasHttpService.observable_get((ApiArea.controlpanel + ApiController.administration + "/GetCompanies"), {
        params: {
          ComOrgId: orgId
        }
      }).subscribe(data => {
        this.companyList = data as any[];
      })
    }
    if (label == "roleSearch") {
      this.searchRoleComId = 0;
      orgId = this.searchRoleOrgId;
      if (this.searchRoleOrgId == 0) {
        this.roleComList = [];
        return;
      }
      this.areasHttpService.observable_get((ApiArea.controlpanel + ApiController.administration + "/GetCompanies"), {
        params: {
          ComOrgId: orgId
        }
      }).subscribe(data => {
        this.roleComList = data as any[];
      })
    }
  }

  getGetComAuths() {
    this.comAuthApp = {
      appId: 0,
      appName: "",
      modules: [],
    };
    console.log("comOrgId >>> ", this.comOrgId);
    this.areasHttpService.observable_get((ApiArea.controlpanel + ApiController.administration + "/GetComAuths"),
      { params: { OrgId: this.comOrgId, ComId: this.authCompanyId } }).subscribe(data => {
        this.comAuthApp = data as AuthApp;
        console.log("comAuthApp >>>> ", data)
      })
  }

  //#endregion

  //#region Role
  // search
  searchRoleOrgId: number = 0;
  searchRoleComId: number = 0;
  searchRoleName: string = ""
  // entry
  roleOrgAndComId: string = "0";
  role: Role = {
    id: null,
    name: "",
    isActive: false,
    description: "",
    companyId: 0,
    companyName: "",
    organizationId: 0,
    organizationName: "",
    createdBy: "",
    createdDate: null,
    updatedBy: "",
    updatedDate: null
  }

  roleList: Role[] = null;

  getApplicationRoles() {
    this.areasHttpService.observable_get((ApiArea.controlpanel + ApiController.administration + "/GetApplicationRoles"),
      { params: { RoleName: this.searchRoleName, RoleOrgId: this.searchRoleOrgId, RoleComId: this.searchRoleComId } }).subscribe(data => {
        this.roleList = data as Role[];
        console.log("Role List >>>> ", this.roleList)
      })
  }

  openRoleModal() {
    this.role = {
      id: null,
      name: "",
      isActive: false,
      description: "",
      companyId: 0,
      companyName: "",
      organizationId: 0,
      organizationName: "",
      createdBy: "",
      createdDate: null,
      updatedBy: "",
      updatedDate: null
    }
    this.roleOrgAndComId = "0";
    this.getddlCompanies();
    this.modalTitle = "Add Role";
    this.open(this.roleModal, "lg");
  }

  companies: company[] = null;

  getCompanies() {
    this.areasHttpService.observable_get((ApiArea.controlpanel + ApiController.administration + "/GetCompanies"), {
      params: this.
        userData
    }).subscribe(data => {
      this.companies = data as company[];
    })
  }

  ddlCompanies: any[] = [];
  getddlCompanies() {
    this.ddlCompanies = [];
    this.companies.forEach(com => {
      var o = this.orgList.find(o => o.organizationId == com.organizationId);
      var text = com.companyName + " [" + o.organizationName + "]";
      var value = com.companyId.toString() + "#" + o.organizationId.toString();
      this.ddlCompanies.push({ value: value, text: text });
    });
  }

  editRole(id: string) {
    console.log(id);
    this.role = Object.assign({}, this.roleList.find(r => r.id.toString() == id));
    this.roleOrgAndComId = this.role.companyId + "#" + this.role.organizationId;
    this.getddlCompanies();
    this.modalTitle = "Update Role";
    this.open(this.roleModal, "lg");
  }

  submitRole() {
    if (this.roleOrgAndComId != "0" && this.roleOrgAndComId.indexOf("#") > 0) {
      var comAndOrgId = this.roleOrgAndComId.split("#");
      this.role.companyId = parseInt(comAndOrgId[0]);
      this.role.organizationId = parseInt(comAndOrgId[1]);
      this.areasHttpService.observable_post((ApiArea.controlpanel + ApiController.administration + "/SaveApplicationRole"),
        JSON.stringify(this.role),
        {
          'headers': {
            'Content-Type': 'application/json'
          },
          params: this.User()
        }).subscribe(status => {
          if (status) {
            this.toastr.success("Saved Successfull", "Server Response", { timeOut: 800 })
            this.modalService.dismissAll("Save Complete");
            this.getApplicationRoles();
          }
          else {
            this.toastr.error("Something went wrong", "Server Response", { timeOut: 800 })
          }
        })
    }
  }



  //#endregion

  //#region Module-Config
  ddlCompany: any[] = [];
  selectItemText: string = "";
  loadCompany(orgId: any) {
    this.ddlCompany = [];
    if (orgId > 0) {
      this.controlPanelWebService.GetCompany<any[]>(orgId).then((data) => {
        this.ddlCompany = data;
      })
    }
  }

  ddlMainmenu: any[] = [];
  loadMainmenu(comId: any) {
    this.ddlMainmenu = [];
    if (comId > 0) {
      this.controlPanelWebService.GetCompanyAuthMainmenu<any[]>(comId).then((data) => {
        this.ddlMainmenu = data;
      })
    }
  }

  configData: any[] = [];
  loadModuleConfig(mainmenuId: any, comId: any, orgId: any) {
    this.selectItemText = "";
    if (comId > 0 && orgId > 0 && mainmenuId > 0) {
      this.selectItemText = this.utilityService.getDropDownText(mainmenuId, this.ddlMainmenu);
      this.logger("this.selectItemText >>>", this.selectItemText);
      this.areasHttpService.observable_get((ApiArea.controlpanel + ApiController.administration + "/GetModuleConfigs"), {
        params: { mainemnuId: mainmenuId, comId: comId, orgId: orgId }
      }).subscribe(data => {
        this.logger("data >>>", data);
        this.configData = data as any[];
      })
    }
  }



  submitModuleConfig() {
    // console.log(this.configData);
    // return;
    if (this.configData.length > 0) {
      this.areasHttpService.observable_post((ApiArea.controlpanel + ApiController.administration + "/SaveModuleConfig"),
        JSON.stringify(this.configData),
        {
          'headers': {
            'Content-Type': 'application/json'
          },
          params: { userId: this.User().UserId }
        }).subscribe(status => {
          if (status) {
            this.toastr.success("Saved Successfull", "Server Response", { timeOut: 800 })
          }
          else {
            this.toastr.error("Something went wrong", "Server Response", { timeOut: 800 })
          }
        })
    }
  }


  //  Module Config Extension
  moduleConfigOrg: number = 0;
  moduleConfigCom: number = 0;
  mcComMainmenu: number = 0;

  loadModuleConfigExtension(mainmenuId: any, comId: any, orgId: any) {
    this.selectItemText = "";
    if (comId > 0 && orgId > 0 && mainmenuId > 0) {
      this.selectItemText = this.utilityService.getDropDownText(mainmenuId, this.ddlMainmenu);
      if (this.selectItemText == "Payroll") {
        this.areasHttpService.observable_get((ApiArea.controlpanel + ApiController.administration + "/GetPayrollModuleConfigs"), {
          params: { mainemnuId: mainmenuId, companyId: comId, organizationId: orgId }
        }).subscribe((data) => {
          this.logger("data >>>", data);
          this.clearPayrollModuleObj();
          var result = data as any[];
          if (result.length > 0) {
            this.payrollModuleConfig = result[0];
          }
        })
      }
      else if (this.selectItemText == "Provident Fund") {
        this.areasHttpService.observable_get((ApiArea.controlpanel + ApiController.administration + "/GetPFModuleConfigs"), {
          params: { mainemnuId: mainmenuId, companyId: comId, organizationId: orgId }
        }).subscribe((data) => {
          this.logger("data >>>", data);
          this.clearPFModuleObj();
          var result = data as any[];
          if (result.length > 0) {
            this.pfModuleConfig = result[0];
          }
        })
      }
      else if(this.selectItemText == "Human Resource"){
        this.areasHttpService.observable_get((ApiArea.controlpanel + ApiController.administration + "/GetHRModuleConfigs"), {
          params: { mainemnuId: mainmenuId, companyId: comId, organizationId: orgId }
        }).subscribe((data) => {
          this.logger("data >>>", data);
          this.clearHRModuleObj();
          var result = data as any[];
          if (result.length > 0) {
            this.hrModuleConfig = result[0];
          }
        })
      }
    }
  }

  payrollModuleConfig = {
    payrollModuleConfigId: 0,
    applicationId: 0,
    moduleId: 0,
    mainmenuId: 0,
    branchId: 0,
    companyId: 0,
    organizationId: 0,
    whatDoesConsiderationForMonth: "",
    isProvidentFundactivated: false,
    percentageOfBasicForProvidentFund: "0",
    percentageOfActualCalculatedTaxForMonthlyDeduction: "0",
    isOnceOffTaxAvailable: false,
    whenDoesOnceOffTaxCutDown: "",
    isNonResidentTaxApplied: false,
    isFestivalBonusDisbursedbasedonReligion: false,
    discontinuedEmployeesLastMonthPaymentProcess: "",
    userId: this.User().UserId
  }

  clearPayrollModuleObj() {
    this.payrollModuleConfig = {
      payrollModuleConfigId: 0,
      applicationId: 0,
      moduleId: 0,
      mainmenuId: 0,
      branchId: 0,
      companyId: 0,
      organizationId: 0,
      whatDoesConsiderationForMonth: "",
      isProvidentFundactivated: false,
      percentageOfBasicForProvidentFund: "0",
      percentageOfActualCalculatedTaxForMonthlyDeduction: "0",
      isOnceOffTaxAvailable: false,
      whenDoesOnceOffTaxCutDown: "",
      isNonResidentTaxApplied: false,
      isFestivalBonusDisbursedbasedonReligion: false,
      discontinuedEmployeesLastMonthPaymentProcess: "",
      userId: this.User().UserId

    }
  }

  pfModuleConfig = {
    pfModuleConfigId: 0,
    applicationId: 0,
    moduleId: 0,
    mainmenuId: 0,
    branchId: 0,
    companyId: 0,
    organizationId: 0,
    calculateByJoiningDate: false,
    cashFlow: false,
    subsidiary: false,
    onlyEmployeePartLoan: false,
    isIslamic: false,
    monthWiseIntrument: false,
    pendingContribution: false,
    generateAmortization: false,
    loanPaidandAmortization: false,
    receivePaymentReport: false,
    contributionFromPayroll: false,
    instrumentAccruedProcess: false,
    forfeiture: false,
    monthlyprofit: false,
    chequeue: false,
    userId: this.User().UserId
  }

  clearPFModuleObj() {
    this.pfModuleConfig = {
      pfModuleConfigId: 0,
      applicationId: 0,
      moduleId: 0,
      mainmenuId: 0,
      branchId: 0,
      companyId: 0,
      organizationId: 0,
      calculateByJoiningDate: false,
      cashFlow: false,
      subsidiary: false,
      onlyEmployeePartLoan: false,
      isIslamic: false,
      monthWiseIntrument: false,
      pendingContribution: false,
      generateAmortization: false,
      loanPaidandAmortization: false,
      receivePaymentReport: false,
      contributionFromPayroll: false,
      instrumentAccruedProcess: false,
      forfeiture: false,
      monthlyprofit: false,
      chequeue: false,
      userId: this.User().UserId
    }
  }

  hrModuleConfig = {
    applicationId: 0,
    moduleId: 0,
    mainmenuId: 0,
    branchId: 0,
    companyId: 0,
    organizationId: 0,
    enableMaxLateWarning: false,
    maxLateInMonth: 0,
    enableSequenceLateWarning: false,
    sequenceLateInMonth: 0,
    userId: this.User().UserId
  }

  clearHRModuleObj() {
    this.hrModuleConfig = {
      applicationId: 0,
      moduleId: 0,
      mainmenuId: 0,
      branchId: 0,
      companyId: 0,
      organizationId: 0,
      enableMaxLateWarning: false,
      maxLateInMonth: 0,
      enableSequenceLateWarning: false,
      sequenceLateInMonth: 0,
      userId: this.User().UserId
    }
  }

  submitModuleConfigExtension() {
    if (this.selectItemText == "Payroll") {
      this.payrollModuleConfig.organizationId = parseInt(this.moduleConfigOrg.toString());
      this.payrollModuleConfig.companyId = parseInt(this.moduleConfigCom.toString());
      this.payrollModuleConfig.mainmenuId = parseInt(this.mcComMainmenu.toString());
      this.payrollModuleConfig.percentageOfActualCalculatedTaxForMonthlyDeduction =
      this.payrollModuleConfig.percentageOfActualCalculatedTaxForMonthlyDeduction.toString();
      this.payrollModuleConfig.percentageOfBasicForProvidentFund =
      this.payrollModuleConfig.percentageOfBasicForProvidentFund.toString();
      
      this.areasHttpService.observable_post((ApiArea.controlpanel + ApiController.administration + "/SavePayrollModuleConfigs"),
        JSON.stringify(this.payrollModuleConfig),
        {
          'headers': {
            'Content-Type': 'application/json'
          }
        }).subscribe((data: any) => {
          this.logger("this.payrollModuleConfig >>>", this.payrollModuleConfig)
          if (data.status) {
            this.toastr.success("Saved Successfull", "Server Response", { timeOut: 800 })
          }
          else {
            this.toastr.error("Something went wrong", "Server Response", { timeOut: 800 })
          }
        })
    }
    else if (this.selectItemText == "Provident Fund") {
      this.pfModuleConfig.organizationId = parseInt(this.moduleConfigOrg.toString());
      this.pfModuleConfig.companyId = parseInt(this.moduleConfigCom.toString());
      this.pfModuleConfig.mainmenuId = parseInt(this.mcComMainmenu.toString());
      this.areasHttpService.observable_post((ApiArea.controlpanel + ApiController.administration + "/SavePFModuleConfigs"),
        JSON.stringify(this.pfModuleConfig),
        {
          'headers': {
            'Content-Type': 'application/json'
          }
        }).subscribe((data: any) => {
          this.logger("data", data);
          if (data.status) {
            this.toastr.success("Saved Successfull", "Server Response", { timeOut: 800 })
          }
          else {
            this.toastr.error("Something went wrong", "Server Response", { timeOut: 800 })
          }
        })
    }
    else if (this.selectItemText == "Human Resource") {
      this.hrModuleConfig.organizationId = parseInt(this.moduleConfigOrg.toString());
      this.hrModuleConfig.companyId = parseInt(this.moduleConfigCom.toString());
      this.hrModuleConfig.mainmenuId = parseInt(this.mcComMainmenu.toString());
      this.areasHttpService.observable_post((ApiArea.controlpanel + ApiController.administration + "/SaveHRModuleConfigs"),
        JSON.stringify(this.hrModuleConfig),
        {
          'headers': {
            'Content-Type': 'application/json'
          }
        }).subscribe((data: any) => {
          this.logger("data", data);
          if (data.status) {
            this.toastr.success("Saved Successfull", "Server Response", { timeOut: 800 })
          }
          else {
            this.toastr.error("Something went wrong", "Server Response", { timeOut: 800 })
          }
        })
    }
  }

  //#endregion

}
