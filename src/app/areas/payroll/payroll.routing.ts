import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllowanceConfigurationComponent } from './salary-module/allowance/allowance-configuration/list/allowance-configuration.component';
import { DeductionConfigurationComponent } from './salary-module/deduction/deduction-configuration/deduction-configuration.component';
import { VariableAllowanceComponent } from './salary-module/variable/variable-allowance/variable-allowance.component';
import { PayrollComponent } from './payroll.component';
import { SalaryAllowanceConfigComponent } from './salary-module/allowance/salary-allowance-config/salary-allowance-config.component';
import { SalaryReviewComponent } from './salary-module/salary/salary-review/list/salary-review.component';
import { SetupComponent } from './salary-module/setup/fiscalYear/setup.component';
import { AuthGuard } from 'src/app/shared/services/auth.guard';
import { VariableDeductionComponent } from './salary-module/variable/variable-deduction/variable-deduction.component';
import { UploadSalaryComponentComponent } from './salary-module/salary/upload-salary-component/upload-salary-component.component';
import { SalaryProcessComponent } from './salary-module/salary/salary-process/salary-process.component';
import { SalaryReportsComponent } from './salary-module/salary/salary-reports/salary-reports.component';
import { EmployeePayslipComponent } from './salary-module/employee-payslip/employee-payslip.component';
import { SalaryProcessExtensionComponent } from './salary-module/salary/salary-process-extension/salary-process-extension.component';
import { IncomeTaxSlabComponent } from './tax-module/income-tax-slab/list/income-tax-slab.component';
import { IncomeTaxSettingComponent } from './tax-module/income-tax-setting/list/income-tax-setting.component';
import { BonusConfigComponent } from './salary-module/bonus/bonus-config/bonus-config.component';
import { IncomeTaxProcessComponent } from './tax-module/income-tax-process/income-tax-process.component';
import { ExternalReportComponent } from './salary-module/salary/external-reports/external-report.component';
import { EmployeeIncomeTaxZoneComponent } from './tax-module/employee-income-tax-zone/employee-income-tax-zone.component';
import { BonusConfigExtensionComponent } from './salary-module/bonus/bonus-config-extension/bonus-config-extension.component';
import { BonusProcessComponent } from './salary-module/bonus/bonus-process/bonus-process.component';
import { TaxCardComponent } from './tax-module/tax-card/tax-card.component';
import { ExployeeTaxCardComponent } from './tax-module/employee-tax-card/employee-tax-card.component';
import { SalaryProcessExtensionExtraComponent } from './salary-module/salary/salary-process-extension-extra/list/salary-process-extension-extra.component';
import { SelfYearlyInvestmentComponent } from './tax-module/self-yearly-investment/self-yearly-investment.component';
import { SelfTaxReturnSubmissionComponent } from './tax-module/self-tax-return-submission/self-tax-return-submission.component';
import { SelfAITSubmissionComponent } from './tax-module/self-ait-submission/self-ait-tax-submission.component';
import { EmployeeTaxReturnSubmissionComponent } from './tax-module/employee-tax-return-submission/employee-tax-return-submission.component';
import { EmployeeSalaryHoldComponent } from './salary-module/salary/employee-salary-hold/list/employee-salary-hold.component';
import { ActualTaxDeductionComponent } from './tax-module/actual-tax-deduction/actual-tax-deduction.component';
import { SupplementaryPaymentComponent } from './salary-module/payment/supplementary/supplementary-payment/supplementary-payment.component';
import { AllowanceHeadComponent } from './salary-module/allowance/allowance-head/list/allowance-head.component';
import { DeductionHeadComponent } from './salary-module/deduction/deduction-head/deduction-head.component';
import { SalaryAllowanceConfigExtensionComponent } from './salary-module/allowance/salary-allowance-config-extension/salary-allowance-config-extension.component';
import { AllowanceHeadNameConfigComponent } from './salary-module/allowance/allowance-head-name-config/allowance-head-name-config.component';
import { ProjectedPaymentListComponent } from './salary-module/payment/projected-payment/list/projected-payment-list.component';
import { EmployeeCashSalaryComponent } from './salary-module/cash-salary/cash-salary-list/employee-cash-salary.component';
import { WalletPaymentComponent } from './salary-module/wallet-payment/wallet-payment.component';
import { QuarterlyIncentiveProcessComponent } from './salary-module/incentive/quarterly-incentive-process/quarterly-incentive-process.component';
import { ConditionalDepositAllowanceListComponent } from './salary-module/payment/conditional-deposit-allowance/list/conditional-deposit-allowance-list.component';
import { ServiceAnniversaryAllowanceListComponent } from './salary-module/payment/service-anniversary-allowance/list/service-anniversary-allowance-list.component';
import { EmployeeYearlyInvestmentComponent } from './tax-module/employee-yearly-investment/list/employee-yearly-investment.component';
import { SelfTaxRefundSubmissionComponent } from './tax-module/self-tax-refund-submission/self-tax-refund-submission.component';
import { PeriodicalVariableAllowanceListComponent } from './salary-module/periodical-variable/periodical-allowance/list/periodical-variable-allowance-list.component';
import { EmployeeIncomeTaxDocumentSubmissionComponent } from './tax-module/employee-income-tax-document-submission/list/employee-income-tax-document-submission.component';
import { ConditionalProjectedPaymentList } from './salary-module/payment/conditional-projected-payment/list/conditional-projected-payment-list.component';
import { MonthlyAllowancetListComponent } from './salary-module/payment/monthly-allowance/list/monthly-allowance-list.component';
import { SalaryAllowanceArrearAdjustmentComponent } from './salary-module/salary/salary-allowance-arrear-adjustment/list/salary-allowance-arrear-adjustment.component';


