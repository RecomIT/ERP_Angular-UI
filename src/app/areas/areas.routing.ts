import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../shared/services/auth.guard';
import { AreasComponent } from './areas.component';
import { CommonDashboardComponent } from './common-dashboard/common-dashboard.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';


const routes: Routes = [
  {
    path: '',
    component: AreasComponent,
    children: [
      { path: '', redirectTo: "dashboard", pathMatch: "full" },
      { path: 'common-dashboard', component: CommonDashboardComponent, canActivate: [AuthGuard] },
      { path: "dashboard", component: DashboardComponent, canActivate: [AuthGuard] },
      { path: "unauthorized", component: UnauthorizedComponent },
      { path: 'hrms/employee', loadChildren: () => import('./employee_module/employee.module').then(m => m.EmployeeModule), pathMatch: 'prefix', },
      { path: 'hrms/attendance', loadChildren: () => import('./attendance_module/attendance.module').then(m => m.AttendanceModule), pathMatch: 'prefix', },
      { path: 'hrms/leave', loadChildren: () => import('./leave_module/leave.module').then(m => m.LeaveModule), pathMatch: 'prefix', },
      { path: 'overtime', loadChildren: () => import('./overtime_module/ovetime.module').then(m => m.OvertimeModule), pathMatch: 'prefix', },
      { path: 'controlpanel', loadChildren: () => import('./control-panel/control-panel.module').then(m => m.ControlPanelModule) },
      { path: 'payroll', loadChildren: () => import('./payroll/payroll.module').then(m => m.PayrollModule), pathMatch: 'prefix', },
      { path: 'pf', loadChildren: () => import('./Pf/pf.module').then(m => m.PfModule), pathMatch: 'prefix', },
      { path: 'separation', loadChildren: () => import('./separation_module/separation.module').then(m => m.SeparationModule), pathMatch: 'prefix', },
      { path: 'asset', loadChildren: () => import('./asset_module/asset.module').then(m => m.AssetModule), pathMatch: 'prefix', },
      { path: 'expense-reimbursement', loadChildren: () => import('./expense_reimbursement_module/expense_reimbursement.module').then(m => m.ExpenseReimbursementModule), pathMatch: 'prefix', },
      { path: '**', component: PageNotFoundComponent },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class AreasRoutingModule { }
