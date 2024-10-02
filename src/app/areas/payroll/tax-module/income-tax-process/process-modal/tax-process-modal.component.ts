import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { TypeaheadMatch } from "ngx-bootstrap/typeahead";
import { DepartmentService } from "src/app/areas/employee_module/Organizational/department/department.service";
import { EmployeeInfoService } from "src/app/areas/employee_module/employee/employee-info.service";
import { ApiArea, ApiController } from "src/app/shared/constants";
import { ControlPanelWebService } from "src/app/shared/services/control-panel.service";
import { UtilityService } from "src/app/shared/services/utility.service";
import { IncomeTaxProcessService } from "../income-tax-process.service";
import { AreasHttpService } from "src/app/areas/areas.http.service";
import { CustomModalService } from "src/app/shared/services/custom-modal.service";
import { UserService } from "src/app/shared/services/user.service";

@Component({
    selector: 'tax-module-tax-process-modal',
    templateUrl: './tax-process-modal.component.html'
})
export class TaxProcessModalComponent implements OnInit {
    @ViewChild("taxProcessModal", { static: true }) taxProcessModal !: ElementRef;
    constructor(private utilityService: UtilityService, private fb: FormBuilder, private controlPanelWebService: ControlPanelWebService, private departmentService: DepartmentService, private employeeInfoService: EmployeeInfoService, private incomeTaxProcessService: IncomeTaxProcessService, private areasHttpService : AreasHttpService, private modalService: CustomModalService,
        private userService : UserService) {
    }
    @Output() closeModalEvent = new EventEmitter<string>();
    ngOnInit(): void {
        this.modalService.open(this.taxProcessModal,"xl");
        this.getMonths();
        this.getYears();
    }

    months: any[] = [];
    getMonths() {
        this.months = this.utilityService.getMonths();
    }

    years: any[] = [];
    getYears() {
        this.years = this.utilityService.getYears(2);
    }

    select2Options = this.utilityService.select2Config();

    logger(msg: any, options: any) {
        this.utilityService.consoleLog(msg, options);
    }


    taxprocessType: string = "Systematically";
    processMonth: number = 0;
    processYear: number = 0;
    salaryDate: string = null;
    executionOn: string = '';
    effectOnSalary: string = 'No';

    // execution-on
    taxProcessForm: FormGroup;
    btnProcess: boolean = false;
    executionOn_changed() {
        this.taxProcessForm = null;
        if (this.allEmployeeTaxProcessForm != null || this.allEmployeeTaxProcessForm instanceof FormGroup) {
            this.allEmployeeTaxProcessForm = null;
        }
        if (this.branchWiseTaxProcessForm != null || this.branchWiseTaxProcessForm instanceof FormGroup) {
            this.branchWiseTaxProcessForm = null;
        }
        if (this.departmentWiseTaxProcessForm != null || this.departmentWiseTaxProcessForm instanceof FormGroup) {
            this.departmentWiseTaxProcessForm = null;
        }
        if (this.selectedEmployeestWiseTaxProcessForm != null || this.selectedEmployeestWiseTaxProcessForm instanceof FormGroup) {
            this.selectedEmployeestWiseTaxProcessForm = null;
        }

        if (this.executionOn == "All") {
            this.allEmployeeTaxProcessFormInit();
        }
        else if (this.executionOn == "Branch") {
            this.loadBranches();
            this.branchWiseTaxProcessFormInit();
        }
        else if (this.executionOn == "Department") {
            this.loadDepartments();
            this.departmentWiseTaxProcessFormInit();
        }
        else if (this.executionOn == "Selected Employees") {
            this.loadEmployees();
            this.selectedEmployeestWiseTaxProcessFormInit();
        }
    }

    user_company_id: number =this.User().ComId;
    user_organization_id: number =this.User().OrgId;
    User() {
        return this.userService.User();
    }
    //#region All
    allEmployeeTaxProcessForm: FormGroup;
    allEmployeeTaxProcessFormInit() {
        this.allEmployeeTaxProcessForm = this.fb.group({
            processBy: new FormControl(this.taxprocessType, [Validators.required]),
            month: new FormControl(0, [Validators.required]),
            year: new FormControl(0, [Validators.required]),
            executionOn: new FormControl(this.executionOn, [Validators.required]),
            effectOnSalary: new FormControl('No'),
        });
        this.taxProcessForm = this.allEmployeeTaxProcessForm;
        this.processType_monthYear_changed();
    }

    clearControl() {
        this.taxprocessType = "Systematically";
        this.processMonth = 0;
        this.processYear = 0;
        this.effectOnSalary = "No";
        this.employeesList = [];
    }

    //#endregion

