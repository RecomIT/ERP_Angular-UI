import { ToastrService } from "ngx-toastr";
import { Component, Input, OnInit } from "@angular/core";
import { BsDatepickerConfig } from "ngx-bootstrap/datepicker";
import { EmployeeSkillService } from "../employee-skill.service";
import { UtilityService } from "src/app/shared/services/utility.service";
import { CustomModalService } from "src/app/shared/services/custom-modal.service";

@Component({
    selector:'app-employee-module-employee-skill-list',
    templateUrl:'./employee-skill-list.component.html'
})


export class EmployeeSkillListComponent implements OnInit{
    @Input() inputEmployeeId: any = 0;
    employeeId: number = 0;

    constructor(
        public toastr: ToastrService,
        public utilityService: UtilityService,
        public modalService: CustomModalService,
        private employeeSkillService: EmployeeSkillService){}

    datePickerConfig: Partial<BsDatepickerConfig> = {};
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
        this.getEmployeeSkills();
    }

    listOfEmployeeSkill: any[]=null;

    getEmployeeSkills() {
        this.employeeSkillService.get({ employeeId: this.employeeId}).subscribe(response=>{
            this.listOfEmployeeSkill = response.body;
        },(error)=>{
            this.toastr.error("Something went wrong", "Server Response", { timeOut: 1000 })
            console.log("error >>>",error)
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
            this.getEmployeeSkills();
        }
    }

}