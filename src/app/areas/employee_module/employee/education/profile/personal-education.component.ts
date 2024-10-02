import { FormBuilder } from "@angular/forms";
import { Component, Input, OnInit } from "@angular/core";
import { transition, trigger, useAnimation } from "@angular/animations";
import { bounceIn, fadeIn, fadeInRight, slideInUp } from "ng-animate";
import { BsDatepickerConfig } from "ngx-bootstrap/datepicker";
import { ApiArea, ApiController } from "src/app/shared/constants";
import { CustomModalService } from "src/app/shared/services/custom-modal.service";
import { UtilityService } from "src/app/shared/services/utility.service";
import { AreasHttpService } from "../../../../areas.http.service";
import { EmployeeEducationService } from "../employee-education.service";
import { error } from "console";

@Component({
    selector: 'app-employee-module-personal-education',
    templateUrl: './personal-education.component.html',
    animations: [
        trigger('slideInUp', [transition('* => *', useAnimation(slideInUp, { params: { timing: 0.5 } }))]),
        trigger('fadeIn', [transition('void => *', useAnimation(fadeIn, { params: { timing: 0.3 } }))]),
        trigger('fadeInRight', [transition('void => *', useAnimation(fadeInRight, { params: { timing: 0.5 } }))]),
        trigger('bounceIn', [transition('void => *', useAnimation(bounceIn, { params: { timing: 1 } }))]),
    ]
})

export class PersonalEducationComponent implements OnInit {
    @Input() employeeId: number = null;
    datePickerConfig: Partial<BsDatepickerConfig> = {};
    constructor(private utilityService: UtilityService, private fb: FormBuilder,
        public modalService: CustomModalService, private areasHttpService: AreasHttpService,
        private employeeEducationService : EmployeeEducationService) {

    }
    ngOnInit(): void {
        this.getEmployeeEducations();
    }

    listOfEmployeeEducation: any[] = null;

    getEmployeeEducations() {
        this.employeeEducationService.get({employeeId: this.employeeId}).subscribe(response=>{
            this.listOfEmployeeEducation = response.body;
        },(error)=>{
            this.utilityService.httpErrorHandler(error);
        })
    }

    modalObj: any= null;
    showModal: boolean = false;
    openModal(id: number) {
        this.modalObj = {employeeId: this.employeeId, id : id};
        this.showModal = true;
    }

    closeModal(reason: string) {
        this.showModal = false;
        this.modalObj = null;
        if (reason == 'Save Complete') {
            this.getEmployeeEducations();
        }
    }

}