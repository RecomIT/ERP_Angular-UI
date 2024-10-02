import { BehaviorSubject } from "rxjs";
import { ApiArea } from "src/app/shared/constants";
import { Injectable } from "@angular/core";
import { AreasHttpService } from "src/app/areas/areas.http.service";
@Injectable({
    providedIn:'root'
})

export class ServicingSerive{
    private apiRoot = ApiArea.asset + "/Support/Servicing";
    constructor(private areasHttpService: AreasHttpService) {
    }

    private Source_of_data = new BehaviorSubject<any[]>([]);
    ddl$ = this.Source_of_data.asObservable();


    get(params: any) {
        return this.areasHttpService.observable_get<any>((this.apiRoot + "/GetServicingData"), {
            responseType: "json", observe: 'response', params: params
        });
    }

    getAsset(params: any) {
        return this.areasHttpService.observable_get<any>((this.apiRoot + "/GetReceivedAsset"), {
            responseType: "json", observe: 'response', params: params
        });
    }

    getById(params: any) {
        return this.areasHttpService.observable_get<any>((this.apiRoot + "/GetAssetDataById"), {
            responseType: "json", params: params
        });
    }

    save(params: any) {
        return this.areasHttpService.observable_post<any>((this.apiRoot+ "/SaveServicing"), params, {
            responseType: "json", observe: 'response',params: params
        });
    }



}