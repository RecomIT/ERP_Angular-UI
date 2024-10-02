import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { BsDatepickerConfig } from "ngx-bootstrap/datepicker";
import { TypeaheadMatch } from "ngx-bootstrap/typeahead";
import { AreasHttpService } from "src/app/areas/areas.http.service";
import { ApiArea, ApiController } from "src/app/shared/constants";
import { ControlPanelWebService } from "src/app/shared/services/control-panel.service";
import { CustomModalService } from "src/app/shared/services/custom-modal.service";
import { HrWebService } from "src/app/shared/services/hr-web.service";
import { PayrollWebService } from "src/app/shared/services/payroll-web.service";
import { UserService } from "src/app/shared/services/user.service";
import { UtilityService } from "src/app/shared/services/utility.service";

@Component({
  selector: 'app-salary-module-cash-salary-process-modal',
  templateUrl: './cash-salary-process-modal.component.html'
})
export class CashSalaryProcessModalComponent implements OnInit {
    datePickerConfig: Partial<BsDatepickerConfig> = {};
    @Input() cashSalaryProcessId: any = 0;
    @Output() closeModalEvent = new EventEmitter<string>();
  
    @ViewChild('cashSalaryProcessModal', { static: true }) cashSalaryProcessModal!: ElementRef;
  
