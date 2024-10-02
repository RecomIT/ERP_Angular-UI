import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeModuleComponent } from './employee-module.component';
import { GradeComponent } from './Organizational/grade/grade.component';
import { DesignationComponent } from './Organizational/designation/designation.component';
import { DepartmentComponent } from './Organizational/department/department.component';
import { SectionComponent } from './Organizational/section/section.component';
import { SubSectionComponent } from './Organizational/subsection/subsection.component';
import { BankComponent } from './Account/bank/bank.component';
import { BankBranchComponent } from './Account/bank-branch/bank-branch.component';
import { EmployeeSalaryAccountComponent } from './Account/employee-account/list/employee-account.component';
import { DiscontinuedEmployeeComponent } from './Discontinued-Employee/list/discontinued-employee.component';
import { CostCenterComponent } from './Organizational/costcenter/costcenter.component';
import { AuthGuard } from 'src/app/shared/services/auth.guard';
import { EmployeeInfoExtensionComponent } from './employee/info/list/employee-info-extension.component';
import { EmployeeConfirmationProposalComponent } from './employee/confirmation/list/employee-confirmation-proposal.component';
import { EmployeePromotionProposalListComponent } from './employee/promotion/list/employee-promotion-proposal-list.component';
import { EmployeePfActivationComponent } from './employee/employee-pf-activation/list/employee-pf-activation.component';
import { EmployeeTransferComponent } from './employee/transfer/list/employee-transfer.component';
import { ContractualEmployeeComponentList } from './employee/contractual-employee/list/contractual-employee-list.component';
import { InternalDesignationComponent } from './Organizational/internal-designation/list/internal-designation.component';
import { EmployeeHierarchyComponent } from './employee/hierarchy/list/employee-hierarchy.component';
import { EmailSendingConfigurationModalComponent } from './employee/email-config/email-sending-configuration-modal/email-sending-configuration-modal.component';
import { EmployeeProbationaryExtensionProposalComponent } from './employee/probationary/list/employee-probation-extension-proposal.component';
import { EmployeeProfileComponent } from './employee/profile/employee-profile.component';
import { HrReportComponent } from './hr-report/hr-report.component';
import { LocationalComponent } from './Location/locational.component';
import { TrainingRequestComponent } from './employee/training/user/training-request/training-request.component';
import { TrainingApprovalComponent } from './employee/training/supervisor/training-approval/training-approval.component';
import { EmployeeLogComponent } from './employee/employee-log/employee-log.component';
import { HRLetterComponent } from './reports/HR-Letter/hr-letters.component';

const routes: Routes = [
    {
        path: "",
        component: EmployeeModuleComponent,
        children: [
            { path: "grade", component: GradeComponent, data: { component: "GradeComponent" }, canActivate: [AuthGuard] },
            { path: "designation", component: DesignationComponent, data: { component: "DesignationComponent" }, canActivate: [AuthGuard] },
            { path: "internal-designation", component: InternalDesignationComponent, data: { component: "DesignationComponent" }, canActivate: [AuthGuard] },
            { path: "department", component: DepartmentComponent, data: { component: "DepartmentComponent" }, canActivate: [AuthGuard] },
            { path: "section", component: SectionComponent, data: { component: "SectionComponent" }, canActivate: [AuthGuard] },
            { path: "sub-section", component: SubSectionComponent, data: { component: "SubSectionComponent" }, canActivate: [AuthGuard] },
            { path: "banks", component: BankComponent, data: { component: "BankComponent" }, canActivate: [AuthGuard] },
            { path: "bank-branches", component: BankBranchComponent, data: { component: "BankBranchComponent" }, canActivate: [AuthGuard] },
            { path: "emplyee-salary-account", component: EmployeeSalaryAccountComponent, data: { component: "EmployeeSalaryAccountComponent" }, canActivate: [AuthGuard] },
            { path: "discontinued-employee", component: DiscontinuedEmployeeComponent, data: { component: "DiscontinuedEmployeeComponent" }, canActivate: [AuthGuard] },
            { path: "cost-center", component: CostCenterComponent, data: { component: "CostCenterComponent" }, canActivate: [AuthGuard] },
            { path: "employee-info", component: EmployeeInfoExtensionComponent, data: { component: "EmployeeInfoExtensionComponent" }, canActivate: [AuthGuard] },
            { path: "confirmation-proposal", component: EmployeeConfirmationProposalComponent, data: { component: "EmployeeConfirmationProposalComponent" }, canActivate: [AuthGuard] },
            { path: "promotion-proposal", component: EmployeePromotionProposalListComponent, data: { component: "EmployeePromotionProposalListComponent" }, canActivate: [AuthGuard] },
            { path: "employee-pf-activation", component: EmployeePfActivationComponent, data: { component: "EmployeePfActivationComponent" }, canActivate: [AuthGuard] },
            { path: "transfer-proposal", component: EmployeeTransferComponent, data: { component: "EmployeeTransferComponent" }, canActivate: [AuthGuard] },
            { path: "contractual-employees", component: ContractualEmployeeComponentList, data: { component: "ContractualEmployeeComponentList" }, canActivate: [AuthGuard] },
            { path: "employee-hierarchy", component: EmployeeHierarchyComponent, data: { component: "EmployeeHierarchyComponent" }, canActivate: [AuthGuard] },
            { path: "email-config", component: EmailSendingConfigurationModalComponent, data: { component: "EmailSendingConfigurationModalComponent" }, canActivate: [AuthGuard] },
            { path: "employee-probationary-proposal", component: EmployeeProbationaryExtensionProposalComponent, data: { component: "EmployeeProbationaryExtensionProposalComponent" }, canActivate: [AuthGuard] },
            { path: "employee-profile", component: EmployeeProfileComponent, canActivate: [AuthGuard] },
            { path: "hr-report", component: HrReportComponent, canActivate: [AuthGuard] },
            { path: "locational", component: LocationalComponent, canActivate: [AuthGuard] },
            { path: "training-request", component: TrainingRequestComponent, data: { component: "TrainingRequestComponent" }, canActivate: [AuthGuard] },
            { path: "training-approval", component: TrainingApprovalComponent, data: { component: "TrainingApprovalComponent" }, canActivate: [AuthGuard] },
            { path: "employee-log", component: EmployeeLogComponent, data: { component: "EmployeeLogComponent" }, canActivate: [AuthGuard] },
            { path: "hr-letter", component: HRLetterComponent, data: { component: "HRLetterComponent" }, canActivate: [AuthGuard] },

        ]
    }
];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class EmployeeRoutingModule { }