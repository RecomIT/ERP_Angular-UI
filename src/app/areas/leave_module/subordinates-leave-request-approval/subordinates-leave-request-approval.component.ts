import { DatePipe } from "@angular/common";
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, NgForm } from "@angular/forms";
import { BsDatepickerConfig } from "ngx-bootstrap/datepicker";
import { ApiArea, ApiController } from "src/app/shared/constants";
import { AreasHttpService } from "../../areas.http.service";
import { UtilityService } from "src/app/shared/services/utility.service";
import { UserService } from "src/app/shared/services/user.service";
import { CustomModalService } from "src/app/shared/services/custom-modal.service";
import { EmployeeInfoService } from "../../employee_module/employee/employee-info.service";
import { LeaveTypeSerive } from "../leave-type/leave-type.service";
import { EmployeeLeaveRequestService } from "../employee-leave-request/employee-leave-request.service";
import { LeaveBalanceService } from "../leave-balance/leave-balance.service";
import { SubordinatesLeaveRequestApprovalService } from "./subordinates-leave-request-approval.service";
import { transition, trigger, useAnimation } from "@angular/animations";
import { bounceIn, fadeIn, fadeInRight, slideInUp } from "ng-animate";
import { EmployeeHierarchyService } from "../../employee_module/employee/hierarchy/employee-hierarchy.service";
import { DownloadfileService } from "src/app/shared/services/download-file/downloadfile.service";
import { NotifyService } from "src/app/shared/services/notify-service/notify.service";
@Component({
    selector: 'leave-module-subordinates-leave-request-approval',
    templateUrl: './subordinates-leave-request-approval.component.html',
    animations: [
        trigger('slideInUp', [transition('* => *', useAnimation(slideInUp, { params: { timing: 0.5 } }))]),
        trigger('fadeIn', [transition('void => *', useAnimation(fadeIn, { params: { timing: 0.3 } }))]),
        trigger('fadeInRight', [transition('void => *', useAnimation(fadeInRight, { params: { timing: 0.5 } }))]),
        trigger('bounceIn', [transition('void => *', useAnimation(bounceIn, { params: { timing: 1 } }))]),
    ]
})

export class SubordinatesLeaveRequestApprovalComponent implements OnInit {

    @ViewChild("leaveRequestApprovalModal", { static: false }) leaveRequestApprovalModal !: ElementRef;

    modalTitle: string = "";
    employeeLeaveTypePageSize: number = 15;
    employeeLeaveTypePageNo: number = 1;
    datePickerConfig: Partial<BsDatepickerConfig> = this.utilityService.datePickerConfig();

    ngInIt: boolean = false;
    pageConfig: any = this.userService.pageConfigInit("employeeLeaveType", this.employeeLeaveTypePageSize, 1, 0);

    constructor(private datepipe: DatePipe, 
        private fb: FormBuilder, 
        private areasHttpService: AreasHttpService, 
        private utilityService: UtilityService, 
        private userService: UserService, 
        public modalService: CustomModalService, 
        private el: ElementRef, 
        private employeeInfoService: EmployeeInfoService, 
        private leaveTypeSerive: LeaveTypeSerive, 
        private employeeLeaveRequestService: EmployeeLeaveRequestService, 
        private leaveBalanceService: LeaveBalanceService, 
        private subordinatesLeaveRequestApprovalService: SubordinatesLeaveRequestApprovalService, 
        private employeeHierarchyService: EmployeeHierarchyService,
        private downloadfileService: DownloadfileService,
        private notifyService : NotifyService
    ) {
    }

    pagePrivilege: any = null;

    pageInit() {
        this.getEmployeeLeaveRequests(1);
        //this.loadEmployeesForForm();
        this.loadEmployeeLeaveTypes();
        this.loadSubordinates();
    }

    ngOnInit(): void {
        this.pageInit();
    }

    loadSubordinates() {
        this.employeeHierarchyService.loadDropdownData(this.User().EmployeeId);
        this.employeeHierarchyService.ddl_data$.subscribe(data => {
            console.log("Subordinates list >>>", data);
            this.ddlEmployeesForSearch = data;
            console.log("ddlEmployeesForSearch >>>", this.ddlEmployeesForSearch);
        });
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

    checkedBy: string = this.User().EmployeeId != null ? this.User().EmployeeId.toString() : "";

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

        this.subordinatesLeaveRequestApprovalService.get(params).subscribe(response => {
            this.listEmployeeLeaveRequests = response.body;
            this.employeeLeaveRequestsDTLabel = this.listEmployeeLeaveRequests.length == 0 ? 'No record(s) found' : null;
            var xPaginate = JSON.parse(response.headers.get('X-Pagination'));
            this.pageConfig = this.userService.pageConfigInit("data_list", xPaginate.itemsPerPage, xPaginate.currentPage, xPaginate.totalItems);
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
            if (this.utilityService.IntTryParse(employeeId) > 0) {
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

            this.subordinatesLeaveRequestApprovalService.approval({ employeeId: this.leaveRequestApprovalItem.employeeId, employeeLeaveRequestId: this.leaveRequestApprovalItem.employeeLeaveRequestId, remarks: remarks, stateStatus: status }).subscribe(response => {
                var data = response as any;
                this.btnLeaveRequestApproval = false;
                if (data?.status) {
                    this.utilityService.success("Saved Successfull", "Server Response")
                    this.modalService.service.dismissAll("Save Complete");
                    this.getEmployeeLeaveRequests(this.employeeLeaveTypePageNo);
                    // this.sendEmail2(data);
                    this.sendEmailNew(data);
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

    sendEmailNew(params: any) {
        this.employeeLeaveRequestService.sendEmailNew(params).subscribe(response => {
            console.log("response >>>", response);
        }, (error) => {
        })
    }

    sendEmail2(params: any) {
        let leaveRequestId = params.itemId;
        let emailType = "Approved";
        var leaveTypeId = this.utilityService.IntTryParse(params.leaveTypeId);
        this.employeeLeaveRequestService.sendEmail({ employeeId: this.User().EmployeeId, leaveTypeId: leaveTypeId, status: params.action, emailType: emailType, leaveRequestId: leaveRequestId }).subscribe(response => {
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

    activityLogItem: any;

    showActivityModal: boolean = false;
    openActivityModal(item) {
        this.showActivityModal = true;
        this.activityLogItem = item;
    }

    closeActivityModal(reason: any) {
        this.showActivityModal = false;
    }

    showApprovalModal: boolean = false;
    approvalEmployeeId: number = 0;
    approvalItemId: number = 0;
    openApprovalModal(employeeId: number, id: number) {
        this.showApprovalModal = true;
        this.approvalEmployeeId = employeeId;
        this.approvalItemId = id;
    }

    closeApprovalModal(reason: any) {
        this.showApprovalModal = false;
        this.approvalEmployeeId = 0;
        this.approvalItemId = 0;
        if (reason == 'Save Completed') {
            this.getEmployeeLeaveRequests(this.employeeLeaveTypePageNo);
        }
    }


    
  downloadFile(fileName: string, filePath: string) {

    const params: any = {};
    if (fileName && fileName != null) {
      params['fileName'] = fileName;
    }

    if (filePath && filePath != null) {
      params['filePath'] = filePath;
    }

    this.downloadfileService.downloadFile<any[]>(params).subscribe(data => {

      const blob = new Blob([data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = fileName;
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      window.URL.revokeObjectURL(url);
    }, error => {
    //   console.error('Error downloading file:', error);
        this.notifyService.handleApiError(error);
    });


  }


}