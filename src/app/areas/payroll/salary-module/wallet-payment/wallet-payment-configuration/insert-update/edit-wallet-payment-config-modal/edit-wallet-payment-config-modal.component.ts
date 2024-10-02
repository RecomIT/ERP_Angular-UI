import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { CustomModalService } from "src/app/shared/services/custom-modal.service";
import { HrWebService } from "src/app/shared/services/hr-web.service";
import { PayrollWebService } from "src/app/shared/services/payroll-web.service";
import { UserService } from "src/app/shared/services/user.service";
import { UtilityService } from "src/app/shared/services/utility.service";
import { DatePipe } from '@angular/common';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { WalletPaymentService } from "../../../wallet-payment.service";

@Component({
  selector: 'app-salary-module-edit-wallet-payment-config-modal',
  templateUrl: './edit-wallet-payment-config-modal.component.html'
})
export class EditWalletPaymentConfigModalComponent implements OnInit {
    @Input() walletConfigId: any = 0;
    @Output() closeModalEvent = new EventEmitter<string>();
    @ViewChild('editWalletPaymentConfigModal', { static: true }) editWalletPaymentConfigModal!: ElementRef;
    modalTitle: string = "Update Wallet Payment Configuration";
    datePickerConfig: Partial<BsDatepickerConfig> = {};
    constructor(
        private fb: FormBuilder,
        private userService: UserService,
        public utilityService: UtilityService,
        public modalService: CustomModalService,
        public payrollWebService: PayrollWebService,
        public hrWebService: HrWebService,      
        private datepipe: DatePipe,
        public walletPaymentService: WalletPaymentService,
    ) { }
  
    ngOnInit(): void { 
      this.loadInternalDesignations();
      if(this.walletConfigId > 0){
        this.getWalletPaymentConfigById(this.walletConfigId);
      }
      this.datePickerConfig = this.utilityService.datePickerConfig();
  
    }
  
    select2Options = this.utilityService.select2Config();
    baseOfPayments: any = ["Flat", "Basic", "Gross"];
    ddlStatus: any= this.utilityService.getDataStatus().filter(item=> item == "Pending" || item == "Approved" || item == "Rejected");
  
    getWalletPaymentConfigById(id: any) {  
      let params = {walletConfigId : id};
      this.walletPaymentService.getWalletPaymentConfigById(params).subscribe(response => {       
        if (response != null && response[0]?.walletConfigId > 0) {
          this.walletPaymentConfigurationForEdit(response[0]);
      }
      })
    }
    btnEditWalletPaymentConfig: boolean = false;
    editWalletPaymentConfigForm: FormGroup; 
    walletPaymentConfigurationForEdit(data: any) {
       this.btnEditWalletPaymentConfig = false;
       this.editWalletPaymentConfigForm = this.fb.group({
        walletConfigId: new FormControl(data.walletConfigId),
        internalDesignationId: new FormControl({ value: data.internalDesignationId, disabled: true }, [Validators.required, Validators.min(1)]),
        walletFlatAmount: new FormControl(data.walletFlatAmount, [Validators.required, Validators.min(1)]),
        walletTransferPercentage: new FormControl(data.walletTransferPercentage),
        baseOfPayment: new FormControl(data.baseOfPayment, [Validators.required]),  
        activationDate: new FormControl(new Date(data.activationDate), [Validators.required]),
        deactivationDate: new FormControl(new Date(data.deactivationDate)),
        stateStatus: new FormControl(data.stateStatus),
        remarks: new FormControl(data.remarks),
        isActive: new FormControl(data.isActive),
        cocInWalletTransferPercentage: new FormControl(data.cocInWalletTransferPercentage, [Validators.required, Validators.min(1)])
       })
       this.modalService.open(this.editWalletPaymentConfigModal, "lg"); 
     }
  
    
     updateWalletPaymentConfig() {
       if (this.editWalletPaymentConfigForm.valid) {
         this.btnEditWalletPaymentConfig = true;
         for (const prop in this.editWalletPaymentConfigForm.controls) {
           this.editWalletPaymentConfigForm.value[prop] = this.editWalletPaymentConfigForm.controls[prop].value;
         }  
         let updateData = this.editWalletPaymentConfigForm.value
         this.walletPaymentService.updateWalletPaymentConfig(updateData).subscribe((result) => {     
           var data = result as any;
           this.btnEditWalletPaymentConfig = false;
           if (data.status) {
             this.utilityService.success(data.msg, "Server Response");
             this.closeModal('Save Successful');
           }
           else {
             this.utilityService.fail(data.msg, "Server Response")
           }
         }, (error) => {
           this.utilityService.fail("Something went wrong", "Server Response")
           this.btnEditWalletPaymentConfig = false;
         })
       }
     }
  
     closeModal(reason: string) {
      this.modalService.service.dismissAll(reason);
      this.closeModalEvent.emit(reason); // fire
    }
  
    ddlInternalDesignations: any[] = []
    loadInternalDesignations() {
         this.ddlInternalDesignations = [];       
         this.walletPaymentService.getInternalDesignations<any[]>().then((data) => {
             this.ddlInternalDesignations = data;
         })
     }
  
     activationDate: string = null; 
     deactivationDate: string = null;
  
     activationDate_changed() {   
      this.editWalletPaymentConfigForm.get('activationDate').setValue(this.activationDate);   
      }
      deactivationDate_changed(){
        this.editWalletPaymentConfigForm.get('deactivationDate').setValue(this.deactivationDate);   
      }  
  
  }
  
