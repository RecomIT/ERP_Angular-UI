import { transition, trigger, useAnimation } from '@angular/animations';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { bounceIn, fadeIn, fadeInRight, slideInUp } from 'ng-animate';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { CustomModalService } from 'src/app/shared/services/custom-modal.service';
import { UserService } from 'src/app/shared/services/user.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { allowanceHead } from 'src/models/payroll/allowance-model';
import { AreasHttpService } from '../../../../../areas.http.service';
import { AllowanceHeadService } from '../allowance-head.service';
import { AllowanceNameService } from '../allowance-name.service';

@Component({
  selector: 'app-allowance',
  templateUrl: './allowance-head.component.html',
  animations: [
    trigger('slideInUp', [transition('* => *', useAnimation(slideInUp, { params: { timing: 0.5 } }))]),
    trigger('fadeIn', [transition('void => *', useAnimation(fadeIn, { params: { timing: 0.3 } }))]),
    trigger('fadeInRight', [transition('void => *', useAnimation(fadeInRight, { params: { timing: 0.5 } }))]),
    trigger('bounceIn', [transition('void => *', useAnimation(bounceIn, { params: { timing: 1 } }))]),
  ],
})
export class AllowanceHeadComponent implements OnInit {

  @ViewChild('allowanceHeadModal', { static: true }) allowanceHeadModal!: ElementRef;
  @ViewChild('allowanceNameModal', { static: true }) allowanceNameModal!: ElementRef;
  modalTitle: string = "";
  datePickerConfig: Partial<BsDatepickerConfig> = this.utilityService.datePickerConfig();
  pagePrivilege: any = this.userService.getPrivileges();;


  constructor(public modalService: CustomModalService, private areasHttpService: AreasHttpService, private allowanceHeadService: AllowanceHeadService, private allowanceNameService: AllowanceNameService, private userService: UserService, private utilityService: UtilityService) { }

  ngOnInit(): void {
    this.getAllowanceHeads();
    this.getAllowanceNames();
  }

  allowanceHead: allowanceHead = {
    allowanceHeadCode: "",
    allowanceHeadName: "",
    allowanceHeadNameInBengali: "",
    allowanceHeadId: 0,
    companyId: 0,
    organizationId: 0,
    companyName: "",
    organizationName: "",
    createdBy: "",
    createdDate: null,
    updatedBy: "",
    updatedDate: null
  }

  User() {
    return this.userService.User();
  }

  logger(msg: any, optionsParams: any) {
    this.utilityService.consoleLog(msg, optionsParams)
  }

  clearAllowanceHeadObj() {
    this.allowanceHead = {
      allowanceHeadName: "",
      allowanceHeadCode: "",
      allowanceHeadNameInBengali: "",
      allowanceHeadId: 0,
      companyId: 0,
      organizationId: 0,
      companyName: "",
      organizationName: "",
      createdBy: "",
      createdDate: null,
      updatedBy: "",
      updatedDate: null
    }
  }

  btnAllowanceHead: boolean = false;
  openAllowanceHeadModal() {
    this.clearAllowanceHeadObj();
    this.modalTitle = "Add Allowance Head";
    this.modalService.open(this.allowanceHeadModal, 'lg')
  }

  duplicateAllowanceHeadName: string = "";
  duplicateAllowanceHeadNameInBengali: string = "";

  submitAllowanceHead(form: NgForm) {
    if (this.allowanceHead.allowanceHeadId == 0) {
      this.allowanceHead.companyId = this.User().ComId;
      this.allowanceHead.organizationId = this.User().OrgId;
    }
    this.duplicateAllowanceHeadName = "";
    this.duplicateAllowanceHeadNameInBengali = "";


    this.allowanceHeadService.save(this.allowanceHead).subscribe(response => {
      if (response.status) {
        this.utilityService.success("Saved Successfull", "Server Response")
        this.modalService.service.dismissAll("Save Complete");
        this.clearAllowanceHeadObj();
        this.getAllowanceHeads();
      }
      else {
        if (response.msg == "Validation Error") {
          this.duplicateAllowanceHeadName = response.errors.duplicateAllowanceHeadName;
          this.duplicateAllowanceHeadNameInBengali = response.errors.duplicateAllowanceHeadNameInBengali;
          this.utilityService.fail(response.msg, "Server Response")
        }
        else {
          this.utilityService.success(response.msg, "Server Response")
        }
      }
    }, (error) => {
      console.log("error >>>", error);
    })
  }

