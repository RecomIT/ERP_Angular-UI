import { transition, trigger, useAnimation } from '@angular/animations';
import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { bounceIn, fadeIn, fadeInRight, slideInUp } from 'ng-animate';
import { parseDate } from 'ngx-bootstrap/chronos';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { TypeaheadMatch } from 'ngx-bootstrap/typeahead';
import { ApiArea, ApiController } from 'src/app/shared/constants';
import { CustomModalService } from 'src/app/shared/services/custom-modal.service';
import { HrWebService } from 'src/app/shared/services/hr-web.service';
import { PayrollWebService } from 'src/app/shared/services/payroll-web.service';
import { UserService } from 'src/app/shared/services/user.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { employeeOfficeInfo } from 'src/models/hrm/employee-model';
import { salaryAllowanceConfiguration, salaryAllowanceConfigurationDetail, salaryAllowanceConfigurationInfo } from 'src/models/payroll/allowance-model';
import { AreasHttpService } from '../../../../areas.http.service';
import { SalaryAllowanceConfigService } from './salary-allowance-config.service';



@Component({
  selector: 'app-allowance-config',
  templateUrl: './salary-allowance-config.component.html',
  animations: [
    trigger('slideInUp', [transition('* => *', useAnimation(slideInUp, { params: { timing: 0.5 } }))]),
    trigger('fadeIn', [transition('void => *', useAnimation(fadeIn, { params: { timing: 0.3 } }))]),
    trigger('fadeInRight', [transition('void => *', useAnimation(fadeInRight, { params: { timing: 0.5 } }))]),
    trigger('bounceIn', [transition('void => *', useAnimation(bounceIn, { params: { timing: 1 } }))]),
  ],

})
export class SalaryAllowanceConfigComponent implements OnInit {

  @ViewChild('salaryAllowanceConfigDetailsModal', { static: true }) salaryAllowanceConfigDetailsModal!: ElementRef;
  datePickerConfig: Partial<BsDatepickerConfig> = {};
  pagePrivilege: any = this.userService.getPrivileges();

  constructor(private areasHttpService: AreasHttpService, private payrollWebService: PayrollWebService, private utilityService: UtilityService, private hrWebService: HrWebService, private userService: UserService, public modalService: CustomModalService, private salaryAllowanceConfigService: SalaryAllowanceConfigService) { }

  ngOnInit(): void {
    this.loadEmployees();
    this.loadAllowanceNames();
    this.datePickerConfig = Object.assign({}, {
      containerClass: "theme-dark-blue",
      showWeekNumbers: false,
      dateInputFormat: "DD-MMM-YYYY",
      isAnimated: true,
      showClearButton: false,
      showTodayButton: false,
      todayPosition: "left",
      rangeInputFormat: "DD-MMM-YYYY",
      rangeSeparator: " ~ ",
      size: "sm",
      minDate: new Date(),
      customTodayClass: 'custom-today-class'
    })
    this.getSalaryAllowanceConfigurationInfos();
  }

  configCategory: string = '';
  bulkEmployeeSearchBox: string = '';
  isLocked: boolean = false;

  viewEntryScreen: boolean = false
  viewShowAndHide() {
    this.viewEntryScreen = !this.viewEntryScreen;
    this.salaryAllowanceConfigurations = [];
    this.selectedGrades = [];
    this.selectedGrade = "";
    this.configCategory = "";
    this.selectedDesignations = [];
    this.selectedDesignation = "";
    if (this.viewEntryScreen) {

    }
    else {
      this.getSalaryAllowanceConfigurationInfos();
    }
  }

  lockedOrUnlocked() {
    this.isLocked = !this.isLocked;
  }

  User() {
    return this.userService.User();
  }

  logger(msg: any, options: any) {
    this.utilityService.consoleLog(msg, options);
  }

  ddlEmployees: any[] = null;
  select2Options = {
    width: "100%",
    containerCssClass: "form-control form-control-sm text-x-small font-bold",
    theme: "bootstrap4"
  }

