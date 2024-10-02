import { RouterModule, Routes } from "@angular/router";
import { FundComponent } from "./fund.component";
import { NgModule } from "@angular/core";
import { EmployeeContributionComponent } from "./employee-contribution/employee-contribution.component";
import { AuthGuard } from "src/app/shared/services/auth.guard";

const routes: Routes =[{
    path: "",
    component: FundComponent,
    pathMatch: 'prefix',
    children:[
      { path: "employee-contribution", component: EmployeeContributionComponent, data: { component: "EmployeeContributionComponent" }, canActivate: [AuthGuard]  },
    ]
}]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
export class FundRoutingModule { }