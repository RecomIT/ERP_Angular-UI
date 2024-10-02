import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { UtilityService } from "src/app/shared/services/utility.service";
import { SectionService } from "./section.service";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { CustomModalService } from "src/app/shared/services/custom-modal.service";
import { DepartmentService } from "../department/department.service";


@Component({
    selector: 'employee-module-section-insert-update-modal',
    templateUrl: './section-insert-update-modal.component.html'
})

export class SectionInsertUpdateModalComponent implements OnInit {

    @Input() id: number = 0;
    @Output() closeModalEvent = new EventEmitter<string>();
    @ViewChild('sectionModal', { static: true }) sectionModal!: ElementRef;

    modalTitle: string = "Add New Section";

    constructor(
        private fb: FormBuilder,
        private utilityService: UtilityService,
        private sectionService: SectionService,
        public modalService: CustomModalService,
        private departmentService : DepartmentService) {
    }

    ngOnInit(): void {
        this.formInit();
        this.openModal();
        this.loadDropdown();
        if (this.id > 0) {
            this.getById();
            this.modalTitle = this.id > 0 ? "Update Section" : "Add New Section";
        }        
    }

    // To use dropdown
    ddlDepartment: any;
    // this.loadDropdown(); call in ngOnInit

    loadDropdown(){
        this.departmentService.loadDepartmentDropdown();
        this.ddlDepartment = this.departmentService.ddl$;
        console.log("department dropdown list >>>", this.ddlDepartment);
    }

    info: any;
    getById() {
        this.sectionService.getById({ sectionId: this.id }).subscribe((response) => {
            this.load_value(response);
        }, (error) => {
            this.utilityService.fail("Something went wrong", "Server Wrong");
        })
    }

    sectionForm: FormGroup;

    formErrors = {
        'sectionName': '',
        'departmentId': '',
        'shortName': '',
    }

    validationMessages = {
        'sectionName': {
            'required': 'Field is required',
            'maxlength': 'Max length is 100',
            'minlength': 'Min length is 2'
        },
        'shortName':{
            'maxlength': 'Max length is 100',
        },
        'departmentId':{
            'min': 'Field is required'
        }
    }
    openModal() {
        this.modalService.open(this.sectionModal, "sm");
    }


    formInit() {
        this.sectionForm = this.fb.group({
            sectionId: new FormControl(this.id),
            sectionName: new FormControl(this.info?.sectionName, [Validators.required, Validators.maxLength(100), Validators.minLength(2)]),
            shortName : new FormControl('',[Validators.maxLength(100)]),
            departmentId : new FormControl(0,[Validators.min(1)])
        })
    }

    load_value(value: any) {
        this.sectionForm.get('sectionName').setValue(value.sectionName);
        this.sectionForm.get('sectionId').setValue(value.sectionId);
        this.sectionForm.get('departmentId').setValue(value.departmentId);
        this.sectionForm.get('shortName').setValue(value.shortName);
    }

    logFormErrors(formGroup: FormGroup = this.sectionForm) {
        Object.keys(formGroup.controls).forEach((key: string) => {
            const abstractControl = formGroup.get(key);
            this.formErrors[key] = '';
            if (abstractControl && !abstractControl.valid && (abstractControl.touched || abstractControl.dirty)) {
                const messages = this.validationMessages[key];
                for (const errorKey in abstractControl.errors) {
                    //console.log("errorKey >>> ", errorKey)
                    this.formErrors[key] += messages[errorKey];
                }
            }
            // if (key == 'sectionName') {
            //     const messages = this.validationMessages[key];
            // }
        })
    }

    btnSubmit: boolean = false;
    server_errors: any;
    submit() {
        if (this.sectionForm.valid) {
            //console.log("this.sectionForm >>>", this.sectionForm.value)
            this.sectionService.save(this.sectionForm.value).subscribe((reasponse) => {
                //console.log("reasponse >>>", reasponse);
                if (reasponse.body?.status) {
                    this.utilityService.success(reasponse?.msg, "Server Response");
                    this.closeModal(this.utilityService.SuccessfullySaved);
                }
                else {
                    if (reasponse.body?.msg == "Validation Error") {
                        this.server_errors = JSON.parse(reasponse.body?.errorMsg)
                        //console.log("this.server_errors >>>", this.server_errors);
                    }
                    else {
                        this.utilityService.fail(reasponse?.msg, "Server Response");
                    }
                }
            }, (error) => {
                this.utilityService.fail("Something went wrong");
            })
        }
        else {
            this.utilityService.fail("Invalid Form Submission", "Site Response");
        }
    }


    closeModal(reason: any) {
        this.closeModalEvent.emit(reason);
        this.modalService.service.dismissAll(reason);
    }
}