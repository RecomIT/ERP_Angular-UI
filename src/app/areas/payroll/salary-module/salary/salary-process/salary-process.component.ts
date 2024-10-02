import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { ApiArea, ApiController } from 'src/app/shared/constants';
import { CustomModalService } from 'src/app/shared/services/custom-modal.service';
import { HrWebService } from 'src/app/shared/services/hr-web.service';
import { PayrollWebService } from 'src/app/shared/services/payroll-web.service';
import { UserService } from 'src/app/shared/services/user.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AreasHttpService } from '../../../../areas.http.service';
import { trigger, transition, useAnimation } from '@angular/animations';
import { fadeIn } from 'ng-animate';
import { Router } from '@angular/router';
import { ControlPanelWebService } from 'src/app/shared/services/control-panel.service';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-salary-process',
  templateUrl: './salary-process.component.html',
  animations: [
    trigger('fadeIn', [transition('void => *', useAnimation(fadeIn))]),
  ],
})
export class SalaryProcessComponent implements OnInit {

  @ViewChild('salaryProcessDetailModal', { static: true }) salaryProcessDetailModal!: ElementRef;
  @ViewChild('salaryProcessCheckingModal', { static: true }) salaryProcessCheckingModal!: ElementRef;

  constructor(private router: Router
    , private datepipe: DatePipe, private fb: FormBuilder, private areasHttpService: AreasHttpService, private payrollWebService: PayrollWebService, private utilityService: UtilityService, private hrWebService: HrWebService, private userService: UserService, public modalService: CustomModalService, private el: ElementRef, private controlPanelWebService: ControlPanelWebService) {
      //this.checkUserPrivilege("SalaryProcessComponent");
  }
  pagePrivilege: any= this.userService.getPrivileges();
  datePickerConfig: Partial<BsDatepickerConfig> = {};
  isViewPage: boolean = true;

  ngOnInit(): void {
    this.datePickerConfig = Object.assign({}, {
      containerClass: "theme-dark-blue",
      showWeekNumbers: false,
      dateInputFormat: "DD-MMMM-YYYY",
      isAnimated: true,
      showClearButton: false,
      showTodayButton: false,
      todayPosition: "left",
      rangeInputFormat: "DD-MMM-YYYY",
      rangeSeparator: " ~ ",
      size: "sm",
      customTodayClass: 'custom-today-class'
    })
    this.salaryProcessFormInit();
    this.getSalaryProcessInfos();
  }

  showPage() {
    this.isViewPage = !this.isViewPage;
  }

  select2Options = {
    width: "100%",
    containerCssClass: "form-control form-control-sm text-x-small font-bold",
    theme: "bootstrap4"
  }

  logger(msg: any, options: any) {
    this.utilityService.consoleLog(msg, options);
  }

  User() {
    return this.userService.User();
  }

  salaryProcessForm: FormGroup;
  salaryProcessFormInit() {
    this.salaryProcessForm = this.fb.group({
      processBy: new FormControl('Uploaded Component', [Validators.required]),
      monthYear: new FormControl('', [Validators.required]),
      salaryDate: new FormControl(null, [Validators.required]),
      branchId: new FormControl(this.User().BranchId),
      companyId: new FormControl(this.User().ComId),
      organizationId: new FormControl(this.User().OrgId),
      createdBy: new FormControl(this.User().UserId),
      updatedBy: new FormControl(this.User().UserId)
    })

    this.salaryProcessForm.valueChanges.subscribe((data) => {
      this.logFormErrors();
    })
  }

  formErrors = {
    'processBy': '',
    'monthYear': '',
    'salaryDate': ''
  }

  validationMessages = {
    'processBy': {
      'required': 'Field is required'
    },
    'monthYear': {
      'required': 'Field is required'
    },
    'salaryDate': {
      'required': 'Field is required'
    }
  }

  logFormErrors(formGroup: FormGroup = this.salaryProcessForm) {
    Object.keys(formGroup.controls).forEach((key: string) => {
      const abstractControl = formGroup.get(key);
      //console.log("key>>", key);
      this.formErrors[key] = '';
      if (abstractControl && !abstractControl.valid && (abstractControl.touched || abstractControl.dirty)) {
        const messages = this.validationMessages[key];
        // console.log("messages>>", messages);
        // console.log("abstractControl.value >>", abstractControl.value);
        // console.log("abstractControl.errors>>", abstractControl.errors);
        for (const errorKey in abstractControl.errors) {
          this.formErrors[key] += messages[errorKey];
        }
      }
    })
  }

