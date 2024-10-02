
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "src/app/shared/services/auth.guard";
import { SelfPfCardComponent } from "./self-pf-card/self-pf-card.component";
import { PfReportComponent } from "./pf-report.component";
import { EmployeePfSummaryComponent } from "./employee-pf-card/employee-pf-summary.component";
import { EmployeePfReportComponent } from "./employee-pf-card/employee-pf-report.component";
import { SelfPfReportComponent } from "./self-pf-card/self-pf-report.component";

const routes: Routes = [{
  path: "",
  component: PfReportComponent,
  pathMatch: 'prefix',
  children: [
    { path: "employee-pf-card", component: SelfPfCardComponent, data: { component: "SelfPfCardComponent" }, canActivate: [AuthGuard] },
    { path: "employee-pf-summary", component: EmployeePfSummaryComponent, data: { component: "EmployeePfSummaryComponent" }, canActivate: [AuthGuard] },
    { path: "employee-pf-report", component: EmployeePfReportComponent, data: { component: "EmployeePfReportComponent" }, canActivate: [AuthGuard] },
    { path: "self-pf-report", component: SelfPfReportComponent, data: { component: "SelfPfReportComponent" }, canActivate: [AuthGuard] },
  ]
}]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PfReportRoutingModule { }