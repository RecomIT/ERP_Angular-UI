import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AssetModuleComponent } from "./asset.component";
import { AuthGuard } from "src/app/shared/services/auth.guard";
import { CategoryComponent } from "./setting/category/category.component";
import { VendorComponent } from "./setting/vendor/vendor.component";
import { StoreComponent } from "./setting/store/store.component";
import { CreateComponent } from "./create/create.component";
import { AssigningComponent } from "./assigning/assigning.component";
import { ApprovalComponent } from "./approval/approval.component";
import { ItSupportComponent } from "./it_support/it-support.component";
import { ResignationComponent } from "./resignation/resignation.component";
import { ReplacementComponent } from "./support/replacement/replacement.component";
import { HandoverComponent } from "./support/handover/handover.component";
import { ServicingComponent } from "./support/servicing/servicing.component";
import { RepairedComponent } from "./support/repaired/repaired.component";
import { ReportComponent } from "./report/report.component";
import { EmployeeComponent } from "./dashboard/employee/employee.component";
import { AdminComponent } from "./dashboard/admin/admin.component";


const routes: Routes = [
    {
        path:'',
        component:AssetModuleComponent,
        children:[
            { path: "store", component: StoreComponent, data: { component: "StoreComponent" }, canActivate: [AuthGuard] },    
            { path: "category", component: CategoryComponent, data: { component: "CategoryComponent" }, canActivate: [AuthGuard] }, 
            { path: "vendor", component: VendorComponent, data: { component: "VendorComponent" }, canActivate: [AuthGuard] },
            { path: "create", component: CreateComponent, data: { component: "CreateComponent" }, canActivate: [AuthGuard] },
            { path: "assigning", component: AssigningComponent, data: { component: "AssigningComponent" }, canActivate: [AuthGuard] },
            { path: "approval", component: ApprovalComponent, data: { component: "ApprovalComponent" }, canActivate: [AuthGuard] },  
            { path: "itSupport", component: ItSupportComponent, data: { component: "ItSupportComponent" }, canActivate: [AuthGuard] },    
            { path: "resignation", component: ResignationComponent, data: { component: "ResignationComponent" }, canActivate: [AuthGuard] }, 
            { path: "replacement", component: ReplacementComponent, data: { component: "ReplacementComponent" }, canActivate: [AuthGuard] }, 
            { path: "handover", component: HandoverComponent, data: { component: "HandoverComponent" }, canActivate: [AuthGuard] },       
            { path: "servicing", component: ServicingComponent, data: { component: "ServicingComponent" }, canActivate: [AuthGuard] }, 
            { path: "repaired", component: RepairedComponent, data: { component: "RepairedComponent" }, canActivate: [AuthGuard] }, 
            { path: "report", component: ReportComponent, data: { component: "ReportComponent" }, canActivate: [AuthGuard] }, 
            { path: "empassetlist", component: EmployeeComponent, data: { component: "EmployeeComponent" }, canActivate: [AuthGuard] }, 
            { path: "admindashbord", component: AdminComponent, data: { component: "AdminComponent" }, canActivate: [AuthGuard] }, 
        ]
    }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class AssetRoutingModule { }