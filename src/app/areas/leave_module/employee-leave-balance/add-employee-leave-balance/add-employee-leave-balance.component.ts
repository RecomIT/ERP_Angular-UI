
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { CustomModalService } from 'src/app/shared/services/custom-modal.service';
import { NotifyService } from 'src/app/shared/services/notify-service/notify.service';
import { CommonDashboardRoutingService } from 'src/app/areas/common-dashboard/common-dashboard-routing/common-dashboard-routing.service';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Select2ConfigService } from 'src/app/shared/services/Select2/select2-config.service';
import { LeaveTypeSerive } from '../../leave-type/leave-type.service';
import { LeaveBalanceRoutingService } from '../../routing-service/leave-balance/leave-balance-routing.service';
import { DatePickerConfigService } from 'src/app/shared/services/DatePicker/date-picker-config.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { DatePipe } from '@angular/common';
import { SharedmethodService } from 'src/app/shared/services/shared-method/sharedmethod.service';

@Component({
  selector: 'app-add-employee-leave-balance',
  templateUrl: './add-employee-leave-balance.component.html',
  styleUrls: ['./add-employee-leave-balance.component.css']
})
export class AddEmployeeLeaveBalanceComponent implements OnInit {

  @ViewChild('addEmployeeLeaveBalance', { static: true }) addEmployeeLeaveBalance!: ElementRef;
  @Output() closeModalEvent = new EventEmitter<string>();

  leaveBalanceForm: FormGroup;
  listOfEmployee: any[] = [];
  employeeContactSelect2Options: any = [];
  leaveTypeSelect2Options: any = [];
  ddlleaveTypes: any;
  
  @Input() isEditMode: boolean;
  @Input() currentEmployee: any;

   datePickerConfig: Partial<BsDatepickerConfig> = {};

   
  constructor(
    private modalService: CustomModalService,
    private fb: FormBuilder,
    private apiEndpointsService: CommonDashboardRoutingService,
    private notifyService: NotifyService,
    private select2ConfigService: Select2ConfigService,
    private leaveTypeSerive: LeaveTypeSerive,
    private leaveBalanceRoutingService: LeaveBalanceRoutingService,
    private datePickerConfigService: DatePickerConfigService,
    private datePipe: DatePipe,
    private sharedMethod: SharedmethodService
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.subscribeToEmployeeIdChanges();
    this.getEmployees();
    this.loadDropdown();

    if(this.isEditMode == false){
      this.openAddEmployeeLeaveBalanceModal();
    }else{
      this.openEditEmployeeLeaveBalanceModal(this.currentEmployee);
    }


    this.datePickerConfig = this.datePickerConfigService.getConfig();

  }


  initializeForm(): void {
    this.leaveBalanceForm = this.fb.group({
      employeeId: [{ value: '', disabled: this.isEditMode }, Validators.required],
      leaveBalances: this.fb.array([], { validators: this.duplicateLeaveTypeValidator() }),
      leavePeriodStart: ['', Validators.required],
      leavePeriodEnd: ['', Validators.required]
    });
    this.employeeContactSelect2Options = this.select2ConfigService.getDefaultConfig();
    this.leaveTypeSelect2Options = this.select2ConfigService.getDefaultConfig();

  }


  createLeaveBalanceGroup(leaveBalance?: any): FormGroup {
    const group = this.fb.group({
      leaveTypeId: [leaveBalance ? String(leaveBalance.leaveTypeId) : '', Validators.required],
      totalLeave: [leaveBalance ? leaveBalance.balance : '', [Validators.required, Validators.min(0)]], // Default to 0
      leavePeriodStart: [leaveBalance ? new Date(leaveBalance.leavePeriodStart) : this.leaveBalanceForm.get('leavePeriodStart').value],
      leavePeriodEnd: [leaveBalance ? new Date(leaveBalance.leavePeriodEnd) : this.leaveBalanceForm.get('leavePeriodEnd').value]
    });
  
    group.get('leaveTypeId').valueChanges.subscribe(() => {
      this.leaveBalances.updateValueAndValidity();
      this.printFormValidity();
    });
  
    return group;
  }
  

  openEditEmployeeLeaveBalanceModal(employee: any) {
    this.isEditMode = true;
    this.currentEmployee = employee;
    this.leaveBalanceForm.reset();
    this.leaveBalances.clear();
  
    const firstLeaveBalance = employee.leaveBalances.length > 0 ? employee.leaveBalances[0] : null;
    const leavePeriodStart = firstLeaveBalance ? new Date(firstLeaveBalance.leavePeriodStart) : '';
    const leavePeriodEnd = firstLeaveBalance ? new Date(firstLeaveBalance.leavePeriodEnd) : '';
  
    this.leaveBalanceForm.patchValue({
      employeeId: employee.employeeId,
      leavePeriodStart: leavePeriodStart,
      leavePeriodEnd: leavePeriodEnd
    });
  
    const leaveBalanceArray = this.leaveBalances;
    employee.leaveBalances.forEach((leaveBalance: any) => {
      const leaveBalanceFormGroup = this.createLeaveBalanceGroup(leaveBalance);
      leaveBalanceArray.push(leaveBalanceFormGroup);
    });
  


    leaveBalanceArray.updateValueAndValidity();

    this.printFormValues();
  
    this.modalService.open(this.addEmployeeLeaveBalance, "lg");
  }
  
