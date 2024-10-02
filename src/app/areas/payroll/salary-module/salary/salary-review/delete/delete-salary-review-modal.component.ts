import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { CustomModalService } from "src/app/shared/services/custom-modal.service";
import { UtilityService } from "src/app/shared/services/utility.service";
import { SalaryReviewService } from "../salary-review.service";


@Component({
    selector: 'payroll-delete-salary-review-modal',
    templateUrl: './delete-salary-review-modal.component.html'
})

export class DeleteSalaryReviewModalComponent implements OnInit {
    @Input() id: number = 0;
    @Input() employeeId: number = 0;
    @Output() closeModalEvent = new EventEmitter<string>();
    @ViewChild('modal', { static: true }) modal!: ElementRef;
    modalTitle: string = '';

    constructor(
        private utilityService: UtilityService,
        private fb: FormBuilder,
        private salaryReviewService: SalaryReviewService,
        public modalService: CustomModalService,
    ) {

    }

    ngOnInit(): void {
        this.openModal();
        this.get();
    }

    openModal() {
        this.modalTitle = "Delete Salary Review";
        this.modalService.open(this.modal, "lg");
    }


    data: any = null;
    get() {
        if (this.id > 0 && this.employeeId > 0) {
            this.salaryReviewService.getSalaryReviewInfoAndDetails({ salaryReviewInfoId: this.id, employeeId: this.employeeId }).subscribe({
                next: (response) => {
                    this.data = response.body;
                    console.log("response.body >>>", this.data)
                    if (this.data != null) {

                    }
                },
                error: (error) => {
                    this.utilityService.fail('Something went wrong', 'Server Response');
                }
            })
        }
        else {
            this.closeModal("parameter not found")
        }
    }


    btnSubmit: boolean = false;
    confirmDelete() {
        if (this.btnSubmit == false && this.id > 0 && this.data != null && this.data?.salaryReviewInfoId > 0) {
            if (confirm("Are you sure you want to delete?")) {
                this.btnSubmit = true;
                if (this.data.stateStatus == "Pending" || this.data.stateStatus == "Recheck") {
                    this.salaryReviewService.deletePendingReview(this.id).subscribe({
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
                else if (this.data.stateStatus == "Approved") {
                    this.salaryReviewService.deleteApprovedReview(this.id).subscribe({
                        next: (response) => {
                            this.btnSubmit = false;
                            if (response?.status) {
                                this.utilityService.toastr.success(response?.msg, "Server Response");
                                this.closeModal('Delete Complete')
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
                else{
                    this.btnSubmit = false;
                }
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