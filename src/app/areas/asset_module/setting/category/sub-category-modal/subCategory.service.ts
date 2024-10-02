import { BehaviorSubject } from "rxjs";
import { Injectable } from "@angular/core";
import { ApiArea } from "src/app/shared/constants";
import { AreasHttpService } from "src/app/areas/areas.http.service";

@Injectable({
    providedIn:'root'
})

export class SubCategoryService{
    private root = ApiArea.asset + "/Setting/SubCategory";
    constructor(private areasHttpService: AreasHttpService) {
    }
    private Source_of_data = new BehaviorSubject<any[]>([]);
    ddl$ = this.Source_of_data.asObservable();

    getSubCategory(params: any) {
        return this.areasHttpService.observable_get<any>((this.root + "/GetSubCategory"), {
            responseType: "json", observe: 'response', params: params
        });
    }


    getById(params: any) {
        return this.areasHttpService.observable_get<any>((this.root + "/GetSubCategoryById"), {
            responseType: "json", observe: 'response', params: params
        });
    }

    save(data: any) {
        return this.areasHttpService.observable_post<any>((this.root + "/SaveSubCategory"), data, {
            responseType: "json"
        });
    }


    getDropdownSubCategory() {
        return this.areasHttpService.promise_get<any[]>((this.root + "/GetSubCategoryDropdown"), {
            responseType: "json"
        });
    }


    loadSubCategory() {
        this.getDropdownSubCategory().then((data) => {
            this.Source_of_data.next(data);
        })
        .catch((error) => {
            console.error('Error while fetching grades:', error);
        });
    }


    getSubCategoryDropdown(CategoryId: number) {
        const params = {
            CategoryId: CategoryId
        };
    
        return this.areasHttpService.promise_get<any[]>((this.root + "/GetSubCategoryDropdown"), {
            params: params,
            responseType: "json"
        });
    }
    
    loadSubCategoryDropdown(CategoryId: number) {
        this.getSubCategoryDropdown(CategoryId).then((data) => {
            this.Source_of_data.next(data);
        })
        .catch((error) => {
            console.error('Error while fetching subcategories:', error);
        });
    }

    

}