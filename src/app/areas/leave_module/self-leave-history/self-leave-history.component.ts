import { transition, trigger, useAnimation } from '@angular/animations';
import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { bounceIn, fadeIn, fadeInRight, slideInUp } from 'ng-animate';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { ApiArea, ApiController } from 'src/app/shared/constants';
import { CustomModalService } from 'src/app/shared/services/custom-modal.service';
import { HrWebService } from 'src/app/shared/services/hr-web.service';
import { UserService } from 'src/app/shared/services/user.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AreasHttpService } from '../../areas.http.service';
import { EmployeeLeaveRequestService } from '../employee-leave-request/employee-leave-request.service';
import { LeaveTypeSerive } from '../leave-type/leave-type.service';

@Component({
  selector: 'app-hr-self-leave-history',
  templateUrl: './self-leave-history.component.html',

  animations: [
    trigger('slideInUp', [transition('* => *', useAnimation(slideInUp, { params: { timing: 0.5 } }))]),
    trigger('fadeIn', [transition('void => *', useAnimation(fadeIn, { params: { timing: 0.3 } }))]),
    trigger('fadeInRight', [transition('void => *', useAnimation(fadeInRight, { params: { timing: 0.5 } }))]),
    trigger('bounceIn', [transition('void => *', useAnimation(bounceIn, { params: { timing: 1 } }))]),
  ]
})

export class SelfLeaveHistoryComponent implements OnInit {

  constructor(private datepipe: DatePipe,
    private fb: FormBuilder,
    private utilityService: UtilityService,
    private leaveTypeSerive: LeaveTypeSerive,
    private userService: UserService,
    public modalService: CustomModalService,
    private employeeLeaveRequestService: EmployeeLeaveRequestService,
    private el: ElementRef) { }


  datePickerConfig: Partial<BsDatepickerConfig> = this.utilityService.datePickerConfig();
  employeeLeaveTypePageNo: number = 1;
  employeeLeaveTypePageSize: number = 15;
  employeeLeaveTypePageConfig: any = this.userService.pageConfigInit("employeeLeaveType", this.employeeLeaveTypePageSize, 1, 0);
  leaveTypeId: any = 0;

  ngOnInit(): void {
    this.getEmployeeLeaveRequests(1);
    this.loadEmployeeLeaveTypes();
  }

  logger(msg: any, options: any) {
    this.utilityService.consoleLog(msg, options);
  }

  User() {
    return this.userService.User();
  }

  select2Options = this.utilityService.select2Config();

  searchByDate: any[] = [];
  searchByLeaveType: number = 0;
  searchByStatus: string = "";
  employeeLeaveRequestsDTLabel: string = null;
  listEmployeeLeaveRequests: any[] = [];
  ddlEmployeeLeaveTypes: any[] = [];

  loadEmployeeLeaveTypes() {
    this.ddlEmployeeLeaveTypes = [];
    this.leaveTypeSerive.loadLeaveTypeDropdown();
    this.leaveTypeSerive.ddl$.subscribe(data=>{
      this.ddlEmployeeLeaveTypes = data;
    });
  }



  employeeLeaveRequestPageChanged(event: any) {
    this.getEmployeeLeaveRequests(event);
  }

  getEmployeeLeaveRequests(pageNo: number) {
    let fromDate;
    let toDate;
    this.employeeLeaveTypePageNo = pageNo;

    if (this.searchByDate?.length > 0) {
      this.logger("this.searchByDate>>>", this.datepipe.transform(this.searchByDate[0], 'yyyy-MM-dd'));
      fromDate = this.datepipe.transform(this.searchByDate[0], 'yyyy-MM-dd');
      toDate = this.datepipe.transform(this.searchByDate[1], 'yyyy-MM-dd');
    }

    this.listEmployeeLeaveRequests = [];
    var params = {
      employeeId: this.User().EmployeeId, leaveTypeId: this.searchByLeaveType, appliedFromDate: fromDate ?? "",
      appliedToDate: toDate ?? "", stateStatus: this.searchByStatus ?? "", pageNumber: this.employeeLeaveTypePageNo, pageSize: this.employeeLeaveTypePageSize
    };

    this.employeeLeaveRequestService.history(params).subscribe(response => {
      var res = response as any;
      this.listEmployeeLeaveRequests = res.body;
      this.employeeLeaveRequestsDTLabel = this.listEmployeeLeaveRequests.length == 0 ? 'No record(s) found' : null;
      var xPaginate = JSON.parse(res.headers.get('X-Pagination'));
      this.employeeLeaveTypePageConfig = this.userService.pageConfigInit("employeeLeaveType", xPaginate.itemsPerPage, xPaginate.currentPage, xPaginate.totalItems);
    }, (error) => {
      this.utilityService.httpErrorHandler(error);
    })
  }

}
