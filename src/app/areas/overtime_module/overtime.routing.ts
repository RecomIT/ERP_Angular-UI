import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { OvertimeComponent } from "./overtime.component";
import { OvertimeApprovalLevelComponent } from "./approval-level/approval-level.component";
import { OvertimeApproverAssignmentComponent } from "./approver-assignment/approver-assignment.component";
import { OvertimeTeamApprovalMappingComponent } from "./team-approval-mapping/team-approval-mapping.component";
import { OvertimePolicyComponent } from "./overtime-policy/policy.component";
import { OvertimeRequestSelfComponent } from "./overtime-request/overtime-request-self.component";
import { OvertimeRequestApproverComponent } from "./overtime-request/overtime-request-approver.component";
import { OvertimeRequestApproverActionComponent } from "./overtime-request/overtime-request-approver-action.component";
import { OvertimeProcessComponent } from "./overtime/overtime-process.component";
import { OvertimeTimeCardComponent } from "./overtime-time-card/overtime-time-card.component";
import { AuthGuard } from "src/app/shared/services/auth.guard";

const routes: Routes = [
    {
      path: '',
      component: OvertimeComponent,
      children: [
        // { path: "overtime-approval-level", component:OvertimeApprovalLevelComponent , data: { component: "OvertimeApprovalLevelComponent" }, canActivate:[AuthGuard]},
        // { path: "overtime-approver-assignment", component:OvertimeApproverAssignmentComponent, data: { component: "OvertimeApproverAssignmentComponent" } , canActivate:[AuthGuard]},
        // { path: "overtime-team-approval-mapping", component:OvertimeTeamApprovalMappingComponent, data: { component: "  " } , canActivate:[AuthGuard]},
        // { path: "overtime-policy", component:OvertimePolicyComponent , data: { component: "OvertimePolicyComponent" }, canActivate:[AuthGuard]},
        // { path: "overtime-request-self", component:OvertimeRequestSelfComponent, data: { component: "OvertimeRequestSelfComponent" } , canActivate:[AuthGuard]},
        // { path: "overtime-request-approver", component:OvertimeRequestApproverComponent, data: { component: "OvertimeRequestApproverComponent" } , canActivate:[AuthGuard]},
        // { path: "overtime-request-approver-action", component:OvertimeRequestApproverActionComponent, data: { component: "OvertimeRequestApproverActionComponent" } , canActivate:[AuthGuard]},
        // { path: "overtime-process", component:OvertimeProcessComponent, data: { component: "OvertimeProcessComponent" } , canActivate:[AuthGuard]},
        // { path: "overtime-time-card", component:OvertimeTimeCardComponent, data: { component: "OvertimeTimeCardComponent" } , canActivate:[AuthGuard]},

        { path: "overtime-approval-level", component:OvertimeApprovalLevelComponent,data:{component:'OvertimeApprovalLevelComponent'} ,  canActivate:[AuthGuard]},
        { path: "overtime-approver-assignment", component:OvertimeApproverAssignmentComponent,data:{component:'OvertimeApproverAssignmentComponent'},  canActivate:[AuthGuard]},
        { path: "overtime-team-approval-mapping", component:OvertimeTeamApprovalMappingComponent, data:{component:'OvertimeTeamApprovalMappingComponent'}, canActivate:[AuthGuard]},
        { path: "overtime-policy", component:OvertimePolicyComponent , data:{component:'OvertimePolicyComponent'}, canActivate:[AuthGuard]},
        { path: "overtime-request-self", component:OvertimeRequestSelfComponent, data:{component:'OvertimeRequestSelfComponent'},  canActivate:[AuthGuard]},
        { path: "overtime-request-approver", component:OvertimeRequestApproverComponent,data:{component:'OvertimeRequestApproverComponent'},  canActivate:[AuthGuard]},
        { path: "overtime-request-approver-action", component:OvertimeRequestApproverActionComponent, data:{component:'OvertimeRequestApproverActionComponent'}, canActivate:[AuthGuard]},
        { path: "overtime-process", component:OvertimeProcessComponent, data:{component:'OvertimeProcessComponent'}, canActivate:[AuthGuard]},
        { path: "overtime-time-card", component:OvertimeTimeCardComponent, data:{component:'OvertimeTimeCardComponent'}, canActivate:[AuthGuard]},
      ]
    },
  ];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  
  export class OvertimeRoutingModule { }