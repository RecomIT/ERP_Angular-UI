import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { AreasHttpService } from "src/app/areas/areas.http.service";
import { CustomModalService } from "src/app/shared/services/custom-modal.service";
import { UserService } from "src/app/shared/services/user.service";
import { UtilityService } from "src/app/shared/services/utility.service";
import { ToastrService } from 'ngx-toastr';
import { HrWebService } from 'src/app/shared/services/hr-web.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { DatePipe } from '@angular/common';
import { TypeaheadMatch } from "ngx-bootstrap/typeahead";
import { transition, trigger, useAnimation } from "@angular/animations";
import { bounceIn, fadeIn, fadeInRight, slideInUp } from "ng-animate";
import { EmployeeInfoService } from "../../employee_module/employee/employee-info.service";
import { DepartmentService } from "../../employee_module/Organizational/department/department.service";
import { LeaveTypeSerive } from "../leave-type/leave-type.service";
import { SectionService } from "../../employee_module/Organizational/section/section.service";
import { SubSectionService } from "../../employee_module/Organizational/subsection/subsection.service";
import { LeaveReportService } from "./leave-report.service";
import { ApiArea } from "src/app/shared/constants";
import { DatePickerConfigService } from "src/app/shared/services/DatePicker/date-picker-config.service";

@Component({
  selector: 'app-hr-leave-reports',
  templateUrl: './leave-reports.component.html',
  animations: [
    trigger('slideInUp', [transition('* => *', useAnimation(slideInUp, { params: { timing: 0.5 } }))]),
    trigger('fadeIn', [transition('void => *', useAnimation(fadeIn, { params: { timing: 0.3 } }))]),
    trigger('fadeInRight', [transition('void => *', useAnimation(fadeInRight, { params: { timing: 0.5 } }))]),
    trigger('bounceIn', [transition('void => *', useAnimation(bounceIn, { params: { timing: 1 } }))]),
  ]
})
export class LeaveReportsComponent implements OnInit {
  @Output() closeModalEvent = new EventEmitter<string>(); //pop-up modal cancel or add
  @ViewChild('LeaveReportsModal', { static: true }) LeaveReportsModal!: ElementRef;

  modalTitle: string = "Leave Reports";
  datePickerConfig: Partial<BsDatepickerConfig> = this.utilityService.datePickerConfig();
  searchByDate: any[] = [];
  searchByYear: any[] = [];
  employeeSearch: number = 0;
  departmentSearch: number = 0;
  sectionSearch: number = 0;
  subSectionSearch: number = 0;
  zoneSearch: number = 0;
  unitSearch: number = 0;
  isActive: boolean = true;
  httpClient: any;
  leaveTypeSearch: number = 0;
  leaveYear: string = "";
  datePickerConfigInPeriod: Partial<BsDatepickerConfig> = null;

  constructor(private fb: FormBuilder, // strongly type form build
    private areasHttpService: AreasHttpService, // http request
    private userService: UserService, // user service user id
    public utilityService: UtilityService, // utility 
    public modalService: CustomModalService, // modal service
    public toastr: ToastrService,
    private hrWebService: HrWebService,
    private datepipe: DatePipe,
    private employeeInfoService: EmployeeInfoService,
    private departmentService: DepartmentService,
    private leaveTypeSerive: LeaveTypeSerive,
    private sectionService: SectionService,
    private subSectionService: SubSectionService,
    private leaveReportService: LeaveReportService,
    private datePickerConfigService: DatePickerConfigService
  ) { }

  User() {
    return this.userService.User();
  }

  select2Options = this.utilityService.select2Config();
  ngOnInit(): void {
    this.loadReportsName();
    this.loadReportsType();
    this.loadEmployee();
    this.loadDdlDepartment();
    this.loadDdlZone();
    this.loadDdlSection();
    this.loadDdlSubSection();
    this.loadDdlUnit();
    this.loadLeaveYear();
    // this.loadDdlLeavePeriod();
    this.loadEmployeeLeaveTypes();
    this.datePickerConfigInPeriod = this.datePickerConfigService.getRangeConfig({ minMode: 'month' })
  }

  month: number = parseInt(this.utilityService.currentMonth);
  year: number = parseInt(this.utilityService.currentYear);
  ddlYears: any = this.utilityService.getYears(2);
  isButtonDisabled: boolean = true;


  theDate: string | null = null;
  clearTheDate(): void {
    this.theDate = null;
  }


