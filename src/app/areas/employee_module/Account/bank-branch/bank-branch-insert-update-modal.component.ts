import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { UtilityService } from "src/app/shared/services/utility.service";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { BankBranchService } from "./bank-branch.service";
import { BankService } from "../bank/bank.service";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";

@Component({
    selector: 'employee-module-bank-branch-insert-update-modal',
    templateUrl: './bank-branch-insert-update-modal.component.html'
})

export class BankBranchInsertUpdateModalComponent implements OnInit {

    @Input() id: number = 0;
    @Output() closeModalEvent = new EventEmitter<string>();
    @ViewChild('bankBranchModal', { static: true }) bankBranchModal;
    private modalRef: NgbModalRef;

    modalTitle: string = "Add New Bank";

    constructor(
        private fb: FormBuilder,
        private utilityService: UtilityService,
        private bankBranchService: BankBranchService,
        private bankService: BankService,
        public modalService: NgbModal) {
    }

    ngOnInit(): void {
        this.formInit();
        this.openModal();
        this.loadDropdown();
        if (this.id > 0) {
            this.getById();
            this.modalTitle = this.id > 0 ? "Update Bank Branch" : "Add New Bank Branch";
        }
    }

    info: any;
    getById() {
        this.bankBranchService.getById({ bankId: this.id }).subscribe((response) => {
            this.load_value(response);
        }, (error) => {
            this.utilityService.fail("Something went wrong", "Server Wrong");
        })
    }

    ddlBank: any;
    loadDropdown() {
        this.bankService.loadBankDropdown();
        this.ddlBank = this.bankService.ddl$;
    }

    bankBranchForm: FormGroup;

    formErrors = {
        'bankBranchName': '',
        'bankBranchCode': '',
        'bankId': '',
        'routingNumber': ''
    }

    validationMessages = {
        'bankBranchName': {
            'required': 'Field is required',
            'maxlength': 'Max length is 100',
            'minlength': 'Min length is 2'
        },
        'bankId': {
            'min': 'Field is required'
        },
        'routingNumber': {
            'maxlength': 'Max length is 100',
        }
    }
    openModal() {
        this.modalRef = this.modalService.open(this.bankBranchModal, {
            size: "sm",
            backdrop: 'static',
            keyboard: false,
            container: "app-root"
        });
    }


    formInit() {
        this.bankBranchForm = this.fb.group({
            bankBranchId: new FormControl(this.id ?? 0),
            bankBranchName: new FormControl(this.info?.bankName, [Validators.required, Validators.maxLength(100), Validators.minLength(2)]),
            bankBranchCode: new FormControl(this.info?.bankCode),
            bankId: new FormControl(0, [Validators.min(1)]),
            routingNumber: new FormControl('', [Validators.maxLength(100)]),
        })
    }

    load_value(value: any) {
        this.bankBranchForm.get('bankBranchId').setValue(value.bankBranchId);
        this.bankBranchForm.get('bankBranchName').setValue(value.bankBranchName);
        this.bankBranchForm.get('bankId').setValue(value.bankId);
        this.bankBranchForm.get('routingNumber').setValue(value.routingNumber);
    }

    logFormErrors(formGroup: FormGroup = this.bankBranchForm) {
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
        if (this.bankBranchForm.valid) {
            this.bankBranchService.save(this.bankBranchForm.value).subscribe((reasponse) => {
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