import { BehaviorSubject } from "rxjs";
import { Injectable } from "@angular/core";
import { ApiArea } from "src/app/shared/constants";
import { AreasHttpService } from "src/app/areas/areas.http.service";

@Injectable({
    providedIn:'root'
})

export class BrandService{
    private root = ApiArea.asset + "/Setting/Brand";
    constructor(private areasHttpService: AreasHttpService) {
    }
    private Source_of_data = new BehaviorSubject<any[]>([]);
    ddl$ = this.Source_of_data.asObservable();

    getBrand(params: any) {
        return this.areasHttpService.observable_get<any>((this.root + "/GetBrand"), {
            responseType: "json", observe: 'response', params: params
        });
    }

    
    getById(params: any) {
        return this.areasHttpService.observable_get<any>((this.root + "/GetBrandById"), {
            responseType: "json", observe: 'response', params: params
        });
    }

    save(data: any) {
        return this.areasHttpService.observable_post<any>((this.root + "/SaveBrand"), data, {
            responseType: "json"
        });
    }


    getBrandDropdown(SubCategoryId: number) {
        const params = {
            SubCategoryId: SubCategoryId
        };
    
        return this.areasHttpService.promise_get<any[]>((this.root + "/GetBrandDropdown"), {
            params: params,
            responseType: "json"
        });
    }
    
    loadBrandDropdown(SubCategoryId: number) {
        this.getBrandDropdown(SubCategoryId).then((data) => {
            this.Source_of_data.next(data);
        })
        .catch((error) => {
            console.error('Error while fetching subcategories:', error);
        });
    }

}