    constructor(private fb: FormBuilder, private areasHttpService: AreasHttpService, private controlPanelWebService: ControlPanelWebService,
        private payrollWebService: PayrollWebService, private utilityService: UtilityService, private hrWebService: HrWebService,
        private userService: UserService, public modalService: CustomModalService) {
    }
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
        this.openModal();
        this.salaryProcessType = "";
        this.processMonth = "";
        this.processYear = "";
        this.salaryDate = null;
        this.executionOn = "";
        //this.loadEmployees();
        this.getMonths();
    }
  
    openModal() {
        this.modalService.open(this.cashSalaryProcessModal, "xl");
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
  
    resetOtherProps() {
        this.salaryProcessType = "";
        this.processMonth = "";
        this.processYear = "";
        this.salaryDate = null;
    }
  
  //   processtype_changed() {
  //       if (this.uploadedComponentSalaryProcessForm != null || this.uploadedComponentSalaryProcessForm instanceof FormGroup) {
  //           this.uploadedComponentSalaryProcessForm = null;
  //       }
  
  //       if (this.salaryProcessType != "") {
  //           if (this.salaryProcessType == "Systemically") {
  
  //           }
  //           else if (this.salaryProcessType == "Uploaded Component") {
  //               this.uploadedComponentSalaryProcessFormInit();
  //           }
  //           else if (this.salaryProcessType == "Uploaded Salary-Sheet") {
  
  //           }
  //       }
  //       //console.log("this.uploadedComponentSalaryProcessForm >>>",this.uploadedComponentSalaryProcessForm);
  //       //alert("changed fired...");
  //   }
  
    monthYear_salaryDate_changed() {
  
      //   if (this.salaryProcessType == "Uploaded Component") {
      //       this.uploadedComponentSalaryProcessForm.get('salaryDate').setValue(this.salaryDate);
      //       this.uploadedComponentSalaryProcessForm.get('month').setValue(this.processMonth);
      //       this.uploadedComponentSalaryProcessForm.get('year').setValue(this.processYear);
  
      //       this.logger("uploadedComponentSalaryProcessForm valus >>>", this.uploadedComponentSalaryProcessForm.value);
      //   }
      //   else if (this.salaryProcessType == "Systemically") {
  
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
  
  //   uploadedComponentSalaryProcessForm: FormGroup;
  //   uploadedComponentSalaryProcessFormInit() {
  //       this.uploadedComponentSalaryProcessForm = this.fb.group({
  //           processBy: new FormControl(this.salaryProcessType, [Validators.required]),
  //           month: new FormControl(this.processMonth, [Validators.required]),
  //           year: new FormControl(this.processYear, [Validators.required]),
  //           salaryDate: new FormControl(this.salaryDate, [Validators.required]),
  //           branchId: new FormControl(this.User().BranchId),
  //           companyId: new FormControl(this.User().ComId),
  //           organizationId: new FormControl(this.User().OrgId),
  //           userId: new FormControl(this.User().UserId)
  //       })
  
  //       this.uploadedComponentSalaryProcessForm.valueChanges.subscribe((data) => {
  //           this.logFormErrors();
  //       })
  //   }
  
    formErrors = {
        'processBy': '',
        'monthYear': '',
        'salaryDate': ''
    }
  
    validationMessages = {     
        'monthYear': {
            'required': 'Field is required'
        },
        'salaryDate': {
            'required': 'Field is required'
        }
    }
  
  //   logFormErrors(formGroup: FormGroup = this.uploadedComponentSalaryProcessForm) {
  //       Object.keys(formGroup.controls).forEach((key: string) => {
  //           const abstractControl = formGroup.get(key);
  //           //console.log("key>>", key);
  //           this.formErrors[key] = '';
  //           if (abstractControl && !abstractControl.valid && (abstractControl.touched || abstractControl.dirty)) {
  //               const messages = this.validationMessages[key];
  //               // console.log("messages>>", messages);
  //               // console.log("abstractControl.value >>", abstractControl.value);
  //               // console.log("abstractControl.errors>>", abstractControl.errors);
  //               for (const errorKey in abstractControl.errors) {
  //                   this.formErrors[key] += messages[errorKey];
  //               }
  //           }
  //       })
  //   }
  
    btnProcess: boolean = false;
    runSalaryProcess() {    
        if (this.executionOn == "All" && this.allEmployeeSalaryProcessForm.valid) {
            this.btnProcess = true;
            this.areasHttpService.observable_post<any>((ApiArea.payroll + "/Salary/CashSalary" + "/CashSalaryProcess"), JSON.stringify(this.allEmployeeSalaryProcessForm.value), {
                'headers': {
                    'Content-Type': 'application/json'
                },
            }).subscribe(result => {
                var data = result as any;
                this.btnProcess = false;
  
                if (data?.status) {
                    //this.employeesList = [];
                    this.resetOtherProps();
                    this.utilityService.success(data.msg, "Server Response");
                    this.closeModal('Save Complete');
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
        else if (this.executionOn == "Department" && this.departmentWiseSalaryProcessForm.valid) {
          this.btnProcess = true;
          this.areasHttpService.observable_post<any>((ApiArea.payroll + "/Salary/CashSalary" + "/CashSalaryProcess"), JSON.stringify(this.departmentWiseSalaryProcessForm.value), {
              'headers': {
                  'Content-Type': 'application/json'
              },
          }).subscribe(result => {
              var data = result as any;
              this.btnProcess = false;
  
              if (data?.status) {
                  //this.employeesList = [];
                  this.resetOtherProps();
                  this.utilityService.success(data.msg, "Server Response");
                  this.closeModal('Save Complete');
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
      else if (this.executionOn == "Branch" && this.branchWiseSalaryProcessForm.valid) {
          this.btnProcess = true;
          this.areasHttpService.observable_post<any>((ApiArea.payroll + "/Salary/CashSalary" + "/CashSalaryProcess"), JSON.stringify(this.branchWiseSalaryProcessForm.value), {
              'headers': {
                  'Content-Type': 'application/json'
              },
          }).subscribe(result => {
              var data = result as any;
              this.btnProcess = false;
  
              if (data?.status) {
                  //this.employeesList = [];
                  this.resetOtherProps();
                  this.utilityService.success(data.msg, "Server Response");
                  this.closeModal('Save Complete');
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
      //   else if (this.executionOn == "Selected Employees" && this.selectedEmployeestWiseSalaryProcessForm.valid) {
      //       this.btnProcess = true;
      //       this.areasHttpService.observable_post((ApiArea.payroll + ApiController.salary + "/SalaryProcess"), JSON.stringify(this.selectedEmployeestWiseSalaryProcessForm.value), {
      //           'headers': {
      //               'Content-Type': 'application/json'
      //           },
      //       }).subscribe(result => {
      //           var data = result as any;
      //           this.btnProcess = false;
  
      //           if (data?.status) {
      //               this.employeesList = [];
      //               this.resetOtherProps();
      //               this.selectedEmployeestWiseSalaryProcessForm.reset();
      //               this.utilityService.success(data.msg, "Server Response");
      //           }
      //           else {
      //               if (data.msg == "Validation Error") {
      //                   this.utilityService.fail("Validation Error", "Server Response", 5000);
      //               }
      //               else {
      //                   this.utilityService.fail(data.msg, "Server Response")
      //               }
      //           }
      //       }, (error) => {
      //           this.btnProcess = false;
      //           this.utilityService.fail("Something went wrong", "Server Response");
      //       })
      //   }
  
      //   else if(this.salaryProcessType == "Uploaded Component" && this.uploadedComponentSalaryProcessForm.valid){
      //       this.btnProcess = true;
      //       this.areasHttpService.observable_post((ApiArea.payroll + ApiController.salary + "/SalaryProcess"), JSON.stringify(this.uploadedComponentSalaryProcessForm.value), {
      //           'headers': {
      //               'Content-Type': 'application/json'
      //           },
      //       }).subscribe(result => {
      //           var data = result as any;
      //           this.btnProcess = false;
  
      //           if (data?.status) {
      //               this.employeesList = [];
      //               this.resetOtherProps();
      //               this.utilityService.success(data.msg, "Server Response");
      //               this.closeModal('Save Complete');
      //           }
      //           else {
      //               if (data.msg == "Validation Error") {
      //                   this.utilityService.fail("Validation Error", "Server Response", 5000);
      //               }
      //               else {
      //                   this.utilityService.fail(data.msg, "Server Response")
      //               }
      //           }
      //       }, (error) => {
      //           this.btnProcess = false;
      //           this.utilityService.fail("Something went wrong", "Server Response");
      //       })
      //   }
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
      //   if (this.selectedEmployeestWiseSalaryProcessForm != null || this.selectedEmployeestWiseSalaryProcessForm instanceof FormGroup) {
      //       this.selectedEmployeestWiseSalaryProcessForm = null;
      //   }
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
      //   else if (this.executionOn == 'Selected Employees') {
      //       //this.loadEmployees();
      //       //this.selectedEmployeestWiseSalaryProcessFormInit();
      //   }
    }
  
    //#region All employees...
    allEmployeeSalaryProcessForm: FormGroup;
    allEmployeeSalaryProcessFormInit() {
        this.allEmployeeSalaryProcessForm = this.fb.group({
            //processBy: new FormControl(this.salaryProcessType, [Validators.required]),
            month: new FormControl(this.processMonth, [Validators.required]),
            year: new FormControl(this.processYear, [Validators.required]),
            executionOn: new FormControl(this.executionOn),
            salaryDate: new FormControl(this.salaryDate, [Validators.required])      
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
            month: new FormControl(this.processMonth, [Validators.required]),
            year: new FormControl(this.processYear, [Validators.required]),
            executionOn: new FormControl(this.executionOn, [Validators.required]),
            processBranchId: new FormControl(0, [Validators.min(1)]),
            salaryDate: new FormControl(this.salaryDate, [Validators.required])       
        })
    }
    //#endregion
  
    //#region Department
  
    departmentWiseSalaryProcessForm: FormGroup;
    processDepartmentId: string = "0";
    departments: any[] = [];
  
    processDepartment_changed() {
        this.departmentWiseSalaryProcessForm.get('processDepartmentId').setValue(parseInt(this.processDepartmentId))
    }
  
    loadDepartments() {
        this.departments = [];
        this.hrWebService.getDepartments<any[]>().then((data) => {
            //this.logger("data >>>",data);
            this.departments = data;
        })
    }
  
    departmentWiseSalaryProcessFormInit() {
        this.departmentWiseSalaryProcessForm = this.fb.group({        
            month: new FormControl(this.processMonth, [Validators.required]),
            year: new FormControl(this.processYear, [Validators.required]),
            executionOn: new FormControl(this.executionOn, [Validators.required]),
            processDepartmentId: new FormControl(0, [Validators.min(1)]),
            salaryDate: new FormControl(this.salaryDate, [Validators.required])       
        })
    }
    //#endregion Department
    closeModal(reason: any) {
      this.modalService.service.dismissAll(reason);
      this.closeModalEvent.emit(reason);
  }
  

  }
  
