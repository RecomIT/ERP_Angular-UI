import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/shared/services/auth.guard';
import { AppConfigComponent } from './administration/app-config/app-config.component';
import { OrgConfigComponent } from './administration/org-config/org-config.component';
import { OrgInitComponent } from './administration/org-init/org-init.component';
import { UserConfigComponent } from './administration/user-config/user-config.component';
import { ControlPanelComponent } from './control-panel.component';
import { ClientOrgConfigComponent } from './user-management/org-config/org-config.component';
import { ClientUserConfigComponent } from './user-management/user-config/user-config.component';
import { UserLogReportComponent } from './user-management/log-report/user-log-report.component';
const routes: Routes = [{

  path: '',
  component: ControlPanelComponent,
  children: [
    { path: "control-panel", component: ControlPanelComponent },
    { path: "app-config", component: AppConfigComponent, data:{component:"AppConfigComponent"}, canActivate: [AuthGuard] },
    { path: "org-init", component: OrgInitComponent,data:{component:"OrgInitComponent"}, canActivate: [AuthGuard] },
    { path: "org-config", component: OrgConfigComponent,data:{component:"OrgConfigComponent"}, canActivate: [AuthGuard] },
    { path: "user-config", component: UserConfigComponent,data:{component:"UserConfigComponent"}, canActivate: [AuthGuard] },
    { path: "client-org-config", component: ClientOrgConfigComponent, data: { component: "ClientOrgConfigComponent" }, canActivate: [AuthGuard] },
    { path: "client-user-config", component: ClientUserConfigComponent, data: { component: "ClientUserConfigComponent" }, canActivate: [AuthGuard] },
    { path: "user-log-report", component: UserLogReportComponent, data: { component: "UserLogReportComponent" }, canActivate: [AuthGuard] }
  ]
},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ControlPanelRoutingModule { }