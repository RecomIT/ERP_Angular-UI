import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { PeriodicalVariableAllowanceService } from "../periodical-variable-allowance.service";
import { EmployeeInfoService } from "src/app/areas/employee_module/employee/employee-info.service";
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { FiscalYearService } from "../../../setup/fiscalYear/fiscalYear.service";
import { AllowanceNameService } from "../../../allowance/allowance-head/allowance-name.service";
import { UserService } from "src/app/shared/services/user.service";
import { UtilityService } from "src/app/shared/services/utility.service";
import { CustomModalService } from "src/app/shared/services/custom-modal.service";
import { GradeService } from "src/app/areas/employee_module/Organizational/grade/grade.service";
import { DepartmentService } from "src/app/areas/employee_module/Organizational/department/department.service";
import { DesignationService } from "src/app/areas/employee_module/Organizational/designation/designation.service";
import { isArray } from "ngx-bootstrap/chronos";
import { DatePickerConfigService } from "src/app/shared/services/DatePicker/date-picker-config.service";

@Component({
    selector: 'payroll-periodical-variable-allowance-insert-update-modal',
    templateUrl: './periodical-variable-allowance-insert-update-modal.component.html'
})

export class PeriodicalVariableAllowanceInsertUpdateModal implements OnInit {

    @Input() id: number = 0;
    @ViewChild('periodicallyVariableAllowanceInsertUpdateModal', { static: true }) bonusConfigModal!: ElementRef;
    modalTitle: string = "Add New Periodical Variable Allowance";
    @Output() closeModalEvent = new EventEmitter<string>();
    datePickerConfig: any = this.utilityService.datePickerConfig();


    constructor(
        private periodicalVariableAllowanceService: PeriodicalVariableAllowanceService,
        private employeeInfoService: EmployeeInfoService,
        private fb: FormBuilder,
        private fiscalYearService: FiscalYearService,
        private allowanceNameService: AllowanceNameService,
        private userService: UserService, // user service user id
        public utilityService: UtilityService, // utility 
        public modalService: CustomModalService, // modal service
        private gradeService: GradeService,
        private departmentService: DepartmentService,
        private designationService: DesignationService,
        private service: PeriodicalVariableAllowanceService,
        private datePickerConfigService: DatePickerConfigService
    ) {

    }

    ngOnInit(): void {
        this.openModal();
        this.formInit();
        this.loadFiscalYear();
        this.loadEmployee();
        this.loadAllowances();
        this.loadGrades();
        this.loadDesignation();
        this.loadDepartment();
        let previousMonth = new Date()
        console.log("previousMonth >>>", previousMonth);
        this.datePickerConfig = this.datePickerConfigService.getMonthRangeConfig({ minDate: previousMonth })
    }

    // load employee
    list_of_employee: any[] = [];
    loadEmployee() {
        this.employeeInfoService.loadDropdownData({});
        this.employeeInfoService.ddl_employee_data$.subscribe(data => {
            this.employeeInfoService.loadDropdown(data);
            this.list_of_employee = this.employeeInfoService.ddl$;
        }, error => {
            console.error('Error while fetching data:', error);
        });
    }

    // load fiscalYear
    ddlFiscalYearDropdown: any[] = [];
    loadFiscalYear() {
        this.fiscalYearService.loadDropdown();
        this.fiscalYearService.ddl$.subscribe(response => {
            this.ddlFiscalYearDropdown = response;
            //console.log("ddlFiscalYearDropdown >>>", this.ddlFiscalYearDropdown);
        })
    }

    // load allowance
    ddlData: any[] = [];
    list_of_allowance: any[] = [];
    loadAllowances() {
        this.allowanceNameService.loadAllowanceNameDropdown();
        this.allowanceNameService.ddl$.subscribe(response => {
            this.list_of_allowance = response;
        }, (error) => {

        })
    }

    // load grade
    list_of_grade: any[] = [];
    loadGrades() {
        this.gradeService.loadGradeDropdown();
        this.gradeService.ddl$.subscribe(response => {
            this.list_of_grade = response;
        });
    }

    // load designation
    list_of_designation: any[] = [];
    loadDesignation() {
        this.designationService.loadDesignationDropdown();
        this.designationService.ddl$.subscribe(response => {
            this.list_of_designation = response;
        });
    }

