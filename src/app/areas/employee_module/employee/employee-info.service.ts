import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { AreasHttpService } from "src/app/areas/areas.http.service";
import { ApiArea } from "src/app/shared/constants";

@Injectable({
    providedIn: 'root'
})

export class EmployeeInfoService {
    constructor(private areasHttpService: AreasHttpService) {
    }
    private Source_of_data = new BehaviorSubject<any[]>([]);
    ddl_employee_data$ = this.Source_of_data.asObservable();
    ddl$: any;

    getServiceData(params: any) {
        return this.areasHttpService.promise_get<any[]>((ApiArea.hrms + "/Employee/Info" + "/GetEmployeeServiceData"), {
            responseType: "json", params: params
        });
    }

    getEmployeeData(params: any) {
        return this.areasHttpService.promise_get<any[]>((ApiArea.hrms + "/Employee/Info" + "/GetEmployeeData"), {
            responseType: "json", params: params
        });
    }

    loadDropdownData(params: any) {
        this.getServiceData(params).then((data) => {
            this.Source_of_data.next(data);
        })
            .catch((error) => {
                console.error('Error while fetching data:', error);
            });
    }

    save(params: any) {
        return this.areasHttpService.observable_post<any>((ApiArea.hrms + "/Employee/Info" + "/SaveEmployeeExtension"), params, {
            responseType: "json"
        });
    }

    loadDropdown(data_list: any[]) {
        this.ddl$ = (data_list.map(element => ({
            code: element.employeeCode,
            id: element.employeeId,
            value: element.employeeId,
            text: element.employeeName + ' [' + element.employeeCode + ']',
            designation: element.designationName,
            department: element.departmentName,
        })));
    }

    upload(formData: any) {
        return this.areasHttpService.observable_post<any>((ApiArea.hrms + "/Employee/Uploader" + "/UploadEmployeeInfo"),
            formData, {})
    }

    getEmployeeInfos(params: any) {
        return this.areasHttpService.observable_get<any>((ApiArea.hrms + "/Employee/Info" + "/GetEmployeeInfos"), {
            responseType: "json", observe: 'response', params: params
        });
    }

    getOfficeInfo(params: any) {
        return this.areasHttpService.observable_get<any>((ApiArea.hrms + "/Employee/Info" + "/GetEmployeeOfficeInfoById"), {
            responseType: "json", observe: 'response', params: params
        });
    }

    getPersonalInfo(params: any) {
        return this.areasHttpService.observable_get<any>((ApiArea.hrms + "/Employee/Info" + "/GetEmployeePersonalInfoById"), {
            responseType: "json", observe: 'response', params: params
        });
    }

    saveProfessionalInfo(params: any) {
        return this.areasHttpService.observable_post<any>((ApiArea.hrms + "/Employee/Info" + "/SaveEmployeeProfessionalInfo"), params, {
            responseType: "json"
        });
    }

    savePersonalInfo(params: any) {
        return this.areasHttpService.observable_post<any>((ApiArea.hrms + "/Employee/Info" + "/SaveEmployeePersonalInfo"), params, {
            responseType: "json"
        });
    }

    approval(params: any) {
        return this.areasHttpService.observable_post<any>((ApiArea.hrms + "/Employee/Info" + "/SaveEmploymentApproval"), params, {
            responseType: "json"
        });
    }

    getProfileInfo(params: any) {
        return this.areasHttpService.observable_get<any>((ApiArea.hrms + "/Employee/Info" + "/GetEmployeeProfileInfo"), {
            responseType: "json", observe: 'response', params: params
        });
    }

    uploadProfilePic(formData: any) {
        return this.areasHttpService.observable_post<any>((ApiArea.hrms + "/Employee/Info" + "/UploadProfileImage"),
            formData, {})
    }

    downloadEmployeeInfoExcelFile(params: any) {
        return this.areasHttpService.observable_get<any>(ApiArea.hrms + "/Employee/Uploader" + "/DownloadEmployeeInfoExcelFile", {
            responseType: "blob", params: params
        });
    }

    downloadEmployeesInfo(params: any) {
        return this.areasHttpService.observable_post<any>((ApiArea.hrms + "/Employee/Uploader" + "/DownloadEmployeesInfo"),
            JSON.stringify(params),
            {
                responseType: 'blob',
                observe: 'response',
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        )
    }

    getEmployeeInfoInDynamicReport(params: any) {
        return this.areasHttpService.observable_get<any>((ApiArea.hrms + "/Employee/Info" + "/GetEmployeeInformationForReport"), {
            responseType: "json", observe: 'response', params: params,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    postEmployeeInfoInDynamicReport(params: any) {
        return this.areasHttpService.observable_post<any>((ApiArea.hrms + "/Employee/Info" + "/PostEmployeeInformationForReport"), params, {
            responseType: "json"
        });
    }

    downloadEmployeeInfoInDynamicReport(params: any) {
        return this.areasHttpService.observable_get<any>((ApiArea.hrms + "/Employee/Info" + "/DownloadEmployeeInformation"), {
            responseType: 'blob' as 'json', params: params
        });
    }

    postDownloadEmployeeInfoInDynamicReport(params: any) {
        return this.areasHttpService.observable_post<any>((ApiArea.hrms + "/Employee/Info" + "/PostDownloadEmployeeInformation"), params, {
            responseType: 'blob' as 'json'
        });
    }

    //#region Validation
    IsOfficeEmailAvailable(email: string) {
        return this.areasHttpService.observable_get<boolean>((ApiArea.hrms + "/Employee/Info" + "/IsOfficeEmailAvailable?email=" + email), {});
    }

    IsOfficeEmailInEditAvailable(id: any, email: string) {
        return this.areasHttpService.observable_get<boolean>((ApiArea.hrms + "/Employee/Info" + "/IsOfficeEmailInEditAvailable"), {
            params: { id: id, email: email }
        });
    }

    IsEmployeeCodeAvailable(code: string) {
        return this.areasHttpService.observable_get<boolean>((ApiArea.hrms + "/Employee/Info" + "/IsEmployeeCodeAvailable?code=" + code), {});
    }

    IsEmployeeCodeAvailableInEdit(id: any, code: string) {
        return this.areasHttpService.observable_get<boolean>((ApiArea.hrms + "/Employee/Info" + "/IsEmployeeCodeInEditAvailable"), {
            params: { id: id, code: code }
        });
    }
    //#endregion Validation

    readExcel(formData: any) {
        return this.areasHttpService.observable_post<any>((ApiArea.hrms + "/Employee/Uploader" + "/ReadEmployeeInfoExcelFile"),
            formData, {})
    }

    saveExcelData(params: any) {
        return this.areasHttpService.observable_post<any>((ApiArea.hrms + "/Employee/Uploader" + "/SaveEmployeeInfo"), params, {
            responseType: 'json'
        });
    }

}