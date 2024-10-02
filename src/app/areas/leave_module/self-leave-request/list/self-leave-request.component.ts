import { slideInUp } from 'ng-animate';
import { DatePipe } from '@angular/common';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { AreasHttpService } from '../../../areas.http.service';
import { ApiArea, ApiController } from 'src/app/shared/constants';
import { UserService } from 'src/app/shared/services/user.service';
import { LeaveTypeSerive } from '../../leave-type/leave-type.service';
import { HrWebService } from 'src/app/shared/services/hr-web.service';
import { transition, trigger, useAnimation } from '@angular/animations';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { LeaveSettingSerive } from '../../leave-setting/leave-setting.service';
import { LeaveBalanceService } from '../../leave-balance/leave-balance.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CustomModalService } from 'src/app/shared/services/custom-modal.service';
import { EmployeeLeaveRequestService } from '../../employee-leave-request/employee-leave-request.service';

@Component({
  selector: 'app-hr-self-leave-request',
  templateUrl: './self-leave-request.component.html',
  animations: [
    trigger('slideInUp', [transition('* => *', useAnimation(slideInUp, { params: { timing: 0.5 } }))])
  ]
})
export class SelfLeaveRequestComponent implements OnInit {

  @ViewChild("employeeLeaveRequestModal", { static: false }) employeeLeaveRequestModal !: ElementRef;
  @ViewChild("employeeLeaveRequestDeleteModal", { static: false }) employeeLeaveRequestDeleteModal !: ElementRef;
  modalTitle: string = "Employee Leave Request";

  employeeLeaveTypeForm: FormGroup;
  datePickerConfig: Partial<BsDatepickerConfig> = {};

  employeeLeaveTypePageNo: number = 1;
  employeeLeaveTypePageSize: number = 15;
  employeeLeaveTypePageConfig: any = this.userService.pageConfigInit("employeeLeaveType", this.employeeLeaveTypePageSize, 1, 0);
  leaveTypeId: any = 0;
  httpClient: any;
  constructor(private datepipe: DatePipe, private fb: FormBuilder, private areasHttpService: AreasHttpService, private utilityService: UtilityService, private hrWebService: HrWebService, private userService: UserService, public modalService: CustomModalService, private el: ElementRef, private leaveSettingSerive: LeaveSettingSerive, private leaveBalanceService: LeaveBalanceService, private leaveTypeSerive: LeaveTypeSerive, private employeeLeaveRequestService: EmployeeLeaveRequestService) { }

  ngOnInit(): void {
    this.getEmployeeLeaveRequests();
    this.loadEmployeeLeaveTypes();
  }

  logger(msg: any, options: any) {
    this.utilityService.consoleLog(msg, options);
  }

  User() {
    return this.userService.User();
  }

  select2Options = this.utilityService.select2Config();

  totalLeave = 0;

