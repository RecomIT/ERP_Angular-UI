import { Component, OnInit } from "@angular/core";
import { UserService } from "src/app/shared/services/user.service";
import { UtilityService } from "src/app/shared/services/utility.service";
import { AllowanceNameService } from "./allowance-name.service";
import { transition, trigger, useAnimation } from "@angular/animations";
import { bounceIn, fadeIn, fadeInRight, slideInUp } from "ng-animate";

@Component({
    selector:'app-payroll-salary-module-allowance-head-name-config',
    templateUrl:'./allowance-head-name-config.component.html',
    animations: [
        trigger('slideInUp', [transition('* => *', useAnimation(slideInUp, { params: { timing: 0.5 } }))]),
        trigger('fadeIn', [transition('void => *', useAnimation(fadeIn, { params: { timing: 0.3 } }))]),
        trigger('fadeInRight', [transition('void => *', useAnimation(fadeInRight, { params: { timing: 0.5 } }))]),
        trigger('bounceIn', [transition('void => *', useAnimation(bounceIn, { params: { timing: 1 } }))]),
    ],
})
export class AllowanceHeadNameConfigComponent implements OnInit{

    constructor(private userService: UserService, private utilityService: UtilityService, private allowanceNameService: AllowanceNameService){
    }

    privilege: any = this.userService.getPagePrivileges("AllowanceHeadNameConfigComponent");

    User(){
        return this.userService.getUser();
    }

    ngOnInit() {
        console.log("privilege >>>", this.privilege);
    }

    get(){
        
    }

    showAllowanceModal: boolean=false;
    id: number=0;
    showModal(id:any){
        this.id = id;
        this.showAllowanceModal = true;
    }

    hideModal(reason: any){
        this.showAllowanceModal = false;
    }
}