  ddlAllowanceNames: any[] = [];

  loadAllowanceNames() {
    this.payrollWebService.getAllowanceNames<any[]>("Salary").then((data) => {
      this.ddlAllowanceNames = data;
      this.logger("ddlAllowanceNames", this.ddlAllowanceNames);
    })
  }

  loadEmployees() {
    // this.hrWebService.getEmployees<any[]>().then((data) => {
    //   this.ddlEmployees = data;
    // })
  }

  employeeInfo: employeeOfficeInfo = {
    employeeId: 0,
    employeeCode: '',
    fullName: '',
    branchId: 0,
    divisionId: 0,
    gradeId: 0,
    designationId: 0,
    departmentId: 0,
    sectionId: 0,
    subSectionId: 0,
    divisionalHead: 0,
    headOfDepartment: 0,
    lineManager: 0,
    supervisor: 0,
    leadManagement: 0,
    hrAuthority: 0,
    gross: 0,
    basic: 0,
    houseRent: 0,
    medical: 0,
    conveyance: 0,
    dateOfJoining: undefined,
    dateOfConfirmation: undefined,
    serviceTenure: '',
    jobStatusId: 0,
    officeMobile: '',
    officeEmail: '',
    referenceNo: '',
    fingerID: '',
    tinNo: '',
    tinFile: undefined,
    nidNo: '',
    nidFile: undefined,
    passportNo: '',
    passportFile: undefined,
    mobileAllowance: 0,
    jobLocationId: 0,
    workShiftId: 0,
    gradeName: '',
    designationName: '',
    departmentName: '',
    divisionName: '',
    branchName: '',
    sectionName: '',
    subSectionName: '',
    jobStatusName: '',
    jobLocationName: '',
    divisionalHeadName: '',
    headOfDepartmentName: '',
    lineManagerName: '',
    supervisorName: '',
    leadManagementName: '',
    hrAuthorityName: '',
    stateStatus: '',
    workShiftName: '',
    unitId: 0,
    unitName: '',
    lineId: 0,
    lineName: '',
    gender: '',
    jobTypeId: 0,
    jobType: "",
    taxzone: "",
    minimumTaxAmount: 0
  }

  clearEmployeeInfoObj() {
    this.employeeInfo = {
      employeeId: 0,
      employeeCode: '',
      fullName: '',
      branchId: 0,
      divisionId: 0,
      gradeId: 0,
      designationId: 0,
      departmentId: 0,
      sectionId: 0,
      subSectionId: 0,
      divisionalHead: 0,
      headOfDepartment: 0,
      lineManager: 0,
      supervisor: 0,
      leadManagement: 0,
      hrAuthority: 0,
      gross: 0,
      basic: 0,
      houseRent: 0,
      medical: 0,
      conveyance: 0,
      dateOfJoining: undefined,
      dateOfConfirmation: undefined,
      serviceTenure: '',
      jobStatusId: 0,
      officeMobile: '',
      officeEmail: '',
      referenceNo: '',
      fingerID: '',
      tinNo: '',
      tinFile: undefined,
      nidNo: '',
      nidFile: undefined,
      passportNo: '',
      passportFile: undefined,
      mobileAllowance: 0,
      jobLocationId: 0,
      workShiftId: 0,
      gradeName: '',
      designationName: '',
      departmentName: '',
      divisionName: '',
      branchName: '',
      sectionName: '',
      subSectionName: '',
      jobStatusName: '',
      jobLocationName: '',
      divisionalHeadName: '',
      headOfDepartmentName: '',
      lineManagerName: '',
      supervisorName: '',
      leadManagementName: '',
      hrAuthorityName: '',
      stateStatus: '',
      workShiftName: '',
      unitId: 0,
      unitName: '',
      lineId: 0,
      lineName: '',
      gender: '',
      jobTypeId: 0,
      jobType: "",
      taxzone: "",
      minimumTaxAmount: 0
    }
  }

