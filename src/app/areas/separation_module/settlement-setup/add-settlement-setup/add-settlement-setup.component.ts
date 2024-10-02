import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { CustomModalService } from 'src/app/shared/services/custom-modal.service';
import { NotifyService } from 'src/app/shared/services/notify-service/notify.service';
import { SharedmethodService } from 'src/app/shared/services/shared-method/sharedmethod.service';
import { SettlementSetupRoutingService } from '../../routing-service/settlement-setup/settlement-setup-routing.service';

@Component({
  selector: 'app-add-settlement-setup',
  templateUrl: './add-settlement-setup.component.html',
  styleUrls: ['./add-settlement-setup.component.css']
})
export class AddSettlementSetupComponent implements OnInit {

  @ViewChild('addSettlementSetupModal', { static: true }) addSettlementSetupModal!: ElementRef;
  @Output() closeModalEvent = new EventEmitter<string>();
  @Input() resignationRequestId: number = 0;
  @Input() resignationEmployeeId: number = 0;
  @Output() refresh = new EventEmitter<void>();
  @Output() statusChanged: EventEmitter<{ status: string, resignationRequestId: number }> = new EventEmitter<{ status: string, resignationRequestId: number }>();
  @Input() editData: any;
  @Input() ExecutionFlag: string = '';
  @Input() deleteData: any;
  @Input() detailsData: any;


  settlementSetupForm: FormGroup;

  constructor(   
    private notifyService: NotifyService,
    private fb: FormBuilder,
    private separtionRoutingService: SettlementSetupRoutingService,
    private modalService: CustomModalService,
    private sharedMethodService: SharedmethodService

  ) { }

  
  ngOnInit(){
    this.initializeForm();
    
    if (this.ExecutionFlag === 'C') {
      this.openAddSettlementSetupModal();
    } 
    else if (this.ExecutionFlag === 'U') {
      this.settlementSetupForm.patchValue(this.editData);
      this.onSeparatedWithSalaryChange(this.settlementSetupForm.get('separatedWithSalary').value);
      this.openAddSettlementSetupModal();
    } 
    else if (this.ExecutionFlag === 'D') {
      this.settlementSetupForm.patchValue(this.deleteData);
      this.openAddSettlementSetupModal();
    } 
    else if (this.ExecutionFlag === 'I') {
      this.openAddSettlementSetupModal();
    }
    
    this.modalTitle = this.getModalTitle(); 
  }

  
  openAddSettlementSetupModal() {
    this.modalService.open(this.addSettlementSetupModal, "lg");
    this.getModalTitle();
  }


  closeAddSettlementSetupModal(reason: any) {
    this.resignationRequestId = 0;
    this.modalService.service.dismissAll(reason);
    this.closeModalEvent.emit(reason);
  }




  initializeForm() {
    this.settlementSetupForm = this.fb.group({

      settlementSetupId: new FormControl(0),
      resignationRequestId: new FormControl(this.resignationRequestId),
      employeeId: new FormControl(this.resignationEmployeeId, []),
      separatedWithSalary: new FormControl(false),
      isSalaryDisbursedWithSettlementProcess: new FormControl({ value: null, disabled: true }),
      isGotPunishment: new FormControl({ value: false, disabled: true }),
      withExtraBasic: new FormControl({ value: null, disabled: true }),
      noOfExtraBasic: [
        { value: null, disabled: true },
        this.setNoOfExtraBasicValidators(false),
      ],
      remarks: new FormControl('', Validators.maxLength(255)),
      noticePayBasedOn: new FormControl(''), 
    });
  
    this.settlementSetupForm.get('withExtraBasic').valueChanges.subscribe((value: boolean) => {
      const noOfExtraBasicControl = this.settlementSetupForm.get('noOfExtraBasic');
      if (!value) {
          noOfExtraBasicControl.setValue(null);
          noOfExtraBasicControl.disable({ onlySelf: true, emitEvent: false });
      } else {
          noOfExtraBasicControl.enable({ onlySelf: true, emitEvent: false });
      }
      noOfExtraBasicControl.setValidators(this.setNoOfExtraBasicValidators(value));
      noOfExtraBasicControl.updateValueAndValidity();
    });
  
    this.settlementSetupForm.get('separatedWithSalary').valueChanges.subscribe((value: boolean) => {
      const noticePayBasedOnControl = this.settlementSetupForm.get('noticePayBasedOn');
      if (value) {
        noticePayBasedOnControl.disable({ onlySelf: true, emitEvent: false });
      } else {
        noticePayBasedOnControl.enable({ onlySelf: true, emitEvent: false });
      }
    });
  }
  
  private setNoOfExtraBasicValidators(withExtraBasic: boolean): ValidatorFn[] {
    const validators: ValidatorFn[] = [Validators.min(0)];
    if (withExtraBasic) {
      validators.push(Validators.required);
    }
  
    return validators;
  }

  


  onSeparatedWithSalaryChange(isSeparatedWithSalary: boolean) {
    const salaryDisbursedControl = this.settlementSetupForm.get('isSalaryDisbursedWithSettlementProcess');
    const isGotPunishmentControl = this.settlementSetupForm.get('isGotPunishment');
    const withExtraBasicControl = this.settlementSetupForm.get('withExtraBasic');
    const noOfExtraBasicControl = this.settlementSetupForm.get('noOfExtraBasic');
    const remarksControl = this.settlementSetupForm.get('remarks');

    if (isSeparatedWithSalary) {
        salaryDisbursedControl.enable();
        isGotPunishmentControl.enable();
        withExtraBasicControl.enable();
        noOfExtraBasicControl.enable();
        remarksControl.enable();
    } else {
        salaryDisbursedControl.disable();
        isGotPunishmentControl.disable();
        withExtraBasicControl.disable();
        noOfExtraBasicControl.disable();
        remarksControl.disable();

        // Resetting form control values to null
        salaryDisbursedControl.setValue(null);
        isGotPunishmentControl.setValue(null);
        withExtraBasicControl.setValue(null);
        noOfExtraBasicControl.setValue(null);
        remarksControl.setValue(null);
    }
}





  settlementStatus: { Status: string, Msg: string };

  submit() {
    if (this.settlementSetupForm.valid) {
     
      const formDataWithExecutionFlag = {
        ...this.settlementSetupForm.value,
        ExecutionFlag: this.ExecutionFlag
      };

      this.separtionRoutingService.save(formDataWithExecutionFlag).subscribe(
        (response: any) => {
          this.settlementStatus = response;

          if (this.settlementStatus && this.settlementStatus.Status) {
            this.notifyService.showSuccessToast(this.settlementStatus.Msg);
            this.sharedMethodService.callMethod();
            this.settlementSetupForm.reset();
            this.closeAddSettlementSetupModal('close');
          } else {
            this.notifyService.showErrorToast(this.settlementStatus.Msg);
          }

        },
        (error) => {
          this.notifyService.handleApiError(error);
        }
      );
    }

  }



  modalTitle: string = '';

  getModalTitle(): string {

    if(this.ExecutionFlag === 'C'){
      return 'Create Settlement Setup';
    }
    else if (this.ExecutionFlag === 'U') {
      return 'Edit Settlement Setup';
    }
    else if(this.ExecutionFlag === 'D'){
      return 'Delete Settlement Setup';
    }
    else if(this.ExecutionFlag === 'I'){
      return 'Settlement Setup Details';
    }
    else{
      return ''
    }
  }
  

}


  


