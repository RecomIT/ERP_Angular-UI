import { Component, Input, OnInit } from "@angular/core";
import { BsDatepickerConfig } from "ngx-bootstrap/datepicker";
import { transition, trigger, useAnimation } from "@angular/animations";
import { bounceIn, fadeIn, fadeInRight, slideInUp } from "ng-animate";
import { CustomModalService } from "src/app/shared/services/custom-modal.service";
import { UtilityService } from "src/app/shared/services/utility.service";
import { AreasHttpService } from "../../../../areas.http.service";
import { EmployeeSkillService } from "../employee-skill.service";


@Component({
    selector: 'app-employee-module-personal-skill',
    templateUrl: './personal-skill.component.html',
    animations: [
        trigger('slideInUp', [transition('* => *', useAnimation(slideInUp, { params: { timing: 0.5 } }))]),
        trigger('fadeIn', [transition('void => *', useAnimation(fadeIn, { params: { timing: 0.3 } }))]),
        trigger('fadeInRight', [transition('void => *', useAnimation(fadeInRight, { params: { timing: 0.5 } }))]),
        trigger('bounceIn', [transition('void => *', useAnimation(bounceIn, { params: { timing: 1 } }))]),
    ]
})

export class PersonalSkillComponent implements OnInit {
    @Input() employeeId: number = 0;
    datePickerConfig: Partial<BsDatepickerConfig> = this.utilityService.datePickerConfig();
    constructor(private utilityService: UtilityService,
        public modalService: CustomModalService, private areasHttpService: AreasHttpService,
        private employeeSkillService: EmployeeSkillService) {
    }

    ngOnInit(): void {
        this.getEmployeeSkills();
    }

    listOfEmployeeSkill: any[] = null;

    getEmployeeSkills() {
        this.employeeSkillService.get({ employeeId: this.employeeId }).subscribe(response => {
            this.listOfEmployeeSkill = response.body
        }, (error) => {
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
            this.getEmployeeSkills();
        }
    }
}