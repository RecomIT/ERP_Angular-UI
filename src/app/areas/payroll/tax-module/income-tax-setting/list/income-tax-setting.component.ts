import { transition, trigger, useAnimation } from '@angular/animations';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { slideInUp } from 'ng-animate';
import { ApiArea } from 'src/app/shared/constants';
import { CustomModalService } from 'src/app/shared/services/custom-modal.service';
import { PayrollWebService } from 'src/app/shared/services/payroll-web.service';
import { UserService } from 'src/app/shared/services/user.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AreasHttpService } from '../../../../areas.http.service';
import { IncomeTaxSettingService } from '../income-tax-setting.service';
import { FiscalYearService } from '../../../salary-module/setup/fiscalYear/fiscalYear.service';

@Component({
  selector: 'app-income-tax-setting',
  templateUrl: './income-tax-setting.component.html',
  animations: [
    trigger('slideInUp', [transition('* => *', useAnimation(slideInUp, { params: { timing: 0.5 } }))]),
  ]
})
export class IncomeTaxSettingComponent implements OnInit {

  @ViewChild('incomeTaxSettingModal', { static: true }) incomeTaxSettingModal!: ElementRef;
  isViewPage: boolean = false;
  constructor(private utilityService: UtilityService, private payrollWebService: PayrollWebService, private fb: FormBuilder,
    private userService: UserService, public modalService: CustomModalService, private areasHttpService: AreasHttpService,
    private incomeTaxSettingService: IncomeTaxSettingService, private fiscalYearService: FiscalYearService) { }

  pagePrivilege: any = this.userService.getPrivileges();;

  ngOnInit(): void {
    this.loadFiscalYearForSearch();
    this.pageView();
  }

  pageView() {
    this.isViewPage = !this.isViewPage;
    if (this.isViewPage == true) {
      this.getIncomeTaxSettings();
    }
    else {
      this.loadFicalYear();
      this.incomeTaxSettingFormInit();
    }
  }

  /// Page Basic Setting //
  logger(msg: any, options: any) {
    this.utilityService.consoleLog(msg, options);
  }

  User() {
    return this.userService.User();
  }

  select2Options = this.utilityService.select2Config();
  //===================//

  //------------Income Tax List------------//
  ddlFiscalYearForSearch: any[] = [];
  loadFiscalYearForSearch() {
    this.ddlFiscalYearForSearch = [];
    this.fiscalYearService.loadDropdown();
    this.fiscalYearService.ddl$.subscribe(response => {
      this.ddlFiscalYearForSearch = response;
    })
  }

  getIncomeTaxSettings() {
    this.incomeTaxSettingService.get({
      incomeTaxSettingId: 0, fiscalYearId: (this.searchByFiscalYear ?? 0), impliedCondition: ""
    }).subscribe(reponse => {
      var result = reponse.body as any[];
      if (result.length == 0) {
        this.listOfIncomeTaxSetting = null;
      }
      else {
        this.listOfIncomeTaxSetting = result;
      }
      this.listOfIncomeTaxSettingDTLabel = this.listOfIncomeTaxSetting == null ? "No record(s) found" : null;
    }, (error) => {
      this.utilityService.httpErrorHandler(error);
    })
  }
  //------------------------//

  //----------- Income Tax Setting Detail ---------//

  details_data: any;
  getIncomeTaxSettingDetail(id: number, flag: string) {
    this.incomeTaxSettingService.getById({ id: id }).subscribe(response => {
      console.log("subscribe >>>", response)
      var result = response.body as any[];
      if (result.length == 0) {
        this.logger(" No details found ", result)
      }
      else {
        if (flag == "edit") {
          this.details_data = response.body;
        }
        else {
          this.details_data = response.body;
          console.log("details_data >>>", this.details_data);
          this.openTaxSettingDetail();
        }
      }
    }, (error) => {
      this.utilityService.httpErrorHandler(error);
    })
  }
  //----------- End Of Income Tax Detail ---------//

  //----------- Tax Setting Detail ------------//

  openTaxSettingDetail() {
    this.modalService.open(this.incomeTaxSettingModal, 'lg')
  }
  //---------- Tax Setting Detail ----------//

  ddlImpliedConditionInEntry: any = this.utilityService.getTaxSlabImpliedCondition();
  ddlOperators: any[] = this.utilityService.getOperators();

