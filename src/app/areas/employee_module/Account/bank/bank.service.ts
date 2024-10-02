import { Injectable } from "@angular/core";
import { AreasHttpService } from "src/app/areas/areas.http.service";
import { ApiArea } from "src/app/shared/constants";
import { UtilityService } from "src/app/shared/services/utility.service";
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class BankService {
    constructor(private utilityService: UtilityService, private areasHttpService: AreasHttpService) {
    }

    private Source_of_data = new BehaviorSubject<any[]>([]);
    ddl$ = this.Source_of_data.asObservable();

    get(params: any) {
        return this.areasHttpService.observable_get<any[]>((ApiArea.hrms + "/Employee/Bank" + "/GetBanks"), {
            responseType: "json", params: params
        });
    }

    getById(params: any) {
        return this.areasHttpService.observable_get<any[]>((ApiArea.hrms + "/Employee/Bank" + "/GetBankById"), {
            responseType: "json", params: params
        });
    }

    save(params: any) {
        return this.areasHttpService.observable_post<any>((ApiArea.hrms + "/Employee/Bank" + "/SaveBank"), params, {
            responseType: "json", observe: 'response'
        });
    }

    getBankDropdown() {
       return this.areasHttpService.promise_get<any[]>((ApiArea.hrms + "/Employee/Bank" + "/GetBankDropdown"), {
            responseType: "json"
        });
    }

    loadBankDropdown(){
        this.getBankDropdown().then((data) => {
        this.Source_of_data.next(data);
        })
        .catch((error) => {
        console.error('Error while fetching grades:', error);
        });
    }

    // To use dropdown
    // ddlBank: any; declare component scope
    // this.loadDropdown(); call in ngOnInit

    // loadDropdown(){
    //     this.gradeService.loadBankDropdown();
    //     this.ddlBank = this.gradeService.ddl$;
    //     console.log("ddlBank >>>", this.ddlBank);
    // }
}