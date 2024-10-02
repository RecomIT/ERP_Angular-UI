// import { NgModule } from '@angular/core';
// import { AuthModule, LogLevel } from 'angular-auth-oidc-client';
// import { AppConstants } from '../shared/constants';
// import { CustomStorage } from '../shared/services/custom-storage.service';



// @NgModule({
//   declarations: [],
//   imports: [
//     AuthModule.forRoot({
//       config: {
//         clientId: 'RecomAngularWeb',
//         authority: AppConstants.authority,
//         responseType: 'code',
//         postLoginRoute:"login",
//         redirectUrl: AppConstants.clientRoot+'/login', //+"/login",
//         postLogoutRedirectUri: AppConstants.clientRoot,//+"/login",
//         scope: 'openid profile RcmERPApi',
//         storage: new CustomStorage(),
//         //silentRenew: true,
//         //useRefreshToken: true,
//         //triggerAuthorizationResultEvent:true
//       }
//     })
//   ],
//   exports: [AuthModule]
// })
// export class AuthConfigModule { }
