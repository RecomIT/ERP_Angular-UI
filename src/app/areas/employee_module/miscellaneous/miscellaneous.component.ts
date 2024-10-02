import { transition, trigger, useAnimation } from '@angular/animations';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { bounceIn, fadeIn, fadeInRight, slideInUp } from 'ng-animate';
import { ToastrService } from 'ngx-toastr';
import { ApiArea, ApiController } from 'src/app/shared/constants';
import { CustomModalService } from 'src/app/shared/services/custom-modal.service';
import { UserService } from 'src/app/shared/services/user.service';
import { bank, bankBranch, bloodGroup, jobStatus, jobtype, level, religion } from 'src/models/hrm/miscellaneous-model';
import { AreasHttpService } from '../../areas.http.service';

@Component({
  selector: 'app-miscellaneous',
  templateUrl: './miscellaneous.component.html',
  animations: [
    trigger('slideInUp', [transition('* => *', useAnimation(slideInUp, { params: { timing: 0.5 } }))]),
    trigger('fadeIn', [transition('void => *', useAnimation(fadeIn, { params: { timing: 0.3 } }))]),
    trigger('fadeInRight', [transition('void => *', useAnimation(fadeInRight, { params: { timing: 0.5 } }))]),
    trigger('bounceIn', [transition('void => *', useAnimation(bounceIn, { params: { timing: 1 } }))]),
  ]
})
export class MiscellaneousComponent implements OnInit {

  @ViewChild('bankModal', { static: true }) bankModal!: ElementRef;
  @ViewChild('bankBranchModal', { static: true }) bankBranchModal!: ElementRef;
  @ViewChild('bloodGroupModal', { static: true }) bloodGroupModal!: ElementRef;
  @ViewChild('jobTypeModal', { static: true }) jobTypeModal!: ElementRef;
  @ViewChild('levelModal', { static: true }) levelModal!: ElementRef;
  @ViewChild('jobStatusModal', { static: true }) jobStatusModal!: ElementRef;
  @ViewChild('religionModal', { static: true }) religionModal!: ElementRef;
  modalTitle: string = "";

  constructor(public modalService: CustomModalService, private areasHttpService: AreasHttpService, public toastr: ToastrService, private userService: UserService) { }

  User() {
    return this.userService.User();
  }

  ngOnInit(): void {
    this.getBanks();
    this.getBankBranchs();
    this.getBloodGroups();
    this.getJobTypes();
    this.getLevels();
    this.getJobStatus();
    this.getReligions();
  }
  clearServerErrorText(objName: string) {
    if (objName == "bank") {
      this.duplicateBankName = "";
    }
    if (objName == "bankBranch") {
      this.duplicateBankBranch = "";
      this.duplicateRouting = "";
    }
    if (objName == "bloodGroup") {
      this.duplicateBloodGroup = "";
    }
    if (objName == "jobType") {
      this.duplicateJobType = "";
    }
    if (objName == "level") {
      this.duplicateLevel = "";
    }
    if (objName == "jobStatus") {
      this.duplicateJobStatus = "";
    }
    if (objName == "religion") {
      this.duplicateReligion = "";
    }
  }

  //#region Bank
  bank: bank = {
    bankId: 0,
    bankName: "",
    bankCode: "",
    isActive: false,
    companyId: 0,
    companyName: "",
    organizationId: 0,
    organizationName: "",
    createdBy: "",
    createdDate: null,
    updatedBy: "",
    updatedDate: null
  }
  duplicateBankName: string = "";
  btnBank: boolean = false;
  bankList: bank[] = null;

  openBankModal() {
    this.modalTitle = "Add Bank";
    this.bank = {
      bankId: 0,
      bankName: "",
      bankCode: "",
      isActive: false,
      companyId: 0,
      companyName: "",
      organizationId: 0,
      organizationName: "",
      createdBy: "",
      createdDate: null,
      updatedBy: "",
      updatedDate: null
    };
    this.modalService.open(this.bankModal, "lg");
  }

  getBanks() {
    this.areasHttpService.observable_get((ApiArea.hrms + ApiController.hr + "/GetBanks"), {
      responseType: "json", params: {
        bankId: 0, bankName: "", ComId: this.User().ComId, OrgId: this.User().OrgId,
        UserId: this.User().UserId
      }
    }).subscribe(data => {
      this.bankList = data as bank[];
      console.log("bank >>> ", this.bankList)
    })
  }

