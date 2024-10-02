import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { ApiArea, ApiController } from 'src/app/shared/constants';
import { CustomModalService } from 'src/app/shared/services/custom-modal.service';
import { HrWebService } from 'src/app/shared/services/hr-web.service';
import { PayrollWebService } from 'src/app/shared/services/payroll-web.service';
import { UserService } from 'src/app/shared/services/user.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { TypeaheadMatch } from 'ngx-bootstrap/typeahead';
import { AreasHttpService } from '../../../../areas.http.service';
import { trigger, transition, useAnimation } from '@angular/animations';
import { fadeIn, fadeInUp,fadeOutLeft, slideInUp } from 'ng-animate';
import { ControlPanelWebService } from 'src/app/shared/services/control-panel.service';
import { Router } from '@angular/router';
import { DepartmentService } from 'src/app/areas/employee_module/Organizational/department/department.service';

@Component({
  selector: 'app-salary-process-extension',
  templateUrl: './salary-process-extension.component.html',
  animations: [
    trigger('fadeIn', [transition('void => *', useAnimation(fadeIn,{params: { timing: 0.3}}))]),
    trigger('slideInUp', [transition('* => *', useAnimation(slideInUp, { params: { timing: 0.5 } }))]),
    trigger('fadeInUp', [transition('void => *', useAnimation(fadeInUp))]),
    trigger('fadeOutLeft', [transition('* => void', useAnimation(fadeOutLeft,{params: { timing: 0.3}}))]),
  ],
})

export class SalaryProcessExtensionComponent implements OnInit {

  @ViewChild('salaryProcessDetailModal', { static: true }) salaryProcessDetailModal!: ElementRef;
  @ViewChild('salaryProcessCheckingModal', { static: true }) salaryProcessCheckingModal!: ElementRef;

  constructor(private router: Router,private datepipe: DatePipe, private fb: FormBuilder, private areasHttpService: AreasHttpService, 
    private controlPanelWebService: ControlPanelWebService,
    private payrollWebService: PayrollWebService, private utilityService: UtilityService, private hrWebService: HrWebService,
    private userService: UserService, public modalService: CustomModalService, private el: ElementRef, private departmentService: DepartmentService) { }

  datePickerConfig: Partial<BsDatepickerConfig> = {};
  isViewPage: boolean = true;

  pagePrivilege: any= this.userService.getPrivileges();

  ngOnInit(): void {
    this.datePickerConfig = Object.assign({}, {
      containerClass: "theme-dark-blue",
      showWeekNumbers: false,
      dateInputFormat: "DD-MMMM-YYYY",
      isAnimated: true,
      showClearButton: false,
      showTodayButton: false,
      todayPosition: "left",
      rangeInputFormat: "DD-MMM-YYYY",
      rangeSeparator: " ~ ",
      size: "sm",
      customTodayClass: 'custom-today-class'
    })
    //this.uploadedComponentSalaryProcessFormInit();
    this.getSalaryProcessInfos();
    this.getMonths();
  }

  showPage() {
    this.isViewPage = !this.isViewPage;
    if (!this.isViewPage) {
      this.salaryProcessType="";
      this.processMonth="";
      this.processYear="";
      this.salaryDate=null;
      this.executionOn = "";
      this.loadEmployees();
    }
  }

  months: any[] = [];
  getMonths() {
    this.months = this.utilityService.getMonths()
  }

  select2Options = {
    width: "100%",
    containerCssClass: "form-control form-control-sm text-x-small font-bold",
    theme: "bootstrap4"
  }

  logger(msg: any, options: any) {
    this.utilityService.consoleLog(msg, options);
  }

  User() {
    return this.userService.User();
  }

  salaryProcessType: string = "";
  processMonth: string = "";
  processYear: string = "";
  salaryDate: string = null;

  resetOtherProps(){
    this.salaryProcessType="";
    this.processMonth="";
    this.processYear="";
    this.salaryDate=null;
  }