    processType_monthYear_changed() {
        if (this.taxprocessType == "Uploaded Component") {
        }
        else if (this.taxprocessType == "Systemically") {
            if (this.executionOn == 'All') {
                this.allEmployeeTaxProcessForm.get('processBy').setValue(this.taxprocessType);
                this.allEmployeeTaxProcessForm.get('effectOnSalary').setValue(this.effectOnSalary);
                this.allEmployeeTaxProcessForm.get('month').setValue(this.processMonth);
                this.allEmployeeTaxProcessForm.get('year').setValue(this.processYear);
            }
            else if (this.executionOn == 'Branch') {
                this.branchWiseTaxProcessForm.get('processBy').setValue(this.taxprocessType);
                this.branchWiseTaxProcessForm.get('month').setValue(this.processMonth);
                this.branchWiseTaxProcessForm.get('effectOnSalary').setValue(this.effectOnSalary);
                this.branchWiseTaxProcessForm.get('year').setValue(this.processYear);
            }
            else if (this.executionOn == 'Department') {
                this.departmentWiseTaxProcessForm.get('processBy').setValue(this.taxprocessType);
                this.departmentWiseTaxProcessForm.get('month').setValue(this.processMonth);
                this.departmentWiseTaxProcessForm.get('effectOnSalary').setValue(this.effectOnSalary);
                this.departmentWiseTaxProcessForm.get('year').setValue(this.processYear);
            }
            else if (this.executionOn == 'Selected Employees') {
                this.selectedEmployeestWiseTaxProcessForm.get('processBy').setValue(this.taxprocessType);
                this.selectedEmployeestWiseTaxProcessForm.get('effectOnSalary').setValue(this.effectOnSalary);
                this.selectedEmployeestWiseTaxProcessForm.get('month').setValue(this.processMonth);
                this.selectedEmployeestWiseTaxProcessForm.get('year').setValue(this.processYear);
            }
        }
    }

    //#region branch
    branchWiseTaxProcessForm: FormGroup;
    branchWiseTaxProcessFormInit() {
        this.branchWiseTaxProcessForm = this.fb.group({
            processBy: new FormControl(this.taxprocessType, [Validators.required]),
            month: new FormControl(this.processMonth, [Validators.required]),
            year: new FormControl(this.processYear, [Validators.required]),
            executionOn: new FormControl(this.executionOn, [Validators.required]),
            effectOnSalary: new FormControl('No'),
            processBranchId: new FormControl(0, [Validators.min(1)]),
        })
        this.taxProcessForm = this.branchWiseTaxProcessForm;
        this.branchWiseTaxProcessForm.valueChanges.subscribe(control => {
        })

        this.processType_monthYear_changed();
    }

    branches: any[] = [];
    loadBranches() {
        this.branches = [];
        this.controlPanelWebService.getBranchExtension<any[]>('1').then((data) => {
            this.branches = data;
        })
    }
    //#endregion

    //#region department
    departmentWiseTaxProcessForm: FormGroup;
    departments: any = [];

    ddlDepartment: any;
    loadDepartments() {
        this.departmentService.loadDepartmentDropdown();
        this.departmentService.ddl$.subscribe(response=>{
            console.log("response departments >>>", response);
            this.departments = response;
        });
    }


    departmentWiseTaxProcessFormInit() {
        this.departmentWiseTaxProcessForm = this.fb.group({
            processBy: new FormControl(this.taxprocessType, [Validators.required]),
            month: new FormControl(this.processMonth, [Validators.required]),
            year: new FormControl(this.processYear, [Validators.required]),
            executionOn: new FormControl(this.executionOn, [Validators.required]),
            effectOnSalary: new FormControl('No'),
            processDepartmentId: new FormControl(0, [Validators.min(1)])
        })
        this.taxProcessForm = this.departmentWiseTaxProcessForm;

        this.departmentWiseTaxProcessForm.valueChanges.subscribe(control => {
            console.log("this.departmentWiseTaxProcessForm is valid = >>>", this.departmentWiseTaxProcessForm.valid);
        })

        this.processType_monthYear_changed();
    }
    //#endregion department

    //#region selected employees
    selectedEmployee?: string;
    employees: any[] = [];
    loadEmployees() {
        this.employeeInfoService.loadDropdownData({});
        this.employeeInfoService.ddl_employee_data$.subscribe(data => {
            this.employeeInfoService.loadDropdown(data);
            this.employees = this.employeeInfoService.ddl$;
            //console.log("employee wise this.employees >>>", this.employees)
        }, error => {
            this.utilityService.httpErrorHandler(error);
            //console.error('Error while fetching data:', error);
        });
    }