  submitBank() {
    this.btnBank = true;
    this.clearServerErrorText("bank")
    this.areasHttpService.observable_post((ApiArea.hrms + ApiController.hr + "/SaveBank"),
      JSON.stringify(this.bank),
      {
        'headers': {
          'Content-Type': 'application/json'
        },
        params: { ComId: this.User().ComId, OrgId: this.User().OrgId, UserId: this.User().UserId }
      }).subscribe((result) => {
        this.btnBank = false;
        let data = result as any;
        console.log(data)
        if (data.status) {
          this.toastr.success("Saved Successfull", "Server Response", { timeOut: 800 })
          this.modalService.service.dismissAll("Save Complete");
          this.getBanks();
        }
        else {
          if (data.msg == "Validation Error") {
            this.duplicateBankName = data.errors.duplicateBankName;
            console.log("Validation Error");
          }
          else {
            this.toastr.error(data.msg, "Server Response", { timeOut: 800 })
          }
        }
      },

        (error) => {
          this.btnBank = false;
          console.log("error", error);
          this.toastr.error(error.error, "Server Response", { timeOut: 800 })
        })
  }

  editBank(id: number) {
    this.clearServerErrorText("bank");
    this.btnBank = false;
    this.bank = Object.assign({}, this.bankList.find(b => b.bankId == id));
    this.modalTitle = "Update Bank";
    this.modalService.open(this.bankModal, "lg");
  }

  //#endregion

  //#region Bank-Branch
  bankBranch: bankBranch = {
    bankBranchId: 0,
    bankBranchName: "",
    routingNumber: "",
    isActive: false,
    bankId: 0,
    bankName: "",
    companyId: 0,
    companyName: "",
    organizationId: 0,
    organizationName: "",
    createdBy: null,
    createdDate: null,
    updatedBy: null,
    updatedDate: null
  }
  bankBranchList: bankBranch[] = null;
  duplicateBankBranch: string = "";
  btnBankBranch: boolean = false;
  duplicateRouting: string = "";

  openBankBranchModal() {
    this.bankBranch = {
      bankBranchId: 0,
      bankBranchName: "",
      routingNumber: "",
      isActive: false,
      bankId: 0,
      bankName: "",
      companyId: 0,
      companyName: "",
      organizationId: 0,
      organizationName: "",
      createdBy: null,
      createdDate: null,
      updatedBy: null,
      updatedDate: null
    };
    this.btnBankBranch = false;
    this.modalTitle = "Add Bank Branch";
    this.clearServerErrorText("bankBranch");
    this.modalService.open(this.bankBranchModal, "lg");
  }
  getBankBranchs() {
    this.areasHttpService.observable_get((ApiArea.hrms + ApiController.hr + "/GetBankBranches"), {
      responseType: "json", params: {
        bankBranchId: 0, bankBranchName: "", bankId: 0, ComId: this.User().ComId, OrgId: this.User().OrgId,
        UserId: this.User().UserId
      }
    }).subscribe(data => {
      this.bankBranchList = data as bankBranch[];
      console.log("bankBranchList >>> ", this.bankBranchList)
    })
  }
  submitBankBranch() {
    this.btnBankBranch = true;
    this.clearServerErrorText("bankBranch")
    this.areasHttpService.observable_post((ApiArea.hrms + ApiController.hr + "/SaveBankBranch"),
      JSON.stringify(this.bankBranch),
      {
        'headers': {
          'Content-Type': 'application/json'
        },
        params: { ComId: this.User().ComId, OrgId: this.User().OrgId, UserId: this.User().UserId }
      }).subscribe((result) => {
        this.btnBankBranch = false;
        let data = result as any;
        console.log(data)
        if (data.status) {
          this.toastr.success("Saved Successfull", "Server Response", { timeOut: 800 })
          this.modalService.service.dismissAll("Save Complete");
          this.getBankBranchs();
        }
        else {
          if (data.msg == "Validation Error") {
            this.duplicateBankBranch = data.errors.duplicateBankBranch;
            this.duplicateRouting = data.errors.duplicateRouting;
            console.log("Validation Error");
          }
          else {
            this.toastr.error(data.msg, "Server Response", { timeOut: 800 })
          }
        }
      },
        (error) => {
          this.btnBankBranch = false;
          console.log("error", error);
          this.toastr.error(error.error, "Server Response", { timeOut: 800 })
        })
  }

  editBankBranch(id: number) {
    this.clearServerErrorText("bankBranch");
    this.btnBankBranch = false;
    this.bankBranch = Object.assign({}, this.bankBranchList.find(b => b.bankBranchId == id));
    this.modalTitle = "Update Bank-Branch";
    this.modalService.open(this.bankBranchModal, "lg");
  }


