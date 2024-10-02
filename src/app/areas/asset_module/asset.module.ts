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
import { AssetModuleComponent } from "./asset.component";
import { AssetRoutingModule } from "./asset.routing";
import { CategoryComponent } from './setting/category/category.component';
import { VendorComponent } from './setting/vendor/vendor.component';
import { StoreComponent } from "./setting/store/store.component";
import { CategoryModalComponent } from './setting/category/category-modal/category-modal.component';
import { SubCategoryModalComponent } from './setting/category/sub-category-modal/sub-category-modal.component';
import { BrandModalComponent } from './setting/category/brand-modal/brand-modal.component';
import { StoreModalComponent } from './setting/store/store-modal/store-modal.component';
import { VendorModalComponent } from './setting/vendor/vendor-modal/vendor-modal.component';
import { CreateComponent } from './create/create.component';
import { CreateModalComponent } from './create/create-modal/create-modal.component';
import { AssigningComponent } from './assigning/assigning.component';
import { AssigningModalComponent } from './assigning/assigning-modal/assigning-modal.component';
import { ApprovalComponent } from './approval/approval.component';
import { ApprovalModalComponent } from './approval/approval-modal/approval-modal.component';
import { ItSupportComponent } from './it_support/it-support.component';
import { ItSupportModalComponent } from './it_support/it-support-modal/it-support-modal.component';
import { ResignationComponent } from './resignation/resignation.component';
import { ResignationModalComponent } from './resignation/resignation-modal/resignation-modal.component';
import { ReplacementComponent } from "./support/replacement/replacement.component";
import { HandoverComponent } from "./support/handover/handover.component";
import { ReplacementModalComponent } from "./support/replacement/replacement-modal/replacement-modal.component";
import { HandoverModalComponent } from "./support/handover/handover-modal/handover-modal.component";
import { ServicingComponent } from "./support/servicing/servicing.component";
import { ServicingModalComponent } from "./support/servicing/servicing-modal/servicing-modal.component";
import { RepairedComponent } from "./support/repaired/repaired.component";
import { RepairedModalComponent } from "./support/repaired/repaired-modal/repaired-modal.component";
import { ReportComponent } from './report/report.component';
import { EmployeeComponent } from './dashboard/employee/employee.component';
import { AdminComponent } from './dashboard/admin/admin.component';




@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        AssetRoutingModule,
        BsDatepickerModule.forRoot(),
        NgSelect2Module,
        NgxPaginationModule,
        TimepickerModule.forRoot(),
        TypeaheadModule.forRoot(),
        TooltipModule],
        
        declarations: [
        AssetModuleComponent,
        CategoryComponent,
        VendorComponent,
        StoreComponent,
        CategoryModalComponent,
        SubCategoryModalComponent,
        BrandModalComponent,
        StoreModalComponent,
        VendorModalComponent,
        CreateComponent,
        CreateModalComponent,
        AssigningComponent,
        AssigningModalComponent,
        ApprovalComponent,
        ApprovalModalComponent,
        ItSupportComponent,
        ItSupportModalComponent,
        ResignationComponent,
        ResignationModalComponent,
        HandoverComponent,
        ReplacementComponent,
        ReplacementModalComponent,
        HandoverModalComponent,
        ServicingComponent,
        ServicingModalComponent,
        RepairedComponent,
        RepairedModalComponent,
        ReportComponent,
        EmployeeComponent,
        AdminComponent      

    ],
    providers: [UtilityService, DatePipe, { provide: TimepickerConfig, useFactory: getTimepickerConfig }]
})
export class AssetModule { }