import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { AreasHttpService } from "src/app/areas/areas.http.service";
import { ApiArea } from "src/app/shared/constants";

@Injectable({
    providedIn: 'root'
})

export class SalaryReviewService {
    constructor(private areasHttpService: AreasHttpService) {
    }
    private root: string = ApiArea.payroll + "/Salary/SalaryReview"
    private Source_of_data = new BehaviorSubject<any[]>([]);
    ddl_data$ = this.Source_of_data.asObservable();
    ddl$: any;

    get(params: any) {
        return this.areasHttpService.observable_get<any>((this.root + "/GetSalaryReviewInfos"), {
            responseType: "json", observe: 'response', params: params
        })
    }

    flatAmountUploader(formData: any) {
        return this.areasHttpService.observable_post<any>((this.root + "/UploadFlatSalaryReview"),
            formData, {})
    }

    getLastSalaryReviewInfoByEmployee(params: any) {
        return this.areasHttpService.observable_get<any>((this.root + "/GetLastSalaryReviewInfoByEmployee"), {
            responseType: "json", observe: 'response', params: params
        })
    }


    getSalaryAllowanceForReview(params: any) {
        return this.areasHttpService.observable_get<any>((this.root + "/GetSalaryAllowanceForReview"), {
            responseType: "json", observe: 'response', params: params
        })
    }

    saveReview(params: any) {
        return this.areasHttpService.observable_post<any>((this.root + "/SaveSalaryReview"), params, {
            responseType: "json"
        });
    }

    getSalaryReviewInfoAndDetails(params: any) {
        return this.areasHttpService.observable_get<any>((this.root + "/GetSalaryReviewInfoAndDetails"), {
            responseType: "json", observe: 'response', params: params
        })
    }

    approval(params: any) {
        return this.areasHttpService.observable_post<any>((this.root + "/SaveSalaryReviewStatus"), params, {
            responseType: "json"
        });
    }


    getSalaryReviewSheetInfosAsync(params: any) {
        return this.areasHttpService.observable_get<any>(this.root + "/DownloadSalaryReviewSheetInfos", {
            responseType: "blob", params: params
        });
    }



    getIncrementReasonExtensionAsync(params: any) {
        return this.areasHttpService.observable_get<any>(this.root + "/GetIncrementReasonExtension", {
            responseType: "json", observe: 'response', params: params
        });
    }

    downloadSalaryReviewExcelFile(params: any) {
        return this.areasHttpService.observable_get<any>(this.root + "/DownloadSalaryReviewExcelFile", {
            responseType: "blob", params: params
        });
    }

    uploadSalaryReviewExcel(formData: any) {
        return this.areasHttpService.observable_post<any>(this.root + "/UploadSalaryReviewExcel", formData, {});
    }

    downloadSalaryReviewFlatAmountFile(params: any) {
        return this.areasHttpService.observable_get<any>(this.root + "/DownloadSalaryReviewFlatAmountFile", {
            responseType: "blob", params: params
        });
    }

    getAllPendingSalaryReviewes(params: any) {
        return this.areasHttpService.observable_get<any>(this.root + "/GetAllPendingSalaryReviewes", {
            responseType: "json", observe: 'response', params: params
        });
    }

    downloadSalaryReviewSheet(params) {
        return this.areasHttpService.observable_get<any>(this.root + "/DownloadSalaryReviewSheet", {
            responseType: "blob" as "json", params: params, 'headers': {
                'Content-Type': 'application/json'
            }
        });
    }

    deletePendingReview(id: any) {
        return this.areasHttpService.observable_post<any>(this.root + "/DeletePendingReview?id=" + id, null, {
            responseType: "json"
        });
    }

    deleteApprovedReview(id: any) {
        return this.areasHttpService.observable_post<any>(this.root + "/DeleteApprovedReview?id=" + id, null, {
            responseType: "json"
        });
    }

}