  ddlEmployees: any[] = [];
  loadEmployee() {
    this.employeeInfoService.loadDropdownData({});
    this.employeeInfoService.ddl_employee_data$.subscribe(data => {
      this.employeeInfoService.loadDropdown(data);
      this.ddlEmployees = this.employeeInfoService.ddl$;
      this.employees = this.ddlEmployees;
    }, error => {
      console.error('Error while fetching data:', error);
    });
  }

  ddlLeaveTypes: any[] = []
  loadEmployeeLeaveTypes() {
    this.ddlLeaveTypes = [];
    this.leaveTypeSerive.loadLeaveTypeDropdown();
    this.leaveTypeSerive.ddl$.subscribe(data => {
      this.ddlLeaveTypes = data;
    });
  }

  ddlDepartment: any[] = [];
  loadDdlDepartment() {
    this.ddlDepartment = [];
    this.departmentService.loadDepartmentDropdown();
    this.departmentService.ddl$.subscribe(data => {
      this.ddlDepartment = data;
    });
  }

  ddlZone: any[] = [];
  loadDdlZone() {
    this.ddlZone = [];
  }

  ddlSection: any[] = [];
  loadDdlSection() {
    this.ddlSection = [];
    this.sectionService.loadSectionDropdown({});
    this.sectionService.ddl$.subscribe(data => {
      this.ddlSection = data;
    });
  }

  ddlSubSection: any[] = [];
  loadDdlSubSection() {
    this.ddlSubSection = [];
    this.subSectionService.loadSubSectionDropdown({});
    this.subSectionService.ddl$.subscribe(data => {
      this.ddlSubSection = data;
    });
  }

  ddlUnit: any[] = [];
  loadDdlUnit() {
    this.ddlUnit = [];

  }

  closeModal(reason: string) {
    this.modalService.service.dismissAll(reason);
    this.closeModalEvent.emit(reason); // fire
  }


  generateEmployeeLeaveCard() {

    let leaveYear = this.searchByYear;
    let fromDate = leaveYear.length > 0 ? this.datepipe.transform(leaveYear[0], "yyyy-MM-dd") : '';
    let toDate = leaveYear.length > 0 ? this.datepipe.transform(leaveYear[1], "yyyy-MM-dd") : '';
    this.searchByEmployees = this.selectedEmployeestWiseForm != null ? this.selectedEmployeestWiseForm.controls.selectedEmployees.value : "";

    let mediaType = 'application/pdf';
    if (leaveYear.length > 0) {

      this.leaveReportService.generateEmployeeLeaveCard({
        employeeId: this.searchByEmployees, departmentId: this.departmentSearch,
        sectionId: this.sectionSearch, subSectionId: this.subSectionSearch,
        fromDate: fromDate, toDate: toDate, isActive: this.isActive
      }).subscribe(response => {
        if (response.size > 0) {
          var blob = new Blob([response], { type: 'application/pdf' });
          let pdfUrl = window.URL.createObjectURL(blob);

          var PDF_link = document.createElement('a');
          PDF_link.href = pdfUrl;
          window.open(pdfUrl, '_blank');
        }
        else {
          this.utilityService.warning("No data found")
        }
      })
    }
  }

  generateEmployeeWiseLeaveBalanceSummaryReport() {
    //console.log("this.searchByYear >>", this.searchByYear);

    let leaveYear = this.searchByYear;
    // let fromDate = leaveYear.length > 0 ? this.datepipe.transform(leaveYear[0], "yyyy-MM-dd") : '';
    // let toDate = leaveYear.length > 0 ? this.datepipe.transform(leaveYear[1], "yyyy-MM-dd") : '';
    // let theDate = this.datepipe.transform(this.theDate, 'yyyy-MM-dd');

    // let formattedDate = this.datepipe.transform(this.theDate, 'yyyy-MM-dd');
    // let year = +formattedDate.split('-')[0]; 

    // let fromDate = new Date(year, 0, 1);
    // let toDate = leaveYear.length > 0 ? this.datepipe.transform(leaveYear[1], "yyyy-MM-dd") : '';

    // console.log("fromDate >>", fromDate);
    //fromDate: fromDate, toDate: toDate,

    this.searchByEmployees = this.selectedEmployeestWiseForm != null ? this.selectedEmployeestWiseForm.controls.selectedEmployees.value : "";

    this.leaveReportService.generateEmployeeWiseLeaveBalanceSummaryReport({
      employeeId: this.searchByEmployees, departmentId: this.departmentSearch, zoneId: this.zoneSearch,
      sectionId: this.sectionSearch, subSectionId: this.subSectionSearch, unitId: this.unitSearch,
      isActive: this.isActive
    }).subscribe(response => {
      console.log("response >>>", response);
      if (response.size > 0) {
        var blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = 'Employee_Wise_Leave_Balance_Summary.xlsx';
        link.click();
      }
      else {
        this.utilityService.warning("No data found")
      }
    }, (error) => {
      this.utilityService.httpErrorHandler(error);
    })

  }

