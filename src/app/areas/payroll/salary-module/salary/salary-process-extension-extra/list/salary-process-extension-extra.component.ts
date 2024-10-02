import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { ApiArea } from 'src/app/shared/constants';
import { CustomModalService } from 'src/app/shared/services/custom-modal.service';
import { HrWebService } from 'src/app/shared/services/hr-web.service';
import { UserService } from 'src/app/shared/services/user.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AreasHttpService } from '../../../../../areas.http.service';
import { trigger, transition, useAnimation } from '@angular/animations';
import { slideInUp } from 'ng-animate';
import { TypeaheadMatch } from 'ngx-bootstrap/typeahead';
import { EmployeeInfoService } from 'src/app/areas/employee_module/employee/employee-info.service';
import { SalaryProcessService } from '../salary-process.service';
import { SalaryReportService } from '../salary-report.service';
import { error } from 'console';
import { ControlPanelWebService } from 'src/app/shared/services/control-panel.service';
import { IncomeTaxReportService } from 'src/app/areas/payroll/tax-module/income-tax-process/income-tax-report.service';

@Component({
  selector: 'app-salary-process-extension-extra',
  templateUrl: './salary-process-extension-extra.component.html',
  animations: [
    trigger('slideInUp', [transition('* => *', useAnimation(slideInUp, { params: { timing: 0.5 } }))])
  ],
})

export class SalaryProcessExtensionExtraComponent implements OnInit {

  @ViewChild('salaryProcessCheckingModal', { static: true }) salaryProcessCheckingModal!: ElementRef;

  constructor(private datepipe: DatePipe, private fb: FormBuilder, private areasHttpService: AreasHttpService,
    private utilityService: UtilityService, private hrWebService: HrWebService,
    private userService: UserService, public modalService: CustomModalService,
    private salaryProcessService: SalaryProcessService,
    private employeeInfoService: EmployeeInfoService,
    private salaryReportService: SalaryReportService,
    private controlPanelWebService: ControlPanelWebService,
    private incomeTaxReportService: IncomeTaxReportService
  ) {
  }

  datePickerConfig: Partial<BsDatepickerConfig> = this.utilityService.datePickerConfig();
  isViewPage: boolean = true;

  pagePrivilege: any = this.userService.getPrivileges();

  ngOnInit(): void {


    this.salaryProcessInfoSearchFormInit();
    this.salaryProcessDetailFormInit();
    this.salarySheetFormInit();

    this.getSalaryProcessInfos();
    this.getSalaryProcessDetails();
    this.getSalarySheetInfos();
    this.getMonths();
    this.loadBranches();
    this.loadSalaryProcessBatchNoDropdown();

    this.pagePrivilege = this.userService.getPrivileges();
    console.log("pagePrivilege >>>", this.pagePrivilege);
  }

  branches: any[] = [];
  loadBranches() {
    this.branches = [];
    this.controlPanelWebService.getBranchExtension<any[]>('1').then((data) => {
      this.branches = data;
    })
  }


  months: any[] = [];
  getMonths() {
    this.months = this.utilityService.getMonths()
  }

  select2Options = this.utilityService.select2Config();

  logger(msg: any, options: any) {
    this.utilityService.consoleLog(msg, options);
  }

  User() {
    return this.userService.User();
  }

  ddlYears: any = this.utilityService.getYears(2);
  ddlMonths: any = this.utilityService.getMonths();

  //#region Salary Process Information List
  listOfsalaryProcess: any[] = [];
  salaryProcessInfoSearchForm: FormGroup;
  salaryProcessInfoSearchFormInit() {
    this.salaryProcessInfoSearchForm = this.fb.group({
      salaryProcessId: new FormControl(0),
      batchNo: new FormControl(''),
      month: new FormControl(0),
      year: new FormControl(0),
    })
    this.salaryProcessInfoSearchForm.valueChanges.subscribe((item) => {
      this.getSalaryProcessInfos();
    })
  }

