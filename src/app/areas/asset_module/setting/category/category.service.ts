import { BehaviorSubject } from "rxjs";
import { Injectable } from "@angular/core";
import { ApiArea } from "src/app/shared/constants";
import { AreasHttpService } from "src/app/areas/areas.http.service";

@Injectable({
    providedIn:'root'
})

export class CategoryService{
    private root = ApiArea.asset + "/Setting/Category";
    constructor(private areasHttpService: AreasHttpService) {
    }
    
    private Source_of_data = new BehaviorSubject<any[]>([]);
    ddl$ = this.Source_of_data.asObservable();

    getCategory(params: any) {
        return this.areasHttpService.observable_get<any>((this.root + "/GetCategory"), {
            responseType: "json", observe: 'response', params: params
        });
    }
    
    getById(params: any) {
        return this.areasHttpService.observable_get<any>((this.root + "/GetCategoryById"), {
            responseType: "json", observe: 'response', params: params
        });
    }

    save(data: any) {
        return this.areasHttpService.observable_post<any>((this.root + "/SaveCategory"), data, {
            responseType: "json"
        });
    }

    getCategoryDropdown() {
        return this.areasHttpService.promise_get<any[]>((ApiArea.asset + "/Setting/Category" + "/GetCategoryDropdown"), {
            responseType: "json"
        });
    }

    loadCategoryDropdown() {
        this.getCategoryDropdown().then((data) => {
            this.Source_of_data.next(data);
        })
        .catch((error) => {
            console.error('Error while fetching grades:', error);
        });
    }


}