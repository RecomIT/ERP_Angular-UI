import { Injectable } from "@angular/core";
import { ApiArea } from "src/app/shared/constants";
import { AreasHttpService } from "src/app/areas/areas.http.service";

@Injectable({
    providedIn: 'root'
})

export class ProjectedPaymentService {
    private root = ApiArea.payroll + "/Salary/ProjectedPayment";
    constructor(private areasHttpService: AreasHttpService) { }

    get(params: any) {
        return this.areasHttpService.observable_get<any>((this.root + "/GetEmployeeProjectedPayments"), {
            responseType: "json", observe: 'response', params: params
        })
    }

    getById(params: any) {
        return this.areasHttpService.observable_get<any>((this.root + "/GetEmployeeProjectedPayments"), {
            responseType: "json", observe: 'response', params: params
        })
    }

    getProjectedAllowanceById(id: any) {
        return this.areasHttpService.observable_get<any>((this.root + "/GetProjectedAllowanceById/" + id), {
            responseType: "json", observe: 'response'
        })
    }

    saveBulk(params: any) {
        return this.areasHttpService.observable_post<any>((this.root + "/SaveBlukEmployeeProjectedPayment"), params, {
            responseType: "json", observe: 'response'
        });
    }

    save(params: any) {
        return this.areasHttpService.observable_post<any>((this.root + "/SaveEmployeeProjectedPayment"), params, {
            responseType: "json"
        });
    }

    upload(params: any) {
        return this.areasHttpService.observable_post<any>((this.root + "/UploadProjectedPayment"), params, {
            responseType: "json", observe: 'response'
        });
    }

    downloadFormat() {
        return this.areasHttpService.observable_get<any>((this.root + "/DownloadUploadFormat"), {
            responseType: 'blob'
        })
    }

    getEmployeeProjectedPaymentInfosForProcess(params: any) {
        return this.areasHttpService.observable_get<any>((this.root + "/GetEmployeeProjectedPaymentInfosForProcess"), {
            responseType: "json", observe: 'response', params: params
        })
    }

    process(params: any) {
        return this.areasHttpService.observable_post<any>((this.root + "/SaveProjectedPaymentInProcess"), params, {
            responseType: "json"
        });
    }

    getProjectedPaymentProcessInfos(params: any) {
        return this.areasHttpService.observable_get<any>((this.root + "/GetEmployeeProjectedAllowanceProcessInfos"), {
            responseType: "json", observe: 'response', params: params
        })
    }

    downloadProjectedPaymentSheet(params: any) {
        return this.areasHttpService.observable_get<any>((this.root + "/DownloadProjectedPaymentReport"), {
            responseType: 'blob',
            params: params
        })
    }

    deletePendingAllowance(params: any) {
        return this.areasHttpService.observable_post<any>((this.root + "/DeletePendingAllowanceById"), params, {
            responseType: "json", observe: 'response'
        });
    }

    deleteApprovedAllowance(params: any) {
        return this.areasHttpService.observable_post<any>((this.root + "/DeleteApprovedAllowanceById"), params, {
            responseType: "json", observe: 'response'
        });
    }

    UpdateProjectedPayment(params: any) {
        return this.areasHttpService.observable_post<any>((this.root + "/UpdateProjectedPayment"), params, {
            responseType: "json", observe: 'response'
        });
    }

    approval(params: any) {
        return this.areasHttpService.observable_post<any>((this.root + "/Approval"), params, {
            responseType: "json", observe: 'response'
        });
    }

    listOfPaymentReason(){
        return this.areasHttpService.observable_get<any>((this.root + "/listOfPaymentReason"), {
            responseType: "json", observe: 'response'
        })
    }
}