  getSalaryProcessInfos() {
    this.salaryProcessService.getSalaryProcessInfos(this.salaryProcessInfoSearchForm.value).subscribe(response => {
      this.listOfsalaryProcess = response.body;
    }, (error) => {
      console.log("error >>>", error);
      this.utilityService.fail("Something went wrong", "Server Response");
    })
  }
  //#endregion Salary Process Information List

  //#region Salary Process Details


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

  salaryProcessDetailSearchForm: FormGroup;
  salaryProcessDetail_pageNumber: number = 1;
  salaryProcessDetail_pageSize: number = 15;
  salaryProcessDetailConfig: any = this.userService.pageConfigInit("employeeList", this.salaryProcessDetail_pageSize, 1, 0);


  salaryProcessDetailFormInit() {
    this.loadEmployees();
    this.salaryProcessDetailSearchForm = this.fb.group({
      employeeId: new FormControl(0),
      batchNo: new FormControl(''),
      month: new FormControl(0),
      branchId: new FormControl(0),
      year: new FormControl(0),
      pageSize: new FormControl(this.salaryProcessDetail_pageSize),
      pageNumber: new FormControl(this.salaryProcessDetail_pageNumber),
    })

    this.salaryProcessDetailSearchForm.get('employeeId').valueChanges.subscribe((item) => {
      this.resetPage();
      this.getSalaryProcessDetails();
    })

    this.salaryProcessDetailSearchForm.get('batchNo').valueChanges.subscribe((item) => {
      this.resetPage();
      this.getSalaryProcessDetails();
    })


    this.salaryProcessDetailSearchForm.get('month').valueChanges.subscribe((item) => {
      this.resetPage();
      this.getSalaryProcessDetails();
    })

    this.salaryProcessDetailSearchForm.get('year').valueChanges.subscribe((item) => {
      this.resetPage();
      this.getSalaryProcessDetails();
    })

    this.salaryProcessDetailSearchForm.get('branchId').valueChanges.subscribe((item) => {
      this.resetPage();
      this.getSalaryProcessDetails();
    })
  }

  resetPage() {
    this.salaryProcessDetailSearchForm.get('pageNumber').setValue(1);
  }

  salaryProcessDetail_PageChanged(event: any) {
    this.salaryProcessDetail_pageNumber = event;
    this.salaryProcessDetailSearchForm.get('pageNumber').setValue(this.salaryProcessDetail_pageNumber);
    this.getSalaryProcessDetails();
  }

  listOfSalaryProcessDetail: any[] = []

  getSalaryProcessDetails() {
    let formValues = this.salaryProcessDetailSearchForm.value;
    formValues.employeeId = formValues.employeeId == null ? 0 : formValues.employeeId;
    this.salaryProcessService.getSalaryProcessDetails(formValues).subscribe(response => {
      this.listOfSalaryProcessDetail = response.body;
      var xPaginate = JSON.parse(response.headers.get('X-Pagination'));
      this.salaryProcessDetailConfig = this.userService.pageConfigInit("salaryProcessDetailList", xPaginate.itemsPerPage, xPaginate.currentPage, xPaginate.totalItems);
    }, (error) => {
      console.log("error >>>", error);
      this.utilityService.fail("Something went wrong", "Server Response");
    })
  }
  //#endregion Salary Process Deails


  //#region Salary Sheet

  salarySheetForm: FormGroup;
  jsonKeys: any[] = [];
  listOfSalarySheetInfo: any[] = [];
  getSalarySheetInfos() {
    let month = this.utilityService.IntTryParse(this.salarySheetForm.get('salaryMonth').value);
    let year = this.utilityService.IntTryParse(this.salarySheetForm.get('salaryYear').value);
    if (month > 0 && year > 0) {
      this.salaryReportService.getSalarySheet(this.salarySheetForm.value).subscribe(response => {
        if (response.body != null) {
          this.listOfSalarySheetInfo = JSON.parse(response.body?.json);
          if (this.listOfSalarySheetInfo != null && this.listOfSalarySheetInfo.length > 0) {
            let maxPropertiesCount = -1;
            let maxPropertiesIndex = -1;

            this.listOfSalarySheetInfo.forEach((obj, index) => {
              const propertiesCount = Object.keys(obj).length;

              if (propertiesCount > maxPropertiesCount) {
                maxPropertiesCount = propertiesCount;
                maxPropertiesIndex = index;
              }
            });

            this.jsonKeys = Object.keys(this.listOfSalarySheetInfo[maxPropertiesIndex]);
            console.log('this.jsonKeys', this.jsonKeys);
          }
        }
      }, (error) => {
        this.utilityService.httpErrorHandler(error)
      })
    }
  }

