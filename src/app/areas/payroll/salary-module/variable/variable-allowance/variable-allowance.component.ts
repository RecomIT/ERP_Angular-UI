import { transition, trigger, useAnimation } from '@angular/animations';
import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { fadeIn, fadeInUp, fadeOutLeft, slideInUp } from 'ng-animate';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { ApiArea } from 'src/app/shared/constants';
import { CustomModalService } from 'src/app/shared/services/custom-modal.service';
import { HrWebService } from 'src/app/shared/services/hr-web.service';
import { PayrollWebService } from 'src/app/shared/services/payroll-web.service';
import { UserService } from 'src/app/shared/services/user.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AreasHttpService } from '../../../../areas.http.service';
import { MonthlyVariableAllowanceService } from './monthly-variable-allowance.service';
import { AllowanceNameService } from '../../allowance/allowance-head/allowance-name.service';
import { EmployeeInfoService } from 'src/app/areas/employee_module/employee/employee-info.service';
import { FiscalYearService } from '../../setup/fiscalYear/fiscalYear.service';
import { error } from 'console';

@Component({
  selector: 'app-variable-allowance',
  templateUrl: './variable-allowance.component.html',
  animations: [
    trigger('fadeIn', [transition('void => *', useAnimation(fadeIn, { params: { timing: 0.3 } }))]),
    trigger('slideInUp', [transition('* => *', useAnimation(slideInUp, { params: { timing: 0.5 } }))]),
    trigger('fadeInUp', [transition('void => *', useAnimation(fadeInUp))]),
    trigger('fadeOutLeft', [transition('* => void', useAnimation(fadeOutLeft, { params: { timing: 0.3 } }))]),
  ],
})
export class VariableAllowanceComponent implements OnInit {

  @ViewChild('monthlyVariableAllowanceModal', { static: true }) monthlyVariableAllowanceModal!: ElementRef;
  @ViewChild('monthlyVariableAllowanceEditModal', { static: true }) monthlyVariableAllowanceEditModal!: ElementRef;
  @ViewChild('monthlyVariableAllowanceViewAndCheckModal', { static: true }) monthlyVariableAllowanceViewAndCheckModal!: ElementRef;
  @ViewChild('periodicallyVariableAllowanceModal', { static: true }) periodicallyVariableAllowanceModal!: ElementRef;
  @ViewChild('periodicallyVariableAllowanceViewModal', { static: true }) periodicallyVariableAllowanceViewModal!: ElementRef;
  isNgInit = false;
  modalTitle: string = "";



  monthlyVariableAllowancePageSize: number = 15;
  monthlyVariableAllowancePageNo: number = 1;

  periodicalVariableAllowancePageSize: number = 15;
  periodicalVariableAllowancePageNo: number = 1;

  monthlyVariableAllowancePageConfig: any = this.userService.pageConfigInit("monthlyVariableAllowanceData", this.monthlyVariableAllowancePageSize, 1, 0);
  periodicalVariableAllowancePageConfig: any = this.userService.pageConfigInit("periodicalVariableAllowanceData", this.periodicalVariableAllowancePageSize, 1, 0);
  datePickerConfig: Partial<BsDatepickerConfig> = this.utilityService.datePickerConfig();

  constructor(private fb: FormBuilder, private areasHttpService: AreasHttpService, private payrollWebService: PayrollWebService, private utilityService: UtilityService, private hrWebService: HrWebService, private userService: UserService, public modalService: CustomModalService,
    private monthlyVariableAllowanceService: MonthlyVariableAllowanceService, private allowanceNameService: AllowanceNameService, private employeeInfoService: EmployeeInfoService, private fiscalYearService: FiscalYearService) { }
  pagePrivilege: any = this.userService.getPrivileges();

  privilege: any = null;;
  ngOnInit(): void {
    this.getMonthlyVariableAllowances(1);
    //this.getPeriodicalVariableAllowances(1);
    this.loadAllowanceNames();
    this.loadEmployees();
  }

  select2Options = this.utilityService.select2Config();

  logger(msg: any, options: any) {
    this.utilityService.consoleLog(msg, options);
  }

  User() {
    return this.userService.User();
  }

  //#region Monthly Variable Allowance

  //#region VariableAllowance Entry/update
  ddlYears: any = this.utilityService.getYears(2);
  ddlMonths: any = this.utilityService.getMonths();

