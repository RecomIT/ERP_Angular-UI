import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { BsDatepickerConfig } from "ngx-bootstrap/datepicker";
import { TypeaheadMatch } from "ngx-bootstrap/typeahead";
import { AreasHttpService } from "src/app/areas/areas.http.service";
import { EmployeeInfoService } from "src/app/areas/employee_module/employee/employee-info.service";
import { ApiArea, ApiController, AppConstants } from "src/app/shared/constants";
import { ControlPanelWebService } from "src/app/shared/services/control-panel.service";
import { CustomModalService } from "src/app/shared/services/custom-modal.service";
import { HrWebService } from "src/app/shared/services/hr-web.service";
import { UserService } from "src/app/shared/services/user.service";
import { UtilityService } from "src/app/shared/services/utility.service";
import { SalaryProcessService } from "../salary-process.service";
import { DepartmentService } from "src/app/areas/employee_module/Organizational/department/department.service";
import { DatePipe } from "@angular/common";
import { isArray } from "ngx-bootstrap/chronos";

@Component({
    selector: 'app-payroll-salary-process-modal',
    templateUrl: './salary-process-modal.component.html'
})

export class SalaryProcessModalComponent implements OnInit {

    datePickerConfig: Partial<BsDatepickerConfig> = {};
    @Output() closeModalEvent = new EventEmitter<string>();

    @ViewChild('salaryProcessModal', { static: true }) salaryProcessModal!: ElementRef;

    constructor(
        private fb: FormBuilder,
        private areasHttpService: AreasHttpService, private controlPanelWebService: ControlPanelWebService,
        private utilityService: UtilityService,
        private hrWebService: HrWebService,
        private salaryProcessService: SalaryProcessService,
        private userService: UserService,
        public modalService: CustomModalService,
        private employeeInfoService: EmployeeInfoService,
        private departmentService: DepartmentService,
        private datePipe: DatePipe) {

    }

    app_environment: string = AppConstants.app_environment;
    ngOnInit(): void {
        this.datePickerConfig = this.utilityService.datePickerConfig();
        this.openModal();
        this.salaryProcessType = "Systematically";
        this.salaryDate = null;
        this.monthYear_changed();
        this.executionOn = "";
        this.loadEmployees();
        this.getMonths();
    }

    openModal() {
        this.modalService.open(this.salaryProcessModal, "xl");
    }

    months: any[] = [];
    getMonths() {
        this.months = this.utilityService.getMonths()
    }

    select2Options = this.utilityService.select2Config();

    logger(msg: any, options: any) {
        this.utilityService.consoleLog(msg, options);
    }

    user_company_id: number = this.User().ComId;
    user_organization_id: number = this.User().OrgId;
    User() {
        return this.userService.User();
    }

    salaryProcessType: string = "Systematically";
    processMonth: number = parseInt(this.utilityService.currentMonth);
    processYear: number = parseInt(this.utilityService.currentYear);
    salaryDate: any = null;
    currentYear: any = this.utilityService.currentYear;
    years: any[] = this.utilityService.getYears(2);

    resetOtherProps() {
        this.salaryProcessType = "Systematically";
        this.processMonth = 0;
        this.processYear = 0;
        this.salaryDate = null;
    }

    processtype_changed() {
        if (this.uploadedComponentSalaryProcessForm != null || this.uploadedComponentSalaryProcessForm instanceof FormGroup) {
            this.uploadedComponentSalaryProcessForm = null;
        }

        if (this.salaryProcessType != "") {
            if (this.salaryProcessType == "Systematically") {

            }
            else if (this.salaryProcessType == "Uploaded Component") {
                this.uploadedComponentSalaryProcessFormInit();
            }
            else if (this.salaryProcessType == "Uploaded Salary-Sheet") {
            }
        }
    }

