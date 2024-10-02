import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, NgForm } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { ApiArea, ApiController } from 'src/app/shared/constants';
import { CustomModalService } from 'src/app/shared/services/custom-modal.service';
import { UserService } from 'src/app/shared/services/user.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AreasHttpService } from '../../areas.http.service';
import { transition, trigger, useAnimation } from '@angular/animations';
import { bounceIn, fadeIn, fadeInRight, slideInUp } from 'ng-animate';
import { EmployeeInfoService } from '../../employee_module/employee/employee-info.service';
import { LeaveTypeSerive } from '../leave-type/leave-type.service';
import { EmployeeLeaveRequestService } from '../employee-leave-request/employee-leave-request.service';
import { LeaveBalanceService } from '../leave-balance/leave-balance.service';

@Component({
  selector: 'app-subordinates-leave-request-approval',
  templateUrl: './subordinates-leave-approval.component.html',
  animations: [
    trigger('slideInUp', [transition('* => *', useAnimation(slideInUp, { params: { timing: 0.5 } }))]),
    trigger('fadeIn', [transition('void => *', useAnimation(fadeIn, { params: { timing: 0.3 } }))]),
    trigger('fadeInRight', [transition('void => *', useAnimation(fadeInRight, { params: { timing: 0.5 } }))]),
    trigger('bounceIn', [transition('void => *', useAnimation(bounceIn, { params: { timing: 1 } }))]),
  ]
})
export class SubordinatesLeaveApprovalComponent implements OnInit {

  @ViewChild("leaveRequestApprovalModal", { static: false }) leaveRequestApprovalModal !: ElementRef;

  modalTitle: string = "";
  employeeLeaveTypePageSize: number = 15;
  employeeLeaveTypePageNo: number = 1;
  datePickerConfig: Partial<BsDatepickerConfig> = this.utilityService.datePickerConfig();

  ngInIt: boolean = false;
  employeeLeaveTypePageConfig: any = this.userService.pageConfigInit("employeeLeaveType", this.employeeLeaveTypePageSize, 1, 0);

  constructor(private datepipe: DatePipe, private fb: FormBuilder, private areasHttpService: AreasHttpService, private utilityService: UtilityService, private userService: UserService, public modalService: CustomModalService, private el: ElementRef, private employeeInfoService: EmployeeInfoService, private leaveTypeSerive: LeaveTypeSerive, private employeeLeaveRequestService: EmployeeLeaveRequestService, private leaveBalanceService: LeaveBalanceService) {

  }

  pagePrivilege: any = null;

  pageInit() {
    this.getEmployeeLeaveRequests(1);
    this.loadEmployeesForForm();
    this.loadEmployeeLeaveTypes();
  }

  ngOnInit(): void {
    this.pageInit();
  }

  employeeLeaveBalance: any = [];
    loadLeaveBalance(id: number) {
        this.leaveBalanceService.getLeaveBalanceAsync(id).subscribe(response => {
            this.employeeLeaveBalance = response;
            console.log("response >>>", response);
        })
    }

  select2Options = this.utilityService.select2Config();
  logger(msg: any, options: any) {
    this.utilityService.consoleLog(msg, options);
  }

  User() {
    return this.userService.User();
  }

  searchByEmployee: any = 0;
  ddlEmployeesForSearch: any[] = [];



  loadEmployeesForForm() {
    this.employeeInfoService.loadDropdownData({});
    this.employeeInfoService.ddl_employee_data$.subscribe(data => {
      this.employeeInfoService.loadDropdown(data);
      this.ddlEmployeesForSearch = this.employeeInfoService.ddl$;
    }, error => {
      console.error('Error while fetching data:', error);
    });
  }

  loadEmployeeLeaveTypes() {
    this.ddlEmployeeLeaveTypes = [];
    this.leaveTypeSerive.loadLeaveTypeDropdown();
    this.ddlEmployeeLeaveTypes = this.leaveTypeSerive.ddl$;
  }

  searchBy_employeeChanged() {
    if (this.ngInIt) {
      this.getEmployeeLeaveRequests(1);
    }
    this.ngInIt = true;
  }

  employeeLeaveRequestPageChanged(event: any) {
    this.employeeLeaveTypePageNo = event;
    this.getEmployeeLeaveRequests(event);
  }

  searchByLeaveType: number = 0;
  searchByDayLeaveType: string = "";
  searchByStatus: string = "";
  ddlEmployeeLeaveTypes: any = [];
  searchByAppliedDate: any[] = [];
  listEmployeeLeaveRequests: any[] = [];
  employeeLeaveRequestsDTLabel: string = "";

