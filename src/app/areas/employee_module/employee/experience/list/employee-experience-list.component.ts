import { Component, Input, OnInit } from "@angular/core";
import { BsDatepickerConfig } from "ngx-bootstrap/datepicker";
import { ToastrService } from "ngx-toastr";
import { CustomModalService } from "src/app/shared/services/custom-modal.service";
import { UtilityService } from "src/app/shared/services/utility.service";
import { AreasHttpService } from "../../../../areas.http.service";
import { EmployeeExperienceService } from "../employee-experience.service";

@Component({
    selector: 'app-employee-module-employee-experience-list',
    templateUrl: './employee-experience-list.component.html'
})

export class EmployeeExperienceListComponent implements OnInit {

    @Input() inputEmployeeId: any = 0;
    employeeId: number = 0;

    datePickerConfig: Partial<BsDatepickerConfig> = {};

    constructor(
        public toastr: ToastrService,
        public utilityService: UtilityService,
        public modalService: CustomModalService,
        public employeeExperienceService : EmployeeExperienceService) { }

    ngOnInit(): void {
        this.employeeId = this.inputEmployeeId;
        this.datePickerConfig = Object.assign({}, {
            containerClass: "theme-dark-blue",
            showWeekNumbers: false,
            dateInputFormat: "DD-MMM-YYYY",
            isAnimated: true,
            showClearButton: false,
            showTodayButton: false,
            todayPosition: "left"
        });
        this.getEmployeeExperiences();
    }

    listOfEmployeeExperience: any[]=null;

    getEmployeeExperiences() {
        this.employeeExperienceService.get({employeeId: this.inputEmployeeId}).subscribe(response=>{
            console.log("response >>>", response);
            this.listOfEmployeeExperience = response.body as any[];
        },(error)=>{
            console.log("error >>>", error);
            this.toastr.error('Something wenr wrong','Server Response');
        })
    }

    modalObj: any= null;
    showInsertUpdateModal: boolean = false;
    openModal(id: number) {
        console.log("employeeId "+this.inputEmployeeId+" id "+id);
        this.modalObj = {employeeId: this.inputEmployeeId, id : id};
        this.showInsertUpdateModal = true;
    }

    closeModal(reason: string) {
        this.showInsertUpdateModal = false;
        this.modalObj = null;
        if (reason == 'Save Complete') {
            this.getEmployeeExperiences();
        }
    }
}