  //#endregion

  //#region blood Group
  bloodGroupList: bloodGroup[] = null;

  bloodGroup: bloodGroup = {
    bloodGroupId: 0,
    bloodGroupName: "",
    organizationId: 0,
    organizationName: "",
    createdBy: null,
    createdDate: null,
    updatedBy: null,
    updatedDate: null
  }

  btnBloodGroup: boolean = false;
  duplicateBloodGroup: string = "";

  openBloodGroupModal() {
    this.bloodGroup = {
      bloodGroupId: 0,
      bloodGroupName: "",
      organizationId: 0,
      organizationName: "",
      createdBy: null,
      createdDate: null,
      updatedBy: null,
      updatedDate: null
    };
    this.btnBloodGroup = false;
    this.clearServerErrorText("bloodGroup");
    this.modalTitle = "Add Blood Group";
    this.modalService.open(this.bloodGroupModal, "sm");
  }

  getBloodGroups() {
    this.areasHttpService.observable_get((ApiArea.hrms + ApiController.hr + "/GetBloodGroups"), {
      responseType: "json", params: {
        bloodGroupId: 0, bloodGroupName: "", OrgId: this.User().OrgId,
        UserId: this.User().UserId
      }
    }).subscribe(data => {
      this.bloodGroupList = data as bloodGroup[];
      console.log("bloodGroupList >>> ", this.bloodGroupList)
    })
  }

  submitBloodGroup() {
    // console.log(this.bloodGroup);
    // return 
    this.btnBloodGroup = true;
    this.clearServerErrorText("bloodGroup")

    this.areasHttpService.observable_post((ApiArea.hrms + ApiController.hr + "/SaveBloodGroup"),
      JSON.stringify(this.bloodGroup),
      {
        'headers': {
          'Content-Type': 'application/json'
        },
        params: { OrgId: this.User().OrgId, UserId: this.User().UserId }
      }).subscribe((result) => {
        this.btnBloodGroup = false;
        let data = result as any;
        //console.log(data)
        if (data.status) {
          this.toastr.success("Saved Successfull", "Server Response", { timeOut: 800 })
          this.modalService.service.dismissAll("Save Complete");
          this.getBloodGroups();
        }
        else {
          if (data.msg == "Validation Error") {
            this.duplicateBloodGroup = data.errors.duplicateBloodGroup;
          }
          else {
            this.toastr.error(data.msg, "Server Response", { timeOut: 800 })
          }
        }
      },
        (error) => {
          this.btnBloodGroup = false;
          this.toastr.error(error.error, "Server Response", { timeOut: 800 })
        })
  }

  editBloodGroup(id: number) {
    this.bloodGroup = Object.assign({}, this.bloodGroupList.find(b => b.bloodGroupId == id));
    this.clearServerErrorText("bloodGroup");
    this.btnBloodGroup = false;
    this.modalTitle = "Update Blood Group";
    this.modalService.open(this.bloodGroupModal, "sm");
  }

  //#endregion

  //#region Job-Type
  jobtype: jobtype = {
    jobTypeId: 0,
    jobTypeName: "",
    duration: "",
    remarks: "",
    organizationId: 0,
    organizationName: "",
    createdBy: null,
    createdDate: null,
    updatedBy: null,
    updatedDate: null
  }
  jobtypeList: jobtype[] = null;
  btnJobType: boolean = false;
  duplicateJobType: string = "";

  openJobTypeModal() {
    this.jobtype = {
      jobTypeId: 0,
      jobTypeName: "",
      duration: "",
      remarks: "",
      organizationId: 0,
      organizationName: "",
      createdBy: null,
      createdDate: null,
      updatedBy: null,
      updatedDate: null
    }
    this.modalTitle = "Add Job-Type";
    this.btnJobType = false;
    this.clearServerErrorText("jobType");
    this.modalService.open(this.jobTypeModal, "lg");
  }

  getJobTypes() {
    this.areasHttpService.observable_get((ApiArea.hrms + ApiController.hr + "/GetJobtypes"), {
      responseType: "json", params: {
        JobTypeId: 0, JobTypeName: "", OrgId: this.User().OrgId, UserId: this.User().UserId
      }
    }).subscribe(data => {
      this.jobtypeList = data as jobtype[];
      console.log("jobtypeList >>> ", this.jobtypeList)
    })
  }

