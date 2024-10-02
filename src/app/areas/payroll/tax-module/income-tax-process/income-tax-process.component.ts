import { transition, trigger, useAnimation } from '@angular/animations';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { bounceIn, fadeIn, fadeInRight, fadeOutLeft, slideInUp } from 'ng-animate';
import { TypeaheadMatch } from 'ngx-bootstrap/typeahead';
import { ApiArea, ApiController, AppConstants } from 'src/app/shared/constants';
import { ControlPanelWebService } from 'src/app/shared/services/control-panel.service';
import { CustomModalService } from 'src/app/shared/services/custom-modal.service';
import { HrWebService } from 'src/app/shared/services/hr-web.service';
import { UserService } from 'src/app/shared/services/user.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AreasHttpService } from '../../../areas.http.service';
import { IncomeTaxProcessService } from './income-tax-process.service';
import { FiscalYearService } from '../../salary-module/setup/fiscalYear/fiscalYear.service';
import { EmployeeInfoService } from 'src/app/areas/employee_module/employee/employee-info.service';
import { IncomeTaxReportService } from './income-tax-report.service';
import { WebFileService } from 'src/app/areas/common-services/web-file.service';
import { FinalTaxCardService } from './final-tax-card-process/final-tax-card-process.service';
import { templateJitUrl } from '@angular/compiler';

@Component({
  selector: 'app-income-tax-process',
  templateUrl: './income-tax-process.component.html',
  animations: [
    trigger('slideInUp', [transition('* => *', useAnimation(slideInUp, { params: { timing: 0.5 } }))]),
    trigger('fadeIn', [transition('void => *', useAnimation(fadeIn, { params: { timing: 0.3 } }))]),
    trigger('fadeInRight', [transition('void => *', useAnimation(fadeInRight, { params: { timing: 0.5 } }))]),
    trigger('bounceIn', [transition('void => *', useAnimation(bounceIn, { params: { timing: 1 } }))]),
    trigger('fadeOutLeft', [transition('* => void', useAnimation(fadeOutLeft, { params: { timing: 0.3 } }))]),
  ]
})
export class IncomeTaxProcessComponent implements OnInit {

  @ViewChild("employeeIncomeTaxProcessInfoModal", { static: true }) employeeIncomeTaxProcessInfoModal !: ElementRef;

  @ViewChild("actaulTaxDeductedModal", { static: true }) actaulTaxDeductedModal !: ElementRef;
  isListPage: boolean = true;
  constructor(
    private fb: FormBuilder,
    private areasHttpService: AreasHttpService,
    private controlPanelWebService: ControlPanelWebService,
    private utilityService: UtilityService,
    private hrWebService: HrWebService,
    private userService: UserService,
    public modalService: CustomModalService,
    private el: ElementRef,
    private incomeTaxProcessService: IncomeTaxProcessService,
    private fiscalYearService: FiscalYearService,
    private webFileService: WebFileService,
    private employeeInfoService: EmployeeInfoService,
    private finalTaxCardService: FinalTaxCardService,
    private incomeTaxReportService: IncomeTaxReportService) {
  }
  pagePrivilege: any = this.userService.getPrivileges();;

  ngOnInit(): void {
    this.loadEmployees();
    this.loadFiscalYears();
    this.getMonths();
    this.getYears();
    this.loadBranch();
    this.taxSheetDetailsFormInit();
    this.getTaxProcessSummeryInfos();
    this.getFinalTaxProcess();
  }

  app_environment: string = AppConstants.app_environment;

  showPage() {
    this.isListPage = true;
    this.getTaxProcessSummeryInfos();
  }

  ddlBranch: any[] = [];
  loadBranch() {
    this.ddlBranch = [];
    this.controlPanelWebService.getBranchExtension<any[]>("7").then((data) => {
      this.ddlBranch = data;
    })
  }

  months: any[] = [];
  getMonths() {
    this.months = this.utilityService.getMonths();
    console.log("months >>>", this.months)
  }

