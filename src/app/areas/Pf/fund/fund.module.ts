import { NgModule } from "@angular/core";
import { EmployeeContributionComponent } from "./employee-contribution/employee-contribution.component";
import { FundRoutingModule } from "./fund-routing.module";
import { HttpClientModule } from "@angular/common/http";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BsDatepickerModule } from "ngx-bootstrap/datepicker";
import { NgSelect2Module } from "ng-select2";
import { NgxPaginationModule } from "ngx-pagination";
import { TimepickerModule } from "ngx-bootstrap/timepicker";
import { TypeaheadModule } from "ngx-bootstrap/typeahead";
import { FundComponent } from "./fund.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

@NgModule({
    imports:[
        FundRoutingModule,
        HttpClientModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        BsDatepickerModule.forRoot(),
        NgSelect2Module,
        NgxPaginationModule,
        TimepickerModule.forRoot(),
        TypeaheadModule.forRoot()
    ],
    declarations:[
        FundComponent, // Module Mother Component
        EmployeeContributionComponent
    ],
    providers:[]
})
export class FundModule{}