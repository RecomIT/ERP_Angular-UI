import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { CustomModalService } from "src/app/shared/services/custom-modal.service";
import { UserService } from "src/app/shared/services/user.service";
import { UtilityService } from "src/app/shared/services/utility.service";
import { EmploymentPromotionSerivce } from "../employee-promotion.service";


@Component({
    selector: 'app-employee-module-promotion-approval-modal',
    templateUrl: './employee-promotion-approval-modal.component.html'
})
export class EmployeePromotionApprovalModalComponent implements OnInit {

    @Input() item: any;
    @Input() id: number = 0;
    @Input() employeeId: number = 0;
    @ViewChild('approvalModal', { static: true }) approvalModal: ElementRef;
    @Output() closeModalEvent = new EventEmitter<string>();

    constructor(
        private userService: UserService,
        public utilityService: UtilityService,
        public modalService: CustomModalService,
        private employmentPromotionSerivce: EmploymentPromotionSerivce,
    ) {
    }

    ngOnInit(): void {
        this.openModal();
    }

    openModal() {
        this.modalService.open(this.approvalModal, "sm");
    }

    btnSubmit: boolean=false;

    submit() {
        if (this.id > 0 && this.employeeId > 0 && this.btnSubmit == false) {
            if (confirm("Are you sure you want to approve?")) {
                this.btnSubmit = true;
                this.employmentPromotionSerivce.approval({employeeId: this.employeeId, id: this.id}).subscribe({
                    next:(response)=>{
                        if(response?.status){
                            this.utilityService.success(response?.msg,"Server Response")
                        }
                        else{
                            this.utilityService.fail(response?.msg,"Server Response")
                        }
                        this.btnSubmit = false;
                        this.closeModal(this.utilityService.SuccessfullySaved);
                    },
                    error:(error)=>{
                        this.btnSubmit = false;
                    }
                })
            }
        }
    }

    closeModal(reason: string) {
        this.modalService.service.dismissAll(reason);
        this.closeModalEvent.emit(reason); // fair
    }
}