  getEmployeeLeaveRequests(pageNo: any) {
    let fromDate;
    let toDate;

    if (this.searchByAppliedDate?.length > 0) {
      this.logger("this.searchByDate>>>", this.datepipe.transform(this.searchByAppliedDate[0], 'yyyy-MM-dd'));
      fromDate = this.datepipe.transform(this.searchByAppliedDate[0], 'yyyy-MM-dd');
      toDate = this.datepipe.transform(this.searchByAppliedDate[1], 'yyyy-MM-dd');
    }

    this.logger("this.searchByEmployee>>>", this.searchByEmployee)
    this.listEmployeeLeaveRequests = [];

    var params = { employeeId: this.utilityService.IntTryParse(this.searchByEmployee), leaveTypeId: this.searchByLeaveType, dayLeaveType: this.searchByDayLeaveType ?? "", appliedFromDate: fromDate ?? "", appliedToDate: toDate ?? "", stateStatus: this.searchByStatus ?? "", pageNumber: this.employeeLeaveTypePageNo, pageSize: this.employeeLeaveTypePageSize, supervisorId: this.User().EmployeeId };

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

  leaveRequestApprovalItem: any;
  openEmployeeLeaveRequestApprovalModal(employeeId: number, id: number) {
    this.leaveRequestApprovalItem = {};
    this.getEmployeeLeaveRequestById(employeeId, id);
    this.modalService.open(this.leaveRequestApprovalModal, "lg");
  }

  getEmployeeLeaveRequestById(employeeId: number, id: number) {
    this.areasHttpService.observable_get<any[]>((ApiArea.hrms + "/leave/LeaveRequest" + "/GetEmployeeLeaveRequestById"), {
      responseType: "json", observe: 'response', params: { employeeId: employeeId, employeeLeaveRequestId: id, companyId: this.User().ComId, organizationId: this.User().OrgId }
    }).subscribe((response) => {
      var res = response as any;
      console.log("res >>>", res)
      this.leaveRequestApprovalItem = res.body;
      this.logger("this.leaveRequestApprovalItem >>>", this.leaveRequestApprovalItem);
      this.leaveDaysCalculation(this.leaveRequestApprovalItem);
      if(this.utilityService.IntTryParse(employeeId) > 0){
        this.loadLeaveBalance(employeeId);
      }
    },
      (error) => { console.log(error) }
    )
  }
  btnLeaveRequestApproval: boolean = false;

  submitLeaveRequestApproval(leaveRequestApproavalForm: NgForm, remarks: string, status: string) {
    if (leaveRequestApproavalForm.valid) {
      this.btnLeaveRequestApproval = true;

      this.employeeLeaveRequestService.approval({ employeeId: this.leaveRequestApprovalItem.employeeId, employeeLeaveRequestId: this.leaveRequestApprovalItem.employeeLeaveRequestId, remarks: remarks, stateStatus: status }).subscribe(response => {
        var data = response as any;
        this.btnLeaveRequestApproval = false;
        if (data?.status) {
          this.utilityService.success("Saved Successfull", "Server Response")
          this.modalService.service.dismissAll("Save Complete");
          this.getEmployeeLeaveRequests(this.employeeLeaveTypePageNo);
          this.sendEmail2(data);
        }
        else {
          if (data?.msg == "Validation Error") {
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
        (error) => { this.logger("errors >>>", error); this.btnLeaveRequestApproval = false; })
    }
    else {
      this.utilityService.info("Invalid Form Value", "Site Response");
    }
  }

  sendEmail(remarks: string, status: string) {
    let empId = this.leaveRequestApprovalItem.employeeId;
    let leaveId = this.leaveRequestApprovalItem.leaveTypeId;
    var employeeId = empId;
    var leaveTypeId = leaveId;

    this.areasHttpService.observable_get<any>((ApiArea.hrms + ApiController.leave + "/LeaveRequestEmailSend"), {
      responseType: "json", params: { employeeId: employeeId, leaveTypeId: leaveTypeId, remarks: remarks, status: status, emailType: "Approved" }
    }).subscribe(response => {

    })
  }

  sendEmail2(params: any) {
    let leaveRequestId = params.itemId;
    let emailType = "Approved";
    var leaveTypeId = this.utilityService.IntTryParse(params.leaveTypeId);
    this.employeeLeaveRequestService.sendEmail({ employeeId: this.User().EmployeeId, leaveTypeId: leaveTypeId,status:params.action, emailType: emailType, leaveRequestId: leaveRequestId }).subscribe(response => {
      console.log("response >>>", response);
    }, (error) => {
      console.log("error >>>", error);
      this.utilityService.fail("Something went wrong", "Server Response");
    })
  }

  listOfeligibleLeaveDay: any[] = [];
  leaveDaysCalculation(data: any) {
    this.listOfeligibleLeaveDay = []
    if (data != null) {
      let fromDate = this.datepipe.transform(data.appliedFromDate, 'yyyy-MM-dd');
      let toDate = this.datepipe.transform(data.appliedToDate, 'yyyy-MM-dd');
      let leaveTypeId = data.leaveTypeId;

      if (fromDate.indexOf('1970') < 0) {
        var params = { employeeLeaveRequestId: data.employeeLeaveRequestId, employeeId: data.employeeId, leaveTypeId: leaveTypeId, appliedFromDate: fromDate ?? "", appliedToDate: toDate ?? "" };

        this.areasHttpService.observable_get<any>((ApiArea.hrms + "/Leave/LeaveSetting" + "/GetTotalRequestDays"), {
          responseType: "json", observe: 'response', params: params
        }).subscribe(response => {
          console.log("totalLeave >>>", response.body)
          if (response != null) {
            this.listOfeligibleLeaveDay = JSON.parse(response.body?.list)
            console.log("this.eligibleLeaveDayList >>>", this.listOfeligibleLeaveDay);
          }
        })
      }
    }
  }
}