    // load department
    list_of_department: any[] = [];
    loadDepartment() {
        this.departmentService.loadDepartmentDropdown();
        this.departmentService.ddl$.subscribe(response => {
            this.list_of_department = response;
        })
    }

    loadDdl(data: any[]) {
        data.forEach((item, index) => {
            this.ddlData.push({ id: item.id, value: item.value, text: item.text })
        })
    }

    // listOfSpecifyFor: any[] = ["Employee wise", "Designation", "Grade", "Job Type", "All"]
    listOfSpecifyFor: any[] = ["Employee wise", "Job Type", "All"]

    types_of_gender: any[] = ["N/A", "Male", "Female"];

    types_of_jobtype: any[] = ["N/A"].concat(this.utilityService.getJobTypes());

    types_of_maritals: any[] = ["N/A"].concat(this.utilityService.getMaritals());

    types_of_duration: any[] = ["Fiscal Year", "Daterange"];

    types_of_citizen: any[] = ["N/A", "Residential", "Non-Residential"];

    types_of_religion: any[] = ["N/A"].concat(this.utilityService.getReligions());

    item_selected(event: any) {
        let item_id = event?.item?.value.toString();
        if (this.utilityService.IntTryParse(item_id) > 0) {
            this.form.get('selector').setValue('');
            if (this.selectedIds.length > 0) {
                let indexOf = this.selectedIds.indexOf(this.utilityService.IntTryParse(item_id));
                if (indexOf > -1) {
                    this.utilityService.fail("Item already exist", "Site Response");
                    return;
                }
            }
            this.selectedItems.push({ id: event?.item?.value.toString(), text: event?.item?.text.toString() })
            if (this.selectedIds != null && this.selectedIds != undefined) {
                this.selectedIds.push(this.utilityService.IntTryParse(item_id))
                this.item_count = this.selectedIds.length;
            }
        }
    }

    remove_item(index: number) {
        if (index > -1 && this.selectedIds != null && this.selectedIds.length > 0) {
            this.selectedItems.splice(index, 1);
            this.selectedIds.splice(index, 1);
        }
        if (this.selectedIds.length == 0) {
            this.item_count = 0;
        }
    }

    form: FormGroup;
    specifyFor: string = "";
    label_of_specify_for: string = "";
    placeHolderText: string = "";
    selectedIds: number[] = [];
    selectedItems: any[] = [];
    fiscalYearRangeInfo: string = "";
    isAmountBaseOnDisabled: boolean = true;
    month_diff: number = 0;
    item_count: number = 0;
    btnSubmit: boolean = false;


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

    formErrors = {
        allowanceNameId: '',
        specifyFor: '',
        amountBaseOn: '',
        percentage: '',
        amount: '',
        principalAmount: '',
        durationType: '',
        fiscalYearId: '',
        effectiveDate: ''
    };

    validationMessages = {
        allowanceNameId: {
            required: 'Allowance is required',
            minLength: 'Allowance is required'
        },
        specifyFor: {
            required: 'Specify-For is required'
        },
        amountBaseOn: {
            required: 'Payment based on is required'
        },
        percentage: {
            min: 'Percentage is requied'
        },
        amount: {
            min: 'Amount is requied'
        },
        durationType: {
            required: 'Duration type is required'
        },
        fiscalYearId: {
            required: 'Fiscal year is required'
        },
        effectiveDate: {
            required: 'Date-range is required'
        }
    }