  submitJobType() {
    this.btnJobType = false;
    this.clearServerErrorText("jobType");
    this.areasHttpService.observable_post((ApiArea.hrms + ApiController.hr + "/SaveJobtype"),
      JSON.stringify(this.jobtype),
      {
        'headers': {
          'Content-Type': 'application/json'
        },
        params: { OrgId: this.User().OrgId, UserId: this.User().UserId }
      }).subscribe((result) => {
        this.btnJobType = false;
        let data = result as any;
        if (data.status) {
          this.toastr.success("Saved Successfull", "Server Response", { timeOut: 800 })
          this.modalService.service.dismissAll("Save Complete");
          this.getJobTypes();
        }
        else {
          if (data.msg == "Validation Error") {
            this.duplicateJobType = data.errors.duplicateJobType;
          }
          else {
            this.toastr.error(data.msg, "Server Response", { timeOut: 800 })
          }
        }
      },
        (error) => {
          this.btnJobType = false;
          this.toastr.error(error.error, "Server Response", { timeOut: 800 })
        })
  }

  editJobType(id: number) {
    this.jobtype = Object.assign({}, this.jobtypeList.find(j => j.jobTypeId == id));
    this.modalTitle = "Update Job-Type";
    this.clearServerErrorText("jobType");
    this.btnJobType = false;
    this.modalService.open(this.jobTypeModal, "lg");
  }
  //#endregion

  //#region Level
  level: level = {
    levelId: 0,
    levelName: "",
    remarks: "",
    organizationId: 0,
    organizationName: "",
    createdBy: null,
    createdDate: null,
    updatedBy: null,
    updatedDate: null
  }
  levelList: level[] = null;
  btnLevel: boolean = false;
  duplicateLevel: string = "";
  openLevelModal() {
    this.level = {
      levelId: 0,
      levelName: "",
      remarks: "",
      organizationId: 0,
      organizationName: "",
      createdBy: null,
      createdDate: null,
      updatedBy: null,
      updatedDate: null
    }
    this.btnLevel = false;
    this.clearServerErrorText("level");
    this.modalTitle = "Add Level";
    this.modalService.open(this.levelModal, "lg")
  }

  getLevels() {
    this.areasHttpService.observable_get((ApiArea.hrms + ApiController.hr + "/GetLevels"), {
      responseType: "json", params: {
        levelId: 0, levelName: "", OrgId: this.User().OrgId, UserId: this.User().UserId
      }
    }).subscribe(data => {
      this.levelList = data as level[];
      console.log("levelList >>> ", this.levelList)
    })
  }

  submitLevel() {
    this.btnLevel = false;
    this.clearServerErrorText("jobType");
    this.areasHttpService.observable_post((ApiArea.hrms + ApiController.hr + "/SaveLevel"),
      JSON.stringify(this.level),
      {
        'headers': {
          'Content-Type': 'application/json'
        },
        params: { OrgId: this.User().OrgId, UserId: this.User().UserId }
      }).subscribe((result) => {
        this.btnLevel = false;
        let data = result as any;
        if (data.status) {
          this.toastr.success("Saved Successfull", "Server Response", { timeOut: 800 })
          this.modalService.service.dismissAll("Save Complete");
          this.getLevels();
        }
        else {
          if (data.msg == "Validation Error") {
            this.duplicateLevel = data.errors.duplicateLevel;
          }
          else {
            this.toastr.error(data.msg, "Server Response", { timeOut: 800 })
          }
        }
      },
        (error) => {
          this.btnLevel = false;
          this.toastr.error(error.error, "Server Response", { timeOut: 800 })
        })
  }

  editLevel(id: number) {
    this.level = Object.assign({}, this.levelList.find(l => l.levelId == id));
    this.clearServerErrorText("level");
    this.modalService.open(this.levelModal, "lg");
    this.modalTitle = "Update Level";
    this.btnLevel = false;
  }
  //#endregion

  //#region Status
  jobstatus: jobStatus = {
    statusId: 0,
    jobStatusName: "",
    remarks: "",
    organizationId: 0,
    organizationName: "",
    createdBy: null,
    createdDate: null,
    updatedBy: null,
    updatedDate: null
  }
  jobStatusList: jobStatus[] = null;
  btnJobStatus: boolean = false;
  duplicateJobStatus: string = "";

  openJobStatusModal() {
    this.jobstatus = {
      statusId: 0,
      jobStatusName: "",
      remarks: "",
      organizationId: 0,
      organizationName: "",
      createdBy: null,
      createdDate: null,
      updatedBy: null,
      updatedDate: null
    }
    this.modalTitle = "Add Job-Status";
    this.btnJobStatus = false;
    this.clearServerErrorText("jobStatus");
    this.modalService.open(this.jobStatusModal, "lg");
  }

