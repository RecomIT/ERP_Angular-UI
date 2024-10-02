import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { CustomModalService } from 'src/app/shared/services/custom-modal.service';
import { UserService } from 'src/app/shared/services/user.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AllowanceArrearAdjustmentService } from '../salary-allowance-arrear-adjustment.service';
import { AllowanceNameService } from '../../../allowance/allowance-head/allowance-name.service';
import { EmployeeInfoService } from 'src/app/areas/employee_module/employee/employee-info.service';

@Component({
  selector: 'app-salary-module-delete-salary-allowance-arrear-adjustment-modal',
  templateUrl: './delete-salary-allowance-arrear-adjustment-modal.component.html'
})
export class DeleteSalaryAllowanceArrearAdjustmentModalComponent implements OnInit {

  @ViewChild('deleteSalaryAllowanceArrearAdjustmentModal', { static: true }) deleteSalaryAllowanceArrearAdjustmentModal!: ElementRef;
  @Input() id: any = 0;
  @Input() salaryMonth: number = 0;
  @Input() salaryYear: number = 0;
  @Output() closeModalEvent = new EventEmitter<string>();
  modalTitle: string = "";
  datePickerConfig: Partial<BsDatepickerConfig> = {};
 
  constructor(private fb: FormBuilder,  
    private userService: UserService, 
    public utilityService: UtilityService,
    public modalService: CustomModalService,  
    private allowanceAdjustmentService: AllowanceArrearAdjustmentService,
    private allowanceNameService: AllowanceNameService,
    private employeeInfoService: EmployeeInfoService) { }

    monthName: string = "";

    ngOnInit(): void {
        console.log("month >>>", this.salaryMonth);
        console.log("year >>>", this.salaryYear);
        this.monthName = this.utilityService.getMonths().find(item => item.monthNo == this.salaryMonth).month;   
        this.loadEmployees();
        this.loadAllowanceNames();     
        if(this.id > 0){
          this.getAllowanceArrearAdjustmentById(this.id);
        }    
      }
  
    select2Config = this.utilityService.select2Config();
    ddlYears: any = this.utilityService.getYears(2);
    ddlMonths: any = this.utilityService.getMonths();
    currentMonth: number = parseInt(this.utilityService.currentMonth);
    currentYear: number = parseInt(this.utilityService.currentYear);

    logger(msg: any, options: any) {
      this.utilityService.consoleLog(msg, options);
    }
    User() {
      return this.userService.User();
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

    ddlAllowances: any[]=[];
    loadAllowanceNames(){
    this.allowanceNameService.loadAllowanceNameDropdown();
    this.allowanceNameService.ddl$.subscribe(data=>{       
        this.ddlAllowances = data;
    },(error)=>{
        console.log("error  while fetching data >>>", error);
    })
  }   

    getAllowanceArrearAdjustmentById(id: any) {     
      let params = {id: id};
      this.allowanceAdjustmentService.getById(params).subscribe(response => { 
        this.allowanceArrearAdjustmentForDelete(response.body);
      })
    } 
    
    btnArrearAdjustment: boolean = false;
    allowanceArrearAdjustmentDeleteForm: FormGroup;
    allowanceArrearAdjustmentForDelete(data: any) {
      this.btnArrearAdjustment = false;
      this.allowanceArrearAdjustmentDeleteForm = this.fb.group({
        id: new FormControl(data.id),
        employeeId: new FormControl({ value: data.employeeId, disabled: true }, [Validators.required, Validators.min(1)]),
        allowanceNameId: new FormControl({ value: data.allowanceNameId, disabled: true }, [Validators.required]),
        salaryMonth: new FormControl({ value: data.salaryMonth, disabled: true }, [Validators.required]),
        salaryYear: new FormControl({ value: data.salaryYear, disabled: true }, [Validators.required]),
        flag: new FormControl({ value: data.flag, disabled: true }, [Validators.required]),
        amount: new FormControl({ value: data.amount, disabled: true }, [Validators.required])
      })
      this.modalService.open(this.deleteSalaryAllowanceArrearAdjustmentModal, "lg");
    }
  
    confirmDelete() {
      if (this.allowanceArrearAdjustmentDeleteForm.valid) {
        this.btnArrearAdjustment = true;
        for (const prop in this.allowanceArrearAdjustmentDeleteForm.controls) {
          this.allowanceArrearAdjustmentDeleteForm.value[prop] = this.allowanceArrearAdjustmentDeleteForm.controls[prop].value;        
        }
  
        this.allowanceAdjustmentService.delete(this.allowanceArrearAdjustmentDeleteForm.value).subscribe((result) => {     
          var data = result as any;
          this.btnArrearAdjustment = false;
          if (data.status) {
            this.utilityService.success(data.msg, "Server Response");
            this.closeModal('Save Complete');
          }
          else {
            this.utilityService.fail(data.msg, "Server Response")
          }
        }, (error) => {
          this.utilityService.fail("Something went wrong", "Server Response")
          this.btnArrearAdjustment = false;
        })
      }
    }
    closeModal(reason: any) {
        this.modalService.service.dismissAll(reason);
        this.closeModalEvent.emit(reason);
    }

}
