import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { BsDatepickerConfig } from "ngx-bootstrap/datepicker";
import { CustomModalService } from "src/app/shared/services/custom-modal.service";
import { UtilityService } from "src/app/shared/services/utility.service";
import { EmployeeSalaryHoldService } from "../employee-salary-hold.service";
import { DatePipe } from "@angular/common";
import { EmployeeInfoService } from "src/app/areas/employee_module/employee/employee-info.service";

@Component({
    selector: 'app-payroll-employee-salary-hold-modal',
    templateUrl: './employee-salary-hold-modal.component.html'
})

export class EmployeeSalaryHoldModalComponent implements OnInit {
    @Input() id: number = 0;
    @ViewChild('employeeSalaryHoldModal', { static: true }) employeeSalaryHoldModal!: ElementRef;
    modalTitle: string = "Salary Hold Modal";
    datePickerConfig: Partial<BsDatepickerConfig> = this.utilityService.datePickerConfig();

    @Output() closeModalEvent = new EventEmitter<string>();

    ngOnInit(): void {
        this.loadEmployees();
        this.salaryHoldFormInit();
        if (this.id > 0) {
            this.getSalaryHoldById();
        }
    }

    constructor(private fb: FormBuilder,
        public utilityService: UtilityService,
        public modalService: CustomModalService,
        private datePipe: DatePipe,
        private employeeInfoService : EmployeeInfoService,
        private employeeSalaryHoldService: EmployeeSalaryHoldService) { }

    months: any[] = this.utilityService.getMonths();
    years: any[] = this.utilityService.getYears(2);
    holdReasons: any[] = this.utilityService.getHoldReasons();


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

    select2Options = this.utilityService.select2Config();

    salaryHoldForm: FormGroup;

    validationMessages = {
        'employeeId': {
            'required': 'Employee is required'
        },
        'month': {
            'min': 'Month is required',
            'max': 'Month cannot be greater then 12'
        },
        'year': {
            'min': 'Year is required',
            'max': 'Year cannot be greater then 2050'
        },
        'holdReason': {
            'required': 'Reason is required',
            'maxLength': 'Max length is 200'
        },
        'holdDates': {
            'required': 'Hold date is required'
        },
        'holdFrom': {
            'required': 'Hold from date is required'
        },
        'holdTo': {
            'required': 'Hold to date is required'
        }
    };

    formErrors = {
        'employeeId': '',
        'month': '',
        'year': '',
        'holdReason': '',
        'holdFrom': '',
        'holdTo': ''
    }

    salaryHoldFormInit() {
        this.salaryHoldForm = this.fb.group({
            salaryHoldId: new FormControl(0),
            employeeId: new FormControl('', [Validators.required]),
            month: new FormControl(0, [Validators.min(1), Validators.max(12)]),
            year: new FormControl(0, [Validators.min(2018), Validators.max(2060)]),
            holdReason: new FormControl('Others', [Validators.required, Validators.maxLength(200)]),
            holdDates: new FormControl([], [Validators.required]),
            holdFrom: new FormControl(),
            holdTo: new FormControl(),
            withSalary: new FormControl(true),
            withoutSalary: new FormControl(false),
            pfContinue: new FormControl(true),
            gfContinue: new FormControl(true)
        })


        this.salaryHoldForm.valueChanges.subscribe(changedValue => {
            this.salaryHoldFormErrors();
        })

        this.salaryHoldForm.get('month').valueChanges.subscribe(value => {
            let year = this.salaryHoldForm.get('year').value;
            if (value > 0 && year > 0) {
                let firstDate = this.utilityService.getFirstDate(value, year);
                let lastDate = this.utilityService.getLastDate(value, year);
                this.datePickerConfig.minDate = firstDate;
                this.datePickerConfig.maxDate = lastDate;
            }
        })

        this.salaryHoldForm.get('year').valueChanges.subscribe(value => {
            let month = this.salaryHoldForm.get('month').value;
            if (value > 0 && month > 0) {
                let firstDate = this.utilityService.getFirstDate(month, value);
                let lastDate = this.utilityService.getLastDate(month, value);
                this.datePickerConfig.minDate = firstDate;
                this.datePickerConfig.maxDate = lastDate;
            }
        })

        this.openModal();
    }

    salaryHoldFormErrors(formGroup: FormGroup = this.salaryHoldForm) {
        Object.keys(formGroup.controls).forEach((key: string) => {
            const abstractControl = formGroup.get(key);
            this.formErrors[key] = '';
            if (abstractControl && !abstractControl.valid && (abstractControl.touched || abstractControl.dirty)) {
                const messages = this.validationMessages[key];
                console.log("messages>>", messages);
                console.log("abstractControl.value >>", abstractControl.value);
                console.log("abstractControl.errors>>", abstractControl.errors);
                for (const errorKey in abstractControl.errors) {
                    console.log("errorKey>>", errorKey);
                    this.formErrors[key] += messages[errorKey];
                }
            }
        })
    }

    submit() {
        if (this.salaryHoldForm.valid) {
            let values = this.salaryHoldForm.value;
            values.holdFrom = this.datePipe.transform(values.holdDates[0], "yyyy-MM-dd");
            values.holdTo = this.datePipe.transform(values.holdDates[1], "yyyy-MM-dd");

            this.employeeSalaryHoldService.SaveSalaryHold(this.salaryHoldForm.value).subscribe(response => {
                if (response?.status) {
                    this.utilityService.success(response.msg, "Server Response");
                    this.closeModal('Save Complete')
                }
                else {
                    this.utilityService.success(response.msg, "Server Response");
                }
            }, error => {
                console.log("error")
            })
        }
        else {
            this.utilityService.fail("Invalid Form Submission", "Site Response");
        }
    }

    openModal() {
        this.modalService.open(this.employeeSalaryHoldModal, "lg");
    }

    getSalaryHoldById() {
        this.employeeSalaryHoldService.getSalaryHoldInfoById({ id: this.id }).subscribe(response => {
            this.salaryHoldFormInitialize(response);
        })
    }

    salaryHoldFormInitialize(data: any) {
        this.salaryHoldForm.get('salaryHoldId').setValue(data?.salaryHoldId);
        this.salaryHoldForm.get('employeeId').setValue(data?.employeeId);
        this.salaryHoldForm.get('month').setValue(data?.month);
        this.salaryHoldForm.get('year').setValue(data?.year);
        this.salaryHoldForm.get('holdDates').setValue([new Date(data?.holdFrom), new Date(data?.holdTo)]);
        this.salaryHoldForm.get('holdFrom').setValue(data?.holdFrom);
        this.salaryHoldForm.get('holdTo').setValue(data?.holdTo);
        this.salaryHoldForm.get('holdReason').setValue(data?.holdReason);
        this.salaryHoldForm.get('withSalary').setValue(data?.withSalary);
        this.salaryHoldForm.get('pfContinue').setValue(data?.pfContinue);
        this.salaryHoldForm.get('gfContinue').setValue(data?.gfContinue);
    }

    closeModal(reason: any) {
        this.modalService.service.dismissAll(reason);
        this.closeModalEvent.emit(reason);
    }

}