import { Component, OnInit } from "@angular/core";
import { DesignationService } from "./designation.service";
import { utils } from "xlsx";
import { UtilityService } from "src/app/shared/services/utility.service";
import { transition, trigger, useAnimation } from "@angular/animations";
import { bounceIn, fadeIn, fadeInRight, slideInUp } from "ng-animate";

@Component({
    selector: 'app-hr-employee-module-designation',
    templateUrl: './designation.component.html',
    animations: [
        trigger('slideInUp', [transition('* => *', useAnimation(slideInUp, { params: { timing: 0.5 } }))]),
        trigger('fadeIn', [transition('void => *', useAnimation(fadeIn, { params: { timing: 0.3 } }))]),
        trigger('fadeInRight', [transition('void => *', useAnimation(fadeInRight, { params: { timing: 0.5 } }))]),
        trigger('bounceIn', [transition('void => *', useAnimation(bounceIn, { params: { timing: 1 } }))]),
    ]
})
export class DesignationComponent implements OnInit {

    constructor(private utilityService: UtilityService, private designationService: DesignationService) {
    }

    ngOnInit(): void {
        this.get();
       
    }

    list: any[] = [];

    list_loading_label: string = null;

    get() {
        this.designationService.get({}).subscribe((response) => {
            this.list = response;
            this.list_loading_label = this.list.length > 0 ? "" : 'No records found';
        }, (error) => {
            this.utilityService.fail("Something went wrong", "Server Response");
        })
    }

    isShowingInsertUpdateModal: boolean = false;
    itemId: number = 0;

    showModal(id: number) {
        console.log("id >>>", id);
        this.isShowingInsertUpdateModal = true;
        this.itemId = id;
    }

    closeModal(reason: any) {
        this.isShowingInsertUpdateModal = false;
        this.itemId = 0;
        if (this.utilityService.SuccessfullySaved) {
            this.get();
        }
    }

}