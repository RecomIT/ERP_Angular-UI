import { Component, OnInit } from "@angular/core";
import { EmployeeHierarchyService } from "../employee-hierarchy.service";
import { UserService } from "src/app/shared/services/user.service";
import { NotifyService } from "src/app/shared/services/notify-service/notify.service";
@Component({
    selector: 'employee-module-my-hierarchy-info',
    templateUrl: './my-hierarchy-info.component.html'
})

export class MyHierarchyInfoComponent implements OnInit {

    constructor(private employeeHierarchyService: EmployeeHierarchyService, private userService: UserService, private notifyService: NotifyService) {
    }

    ngOnInit(): void {
        this.get();
    }

    data: any;
    get() {
        this.employeeHierarchyService.getActiveHierarchy(this.userService.User().EmployeeId).subscribe(response => {
            this.data = response.body;
            console.log("this.data >>>", this.data);
        }, (error) => {
            this.notifyService.handleApiError(error);
        })
    }

}