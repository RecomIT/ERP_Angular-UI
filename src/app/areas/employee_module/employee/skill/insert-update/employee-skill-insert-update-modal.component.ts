import { BsDatepickerConfig } from "ngx-bootstrap/datepicker";
import { EmployeeSkillService } from "../employee-skill.service";
import { UtilityService } from "src/app/shared/services/utility.service";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { CustomModalService } from "src/app/shared/services/custom-modal.service";
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";

@Component({
    selector: 'app-employee-module-employee-skill-insert-update-modal',
    templateUrl: './employee-skill-insert-update-modal.component.html'
})


export class EmployeeSkillInsertUpdateModalComponent implements OnInit {
    @Input() skill: any = { employeeId: 0, id: 0 }
    @Output() closeModalEvent = new EventEmitter<string>();

    @ViewChild('skillModal', { static: true }) skillModal!: ElementRef;
    modalTitle: string = "Add New Skill";

    datePickerConfig: Partial<BsDatepickerConfig> = {};

    constructor(private fb: FormBuilder, // strongly type form build
        public utilityService: UtilityService, // utility 
        public modalService: CustomModalService,
        private employeeSkillService: EmployeeSkillService) { }

    skillForm: FormGroup;

    ngOnInit(): void {
        console.log("modalObj >>>>", this.skill);
        this.modalTitle = this.skill.id > 0 ? "Update Skill Information" : "Add New Skill";
        this.datePickerConfig = Object.assign({}, {
            containerClass: "theme-dark-blue",
            showWeekNumbers: false,
            dateInputFormat: "DD-MMM-YYYY",
            isAnimated: true,
            showClearButton: false,
            showTodayButton: false,
            todayPosition: "left"
        });
        this.skillFormInit();
        if (this.skill.id > 0) {
            this.getEmployeeSkillById()
        }
    }

    skillFormInit() {
        this.skillForm = this.fb.group({
            employeeSkillId: new FormControl(this.skill?.id ?? 0),
            employeeId: new FormControl(this.skill?.employeeId, [Validators.min(1)]),
            trainingName: new FormControl('', [Validators.required]),
            organization: new FormControl('', [Validators.required]),
            location: new FormControl('', [Validators.required]),
            topicCovers: new FormControl('', [Validators.required]),
            fromDate: new FormControl('', [Validators.required]),
            toDate: new FormControl(null, [Validators.required]),
            duration: new FormControl(null, [Validators.required]),
            skillCertificateFilePath: new FormControl(null)
        })

        this.modalService.open(this.skillModal, "lg");
    }

    select2Options = {
        width: "100%",
        containerCssClass: "form-control form-control-sm text-x-small",
        theme: "bootstrap4",
    }


    getEmployeeSkillById() {
        this.employeeSkillService.getById({ employeeId: this.skill.employeeId }).subscribe(response => {
            this.setFormValue(response.body);
        }, (error) => {
            this.utilityService.fail("Something went wrong", "Server Response")
            console.log("error >>>", error)
        })
    }

    setFormValue(response_data: any) {
        this.skillForm.get('trainingName').setValue(response_data.trainingName);
        this.skillForm.get('organization').setValue(response_data.organization);
        this.skillForm.get('location').setValue(response_data.location);
        this.skillForm.get('topicCovers').setValue(response_data.topicCovers);
        this.skillForm.get('fromDate').setValue(new Date(response_data.fromDate));
        this.skillForm.get('toDate').setValue(new Date(response_data.toDate));
        this.skillForm.get('duration').setValue(response_data.duration);
        this.skillForm.get('skillCertificateFilePath').setValue(response_data.skillCertificateFilePath);
    }

    btnSubmit: boolean = false;
    submitForm() {
        if (this.skillForm.valid) {
            this.btnSubmit = true;
            this.employeeSkillService.save(this.skillForm.value).subscribe(response => {
                if (response.status) {
                    this.utilityService.success(response.msg, 'Server Response');
                    this.closeModal('Save Complete');
                }
                this.btnSubmit = false;
            }, (error) => {
                this.btnSubmit = false;
                this.utilityService.fail('Something went wrong', 'Server Response');
            })
        }
        else {
            this.btnSubmit = false;
            this.utilityService.fail("Invaild form", "Site Response");
        }
    }

    closeModal(reason: string) {
        if (this.btnSubmit = false) {
            this.modalService.service.dismissAll(reason);
            this.closeModalEvent.emit(reason); // fair
        }
    }

}