import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { CustomModalService } from "src/app/shared/services/custom-modal.service";
import { UserService } from "src/app/shared/services/user.service";
import { UtilityService } from "src/app/shared/services/utility.service";
import { MonthlyVariableAllowanceService } from "../monthly-variable-allowance.service";
import { NotifyService } from "src/app/shared/services/notify-service/notify.service";

@Component({
    selector: 'payroll-mmodule-variable-allowance-delete-modal',
    templateUrl: './variable-allowance-delete-modal.component.html',
})


export class VariableAllowanceDeleteModalComponent implements OnInit {
    @Input() item: any;
    @Output() closeModalEvent = new EventEmitter<string>();
    @ViewChild('deleteModal', { static: true }) deleteModal!: ElementRef;
    modalTitle: string = "Delete Pending Allowance";

    constructor(public modalService: CustomModalService, private utilityService: UtilityService, private monthlyVariableAllowanceService: MonthlyVariableAllowanceService, private notifyService: NotifyService) {

    }
    ngOnInit(): void {
        console.log("item >>> ", this.item);
        this.openModal();
    }

    salaryMonth: string;

    openModal() {
        this.salaryMonth = this.utilityService.getMonthName(this.item?.salaryMonth);
        this.modalService.open(this.deleteModal, 'sm');

    }

    closeModal(reason: any) {
        this.modalService.service.dismissAll(reason);
        this.closeModalEvent.emit(reason);
    }

    confirmDelete() {
        if (this.item?.monthlyVariableAllowanceId > 0) {
            this.monthlyVariableAllowanceService.delete(this.item?.monthlyVariableAllowanceId).subscribe(response => {
                if (response?.status == true) {
                    this.notifyService.DeleteSuccess();
                    this.closeModal('Delete Complete')
                }
                else {
                    this.utilityService.fail("Data has been failed to delete");
                }
            }, (error) => {
                this.notifyService.handleApiError(error);
            })
        }
        else {
            this.utilityService.fail("Invalid form submission", "Site Response");
        }

    }
}