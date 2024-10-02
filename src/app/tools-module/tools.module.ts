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
import { ToolsRoutingModule } from "./tools.routing";
import { EasyTaxComponent } from './easy-tax/easy-tax.component';
import { ToolsComponent } from "./tools.component";


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        BsDatepickerModule.forRoot(),
        ToolsRoutingModule,
        NgSelect2Module,
        NgxPaginationModule,
        TimepickerModule.forRoot(),
        TypeaheadModule.forRoot()
    ],
    declarations: [
        ToolsComponent,
        EasyTaxComponent
        // OvertimeApprovalLevelComponent,
        // OvertimeApproverAssignmentComponent,
        // OvertimeTeamApprovalMappingComponent,
        // OvertimePolicyComponent,
        // OvertimeRequestSelfComponent,
        // OvertimeRequestApproverComponent,
        // OvertimeRequestApproverActionComponent,
        // OvertimeProcessComponent,
        // OvertimeTimeCardComponent
        
  ],
    providers:[UtilityService,PayrollWebService, HrWebService,{ provide: TimepickerConfig, useFactory: getTimepickerConfig }]
})
export class ToolsModule { }