  salarySheetFormInit() {
    this.salarySheetForm = this.fb.group({
      salaryProcessId: new FormControl(0),
      employeeId: new FormControl(0),
      salaryBatch: new FormControl(''),
      salaryMonth: new FormControl(0),
      salaryYear: new FormControl(0),
      salaryType: new FormControl(''),
      format: new FormControl('.xlsx'),
      branchId: new FormControl(0)
    })

    this.salarySheetForm.valueChanges.subscribe((value) => {
      this.getSalarySheetInfos();
    })
  }


  downloadSalarySheetExcel(format: string) {
    let params = Object.assign({}, this.salarySheetForm.value);
    params.format = format;
    let month = this.utilityService.IntTryParse(params.salaryMonth);
    let year = this.utilityService.IntTryParse(params.salaryYear);

    if (month > 0 && year > 0) {
      let monthName = this.utilityService.getMonthName(month);
      let fileName = `Default_SalarySheet_${monthName}_${year}.xlsx`;

      this.salaryReportService.downloadSalarySheet(params).subscribe(response => {
        console.log("response >>>", response);
        if (response.size > 64) {
          var blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          const link = document.createElement('a');
          link.href = window.URL.createObjectURL(blob);
          link.download = fileName;
          link.click();
        }
      }, (error) => {
        this.utilityService.httpErrorHandler(error)
      })
    }
  }


  downloadActualSalarySheet() {
    let params = Object.assign({}, this.salarySheetForm.value);
    params.format = "xlsx";
    let month = this.utilityService.IntTryParse(params.salaryMonth);
    let year = this.utilityService.IntTryParse(params.salaryYear);
    let salaryType = params.salaryType;

    if (month > 0 && year > 0) {
      let monthName = this.utilityService.getMonthName(month);
      let fileName = `SalarySheet_${salaryType}_${monthName}_${year}.xlsx`;
      this.salaryReportService.downloadActualSalarySheet(params).subscribe((response) => {
        if (response.size > 0) {
          var blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          const link = document.createElement('a');
          link.href = window.URL.createObjectURL(blob);
          link.download = fileName;
          link.click();
        }
      }, (error) => {
        this.utilityService.httpErrorHandler(error)
      })
    }

  }
  //#endregion


  //#region Salary Process modal
  showSalaryProcessModal: boolean = false;
  openProcessModal() {
    console.log("openProcessModal clicked");
    this.showSalaryProcessModal = true;
  }

  closeProcessModal(reason: any) {
    this.showSalaryProcessModal = false;
    if (reason = 'Save Complete') {
      this.getSalaryProcessInfos();
      this.getSalaryProcessDetails();
    }
  }
  //#endregion

  //#region Salary Process Details Modal
  showSalaryProcessDetailModal: boolean = false;
  salaryProcessId: number = 0;
  openModal(id) {
    console.log("Open modal clicked");
    this.salaryProcessId = id;
    this.showSalaryProcessDetailModal = true;
  }

  closeSalaryProcessDetailModal(reason: any) {
    this.salaryProcessId = 0;
    this.showSalaryProcessDetailModal = false;
  }

  //#endregion Salary Process Details Modal

  //#region Salary Process Disbursed Modal
  showSalaryProcessDisbursedModal: boolean = false;
  openSalaryProcessStatusModal(id: any) {
    console.log("id >>>", id);
    this.showSalaryProcessDisbursedModal = true;
    this.salaryProcessId = id;
  }

  closeSalaryProcessStatusModal(reason: any) {
    this.showSalaryProcessDisbursedModal = false;
    this.salaryProcessId = 0;
    if (reason == 'Save Complete') {
      this.getSalaryProcessInfos();
    }
  }
  //#endregion Salary Process Disbursed Modal

