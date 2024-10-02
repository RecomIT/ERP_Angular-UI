import { Component, Input, OnInit } from "@angular/core";
import { SharedmethodService } from "src/app/shared/services/shared-method/sharedmethod.service";
import { UserService } from "src/app/shared/services/user.service";

@Component({
    selector:'app-employee-module-profile-image',
    templateUrl:'./profile-image.component.html'
})

export class ProfileImageComponent implements OnInit{
    @Input() data : any={imagePath:'', gender:'', id:0};
    constructor(
        private sharedmethodService: SharedmethodService,
        private userService: UserService
    ){}
    showImageUploder: boolean=true;
    ngOnInit(): void {
        console.log('data >>>', this.data);
        this.showImageUploder = this.data.id == this.userService.User().EmployeeId;
    }

    modalObj: any= null;
    showModal: boolean = false;
    openModal() {
        this.showModal = true;
    }

    closeModal(reason: string) {
        this.showModal = false;
        if (reason == 'Save Complete') {
        }
    }
}