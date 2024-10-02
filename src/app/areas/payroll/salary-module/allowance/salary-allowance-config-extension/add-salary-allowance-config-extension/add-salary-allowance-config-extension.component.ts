import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { TypeaheadMatch } from "ngx-bootstrap/typeahead";
import { EmployeeInfoService } from "src/app/areas/employee_module/employee/employee-info.service";
import { DesignationService } from "src/app/areas/employee_module/Organizational/designation/designation.service";
import { GradeService } from "src/app/areas/employee_module/Organizational/grade/grade.service";
import { CustomModalService } from "src/app/shared/services/custom-modal.service";
import { PayrollWebService } from "src/app/shared/services/payroll-web.service";
import { UserService } from "src/app/shared/services/user.service";
import { UtilityService } from "src/app/shared/services/utility.service";
import { SalaryAllowanceConfigService } from "../../salary-allowance-config/salary-allowance-config.service";

@Component({
    selector: 'app-payroll-add-salary-allowance-config-extension',
    templateUrl: './add-salary-allowance-config-extension.component.html'
})

export class AddSalaryAllowanceConfigExtensionComponent implements OnInit {
    @ViewChild('generalConfigModal', { static: true }) generalConfigModal!: ElementRef;
    @Input() id: number = 0;
    @Output() closeModalEvent = new EventEmitter<string>();

    constructor(
        private fb: FormBuilder,
        private salaryAllowanceConfigService: SalaryAllowanceConfigService,
        private utilityService: UtilityService,
        private modalService: CustomModalService,
        private employeeInfoService: EmployeeInfoService,
        private gradeService: GradeService,
        private designationService: DesignationService,
        private payrollWebService: PayrollWebService) {

    }

    ngOnInit(): void {
        this.base_allowance_changed();
        this.openModal();
        this.loadSalaryAllowance();
    }

    openModal() {
        this.modalService.open(this.generalConfigModal, "xl");
    }

    generalBaseForm: FormGroup = null;
    ctcBaseForm: FormGroup = null;

    base_type: string = "Gross";
    config_category: string = "";
    job_type: string = "";
    config_categories: any[] = ["Employee Wise", "Designation", "Grade", "Job Type", "All"];
    ddlJobtypes: any[] = this.utilityService.getJobTypes();
    base_types: any[] = ["Gross", "Basic", "Flat"];
    // , "CTC"
    depandent_allowances: any[] = ["CTC", "Basic", "Rest Of Amount"];

    typeHead_data: any[] = [];
    grades: any[] = [];
    designations: any[] = [];

    selected_items: any[] = [];
    selected_ids: string = "";

