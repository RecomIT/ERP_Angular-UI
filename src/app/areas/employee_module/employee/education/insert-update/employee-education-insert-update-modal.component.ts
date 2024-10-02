import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { BsDatepickerConfig } from "ngx-bootstrap/datepicker";
import { CustomModalService } from "src/app/shared/services/custom-modal.service";
import { HrWebService } from "src/app/shared/services/hr-web.service";
import { UtilityService } from "src/app/shared/services/utility.service";
import { EmployeeEducationService } from "../employee-education.service";
import { NotifyService } from "src/app/shared/services/notify-service/notify.service";

@Component({
    selector: 'employee-module-education-insert-update-modal',
    templateUrl: './employee-education-insert-update-modal.component.html'
})


export class EmployeeEducationInsertUpdateModalComponent implements OnInit {
    @Input() education: any = { employeeId: 0, id: 0 }
    @Output() closeModalEvent = new EventEmitter<string>();

    @ViewChild('educationModal', { static: true }) educationModal!: ElementRef;
    modalTitle: string = "Add New Education";

    datePickerConfig: Partial<BsDatepickerConfig> = this.utilityService.datePickerConfig();

    constructor(private fb: FormBuilder, // strongly type form build
        public utilityService: UtilityService, // utility 
        public modalService: CustomModalService, // modal service 
        private employeeEducationService: EmployeeEducationService,
        private notifyService: NotifyService) { }

    educationForm: FormGroup;

    ngOnInit(): void {
        this.modalTitle = this.education.id > 0 ? "Update Academic Qualification" : "Add Academic Qualification";
        this.loadEducationLevel();
        this.educationFormInit();
        if (this.education.id > 0) {
            this.getEmployeeEducationById()
        }
    }

    educationFormInit() {
        this.educationForm = this.fb.group({
            employeeEducationId: new FormControl(this.education?.id ?? 0),
            employeeId: new FormControl(this.education?.employeeId),
            levelOfEducationId: new FormControl(0, [Validators.min(1)]),
            degreeId: new FormControl(0, [Validators.min(1)]),
            major: new FormControl('', [Validators.required]),
            institutionName: new FormControl('', [Validators.required]),
            result: new FormControl('', [Validators.required]),
            scaleDivisionClass: new FormControl('', [Validators.required]),
            yearOfPassing: new FormControl('', [Validators.required]),
            duration: new FormControl('', [Validators.required])
        })

        this.modalService.open(this.educationModal, "lg");

        this.educationForm.get('levelOfEducationId').valueChanges.subscribe((id) => {
            this.educationForm.get('degreeId').setValue(0);
            this.loadDegrees(id);

            setTimeout(()=>{

            },2000)
        })
    }

    select2Options = this.utilityService.select2Config();


    formErrors = {
        employeeId: '',
        levelOfEducationId: '',
        degreeId: '',
        major: '',
        institutionName: '',
        result: '',
        scaleDivisionClass: '',
        yearOfPassing: '',
        duration: ''
    };

    validationMessages = {
        'employeeId': {
            'min': 'Employee ID is required',
        },
        'levelOfEducationId': {
            'min': 'Education level is required',
        },
        'degreeId': {
            'min': 'Degree is required',
        },
        'major': {
            'required': 'Major is required',
        },
        'institutionName': {
            'required': 'Institution name is required',
        },
        'result': {
            'required': 'Result is required',
        },
        'scaleDivisionClass': {
            'required': 'Scale/Division/Class is required',
        },
        'yearOfPassing': {
            'required': 'Passing year is required',
        },
        'duration': {
            'required': 'Duration year is required',
        },
    }

    logFormErrors(formGroup: FormGroup = this.educationForm) {
        Object.keys(formGroup.controls).forEach((key: string) => {
            const abstractControl = formGroup.get(key);
            this.formErrors[key] = '';
            if (abstractControl && !abstractControl.valid) {
                const messages = this.validationMessages[key];
                for (const errorKey in abstractControl.errors) {
                    //   console.log("key >>>", key);
                    //   console.log("errorKey >>>", errorKey);
                    this.formErrors[key] += messages[errorKey];
                }
            }
        })
    }


    ddlEducationLevel: any = [];
    loadEducationLevel() {
        this.ddlEducationLevel = [];
        this.ddlDegrees = [];
        this.employeeEducationService.loadEducationLevelDropdown();
        this.employeeEducationService.ddl_educationLevel$.subscribe(data => {
            this.ddlEducationLevel = data;
        });
    }

    ddlDegrees: any = [];
    loadDegrees(educationLevelId: number) {
        this.ddlDegrees = [];
        if (educationLevelId > 0) {
            this.employeeEducationService.loadEducationDegreeDropdown(educationLevelId);
            this.employeeEducationService.ddl_educationDegree$.subscribe(data => {
                this.ddlDegrees = data;
            });
        }
    }

    getEmployeeEducationById() {
        this.employeeEducationService.getById({ employeeEducationId: this.education.id, employeeId: this.education.employeeId }).subscribe(response => {
            if ((response.body?.levelOfEducationId ?? 0) > 0) {
                this.setFormValue(response.body);
            }
        }, (error) => {
            this.utilityService.fail("Something went wrong", "Server Response");
        })
    }

    setFormValue(response_data: any) {
        this.educationForm.get('employeeEducationId').setValue(response_data.employeeEducationId);
        this.educationForm.get('employeeId').setValue(response_data.employeeId);
        this.educationForm.get('levelOfEducationId').setValue(response_data.levelOfEducationId);
        this.educationForm.get('degreeId').setValue(response_data.degreeId);
        this.educationForm.get('major').setValue(response_data.major);
        this.educationForm.get('institutionName').setValue(response_data.institutionName);
        this.educationForm.get('result').setValue(response_data.result);
        this.educationForm.get('scaleDivisionClass').setValue(response_data.scaleDivisionClass);
        this.educationForm.get('yearOfPassing').setValue(response_data.yearOfPassing);
        this.educationForm.get('duration').setValue(response_data.duration);
    }

    btnSubmit: boolean = false;
    submit() {
        if (this.educationForm.valid) {
            this.btnSubmit = true;
            this.employeeEducationService.save(this.educationForm.value).subscribe(response => {
                this.btnSubmit = false;
                if (response.status == true) {
                    this.utilityService.success("Saved Successfull", "Server Response", 1000)
                    this.closeModal('Save Complete')
                }
                else {
                    if (response.msg == "Validation Error") {
                        console.log("Validation Error >>>", response.msg);
                    }
                    else {
                        this.utilityService.fail(response.msg, "Server Response", 3000)
                    }
                }
            }, (error) => {
                this.btnSubmit = false;
                this.notifyService.handleApiError(error)
            })
        }
        else {
            this.utilityService.fail("Invaild form", "Site Response");
        }
    }

    closeModal(reason: string) {
        this.modalService.service.dismissAll(reason);
        this.closeModalEvent.emit(reason); // fair
    }

}