  generateMonthlyLeaveReport() {
    if (this.month > 0 && this.year > 0) {
      this.leaveReportService.generateMonthlyLeaveReport({
        employeeId: this.employeeSearch, departmentId: this.departmentSearch, zoneId: this.zoneSearch,
        sectionId: this.sectionSearch, subSectionId: this.subSectionSearch, unitId: this.unitSearch,
        monthNo: this.month, monthYear: this.year
      }).subscribe(response => {
        if (response.size > 0) {
          var blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          const link = document.createElement('a');
          link.href = window.URL.createObjectURL(blob);
          link.download = 'Monthly_Leave_Report.xlsx';
          link.click();
        }
        else {
          this.utilityService.warning("No data found")
        }
      }, (error) => {
        this.utilityService.httpErrorHandler(error);
      })
    }
  }

  generateIndividualYearlyStatusReport() {
    let leaveYear = this.searchByYear;
    //console.log("leaveYear [] >>>>", leaveYear);
    let fromDate = leaveYear.length > 0 ? this.datepipe.transform(leaveYear[0], "yyyy-MM-dd") : '';
    //console.log("fromDate [] >>>>", fromDate);
    let toDate = leaveYear.length > 0 ? this.datepipe.transform(leaveYear[1], "yyyy-MM-dd") : '';
    //console.log("toDate [] >>>>", toDate);

    this.leaveReportService.generateIndividualYearlyStatusReport({
      employeeId: this.employeeSearch, departmentId: this.departmentSearch, zoneId: this.zoneSearch,
      sectionId: this.sectionSearch, subSectionId: this.subSectionSearch, unitId: this.unitSearch,
      monthNo: this.month, monthYear: this.year, leaveTypeId: this.leaveTypeSearch, fromDate: fromDate, toDate: toDate,
    }).subscribe(response => {
      if (response.size > 0) {
        var blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = 'Individual_Yearly_Status.xlsx';
        link.click();
      }
      else {
        this.utilityService.warning("No data found")
      }
    }, (error) => {
      this.utilityService.httpErrorHandler(error);
    })

  }

  generateDateRangeWiseLeaveReport() {

    let fromDate = (this.searchByDate != null && this.searchByDate.length > 0) ? this.datepipe.transform(this.searchByDate[0], 'yyyy-MM-dd') : "";
    let toDate = (this.searchByDate != null && this.searchByDate.length > 0) ? this.datepipe.transform(this.searchByDate[1], 'yyyy-MM-dd') : "";

    // console.log("fromDate [] >>>>", fromDate);
    // console.log("toDate [] >>>>", toDate);

    this.leaveReportService.generateDateRangeWiseLeaveReport({
      employeeId: this.employeeSearch, departmentId: this.departmentSearch, zoneId: this.zoneSearch,
      sectionId: this.sectionSearch, subSectionId: this.subSectionSearch, unitId: this.unitSearch,
      monthNo: this.month, monthYear: this.year, leaveTypeId: this.leaveTypeSearch, fromDate: fromDate, toDate: toDate,
    }).subscribe(response => {
      console.log("generateDateRangeWiseLeaveReport >>>", response);
      if (response.size > 0) {
        var blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = 'Date_Wise_Leave_Report.xlsx';
        link.click();
      }
      else {
        this.utilityService.warning("No data found")
      }
    }, (error) => {
      this.utilityService.httpErrorHandler(error);
    })


  }

  generateYearlyLeaveReport() {

    let fromDate = (this.in_period != null && this.in_period.length > 0) ? this.datepipe.transform(this.in_period[0], 'yyyy-MM-dd') : "";
    let toDate = (this.in_period != null && this.in_period.length > 0) ? this.datepipe.transform(this.in_period[1], 'yyyy-MM-dd') : "";

    if (this.month > 0 && this.year > 0) {
      this.leaveReportService.generateYearlyLeaveReport({
        employeeId: this.employeeSearch, departmentId: this.departmentSearch, zoneId: this.zoneSearch,
        sectionId: this.sectionSearch, subSectionId: this.subSectionSearch, unitId: this.unitSearch,
        monthNo: this.month, monthYear: this.year, fromDate: fromDate, toDate: toDate
      }).subscribe(response => {
        if (response.size > 0) {
          var blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          const link = document.createElement('a');
          link.href = window.URL.createObjectURL(blob);
          link.download = 'Monthly_Cumulative_Report_within_Annual_Context.xlsx';
          link.click();
        }
        else {
          this.utilityService.warning("No data found")
        }
      }, (error) => {
        this.utilityService.httpErrorHandler(error);
      })
    }
  }

