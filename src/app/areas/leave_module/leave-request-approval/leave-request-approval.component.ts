import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, NgForm } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { ApiArea, ApiController } from 'src/app/shared/constants';
import { CustomModalService } from 'src/app/shared/services/custom-modal.service';
import { HrWebService } from 'src/app/shared/services/hr-web.service';
import { PayrollWebService } from 'src/app/shared/services/payroll-web.service';
import { UserService } from 'src/app/shared/services/user.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AreasHttpService } from '../../areas.http.service';

@Component({
  selector: 'app-leave-request-approval',
  templateUrl: './leave-request-approval.component.html'
})
export class LeaveRequestApprovalComponent implements OnInit {

  @ViewChild("leaveRequestApprovalModal", { static: false }) leaveRequestApprovalModal !: ElementRef;

  modalTitle: string = "";
  employeeLeaveTypePageSize: number = 15;
  employeeLeaveTypePageNo: number = 1;
  datePickerConfig: Partial<BsDatepickerConfig> = {};

  ngInIt: boolean = false;
  employeeLeaveTypePageConfig: any = this.userService.pageConfigInit("employeeLeaveType", this.employeeLeaveTypePageSize, 1, 0);

  constructor(private datepipe: DatePipe, private fb: FormBuilder, private areasHttpService: AreasHttpService, private payrollWebService: PayrollWebService, private utilityService: UtilityService, private hrWebService: HrWebService, private userService: UserService, public modalService: CustomModalService, private el: ElementRef) { }

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
    this.getEmployeeLeaveRequests(1);
    this.loadEmployeesForForm();
    this.loadEmployeeLeaveTypes();
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

  searchByEmployee: any = 0;
  ddlEmployeesForSearch: any[] = [];
  loadEmployeesForForm() {
    this.ddlEmployeesForSearch = [];
    this.hrWebService.getEmployees<any[]>().then((data) => {
      this.ddlEmployeesForSearch = data;
      this.logger("this.ddlEmployeesForSearch >>>", this.ddlEmployeesForSearch);
    })
  }

  loadEmployeeLeaveTypes() {
    this.ddlEmployeeLeaveTypes = [];
    this.hrWebService.getGetLeaveTypesExtension<any[]>().then((data) => {
      this.ddlEmployeeLeaveTypes = data;
      this.logger("this.ddlEmployeeLeaveTypes >>>", this.ddlEmployeeLeaveTypes);
    })
  }

  searchBy_employeeChanged() {
    if (this.ngInIt) {
      this.getEmployeeLeaveRequests(1);
    }
    this.ngInIt = true;
  }

  employeeLeaveRequestPageChanged(event: any) {
    this.getEmployeeLeaveRequests(event);
  }

  searchByLeaveType: number = 0;
  searchByDayLeaveType: string = "";
  searchByStatus: string = "";
  ddlEmployeeLeaveTypes: any[] = [];
  searchByAppliedDate: any[] = [];
  listEmployeeLeaveRequests: any[] = [];
  employeeLeaveRequestsDTLabel: string = "";

  getEmployeeLeaveRequests(pageNo: any) {
    let fromDate;
    let toDate;
    this.employeeLeaveTypePageNo = pageNo;
    if (this.searchByAppliedDate?.length > 0) {
      this.logger("this.searchByDate>>>", this.datepipe.transform(this.searchByAppliedDate[0], 'yyyy-MM-dd'));
      fromDate = this.datepipe.transform(this.searchByAppliedDate[0], 'yyyy-MM-dd');
      toDate = this.datepipe.transform(this.searchByAppliedDate[1], 'yyyy-MM-dd');
    }

    this.logger("this.searchByEmployee>>>", this.searchByEmployee);
    this.listEmployeeLeaveRequests = [];
    var params = { employeeId: this.utilityService.IntTryParse(this.searchByEmployee), companyId: this.User().ComId, leaveTypeId: this.searchByLeaveType, dayLeaveType: this.searchByDayLeaveType ?? "", appliedFromDate: fromDate ?? "", appliedToDate: toDate ?? "", stateStatus: this.searchByStatus ?? "", organizationId: this.User().OrgId, pageNumber: this.employeeLeaveTypePageNo, pageSize: this.employeeLeaveTypePageSize };

    this.areasHttpService.observable_get<any[]>((ApiArea.hrms + ApiController.leave + "/GetEmployeeLeaveRequests"), {
      responseType: "json", observe: 'response', params: params
    }).subscribe((response) => {
      var res = response as any;
      this.logger("listEmployeeLeaveRequests >>>", this.listEmployeeLeaveRequests);
      this.listEmployeeLeaveRequests = res.body;
      this.employeeLeaveRequestsDTLabel = this.listEmployeeLeaveRequests.length == 0 ? 'No record(s) found' : null;
      var xPaginate = JSON.parse(res.headers.get('X-Pagination'));
      this.employeeLeaveTypePageConfig = this.userService.pageConfigInit("employeeLeaveType", xPaginate.itemsPerPage, xPaginate.currentPage, xPaginate.totalItems);
    },
      (error) => { console.log(error) }
    )
  }