  btnProcess: boolean = false;
  runSalaryProcess() {
    this.logger("Is Valid>>", this.salaryProcessForm.valid)
    this.logger("Form Values>>", this.salaryProcessForm.value)
    if (this.salaryProcessForm.valid) {
      this.btnProcess = true;
      this.areasHttpService.observable_post((ApiArea.payroll + ApiController.salary + "/SalaryProcess"), JSON.stringify(this.salaryProcessForm.value), {
        'headers': {
          'Content-Type': 'application/json'
        },
      }).subscribe(result => {
        var data = result as any;
        this.btnProcess = false;

        if (data?.status) {
          this.utilityService.success(data.msg, "Server Response");
        }
        else {
          if (data.msg == "Validation Error") {
            this.utilityService.fail("Validation Error", "Server Response", 5000);
          }
          else {
            this.utilityService.fail(data.msg, "Server Response")
          }
        }
      }, (error) => {
        this.btnProcess = false;
        this.utilityService.fail("Something went wrong", "Server Response");
      })
    }
  }

  listOfsalaryProcess: any[] = [];
  getSalaryProcessInfos() {
    this.areasHttpService.observable_get((ApiArea.payroll + ApiController.salary + "/GetSalaryProcessInfos"), {
      responseType: "json", params: {
        salaryProcessId: 0, companyId: this.User().ComId, organizationId: this.User().OrgId
      }
    }).subscribe((response) => {
      var res = response as any[];
      this.listOfsalaryProcess = res;
      this.logger("listOfsalaryProcess", this.listOfsalaryProcess);
    },
      (error) => { this.utilityService.httpErrorHandler(error) }
    )
  }

  listOfsalaryProcessDetail: any[] = [];
  getSalaryProcessDetails(id: any) {
    this.areasHttpService.observable_get((ApiArea.payroll + ApiController.salary + "/GetSalaryProcessDetails"), {
      responseType: "json", params: {
        salaryProcessId: id, companyId: this.User().ComId, organizationId: this.User().OrgId
      }
    }).subscribe((response) => {
      var res = response as any[];
      this.listOfsalaryProcessDetail = res;
      this.openSalaryProcessDetailsModal();
      this.logger("listOfsalaryProcessDetail", this.listOfsalaryProcessDetail);
    },
      (error) => { this.utilityService.httpErrorHandler(error) }
    )
  }

  openSalaryProcessDetailsModal() {
    this.modalService.open(this.salaryProcessDetailModal, "xl")
  }

  processIdForChecking: any = 0;
  processObjChecking: any = null;
  openSalaryProcessStatusModal(processId: any) {
    this.processIdForChecking = processId;
    this.processObjChecking = {};
    this.processObjChecking = Object.assign({}, this.listOfsalaryProcess.find(i => i.salaryProcessId == processId));
    this.logger("processObjChecking >>>", this.processObjChecking);
    this.modalService.open(this.salaryProcessCheckingModal, "lg");
  }

  submitSalaryProcessDisbursedOrUndo(actionName: any) {
    if (actionName != '') {
      if (confirm("Are you sure you want to " + actionName + "?")) {
        this.btnProcess = true;
        this.areasHttpService.observable_post((ApiArea.payroll + ApiController.salary + "/SalaryProcessDisbursedOrUndo"), null, {
          params: { salaryProcessId: this.processIdForChecking, actionName: actionName, companyId: this.User().ComId, organizationId: this.User().OrgId, userId: this.User().UserId }
        }).subscribe((result: any) => {
          this.btnProcess = false;
          this.logger("result >>>", result);
          if (result.status) {
            this.utilityService.success(result.msg, "Server Response");
            this.modalService.service.dismissAll();
            this.getSalaryProcessInfos();
          }
          else {
            this.utilityService.fail(result.msg, "Server Response")
          }
        }, (error) => {
          this.btnProcess = false;
          this.utilityService.fail("Something went wrong", "Server Response")
        })
      }
    }
    else {
      this.utilityService.fail("Invalid form value(s)", "Site Response", 3000);
    }
  }

}