    generalType_formArray: any;
    ctcType_formArray: any;
    base_allowance_changed() {
        if (this.base_type == 'Gross' || this.base_type == 'Basic' || this.base_type == 'Flat') {
            this.ctcBaseForm = null;
            this.generalBaseForm = this.fb.group({
                salaryAllowanceConfigId: new FormControl(this.id),
                allowanceBase: new FormControl(this.base_type, [Validators.required]), // Gross - Basic - Flat - CTC
                configCategory: new FormControl(this.config_category, [Validators.required]), // 
                isActive: new FormControl(false),
                configurationDetails: this.fb.array([
                    this.fb.group({
                        salaryAllowanceConfigDetailId: new FormControl(0),
                        allowanceNameId: new FormControl(0, [Validators.min(1), Validators.required]),
                        allowanceBase: new FormControl(this.base_type),
                        dependentAllowance: new FormControl(null),
                        percentage: new FormControl(0, (this.base_type == "Gross" || this.base_type == "Basic" ? [Validators.required, Validators.min(1)] : [])),
                        amount: new FormControl(0, (this.base_type == "Flat" ? [Validators.required, Validators.min(1)] : [])),
                        isFixed: new FormControl(0),
                        isActive: new FormControl(0),
                        maxAmount: new FormControl(0),
                        minAmount: new FormControl(0),
                        additionalAmount: new FormControl(0)
                    })
                ])
            })
            this.generalType_formArray = (<FormArray>this.generalBaseForm.get('configurationDetails')).controls;
        }
        else {
            this.generalBaseForm = null;
            this.ctcBaseForm = this.fb.group({
                salaryAllowanceConfigId: new FormControl(0),
                allowanceBase: new FormControl('', [Validators.required]), // - CTC
                configCategory: new FormControl(this.config_category, [Validators.required]), // 
                isActive: new FormControl(false),
                configurationDetails: this.fb.array([
                    this.fb.group({
                        salaryAllowanceConfigDetailId: new FormControl(0),
                        allowanceNameId: new FormControl(0),
                        allowanceBase: new FormControl(this.base_type),
                        dependentAllowance: new FormControl('Basic'),
                        percentage: new FormControl(0),
                        isFixed: new FormControl(0),
                        isActive: new FormControl(0),
                        amount: new FormControl(0),
                        maxAmount: new FormControl(0),
                        minAmount: new FormControl(0),
                        additionalAmount: new FormControl(0)
                    })
                ])
            })
            this.ctcType_formArray = (<FormArray>this.ctcBaseForm.get('configurationDetails')).controls;
        }
    }

    setValidation(index: number) {
        if (this.base_type == 'Gross' || this.base_type == 'Basic' || this.base_type == 'Flat') {
            let fg = this.generalType_formArray[index];
            let allowanceNameIdInThisIndex = 0
            if (fg instanceof FormGroup) {
                let formGroup = fg as FormGroup;
                let allowanceBase = formGroup.get('allowanceBase').value;
                allowanceNameIdInThisIndex = this.utilityService.IntTryParse(formGroup.get('allowanceNameId').value);
                if (allowanceBase == 'Gross' || allowanceBase == 'Basic') {
                    formGroup.get('amount').setValue(0);
                    formGroup.get('amount').clearValidators();
                    formGroup.get('amount').updateValueAndValidity();
                    formGroup.get('percentage').setValidators([Validators.required, Validators.min(1), Validators.max(100)]);
                    formGroup.get('percentage').updateValueAndValidity();
                }
                else {
                    formGroup.get('percentage').setValue(0);
                    formGroup.get('percentage').clearValidators();
                    formGroup.get('percentage').updateValueAndValidity();
                    formGroup.get('amount').setValidators([Validators.required, Validators.min(1)]);
                    formGroup.get('amount').updateValueAndValidity();
                }


                (this.generalType_formArray as []).forEach((item, i) => {
                    if (index != i) {
                        let formGroupItem = item as FormGroup;
                        let allowanceId = this.utilityService.IntTryParse(formGroupItem.get('allowanceNameId').value);
                        if ((allowanceId != 0 && allowanceNameIdInThisIndex != 0) && allowanceId === allowanceNameIdInThisIndex) {
                            this.utilityService.fail("Duplicate allowance selected", "Site Response");
                            formGroup.get('allowanceNameId').setValue(0);
                        }
                    }
                })
            }
        }
    }

    ddlEmployees: any[];
    loadEmployeeDropdown() {
        this.employeeInfoService.loadDropdownData({});
        this.employeeInfoService.ddl_employee_data$.subscribe(data => {
            this.employeeInfoService.loadDropdown(data);
            this.typeHead_data = this.employeeInfoService.ddl$;
        }, error => {
            console.error('Error while fetching data:', error);
        });
    }

    loadGrades() {
        this.gradeService.loadGradeDropdown();
        this.gradeService.ddl$.subscribe(data => {
            this.typeHead_data = data;
        });
    }

    loadDesignation() {
        this.designationService.loadDesignationDropdown();
        this.designationService.ddl$.subscribe(data => {
            this.typeHead_data = data;
        });
    }

