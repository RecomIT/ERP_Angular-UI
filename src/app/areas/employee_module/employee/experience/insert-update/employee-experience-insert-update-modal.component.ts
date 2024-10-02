import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { BsDatepickerConfig } from "ngx-bootstrap/datepicker";
import { CustomModalService } from "src/app/shared/services/custom-modal.service";
import { UtilityService } from "src/app/shared/services/utility.service";
import { EmployeeExperienceService } from "../employee-experience.service";

@Component({
    selector: 'app-employee-module-experience-insert-update-modal',
    templateUrl: './employee-experience-insert-update-modal.component.html'
})


export class EmployeeExperienceInsertUpdateModalComponent implements OnInit {
    @Input() experience: any = { employeeId: 0, id: 0 }
    @Output() closeModalEvent = new EventEmitter<string>();

    @ViewChild('experienceModal', { static: true }) experienceModal!: ElementRef;
    modalTitle: string = "Add New Experience";

    datePickerConfig: Partial<BsDatepickerConfig> = {};

    constructor(private fb: FormBuilder, // strongly type form build
        private employeeExperienceService: EmployeeExperienceService,
        public utilityService: UtilityService, // utility 
        public modalService: CustomModalService) { }

    experienceForm: FormGroup;

    ngOnInit(): void {
        console.log("experience modalObj >>>>", this.experience);
        this.modalTitle = this.experience.id > 0 ? "Update Experience Information" : "Add New Experience";
        this.datePickerConfig = Object.assign({}, {
            containerClass: "theme-dark-blue",
            showWeekNumbers: false,
            dateInputFormat: "DD-MMM-YYYY",
            isAnimated: true,
            showClearButton: false,
            showTodayButton: false,
            todayPosition: "left"
        });

        this.experienceFormInit();

        if (this.experience.id > 0) {
            this.getEmployeeExperienceById()
        }
    }

    experienceFormInit() {
        this.experienceForm = this.fb.group({
            employeeExperienceId: new FormControl(this.experience?.id ?? 0),
            employeeId: new FormControl(this.experience?.employeeId),
            exCompanyname: new FormControl('', [Validators.required, Validators.maxLength(200)]),
            exCompanyBusinees: new FormControl('', [Validators.required, Validators.maxLength(200)]),
            exCompanyLocation: new FormControl('', [Validators.required, Validators.maxLength(300)]),
            exCompanyDepartment: new FormControl('', [Validators.required, Validators.maxLength(200)]),
            exCompanyDesignation: new FormControl('', [Validators.required, Validators.maxLength(200)]),
            exCompanyExperience: new FormControl('', [Validators.required, Validators.maxLength(200)]),
            employmentFrom: new FormControl(null, [Validators.required]),
            employmentTo: new FormControl(null, [Validators.required])
        })

        this.modalService.open(this.experienceModal, "lg");

        this.experienceForm.get('employeeExperienceId').valueChanges.subscribe((id) => {
            this.getEmployeeExperienceById();
        })
    }

    select2Options = {
        width: "100%",
        containerCssClass: "form-control form-control-sm text-x-small",
        theme: "bootstrap4",
    }


    getEmployeeExperienceById() {
        this.employeeExperienceService.getById({ employeeExperienceId: this.experience.id, employeeId: this.experience.employeeId }).subscribe(response => {
            this.setFormValue(response.body);
        }, (error) => {
            this.utilityService.fail('Something went wrong', 'Server Response');
            console.log('error >>>', error);
        })


    }

    setFormValue(response_data: any) {
        //this.experienceForm.get('employeeExperienceId').setValue(response_data.employeeExperienceId);
        //this.experienceForm.get('employeeId').setValue(response_data.employeeId);
        this.experienceForm.get('exCompanyname').setValue(response_data.exCompanyname);
        this.experienceForm.get('exCompanyBusinees').setValue(response_data.exCompanyBusinees);
        this.experienceForm.get('exCompanyLocation').setValue(response_data.exCompanyLocation);
        this.experienceForm.get('exCompanyDepartment').setValue(response_data.exCompanyLocation);
        this.experienceForm.get('exCompanyDesignation').setValue(response_data.exCompanyDesignation);
        this.experienceForm.get('exCompanyExperience').setValue(response_data.exCompanyExperience);
        this.experienceForm.get('employmentFrom').setValue(new Date(response_data.employmentFrom));
        this.experienceForm.get('employmentTo').setValue(new Date(response_data.employmentTo));
    }

    btnSubmit: boolean = false;
    submitForm() {
        if (this.experienceForm.valid) {
            this.btnSubmit = true;
            console.log("this.experienceForm.value >>>", this.experienceForm.value);
            this.employeeExperienceService.save(this.experienceForm.value).subscribe(response => {
                if (response.status) {
                    this.utilityService.success(response.msg, 'Server Response');
                    this.closeModal('Save Complete')
                }
                else {
                    this.utilityService.fail(response.msg, 'Server Response');
                }
                this.btnSubmit = false;
            }, (error) => {
                this.utilityService.fail('Something went went', 'Server Response')
                this.btnSubmit = false;
            })
        }
        else {
            this.btnSubmit = false;
            this.utilityService.fail("Invaild form", "Site Response");
        }
    }

    closeModal(reason: string) {
        if (this.btnSubmit == false) {
            this.modalService.service.dismissAll(reason);
            this.closeModalEvent.emit(reason); // fair
        }
    }

}