    monthYear_changed() {
        if (this.utilityService.IntTryParse(this.processMonth) > 0 && this.utilityService.IntTryParse(this.processYear) > 0) {
            this.salaryDate = this.utilityService.getLastDate(this.utilityService.IntTryParse(this.processMonth), this.utilityService.IntTryParse(this.processYear)).toString();
            this.salaryDate = new Date(this.salaryDate);
            if (this.uploadedComponentSalaryProcessForm != null) {
                this.uploadedComponentSalaryProcessForm.get('salaryDate').setValue(this.salaryDate);
            }
            else if (this.allEmployeeSalaryProcessForm != null) {
                this.allEmployeeSalaryProcessForm.get('salaryDate').setValue(this.salaryDate);
            }
            else if (this.branchWiseSalaryProcessForm != null) {
                this.branchWiseSalaryProcessForm.get('salaryDate').setValue(this.salaryDate);
            }
            else if (this.departmentWiseSalaryProcessForm != null) {
                this.departmentWiseSalaryProcessForm.get('salaryDate').setValue(this.salaryDate);
            }
            else if (this.selectedEmployeestWiseSalaryProcessForm != null) {
                this.selectedEmployeestWiseSalaryProcessForm.get('salaryDate').setValue(this.salaryDate);
            }
        }
    }

    monthYear_salaryDate_changed() {
        if (this.salaryProcessType == "Uploaded Component") {
            this.uploadedComponentSalaryProcessForm.get('salaryDate').setValue(new Date(this.salaryDate));
            this.uploadedComponentSalaryProcessForm.get('month').setValue(this.processMonth);
            this.uploadedComponentSalaryProcessForm.get('year').setValue(this.processYear);

            this.logger("uploadedComponentSalaryProcessForm valus >>>", this.uploadedComponentSalaryProcessForm.value);
        }
        else if (this.salaryProcessType == "Systematically") {
            if (this.executionOn == 'All') {
                this.allEmployeeSalaryProcessForm.get('salaryDate').setValue(new Date(this.salaryDate));
                this.allEmployeeSalaryProcessForm.get('month').setValue(this.processMonth);
                this.allEmployeeSalaryProcessForm.get('year').setValue(this.processYear);
            }
            else if (this.executionOn == 'Branch') {
                this.branchWiseSalaryProcessForm.get('salaryDate').setValue(new Date(this.salaryDate));
                this.branchWiseSalaryProcessForm.get('month').setValue(this.processMonth);
                this.branchWiseSalaryProcessForm.get('year').setValue(this.processYear);
            }
            else if (this.executionOn == 'Department') {
                this.departmentWiseSalaryProcessForm.get('salaryDate').setValue(new Date(this.salaryDate));
                this.departmentWiseSalaryProcessForm.get('month').setValue(this.processMonth);
                this.departmentWiseSalaryProcessForm.get('year').setValue(this.processYear);
            }
        }
    }

    uploadedComponentSalaryProcessForm: FormGroup;
    uploadedComponentSalaryProcessFormInit() {
        this.uploadedComponentSalaryProcessForm = this.fb.group({
            processBy: new FormControl(this.salaryProcessType, [Validators.required]),
            month: new FormControl(this.processMonth, [Validators.required]),
            year: new FormControl(this.processYear, [Validators.required]),
            salaryDate: new FormControl(this.salaryDate, [Validators.required]),
            branchId: new FormControl(this.User().BranchId),
            companyId: new FormControl(this.User().ComId),
            organizationId: new FormControl(this.User().OrgId),
            userId: new FormControl(this.User().UserId)
        })

        this.uploadedComponentSalaryProcessForm.valueChanges.subscribe((data) => {
            this.logFormErrors();
        })
    }

    formErrors = {
        'processBy': '',
        'monthYear': '',
        'salaryDate': ''
    }

    validationMessages = {
        'processBy': {
            'required': 'Field is required'
        },
        'monthYear': {
            'required': 'Field is required'
        },
        'salaryDate': {
            'required': 'Field is required'
        }
    }

    logFormErrors(formGroup: FormGroup = this.uploadedComponentSalaryProcessForm) {
        Object.keys(formGroup.controls).forEach((key: string) => {
            const abstractControl = formGroup.get(key);
            this.formErrors[key] = '';
            if (abstractControl && !abstractControl.valid && (abstractControl.touched || abstractControl.dirty)) {
                const messages = this.validationMessages[key];
                for (const errorKey in abstractControl.errors) {
                    this.formErrors[key] += messages[errorKey];
                }
            }
        })
    }

