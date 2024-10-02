import { Injectable } from "@angular/core";
import { AreasHttpService } from "src/app/areas/areas.http.service";
import { ApiArea } from "src/app/shared/constants";


@Injectable({
    'providedIn':'root'
})

export class DataLabelService{

    apiRoot: string= ApiArea.hrms + "/Employee/DataLabel"
    constructor(private areasHttpService: AreasHttpService) {
    }

    get(params: any) {
        return this.areasHttpService.observable_get<any[]>(this.apiRoot+"/GetDataByLabel", {
            responseType: "json", params: params
        });
    }
}