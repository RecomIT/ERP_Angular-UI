import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { CustomModalService } from "src/app/shared/services/custom-modal.service";
import { UtilityService } from "src/app/shared/services/utility.service";
import { SupplementaryAmountService } from "../supplementary-amount/supplementary-amount.service";
import { SupplementaryProcessService } from "../supplementary-process-info/supplementary-process.service";

@Component({
    selector: 'app-payroll-update-supplementary-amount-modal',
    templateUrl: './update-supplementary-amount-modal.component.html'
})

export class UpdateSupplementaryAmountModalComponent implements OnInit {
    @Input() paymentAmountId: number = 0;
    @Output() closeModalEvent = new EventEmitter<string>();
    @ViewChild('modal', { static: true }) modal!: ElementRef;

    constructor(
        private fb: FormBuilder,
        public utilityService: UtilityService,
        public modalService: CustomModalService,
        private supplementaryAmountService: SupplementaryAmountService,
        private service: SupplementaryProcessService
    ) {

    }

    ngOnInit(): void {
        this.formInit();
        this.get();
        this.openModal();
    }

    openModal() {
        this.modalService.open(this.modal, "lg");
    }

    get() {
        this.supplementaryAmountService.getById({ paymentAmountId: this.paymentAmountId }).subscribe({
            next: (response) => {
                console.log("data init", response.body);
                this.dataInit(response.body)
            },
            error: (error) => {

            }
        })
    }

    currentMonth: any;
    currentYear: any;

    form: FormGroup;
    formInit() {
        this.form = this.fb.group({
            paymentAmountId: new FormControl(this.paymentAmountId, [Validators.min(1)]),
            allowanceNameId: new FormControl(0),
            allowanceName: new FormControl(''),
            employeeId: new FormControl(0),
            employeeCode: new FormControl(''),
            employeeName: new FormControl(''),
            designation: new FormControl(''),
            paymentMonth: new FormControl(''),
            paymentYear: new FormControl(0),
            baseOfPayment: new FormControl(''),
            amount: new FormControl(0, [Validators.min(1)]),
            percentage: new FormControl(0),
            onceOffAmount: new FormControl(0),
            taxAmount: new FormControl(0),
            disbursedAmount: new FormControl(0)
        })
    }

    dataInit(data: any) {
        this.form.get('allowanceNameId').setValue(data.allowanceNameId);
        this.form.get('allowanceName').setValue(data.allowanceName);
        this.form.get('employeeId').setValue(data.employeeId);
        this.form.get('employeeCode').setValue(data.employeeCode);
        this.form.get('employeeName').setValue(data.employeeName);
        this.form.get('designation').setValue(data.designation);
        this.form.get('paymentMonth').setValue(data.paymentMonth);
        this.form.get('paymentYear').setValue(data.paymentYear);
        this.form.get('baseOfPayment').setValue(data.baseOfPayment);
        this.form.get('amount').setValue(data.amount);
        this.form.get('percentage').setValue(data.percentage);
        this.form.get('onceOffAmount').setValue(data.onceOffAmount);
        this.form.get('taxAmount').setValue(data.taxAmount);
        this.form.get('disbursedAmount').setValue(data.disbursedAmount);

        this.currentMonth = this.utilityService.getMonthNameFull(data.paymentMonth);
        this.currentYear = data.paymentYear;
    }

    btnSubmit: boolean = false;
    submit() {
        if (this.form.valid) {
            this.btnSubmit  = true;
            this.service.updatePaymentAmount(this.form.value).subscribe({
                next: (response) => {
                    this.btnSubmit  = false;
                    if(response?.status){
                        this.utilityService.success(response?.msg,"Server Response");
                        this.closeModal('Save Complete')
                    }
                    else{
                        this.utilityService.fail(response?.msg,"Server Response");
                    }
                },
                error: (error) => {
                    this.btnSubmit  = false;
                    this.utilityService.fail(error?.msg,"Server Response");
                }
            })
        }
        else {
            this.utilityService.fail("Invalid form submission", "Site Response");
        }
    }

    closeModal(event: any) {
        if(this.btnSubmit == false){
            this.modalService.service.dismissAll();
            this.closeModalEvent.emit(event);
        }
    }

}