    btnProcess: boolean = false;

    runSalaryProcess() {
        if (this.executionOn == "All" && this.allEmployeeSalaryProcessForm.valid) {
            this.btnProcess = true;

            this.salaryProcessService.salaryProcess(this.allEmployeeSalaryProcessForm.value).subscribe(response => {
                if (response?.status) {
                    this.employeesList = [];
                    this.resetOtherProps();
                    this.utilityService.success(response.msg, "Server Response");
                    this.closeModal('Save Complete');
                }
                else {
                    if (response.msg == "Validation Error") {
                        this.utilityService.fail("Validation Error", "Server Response", 5000);
                    }
                    else {
                        this.utilityService.fail(response.msg, "Server Response")
                    }
                }
            }, (error) => {
                this.btnProcess = false;
                this.utilityService.httpErrorHandler(error);
            })
        }
        else if (this.executionOn == "Selected Employees" && this.selectedEmployeestWiseSalaryProcessForm.valid) {
            this.btnProcess = true;
            this.salaryProcessService.salaryProcess(this.selectedEmployeestWiseSalaryProcessForm.value).subscribe(response => {
                if (response?.status) {
                    this.employeesList = [];
                    this.resetOtherProps();
                    this.utilityService.success(response.msg, "Server Response");
                    this.closeModal('Save Complete');
                }
                else {
                    if (response.msg == "Validation Error") {
                        this.utilityService.fail("Validation Error", "Server Response", 5000);
                    }
                    else {
                        this.utilityService.fail(response.msg, "Server Response")
                    }
                }
            }, (error) => {
                this.btnProcess = false;
                this.utilityService.httpErrorHandler(error);
            })
        }
        else if (this.salaryProcessType == "Uploaded Component" && this.uploadedComponentSalaryProcessForm.valid) {
            this.btnProcess = true;
            this.salaryProcessService.salaryProcess(this.uploadedComponentSalaryProcessForm.value).subscribe(response => {
                if (response?.status) {
                    this.employeesList = [];
                    this.resetOtherProps();
                    this.utilityService.success(response.msg, "Server Response");
                    this.closeModal('Save Complete');
                }
                else {
                    if (response.msg == "Validation Error") {
                        this.utilityService.fail("Validation Error", "Server Response", 5000);
                    }
                    else {
                        this.utilityService.fail(response.msg, "Server Response")
                    }
                }
            }, (error) => {
                this.btnProcess = false;
                this.utilityService.httpErrorHandler(error);
            })
        }
    }

