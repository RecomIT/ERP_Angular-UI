import { DatePipe } from '@angular/common';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/shared/services/user.service';
import { bounceIn, fadeIn, fadeInRight, slideInUp } from 'ng-animate';
import { transition, trigger, useAnimation } from '@angular/animations';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { SelfManualAttendanceService } from '../self-manual-attendance.service';
import { CustomModalService } from 'src/app/shared/services/custom-modal.service';
import { EmployeeInfoService } from 'src/app/areas/employee_module/employee/employee-info.service';

@Component({
  selector: 'self-manual-attendance',
  templateUrl: './self-manual-attendance.component.html',
  animations: [
    trigger('slideInUp', [transition('* => *', useAnimation(slideInUp, { params: { timing: 0.5 } }))]),
    trigger('fadeIn', [transition('void => *', useAnimation(fadeIn, { params: { timing: 0.3 } }))]),
    trigger('fadeInRight', [transition('void => *', useAnimation(fadeInRight, { params: { timing: 0.5 } }))]),
    trigger('bounceIn', [transition('void => *', useAnimation(bounceIn, { params: { timing: 1 } }))]),
]
})
export class SelfManualAttendanceComponent implements OnInit {

  @ViewChild("manualAttendanceModal", { static: true }) manualAttendanceModal!: ElementRef;
  @ViewChild("manualAttendanceDeleteModal", { static: true }) manualAttendanceDeleteModal!: ElementRef;

  modalTitle: string = "";
  manualAttendanceForm: FormGroup;
  datePickerConfig: Partial<BsDatepickerConfig> = this.utilityService.datePickerConfig();

  manualAttnPageSize: number = 15;
  manualAttnPageNo: number = 1;


  manualAttnPageConfig: any = this.userService.pageConfigInit("manualAttn", this.manualAttnPageSize, 1, 0);

  minTime: Date = new Date();
  maxTime: Date = new Date();

  constructor(private datepipe: DatePipe,
    private fb: FormBuilder,
    private utilityService: UtilityService,
    private selfManualAttendanceService: SelfManualAttendanceService,
    private userService: UserService,
    public modalService: CustomModalService,
    private employeeInfoService: EmployeeInfoService) { }

  ngAfterViewInit(): void {
  }

  ngOnInit(): void {
    this.loadEmployees();
    this.getManualAttendances();
  }

  select2Options = this.utilityService.select2Config();

  logger(msg: any, options: any) {
    this.utilityService.consoleLog(msg, options);
  }

  User() {
    return this.userService.User();
  }

  ddlEmployeesForForm: any[] = [];
  isEmployeeNgSelect2IntiInForm = false;

  ddlEmployees: any[];
  loadEmployees() {
    this.ddlEmployees = [];
    this.employeeInfoService.loadDropdownData({});
    this.employeeInfoService.ddl_employee_data$.subscribe(data => {
      this.employeeInfoService.loadDropdown(data);
      this.ddlEmployees = this.employeeInfoService.ddl$;
    }, error => {
      console.error('Error while fetching data:', error);
    });
  }

  manualAttendanceFormInit() {
    this.manualAttendanceForm = this.fb.group({
      manualAttendanceId: [0],
      manualAttendanceCode: [''],
      employeeId: [this.User().EmployeeId, [Validators.required]],
      attendanceDate: [null, [Validators.required]],
      timeRequestFor: ['Both', [Validators.required]],
      inTime: [null],
      outTime: [null],
      reason: ['', Validators.required],
      stateStatus: [''],
      lineManagerId: [0],
      supervisorId: [0],
      headOfDeparmentId: [0],
      hrAuthorityId: [0]
    })

    this.minTime.setHours(1);
    this.minTime.setMinutes(0);
    this.maxTime.setHours(23);
    this.maxTime.setMinutes(59);

    this.manualAttendanceForm.valueChanges.subscribe((data) => {
      console.log("this.manualAttendanceForm.value >>>", this.manualAttendanceForm.value);
    })

  }

  touchedSelect2() {
    this.manualAttendanceForm.get('employeeId').markAsTouched();
  }

  btnManualAttendance: boolean = false;

  openManualAttendanceModal() {
    this.manualAttendanceFormInit();
    this.btnManualAttendance = false;
    this.modalTitle = 'Add Manual Attendance';
    this.modalService.open(this.manualAttendanceModal, "lg");
  }

