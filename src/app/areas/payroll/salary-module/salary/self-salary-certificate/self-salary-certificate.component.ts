import { Component, OnInit } from "@angular/core";
import { UserService } from "src/app/shared/services/user.service";

@Component({
    selector:'app-self-salry-certificate',
    templateUrl:'./self-salary-certificate.component.html'
})

export class SelfSalaryCertificateComponent implements OnInit{
    constructor(private userService: UserService){}
    ngOnInit(): void {
     
    }

    pagePrivilege: any= this.userService.getPrivileges();

}