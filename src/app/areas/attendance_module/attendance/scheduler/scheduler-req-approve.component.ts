import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common'
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { CustomModalService } from 'src/app/shared/services/custom-modal.service';
import { HrWebService } from 'src/app/shared/services/hr-web.service';
import { PayrollWebService } from 'src/app/shared/services/payroll-web.service';
import { UserService } from 'src/app/shared/services/user.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AreasHttpService } from '../../../areas.http.service';
import { TypeaheadMatch } from 'ngx-bootstrap/typeahead';
import { ApiArea, ApiController } from 'src/app/shared/constants';
import { schedulerDetail } from 'src/models/hrm/work-shift-model';

@Component({
  selector: 'app-scheduler-approve',
  templateUrl: './scheduler-req-approve.component.html',
  styleUrls: ['./scheduler-req-approve.component.css']
})
export class SchedulerReqApproveComponent implements OnInit {

  @ViewChild("schedulerRequestModal", { static: true }) schedulerRequestModal!: ElementRef;
  @ViewChild("schedulerRequestPermissionModal", { static: true }) schedulerRequestPermissionModal!: ElementRef;
  @ViewChild("schedulerRequestViewModal", { static: true }) schedulerRequestViewModal!: ElementRef;
  modalTitle: string = "";
  schedulerRequestForm: FormGroup;

  datePickerConfig: Partial<BsDatepickerConfig> = {};
  schedulerRequestPageSize: number = 15;
  schedulerRequestPageNo: number = 1;

  schedulerRequestedPageSize: number = 15;
  schedulerRequestedPageNo: number = 1;

  schedulerRequestPageConfig: any = this.userService.pageConfigInit("schedulerRequest", this.schedulerRequestPageSize, 1, 0);
  schedulerRequestedPageConfig: any = this.userService.pageConfigInit("schedulerRequested", this.schedulerRequestedPageSize, 1, 0);

  minTime: Date = new Date();
  maxTime: Date = new Date();

  constructor(private datepipe: DatePipe, private fb: FormBuilder, private areasHttpService: AreasHttpService, private payrollWebService: PayrollWebService, private utilityService: UtilityService, private hrWebService: HrWebService, private userService: UserService, public modalService: CustomModalService, private el: ElementRef) { }

