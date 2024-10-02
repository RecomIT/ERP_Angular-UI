// Module
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TimepickerConfig, TimepickerModule } from 'ngx-bootstrap/timepicker';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';

import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NgSelect2Module } from 'ng-select2';
import { NgxPaginationModule } from 'ngx-pagination';

// routing
import { PayrollRoutingModule } from './payroll.routing';

// Services
import { PayrollWebService } from 'src/app/shared/services/payroll-web.service';
import { HrWebService } from 'src/app/shared/services/hr-web.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { getTimepickerConfig } from 'src/app/shared/factory-service';

// Component
import { PayrollComponent } from './payroll.component';
import { SalaryAllowanceConfigComponent } from './salary-module/allowance/salary-allowance-config/salary-allowance-config.component';
import { DeductionHeadComponent } from './salary-module/deduction/deduction-head/deduction-head.component';
import { SalaryReviewComponent } from './salary-module/salary/salary-review/list/salary-review.component';
import { AllowanceConfigurationComponent } from './salary-module/allowance/allowance-configuration/list/allowance-configuration.component';
import { DeductionConfigurationComponent } from './salary-module/deduction/deduction-configuration/deduction-configuration.component';
import { SetupComponent } from './salary-module/setup/fiscalYear/setup.component';
import { VariableAllowanceComponent } from './salary-module/variable/variable-allowance/variable-allowance.component';
import { SalaryProcessComponent } from './salary-module/salary/salary-process/salary-process.component';
import { VariableDeductionComponent } from './salary-module/variable/variable-deduction/variable-deduction.component';
import { UploadSalaryComponentComponent } from './salary-module/salary/upload-salary-component/upload-salary-component.component';
import { SalaryReportsComponent } from './salary-module/salary/salary-reports/salary-reports.component';
import { EmployeePayslipComponent } from './salary-module/employee-payslip/employee-payslip.component';
import { SalaryProcessExtensionComponent } from './salary-module/salary/salary-process-extension/salary-process-extension.component';
import { IncomeTaxSlabComponent } from './tax-module/income-tax-slab/list/income-tax-slab.component';
import { IncomeTaxSettingComponent } from './tax-module/income-tax-setting/list/income-tax-setting.component';
import { BonusConfigComponent } from './salary-module/bonus/bonus-config/bonus-config.component';
import { IncomeTaxProcessComponent } from './tax-module/income-tax-process/income-tax-process.component'
import { ExternalReportComponent } from './salary-module/salary/external-reports/external-report.component';
import { EmployeeIncomeTaxZoneComponent } from './tax-module/employee-income-tax-zone/employee-income-tax-zone.component';
import { AddEmployeeTaxZoneModalComponent } from './payroll-modals/employee-taxzone-modal/add-employee-taxzone-modal.component';
import { BonusModalComponent } from './payroll-modals/bonus-modal/bonus-modal.component';
import { BonusConfigExtensionComponent } from './salary-module/bonus/bonus-config-extension/bonus-config-extension.component';
import { BonusConfigModalComponent } from './payroll-modals/bonus-config-modal/bonus-config-modal.component';
import { BonusProcessComponent } from './salary-module/bonus/bonus-process/bonus-process.component';
import { BonusProcessExecutionComponent } from './salary-module/bonus/bonus-process/bonus-process-execution.component';
import { UploadVariableAllowanceModalComponent } from './payroll-modals/upload-variable-allowance-modal/upload-variable-allowance-modal.component';
import { UploadVariableDeductionModalComponent } from './payroll-modals/upload-variable-deduction-modal/upload-variable-deduction-modal.component';
import { TaxCardComponent } from './tax-module/tax-card/tax-card.component';
import { ExployeeTaxCardComponent } from './tax-module/employee-tax-card/employee-tax-card.component';
import { SalaryProcessExtensionExtraComponent } from './salary-module/salary/salary-process-extension-extra/list/salary-process-extension-extra.component';
import { SalaryProcessDetailModalComponent } from './salary-module/salary/salary-process-extension-extra/salary-process-detail-modal/salary-process-detail-modal.component';
import { SalaryDisbursedModalComponent } from './salary-module/salary/salary-process-extension-extra/salary-disbursed-modal/salary-disbursed-modal.component';
import { SalaryProcessModalComponent } from './salary-module/salary/salary-process-extension-extra/salary-process-modal/salary-process-modal.component';
import { EmployeeSalaryAllowanceDeductionModalComponent } from './salary-module/salary/salary-process-extension-extra/employee-salary-allowance-deduction-modal/employee-salary-allowance-deduction-modal.component';
import { AddSalaryAllowanceConfigComponent } from './salary-module/allowance/salary-allowance-config/add-salary-allowance-config.componet';
import { BonusDisbursedModalComponent } from './payroll-modals/bonus-disbursed-modal/bonus-disbursed-modal.component';
import { BonusProcessUndoModalComponent } from './payroll-modals/bonus-process-undo-modal/bonus-process-undo-modal.component';
import { UploadEmployeeTaxZoneModalComponent } from './payroll-modals/upload-employee-tax-zone-modal/upload-employee-tax-zone-modal.component';
import { EmployeeBonusUndoModalComponent } from './payroll-modals/employee-bonus-undo-modal/employee-bonus-undo-modal.component';
import { BonusExcludeEmployeeModal } from './payroll-modals/bonus-exclude-employee-modal/bonus-exclude-employee-modal.component';
import { SelfYearlyInvestmentComponent } from './tax-module/self-yearly-investment/self-yearly-investment.component';
import { YearlyInvestmentModalComponent } from './payroll-modals/yearly-investment-modal/yearly-investment-modal.component';
import { TaxReturnSubmissionModal } from './tax-module/employee-tax-return-submission/tax-return-submission-modal/tax-return-submission-modal.component';
import { SelfTaxReturnSubmissionComponent } from './tax-module/self-tax-return-submission/self-tax-return-submission.component';
import { SelfAITSubmissionComponent } from './tax-module/self-ait-submission/self-ait-tax-submission.component';
import { SelfAITSubmissionModalComponent } from './tax-module/self-ait-submission/self-ait-modal/self-ait-modal.component';
import { EmployeeTaxReturnSubmissionComponent } from './tax-module/employee-tax-return-submission/employee-tax-return-submission.component';
import { AddSalaryAllowanceConfigExtensionComponent } from './salary-module/allowance/salary-allowance-config-extension/add-salary-allowance-config-extension/add-salary-allowance-config-extension.component';
import { PayslipTaxCardEmailingModalComponent } from './payroll-modals/payslip-taxcard-emailing-modal/payslip-taxcard-emailing.component';
import { EmployeeSalaryHoldComponent } from './salary-module/salary/employee-salary-hold/list/employee-salary-hold.component';
import { EmployeeSalaryHoldModalComponent } from './salary-module/salary/employee-salary-hold/insert-update/employee-salary-hold-modal.component';
import { UploadEmployeeSalaryHoldComponent } from './salary-module/salary/employee-salary-hold/uploader/upload-employee-salary-hold.component';
import { ActualTaxDeductionComponent } from './tax-module/actual-tax-deduction/actual-tax-deduction.component';
import { UploadEmployeeTaxDeductionComponent } from './payroll-modals/upload-employee-tax-deduction/upload-employee-tax-deduction.component';
import { ActualTaxDeductionModalComponent } from './tax-module/actual-tax-deduction/actual-tax-deduction-modal/actual-tax-deduction-modal.component';
import { ActualTaxDeductionApprovalModalComponent } from './tax-module/actual-tax-deduction/actual-tax-deduction-approval-modal/actual-tax-deduction-approval-modal.component';
import { DownloadPayslipFromDateRangeComponent } from './payroll-modals/download-payslip-from-date-range/download-payslip-from-date-range.component';
import { EmployeeSalarySheetModalComponent } from './payroll-modals/employee-salary-sheet-modal/employee-salary-sheet-modal.component';
import { SupplementaryPaymentComponent } from './salary-module/payment/supplementary/supplementary-payment/supplementary-payment.component';
import { TaxDeleteModalComponent } from './payroll-modals/tax-delete-modal/tax-delete-modal.component';
import { AllowanceHeadComponent } from './salary-module/allowance/allowance-head/list/allowance-head.component';
import { SalaryAllowanceConfigExtensionComponent } from './salary-module/allowance/salary-allowance-config-extension/salary-allowance-config-extension.component';
import { SupplementaryProcessInfoComponent } from './salary-module/payment/supplementary/supplementary-process-info/supplementary-process-info.component';
import { SupplementaryPaymentProcessModalComponent } from './salary-module/payment/supplementary/supplementary-payment-process-modal/supplementary-payment-process-modal.component';
import { AllowanceHeadNameConfigComponent } from './salary-module/allowance/allowance-head-name-config/allowance-head-name-config.component';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { AllowanceHeadNameConfigInsertUpdateModalComponent } from './salary-module/allowance/allowance-head-name-config/allowance-head-name-config-insert-update-modal.component';
import { ProjectedPaymentListComponent } from './salary-module/payment/projected-payment/list/projected-payment-list.component';
import { ProjectedPaymentInsertUpdateModalComponent } from './salary-module/payment/projected-payment/insert-update/insert-update-projected-payment-modal.component';
import { UploadProjectedPaymentModalComponent } from './salary-module/payment/projected-payment/upload-projected-payment/upload-projected-payment-modal.component';
import { FlatAmountUploaderModalComponent } from './salary-module/salary/salary-review/flat-amount-uploader/flat-amount-uploader-modal.component';
import { EmployeeCashSalaryComponent } from './salary-module/cash-salary/cash-salary-list/employee-cash-salary.component';
import { AddCashSalaryHeadModalComponent } from './salary-module/cash-salary/cash-salary-head/insert-update/add-cash-salary-head-modal.component';
import { AddCashSalaryAmountComponent } from './salary-module/cash-salary/cash-salary-amount/insert-update/add-cash-salary-amount/add-cash-salary-amount.component';
import { CashSalaryProcessModalComponent } from './salary-module/cash-salary/cash-salary-process/cash-salary-process-modal/cash-salary-process-modal.component';
import { CashSalaryProcessDetailModalComponent } from './salary-module/cash-salary/cash-salary-process/cash-salary-process-detail-modal/cash-salary-process-detail-modal.component';
import { CashSalaryDisbursedModalComponent } from './salary-module/cash-salary/cash-salary-process/cash-salary-disbursed-modal/cash-salary-disbursed-modal.component';
import { ViewAndCheckCashSalaryModalComponent } from './salary-module/cash-salary/cash-salary-amount/view-and-check/view-and-check-cash-salary-modal.component';
import { EditCashSalaryAmountModalComponent } from './salary-module/cash-salary/cash-salary-amount/insert-update/edit-cash-salary-amount-modal/edit-cash-salary-amount-modal.component';
import { UploadCashSalaryAmountModalComponent } from './salary-module/cash-salary/cash-salary-amount/upload/upload-cash-salary-amount-modal.component';
import { UploadCashSalaryHeadModalComponent } from './salary-module/cash-salary/cash-salary-head/upload/upload-cash-salary-head-modal.component';
import { UploadSalaryReviewModalComponent } from './salary-module/salary/salary-review/upload/upload-salary-review-modal.component';
import { DownloadSalaryReviewSheetModalComponent } from './salary-module/salary/salary-review/download/download-salary-review-sheet-modal.component';
import { WalletPaymentComponent } from './salary-module/wallet-payment/wallet-payment.component';
import { WalletPaymentConfigurationComponent } from './salary-module/wallet-payment/wallet-payment-configuration/list/wallet-payment-configuration.component';
import { AddWalletPaymentConfigModalComponent } from './salary-module/wallet-payment/wallet-payment-configuration/insert-update/add-wallet-payment-config-modal/add-wallet-payment-config-modal.component';
import { EditWalletPaymentConfigModalComponent } from './salary-module/wallet-payment/wallet-payment-configuration/insert-update/edit-wallet-payment-config-modal/edit-wallet-payment-config-modal.component';
import { UploadWalletPaymentConfigModalComponent } from './salary-module/wallet-payment/wallet-payment-configuration/upload/upload-wallet-payment-config-modal/upload-wallet-payment-config-modal.component';
import { QuarterlyIncentiveProcessComponent } from './salary-module/incentive/quarterly-incentive-process/quarterly-incentive-process.component';
import { QuarterlyIncentiveProcessDetailsComponent } from './salary-module/incentive/quarterly-incentive-process-details/quarterly-incentive-process-details.component';
import { QuarterlyIncentiveProcessDetailsViewOrDeleteComponent } from './salary-module/incentive/quarterly-incentive-process-details-view-or-delete/quarterly-incentive-process-details-view-or-delete.component';
import { QuarterlyIncentiveProcessExcelUploadComponent } from './salary-module/incentive/quarterly-incentive-process-excel-upload/quarterly-incentive-process-excel-upload.component';
import { QuarterlyIncentiveProcessReportComponent } from './salary-module/incentive/quarterly-incentive-process-report/quarterly-incentive-process-report.component';
import { QuarterlyIncentiveProcessUndoOrDisversedComponent } from './salary-module/incentive/quarterly-incentive-process-undo-or-disversed/quarterly-incentive-process-undo-or-disversed.component';
import { ProjectedPaymentProcessModalComponent } from './salary-module/payment/projected-payment/projected-payment-process-modal/projected-payment-process-modal.component';
import { ServiceAnniversaryAllowanceComponent } from './salary-module/payment/service-anniversary-allowance/insert-update/service-anniversary-allowance.component';
import { ServiceAnniversaryAllowanceListComponent } from './salary-module/payment/service-anniversary-allowance/list/service-anniversary-allowance-list.component';
import { ConditionalDepositAllowanceListComponent } from './salary-module/payment/conditional-deposit-allowance/list/conditional-deposit-allowance-list.component';
import { DepositPaymentComponent } from './salary-module/payment/deposit-payment-history/insert-update/deposit-payment.component';
import { ConditionalDepositAllowanceComponent } from './salary-module/payment/conditional-deposit-allowance/insert-update/conditional-deposit-allowance.component';
import { TaxProcessModalComponent } from './tax-module/income-tax-process/process-modal/tax-process-modal.component';
import { VariableAllowanceDeleteModalComponent } from './salary-module/variable/variable-allowance/delete-modal/variable-allowance-delete-modal.component';
import { VariableDeductionDeleteModalComponent } from './salary-module/variable/variable-deduction/delete-modal/variable-deduction-delete-modal.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { DepositPaymentHistoryComponent } from './salary-module/payment/deposit-payment-history/list/deposit-payment-history.component';
import { SelfTaxReturnSubmissionModal } from './tax-module/self-tax-return-submission/self-tax-return-submission-modal/self-tax-return-submission-modal.component';
import { EmployeeYearlyInvestmentComponent } from './tax-module/employee-yearly-investment/list/employee-yearly-investment.component';
import { UploadEmployeeYearlyInvestmentModalComponent } from './tax-module/employee-yearly-investment/upload/upload-employee-yearly-investment-modal.component';
import { EmployeeYearlyInvestmentModalComponent } from './tax-module/employee-yearly-investment/insert-update/employee-yearly-investment-modal.component';
import { SelfTaxRefundSubmissionComponent } from './tax-module/self-tax-refund-submission/self-tax-refund-submission.component';
import { SelfTaxRefundModalComponent } from './tax-module/self-tax-refund-submission/self-refund-modal/self-tax-refund-modal.component';
import { PeriodicalVariableAllowanceListComponent } from './salary-module/periodical-variable/periodical-allowance/list/periodical-variable-allowance-list.component';
import { PeriodicalVariableAllowanceInsertUpdateModal } from './salary-module/periodical-variable/periodical-allowance/insert-update/periodical-variable-allowance-insert-update-modal.component';
import { SalaryReviewBulkApprovalModalComponent } from './salary-module/salary/salary-review/bulk-approval/salary-review-bulk-approval-modal.component';
import { SingelItemFileValueComponent } from './payroll-modals/single-item-file-values/singel-item-file-values.component';
import { UpdateApprovedVariableAllowanceComponent } from './salary-module/variable/variable-allowance/update-approved-variable-allowance/update-approved-variable-allowance.component';
import { ProjectedPaymentInsertModalComponent } from './salary-module/payment/projected-payment/insert-update/insert-projected-payment-modal.component';
import { DeletePendingProjectedAllowanceComponent } from './salary-module/payment/projected-payment/delete-pending-item/delete-pending-projected-allowance.component';
import { DeleteApprovedProjectedAllowanceComponent } from './salary-module/payment/projected-payment/delete-approved-item/delete-approved-projected-allowance.component';
import { UploadIncomeTaxChallanModalComponent } from './tax-module/tax-challan/upload/upload-income-tax-challan-modal.component';
import { TaxChallaBlukInsertModalComponent } from './tax-module/tax-challan/bluk-insert/tax-challan-bulk-insert-modal.component';
import { EmployeeIncomeTaxDocumentSubmissionComponent } from './tax-module/employee-income-tax-document-submission/list/employee-income-tax-document-submission.component';
import { AddEmployeeAdvanceIncomeTaxModalComponent } from './tax-module/employee-income-tax-document-submission/ait-insert-update/add-employee-advance-income-tax-modal.component';
import { TaxRefundInsertUpdateModalComponent } from './tax-module/employee-income-tax-document-submission/refund-insert-update/tax-refund-insert-update-modal.component';
import { TaxDocumentUploadComponent } from './tax-module/employee-income-tax-document-submission/upload/tax-document-upload.component';
import { DeleteTaxDocumentComponent } from './tax-module/employee-income-tax-document-submission/delete/delete-tax-document.component';
import { DeleteSalaryReviewModalComponent } from './salary-module/salary/salary-review/delete/delete-salary-review-modal.component';
import { TaxSettingInsertUpdateModalComponent } from './tax-module/income-tax-setting/insert-update/insert-update-tax-setting-modal.component';
import { PeriodicalHeadInfoComponent } from './salary-module/periodical-variable/periodical-allowance/head-info/periodical-head-info.component';
import { PricipleAmountModalComponent } from './salary-module/periodical-variable/periodical-allowance/principle-amount/principle-amount-modal.component';
import { UpdateProjectedPaymentComponent } from './salary-module/payment/projected-payment/update-projected-payment/update-projected-payment.component';
import { ApprovalProjectedPaymentComponent } from './salary-module/payment/projected-payment/approval/approval-projected-payment.component';
import { ConditionalProjectedPaymentList } from './salary-module/payment/conditional-projected-payment/list/conditional-projected-payment-list.component';
import { MonthlyAllowancetListComponent } from './salary-module/payment/monthly-allowance/list/monthly-allowance-list.component';
import { FinalTaxCardProcessModalComponent } from './tax-module/income-tax-process/final-tax-card-process/final-tax-card-process-modal.component';
import { FinalTaxCardDetailComponent } from './tax-module/income-tax-process/final-tax-card-detail/final-tax-card-detail.component';
import { SupplementaryPaymentDisbursedModalComponent } from './salary-module/payment/supplementary/supplementary-payment-disbursed-modal/supplementary-payment-disbursed-modal.component';
import { SupplementaryAmountComponent } from './salary-module/payment/supplementary/supplementary-amount/supplementary-amount.component';
import { AddSupplementaryAmountComponent } from './salary-module/payment/supplementary/add-update-supplementary-amount-modal/add-supplementary-amount-modal.component';
import { UpdateSupplementaryAmountModalComponent } from './salary-module/payment/supplementary/update-supplementary-amount/update-supplementary-amount-modal.component';
import { SalaryAllowanceArrearAdjustmentComponent } from './salary-module/salary/salary-allowance-arrear-adjustment/list/salary-allowance-arrear-adjustment.component';
import { UploadSalaryAllowanceArrearAdjustmentModalComponent } from './salary-module/salary/salary-allowance-arrear-adjustment/upload/upload-salary-allowance-arrear-adjustment-modal.component';
import { EditSalaryAllowanceArrearAdjustmentModalComponent } from './salary-module/salary/salary-allowance-arrear-adjustment/insert-update/edit-salary-allowance-arrear-adjustment-modal.component';
import { DeleteSalaryAllowanceArrearAdjustmentModalComponent } from './salary-module/salary/salary-allowance-arrear-adjustment/delete/delete-salary-allowance-arrear-adjustment-modal.component';
import { AddSalaryAllowanceArrearAdjustmentModalComponent } from './salary-module/salary/salary-allowance-arrear-adjustment/insert-update/add-salary-allowance-arrear-adjustment-modal.component';
import { ArrearAdjustmentBulkApprovalComponent } from './salary-module/salary/salary-allowance-arrear-adjustment/bulk-approval/arrear-adjusment-bulk-approval.component';
import { InsertUpdateConditionalProjectedPaymentComponent } from './salary-module/payment/conditional-projected-payment/insert-update/insert-update-conditional-projected-payment.component';
import { ConditionalProjectedPaymentApprovalComponent } from './salary-module/payment/conditional-projected-payment/approval/conditional-projected-payment-approval.component';
import { OnceOffPaymentEmailingComponent } from './salary-module/payment/supplementary/onceoff-payment-emailing/onceoff-payment-emailing.component';