    formArray: any;
    formInit() {
        this.form = this.fb.group({
            id: new FormControl(this.id),
            selector: new FormControl(''),
            allowanceNameId: new FormControl(0, [Validators.min(1)]),
            specifyFor: new FormControl('', [Validators.required, Validators.minLength(2)]),
            selectedIds: new FormControl(''),
            jobType: new FormControl('N/A'),
            gender: new FormControl('N/A'),
            reigion: new FormControl('N/A'),
            citizen: new FormControl('N/A'),
            calculateProratedAmount: new FormControl(false),
            amountBaseOn: new FormControl('', [Validators.required]),
            principalAmount: new FormControl(0),
            amount: new FormControl(0),
            percentage: new FormControl(0),
            durationType: new FormControl('Daterange', [Validators.required]),
            fiscalYearId: new FormControl(0),
            effectiveDate: new FormControl(null, [Validators.required])
        })

        //this.formArray = (<FormArray>this.form.get('monthWiseAmount')).controls;

        if (this.id == 0) {
            this.form.get('specifyFor').setValue('All');
        }

        this.specifyFor = this.form.get('specifyFor').value;

        this.form.get('specifyFor').valueChanges.subscribe({
            next: (value) => {
                this.ddlData = [];
                this.selectedItems = [];
                this.selectedIds = [];
                this.item_count = 0;
                this.specifyFor = this.form.get('specifyFor').value;
                this.types_of_jobtype = ["N/A"].concat(this.utilityService.getJobTypes());
                if (this.specifyFor == "Employee wise") {
                    this.placeHolderText = "Select Employee"
                    this.label_of_specify_for = "Add Employees(s)";
                    this.loadDdl(this.list_of_employee);
                }
                else if (this.specifyFor == "Job Type") {
                    this.types_of_jobtype = this.utilityService.getJobTypes();
                    this.placeHolderText = "Select Employee"
                    this.label_of_specify_for = "Add Employees(s)";
                    this.loadDdl(this.list_of_employee);
                }

                else if (this.specifyFor == "Grade") {
                    this.placeHolderText = "Select Garde"
                    this.label_of_specify_for = "Add Grade(s)";
                    this.loadDdl(this.list_of_grade);
                }
                else if (this.specifyFor == "Designation") {
                    this.placeHolderText = "Select Designation";
                    this.label_of_specify_for = "Add Designation(s)";
                    this.loadDdl(this.list_of_designation);
                }
                else if (this.specifyFor == "Department") {
                    this.placeHolderText = "Select Department";
                    this.label_of_specify_for = "Add Department(s)";
                    this.loadDdl(this.list_of_department);
                }
            }
        })

        this.form.get("durationType").valueChanges.subscribe({
            next: (data) => {
                this.form.get("fiscalYearId").setValue(0);
                this.form.get("effectiveDate").setValue(null);
            }
        })

        this.form.get('effectiveDate').valueChanges.subscribe({
            next: (value) => {
                if (value != null && value != "" && value.length > 0) {
                    let month_diff = this.utilityService.getMonthDiff(value[0], value[1]) + 1;
                    this.month_diff = month_diff;
                    this.monthWiseAmountFormInit();
                }
                else {
                    this.month_diff = 0;
                }
            }
        })

        this.form.get('amountBaseOn').valueChanges.subscribe({
            next: (value) => {
                if (value == 'Principal Amount') {
                    this.form.get('amount').clearValidators();
                    this.form.get('percentage').clearValidators();

                    this.form.get('amount').updateValueAndValidity();
                    this.form.get('percentage').updateValueAndValidity();

                    this.form.get('principalAmount').setValidators([Validators.min(1), Validators.required]);
                    this.form.get('principalAmount').updateValueAndValidity();
                }
                else if (value == 'Flat') {
                    this.form.get('percentage').clearValidators();
                    this.form.get('principalAmount').clearValidators();

                    this.form.get('percentage').updateValueAndValidity();
                    this.form.get('principalAmount').updateValueAndValidity();

                    this.form.get('amount').setValidators([Validators.min(1), Validators.required]);
                    this.form.get('amount').updateValueAndValidity();
                }
                else if (value == 'Gross' || value == 'Basic') {
                    this.form.get('amount').clearValidators();
                    this.form.get('principalAmount').clearValidators();

                    this.form.get('amount').updateValueAndValidity();
                    this.form.get('principalAmount').updateValueAndValidity();

                    this.form.get('percentage').setValidators([Validators.min(1), Validators.required]);
                    this.form.get('percentage').updateValueAndValidity();
                }
            }
        })

        this.form.get('principalAmount').valueChanges.subscribe(value => {
            this.monthWiseAmountFormInit();
        })

        this.form.get("fiscalYearId").valueChanges.subscribe({
            next: (data) => {
                this.month_diff = 0;
                if (this.utilityService.IntTryParse(data) > 0) {
                    let fiscalYear = this.ddlFiscalYearDropdown.find(item => item.id == data);
                    this.fiscalYearRangeInfo = fiscalYear.remarks;
                    if (this.fiscalYearRangeInfo != null && this.fiscalYearRangeInfo != "") {
                        let months = this.fiscalYearRangeInfo.split("~");
                        if (months.length > 0) {
                            this.month_diff = this.utilityService.getMonthDiff(new Date(months[0]), new Date(months[1])) + 1;
                        }
                    }
                }
                else {
                    this.fiscalYearRangeInfo = null;
                }
            }
        })
    }

