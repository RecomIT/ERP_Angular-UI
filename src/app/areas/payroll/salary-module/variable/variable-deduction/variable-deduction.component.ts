import { transition, trigger, useAnimation } from '@angular/animations';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { bounceIn, fadeIn, fadeInRight, slideInUp } from 'ng-animate';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { ApiArea, ApiController } from 'src/app/shared/constants';
import { CustomModalService } from 'src/app/shared/services/custom-modal.service';
import { HrWebService } from 'src/app/shared/services/hr-web.service';
import { PayrollWebService } from 'src/app/shared/services/payroll-web.service';
import { UserService } from 'src/app/shared/services/user.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AreasHttpService } from '../../../../areas.http.service';
import { MonthlyVariableDeductionService } from './monthly-variable-deduction.service';
import { EmployeeInfoService } from 'src/app/areas/employee_module/employee/employee-info.service';
import { DeductionNameService } from '../../deduction/deduction-head/deduction-name.service';

@Component({
  selector: 'app-variable-deduction',
  templateUrl: './variable-deduction.component.html',
  animations: [
    trigger('slideInUp', [transition('* => *', useAnimation(slideInUp, { params: { timing: 0.5 } }))]),
    trigger('fadeIn', [transition('void => *', useAnimation(fadeIn, { params: { timing: 0.3 } }))]),
    trigger('fadeInRight', [transition('void => *', useAnimation(fadeInRight, { params: { timing: 0.5 } }))]),
    trigger('bounceIn', [transition('void => *', useAnimation(bounceIn, { params: { timing: 1 } }))]),
  ],
})
export class VariableDeductionComponent implements OnInit {

  @ViewChild('monthlyVariableDeductionModal', { static: true }) monthlyVariableDeductionModal!: ElementRef;
  @ViewChild('monthlyVariableDeductionEditModal', { static: true }) monthlyVariableDeductionEditModal!: ElementRef;
  @ViewChild('monthlyVariableDeductionViewAndCheckModal', { static: true }) monthlyVariableDeductionViewAndCheckModal!: ElementRef;
  @ViewChild('periodicallyVariableDeductionModal', { static: true }) periodicallyVariableDeductionModal!: ElementRef;
  @ViewChild('periodicallyVariableDeductionViewModal', { static: true }) periodicallyVariableDeductionViewModal!: ElementRef;

  isNgInit = false;
  modalTitle: string = "";
  pagePrivilege: any = this.userService.getPrivileges();
  monthlyVariableDeductionPageSize: number = 15;
  monthlyVariableDeductionPageNo: number = 1;
  monthlyVariableDeductionPageConfig: any = this.userService.pageConfigInit("monthlyVariableDeductionData", this.monthlyVariableDeductionPageSize, 1, 0);

  periodicalVariableDeductionPageSize: number = 15;
  periodicalVariableDeductionPageNo: number = 1;
  periodicalVariableDeductionPageConfig: any = this.userService.pageConfigInit("periodicalVariableDeductionData", this.periodicalVariableDeductionPageSize, 1, 0);
  datePickerConfig: Partial<BsDatepickerConfig> = this.utilityService.datePickerConfig();

  constructor(private fb: FormBuilder, private areasHttpService: AreasHttpService, private payrollWebService: PayrollWebService, private utilityService: UtilityService, private hrWebService: HrWebService, private userService: UserService, public modalService: CustomModalService, private el: ElementRef,
    private monthlyVariableDeductionService: MonthlyVariableDeductionService, private employeeInfoService: EmployeeInfoService, private deductionNameService: DeductionNameService) { }

  ngOnInit(): void {
    this.getMonthlyVariableDeductions(1);
    this.loadDeductionNames();
    this.loadEmployees();
  }

  select2Options = this.utilityService.select2Config();

  logger(msg: any, options: any) {
    this.utilityService.consoleLog(msg, options);
  }

  User() {
    return this.userService.User();
  }