  getEmployeeInfo(id: any) {
    this.clearEmployeeInfoObj();
    if (id != null && id != '' && id > 0) {
      this.areasHttpService.observable_get((ApiArea.hrms + ApiController.hr + "/GetEmployee"), {
        responseType: "json", params: {
          employeeId: id, ComId: this.User().ComId, OrgId: this.User().OrgId
        }
      }).subscribe((data) => {
        this.logger("data >>>", data);
        this.employeeInfo = data as employeeOfficeInfo;
      })
    }
  }

  salaryAllowanceConfigurations: salaryAllowanceConfiguration[] = [];


  effectiveFromTo: string[] = []
  addAllowance(allowanceBase: any) {
    if (allowanceBase != '') {
      this.effectiveFromTo.push("");
      this.salaryAllowanceConfigurations.push({
        salaryAllowanceConfigId: 0,
        configCategory: '',
        employeeId: 0,
        allowanceBase: allowanceBase,
        allowanceNameId: 0,
        allowanceName: '',
        percentage: 0,
        amount: 0,
        isPeriodically: false,
        effectiveFrom: undefined,
        effectiveTo: undefined,
        stateStatus: '',
        userId: '',
        createdBy: '',
        createdDate: undefined,
        updatedBy: '',
        updatedDate: undefined,
        approvedBy: '',
        approvedDate: undefined,
        checkedBy: '',
        checkedDate: undefined,
        branchId: 0,
        branchName: '',
        divisionId: 0,
        divisionName: '',
        companyId: 0,
        companyName: '',
        organizationId: 0,
        organizationName: '',
        isFixedSalaryHead: false,
        salaryAllowanceConfigDetailId: 0,
        maxAmount: null,
        minAmount: null,
        additionalAmount: null
      });
    }
  }

  mainAllowanceBaseChanged(baseAllowance: any) {
    this.salaryAllowanceConfigurations.forEach((item) => {
      item.allowanceBase = baseAllowance;
    });
  }

  deleteAllowance(index: number) {
    let deletedAllowanceBase = this.salaryAllowanceConfigurations[index].allowanceBase;
    this.salaryAllowanceConfigurations.splice(index, 1);
    this.effectiveFromTo.splice(index, 1);
    this.percentageAndAmountCalculation(deletedAllowanceBase, 0, index)
  }

  totalGrossPercentage: number = 0;
  totalBasicPercentage: number = 0;
  totalAmount: number = 0;

  percentageAndAmountCalculation(allowanceBase: string, baseAmount: any, index: number) {
    this.totalGrossPercentage = 0;
    let grossItems = this.salaryAllowanceConfigurations.filter(s => s.allowanceBase == "Gross");
    grossItems.forEach((item) => {
      this.totalGrossPercentage += item.percentage;
    })

    if (this.totalGrossPercentage > 100) {
      this.totalGrossPercentage = this.totalGrossPercentage - this.salaryAllowanceConfigurations[index].percentage;
      if (allowanceBase == "Gross") {
        this.salaryAllowanceConfigurations[index].percentage = 0;
      }
    }

    this.totalAmount = 0;
    let flatAmounts = this.salaryAllowanceConfigurations.filter(s => s.allowanceBase == "Flat");
    flatAmounts.forEach((item) => {
      this.totalAmount += item.amount;
    })
  }


  totalPercentageCalculation() {
    this.totalGrossPercentage = 0;
    this.totalGrossPercentage = this.salaryAllowanceConfigurations.map(s => s.percentage).reduce(function (a, b) {
      return a + (!isNaN(b) ? b : 0);
    });
  }

  totalAmountCalculation(amount: any) {
    this.totalAmount = 0;
    let amt = 0;
    if (!isNaN(amount)) {
      this.salaryAllowanceConfigurations.forEach(function (item, index) {
        amt += (amount * (item.percentage / 100));
      })
    }
    this.totalAmount = amt;
  }