  reportsName: string = '';
  ddlReportsName: any[] = [];
  in_period: any = [];
  loadReportsName() {
    this.ddlReportsName = [
      //'Employee Leave Card', 
      //'Employee Wise Leave Balance Summary', 
      'Monthly Leave Status',
      'Monthly Cumulative Report within Annual Context',
      'Individual Yearly Status',
      'Date Wise Leave Status'];
  }

  ddlReportsType: any[] = [];
  loadReportsType() {
    this.ddlReportsType = ['All', 'Selected Employees', 'Category Wise'];
  }

  reportsName_changed() {
    this.reportsType = '';
    this.searchByDate = [];
    this.leaveTypeSearch = 0;
    this.employeeSearch = 0;
    this.reportsType = '';
    this.departmentSearch = 0;
    this.searchByYear = [];
    this.employeesList = [];
    this.leaveTypeSearch = 0;
    this.leaveYear = '';
    this.theDate = "";

    this.month = parseInt(this.utilityService.currentMonth);
    this.year = parseInt(this.utilityService.currentYear);

    if (this.reportsNameForm != null || this.reportsNameForm instanceof FormGroup) {
      this.reportsNameForm = null;
      if (this.reportsName != '') {
        this.reportsNameFormInit();
      }
    }

    if (this.reportsName == 'Employee Wise Leave Balance Summary') {
      this.isButtonDisabled = true;
    }
    if (this.reportsName == 'Monthly Leave Status') {
      this.isButtonDisabled = false;
    }

    if (this.reportsName == 'Individual Yearly Status') {
      this.isButtonDisabled = true;
    }

    if (this.reportsName == 'Date Wise Leave Status') {
      this.isButtonDisabled = true;
    }

    if (this.reportsName == 'Monthly Cumulative Report within Annual Context') {
      this.isButtonDisabled = false;
    }

  }

  reportsNameForm: FormGroup;
  reportsNameFormInit() {
    this.reportsNameForm = this.fb.group({
      reportsName: new FormControl(this.reportsName, [Validators.required])
    })
  }

  //#region All employees...
  allEmployeeForm: FormGroup;
  allEmployeeFormInit() {
    this.allEmployeeForm = this.fb.group({
      reportsType: new FormControl(this.reportsType, [Validators.required]),
    })
  }
  //#endregion

  //#region Category Wise 
  categoryWiseForm: FormGroup;
  processDepartmentId: string = "0";
  departments: any[] = [];

  loadDepartments() {
    this.departments = [];
    this.hrWebService.getDepartments<any[]>().then((data) => {
      //this.logger("data >>>",data);
      this.departments = data;
    })
  }

  categoryWiseFormInit() {
    this.categoryWiseForm = this.fb.group({
      executionOn: new FormControl(this.reportsType, [Validators.required]),
      processDepartmentId: new FormControl(0, [Validators.min(1)]),
    })
  }
  //#endregion Category Wise

  //#region Selected-Employee
  selectedEmployee?: string;
  employees: any[] = [];
  employeesList: any[] = [];
  selected?: string;
  selectedEmployeestWiseForm: FormGroup;
  selectedEmployeestWiseFormInit() {
    this.selectedEmployeestWiseForm = this.fb.group({
      reportsType: new FormControl(this.reportsType, [Validators.required]),
      selectedEmployees: new FormControl(this.selectedEmployees, [Validators.required])
    })
  }

