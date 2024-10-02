import { Component, OnInit } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { UserService } from "src/app/shared/services/user.service";
import { UtilityService } from "src/app/shared/services/utility.service";

@Component({
    selector: 'app-salary-module-deposit-payment-history',
    templateUrl: './deposit-payment-history.component.html'
})

export class DepositPaymentHistoryComponent implements OnInit {

    ngOnInit(): void {
    }

    constructor(
        private fb: FormBuilder, 
        private userService: UserService,
        private utilityService: UtilityService,
    ) { }

    
    
}