  currentMonth: number = parseInt(this.utilityService.currentMonth);
  currentYear: number = parseInt(this.utilityService.currentYear);

  monthlyVariableAllowanceForm: FormGroup;
  formArray: any;

  monthlyVariableAllowanceFormInit() {
    this.monthlyVariableAllowanceForm = this.fb.group({
      allowances: this.fb.array([
        this.fb.group({
          monthlyVariableAllowanceId: new FormControl(0),
          employeeId: new FormControl(0, [Validators.required, Validators.min(1)]),
          allowanceNameId: new FormControl(0, [Validators.required, Validators.min(1)]),
          designationId: new FormControl(0),
          salaryMonth: new FormControl(this.currentMonth, [Validators.required]),
          salaryYear: new FormControl(this.currentYear, [Validators.required]),
          amount: new FormControl(0, [Validators.required])
        })
      ])
    })
    this.formArray = (<FormArray>this.monthlyVariableAllowanceForm.get('allowances')).controls;
  }

  addAllowancesButtonClick(): void {
    (<FormArray>this.monthlyVariableAllowanceForm.get('allowances')).push(this.addVariableAllowanceGroup());
  }

  addVariableAllowanceGroup() {
    return this.fb.group({
      monthlyVariableAllowanceId: new FormControl(0),
      employeeId: new FormControl(0, [Validators.required, Validators.min(1)]),
      allowanceNameId: new FormControl(0, [Validators.required, Validators.min(1)]),
      designationId: new FormControl(0),
      salaryYear: new FormControl(this.currentYear, [Validators.required]),
      salaryMonth: new FormControl(this.currentMonth, [Validators.required]),
      amount: new FormControl(0, [Validators.required]),
    })
  }

  removeAllowancesButtonClick(index: number) {
    if ((<FormArray>this.monthlyVariableAllowanceForm.get('allowances')).length > 1) {
      (<FormArray>this.monthlyVariableAllowanceForm.get('allowances')).removeAt(index);
    }
    else {
      this.utilityService.fail("You can't delete last item", "Site Response");
    }
  }

  ddlAllowances: any[] = [];
  loadAllowanceNames() {
    this.allowanceNameService.loadAllowanceNameDropdown();
    this.allowanceNameService.ddl$.subscribe(data => {
      console.log("data >>>", data);
      this.ddlAllowances = data;
    }, (error) => {
      console.log("error  while fetching data >>>", error);
    })
  }


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

  openMonthlyVariableAllowanceModal() {
    this.monthlyVariableAllowanceFormInit();
    this.modalTitle = "Add New Variable Allowance"
    this.modalService.open(this.monthlyVariableAllowanceModal, "xl");
  }

  btnVariableAllowance: boolean = false;

  submitMonthlyVariableAllowance() {
    if (this.monthlyVariableAllowanceForm.valid) {
      this.btnVariableAllowance = true;
      var allowances: any = [];
      this.formArray.forEach((formGroup: FormGroup) => {
        console.log("formGroup >>>", formGroup.get('amount').value);
        allowances.push({
          employeeId: this.utilityService.IntTryParse(formGroup.get('employeeId').value),
          designationId: formGroup.get('designationId').value,
          salaryMonth: formGroup.get('salaryMonth').value,
          salaryYear: formGroup.get('salaryYear').value,
          allowanceNameId: this.utilityService.IntTryParse(formGroup.get('allowanceNameId').value),
          amount: formGroup.get('amount').value,
          monthlyVariableAllowanceId: formGroup.get('monthlyVariableAllowanceId').value,
        })
      })

      this.monthlyVariableAllowanceService.save(allowances).subscribe(response => {
        var data = response as any;
        this.btnVariableAllowance = false;
        if (data.status) {
          this.monthlyVariableAllowanceForm.reset();
          this.utilityService.success(data.msg, "Server Response");
          this.modalService.service.dismissAll();
          this.getMonthlyVariableAllowances(1);
        }
        else {
          if (data.msg == "Validation Error") {
            this.utilityService.fail(data.errors?.duplicateAllowance, "Server Response", 5000);
          }
          else {
            this.utilityService.fail(data.msg, "Server Response")
          }
        }
      }, (error) => {
        console.log("error >>>", error);
        this.utilityService.fail("Something went wrong", "Server Response")
        this.btnVariableAllowance = false;
      })

    }
  }

  //#endregion

  //#region list