    executeSalaryProcess() {
        if (this.executionOn == "All" && this.allEmployeeSalaryProcessForm.valid) {
            this.btnProcess = true;
            this.allEmployeeSalaryProcessForm.get('withTaxProcess').setValue(this.with_tax_process ?? false);
            this.allEmployeeSalaryProcessForm.get('isMargeProcess').setValue(this.is_marge_process ?? false);
            this.salaryProcessService.executesalaryProcess(this.allEmployeeSalaryProcessForm.value).subscribe(response => {
                if (response?.status) {
                    this.employeesList = [];
                    this.resetOtherProps();
                    this.utilityService.success(response.msg, "Server Response");
                    this.closeModal('Save Complete');
                }
                else {
                    if (response.msg == "Validation Error") {
                        this.utilityService.fail("Validation Error", "Server Response", 5000);
                    }
                    else {
                        this.utilityService.fail(response.msg, "Server Response")
                    }
                }
            }, (error) => {
                this.btnProcess = false;
                this.utilityService.httpErrorHandler(error);
            })
        }

        if (this.executionOn == "Branch" && this.branchWiseSalaryProcessForm.valid) {
            this.btnProcess = true;
            this.branchWiseSalaryProcessForm.get('withTaxProcess').setValue(this.with_tax_process ?? false);
            this.branchWiseSalaryProcessForm.get('isMargeProcess').setValue(this.is_marge_process ?? false);
            this.salaryProcessService.executesalaryProcess(this.branchWiseSalaryProcessForm.value).subscribe(response => {
                if (response?.status) {
                    this.employeesList = [];
                    this.resetOtherProps();
                    this.utilityService.success(response.msg, "Server Response");
                    this.closeModal('Save Complete');
                }
                else {
                    if (response.msg == "Validation Error") {
                        this.utilityService.fail("Validation Error", "Server Response", 5000);
                    }
                    else {
                        this.utilityService.fail(response.msg, "Server Response")
                    }
                }
            }, (error) => {
                this.btnProcess = false;
                this.utilityService.httpErrorHandler(error);
            })
        }
        else if (this.executionOn == "Selected Employees" && this.selectedEmployeestWiseSalaryProcessForm.valid) {
            this.btnProcess = true;
            this.selectedEmployeestWiseSalaryProcessForm.get('withTaxProcess').setValue(this.with_tax_process ?? false);
            this.selectedEmployeestWiseSalaryProcessForm.get('isMargeProcess').setValue(this.is_marge_process ?? false);
            this.salaryProcessService.executesalaryProcess(this.selectedEmployeestWiseSalaryProcessForm.value).subscribe(response => {
                if (response?.status) {
                    this.employeesList = [];
                    this.resetOtherProps();
                    this.utilityService.success(response.msg, "Server Response");
                    this.closeModal('Save Complete');
                }
                else {
                    if (response.msg == "Validation Error") {
                        this.utilityService.fail("Validation Error", "Server Response", 5000);
                    }
                    else {
                        this.utilityService.fail(response.msg, "Server Response")
                    }
                }
            }, (error) => {
                this.btnProcess = false;
                this.utilityService.httpErrorHandler(error);
            })
        }
        else if (this.salaryProcessType == "Uploaded Component" && this.uploadedComponentSalaryProcessForm.valid) {
            this.btnProcess = true;
            this.uploadedComponentSalaryProcessForm.get('withTaxProcess').setValue(this.with_tax_process ?? false);
            this.uploadedComponentSalaryProcessForm.get('isMargeProcess').setValue(this.is_marge_process ?? false);
            this.salaryProcessService.executesalaryProcess(this.uploadedComponentSalaryProcessForm.value).subscribe(response => {
                if (response?.status) {
                    this.employeesList = [];
                    this.resetOtherProps();
                    this.utilityService.success(response.msg, "Server Response");
                    this.closeModal('Save Complete');
                }
                else {
                    if (response.msg == "Validation Error") {
                        this.utilityService.fail("Validation Error", "Server Response", 5000);
                    }
                    else {
                        this.utilityService.fail(response.msg, "Server Response")
                    }
                }
            }, (error) => {
                this.btnProcess = false;
                this.utilityService.httpErrorHandler(error);
            })
        }
    }

    executionOn: string = '';
    executionOn_changed() {
        if (this.allEmployeeSalaryProcessForm != null || this.allEmployeeSalaryProcessForm instanceof FormGroup) {
            this.allEmployeeSalaryProcessForm = null;
        }
        if (this.branchWiseSalaryProcessForm != null || this.branchWiseSalaryProcessForm instanceof FormGroup) {
            this.branchWiseSalaryProcessForm = null;
        }
        if (this.departmentWiseSalaryProcessForm != null || this.departmentWiseSalaryProcessForm instanceof FormGroup) {
            this.departmentWiseSalaryProcessForm = null;
        }
        if (this.selectedEmployeestWiseSalaryProcessForm != null || this.selectedEmployeestWiseSalaryProcessForm instanceof FormGroup) {
            this.selectedEmployeestWiseSalaryProcessForm = null;
        }
        //
        if (this.executionOn == 'All') {
            this.allEmployeeSalaryProcessFormInit();
        }
        else if (this.executionOn == 'Branch') {
            this.loadBranches();
            this.branchWiseSalaryProcessFormInit();
        }
        else if (this.executionOn == 'Department') {
            this.loadDepartments();
            this.departmentWiseSalaryProcessFormInit();
        }
        else if (this.executionOn == 'Selected Employees') {
            //this.loadEmployees();
            this.selectedEmployeestWiseSalaryProcessFormInit();
        }
    }