  getJobStatus() {
    this.areasHttpService.observable_get((ApiArea.hrms + ApiController.hr + "/GetJobStatus"), {
      responseType: "json", params: {
        statusId: 0, jobStatusName: "", OrgId: this.User().OrgId, UserId: this.User().UserId
      }
    }).subscribe(data => {
      this.jobStatusList = data as jobStatus[];
      console.log("jobStatusList >>> ", this.jobStatusList)
    })
  }

  submitJobStatus() {
    this.btnJobStatus = false;
    this.clearServerErrorText("jobType");
    this.areasHttpService.observable_post((ApiArea.hrms + ApiController.hr + "/SaveStatus"),
      JSON.stringify(this.jobstatus),
      {
        'headers': {
          'Content-Type': 'application/json'
        },
        params: { OrgId: this.User().OrgId, UserId: this.User().UserId }
      }).subscribe((result) => {
        this.btnJobStatus = false;
        let data = result as any;
        if (data.status) {
          this.toastr.success("Saved Successfull", "Server Response", { timeOut: 800 })
          this.modalService.service.dismissAll("Save Complete");
          this.getJobStatus();
        }
        else {
          if (data.msg == "Validation Error") {
            this.duplicateJobStatus = data.errors.duplicateJobStatus;
          }
          else {
            this.toastr.error(data.msg, "Server Response", { timeOut: 800 })
          }
        }
      },
        (error) => {
          this.btnJobStatus = false;
          this.toastr.error(error.error, "Server Response", { timeOut: 800 })
        })
  }

  editJobStaus(id: number) {
    this.jobstatus = Object.assign({}, this.jobStatusList.find(s => s.statusId == id));
    this.clearServerErrorText("jobStatus");
    this.modalService.open(this.jobStatusModal, "lg");
    this.modalTitle = "Update Job-Status";
    this.btnJobStatus = false;
  }

  //#endregion

  //#region religion
  religion: religion = {
    religionId: 0,
    religionName: "",
    religionCode: "",
    organizationId: 0,
    organizationName: "",
    createdBy: null,
    createdDate: null,
    updatedBy: null,
    updatedDate: null
  };
  religionList: religion[] = null;
  btnReligion: boolean = false;
  duplicateReligion: string = "";

  openReligionModal() {
    this.religion = {
      religionId: 0,
      religionName: "",
      religionCode: "",
      organizationId: 0,
      organizationName: "",
      createdBy: null,
      createdDate: null,
      updatedBy: null,
      updatedDate: null
    };
    this.modalTitle = "Add Religion";
    this.btnReligion = false;
    this.clearServerErrorText("religion");
    this.modalService.open(this.religionModal, "lg");
  }

  getReligions() {
    this.areasHttpService.observable_get((ApiArea.hrms + ApiController.hr + "/GetReligions"), {
      responseType: "json", params: {
        religionId: 0, religionName: "", OrgId: this.User().OrgId, UserId: this.User().UserId
      }
    }).subscribe(data => {
      this.religionList = data as religion[];
      console.log("religionList >>> ", this.religionList)
    })
  }
  submitReligion() {
    this.btnReligion = false;
    this.clearServerErrorText("religion");
    this.areasHttpService.observable_post((ApiArea.hrms + ApiController.hr + "/SaveReligion"),
      JSON.stringify(this.religion),
      {
        'headers': {
          'Content-Type': 'application/json'
        },
        params: { OrgId: this.User().OrgId, UserId: this.User().UserId }
      }).subscribe((result) => {
        this.btnReligion = false;
        let data = result as any;
        if (data.status) {
          this.toastr.success("Saved Successfull", "Server Response", { timeOut: 800 })
          this.modalService.service.dismissAll("Save Complete");
          this.getReligions();
        }
        else {
          if (data.msg == "Validation Error") {
            this.duplicateReligion = data.errors.duplicateReligion;
          }
          else {
            this.toastr.error(data.msg, "Server Response", { timeOut: 800 })
          }
        }
      },
        (error) => {
          this.btnReligion = false;
          this.toastr.error(error.error, "Server Response", { timeOut: 800 })
        })
  }
  editReligion(id: number) {
    this.religion = Object.assign({}, this.religionList.find(r => r.religionId == id));
    this.clearServerErrorText("religion");
    this.btnReligion = false;
    this.modalTitle = "Update Religion";
    this.modalService.open(this.religionModal, "lg");
  }
  //#endregion
}
