import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TimepickerConfig, TimepickerModule } from 'ngx-bootstrap/timepicker';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NgSelect2Module } from 'ng-select2';
import { NgxPaginationModule } from 'ngx-pagination';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { getTimepickerConfig } from 'src/app/shared/factory-service';
import { EmployeeModuleComponent } from './employee-module.component';
import { EmployeeRoutingModule } from './employee-module.routing';
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
import { BankInsertUpdateModalComponent } from './Account/bank/bank-insert-update-modal.component';
import { BankBranchInsertUpdateModalComponent } from './Account/bank-branch/bank-branch-insert-update-modal.component';
import { ApprovalDiscontinuedEmployeeModalComponent } from './Discontinued-Employee/approval/approval-discontinued-employee.component';
import { DiscontinuedEmployeeInsertUpdateModalComponent } from './Discontinued-Employee/insert-update/insert-update-discontinued-employee.component';
import { CostCenterInsertUpdateModalComponent } from './Organizational/costcenter/costcenter-insert-update-modal.component';
import { DepartmentInsertUpdateModalComponent } from './Organizational/department/department-insert-update-modal.component';
import { DesignationInsertUpdateModalComponent } from './Organizational/designation/designation-insert-update-modal.component';
import { GradeInsertUpdateModalComponent } from './Organizational/grade/grade-insert-update-modal.component';
import { SectionInsertUpdateModalComponent } from './Organizational/section/section-insert-update-modal.component';
import { SubSectionInsertUpdateModalComponent } from './Organizational/subsection/subsection-insert-update-modal.component';
import { UploadEmployeeInfoExtensionModalComponent } from './employee/info/upload/upload-employee-info-extension-modal.component';
import { EmployeeInfoExtensionComponent } from './employee/info/list/employee-info-extension.component';
import { EmployeeEntryComponent } from './employee/info/insert-update/employee-entry.component';
import { EmployeeDetailListComponent } from './employee/detail/list/employee-detail-list.component';
import { EmployeeProfessionalListComponent } from './employee/professional/list/employee-professional-list.component';
import { EmployeeEducationListComponent } from './employee/education/list/employee-education-list.component';
import { EmployeeSkillListComponent } from './employee/skill/list/employee-skill-list.component';
import { EmployeeDocumentListComponent } from './employee/document/list/employee-document-list.component';
import { EmployeeDocumentInsertUpdateModalComponent } from './employee/document/insert-update/employee-document-insert-update-modal.component';
import { EmployeePersonalInsertUpdateModalComponent } from './employee/personal/insert-update/personal-insert-update-modal.component';
import { EmployeeExperienceInsertUpdateModalComponent } from './employee/experience/insert-update/employee-experience-insert-update-modal.component';
import { EmployeeEducationInsertUpdateModalComponent } from './employee/education/insert-update/employee-education-insert-update-modal.component';
import { EmployeeSkillInsertUpdateModalComponent } from './employee/skill/insert-update/employee-skill-insert-update-modal.component';
import { EmployeePersonalListComponent } from './employee/personal/list/employee-personal-list.component';
import { EmployeeExperienceListComponent } from './employee/experience/list/employee-experience-list.component';
import { PersonalDocumentComponent } from './employee/document/profile/personal-document.component';
import { PersonalEducationComponent } from './employee/education/profile/personal-education.component';
import { PersonalExperienceComponent } from './employee/experience/profile/personal-experience.component';
import { EmployeeProfileComponent } from './employee/profile/employee-profile.component';
import { PersonalInfoComponent } from './employee/personal/profile/personal-info.component';
import { PersonalSkillComponent } from './employee/skill/profile/personal-skill.component';
import { ProfileImageComponent } from './employee/profile-image/profile-image.component';
import { UploadProfileImageComponent } from './employee/profile-image/upload-profile-image/upload-profile-image.component';
import { EmployeeConfirmationProposalComponent } from './employee/confirmation/list/employee-confirmation-proposal.component';
import { EmployeeConfirmationModalComponent } from './employee/confirmation/insert-update/employee-confirmation-modal.component';
import { EmploymentConfirmationApprovalModalComponent } from './employee/confirmation/approval/employment-confirmation-approval-modal.component';
import { EmployeePromotionProposalListComponent } from './employee/promotion/list/employee-promotion-proposal-list.component';
import { EmployeePromotionInsertUpdateModalComponent } from './employee/promotion/insert-update/employee-promotion-insert-update.component';
import { EmployeeAccountInsertUpdateModal } from './Account/employee-account/insert-update/insert-update-employee-account.component';
import { EmployeeAccountApprovalModalComponent } from './Account/employee-account/approval/employee-account-approval.component';
import { EmployeePfActivationComponent } from './employee/employee-pf-activation/list/employee-pf-activation.component';
import { AddEmployeePfActivationModalComponent } from './employee/employee-pf-activation/insert-update/add-employee-pf-activation-modal.component';
import { UploadEmployeePfActivationModalComponent } from './employee/employee-pf-activation/upload/upload-employee-pf-activation-modal.component';
import { ApprovalEmployeePfActivationModalComponent } from './employee/employee-pf-activation/approval/approval-employee-pf-activation-modal.component';
import { EmployeeTransferEntryComponent } from './employee/transfer/insert-update/employee-transfer-entry.component';
import { EmployeeTransferComponent } from './employee/transfer/list/employee-transfer.component';
import { EmployeeJobLifecycleComponent } from './employee/job-life-cycle/employee-job-lifecycle.component';
import { ContractualEmployeeComponentList } from './employee/contractual-employee/list/contractual-employee-list.component';
import { InsertUpdateContractualEmployeeComponent } from './employee/contractual-employee/insert-update/insert-update-contractual-employee.component';
import { UploadContractInfoModalComponent } from './employee/contractual-employee/contractual-upload/upload-contract-info-modal.component';
import { ContractualEmployeeApprovalModalComponent } from './employee/contractual-employee/approval/contractual-employee-approval-modal.component';
import { UploadAccountInfoModalComponent } from './Account/employee-account/upload/upload-account-info-modal.component';
import { UploadEmployeePromotionProposalModalComponent } from './employee/promotion/upload/upload-employee-promotion-proposal-modal.component';
import { UploadEmployeeTransferProposalModalComponent } from './employee/transfer/upload/upload-employee-transfer-proposal-modal.component';
import { InternalDesignationComponent } from './Organizational/internal-designation/list/internal-designation.component';
import { InsertUpdateInternalDesignationComponent } from './Organizational/internal-designation/insert-update/insert-update-internal-designation.component';
import { UploadInternalDesignationModalComponent } from './Organizational/internal-designation/upload/upload-internal-designation.component';
import { EmployeeHierarchyComponent } from './employee/hierarchy/list/employee-hierarchy.component';
import { AddEmployeeHierarchyComponent } from './employee/hierarchy/insert-update/add-employee-hierarchy.component';
import { LocationalComponent } from './Location/locational.component';
import { MiscellaneousComponent } from './miscellaneous/miscellaneous.component';
import { EmailSendingConfigurationModalComponent } from './employee/email-config/email-sending-configuration-modal/email-sending-configuration-modal.component';
import { EmployeeProbationaryExtensionProposalComponent } from './employee/probationary/list/employee-probation-extension-proposal.component';
import { EmployeeProbationaryModalComponent } from './employee/probationary/insert-update/employee-probationary-modal.component';
import { EmploymentProbationaryApprovalModalComponent } from './employee/probationary/approval/employment-probationary-approval-modal.component';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { HrReportComponent } from './hr-report/hr-report.component';
import { MyHierarchyInfoComponent } from './employee/hierarchy/profile/my-hierarchy-info.component';
import { TrainingApprovalComponent } from './employee/training/supervisor/training-approval/training-approval.component';
import { EnrollTrainingComponent } from './employee/training/user/enroll-training/enroll-training.component';
import { TrainingRequestComponent } from './employee/training/user/training-request/training-request.component';
import { UndoDiscontinuedEmployeeModalComponent } from './Discontinued-Employee/undo/undo-discontinued-employee.component';
import { EmployeeLogComponent } from './employee/employee-log/employee-log.component';
import { DownloadEmployeeInfoModalComponent } from './employee/info/download/download-employee-info-modal.component';
import { EmployeePromotionDeleteModalComponent } from './employee/promotion/delete-proposal/employee-promotion-delete-modal.component';
import { HRLetterComponent } from './reports/HR-Letter/hr-letters.component';
import { EmployeePromotionApprovalModalComponent } from './employee/promotion/approval/employee-promotion-approval-modal.component';




