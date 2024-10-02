import { Injectable } from '@angular/core';
import { AreasHttpService } from 'src/app/areas/areas.http.service';
import { ApiArea, ApiController } from '../constants';
import { UserService } from './user.service';
@Injectable({
    providedIn: 'root'
})

export class PayrollWebService {
    constructor(private areasHttpService: AreasHttpService, private userService: UserService) { }
    User() {
        return this.userService.User();
    }

    // allowance
    getAllowanceHeads<T>(): Promise<T> {
        return this.areasHttpService.promise_get<T>((ApiArea.webservice + ApiController.payrollService + "/GetAllowanceHeadsExtension"), {
            responseType: "json",
            params: {
                companyId: this.User().ComId, organizationId: this.User().OrgId
            }
        });
    }

    getAllowanceNames<T>(type: string): Promise<T> {
        return this.areasHttpService.promise_get<T>((ApiArea.webservice + ApiController.payrollService + "/GetAllowanceNamesExtension"), {
            responseType: "json",
            params: {
                allowanceType: type
            }
        });
    }

    // deduction
    getDeductionHeads<T>(): Promise<T> {
        return this.areasHttpService.promise_get<T>((ApiArea.webservice + ApiController.payrollService + "/GetDeductionHeadsExtension"), {
            responseType: "json",
            params: {
                companyId: this.User().ComId, organizationId: this.User().OrgId
            }
        });
    }

    getDeductionNames<T>(type: string): Promise<T> {
        return this.areasHttpService.promise_get<T>((ApiArea.webservice + ApiController.payrollService + "/GetDeductionNamesExtension"), {
            responseType: "json",
            params: {
                deductionType: type
            }
        });
    }

    getSalaryReviewInfos<T>(salaryReviewInfoId: number, employeeId: number): Promise<T>{
        return this.areasHttpService.promise_get<T>((ApiArea.webservice + ApiController.payrollService + "/GetSalaryReviewInfosExtension"), {
            responseType: "json",
            params: {
                salaryReviewInfoId: salaryReviewInfoId,employeeId:employeeId,companyId: this.User().ComId, organizationId: this.User().OrgId
            }
        });
    }
    getSalaryAllowanceForReview<T>(employeeId: number): Promise<T>{
        return this.areasHttpService.promise_get<T>((ApiArea.payroll + "/SalaryReview" + "/GetSalaryAllowanceForReview"), {
            responseType: "json",
            params: {
                employeeId:employeeId,companyId: this.User().ComId, organizationId: this.User().OrgId
            }
        });
    }

    getFiscalYears<T>(): Promise<T>{
        return this.areasHttpService.promise_get<T>((ApiArea.webservice + ApiController.payrollService + "/GetFiscalYearsExtension"), {
            responseType: "json"
        });
    }

    //#region bonus
    getBonusExtension<T>(): Promise<T>{
        return this.areasHttpService.promise_get<T>((ApiArea.webservice + ApiController.payrollService + "/GetBonusExtension"), {
            responseType: "json"
        });
    }
    GetBonusAndConfigInThisFiscalYearExtension<T>(): Promise<T>{
        return this.areasHttpService.promise_get<T>((ApiArea.webservice + ApiController.payrollService + "/GetBonusAndConfigInThisFiscalYearExtension"), {
            responseType: "json"
        });
    }
    //#endregion bonus

    getTaxZoneNames<T>(type: string): Promise<T> {
        return this.areasHttpService.promise_get<T>((ApiArea.webservice + ApiController.payrollService + "/GetTaxZoneNamesExtension"), {
            responseType: "json",
            params: {
                taxZone: type,companyId: this.User().ComId, organizationId: this.User().OrgId
            }
        });
    }

    getCurrentFiscalYear<T>(): Promise<T> {
        return this.areasHttpService.promise_get<T>((ApiArea.webservice + ApiController.payrollService + "/GetCurrentFiscalYear"), {
            responseType: "json"
        });
    }
}