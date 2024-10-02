import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "src/app/shared/services/auth.guard";
import { ToolsComponent } from "./tools.component";
import { EasyTaxComponent } from "./easy-tax/easy-tax.component";

const routes: Routes = [
  {
    path: '',
    component: ToolsComponent,
    children: [

      { path: "easy-tax", component: EasyTaxComponent },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ToolsRoutingModule { }