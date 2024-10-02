import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { ApiArea, ApiController } from 'src/app/shared/constants';
import { CustomModalService } from 'src/app/shared/services/custom-modal.service';
import { UserService } from 'src/app/shared/services/user.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { deductionHead, deductionName } from 'src/models/payroll/deduction-model';
import { AreasHttpService } from '../../../../areas.http.service';
import { transition, trigger, useAnimation } from '@angular/animations';
import { bounceIn, fadeIn, fadeInRight, slideInUp } from 'ng-animate';
import { DeductionHeadService } from './deduction-head.service';
import { DeductionNameService } from './deduction-name.service';

@Component({
  selector: 'app-deduction',
  templateUrl: './deduction-head.component.html',
  animations: [
    trigger('slideInUp', [transition('* => *', useAnimation(slideInUp, { params: { timing: 0.5 } }))]),
    trigger('fadeIn', [transition('void => *', useAnimation(fadeIn, { params: { timing: 0.3 } }))]),
    trigger('fadeInRight', [transition('void => *', useAnimation(fadeInRight, { params: { timing: 0.5 } }))]),
    trigger('bounceIn', [transition('void => *', useAnimation(bounceIn, { params: { timing: 1 } }))]),
  ],
})

export class DeductionHeadComponent implements OnInit {

  @ViewChild('deductionHeadModal', { static: true }) deductionHeadModal!: ElementRef;
  @ViewChild('deductionNameModal', { static: true }) deductionNameModal!: ElementRef;
  modalTitle: string = "";
  datePickerConfig: Partial<BsDatepickerConfig> = this.utilityService.datePickerConfig();
  pagePrivilege: any = this.userService.getPrivileges();;

  constructor(public modalService: CustomModalService, private areasHttpService: AreasHttpService, private userService: UserService, private utilityService: UtilityService, private deductionHeadService: DeductionHeadService, private deductionNameService: DeductionNameService) { }

  ngOnInit(): void {
    this.getDeductionHeads();
    this.getDeductionNames();
  }