  //#region Employee Salary Allowance Modal
  showEmployeeSalaryAllowanceDeductionModal: boolean = false;
  salaryProcessDetailId_SalaryAllowance: number = 0;
  employeeId_SalaryAllowance: number = 0;
  openEmployeeSalaryAllowanceDeductionModal(employeeId: any, processDetailId: any) {
    console.log("openProcessModal clicked");
    this.showEmployeeSalaryAllowanceDeductionModal = true;
    this.employeeId_SalaryAllowance = employeeId;
    this.salaryProcessDetailId_SalaryAllowance = processDetailId;
  }

  closeEmployeeSalaryAllowanceDeductionModal(reprocessDone: any) {
    this.showEmployeeSalaryAllowanceDeductionModal = false;
    if (reprocessDone == true) {
      this.getSalaryProcessDetails()
      this.getSalaryProcessInfos();
    }
    this.employeeId_SalaryAllowance = 0;
    this.salaryProcessDetailId_SalaryAllowance = 0;
  }
  //#endregion Employee Salary Allowance Modal

  ddlSalaryProcessBatchNo: any[] = [];
  loadSalaryProcessBatchNoDropdown() {
    this.salaryProcessService.getSalaryProcessBatchNoDropdown({ isDisbursed: "" }).then(data => {
      this.ddlSalaryProcessBatchNo = data;
    }, (error) => {
      this.utilityService.httpErrorHandler(error);
    })
  }

  //#region Emailing
  showEmailingModal: boolean = false;
  salaryMonthInMailing: number = 0;
  salaryYearInMailing: number = 0;
  openEmailingModal(month: number, year: number) {
    this.showEmailingModal = true;
    console.log("month >>>", month);
    console.log("year >>>", year);
    this.salaryMonthInMailing = month;
    this.salaryYearInMailing = year;
  }

  closeEmailingModal(reason: any) {
    this.showEmailingModal = false;
    this.salaryMonthInMailing = 0;
    this.salaryYearInMailing = 0;
  }
  //#endregion

  //#region Added By Monzur
  //#Added by Monzur

  fromDate: string = null;
  toDate: string = null;
  salaryDateRange: string[] = null;

  resetOtherProps() {
    this.fromDate = null;
    this.toDate = null;
    this.salaryDateRange = null;
  }

  executionOn: string = '';
  executionOn_changed() {
    if (this.allEmployeeSalarySheetForm != null || this.allEmployeeSalarySheetForm instanceof FormGroup) {
      this.allEmployeeSalarySheetForm = null;
    }
    if (this.departmentWiseSalarySheetForm != null || this.departmentWiseSalarySheetForm instanceof FormGroup) {
      this.departmentWiseSalarySheetForm = null;
    }
    if (this.selectedEmployeestWiseSalarySheetForm != null || this.selectedEmployeestWiseSalarySheetForm instanceof FormGroup) {
      this.selectedEmployeestWiseSalarySheetForm = null;
    }
    if (this.executionOn == 'All') {
      this.allEmployeeSalaryProcessFormInit();
    }
    else if (this.executionOn == 'Department') {
      this.loadDepartments();
      this.departmentWiseSalarySheetFormInit();
    }
    else if (this.executionOn == 'Selected Employees') {
      this.loadDateWiseEmployees();
      this.selectedEmployeesDateWiseFormInit();
    }
  }

  salaryDateRange_changed() {
    if (this.executionOn == 'All') {
      this.allEmployeeSalarySheetForm.get('salaryDateRange').setValue(this.salaryDateRange);
    }
    else if (this.executionOn == 'Selected Employees') {
      this.selectedEmployeestWiseSalarySheetForm.get('salaryDateRange').setValue(this.salaryDateRange);
    }
  }



  //#region All employees...
  allEmployeeSalarySheetForm: FormGroup;
  allEmployeeSalaryProcessFormInit() {
    this.allEmployeeSalarySheetForm = this.fb.group({
      fromDate: new FormControl(this.fromDate, [Validators.required]),
      toDate: new FormControl(this.toDate, [Validators.required]),
      executionOn: new FormControl(this.executionOn)
    })
  }
  //#endregion .................