    list_of_priciple_month: any[] = []
    monthWiseAmountFormInit() {
        this.list_of_priciple_month = [];
        let dates = this.form.get('effectiveDate').value;
        let principalAmount = this.utilityService.FloatTryParse(this.form.get('principalAmount').value);

        if (dates != null && dates.length > 0 && principalAmount > 0) {
            let date1 = dates[0];
            let date2 = dates[1];

            let monthWiseAmount = 0;
            let allocatedAmount = 0;

            let list_of_dates = this.utilityService.getMonthListBetweenTwoDate(new Date(date1), new Date(date2));
            console.log("list_of_dates >>>", list_of_dates);
            if (principalAmount > 0 && list_of_dates.length > 0) {
                monthWiseAmount = Math.round(principalAmount / list_of_dates.length)
            }

            list_of_dates.forEach((item, index) => {
                if ((allocatedAmount + monthWiseAmount) > principalAmount) {
                    monthWiseAmount = principalAmount - allocatedAmount;
                }

                if (index + 1 == list_of_dates.length) {
                    if ((allocatedAmount + monthWiseAmount) < principalAmount) {
                        monthWiseAmount = principalAmount - allocatedAmount;
                    }
                }
                this.list_of_priciple_month.push({
                    monthNo: item.monthNo,
                    monthName: item.monthName,
                    year: item.year,
                    amount: monthWiseAmount,
                    isValid: true
                })
                allocatedAmount += monthWiseAmount;
            })
        }
    }

    rowChanged(index: number) {
        let amount = this.utilityService.FloatTryParse(this.list_of_priciple_month[index].amount);
        this.list_of_priciple_month[index].amount = amount;
        this.list_of_priciple_month[index].isValid = amount == 0 ? false : true;

        let totalPrincipleAmount = 0;
        this.list_of_priciple_month.forEach((item, index) => {
            totalPrincipleAmount += this.utilityService.FloatTryParse(item.amount);
        })
        let principalAmount = this.utilityService.FloatTryParse(this.form.get('principalAmount').value);
        if (totalPrincipleAmount > principalAmount) {
            this.utilityService.fail("Total amount cann't be greater than " + principalAmount.toString())
            this.list_of_priciple_month[index].amount = 0;
            this.list_of_priciple_month[index].isValid = false;
        }
    }



