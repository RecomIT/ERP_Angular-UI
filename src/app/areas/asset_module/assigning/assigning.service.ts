import { BehaviorSubject } from "rxjs";
import { AreasHttpService } from "../../areas.http.service";
import { ApiArea } from "src/app/shared/constants";
import { Injectable } from "@angular/core";
@Injectable({
    providedIn:'root'
})

export class AssigningSerive{
    private apiRoot = ApiArea.asset + "/Assigning/Assigning";
    constructor(private areasHttpService: AreasHttpService) {
    }

    private Source_of_data = new BehaviorSubject<any[]>([]);
    ddl$ = this.Source_of_data.asObservable();

    get(params: any) {
        return this.areasHttpService.observable_get<any>((this.apiRoot + "/GetAssignedData"), {
            responseType: "json", observe: 'response', params: params
        });
    }

    getById(params: any) {
        return this.areasHttpService.observable_get<any>((this.apiRoot + "/GetAssignedDataById"), {
            responseType: "json", params: params
        });
    }

    getProduct(params: any) {
        return this.areasHttpService.observable_get<any>((this.apiRoot + "/GetProduct"), {
            responseType: "json", params: params
        });
    }

    save(params: any) {
        return this.areasHttpService.observable_post<any>((this.apiRoot+ "/SaveAssetAssigning"), params, {
            responseType: "json"
        });
    }

    getAsset(params: any) {
        return this.areasHttpService.observable_get<any>((this.apiRoot + "/GetAsset"), {
            responseType: "json", observe: 'response', params: params
        });
    }

    sendEmail(params: any) {
        return this.areasHttpService.observable_get<any>((this.apiRoot + "/SendEmail"), {
            responseType: "json", params: params
        });
    }

        
    loadProductDropdown() {
        this.getProductDropdown().then((data) => {
            this.Source_of_data.next(data);
        })
        .catch((error) => {
            console.error('Error while fetching grades:', error);
        });
    }

    getProductDropdown() {
        return this.areasHttpService.promise_get<any[]>((this.apiRoot + "/GetProductDropdown"), {
            responseType: "json"
        });
    }

}