  //#region Monthly-Variable Deduction

  ddlYears: any = this.utilityService.getYears(2);
  ddlMonths: any = this.utilityService.getMonths();
  currentMonth: number = parseInt(this.utilityService.currentMonth);
  currentYear: number = parseInt(this.utilityService.currentYear);

  monthlyVariableDeductionForm: FormGroup;
  formArray: any;

  monthlyVariableDeductionFormInit() {
    this.monthlyVariableDeductionForm = this.fb.group({
      deductions: this.fb.array([
        this.fb.group({
          monthlyVariableDeductionId: new FormControl(0),
          employeeId: new FormControl(0, [Validators.required, Validators.min(1)]),
          deductionNameId: new FormControl(0, [Validators.required, Validators.min(1)]),
          designationId: new FormControl(0),
          // deductionForYearOfMonth: new FormControl('', [Validators.required]),
          deductionYear: new FormControl(this.currentYear, [Validators.required]),
          deductionMonth: new FormControl(this.currentMonth, [Validators.required]),
          amount: new FormControl(0, [Validators.required, Validators.min(1)]),
          createdBy: new FormControl(this.User().UserId),
          updatedBy: new FormControl(this.User().UserId),
          companyId: new FormControl(this.User().ComId),
          organizationId: new FormControl(this.User().OrgId),
        })
      ])
    })
    this.formArray = (<FormArray>this.monthlyVariableDeductionForm.get('deductions')).controls;
  }


  addDeductionsButtonClick(): void {
    (<FormArray>this.monthlyVariableDeductionForm.get('deductions')).push(this.addVariableDeductionGroup());
  }

  addVariableDeductionGroup() {
    return this.fb.group({
      monthlyVariableDeductionId: new FormControl(0),
      employeeId: new FormControl(0, [Validators.required, Validators.min(1)]),
      deductionNameId: new FormControl(0, [Validators.required, Validators.min(1)]),
      designationId: new FormControl(0),
      // deductionForYearOfMonth: new FormControl('', [Validators.required]),
      deductionYear: new FormControl(this.currentYear, [Validators.required]),
      deductionMonth: new FormControl(this.currentMonth, [Validators.required]),
      amount: new FormControl(0, [Validators.required, Validators.min(1)]),
      createdBy: new FormControl(this.User().UserId),
      updatedBy: new FormControl(this.User().UserId),
      companyId: new FormControl(this.User().ComId),
      organizationId: new FormControl(this.User().OrgId),
    })
  }

  removeDeductionsButtonClick(index: number) {
    if ((<FormArray>this.monthlyVariableDeductionForm.get('deductions')).length > 1) {
      (<FormArray>this.monthlyVariableDeductionForm.get('deductions')).removeAt(index);
    }
    else {
      this.utilityService.fail("You can't delete last item", "Site Response");
    }
  }

  ddlDeductionNames: any[] = []
  loadDeductionNames() {
    // this.ddlDeductionNames = [];
    // this.ddlSearchByDeduction = [];
    // this.payrollWebService.getDeductionNames<any[]>("General").then((data) => {
    //   this.ddlDeductionNames = data;
    //   this.ddlSearchByDeduction = data;
    // })
    this.deductionNameService.loadDeductionNameDropdown();
    this.deductionNameService.ddl$.subscribe(response => {
      //console.log("response >>>", response);
      this.ddlDeductionNames = response;
    }, error => {
      console.error('Error while fetching data:', error);
    })
  }

  ddlEmployees: any[] = [];

  loadEmployees() {
    this.employeeInfoService.loadDropdownData({});
    this.employeeInfoService.ddl_employee_data$.subscribe(data => {
      this.employeeInfoService.loadDropdown(data);
      this.ddlEmployees = this.employeeInfoService.ddl$;
      this.ddlSearchByEmployee = this.employeeInfoService.ddl$;
    }, error => {
      console.error('Error while fetching data:', error);
    });
  }

