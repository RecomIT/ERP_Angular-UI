import { Component, Input, OnInit } from "@angular/core";
import { transition, trigger, useAnimation } from "@angular/animations";
import { bounceIn, fadeIn, fadeInRight, slideInUp } from "ng-animate";
import { CustomModalService } from "src/app/shared/services/custom-modal.service";
import { UtilityService } from "src/app/shared/services/utility.service";
import { EmployeeExperienceService } from "../employee-experience.service";

@Component({
    selector: 'app-employee-module-personal-experience',
    templateUrl: './personal-experience.component.html',
    animations: [
        trigger('slideInUp', [transition('* => *', useAnimation(slideInUp, { params: { timing: 0.5 } }))]),
        trigger('fadeIn', [transition('void => *', useAnimation(fadeIn, { params: { timing: 0.3 } }))]),
        trigger('fadeInRight', [transition('void => *', useAnimation(fadeInRight, { params: { timing: 0.5 } }))]),
        trigger('bounceIn', [transition('void => *', useAnimation(bounceIn, { params: { timing: 1 } }))]),
    ]
})


export class PersonalExperienceComponent implements OnInit {
    @Input() employeeId: number = 0;
    constructor(
        private utilityService: UtilityService,
        public modalService: CustomModalService,
        private employeeExperienceService : EmployeeExperienceService) {

    }

    ngOnInit(): void {
        this.getEmployeeExperiences();
    }

    listOfEmployeeExperience: any[] = null;

    getEmployeeExperiences() {
        this.employeeExperienceService.get({employeeId: this.employeeId}).subscribe(response=>{
            this.listOfEmployeeExperience = response.body;
        },(error)=>{
            this.utilityService.httpErrorHandler(error);
        })
    }

    modalObj: any = null;
    showModal: boolean = false;
    openModal(id: number) {
        this.modalObj = { employeeId: this.employeeId, id: id };
        this.showModal = true;
    }

    closeModal(reason: string) {
        this.showModal = false;
        this.modalObj = null;
        if (reason == 'Save Complete') {
            this.getEmployeeExperiences();
        }
    }

}