    selected: string = "";
    item_selected(e: TypeaheadMatch) {
        let item_exist = null;
        if (this.selected_items.length > 0) {
            item_exist = this.selected_items.find(s => s.id == e.item.id);
        }
        if (item_exist != null) {
            let config_type = this.config_category == "Employee Wise" ? "Employee" : this.config_category;
            this.utilityService.fail(`Duplicate ${config_type} detected`, "Site Response");
        }
        else {
            this.selected_items.push({
                id: e.item.id,
                text: e.item.text
            })
        }
        this.selected = "";
    }

    config_category_changed() {
        this.job_type = "";
        this.selected_ids = "";
        this.selected_items = [];
        this.typeHead_data = [];
        if (this.config_category == 'Employee Wise') {
            this.loadEmployeeDropdown();
        }
        if (this.config_category == 'Grade') {
            this.loadGrades();
        }
        if (this.config_category == 'Designation') {
            this.loadDesignation();
        }
        this.generalBaseForm.get('configCategory').setValue(this.config_category);
    }

    delete_selected_item(id: any) {
        const index = this.selected_items.findIndex(s => s.id == id);
        if (index > -1) {
            this.selected_items.splice(index, 1);
        }
    }

    salaryAllowances: any[] = [];

    loadSalaryAllowance() {
        this.payrollWebService.getAllowanceNames<any[]>("Salary").then((data) => {
            this.salaryAllowances = data;
        })
    }

    addGeneralTypeAllowance() {
        (<FormArray>this.generalBaseForm.get('configurationDetails')).push(this.addGeneralTypeAllowanceGroup());
    }

    addGeneralTypeAllowanceGroup() {
        return this.fb.group({
            salaryAllowanceConfigDetailId: new FormControl(0),
            allowanceNameId: new FormControl(0, [Validators.min(1), Validators.required]),
            allowanceBase: new FormControl(this.base_type),
            percentage: new FormControl(0, (this.base_type == "Gross" || this.base_type == "Basic" ? [Validators.required, Validators.min(1)] : [])),
            amount: new FormControl(0, (this.base_type == "Flat" ? [Validators.required, Validators.min(1)] : [])),
            isFixed: new FormControl(0),
            isActive: new FormControl(0),
            maxAmount: new FormControl(0),
            minAmount: new FormControl(0),
            additionalAmount: new FormControl(0)
        })
    }

    removeAllowancesButtonClick(index: number) {
        if ((<FormArray>this.generalBaseForm.get('configurationDetails')).length > 1) {
            (<FormArray>this.generalBaseForm.get('configurationDetails')).removeAt(index);
        }
        else {
            this.utilityService.fail("You can't delete last item", "Site Response");
        }
    }

    formErrors = {
        'allowanceNameId': '',
        'allowanceBase': '',
        'percentage': '',
        'amount': ''
    };

    validationMessages = {
        'allowanceNameId': {
            'min': 'Field is required',
            'required': 'Field is required'
        },
        'allowanceBase': {
            'required': 'Field is required'
        },
        'percentage': {
            'required': 'Field is required'
        },
        'amount': {
            'required': 'Field is required'
        }
    }

