import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { CustomModalService } from "src/app/shared/services/custom-modal.service";
import { UtilityService } from "src/app/shared/services/utility.service";
import { NotifyService } from "src/app/shared/services/notify-service/notify.service";
import { MonthlyVariableDeductionService } from "../monthly-variable-deduction.service";

@Component({
    selector: 'payroll-module-variable-deduction-delete-modal',
    templateUrl: './variable-deduction-delete-modal.component.html',
})


export class VariableDeductionDeleteModalComponent implements OnInit {
    @Input() item: any;
    @Output() closeModalEvent = new EventEmitter<string>();
    @ViewChild('deleteModal', { static: true }) deleteModal!: ElementRef;
    modalTitle: string = "Delete Pending Deduction";

    constructor(public modalService: CustomModalService, private utilityService: UtilityService, private monthlyVariableDeductionService: MonthlyVariableDeductionService, private notifyService: NotifyService) {

    }
    ngOnInit(): void {
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
        console.log("this.item?.monthlyVariableDeductionId >>>",this.item?.monthlyVariableDeductionId);
        if (this.item?.monthlyVariableDeductionId > 0) {
            this.monthlyVariableDeductionService.delete(this.item?.monthlyVariableDeductionId).subscribe(response => {
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