import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { PayrollWebService } from "src/app/shared/services/payroll-web.service";
import { UtilityService } from "src/app/shared/services/utility.service";
import { IncomeTaxSettingService } from "../income-tax-setting.service";
import { CustomModalService } from "src/app/shared/services/custom-modal.service";

@Component({
    selector: 'app-tax-setting-insert-update-modal',
    templateUrl: './insert-update-tax-setting-modal.component.html'
})


export class TaxSettingInsertUpdateModalComponent implements OnInit {

    @Input() incomeSettingId: number = 0;
    @ViewChild('modal', { static: true }) modal!: ElementRef;
    @Output() closeModalEvent = new EventEmitter<string>();
    constructor(
        private utilityService: UtilityService,
        private payrollWebService: PayrollWebService,
        private fb: FormBuilder,
        private incomeTaxSettingService: IncomeTaxSettingService,
        private modalService: CustomModalService
    ) {
    }

    ngOnInit(): void {
        if (this.incomeSettingId > 0) {
            this.modalTitle = "Update Income Tax Setting"
        }
        else {
            this.modalTitle = "Setting up Income Tax"
        }
        this.loadFicalYear();
        this.openModal()
        this.incomeTaxSettingFormInit();
    }

    openModal() {
        this.modalService.open(this.modal, "xl");
    }

    ddlImpliedCondition: any = this.utilityService.getTaxSlabImpliedCondition();
    ddlOperators: any[] = this.utilityService.getOperators();
    modalTitle: string = "";

    ddlFiscalYear: any[] = [];
    loadFicalYear() {
        this.ddlFiscalYear = [];
        this.payrollWebService.getFiscalYears<any[]>().then((response) => {
            this.ddlFiscalYear = response;
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
            minTaxAmount: new FormControl(5000, [Validators.required]),
            isFlatRebate: new FormControl(null),
            exemptionAmountOfAnnualIncome: new FormControl(0),
            exemptionPercentageOfAnnualIncome: new FormControl(0),
            freeCarCCMinimumLimit: new FormControl(0),
            freeCarMinTaxableAmount: new FormControl(0),
            freeCarMaxTaxableAmount: new FormControl(0),
            monthlyTaxDeductionPercentage: new FormControl(0),
            calculateTaxOnArrearAmount: new FormControl(false),
            pfBothPartExemption: new FormControl(false),
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

    btnSubmit: boolean = false;

    submit() {
        const formValues = this.incomeTaxSettingForm.value;
        console.log("formValues >>>", formValues);
        if (this.incomeTaxSettingForm.valid && this.btnSubmit == false) {
            this.btnSubmit = true;
            let setting: any = {};
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
            setting.freeCarMaxTaxableAmount = this.incomeTaxSettingForm.get('freeCarMaxTaxableAmount').value;
            setting.monthlyTaxDeductionPercentage = this.incomeTaxSettingForm.get('monthlyTaxDeductionPercentage').value;
            setting.calculateTaxOnArrearAmount = this.incomeTaxSettingForm.get('calculateTaxOnArrearAmount').value;
            setting.pfBothPartExemption = this.incomeTaxSettingForm.get('pfBothPartExemption').value;

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

            let data = { incomeTaxSetting: setting, taxExemptionSettings: taxExemptionSettings, taxInvestmentSettings: taxInvestmentSettings };

            this.incomeTaxSettingService.save(data).subscribe(response => {
                let res = response as any;
                this.btnSubmit = false;
                if (res.status) {
                    this.closeModal('Save Complete')
                    this.utilityService.success(res.msg, "Server Response");
                }
                else {
                    if (res.msg == "Validation Error") {
                        this.utilityService.fail(res.errors?.duplicateAllowance, "Server Response", 5000);
                    }
                    else {
                        this.utilityService.fail(res.msg, "Server Response")
                    }
                }
            }, (error) => {
                this.btnSubmit = false;
                this.utilityService.httpErrorHandler(error);
            })
        }
        else {
            this.utilityService.fail("Invalid Form", "Site Response")
        }
    }


    closeModal(reason: any) {
        if (this.btnSubmit == false) {
            this.closeModalEvent.emit(reason);
            this.modalService.service.dismissAll(reason);
        }
    }

    listOfIncomeTaxSetting: any[] = [];
    searchByFiscalYear: number = 0;
    listOfIncomeTaxSettingDTLabel: string = null;

    //   //#region tax-details
    //   listOfIncomeTaxProcessDetail: any[] = [];
    //   getIncomeTaxProcessDetails() {
    //     this.areasHttpService.observable_get((ApiArea.payroll + "/TaxSetting" + "/GetTaxProcessDetails"), {
    //       responseType: "json", params: {
    //         companyId: this.User().ComId, organizationId: this.User().OrgId
    //       }
    //     }).subscribe(data => {
    //       this.logger("data >>>", data);
    //     }, (error: any) => {
    //       this.utilityService.toastr.error("Data retrieval issue", "Server Response")
    //     })
    //   }
}