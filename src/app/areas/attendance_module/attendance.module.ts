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
import { WorkShiftInsertUpdateModal } from "./Workshift/shift/insert-update/insert-update-work-shift.component";
import { WorkShiftComponent } from "./Workshift/shift/list/work-shift.component";
import { AttendanceModuleComponent } from "./attendance.component";
import { AttendanceRoutingModule } from "./attendance.routing";
import { DailyAttendanceComponent } from "./attendance/daily/daily-attendance.component";
import { EmployeeAttendanceComponent } from "./attendance/employee-attendance/employee-attendance.component";
import { ManualAttendanceComponent } from "./attendance/manual-attendance/list/manual-attendance.component";
import { SelfManualAttendanceComponent } from "./attendance/self-manual-attendance/list/self-manual-attendance.component";
import { AttendanceProcessComponent } from "./attendance/process/list/attendance-process.component";
import { ExcelViewComponent } from "./attendance/process/excel-View/excel-view.component";
import { SubordinatesManualAttendanceApprovalComponent } from "./attendance/manual-attendance/supervisor-approval/subordinates-manual-attendance-approval.component";
import { HolidaySetupComponent } from "./holiday-setup/holiday-setup.component";
import { ManualAttendanceApprovalComponent } from "./attendance/manual-attendance/approval/manual-attendance-approval.component";
import { SchedulerReqComponent } from '../attendance_module/attendance/scheduler/scheduler-req.component';
import { SchedulerReqApproveComponent } from '../attendance_module/attendance/scheduler/scheduler-req-approve.component';
import { TimeAdjustmentFacilitatorComponent } from "./attendance/time-adjustment-facilitator/time-adjustment-facilitator.component";
import { AddEarlyDepartureRequestComponent } from "./attendance/time-adjustment-facilitator/add-early-departure-request/add-early-departure-request.component";
import { AddLateConsiderRequestModelComponent } from "./attendance/time-adjustment-facilitator/add-late-consider-request-model/add-late-consider-request-model.component";
import { CheckEarlyDepatureModelComponent } from "./attendance/time-adjustment-facilitator/check-early-depature-model/check-early-depature-model.component";
import { ViewLateRequestByIdModelComponent } from "./attendance/time-adjustment-facilitator/view-late-request-by-id-model/view-late-request-by-id-model.component";
import { HrViewAndCheckLateRequestComponent } from "./attendance/time-adjustment-facilitator/hr-view-and-check-late-request/hr-view-and-check-late-request.component";

@NgModule({
    imports:[
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        AttendanceRoutingModule,
        BsDatepickerModule.forRoot(),
        NgSelect2Module,
        NgxPaginationModule,
        TimepickerModule.forRoot(),
        TypeaheadModule.forRoot(),
        TooltipModule],
    declarations:[
        AttendanceModuleComponent,
        WorkShiftComponent,
        WorkShiftInsertUpdateModal,
        DailyAttendanceComponent,
        EmployeeAttendanceComponent,
        ManualAttendanceComponent,
        SelfManualAttendanceComponent,
        AttendanceProcessComponent,
        ExcelViewComponent,
        SubordinatesManualAttendanceApprovalComponent,
        HolidaySetupComponent,
        ManualAttendanceApprovalComponent,
        SchedulerReqComponent,
        SchedulerReqApproveComponent,
        TimeAdjustmentFacilitatorComponent,
        AddEarlyDepartureRequestComponent,
        AddLateConsiderRequestModelComponent,
        CheckEarlyDepatureModelComponent,
        ViewLateRequestByIdModelComponent,
        HrViewAndCheckLateRequestComponent
    ],
    providers: [UtilityService, DatePipe, { provide: TimepickerConfig, useFactory: getTimepickerConfig }]
})
export class AttendanceModule{}