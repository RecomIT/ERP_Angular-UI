import { Injectable } from "@angular/core";
import { AreasHttpService } from "src/app/areas/areas.http.service";
import { ApiArea } from "src/app/shared/constants";
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class BankBranchService {
    constructor(private areasHttpService: AreasHttpService) {
    }

    private Source_of_data = new BehaviorSubject<any[]>([]);
    ddl$ = this.Source_of_data.asObservable();

    get(params: any) {
        return this.areasHttpService.observable_get<any[]>((ApiArea.hrms + "/Employee/BankBranch" + "/GetBankBranches"), {
            responseType: "json", params: params
        });
    }

    getById(params: any) {
        return this.areasHttpService.observable_get<any[]>((ApiArea.hrms + "/Employee/BankBranch" + "/GetBankBranchById"), {
            responseType: "json", params: params
        });
    }

    save(params: any) {
        return this.areasHttpService.observable_post<any>((ApiArea.hrms + "/Employee/BankBranch" + "/SaveBankBranch"), params, {
            responseType: "json", observe: 'response'
        });
    }

    getBankBranchDropdown(params: any) {
       return this.areasHttpService.promise_get<any[]>((ApiArea.hrms + "/Employee/BankBranch" + "/GetBankBranchDropdown"), {
            responseType: "json", params: params
        });
    }

    loadBankBranchDropdown(params: any){
        this.getBankBranchDropdown(params).then((data) => {
        this.Source_of_data.next(data);
        })
        .catch((error) => {
        console.error('Error while fetching grades:', error);
        });
    }

    // To use dropdown
    // ddlBankBranch: any; declare component scope
    // this.loadDropdown(); call in ngOnInit

    // loadDropdown(){
    //     this.gradeService.loadBankBranchDropdown();
    //     this.ddlBankBranch = this.gradeService.ddl$;
    //     console.log("ddlBankBranch >>>", this.ddlBankBranch);
    // }
}