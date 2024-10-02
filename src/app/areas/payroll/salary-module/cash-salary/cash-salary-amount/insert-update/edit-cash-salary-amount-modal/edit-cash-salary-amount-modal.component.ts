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
  selector: 'app-salary-module-edit-cash-salary-amount-modal',
  templateUrl: './edit-cash-salary-amount-modal.component.html'
})
export class EditCashSalaryAmountModalComponent implements OnInit {
    @Input() uploadCashSalaryId: any = 0;
    @Output() closeModalEvent = new EventEmitter<string>();
    @ViewChild('editCashSalaryModal', { static: true }) editCashSalaryModal!: ElementRef;
  
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
      this.loadEmployees();
      this.loadCashSalaryHead();
      if(this.uploadCashSalaryId > 0){
        this.getUploadCashSalaryById(this.uploadCashSalaryId);
      }  
    }
    select2Config =this.utilityService.select2Config();
    select2Options =this.utilityService.select2Config();
    
    ddlYears: any = this.utilityService.getYears(2);
    ddlMonths: any = this.utilityService.getMonths();
    
    currentMonth: number = parseInt(this.utilityService.currentMonth);
    currentYear: number = parseInt(this.utilityService.currentYear);
  
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
  
    closeModal(reason: string) {
      this.modalService.service.dismissAll(reason);
      this.closeModalEvent.emit(reason); // fire
    }
    getUploadCashSalaryById(id: any) {   
      this.areasHttpService.observable_get<any[]>((ApiArea.payroll + "/Salary/CashSalary" + "/UploadCashSalaryList"), {
        responseType: "json", params: { uploadCashSalaryId: id }
      }).subscribe(response => {
        //console.log("uplaodCashSalaryForEdit response >>>", response)
        this.uplaodCashSalaryForEdit(response[0]);
      })
    }
  
    btnEditCashSalary: boolean = false;
    uplaodCashSalaryEditForm: FormGroup;
    uplaodCashSalaryForEdit(data: any) {
      this.btnEditCashSalary = false;
      this.uplaodCashSalaryEditForm = this.fb.group({
        uploadCashSalaryId: new FormControl(data.uploadCashSalaryId, [Validators.required]),       
        cashSalaryHeadId: new FormControl(data.cashSalaryHeadId, [Validators.required, Validators.min(1)]),   
        salaryMonth: new FormControl(data.salaryMonth, [Validators.required]),
        salaryYear: new FormControl(data.salaryYear, [Validators.required]),  
        employeeId: new FormControl({ value: data.employeeId, disabled: true }, [Validators.required, Validators.min(1)]),         
        amount: new FormControl(data.amount, [Validators.required, Validators.min(1)])
      })
      this.modalService.open(this.editCashSalaryModal, "lg");
    }
  
    updateUploadCashSalary() {
      if (this.uplaodCashSalaryEditForm.valid) {
        this.btnEditCashSalary = true;
        for (const prop in this.uplaodCashSalaryEditForm.controls) {
          this.uplaodCashSalaryEditForm.value[prop] = this.uplaodCashSalaryEditForm.controls[prop].value;
        }
  
        this.areasHttpService.observable_put((ApiArea.payroll + "/Salary/CashSalary" + "/UpdateUploadCashSalary"), JSON.stringify(this.uplaodCashSalaryEditForm.value), {
          'headers': {
            'Content-Type': 'application/json'
          },
        }).subscribe((result) => {
          //this.logger("Submit result >>", result);
          var data = result as any;
          this.btnEditCashSalary = false;
          if (data.status) {
            this.utilityService.success(data.msg, "Server Response");
            this.closeModal('Save Complete');
          }
          else {
            this.utilityService.fail(data.msg, "Server Response")
          }
        }, (error) => {
          this.utilityService.fail("Something went wrong", "Server Response")
          this.btnEditCashSalary = false;
        })
      }
    }
}

  
