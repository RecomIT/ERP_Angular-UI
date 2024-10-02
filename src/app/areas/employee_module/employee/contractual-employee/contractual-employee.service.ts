import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { AreasHttpService } from "src/app/areas/areas.http.service";
import { ApiArea } from "src/app/shared/constants";

@Injectable({
    providedIn: 'root'
})

export class ContractualEmployeeService {
    private apiRoot: string = ApiArea.hrms + "/Employee/ContractualEmployee";;

    private Source_of_data = new BehaviorSubject<any[]>([]);
    ddl_data$ = this.Source_of_data.asObservable();
    ddl$: any;
    constructor(private areasHttpService: AreasHttpService) {
    }

    get(params: any) {
        return this.areasHttpService.observable_get<any>((this.apiRoot + "/GetContractEmployees"), {
            responseType: "json", observe: 'response', params: params
        });
    }

    getById(params: any) {
        return this.areasHttpService.observable_get<any>((this.apiRoot + "/GetContractEmployeeById"), {
            responseType: "json", observe: 'response', params: params
        });
    }

    save(params: any) {
        return this.areasHttpService.observable_post<any>((this.apiRoot + "/SaveRenewContract"), params, {
            responseType: "json"
        });
    }

    approval(params: any){
        return this.areasHttpService.observable_post<any>((this.apiRoot + "/SaveEmployeeContractApproval"), params, {
            responseType: "json"
        });
    }

    upload(formData: any) {
        return this.areasHttpService.observable_post<any>((this.apiRoot + "/UploadContractEmployee"),
            formData, {})
    }

    downloadFormat() {
        return this.areasHttpService.observable_get<any>((this.apiRoot + "/DownloadUploadFormat"), {
            responseType: 'blob'
        })
    }
}