    with_tax_process: boolean = true;
    is_marge_process: boolean = false;

    //#region All employees...
    allEmployeeSalaryProcessForm: FormGroup;
    allEmployeeSalaryProcessFormInit() {
        this.allEmployeeSalaryProcessForm = this.fb.group({
            processBy: new FormControl(this.salaryProcessType, [Validators.required]),
            month: new FormControl(this.processMonth, [Validators.required]),
            year: new FormControl(this.processYear, [Validators.required]),
            executionOn: new FormControl(this.executionOn),
            salaryDate: new FormControl(this.salaryDate, [Validators.required]),
            withTaxProcess: new FormControl(this.with_tax_process ?? false),
            isMargeProcess: new FormControl(this.is_marge_process ?? false),
            branchId: new FormControl(this.User().BranchId),
            companyId: new FormControl(this.User().ComId),
            organizationId: new FormControl(this.User().OrgId),
            userId: new FormControl(this.User().UserId)
        })
    }
    //#endregion .................

    //#region Branch...
    branchWiseSalaryProcessForm: FormGroup;
    processBranchId: string = "0";
    branches: any[] = [];
    loadBranches() {
        this.branches = [];
        this.controlPanelWebService.getBranchExtension<any[]>('1').then((data) => {
            this.branches = data;
        })
    }

    processBranch_changed() {
        this.branchWiseSalaryProcessForm.get('processBranchId').setValue(parseInt(this.processBranchId));
    }

    branchWiseSalaryProcessFormInit() {
        this.branchWiseSalaryProcessForm = this.fb.group({
            processBy: new FormControl(this.salaryProcessType, [Validators.required]),
            month: new FormControl(this.processMonth, [Validators.required]),
            year: new FormControl(this.processYear, [Validators.required]),
            executionOn: new FormControl(this.executionOn, [Validators.required]),
            processBranchId: new FormControl(0, [Validators.min(1)]),
            salaryDate: new FormControl(this.salaryDate, [Validators.required]),
            withTaxProcess: new FormControl(this.with_tax_process ?? false),
            isMargeProcess: new FormControl(this.is_marge_process ?? false),
            branchId: new FormControl(this.User().BranchId),
            companyId: new FormControl(this.User().ComId),
            organizationId: new FormControl(this.User().OrgId),
            createdBy: new FormControl(this.User().UserId),
            updatedBy: new FormControl(this.User().UserId)
        })
    }
    //#endregion

    //#region Department

    departmentWiseSalaryProcessForm: FormGroup;
    processDepartmentId: string = "0";
    departments: any = [];

    processDepartment_changed() {
        this.departmentWiseSalaryProcessForm.get('processDepartmentId').setValue(parseInt(this.processDepartmentId))
    }

    loadDepartments() {
        this.departmentService.loadDepartmentDropdown();
        this.departments = this.departmentService.ddl$;
    }

    departmentWiseSalaryProcessFormInit() {
        this.departmentWiseSalaryProcessForm = this.fb.group({
            processBy: new FormControl(this.salaryProcessType, [Validators.required]),
            month: new FormControl(this.processMonth, [Validators.required]),
            withTaxProcess: new FormControl(this.with_tax_process ?? false),
            isMargeProcess: new FormControl(this.is_marge_process ?? false),
            year: new FormControl(this.processYear, [Validators.required]),
            executionOn: new FormControl(this.executionOn, [Validators.required]),
            processDepartmentId: new FormControl(0, [Validators.min(1)]),
            salaryDate: new FormControl(this.salaryDate, [Validators.required])
        })
    }
    //#endregion Department

    //#region Selected-Employee
    selectedEmployee?: string;

    employees: any[] = [];
    loadEmployees() {
        this.employeeInfoService.loadDropdownData({});
        this.employeeInfoService.ddl_employee_data$.subscribe(data => {
            this.employeeInfoService.loadDropdown(data);
            this.employees = this.employeeInfoService.ddl$;
        }, error => {
            console.error('Error while fetching data:', error);
        });
    }

