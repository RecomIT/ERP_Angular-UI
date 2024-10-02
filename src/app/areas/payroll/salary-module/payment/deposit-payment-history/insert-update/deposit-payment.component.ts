import { UtilityService } from 'src/app/shared/services/utility.service';
import { CustomModalService } from 'src/app/shared/services/custom-modal.service';
import { NotifyService } from 'src/app/shared/services/notify-service/notify.service';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { PayrollConditionalDepositAllowanceService } from '../../conditional-deposit-allowance/payroll-conditional-deposit-allowance.service';
import { ControlPanelWebService } from 'src/app/shared/services/control-panel.service';
import { TypeaheadMatch } from 'ngx-bootstrap/typeahead';
import { DepositPaymentHistoryService } from '../deposit-payment-history.service';
import { esLocale } from 'ngx-bootstrap/chronos';

@Component({
  selector: 'app-payroll-deposit-payment',
  templateUrl: './deposit-payment.component.html',
  styleUrls: ['./deposit-payment.component.css']
})
export class DepositPaymentComponent implements OnInit {

  @Input() Id: number = 0;
  @ViewChild('projectedPaymentProcessModal', { static: true }) processPaymentProcessModal !: ElementRef;
  @Output() closeModalEvent = new EventEmitter<string>();

  constructor(private fb: FormBuilder,
    private utilityService: UtilityService,
    private conditionalDepositAllowanceService: PayrollConditionalDepositAllowanceService,
    private modalService: CustomModalService,
    private controlPanelWebService: ControlPanelWebService,
    private depositPaymentHistoryService: DepositPaymentHistoryService,
    private notifyService: NotifyService) {
  }

  ngOnInit(): void {
    this.searchFormInit();
    this.loadEmployeeDropdown();
    this.ddlPaymentApproach = [
      { id: 'Proposal amount', text: 'Proposal amount (Less or Equal)' },
      { id: 'Exact Proposal amount', text: 'Exact Proposal amount' },
      { id: 'Remaining deposit amount', text: 'Remaining deposit amount' },
      { id: 'Remaining deposit amount including current month', text: 'Remaining deposit amount including current month' },
    ];
    this.initForm();
    this.openModal();
    this.loadBranch();

    if (this.Id > 0) {
      this.getById();
    }
  }

  months: any[] = this.utilityService.getMonths();
  years: any[] = this.utilityService.getYears(2);

  currentMonth: any = this.utilityService.currentMonth;
  currentYear: any = this.utilityService.currentYear;

  select2Config = this.utilityService.select2Config();

  ddlEmployees: any[];
  loadEmployeeDropdown() {
    this.conditionalDepositAllowanceService.getEligibleEmployeesByConfigId(this.Id).then(data => {
      this.ddlEmployees = data;
    }, (error) => {
      console.log("error >>>", error);
    })
  }

  selectedEmployee: number = 0;
  selectedEmployees: any[] = [];
  employeeOnSelect(e: TypeaheadMatch) {
    if (e?.item != null) {
      let employeeId = this.utilityService.IntTryParse((e.item?.id ?? '0'));
      this.selectedEmployee = employeeId;
      let index = this.selectedEmployees.indexOf(employeeId);
      if (index < 0) {
        this.getEmployeeEligibleDepositPaymentByEmployeeId();
      }
      else {
        this.utilityService.fail("Duplicate employee selection", "Site Response");
      }
    }
    this.searchForm.get('employeeId').setValue('');
  }

  dataform: FormGroup = null;
  ddlPaymentApproach: any[] = [];

  searchForm: FormGroup;
  searchFormInit() {
    this.searchForm = this.fb.group({
      employeeId: new FormControl(''),
      paymentApproach: new FormControl('Proposal amount'),
      paymentMonth: new FormControl(this.currentMonth, [Validators.min(1), Validators.max(12)]),
      paymentYear: new FormControl(this.currentYear, [Validators.min(2023), Validators.max(2050)]),
      paymentBeMade: new FormControl('With Salary'),
      hasPayableAmount: new FormControl('No')
    });

    this.searchForm.get('hasPayableAmount').valueChanges.subscribe(value => {
      this.getEmployeeEligibleDepositPayment();
    })
  }

  openModal() {
    this.modalService.open(this.processPaymentProcessModal, "xl");
  }

  closeModal(reason: any) {
    this.modalService.service.dismissAll(reason);
    this.closeModalEvent.emit(reason);
  }

  list_of_eligible_employee_deposit: any[] = []