  employeeLeaveTypeFormInit() {
    this.employeeLeaveTypeForm = this.fb.group({
      employeeLeaveRequestId: new FormControl(0),
      employeeId: new FormControl(this.User().EmployeeId, [Validators.required]),
      leaveTypeId: new FormControl(0, [Validators.min(1)]),
      appliedTotalDays: new FormControl(0, [Validators.min(.5)]),
      dayLeaveType: new FormControl('Full-Day', [Validators.required]),
      halfDayType: new FormControl(''),
      appliedFromDate: new FormControl(),
      leavePurpose: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(200)]),
      emergencyPhoneNo: new FormControl('', [Validators.minLength(11), Validators.maxLength(100)]),
      addressDuringLeave: new FormControl('', [Validators.minLength(2), Validators.maxLength(150)]),
      remarks: new FormControl(''),

    })

    this.employeeLeaveTypeForm.valueChanges.subscribe((data) => {
      this.logFormErrors();
    })

    this.employeeLeaveTypeForm.get('leaveTypeId').valueChanges.subscribe((value) => {
      this.employeeLeaveTypeForm.get('appliedFromDate').setValue(null);
      console.log("leaveTypeId >>>", value)
      this.getLeaveSetting(this.employeeLeaveTypeForm.get('leaveTypeId').value);

    })

    this.employeeLeaveTypeForm.get('dayLeaveType').valueChanges.subscribe((value) => {
      this.employeeLeaveTypeForm.get('appliedFromDate').setValue(null);
      this.employeeLeaveTypeForm.get('halfDayType').setValue('');
      this.totalLeave = 0;
      if (value == "Full-Day") {
        this.employeeLeaveTypeForm.get('halfDayType').clearValidators();
      }
      else {
        this.totalLeave = 0.50;
        this.employeeLeaveTypeForm.get('halfDayType').clearValidators();
        this.employeeLeaveTypeForm.get('halfDayType').setValidators([Validators.required]);
        this.employeeLeaveTypeForm.get('halfDayType').updateValueAndValidity();
      }
    })

    this.employeeLeaveTypeForm.get('appliedFromDate').valueChanges.subscribe((value) => {
      this.totalLeave = 0;
      if (value != 'null' && value != null && value != '') {
        setTimeout(() => {
          this.leaveDaysCalculation();
        }, 50);
      }
      this.logFormErrors();


    })


  }

  listOfeligibleLeaveDay: any[] = [];
  leaveDaysCalculation() {
    this.totalLeave = 0;
    this.listOfeligibleLeaveDay = []
    if (this.employeeLeaveTypeForm != null && this.employeeLeaveTypeForm.get('appliedFromDate').value != null
      && this.employeeLeaveTypeForm.get('appliedFromDate').value != 'null') {

      let fromDate = '';
      let toDate = '';
      if (this.employeeLeaveTypeForm.get("dayLeaveType").value == "Half-Day") {
        fromDate = this.datepipe.transform(this.employeeLeaveTypeForm.get('appliedFromDate').value, 'yyyy-MM-dd');
        toDate = this.datepipe.transform(this.employeeLeaveTypeForm.get('appliedFromDate').value, 'yyyy-MM-dd');
      }
      else {
        fromDate = this.datepipe.transform(this.employeeLeaveTypeForm.get('appliedFromDate').value[0], 'yyyy-MM-dd');
        toDate = this.datepipe.transform(this.employeeLeaveTypeForm.get('appliedFromDate').value[1], 'yyyy-MM-dd');
      }
      let leaveTypeId = this.employeeLeaveTypeForm.get('leaveTypeId').value;

      if (fromDate.indexOf('1970') < 0) {
        var params = { employeeLeaveRequestId: this.employeeLeaveTypeForm.get('employeeLeaveRequestId').value, employeeId: this.User().EmployeeId, leaveTypeId: leaveTypeId, appliedFromDate: fromDate ?? "", appliedToDate: toDate ?? "" };

        this.leaveSettingSerive.getTotalRequestDays(params).subscribe(response => {
          if (response != null) {
            this.totalLeave = this.utilityService.IntTryParse(response.leaveCount);
            this.employeeLeaveTypeForm.get('appliedTotalDays').setValue(this.totalLeave);
            this.listOfeligibleLeaveDay = JSON.parse(response.list)
          }
        }, (error) => {
          console.log("error >>>", error);
          this.utilityService.fail("Something went wrong", "Server Response");
        })

      }
    }
  }

  touchedSelect2() {
    this.employeeLeaveTypeForm.get('employeeId').markAsTouched();
    this.logFormErrors();
  }

  validationMessages = {
    'employeeId': {
      'required': 'Employee Id is required',
    },
    'leaveTypeId': {
      'min': 'Leave type is required'
    },
    'dayLeaveType': {
      'required': 'Field is required'
    },
    'halfDayType': {
      'required': 'Field is required'
    },
    'appliedFromDate': {
      'required': 'Field is required'
    },
    'leavePurpose': {
      'required': 'Field is required',
      'minlength': 'Minlength is 4',
      'maxlength': 'Maxlength is 200'
    },
    'emergencyPhoneNo': {
      'minlength': 'Minlength is 11',
      'maxlength': 'Maxlength is 100'
    },
    'addressDuringLeave': {
      'minlength': 'Minlength is 2',
      'maxlength': 'Maxlength is 150'
    }
  }

  formErrors = {
    'employeeId': '',
    'leaveTypeId': '',
    'dayLeaveType': '',
    'halfDayType': '',
    'appliedFromDate': '',
    'leavePurpose': '',
    'emergencyPhoneNo': '',
    'addressDuringLeave': ''
  }

  btnEmployeeLeaveRequest: boolean = false;
  ddlEmployeeLeaveBalance: any[] = [];

  loadEmployeeLeaveBalance() {
    this.ddlEmployeeLeaveBalance = [];
    this.leaveBalanceService.loadEmployeeLeaveBalanceDropdown({ employeeId: this.User().EmployeeId });
    this.leaveBalanceService.ddl$.subscribe(data => {
      this.ddlEmployeeLeaveBalance = data;
    })
  }

  openEmployeeLeaveRequestModal() {
    Object.keys(this.formErrors).forEach((key: string) => { this.formErrors[key] = ''; })
    this.employeeLeaveTypeFormInit();
    this.listOfeligibleLeaveDay = [];
    this.loadEmployeeLeaveBalance();
    this.btnEmployeeLeaveRequest = false;
    this.totalLeave = 0;
    this.modalTitle = "Add New Leave Request";
    this.modalService.open(this.employeeLeaveRequestModal, "lg");
    this.getLeavePeriod();
  }

  logFormErrors(formGroup: FormGroup = this.employeeLeaveTypeForm) {
    Object.keys(formGroup.controls).forEach((key: string) => {
      const abstractControl = formGroup.get(key);
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

  showRequestModal: boolean = false;
  requestItem: any = null;
  openModal(item: any) {
    this.showRequestModal = true;
    this.requestItem = item;
  }

  closeModal(reason: any) {
    this.showRequestModal = false;
    this.requestItem = null;
    this.getEmployeeLeaveRequests()
  }

  clearDate(formControlName: string) {
    this.employeeLeaveTypeForm.get(formControlName).setValue(null);
  }

  submitEmployeeLeaveRequest() {
    if (this.employeeLeaveTypeForm.valid) {

      let appliedFrmDate = '';
      let appliedTDate = '';

      if (this.employeeLeaveTypeForm.get('dayLeaveType').value == 'Half-Day') {
        appliedFrmDate = this.datepipe.transform(this.employeeLeaveTypeForm.get('appliedFromDate').value, 'yyyy-MM-dd');
        appliedTDate = this.datepipe.transform(this.employeeLeaveTypeForm.get('appliedFromDate').value, 'yyyy-MM-dd');
      }
      else {
        appliedFrmDate = this.datepipe.transform(this.employeeLeaveTypeForm.get('appliedFromDate').value[0], 'yyyy-MM-dd');
        appliedTDate = this.datepipe.transform(this.employeeLeaveTypeForm.get('appliedFromDate').value[1], 'yyyy-MM-dd');
      }

      let appliedTotDays = this.totalLeave;


      let formData = Object.assign({}, this.employeeLeaveTypeForm.value);
      formData.appliedFromDate = appliedFrmDate;
      formData.appliedToDate = appliedTDate;
      formData.appliedTotalDays = appliedTotDays;

      console.log("employeeLeaveTypeForm >>>", this.employeeLeaveTypeForm.value)
      this.btnEmployeeLeaveRequest = true;
      this.areasHttpService.observable_post((ApiArea.hrms + ApiController.leave + "/SaveEmployeeLeaveRequest"),
        JSON.stringify(formData),
        {
          'headers': {
            'Content-Type': 'application/json'
          }
        }).subscribe((result) => {
          let data = result as any;
          this.logger("data >>>", data)
          this.btnEmployeeLeaveRequest = false;
          if (data.status) {

            this.sendEmail();

            this.utilityService.success("Saved Successfull", "Server Response")
            this.modalService.service.dismissAll("Save Complete");
            this.employeeLeaveTypePageNo = 1;
            this.getEmployeeLeaveRequests();
          }
          else {
            if (data.msg == "Validation Error") {
              data.msg = '';
              Object.keys(data.errors).forEach((key) => {
                data.msg += data.errors[key] + '</br>';
              })
              this.utilityService.fail(data.msg, "Server Response", 5000)
            }
            else {
              this.utilityService.fail(data.msg, "Server Response")
            }
          }
        },
          (error) => {
            this.utilityService.fail("One or More field value is invalid", "Site Response");
          })
    }
    else {
      this.utilityService.fail("Invalid Form Values", "Site Response")
    }
  }

  submitEmployeeLeaveRequest2() {
    if (this.employeeLeaveTypeForm.valid) {

      let appliedFrmDate = "";
      let appliedTDate = "";
      let appliedTotDays = this.totalLeave;

      if (this.employeeLeaveTypeForm.get('dayLeaveType').value == 'Half-Day') {
        appliedFrmDate = this.datepipe.transform(this.employeeLeaveTypeForm.get('appliedFromDate').value, 'yyyy-MM-dd');
        appliedTDate = this.datepipe.transform(this.employeeLeaveTypeForm.get('appliedFromDate').value, 'yyyy-MM-dd');
      }
      else {
        appliedFrmDate = this.datepipe.transform(this.employeeLeaveTypeForm.get('appliedFromDate').value[0], 'yyyy-MM-dd');
        appliedTDate = this.datepipe.transform(this.employeeLeaveTypeForm.get('appliedFromDate').value[1], 'yyyy-MM-dd');
      }

      let formData = Object.assign({}, this.employeeLeaveTypeForm.value);
      formData.appliedFromDate = appliedFrmDate;
      formData.appliedToDate = appliedTDate;
      formData.appliedTotalDays = appliedTotDays;

      let requestData = { leaveRequest: formData, leaveDays: this.listOfeligibleLeaveDay }

      this.btnEmployeeLeaveRequest = true;

      this.employeeLeaveRequestService.save2(requestData).subscribe(response => {
        this.btnEmployeeLeaveRequest = false;
        if (response.status) {
          response.leaveTypeId = this.utilityService.IntTryParse(this.employeeLeaveTypeForm.get('leaveTypeId').value);
          this.sendEmail2(response);

          this.utilityService.success("Saved Successfull", "Server Response")
          this.modalService.service.dismissAll("Save Complete");

          this.employeeLeaveTypePageNo = 1
          this.getEmployeeLeaveRequests();
        }
        else {
          if (response.msg == "Validation Error") {
            response.msg = '';
            Object.keys(response.errors).forEach((key) => {
              response.msg += response.errors[key] + '</br>';
            })
            this.utilityService.fail(response.msg, "Server Response", 5000)
          }
          else {
            this.utilityService.fail(response.msg, "Server Response")
          }
        }
      }, (error) => {
        console.log("error >>>", error);
        this.utilityService.fail("One or More field value is invalid", "Site Response");
      })
    }
    else {
      this.utilityService.fail("Invalid Form Values", "Site Response")
    }
  }

  searchByEmployee: any = '';
  searchByLeaveType: number = 0;
  searchByDayLeaveType: string = "";
  searchByStatus: string = "";
  searchByAppliedDate: any[] = [];
  employeeLeaveRequestsDTLabel: string = null;
  listEmployeeLeaveRequests: any[] = [];
  ddlEmployeeLeaveTypes: any = [];

  loadEmployeeLeaveTypes() {
    this.ddlEmployeeLeaveTypes = [];
    this.leaveTypeSerive.loadLeaveTypeDropdown();
    this.ddlEmployeeLeaveTypes = this.leaveTypeSerive.ddl$;
  }

  employeeLeaveRequestPageChanged(event: any) {
    this.employeeLeaveTypePageNo = event;
    this.getEmployeeLeaveRequests();
  }


  
  getEmployeeLeaveRequests() {
    let fromDate;
    let toDate;

    if (this.searchByAppliedDate?.length > 0) {
      this.logger("this.searchByDate>>>", this.datepipe.transform(this.searchByAppliedDate[0], 'yyyy-MM-dd'));
      fromDate = this.datepipe.transform(this.searchByAppliedDate[0], 'yyyy-MM-dd');
      toDate = this.datepipe.transform(this.searchByAppliedDate[1], 'yyyy-MM-dd');
    }

    this.logger("this.searchByEmployee>>>", this.searchByEmployee)
    this.listEmployeeLeaveRequests = [];

    var params = { employeeId: this.User().EmployeeId, leaveTypeId: this.searchByLeaveType, dayLeaveType: this.searchByDayLeaveType ?? "", appliedFromDate: fromDate ?? "", appliedToDate: toDate ?? "", stateStatus: this.searchByStatus ?? "", pageNumber: this.employeeLeaveTypePageNo, pageSize: this.employeeLeaveTypePageSize };

    this.employeeLeaveRequestService.get(params).subscribe(response => {
      this.listEmployeeLeaveRequests = response.body;
      this.employeeLeaveRequestsDTLabel = this.listEmployeeLeaveRequests.length == 0 ? 'No record(s) found' : null;
      var xPaginate = JSON.parse(response.headers.get('X-Pagination'));
      this.employeeLeaveTypePageConfig = this.userService.pageConfigInit("employeeLeaveType", xPaginate.itemsPerPage, xPaginate.currentPage, xPaginate.totalItems);
    }, (error) => {
      console.log("error >>>", error);
      this.utilityService.fail("Something went wrong", "Server Response");
    })
  }




  editEmployeeLeaveRequest(item: any) {
    this.employeeLeaveRequestService.getById({ employeeLeaveRequestId: item.employeeLeaveRequestId, employeeId: item.employeeId }).subscribe(response => {
      this.openEmployeeLeaveRequestModal();
      this.employeeLeaveTypeForm.patchValue(response.body);
      const data = {
        appliedFromDate: new Date(response.body?.appliedFromDate),
        appliedToDate: new Date(response.body?.appliedToDate)
      };
      if (this.employeeLeaveTypeForm.get('dayLeaveType').value == 'Half-Day') {
        this.employeeLeaveTypeForm.get('appliedFromDate').setValue(new Date(data.appliedFromDate))
      }
      else {
        this.employeeLeaveTypeForm.get('appliedFromDate').setValue([new Date(data.appliedFromDate), new Date(data.appliedToDate)])
      }
    }, (error) => {
      console.log("error >>>", error);
      this.utilityService.fail("Something went wrong", "Server Response");
    })
  }

  employeeDeleteItem: any;
  openEmployeeLeaveRequestDeleteModal(item: any) {
    this.employeeDeleteItem = null;
    this.employeeDeleteItem = item;
    this.modalService.open(this.employeeLeaveRequestDeleteModal, "sm");
  }

  confirmDelete() {
    if (Object.keys(this.employeeDeleteItem).length > 0) {
      let params = {
        employeeLeaveRequestId: this.employeeDeleteItem.employeeLeaveRequestId,
        employeeId: this.User().EmployeeId,
        leaveTypeId: this.employeeDeleteItem.leaveTypeId
      };
      this.employeeLeaveRequestService.delete(params).subscribe(response => {
        var result = response as any;
        if (result?.status) {
          response.leaveTypeId = params.leaveTypeId;
          this.sendEmail2(response)
          this.employeeDeleteItem = null;
          this.employeeLeaveTypePageNo = 1
          this.getEmployeeLeaveRequests();
          this.modalService.service.dismissAll();
          this.utilityService.success(result.msg, "Server Response")
        }
        else {
          this.utilityService.fail(result.msg, "Server Response")
        }
      }, (error) => {
        console.log("error >>>", error);
        this.utilityService.fail("Something went wrong", "Server Response");
      })
    }
  }

  getLeavePeriod() {
    this.leaveSettingSerive.getLeavePeriod({ employeeId: this.User().EmployeeId }).subscribe(response => {
      this.getLeavePeriodValue(response);
    }, (error) => {
      console.log("error >>>", error);
    })
  }

  getLeavePeriodValue(response_data: any) {
    let fromDate = this.datepipe.transform(response_data.leavePeriodStart, 'yyyy-MM-dd');
    let toDate = this.datepipe.transform(response_data.leavePeriodEnd, 'yyyy-MM-dd');
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
      customTodayClass: 'custom-today-class',
      minDate: new Date(fromDate),
      maxDate: new Date(toDate)
    })
  }

  getLeaveSetting(leaveTypeId: number) {
    if (leaveTypeId > 0) {
      this.leaveSettingSerive.getLeaveTypeSetting({ leaveTypeId: leaveTypeId, employeeId: this.User().EmployeeId }).subscribe(response => {
        if (response != null) {
          console.log(" leaveSettingSerive response >>>>", response);
          let leaveTypeName = response?.leaveTypeName;
          let requestDaysBeforeTakingLeave = response?.requestDaysBeforeTakingLeave;
          var valueItemFrom = this.utilityService.IntTryParse(requestDaysBeforeTakingLeave);

          if (leaveTypeName != null && leaveTypeName.indexOf('Sick') > -1) {
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
              minDate: this.utilityService.getDateBeforeToday(40),
              maxDate: this.utilityService.getDateBeforeToday(1),
              customTodayClass: 'custom-today-class'
            })
          }
          else {
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
              minDate: this.utilityService.getDateAfterToday(valueItemFrom),
              maxDate: new Date(response.leavePeriodEnd),
              customTodayClass: 'custom-today-class'
            })
          }
        }
      }, (error) => {
        console.log("error >>>", error);
        this.utilityService.fail("Something went wrong", "Server Response");
      })
    }
  }

  sendEmail() {
    var employeeId = this.utilityService.IntTryParse(this.employeeLeaveTypeForm.get('employeeId').value);
    var leaveTypeId = this.utilityService.IntTryParse(this.employeeLeaveTypeForm.get('leaveTypeId').value);
    this.employeeLeaveRequestService.sendEmail({ employeeId: this.User().EmployeeId, leaveTypeId: leaveTypeId, emailType: "Request" }).subscribe(response => {
      console.log("response >>>", response);
    }, (error) => {
      console.log("error >>>", error);
      this.utilityService.fail("Something went wrong", "Server Response");
    })
  }

  sendEmail2(params: any) {
    let leaveRequestId = params.itemId;
    let emailType = params.action == "Insert" ? "Request" : (params.action == "Update" ? "Modified" : "Cancelled");
    var leaveTypeId = this.utilityService.IntTryParse(params.leaveTypeId);
    this.employeeLeaveRequestService.sendEmail({ employeeId: this.User().EmployeeId, leaveTypeId: leaveTypeId, emailType: emailType, leaveRequestId: leaveRequestId }).subscribe(response => {
      console.log("response >>>", response);
    }, (error) => {
      console.log("error >>>", error);
      this.utilityService.fail("Something went wrong", "Server Response");
    })
  }

  activityLogItem: any;
  showActivityModal: boolean = false;
  openActivityModal(item) {
    this.showActivityModal = true;
    this.activityLogItem = item;
  }

  closeActivityModal(reason: any) {
    this.showActivityModal = false;
  }

  showDeleteModal: boolean = false;
  openDeleteModal(item: any) {
    this.showDeleteModal = true;
    this.employeeDeleteItem = item;
  }

  closeDeleteModal(reason: any) {
    this.showDeleteModal = false;
    if(reason == 'delete successful'){
      this.getEmployeeLeaveRequests();
    }
  }

  showCancelApprovedLeaveModal: boolean = false;
  cancelApprovedLeaveItem: any;
  openCancelApprovedLeaveModal(item: any){
    this.showCancelApprovedLeaveModal = true;
    this.cancelApprovedLeaveItem = item;
  }

  closeCancelApprovedLeaveModal(reason: any){
    this.showCancelApprovedLeaveModal = false;
    if(reason =='delete successful'){
      this.getEmployeeLeaveRequests();
    }
  }

}
