import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { ApiArea, ApiController } from 'src/app/shared/constants';
import { CustomModalService } from 'src/app/shared/services/custom-modal.service';
import { HrWebService } from 'src/app/shared/services/hr-web.service';
import { UserService } from 'src/app/shared/services/user.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AreasHttpService } from "src/app/areas/areas.http.service";
import { EmployeeInfoService } from "src/app/areas/employee_module/employee/employee-info.service";


@Component({
  selector: 'app-salary-module-add-cash-salary-amount',
  templateUrl: './add-cash-salary-amount.component.html'
})
export class AddCashSalaryAmountComponent implements OnInit {
    @Input() uploadCashSalaryId: any = 0;
    @Output() closeModalEvent = new EventEmitter<string>();
    @ViewChild('createCashSalaryModal', { static: true }) createCashSalaryModal!: ElementRef;
  
    modalTitle: string = "";
    constructor(private fb: FormBuilder, // strongly type form build
      private areasHttpService: AreasHttpService, // http request
      private userService: UserService, // user service user id
      public utilityService: UtilityService, // utility 
      public modalService: CustomModalService, // modal service 
      private hrWebService: HrWebService,
      private employeeInfoService: EmployeeInfoService) {
    }
  
    ngOnInit(): void {
      this.createCashSalaryFormInit();
      this.loadEmployees();
      this.loadCashSalaryHead();
    }
  
    closeModal(reason: string) {
      this.modalService.service.dismissAll(reason);
      this.closeModalEvent.emit(reason); // fire
    }
  
    User() {
      return this.userService.getUser();
    }
  
    createCashSalaryForm: FormGroup;
    formArray: any;
    createCashSalaryFormInit() {
      this.createCashSalaryForm = this.fb.group({
        cashSalaries: this.fb.array([
          this.fb.group({
            uploadCashSalaryId: new FormControl(0),       
            cashSalaryHeadId: new FormControl(0, [Validators.min(1)]),   
            salaryMonth: new FormControl(this.utilityService.currentMonth, [Validators.required]),
            salaryYear: new FormControl(this.utilityService.currentYear, [Validators.required]),  
            employeeId: new FormControl(0, [Validators.min(1)]),         
            amount: new FormControl(0, [Validators.min(1)])
          })
        ])
      })
      this.formArray = (<FormArray>this.createCashSalaryForm.get('cashSalaries')).controls;
  
      this.modalService.open(this.createCashSalaryModal, "xl");
    }
  
    select2Config =this.utilityService.select2Config();
    select2Options =this.utilityService.select2Config();
    ddlYears: any = this.utilityService.getYears(2);
    ddlMonths: any = this.utilityService.getMonths();
    
    currentMonth: number = parseInt(this.utilityService.currentMonth);
    currentYear: number = parseInt(this.utilityService.currentYear);
  
    // ddlEmployees: any[] = [];
    // loadEmployees() {
    //   this.ddlEmployees = [];
    //   this.hrWebService.getEmployees<any[]>().then((data) => {
    //     this.ddlEmployees = data;
    //   })
    // }

    ddlEmployees: any[]; 
    loadEmployees() {
        this.employeeInfoService.loadDropdownData({});
        this.employeeInfoService.ddl_employee_data$.subscribe(data => {
        this.employeeInfoService.loadDropdown(data);
        this.ddlEmployees = this.employeeInfoService.ddl$;
        }, error => {
        console.error('Error while fetching data:', error);
        });
    }
  
    ddlCashSalaryHead: any[] = [];
    cashSalaryHeadId: any = 0;
    loadCashSalaryHead() {
      this.ddlCashSalaryHead = []; 
      this.areasHttpService.observable_get<any[]>((ApiArea.payroll + "/Salary/CashSalary" + "/GetCashSalaryHeadExtension"), {
        responseType: "json",
        observe: 'response',
        params: {
          cashSalaryHeadId: this.cashSalaryHeadId
        }
      }).subscribe((response) => {
        var res = response as any;
        this.ddlCashSalaryHead = res.body;   
      })
    }
  
    addCashSalaryButtonClick(): void {
      (<FormArray>this.createCashSalaryForm.get('cashSalaries')).push(this.addCashSalaryGroup());
    }
  
    addCashSalaryGroup() {
      return this.fb.group({
        uploadCashSalaryId: new FormControl(0),       
        cashSalaryHeadId: new FormControl(0, [Validators.min(1)]),   
        salaryMonth: new FormControl(this.utilityService.currentMonth, [Validators.required]),
        salaryYear: new FormControl(this.utilityService.currentYear, [Validators.required]),  
        employeeId: new FormControl(0, [Validators.min(1)]),         
        amount: new FormControl(0, [Validators.min(1)])
      })
    }
  
    removeCashSalaryButtonClick(index: number) {
      if ((<FormArray>this.createCashSalaryForm.get('cashSalaries')).length > 1) {
        (<FormArray>this.createCashSalaryForm.get('cashSalaries')).removeAt(index);
      }
      else {
        this.utilityService.fail("You can't delete last item", "Site Response");
      }
    }
  
   btnAddCashSalary: boolean = false;
   submitCashSalary() {
    if (this.createCashSalaryForm.valid) {
      this.btnAddCashSalary = true;
      var cashSalaries: any = [];
      this.formArray.forEach((formGroup: FormGroup) => {
        //console.log("form group value >>>", formGroup.value);
        cashSalaries.push({
          uploadCashSalaryId: formGroup.get('uploadCashSalaryId').value,
          employeeId: this.utilityService.IntTryParse(formGroup.get('employeeId').value),
          cashSalaryHeadId: this.utilityService.IntTryParse(formGroup.get('cashSalaryHeadId').value),
          salaryMonth: formGroup.get('salaryMonth').value,
          salaryYear: formGroup.get('salaryYear').value,
          amount: formGroup.get('amount').value,       
        })
      })
      
      this.areasHttpService.observable_post<any>((ApiArea.payroll + "/Salary/CashSalary" + "/SaveCashSalaries"), JSON.stringify(cashSalaries), {
        'headers': {
          'Content-Type': 'application/json'
        },
      }).subscribe((result) => {
        var data = result as any;
        this.btnAddCashSalary = false;
        if (data.status) {
          this.utilityService.success(data.msg, "Server Response");
          this.closeModal('Save Complete');
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
        console.log("error >>", error)
        this.utilityService.fail("Something went wrong", "Server Response")
        this.btnAddCashSalary = false;
      })
    }
  }
  
  
  }
  
