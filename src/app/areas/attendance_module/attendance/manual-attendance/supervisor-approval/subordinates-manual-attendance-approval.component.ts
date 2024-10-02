import { NgForm } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { AreasHttpService } from '../../../../areas.http.service';
import { UserService } from 'src/app/shared/services/user.service';
import { HrWebService } from 'src/app/shared/services/hr-web.service';
import { bounceIn, fadeIn, fadeInRight, slideInUp } from 'ng-animate';
import { ManualAttendanceService } from '../manual-attendance.service';
import { transition, trigger, useAnimation } from '@angular/animations';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CustomModalService } from 'src/app/shared/services/custom-modal.service';
import { EmployeeInfoService } from 'src/app/areas/employee_module/employee/employee-info.service';

@Component({
  selector: 'attendance-module-subordinates-manual-attendance-approval',
  templateUrl: './subordinates-manual-attendance-approval.component.html',
  animations: [
    trigger('slideInUp', [transition('* => *', useAnimation(slideInUp, { params: { timing: 0.5 } }))]),
    trigger('fadeIn', [transition('void => *', useAnimation(fadeIn, { params: { timing: 0.3 } }))]),
    trigger('fadeInRight', [transition('void => *', useAnimation(fadeInRight, { params: { timing: 0.5 } }))]),
    trigger('bounceIn', [transition('void => *', useAnimation(bounceIn, { params: { timing: 1 } }))]),
  ]
})
export class SubordinatesManualAttendanceApprovalComponent implements OnInit {

  @ViewChild("manualAttendanceApprovalModal", { static: true }) manualAttendanceApprovalModal!: ElementRef;
  modalTitle: string = "";
  manualAttnApprovalPageSize: number = 15;
  manualAttnApprovalPageNo: number = 1;
  datePickerConfig: Partial<BsDatepickerConfig> = this.utilityService.datePickerConfig();
  mattCode: string = "";

  ngInIt: boolean = false;

  manualAttnApprovalPageConfig: any = this.userService.pageConfigInit("manualAttn", this.manualAttnApprovalPageSize, 1, 0);

  constructor(private datepipe: DatePipe,
    private manualAttendanceService: ManualAttendanceService,
    private utilityService: UtilityService, private employeeInfoService: EmployeeInfoService, private userService: UserService,
    public modalService: CustomModalService) { }

  ngOnInit(): void {
    this.getManualAttendancesApproval();
    this.loadEmployees();
  }

  

  pagePrivilege: any = null;

  select2Options = this.utilityService.select2Config();

  logger(msg: any, options: any) {
    this.utilityService.consoleLog(msg, options);
  }

  User() {
    return this.userService.User();
  }

  btnManualAttendanceApproval: boolean = false;
  listOfManualAttendanceApproval: any[] = [];
  manualAttendanceApprovalDTLabel: string = null;

  searchByDate: any[] = [];
  searchByReason: string = '';
  searchByRequestFor: string = '';
  searchByStatus: string = '';
  searchByCode: string = '';
  searchByEmployee: any = '';

  getManualAttendancesApproval() {
    let fromDate;
    let toDate;

    if (this.searchByDate?.length > 0) {
      this.logger("this.searchByDate>>>", this.datepipe.transform(this.searchByDate[0], 'yyyy-MM-dd'));
      fromDate = this.datepipe.transform(this.searchByDate[0], 'yyyy-MM-dd');
      toDate = this.datepipe.transform(this.searchByDate[1], 'yyyy-MM-dd');
    }

    this.listOfManualAttendanceApproval = [];
    let params = {
      manualAttendanceCode: this.searchByCode, reason: this.searchByReason,
      timeRequestFor: this.searchByRequestFor, fromDate: fromDate ?? '',
      toDate: toDate ?? '', stateStatus: this.searchByStatus,
      employeeId: this.utilityService.IntTryParse(this.searchByEmployee), pageSize: this.manualAttnApprovalPageSize, pageNumber: this.manualAttnApprovalPageNo
    };

    this.manualAttendanceService.getSubordinatesManualAttendancesRequests(params).subscribe(response => {
      this.listOfManualAttendanceApproval = response.body;
      this.manualAttendanceApprovalDTLabel = this.listOfManualAttendanceApproval.length == 0 ? 'No record(s) found' : null;
      var xPaginate = JSON.parse(response.headers.get('X-Pagination'));
      this.manualAttnApprovalPageConfig = this.userService.pageConfigInit("manualAttn", xPaginate.itemsPerPage, xPaginate.currentPage, xPaginate.totalItems);
    }, (error) => {
      console.log("error >>>", error);
      this.utilityService.fail("Something went wrong", "Server Response");
    })
  }

  manualAttendanceApprovalItem: any = null;
  openManualAttendancePermission(item: any) {
    this.btnManualAttStatusSubmit = false;
    this.manualAttendanceApprovalItem = item;
    this.modalService.open(this.manualAttendanceApprovalModal, "lg")
  }

  btnManualAttStatusSubmit: boolean = false;

  submitManualAttendancePermission(form: NgForm, remarks: any, checkStatus: any) {
    
    if (form.valid && checkStatus.value != '' && remarks.value != '') {
      

      console.log("this.manualAttendanceApprovalItem >>>",this.manualAttendanceApprovalItem);
      var data = {
        manualAttendanceId: this.manualAttendanceApprovalItem.manualAttendanceId,
        stateStatus: checkStatus, remarks: remarks
      };

      this.manualAttendanceService.approval(data).subscribe(response => {

        this.btnManualAttStatusSubmit = false;
        if (response.status) {
          this.utilityService.success(response.msg, "Server Response")
          this.modalService.service.dismissAll();
          this.getManualAttendancesApproval();
        }
        else {
          this.utilityService.fail(response.msg, "Server Response")
        }
      }, error => {
        console.log("error >>>", error);
        this.utilityService.fail('Something went wrong', 'Server Response');
      })
    }
    else {
      this.utilityService.fail("One or More field value is invalid", "Site Response");
    }
  }


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

  searchByEmployeeChanged() {
    if (this.ngInIt) {
      this.manualAttnApprovalPageNo = 1
      this.getManualAttendancesApproval();
    }
    this.ngInIt = true;
  }

  manualAttendancePageChanged(event: any) {
    this.manualAttnApprovalPageNo = event;
    this.getManualAttendancesApproval();
  }


}