  allowanceNameChanged(id: number, index: number) {
    this.logger("this.salaryAllowanceConfigurations >>>", this.salaryAllowanceConfigurations);
    if (id == 0) {
      return;
    }
    let sameSalaryAllowanceConfig = this.salaryAllowanceConfigurations.filter(s => s.allowanceNameId == id);
    if (sameSalaryAllowanceConfig.length > 1) {
      this.salaryAllowanceConfigurations[index].allowanceNameId = 0;
      this.utilityService.fail("Duplicate Allowance Detected", "Site Response")
      return;
    }
    let isFixedSalaryHead = this.ddlAllowanceNames.find(s => s.id == id).disabled;
    this.salaryAllowanceConfigurations[index].isFixedSalaryHead = isFixedSalaryHead;
    this.salaryAllowanceConfigurations[index].isPeriodically = false;
    this.salaryAllowanceConfigurations[index].percentage = 0;
    this.salaryAllowanceConfigurations[index].maxAmount = 0;
  }

  bulkEmployees: any[] = [];

  searchBulkEmployee(employeesCode: any) {
    this.bulkEmployees = [];
    this.areasHttpService.observable_get((ApiArea.hrms + ApiController.employees + "/GetEmployeesData"), {
      responseType: "json", params: {
        employeeCodes: employeesCode, companyId: this.User().ComId, organizationId: this.User().OrgId
      }
    }).subscribe((data) => {
      this.bulkEmployees = data as any[];
      if (this.bulkEmployees.length == 0) {
        this.utilityService.info("No Employee(s) Found", "Server Response");
      }
    })
  }

  ddlGradesForConfig: any[] = [];

  selectedGrade: any;
  loadGrades() {
    this.ddlGradesForConfig = [];
    this.hrWebService.getGrades<any[]>().then((data) => {
      this.ddlGradesForConfig = data;
      this.logger("ddlGradesForConfig >>>", this.ddlGradesForConfig);
    })
  }

  configCategoryChanged() {
    if (this.configCategory == 'Grade') {
      this.loadGrades();
    }
    else if (this.configCategory == 'Designation') {
      this.loadDesignation();
    }
  }

  salaryAllowanceConfigurationInfo: salaryAllowanceConfigurationInfo = {
    salaryAllowanceConfigId: 0,
    configCategory: '',
    isActive: false,
    stateStatus: '',
    userId: '',
    createdBy: '',
    createdDate: undefined,
    updatedBy: '',
    updatedDate: undefined,
    approvedBy: '',
    approvedDate: undefined,
    checkedBy: '',
    checkedDate: undefined,
    branchId: 0,
    branchName: '',
    divisionId: 0,
    divisionName: '',
    companyId: 0,
    companyName: '',
    organizationId: 0,
    organizationName: '',
    salaryAllowanceConfigurationDetails: [],
    headCount: 0
  }
  salaryAllowanceConfigurationDetails: salaryAllowanceConfigurationDetail[] = [];

  clearSalaryAllowanceConfigurationInfoObj() {
    this.salaryAllowanceConfigurationInfo = {
      salaryAllowanceConfigId: 0,
      configCategory: '',
      isActive: false,
      stateStatus: '',
      userId: '',
      createdBy: '',
      createdDate: undefined,
      updatedBy: '',
      updatedDate: undefined,
      approvedBy: '',
      approvedDate: undefined,
      checkedBy: '',
      checkedDate: undefined,
      branchId: 0,
      branchName: '',
      divisionId: 0,
      divisionName: '',
      companyId: 0,
      companyName: '',
      organizationId: 0,
      organizationName: '',
      salaryAllowanceConfigurationDetails: [],
      headCount: 0
    }
  }