  years: any[] = [];
  getYears() {
    this.years = this.utilityService.getYears(3);
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

  ddlFiscalYears: any[] = [];
  loadFiscalYears() {
    this.fiscalYearService.loadDropdown();
    this.fiscalYearService.ddl$.subscribe(response => {
      this.ddlFiscalYears = response;
    })
  }

  taxprocessType: string = "";
  processMonth: string = "";
  processYear: string = "";
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
      this.selectedEmployeestWiseTaxProcessFormInit();
    }
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
      branchId: new FormControl(this.User().BranchId),
      companyId: new FormControl(this.User().ComId),
      organizationId: new FormControl(this.User().OrgId),
      userId: new FormControl(this.User().UserId)
    });
    this.taxProcessForm = this.allEmployeeTaxProcessForm;
    this.processType_monthYear_changed();
  }

  clearControl() {
    this.taxprocessType = "";
    this.processMonth = "";
    this.processYear = "";
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
      branchId: new FormControl(this.User().BranchId),
      companyId: new FormControl(this.User().ComId),
      organizationId: new FormControl(this.User().OrgId),
      createdBy: new FormControl(this.User().UserId),
      updatedBy: new FormControl(this.User().UserId)
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
  departments: any[] = [];

  loadDepartments() {
    this.departments = [];
    this.hrWebService.getDepartments<any[]>().then((data) => {
      this.departments = data;
    })
  }

  departmentWiseTaxProcessFormInit() {
    this.departmentWiseTaxProcessForm = this.fb.group({
      processBy: new FormControl(this.taxprocessType, [Validators.required]),
      month: new FormControl(this.processMonth, [Validators.required]),
      year: new FormControl(this.processYear, [Validators.required]),
      executionOn: new FormControl(this.executionOn, [Validators.required]),
      effectOnSalary: new FormControl('No'),
      processDepartmentId: new FormControl(0, [Validators.min(1)]),
      branchId: new FormControl(this.User().BranchId),
      companyId: new FormControl(this.User().ComId),
      organizationId: new FormControl(this.User().OrgId),
      userId: new FormControl(this.User().UserId)
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
    }, error => {
      console.error('Error while fetching data:', error);
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
      branchId: new FormControl(this.User().BranchId),
      companyId: new FormControl(this.User().ComId),
      organizationId: new FormControl(this.User().OrgId),
      userId: new FormControl(this.User().UserId)
    })
    this.taxProcessForm = this.selectedEmployeestWiseTaxProcessForm;

    this.selectedEmployeestWiseTaxProcessForm.valueChanges.subscribe(control => {
      console.log("this.selectedEmployeestWiseTaxProcessForm is valid = >>>", this.selectedEmployeestWiseTaxProcessForm.valid);
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

    this.logger("this.selectedEmployeestWiseTaxProcessForm is valid = ", this.selectedEmployeestWiseTaxProcessForm.valid);
  }

  commaSeparatedEmployee?: string;
  loadEmployeeByCommaSeparatedData() {
    this.commaSeparatedEmployee = this.selectedEmployeestWiseTaxProcessForm.controls.commaSeparatedEmployee.value;
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
        processType: "", executionOn: "", selectedEmployees: "", salaryMonth: 0, salaryYear: 0, processBranchId: 0, processDepartmentId: 0, effectOnSalary: false
      };

      formData.effectOnSalary = this.effectOnSalary == 'No' ? false : true;
      formData.processType = this.taxProcessForm.controls.processBy.value;
      formData.executionOn = this.taxProcessForm.controls.executionOn.value;
      formData.salaryMonth = this.taxProcessForm.controls.month.value;
      formData.salaryYear = this.taxProcessForm.controls.year.value;
      formData.selectedEmployees = formData.executionOn == "Selected Employees" ? this.taxProcessForm.controls.selectedEmployees.value : "";
      formData.processBranchId = formData.executionOn == "Branch" ? this.taxProcessForm.controls.processBranchId.value : 0;
      formData.processDepartmentId = formData.executionOn == "Department" ? this.taxProcessForm.controls.processDepartmentId.value : 0;

      this.logger("formData >>>", formData);

      this.incomeTaxProcessService.taxProcess(formData).subscribe(response => {
        this.btnProcess = false;
        if (response.status) {
          this.showPage();
          this.utilityService.success(response.msg, "Server Response");
          this.modalService.service.dismissAll();
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
  searchByMonth: any = 0;
  searchByYear: any = this.utilityService.currentYear;
  getTaxProcessSummeryInfos() {

    this.incomeTaxProcessService.getIncomeTaxProcessInfo({ fiscalYearId: this.searchByFiscalYearId, month: this.searchByMonth, year: this.searchByYear }).subscribe(response => {
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

  //#region employee-tax-process-detail

  searchByEmployeeId_taxdetail: number = 0;
  searchByBranchId_taxdetail: number = 0;
  searchByFiscalYear_taxdetail: number = 0;
  searchByMonth_taxdetail: number = 0;
  searchByYear_taxdetail: number = 0;
  searchBySalaryProcessId_taxdetail: number = 0;

  taxSheet_fiscalYear: number = 0;
  taxSheet_month: number = 0;
  taxSheet_year: number = 0;

  openEmployeeTaxProcessDetailInfosModal(fiscalYearId: number, salaryProcessId: number, month: number, year: number) {
    if (fiscalYearId > 0 && month > 0 && year > 0) {
      this.modalService.open(this.employeeIncomeTaxProcessInfoModal, "xl");
      this.taxSheet_fiscalYear = fiscalYearId;
      this.taxSheet_month = month;
      this.taxSheet_year = year;
      this.searchByEmployeeId_taxdetail = 0;
      this.searchByFiscalYear_taxdetail = fiscalYearId;
      this.searchByMonth_taxdetail = month;
      this.searchByYear_taxdetail = year;
      this.searchBySalaryProcessId_taxdetail = salaryProcessId;

      this.getEmployeeTaxProcessDetailInfos();
    }
  }

  employee_changed_in_tax_details() {
    this.getEmployeeTaxProcessDetailInfos();
  }

  listOfEmployeeTaxProcessDetailInfos: any[] = [];
  listOfEmployeeTaxProcessDetailInfoDTLabel: string = null;
  getEmployeeTaxProcessDetailInfos() {
    this.listOfEmployeeTaxProcessDetailInfos = [];

    this.incomeTaxProcessService.getIncomeTaxProcessDetail({
      employeeId: this.utilityService.IntTryParse(this.searchByEmployeeId_taxdetail),
      fiscalYearId: this.searchByFiscalYear_taxdetail,
      month: this.searchByMonth_taxdetail,
      year: this.searchByYear_taxdetail,
      branchId: this.searchByBranchId_taxdetail,
      salaryProcessId: this.searchBySalaryProcessId_taxdetail
    }).subscribe(response => {
      if (response.body.length == 0) {
        this.listOfEmployeeTaxProcessDetailInfos = null;
      }
      else {
        this.listOfEmployeeTaxProcessDetailInfos = response.body;
      }
    }, (error: any) => {
      this.utilityService.httpErrorHandler(error);
    })
  }
  //#endregion

  //#region Download Tax-Card
  downloadTaxCard(employeeId: number, taxProcessId: number, fiscalYearId: number, month: number, year: number) {
    let params = { employeeId: employeeId, taxProcessId: taxProcessId, fiscalYearId: fiscalYearId, month: month, year: year };
    this.incomeTaxProcessService.downloadTaxCard(params).subscribe(response => {
      this.utilityService.downloadFile(response, 'application/pdf', 'Tax Card.pdf')
    }, (error) => {
      this.utilityService.fail("Something went wrong", "Server Response")

    })
  }
  //#endregion

  //#region TaxSheet Download
  DownloadTaxSheet(format: string) {
    alert(format);
    return;
    this.areasHttpService.observable_get((ApiArea.payroll + ApiController.tax + "/DownloadTaxSheet"), {
      responseType: 'blob',
      params: { fiscalYearId: this.taxSheet_fiscalYear, month: this.taxSheet_month, year: this.taxSheet_year, format: format }
    }).subscribe((response: any) => {
      if (response.size > 64) {
        var blob = new Blob([response], { type: response.type });
        let url = window.URL.createObjectURL(blob);

        var file_link = document.createElement('a');
        file_link.href = url;
        window.open(url, '_blank');
      }
      else {
        this.utilityService.warning("No file found")
      }
    }, (error) => {
      this.utilityService.fail("Something went wrong", "Server Response")

    })
  }
  //#endregion

  // delete tax

  delete_fiscalyear_id: number = 0;
  delete_salary_month: number = 0;
  delete_salary_year: number = 0;
  delete_salary_process_id: number = 0;
  delete_salary_process_batch_no: string = "";

  showHideDeleteModal: boolean = false;
  showDeleteModal(fiscalYearId: number, salaryProcessId: number, batchNo: string, month: number, year: number) {
    this.showHideDeleteModal = true;
    this.delete_fiscalyear_id = fiscalYearId;
    this.delete_salary_process_id = salaryProcessId;
    this.delete_salary_month = month;
    this.delete_salary_year = year;
    this.delete_salary_process_batch_no = batchNo;
  }

  hideDeleteModal(reason: any) {
    this.showHideDeleteModal = false;
    this.delete_fiscalyear_id = 0;
    this.delete_salary_month = 0;
    this.delete_salary_year = 0;
    this.delete_salary_process_id = 0;
    this.delete_salary_process_batch_no = "";
    if (reason == 'Successful') {
      this.getTaxProcessSummeryInfos();
    }
  }

  //#region Tax Details Sheet

  ddlYears: any = this.utilityService.getYears(2);
  ddlMonths: any = this.utilityService.getMonths();

  taxSheetDetailsForm: FormGroup;
  jsonKeys: any[] = [];
  listOfTaxSheetDetailsInfo: any[] = [];
  getTaxSheetDetailsInfo() {
    this.areasHttpService.observable_get<any>((ApiArea.payroll + ApiController.tax + "/GetTaxSheetDetailsInfo"), {
      responseType: "json", params: this.taxSheetDetailsForm.value
    }).subscribe((response) => {
      this.jsonKeys = [];
      console.log("response >>>", response);
      if (response != null) {
        this.listOfTaxSheetDetailsInfo = JSON.parse(response?.json);
        if (this.listOfTaxSheetDetailsInfo != null && this.listOfTaxSheetDetailsInfo.length > 0) {
          this.jsonKeys = Object.keys(this.listOfTaxSheetDetailsInfo[0]);
        }
      }
    },
      (error) => { this.utilityService.httpErrorHandler(error) }
    )
  }

  taxSheetDetailsFormInit() {
    this.taxSheetDetailsForm = this.fb.group({
      fiscalYearId: new FormControl(0),
      salaryMonth: new FormControl(0),
      salaryYear: new FormControl(0),
      format: new FormControl('.xlsx')
    })

    this.taxSheetDetailsForm.valueChanges.subscribe((value) => {
      //this.getTaxSheetDetailsInfo();
    })
  }


  downloadTaxSheetDetailsExcel(fiscalYearId: number, month: number, year: number, format: string) {
    let params = { employeeId: 0, fiscalYearId: fiscalYearId, salaryMonth: month, salaryYear: year, salaryProcessId: 0, salaryProcessDetailId: 0, format: format };
    let monthName = this.utilityService.getMonthName(month);
    let fileName = `TaxSheetDetails_${monthName}_${year}.xlsx`;
    this.incomeTaxReportService.downloadTaxSheetDetailsExcel(params).subscribe((response) => {
      if (response.size > 0) {
        var blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
      }
      else {
        this.utilityService.warning("No file found")
      }
    },
      (error) => { this.utilityService.httpErrorHandler(error) }
    )
  }


  downloadEmployeeTaxSheet(format: string) {
    let params = { employeeId: this.searchByEmployeeId_taxdetail, fiscalYearId: this.taxSheet_fiscalYear, salaryMonth: this.taxSheet_month, salaryYear: this.taxSheet_year, salaryProcessId: 0, salaryProcessDetailId: 0, format: format };
    let month = this.taxSheet_month;
    let year = this.taxSheet_year;
    let monthName = this.utilityService.getMonthName(month);
    let fileName = `TaxSheetDetails_${monthName}_${year}.xlsx`;
    this.incomeTaxReportService.downloadTaxSheetDetailsExcel(params).subscribe((response) => {
      if (response.size > 0) {
        var blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
      }
      else {
        this.utilityService.warning("No file found")
      }
    },
      (error) => { this.utilityService.httpErrorHandler(error) }
    )
  }


  //#region  UploadTaxDeductedAmount

  tax_month: number = 0;
  tax_year: number = 0;

  openActaulTaxDeductedModal(fiscalYearId: number, salaryProcessId: number, month: number, year: number) {
    if (fiscalYearId > 0 && month > 0 && year > 0) {
      this.modalService.open(this.actaulTaxDeductedModal, "xl");
      this.searchByEmployeeId_taxdetail = 0;
      this.tax_month = month;
      this.tax_year = year;
      this.getEmployeeTaxProcessDetailInActualTaxDeductionUploadInfos(0, fiscalYearId, salaryProcessId, month, year, 0);
      this.getMonths();
      this.getYears();
      this.clearControl();
    }
  }

  downloadExcelFile() {
    let params = { fileName: "Upload_Tax_Deducted_Amount.xlsx" };
    this.incomeTaxReportService.downloadTaxDeductionExcel(params).subscribe((response: any) => {
      console.log("file response >>>", response);
      if (response.size > 0) {
        var blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = 'Tax_Deducted_Amount_Upload.xlsx';
        link.click();

      }
      else {
        this.utilityService.warning("No Excel File found");
      }
    }, (error) => {
      this.utilityService.fail("Something went wrong", "Server Response")

    })

  }

  fileExtension(fileName: string) {
    var name = fileName.split('.')
    return name[1].toString();
  }

  excelFileName: string = "Choose Your excel file";
  excelFile: any = null;
  excelFileUpload(file: any) {
    this.excelFile = null;
    const selectedFile = (file.target as HTMLInputElement).files[0];
    if (selectedFile != null && selectedFile != undefined && (this.fileExtension(selectedFile.name) == 'xls' ||
      this.fileExtension(selectedFile.name) == 'xlsx')) {
      this.excelFileName = selectedFile.name;
      this.excelFile = selectedFile;
    }
    else {
      this.excelFileName = "Choose Your excel file";
    }
  }


  uploadExcelFile() {
    if (this.excelFile != null) {
      var formData = new FormData();
      formData.append('File', this.excelFile);
      formData.append('SalaryMonth', this.tax_month.toString());
      formData.append('SalaryYear', this.tax_year.toString());

      console.log("formData >>>", formData);
      this.incomeTaxReportService.uploadActualTaxDeductionExcel(formData).subscribe(response => {
        if (response.status == true) {
          this.utilityService.success(response.msg, "Server Response")
        }
        else {
          if (response.msg == "Validation Error") {
            this.utilityService.fail(response.errors?.duplicate, "Server Response", 5000);
          }
          else {
            this.utilityService.fail(response.msg, "Server Response")
          }
        }

      }, (error) => {
        console.log("error >>>", error);
        this.utilityService.fail("Something went wrong", "Server Response");
      })
    }
    else {
      this.utilityService.fail("Invalid Form", 'Site Response');
    }

  }

  listOfEmployeeTaxProcessDetailInfosInActualTaxDeductionUpload: any[] = [];
  listOfEmployeeTaxProcessDetailInfosInActualTaxDeductionUploadDTLabel: string = null;
  getEmployeeTaxProcessDetailInActualTaxDeductionUploadInfos(employeeId: number, fiscalYearId: number, salaryProcessId: number, month: number, year: number, branchId: number) {
    this.listOfEmployeeTaxProcessDetailInfosInActualTaxDeductionUpload = [];

    this.incomeTaxProcessService.getIncomeTaxProcessDetail({
      employeeId: employeeId,
      fiscalYearId: fiscalYearId,
      month: month,
      salaryProcessId: salaryProcessId,
      year: year,
      branchId: branchId
    }).subscribe(response => {
      if (response.body.length == 0) {
        this.listOfEmployeeTaxProcessDetailInfosInActualTaxDeductionUpload = null;
      }
      else {
        this.listOfEmployeeTaxProcessDetailInfosInActualTaxDeductionUpload = response.body;
      }
    }, (error: any) => {
      this.utilityService.httpErrorHandler(error);
    })
  }

  showTaxProcessModal: boolean = false;
  openTaxProcessModal() {
    this.showTaxProcessModal = true;
  }

  closeTaxProcessModal(reason: any) {
    this.showTaxProcessModal = false;
    this.getTaxProcessSummeryInfos();
  }

  downloadScheduleFile(fileName: string) {
    let params = { fileName: fileName };
    this.webFileService.downloadFormatExcelFile(params).subscribe(
      {
        next: (response) => {
          if (response.size > 0) {
            this.utilityService.downloadFile(response, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', fileName)
          }
        },
        error: (error) => {
        }
      }
    );
  }


  bulkTaxCardDownload(salaryProcessId: any, salaryMonth: any, salaryYear: any) {
    let params = { salaryProcessId: salaryProcessId, month: salaryMonth, year: salaryYear };
    let fileName = this.utilityService.getMonthName(salaryMonth) + "_" + salaryYear.toString();
    this.incomeTaxReportService.bulkTaxCardDownload(params).subscribe(
      {
        next: (response) => {
          if (response.size > 0) {
            this.utilityService.downloadFile(response, 'application/zip', "BulkTaxCard_" + fileName + ".zip")
          }
        },
        error: (error) => {
        }
      }
    );
  }

  //Upload Tax Challan
  showUploadTaxChallanModal: boolean = false;
  tax_challan_fiscalyear_id: number = 0;
  tax_challan_salary_month: number = 0;
  tax_challan_salary_year: number = 0;
  tax_challan_salary_process_id: number = 0;
  openUploadTaxChallanModal(fiscalYearId: number, month: number, year: number) {
    this.showUploadTaxChallanModal = true;
    this.tax_challan_fiscalyear_id = fiscalYearId;
    this.tax_challan_salary_month = month;
    this.tax_challan_salary_year = year;
    this.tax_challan_salary_process_id = 0;
  }

  closeUploadTaxChallanModal(reason: any) {
    this.showUploadTaxChallanModal = false;
    this.tax_challan_fiscalyear_id = 0;
    this.tax_challan_salary_month = 0;
    this.tax_challan_salary_year = 0;
    this.tax_challan_salary_process_id = 0;
    if (reason == this.utilityService.SuccessfullySaved) {
      this.getTaxProcessSummeryInfos();
    }
  }


  //Bulk Tax Challan Insert
  showBulkTaxChallanModal: boolean = false;
  total_employee_in_salary_tax_process: number = 0;
  openBulkTaxChallanModal(fiscalYearId: number, salaryProcessId: number, month: number, year: number) {
    console.log("showBulkTaxChallanModal >>>", this.showBulkTaxChallanModal);
    this.showBulkTaxChallanModal = true;
    this.tax_challan_fiscalyear_id = fiscalYearId;
    this.tax_challan_salary_month = month;
    this.tax_challan_salary_year = year;
    this.tax_challan_salary_process_id = salaryProcessId;
  }

  closeBulkTaxChallanModal(reason: any) {
    this.showBulkTaxChallanModal = false;
    this.tax_challan_fiscalyear_id = 0;
    this.tax_challan_salary_month = 0;
    this.tax_challan_salary_year = 0;
    this.tax_challan_salary_process_id = 0;
    if (reason == this.utilityService.SuccessfullySaved) {
      this.getTaxProcessSummeryInfos();
    }
  }


  //#region final tax process modal
  showFinalTaxProcessModal: boolean = false;
  openFinalTaxProcessModal() {
    this.showFinalTaxProcessModal = true;
  }

  closeFinalTaxProcessModal(reason: any) {
    this.showFinalTaxProcessModal = false;
    this.getFinalTaxProcess();
  }
  //#endregion final tax process modal

  //#region final tax process summary
  searchByFiscalYear_in_final_tax_process: any = 0;
  searchByBranch_in_final_tax_process: any = 0;
  list_of_final_tax_summary: any = null
  getFinalTaxProcess() {
    this.list_of_final_tax_summary = null;
    this.finalTaxCardService.getFinalTaxProcessSummary({
      fiscalYearId: this.utilityService.IntTryParse(this.searchByFiscalYear_in_final_tax_process),
      branchId: this.utilityService.IntTryParse(this.searchByBranch_in_final_tax_process),
    }).subscribe({
      next: (response) => {
        this.list_of_final_tax_summary = response.body;
      },
      error: (error) => {
        console.log("error >>>", error)
      }
    })
  }

  showFinalTaxDetailModal: boolean = false;
  fiscalYearId_finalTaxDetail: number = 0;
  branchId_finalTaxDetail: number = 0;
  branchName_finalTaxDetail: string = "";
  year_finalTaxDetail: number = 0;
  openFinalTaxDetailModal(fiscalYearId: number, branchId: number, branchName: string, year: number) {
    this.showFinalTaxDetailModal = true;
    this.branchName_finalTaxDetail = branchName;
    this.fiscalYearId_finalTaxDetail = fiscalYearId;
    this.branchId_finalTaxDetail = branchId;
    this.year_finalTaxDetail = year;
  }

  closeFinalTaxDetailModal(reason: any) {
    this.showFinalTaxDetailModal = false;
    this.fiscalYearId_finalTaxDetail = 0;
    this.branchId_finalTaxDetail = 0;
    this.branchName_finalTaxDetail = "";
    this.getFinalTaxProcess();
  }

  download108Report() {
    if (this.searchByFiscalYear_in_final_tax_process > 0) {
      this.finalTaxCardService.download108Report({ fiscalYearId: this.searchByFiscalYear_in_final_tax_process }).subscribe({
        next: (response) => {
          if (response instanceof Blob) {
            if (response.size > 0) {
              this.utilityService.downloadFile(response, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', "108_Report.xlsx")
            }
          }
          else {
            this.utilityService.fail('No data available for report', "Server Response");
          }
        },
        error: (error) => {
          console.log("error in download108Report>>>", error);
          //this.utilityService.httpErrorHandler()
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
      this.utilityService.fail("Please select fiscal year", "Site Response");
    }
  }
  //#endregion final tax process summary

}