  deleteEmployee(id: any) {
    const index = this.employeesList.findIndex(s => s.id == id);
    if (index > -1) {
      this.employeesList.splice(index, 1);
    }

    if (this.employeesList.length == 0) {
      this.isButtonDisabled = true;
    }
    else {
      this.isButtonDisabled = false;
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
      this.employeeInfoService.getServiceData({ includedEmployeeCode: this.commaSeparatedEmployee }).then(result => {
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
    this.selectedEmployeestWiseForm.get("selectedEmployees").setValue(this.selectedEmployees)
  }
  //#endregion


  reportsType: string = '';
  reportsType_changed() {
    if (this.allEmployeeForm != null || this.allEmployeeForm instanceof FormGroup) {
      this.allEmployeeForm = null;
    }
    if (this.categoryWiseForm != null || this.categoryWiseForm instanceof FormGroup) {
      this.categoryWiseForm = null;
    }
    if (this.selectedEmployeestWiseForm != null || this.selectedEmployeestWiseForm instanceof FormGroup) {
      this.selectedEmployeestWiseForm = null;
    }

    this.selectedEmployee = "";
    this.employeesList = [];
    this.departmentSearch = 0;
    this.leaveTypeSearch = 0;
    this.searchByDate = [];

    if (this.reportsName == 'Employee Wise Leave Balance Summary') {
      if (this.reportsType == "All" && this.theDate.length != 0) {
        this.isButtonDisabled = false;
      }
      else {
        this.isButtonDisabled = true;
      }
    }

    if (this.reportsType == 'All') {
      this.allEmployeeFormInit();
    }
    else
      if (this.reportsType == 'Category Wise') {
        this.categoryWiseFormInit();
      }
      else if (this.reportsType == 'Selected Employees') {
        this.selectedEmployeestWiseFormInit();
      }
  }

  searchByEmployees: any[] = [];
  downloadReports() {


    //console.log("this.reportsName >>> ", this.reportsName);

    if (this.reportsName == 'Employee Leave Card') {
      this.generateEmployeeLeaveCard();
    }

    if (this.reportsName == 'Employee Wise Leave Balance Summary') {
      this.generateEmployeeWiseLeaveBalanceSummaryReport();
    }
    if (this.reportsName == 'Monthly Leave Status') {
      this.generateMonthlyLeaveReport();
    }

    if (this.reportsName == 'Individual Yearly Status') {
      this.generateIndividualYearlyStatusReport();
    }

    if (this.reportsName == 'Date Wise Leave Status') {
      this.generateDateRangeWiseLeaveReport();
    }

    if (this.reportsName == 'Monthly Cumulative Report within Annual Context') {
      this.generateYearlyLeaveReport();
    }

  }

  employee_changed() {
    if (this.reportsName == 'Date Wise Leave Status') {
      if (this.employeeSearch != 0) {
        this.isButtonDisabled = false;
      }
      else {
        this.isButtonDisabled = true;
      }
    }

    if (this.reportsName == 'Individual Yearly Status') {
      if (this.employeeSearch != null && this.employeeSearch != 0) {
        this.isButtonDisabled = false;
      }
      else {
        this.isButtonDisabled = true;
      }
    }

  }

  department_changed() {
    if (this.reportsType == 'Category Wise') {
      if (this.departmentSearch != 0) {
        this.isButtonDisabled = false;
      }
      else {
        this.isButtonDisabled = true;
      }
    }

  }

  selectedEmployee_Change() {
    if (this.reportsType == 'Selected Employees') {
      if (this.employeesList.length >= 0) {
        this.isButtonDisabled = false;
      }
      else {
        this.isButtonDisabled = true;
      }
    }

  }

  leaveType_changed() {
    if (this.reportsName == 'Date Wise Leave Status') {
      if (this.leaveTypeSearch != 0 && this.searchByDate.length != 0) {
        this.isButtonDisabled = false;
      }
      else {
        this.isButtonDisabled = true;
      }
    }

  }

  dateRange_Changed() {
    if (this.reportsName == 'Date Wise Leave Status') {
      if (this.leaveTypeSearch != 0 && this.searchByDate.length != 0) {
        this.isButtonDisabled = false;
      }
      else {
        this.isButtonDisabled = true;
      }
    }
  }

  clearSearchByDate() {
    this.searchByDate = [];
    if (this.reportsName == 'Date Wise Leave Status') {
      if (this.leaveTypeSearch != 0 && this.searchByDate.length != 0) {
        this.isButtonDisabled = false;
      }
      else {
        this.isButtonDisabled = true;
      }
    }
  }

  ddlLeaveYear: any[] = []
  loadLeaveYear() {
    this.ddlLeaveYear = [];
    this.leaveReportService.loadLeaveYearDropdown();
    this.leaveReportService.ddl$.subscribe(data => {
      this.ddlLeaveYear = data;
    });
  }


  leaveYear_changed() {
    if (this.reportsName == 'Employee Wise Leave Balance Summary') {
      if (this.leaveYear != "" && this.reportsType != "") {
        this.isButtonDisabled = false;
      }
      else {
        this.isButtonDisabled = true;
      }
    }
  }


}