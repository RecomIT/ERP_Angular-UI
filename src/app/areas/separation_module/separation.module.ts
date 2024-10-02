import { CommonModule, DatePipe } from "@angular/common";
import { TimepickerConfig, TimepickerModule } from "ngx-bootstrap/timepicker";
import { getTimepickerConfig } from "src/app/shared/factory-service";
import { UtilityService } from "src/app/shared/services/utility.service";
import { SeparationRoutingModule } from "./separation-module.routing";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgModule } from "@angular/core";
import { BsDatepickerModule } from "ngx-bootstrap/datepicker";
import { NgSelect2Module } from "ng-select2";
import { NgxPaginationModule } from "ngx-pagination";
import { TypeaheadModule } from "ngx-bootstrap/typeahead";
import { TooltipModule } from "ngx-bootstrap/tooltip";
import { SeparationModuleComponent } from "./separation-module.component";



import { MatSelectModule } from '@angular/material/select';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CancelResignationRequestComponent } from "./user/cancel-resignation-request/cancel-resignation-request.component";
import { ResignationRequestComponent } from "./user/resignation-request/resignation-request.component";
import { ResignationRequestListComponent } from "./user/resignation-request-list/resignation-request-list.component";

import { EditInterviewDateComponent } from "./admin/edit-interview-date/edit-interview-date.component";
import { EditLastWorkingDateComponent } from "./admin/edit-last-working-date/edit-last-working-date.component";
import { EmployeeResignationDetailsComponent } from "./admin/employee-resignation-details/employee-resignation-details.component";

import { EmployeeJobLifeCycleComponent } from "./employee-information/employee-job-life-cycle/employee-job-life-cycle.component";
import { ApproveResignationByAdminComponent } from './admin/approve-resignation-by-admin/approve-resignation-by-admin.component';
import { AddEmployeeResignationRequestComponent } from "./supervisor/add-employee-resignation-request/add-employee-resignation-request.component";
import { ApproveResignationRequestForSupervisorComponent } from "./supervisor/approve-resignation-request-for-supervisor/approve-resignation-request-for-supervisor.component";
import { EditInterviewDateBySupervisorComponent } from "./supervisor/edit-interview-date-by-supervisor/edit-interview-date-by-supervisor.component";
import { EmployeeResignationRequestComponent } from "./supervisor/employee-resignation-request/employee-resignation-request.component";
import { EmployeeResignationRequestListComponent } from "./supervisor/employee-resignation-request-list/employee-resignation-request-list.component";
import { RejectResignationRequestForSupervisorComponent } from "./supervisor/reject-resignation-request-for-supervisor/reject-resignation-request-for-supervisor.component";
import { EmployeeInfoModalComponent } from './employee-information/employee-info-modal/employee-info-modal.component';
import { RejectResignationRequestComponent } from './admin/reject-resignation-request/reject-resignation-request.component';
import { EmployeeSettlementSetupComponent } from "./settlement-setup/employee-settlement-setup/employee-settlement-setup.component";
import { AddSettlementSetupComponent } from "./settlement-setup/add-settlement-setup/add-settlement-setup.component";
import { EmployeeSettlementSetupPendingListComponent } from "./settlement-setup/employee-settlement-setup-pending-list/employee-settlement-setup-pending-list.component";
import { EmployeeSettlementSetupListComponent } from './settlement-setup/employee-settlement-setup-list/employee-settlement-setup-list.component';
import { MatExpansionModule } from "@angular/material/expansion";
import { MatChipsModule } from "@angular/material/chips";
import { ResignationRequestGuideLinesComponent } from "./user/resignation-request-guide-lines/resignation-request-guide-lines.component";
import { AddResignationRequestComponent } from "./user/add-resignation-request/add-resignation-request.component";
import { UpdateResignationRequestComponent } from "./user/update-resignation-request/update-resignation-request.component";

@NgModule({
    imports: [
        CommonModule,
        SeparationRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        BsDatepickerModule.forRoot(),
        NgSelect2Module,
        NgxPaginationModule,
        TimepickerModule.forRoot(),
        TypeaheadModule.forRoot(),
        TooltipModule,
        MatExpansionModule,
        
        MatChipsModule,
        MatSelectModule,
        MatNativeDateModule,
        MatButtonModule,
        MatCardModule,


    ],
    declarations: [
       SeparationModuleComponent,
       
       CancelResignationRequestComponent,
       ResignationRequestComponent,
       ResignationRequestListComponent,
       




       EditInterviewDateComponent,
       EditLastWorkingDateComponent,
       EmployeeResignationDetailsComponent,

       EmployeeJobLifeCycleComponent,
       ApproveResignationByAdminComponent,



       AddEmployeeResignationRequestComponent,
       ApproveResignationRequestForSupervisorComponent,
       EditInterviewDateBySupervisorComponent,
       EmployeeResignationRequestComponent,
       EmployeeResignationRequestListComponent,
       RejectResignationRequestForSupervisorComponent,
       EmployeeInfoModalComponent,
       
       RejectResignationRequestComponent,


       EmployeeSettlementSetupComponent,
       AddSettlementSetupComponent,
       EmployeeSettlementSetupPendingListComponent,
       EmployeeSettlementSetupListComponent,

       AddResignationRequestComponent,
       ResignationRequestGuideLinesComponent,
       UpdateResignationRequestComponent


    ],
    providers: [UtilityService, DatePipe, { provide: TimepickerConfig, useFactory: getTimepickerConfig }]
})

export class SeparationModule { }