  openMonthlyVariableDeductionModal() {
    this.monthlyVariableDeductionFormInit();
    this.modalTitle = "Add New Variable Deduction"
    this.modalService.open(this.monthlyVariableDeductionModal, "xl");
  }

  btnVariableDeduction: boolean = false;

  submitMonthlyVariableDeduction() {
    if (this.monthlyVariableDeductionForm.valid) {
      this.btnVariableDeduction = true;
      var deductions: any = [];
      this.formArray.forEach((formGroup: FormGroup) => {
        deductions.push({
          deductionForYearOfMonth: formGroup.get('deductionMonth').value + '-' + formGroup.get('deductionYear').value,
          deductionNameId: this.utilityService.IntTryParse(formGroup.get('deductionNameId').value),
          amount: formGroup.get('amount').value,
          designationId: formGroup.get('designationId').value,
          monthlyVariableDeductionId: formGroup.get('monthlyVariableDeductionId').value,
          employeeId: this.utilityService.IntTryParse(formGroup.get('employeeId').value),
        })
      })

      this.monthlyVariableDeductionService.save(deductions).subscribe(response => {
        this.btnVariableDeduction = false;
        if (response.status) {
          this.monthlyVariableDeductionForm.reset();
          this.utilityService.success(response.msg, "Server Response");
          this.modalService.service.dismissAll();
          this.getMonthlyVariableDeductions(this.monthlyVariableDeductionPageNo);
        }
        else {
          if (response.msg == "Validation Error") {
            this.utilityService.fail(response.errors?.duplicateDeduction, "Server Response", 5000);
          }
          else {
            this.utilityService.fail(response.msg, "Server Response")
          }
        }
      }, (error) => {
        this.utilityService.httpErrorHandler(error);
        this.btnVariableDeduction = false;
      })
    }
  }

  // list 

  ddlSearchByEmployee: any[] = [];
  ddlSearchByDeduction: any[] = [];

  searchByDeduction: any = 0
  searchByEmployee: any = 0
  searchByStatus: any = ''
  salaryMonth: any = 0;
  salaryYear: any = parseInt(this.utilityService.currentYear);
  listOfMonthlyVariableDeductions: any[] = [];
  monthlyVariableDeductionsDTLabel: string = null;

  onEmployeeChanged() {
    if (this.isNgInit) {
      this.getMonthlyVariableDeductions(1);
    }
    this.isNgInit = true;
  }

  monthlyVariableDeductionsPageChanged(event: any) {
    this.monthlyVariableDeductionPageNo = event;
    this.getMonthlyVariableDeductions(this.monthlyVariableDeductionPageNo);
  }

  getMonthlyVariableDeductions(pageNo: number) {
    this.monthlyVariableDeductionPageNo = pageNo;
    this.listOfMonthlyVariableDeductions = [];
    let params = { monthlyVariableDeductionId: 0, employeeId: this.utilityService.IntTryParse(this.searchByEmployee), DeductionNameId: this.searchByDeduction, pageSize: this.monthlyVariableDeductionPageSize, pageNumber: pageNo, salaryMonth: this.salaryMonth, salaryYear: this.salaryYear, stateStatus: this.searchByStatus };

    this.monthlyVariableDeductionService.get(params).subscribe(response => {
      this.listOfMonthlyVariableDeductions = response.body;
      this.monthlyVariableDeductionsDTLabel = this.listOfMonthlyVariableDeductions.length == 0 ? 'No record(s) found' : null;
      var xPaginate = JSON.parse(response.headers.get('X-Pagination'));
      this.monthlyVariableDeductionPageConfig = this.userService.pageConfigInit("monthlyVariableDeductionData", xPaginate.itemsPerPage, xPaginate.currentPage, xPaginate.totalItems);
    }, (error) => {
      this.utilityService.httpErrorHandler(error);
    })
  }

