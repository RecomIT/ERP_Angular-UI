import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "src/app/shared/services/auth.guard";
import { EmployeeRequestComponent } from "./employee-request/employee-request-list/employee-request.component";
import { ExpenseReimbursementComponent } from "./expense_reimbursement.component";
import { RequestApprovalComponent } from "./request-approval/request-approval-list/request-approval.component";
import { RequestReimbursementComponent } from "./request-reimbursement/request-reimbursement/request-reimbursement.component";
import { RequestApprovalAccountComponent } from "./request-approval-account/request-approval-account/request-approval-account.component";



const routes: Routes = [
    {
        path:'',
        component:ExpenseReimbursementComponent,
        children:[
            { path: "employeerequest", component: EmployeeRequestComponent, data: { component: "EmployeeRequestComponent" }, canActivate: [AuthGuard] },    
            { path: "requestapproval", component: RequestApprovalComponent, data: { component: "RequestApprovalComponent" }, canActivate: [AuthGuard] },  
            { path: "requestreimbursement", component: RequestReimbursementComponent, data: { component: "RequestReimbursementComponent" }, canActivate: [AuthGuard] },  
            { path: "requestapprovalaccount", component: RequestApprovalAccountComponent, data: { component: "RequestApprovalAccountComponent" }, canActivate: [AuthGuard] },
        ]
    }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class ExpenseReimbursementRoutingModule { }