  submitManualAttendance() {
    if (this.manualAttendanceForm.valid) {
      this.btnManualAttendance = true;
      this.selfManualAttendanceService.save(this.manualAttendanceForm.value).subscribe(response => {
        if (response.status) {
          this.manualAttendanceForm.reset;
          this.utilityService.success(response.msg, "Server Response")
          this.modalService.service.dismissAll();
          this.getManualAttendances()
        }
        else {
          this.utilityService.fail(response.msg, "Server Response")
        }
      }, (error) => {
        console.log("error >>>", error);
        this.utilityService.fail('Something went wrong', 'Server Response');
      })
    }
  }

  searchByEmployee: any = '';
  isEmployeeNgSelect2Search = false;


  searchBy_employeeChanged() {
    if (this.isEmployeeNgSelect2Search) {
      this.manualAttnPageNo = 1;
      this.getManualAttendances();
    }
    this.isEmployeeNgSelect2Search = true;
  }

  searchByDate: any[] = [];
  searchByReason: string = '';
  searchByRequestFor: string = '';
  searchByStatus: string = '';
  searchByCode: string = '';

  listOfMaualAttendance: any[] = [];
  maualAttendanceDTLabel: string = null;

  getManualAttendances() {
    let fromDate;
    let toDate;

    if (this.searchByDate?.length > 0) {
      this.logger("this.searchByDate>>>", this.datepipe.transform(this.searchByDate[0], 'yyyy-MM-dd'));
      fromDate = this.datepipe.transform(this.searchByDate[0], 'yyyy-MM-dd');
      toDate = this.datepipe.transform(this.searchByDate[1], 'yyyy-MM-dd');
    }

    this.listOfMaualAttendance = [];

    let params = {
      manualAttendanceCode: this.searchByCode, reason: this.searchByReason, timeRequestFor: this.searchByRequestFor, fromDate: fromDate ?? '',
      toDate: toDate ?? '', status: this.searchByStatus, employeeId: this.User().EmployeeId,
      pageSize: this.manualAttnPageSize, pageNumber: this.manualAttnPageNo
    };

    this.selfManualAttendanceService.get(params).subscribe(response => {
      this.listOfMaualAttendance = response.body;
      this.maualAttendanceDTLabel = this.listOfMaualAttendance.length == 0 ? 'No record(s) found' : null;
      this.logger("this.listOfMaualAttendance >>>", this.listOfMaualAttendance);
      var xPaginate = JSON.parse(response.headers.get('X-Pagination'));
      this.manualAttnPageConfig = this.userService.pageConfigInit("manualAttn", xPaginate.itemsPerPage, xPaginate.currentPage, xPaginate.totalItems);
    }, (error) => {
      console.log("errors >>", error);
      this.utilityService.fail("Somethign went wrong", "Server Response");
    })
  }

  manualAttendancePageChanged(event: any) {
    this.manualAttnPageNo = event;
    this.getManualAttendances();
  }

  getManualAttendance(id: number) {
    this.selfManualAttendanceService.getById({ manualAttendanceId: id }).subscribe(response => {
      this.populateDataForManualAttendanceInEditMode(response.body[0]);
    }, (error) => {
      console.log("error >>>", error);
      this.utilityService.fail('Something went wrong', 'Server Response');
    })
  }

  populateDataForManualAttendanceInEditMode(formData: any) {
    this.manualAttendanceFormInit();

    formData.attendanceDate = new Date(formData.attendanceDate.toString());
    formData.inTime = this.utilityService.getDateWithSetTime(formData.inTime?.toString());
    formData.outTime = this.utilityService.getDateWithSetTime(formData.outTime?.toString());

    this.btnManualAttendance = false;
    this.modalTitle = 'Update Manual Attendance';
    this.modalService.open(this.manualAttendanceModal, "lg");

    this.manualAttendanceForm.patchValue(formData);
  }

  //#region delete
  mattCode: string = '';
  manualAttnInfoItem: any = null;
  openSchedulerRequestDeleteModal(item: any) {
    this.manualAttnInfoItem = item;
    this.modalService.open(this.manualAttendanceDeleteModal, "sm");
    this.mattCode = this.manualAttnInfoItem.manualAttendanceCode;
  }

  confirmDelete() {
    if (Object.keys(this.manualAttnInfoItem).length > 0) {
      this.selfManualAttendanceService.delete({ manualAttendanceId: this.manualAttnInfoItem.manualAttendanceId, 
        employeeId: this.User().EmployeeId }).subscribe(response => {
          if (response.status) {
            this.utilityService.success(response.msg, "Server Response")
            this.modalService.service.dismissAll();
            this.getManualAttendances()
          }
          else {
            this.utilityService.fail(response.msg, "Server Response")
          }
        }, (error) => {
          console.log("errors >>", error);
          this.utilityService.fail("Somethign went wrong", "Server Response");
        })
    }
  }
  //#endregion delete

}
