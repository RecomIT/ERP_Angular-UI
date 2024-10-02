import { FormBuilder } from "@angular/forms";
import { UtilityService } from "src/app/shared/services/utility.service";
import { EmployeeTaxRefundService } from "../employee-tax-refund.service";
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { CustomModalService } from "src/app/shared/services/custom-modal.service";
import { EmployeeAdvancedIncomeTaxSubmissionService } from "../employee-advance-income-tax-submission.service";

@Component({
    selector: 'app-payroll-delete-tax-document',
    templateUrl: './delete-tax-document.component.html'
})

export class DeleteTaxDocumentComponent implements OnInit {

    @Input() id: number = 0;
    @Input() doc_type: string = '';
    @Output() closeModalEvent = new EventEmitter<string>();
    @ViewChild('modal', { static: true }) modal!: ElementRef;
    modalTitle: string = '';

    constructor(
        private utilityService: UtilityService,
        private aitService: EmployeeAdvancedIncomeTaxSubmissionService,
        private refundService: EmployeeTaxRefundService,
        private fb: FormBuilder,
        public modalService: CustomModalService,
    ) {

    }

    ngOnInit(): void {
        //console.log("doc_type >>>", this.doc_type);
        //console.log("id >>>", this.id);
        this.getById();
        this.openModal();

    }

    openModal() {
        this.modalTitle = this.doc_type == "AIT" ? "Delete AIT" : "Delete Tax Refund";
        this.modalService.open(this.modal, "sm");
    }

    itemInDb: any = null;
    getById() {
        if (this.id > 0) {
            if (this.doc_type == 'AIT') {
                this.aitService.getById({ id: this.id }).subscribe({
                    next: (response) => {
                        console.log("delete ait item >>>", response)
                        this.itemInDb = response.body;
                    },
                    error: (error) => {
                        this.utilityService.httpErrorHandler(error);
                    }
                })
            }
            else if (this.doc_type == 'CET') {
                this.refundService.getById({ id: this.id }).subscribe({
                    next: (response) => {
                        console.log("delete cet item >>>", response)
                        this.itemInDb = response.body;
                    },
                    error: (error) => {
                        this.utilityService.httpErrorHandler(error);
                    }
                })
            }
        }
    }

    btnSubmit: boolean = false;

    confirmDelete() {
        if (this.btnSubmit == false && this.id > 0) {
            if (this.doc_type == 'AIT') {
                this.aitService.delete(this.id).subscribe({
                    next: (response) => {
                        this.btnSubmit = false;
                        if (response?.status) {
                            this.utilityService.toastr.success(response?.msg, "Server Response");
                            this.closeModal('Save Complete')
                        }
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
            if (this.doc_type == 'CET') {
                this.refundService.delete(this.id).subscribe({
                    next: (response) => {
                        if (response?.status) {
                            this.utilityService.toastr.success(response?.msg, "Server Response");
                            this.closeModal('Save Complete')
                        }
                        this.btnSubmit = false;
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
            this.utilityService.fail("Invalid form submission", "Site Response")
        }
    }

    closeModal(reason: string) {
        if (this.btnSubmit == false) {
            this.modalService.service.dismissAll(reason);
            this.closeModalEvent.emit(reason); // fire
        }
    }

}