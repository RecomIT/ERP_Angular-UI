import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common'
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { CustomModalService } from 'src/app/shared/services/custom-modal.service';
import { HrWebService } from 'src/app/shared/services/hr-web.service';
import { PayrollWebService } from 'src/app/shared/services/payroll-web.service';
import { UserService } from 'src/app/shared/services/user.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AreasHttpService } from '../../../areas.http.service';
import { TypeaheadMatch } from 'ngx-bootstrap/typeahead';
import { ApiArea, ApiController } from 'src/app/shared/constants';
import { transition, trigger, useAnimation } from '@angular/animations';
import { bounceIn, fadeIn, fadeInRight, slideInUp } from 'ng-animate';
import { EmployeeInfoService } from 'src/app/areas/employee_module/employee/employee-info.service';

@Component({
  selector: 'app-scheduler',
  templateUrl: './scheduler-req.component.html',
  styleUrls: ['./scheduler-req.component.css'],
  animations: [
    trigger('slideInUp', [transition('* => *', useAnimation(slideInUp, { params: { timing: 0.5 } }))]),
    trigger('fadeIn', [transition('void => *', useAnimation(fadeIn, { params: { timing: 0.3 } }))]),
    trigger('fadeInRight', [transition('void => *', useAnimation(fadeInRight, { params: { timing: 0.5 } }))]),
    trigger('bounceIn', [transition('void => *', useAnimation(bounceIn, { params: { timing: 1 } }))]),
  ]
})
export class SchedulerReqComponent implements OnInit {

  @ViewChild("schedulerRequestModal", { static: true }) schedulerRequestModal!: ElementRef;
  @ViewChild("schedulerRequestPermissionModal", { static: true }) schedulerRequestPermissionModal!: ElementRef;
  @ViewChild("schedulerRequestViewModal", { static: true }) schedulerRequestViewModal!: ElementRef;
  @ViewChild("schedulerRequestDeleteModal", { static: true }) schedulerRequestDeleteModal!: ElementRef;
  @ViewChild("schedulerRequested", { static: true }) schedulerRequestedModal!: ElementRef;
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

  constructor(
    private datepipe: DatePipe,
    private fb: FormBuilder,
    private areasHttpService: AreasHttpService,
    private payrollWebService: PayrollWebService, 
    private utilityService: UtilityService, 
    private hrWebService: HrWebService, 
    private userService: UserService, 
    public modalService: CustomModalService, 
    private el: ElementRef,
    private employeeInfoService : EmployeeInfoService
  ) { }

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
    this.getSchedulerRequested(this.schedulerRequestedPageNo);
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
    // this.schedulerRequestForm.reset;
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

    this.schedulerRequestForm.reset;

