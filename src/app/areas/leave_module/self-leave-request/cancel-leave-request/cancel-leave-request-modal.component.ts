import { UserService } from "src/app/shared/services/user.service";
import { UtilityService } from "src/app/shared/services/utility.service";
import { CustomModalService } from "src/app/shared/services/custom-modal.service";
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { EmployeeLeaveRequestService } from "../../employee-leave-request/employee-leave-request.service";
import { SharedmethodService } from "src/app/shared/services/shared-method/sharedmethod.service";
import { NotifyService } from "src/app/shared/services/notify-service/notify.service";
@Component({
    selector: 'leave-module-cancel-leave-request-model',
    templateUrl: './cancel-leave-request-modal.component.html'
})

export class CancelLeaveRequestModalComponent implements OnInit {

    @ViewChild("employeeLeaveRequestDeleteModal", { static: true }) employeeLeaveRequestDeleteModal !: ElementRef;
    @Input() item: any;
    @Output() closeModalEvent = new EventEmitter<string>();
    constructor(
        private utilityService: UtilityService,
        private userService: UserService,
        public modalService: CustomModalService,
        private employeeLeaveRequestService: EmployeeLeaveRequestService,
        private sharedmethodService: SharedmethodService,
        private notifyService: NotifyService
    ) {

    }
    ngOnInit(): void {
        this.employeeDeleteItem = this.item;
        this.openEmployeeLeaveRequestDeleteModal();
    }

    User() {
        return this.userService.User();
    }

    employeeDeleteItem: any;
    openEmployeeLeaveRequestDeleteModal() {
        this.modalService.open(this.employeeLeaveRequestDeleteModal, "sm");
    }

    btnSubmit: boolean = false;
    confirmDelete() {
        if (Object.keys(this.employeeDeleteItem).length > 0 && this.btnSubmit == false) {
            this.btnSubmit = true;
            let params = {
                employeeLeaveRequestId: this.employeeDeleteItem.employeeLeaveRequestId,
                employeeId: this.User().EmployeeId,
                leaveTypeId: this.employeeDeleteItem.leaveTypeId
            };
            this.employeeLeaveRequestService.delete(params).subscribe(response => {
                this.btnSubmit = false;
                var result = response as any;
                if (result?.status) {
                    // this.utilityService.success(result.msg, "Server Response")
                    this.notifyService.showSuccessToast("Leave Cancel Successfull");
                    this.sharedmethodService.callMethod();
                    this.sendEmailNew(response);
                    this.closeModal('delete successful')
                }
                else {
                    // this.utilityService.fail(result.msg, "Server Response")
                    this.notifyService.defaultError();
                }
            }, (error) => {
                this.btnSubmit = false;
                // console.log("error >>>", error);
                // this.utilityService.fail("Something went wrong", "Server Response");
                this.notifyService.handleApiError(error);
            })
        }
    }

    sendEmailNew(params: any) {
        this.employeeLeaveRequestService.sendEmailNew(params).subscribe(response => {
            // console.log("response >>>", response);
        }, (error) => {
        })
    }

    closeModal(reason: any) {
        if (this.btnSubmit == false) {
            this.modalService.service.dismissAll(reason);
            this.closeModalEvent.emit(reason);
        }
    }


}