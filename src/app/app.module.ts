import { NgModule } from '@angular/core';

import { BrowserModule } from '@angular/platform-browser'; 
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 
import { HttpClientModule } from '@angular/common/http'; 

import { ToastrModule } from 'ngx-toastr';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app.routing';
import { AppComponent } from './app.component';
import { AreasModule } from './areas/areas.module';
import { UserService } from './shared/services/user.service';
import { LoginComponent } from './login/login.component';

import { ReactiveFormsModule,FormsModule } from '@angular/forms'; 

import { AuthGuard } from './shared/services/auth.guard';

import { JwtModule } from "@auth0/angular-jwt";
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { UtilityService } from './shared/services/utility.service';
import { ApproveComponent } from './areas/email-approval/approve/approve.component';
import { RejectComponent } from './areas/email-approval/reject/reject.component';
import { WundermanThompsonLoginComponent } from './wunderman-thompson-login/wunderman-thompson-login.component';
import { CustomEmailValidatorDirective } from './shared/directives/validators/custom-email-validator.directive';
import { PaginationComponent } from './pagination/pagination.component';
import { GoogleAuthenticatorComponent } from 'src/app/google-authenticator/google-authenticator.component';

export function tokenGetter() { 
  return localStorage.getItem("jwt"); 
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ForgetPasswordComponent,
    ApproveComponent,
    RejectComponent,
    WundermanThompsonLoginComponent,
    CustomEmailValidatorDirective,
    PaginationComponent,
    GoogleAuthenticatorComponent
   ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ToastrModule.forRoot(),
    AppRoutingModule,
    AreasModule,
    NgbModule,
    ReactiveFormsModule,
    FormsModule,
    JwtModule.forRoot({
      config:{
        tokenGetter: tokenGetter,
        allowedDomains: ["http://localhost:5000/api"],
        disallowedRoutes: []
      }
    })
  ],
  exports:[
    PaginationComponent
  ],
  providers: [UserService,UtilityService,AuthGuard],
  bootstrap: [AppComponent]
})

export class AppModule { }