  deductionHead: deductionHead = {
    deductionHeadCode: "",
    deductionHeadName: "",
    deductionHeadNameInBengali: "",
    deductionHeadId: 0,
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

  clearDeductionHeadObj() {
    this.deductionHead = {
      deductionHeadName: "",
      deductionHeadCode: "",
      deductionHeadNameInBengali: "",
      deductionHeadId: 0,
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

  btnDeductionHead: boolean = false;
  openDeductionHeadModal() {
    this.clearDeductionHeadObj();
    this.modalTitle = "Add Deduction Head";
    this.modalService.open(this.deductionHeadModal, 'lg');
  }

  duplicateDeductionHeadName: string = "";
  duplicateDeductionHeadNameInBengali: string = "";

  submitDeductionHead(form: NgForm) {
    if (this.deductionHead.deductionHeadId == 0) {
      this.deductionHead.companyId = this.User().ComId;
      this.deductionHead.organizationId = this.User().OrgId;
    }
    this.duplicateDeductionHeadName = "";
    this.duplicateDeductionHeadNameInBengali = "";

    this.deductionHeadService.save(this.deductionHead).subscribe(response => {
      console.log("response >>>", response);
      if (response.status) {
        this.utilityService.success("Saved Successfull", "Server Response")
        this.modalService.service.dismissAll("Save Complete");
        this.clearDeductionHeadObj();
        this.getDeductionHeads();
      }
      else {
        if (response.msg == "Validation Error") {
          this.duplicateDeductionHeadName = response.errors.duplicateDeductionHeadName;
          this.duplicateDeductionHeadNameInBengali = response.errors.duplicateDeductionHeadNameInBengali;
          this.utilityService.fail(response.msg, "Server Response")
        }
        else {
          this.utilityService.success(response.msg, "Server Response")
        }
      }
    }, (error) => {
      console.log("error >>>", error);
      this.utilityService.fail("Something went wrong", "Sever Response");
    })

  }

  deductionHeadList: any[] = [];
  getDeductionHeads() {
    this.deductionHeadService.get({}).subscribe(response => {
      console.log("response >>>", response);
      this.deductionHeadList = response.body;
    }, (error) => {
      console.log("error >>>", error);
      this.utilityService.fail("Something went wrong", "Server Response");
    })
  }

  editDeductionHead(id: number) {
    this.clearDeductionHeadObj();
    this.deductionHead = Object.assign({}, this.deductionHeadList.find(s => s.deductionHeadId == id));
    this.modalTitle = "Update Deduction Head";
    this.modalService.open(this.deductionHeadModal, 'lg');
  }



  //#region deductionName
  openDeductionNameModal() {
    this.clearDeductionNameObj();
    this.modalTitle = "Add Deduction Name";
    this.modalService.open(this.deductionNameModal, 'lg');
  }
  btnDeductionName: boolean = false;
  deductionName = {
    deductionNameId: 0,
    deductionHeadId: 0,
    name: "",
    deductionClientName: "",
    deductionClientNameInBengali: "",
    deductionDescription: "",
    deductionDescriptionInBengali: "",
    deductionNameInBengali: "",
    companyId: 0,
    companyName: "",
    createdBy: "",
    createdDate: null,
    glCode: "",
    deductionType: "",
    isFixed: false,
    organizationId: 0,
    organizationName: "",
    updatedBy: "",
    updatedDate: null,
    deductionHeadName: "",
    flag: ""
  }

  deductionNameList: any[] = [];
  clearDeductionNameObj() {
    this.deductionName = {
      deductionNameId: 0,
      name: "",
      deductionNameInBengali: "",
      deductionHeadId: 0,
      deductionClientName: "",
      deductionClientNameInBengali: "",
      deductionDescription: "",
      deductionDescriptionInBengali: "",
      companyId: 0,
      companyName: "",
      createdBy: "",
      createdDate: null,
      glCode: "",
      deductionType: "",
      isFixed: false,
      organizationId: 0,
      organizationName: "",
      updatedBy: "",
      updatedDate: null,
      deductionHeadName: "",
      flag: ""
    }
  }

  duplicateDeductionName: string = "";
  duplicateDeductionNameInBengali: string = "";

  submitDeductionName(form: NgForm) {
    this.duplicateDeductionName = "";
    this.duplicateDeductionNameInBengali = "";
    this.btnDeductionName = true;
    if (form.valid) {
      this.deductionNameService.save(this.deductionName).subscribe(response => {
        this.btnDeductionName = false;
        if (response.status) {
          this.utilityService.success("Saved Successfull", "Server Response")
          this.modalService.service.dismissAll("Save Complete");
          this.clearDeductionNameObj();
          this.getDeductionNames();
        }
        else {
          if (response.msg == "Validation Error") {
            this.duplicateDeductionName = response.errors.duplicateDeductionName;
            this.duplicateDeductionNameInBengali = response.errors.duplicateDeductionNameInBengali;
            this.utilityService.fail(response.msg, "Server Response")
          }
          else {
            this.utilityService.fail(response.msg, "Server Response")
          }
        }
      }, (error) => {
        this.btnDeductionName = false;
        console.log("error >>>", error);
        this.utilityService.fail("Something went wrong", "Server Response")
      })
    }
  }

  getDeductionNames() {
    // this.areasHttpService.observable_get((ApiArea.payroll + "/DeductionName/GetDeductionNames"), {
    //   responseType: "json", params: {
    //     deductionNameId: 0, deductionName: "", deductionHeadId: 0, companyId: this.User().ComId, organizationId: this.User().OrgId
    //   }
    // }).subscribe(data => {
    //   this.deductionNameList = data as deductionName[];
    //   this.logger("deductionNameList >>>", this.deductionNameList);
    // })

    this.deductionNameService.get({}).subscribe(response => {
      this.deductionNameList = response.body;
    }, (error) => {
      console.log("error >>>", error);
      this.utilityService.fail("Something went wrong", "Server Response");
    })
  }

  editDeductionName(id: number) {
    this.clearDeductionNameObj();
    this.deductionName = Object.assign({}, this.deductionNameList.find(s => s.deductionNameId == id));
    this.modalTitle = "Update Deduction Name";
    this.modalService.open(this.deductionNameModal, 'lg');
  }
  //#endregion

}
