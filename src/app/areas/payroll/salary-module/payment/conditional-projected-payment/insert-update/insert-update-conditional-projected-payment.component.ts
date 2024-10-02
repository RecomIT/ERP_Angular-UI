import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { CustomModalService } from "src/app/shared/services/custom-modal.service";
import { UtilityService } from "src/app/shared/services/utility.service";
import { FiscalYearService } from "../../../setup/fiscalYear/fiscalYear.service";
import { AllowanceNameService } from "../../../allowance/allowance-head/allowance-name.service";
import { ConditionalProjectedPaymentService } from "../conditional-projected-payment.service";
import { error } from "console";


@Component({
    selector: 'app-payroll-insert-update-conditional-projected-payment',
    templateUrl: './insert-update-conditional-projected-payment.component.html'

})

export class InsertUpdateConditionalProjectedPaymentComponent implements OnInit {
    @Output() closeModalEvent = new EventEmitter<string>();
    @ViewChild('modal', { static: true }) modal!: ElementRef;
    modalTitle: string = "";

    constructor(
        private fb: FormBuilder,
        private utilityService: UtilityService,
        private modalService: CustomModalService,
        private fiscalYearService: FiscalYearService,
        private allowanceNameService: AllowanceNameService,
        private service: ConditionalProjectedPaymentService
    ) {
    }
    ngOnInit(): void {
        this.formInit();
        this.openModal();
        this.loadFiscalYearDropdown();
        this.loadAllowancesDropdown();
    }

    ddlFiscalYearDropdown: any[] = [];
    loadFiscalYearDropdown() {
        this.fiscalYearService.loadDropdown();
        this.fiscalYearService.ddl$.subscribe(response => {
            this.ddlFiscalYearDropdown = response;
        })
    }

    ddlAllowances: any[] = [];
    loadAllowancesDropdown() {
        this.allowanceNameService.loadAllowanceNameDropdown();
        this.allowanceNameService.ddl$.subscribe(data => {
            console.log("data >>>", data);
            this.ddlAllowances = data;
        }, (error) => {
            console.log("error  while fetching data >>>", error);
        })
    }

    ddlJobtypes: any = this.utilityService.getJobTypes();
    select2Options: any = this.utilityService.select2Config();
    ddlReligion: any = this.utilityService.getReligions();
    ddlYears: any = this.utilityService.getYearsUp(2);


    currentYear: number = parseInt(this.utilityService.currentYear);
    reasons: string[] = ["Eid Ul Fitr", "Eid Ul Adha", "Yearly Bonus", "Half Yearly Bonus", "Durga Puja", "Christmas", "New Year Bonus"];
    baseOfPayments: any = ["Flat", "Basic", "Gross"]

    form: FormGroup;

    formInit() {
        this.form = this.fb.group({
            id: new FormControl(0),
            fiscalYearId: new FormControl(0, [Validators.min(1), Validators.required]),
            allowanceNameId: new FormControl(0, [Validators.min(1), Validators.required]),
            reason: new FormControl('', [Validators.required, Validators.maxLength(150)]),
            payableYear: new FormControl(this.currentYear, [Validators.min(2024), Validators.max(2060)]),
            baseOfPayment: new FormControl('Basic', [Validators.required]),
            percentage: new FormControl(0, [Validators.required, Validators.min(1)]),
            amount: new FormControl(0),
            religion: new FormControl(''),
            jobType: new FormControl(''),
            citizen: new FormControl(''),
            isConfirmationRequired: new FormControl(false)
        })

        this.form.valueChanges.subscribe(value => {
            this.logFormErrors();
        })

        this.form.get('baseOfPayment').valueChanges.subscribe(value => {
            this.form.get('amount').setValue(0);
            this.form.get('percentage').setValue(0);
            if (value == 'Flat') {
                this.form.get('amount').setValidators([Validators.required, Validators.min(1)]);
                this.form.get('amount').updateValueAndValidity();
                this.form.get('percentage').clearValidators();
                this.form.get('percentage').updateValueAndValidity();
            }
            else if (value == 'Gross' || value == 'Basic') {
                this.form.get('percentage').setValidators([Validators.required, Validators.min(1)]);
                this.form.get('percentage').updateValueAndValidity();
                this.form.get('amount').clearValidators();
                this.form.get('amount').updateValueAndValidity();
            }
        })
    }

    formErrors = {
        'fiscalYearId': '',
        'allowanceNameId': '',
        'reason': '',
        'payableYear': '',
        'baseOfPayment': '',
        'percentage': '',
        'amount': '',
        'jobType': ''
    };

    validationMessages = {
        'fiscalYearId': {
            'min': 'Field is required',
            'required': 'Field is required'
        },
        'allowanceNameId': {
            'min': 'Field is required',
            'required': 'Field is required'
        },
        'reason': {
            'required': 'Field is required',
            'maxLength': 'Field max character length is 150'
        },
        'payableYear': {
            'min': 'Field is required',
            'max': 'Year cannot be > 2060'
        },
        'baseOfPayment': {
            'required': 'Field is required'
        },
        'amount': {
            'min': 'Field is required',
            'required': 'Field is required',
        },
        'percentage': {
            'min': 'Field is required',
            'required': 'Field is required',
        },
    }

    logFormErrors(formGroup: FormGroup = this.form): boolean {
        let isValid = true;
        Object.keys(formGroup.controls).forEach((key: string) => {
            const abstractControl = formGroup.get(key);
            this.formErrors[key] = '';
            if (abstractControl && !abstractControl.valid) {
                const messages = this.validationMessages[key];
                for (const errorKey in abstractControl.errors) {
                    this.formErrors[key] += messages[errorKey];
                    isValid = false;
                }
            }
        })
        return isValid;
    }

    btnSubmit: boolean = false;
    submit() {
        if (this.btnSubmit == false && this.form.valid) {
            this.btnSubmit = true;
            this.service.save(this.form.value).subscribe({
                next: (response) => {
                    this.btnSubmit = false;
                    this.utilityService.success(response?.msg, "Server Response");
                    this.closeModal('Save Complete')
                },
                error: (error) => {
                    this.btnSubmit = false;
                    console.log("error >>>", error);
                }
            })
        }
        else {
            this.utilityService.fail("Invalid form submission", "Site Response");
        }
    }

    openModal() {
        this.modalService.open(this.modal, "lg");
    }

    closeModal(reason: any) {
        if (this.btnSubmit == false) {
            this.modalService.service.dismissAll();
            this.closeModalEvent.emit(reason);
        }
    }
}