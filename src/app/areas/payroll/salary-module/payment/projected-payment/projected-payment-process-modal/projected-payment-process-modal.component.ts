import { ProjectedPaymentService } from "../projected-payment.service";
import { UtilityService } from "src/app/shared/services/utility.service";
import { FiscalYearService } from "../../../setup/fiscalYear/fiscalYear.service";
import { CustomModalService } from "src/app/shared/services/custom-modal.service";
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { Component, ElementRef, EventEmitter, OnInit, Output, Input, ViewChild } from "@angular/core";
import { AllowanceNameService } from "../../../allowance/allowance-head/allowance-name.service";
import { EmployeeInfoService } from "src/app/areas/employee_module/employee/employee-info.service";
import { error } from "console";
import { validateVerticalPosition } from "@angular/cdk/overlay";

@Component({
    selector: 'salary-module-projected-payment-process-modal',
    templateUrl: './projected-payment-process-modal.component.html'
})

export class ProjectedPaymentProcessModalComponent implements OnInit {
    @ViewChild('projectedPaymentProcessModal', { static: true }) processPaymentProcessModal !: ElementRef;
    @Output() closeModalEvent = new EventEmitter<string>();

    constructor(
        private fb: FormBuilder,
        private fiscalYearService: FiscalYearService,
        private allowanceNameService: AllowanceNameService,
        private employeeInfoService: EmployeeInfoService,
        private projectedPaymentService: ProjectedPaymentService,
        private utilityService: UtilityService,
        private modalService: CustomModalService) {
    }

    ngOnInit(): void {
        this.searchFormInit();
        this.dataformInit();
        this.loadEmployeeDropdown();
        this.loadFiscalYearDropdown();
        this.loadAllowancesDropdown();
        this.loadPaymentReasons();
    }

    months: any[] = this.utilityService.getMonths();
    years: any[] = this.utilityService.getYearsUp(2);
    datePickerConfig: any = this.utilityService.datePickerConfig();
    ddlPaymentModes: any[] = this.utilityService.getPaymentModes();
    ddlAgents: any[] = this.utilityService.getMobileBankAgents();
    reasons: string[] = ["Eid Ul Fitr", "Eid Ul Adha", "Yearly Bonus", "Half Yearly Bonus", "Durga Puja", "Christmas", "New Year Bonus"];

    currentMonth: any = this.utilityService.currentMonth;
    currentYear: any = this.utilityService.currentYear;

    ddlYears: any = this.utilityService.getYearsUp(2)