  ddlSearchByEmployee: any[] = [];
  ddlSearchByAllowance: any[] = [];

  searchByAllowance: any = 0
  searchByEmployee: any = 0
  searchByStatus: any = ''
  salaryMonth: any = 0;
  salaryYear: any = parseInt(this.utilityService.currentYear);
  listOfMonthlyVariableAllowances: any[] = [];
  monthlyVariableAllowancesDTLabel: string = null;

  onEmployeeChanged() {
    if (this.isNgInit) {
      this.getMonthlyVariableAllowances(1);
    }
    this.isNgInit = true;
  }

  monthlyVariableAllowancesPageChanged(event: any) {
    this.monthlyVariableAllowancePageNo = event;
    this.getMonthlyVariableAllowances(this.monthlyVariableAllowancePageNo);
  }

  getMonthlyVariableAllowances(pageNo: number) {
    this.monthlyVariableAllowancePageNo = pageNo;
    this.listOfMonthlyVariableAllowances = [];
    let params = { monthlyVariableAllowanceId: 0, employeeId: this.utilityService.IntTryParse(this.searchByEmployee), allowanceNameId: this.searchByAllowance, pageSize: this.monthlyVariableAllowancePageSize, pageNumber: pageNo, salaryMonth: this.salaryMonth, salaryYear: this.salaryYear, stateStatus: this.searchByStatus };

    this.monthlyVariableAllowanceService.get(params).subscribe(response => {
      var res = response as any;
      this.listOfMonthlyVariableAllowances = res.body;
      this.monthlyVariableAllowancesDTLabel = this.listOfMonthlyVariableAllowances.length == 0 ? 'No record(s) found' : null;
      var xPaginate = JSON.parse(res.headers.get('X-Pagination'));
      this.monthlyVariableAllowancePageConfig = this.userService.pageConfigInit("monthlyVariableAllowanceData", xPaginate.itemsPerPage, xPaginate.currentPage, xPaginate.totalItems);
    }, (error) => {
      console.log("error >>>", error);
      this.utilityService.fail("Something went wrong", "Server Response");
    })

  }

  monthlyVariableAllowanceEditForm: FormGroup;
  monthlyVariableAllowanceForEdit(id: any) {
    this.btnVariableAllowance = false;
    this.monthlyVariableAllowanceEditForm = this.fb.group({
      monthlyVariableAllowanceId: new FormControl(id),
      employeeId: new FormControl({ value: 0, disabled: true }, [Validators.required, Validators.min(1)]),
      allowanceNameId: new FormControl(0, [Validators.required, Validators.min(1)]),
      designationId: new FormControl(0),
      salaryMonth: new FormControl(0, Validators.min(1)),
      salaryYear: new FormControl(0, Validators.min(1)),
      amount: new FormControl(0, [Validators.required]),
      createdBy: new FormControl(this.User().UserId),
      updatedBy: new FormControl(this.User().UserId),
      companyId: new FormControl(this.User().ComId),
      organizationId: new FormControl(this.User().OrgId),
    })

    const monthlyAllowanceForThisId = Object.assign({}, this.listOfMonthlyVariableAllowances.find(item => item.monthlyVariableAllowanceId == id));
    const monthAndYear = (monthlyAllowanceForThisId.salaryMonth.toString().length == 1 ? ("0" + monthlyAllowanceForThisId.salaryMonth.toString()) : monthlyAllowanceForThisId.salaryMonth.toString()) + "-" + monthlyAllowanceForThisId.salaryYear.toString()


    if (monthlyAllowanceForThisId != null) {
      this.monthlyVariableAllowanceEditForm.get('monthlyVariableAllowanceId').setValue(monthlyAllowanceForThisId.monthlyVariableAllowanceId);
      this.monthlyVariableAllowanceEditForm.get('employeeId').setValue(monthlyAllowanceForThisId.employeeId);
      this.monthlyVariableAllowanceEditForm.get('allowanceNameId').setValue(monthlyAllowanceForThisId.allowanceNameId);
      this.monthlyVariableAllowanceEditForm.get('designationId').setValue(monthlyAllowanceForThisId.designationId);
      this.monthlyVariableAllowanceEditForm.get('salaryMonth').setValue(monthlyAllowanceForThisId.salaryMonth);
      this.monthlyVariableAllowanceEditForm.get('salaryYear').setValue(monthlyAllowanceForThisId.salaryYear);
      this.monthlyVariableAllowanceEditForm.get('amount').setValue(monthlyAllowanceForThisId.amount);
    }
    this.modalService.open(this.monthlyVariableAllowanceEditModal, "lg")
  }