  submitSalaryAllowanceConfiguration() {
    this.clearSalaryAllowanceConfigurationInfoObj();
    if (this.configCategory == 'Employee Wise') {

      this.salaryAllowanceConfigurationInfo.salaryAllowanceConfigId = 0;
      this.salaryAllowanceConfigurationInfo.configCategory = this.configCategory;
      this.salaryAllowanceConfigurationInfo.companyId = this.User().ComId;
      this.salaryAllowanceConfigurationInfo.organizationId = this.User().OrgId;
      this.salaryAllowanceConfigurationInfo.createdBy = this.User().UserId;
      this.salaryAllowanceConfigurationInfo.updatedBy = this.User().UserId;
      this.salaryAllowanceConfigurationDetails = [];

      this.bulkEmployees.forEach((emp) => {
        this.salaryAllowanceConfigurations.forEach((config, index) => {
          this.salaryAllowanceConfigurationDetails.push({
            allowanceBase: config.allowanceBase,
            allowanceNameId: config.allowanceNameId,
            allowanceName: this.ddlAllowanceNames.find(s => s.id == config.allowanceNameId).text,
            percentage: config.percentage,
            amount: config.amount,
            isPeriodically: config.isPeriodically,
            effectiveFrom: config.isPeriodically && this.effectiveFromTo[index] != null && this.effectiveFromTo[index] != '' ? parseDate(this.effectiveFromTo[index][0]) : null,
            effectiveTo: config.isPeriodically && this.effectiveFromTo[index] != null && this.effectiveFromTo[index] != '' ? parseDate(this.effectiveFromTo[index][1]) : null,
            companyId: this.User().ComId,
            organizationId: this.User().OrgId,
            branchId: this.User().BranchId,
            employeeId: emp.employeeId,
            createdBy: this.User().UserId,
            updatedBy: this.User().UserId,
            gradeId: 0,
            branchName: "",
            divisionId: 0,
            divisionName: "",
            approvedBy: "",
            approvedDate: null,
            checkedBy: "",
            checkedDate: null,
            companyName: "",
            createdDate: null,
            organizationName: "",
            updatedDate: null,
            userId: "",
            salaryAllowanceConfigDetailId: config.salaryAllowanceConfigDetailId,
            salaryAllowanceConfigId: config.salaryAllowanceConfigId,
            designationId: 0,
            minAmount: config.minAmount,
            maxAmount: config.maxAmount,
            additionalAmount: config.additionalAmount
          })
        })
      })

      this.salaryAllowanceConfigurationInfo.salaryAllowanceConfigurationDetails = this.salaryAllowanceConfigurationDetails;

      this.saveSalaryAllowanceConfiguration();
    }
    else if (this.configCategory == 'Grade') {
      this.salaryAllowanceConfigurationInfo.salaryAllowanceConfigId = 0;
      this.salaryAllowanceConfigurationInfo.configCategory = this.configCategory;
      this.salaryAllowanceConfigurationInfo.companyId = this.User().ComId;
      this.salaryAllowanceConfigurationInfo.organizationId = this.User().OrgId;
      this.salaryAllowanceConfigurationInfo.branchId = this.User().BranchId;
      this.salaryAllowanceConfigurationInfo.createdBy = this.User().UserId;
      this.salaryAllowanceConfigurationInfo.updatedBy = this.User().UserId;
      this.salaryAllowanceConfigurationDetails = [];

      this.selectedGrades.forEach((grade) => {
        this.salaryAllowanceConfigurations.forEach((config, index) => {
          this.salaryAllowanceConfigurationDetails.push({
            allowanceBase: config.allowanceBase,
            allowanceNameId: config.allowanceNameId,
            allowanceName: this.ddlAllowanceNames.find(s => s.id == config.allowanceNameId).text,
            percentage: config.percentage,
            amount: config.amount,
            isPeriodically: config.isPeriodically,
            effectiveFrom: config.isPeriodically && this.effectiveFromTo[index] != null && this.effectiveFromTo[index] != '' ? parseDate(this.effectiveFromTo[index][0]) : null,
            effectiveTo: config.isPeriodically && this.effectiveFromTo[index] != null && this.effectiveFromTo[index] != '' ? parseDate(this.effectiveFromTo[index][1]) : null,
            companyId: this.User().ComId,
            organizationId: this.User().OrgId,
            branchId: this.User().BranchId,
            employeeId: 0,
            createdBy: this.User().UserId,
            updatedBy: this.User().UserId,
            gradeId: grade.id,
            branchName: "",
            divisionId: 0,
            divisionName: "",
            approvedBy: "",
            approvedDate: null,
            checkedBy: "",
            checkedDate: null,
            companyName: "",
            createdDate: null,
            organizationName: "",
            updatedDate: null,
            userId: "",
            salaryAllowanceConfigDetailId: config.salaryAllowanceConfigDetailId,
            salaryAllowanceConfigId: config.salaryAllowanceConfigId,
            designationId: 0,
            minAmount: config.minAmount,
            maxAmount: config.maxAmount,
            additionalAmount: config.additionalAmount
          })
        })
      })

      this.salaryAllowanceConfigurationInfo.salaryAllowanceConfigurationDetails = this.salaryAllowanceConfigurationDetails;
      this.saveSalaryAllowanceConfiguration();

    }
    else if (this.configCategory == 'Designation') {
      this.salaryAllowanceConfigurationInfo.salaryAllowanceConfigId = 0;
      this.salaryAllowanceConfigurationInfo.configCategory = this.configCategory;
      this.salaryAllowanceConfigurationInfo.companyId = this.User().ComId;
      this.salaryAllowanceConfigurationInfo.organizationId = this.User().OrgId;
      this.salaryAllowanceConfigurationInfo.branchId = this.User().BranchId;
      this.salaryAllowanceConfigurationInfo.createdBy = this.User().UserId;
      this.salaryAllowanceConfigurationInfo.updatedBy = this.User().UserId;
      this.salaryAllowanceConfigurationDetails = [];

      this.selectedDesignations.forEach((designation) => {
        this.salaryAllowanceConfigurations.forEach((config, index) => {
          this.salaryAllowanceConfigurationDetails.push({
            allowanceBase: config.allowanceBase,
            allowanceNameId: config.allowanceNameId,
            allowanceName: this.ddlAllowanceNames.find(s => s.id == config.allowanceNameId).text,
            percentage: config.percentage,
            amount: config.amount,
            isPeriodically: config.isPeriodically,
            effectiveFrom: config.isPeriodically && this.effectiveFromTo[index] != null && this.effectiveFromTo[index] != '' ? parseDate(this.effectiveFromTo[index][0]) : null,
            effectiveTo: config.isPeriodically && this.effectiveFromTo[index] != null && this.effectiveFromTo[index] != '' ? parseDate(this.effectiveFromTo[index][1]) : null,
            companyId: this.User().ComId,
            organizationId: this.User().OrgId,
            branchId: this.User().BranchId,
            employeeId: 0,
            createdBy: this.User().UserId,
            updatedBy: this.User().UserId,
            gradeId: 0,
            designationId: designation.id,
            branchName: "",
            divisionId: 0,
            divisionName: "",
            approvedBy: "",
            approvedDate: null,
            checkedBy: "",
            checkedDate: null,
            companyName: "",
            createdDate: null,
            organizationName: "",
            updatedDate: null,
            userId: "",
            salaryAllowanceConfigDetailId: config.salaryAllowanceConfigDetailId,
            salaryAllowanceConfigId: config.salaryAllowanceConfigId,
            minAmount: config.minAmount,
            maxAmount: config.maxAmount,
            additionalAmount: config.additionalAmount
          })
        })
      })

      this.salaryAllowanceConfigurationInfo.salaryAllowanceConfigurationDetails = this.salaryAllowanceConfigurationDetails;
      this.saveSalaryAllowanceConfiguration();
    }
    else if (this.configCategory == 'All') {
      this.salaryAllowanceConfigurationInfo.salaryAllowanceConfigId = 0;
      this.salaryAllowanceConfigurationInfo.configCategory = this.configCategory;
      this.salaryAllowanceConfigurationInfo.companyId = this.User().ComId;
      this.salaryAllowanceConfigurationInfo.organizationId = this.User().OrgId;
      this.salaryAllowanceConfigurationInfo.createdBy = this.User().UserId;
      this.salaryAllowanceConfigurationInfo.updatedBy = this.User().UserId;
      this.salaryAllowanceConfigurationDetails = [];

      this.salaryAllowanceConfigurations.forEach((config, index) => {
        this.salaryAllowanceConfigurationDetails.push({
          allowanceBase: config.allowanceBase,
          allowanceNameId: config.allowanceNameId,
          allowanceName: this.ddlAllowanceNames.find(s => s.id == config.allowanceNameId).text,
          percentage: config.percentage,
          amount: config.amount,
          isPeriodically: config.isPeriodically,
          effectiveFrom: config.isPeriodically && this.effectiveFromTo[index] != null && this.effectiveFromTo[index] != '' ? parseDate(this.effectiveFromTo[index][0]) : null,
          effectiveTo: config.isPeriodically && this.effectiveFromTo[index] != null && this.effectiveFromTo[index] != '' ? parseDate(this.effectiveFromTo[index][1]) : null,
          companyId: this.User().ComId,
          organizationId: this.User().OrgId,
          branchId: this.User().BranchId,
          employeeId: 0,
          createdBy: this.User().UserId,
          updatedBy: this.User().UserId,
          gradeId: 0,
          branchName: "",
          divisionId: 0,
          divisionName: "",
          approvedBy: "",
          approvedDate: null,
          checkedBy: "",
          checkedDate: null,
          companyName: "",
          createdDate: null,
          organizationName: "",
          updatedDate: null,
          userId: "",
          salaryAllowanceConfigDetailId: config.salaryAllowanceConfigDetailId,
          salaryAllowanceConfigId: config.salaryAllowanceConfigId,
          designationId: 0,
          minAmount: config.minAmount,
          maxAmount: config.maxAmount,
          additionalAmount: config.additionalAmount
        })
      })
      this.salaryAllowanceConfigurationInfo.salaryAllowanceConfigurationDetails = this.salaryAllowanceConfigurationDetails;
      this.saveSalaryAllowanceConfiguration();
    }
  }