@NgModule({
    imports: [
        CommonModule,
        EmployeeRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        BsDatepickerModule.forRoot(),
        NgSelect2Module,
        NgxPaginationModule,
        TimepickerModule.forRoot(),
        TypeaheadModule.forRoot(),
        TooltipModule,
        NgbDatepickerModule 
    ],
    declarations: [
        EmployeeModuleComponent, // Parent Component
        GradeComponent,
        GradeInsertUpdateModalComponent,
        DesignationComponent,
        DesignationInsertUpdateModalComponent,
        DepartmentComponent,
        DepartmentInsertUpdateModalComponent,
        SectionComponent,
        SectionInsertUpdateModalComponent,
        SubSectionComponent,
        SubSectionInsertUpdateModalComponent,
        BankComponent,
        BankInsertUpdateModalComponent,
        BankBranchComponent,
        BankBranchInsertUpdateModalComponent,
        EmployeeSalaryAccountComponent,
        CostCenterComponent,
        CostCenterInsertUpdateModalComponent,
        DiscontinuedEmployeeComponent,
        ApprovalDiscontinuedEmployeeModalComponent,
        DiscontinuedEmployeeInsertUpdateModalComponent,
        UndoDiscontinuedEmployeeModalComponent,
        UploadEmployeeInfoExtensionModalComponent,

        EmployeeInfoExtensionComponent,
        EmployeeEntryComponent,

        EmployeeDetailListComponent,

        EmployeeProfessionalListComponent,

        EmployeePersonalListComponent,
        PersonalInfoComponent,
        EmployeePersonalInsertUpdateModalComponent,

        EmployeeExperienceListComponent,
        PersonalExperienceComponent,
        EmployeeExperienceInsertUpdateModalComponent,

        EmployeeEducationListComponent,
        PersonalEducationComponent,
        EmployeeEducationInsertUpdateModalComponent,

        EmployeeSkillListComponent,
        PersonalSkillComponent,
        EmployeeSkillInsertUpdateModalComponent,

        EmployeeDocumentListComponent,
        PersonalDocumentComponent,
        EmployeeDocumentInsertUpdateModalComponent,

        EmployeeProfileComponent,

        ProfileImageComponent,
        UploadProfileImageComponent,

        EmployeeConfirmationProposalComponent,
        EmployeeConfirmationModalComponent,
        EmploymentConfirmationApprovalModalComponent,

        EmployeePromotionProposalListComponent,
        EmployeePromotionInsertUpdateModalComponent,

        EmployeeAccountInsertUpdateModal,
        EmployeeAccountApprovalModalComponent,

        EmployeePfActivationComponent,
        AddEmployeePfActivationModalComponent,
        UploadEmployeePfActivationModalComponent,
        ApprovalEmployeePfActivationModalComponent,

        EmployeeTransferComponent,
        EmployeeTransferEntryComponent,

        EmployeeJobLifecycleComponent,
        ContractualEmployeeComponentList,
        InsertUpdateContractualEmployeeComponent,
        UploadContractInfoModalComponent,
        ContractualEmployeeApprovalModalComponent,
        UploadAccountInfoModalComponent,
        UploadEmployeePromotionProposalModalComponent,
        UploadEmployeeTransferProposalModalComponent,
        InternalDesignationComponent,
        InsertUpdateInternalDesignationComponent,
        UploadInternalDesignationModalComponent,
        EmployeeHierarchyComponent,
        AddEmployeeHierarchyComponent,
        LocationalComponent,
        MiscellaneousComponent,
        EmailSendingConfigurationModalComponent,
        EmployeeProbationaryExtensionProposalComponent,
        EmployeeProbationaryModalComponent,
        EmploymentProbationaryApprovalModalComponent,
        HrReportComponent,
        MyHierarchyInfoComponent,

        TrainingApprovalComponent,
        EnrollTrainingComponent,
        TrainingRequestComponent,

        EmployeeLogComponent,
        DownloadEmployeeInfoModalComponent,

        EmployeePromotionDeleteModalComponent,
        HRLetterComponent,
        EmployeePromotionApprovalModalComponent
    ],
    providers: [UtilityService, DatePipe, { provide: TimepickerConfig, useFactory: getTimepickerConfig }]
})

export class EmployeeModule { }