const routes: Routes = [
  {
    path: "",
    component: PayrollComponent,
    pathMatch: 'prefix',
    children: [
      { path: "payroll-setup", component: SetupComponent, data: { component: "SetupComponent" }, canActivate: [AuthGuard] },
      { path: "allowance-head", component: AllowanceHeadComponent, data: { component: "AllowanceHeadComponent" }, canActivate: [AuthGuard] },
      { path: "deduction-head", component: DeductionHeadComponent, data: { component: "DeductionHeadComponent" }, canActivate: [AuthGuard] },
      { path: "salary-allowance-config", component: SalaryAllowanceConfigComponent, data: { component: "SalaryAllowanceConfigComponent" }, canActivate: [AuthGuard] },
      { path: "salary-review", component: SalaryReviewComponent, data: { component: "SalaryReviewComponent" }, canActivate: [AuthGuard] },
      { path: "allowance-config", component: AllowanceConfigurationComponent, data: { component: "AllowanceConfigurationComponent" }, canActivate: [AuthGuard] },
      { path: "deduction-config", component: DeductionConfigurationComponent, data: { component: "DeductionConfigurationComponent" }, canActivate: [AuthGuard] },
      { path: "variable-allowance", component: VariableAllowanceComponent, data: { component: "VariableAllowanceComponent" }, canActivate: [AuthGuard] },
      { path: "variable-deduction", component: VariableDeductionComponent, data: { component: "VariableDeductionComponent" }, canActivate: [AuthGuard] },
      { path: "upload-salary-component", component: UploadSalaryComponentComponent, data: { component: "UploadSalaryComponentComponent" }, canActivate: [AuthGuard] },
      { path: "salary-process", component: SalaryProcessComponent, data: { component: "SalaryProcessComponent" }, canActivate: [AuthGuard] },
      { path: "salary-reports", component: SalaryReportsComponent, data: { component: "SalaryReportsComponent" }, canActivate: [AuthGuard] },
      { path: "employee-payslip", component: EmployeePayslipComponent, data: { component: "EmployeePayslipComponent" }, canActivate: [AuthGuard] },
      { path: "salary-process-extension", component: SalaryProcessExtensionComponent, data: { component: "EmployeePayslipComponent" }, canActivate: [AuthGuard] },
      { path: "income-tax-slab", component: IncomeTaxSlabComponent, data: { component: "IncomeTaxSlabComponent" }, canActivate: [AuthGuard] },
      { path: "income-tax-setting", component: IncomeTaxSettingComponent, data: { component: "IncomeTaxSettingComponent" }, canActivate: [AuthGuard] },
      { path: "bonus-config", component: BonusConfigComponent, data: { component: "BonusConfigComponent" }, canActivate: [AuthGuard] },
      { path: "income-tax-process", component: IncomeTaxProcessComponent, data: { component: "IncomeTaxProcessComponent" }, canActivate: [AuthGuard] },
      { path: "external-source-report", component: ExternalReportComponent, data: { component: "ExternalReportComponent" }, canActivate: [AuthGuard] },
      { path: "employee-taxzone", component: EmployeeIncomeTaxZoneComponent, data: { component: "EmployeeIncomeTaxZoneComponent" }, canActivate: [AuthGuard] },
      { path: "bonus-config-extension", component: BonusConfigExtensionComponent, data: { component: "BonusConfigExtensionComponent" }, canActivate: [AuthGuard] },
      { path: "bonus-process", component: BonusProcessComponent, data: { component: "BonusProcessComponent" }, canActivate: [AuthGuard] },
      { path: "tax-card", component: TaxCardComponent, data: { component: "TaxCardComponent" }, canActivate: [AuthGuard] },
      { path: "employee-tax-card", component: ExployeeTaxCardComponent, data: { component: "ExployeeTaxCardComponent" }, canActivate: [AuthGuard] },
      { path: "salary-process-extra", component: SalaryProcessExtensionExtraComponent, data: { component: "SalaryProcessExtensionExtraComponent" }, canActivate: [AuthGuard] },
      { path: "tax-document-submission", component: EmployeeIncomeTaxDocumentSubmissionComponent, data: { component: "EmployeeIncomeTaxDocumentSubmissionComponent" }, canActivate: [AuthGuard] },
      { path: "self-yearly-investment", component: SelfYearlyInvestmentComponent, data: { component: "SelfYearlyInvestmentComponent" }, canActivate: [AuthGuard] },
      { path: "self-ait-submission", component: SelfAITSubmissionComponent, data: { component: "SelfAITSubmissionComponent" }, canActivate: [AuthGuard] },
      { path: "self-tax-return-submission", component: SelfTaxReturnSubmissionComponent, data: { component: "SelfTaxReturnSubmissionComponent" }, canActivate: [AuthGuard] },
      { path: "self-tax-refund-submission", component: SelfTaxRefundSubmissionComponent, data: { component: "SelfTaxRefundSubmissionComponent" }, canActivate: [AuthGuard] },
      { path: "employee-tax-return-submission", component: EmployeeTaxReturnSubmissionComponent, data: { component: "EmployeeTaxReturnSubmissionComponent" }, canActivate: [AuthGuard] },
      { path: "employee-yearly-investment", component: EmployeeYearlyInvestmentComponent, data: { component: "EmployeeYearlyInvestmentComponent" }, canActivate: [AuthGuard] },
      { path: "salary-allowance-config-extension", component: SalaryAllowanceConfigExtensionComponent, data: { component: "SalaryAllowanceConfigExtensionComponent" }, canActivate: [AuthGuard] },
      { path: "employee-salary-hold", component: EmployeeSalaryHoldComponent, data: { component: "EmployeeSalaryHoldComponent" }, canActivate: [AuthGuard] },
      { path: "actual-tax-deduction", component: ActualTaxDeductionComponent, data: { component: "ActualTaxDeductionComponent" }, canActivate: [AuthGuard] },
      { path: "supplementary-payment", component: SupplementaryPaymentComponent, data: { component: "SupplementaryPaymentComponent" }, canActivate: [AuthGuard] },
      { path: "allowance-head-name-config", component: AllowanceHeadNameConfigComponent, data: { component: "AllowanceHeadNameConfigComponent" }, canActivate: [AuthGuard] },
      { path: "projected-payment", component: ProjectedPaymentListComponent, data: { component: "ProjectedPaymentListComponent" }, canActivate: [AuthGuard] },
      { path: "cash-salary", component: EmployeeCashSalaryComponent, data: { component: "EmployeeCashSalaryComponent" }, canActivate: [AuthGuard] },
      { path: "wallet-payment", component: WalletPaymentComponent, data: { component: "WalletPaymentComponent" }, canActivate: [AuthGuard] },
      { path: "quarterly-incentive-process", component: QuarterlyIncentiveProcessComponent, data: { component: "QuarterlyIncentiveProcessComponent" }, canActivate: [AuthGuard] },
      { path: "accrued-deposit-allowance", component: ConditionalDepositAllowanceListComponent, data: { component: "ConditionalDepositAllowanceListComponent" }, canActivate: [AuthGuard] },
      { path: "yearly-service-allowance", component: ServiceAnniversaryAllowanceListComponent, data: { component: "ServiceAnniversaryAllowanceListComponent" }, canActivate: [AuthGuard] },
      { path: "periodical-allowance", component: PeriodicalVariableAllowanceListComponent, data: { component: "PeriodicalVariableAllowanceListComponent" }, canActivate: [AuthGuard] },
      { path: 'conditional-projected-payment', component: ConditionalProjectedPaymentList, data: { component: "ConditionalProjectedPaymentList" }, canActivate: [AuthGuard] },
      { path: 'monthly-allowance-config', component: MonthlyAllowancetListComponent, data: { component: "MonthlyAllowancetListComponent" }, canActivate: [AuthGuard] },
      { path: 'allowance-arrear-adjustment', component: SalaryAllowanceArrearAdjustmentComponent, data: { component: "SalaryAllowanceArrearAdjustmentComponent" }, canActivate: [AuthGuard] }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class PayrollRoutingModule { }