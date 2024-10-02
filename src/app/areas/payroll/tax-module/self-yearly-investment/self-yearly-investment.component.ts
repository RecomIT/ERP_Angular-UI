import { transition, trigger, useAnimation } from "@angular/animations";
import { Component, OnInit } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { bounceIn, fadeIn, fadeInRight, slideInUp } from "ng-animate";
import { CustomModalService } from "src/app/shared/services/custom-modal.service";
import { UserService } from "src/app/shared/services/user.service";
import { UtilityService } from "src/app/shared/services/utility.service";
import { EmployeeYearlyInvestmentService } from "../employee-yearly-investment/employee-yearly-investment.service";

@Component({
    selector: 'app-payroll-self-yearly-investment',
    templateUrl: './self-yearly-investment.component.html',
    animations: [
        trigger('slideInUp', [transition('* => *', useAnimation(slideInUp, { params: { timing: 0.5 } }))]),
        trigger('fadeIn', [transition('void => *', useAnimation(fadeIn, { params: { timing: 0.3 } }))]),
        trigger('fadeInRight', [transition('void => *', useAnimation(fadeInRight, { params: { timing: 0.5 } }))]),
        trigger('bounceIn', [transition('void => *', useAnimation(bounceIn, { params: { timing: 1 } }))])
    ],
})

export class SelfYearlyInvestmentComponent implements OnInit {

    constructor(private utilityService: UtilityService, private fb: FormBuilder,
        private userService: UserService, public modalService: CustomModalService, private employeeYarlyInvestmentService: EmployeeYearlyInvestmentService) { }

    pagePrivilege: any = this.userService.getPrivileges();
    ngOnInit(): void {
        this.getEmployeeYearlyInvestments();
    }

    logger(msg: any, options: any) {
        this.utilityService.consoleLog(msg, options);
    }

    User() {
        return this.userService.User();
    }

    list: any[] = [];

    getEmployeeYearlyInvestments() {
        this.employeeYarlyInvestmentService.getEmployeeYearlyInvestments({ employeeId: this.User().EmployeeId.toString() }).subscribe(response => {
            console.log("response >>>",response);
            this.list = response.body;
            console.log("this.list >>>", this.list);
        }, error => {
            this.utilityService.fail('Data retrival Issue', 'Server Response');
        })
    }

    showInvestmentInsertModal: boolean = false;
    showInvestmentModal(id: any) {
        this.showInvestmentInsertModal = true;
    }

    closeModal(reason: any) {
        this.showInvestmentInsertModal = false;
        if (reason == 'Save Successful') {
            this.getEmployeeYearlyInvestments();
        }
    }

}