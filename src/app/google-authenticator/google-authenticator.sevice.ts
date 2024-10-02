import { HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Guid } from "guid-typescript";
import { Observable } from "rxjs";
import { AreasHttpService } from "src/app/areas/areas.http.service";
import { ApiArea, ApiController } from "src/app/shared/constants";
import { UserService } from "src/app/shared/services/user.service";
import { UtilityService } from "src/app/shared/services/utility.service";

@Injectable({
    providedIn:'root'
})

export class googleAuthenticatorservice{
    constructor( private userService: UserService,
        public utilityService: UtilityService,
        private areasHttpService : AreasHttpService
    ){}   

    getQRcode(sendToEmail?: any): Observable<any> {
        const url = ApiArea.controlpanel + ApiController.googleAuth + '/GenerateQRcode';
        
        return this.areasHttpService.observable_get<any>((url),{
            
            responseType: "json",
            observe: 'response',
            params: { sendToEmail: sendToEmail }
        });
      }
   
    
    
}