  ddlFiscalYearInEntry: any[] = [];
  loadFicalYear() {
    this.ddlFiscalYearInEntry = [];
    this.payrollWebService.getFiscalYears<any[]>().then((response) => {
      this.ddlFiscalYearInEntry = response;
    })
  }

  incomeTaxSettingForm: FormGroup;
  examptionSlabsFormArray: any;
  investmentSlabFormArray: any;
  investmentSlabFlatFormArray: any;

  incomeTaxSettingFormInit() {
    this.incomeTaxSettingForm = this.fb.group({
      incomeTaxSettingId: new FormControl(0),
      fiscalYearId: new FormControl(0, [Validators.min(1), Validators.minLength(1)]),
      impliedCondition: new FormControl('Regardleass', [Validators.required]),
      maxTaxAge: new FormControl('', [Validators.required]),
      minTaxAmount: new FormControl('', [Validators.required]),
      isFlatRebate: new FormControl(null),
      exemptionAmountOfAnnualIncome: new FormControl(0),
      exemptionPercentageOfAnnualIncome: new FormControl(0),
      freeCarCCMinimumLimit: new FormControl(0),
      freeCarMinTaxableAmount: new FormControl(0),
      freeCarMaxTaxableAmount: new FormControl(0),
      monthlyTaxDeductionPercentage: new FormControl(0),
      taxExemptionSettings: this.fb.array([
        this.fb.group({
          taxExemptionSettingId: new FormControl(0),
          allowanceName: new FormControl('', [Validators.required]),
          maxExemptionPercentage: new FormControl(null),
          baseAllowance: new FormControl(''),
          maxExemptionAmount: new FormControl(null),
          exemptionRemarks: new FormControl('', Validators.required)
        })
      ]),
      taxInvestmentSettings: this.fb.array([
        this.fb.group({
          taxInvestmentSettingId: new FormControl(0),
          investmentImpliedCondition: new FormControl('Regardleass', [Validators.required]),
          maxInvestmentPercentage: new FormControl(null, [Validators.min(0)]),
          rebateAmount: new FormControl(null, [Validators.min(0)]),
          operator: new FormControl(null, [Validators.required]),
          minRebate: new FormControl(null, [Validators.min(0)]),
          maxRebate: new FormControl(null, [Validators.min(0)])
        })
      ]),
      taxInvestmentFlatSettings: this.fb.array([
        this.fb.group({
          taxInvestmentSettingId: new FormControl(0),
          investmentImpliedCondition: new FormControl('Regardleass', [Validators.required]),
          maxInvestmentPercentage: new FormControl(null, [Validators.min(0)]),
          rebateAmount: new FormControl(null, [Validators.min(0)]),
          operator: new FormControl(null, [Validators.required]),
          minRebate: new FormControl(null, [Validators.min(0)]),
          maxRebate: new FormControl(null, [Validators.min(0)])
        })
      ])
    });

    this.examptionSlabsFormArray = (<FormArray>this.incomeTaxSettingForm.get('taxExemptionSettings')).controls;
    this.investmentSlabFormArray = (<FormArray>this.incomeTaxSettingForm.get('taxInvestmentSettings')).controls;
    this.investmentSlabFlatFormArray = (<FormArray>this.incomeTaxSettingForm.get('taxInvestmentFlatSettings')).controls;

    this.incomeTaxSettingForm.get('isFlatRebate').valueChanges.subscribe((control: any) => {
      const investmentSlabs = (<FormArray>this.incomeTaxSettingForm.get('taxInvestmentSettings')).length;
      const investmentFlatSlabs = (<FormArray>this.incomeTaxSettingForm.get('taxInvestmentFlatSettings')).length;
      if (control) {
        if (investmentSlabs > 0) {
          for (let index = 0; index < investmentSlabs; index++) {
            (<FormArray>this.incomeTaxSettingForm.get('taxInvestmentSettings')).removeAt(index);
          }
        }
        if (investmentFlatSlabs > 0) {
          for (let index = 0; index < investmentFlatSlabs; index++) {
            (<FormArray>this.incomeTaxSettingForm.get('taxInvestmentFlatSettings')).removeAt(index);
          }
        }
        this.addNewSlab("flat_investment");
      }
      else {
        if (investmentSlabs > 0) {
          for (let index = 0; index < investmentSlabs; index++) {
            (<FormArray>this.incomeTaxSettingForm.get('taxInvestmentSettings')).removeAt(index);
          }
        }
        if (investmentFlatSlabs > 0) {
          for (let index = 0; index < investmentFlatSlabs; index++) {
            (<FormArray>this.incomeTaxSettingForm.get('taxInvestmentFlatSettings')).removeAt(index);
          }
        }
        this.addNewSlab("investment");
      }
    })
  }