  allowanceHeadList: any[] = [];
  getAllowanceHeads() {
    this.allowanceHeadService.get({}).subscribe(response => {
      console.log("head response >>>", response);
      this.allowanceHeadList = response.body;
    }, (error) => {
      console.log("error >>>", error)
      this.utilityService.fail('Somethign went wrong', 'Server Response');
    })
  }

  editAllowanceHead(id: number) {
    this.clearAllowanceHeadObj();
    this.allowanceHead = Object.assign({}, this.allowanceHeadList.find(s => s.allowanceHeadId == id));
    this.modalTitle = "Update Allowance Head";
    this.modalService.open(this.allowanceHeadModal, 'lg');
  }

  //#region allowanceName
  openAllowanceNameModal() {
    this.clearAllowanceNameObj();
    this.allowanceName.allowanceType = "General";
    this.modalTitle = "Add Allowance Name";
    this.modalService.open(this.allowanceNameModal, 'lg');
  }

  btnAllowanceName: boolean = false;
  allowanceName = {
    allowanceNameId: 0,
    allowanceHeadId: 0,
    name: "",
    allowanceClientName: "",
    allowanceClientNameInBengali: "",
    allowanceDescription: "",
    allowanceDescriptionInBengali: "",
    allowanceNameInBengali: "",
    companyId: 0,
    companyName: "",
    createdBy: "",
    createdDate: null,
    glCode: "",
    allowanceType: "General",
    isFixed: false,
    organizationId: 0,
    organizationName: "",
    updatedBy: "",
    updatedDate: null,
    allowanceHeadName: "",
    allowanceFlag: ""

  }

  allowanceNameList: any[] = [];
  clearAllowanceNameObj() {
    this.allowanceName = {
      allowanceNameId: 0,
      name: "",
      allowanceNameInBengali: "",
      allowanceHeadId: 0,
      allowanceClientName: "",
      allowanceClientNameInBengali: "",
      allowanceDescription: "",
      allowanceDescriptionInBengali: "",
      companyId: 0,
      companyName: "",
      createdBy: "",
      createdDate: null,
      glCode: "",
      allowanceType: "",
      isFixed: false,
      organizationId: 0,
      organizationName: "",
      updatedBy: "",
      updatedDate: null,
      allowanceHeadName: "",
      allowanceFlag: ""
    }
    this.duplicateAllowanceName = null;
    this.duplicateAllowanceNameFlag = null;
    this.duplicateAllowanceGLCode = null;
  }

  duplicateAllowanceName: string = null;
  duplicateAllowanceNameFlag: string = null;
  duplicateAllowanceGLCode: string = null;

  submitAllowanceName(form: NgForm) {
    this.duplicateAllowanceName = "";
    this.duplicateAllowanceNameFlag = "";
    this.btnAllowanceName = true;
    if (form.valid) {
      this.allowanceName.isFixed = this.allowanceName.isFixed == null ? false : this.allowanceName.isFixed;

      this.allowanceNameService.save(this.allowanceName).subscribe(response=>{
        console.log("response >>>", response);
        this.btnAllowanceName = false;
          if (response.status) {
          this.utilityService.success("Saved Successfull", "Server Response")
          this.modalService.service.dismissAll("Save Complete");
          this.clearAllowanceNameObj();
          this.getAllowanceNames();
        }
        else {
          if (response.msg == "Validation Error") {
            this.utilityService.fail(response.msg, "Server Response");
            let errorObj = JSON.parse(response.errorMsg);
            console.log("errorObj >>>", errorObj);
            this.duplicateAllowanceName = errorObj?.duplicate_allowance;
            this.duplicateAllowanceNameFlag = errorObj?.duplicate_flag;
            this.duplicateAllowanceGLCode = errorObj?.duplicate_gl;
          }
          else {
            this.utilityService.success(response.msg, "Server Response")
          }
        }
      },(error)=>{
        console.log("error >>>", error);
        this.btnAllowanceName = false;
        this.utilityService.fail("Something went wrong","Server Response");
      })

    }
  }

  getAllowanceNames() {
    this.allowanceNameService.get({}).subscribe(response=>{
      this.allowanceNameList = response.body;
    },(error)=>{
      console.log("error >>>", error);
      this.utilityService.fail("Something went wrong",'Server Response');
    })
  }

  editAllowanceName(id: number) {
    this.clearAllowanceNameObj();
    this.allowanceName = Object.assign({}, this.allowanceNameList.find(s => s.allowanceNameId == id));
    console.log("allowanceName >>>>", this.allowanceName);
    this.modalTitle = "Update Allowance Name";
    this.modalService.open(this.allowanceNameModal, 'lg');
  }
  //#endregion


}