    this.minTime.setHours(1);
    this.minTime.setMinutes(0);
    this.maxTime.setHours(23);
    this.maxTime.setMinutes(59);
  }

  openSchedulerRequestModal() {
    this.schedulerRequestFormInit();
    this.btnSchedulerSubmit = false;
    this.modalTitle = 'Create New Meeting Schedule';
    this.typeHeadEmployees = [];
    this.loadEmployeesForSchedulerRequestModal();
    this.modalService.open(this.schedulerRequestModal, "lg");
  }

  loadEmployeesForSchedulerRequestModal() {
    this.typeHeadEmployees = [];
    this.employeeInfoService.loadDropdownData({});
    this.employeeInfoService.ddl_employee_data$.subscribe(data => {
    this.employeeInfoService.loadDropdown(data);
    this.typeHeadEmployees = this.employeeInfoService.ddl$;
    }, error => {
    console.error('Error while fetching data:', error);
    });
}

  // loadEmployeesForSchedulerRequestModal() {
  //   this.typeHeadEmployees = [];
  //   this.hrWebService.getEmployees<any[]>(this.User().EmployeeId).then((data) => {
  //     this.typeHeadEmployees = data;
  //     this.logger("typeHeadEmployees >>", this.typeHeadEmployees);
  //   })
  // }

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
      //this.logger("Json Data >>>", JSON.stringify(this.schedulerRequestForm.value));
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
          this.modalService.service.dismissAll();
          this.getSchedulerRequests(this.schedulerRequestPageNo)
        }
        else {
          this.utilityService.fail(data.msg, "Server Response")
        }
      }, (error) => {
        this.utilityService.fail("Something went wrong", "Server Response")
        this.btnSchedulerSubmit = false;
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
    this.schedulerRequestPageNo = pageNo;
    if (this.searchByDate?.length > 0) {
      this.logger("this.searchByDate>>>", this.datepipe.transform(this.searchByDate[0], 'yyyy-MM-dd'));
      fromDate = this.datepipe.transform(this.searchByDate[0], 'yyyy-MM-dd');
      toDate = this.datepipe.transform(this.searchByDate[1], 'yyyy-MM-dd');
    }
    this.listOfSchedulerRequests = [];
    let params = { scheduleCode: this.searchByMeetingCode, hostEmployeeId: this.User().EmployeeId, location: this.searchByLocation, fromDate: fromDate ?? '', toDate: toDate ?? '', status: this.searchByStatus, pageSize: this.schedulerRequestPageSize, pageNumber: pageNo };

    this.areasHttpService.observable_get<any[]>((ApiArea.hrms + ApiController.attendance + "/GetSchedulerInfos"), {
      responseType: "json", observe: 'response', params: params
    }).subscribe((response) => {
      var res = response as any;
      this.listOfSchedulerRequests = res.body;
      this.schedulerRequestsDTLabel = this.listOfSchedulerRequests.length == 0 ? 'No record(s) found' : null;
      var xPaginate = JSON.parse(res.headers.get('X-Pagination'));
      this.schedulerRequestPageConfig = this.userService.pageConfigInit("schedulerRequest", xPaginate.itemsPerPage, xPaginate.currentPage, xPaginate.totalItems);
      this.logger("this.listOfSchedulerRequests >>>", this.listOfSchedulerRequests);
    },
      (error) => { console.log(error) }
    )
  }

  loadSchedulerInfoWithDetailsForEdit(schedulerInfoId: number) {
    this.logger("schedulerInfoId>>>", schedulerInfoId);
    //return;
    this.getSchedulerInfoWithDetails(schedulerInfoId).subscribe((response) => {
      var res = response as any;
      this.populateDataForSchedulerRequestInEditMode(res.body as any)
    }, (error) => {
      this.logger("Error In loadSchedulerInfoWithDetails For Edit >>>", error)
    })
  }

  getSchedulerInfoWithDetails(schedulerInfoId: number, hostEmployeeId: number = this.User().EmployeeId) {
    return this.areasHttpService.observable_get<any[]>((ApiArea.hrms + ApiController.attendance + "/GetSchedulerInfoWithDetails"), {
      responseType: "json", observe: 'response', params: { hostEmployeeId: hostEmployeeId, schedulerInfoId: schedulerInfoId, companyId: this.User().ComId, organizationId: this.User().OrgId }
    })
  }


  populateDataForSchedulerRequestInEditMode(masterFormData: any) {
    this.schedulerRequestFormInit();
    masterFormData.scheduleDate = new Date(masterFormData.scheduleDate.toString());
    masterFormData.fromTime = this.utilityService.getDateWithSetTime(masterFormData.fromTime.toString());
    masterFormData.toTime = this.utilityService.getDateWithSetTime(masterFormData.toTime.toString());

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

  //#region scheduler-delete
  meetingCode: string = '';
  schedulerInfoItem: any = null;
  openSchedulerRequestDeleteModal(item: any) {
    this.schedulerInfoItem = item;
    this.modalService.open(this.schedulerRequestDeleteModal, "sm");
    this.meetingCode = this.schedulerInfoItem.scheduleCode;
  }

  confirmDelete() {
    if (Object.keys(this.schedulerInfoItem).length > 0) {
      this.areasHttpService.observable_delete<any>((ApiArea.hrms + ApiController.attendance + '/DeleteSchedulerInfo/' + this.schedulerInfoItem.schedulerInfoId), {
        params: { hostEmployeeId: this.User().EmployeeId, userId: this.User().UserId, branchId: this.User().BranchId, companyId: this.User().ComId, organizationId: this.User().OrgId }
      }).subscribe((response) => {
        var result = response as any;
        if (result?.status) {
          this.getSchedulerRequests(this.schedulerRequestPageNo);
          this.utilityService.success(result.msg, "Server Response")
          this.modalService.service.dismissAll();
        }
        else {
          this.utilityService.fail(result.msg, "Server Response")
        }
      }, (error) => {
        this.logger("error >>>", error);
      })
    }
  }

  //#endregion scheduler-delete

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

  openSchedulerDetailModal(schedulerInfoId: number, hostEmployeeId: number = this.User().EmployeeId) {
    this.schedulerPermissionData = {};
    this.getSchedulerInfoWithDetails(schedulerInfoId, hostEmployeeId).subscribe((response) => {
      var res = response as any;
      this.schedulerPermissionData = res.body as any;
      this.logger("this.schedulerPermissionData >>>", this.schedulerPermissionData);
      if (Object.keys(this.schedulerPermissionData).length > 0) {
        this.modalService.open(this.schedulerRequestViewModal, "lg");
      }
    }, (error) => {
      this.logger("Error In loadSchedulerInfoWithDetails For View >>>", error);
    })
  }

  //#endregion Scheduler-Permission

  //#endregion Schedule-Request

  //#region Schedule-Requested
  searchByMeetingCode2: string = '';
  searchByEmployeeText2: string = '';
  searchByEmployeeId2: number = 0;
  searchByLocation2: string = '';
  searchByDate2: any[] = [];
  searchByStatus2: string = '';

  searchByEmployeeChanged2(event: TypeaheadMatch) {
    this.searchByEmployeeText2 = event.item.text;
    this.searchByEmployeeId2 = this.utilityService.IntTryParse(event.item.id);
    this.getSchedulerRequested(1);
  }

  schedulerRequestedPageChanged(event: any) {
    this.schedulerRequestedPageNo = event;
    this.getSchedulerRequested(this.schedulerRequestedPageNo);
  }

  listOfSchedulerRequested: any[] = [];
  schedulerRequestedDTLabel: string = null;
  getSchedulerRequested(pageNo: number) {
    let fromDate;
    let toDate;
    this.schedulerRequestedPageNo = pageNo;
    if (this.searchByDate2?.length > 0) {
      this.logger("this.searchByDate>>>", this.datepipe.transform(this.searchByDate2[0], 'yyyy-MM-dd'));
      fromDate = this.datepipe.transform(this.searchByDate2[0], 'yyyy-MM-dd');
      toDate = this.datepipe.transform(this.searchByDate2[1], 'yyyy-MM-dd');
    }
    this.listOfSchedulerRequested = [];
    this.areasHttpService.observable_get<any[]>((ApiArea.hrms + ApiController.attendance + "/GetSchedulerDetails"), {
      responseType: "json", observe: 'response', params: { scheduleCode: this.searchByMeetingCode2, hostEmployeeId: this.searchByEmployeeId2, location: this.searchByLocation2, fromDate: fromDate ?? '', toDate: toDate ?? '', guestEmployeeId: this.User().EmployeeId, participantStatus: this.searchByStatus2, pageSize: this.schedulerRequestedPageSize, pageNumber: pageNo }
    }).subscribe((response) => {
      var res = response as any;
      this.listOfSchedulerRequested = res.body;
      this.schedulerRequestedDTLabel = this.listOfSchedulerRequested.length == 0 ? 'No record(s) found' : null;
      // this.schedulerRequestedPageConfig = JSON.parse(res.headers.get('X-Pagination'));
      var xPaginate = JSON.parse(res.headers.get('X-Pagination'));
      this.schedulerRequestedPageConfig = this.userService.pageConfigInit("schedulerRequested", xPaginate.itemsPerPage, xPaginate.currentPage, xPaginate.totalItems);
      this.logger("this.listOfSchedulerRequested >>>", this.listOfSchedulerRequested);
    }, (error) => {
      this.logger("listOfSchedulerRequested error >> ", this.listOfSchedulerRequested);
    })
  }

  schedulerRequestedItem: any;
  openScheduleRequested(item: any) {
    this.schedulerRequestedItem = null;
    this.schedulerRequestedItem = item;
    this.meetingCode = item.scheduleCode;
    this.modalService.open(this.schedulerRequestedModal, "sm");
  }

  saveParticipantStatus(status: string, remarks: string) {
    if (status != null && status != '' && remarks != null && remarks != '') {
      this.areasHttpService.observable_post((ApiArea.hrms + ApiController.attendance + "/SaveSchedulerParticipantStatus"), null, {
        'headers': {
          'Content-Type': 'application/json'
        },
        params: { schedulerInfoId: this.schedulerRequestedItem.schedulerInfoId, schedulerDetailId: this.schedulerRequestedItem.schedulerDetailId, status: status, remarks: remarks }
      }).subscribe((result) => {
        this.logger("Submit result >>", result);
        var data = result as any;
        if (data.status) {
          this.utilityService.success(data.msg, "Server Response")
          this.modalService.service.dismissAll();
          this.getSchedulerRequested(this.schedulerRequestPageNo)
        }
        else {
          this.utilityService.fail(data.msg, "Server Response")
        }
      }, (error) => {
        this.utilityService.fail("Something went wrong", "Server Response")
      })
    }
  }
  //#endregion Schedule-Requested

}

