import { NgModule } from "@angular/core";
import { PfReportComponent } from "./pf-report.component";
import { HttpClientModule } from "@angular/common/http";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BsDatepickerModule } from "ngx-bootstrap/datepicker";
import { NgSelect2Module } from "ng-select2";
import { NgxPaginationModule } from "ngx-pagination";
import { TimepickerModule } from "ngx-bootstrap/timepicker";
import { TypeaheadModule } from "ngx-bootstrap/typeahead";
import { SelfPfCardComponent } from "./self-pf-card/self-pf-card.component";
import { PfReportRoutingModule } from "./pf-report.routing.module";
import { EmployeePfSummaryComponent } from "./employee-pf-card/employee-pf-summary.component";
import { SelfPfReportComponent } from "./self-pf-card/self-pf-report.component";
import { EmployeePfReportComponent } from "./employee-pf-card/employee-pf-report.component";

@NgModule({
    imports: [
        HttpClientModule,
        CommonModule,
        FormsModule,
        PfReportRoutingModule,
        ReactiveFormsModule,
        BsDatepickerModule.forRoot(),
        NgSelect2Module,
        NgxPaginationModule,
        TimepickerModule.forRoot(),
        TypeaheadModule.forRoot()
    ],
    declarations: [
        PfReportComponent,
        SelfPfCardComponent,
        EmployeePfSummaryComponent,
        EmployeePfReportComponent,
        SelfPfReportComponent
    ],
    providers: []
})
export class PfReportModule { }