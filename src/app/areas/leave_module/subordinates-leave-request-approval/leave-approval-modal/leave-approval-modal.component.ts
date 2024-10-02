import { DatePipe } from "@angular/common";
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { AreasHttpService } from "src/app/areas/areas.http.service";
import { CustomModalService } from "src/app/shared/services/custom-modal.service";
import { UserService } from "src/app/shared/services/user.service";
import { UtilityService } from "src/app/shared/services/utility.service";
import { EmployeeLeaveRequestService } from "../../employee-leave-request/employee-leave-request.service";
import { LeaveBalanceService } from "../../leave-balance/leave-balance.service";
import { SubordinatesLeaveRequestApprovalService } from "../subordinates-leave-request-approval.service";
import { ApiArea } from "src/app/shared/constants";
import { NgForm } from "@angular/forms";

@Component({
    selector: 'leave-module-leave-approval-modal',
    templateUrl: './leave-approval-modal.component.html'
})

export class LeaveApprovalModalComponent implements OnInit {
    @ViewChild("leaveRequestApprovalModal", { static: true }) leaveRequestApprovalModal !: ElementRef;
    @Output() closeModalEvent = new EventEmitter<string>();
    @Input() employeeId: number = 0;
    @Input() id: number = 0;
    modalTitle: string = "";
    ngOnInit(): void {
        this.openEmployeeLeaveRequestApprovalModal(this.employeeId, this.id);
    }

    constructor(private datepipe: DatePipe, private areasHttpService: AreasHttpService, private utilityService: UtilityService, private userService: UserService, public modalService: CustomModalService, private el: ElementRef, private employeeLeaveRequestService: EmployeeLeaveRequestService, private leaveBalanceService: LeaveBalanceService, private subordinatesLeaveRequestApprovalService: SubordinatesLeaveRequestApprovalService) {
    }

    User() {
        return this.userService.User();
    }

    leaveRequestApprovalItem: any;

    openEmployeeLeaveRequestApprovalModal(employeeId: number, id: number) {
        this.leaveRequestApprovalItem = {};
        this.getEmployeeLeaveRequestById(employeeId, id);
        this.modalService.open(this.leaveRequestApprovalModal, "lg");
    }

    logger(msg: any, options: any) {
        this.utilityService.consoleLog(msg, options);
    }

    getEmployeeLeaveRequestById(employeeId: number, id: number) {
        this.areasHttpService.observable_get<any[]>((ApiArea.hrms + "/leave/LeaveRequest" + "/GetEmployeeLeaveRequestById"), {
            responseType: "json", observe: 'response', params: { employeeId: employeeId, employeeLeaveRequestId: id, companyId: this.User().ComId, organizationId: this.User().OrgId }
        }).subscribe((response) => {
            var res = response as any;
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

    employeeLeaveBalance: any = [];
    loadLeaveBalance(id: number) {
        this.leaveBalanceService.getLeaveBalanceAsync(id).subscribe(response => {
            this.employeeLeaveBalance = response;
            console.log("response >>>", response);
        })
    }

    btnLeaveRequestApproval: boolean = false;
    submit(leaveRequestApproavalForm: NgForm, remarks: string, status: string) {
        if (leaveRequestApproavalForm.valid) {
            this.btnLeaveRequestApproval = true;

            this.subordinatesLeaveRequestApprovalService.approval({ employeeId: this.leaveRequestApprovalItem.employeeId, employeeLeaveRequestId: this.leaveRequestApprovalItem.employeeLeaveRequestId, remarks: remarks, stateStatus: status }).subscribe(response => {
                var data = response as any;
                this.btnLeaveRequestApproval = false;
                if (data?.status) {
                    this.utilityService.success("Saved Successfull", "Server Response")
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

    sendEmailNew(params: any) {
        this.employeeLeaveRequestService.sendEmailNew(params).subscribe(response => {
            console.log("response >>>", response);
        }, (error) => {
            this.utilityService.warning("Email could not be sent", "Server Response")
        })
        this.closeModal('Save Completed')
    }

    closeModal(reason: any) {
        this.modalService.service.dismissAll(reason);
        this.closeModalEvent.emit(reason);
    }

}