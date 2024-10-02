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
import { pfRoutingModule } from "./pf-routing.module";
import { HttpClientModule } from "@angular/common/http";
import { PfComponent } from "./pf.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

@NgModule({
    imports:[
        CommonModule,
        FormsModule,
        pfRoutingModule,
        HttpClientModule,
        ReactiveFormsModule,
        BsDatepickerModule.forRoot(),
        NgSelect2Module,
        NgxPaginationModule,
        TimepickerModule.forRoot(),
        TypeaheadModule.forRoot()],
    declarations:[
        PfComponent // Module Mother Component
    ],
    providers:[UtilityService,PayrollWebService,HrWebService,{ provide: TimepickerConfig, useFactory: getTimepickerConfig }]
})

export class PfModule{}