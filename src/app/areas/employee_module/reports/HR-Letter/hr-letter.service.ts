import { Injectable } from "@angular/core";
import { ApiArea } from "src/app/shared/constants";
import { AreasHttpService } from "src/app/areas/areas.http.service";

@Injectable({
    providedIn: 'root'
})

export class HRLetterService {
    private apiRoot: string = ApiArea.hrms + "/Employee/Info" + "/GetEmployeeData";
    constructor(private areasHttpService: AreasHttpService) {
    }

    getEmployeeData(id: any) {
        return this.areasHttpService.observable_get<any>((ApiArea.hrms + "/Employee/HRLetter" + "/GetEmployeeInfo/" + id), {
            responseType: "json"
        });
    }

    downloadClearanceLetter(params: any) {
        //console.log("downloadClearanceLetter >>>", params);
        return this.areasHttpService.observable_get<any>((ApiArea.hrms + "/Employee/HRLetter" + "/DownloadClearanceLetter"), {
            responseType: 'blob' as 'json', params: params
        });
    }

    downloadNOC(params: any) {
        return this.areasHttpService.observable_get<any>((ApiArea.hrms + "/Employee/HRLetter" + "/DownloadNOC"), {
            responseType: 'blob' as 'json', params: params, observe:"response"
        });
    }

    downloadExperienceLetter(params: any) {
        return this.areasHttpService.observable_get<any>((ApiArea.hrms + "/Employee/HRLetter" + "/DownloadExperienceLetter"), {
            responseType: 'blob' as 'json', params: params
        });
    }

    downloadSalaryCertificate(params: any) {
        return this.areasHttpService.observable_get<any>((ApiArea.hrms + "/Employee/HRLetter" + "/DownloadSalaryCertificate"), {
            responseType: 'blob' as 'json', params: params
        });
    }

}