import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { Select2ConfigService } from 'src/app/shared/services/Select2/select2-config.service';
import { CustomModalService } from 'src/app/shared/services/custom-modal.service';
import { DatePickerConfigService } from 'src/app/shared/services/date-picker-config.service';
import { AllowanceNameService } from '../../../allowance/allowance-head/allowance-name.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { PayrollConditionalDepositAllowanceService } from '../payroll-conditional-deposit-allowance.service';
import { setTimeout } from 'timers';

@Component({
  selector: 'app-payroll-conditional-deposit-allowance',
  templateUrl: './conditional-deposit-allowance.component.html',
  styleUrls: ['./conditional-deposit-allowance.component.css']
})
export class ConditionalDepositAllowanceComponent implements OnInit {


  @Input() id: number = 0;
  @ViewChild('addConditionalAllowanceConfigModal', { static: true }) addConditionalAllowanceConfigModal !: ElementRef;
  @Output() closeModalEvent = new EventEmitter<string>();


  constructor(
    private fb: FormBuilder,
    private datePickerConfigService: DatePickerConfigService,
    private modalService: CustomModalService,
    private allowanceNameService: AllowanceNameService,
    private uitlityService: UtilityService,
    private conditionalDepositAllowanceService: PayrollConditionalDepositAllowanceService,
    private utilityService: UtilityService
  ) { }

  modalTitle: string = "Add Accrued Allowance";
  btnText: string = "Submit";
  form: FormGroup;
  allowanceSelect2Options: any = [];
  allowanceList: { id: string, text: string }[] = [];

  datePickerConfig: Partial<BsDatepickerConfig> = {};

  ngOnInit() {

    this.allowanceSelect2Options = this.uitlityService.select2Config();
    this.datePickerConfig = this.datePickerConfigService.getConfig();
    this.loadAllowancesDropdown();
    this.openModal();
    this.createForm();
    if (this.id > 0) {
      this.modalTitle = "Update Accrued Allowance";
      this.btnText = "Update";
      this.getById();
    }
  }

  ddlAllowances: any[] = [];
  loadAllowancesDropdown() {
    this.allowanceNameService.loadAllowanceNameDropdown();
    this.allowanceNameService.ddl$.subscribe(data => {
      this.ddlAllowances = data;
    }, (error) => {
      console.log("error  while fetching allowance dropdown >>>", error);
    })
  }

  formErrors = {
    allowanceNameId: '',
    serviceLength: '',
    serviceLengthUnit: '',
    jobType: '',
    religion: '',
    maritalStatus: '',
    citizen: '',
    gender: '',
    physicalCondition: '',
    depositType: '',
    baseOfPayment: '',
    percentage: '',
    amount: '',
    activationFrom: '',
    activationTo: ''
  }

  validationMessages = {
    allowanceNameId: {
      'required': 'Allowance is required',
      'min': 'Allowance is required',
    },
    serviceLengthUnit: {
      'required': 'Service Length Unit is required',
    },
    depositType: {
      'required': 'Deposit type is required',

    },
    baseOfPayment: {
      'required': 'Base Of Payment is required',
    },
    percentage: {
      'min': 'Percentage is required',
      'required': 'Percentage is required'
    },
    amount: {
      'min': 'Amount is required',
      'required': 'Amount is required'
    },
    activationFrom: {
      'required': 'Activation from date is required',
    },
    activationTo: {
      'required': 'Activation to date is required',
    }
  }

  logFormErrors(formGroup: FormGroup = this.form) {
    Object.keys(formGroup.controls).forEach((key: string) => {
      const abstractControl = formGroup.get(key);
      this.formErrors[key] = '';
      if (abstractControl && !abstractControl.valid && (abstractControl.touched || abstractControl.dirty)) {
        const messages = this.validationMessages[key];
        for (const errorKey in abstractControl.errors) {
          this.formErrors[key] += messages[errorKey];
        }
      }
    })
  }

  private createForm() {
    this.form = this.fb.group({
      id: new FormControl(this.id),
      allowanceNameId: ['0', [Validators.required, Validators.min(1)]],
      serviceLength: [null],
      serviceLengthUnit: [''],
      jobType: [''],
      religion: [''],
      maritalStatus: [''],
      citizen: [''],
      gender: [''],
      physicalCondition: [''],
      isVisibleInPayslip: [true],
      isVisibleInSalarySheet: [true],
      depositType: ['Monthly', Validators.required],
      baseOfPayment: ['Flat', Validators.required],
      percentage: [0],
      amount: [null, [Validators.required, Validators.min(1)]],
      activationFrom: [null, Validators.required],
      activationTo: [null, Validators.required]
    });

    this.form.get('serviceLength').valueChanges.subscribe(value => {
      if (this.uitlityService.IntTryParse(value) > 0) {
        this.form.get('serviceLengthUnit').setValidators([Validators.required]);
        this.form.get('serviceLengthUnit').updateValueAndValidity();
      }
      else {
        this.form.get('serviceLengthUnit').setValue('');
        this.form.get('serviceLengthUnit').clearValidators();
        this.form.get('serviceLengthUnit').updateValueAndValidity();
      }

    })

    this.form.get('baseOfPayment').valueChanges.subscribe(value => {
      this.form.get('percentage').clearValidators();
      this.form.get('amount').clearValidators();
      if (value != null && value != '' && value != undefined) {
        if (value == "Flat") {
          this.form.get('percentage').setValue(0);
          this.form.get('amount').setValidators([Validators.required, Validators.min(1)]);
        }
        else if (value != "Flat") {
          this.form.get('amount').setValue(0);
          this.form.get('percentage').setValidators([Validators.required, Validators.min(1)]);
        }
      }
      this.form.updateValueAndValidity();

    })

    this.form.get('percentage').valueChanges.subscribe(value => {
      let baseOfPayment = this.form.get('baseOfPayment').value;
      if (baseOfPayment != 'Flat' && (value == '' || value == undefined)) {
        this.form.get('percentage').setValue(null);
      }
    })

    this.form.get('amount').valueChanges.subscribe(value => {
      let baseOfPayment = this.form.get('baseOfPayment').value;
      if (baseOfPayment == 'Flat' && (value == '' || value == undefined)) {
        this.form.get('amount').setValue(null);
      }
    })

    this.form.get('activationFrom').valueChanges.subscribe(value=>{
      setInterval(()=>{
        this.logFormErrors()
      },5)
    })

    this.form.get('activationTo').valueChanges.subscribe(value=>{
      setInterval(()=>{
        this.logFormErrors()
      },5)
    })
  }