    logFormErrors(formGroup: FormGroup): boolean {
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

    findInvalidControls() {
        let allControls = this.generalBaseForm.controls;
        for (let control in allControls) {
            let item = this.generalBaseForm.controls[control];
            if (item.invalid) {
                console.log(control);
            }
        }
    }

    validation() {
        let error = "";
        let isvalid = true;
        if (this.config_category != 'All' && this.config_category != '' && this.config_category != 'Job Type') {
            if (this.config_categories == null || this.config_categories.length == 0) {
                let config_type = this.config_category == "Employee Wise" ? "Employee" : this.config_category;
                isvalid = false;
                error += `Please add ${config_type} in the list`;
            }
        }
        if (this.config_category == "Job Type") {
            if (this.job_type == '') {
                isvalid = false;
                error += "Please add job type"
            }
        }

        if (!isvalid) {
            this.utilityService.fail(error, "Site Response");
        }
        return isvalid;
    }
    submit() {
        if (this.validation() && this.btnSubmit == false) {
            this.btnSubmit = true;
            let id = this.utilityService.IntTryParse(this.id);
            let model = {
                salaryAllowanceConfigId: this.id,
                stateStatus: id == 0 ? "Pending" : "",
                headCount: this.selected_items != null ? this.selected_items.length : 0,
                configCategory: this.generalBaseForm.get('configCategory').value,
                baseType: this.generalBaseForm.get('allowanceBase').value,
                salaryAllowanceConfigurationDetails: []
            }

            if (this.config_category == "All" || this.config_category == "Job Type") {
                (this.generalType_formArray as []).forEach((item, index) => {
                    let formGroup = item as FormGroup;
                    model.salaryAllowanceConfigurationDetails.push({
                        salaryAllowanceConfigDetailId: this.utilityService.IntTryParse(formGroup.get('salaryAllowanceConfigDetailId').value),
                        allowanceBase: this.generalBaseForm.get('allowanceBase').value,
                        allowanceNameId: this.utilityService.IntTryParse(formGroup.get('allowanceNameId').value),
                        jobType: this.config_category == "Job Type" ? this.job_type : null,
                        employeeId: 0,
                        gradeId: 0,
                        designationId: 0,
                        percentage: this.utilityService.FloatTryParse(formGroup.get('percentage').value),
                        amount: this.utilityService.FloatTryParse(formGroup.get('amount').value),
                        maxAmount: this.utilityService.FloatTryParse(formGroup.get('maxAmount').value),
                        minAmount: this.utilityService.FloatTryParse(formGroup.get('minAmount').value),
                        additionalAmount: this.utilityService.FloatTryParse(formGroup.get('additionalAmount').value),
                    })
                })
            }
            else {
                this.selected_items.forEach((item1, index1) => {
                    (this.generalType_formArray as []).forEach((item2, index2) => {
                        let formGroup = item2 as FormGroup;
                        model.salaryAllowanceConfigurationDetails.push({
                            salaryAllowanceConfigDetailId: this.utilityService.IntTryParse(formGroup.get('salaryAllowanceConfigDetailId').value),
                            allowanceBase: this.generalBaseForm.get('allowanceBase').value,
                            allowanceNameId: this.utilityService.IntTryParse(formGroup.get('allowanceNameId').value),
                            jobType: this.config_category == "Job Type" ? this.job_type : null,
                            employeeId: this.config_category == "Employee Wise" ? item1?.id : 0,
                            gradeId: this.config_category == "Grade" ? item1?.id : 0,
                            designationId: this.config_category == "Designation" ? item1?.id : 0,
                            percentage: this.utilityService.FloatTryParse(formGroup.get('percentage').value),
                            amount: this.utilityService.FloatTryParse(formGroup.get('amount').value),
                            maxAmount: this.utilityService.FloatTryParse(formGroup.get('maxAmount').value),
                            minAmount: this.utilityService.FloatTryParse(formGroup.get('minAmount').value),
                            additionalAmount: this.utilityService.FloatTryParse(formGroup.get('additionalAmount').value),
                        })
                    })
                })
            }

            this.salaryAllowanceConfigService.save2(model).subscribe({
                next: (response) => {
                    this.btnSubmit = false;
                    this.utilityService.success(response.body.msg, "Server Response");
                    console.log("before close", this.utilityService.SaveComplete);
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
                    this.btnSubmit = false;
                }
            })
            console.log("model to save >>>", model);
        }
    }

    closeModal(reason: any) {
        if (this.btnSubmit == false) {
            console.log("break down entry", this.utilityService.SaveComplete);
            this.modalService.service.dismissAll(reason);
            this.closeModalEvent.emit(reason);
        }
    }
}