  getEmployeeEligibleDepositPayment() {
    this.selectedEmployees = [];
    if (this.dataform != null) {
      this.dataform = null;
      this.initForm();
    }
    this.conditionalDepositAllowanceService.getEmployeeEligibleDepositPayment({
      configId: this.Id,
      hasPayableAmount: this.searchForm.get('hasPayableAmount').value
    }).subscribe({
      next: (response: any) => {
        this.list_of_eligible_employee_deposit = response.body;
        this.loadData();
      },
      error: (error: any) => {
        this.notifyService.handleApiError(error);
      }
    })
  }

  getEmployeeEligibleDepositPaymentByEmployeeId() {
    this.conditionalDepositAllowanceService.getEmployeeEligibleDepositPayment({
      configId: this.Id,
      employeeId: this.selectedEmployee,
      hasPayableAmount: this.searchForm.get('hasPayableAmount').value
    }).subscribe({
      next: (response: any) => {
        this.list_of_eligible_employee_deposit = response.body;
        this.loadData();
      },
      error: (error: any) => {
        this.notifyService.handleApiError(error);
      }
    })
  }

  ddlBranch: any[] = [];
  loadBranch() {
    this.ddlBranch = [];
    this.controlPanelWebService.getBranchExtension<any[]>("7").then((data) => {
      this.ddlBranch = data;
    })
  }

  btnSubmit: boolean = false;
  submit() {
    let items = [];
    if(this.formArray != null && this.formArray.length > 0 && this.btnSubmit == false){
      this.btnSubmit = true;
      
      this.formArray.forEach(row => {
        if (row instanceof FormGroup) {
          let formGroup = row as FormGroup;
          items.push({
            employeeId: formGroup.get('employeeId').value,
            allowanceNameId: formGroup.get('allowanceNameId').value,
            paymentMonth: this.searchForm.get('paymentMonth').value,
            paymentYear: this.searchForm.get('paymentYear').value,
            paymentDate: null,
            paymentApproach: this.searchForm.get('paymentApproach').value,
            paymentBeMade: this.searchForm.get('paymentBeMade').value,
            proposalAmount: formGroup.controls.disbursedAmount.value,
            payableAmount: formGroup.controls.payableAmount.value,
            disbursedAmount: formGroup.controls.disbursedAmount.value,
            conditionalDepositAllowanceConfigId: this.Id
          })
        }
      });
  
      var data = {items : items};
      this.depositPaymentHistoryService.save(data).subscribe({
        next: (response: any) => {
          if(response?.status){
            this.utilityService.success(response?.msg,"Server Response",3000);
          }
          else{
            this.utilityService.fail(response?.msg,"Server Response",3000);
          }
          this.btnSubmit = false;
        },
        error: (error: any) => {
          this.utilityService.httpErrorHandler(error);
          this.btnSubmit = false;
        }
      })
    }
    else{
      this.utilityService.fail("No deposit amount found","Site Response",3000);
    }
  }

  formArray: any;
  initForm() {
    this.dataform = this.fb.group({
      paymentInfos: this.fb.array([]) as FormArray
    });

    this.dataform.valueChanges.subscribe(formGroup => {
    })
    this.formArray = (<FormArray>this.dataform.get('paymentInfos')).controls;
    this.eligibleEmployeeCount = this.formArray.length;
  }

  eligibleEmployeeCount: number = 0;
  loadData() {
    this.list_of_eligible_employee_deposit.forEach(data => {
      (<FormArray>this.dataform.get('paymentInfos')).push(this.addFormGroup(data));
      this.selectedEmployees.push(data?.employeeId);
    })

    this.eligibleEmployeeCount = this.list_of_eligible_employee_deposit.length;
  }

  addFormGroup(data: any) {
    return this.fb.group({
      employeeId: new FormControl(data.employeeId),
      allowanceNameId: new FormControl(data.allowanceNameId),
      employeeCode: new FormControl(data.employeeCode),
      employeeName: new FormControl(data.employeeName),
      designationName: new FormControl(data.designationName),
      total: new FormControl(data.total),
      paid: new FormControl(data.paid),
      payableAmount: new FormControl(data.payableAmount),
      disbursedAmount: new FormControl(data.disbursedAmount, [Validators.min(1)])
    });
  }

  removeItem(index: number) {
    (<FormArray>this.dataform.get('paymentInfos')).removeAt(index);
    this.selectedEmployees.splice(index, 1);
    this.eligibleEmployeeCount = (<FormArray>this.dataform.get('paymentInfos')).length;
  }

  remove(index: number) {
    this.formArray.removeAt(index);
  }

  configInfo: any;
  getById() {
    this.conditionalDepositAllowanceService.getById({ id: this.Id }).subscribe({
      next: (response: any) => {
        console.log("response >>>", response);
      },
      error: (error: any) => {
        this.notifyService.handleApiError(error);
      }
    })
  }

}
