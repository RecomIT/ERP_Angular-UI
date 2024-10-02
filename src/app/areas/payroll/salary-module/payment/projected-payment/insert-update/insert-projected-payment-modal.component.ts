import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { CustomModalService } from "src/app/shared/services/custom-modal.service";
import { UserService } from "src/app/shared/services/user.service";
import { UtilityService } from "src/app/shared/services/utility.service";
import { ProjectedPaymentService } from "../projected-payment.service";
import { EmployeeInfoService } from "src/app/areas/employee_module/employee/employee-info.service";
import { AllowanceNameService } from "../../../allowance/allowance-head/allowance-name.service";
import { TypeaheadMatch } from "ngx-bootstrap/typeahead";
@Component({
    selector: 'app-payroll-projected-payment-insert-modal',
    templateUrl: './insert-projected-payment-modal.component.html'
})

export class ProjectedPaymentInsertModalComponent implements OnInit {
    @Output() closeModalEvent = new EventEmitter<string>();
    @ViewChild('projectedPaymentModal', { static: true }) projectedPaymentModal!: ElementRef;
    modalTitle: string = "";

    constructor(
        private fb: FormBuilder,
        private userService: UserService,
        public utilityService: UtilityService,
        public modalService: CustomModalService,
        public service: ProjectedPaymentService,
        private employeeInfoService: EmployeeInfoService,
        private allowanceNameService: AllowanceNameService

    ) { }

    ngOnInit(): void {
        this.loadEmployees();
        this.openModal();
    }

    
    ddlAllowances: any[] = []
    loadAllowanceNames() {
        this.allowanceNameService.loadAllowanceNameDropdown();
        this.allowanceNameService.ddl$.subscribe(data => {
            this.ddlAllowances = data;
        })
    }

    currentMonth: number = parseInt(this.utilityService.currentMonth);
    currentYear: number = parseInt(this.utilityService.currentYear);
    baseOfPayments: any = ["Flat", "Basic", "Gross"]

    form: FormGroup;
    formArray: any;
    paymentsArray: any;

    employees: any[] = [];


    formErrors = {
        'allowanceNameId': '',
        'allowanceReason': '',
        'payableYear': '',
        'baseOfPayment': '',
        'selectedEmployees': ''
    };

