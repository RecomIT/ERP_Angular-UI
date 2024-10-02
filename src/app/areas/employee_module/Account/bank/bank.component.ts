import { Component, OnInit } from "@angular/core";
import { UtilityService } from "src/app/shared/services/utility.service";
import { transition, trigger, useAnimation } from "@angular/animations";
import { bounceIn, fadeIn, fadeInRight, slideInUp } from "ng-animate";
import { BankService } from "./bank.service";

@Component({
    selector: 'employee-module-bank',
    templateUrl: './bank.component.html',
    animations: [
        trigger('slideInUp', [transition('* => *', useAnimation(slideInUp, { params: { timing: 0.5 } }))]),
        trigger('fadeIn', [transition('void => *', useAnimation(fadeIn, { params: { timing: 0.3 } }))]),
        trigger('fadeInRight', [transition('void => *', useAnimation(fadeInRight, { params: { timing: 0.5 } }))]),
        trigger('bounceIn', [transition('void => *', useAnimation(bounceIn, { params: { timing: 1 } }))]),
    ]
})
export class BankComponent implements OnInit {

    constructor(private utilityService: UtilityService, private bankService: BankService) {
    }

    ngOnInit(): void {
        this.get();
       
    }

    list: any[] = [];

    list_loading_label: string = null;

    get() {
        this.bankService.get({}).subscribe((response) => {
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