  processtype_changed() {
    if (this.uploadedComponentSalaryProcessForm != null || this.uploadedComponentSalaryProcessForm instanceof FormGroup) {
      this.uploadedComponentSalaryProcessForm = null;
    }

    if (this.salaryProcessType != "") {
      if (this.salaryProcessType == "Systemically") {

      }
      else if (this.salaryProcessType == "Uploaded Component") {
        this.uploadedComponentSalaryProcessFormInit();
      }
      else if (this.salaryProcessType == "Uploaded Salary-Sheet") {

      }
    }
    //console.log("this.uploadedComponentSalaryProcessForm >>>",this.uploadedComponentSalaryProcessForm);
    //alert("changed fired...");
  }

  monthYear_salaryDate_changed() {
    if (this.salaryProcessType == "Uploaded Component") {
      this.uploadedComponentSalaryProcessForm.get('salaryDate').setValue(this.salaryDate);
      this.uploadedComponentSalaryProcessForm.get('month').setValue(this.processMonth);
      this.uploadedComponentSalaryProcessForm.get('year').setValue(this.processYear);
      this.logger("uploadedComponentSalaryProcessForm valus >>>", this.uploadedComponentSalaryProcessForm.value);
    }
    else if (this.salaryProcessType == "Systemically") {
      if (this.executionOn == 'All') {
        this.allEmployeeSalaryProcessForm.get('salaryDate').setValue(this.salaryDate);
        this.allEmployeeSalaryProcessForm.get('month').setValue(this.processMonth);
        this.allEmployeeSalaryProcessForm.get('year').setValue(this.processYear);
      }
      else if (this.executionOn == 'Branch') {
        this.branchWiseSalaryProcessForm.get('salaryDate').setValue(this.salaryDate);
        this.branchWiseSalaryProcessForm.get('month').setValue(this.processMonth);
        this.branchWiseSalaryProcessForm.get('year').setValue(this.processYear);
      }
      else if (this.executionOn == 'Department') {
        this.departmentWiseSalaryProcessForm.get('salaryDate').setValue(this.salaryDate);
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

  btnProcess: boolean = false;

  runSalaryProcess() {
    //alert("RUN PROCESS");
    if(this.executionOn == "All" && this.allEmployeeSalaryProcessForm.valid){
      this.btnProcess=true;
      this.areasHttpService.observable_post((ApiArea.payroll + ApiController.salary + "/SalaryProcess"), JSON.stringify(this.allEmployeeSalaryProcessForm.value), {
        'headers': {
          'Content-Type': 'application/json'
        },
      }).subscribe(result => {
        var data = result as any;
        this.btnProcess = false;

        if (data?.status) {
          this.employeesList=[];
          this.resetOtherProps();
          this.utilityService.success(data.msg, "Server Response");
          this.getSalaryProcessInfos();
        }
        else {
          if (data.msg == "Validation Error") {
            this.utilityService.fail("Validation Error", "Server Response", 5000);
          }
          else {
            this.utilityService.fail(data.msg, "Server Response")
          }
        }
      }, (error) => {
        this.btnProcess = false;
        this.utilityService.fail("Something went wrong", "Server Response");
      })
    }
    else if(this.executionOn == "Selected Employees" && this.selectedEmployeestWiseSalaryProcessForm.valid){
      this.btnProcess=true;
      this.areasHttpService.observable_post((ApiArea.payroll + ApiController.salary + "/SalaryProcess"), JSON.stringify(this.selectedEmployeestWiseSalaryProcessForm.value), {
        'headers': {
          'Content-Type': 'application/json'
        },
      }).subscribe(result => {
        var data = result as any;
        this.btnProcess = false;

        if (data?.status) {
          this.employeesList=[];
          this.resetOtherProps();
          this.selectedEmployeestWiseSalaryProcessForm.reset();
          this.utilityService.success(data.msg, "Server Response");
          this.getSalaryProcessInfos();
        }
        else {
          if (data.msg == "Validation Error") {
            this.utilityService.fail("Validation Error", "Server Response", 5000);
          }
          else {
            this.utilityService.fail(data.msg, "Server Response")
          }
        }
      }, (error) => {
        this.btnProcess = false;
        this.utilityService.fail("Something went wrong", "Server Response");
      })
    }
    //if(this)
    return;
    this.logger("Is Valid>>", this.uploadedComponentSalaryProcessForm.valid)
    this.logger("Form Values>>", this.uploadedComponentSalaryProcessForm.value)
    if (this.uploadedComponentSalaryProcessForm.valid) {
      this.btnProcess = true;
      this.areasHttpService.observable_post((ApiArea.payroll + ApiController.salary + "/SalaryProcess"), JSON.stringify(this.allEmployeeSalaryProcessForm.value), {
        'headers': {
          'Content-Type': 'application/json'
        },
      }).subscribe(result => {
        var data = result as any;
        this.btnProcess = false;

        if (data?.status) {
          this.utilityService.success(data.msg, "Server Response");
        }
        else {
          if (data.msg == "Validation Error") {
            this.utilityService.fail("Validation Error", "Server Response", 5000);
          }
          else {
            this.utilityService.fail(data.msg, "Server Response")
          }
        }
      }, (error) => {
        this.btnProcess = false;
        this.utilityService.fail("Something went wrong", "Server Response");
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

  //#region All employees...
  allEmployeeSalaryProcessForm: FormGroup;
  allEmployeeSalaryProcessFormInit() {
    this.allEmployeeSalaryProcessForm = this.fb.group({
      processBy: new FormControl(this.salaryProcessType, [Validators.required]),
      month: new FormControl(this.processMonth, [Validators.required]),
      year: new FormControl(this.processYear, [Validators.required]),
      executionOn: new FormControl(this.executionOn, [Validators.required]),
      salaryDate: new FormControl(this.salaryDate, [Validators.required]),
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
      year: new FormControl(this.processYear, [Validators.required]),
      executionOn: new FormControl(this.executionOn, [Validators.required]),
      processDepartmentId: new FormControl(0, [Validators.min(1)]),
      salaryDate: new FormControl(this.salaryDate, [Validators.required]),
      branchId: new FormControl(this.User().BranchId),
      companyId: new FormControl(this.User().ComId),
      organizationId: new FormControl(this.User().OrgId),
      userId: new FormControl(this.User().UserId)
    })
  }
  //#endregion Department

  //#region Selected-Employee
  selectedEmployee?: string;
  employees: any[] = [];
  loadEmployees() {
    this.hrWebService.getEmployeeExtensionOne<any[]>().then((data) => {
      this.employees = data;
    })
  }

  employeesList: any[] = [];
  selectedEmployeestWiseSalaryProcessForm: FormGroup;
  selectedEmployeestWiseSalaryProcessFormInit() {
    this.selectedEmployeestWiseSalaryProcessForm = this.fb.group({
      processBy: new FormControl(this.salaryProcessType, [Validators.required]),
      month: new FormControl(this.processMonth, [Validators.required]),
      year: new FormControl(this.processYear, [Validators.required]),
      executionOn: new FormControl(this.executionOn, [Validators.required]),
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
    this.selectedEmployee="";
    this.getSelectedEmployees();
  }

  commaSeparatedEmployee?:string;
  loadEmployeeByCommaSeparatedData(){
    if(this.commaSeparatedEmployee != null && this.commaSeparatedEmployee!=""){
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
        else{
          result.forEach(item => {
            this.employeesList.push({
              id: item.employeeId,
              text: item.fullName +'~'+item.employeeCode
            })
          });
          this.getSelectedEmployees();
        }
      })
    }
  }

  selectedEmployees: string="";
  getSelectedEmployees(){
    this.selectedEmployees = "";
    this.employeesList.forEach(item => {
      this.selectedEmployees += item.id+","
    });
    // if(this.selectedEmployees.length > 0){
    //   this.selectedEmployees = this.selectedEmployees.substring(0,this.selectedEmployee.length-1);
    // }
    //this.logger("selectedEmployees >>" , this.selectedEmployees);
    this.selectedEmployeestWiseSalaryProcessForm.get("selectedEmployees").setValue(this.selectedEmployees)
    //this.logger("this.selectedEmployeestWiseSalaryProcessForm value >>", this.selectedEmployeestWiseSalaryProcessForm.value);
  }

  //----------

  listOfsalaryProcess: any[] = [];
  


  getSalaryProcessInfos() {
    this.areasHttpService.observable_get((ApiArea.payroll + ApiController.salary + "/GetSalaryProcessInfos"), {
      responseType: "json", params: {
        salaryProcessId: 0, companyId: this.User().ComId, organizationId: this.User().OrgId
      }
    }).subscribe((response) => {
      var res = response as any[];
      this.listOfsalaryProcess = res;
      //this.logger("listOfsalaryProcess", this.listOfsalaryProcess);
    },
      (error) => { this.utilityService.httpErrorHandler(error) }
    )
  }

  listOfsalaryProcessDetail: any[] = [];
  footerOfsalaryProcessDetail: any = {};
  getSalaryProcessDetails(id: any) {
    this.areasHttpService.observable_get((ApiArea.payroll + ApiController.salary + "/GetSalaryProcessDetails"), {
      responseType: "json", params: {
        salaryProcessId: id, companyId: this.User().ComId, organizationId: this.User().OrgId
      }
    }).subscribe((response) => {
      var res = response as any[];
      this.listOfsalaryProcessDetail = res;
      this.openSalaryProcessDetailsModal();

      // if(this.listOfsalaryProcessDetail.length > 0){
      //  var totalAllowance = this

      // }

     this.footerOfsalaryProcessDetail.totalAllowance = this.listOfsalaryProcessDetail.map(s => s.totalAllowance).reduce((a, b) => a + b, 0);
     this.footerOfsalaryProcessDetail.totalDeduction = this.listOfsalaryProcessDetail.map(s => s.totalDeduction).reduce((a, b) => a + b, 0);
     this.footerOfsalaryProcessDetail.grossPay = this.listOfsalaryProcessDetail.map(s => s.grossPay).reduce((a, b) => a + b, 0);
     this.footerOfsalaryProcessDetail.netPay = this.listOfsalaryProcessDetail.map(s => s.netPay).reduce((a, b) => a + b, 0);
     this.logger("this.footerOfsalaryProcessDetail.totalAllowance >>>",this.footerOfsalaryProcessDetail.totalAllowance);
      
    },
      (error) => { this.utilityService.httpErrorHandler(error) }
    )
  }

  openSalaryProcessDetailsModal() {
    this.modalService.open(this.salaryProcessDetailModal, "xl")
  }

  processIdForChecking: any = 0;
  processObjChecking: any = null;
  openSalaryProcessStatusModal(processId: any) {
    this.processIdForChecking = processId;
    this.processObjChecking = {};
    this.processObjChecking = Object.assign({}, this.listOfsalaryProcess.find(i => i.salaryProcessId == processId));
    //this.logger("processObjChecking >>>", this.processObjChecking);
    this.modalService.open(this.salaryProcessCheckingModal, "lg");
  }

  submitSalaryProcessDisbursedOrUndo(actionName: any) {
    if (actionName != '') {
      if (confirm("Are you sure you want to " + actionName + "?")) {
        this.btnProcess = true;
        this.areasHttpService.observable_post((ApiArea.payroll + ApiController.salary + "/SalaryProcessDisbursedOrUndo"), null, {
          params: { salaryProcessId: this.processIdForChecking, actionName: actionName, companyId: this.User().ComId, organizationId: this.User().OrgId, userId: this.User().UserId }
        }).subscribe((result: any) => {
          this.btnProcess = false;
          this.logger("result >>>", result);
          if (result.status) {
            this.utilityService.success(result.msg, "Server Response");
            this.modalService.service.dismissAll();
            this.getSalaryProcessInfos();
          }
          else {
            this.utilityService.fail(result.msg, "Server Response")
          }
        }, (error) => {
          this.btnProcess = false;
          this.utilityService.fail("Something went wrong", "Server Response")
        })
      }
    }
    else {
      this.utilityService.fail("Invalid form value(s)", "Site Response", 3000);
    }
  }

}