  monthlyVariableDeductionEditForm: FormGroup;
  monthlyVariableDeductionForEdit(id: any) {
    this.btnVariableDeduction = false;
    this.monthlyVariableDeductionEditForm = this.fb.group({
      monthlyVariableDeductionId: new FormControl(id),
      employeeId: new FormControl({ value: 0, disabled: true }, [Validators.required, Validators.min(1)]),
      deductionNameId: new FormControl(0, [Validators.required, Validators.min(1)]),
      designationId: new FormControl(0),
      salaryMonth: new FormControl(0, Validators.min(1)),
      salaryYear: new FormControl(0, Validators.min(1)),
      deductionForYearOfMonth: new FormControl('', [Validators.required]),
      amount: new FormControl(0, [Validators.required, Validators.min(1)]),
      createdBy: new FormControl(this.User().UserId),
      updatedBy: new FormControl(this.User().UserId),
      companyId: new FormControl(this.User().ComId),
      organizationId: new FormControl(this.User().OrgId),
    })

    const monthlyDeductionForThisId = Object.assign({}, this.listOfMonthlyVariableDeductions.find(item => item.monthlyVariableDeductionId == id));
    const monthAndYear = (monthlyDeductionForThisId.salaryMonth.toString().length == 1 ? ("0" + monthlyDeductionForThisId.salaryMonth.toString()) : monthlyDeductionForThisId.salaryMonth.toString()) + "-" + monthlyDeductionForThisId.salaryYear.toString()

    if (monthlyDeductionForThisId != null) {

      this.monthlyVariableDeductionEditForm.get('monthlyVariableDeductionId').setValue(monthlyDeductionForThisId.monthlyVariableDeductionId);
      this.monthlyVariableDeductionEditForm.get('employeeId').setValue(monthlyDeductionForThisId.employeeId);
      this.monthlyVariableDeductionEditForm.get('deductionNameId').setValue(monthlyDeductionForThisId.deductionNameId);
      this.monthlyVariableDeductionEditForm.get('designationId').setValue(monthlyDeductionForThisId.designationId);
      this.monthlyVariableDeductionEditForm.get('deductionForYearOfMonth').setValue(monthAndYear);
      this.monthlyVariableDeductionEditForm.get('salaryMonth').setValue(monthlyDeductionForThisId.salaryMonth);
      this.monthlyVariableDeductionEditForm.get('salaryYear').setValue(monthlyDeductionForThisId.salaryYear);
      this.monthlyVariableDeductionEditForm.get('amount').setValue(monthlyDeductionForThisId.amount);
    }
    this.modalService.open(this.monthlyVariableDeductionEditModal, "lg")
  }

  updateMonthlyVariableDeduction() {
    if (this.monthlyVariableDeductionEditForm.valid) {
      this.btnVariableDeduction = true;

      for (const prop in this.monthlyVariableDeductionEditForm.controls) {
        this.monthlyVariableDeductionEditForm.value[prop] = this.monthlyVariableDeductionEditForm.controls[prop].value;
      }

      this.monthlyVariableDeductionService.update(this.monthlyVariableDeductionEditForm.value).subscribe(response => {
        if (response.status) {
          this.monthlyVariableDeductionEditForm.reset();
          this.utilityService.success(response.msg, "Server Response");
          this.modalService.service.dismissAll();
          this.getMonthlyVariableDeductions(this.monthlyVariableDeductionPageNo);
        }
        else {
          this.utilityService.fail(response.msg, "Server Response")
        }
        this.btnVariableDeduction = false;
      }, (error) => {
        this.utilityService.httpErrorHandler(error);
        this.btnVariableDeduction = false;
      })
    }
  }

  //#endregion