  ddlEmployees: any[] = [];
  typeHeadEmployees: any[] = [];

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
      minDate: new Date(),
      customTodayClass: 'custom-today-class'
    })
    this.loadEmployeesForSearchSchedulerRequest();
    this.getSchedulerRequests(this.schedulerRequestPageNo);
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

  //#region Schedule-Request

  //#region Create-Scheduler
  schedulerRequestFormInit() {
    this.schedulerRequestForm = this.fb.group({
      schedulerInfoId: [0],
      scheduleCode: [''],
      hostEmployeeId: [this.User().EmployeeId],
      departmentId: [0],
      subject: ['', [Validators.required]],
      details: ['', [Validators.required]],
      location: ['', [Validators.required]],
      scheduleDate: [null, [Validators.required]],
      fromTime: [null, [Validators.required]],
      toTime: [null, [Validators.required]],
      stateStatus: [''],
      lineManagerId: [0],
      supervisorId: [0],
      headOfDeparmentId: [0],
      hrAuthorityId: [0],
      branchId: [this.User().BranchId],
      createdBy: [this.User().UserId],
      updatedBy: [this.User().UserId],
      companyId: [this.User().ComId],
      organizationId: [this.User().OrgId],
      typeHeadEmployee: [],
      schedulerDetails: this.fb.array([])
    })

    this.minTime.setHours(1);
    this.minTime.setMinutes(0);
    this.maxTime.setHours(23);
    this.maxTime.setMinutes(59);
  }

  openSchedulerRequestModal() {
    this.schedulerRequestFormInit();
    this.btnSchedulerSubmit = false;
    this.modalTitle = 'Add New Schedule';
    this.typeHeadEmployees = [];
    this.loadEmployeesForSchedulerRequestModal();
    this.modalService.open(this.schedulerRequestModal, "lg");
  }

  loadEmployeesForSchedulerRequestModal() {
    this.typeHeadEmployees = [];
    this.hrWebService.getEmployees<any[]>(this.User().EmployeeId).then((data) => {
      this.typeHeadEmployees = data;
      this.logger("typeHeadEmployees >>", this.typeHeadEmployees);
    })
  }

  btnSchedulerSubmit: boolean = false;

  selectedEmployee: any;
  employeeOnSelect(e: TypeaheadMatch) {
    const schedulerDetail = this.schedulerRequestForm.controls.schedulerDetails as FormArray;

    var findEmployee =
      this.schedulerRequestForm.controls.schedulerDetails?.value.find((s: any) => s.employeeId == this.utilityService.IntTryParse(e.item.id));

    if (typeof findEmployee === 'object') {
      this.utilityService.fail("Duplicate Employee", 'Site Response');
    }
    else {
      schedulerDetail.push(this.fb.group({
        schedulerDetailId: 0,
        employeeId: this.utilityService.IntTryParse(e.item.id),
        employeeName: e.item.text,
        departmentId: 0,
        departmentName: '',
        participantStatus: null
      }));
    }
    this.schedulerRequestForm.get('typeHeadEmployee').setValue('');

    this.logger("this.schedulerRequestForm >>>", this.schedulerRequestForm.value);
  }

  deleteGuestEmployee(i: number, status: any) {
    if (status == null || status == undefined) {
      const schedulerDetail = this.schedulerRequestForm.controls.schedulerDetails as FormArray;
      schedulerDetail.removeAt(i);
    }
  }

  submitScheduler() {
    if (this.schedulerRequestForm.valid) {
      this.btnSchedulerSubmit = true;
      this.areasHttpService.observable_post((ApiArea.hrms + ApiController.attendance + "/SaveScheduler"), JSON.stringify(this.schedulerRequestForm.value), {
        'headers': {
          'Content-Type': 'application/json'
        },
      }).subscribe((result) => {
        this.logger("Submit result >>", result);
        var data = result as any;
        this.btnSchedulerSubmit = false;
        if (data.status) {
          this.schedulerRequestForm.reset;
          this.utilityService.success(data.msg, "Server Response")
          this.modalService.service.dismissAll()
        }
        else {
          this.utilityService.fail(data.msg, "Server Response")
        }
      }, (error) => {
        this.utilityService.fail("Something went wrong", "Server Response")
      })
    }
  }

  //#endregion Create-Scheduler

  //#region list of Scheduler

  loadEmployeesForSearchSchedulerRequest() {
    this.ddlEmployees = [];
    this.hrWebService.getEmployees<any[]>().then((data) => {
      this.ddlEmployees = data;
      this.logger("this.ddlEmployees >>", this.ddlEmployees);
    }).catch(error => {
      this.reject(error);
    })
  }

  reject(error: any) {
    console.log('Promise Error');
  }

  searchByMeetingCode: string = "";
  searchByEmployeeText: string = "";
  searchByEmployeeId: number = 0;
  searchByLocation: string = "";
  searchByDate: any[] = [];
  searchByStatus: string = "";

  searchByEmployeeChanged(event: TypeaheadMatch) {
    this.searchByEmployeeText = event.item.text;
    this.searchByEmployeeId = this.utilityService.IntTryParse(event.item.id);
    this.getSchedulerRequests(1);
  }

  schedulerRequestPageChanged(event: any) {
    this.schedulerRequestPageNo = event;
    this.getSchedulerRequests(this.schedulerRequestPageNo);
  }

  listOfSchedulerRequests: any[] = [];
  schedulerRequestsDTLabel: string = null;
  getSchedulerRequests(pageNo: number) {
    let fromDate;
    let toDate;
    if (this.searchByDate?.length > 0) {
      this.logger("this.searchByDate>>>", this.datepipe.transform(this.searchByDate[0], 'yyyy-MM-dd'));
      fromDate = this.datepipe.transform(this.searchByDate[0], 'yyyy-MM-dd');
      toDate = this.datepipe.transform(this.searchByDate[1], 'yyyy-MM-dd');
    }
    this.listOfSchedulerRequests = [];
    let params = { scheduleCode: this.searchByMeetingCode, hostEmployeeId: this.searchByEmployeeId, location: this.searchByLocation, fromDate: fromDate ?? '', toDate: toDate ?? '', status: this.searchByStatus, pageSize: this.schedulerRequestPageSize, pageNumber: pageNo };

    this.areasHttpService.observable_get<any[]>((ApiArea.hrms + ApiController.attendance + "/GetSchedulerInfosInApproval"), {
      responseType: "json", observe: 'response', params: params
    }).subscribe((response) => {
      var res = response as any;
      this.listOfSchedulerRequests = res.body;
      this.schedulerRequestPageConfig = JSON.parse(res.headers.get('X-Pagination'));
      this.schedulerRequestsDTLabel = this.listOfSchedulerRequests.length == 0 ? 'No record(s) found' : null;
      this.logger("this.listOfSchedulerRequests >>>", this.listOfSchedulerRequests);
    },
      (error) => { console.log(error) }
    )
  }

  loadSchedulerInfoWithDetailsForEdit(schedulerInfoId: number) {
    this.getSchedulerInfoWithDetails(schedulerInfoId).subscribe((response) => {
      var res = response as any;
      this.populateDataForSchedulerRequestInEditMode(res.body as any)
    }, (error) => {
      this.logger("Error In loadSchedulerInfoWithDetails For Edit >>>", error)
    })
  }

  getSchedulerInfoWithDetails(schedulerInfoId: number) {
    return this.areasHttpService.observable_get<any[]>((ApiArea.hrms + ApiController.attendance + "/GetSchedulerInfoWithDetails"), {
      responseType: "json", observe: 'response', params: { hostEmployeeId: this.User().EmployeeId, schedulerInfoId: schedulerInfoId}
    })
  }


  populateDataForSchedulerRequestInEditMode(masterFormData: any) {
    this.schedulerRequestFormInit();
    masterFormData.scheduleDate = this.utilityService.getDateWithSetTime(masterFormData.scheduleDate.toString()),
      masterFormData.fromTime = this.utilityService.getDateWithSetTime(masterFormData.fromTime.toString()),
      masterFormData.toTime = this.utilityService.getDateWithSetTime(masterFormData.toTime.toString()),

      this.btnSchedulerSubmit = false;
    this.modalTitle = 'Update Schedule';
    this.typeHeadEmployees = [];
    this.loadEmployeesForSchedulerRequestModal();
    this.modalService.open(this.schedulerRequestModal, "lg");

    this.schedulerRequestForm.patchValue(masterFormData);

    const schedulerDetails = this.schedulerRequestForm.controls.schedulerDetails as FormArray;
    if (masterFormData.schedulerDetails.length > 0) {
      masterFormData.schedulerDetails.forEach((item: any) => {
        schedulerDetails.push(this.fb.group({
          schedulerDetailId: item.schedulerDetailId,
          employeeId: item.employeeId,
          employeeName: item.employeeName,
          departmentId: item.departmentId,
          departmentName: item.departmentName,
          participantStatus: item.participantStatus
        }))
      });
    }

  }

  //#endregion list of Scheduler


  //#region Scheduler-Details
  openSchedulerDetailModal(schedulerInfoId: number) {
    this.schedulerPermissionData = {};
    this.getSchedulerInfoWithDetails(schedulerInfoId).subscribe((response) => {
      var res = response as any;
      this.schedulerPermissionData = res.body as any;
      if (Object.keys(this.schedulerPermissionData).length > 0) {
        this.modalService.open(this.schedulerRequestViewModal, "lg");
      }
    }, (error) => {
      this.logger("Error In loadSchedulerInfoWithDetails For View >>>", error);
    })
  }
  //#endregion Scheduler-Details

  //#region Scheduler-Permission

  schedulerPermissionData: any = {};
  openSchedulerPermissionModal(schedulerInfoId: number) {
    this.schedulerPermissionData = {};
    this.getSchedulerInfoWithDetails(schedulerInfoId).subscribe((response) => {
      var res = response as any;
      this.schedulerPermissionData = res.body as any;
      if (Object.keys(this.schedulerPermissionData).length > 0) {
        this.modalService.open(this.schedulerRequestPermissionModal, "lg");
      }
    }, (error) => {
      this.logger("Error In loadSchedulerInfoWithDetails For Edit >>>", error);
    })
  }
  btnSchedulerStatusSubmit: boolean = false
  submitSchedulerStatus(form: NgForm, remarks: any, checkStatus: any) {
    this.logger("form>>>", form);
    // this.logger("remarks>>>",remarks);
    // this.logger("checkStatus>>>",checkStatus);
    //return;
    if (form.valid && checkStatus.value != '' && remarks.value != '') {
      this.btnSchedulerStatusSubmit = true;
      this.areasHttpService.observable_post((ApiArea.hrms + ApiController.attendance + "/SaveSchedulerStatus"), null, {
        'headers': {
          'Content-Type': 'application/json'
        },
        params: { schedulerInfoId: this.schedulerPermissionData.schedulerInfoId, status: checkStatus, remarks: remarks}
      }).subscribe((result) => {
        this.logger("Submit result >>", result);
        var data = result as any;
        this.btnSchedulerStatusSubmit = false;
        if (data.status) {
          this.utilityService.success(data.msg, "Server Response")
          this.modalService.service.dismissAll();
          this.getSchedulerRequests(this.schedulerRequestPageNo);
        }
        else {
          this.utilityService.fail(data.msg, "Server Response")
        }
      }, (error) => {
        this.utilityService.fail("Something went wrong", "Server Response")
      })
    }
    else {
      this.utilityService.fail("One or More field value is invalid", "Site Response");
    }
  }

  //#endregion Scheduler-Permission

  //#endregion Schedule-Request

}

