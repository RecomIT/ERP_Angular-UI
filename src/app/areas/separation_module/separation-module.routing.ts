import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { SeparationModuleComponent } from "./separation-module.component";


import { AuthGuard } from "src/app/shared/services/auth.guard";
import { ResignationRequestComponent } from "./user/resignation-request/resignation-request.component";
import { EmployeeResignationDetailsComponent } from "./admin/employee-resignation-details/employee-resignation-details.component";
import { EmployeeResignationRequestComponent } from "./supervisor/employee-resignation-request/employee-resignation-request.component";
import { EmployeeSettlementSetupComponent } from "./settlement-setup/employee-settlement-setup/employee-settlement-setup.component";



const routes: Routes = [
    {
        path: "",
        component: SeparationModuleComponent,
        children: [
            
            {path: "resignation-request", component: ResignationRequestComponent, data: { component: "ResignationRequestComponent" }, canActivate: [AuthGuard] },
            {path: "employee-resignation-request", component: EmployeeResignationRequestComponent, data: { component: "EmployeeResignationRequestComponent" }, canActivate: [AuthGuard] },
            {path: "resignation-request-details", component: EmployeeResignationDetailsComponent, data: { component: "EmployeeResignationDetailsComponent" }, canActivate: [AuthGuard] },
            {path: "employee-settlement-setup", component: EmployeeSettlementSetupComponent, data: { component: "EmployeeSettlementSetupComponent" }, canActivate: [AuthGuard] }
            
        ]
    }
];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SeparationRoutingModule { }