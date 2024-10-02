// import { Injectable } from '@angular/core';
// import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
// import { OidcSecurityService } from 'angular-auth-oidc-client';
// import { Observable } from 'rxjs';
// import { map } from 'rxjs/operators';

// @Injectable({ providedIn: 'root' })
// export class AuthGuard implements CanActivate {
//   constructor(private oidcSecurityService: OidcSecurityService, private router: Router) { }

//   canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> {

//     this.oidcSecurityService.isAuthenticated$.subscribe(data=>{
//       console.log("...............",data);
//        return data;
//     })

//     return this.oidcSecurityService.isAuthenticated$.pipe(
//       map(({ isAuthenticated }) => {
//         // allow navigation if authenticated
//         console.log("isAuthenticated======",isAuthenticated);
//         if (isAuthenticated) {
//           return true;
//         }
//         else{

//           return this.router.parseUrl('/login');
//         }
//       }));

//   }
// }