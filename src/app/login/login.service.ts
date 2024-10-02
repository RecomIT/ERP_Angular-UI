import { Injectable } from "@angular/core";
import { AreasHttpService } from "../areas/areas.http.service";
import { HttpHeaders } from "@angular/common/http";

@Injectable({
    providedIn:'root'
})

export class LoginService{
    constructor(private areasHttpService : AreasHttpService){

    }
    private apiRoot: string =this.areasHttpService.apiRoot + "/controlpanel/access/login"

    login(params: any){
        return this.areasHttpService.observable_post<any>("/controlpanel/access/login",params,{
            headers: new HttpHeaders({
                "Content-Type": "application/json",
              })
        })
    }

    loginByMobile(params: any){
        return this.areasHttpService.observable_post<any>("/controlpanel/access/loginByMobile",params,{
            headers: new HttpHeaders({
                "Content-Type": "application/json",
              })
        })
    }
}