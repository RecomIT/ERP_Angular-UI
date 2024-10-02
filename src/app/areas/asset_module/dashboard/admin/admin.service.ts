import { Injectable } from "@angular/core";
import { ApiArea } from "src/app/shared/constants";
import { BehaviorSubject } from "rxjs";
import { AreasHttpService } from "src/app/areas/areas.http.service";

@Injectable({
    providedIn: 'root'
})

export class AdminService {
    private apiRoot: string=ApiArea.asset +"/Dashboard/Admin";
    constructor(private areasHttpService: AreasHttpService) { }

    private Source_of_data = new BehaviorSubject<any[]>([]);
    ddl$ = this.Source_of_data.asObservable();


    getCreationData() {
        return this.areasHttpService.observable_get<any>((this.apiRoot + "/GetAssetCreationData"), {
            responseType: "json", observe: 'response'
        });
    }

    getAssigningData() {
        return this.areasHttpService.observable_get<any>((this.apiRoot + "/GetAssetAssigningData"), {
            responseType: "json", observe: 'response'
        });
    }

    get(params: any){
        return this.areasHttpService.observable_get<any>((this.apiRoot + "/GetStock"), {
            responseType: "json", observe: 'response', params: params
        });
    }

}