  addNewSlab(slabType: string) {
    if (slabType == "exemption") {
      (<FormArray>this.incomeTaxSettingForm.get('taxExemptionSettings')).push(this.addNewExamptionSlab());
    }
    else if (slabType == "investment") {
      (<FormArray>this.incomeTaxSettingForm.get('taxInvestmentSettings')).push(this.addNewInvestmentSlab());
    }
    else if (slabType == "flat_investment") {
      (<FormArray>this.incomeTaxSettingForm.get('taxInvestmentFlatSettings')).push(this.addNewFlatInvestmentSlab());
    }
  }

  addNewExamptionSlab() {
    return this.fb.group({
      taxExemptionSettingId: new FormControl(0),
      allowanceName: new FormControl('', [Validators.required]),
      maxExemptionPercentage: new FormControl(null),
      baseAllowance: new FormControl(''),
      maxExemptionAmount: new FormControl(null),
      exemptionRemarks: new FormControl('', Validators.required)
    })
  }

  addNewInvestmentSlab() {
    return this.fb.group({
      taxInvestmentSettingId: new FormControl(0),
      investmentImpliedCondition: new FormControl('Regardleass', [Validators.required]),
      maxInvestmentPercentage: new FormControl(null, [Validators.min(0)]),
      rebateAmount: new FormControl(null, [Validators.min(0)]),
      operator: new FormControl(null, [Validators.required]),
      minRebate: new FormControl(null, [Validators.min(0)]),
      maxRebate: new FormControl(null, [Validators.min(0)])
    })
  }

  addNewFlatInvestmentSlab() {
    return this.fb.group({
      taxInvestmentSettingId: new FormControl(0),
      investmentImpliedCondition: new FormControl('Regardleass', [Validators.required]),
      maxInvestmentPercentage: new FormControl(null, [Validators.min(0)]),
      minRebate: new FormControl(null, [Validators.min(0)]),
      rebateAmount: new FormControl(null, [Validators.min(0)])
    })
  }

  removeExemptionSlab(index: number) {
    if ((<FormArray>this.incomeTaxSettingForm.get('taxExemptionSettings')).length > 1) {
      (<FormArray>this.incomeTaxSettingForm.get('taxExemptionSettings')).removeAt(index);
    }
    else {
      this.utilityService.fail("You can't delete last item", "Site Response");
    }
  }

  btnTaxSetting: boolean = false;

