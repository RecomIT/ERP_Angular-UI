import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { UtilityService } from "src/app/shared/services/utility.service";
import { ConditionalProjectedPaymentService } from "../conditional-projected-payment.service";
import { UserService } from "src/app/shared/services/user.service";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { CustomModalService } from "src/app/shared/services/custom-modal.service";

@Component({
    selector: 'app-payroll-conditional-projected-payment-approval',
    templateUrl: './conditional-projected-payment-approval.component.html'
})

export class ConditionalProjectedPaymentApprovalComponent implements OnInit {

    @Input() id: number = 0;
    @Output() closeModalEvent = new EventEmitter<string>();
    @ViewChild('modal', { static: true }) modal!: ElementRef;
    constructor(
        private service: ConditionalProjectedPaymentService,
        private userService: UserService,
        public utilityService: UtilityService,
        private fb: FormBuilder,
        private modalService: CustomModalService
    ) {
    }

    ngOnInit(): void {
        console.log("id >>>", this.id);
        this.formInit();
        this.getById()
        this.openModal();
    }

    form: FormGroup;
    formInit() {
        this.form = this.fb.group({
            id: new FormControl(this.id, [Validators.min(1)]),
            status: new FormControl('Approved', [Validators.required])
        })
    }

    data: any;
    getById() {
        this.service.getById(this.id).subscribe({
            next: (response) => {
                console.log("response >>>", response);
                this.data = response.body;
            },
            error: (error) => {
                console.log("Error >>>", error);
            }
        })
    }

    openModal() {
        this.modalService.open(this.modal, "lg");
    }

    btnSubmit: boolean = false;
    submit() {
        if (this.id > 0 && this.form.valid) {
            this.btnSubmit = true;
            let params = { id: this.id, status: this.form.get('status').value };
            this.service.approval(params).subscribe({
                next: (response) => {
                    this.btnSubmit = false;
                    if (response?.status) {
                        this.utilityService.success(response.msg, "Server Response");
                        this.closeModal('Save Complete')
                    }
                    else {
                        this.utilityService.fail(response.msg, "Server Response");
                    }
                },
                error: (error) => {
                    this.btnSubmit = false;
                    this.utilityService.fail(error.msg, "Server Response");
                }
            })
        }
        else {
            this.utilityService.fail("Invalid form submission", "Site Response")
        }
    }

    closeModal(reason: any) {
        if (this.btnSubmit == false) {
            this.modalService.service.dismissAll();
            this.closeModalEvent.emit(reason);
        }
    }


}