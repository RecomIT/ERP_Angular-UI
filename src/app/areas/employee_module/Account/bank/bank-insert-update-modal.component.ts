import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { UtilityService } from "src/app/shared/services/utility.service";
import { BankService } from "./bank.service";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";

@Component({
    selector: 'employee-module-bank-insert-update-modal',
    templateUrl: './bank-insert-update-modal.component.html'
})

export class BankInsertUpdateModalComponent implements OnInit {

    @Input() id: number = 0;
    @Output() closeModalEvent = new EventEmitter<string>();
    @ViewChild('bankModal', { static: true }) bankModal;
    private modalRef: NgbModalRef;

    modalTitle: string = "Add New Bank";

    constructor(
        private fb: FormBuilder,
        private utilityService: UtilityService,
        private bankService: BankService,
        public modalService: NgbModal) {
    }

    ngOnInit(): void {
        this.formInit();
        this.openModal();
        if (this.id > 0) {
            this.getById();
            this.modalTitle = this.id > 0 ? "Update Bank" : "Add New Bank";
        }
    }

    info: any;
    getById() {
        this.bankService.getById({ bankId: this.id }).subscribe((response) => {
            this.load_value(response);
        }, (error) => {
            this.utilityService.fail("Something went wrong", "Server Wrong");
        })
    }

    bankForm: FormGroup;

    formErrors = {
        'bankName': '',
        'bankCode': ''
    }

    validationMessages = {
        'bankName': {
            'required': 'Field is required',
            'maxlength': 'Max length is 100',
            'minlength': 'Min length is 2'
        },
        'bankCode': {
            'maxlength': 'Max length is 100',
        }
    }
    openModal() {
        this.modalRef = this.modalService.open(this.bankModal, {
            size: "sm",
            backdrop: 'static',
            keyboard: false,
            container: "app-root"
        });
    }


    formInit() {
        this.bankForm = this.fb.group({
            bankId: new FormControl(this.id),
            bankName: new FormControl(this.info?.bankName, [Validators.required, Validators.maxLength(100), Validators.minLength(2)]),
            bankCode: new FormControl(this.info?.bankCode, [Validators.maxLength(100)]),
        })
    }

    load_value(value: any) {
        this.bankForm.get('bankName').setValue(value.bankName);
        this.bankForm.get('bankCode').setValue(value.bankCode);
    }

    logFormErrors(formGroup: FormGroup = this.bankForm) {
        Object.keys(formGroup.controls).forEach((key: string) => {
            const abstractControl = formGroup.get(key);
            this.formErrors[key] = '';
            if (abstractControl && !abstractControl.valid && (abstractControl.touched || abstractControl.dirty)) {
                const messages = this.validationMessages[key];
                for (const errorKey in abstractControl.errors) {
                    this.formErrors[key] += messages[errorKey];
                }
            }
        })
    }

    btnSubmit: boolean = false;
    server_errors: any;
    submit() {
        if (this.bankForm.valid) {
            this.bankService.save(this.bankForm.value).subscribe((reasponse) => {
                if (reasponse.body?.status) {
                    this.utilityService.success(reasponse?.msg, "Server Response");
                    this.closeModal(this.utilityService.SuccessfullySaved);
                }
                else {
                    if (reasponse.body?.msg == "Validation Error") {
                        this.server_errors = JSON.parse(reasponse.body?.errorMsg)
                    }
                    else {
                        this.utilityService.fail(reasponse?.msg, "Server Response");
                    }
                }
            }, (error) => {
                console.log("error >>>", error);
                this.utilityService.fail("Something went wrong");
            })
        }
        else {
            this.utilityService.fail("Invalid Form Submission", "Site Response");
        }
    }

    closeModal(reason: any) {
        this.closeModalEvent.emit(reason);
        this.modalRef.close(reason);
    }
}