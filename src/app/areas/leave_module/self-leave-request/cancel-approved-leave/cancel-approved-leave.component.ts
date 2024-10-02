import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { CustomModalService } from "src/app/shared/services/custom-modal.service";
import { UserService } from "src/app/shared/services/user.service";
import { UtilityService } from "src/app/shared/services/utility.service";
import { EmployeeLeaveRequestService } from "../../employee-leave-request/employee-leave-request.service";
import { SharedmethodService } from "src/app/shared/services/shared-method/sharedmethod.service";

@Component({
    selector: 'leave-module-cancel-apporved-leave',
    'templateUrl': './cancel-approved-leave.component.html'
})


export class CancelApprovedLeaveComponent implements OnInit {
    @ViewChild("employeeLeaveRequestDeleteModal", { static: true }) employeeLeaveRequestDeleteModal !: ElementRef;
    @Input() item: any;
    @Output() closeModalEvent = new EventEmitter<string>();
    constructor(
        private utilityService: UtilityService,
        private userService: UserService,
        public modalService: CustomModalService,
        private employeeLeaveRequestService: EmployeeLeaveRequestService,
        private sharedmethodService: SharedmethodService) {
    }

    approvedLeaveItem: any;
    approvedLeaveHistories: any;
    getInfo() {
        this.employeeLeaveRequestService.getInfoAndDetailById({ id: this.item.employeeLeaveRequestId }).subscribe({
            next: (response: any) => {
                console.log("response >>>", response);
                this.approvedLeaveItem= response.body.info;
                this.approvedLeaveHistories= response.body.histories

            },
            error: (error: any) => {
            }
        })
    }

    ngOnInit(): void {
        this.employeeDeleteItem = this.item;
        console.log("employeeDeleteItem >>>", this.employeeDeleteItem);
        this.openEmployeeLeaveRequestDeleteModal();
        this.getInfo();
    }

    User() {
        return this.userService.User();
    }

    employeeDeleteItem: any;
    openEmployeeLeaveRequestDeleteModal() {
        this.modalService.open(this.employeeLeaveRequestDeleteModal, "lg");
    }

    reasonOfCancel: string="";

    confirmDelete() {
        if(this.reasonOfCancel != null && this.reasonOfCancel.trim() !="" ){
            if(this.reasonOfCancel.length <= 200){
                if(confirm("Are you sure you want to cancel this approved leave request?")){
                    if (Object.keys(this.employeeDeleteItem).length > 0) {
                        let params = {
                            employeeLeaveRequestId: this.employeeDeleteItem.employeeLeaveRequestId,
                            employeeId: this.User().EmployeeId,
                            leaveTypeId: this.employeeDeleteItem.leaveTypeId,
                            remarks: this.reasonOfCancel
                        };
                        this.employeeLeaveRequestService.approvedLeaveCancellation(params).subscribe(response => {
                            var result = response as any;
                            if (result?.status) {
                                this.utilityService.success(result.msg, "Server Response")
                                this.sharedmethodService.callMethod();
                                this.sendEmailNew(response);
                                this.closeModal('delete successful')
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
            }
            else{
                this.utilityService.fail("Please write reason of leave cancellation within 200 character","Site Response",3000);
            }
        }
        else{
            this.utilityService.fail("Please write reason of cancel","Site Response",3000);
        }
        
    }

    sendEmailNew(params: any) {
        this.employeeLeaveRequestService.sendEmailNew(params).subscribe(response => {
            console.log("response >>>", response);
        }, (error) => {
        })
    }

    closeModal(reason: any) {
        this.modalService.service.dismissAll(reason);
        this.closeModalEvent.emit(reason);

    }

}