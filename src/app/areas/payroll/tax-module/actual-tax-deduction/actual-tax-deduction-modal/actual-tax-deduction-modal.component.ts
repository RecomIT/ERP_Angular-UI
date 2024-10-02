import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { CustomModalService } from "src/app/shared/services/custom-modal.service";
import { UtilityService } from "src/app/shared/services/utility.service";
import { ActualTaxDeductionService } from "../actual-tax-deduction.component.service";
import { BsDatepickerConfig } from "ngx-bootstrap/datepicker";
import { EmployeeInfoService } from "src/app/areas/employee_module/employee/employee-info.service";

@Component({
    selector:'app-payroll-actual-tax-deduction-modal',
    templateUrl:'./actual-tax-deduction-modal.component.html'
})

export class ActualTaxDeductionModalComponent implements OnInit {


    @Input() id: number = 0;
    @ViewChild('actualTaxDeductionInsertUpdateModel', { static: true }) actualTaxDeductionInsertUpdateModel!: ElementRef;
    modalTitle: string = "Salary Hold Modal";
    datePickerConfig: Partial<BsDatepickerConfig> = this.utilityService.datePickerConfig();

    @Output() closeModalEvent = new EventEmitter<string>();

    ngOnInit(): void {
        this.loadEmployees();
        this.actualTaxDeductionFormInit();

        if (this.id > 0) {
            this.getActualTaxDeductionById();
        }
    }

    constructor(private fb: FormBuilder,
        public utilityService: UtilityService,
        public modalService: CustomModalService,
        private employeeInfoService: EmployeeInfoService,
        private componetService: ActualTaxDeductionService) { }

    months: any[] = this.utilityService.getMonths();
    years: any[] = this.utilityService.getYears(2);

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

    actualTaxDeductionForm: FormGroup;

    validationMessages = {
        'employeeId': {
            'required': 'Employee is required'
        },
        'salaryMonth': {
            'min': 'Month is required',
            'max': 'Month cannot be greater then 12'
        },
        'salaryYear': {
            'min': 'Year is required',
            'max': 'Year cannot be greater then 2050'
        },
        'actualTaxAmount': {
            'min': 'Deduction tax is required'
        }
    };

    formErrors = {
        'employeeId': '',
        'salaryMonth': '',
        'salaryYear': '',
        'actualTaxAmount': ''
    }

    actualTaxDeductionFormInit() {
        this.actualTaxDeductionForm = this.fb.group({
            actualTaxDeductionId: new FormControl(this.id),
            employeeId: new FormControl('', [Validators.required]),
            salaryMonth: new FormControl(0, [Validators.min(1), Validators.max(12)]),
            salaryYear: new FormControl(0, [Validators.min(2018), Validators.max(2060)]),
            actualTaxAmount: new FormControl(0, [Validators.min(1)])
        })

        this.actualTaxDeductionForm.valueChanges.subscribe(changedValue => {
            this.actualTaxDeductionFormErrors();
        })

        this.openModal();
    }

    actualTaxDeductionFormErrors(formGroup: FormGroup = this.actualTaxDeductionForm) {
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
        if (this.actualTaxDeductionForm.valid) {
            this.componetService.saveActualTaxDeduction(this.actualTaxDeductionForm.value).subscribe(response => {
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
        this.modalService.open(this.actualTaxDeductionInsertUpdateModel, "lg");
    }

    getActualTaxDeductionById() {
        this.componetService.getActualTaxDeductionById({id:this.id }).subscribe(response=>{
            //console.log("getSalaryHoldById  response >>", response);
            this.actualTaxDeductionFormInitialize(response);
        })
    }

    actualTaxDeductionFormInitialize(data: any) {
        this.actualTaxDeductionForm.get('actualTaxDeductionId').setValue(data?.actualTaxDeductionId);
        this.actualTaxDeductionForm.get('employeeId').setValue(data?.employeeId);
        this.actualTaxDeductionForm.get('salaryMonth').setValue(data?.salaryMonth);
        this.actualTaxDeductionForm.get('salaryYear').setValue(data?.salaryYear);
        this.actualTaxDeductionForm.get('actualTaxAmount').setValue(data?.actualTaxAmount);
    }

    closeModal(reason: any) {
        this.modalService.service.dismissAll(reason);
        this.closeModalEvent.emit(reason);
    }

}