  leaveRequestApprovalItem: any;
  openEmployeeLeaveRequestApprovalModal(employeeId: number, id: number) {
    this.leaveRequestApprovalItem = {};
    this.getEmployeeLeaveRequestById(employeeId, id);
    this.modalService.open(this.leaveRequestApprovalModal, "lg");
  }

  getEmployeeLeaveRequestById(employeeId: number, id: number) {
    this.areasHttpService.observable_get<any[]>((ApiArea.hrms + ApiController.leave + "/GetEmployeeLeaveRequests"), {
      responseType: "json", observe: 'response', params: { employeeId: employeeId, employeeLeaveRequestId: id }
    }).subscribe((response) => {
      var res = response as any;
      if (!$.isPlainObject(res.body)) {
        this.leaveRequestApprovalItem = res.body[0];
        this.logger("this.leaveRequestApprovalItem >>>", this.leaveRequestApprovalItem);
      }
    },
      (error) => { console.log(error) }
    )
  }
  btnLeaveRequestApproval: boolean = false;

  // submitLeaveRequestApproval(leaveRequestApproavalForm: NgForm, remarks: string, status: string){
  //   if(leaveRequestApproavalForm.valid){
  //     this.btnLeaveRequestApproval = true;
  //     this.areasHttpService.observable_post<any[]>((ApiArea.hrms + ApiController.leave + "/SaveEmployeeLeaveRequestStatus"),null, {
  //       responseType: "json", observe: 'response', params: {employeeId:this.leaveRequestApprovalItem.employeeId, employeeLeaveRequestId:this.leaveRequestApprovalItem.employeeLeaveRequestId,remarks:remarks,status: status , companyId: this.User().ComId, organizationId: this.User().OrgId, userId: this.User().UserId }
  //     }).subscribe((response) => {
  //       var data = response as any;
  //       this.btnLeaveRequestApproval = false;
  //       if (data?.status) {
  //         this.utilityService.success("Saved Successfull", "Server Response")
  //         this.modalService.service.dismissAll("Save Complete");
  //         this.getEmployeeLeaveRequests(this.employeeLeaveTypePageNo);
  //       }
  //       else {
  //         if (data?.msg == "Validation Error") {
  //           data.msg='';
  //           Object.keys(data.errors).forEach((key)=>{
  //             data.msg+= data.errors[key] +'</br>';
  //           })
  //           this.utilityService.fail(data.msg, "Server Response",5000)
  //         }
  //         else {
  //           this.utilityService.fail(data.msg, "Server Response")
  //         }
  //       }
  //     },
  //       (error) => { this.logger("errors >>>",error); this.btnLeaveRequestApproval = false; }
  //     )
  //   }
  //   else{
  //     this.utilityService.info("Invalid Form Value","Site Response");
  //   }
  // }

  // Added By Nur Bhai
  submitLeaveRequestApproval(leaveRequestApproavalForm: NgForm, remarks: string, status: string) {
    if (leaveRequestApproavalForm.valid) {
      this.btnLeaveRequestApproval = true;
      this.areasHttpService.observable_post<any[]>((ApiArea.hrms + ApiController.leave + "/SaveEmployeeLeaveRequestStatus"), null, {
        responseType: "json", observe: 'response', params: { employeeId: this.leaveRequestApprovalItem.employeeId, employeeLeaveRequestId: this.leaveRequestApprovalItem.employeeLeaveRequestId, remarks: remarks, status: status, companyId: this.User().ComId, organizationId: this.User().OrgId, userId: this.User().UserId }
      }).subscribe((response) => {
        var data = response as any;
        this.btnLeaveRequestApproval = false;
        if (data?.status) {
          this.sendEmail(remarks, status);
          this.utilityService.success("Saved Successfull", "Server Response")
          this.modalService.service.dismissAll("Save Complete");
          this.getEmployeeLeaveRequests(this.employeeLeaveTypePageNo);
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
        (error) => { this.logger("errors >>>", error); this.btnLeaveRequestApproval = false; }
      )
    }
    else {
      this.utilityService.info("Invalid Form Value", "Site Response");
    }
  }

  sendEmail(remarks: string, status: string) {
    // console.log("empId>>>", this.leaveRequestApprovalItem.employeeId);
    // console.log("leaveId>>>", this.leaveRequestApprovalItem.leaveTypeId);
    // console.log("status mail>>>", status);
    let empId = this.leaveRequestApprovalItem.employeeId;
    let leaveId = this.leaveRequestApprovalItem.leaveTypeId;
    var employeeId = empId;
    var leaveTypeId = leaveId;

    this.areasHttpService.observable_get<any>((ApiArea.hrms + "/LeaveSetting" + "/LeaveRequestEmailSend"), {
      responseType: "json", params: { employeeId: employeeId, leaveTypeId: leaveTypeId, remarks: remarks, status: status, emailType: "Approved" }
    }).subscribe(response => {

    })
  }

}
