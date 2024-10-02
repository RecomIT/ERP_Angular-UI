import { CommonModule, DatePipe } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgSelect2Module } from "ng-select2";
import { BsDatepickerModule } from "ngx-bootstrap/datepicker";
import { TimepickerConfig, TimepickerModule } from "ngx-bootstrap/timepicker";
import { TooltipModule } from "ngx-bootstrap/tooltip";
import { TypeaheadModule } from "ngx-bootstrap/typeahead";
import { NgxPaginationModule } from "ngx-pagination";
import { getTimepickerConfig } from "src/app/shared/factory-service";
import { UtilityService } from "src/app/shared/services/utility.service";
import { EmployeeRequestComponent } from './employee-request/employee-request-list/employee-request.component';
import { EmployeeRequestModalComponent } from './employee-request/employee-request-modal/employee-request-modal.component';
import { ExpenseReimbursementRoutingModule } from "./expense_reimbursement.routing";
import { ExpenseReimbursementComponent } from "./expense_reimbursement.component";
import { RequestApprovalComponent } from './request-approval/request-approval-list/request-approval.component';
import { RequestApprovalModalComponent } from './request-approval/request-approval-modal/request-approval-modal.component';
import { RequestApprovalDetailsModalComponent } from './request-approval/request-approval-details-modal/request-approval-details-modal.component';
import { RequestReimbursementComponent } from './request-reimbursement/request-reimbursement/request-reimbursement.component';
import { RequestReimbursementModalComponent } from './request-reimbursement/request-reimbursement-modal/request-reimbursement-modal.component';
import { RequestApprovalAccountModalComponent } from './request-approval-account/request-approval-account-modal/request-approval-account-modal.component';
import { RequestApprovalAccountComponent } from './request-approval-account/request-approval-account/request-approval-account.component';
import { RequestApprovalAccountDetailsModalComponent } from './request-approval-account/request-approval-account-details-modal/request-approval-account-details-modal.component';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ExpenseReimbursementRoutingModule,
        BsDatepickerModule.forRoot(),
        NgSelect2Module,
        NgxPaginationModule,
        TimepickerModule.forRoot(),
        TypeaheadModule.forRoot(),
        TooltipModule],
        
    declarations: [
        ExpenseReimbursementComponent,
        EmployeeRequestComponent,
        EmployeeRequestModalComponent,
        RequestApprovalComponent,
        RequestApprovalModalComponent,
        RequestApprovalDetailsModalComponent,
        RequestReimbursementComponent,
        RequestReimbursementModalComponent,
        RequestApprovalAccountModalComponent,
        RequestApprovalAccountComponent,
        RequestApprovalAccountDetailsModalComponent
        
    ],
    providers: [UtilityService, DatePipe, { provide: TimepickerConfig, useFactory: getTimepickerConfig }]
})
export class ExpenseReimbursementModule { }