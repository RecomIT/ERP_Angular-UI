import { transition, trigger, useAnimation } from "@angular/animations";
import { Component, Input, OnInit } from "@angular/core";
import { fadeIn, fadeInUp, fadeOutLeft, slideInUp } from "ng-animate";
import { CustomModalService } from "src/app/shared/services/custom-modal.service";
import { UserService } from "src/app/shared/services/user.service";
import { UtilityService } from "src/app/shared/services/utility.service";
import { AreasHttpService } from "../../../areas.http.service";
import { EmployeeInfoService } from "../employee-info.service";
import { SharedmethodService } from "src/app/shared/services/shared-method/sharedmethod.service";

@Component({
    selector: 'app-employee-profile',
    templateUrl: './employee-profile.component.html',
    animations: [
        trigger('fadeIn', [transition('void => *', useAnimation(fadeIn, { params: { timing: 0.3 } }))]),
        trigger('slideInUp', [transition('* => *', useAnimation(slideInUp, { params: { timing: 0.5 } }))]),
        trigger('fadeInUp', [transition('void => *', useAnimation(fadeInUp))]),
        trigger('fadeOutLeft', [transition('* => void', useAnimation(fadeOutLeft, { params: { timing: 0.3 } }))]),
    ],
})

export class EmployeeProfileComponent implements OnInit {

    @Input() employeeId: number = 0;
    profile_image: any = null;
    constructor(private areasHttpService: AreasHttpService, private userService: UserService,
        public utilityService: UtilityService, public modalService: CustomModalService, private employeeInfoService: EmployeeInfoService,
        private sharedmethodService: SharedmethodService) {
    }

    profileInfo: any;
    infoComponent: string = "Personal";
    title: string = "Personal Information";

    ngOnInit(): void {
        if (this.employeeId == 0) {
            this.employeeId = this.userService.User().EmployeeId;
        }
        this.getEmployeeProfileInfo();
        this.sharedmethodService.methodCall$.subscribe(() => {
            this.getEmployeeProfileInfo();
        });

    }

    getEmployeeProfileInfo() {
        this.employeeInfoService.getProfileInfo({ id: this.employeeId }).subscribe(response => {
            this.profileInfo = response.body
            this.profile_image = 
            { 
                imagePath: (this.profileInfo.photoPath != null && this.profileInfo.photoPath != '') ? (this.areasHttpService.imageRoot + this.profileInfo.photoPath) : '', 
                gender: 'Male', id: this.employeeId }

                console.log("getProfileInfo <<< ", this.profile_image);
        }, (error) => {
            this.utilityService.httpErrorHandler(error);
        })
    }


    changeProfile() {

    }


    infoComponent_changed() {
        if (this.infoComponent == 'Personal') {
            this.title = 'Personal Information'
        }
        else if (this.infoComponent == 'Education') {
            this.title = "Academic Qualification's"
        }
        else if (this.infoComponent == 'Training') {
            this.title = 'Training/Skill Information'
        }
        else if (this.infoComponent == 'Experiance') {
            this.title = 'Experiance Information'
        }
    }

}