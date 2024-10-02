import { Injectable } from "@angular/core";
import { AreasHttpService } from "src/app/areas/areas.http.service";
import { ApiArea, ApiController } from "src/app/shared/constants";
import { UserService } from "src/app/shared/services/user.service";
import { UtilityService } from "src/app/shared/services/utility.service";

@Injectable({
    providedIn:'root'
})

export class UploadAccountInfoModalService{
    constructor( private userService: UserService,
        public utilityService: UtilityService,
        private areasHttpService : AreasHttpService
    ){}   

    downloadAccountInfoExcelFile(params: any){
        return this.areasHttpService.observable_get<any>(ApiArea.hrms + "/Employee/EmployeeAccountInfo" + "/DownloadAccountInfoExcelFile",{
            responseType: "blob", params: params
        });
    }

    uploadAccountInfoExcel(formData: any){
        return this.areasHttpService.observable_post<any>(ApiArea.hrms+ "/Employee/EmployeeAccountInfo" +"/UploadAccountInfoExcel", formData,{});
    }
}