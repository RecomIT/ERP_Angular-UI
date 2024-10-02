
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AreasComponent } from './areas.component';
import { AreasRoutingModule } from './areas.routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';


import { ControlPanelModule } from './control-panel/control-panel.module';
import { PayrollModule } from './payroll/payroll.module';
import { AssetModule } from './asset_module/asset.module';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AreasHttpService } from './areas.http.service';
import { CustomModalService } from '../shared/services/custom-modal.service';
import { UserService } from '../shared/services/user.service';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AppHeaderComponent } from './layout-container/app-header.component';
import { AppNavbarComponent } from './layout-container/app-navbar.component';
import { CommonInterceptor } from '../shared/http-service/common.interceptor';
import { CommonDashboardComponent } from './common-dashboard/common-dashboard.component';
import { NgChartsConfiguration, NgChartsModule } from 'ng2-charts';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { UtilityService } from '../shared/services/utility.service';
import { PfModule } from './Pf/pf.module';
import { EmployeeModule } from './employee_module/employee.module';
import { AttendanceModule } from './attendance_module/attendance.module';
import { LeaveModule } from './leave_module/leave.module';

import { EmployeeContactComponent } from './common-dashboard/employee-contact/employee-contact.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NgSelect2Module } from 'ng-select2';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FullCalendarModule } from '@fullcalendar/angular';
import { DashboardPopupComponent } from './common-dashboard/dashboard-popup/dashboard-popup.component';
import { EmployeeLeaveDeatilsComponent } from './common-dashboard/leave-dashboard/admin/employee-leave-deatils/employee-leave-deatils.component';
import { SubordinatesLeaveDashboardComponent } from './common-dashboard/leave-dashboard/supervisor/subordinates-leave-dashboard/subordinates-leave-dashboard.component';
import { SubordinatesLeaveHistoryComponent } from './common-dashboard/leave-dashboard/supervisor/subordinates-leave-history/subordinates-leave-history.component';
import { EmployeeLeaveHistoryComponent } from './common-dashboard/leave-dashboard/admin/employee-leave-history/employee-leave-history.component';
import { EmployeesLeaveApprovalComponent } from './common-dashboard/leave-dashboard/admin/employees-leave-approval/employees-leave-approval.component';
import { LeaveDetailsComponent } from './common-dashboard/leave-dashboard/admin-supervisor/leave-details/leave-details.component';
import { LeaveApproveComponent } from './common-dashboard/leave-dashboard/admin-supervisor/leave-approve/leave-approve.component';
import { LeaveRejectComponent } from './common-dashboard/leave-dashboard/admin-supervisor/leave-reject/leave-reject.component';
import { MyLeaveAppliedRecordsComponent } from './common-dashboard/leave-dashboard/user/my-leave-applied-records/my-leave-applied-records.component';
import { MyLeaveHistoryComponent } from './common-dashboard/leave-dashboard/user/my-leave-history/my-leave-history.component';
import { HrDashboardDetailsComponent } from './common-dashboard/hr-dashboard/hr-dashboard-details/hr-dashboard-details.component';
import { ActivityLogComponent } from './common-dashboard/leave-dashboard/admin-supervisor/activity-log/activity-log.component';
import { SubordinatesLeaveApprovalComponent } from './common-dashboard/leave-dashboard/supervisor/subordinates-leave-approval/subordinates-leave-approval.component';

import { DeleteCompanyEventsComponent } from './common-dashboard/delete-company-events/delete-company-events.component';
import { GeoLocationAttendanceDetailsComponent } from './common-dashboard/attendance-dashboard/geo-location-attendance-details/geo-location-attendance-details.component';
import { GeoLocationAttendanceComponent } from './common-dashboard/attendance-dashboard/geo-location-attendance/geo-location-attendance.component';
import { PunchInPunchOutComponent } from './common-dashboard/attendance-dashboard/punch-in-punch-out/punch-in-punch-out.component';
import { MyAttendanceSummaryComponent } from './common-dashboard/attendance-dashboard/my-attendance-summary/my-attendance-summary.component';
import { UpcomingHolidaysAndEventsComponent } from './common-dashboard/upcoming-holiday-events/upcoming-holidays-and-events/upcoming-holidays-and-events.component';
import { AddCompanyEventsComponent } from './common-dashboard/upcoming-holiday-events/add-company-events/add-company-events.component';
import { SeparationModule } from './separation_module/separation.module';
import { ExpenseReimbursementModule } from './expense_reimbursement_module/expense_reimbursement.module';
import { LunchRequestsComponent } from './common-dashboard/lunch/lunch-requests/lunch-requests.component';
import { AddLunchRequestComponent } from './common-dashboard/lunch/add-lunch-request/add-lunch-request.component';
import { LunchRequestReportModalComponent } from './common-dashboard/lunch/lunch-report/lunch-request-report-modal.component';
import { LunchListModalComponent } from './common-dashboard/lunch/list-modal/lunch-list-modal.component';

@NgModule({
  declarations: [
    AreasComponent,
    AppHeaderComponent,
    AppNavbarComponent,
    DashboardComponent,
    CommonDashboardComponent,
    UnauthorizedComponent,
    PageNotFoundComponent,
    MyAttendanceSummaryComponent,
    
    UpcomingHolidaysAndEventsComponent,
    
    EmployeeContactComponent,
    DashboardPopupComponent,
    SubordinatesLeaveApprovalComponent,
    EmployeeLeaveDeatilsComponent,
    SubordinatesLeaveDashboardComponent,
    SubordinatesLeaveHistoryComponent,
    EmployeeLeaveHistoryComponent,
    EmployeesLeaveApprovalComponent,
    LeaveDetailsComponent,
    LeaveApproveComponent,
    LeaveRejectComponent,
    MyLeaveAppliedRecordsComponent,
    MyLeaveHistoryComponent,
    HrDashboardDetailsComponent,
    ActivityLogComponent,
    AddCompanyEventsComponent,
    DeleteCompanyEventsComponent,
    GeoLocationAttendanceComponent,
    PunchInPunchOutComponent,
    GeoLocationAttendanceDetailsComponent,
    LunchRequestsComponent,
    AddLunchRequestComponent,
    LunchRequestReportModalComponent,
    LunchListModalComponent
  ],
  imports: [
   
    CommonModule,
    HttpClientModule,
    AreasRoutingModule,
    EmployeeModule,
    AssetModule,
    ExpenseReimbursementModule,
    AttendanceModule,
    LeaveModule,
    ControlPanelModule,
    PayrollModule,
    PfModule,
    SeparationModule,
    FormsModule,
    ReactiveFormsModule,
    NgChartsModule,
    FullCalendarModule,
    BsDatepickerModule,
    NgSelect2Module,
    MatSnackBarModule,
    MatChipsModule,
    MatCardModule,
    NgxPaginationModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatSelectModule
  ],
  exports:[MatExpansionModule],
  providers: [UserService, UtilityService, AreasHttpService, CustomModalService, { provide: HTTP_INTERCEPTORS, useClass: CommonInterceptor, multi: true }, { provide: NgChartsConfiguration, useValue: { generateColors: false } }],
})

export class AreasModule { }