  saveSalaryAllowanceConfiguration() {
    this.areasHttpService.observable_post((ApiArea.payroll + "/SalaryAllowanceConfig/SaveSalaryAllowanceConfig"),
      JSON.stringify(this.salaryAllowanceConfigurationInfo),
      {
        'headers': {
          'Content-Type': 'application/json'
        }
      }).subscribe((result) => {
        let data = result as any;
        if (data.status) {
          this.clearSalaryAllowanceConfigurationInfoObj();
          this.utilityService.success("Saved Successfull", "Server Response")
          this.getSalaryAllowanceConfigurationInfos();
          this.viewEntryScreen = false;
        }
        else {
          if (data.msg == "Validation Error") {
            this.utilityService.fail(data.msg, "Server Response")
          }
          else {
            this.utilityService.success(data.msg, "Server Response")
          }
        }
      }, (error) => {
        this.utilityService.fail(error.error, "Server Response")
      })
  }

  salaryAllowanceConfigurationInfos: any[] = [];
  getSalaryAllowanceConfigurationInfos() {
    this.salaryAllowanceConfigService.get({}).subscribe(response => {
      this.salaryAllowanceConfigurationInfos = response.body;
    })
  }

  selectedGrades: any[] = [];

  gradeOnSelect(e: TypeaheadMatch, element: any) {
    if (this.selectedGrades.length == 0) {
      this.selectedGrades.push({
        id: e.item.id,
        value: e.item.text
      })
    }
    else {
      var isExist = Object.assign({}, this.selectedGrades.find(item => item.id == e.item.id));
      this.logger("isExist >>>", isExist);
      if (Object.keys(isExist).length == 0) {
        this.selectedGrades.push({
          id: e.item.id,
          value: e.item.text
        })
      }
      else {
        this.utilityService.fail("This Grade has been alreay added", "Site Response");
      }
    }

    this.selectedGrade = "";
    element.value = "";
    element.nativeElement?.focus();
  }

