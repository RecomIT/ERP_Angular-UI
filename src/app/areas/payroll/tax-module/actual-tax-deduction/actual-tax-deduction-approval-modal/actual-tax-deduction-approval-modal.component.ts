import { DatePipe } from "@angular/common";
import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { BsDatepickerConfig } from "ngx-bootstrap/datepicker";
import { CustomModalService } from "src/app/shared/services/custom-modal.service";
import { HrWebService } from "src/app/shared/services/hr-web.service";
import { UtilityService } from "src/app/shared/services/utility.service";
import { ActualTaxDeductionService } from "../actual-tax-deduction.component.service";
import { startWith } from "rxjs/operators";

@Component({
    selector: 'app-payroll-actual-tax-deduction-approval-modal',
    templateUrl: './actual-tax-deduction-approval-modal.component.html'
})

export class ActualTaxDeductionApprovalModalComponent implements OnInit {

    datePickerConfig: Partial<BsDatepickerConfig> = {};
    @Output() closeModalEvent = new EventEmitter<string>();
    @ViewChild('actualTaxDeductionApprovalModal', { static: true }) actualTaxDeductionApprovalModal!: ElementRef;
    modalTitle: string = "Salary Hold Modal";

    ngOnInit(): void {
        this.datePickerConfig = Object.assign({}, {
            containerClass: "theme-dark-blue",
            showWeekNumbers: false,
            dateInputFormat: "DD-MMMM-YYYY",
            isAnimated: true,
            showClearButton: false,
            showTodayButton: false,
            todayPosition: "left",
            rangeInputFormat: "DD-MMM-YYYY",
            rangeSeparator: " ~ ",
            size: "sm",
            customTodayClass: 'custom-today-class'
        })
        this.approvalFormInit();
    }

    constructor(private fb: FormBuilder,
        public utilityService: UtilityService,
        public modalService: CustomModalService,
        private hrService: HrWebService,
        private datePipe: DatePipe,
        private componentService: ActualTaxDeductionService,
        private cd: ChangeDetectorRef) { }

    approvalForm: FormGroup;
    months: any[] = this.utilityService.getMonths();
    years: any[] = this.utilityService.getYears(2);

    openModal() {
        this.modalService.open(this.actualTaxDeductionApprovalModal, "lg")
    }

    closeModal(reason: any) {
        this.modalService.service.dismissAll(reason);
        this.closeModalEvent.emit(reason);
    }

    approvalFormInit() {
        this.approvalForm = this.fb.group({
            salaryMonth: new FormControl(0, [Validators.min(1), Validators.max(12),]),
            salaryYear: new FormControl(0, [Validators.min(2018), Validators.max(2050)]),
            stateStatus: new FormControl('Approved'),
            employees: new FormControl([])
        })

        this.approvalForm.get('salaryMonth').valueChanges.subscribe(value => {
            setTimeout(() => {
                this.getTaxDeductionInfos();
            }, 50);
        });

        this.approvalForm.get('salaryYear').valueChanges.subscribe(value => {
            setTimeout(() => {
                this.getTaxDeductionInfos();
            }, 50);
        })
        this.openModal();
    }

    list: any[] = [];
    getTaxDeductionInfos() {
        if (this.approvalForm.valid) {
            let formObj = Object.assign({}, this.approvalForm.value);
            let params = { salaryMonth: formObj.salaryMonth, salaryYear: formObj.salaryYear, stateStatus: "Pending" };
            this.approvalForm.get('employees').setValue([]);
            this.componentService.getActualTaxDeductionInfos(params).subscribe(
                response => {
                    this.list = response;
                    let items = this.list.map(({ actualTaxDeductionId, employeeId, actualTaxAmount }) => ({ actualTaxDeductionId, employeeId, actualTaxAmount }));
                    this.approvalForm.get('employees').setValue(items);
                },
                error => {
                    this.utilityService.fail("Something went wrong", "Server Response");
                })
        }
    }

    submit() {
        if (this.approvalForm.valid) {
            this.componentService.saveActualTaxApproval(this.approvalForm.value).subscribe(
                response => {
                    console.log("response >>>", response);
                    if (response?.approvalState?.status) {
                        console.log("response?.status >>>", response?.status);
                        this.closeModal('Save Successful')
                        this.utilityService.success(response?.approvalState?.msg, "Server Response")
                    }
                }, error => {
                    this.utilityService.fail("Something went wrong", "Server Response");
                })
        }
        else {
            this.utilityService.fail("Invalid Form Submission", "Site Response");
        }
    }

}