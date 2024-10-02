import { BehaviorSubject } from "rxjs";
import { AreasHttpService } from "../../areas.http.service";
import { ApiArea } from "src/app/shared/constants";
import { Injectable } from "@angular/core";
@Injectable({
    providedIn:'root'
})

export class EmployeeRequestSerive{
    private apiRoot = ApiArea.expensereimbursement + "/Request/Request";
    constructor(private areasHttpService: AreasHttpService) {
    }

    private Source_of_data = new BehaviorSubject<any[]>([]);
    ddl_data$ = this.Source_of_data.asObservable();
    ddl$: any;

    private Source_of_data_bill = new BehaviorSubject<any[]>([]);
    ddl_data_bill$ = this.Source_of_data_bill.asObservable();
    ddl_bill$: any;

    get(params: any) {
        return this.areasHttpService.observable_get<any>((this.apiRoot + "/GetRequestData"), {
            responseType: "json", observe: 'response', params: params
        });
    }

    getList(params: any) {
        return this.areasHttpService.observable_get<any>((this.apiRoot + "/GetRequestDataList"), {
            responseType: "json", observe: 'response', params: params
        });
    }

    getById(params: any) {
        return this.areasHttpService.observable_get<any>((this.apiRoot + "/GetRequestDataById"), {
            responseType: "json", params: params
        });
    }

    save(params: any) {
        return this.areasHttpService.observable_post<any>((this.apiRoot+ "/Save"), params, {
            responseType: "json", observe: 'response'
        });
    }

    saveConveyance(params: any) {
        return this.areasHttpService.observable_post<any>((this.apiRoot+ "/SaveConveyance"), params, {
            responseType: "json", observe: 'response'
        });
    }

    saveTravel(params: any) {
        return this.areasHttpService.observable_post<any>((this.apiRoot+ "/SaveTravel"), params, {
            responseType: "json", observe: 'response'
        });
    }

    saveTraining(params: any) {
        return this.areasHttpService.observable_post<any>((this.apiRoot+ "/SaveTraining"), params, {
            responseType: "json", observe: 'response'
        });
    }


    saveExpat(params: any) {
        return this.areasHttpService.observable_post<any>((this.apiRoot+ "/SaveExpat"), params, {
            responseType: "json", observe: 'response'
        });
    }
 
    saveEntertainment(params: any){
        return this.areasHttpService.observable_post<any>(this.apiRoot + "/SaveEntertainment",params, {
             responseType: "json", observe: 'response'
        });
    }

    saveEntertainmentUploadFile(data: any) {
        return this.areasHttpService.observable_post<any>((this.apiRoot + "/SaveEntertainmentUploadFile"), data, {});
    }
    
    savePurchase(data: any){
        return this.areasHttpService.observable_post<any>(this.apiRoot + "/SavePurchase",data,{});
    }
    
    delete(params: any){
        return this.areasHttpService.observable_post<any>((this.apiRoot + "/DeleteRequest"), params, {
            responseType: "json", observe: 'response'
        });
    }

    sendEmail(params: any) {
        return this.areasHttpService.observable_get<any>((this.apiRoot + "/SendEmail"), {
            responseType: "json", observe: 'response', params: params
        });
    }

    RequestCountEmployeeWise(params: any) {
        return this.areasHttpService.observable_get<any>((this.apiRoot + "/GetRequestCountEmployeeWise"), {
            responseType: "json", params: params
        });
    }

    GetRequestID(params: any) {
        return this.areasHttpService.observable_get<any>((this.apiRoot + "/GetRequestID"), {
            responseType: "json", params: params
        });
    }

    getLocationData(params: any) {
        return this.areasHttpService.promise_get<any[]>((this.apiRoot + "/GetLocation"), {
            responseType: "json", params: params
        });
    }

    loadLocationDropdownData(params: any) {
        this.getLocationData(params).then((data) => {
            this.Source_of_data.next(data);
        })
            .catch((error) => {
                console.error('Error while fetching data:', error);
            });
    }

    loadLocationDropdown(data_list: any[]) {
        this.ddl$ = (data_list.map(element => ({ code: element.location, id: element.location, value: element.location, text: element.location })));
    }


    getCompanyNameData(params: any) {
        return this.areasHttpService.promise_get<any[]>((this.apiRoot + "/GetCompanyName"), {
            responseType: "json", params: params
        });
    }

    loadCompanyNameDropdownData(params: any) {
        this.getCompanyNameData(params).then((data) => {
            this.Source_of_data.next(data);
        })
            .catch((error) => {
                console.error('Error while fetching data:', error);
            });
    }

    loadCompanyNameDropdown(data_list: any[]) {
        this.ddl$ = (data_list.map(element => ({ code: element.companyName, id: element.companyName, value: element.companyName, text: element.companyName })));
    }


    getBillTypeData(params: any) {
        return this.areasHttpService.promise_get<any[]>((this.apiRoot + "/GetBillType"), {
            responseType: "json", params: params
        });
    }

    loadBillTypeDropdownData(params: any) {
        this.getBillTypeData(params).then((data) => {
            this.Source_of_data_bill.next(data);
        })
            .catch((error) => {
                console.error('Error while fetching data:', error);
            });
    }

    loadBillTypeDropdown(data_list: any[]) {
        this.ddl_bill$ = (data_list.map(element => ({ code: element.billType, id: element.billType, value: element.billType, text: element.billType })));
    }

}