  markAsTouched(){
    this.form.get('allowanceNameId').markAsTouched();
    this.form.get('serviceLength').markAsTouched();
    this.form.get('serviceLengthUnit').markAsTouched();
    this.form.get('jobType').markAsTouched();
    this.form.get('religion').markAsTouched();
    this.form.get('maritalStatus').markAsTouched();
    this.form.get('citizen').markAsTouched();
    this.form.get('gender').markAsTouched();
    this.form.get('physicalCondition').markAsTouched();
    this.form.get('depositType').markAsTouched();
    this.form.get('baseOfPayment').markAsTouched();
    this.form.get('activationFrom').markAsTouched();
    this.form.get('activationTo').markAsTouched();

    if(this.form.get('baseOfPayment').value =='Flat'){
      this.form.get('amount').markAsTouched();
    }
    else{
      this.form.get('percentage').markAsTouched();
    }
    
  }

  getById() {
    this.conditionalDepositAllowanceService.getById({ id: this.id }).subscribe(response => {
      this.setFormValue(response.body);
    }, (error) => {
      console.log("error >>>", error);
    })
  }

  setFormValue(data) {
    this.form.get('id').setValue(data.id);
    this.form.get('allowanceNameId').setValue(data.allowanceNameId);
    this.form.get('serviceLength').setValue(data.serviceLength);
    this.form.get('serviceLengthUnit').setValue(data.serviceLengthUnit);
    this.form.get('jobType').setValue(data.jobType ?? 'N/A');
    this.form.get('maritalStatus').setValue(data.maritalStatus ?? 'N/A');
    this.form.get('religion').setValue(data.religion ?? 'N/A');
    this.form.get('citizen').setValue(data.citizen ?? 'N/A');
    this.form.get('gender').setValue(data.gender ?? 'N/A');
    this.form.get('physicalCondition').setValue(data.physicalCondition);
    this.form.get('isVisibleInPayslip').setValue(data.isVisibleInPayslip ?? false);
    this.form.get('isVisibleInSalarySheet').setValue(data.isVisibleInSalarySheet ?? false);
    this.form.get('depositType').setValue(data.depositType);
    this.form.get('baseOfPayment').setValue(data.baseOfPayment);
    if (data.baseOfPayment == 'Flat') {
      this.form.get('amount').setValue(data.amount);
    }
    else if (data.baseOfPayment != 'Flat') {
      this.form.get('percentage').setValue(data.percentage);
    }

    this.form.get('activationFrom').setValue(new Date(data.activationFrom));
    this.form.get('activationTo').setValue(new Date(data.activationTo));
    this.logFormErrors();
  }


  allowanceId: number;
  onAllowanceSelectionChange(allowanceId: any) {
    this.allowanceId = allowanceId;
  }


  clearActivationFrom(): void {
    this.form.get('activationFrom').setValue(null);
    this.form.get('activationFrom').markAsTouched();
    this.logFormErrors();
  }

  clearActivationTo(): void {
    this.form.get('activationTo').setValue(null);
    this.form.get('activationTo').markAsTouched();
    this.logFormErrors();
  }


  btnSubmit: boolean = false;
  onSubmit() {
    this.markAsTouched();
    this.logFormErrors();
    if (this.btnSubmit == false) {
      if (this.form.valid) {
        this.btnSubmit = true;
        this.conditionalDepositAllowanceService.save(this.form.value).subscribe(response => {
          this.btnSubmit = false;
          if (response.status) {
            this.utilityService.success("Saved Successfull", "Server Response")
            this.closeModal("Save Complete");
          }
          else {
            if (response.msg == "Validation Error") {
              this.utilityService.fail(response.msg, "Server Response", 5000)
            }
            else {
              this.utilityService.fail(response.msg, "Server Response")
            }
          }
        }, (error) => {
          this.btnSubmit = false;
          console.log(error);
        })

      } else {
        this.uitlityService.fail("Invalid form submission", "Site Response", 2000);
      }
    }
  }





  openModal() {
    this.modalService.open(this.addConditionalAllowanceConfigModal, "xl");
  }

  closeModal(reason: any) {
    if (this.btnSubmit == false) {
      this.modalService.service.dismissAll(reason);
      this.closeModalEvent.emit(reason);
    }
  }

}
