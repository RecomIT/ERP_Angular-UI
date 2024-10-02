import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { CustomModalService } from "src/app/shared/services/custom-modal.service";
import { UserService } from "src/app/shared/services/user.service";
import { UtilityService } from "src/app/shared/services/utility.service";
import { EmploymentPromotionSerivce } from "../employee-promotion.service";


@Component({
    selector: 'app-employee-module-promotion-delete-modal',
    templateUrl: './employee-promotion-delete-modal.component.html'
})
export class EmployeePromotionDeleteModalComponent implements OnInit {

    @Input() item: any;
    @Input() id: number = 0;
    @Input() employeeId: number = 0;
    @ViewChild('deleteModal', { static: true }) deleteModal: ElementRef;
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
        this.modalService.open(this.deleteModal, "sm");
    }

    submit() {
        if (this.id > 0 && this.employeeId > 0) {
            if (confirm("Are you sure you want to delete")) {
                this.employmentPromotionSerivce.delete({employeeId: this.employeeId, proposalId: this.id}).subscribe({
                    next:(response)=>{
                        if(response?.status){
                            this.utilityService.success(response?.msg,"Server Response")
                        }
                        else{
                            this.utilityService.fail(response?.msg,"Server Response")
                        }
                    },
                    error:(error)=>{
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