    employeesList: any[] = [];
    selectedEmployeestWiseTaxProcessForm: FormGroup;
    selectedEmployeestWiseTaxProcessFormInit() {
        this.selectedEmployeestWiseTaxProcessForm = this.fb.group({
            processBy: new FormControl(this.taxprocessType, [Validators.required]),
            month: new FormControl(this.processMonth, [Validators.required]),
            year: new FormControl(this.processYear, [Validators.required]),
            executionOn: new FormControl(this.executionOn, [Validators.required]),
            effectOnSalary: new FormControl('No'),
            commaSeparatedEmployee: new FormControl(''),
            selectedEmployee: new FormControl(),
            selectedEmployees: new FormControl(this.selectedEmployees, [Validators.required]),
        })
        this.taxProcessForm = this.selectedEmployeestWiseTaxProcessForm;

        this.selectedEmployeestWiseTaxProcessForm.valueChanges.subscribe(control => {
            //console.log("this.selectedEmployeestWiseTaxProcessForm is valid = >>>", this.selectedEmployeestWiseTaxProcessForm.valid);
        })
        this.processType_monthYear_changed();
    }

    selectedEmployees: string = "";
    getSelectedEmployees() {
        this.selectedEmployees = "";
        this.employeesList.forEach(item => {
            this.selectedEmployees += item.id + ","
        });
        this.selectedEmployeestWiseTaxProcessForm.get("selectedEmployee").setValue("");
        this.selectedEmployeestWiseTaxProcessForm.get("selectedEmployees").setValue(this.selectedEmployees);

        //this.logger("this.selectedEmployeestWiseTaxProcessForm is valid = ", this.selectedEmployeestWiseTaxProcessForm.valid);
    }

    commaSeparatedEmployee?: string;
    loadEmployeeByCommaSeparatedData() {
        this.commaSeparatedEmployee = this.selectedEmployeestWiseTaxProcessForm.controls.commaSeparatedEmployee.value;
        if (this.commaSeparatedEmployee != null && this.commaSeparatedEmployee != "") {
            this.employeesList = [];
            this.areasHttpService.observable_get((ApiArea.hrms + ApiController.employees + "/GetEmployeesData"), {
                responseType: "json", params: {
                    employeeCodes: this.commaSeparatedEmployee
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
        this.getSelectedEmployees();
    }

    deleteEmployee(id: any) {
        const index = this.employeesList.findIndex(s => s.id == id);
        if (index > -1) {
            this.employeesList.splice(index, 1);
        }
    }
    //#endregion

    //#region submit
    submitTaxProcess() {
        if (this.taxProcessForm.valid) {
            this.btnProcess = true;
            this.logger("this.taxProcessForm value >>> ", this.taxProcessForm.value);
            let formData = {
                processType: this.taxprocessType, executionOn: "", selectedEmployees: "", month: 0, year: 0, processBranchId: 0, processDepartmentId: 0, effectOnSalary: false
            };

            formData.effectOnSalary = this.effectOnSalary == 'No' ? false : true;
            formData.processType = this.taxprocessType;
            formData.executionOn = this.taxProcessForm.controls.executionOn.value;
            formData.month = this.processMonth;
            formData.year = this.processYear;
            formData.selectedEmployees = formData.executionOn == "Selected Employees" ? this.taxProcessForm.controls.selectedEmployees.value : "";
            formData.processBranchId = formData.executionOn == "Branch" ? this.taxProcessForm.controls.processBranchId.value : 0;
            formData.processDepartmentId = formData.executionOn == "Department" ? this.taxProcessForm.controls.processDepartmentId.value : 0;

            console.log("taxProcessForm formData >>>", formData);

            //return;
            this.incomeTaxProcessService.executeProcess(formData).subscribe(response => {
                this.btnProcess = false;
                if (response.status) {
                    this.utilityService.success(response.msg, "Server Response");
                    this.modalService.service.dismissAll();
                    this.closeModal('Process done')
                }
                else {
                    if (response.msg == "Validation Error") {
                        this.utilityService.fail(response.errors?.duplicateAllowance, "Server Response", 5000);
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
        else {
            this.utilityService.fail("Invalid Form Submission", "Site Response");
        }
    }
    //#endregion

    //#region tax-process summery
    listOfTaxProcessSummery: any[] = [];
    listOfTaxProcessSummeryDTLabel: string = null;
    searchByFiscalYearId: number = 0;
    getTaxProcessSummeryInfos() {
        this.incomeTaxProcessService.getIncomeTaxProcessInfo({ fiscalYearId: this.searchByFiscalYearId, month: 0, year: 0 }).subscribe(response => {
            var result = response.body;
            this.listOfTaxProcessSummery = result;
            this.logger("this.listOfTaxProcessSummery.length >>>", this.listOfTaxProcessSummery.length);
            this.listOfTaxProcessSummeryDTLabel = this.listOfTaxProcessSummery.length == 0 ? "No record(s) found" : null;
            this.logger("this.listOfTaxProcessSummeryDTLabel >>>", this.listOfTaxProcessSummeryDTLabel);
        }, (error: any) => {
            this.utilityService.httpErrorHandler(error);
        })
    }
    //#endregion

    closeModal(reason: any){
        this.modalService.service.dismissAll(reason);
        this.closeModalEvent.emit(reason); // fair
    }

}