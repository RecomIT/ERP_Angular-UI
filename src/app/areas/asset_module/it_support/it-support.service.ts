import { BehaviorSubject } from "rxjs";
import { AreasHttpService } from "../../areas.http.service";
import { ApiArea } from "src/app/shared/constants";
import { Injectable } from "@angular/core";
@Injectable({
    providedIn:'root'
})

export class ItSupportSerive{
    private apiRoot = ApiArea.asset + "/IT/ITSupport";
    constructor(private areasHttpService: AreasHttpService) {
    }

    private Source_of_data = new BehaviorSubject<any[]>([]);
    ddl$ = this.Source_of_data.asObservable();


    get(params: any) {
        return this.areasHttpService.observable_get<any>((this.apiRoot + "/GetAssetData"), {
            responseType: "json", observe: 'response', params: params
        });
    }

    getById(params: any) {
        return this.areasHttpService.observable_get<any>((this.apiRoot + "/GetAssetDataById"), {
            responseType: "json", params: params
        });
    }

    save(params: any) {
        return this.areasHttpService.observable_post<any>((this.apiRoot+ "/UpdateProduct"), params, {
            responseType: "json", observe: 'response',params: params
        });
    }



}