    validationMessages = {
        'allowanceNameId': {
            'min': 'Field is required',
            'required': 'Field is required'
        },
        'allowanceReason': {
            'required': 'Field is required',
            'maxLength': 'Field max character length is 150'
        },
        'payableYear': {
            'required': 'Field is required'
        },
        'baseOfPayment': {
            'required': 'Field is required'
        },
        'amount': {
            'min': 'Field is required'
        },
        'percentage': {
            'min': 'Field is required'
        },
        'selectedEmployees': {
            'required': 'There is not any selected employee in this form.'
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

    ddlYears: any = this.utilityService.getYearsUp(2);//this.utilityService.getYears(2);
    reasons: string[] = ["Eid Ul Fitr", "Eid Ul Adha", "Yearly Bonus", "Half Yearly Bonus", "Durga Puja", "Christmas", "New Year Bonus"];
    formInit() {
        this.form = this.fb.group({
            allowanceNameId: new FormControl(0, [Validators.min(1)]),
            allowanceReason: new FormControl('', [Validators.required, Validators.maxLength(150)]),
            payableYear: new FormControl(this.currentYear, [Validators.required]),
            baseOfPayment: new FormControl('Flat', [Validators.required]),
            amount: new FormControl(0),
            percentage: new FormControl(0),
            selectEmployee: new FormControl(''),
            selectedEmployees: new FormControl('', [Validators.required]),
        })

        this.form.valueChanges.subscribe(value => {
            this.logFormErrors();
        })

        this.form.get('baseOfPayment').valueChanges.subscribe(value => {
            if (this.employeesList != null && this.employeesList.length > 0) {
                this.employeesList.forEach((item, index) => {
                    item.amount = 0;
                    item.percentage = 0;
                    item.base = value
                })
            }
            this.form.get('amount').setValue(0);
            this.form.get('percentage').setValue(0);
        })

        this.form.get('amount').valueChanges.subscribe(value => {
            if (this.employeesList != null && this.employeesList.length > 0) {
                this.employeesList.forEach((item, index) => {
                    item.amount = this.utilityService.FloatTryParse(value);
                    item.percentage = 0;
                    item.isValid = item.amount > 0 ? true : false;
                })
            }
        })

        this.form.get('percentage').valueChanges.subscribe(value => {
            if (this.employeesList != null && this.employeesList.length > 0) {
                this.employeesList.forEach((item, index) => {
                    item.amount = 0;
                    item.percentage = this.utilityService.FloatTryParse(value);
                    item.isValid = item.percentage > 0 ? true : false;
                })
            }
        })
    }


    rowChanged(index: number) {
        let amount = this.utilityService.FloatTryParse(this.employeesList[index].amount);
        let percentage = this.utilityService.FloatTryParse(this.employeesList[index].percentage);

        this.employeesList[index].amount = amount;
        this.employeesList[index].percentage = percentage;

        this.employeesList[index].isValid = amount == 0 && percentage == 0 ? false : true;
    }

    employeeOnSelect(e: TypeaheadMatch) {
        var isEmployee = null;
        if (this.employeesList.length > 0) {
            isEmployee = this.employeesList.find(s => s.id == e.item.id);
        }
        if (isEmployee != null) {
            this.utilityService.fail("You have already selected this employee", "Site Response");
        }
        else {
            let amountInForm = this.utilityService.FloatTryParse(this.form.get('amount').value);
            let percentageInForm = this.utilityService.FloatTryParse(this.form.get('percentage').value);
            let isValid = (amountInForm == 0 && percentageInForm == 0 ? false : true);
            this.employeesList.push({
                id: e.item.id,
                text: e.item.text,
                code: e.item.code,
                base: this.form.get('baseOfPayment').value,
                designation: e.item.designation,
                isValid: isValid,
                amount: this.utilityService.FloatTryParse(this.form.get('amount').value),
                percentage: this.utilityService.FloatTryParse(this.form.get('percentage').value)
            })
        }
        this.getSelectedEmployees();
    }

    getSelectedEmployees() {
        this.form.get("selectEmployee").setValue("");
        this.form.get("selectedEmployees").setValue("");
        let employees = "";
        this.employeesList.forEach(item => {
            employees += item.id + ","
        });
        this.form.get("selectedEmployees").setValue(employees)
    }

    deleteEmployee(id: any) {
        const index = this.employeesList.findIndex(s => s.id == id);
        if (index > -1) {
            this.employeesList.splice(index, 1);
        }
        let employees = "";
        this.employeesList.forEach(item => {
            employees += item.id + ","
        });
        this.form.get("selectedEmployees").setValue(employees)
    }


    btnSubmit: boolean = false;

    submit() {
        if (this.form.valid && this.employeesList.length > 0 && this.btnSubmit == false) {
            this.btnSubmit = true;
            let payments: any = [];

            this.employeesList.forEach((item, index) => {
                payments.push({
                    projectedAllowanceId: 0,
                    employeeId: item.id,
                    employeeCode: item.code,
                    fiscalYearId: 0,
                    payableYear: this.utilityService.IntTryParse(this.form.get('payableYear').value),
                    allowanceNameId: this.utilityService.IntTryParse(this.form.get('allowanceNameId').value),
                    allowanceReason: this.form.get('allowanceReason').value,
                    baseOfPayment: this.form.get('baseOfPayment').value,
                    percentage: this.form.get('percentage').value,
                    amount: this.form.get('amount').value,
                    stateStatus: 'Pending',
                })
            })

            this.service.saveBulk(payments).subscribe({
                next: (response) => {
                    this.btnSubmit = false;
                    this.utilityService.success(response.body.msg, "Server Response");
                    this.closeModal(this.utilityService.SaveComplete)
                },
                error: (error) => {
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
            this.utilityService.fail("Invalid form submission", "Site Response", 1000);
        }
    }

    select2Options = this.utilityService.select2Config();
    employeesList: any[] = [];

    logger(msg: any, options: any) {
        this.utilityService.consoleLog(msg, options);
    }

    User() {
        return this.userService.User();
    }

    ddlMonths: any = this.utilityService.getMonths();

    openModal() {
        this.formInit();
        this.modalTitle = "Add Projected Payment"
        this.modalService.open(this.projectedPaymentModal, "lg");
        this.loadAllowanceNames();
    }

    ddlEmployees: any[] = [];
    loadEmployees() {
        this.employeeInfoService.loadDropdownData({});
        this.employeeInfoService.ddl_employee_data$.subscribe(data => {
            this.employeeInfoService.loadDropdown(data);
            this.ddlEmployees = this.employeeInfoService.ddl$;
        }, error => {
            console.error('Error while fetching data:', error);
        });
    }

    closeModal(reason: any) {
        if (this.btnSubmit == false) {
            this.modalService.service.dismissAll(reason);
            this.closeModalEvent.emit(reason);
        }
        else {
            this.utilityService.fail("Something is running in this page, So You can not close this page now", "Site Response")
        }
    }



}