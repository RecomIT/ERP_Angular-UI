import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppConfigComponent } from './administration/app-config/app-config.component';
import { OrgInitComponent } from './administration/org-init/org-init.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ControlPanelRoutingModule } from './control-panel.routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OrgConfigComponent } from './administration/org-config/org-config.component';
import { ControlPanelComponent } from './control-panel.component';
import { UserConfigComponent } from './administration/user-config/user-config.component';
import { NgSelect2Module } from 'ng-select2';
import { NgxPaginationModule } from 'ngx-pagination';
import { ControlPanelWebService } from 'src/app/shared/services/control-panel.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { ClientUserConfigComponent } from './user-management/user-config/user-config.component';
import { ClientOrgConfigComponent } from './user-management/org-config/org-config.component';
import { UserLogReportComponent } from './user-management/log-report/user-log-report.component';


const MODULES = [
  CommonModule,
  ControlPanelRoutingModule,
  FormsModule,
  ReactiveFormsModule,
  BsDatepickerModule.forRoot(),
  NgSelect2Module,
  NgxPaginationModule
];

const COMPONENTS = [
  AppConfigComponent,
  OrgInitComponent,
  OrgConfigComponent,
  ControlPanelComponent,
  UserConfigComponent,
  ClientUserConfigComponent,
  ClientOrgConfigComponent,
  UserLogReportComponent
];

const SERVICES: any = [UtilityService,ControlPanelWebService];

@NgModule({
  imports: [...MODULES],
  declarations: [...COMPONENTS],
  providers: [...SERVICES]
})

export class ControlPanelModule { }
