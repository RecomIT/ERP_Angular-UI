import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { Select2ConfigService } from 'src/app/shared/services/Select2/select2-config.service';
import { CustomModalService } from 'src/app/shared/services/custom-modal.service';
import { DatePickerConfigService } from 'src/app/shared/services/date-picker-config.service';

@Component({
  selector: 'app-service-anniversary-allowance',
  templateUrl: './service-anniversary-allowance.component.html',
  styleUrls: ['./service-anniversary-allowance.component.css']
})
export class ServiceAnniversaryAllowanceComponent implements OnInit {

  
  @ViewChild('addServiceAnniversaryConfigModal', { static: true }) addServiceAnniversaryConfigModal !: ElementRef;    
  @Output() closeModalEvent = new EventEmitter<string>();


  constructor(
    private fb: FormBuilder,
    private select2ConfigService: Select2ConfigService,
    private datePickerConfigService : DatePickerConfigService,
    private modalService: CustomModalService
    ) {}


  
  payrollForm: FormGroup;
  allowanceSelect2Options :any = [];
  allowanceList: { id: string, text: string }[] = [];

  datePickerConfig: Partial<BsDatepickerConfig> = {};

  cutoffDays: number[] = Array.from({ length: 28 }, (_, i) => i + 1);
  selectedCutOffDay: number | null = null;


  ngOnInit() {

    this.allowanceSelect2Options = this.select2ConfigService.getDefaultConfig();

    this.datePickerConfig = this.datePickerConfigService.getConfig();

    this.allowanceList = [
      { id: '1', text: 'Housing Allowance' },
      { id: '2', text: 'Transportation Allowance' },
      { id: '3', text: 'Meal Allowance' },
    ];

  
    this.createForm();

    this.openModal();
    
  }



  private createForm() {
    this.payrollForm = this.fb.group({
      allowanceName: ['', Validators.required],
      cutOffDay: [null, Validators.required],
      jobType: ['', Validators.required],
      religion: ['', Validators.required],
      maritalStatus: ['', Validators.required],
      citizen: ['', Validators.required],
      gender: ['', Validators.required],
      physicalCondition: ['', Validators.required],
      isVisibleInPayslip: ['Yes', Validators.required],
      isVisibleInSalarySheet: ['Yes', Validators.required],
      baseOfPayment: ['', Validators.required],
      percentage: [null],
      amount: [null],
      activationFrom: [null, Validators.required],
      activationTo: [null, Validators.required],
    });
  }


  allowanceId : number;
  onAllowanceSelectionChange(allowanceId: any){
    this.allowanceId = allowanceId;
  }


  clearActivationFrom(): void {
    this.payrollForm.get('activationFrom').setValue(null);
  }

  clearActivationTo(): void {
    this.payrollForm.get('activationTo').setValue(null);
  }


  onCutOffDayChange(event: any): void {
    this.selectedCutOffDay = event.target.value;

    console.log('selectedCutOffDay',this.selectedCutOffDay);
  }

  onSubmit() {
    if (this.payrollForm.valid) {
    
      console.log(this.payrollForm.value);
      
    } else {
      
    }
  }




  
  
  openModal() {
    this.modalService.open(this.addServiceAnniversaryConfigModal, "xl");
  }

  closeModal(reason: any) {
      this.modalService.service.dismissAll(reason);
      this.closeModalEvent.emit(reason);
  }


}