  updateMonthlyVariableAllowance() {
    if (this.monthlyVariableAllowanceEditForm.valid) {
      this.btnVariableAllowance = true;

      for (const prop in this.monthlyVariableAllowanceEditForm.controls) {
        this.monthlyVariableAllowanceEditForm.value[prop] = this.monthlyVariableAllowanceEditForm.controls[prop].value;
      }

      this.monthlyVariableAllowanceService.update(this.monthlyVariableAllowanceEditForm.value).subscribe(response => {
        var data = response as any;
        this.btnVariableAllowance = false;
        if (data.status) {
          this.monthlyVariableAllowanceEditForm.reset();
          this.utilityService.success(data.msg, "Server Response");
          this.modalService.service.dismissAll();
          this.getMonthlyVariableAllowances(this.monthlyVariableAllowancePageNo);
        }
        else {
          this.utilityService.fail(data.msg, "Server Response")
        }
      }, (error) => {
        console.log("error >>>", error);
        this.utilityService.fail("Something went wrong", "Server Response");
      })
    }
  }
  //#endregion


  //#region Checking Monthly Variable Allowance
  monthlyVariableAllowance: any = null;
  checkModalFlag: string = "";
  openMonthlyVariableAllowanceCheckModal(id: any, flag: any) {
    this.checkModalFlag = "";
    this.monthlyVariableAllowance = Object.assign({}, this.listOfMonthlyVariableAllowances.find(item => item.monthlyVariableAllowanceId == id));
    this.logger("this.monthlyVariableAllowance >>>", this.monthlyVariableAllowance);
    this.checkModalFlag = flag;
    this.modalTitle = (flag == "View" ? "Monthly Variable Allowance View" : "Monthly Variable Allowance Approval");
    this.modalService.open(this.monthlyVariableAllowanceViewAndCheckModal, "lg");
  }

  submitMonthlyVariableAllowanceStatus(form: NgForm, remarks: string, checkStatus: string) {
    if (form.valid) {
      this.btnVariableAllowance = true;
      this.monthlyVariableAllowanceService.approval({
        monthlyVariableAllowanceId: this.monthlyVariableAllowance.monthlyVariableAllowanceId,
        stateStatus: checkStatus, remarks: remarks, employeeId: this.monthlyVariableAllowance.employeeId
      }).subscribe(response => {
        this.btnVariableAllowance = false;
        if (response.status) {
          this.utilityService.success(response.msg, "Server Response");
          this.modalService.service.dismissAll();
          this.getMonthlyVariableAllowances(this.monthlyVariableAllowancePageNo);
        }
        else {
          this.utilityService.fail(response.msg, "Server Response")
        }
      }, (error) => {
        this.btnVariableAllowance = false;
        console.log("error >>>", error);
        this.utilityService.fail("Something went wrong", "Server Response");
      })
    }
    else {
      this.utilityService.fail("Form value(s) is invalid", "Site Response", 3000);
    }
  }

  //#endregion Checking Monthly Variable Allowance

  //#endregion Monthly Variable Allowance

  //#region Periodically Variable Allowance

  ddlFiscalyears: any = [];
  loadFiscalyears() {
    this.fiscalYearService.loadDropdown();
    this.fiscalYearService.ddl$.subscribe(response => {
      this.ddlFiscalyears = response;
    })
  }


  periodicallyVariableAllowanceForm: FormGroup;

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
    'allowanceNameId': {
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
    'allowanceNameId': ''
  }

  logFormErrors(formGroup: FormGroup = this.periodicallyVariableAllowanceForm) {
    Object.keys(formGroup.controls).forEach((key: string) => {
      const abstractControl = formGroup.get(key);
      //console.log("key>>", key);
      this.formErrors[key] = '';
      if (abstractControl && !abstractControl.valid && (abstractControl.touched || abstractControl.dirty)) {
        const messages = this.validationMessages[key];
        // console.log("messages>>", messages);
        // console.log("abstractControl.value >>", abstractControl.value);
        // console.log("abstractControl.errors>>", abstractControl.errors);
        for (const errorKey in abstractControl.errors) {
          this.formErrors[key] += messages[errorKey];
        }
      }
    })
  }