    employeesList: any[] = [];
    selected?: string;
    selectedEmployeestWiseSalaryProcessForm: FormGroup;
    selectedEmployeestWiseSalaryProcessFormInit() {
        this.selectedEmployeestWiseSalaryProcessForm = this.fb.group({
            processBy: new FormControl(this.salaryProcessType, [Validators.required]),
            month: new FormControl(this.processMonth, [Validators.required]),
            year: new FormControl(this.processYear, [Validators.required]),
            executionOn: new FormControl(this.executionOn, [Validators.required]),
            withTaxProcess: new FormControl(this.with_tax_process ?? false),
            isMargeProcess: new FormControl(this.is_marge_process ?? false),
            selectedEmployees: new FormControl(this.selectedEmployees, [Validators.required]),
            salaryDate: new FormControl(this.salaryDate, [Validators.required]),
            branchId: new FormControl(this.User().BranchId),
            companyId: new FormControl(this.User().ComId),
            organizationId: new FormControl(this.User().OrgId),
            userId: new FormControl(this.User().UserId)
        })
    }

    deleteEmployee(id: any) {
        const index = this.employeesList.findIndex(s => s.id == id);
        if (index > -1) {
            this.employeesList.splice(index, 1);
        }
    }

    employeeOnSelect(e: TypeaheadMatch) {
        var isEmployee = null;
        if (this.employeesList.length > 0) {
            isEmployee = this.employeesList.find(s => s.id == e.item.id);
        }
        if (isEmployee != null) {
            this.utilityService.fail("Duplicate employee detected", "Site Response");
        }
        else {
            this.employeesList.push({
                id: e.item.id,
                text: e.item.text
            })
        }
        this.selectedEmployee = "";
        this.selected = "";
        this.getSelectedEmployees();
    }

    commaSeparatedEmployee?: string;
    loadEmployeeByCommaSeparatedData() {
        if (this.commaSeparatedEmployee != null && this.commaSeparatedEmployee != "") {
            this.employeesList = [];
            this.areasHttpService.observable_get((ApiArea.hrms + ApiController.employees + "/GetEmployeesData"), {
                responseType: "json", params: {
                    employeeCodes: this.commaSeparatedEmployee, companyId: this.User().ComId, organizationId: this.User().OrgId
                }
            }).subscribe((data) => {
                var result = data as any[];
                if (result.length == 0) {
                    this.utilityService.info("No Employee(s) Found", "Server Response");
                }
                else {
                    result.forEach(item => {
                        this.employeesList.push({
                            id: item.employeeId,
                            text: item.fullName + '~' + item.employeeCode
                        })
                    });
                    this.getSelectedEmployees();
                }
            })
        }
    }

    selectedEmployees: string = "";
    getSelectedEmployees() {
        this.selectedEmployees = "";
        this.employeesList.forEach(item => {
            this.selectedEmployees += item.id + ","
        });
        this.selectedEmployeestWiseSalaryProcessForm.get("selectedEmployees").setValue(this.selectedEmployees)
    }
    //#endregion Selected-Employee

    closeModal(reason: any) {
        this.modalService.service.dismissAll(reason);
        this.closeModalEvent.emit(reason);
    }

    showExcelFileDataUplaoder: boolean = false;
    key_of_uploader: string = "Employee";
    openExcelFileDataUplaoder() {
        this.showExcelFileDataUplaoder = true;
    }
    closeExcelFileDataUplaoder(data: any) {
        this.showExcelFileDataUplaoder = false;
        if (isArray(data)) {
            this.bulkInit(data);
        }
    }

    bulkInit(data: any) {
        this.selectedEmployees = "";
        data.forEach((item, index) => {
            this.selectedEmployees += item.value + ","
            this.employeesList.push({ id: this.utilityService.IntTryParse(item.value), text: item.text })
        })
        this.selectedEmployeestWiseSalaryProcessForm.get("selectedEmployees").setValue(this.selectedEmployees)
    }


}