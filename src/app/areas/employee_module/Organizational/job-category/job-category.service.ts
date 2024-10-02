import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { AreasHttpService } from "src/app/areas/areas.http.service";
import { ApiArea } from "src/app/shared/constants";

@Injectable({
    providedIn: 'root'
})

export class JobCategoryService {
    private apiRoot: string = ApiArea.hrms + "/Employee/JobCategory";
    constructor(private areasHttpService: AreasHttpService) {
    }

    private Source_of_data = new BehaviorSubject<any[]>([]);
    ddl$ = this.Source_of_data.asObservable();

    getDropdown() {
        return this.areasHttpService.promise_get<any[]>((this.apiRoot + "/GetJobCategoryDropdown"), {
            responseType: "json"
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