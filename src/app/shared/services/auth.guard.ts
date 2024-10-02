import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { JwtHelperService } from "@auth0/angular-jwt";
import { Observable, of } from "rxjs";
import { UserService } from "./user.service";
import { tap } from "rxjs/operators";

@Injectable({
    providedIn: 'root'
})

export class AuthGuard implements CanActivate {
    constructor(private router: Router, private jwtHelper: JwtHelperService, private userService: UserService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const component = route.data.component;
        let result = false;
        // console.log("componentName >>> ", component)
        // console.clear();
        const token = localStorage.getItem("jwt");

        let privileges = this.userService.getPagePrivileges(component);
        if (privileges != null) {
            localStorage.removeItem("x-page-privileges");
            localStorage.setItem("x-page-privileges", JSON.stringify(privileges));
        }

        let isLoggedOut = false;

        if (token && !this.jwtHelper.isTokenExpired(token)) {
            if (component == null) {
                result = true;
            }
            else if (privileges != null) {
                result = true;
            }
            else {
                result = false;
            }
        }
        else{
            isLoggedOut = true
        }

        //console.log("auth guard >>>", result);

        if (!result) {
            //console.log("first block >>>")
            this.router.navigate(['areas/unauthorized']);
        }
        

        return of(result).pipe(
            tap((allowed) => {
                if (allowed==false && isLoggedOut == false) {
                    //console.log("second block >>>")
                    this.router.navigate(['areas/unauthorized']);
                }
                else if(allowed == false && isLoggedOut == true){
                    //console.log("third block >>>")
                    this.router.navigate(['/login']);
                }
            })
        );
    }

}