  submitIncomeTaxSetting() {
    const formValues = this.incomeTaxSettingForm.value;
    console.log("formValues >>>", formValues);
    if (this.incomeTaxSettingForm.valid) {
      var setting: any = {};
      setting.incomeTaxSettingId = this.incomeTaxSettingForm.get('incomeTaxSettingId').value;
      setting.fiscalYearId = parseInt(this.incomeTaxSettingForm.get('fiscalYearId').value);
      setting.impliedCondition = this.incomeTaxSettingForm.get('impliedCondition').value;
      setting.minTaxAmount = this.incomeTaxSettingForm.get('minTaxAmount').value;
      setting.maxTaxAge = this.incomeTaxSettingForm.get('maxTaxAge').value;
      setting.isFlatRebate = this.incomeTaxSettingForm.get('isFlatRebate').value;
      setting.exemptionAmountOfAnnualIncome = this.incomeTaxSettingForm.get('exemptionAmountOfAnnualIncome').value;
      setting.exemptionPercentageOfAnnualIncome = this.incomeTaxSettingForm.get('exemptionPercentageOfAnnualIncome').value;
      setting.freeCarCCMinimumLimit = this.incomeTaxSettingForm.get('freeCarCCMinimumLimit').value;
      setting.freeCarMinTaxableAmount = this.incomeTaxSettingForm.get('freeCarMinTaxableAmount').value;
      setting.monthlyTaxDeductionPercentage = this.incomeTaxSettingForm.get('monthlyTaxDeductionPercentage').value;

      let taxExemptionSettings = [];

      formValues.taxExemptionSettings.forEach(item => {
        let remarks = item.exemptionRemarks;
        let takeLowerAmount = item.exemptionRemarks == "Which is Lower" ? true : false;
        let uptoMaxAmount = item.exemptionRemarks == "Upto Amount" ? true : false;
        let uptoPercentage = item.exemptionRemarks == "Upto Percentage" ? true : false;

        taxExemptionSettings.push({
          taxExemptionSettingId: item.taxExemptionSettingId,
          allowance: item.allowanceName,
          basedOfAllowance: item.baseAllowance,
          maxExemptionAmount: item.maxExemptionAmount == null ? 0.00 : item.maxExemptionAmount,
          maxExemptionPercentage: item.maxExemptionPercentage == null ? 0.00 : item.maxExemptionPercentage,
          takeLowerAmount: takeLowerAmount,
          uptoMaxAmount: uptoMaxAmount,
          uptoMaxPercentage: uptoPercentage,
          exemptionRemarks: remarks
        })

      });

      let taxInvestmentSettings = [];

      if (formValues.taxInvestmentSettings.length > 0) {
        formValues.taxInvestmentSettings.forEach(item => {
          taxInvestmentSettings.push({
            taxInvestmentSettingId: item.taxInvestmentSettingId,
            fiscalYearId: setting.fiscalYearId,
            impliedCondition: item.investmentImpliedCondition,
            maxInvestmentPercentage: item.maxInvestmentPercentage,
            rebateAmount: item.rebateAmount,
            operator: item.operator,
            minRebate: item.minRebate,
            maxRebate: item.maxRebate,
            flag: 'Condition'
          })
        });
      }
      else if (formValues.taxInvestmentFlatSettings.length > 0) {
        formValues.taxInvestmentFlatSettings.forEach(item => {
          taxInvestmentSettings.push({
            taxInvestmentSettingId: item.taxInvestmentSettingId,
            fiscalYearId: setting.fiscalYearId,
            impliedCondition: item.investmentImpliedCondition,
            maxInvestmentPercentage: parseFloat(item.maxInvestmentPercentage),
            rebateAmount: item.rebateAmount != null ? parseFloat(item.rebateAmount) : 0.00,
            operator: item.operator,
            minRebate: (item.minRebate) != null ? parseFloat(item.minRebate) : 0.00,
            maxRebate: (item.maxRebate) != null ? parseFloat(item.maxRebate) : 0.00,
            flag: 'Flat',
            isFlatRebate: setting.isFlatRebate
          })
        });
      }

      var data = { incomeTaxSetting: setting, taxExemptionSettings: taxExemptionSettings, taxInvestmentSettings: taxInvestmentSettings };

      this.incomeTaxSettingService.save(data).subscribe(response => {
        var data = response as any;
        this.btnTaxSetting = false;
        if (data.status) {
          this.pageView();
          this.utilityService.success(data.msg, "Server Response");
          this.modalService.service.dismissAll();
        }
        else {
          if (data.msg == "Validation Error") {
            this.utilityService.fail(data.errors?.duplicateAllowance, "Server Response", 5000);
          }
          else {
            this.utilityService.fail(data.msg, "Server Response")
          }
        }
      }, (error) => {
        this.btnTaxSetting = false;
        this.utilityService.httpErrorHandler(error);
      })
    }
    else {
      this.utilityService.fail("Invalid Form", "Site Response")
    }
  }

  listOfIncomeTaxSetting: any[] = [];
  searchByFiscalYear: number = 0;
  listOfIncomeTaxSettingDTLabel: string = null;

  //#region tax-details
  listOfIncomeTaxProcessDetail: any[] = [];
  getIncomeTaxProcessDetails() {
    this.areasHttpService.observable_get((ApiArea.payroll + "/TaxSetting" + "/GetTaxProcessDetails"), {
      responseType: "json", params: {
        companyId: this.User().ComId, organizationId: this.User().OrgId
      }
    }).subscribe(data => {
      this.logger("data >>>", data);
    }, (error: any) => {
      this.utilityService.toastr.error("Data retrieval issue", "Server Response")
    })
  }
  //#endregion

  //#region openModal
  showInsertUpdateModal: boolean = false;
  incomeSettingId: number = 0;
  openModal() {
    this.showInsertUpdateModal = true;
    this.incomeSettingId = 0;
  }

  closeModal(reason: any) {
    this.showInsertUpdateModal = false;
    this.incomeSettingId = 0;
    if (reason == "Save Complete") {
      this.getIncomeTaxSettings();
    }
  }
  //#endregion

}