  //#region Checking Monthly Variable Deduction
  monthlyVariableDeduction: any = null;
  checkModalFlag: string = "";
  openMonthlyVariableDeductionCheckModal(id: any, flag: any) {
    this.checkModalFlag = "";
    this.monthlyVariableDeduction = Object.assign({}, this.listOfMonthlyVariableDeductions.find(item => item.monthlyVariableDeductionId == id));
    this.logger("this.monthlyVariableDeduction >>>", this.monthlyVariableDeduction);
    this.checkModalFlag = flag;
    this.modalTitle = (flag == "View" ? "Monthly Variable Deduction View" : "Monthly Variable Deduction Approval");
    this.modalService.open(this.monthlyVariableDeductionViewAndCheckModal, "lg");
  }

  submitMonthlyVariableDeductionStatus(form: NgForm, remarks: string, checkStatus: string) {
    if (form.valid) {
      this.btnVariableDeduction = true;
      this.monthlyVariableDeductionService.approval({
        monthlyVariableDeductionId: this.monthlyVariableDeduction.monthlyVariableDeductionId,
        employeeId: this.monthlyVariableDeduction.employeeId,
        remarks: remarks,
        StateStatus: checkStatus,
      }).subscribe(response => {
        if (response.status) {
          this.utilityService.success(response.msg, "Server Response");
          this.modalService.service.dismissAll();
          this.getMonthlyVariableDeductions(this.monthlyVariableDeductionPageNo);
        }
        else {
          this.utilityService.fail(response.msg, "Server Response")
        }
        this.btnVariableDeduction = false;
      }, (error) => {
        this.btnVariableDeduction = false;
        this.utilityService.httpErrorHandler(error);
      })
    }
    else {
      this.utilityService.fail("Form value(s) is invalid", "Site Response", 3000);
    }
  }

  //#endregion Checking Monthly Variable Allowance

  //#region Periodicall Variable Deduction

  ddlFiscalyears: any[] = [];
  loadFiscalyears() {
    this.ddlFiscalyears = [];
    this.payrollWebService.getFiscalYears<any[]>().then((data) => {
      this.ddlFiscalyears = data;
    })
  }

  ddlDeductions: any[] = [];

  loadDeductions() {
    this.ddlDeductions = [];
    this.payrollWebService.getDeductionNames<any[]>("").then((data) => {
      this.ddlDeductions = data;
    })
  }
  periodicallyVariableDeductionForm: FormGroup;

  validationMessages = {
    'salaryVariableFor': {
      'required': 'Field is required'
    },
    'durationType': {
      'required': 'Field is required'
    },
    'amountBaseOn': {
      'required': 'Field is required'
    },
    'amount': {
      'min': 'Field is required'
    },
    'percentage': {
      'min': 'Field is required',
      'max': 'Max is 100'
    },
    'principalAmount': {
      'min': 'Field value is required'
    },
    'fiscalYearId': {
      'min': 'Field is required'
    },
    'effectiveFrom': {
      'required': 'Field is required'
    },
    'effectiveTo': {
      'required': 'Field is required'
    },
    'deductionNameId': {
      'min': 'Field is required'
    }
  };

  formErrors = {
    'salaryVariableFor': '',
    'durationType': '',
    'amountBaseOn': '',
    'amount': '',
    'percentage': '',
    'principalAmount': '',
    'fiscalYearId': '',
    'effectiveFrom': '',
    'effectiveTo': '',
    'deductionNameId': ''
  }

