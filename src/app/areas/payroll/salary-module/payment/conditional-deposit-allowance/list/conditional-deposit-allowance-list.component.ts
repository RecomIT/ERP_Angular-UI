import { Component, OnInit } from '@angular/core';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { PayrollConditionalDepositAllowanceService } from '../payroll-conditional-deposit-allowance.service';
import { FiscalYearService } from '../../../setup/fiscalYear/fiscalYear.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-payroll-conditional-deposit-allowance-list',
  templateUrl: './conditional-deposit-allowance-list.component.html',
  styleUrls: ['./conditional-deposit-allowance-list.component.css']
})
export class ConditionalDepositAllowanceListComponent implements OnInit {

  constructor(
    private utilityService: UtilityService,
    private conditionalDepositAllowanceService: PayrollConditionalDepositAllowanceService,
    private fiscalYearService : FiscalYearService,
    private fb : FormBuilder
  ) { }


  ngOnInit(): void {
    this.configSearchFormInit();
    this.getPayrollConditionalDepositAllowance();
    this.loadFiscalYearDropdown();
  }

  list: any[] = [];

  ddlFiscalYearDropdown: any[]=[];
    loadFiscalYearDropdown(){
        this.fiscalYearService.loadDropdown();
        this.fiscalYearService.ddl$.subscribe(response=>{
            this.ddlFiscalYearDropdown=response;
            console.log("this.ddlFiscalYearDropdown >>>", this.ddlFiscalYearDropdown);
        })
    }

  getPayrollConditionalDepositAllowance() {
    this.conditionalDepositAllowanceService.get({}).subscribe({
      next: (response: any) => {
        this.list = response.body;
      },
      error: (error) => {
        this.utilityService.httpErrorHandler(error);
      }
    });
  }

  configSearchForm: FormGroup;
  configSearchFormInit(){
    this.configSearchForm = this.fb.group({
      allowanceNameId: new FormControl(0),
      fiscalYearId: new FormControl(0)
    })
  }

  configId: any = 0;
  showProcessModal: boolean = false;
  openProcessModal(id: number) {
    this.showProcessModal = true;
    this.configId = id;
  }

  closeProcessModal(reason: any) {
    this.showProcessModal = false;
  }

  showAddConfigModal: boolean = false;
  itemIdInEdit: number = 0;
  openDepositPaymentModal(id: number) {
    console.log("id >>>>>", id);
    this.showAddConfigModal = true;
    this.itemIdInEdit = id;
  }

  closeDepositPaymentModal(reason: any) {
    this.showAddConfigModal = false;
    this.itemIdInEdit = 0;
  }

}