  //#region Department

  departmentWiseSalarySheetForm: FormGroup;
  departmentId: string = "0";
  departments: any[] = [];

  salaryDepartment_changed() {
    this.departmentWiseSalarySheetForm.get('departmentId').setValue(parseInt(this.departmentId));
  }

  loadDepartments() {
    this.departments = [];
    this.hrWebService.getDepartments<any[]>().then((data) => {
      this.departments = data;

    })
  }

  departmentWiseSalarySheetFormInit() {
    this.departmentWiseSalarySheetForm = this.fb.group({
      departmentId: new FormControl(0, [Validators.min(1)]),
      fromDate: new FormControl(this.fromDate, [Validators.required]),
      toDate: new FormControl(this.toDate, [Validators.required]),
      executionOn: new FormControl(this.executionOn),
    })
  }
  //#endregion Department


  selectedEmployee?: string;
  employees: any[] = [];
  loadDateWiseEmployees() {
    this.hrWebService.getEmployeeExtensionOne<any[]>().then((data) => {
      this.employees = data;
      //console.log("this.employees >>>", this.employees);
    })
  }

  employeesList: any[] = [];
  selected?: string;
  selectedEmployeestWiseSalarySheetForm: FormGroup;
  selectedEmployeesDateWiseFormInit() {
    this.selectedEmployeestWiseSalarySheetForm = this.fb.group({
      selectedEmployees: new FormControl(this.selectedEmployees, [Validators.required]),
      fromDate: new FormControl(this.fromDate, [Validators.required]),
      toDate: new FormControl(this.toDate, [Validators.required]),
      executionOn: new FormControl(this.executionOn),
      employeePK: new FormControl('')
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

  selectedEmployees: string = "";
  getSelectedEmployees() {
    this.selectedEmployees = "";
    this.employeesList.forEach(item => {
      this.selectedEmployees += item.id + ","
    });
    this.selectedEmployeestWiseSalarySheetForm.get('employeePK').setValue('');
    this.selectedEmployeestWiseSalarySheetForm.get("selectedEmployees").setValue(this.selectedEmployees);
  }

  btnDownloadSheet: boolean = false;
  searchByDate: any[] = [];
  searchByEmployees: any[] = [];
  searchByDepartmentId: any;

  downloadDateRangeSalarySheet() {

    let fromDate = (this.salaryDateRange != null && this.salaryDateRange.length > 0) ? this.datepipe.transform(this.salaryDateRange[0], 'yyyy-MM-dd') : "";
    let toDate = (this.salaryDateRange != null && this.salaryDateRange.length > 0) ? this.datepipe.transform(this.salaryDateRange[1], 'yyyy-MM-dd') : "";

    if (this.executionOn == "All") {
      this.btnDownloadSheet = true;

      this.executionOn = this.allEmployeeSalarySheetForm.controls.executionOn.value;
      let params = { fromDate: fromDate.toString() ?? '', toDate: toDate.toString() ?? '', format: 'xlsx' };
      let fileName = `SalarySheet_${fromDate}_To_${toDate}.xlsx`;
      this.areasHttpService.observable_get<any>((ApiArea.payroll + "/Salary/SalaryReport" + "/DownloadSalarySheet"), {
        responseType: "blob", params: params
      }).subscribe((response) => {
        if (response.size > 0) {
          var blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          const link = document.createElement('a');
          link.href = window.URL.createObjectURL(blob);
          link.download = fileName;
          link.click();
        }
        else {
          this.utilityService.warning("No Excel File found");
        }
      }, (error) => {
        this.utilityService.fail("Something went wrong", "Server Response")

      })
    }

    else if (this.executionOn == "Department") {
      this.btnDownloadSheet = true;

      this.executionOn = this.departmentWiseSalarySheetForm.controls.executionOn.value;
      this.searchByDepartmentId = this.departmentWiseSalarySheetForm.controls.departmentId.value;

      let params = { departmentId: this.searchByDepartmentId, fromDate: fromDate.toString() ?? '', toDate: toDate.toString() ?? '', format: 'xlsx' };
      let fileName = `SalarySheet_${fromDate}_${toDate}.xlsx`;
      this.areasHttpService.observable_get<any>((ApiArea.payroll + "/Salary/SalaryReport" + "/DownloadSalarySheet"), {
        responseType: "blob", params: params
      }).subscribe((response) => {
        if (response.size > 0) {
          var blob = new Blob([response], { type: 'application/octet-stream' });
          const link = document.createElement('a');
          link.href = window.URL.createObjectURL(blob);
          link.download = fileName;
          link.click();
        }
        else {
          this.utilityService.warning("No Excel File found");
        }
      }, (error) => {
        this.utilityService.fail("Something went wrong", "Server Response")

      })
    }

    else if (this.executionOn == "Selected Employees") {
      this.btnDownloadSheet = true;
      this.executionOn = this.selectedEmployeestWiseSalarySheetForm.controls.executionOn.value;
      this.searchByEmployees = this.selectedEmployeestWiseSalarySheetForm.controls.selectedEmployees.value;

      let params = { selectedEmployees: this.searchByEmployees, fromDate: fromDate.toString() ?? '', toDate: toDate.toString() ?? '', format: 'xlsx' };
      let fileName = `SalarySheet_${fromDate}_${toDate}.xlsx`;
      this.areasHttpService.observable_get<any>((ApiArea.payroll + "/Salary/SalaryReport" + "/DownloadSalarySheet"), {
        responseType: "blob", params: params
      }).subscribe((response) => {
        if (response.size > 0) {
          var blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          const link = document.createElement('a');
          link.href = window.URL.createObjectURL(blob);
          link.download = fileName;
          link.click();
        }
        else {
          this.utilityService.warning("No Excel File found");
        }
      }, (error) => {
        this.utilityService.fail("Something went wrong", "Server Response")

      })
    }
  }
  //#endregion Selected-Employee
  //#endregion

  //#region Reports
  downloadPayslip(employeeId: number, month: number, year: number) {
    if (month > 0 && year > 0 && employeeId > 0) {
      this.salaryReportService.downloadPayslip({ employeeId: employeeId, month: month, year: year }).subscribe(response => {
        if (response.body.size > 0) {
          var blob = new Blob([response.body], { type: 'application/pdf' });
          let pdfUrl = window.URL.createObjectURL(blob);
          var PDF_link = document.createElement('a');
          PDF_link.href = pdfUrl;
          window.open(pdfUrl, '_blank');
        }
        else {
          this.utilityService.warning("No Payslip found")
        }
      }, (error) => {
        this.utilityService.httpErrorHandler(error)
      })
    }
    else {
      this.utilityService.fail('Please Select Employee/Month & Year', 'Site Reponse')
    }
  }

  downloadTaxCard(employeeId: number, month: number, year: number) {
    this.incomeTaxReportService.downloadTaxCard({ employeeId: employeeId, month: month, year: year }).subscribe(response => {
      var blob = new Blob([response], { type: 'application/pdf' });
      let pdfUrl = window.URL.createObjectURL(blob);
      var PDF_link = document.createElement('a');
      PDF_link.href = pdfUrl;
      window.open(pdfUrl, '_blank');
    }, (error) => {
      this.utilityService.httpErrorHandler(error);
    })
  }
  //#endregion

  downloadBankStatement() {
    let month = this.utilityService.IntTryParse(this.salarySheetForm.get('salaryMonth').value);
    let year = this.utilityService.IntTryParse(this.salarySheetForm.get('salaryYear').value);

    let format = "csv";

    let params = {salaryMonth: month, salaryYear: year, jobtype: this.salarySheetForm.get('salaryType').value, format:format, branchId:this.salarySheetForm.get('branchId').value}
    
    let monthName = this.utilityService.getMonthName(month);
    let fileName = `BankStatement_${monthName}_${year}.xlsx`;
    this.salaryReportService.downloadBankStatement(params).subscribe((response) => {
      
      
      if (response.size > 0) {
        var blob = new Blob([response], { type: response.type });
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


}
