import { Injectable } from "@angular/core";
import { AreasHttpService } from "../areas.http.service";
import { ApiArea } from "src/app/shared/constants";
import { UtilityService } from "src/app/shared/services/utility.service";
import { NotifyService } from "src/app/shared/services/notify-service/notify.service";

@Injectable({
    'providedIn': 'root'
})

export class WebFileService {
    constructor(
        private areasHttpService: AreasHttpService,
        private utilityService: UtilityService,
        private notifyService: NotifyService
    ) {
    }

    downloadFormatExcelFile(params: any) {
        return this.areasHttpService.observable_get<any>("/ApiBase" + "/DownloadFormatExcelFile", {
            responseType: "blob", params: params
        });
    }

    downloadFile(path: string) {
        return this.areasHttpService.observable_get<any>("/ApiBase" + "/GetDocument?path=" + path, {
            responseType: 'blob' as 'json'
        });
    }

    getFileValues(excelfile: any, key: string) {
        let formData = new FormData();
        formData.append("ExcelFile", excelfile);
        formData.append("Key", key);
        let root = ""
        if (key == "Employee") {
            root = ApiArea.hrms + "/Employee/Info" + "/GetFileValues";
        }
        if (key == "Grade") {
            root = ApiArea.hrms + "/Employee/Grade" + "/GetFileValues";
        }
        if (key == "Designation") {
            root = ApiArea.hrms + "/Employee/Designation" + "/GetFileValues";
        }
        if (key == "Department") {
            root = ApiArea.hrms + "/Employee/Department" + "/GetFileValues";
        }
        return this.areasHttpService.observable_post<any>(root, formData, { responseType: "json" })
    }

    getFile(path: string, fileName: string = "") {
        console.log("path >>>", path);
        console.log("fileName >>>", fileName);
        if (path != '' && path != null && path != "/") {
            this.downloadFile(path).subscribe({
                next: (response) => {
                    if (response instanceof Blob) {
                        if (response.size > 0) {
                            let extension = this.getFileExtensionFromMimetype(response.type);
                            this.utilityService.downloadFile(response, response.type, fileName + "." + extension)
                        }
                    }
                    else {
                        this.utilityService.fail('No data available for report generation', "Server Response");
                    }
                },
                error: (error) => {
                    this.notifyService.handleApiError(error)
                }
            })
        }
        else {
            this.utilityService.fail("File not found")
        }
    }

    getFileExtensionFromMimetype(mimeType: string) {
        let extension = "";
        if (mimeType == "application/pdf") {
            extension = "pdf";
        }
        else if (mimeType == "image/png") {
            extension = "png";
        }
        else if (mimeType == "image/jpg") {
            extension = "jpg";
        }
        else if (mimeType == "image/jpeg") {
            extension = "jpeg";
        }
        return extension;
    }
}