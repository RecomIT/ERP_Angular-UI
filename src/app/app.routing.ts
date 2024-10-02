import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { LoginComponent } from './login/login.component';
import { ApproveComponent } from './areas/email-approval/approve/approve.component';
import { RejectComponent } from './areas/email-approval/reject/reject.component';
import { GoogleAuthenticatorComponent } from 'src/app/google-authenticator/google-authenticator.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'approve/:id', component: ApproveComponent },
  { path: 'reject/:id', component: RejectComponent },
  { path: 'forget-password', component: ForgetPasswordComponent },
  { path: 'areas', loadChildren: () => import('./areas/areas.module').then(m => m.AreasModule), pathMatch: "prefix" },
  { path: 'tools', loadChildren: () => import('./tools-module/tools.module').then(m => m.ToolsModule), pathMatch: 'prefix' },
  { path: '', redirectTo: "login", pathMatch: "full" },
  { path: '', redirectTo: 'areas', pathMatch: 'full' },
  { path: 'google-authenticator', component: GoogleAuthenticatorComponent, },
  { path: '**', redirectTo: 'areas' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
