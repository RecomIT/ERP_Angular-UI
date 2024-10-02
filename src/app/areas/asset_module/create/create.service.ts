import { BehaviorSubject } from "rxjs";
import { AreasHttpService } from "../../areas.http.service";
import { ApiArea } from "src/app/shared/constants";
import { Injectable } from "@angular/core";
@Injectable({
    providedIn:'root'
})

export class CreateSerive{
    private apiRoot = ApiArea.asset + "/Create/Create";
    constructor(private areasHttpService: AreasHttpService) {
    }

    private Source_of_data = new BehaviorSubject<any[]>([]);
    ddl$ = this.Source_of_data.asObservable();

    get(params: any) {
        return this.areasHttpService.observable_get<any>((this.apiRoot + "/GetAsset"), {
            responseType: "json", observe: 'response', params: params
        });
    }

    getById(params: any) {
        return this.areasHttpService.observable_get<any>((this.apiRoot + "/GetAssetById"), {
            responseType: "json", params: params
        });
    }

    getProduct(params: any) {
        return this.areasHttpService.observable_get<any>((this.apiRoot + "/GetProduct"), {
            responseType: "json", params: params
        });
    }

    save(params: any) {
        return this.areasHttpService.observable_post<any>((this.apiRoot+ "/SaveAsset"), params, {
            responseType: "json", observe: 'response'
        });
    }

    checkProductValidation(list: any) {
        return this.areasHttpService.observable_post<any>((this.apiRoot + "/CheckProductValidation"), JSON.stringify(list),
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
    }

    downloadExcelFile(params: any){           
        return this.areasHttpService.observable_get<any>((this.apiRoot + "/DownloadExcelFile"),{
            responseType: "blob", params: params
        });
    }

    uploadExcelFile(formData: any) {
        return this.areasHttpService.observable_post<any>((this.apiRoot + "/UploadExcelFile"),
            formData, {})
    }

    saveExcelFile(list: any) {
        return this.areasHttpService.observable_post<any>((this.apiRoot + "/SaveExcelFile"), JSON.stringify(list),
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
    }

    getAssetDetails(params: any) {
        return this.areasHttpService.observable_get<any>((this.apiRoot + "/GetAssetDetails"), {
            responseType: "json", observe: 'response', params: params
        });
    }

    sendEmail() {
        return this.areasHttpService.observable_get<any>((this.apiRoot + "/SendEmail"), {
            responseType: "json"
        });
    }

    approval(params: any) {
        return this.areasHttpService.observable_post<any>((this.apiRoot + "/SaveEmployeeLeaveRequestStatus"), params, {
            responseType: "json"
        });
    }


    loadAssetNameDropdown() {
        this.getAssetNameDropdown().then((data) => {
            this.Source_of_data.next(data);
        })
        .catch((error) => {
            console.error('Error while fetching grades:', error);
        });
    }

    getAssetNameDropdown() {
        return this.areasHttpService.promise_get<any[]>((this.apiRoot + "/GetAssetDropdown"), {
            responseType: "json"
        });
    }





}