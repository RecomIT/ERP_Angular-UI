import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AttendanceModuleComponent } from "./attendance.component";
import { WorkShiftComponent } from "./Workshift/shift/list/work-shift.component";
import { AuthGuard } from "src/app/shared/services/auth.guard";
import { DailyAttendanceComponent } from "./attendance/daily/daily-attendance.component";
import { EmployeeAttendanceComponent } from "./attendance/employee-attendance/employee-attendance.component";
import { ManualAttendanceComponent } from "./attendance/manual-attendance/list/manual-attendance.component";
import { SelfManualAttendanceComponent } from "./attendance/self-manual-attendance/list/self-manual-attendance.component";
import { AttendanceProcessComponent } from "./attendance/process/list/attendance-process.component";
import { SubordinatesManualAttendanceApprovalComponent } from "./attendance/manual-attendance/supervisor-approval/subordinates-manual-attendance-approval.component";
import { HolidaySetupComponent } from "./holiday-setup/holiday-setup.component";
import { ManualAttendanceApprovalComponent } from "./attendance/manual-attendance/approval/manual-attendance-approval.component";
import { SchedulerReqApproveComponent } from '../attendance_module/attendance/scheduler/scheduler-req-approve.component';
import { SchedulerReqComponent } from '../attendance_module/attendance/scheduler/scheduler-req.component';
import { TimeAdjustmentFacilitatorComponent } from "./attendance/time-adjustment-facilitator/time-adjustment-facilitator.component";

const routes: Routes = [
    {
        path:'',
        component:AttendanceModuleComponent,
        children:[
            { path: "work-shift", component: WorkShiftComponent, data: { component: "WorkShiftComponent" }, canActivate: [AuthGuard] },    
            { path: "daily-attendance", component: DailyAttendanceComponent, data: { component: "DailyAttendanceComponent" }, canActivate: [AuthGuard] }, 
            { path: "employee-attendance", component: EmployeeAttendanceComponent, data: { component: "EmployeeAttendanceComponent" }, canActivate: [AuthGuard] },
            { path: "manual-attendance", component: ManualAttendanceComponent, data: { component: "ManualAttendanceComponent" }, canActivate: [AuthGuard] },
            { path: "self-manual-attendance", component: SelfManualAttendanceComponent, data: { component: "SelfManualAttendanceComponent" }, canActivate: [AuthGuard] },
            { path: "attendance-process", component: AttendanceProcessComponent, data: { component: "AttendanceProcessComponent" }, canActivate: [AuthGuard] },
            { path: "subordinates-manual-attendance-approval", component: SubordinatesManualAttendanceApprovalComponent, data: { component: "SubordinatesManualAttendanceApprovalComponent" }, canActivate: [AuthGuard] },
            { path: "holiday-setup", component: HolidaySetupComponent, data: { component: "HolidaySetupComponent" }, canActivate: [AuthGuard] },
            { path: "manual-attendance-approval", component: ManualAttendanceApprovalComponent, data: { component: "ManualAttendanceApprovalComponent" }, canActivate: [AuthGuard] },
            { path: "scheduler-req", component: SchedulerReqComponent, data: { component: "SchedulerReqComponent" }, canActivate: [AuthGuard] },
            { path: "scheduler-approval", component: SchedulerReqApproveComponent, data: { component: "SchedulerReqApproveComponent" }, canActivate: [AuthGuard] },
            { path: "time-adjustment-facilitator", component: TimeAdjustmentFacilitatorComponent, data: { component: "TimeAdjustmentFacilitatorComponent" }, canActivate: [AuthGuard] },            
        ]
    }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class AttendanceRoutingModule { }