@NgModule({
  imports: [
    CommonModule,
    PayrollRoutingModule,
    MatExpansionModule,
    FormsModule,
    ReactiveFormsModule,
    BsDatepickerModule.forRoot(),
    NgSelect2Module,
    NgxPaginationModule,
    TimepickerModule.forRoot(),
    TypeaheadModule.forRoot(),
    TooltipModule
  ],
  declarations: [
    PayrollComponent,
    AllowanceHeadComponent,
    SalaryAllowanceConfigComponent,
    DeductionHeadComponent,
    SalaryReviewComponent,
    AllowanceConfigurationComponent,
    DeductionConfigurationComponent,
    SetupComponent,
    VariableAllowanceComponent,
    SalaryProcessComponent,
    VariableDeductionComponent,
    UploadSalaryComponentComponent,
    SalaryReportsComponent,
    EmployeePayslipComponent,
    SalaryProcessExtensionComponent,
    IncomeTaxSlabComponent,
    IncomeTaxSettingComponent,
    BonusConfigComponent,
    IncomeTaxProcessComponent,
    ExternalReportComponent,
    EmployeeIncomeTaxZoneComponent,
    AddEmployeeTaxZoneModalComponent,
    BonusModalComponent,
    BonusConfigExtensionComponent,
    BonusConfigModalComponent,
    BonusProcessComponent,
    BonusProcessExecutionComponent,
    UploadVariableAllowanceModalComponent,
    UploadVariableDeductionModalComponent,
    TaxCardComponent,
    ExployeeTaxCardComponent,
    SalaryProcessExtensionExtraComponent,
    SalaryProcessDetailModalComponent,
    SalaryDisbursedModalComponent,
    SalaryProcessModalComponent,
    EmployeeSalaryAllowanceDeductionModalComponent,
    AddSalaryAllowanceConfigComponent,
    BonusDisbursedModalComponent,
    BonusProcessUndoModalComponent,
    AddEmployeeAdvanceIncomeTaxModalComponent,
    EmployeeIncomeTaxDocumentSubmissionComponent,
    UploadEmployeeTaxZoneModalComponent,
    EmployeeBonusUndoModalComponent,
    BonusExcludeEmployeeModal,
    SelfYearlyInvestmentComponent,
    YearlyInvestmentModalComponent,
    SelfTaxReturnSubmissionComponent,
    TaxReturnSubmissionModal,
    SelfAITSubmissionComponent,
    SelfAITSubmissionModalComponent,
    EmployeeTaxReturnSubmissionComponent,
    EmployeeYearlyInvestmentComponent,
    SalaryAllowanceConfigExtensionComponent,
    AddSalaryAllowanceConfigExtensionComponent,
    PayslipTaxCardEmailingModalComponent,
    EmployeeSalaryHoldComponent,
    EmployeeSalaryHoldModalComponent,
    UploadEmployeeSalaryHoldComponent,
    ActualTaxDeductionComponent,
    UploadEmployeeTaxDeductionComponent,
    ActualTaxDeductionModalComponent,
    ActualTaxDeductionApprovalModalComponent,
    DownloadPayslipFromDateRangeComponent,
    EmployeeSalarySheetModalComponent,
    SupplementaryPaymentComponent,
    SupplementaryAmountComponent,
    AddSupplementaryAmountComponent,
    TaxDeleteModalComponent,
    // Supplementary
    SupplementaryProcessInfoComponent,
    SupplementaryPaymentProcessModalComponent,

    AllowanceHeadNameConfigComponent,
    AllowanceHeadNameConfigInsertUpdateModalComponent,

    ProjectedPaymentInsertUpdateModalComponent,
    UploadProjectedPaymentModalComponent,
    ProjectedPaymentProcessModalComponent,
    ProjectedPaymentListComponent,

    FlatAmountUploaderModalComponent,
    EmployeeCashSalaryComponent,
    AddCashSalaryHeadModalComponent,
    AddCashSalaryAmountComponent,
    CashSalaryProcessModalComponent,
    CashSalaryProcessDetailModalComponent,
    CashSalaryDisbursedModalComponent,
    ViewAndCheckCashSalaryModalComponent,
    EditCashSalaryAmountModalComponent,
    UploadCashSalaryAmountModalComponent,
    UploadCashSalaryHeadModalComponent,
    UploadSalaryReviewModalComponent,
    DownloadSalaryReviewSheetModalComponent,
    ///Wallet
    WalletPaymentComponent,
    WalletPaymentConfigurationComponent,
    AddWalletPaymentConfigModalComponent,
    EditWalletPaymentConfigModalComponent,
    UploadWalletPaymentConfigModalComponent,
    //Incentive
    QuarterlyIncentiveProcessComponent,
    QuarterlyIncentiveProcessDetailsComponent,
    QuarterlyIncentiveProcessDetailsViewOrDeleteComponent,
    QuarterlyIncentiveProcessExcelUploadComponent,
    QuarterlyIncentiveProcessReportComponent,
    QuarterlyIncentiveProcessUndoOrDisversedComponent,
    ConditionalDepositAllowanceListComponent,
    DepositPaymentComponent,
    ConditionalDepositAllowanceComponent,
    ServiceAnniversaryAllowanceListComponent,
    ServiceAnniversaryAllowanceComponent,

    TaxProcessModalComponent,
    VariableAllowanceDeleteModalComponent,
    VariableDeductionDeleteModalComponent,

    DepositPaymentHistoryComponent,
    SelfTaxReturnSubmissionModal,
    UploadEmployeeYearlyInvestmentModalComponent,
    EmployeeYearlyInvestmentModalComponent,

    SelfTaxRefundSubmissionComponent,
    SelfTaxRefundModalComponent,

    //Periodical
    PeriodicalVariableAllowanceListComponent,
    PeriodicalVariableAllowanceInsertUpdateModal,
    PeriodicalHeadInfoComponent,
    PricipleAmountModalComponent,

    SalaryReviewBulkApprovalModalComponent,
    SingelItemFileValueComponent,

    SupplementaryPaymentDisbursedModalComponent,
    UpdateApprovedVariableAllowanceComponent,
    ProjectedPaymentInsertModalComponent,
    DeletePendingProjectedAllowanceComponent,
    DeleteApprovedProjectedAllowanceComponent,

    UploadIncomeTaxChallanModalComponent,
    TaxChallaBlukInsertModalComponent,
    TaxRefundInsertUpdateModalComponent,
    TaxDocumentUploadComponent,
    DeleteTaxDocumentComponent,
    DeleteSalaryReviewModalComponent,
    TaxSettingInsertUpdateModalComponent,
    UpdateProjectedPaymentComponent,
    ApprovalProjectedPaymentComponent,
    ConditionalProjectedPaymentList,
    MonthlyAllowancetListComponent,
    FinalTaxCardProcessModalComponent,
    FinalTaxCardDetailComponent,
    UpdateSupplementaryAmountModalComponent,
    SalaryAllowanceArrearAdjustmentComponent,
    UploadSalaryAllowanceArrearAdjustmentModalComponent,
    EditSalaryAllowanceArrearAdjustmentModalComponent,
    DeleteSalaryAllowanceArrearAdjustmentModalComponent,
    AddSalaryAllowanceArrearAdjustmentModalComponent,
    ArrearAdjustmentBulkApprovalComponent,
    InsertUpdateConditionalProjectedPaymentComponent,
    ConditionalProjectedPaymentApprovalComponent,
    OnceOffPaymentEmailingComponent

  ],

  providers: [UtilityService, PayrollWebService, HrWebService, { provide: TimepickerConfig, useFactory: getTimepickerConfig }]
})
export class PayrollModule { }