    select2Config = this.utilityService.select2Config();
    ddlEmployees: any[];
    loadEmployeeDropdown() {
        this.employeeInfoService.loadDropdownData({});
        this.employeeInfoService.ddl_employee_data$.subscribe(data => {
            this.employeeInfoService.loadDropdown(data);
            this.ddlEmployees = this.employeeInfoService.ddl$;
        }, error => {
            console.error('Error while fetching data:', error);
        });
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
            this.ddlAllowances = data;
        }, (error) => {
            console.log("error  while fetching data >>>", error);
        })
    }


    list_of_reason: any[] = [];
    loadPaymentReasons() {
        this.projectedPaymentService.listOfPaymentReason().subscribe({
            next: (response) => {
                if (response.body.length > 0) {
                    this.list_of_reason = response.body;
                }
                this.utilityService.arrayUnique(this.list_of_reason.concat(this.reasons));
            },
            error: (error) => {
                this.utilityService.arrayUnique(this.list_of_reason.concat(this.reasons));
            }
        })
    }


    searchForm: FormGroup;

    searchFormInit() {
        this.searchForm = this.fb.group({
            employeeId: new FormControl(0),
            allowanceNameId: new FormControl(0),
            fiscalYearId: new FormControl(0, [Validators.min(1)]),
            reason: new FormControl('', [Validators.required, Validators.minLength(200)]),
            payableYear: new FormControl(0),
            showInPayslip: new FormControl(false),
            showInSalarySheet: new FormControl(false),
            paymentMonth: new FormControl(0, [Validators.min(1), Validators.max(12)]),
            paymentYear: new FormControl(0, [Validators.min(2023), Validators.max(2050)]),
            paymentMode: new FormControl('', [Validators.required]),
            withCOC: new FormControl(false)
        });

        this.searchForm.get('employeeId').valueChanges.subscribe(value => {
            setTimeout(() => {
                this.loadData();
            }, 5)
        })

        this.searchForm.get('reason').valueChanges.subscribe(value => {
            setTimeout(() => {
                this.loadData();
            }, 5)
        })

        this.searchForm.get('payableYear').valueChanges.subscribe(value => {
            setTimeout(() => {
                this.loadData();
            }, 5)
        })

        this.searchForm.get('allowanceNameId').valueChanges.subscribe(value => {
            setTimeout(() => {
                this.loadData();
            }, 5)
        })

        this.searchForm.get('fiscalYearId').valueChanges.subscribe(value => {
            setTimeout(() => {
                this.loadData();
            }, 5)
        })

        this.openModal();
    }

    openModal() {
        this.modalService.open(this.processPaymentProcessModal, "xl");
    }

    closeModal(reason: any) {
        this.modalService.service.dismissAll(reason);
        this.closeModalEvent.emit(reason);
    }

    formArray: any;
    dataform: FormGroup;
    dataformInit() {
        this.dataform = this.fb.group({
            paymentInfos: this.fb.array([

            ])
        })
        this.formArray = (<FormArray>this.dataform.get('paymentInfos')).controls;
    }

    bindDataForm(values: any[]) {
        values.forEach(item => {
            this.addButtonClick(item)
        })
    }

    addButtonClick(value: any): void {
        (<FormArray>this.dataform.get('paymentInfos')).push(this.addItem(value));
    }

    remove(index: number) {
        (<FormArray>this.dataform.get('paymentInfos')).removeAt(index);
    }

    removeAll() {
        (<FormArray>this.dataform.get('paymentInfos')).clear();
    }

    addItem(value: any) {
        return this.fb.group({
            projectedAllowanceId: new FormControl(value.projectedAllowanceId),
            projectedAllowanceCode: new FormControl(value.projectedAllowanceCode),
            employeeId: new FormControl(value.employeeId),
            employeeCode: new FormControl(value.employeeCode),
            employeeName: new FormControl(value.employeeName),
            fiscalYearId: new FormControl(value.fiscalYearId),
            fiscalYearRange: new FormControl(value.fiscalYearRange),
            allowanceNameId: new FormControl(value.allowanceNameId),
            allowanceName: new FormControl(value.allowanceName),
            baseOfPayment: new FormControl(value.baseOfPayment),
            percentage: new FormControl(value.percentage),
            amount: new FormControl(value.amount),
            payableAmount: new FormControl(value.payableAmount),
            disbursedAmount: new FormControl(value.disbursedAmount),
        })
    }

    btnSubmit: boolean = false;
    submit() {
        if (this.formArray?.length > 0) {
            let payments = [];
            let info = {
                fiscalYearId: this.searchForm.get("fiscalYearId").value,
                showInPayslip: this.searchForm.get("showInPayslip").value,
                showInSalarySheet: this.searchForm.get("showInSalarySheet").value,
                paymentYear: this.searchForm.get("paymentYear").value,
                paymentMonth: this.searchForm.get("paymentMonth").value,
                withCOC: this.searchForm.get("withCOC").value,
                paymentMode: this.searchForm.get("paymentMode").value,
                reason: this.searchForm.get("reason").value,
            };

            this.formArray.forEach((formGroup: FormGroup) => {
                payments.push({
                    projectedAllowanceId: formGroup.get('projectedAllowanceId').value,
                    projectedAllowanceCode: formGroup.get('projectedAllowanceCode').value,
                    employeeId: formGroup.get('employeeId').value,
                    employeeCode: formGroup.get('employeeCode').value,
                    employeeName: formGroup.get('employeeName').value,
                    fiscalYearId: formGroup.get('fiscalYearId').value,
                    fiscalYearRange: formGroup.get('fiscalYearRange').value,
                    allowanceNameId: formGroup.get('allowanceNameId').value,
                    allowanceName: formGroup.get('allowanceName').value,
                    baseOfPayment: formGroup.get('baseOfPayment').value,
                    percentage: formGroup.get('percentage').value,
                    amount: formGroup.get('amount').value,
                    payableAmount: formGroup.get('payableAmount').value,
                    disbursedAmount: formGroup.get('disbursedAmount').value,
                    allowanceReason: this.searchForm.get("reason").value,
                })
            })

            let model = { info: info, payments: payments };
            this.btnSubmit = true;

            this.projectedPaymentService.process(model).subscribe(response => {
                if (response?.status) {
                    this.utilityService.success(response?.msg, "Server Response");
                    this.closeModal(this.utilityService.SuccessfullySaved);
                }
                else {
                    this.utilityService.fail(response?.msg, "Server Response")
                }
                this.btnSubmit = false;
            }, (error) => {
                this.btnSubmit = false;
                this.utilityService.httpErrorHandler(error);
            })
        }
        else {
            this.utilityService.fail("No item found", "Site Response");
        }
    }

    loadData() {
        this.removeAll();
        let fiscalYearId = this.utilityService.IntTryParse(this.searchForm.get('fiscalYearId').value);
        let allowanceNameId = this.utilityService.IntTryParse(this.searchForm.get('allowanceNameId').value);
        let reason = this.searchForm.get('reason').value;
        let payableYear = this.utilityService.IntTryParse(this.searchForm.get('payableYear').value);

        if (fiscalYearId > 0 && allowanceNameId > 0 && reason != "" && payableYear > 0) {
            let params = { fiscalYearId: fiscalYearId, allowanceNameId: allowanceNameId, reason: reason, payableYear: payableYear };
            this.projectedPaymentService.getEmployeeProjectedPaymentInfosForProcess(params).subscribe(response => {
                console.log("loadData response  >>>", response);
                this.bindDataForm(response.body);
            }, (error) => { this.utilityService.httpErrorHandler(error) })
        }
        else {
            //this.utilityService.fail("Please select fiscal year, allowance, reason, payable month", "Site Response");
        }
    }
}