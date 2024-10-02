import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { AreasHttpService } from "src/app/areas/areas.http.service";
import { ApiArea, ApiController } from "src/app/shared/constants";
import { ControlPanelWebService } from "src/app/shared/services/control-panel.service";
import { CustomModalService } from "src/app/shared/services/custom-modal.service";
import { PayrollWebService } from "src/app/shared/services/payroll-web.service";
import { UserService } from "src/app/shared/services/user.service";
import { UtilityService } from "src/app/shared/services/utility.service";

@Component({
    selector: 'app-payroll-bonus-config-modal',
    templateUrl: './bonus-config-modal.component.html'
})

export class BonusConfigModalComponent implements OnInit {
    @Input() id: number = 0;
    @Input() listOfBonus: any[] = [];
    @Input() item: any = null;

    @ViewChild('bonusConfigModal', { static: true }) bonusConfigModal!: ElementRef;
    modalTitle: string = "Add New Bonus Config";

    @Output() closeModalEvent = new EventEmitter<string>();
    
    constructor(private fb: FormBuilder, // strongly type form build
        private areasHttpService: AreasHttpService, // http request
        private userService: UserService, // user service user id
        public utilityService: UtilityService, // utility 
        public modalService: CustomModalService, // modal service 
        private payrollWebService: PayrollWebService,
        private controlPanelWebService: ControlPanelWebService) {
    }

    ddlFiscalyear: any[] = [];
    loadDdlFiscalYears() {
        this.payrollWebService.getFiscalYears<any[]>().then(data => {
            console.log("fiscal year >>", data);
            this.ddlFiscalyear = data;
        })
    }

    ngOnInit(): void {
        this.getPayrollModuleConfig();
        this.bonusConfigFormInit();
        this.loadDdlFiscalYears();

    }

    payrollModuleConfig: any;
    getPayrollModuleConfig() {
        this.controlPanelWebService.getPayrollModuleConfig().then(data => {
            this.payrollModuleConfig = data;
            console.log("payrollModuleConfig >>>", data);

            if(this.bonusConfigForm != null && this.bonusConfigForm instanceof FormGroup){
                this.bonusConfigForm.controls.percentage.setValue(this.payrollModuleConfig?.unitOfBonus)
            }
        })
    }

    bonusConfigForm: FormGroup;

    ddlReligion: any[] = this.utilityService.getReligions();

    formErrors:any ={
    }

    bonusConfigFormInit() {
        this.bonusConfigForm = this.fb.group({
            bonusId: new FormControl(0),
            isReligious: new FormControl(true, [Validators.required]),
            religionName: new FormControl('', [Validators.required]),
            reason: new FormControl(''),
            remarks: new FormControl(''),
            fiscalYearId: new FormControl(0, [Validators.min(1)]),
            isConfirmedEmployee: new FormControl(true),
            isFestival: new FormControl(true),
            isTaxable: new FormControl(true),
            isPaymentProjected: new FormControl(true),
            isTaxDistributed: new FormControl(false),
            isOnceOff: new FormControl(false),
            isExcludeFromSalary: new FormControl(false),
            isTaxAdjustedWithSalary: new FormControl(true),
            basedOn: new FormControl('Basic'),
            percentage: new FormControl(this.payrollModuleConfig?.unitOfBonus, [Validators.min(1)]),
            bonusCount: new FormControl(0, [Validators.min(1)]),
            amount: new FormControl(0),
            maximumAmount: new FormControl(0)
        });

        this.bonusConfigForm.get('isReligious').valueChanges.subscribe(value => {
            console.log("isReligious >>>", value);
            this.bonusConfigForm.get('religionName').clearValidators();
            if (value != null && value == true) {
                this.bonusConfigForm.get('religionName').setValue('');
                this.bonusConfigForm.get('religionName').setValidators([Validators.required]);
            }
            else {
                this.bonusConfigForm.get('religionName').setValue('');
            }
        })

        this.bonusConfigForm.get('isTaxable').valueChanges.subscribe(value => {
            if (!value) {
                this.bonusConfigForm.get('isPaymentProjected').setValue(false);
                this.bonusConfigForm.get('isTaxDistributed').setValue(false);
                this.bonusConfigForm.get('isOnceOff').setValue(false);
            }
            else {
                this.bonusConfigForm.get('isPaymentProjected').setValue(true);
                this.bonusConfigForm.get('isTaxDistributed').setValue(false);
                this.bonusConfigForm.get('isOnceOff').setValue(false);
            }
        })

        this.bonusConfigForm.get('isPaymentProjected').valueChanges.subscribe(value => {
            if (value) {
                this.bonusConfigForm.get('isTaxDistributed').setValue(false);
                this.bonusConfigForm.get('isOnceOff').setValue(false);
            }
        })

        this.bonusConfigForm.get('isOnceOff').valueChanges.subscribe(value => {
            if (value) {
                this.bonusConfigForm.get('isPaymentProjected').setValue(false);
                this.bonusConfigForm.get('isTaxDistributed').setValue(false);
            }
        })

        this.bonusConfigForm.get('isTaxDistributed').valueChanges.subscribe(value => {
            if (value) {
                this.bonusConfigForm.get('isPaymentProjected').setValue(false);
                this.bonusConfigForm.get('isOnceOff').setValue(false);
            }
        })

        this.bonusConfigForm.get('bonusCount').valueChanges.subscribe(value => {
            if (value == null) {
                this.bonusConfigForm.get('bonusCount').setValue(0);
            }
        })

        this.bonusConfigForm.get('basedOn').valueChanges.subscribe(value=>{
            if(value == "Basic" || value == "Gross"){
                this.bonusConfigForm.get('amount').clearValidators();
            }
            else{
                this.bonusConfigForm.get('bonusCount').clearValidators();
                this.bonusConfigForm.get('amount').clearValidators();
                this.bonusConfigForm.get('amount').setValidators([Validators.min(1)])
            }
        })

        // this.bonusConfigForm.get('isExcludeFromSalary').valueChanges.subscribe(value=>{
        //     if (value) {
        //         this.bonusConfigForm.get('isTaxAdjustedWithSalary').setValue(true);
        //     }
        // })
        //basedOn
        this.openModal();
    }

    btnBonusConfig: boolean = false;
    submit(){
        if(this.bonusConfigForm.valid){
            this.areasHttpService.observable_post<any>((ApiArea.payroll+ApiController.bonus+"/SaveBonusConfig"),this.bonusConfigForm.value,{
            }).subscribe((response)=>{
                if (response?.status) {
                    this.utilityService.toastr.success(response?.msg, "Server Response");
                    this.closeModal('Save Complete');
                }
                else {
                    this.utilityService.toastr.error(response?.msg, "Server Response");
                }
            },(error) => {
                console.log("error >>>", error);
                this.btnBonusConfig = false;
                this.utilityService.fail("Something went wrong", "Server Response");
            })
        }
        else{
            this.utilityService.fail("Invalid form submission","Site Response");
        }
    }

    openModal() {
        this.modalService.open(this.bonusConfigModal, "lg");
    }

    closeModal(reason: any) {
        this.modalService.service.dismissAll(reason);
        this.closeModalEvent.emit(reason);
    }

}