  periodicallyVariableAllowanceFormInit() {
    this.loadFiscalyears();
    Object.keys(this.formErrors).forEach((key: string) => { this.formErrors[key] = ''; })

    this.periodicallyVariableAllowanceForm = this.fb.group({
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

    this.periodicallyVariableAllowanceForm.get('durationType').valueChanges.subscribe((element) => {
      if (element == "Income Year") {
        this.periodicallyVariableAllowanceForm.get('fiscalYearId').setValidators([Validators.min(1)]);
        this.periodicallyVariableAllowanceForm.get('fiscalYearId').updateValueAndValidity();

        this.periodicallyVariableAllowanceForm.get('effectiveFrom').clearValidators()
        this.periodicallyVariableAllowanceForm.get('effectiveFrom').updateValueAndValidity();

        this.periodicallyVariableAllowanceForm.get('effectiveTo').clearValidators()
        this.periodicallyVariableAllowanceForm.get('effectiveTo').updateValueAndValidity();
      }
      else if (element == "Date Range") {
        this.periodicallyVariableAllowanceForm.get('effectiveFrom').setValidators([Validators.required]);
        this.periodicallyVariableAllowanceForm.get('effectiveFrom').updateValueAndValidity();

        this.periodicallyVariableAllowanceForm.get('effectiveTo').setValidators([Validators.required]);
        this.periodicallyVariableAllowanceForm.get('effectiveTo').updateValueAndValidity();

        this.periodicallyVariableAllowanceForm.get('fiscalYearId').clearValidators();
        this.periodicallyVariableAllowanceForm.get('fiscalYearId').updateValueAndValidity();
      }
      this.logFormErrors();
    })

    this.periodicallyVariableAllowanceForm.get('amountBaseOn').valueChanges.subscribe((value: string) => {
      if (value == 'Gross') {
        this.periodicallyVariableAllowanceForm.get('percentage').setValidators([Validators.min(1), Validators.max(100)]);
        this.periodicallyVariableAllowanceForm.get('percentage').updateValueAndValidity();

        this.periodicallyVariableAllowanceForm.get('principalAmount').clearValidators();
        this.periodicallyVariableAllowanceForm.get('principalAmount').updateValueAndValidity();

        this.periodicallyVariableAllowanceForm.get('amount').clearValidators();
        this.periodicallyVariableAllowanceForm.get('amount').updateValueAndValidity();
      }
      else if (value == 'Basic') {
        this.periodicallyVariableAllowanceForm.get('percentage').clearValidators();
        this.periodicallyVariableAllowanceForm.get('percentage').setValidators([Validators.min(1)]);
        this.periodicallyVariableAllowanceForm.get('percentage').updateValueAndValidity();

        this.periodicallyVariableAllowanceForm.get('principalAmount').clearValidators();
        this.periodicallyVariableAllowanceForm.get('principalAmount').updateValueAndValidity();

        this.periodicallyVariableAllowanceForm.get('amount').clearValidators();
        this.periodicallyVariableAllowanceForm.get('amount').updateValueAndValidity();
      }
      else if (value == 'Flat') {
        this.periodicallyVariableAllowanceForm.get('amount').setValidators([Validators.min(1)]);
        this.periodicallyVariableAllowanceForm.get('amount').updateValueAndValidity()

        this.periodicallyVariableAllowanceForm.get('percentage').clearValidators();
        this.periodicallyVariableAllowanceForm.get('percentage').updateValueAndValidity()

        this.periodicallyVariableAllowanceForm.get('principalAmount').clearValidators();
        this.periodicallyVariableAllowanceForm.get('principalAmount').updateValueAndValidity();
      }
      else if (value == 'Principle') {
        this.periodicallyVariableAllowanceForm.get('principalAmount').setValidators([Validators.min(1)]);
        this.periodicallyVariableAllowanceForm.get('principalAmount').updateValueAndValidity()

        this.periodicallyVariableAllowanceForm.get('amount').clearValidators();
        this.periodicallyVariableAllowanceForm.get('amount').updateValueAndValidity()

        this.periodicallyVariableAllowanceForm.get('percentage').clearValidators();
        this.periodicallyVariableAllowanceForm.get('percentage').updateValueAndValidity();
      }
      this.logFormErrors();
    })

    this.periodicallyVariableAllowanceForm.valueChanges.subscribe((data) => {
      this.logFormErrors()
    })
  }

  openPeriodicallyVariableAllowanceModal() {
    this.periodicallyVariableAllowanceFormInit();
    this.modalService.open(this.periodicallyVariableAllowanceModal, "xl");
  }

  employees: any[] = [];
  findEmployees() {
    if (this.periodicallyVariableAllowanceForm.get('periodicallyVariableAllowanceInfoId').value == 0) {
      let employeeIds = this.periodicallyVariableAllowanceForm.get('employeeIds').value.toString().trim();
      employeeIds = employeeIds.replace(/(\r\n|\n|\r)/gm, "");
      if (employeeIds != "") {
        this.employees = [];
        this.hrWebService.getEmployeeExtensionOne<any[]>(0, employeeIds).then((data) => {
          //this.logger("employee data >>>", data);
          this.loadEmployeesInVariableDetails(data);
        })
      }
    }
    else {
      this.utilityService.info("No employee can be added in edit mode", "Site Response")
    }
  }

  loadEmployeesInVariableDetails(values: any[]) {
    const periodicalDetails = this.periodicallyVariableAllowanceForm.controls.periodicalDetails as FormArray;
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
    this.logger("salaryVariableFor >>>", this.periodicallyVariableAllowanceForm.value);
    if (this.periodicallyVariableAllowanceForm.valid) {
      this.btnPeriodically = true;
      this.areasHttpService.observable_post((ApiArea.payroll + "/VariableAllowance" + "/SavePeriodicallyVariableAllowanceInfo"), this.periodicallyVariableAllowanceForm.value, {
        'headers': {
          'Content-Type': 'application/json'
        }
      }).subscribe((result) => {
        var data = result as any;
        this.btnPeriodically = false;
        if (data.status) {
          this.utilityService.success(data.msg, "Server Response");
          this.modalService.service.dismissAll();
          this.getPeriodicalVariableAllowances(this.periodicalVariableAllowancePageNo);
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

  searchByPeriodicalAllowance: any = 0;
  searchBySalaryVariableFor: string = "";
  searchByAmountBaseOn: string = "";

  periodicalVariableAllowancesPageChanged(event: any) {
    this.periodicalVariableAllowancePageNo = event;
    this.getPeriodicalVariableAllowances(this.periodicalVariableAllowancePageNo);
  }

  listOfPeriodicalVariableAllowances: any[] = [];
  periodicalVariableAllowancesDTLabel: string = "";
  getPeriodicalVariableAllowances(pageNo: number) {
    this.periodicalVariableAllowancePageNo = pageNo;
    let params = { id: 0, allowanceNameId: this.searchByPeriodicalAllowance, salaryVariableFor: this.searchBySalaryVariableFor, amountBaseOn: this.searchByAmountBaseOn, companyId: this.User().ComId, organizationId: this.User().OrgId, pageSize: this.periodicalVariableAllowancePageSize, pageNumber: pageNo };

    this.areasHttpService.observable_get<any[]>((ApiArea.payroll + "/VariableAllowance" + "/GetPeriodicallyVariableAllowanceInfos"), {
      responseType: "json", observe: 'response', params: params
    }).subscribe((response) => {
      var res = response as any;
      this.listOfPeriodicalVariableAllowances = res.body;
      this.logger("listOfPeriodicalVariableAllowances >>>", this.listOfPeriodicalVariableAllowances);
      this.periodicalVariableAllowancesDTLabel = this.listOfPeriodicalVariableAllowances.length == 0 ? 'No record(s) found' : null;
      var xPaginate = JSON.parse(res.headers.get('X-Pagination'));
      this.periodicalVariableAllowancePageConfig = this.userService.pageConfigInit("periodicalVariableAllowanceData", xPaginate.itemsPerPage, xPaginate.currentPage, xPaginate.totalItems);
    })
  }

  periodicalVariableAllowanceInfo: any;
  isPeriodicalApprovalModal: boolean = false;
  openPeriodicalVariableAllowanceViewModal(flag: string, id: number) {
    this.periodicalVariableAllowanceInfo = null;
    this.isPeriodicalApprovalModal = flag == "View" ? false : true;
    this.areasHttpService.observable_get<any>((ApiArea.payroll + "/VariableAllowance" + "/GetPeriodicallyVariableAllowanceInfo"), {
      params: { id: id, companyId: this.User().ComId, organizationId: this.User().OrgId }
    }).subscribe((result) => {
      var data = result as any;
      this.periodicalVariableAllowanceInfo = data;
      this.modalService.open(this.periodicallyVariableAllowanceViewModal, "xl");
    }, (error) => {
      this.utilityService.fail("Somthing went wrong");
    })
  }

  openPeriodicalVariableAllowanceEditModal(id: number) {
    this.areasHttpService.observable_get<any>((ApiArea.payroll + "/VariableAllowance" + "/GetPeriodicallyVariableAllowanceInfo"), {
      params: { id: id, companyId: this.User().ComId, organizationId: this.User().OrgId }
    }).subscribe((result) => {
      var data = result as any;
      this.periodicalVariableAllowanceInfo = data;
      this.logger("this.periodicalVariableAllowanceInfo >>>", this.periodicalVariableAllowanceInfo);
      this.periodicallyVariableAllowanceFormInit();
      this.periodicallyVariableAllowanceForm.patchValue(this.periodicalVariableAllowanceInfo);
      this.periodicallyVariableAllowanceForm.get('salaryVariableFor').disable();
      this.loadEmployeesInVariableDetails(this.periodicalVariableAllowanceInfo.periodicalDetails)
      this.modalService.open(this.periodicallyVariableAllowanceModal, "xl");

    }, (error) => {
      this.utilityService.fail("Somthing went wrong");
    })
  }


  submitPeriodicalVariableAllowanceStatus(form: NgForm, remarks: string, checkStatus: string) {
    if (form.valid) {
      this.btnPeriodically = true;
      this.areasHttpService.observable_post((ApiArea.payroll + "/VariableAllowance" + "/SavePeriodicallyVariableAllowanceStatus"), null, {
        params: { periodicallyVariableAllowanceInfoId: this.periodicalVariableAllowanceInfo.periodicallyVariableAllowanceInfoId, status: checkStatus, remarks: remarks, companyId: this.User().ComId, organizationId: this.User().OrgId }
      }).subscribe((result: any) => {
        this.btnPeriodically = false;
        if (result.status) {
          this.utilityService.success(result.msg, "Server Response");
          this.modalService.service.dismissAll();
          this.getPeriodicalVariableAllowances(this.periodicalVariableAllowancePageNo);
        }
        else {
          this.utilityService.fail(result.msg, "Server Response")
        }
      }, (error) => {
        this.btnPeriodically = false;
        this.utilityService.fail("Something went wrong", "Server Response")
      })
    }
    else {
      this.utilityService.fail("Form value(s) is invalid", "Site Response", 3000);
    }
  }
  //#endregion Periodically Variable Allowance

  //#region Upload-Excel
  showUploadAllowanceModal: boolean = false;
  openUploadAllowanceModal() {
    this.showUploadAllowanceModal = true;
  }

  closeUploadAllowanceModal(reason: any) {
    this.showUploadAllowanceModal = false;
    if (reason == 'Save Complete') {
      this.getMonthlyVariableAllowances(this.monthlyVariableAllowancePageNo);
    }
  }
  //#endregion

  //#region delete monthly variable allowance
  showAllowanceDeleteModal: boolean = false;
  allowanceDeleteItem: any;
  openAllowanceDeleteModal(item: any) {
    this.showAllowanceDeleteModal = true;
    this.allowanceDeleteItem = item;
  }

  closeAllowanceDeleteModal(reason: any) {
    this.showAllowanceDeleteModal = false;
    if (reason == 'Delete Complete') {
      this.getMonthlyVariableAllowances(this.monthlyVariableAllowancePageNo);
    }
  }
  //#endregion delete monthly variable allowance

  //#region Update Approved Allownce

  showUpdateApprovedAllowanceModal: boolean = false;
  updateApprovedAllowanceId: number = 0;
  openUpdateApprovedAllowanceModal(id: number) {
    this.updateApprovedAllowanceId = id;
    this.showUpdateApprovedAllowanceModal = true;
  }

  closeUpdateApprovedAllowanceModal(reason: any) {
    //console.log("closeUpdateApprovedAllowanceModal reason >>> ", reason);
    if (reason == 'Save Complete') {
      this.getMonthlyVariableAllowances(this.monthlyVariableAllowancePageNo);
    }
    this.updateApprovedAllowanceId = 0;
    this.showUpdateApprovedAllowanceModal = false;
  }

  //#endregion Update Approved Allownce
}
