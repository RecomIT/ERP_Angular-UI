import { transition, trigger, useAnimation } from "@angular/animations";
import { Component, OnInit } from "@angular/core";
import { bounceIn, fadeIn, fadeInRight, slideInUp } from "ng-animate";
import { UserService } from "src/app/shared/services/user.service";
import { UtilityService } from "src/app/shared/services/utility.service";

@Component({
    selector:'app-payroll-supplementary-payment',
    templateUrl:'./supplementary-payment.component.html',
    animations: [
        trigger('slideInUp', [transition('* => *', useAnimation(slideInUp, { params: { timing: 0.5 } }))]),
        trigger('fadeIn', [transition('void => *', useAnimation(fadeIn, { params: { timing: 0.3 } }))]),
        trigger('fadeInRight', [transition('void => *', useAnimation(fadeInRight, { params: { timing: 0.5 } }))]),
        trigger('bounceIn', [transition('void => *', useAnimation(bounceIn, { params: { timing: 1 } }))]),
      ]
})


export class SupplementaryPaymentComponent implements OnInit{
    
    constructor(private utilityService: UtilityService, private userService: UserService){

    }
    pagePrivilege: any = this.userService.getPrivileges();
    ngOnInit(): void {
    }

}