  deleteGrade(id: number) {
    if (this.selectedGrades.length > 0) {
      let index = this.selectedGrades.findIndex(item => item.id == id);
      this.selectedGrades.splice(index, 1);
    }
  }

  // Designation
  ddlDesignationForConfig: any[] = [];
  selectedDesignation: any;
  selectedDesignations: any[] = []
  loadDesignation() {
    this.ddlDesignationForConfig = [];
    this.selectedDesignations = [];
    this.hrWebService.getDesignations<any[]>().then((data) => {
      this.logger("data >>>", data);
      this.ddlDesignationForConfig = data;
    })
  }

  designationOnSelect(e: TypeaheadMatch, element: any) {

    if (this.selectedDesignations.length == 0) {
      this.selectedDesignations.push({
        id: parseInt(e.item.id.split("#")[0]),
        value: e.item.text
      })
    }
    else {
      var isExist = Object.assign({}, this.selectedDesignations.find(item => item.id == e.item.id));
      this.logger("isExist >>>", isExist);
      if (Object.keys(isExist).length == 0) {
        this.selectedDesignations.push({
          id: parseInt(e.item.id.split("#")[0]),
          value: e.item.text
        })
      }
      else {
        this.utilityService.fail("This Designation has been alreay added", "Site Response");
      }
    }

    this.logger("this.selectedDesignations >>>", this.selectedDesignations);
    this.selectedDesignation = "";
    element.value = "";
    element.nativeElement?.focus();
  }

