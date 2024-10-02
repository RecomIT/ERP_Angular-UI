import { CommonModule, DatePipe } from "@angular/common";
import { NgModule } from "@angular/core";
import { TimepickerConfig, TimepickerModule } from "ngx-bootstrap/timepicker";
import { getTimepickerConfig } from "src/app/shared/factory-service";
import { UtilityService } from "src/app/shared/services/utility.service";
import { LeaveModuleComponent } from "./leave-module.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BsDatepickerModule } from "ngx-bootstrap/datepicker";
import { NgSelect2Module } from "ng-select2";
import { NgxPaginationModule } from "ngx-pagination";
import { TypeaheadModule } from "ngx-bootstrap/typeahead";
import { TooltipModule } from "ngx-bootstrap/tooltip";
import { LeaveRoutingModule } from "./leave-module.routing";
import { LeaveTypeListComponent } from "./leave-type/list/leave-type-list.component";
import { LeaveTypeInsertUpdateModal } from "./leave-type/insert-update/leave-type-insert-update-modal.component";
import { LeaveSettingListComponent } from "./leave-setting/list/leave-setting-list.component";
import { LeaveSettingInsertUpdateModalComponent } from "./leave-setting/insert-update/leave-setting-insert-update-modal.component";
import { EmployeeLeaveRequestComponent } from "./employee-leave-request/list/employee-leave-request.component";
import { SelfLeaveRequestComponent } from "./self-leave-request/list/self-leave-request.component";
import { LeaveEncashmentConfigurationComponent } from "./leave-encashment-configuration/leave-encashment-configuration.component";
import { LeaveEncashmentRequestComponent } from "./leave-encashment/leave-encashment-request/leave-encashment-request.component";
import { LeaveEncashmentProcessComponent } from "./leave-encashment-process/leave-encashment-process.component";
import { SelfLeaveHistoryComponent } from "./self-leave-history/self-leave-history.component";
import { LeaveReportsComponent } from "./leave-report/leave-reports.component";
import { LeaveRequestApprovalComponent } from "./leave-request-approval/leave-request-approval.component";
import { SubordinatesLeaveApprovalComponent } from "./subordinates-leave-approval/subordinates-leave-approval.component";
import { InsertUpdateLeaveRequestModal } from "./self-leave-request/insert-update/insert-update-leave-request.component";
import { SubordinatesLeaveRequestApprovalComponent } from "./subordinates-leave-request-approval/subordinates-leave-request-approval.component";
import {  NgbPopoverModule } from "@ng-bootstrap/ng-bootstrap";
import { LeaveModuleActivityLoggerComponent } from "./leave-module-activity-logger/leave-module-activity-logger.component";
import { LeaveApprovalModalComponent } from "./subordinates-leave-request-approval/leave-approval-modal/leave-approval-modal.component";
import { CancelLeaveRequestModalComponent } from "./self-leave-request/cancel-leave-request/cancel-leave-request-modal.component";
import { CancelApprovedLeaveComponent } from "./self-leave-request/cancel-approved-leave/cancel-approved-leave.component";
import { EmployeeLeaveBalanceDashboardComponent } from './employee-leave-balance/employee-leave-balance-dashboard/employee-leave-balance-dashboard.component';
import { AddEmployeeLeaveBalanceComponent } from './employee-leave-balance/add-employee-leave-balance/add-employee-leave-balance.component';
import { LeavePaginationComponent } from './leave-pagination/leave-pagination.component';
import { AddEncashmentRequestComponent } from './leave-encashment/add-encashment-request/add-encashment-request.component';
import { InsertUpdateEmployeeLeaveRequestModal } from "./employee-leave-request/insert-update/insert-update-employee-leave-request.component";

@NgModule({
    imports:[
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        LeaveRoutingModule,
        BsDatepickerModule.forRoot(),
        NgSelect2Module,
        NgxPaginationModule,
        TimepickerModule.forRoot(),
        TypeaheadModule.forRoot(),
        TooltipModule,
        NgbPopoverModule
        
    ],
    declarations:[
        LeaveModuleComponent,
        LeaveTypeListComponent,
        LeaveTypeInsertUpdateModal,
        LeaveSettingListComponent,
        LeaveSettingInsertUpdateModalComponent,
        EmployeeLeaveRequestComponent,
        SelfLeaveRequestComponent,
        LeaveEncashmentConfigurationComponent,
        LeaveEncashmentRequestComponent,
        LeaveEncashmentProcessComponent,
        SelfLeaveHistoryComponent,
        LeaveReportsComponent,
        LeaveRequestApprovalComponent,
        SubordinatesLeaveApprovalComponent,
        InsertUpdateLeaveRequestModal,
        SubordinatesLeaveRequestApprovalComponent,
        LeaveModuleActivityLoggerComponent,
        LeaveApprovalModalComponent,
        CancelLeaveRequestModalComponent,
        CancelApprovedLeaveComponent,
        EmployeeLeaveBalanceDashboardComponent,
        AddEmployeeLeaveBalanceComponent,
        LeavePaginationComponent,
        AddEncashmentRequestComponent,
        InsertUpdateEmployeeLeaveRequestModal
    
    ],
    exports:[InsertUpdateLeaveRequestModal,SubordinatesLeaveApprovalComponent,LeaveModuleActivityLoggerComponent,LeaveApprovalModalComponent,CancelLeaveRequestModalComponent,CancelApprovedLeaveComponent],
    providers: [UtilityService, DatePipe, { provide: TimepickerConfig, useFactory: getTimepickerConfig }]
})
export class LeaveModule { }