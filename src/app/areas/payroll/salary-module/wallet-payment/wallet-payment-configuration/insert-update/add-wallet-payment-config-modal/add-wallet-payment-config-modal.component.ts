import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from "@angular/core";
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
  selector: 'app-salary-module-add-wallet-payment-config-modal',
  templateUrl: './add-wallet-payment-config-modal.component.html'
})
export class AddWalletPaymentConfigModalComponent implements OnInit {
    @Output() closeModalEvent = new EventEmitter<string>();
    @ViewChild('addWalletPaymentConfigModal', { static: true }) addWalletPaymentConfigModal!: ElementRef;
    modalTitle: string = "";
    datePickerConfig: Partial<BsDatepickerConfig> = {};
    constructor(
        private fb: FormBuilder,
        private userService: UserService,
        public utilityService: UtilityService,
        public modalService: CustomModalService,
        public payrollWebService: PayrollWebService,
        public hrWebService: HrWebService,
        public walletPaymentService: WalletPaymentService,
        private datepipe: DatePipe
    ) { }
  
    ngOnInit(): void {
        this.openModal();
        this.datePickerConfig = this.utilityService.datePickerConfig();
    }
    select2Options = this.utilityService.select2Config();
    baseOfPayments: any = ["Flat", "Basic", "Gross"];
  
    form: FormGroup;
    formArray: any;
    walletPaymentsArray: any;
    formInit() {
        this.form = this.fb.group({
          walletPayments: this.fb.array([
                this.fb.group({
                  walletConfigId: new FormControl(0),
                  internalDesignationId: new FormControl(0, [Validators.min(1)]),     
                  internalDesignationName: new FormControl(''), 
                  walletFlatAmount: new FormControl(0, [Validators.required, Validators.min(1)]),   
                  walletTransferPercentage: new FormControl(0),   
                  baseOfPayment: new FormControl('Flat', [Validators.required]),
                  activationDate: new FormControl(null, [Validators.required]),   
                  deactivationDate: new FormControl(null),             
                  stateStatus : new FormControl(''),             
                  isActive: new FormControl(true),
                  cocInWalletTransferPercentage: new FormControl(0, [Validators.required, Validators.min(1)])
                })
            ])
        })
      
        this.formArray = (<FormArray>this.form.get('walletPayments')).controls;
        this.formControlChanged();
    }
    
    private subscriptions: any[] = [];
    formControlChanged() {
        this.formArray = (this.form.get('walletPayments') as FormArray).controls;
        if (this.subscriptions != null && this.subscriptions.length > 0) {
            this.subscriptions.forEach((item: FormGroup, i) => {
                this.subscriptions[i].unsubscribe();
            })
        }
        this.formArray.forEach((fromGroup: FormGroup, index) => {    
            let subscription;
            // Subscribe to valueChanges
            subscription = fromGroup.get('baseOfPayment').valueChanges.subscribe((newValue) => {
                console.log(`Value changed at index ${index}`, newValue);
            });
         
            this.subscriptions[index] = subscription;
        });
    }
  
    btnSubmit: boolean = false;
  
    submit() {
        if (this.form.valid) {
            var walletPayments: any = [];
            this.formArray.forEach((formGroup: FormGroup) => {          
             walletPayments.push({ 
                    walletConfigId: this.utilityService.IntTryParse(formGroup.get('walletConfigId').value),    
                    internalDesignationId: this.utilityService.IntTryParse(formGroup.get('internalDesignationId').value),    
                    baseOfPayment: formGroup.get('baseOfPayment').value,
                    walletFlatAmount: formGroup.get('walletFlatAmount').value,
                    walletTransferPercentage: formGroup.get('walletTransferPercentage').value,    
                    activationDate: new Date(formGroup.get('activationDate').value),
                    deactivationDate: new Date(formGroup.get('deactivationDate').value),
                    stateStatus: formGroup.get('stateStatus').value,                         
                    isActive: formGroup.get('isActive').value,
                    cocInWalletTransferPercentage: formGroup.get('cocInWalletTransferPercentage').value,    
                })
            })
            //return;
            this.walletPaymentService.saveWalletPaymentConfig(walletPayments).subscribe(response => {
                console.log("response >>>", response);
                if(response?.status){
                    this.utilityService.success(response?.msg,"Server Response")
                    this.closeModal('Save Successful');
                }
            }, error => {
                this.utilityService.fail("Something went wrong", "Server Reponse");
            })
        }
        else {
            this.utilityService.fail("Invalid form submission", "Site Response", 1000);
        }
    }
    
    logger(msg: any, options: any) {
        this.utilityService.consoleLog(msg, options);
    }
  
    User() {
        return this.userService.User();
    }
  
    openModal() {   
      this.formInit();
      this.modalTitle = "Add Wallet Payment Configuration" ;
      this.modalService.open(this.addWalletPaymentConfigModal, "xl");  
      this.loadInternalDesignations();
    }
  
  
    closeModal(reason: string) {
        this.form.reset();
        this.modalService.service.dismissAll(reason);
        this.closeModalEvent.emit(reason);
    }
  
    addWalletPaymentConfigs(index: number): void {
        (<FormArray>this.form.get('walletPayments')).push(this.add(index));
        this.formControlChanged();
    }
  
    add(index: number) {
      let controlCOCPercentage = ((<FormArray>this.form.get('walletPayments')).controls[index] as FormGroup).controls?.cocInWalletTransferPercentage.value;
      controlCOCPercentage = controlCOCPercentage == null ? 0 : controlCOCPercentage;
  
        return this.fb.group({       
            walletConfigId : new FormControl(0),
            internalDesignationId: new FormControl(0, Validators.min(1)),     
            internalDesignationName: new FormControl(''), 
            walletFlatAmount: new FormControl(0, [Validators.required, Validators.min(1)]),   
            walletTransferPercentage: new FormControl(0),   
            baseOfPayment: new FormControl('Flat', [Validators.required]),
            activationDate: new FormControl(null),  
            deactivationDate: new FormControl(null),  
            stateStatus : new FormControl(''),             
            isActive: new FormControl(true),
            cocInWalletTransferPercentage: new FormControl(controlCOCPercentage, [Validators.required, Validators.min(1)])
        })
    }
  
    remove(index: number) {
        if ((<FormArray>this.form.get('walletPayments')).length > 1) {
            (<FormArray>this.form.get('walletPayments')).removeAt(index);
            this.formControlChanged();
        }
        else {
            this.utilityService.fail("You can't delete last item", "Site Response");
        }
    }
  
    ddlInternalDesignations: any[] = []
    loadInternalDesignations() {
         this.ddlInternalDesignations = [];       
         this.walletPaymentService.getInternalDesignations<any[]>().then((data) => {
             this.ddlInternalDesignations = data;
         })
     }
  
  
  
  }
  