  deleteDesignation(id: number) {
    if (this.selectedDesignations.length > 0) {
      let index = this.selectedDesignations.findIndex(item => item.id == id);
      this.selectedDesignations.splice(index, 1);
    }
  }

  salaryAllowanceConfigurationDetailsInView: any[] = []
  salaryAllowanceConfigurationInfoInView: any = null;
  showApprovalBlock: boolean = false;
  viewConfigurationDetails(configId: number, approval: boolean) {
    this.salaryAllowanceConfigurationDetailsInView = [];
    this.showApprovalBlock = false;
    this.salaryAllowanceConfigService.detail({ salaryAllowanceConfigId: configId }).subscribe(response => {
      this.salaryAllowanceConfigurationDetailsInView = response.body;
      this.salaryAllowanceConfigurationInfoInView = Object.assign({}, this.salaryAllowanceConfigurationInfos.find(i => i.salaryAllowanceConfigId == configId))
      this.modalService.open(this.salaryAllowanceConfigDetailsModal, 'lg');
      this.showApprovalBlock = approval;
    },(error)=>{
      console.log("error >>>", error);
      this.utilityService.fail("Something went wrong", "Server Response");
    })
  }

  btnSubmitApproval: boolean = false;
  submitApprovalOrNot(remarks: string, status: string) {
    this.btnSubmitApproval = true
    this.salaryAllowanceConfigService.approval({ salaryAllowanceConfigId: this.salaryAllowanceConfigurationInfoInView.salaryAllowanceConfigId, stateStatus: status,remarks:remarks }).subscribe(response=>{
        if (response?.status) {
        this.salaryAllowanceConfigurationDetailsInView = [];
        this.salaryAllowanceConfigurationInfoInView = [];
        this.showApprovalBlock = false;
        this.utilityService.success("Saved Successfull", "Server Response")
        this.getSalaryAllowanceConfigurationInfos();
        this.modalService.service.dismissAll();
      }
      else {
        this.utilityService.fail("Server Responsed with error", "Server Response")
      }
      this.btnSubmitApproval = false;
    },(error)=>{
      this.btnSubmitApproval = false;
      console.log("error >>>",error);
      this.utilityService.fail("Something Went wrong","Server Response");
    })
  }

  closeAddSalaryAllowanceConfig(reason: any) {
    this.viewEntryScreen = false;
    this.getSalaryAllowanceConfigurationInfos();
  }

}
