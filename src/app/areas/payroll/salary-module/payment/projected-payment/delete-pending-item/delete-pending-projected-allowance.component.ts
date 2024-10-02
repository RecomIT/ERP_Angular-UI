import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { ProjectedPaymentService } from "../projected-payment.service";
import { UtilityService } from "src/app/shared/services/utility.service";
import { CustomModalService } from "src/app/shared/services/custom-modal.service";

@Component({
    selector: 'app-payroll-delete-pending-projected-allowance',
    templateUrl: './delete-pending-projected-allowance.component.html'
})

export class DeletePendingProjectedAllowanceComponent implements OnInit {
    @Input() id: number = 0;
    @Output() closeModalEvent = new EventEmitter<string>();
    @ViewChild('modal', { static: true }) modal!: ElementRef;

    constructor(
        private service: ProjectedPaymentService,
        private utilityService: UtilityService,
        private modalService: CustomModalService
    ) {

    }
    ngOnInit(): void {
        this.getById();
        if (this.id > 0) {
            this.openModal();
        }
    }

    openModal() {
        this.modalService.open(this.modal, "lg")
    }

    itemInDb: any;
    getById() {
        this.service.getProjectedAllowanceById(this.id).subscribe({
            next: (response) => {
                this.itemInDb = response.body;
                console.log("delete item response.body >>>", response.body);
            },
            error: (error) => {
                this.utilityService.fail(error.msg, "Server Response");
            }
        })
    }

    btnSubmit: boolean = false;

    confirmDelete() {
        if (this.id > 0 && this.btnSubmit == false) {
            if (confirm("Are you sure you want to delete this item?")) {
                this.btnSubmit = true;
                this.service.deletePendingAllowance({ id: this.id }).subscribe({
                    next: (response) => {
                        this.btnSubmit = false;
                        this.utilityService.success(response.body.msg, "Server Response");
                        this.closeModal(this.utilityService.SaveComplete)
                    },
                    error: (error) => {
                        this.btnSubmit = false;
                        if (typeof error.msg === 'object') {
                            this.utilityService.fail(error.msg?.msg, "Server Response");
                        }
                        else {
                            this.utilityService.fail(error.msg, "Server Response");
                        }
                    }
                })
            }
        }
        else {
            this.utilityService.fail("Item not found to processing delete operation", "Site Response");
        }
    }

    closeModal(reason: any) {
        if (this.btnSubmit == false) {
            this.modalService.service.dismissAll(reason);
            this.closeModalEvent.emit(reason);
        }
        else {
            this.utilityService.fail("Something is running in this page, So You can not close this page now", "Site Response")
        }
    }
}