import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgSelect2Module } from "ng-select2";
import { BsDatepickerModule } from "ngx-bootstrap/datepicker";
import { TimepickerConfig, TimepickerModule } from "ngx-bootstrap/timepicker";
import { TypeaheadModule } from "ngx-bootstrap/typeahead";
import { NgxPaginationModule } from "ngx-pagination";
import { getTimepickerConfig } from "src/app/shared/factory-service";
import { HrWebService } from "src/app/shared/services/hr-web.service";
import { PayrollWebService } from "src/app/shared/services/payroll-web.service";
import { UtilityService } from "src/app/shared/services/utility.service";
import { OvertimeComponent } from "./overtime.component";
import { OvertimeRoutingModule } from "./overtime.routing";
import { OvertimeApprovalLevelComponent } from "./approval-level/approval-level.component";
import { OvertimeApproverAssignmentComponent } from "./approver-assignment/approver-assignment.component";
import { OvertimeTeamApprovalMappingComponent } from "./team-approval-mapping/team-approval-mapping.component";
import { OvertimePolicyComponent } from "./overtime-policy/policy.component";
import { OvertimeRequestSelfComponent } from "./overtime-request/overtime-request-self.component";
import { OvertimeRequestApproverComponent } from "./overtime-request/overtime-request-approver.component";
import { OvertimeRequestApproverActionComponent } from "./overtime-request/overtime-request-approver-action.component";
import { OvertimeProcessComponent } from "./overtime/overtime-process.component";
import { OvertimeTimeCardComponent } from "./overtime-time-card/overtime-time-card.component";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        BsDatepickerModule.forRoot(),
        OvertimeRoutingModule,
        NgSelect2Module,
        NgxPaginationModule,
        TimepickerModule.forRoot(),
        TypeaheadModule.forRoot()
    ],
    declarations: [
        OvertimeComponent,
        OvertimeApprovalLevelComponent,
        OvertimeApproverAssignmentComponent,
        OvertimeTeamApprovalMappingComponent,
        OvertimePolicyComponent,
        OvertimeRequestSelfComponent,
        OvertimeRequestApproverComponent,
        OvertimeRequestApproverActionComponent,
        OvertimeProcessComponent,
        OvertimeTimeCardComponent
    ],
    providers:[UtilityService,PayrollWebService, HrWebService,{ provide: TimepickerConfig, useFactory: getTimepickerConfig }]
})
export class OvertimeModule { }