  printFormValues(): void {
    //console.log('Form values:', this.leaveBalanceForm.value);
    //console.log('Form errors:', this.leaveBalanceForm.errors);
  }
  
  



  get leaveBalances(): FormArray {
    return this.leaveBalanceForm.get('leaveBalances') as FormArray;
  }



  duplicateLeaveTypeValidator(): ValidatorFn {
    return (formArray: AbstractControl): { [key: string]: any } | null => {
      if (!(formArray instanceof FormArray)) {
        return null;
      }
  
      const leaveTypeControls = formArray.controls;
      const leaveTypeIds = leaveTypeControls.map(control => String(control.get('leaveTypeId').value));
      const hasDuplicates = leaveTypeIds.some((id, index) => leaveTypeIds.indexOf(id) !== index);
  
      if (hasDuplicates) {
        //console.log('Duplicate leave type IDs detected:', leaveTypeIds);
      } else {
        //console.log('No duplicate leave type IDs found.');
      }
  
      return hasDuplicates ? { duplicateLeaveType: true } : null;
    };
  }
  





  printFormValidity() {
    //('Form is valid:', this.leaveBalanceForm.valid);
  }



  addLeaveBalance(): void {
    const newLeaveBalanceGroup = this.createLeaveBalanceGroup({
      leaveTypeId: '', 
      totalLeave: 0,   
      leavePeriodStart: this.leaveBalanceForm.get('leavePeriodStart').value, 
      leavePeriodEnd: this.leaveBalanceForm.get('leavePeriodEnd').value      
    });
  
    if (this.leaveBalances.valid) {
      this.leaveBalances.push(newLeaveBalanceGroup);
    } else {
      this.leaveBalances.markAllAsTouched();

      this.printFormValidity();
    }
  }
  

  

  removeLeaveBalance(index: number): void {
    this.leaveBalances.removeAt(index);
  }


  onSubmit(): void {
    if (this.leaveBalanceForm.valid) {
      const formValue = this.leaveBalanceForm.value;
    
      if (formValue.leavePeriodStart) {
        formValue.leavePeriodStart = this.datePipe.transform(formValue.leavePeriodStart, 'yyyy-MM-dd');
      }
      if (formValue.leavePeriodEnd) {
        formValue.leavePeriodEnd = this.datePipe.transform(formValue.leavePeriodEnd, 'yyyy-MM-dd');
      }
    
      formValue.executionMode = this.isEditMode ? 'Edit' : 'Insert'; 

      if (this.isEditMode) {

        formValue.employeeId = this.leaveBalanceForm.get('employeeId').value;
        
        this.leaveBalanceRoutingService.update(formValue).subscribe(response => {
          // console.log('Leave balance updated successfully:', response);

          this.notifyService.showSuccessToast('Leave balance updated successfully');
          this.sharedMethod.callMethod();
        }, error => {
          // console.error('Error updating leave balance:', error);

          this.notifyService.handleApiError(error);
        });
      } else {
        this.leaveBalanceRoutingService.save(formValue).subscribe(response => {
          // console.log('Leave balance saved successfully:', response);

          this.notifyService.showSuccessToast('Leave balance saved successfully');
          this.sharedMethod.callMethod();
        }, error => {
          // console.error('Error saving leave balance:', error);

          this.notifyService.handleApiError(error);
        });
      }
    
      this.closeAddEmployeeLeaveBalanceModal('submit');
    } else {
      // console.log('Form is invalid');
      this.leaveBalanceForm.markAllAsTouched();
    }
  }
  


  getEmployees() {
    this.apiEndpointsService.getEmployeeContactApi<any>({}).subscribe({
      next: (response) => {
        if (Array.isArray(response)) {
          this.listOfEmployee = response;
        }
      },
      error: (error: any) => {
        console.error(error);
        this.notifyService.handleApiError(error);
      }
    });
  }

  subscribeToEmployeeIdChanges(): void {
    this.leaveBalanceForm.get('employeeId').valueChanges.subscribe((employeeId) => {
      //('Employee ID changed:', employeeId);
    });
  }

  loadDropdown() {
    this.leaveTypeSerive.loadLeaveTypeDropdown();
    this.ddlleaveTypes = this.leaveTypeSerive.ddl$;
  }



  openAddEmployeeLeaveBalanceModal() {
    this.isEditMode = false;
    this.leaveBalanceForm.reset();
    this.leaveBalances.clear();
    this.leaveBalances.push(this.createLeaveBalanceGroup());
    this.modalService.open(this.addEmployeeLeaveBalance, "lg");
  }


  closeAddEmployeeLeaveBalanceModal(reason: any) {
    this.modalService.service.dismissAll(reason);
    this.closeModalEvent.emit(reason);
  }



  clearLeaveYearStartDate(): void {
    this.leaveBalanceForm.get('leavePeriodStart').setValue(null);
  }

  clearLeaveYearEndDate(): void{
    this.leaveBalanceForm.get('leavePeriodEnd').setValue(null);
  }


}
