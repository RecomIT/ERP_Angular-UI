import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "src/app/shared/services/auth.guard";
import { LeaveModuleComponent } from "./leave-module.component";
import { LeaveTypeListComponent } from "./leave-type/list/leave-type-list.component";
import { LeaveSettingListComponent } from "./leave-setting/list/leave-setting-list.component";
import { EmployeeLeaveRequestComponent } from "./employee-leave-request/list/employee-leave-request.component";
import { SelfLeaveRequestComponent } from "./self-leave-request/list/self-leave-request.component";
import { LeaveEncashmentConfigurationComponent } from "./leave-encashment-configuration/leave-encashment-configuration.component";
import { LeaveEncashmentProcessComponent } from "./leave-encashment-process/leave-encashment-process.component";
import { LeaveEncashmentRequestComponent } from "./leave-encashment/leave-encashment-request/leave-encashment-request.component";
import { SelfLeaveHistoryComponent } from "./self-leave-history/self-leave-history.component";
import { LeaveReportsComponent } from "./leave-report/leave-reports.component";
import { SubordinatesLeaveApprovalComponent } from "./subordinates-leave-approval/subordinates-leave-approval.component";
import { LeaveRequestApprovalComponent } from "./leave-request-approval/leave-request-approval.component";
import { SubordinatesLeaveRequestApprovalComponent } from "./subordinates-leave-request-approval/subordinates-leave-request-approval.component";
import { EmployeeLeaveBalanceDashboardComponent } from "./employee-leave-balance/employee-leave-balance-dashboard/employee-leave-balance-dashboard.component";

const routes: Routes = [
    {
        path: "",
        component: LeaveModuleComponent,
        children:[
            { path: "leave-type-list", component: LeaveTypeListComponent, data: { component: "LeaveTypeListComponent" }, canActivate: [AuthGuard] },
            { path: "leave-setting-list", component: LeaveSettingListComponent, data: { component: "LeaveSettingListComponent" }, canActivate: [AuthGuard] },
            { path: "employee-leave-request", component: EmployeeLeaveRequestComponent, data: { component: "EmployeeLeaveRequestComponent" }, canActivate: [AuthGuard] },
            { path: "self-leave-request", component: SelfLeaveRequestComponent, data: { component: "SelfLeaveRequestComponent" }, canActivate: [AuthGuard] },
            { path: "self-leave-request", component: SelfLeaveRequestComponent, data: { component: "SelfLeaveRequestComponent" }, canActivate: [AuthGuard] },
            { path: "leave-encashment-configuration", component: LeaveEncashmentConfigurationComponent, data: { component: "LeaveEncashmentConfigurationComponent" }, canActivate: [AuthGuard] },
            { path: "leave-encashment-process", component: LeaveEncashmentProcessComponent, data: { component: "LeaveEncashmentProcessComponent" }, canActivate: [AuthGuard] },
            { path: "leave-encashment-request", component: LeaveEncashmentRequestComponent, data: { component: "LeaveEncashmentRequestComponent" }, canActivate: [AuthGuard] },
            { path: "leave-encashment-request", component: LeaveEncashmentRequestComponent, data: { component: "LeaveEncashmentRequestComponent" }, canActivate: [AuthGuard] },
            { path: "self-leave-history", component: SelfLeaveHistoryComponent, data: { component: "SelfLeaveHistoryComponent" }, canActivate: [AuthGuard] },
            { path: "leave-reports", component: LeaveReportsComponent, data: { component: "LeaveReportsComponent" }, canActivate: [AuthGuard] },
            { path: "subordinates-leave-approval", component: SubordinatesLeaveApprovalComponent, data: { component: "SubordinatesLeaveApprovalComponent" }, canActivate: [AuthGuard] },
            { path: "subordinates-leave-approval2", component: SubordinatesLeaveRequestApprovalComponent, data: { component: "SubordinatesLeaveRequestApprovalComponent" }, canActivate: [AuthGuard] },
            { path: "employee-leave-approval", component: LeaveRequestApprovalComponent, data: { component: "LeaveRequestApprovalComponent" }, canActivate: [AuthGuard] },
            { path: "employee-leave-balance", component: EmployeeLeaveBalanceDashboardComponent, data: { component: "EmployeeLeaveBalanceDashboardComponent" }, canActivate: [AuthGuard] }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LeaveRoutingModule {

}