    submit() {
        this.findInvalidControls()
        if (this.form.valid && this.btnSubmit == false) {
            this.btnSubmit = true;
            let effectiveDates = this.form.get('effectiveDate').value;
            let principalAmount = this.utilityService.FloatTryParse(this.form.get('principalAmount').value);

            console.log("this.form.get('specifyFor').value >>>", this.form.get('specifyFor').value);
            let data = {
                id: this.id,
                specifyFor: this.form.get('specifyFor').value,
                jobType: this.form.get('jobType').value,
                gender: this.form.get('gender').value,
                reigion: this.form.get('reigion').value,
                citizen: this.form.get('citizen').value,
                calculateProratedAmount: this.form.get('calculateProratedAmount').value,
                amountBaseOn: this.form.get('amountBaseOn').value,
                principalAmount: principalAmount,
                amount: this.form.get('amount').value,
                percentage: this.form.get('percentage').value,
                durationType: this.form.get('durationType').value,
                fiscalYearId: this.form.get('fiscalYearId').value,
                effectiveFrom: new Date(effectiveDates[0]),
                effectiveTo: new Date(effectiveDates[1]),
                allowanceNameId: this.form.get('allowanceNameId').value,
                details: [],
                principleAmounts: []
            }

            if (this.form.get('specifyFor').value == 'All' || this.form.get('specifyFor').value == 'Job Type') {
                data.details.push({
                    specifyFor: this.form.get('specifyFor').value,
                    allowanceNameId: this.form.get('allowanceNameId').value,
                    employeeId: 0,
                    designationId: 0,
                    gradeId: 0,
                    departmentId: 0,
                    calculateProratedAmount: this.form.get('calculateProratedAmount').value,
                    durationType: this.form.get('durationType').value,
                    fiscalYearId: this.form.get('fiscalYearId').value,
                    effectiveFrom: new Date(effectiveDates[0]),
                    effectiveTo: new Date(effectiveDates[1]),
                    amountBaseOn: this.form.get('amountBaseOn').value,
                    principalAmount: principalAmount,
                    amount: this.form.get('amount').value,
                    percentage: this.form.get('percentage').value,
                    jobType: this.form.get('jobType').value
                });
            }
            else {
                if (
                    this.selectedItems != null
                    && this.selectedItems.length > 0
                    && (
                        this.form.get('specifyFor').value == 'Employee wise'
                        || this.form.get('specifyFor').value == 'Designation'
                        || this.form.get('specifyFor').value == 'Grade')
                ) {
                    // || this.form.get('specifyFor').value == 'Designation' 
                    // || this.form.get('specifyFor').value == 'Grade'
                    console.log("principalAmount >>>", principalAmount)
                    console.log("list_of_priciple_month >>>", this.list_of_priciple_month);

                    this.selectedItems.forEach((item, index) => {
                        console.log("item forEach >>>", item);
                        let employeeId = (this.form.get('specifyFor').value == 'Employee wise' ? this.utilityService.IntTryParse(item.id) : 0);
                        let designationId = (this.form.get('specifyFor').value == 'Designation' ? this.utilityService.IntTryParse(item.id) : 0);
                        let gradeId = (this.form.get('specifyFor').value == 'Designation' ? this.utilityService.IntTryParse(item.id) : 0);
                        data.details.push({
                            specifyFor: this.form.get('specifyFor').value,
                            allowanceNameId: this.utilityService.IntTryParse(this.form.get('allowanceNameId').value),
                            employeeId: employeeId,
                            designationId: designationId,
                            gradeId: gradeId,
                            departmentId: 0,
                            calculateProratedAmount: this.form.get('calculateProratedAmount').value,
                            durationType: this.form.get('durationType').value,
                            fiscalYearId: this.form.get('fiscalYearId').value,
                            effectiveFrom: new Date(effectiveDates[0]),
                            effectiveTo: new Date(effectiveDates[1]),
                            amountBaseOn: this.form.get('amountBaseOn').value,
                            principalAmount: principalAmount,
                            amount: this.form.get('amount').value,
                            percentage: this.form.get('percentage').value,
                            jobType: this.form.get('jobType').value
                        })

                        if (principalAmount > 0 && this.list_of_priciple_month != null && this.list_of_priciple_month.length > 0) {
                            console.log("list_of_priciple_month >>>")
                            this.list_of_priciple_month.forEach((item, index) => {
                                data.principleAmounts.push({
                                    variableId: this.utilityService.IntTryParse(this.form.get('allowanceNameId').value),
                                    variableType: "Allowance",
                                    month: item.monthNo,
                                    year: item.year,
                                    amount: item.amount,
                                    employeeId: employeeId,
                                    designationId: designationId,
                                    gradeId: gradeId,
                                    departmentId: 0,
                                    jobType: this.form.get('jobType').value
                                })
                            })
                        }
                    })
                }
            }

            this.btnSubmit = false;
            console.log("data >>>", data);

            if (data.details.length > 0) {
                this.service.save(data).subscribe({
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
        }
        else {
            this.utilityService.fail("Invalid form submission", "Site Response");
        }
    }

    findInvalidControls() {
        let controls = this.form.controls;
        console.log("controls >>>", controls);
        for (let name in controls) {
            if (this.form.controls[name].invalid) {
                console.log(name);
            }
        }
    }

    openModal() {
        this.modalService.open(this.bonusConfigModal, "xl");
    }

    closeModal(reason: any) {
        if (this.btnSubmit == false) {
            this.modalService.service.dismissAll(reason);
            this.closeModalEvent.emit(reason);
        }
    }

    showExcelFileDataUplaoder: boolean = false;
    key_of_uploader: string = "";
    openExcelFileDataUplaoder() {
        let key = this.form.get('specifyFor').value;
        this.key_of_uploader = key == "Employee wise" ? "Employee" : key;
        this.showExcelFileDataUplaoder = true;
    }

    closeExcelFileDataUplaoder(data: any) {
        this.showExcelFileDataUplaoder = false;
        this.key_of_uploader = "";
        if (isArray(data)) {
            this.bulkInit(data);
        }
    }

    bulkInit(data: any) {
        this.form.get('selector').setValue('');
        this.selectedItems = [];
        this.selectedIds = [];
        this.item_count = data.length;
        data.forEach((item, index) => {
            this.selectedItems.push({ id: this.utilityService.IntTryParse(item.value), text: item.text })
            this.selectedIds.push(this.utilityService.IntTryParse(item.value))
        })

    }

}