import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/shared/services/user.service';
import { UtilityService } from 'src/app/shared/services/utility.service';

@Component({
  selector: 'app-salary-module-wallet-payment',
  templateUrl: './wallet-payment.component.html'
})
export class WalletPaymentComponent implements OnInit {

  constructor(private utilityService: UtilityService, private userService: UserService){

  }
  pagePrivilege: any = this.userService.getPrivileges();
  ngOnInit(): void {
  }
}