  logFormErrors(formGroup: FormGroup = this.periodicallyVariableDeductionForm) {
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

  periodicallyVariableDeductionFormInit() {
    this.loadFiscalyears();
    this.loadDeductions();
    Object.keys(this.formErrors).forEach((key: string) => { this.formErrors[key] = ''; })

    this.periodicallyVariableDeductionForm = this.fb.group({
      periodicallyVariableAllowanceInfoId: new FormControl(0),
      salaryVariableFor: new FormControl('All', [Validators.required]),
      durationType: new FormControl('Income Year', [Validators.required]),
      amountBaseOn: new FormControl('Gross', [Validators.required]),
      principalAmount: new FormControl(0),
      amount: new FormControl(0),
      percentage: new FormControl(0, [Validators.min(1), Validators.max(100)]),
      fiscalYearId: new FormControl(0, [Validators.min(1)]),
      effectiveFrom: new FormControl(null),
      effectiveTo: new FormControl(null),
      allowanceNameId: new FormControl(0, [Validators.min(1)]),
      companyId: new FormControl(this.User().ComId),
      organizationId: new FormControl(this.User().OrgId),
      createdBy: new FormControl(this.User().UserId),
      updatedBy: new FormControl(this.User().UserId),
      employeeIds: new FormControl(""),
      periodicalDetails: this.fb.array([])
    })

    this.periodicallyVariableDeductionForm.get('durationType').valueChanges.subscribe((element) => {
      if (element == "Income Year") {
        this.periodicallyVariableDeductionForm.get('fiscalYearId').setValidators([Validators.min(1)]);
        this.periodicallyVariableDeductionForm.get('fiscalYearId').updateValueAndValidity();

        this.periodicallyVariableDeductionForm.get('effectiveFrom').clearValidators()
        this.periodicallyVariableDeductionForm.get('effectiveFrom').updateValueAndValidity();

        this.periodicallyVariableDeductionForm.get('effectiveTo').clearValidators()
        this.periodicallyVariableDeductionForm.get('effectiveTo').updateValueAndValidity();
      }
      else if (element == "Date Range") {
        this.periodicallyVariableDeductionForm.get('effectiveFrom').setValidators([Validators.required]);
        this.periodicallyVariableDeductionForm.get('effectiveFrom').updateValueAndValidity();

        this.periodicallyVariableDeductionForm.get('effectiveTo').setValidators([Validators.required]);
        this.periodicallyVariableDeductionForm.get('effectiveTo').updateValueAndValidity();

        this.periodicallyVariableDeductionForm.get('fiscalYearId').clearValidators();
        this.periodicallyVariableDeductionForm.get('fiscalYearId').updateValueAndValidity();
      }
      this.logFormErrors();
    })

    this.periodicallyVariableDeductionForm.get('amountBaseOn').valueChanges.subscribe((value: string) => {
      if (value == 'Gross') {
        this.periodicallyVariableDeductionForm.get('percentage').setValidators([Validators.min(1), Validators.max(100)]);
        this.periodicallyVariableDeductionForm.get('percentage').updateValueAndValidity();

        this.periodicallyVariableDeductionForm.get('principalAmount').clearValidators();
        this.periodicallyVariableDeductionForm.get('principalAmount').updateValueAndValidity();

        this.periodicallyVariableDeductionForm.get('amount').clearValidators();
        this.periodicallyVariableDeductionForm.get('amount').updateValueAndValidity();
      }
      else if (value == 'Basic') {
        this.periodicallyVariableDeductionForm.get('percentage').clearValidators();
        this.periodicallyVariableDeductionForm.get('percentage').setValidators([Validators.min(1)]);
        this.periodicallyVariableDeductionForm.get('percentage').updateValueAndValidity();

        this.periodicallyVariableDeductionForm.get('principalAmount').clearValidators();
        this.periodicallyVariableDeductionForm.get('principalAmount').updateValueAndValidity();

        this.periodicallyVariableDeductionForm.get('amount').clearValidators();
        this.periodicallyVariableDeductionForm.get('amount').updateValueAndValidity();
      }
      else if (value == 'Flat') {
        this.periodicallyVariableDeductionForm.get('amount').setValidators([Validators.min(1)]);
        this.periodicallyVariableDeductionForm.get('amount').updateValueAndValidity()

        this.periodicallyVariableDeductionForm.get('percentage').clearValidators();
        this.periodicallyVariableDeductionForm.get('percentage').updateValueAndValidity()

        this.periodicallyVariableDeductionForm.get('principalAmount').clearValidators();
        this.periodicallyVariableDeductionForm.get('principalAmount').updateValueAndValidity();
      }
      else if (value == 'Principle') {
        this.periodicallyVariableDeductionForm.get('principalAmount').setValidators([Validators.min(1)]);
        this.periodicallyVariableDeductionForm.get('principalAmount').updateValueAndValidity()

        this.periodicallyVariableDeductionForm.get('amount').clearValidators();
        this.periodicallyVariableDeductionForm.get('amount').updateValueAndValidity()

        this.periodicallyVariableDeductionForm.get('percentage').clearValidators();
        this.periodicallyVariableDeductionForm.get('percentage').updateValueAndValidity();
      }
      this.logFormErrors();
    })

    this.periodicallyVariableDeductionForm.valueChanges.subscribe((data) => {
      this.logFormErrors()
    })
  }

  listOfPeriodicalVariableDeductions: any = [];
  periodicalVariableDeductionsDTLabel: string = null;

  getPeriodicalVariableDeductions(pageNo: number) {
    this.periodicalVariableDeductionPageNo = pageNo;
    let params = { id: 0, deductionNameId: this.searchByPeriodicalDeduction, salaryVariableFor: this.searchBySalaryVariableFor, amountBaseOn: this.searchByAmountBaseOn, companyId: this.User().ComId, organizationId: this.User().OrgId, pageSize: this.periodicalVariableDeductionPageSize, pageNumber: pageNo };

    // this.areasHttpService.observable_get<any[]>((ApiArea.payroll + ApiController.deduction + "/GetPeriodicallyVariableDeductionInfos"), {
    //   responseType: "json", observe: 'response', params: params
    // }).subscribe((response) => {
    //   var res = response as any;
    //   this.listOfPeriodicalVariableDeductions = res.body;
    //   this.logger("listOfPeriodicalVariableAllowances >>>", this.listOfPeriodicalVariableDeductions);
    //   this.periodicalVariableDeductionsDTLabel = this.listOfPeriodicalVariableDeductions.length == 0 ? 'No record(s) found' : null;
    //   var xPaginate = JSON.parse(res.headers.get('X-Pagination'));
    //   this.periodicalVariableDeductionPageConfig = this.userService.pageConfigInit("periodicalVariableDeductionData", xPaginate.itemsPerPage, xPaginate.currentPage, xPaginate.totalItems);
    // })
  }

  openPeriodicallyVariableDeductionModal() {
    this.periodicallyVariableDeductionFormInit();
    this.modalService.open(this.periodicallyVariableDeductionModal, "xl");
  }

  employees: any[] = [];
  findEmployees() {
    if (this.periodicallyVariableDeductionForm.get('periodicallyVariableDeductionInfoId').value == 0) {
      let employeeIds = this.periodicallyVariableDeductionForm.get('employeeIds').value.toString().trim();
      employeeIds = employeeIds.replace(/(\r\n|\n|\r)/gm, "");
      if (employeeIds != "") {
        this.employees = [];
        this.hrWebService.getEmployeeExtensionOne<any[]>(0, employeeIds).then((data) => {
          this.loadEmployeesInVariableDetails(data);
        })
      }
    }
    else {
      this.utilityService.info("No employee can be added in edit mode", "Site Response")
    }
  }

  loadEmployeesInVariableDetails(values: any[]) {
    const periodicalDetails = this.periodicallyVariableDeductionForm.controls.periodicalDetails as FormArray;
    periodicalDetails.clear();
    values.forEach(element => {
      periodicalDetails.push(this.fb.group({
        detailId: 0,
        id: this.utilityService.IntTryParse(element.id),
        name: element.text
      }));
    });
  }

  btnPeriodically: boolean = false;
  submitPeriodical() {
    this.logger("salaryVariableFor >>>", this.periodicallyVariableDeductionForm.value);
    if (this.periodicallyVariableDeductionForm.valid) {
      this.btnPeriodically = true;
      this.areasHttpService.observable_post((ApiArea.payroll + ApiController.deduction + "/SavePeriodicallyVariableDeductionInfo"), this.periodicallyVariableDeductionForm.value, {
        'headers': {
          'Content-Type': 'application/json'
        }
      }).subscribe((result) => {
        var data = result as any;
        this.btnPeriodically = false;
        if (data.status) {
          this.utilityService.success(data.msg, "Server Response");
          this.modalService.service.dismissAll();
          this.getPeriodicalVariableDeductions(this.periodicalVariableDeductionPageNo);
        }
        else {
          this.utilityService.fail(data.msg, "Server Response")
        }
      }, (error) => {
        this.utilityService.fail("Something went wrong", "Server Response")
        this.btnPeriodically = false;
      })
    }
  }

  searchByPeriodicalDeduction: number = 0;
  searchBySalaryVariableFor: string = "";
  searchByAmountBaseOn: string = "";


  periodicalVariableDeductionsPageChanged(event: any) {
    this.periodicalVariableDeductionPageNo = event;
    this.getPeriodicalVariableDeductions(this.periodicalVariableDeductionPageNo);
  }

  periodicalVariableDeductionInfo: any;
  isPeriodicalApprovalModal: boolean = false;
  openPeriodicalVariableDeductionViewModal(flag: string, id: number) {
    this.periodicalVariableDeductionInfo = null;
    this.isPeriodicalApprovalModal = flag == "View" ? false : true;
    this.areasHttpService.observable_get<any>((ApiArea.payroll + ApiController.deduction + "/GetPeriodicallyVariableDeductionInfo"), {
      params: { id: id, companyId: this.User().ComId, organizationId: this.User().OrgId }
    }).subscribe((result) => {
      var data = result as any;
      this.periodicalVariableDeductionInfo = data;
      this.modalService.open(this.periodicallyVariableDeductionViewModal, "xl");
    }, (error) => {
      this.utilityService.fail("Somthing went wrong");
    })
  }

  openPeriodicalVariableDeductionEditModal(id: number) {
    this.areasHttpService.observable_get<any>((ApiArea.payroll + ApiController.deduction + "/GetPeriodicallyVariableDeductionInfo"), {
      params: { id: id, companyId: this.User().ComId, organizationId: this.User().OrgId }
    }).subscribe((result) => {
      var data = result as any;
      this.periodicalVariableDeductionInfo = data;
      this.logger("this.periodicalVariableDeductionInfo >>>", this.periodicalVariableDeductionInfo);
      this.periodicallyVariableDeductionFormInit();
      this.periodicallyVariableDeductionForm.patchValue(this.periodicalVariableDeductionInfo);
      this.periodicallyVariableDeductionForm.get('salaryVariableFor').disable();
      this.loadEmployeesInVariableDetails(this.periodicalVariableDeductionInfo.periodicalDetails)
      this.modalService.open(this.periodicallyVariableDeductionModal, "xl");

    }, (error) => {
      this.utilityService.fail("Somthing went wrong");
    })
  }

  submitPeriodicalVariableDeductionStatus(form: NgForm, remarks: string, status: string) {
  }
  //#endregion Periodicall Variable Deduction

  //#region Upload Modal Section
  showUploadDeductionModal: boolean = false;
  openUploadDeductionModal() {
    this.showUploadDeductionModal = true;
  }

  closeUploadDeductionModal(reason: any) {
    this.showUploadDeductionModal = false;
    if (reason == 'Save Complete') {
      this.getMonthlyVariableDeductions(this.monthlyVariableDeductionPageNo);
    }
  }
  //#endregion

  showDeductionDeleteModal: boolean = false;
  deductionDeleteItem: any;
  openDeductionDeleteModal(item: any) {
    this.showDeductionDeleteModal = true;
    this.deductionDeleteItem = item;
  }

  closeDeductionDeleteModal(reason: any) {
    this.showDeductionDeleteModal = false;
    if (reason == 'Delete Complete') {
      this.getMonthlyVariableDeductions(this.monthlyVariableDeductionPageNo);
    }
  }
}
