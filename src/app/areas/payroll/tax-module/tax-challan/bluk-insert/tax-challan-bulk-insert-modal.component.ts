import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { UtilityService } from "src/app/shared/services/utility.service";
import { TaxChallanService } from "../tax-challan.service";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { CustomModalService } from "src/app/shared/services/custom-modal.service";
import { FiscalYearService } from "../../../salary-module/setup/fiscalYear/fiscalYear.service";
import { esLocale } from "ngx-bootstrap/chronos";

@Component({
    'selector': 'app-payroll-tax-challan-bulk-insert-modal',
    templateUrl: './tax-challan-bulk-insert-modal.component.html'
})

export class TaxChallaBlukInsertModalComponent implements OnInit {

    @ViewChild('modal', { static: true }) modal!: ElementRef;
    @Input() month: number = 0;
    @Input() year: number = 0;
    @Input() fiscalYearId: number = 0;
    @Input() salaryProcessId: number = 0;
    
    @Output() closeModalEvent = new EventEmitter<string>();

    modalTitle: string = "";
    constructor(
        private fb: FormBuilder,
        private modalService: CustomModalService,
        private utilityService: UtilityService,
        private taxChallanService: TaxChallanService,
        private fiscalYearService: FiscalYearService,
    ) {

    }
    ngOnInit(): void {
        //console.log("fiscalYearId >>>", this.fiscalYearId);
        //this.count++;
        this.formInit();
        this.openModal();
        //console.log("this.count >>>", this.count);

    }

    openModal() {
        this.modalService.open(this.modal, "lg");
        this.loadFiscalYearDropdown();
    }

    months: any[] = this.utilityService.getMonths();
    years: any[] = this.utilityService.getYears(2);

    count: number = 0;
    isTaxMonthDisabled: boolean = true;
    isTaxYearDisabled: boolean = true;
    isFiscalYearDisabled: boolean = true;

    datePickerConfig: any = this.utilityService.datePickerConfig();

    ddlFiscalYearDropdown: any[] = [];
    fiscalYear: string = "";
    loadFiscalYearDropdown() {
        this.fiscalYearService.loadDropdown();
        this.fiscalYearService.ddl$.subscribe(response => {
            this.ddlFiscalYearDropdown = response;
            let selectedFiscalYear = this.ddlFiscalYearDropdown.find(item => item.id == this.fiscalYearId);
            this.fiscalYear = selectedFiscalYear?.text
        })
    }

    form: FormGroup;
    formInit() {
        this.form = this.fb.group({
            taxMonth: new FormControl(this.month, [Validators.required]),
            taxYear: new FormControl(this.year, [Validators.required]),
            fiscalYearId: new FormControl(this.fiscalYearId, [Validators.required]),
            challanNumber: new FormControl('', [Validators.required, Validators.maxLength(100)]),
            challanDate: new FormControl('', [Validators.required]),
            depositeBank: new FormControl('', [Validators.required, Validators.maxLength(100)]),
            depositeBranch: new FormControl('', [Validators.required, Validators.maxLength(100)]),
            amount: new FormControl(0, [Validators.min(1), Validators.required]),
            salaryProcessId: new FormControl(this.salaryProcessId),
        })

        this.form.valueChanges.subscribe(value => {
            this.logFormErrors();
        })
    }

    formErrors = {
        'taxMonth': '',
        'taxYear': '',
        'fiscalYearId': '',
        'challanNumber': '',
        'challanDate': '',
        'depositeBank': '',
        'depositeBranch': '',
        'amount': '',
    };

    validationMessages = {
        'taxMonth': {
            'required': 'Field is required'
        },
        'taxYear': {
            'required': 'Field is required',
        },
        'fiscalYearId': {
            'required': 'Field is required',
            'min': 'Field is required'
        },
        'challanNumber': {
            'required': 'Field is required',
            'maxLength': 'Challan number character length upto 100 is not allowed'
        },
        'challanDate': {
            'required': 'Field is required'
        },
        'depositeBank': {
            'required': 'Field is required',
            'maxLength': 'Deposite bank character length upto 100 is not allowed'
        },
        'depositeBranch': {
            'required': 'Field is required',
            'maxLength': 'Deposite Bank branch character length upto 100 is not allowed'
        },
        'amount': {
            'min': 'Amount must be > 0',
            'required': 'Amount is required',
        }

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
        if (this.form.valid && this.btnSubmit == false) {
            this.btnSubmit = true; 
            this.taxChallanService.bulkSubmit(this.form.value).subscribe({
                next:(response)=>{
                    this.btnSubmit = false;
                    this.utilityService.success(response.body.msg, "Server Response");
                    this.closeModal(this.utilityService.SaveComplete)
                },
                error:(error)=>{
                    this.btnSubmit = false;
                    if (typeof error.msg === 'object') {
                        this.utilityService.fail(error.msg?.msg, "Server Response");
                    }
                    else {
                        this.utilityService.fail(error.msg, "Server Response");
                    }
                    this.btnSubmit = false;
                }
            })
        }
        else {
            this.btnSubmit = false;
        }
    }

    closeModal(reason: any) {
        if (this.btnSubmit == false) {
            this.closeModalEvent.emit(reason);
            this.modalService.service.dismissAll(reason);
        }
    }




}