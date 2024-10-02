import { BehaviorSubject } from "rxjs";
import { ApiArea } from "src/app/shared/constants";
import { Injectable } from "@angular/core";
import { AreasHttpService } from "src/app/areas/areas.http.service";
@Injectable({
    providedIn:'root'
})

export class VendorSerive{
    private apiRoot: string =ApiArea.asset +"/Setting/Vendor";
    constructor(private areasHttpService: AreasHttpService) {
    }

    private Source_of_data = new BehaviorSubject<any[]>([]);
    ddl$ = this.Source_of_data.asObservable();

    get(params: any) {
        return this.areasHttpService.observable_get<any>((this.apiRoot+ "/GetVendor"), {
            responseType: "json", observe: 'response', params: params
        });
    }

    getById(params: any) {
        return this.areasHttpService.observable_get<any>(( this.apiRoot+ "/GetVendorById"), {
            responseType: "json",observe: 'response', params: params
        });
    }

    save(params: any) {
        return this.areasHttpService.observable_post<any>((this.apiRoot+ "/SaveVendor"), params, {
            responseType: "json"
        });
    }

    getVendorDropdown() {
        return this.areasHttpService.promise_get<any[]>((this.apiRoot + "/GetVendorDropdown"), {
            responseType: "json"
        });
    }


    loadVendorDropdown() {
        this.getVendorDropdown().then((data) => {
            this.Source_of_data.next(data);
        })
        .catch((error) => {
            console.error('Error while fetching grades:', error);
        });
    }
    
}