import { Injectable } from "@angular/core";
import { AreasHttpService } from "src/app/areas/areas.http.service";
import { ApiArea, ApiController } from "src/app/shared/constants";
import { UserService } from "src/app/shared/services/user.service";
import { UtilityService } from "src/app/shared/services/utility.service";

@Injectable({
    providedIn:'root'
})

export class InternalDesignationService{
    constructor(private userService: UserService,
        public utilityService: UtilityService,
        private areasHttpService : AreasHttpService
    ){}   

    SaveInternalDesignationAsync(data: any){
        return this.areasHttpService.observable_post<any>(ApiArea.hrms + "/Employee/InternalDesignation" +"/SaveInternalDesignation", data,{});
    }

    getInternalDesignationAsync(params: any){
        return this.areasHttpService.observable_get<any>(ApiArea.hrms + "/Employee/InternalDesignation" + "/GetInternalDesignations",{
            responseType: "json", observe: 'response', params: params
        });
    }

    getInternalDesignationByIdAsync(params: any){
        return this.areasHttpService.observable_get<any>(ApiArea.hrms + "/Employee/InternalDesignation" + "/GetInternalDesignationById",{
            responseType: "json", params: params
        });
    }


    downloadInternalDesignationExcelFile(params: any){
        return this.areasHttpService.observable_get<any>(ApiArea.hrms + "/Employee/InternalDesignation" + "/DownloadInternalDesignationExcelFile",{
            responseType: "blob", params: params
        });
    }

    uploadInternalDesignationExcel(formData: any){
        return this.areasHttpService.observable_post<any>(ApiArea.hrms+ "/Employee/InternalDesignation" +"/UploadInternalDesignationExcel", formData,{});
    }



}