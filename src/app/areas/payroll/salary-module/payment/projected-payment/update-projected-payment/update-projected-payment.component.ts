import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { ProjectedPaymentService } from "../projected-payment.service";
import { UtilityService } from "src/app/shared/services/utility.service";
import { CustomModalService } from "src/app/shared/services/custom-modal.service";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { EmployeeInfoService } from "src/app/areas/employee_module/employee/employee-info.service";
import { AllowanceNameService } from "../../../allowance/allowance-head/allowance-name.service";

@Component({
    selector: 'app-payroll-update-projected-payment',
    templateUrl: './update-projected-payment.component.html'
})

export class UpdateProjectedPaymentComponent implements OnInit {

    @Input() id: number = 0;
    @Output() closeModalEvent = new EventEmitter<string>();
    @ViewChild('modal', { static: true }) modal!: ElementRef;

    constructor(
        private service: ProjectedPaymentService,
        private utilityService: UtilityService,
        private modalService: CustomModalService,
        private fb: FormBuilder,
        private employeeInfoService: EmployeeInfoService,
        private allowanceNameService: AllowanceNameService
    ) {

    }
    ngOnInit(): void {
        this.openModal();
        this.formInit();
        this.getById();
        this.loadAllowanceNames();
        this.loadEmployees();
    }

    select2Options = this.utilityService.select2Config();

    openModal() {
        this.modalService.open(this.modal, "lg")
    }

    baseOfPayments: any = ["Flat", "Basic", "Gross"]

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

    ddlAllowances: any[] = []
    loadAllowanceNames() {
        this.allowanceNameService.loadAllowanceNameDropdown();
        this.allowanceNameService.ddl$.subscribe(data => {
            this.ddlAllowances = data;
        })
    }

    formErrors = {
        'allowanceNameId': '',
        'allowanceReason': '',
        'payableYear': '',
        'baseOfPayment': '',
        'employeeId': '',
        'amount': '',
        'percentage': ''
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
            'min': 'Field is required',
            'required': 'Field is required'
        },
        'percentage': {
            'min': 'Field is required',
            'required': 'Field is required'
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

    itemInDb: any;
    getById() {
        this.service.getProjectedAllowanceById(this.id).subscribe({
            next: (response) => {
                this.itemInDb = response.body;
                this.dataInit(this.itemInDb);
                // console.log("response.body >>>", response.body);
            },
            error: (error) => {
                this.utilityService.fail(error.msg, "Server Response");
            }
        })
    }

    ddlYears: any = this.utilityService.getYearsUp(2);
    reasons: string[] = ["Eid Ul Fitr", "Eid Ul Adha", "Yearly Bonus", "Half Yearly Bonus", "Durga Puja", "Christmas", "New Year Bonus"];

    form: FormGroup;
    formInit() {
        this.form = this.fb.group({
            projectedAllowanceId: new FormControl(this.id),
            allowanceNameId: new FormControl(0, [Validators.min(1)]),
            allowanceReason: new FormControl('', [Validators.required, Validators.maxLength(150)]),
            payableYear: new FormControl([Validators.required]),
            baseOfPayment: new FormControl([Validators.required]),
            amount: new FormControl(0),
            percentage: new FormControl(0),
            employeeId: new FormControl(0, [Validators.required, Validators.min(1)]),
        })

        this.form.get('baseOfPayment').valueChanges.subscribe({
            next: (value) => {
                this.form.get('amount').setValue(0);
                this.form.get('amount').clearValidators();
                this.form.get('amount').updateValueAndValidity();

                this.form.get('percentage').setValue(0);
                this.form.get('percentage').clearValidators()
                this.form.get('percentage').updateValueAndValidity();


                if (value == "Flat") {
                    this.form.get('amount').setValidators([Validators.min(1), Validators.required]);
                    this.form.get('amount').updateValueAndValidity();
                }
                if (value == "Gross") {
                    this.form.get('percentage').setValidators([Validators.min(1), Validators.required]);
                    this.form.get('percentage').updateValueAndValidity();
                }
                if (value == "Basic") {
                    this.form.get('percentage').setValidators([Validators.min(1), Validators.required]);
                    this.form.get('percentage').updateValueAndValidity();
                }
            }
        })
    }

    dataInit(data: any) {
        this.form.get('allowanceNameId').setValue(data?.allowanceNameId);
        this.form.get('allowanceReason').setValue(data?.allowanceReason);
        this.form.get('payableYear').setValue(data?.payableYear);
        this.form.get('baseOfPayment').setValue(data?.baseOfPayment);
        this.form.get('amount').setValue(data?.amount);
        this.form.get('percentage').setValue(data?.percentage);
        this.form.get('employeeId').setValue(data?.employeeId);
    }

    btnSubmit: boolean = false;

    submit() {
        if (this.form.valid && this.btnSubmit == false) {
            this.btnSubmit = true;
            this.service.UpdateProjectedPayment(this.form.value).subscribe({
                next: (response) => {
                    this.btnSubmit = false;
                    this.utilityService.success(response.body.msg, "Server Response");
                    this.closeModal(this.utilityService.SaveComplete)
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
        else {
            this.utilityService.fail("Invalid form submission", "Site Response");
        }
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