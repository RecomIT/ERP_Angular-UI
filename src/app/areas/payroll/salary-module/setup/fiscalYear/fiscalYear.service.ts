import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { AreasHttpService } from "src/app/areas/areas.http.service";
import { ApiArea } from "src/app/shared/constants";

@Injectable({
    providedIn:'root'
})

export class FiscalYearService{

    private root: string = ApiArea.payroll+"/salary/fiscalYear"
    constructor(private areasHttpService:AreasHttpService){}

    private Source_of_data = new BehaviorSubject<any[]>([]);
    ddl$ = this.Source_of_data.asObservable();

    get(params: any){
        return this.areasHttpService.observable_get<any>((this.root + "/GetFiscalYears"), {
            responseType: "json", observe: 'response', params: params
        });
    }

    getById(params: any){
        return this.areasHttpService.observable_get<any>((this.root + "/GetFiscalYearBId"), {
            responseType: "json", observe: 'response', params: params
        });
    }

    save(params: any){
        return this.areasHttpService.observable_post<any>((this.root + "/SaveFiscalYear"), params, {
            responseType: "json"
        });
    }

    getDropdown(){
        return this.areasHttpService.promise_get<any>((this.root + "/GetFiscalYearDropdown"), {
            responseType: "json", params: {}
        });
    }

    getCurrentFiscalYear(){
        return this.areasHttpService.promise_get<any>((this.root + "/GetCurrentFiscalYear"), {
            responseType: "json", params: {}
        });
    }

    loadDropdown() {
        this.getDropdown().then((data) => {
            this.Source_of_data.next(data);
        })
        .catch((error) => {
            console.error('Error while fetching grades:', error);
        });
    }
}