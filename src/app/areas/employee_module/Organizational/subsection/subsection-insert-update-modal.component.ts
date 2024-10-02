import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { UtilityService } from "src/app/shared/services/utility.service";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { CustomModalService } from "src/app/shared/services/custom-modal.service";
import { SectionService } from "../section/section.service";
import { SubSectionService } from "./subsection.service";


@Component({
    selector: 'employee-module-subSection-insert-update-modal',
    templateUrl: './subsection-insert-update-modal.component.html'
})

export class SubSectionInsertUpdateModalComponent implements OnInit {

    @Input() id: number = 0;
    @Output() closeModalEvent = new EventEmitter<string>();
    @ViewChild('sectionModal', { static: true }) sectionModal!: ElementRef;

    modalTitle: string = "Add New SubSection";

    constructor(
        private fb: FormBuilder,
        private utilityService: UtilityService,
        private subSectionService: SubSectionService,
        public modalService: CustomModalService,
        private sectionService : SectionService) {
    }

    ngOnInit(): void {
        this.formInit();
        this.openModal();
        this.loadDropdown();
        if (this.id > 0) {
            this.getById();
            this.modalTitle = this.id > 0 ? "Update SubSection" : "Add New SubSection";
        }        
    }

    // To use dropdown
    ddlSubSection: any;
    // this.loadDropdown(); call in ngOnInit

    loadDropdown(){
        this.sectionService.loadSectionDropdown({});
        this.ddlSubSection = this.sectionService.ddl$;
        console.log("grade dropdown list >>>", this.ddlSubSection);
    }

    info: any;
    getById() {
        this.subSectionService.getById({ subSectionId: this.id }).subscribe((response) => {
            this.load_value(response);
        }, (error) => {
            this.utilityService.fail("Something went wrong", "Server Wrong");
        })
    }

    subSectionForm: FormGroup;

    formErrors = {
        'subSectionName': '',
        'sectionId': '',
        'shortName': '',
    }

    validationMessages = {
        'subSectionName': {
            'required': 'Field is required',
            'maxlength': 'Max length is 100',
            'minlength': 'Min length is 2'
        },
        'shortName':{
            'maxlength': 'Max length is 100',
        },
        'sectionId':{
            'min': 'Field is required'
        }
    }

    openModal() {
        this.modalService.open(this.sectionModal, "sm");
    }

    formInit() {
        this.subSectionForm = this.fb.group({
            subSectionId: new FormControl(this.id),
            subSectionName: new FormControl(this.info?.subSectionName, [Validators.required, Validators.maxLength(100), Validators.minLength(2)]),
            shortName : new FormControl('',[Validators.maxLength(100)]),
            sectionId : new FormControl(0,[Validators.min(1)])
        })
    }

    load_value(value: any) {
        this.subSectionForm.get('subSectionName').setValue(value.subSectionName);
        this.subSectionForm.get('subSectionId').setValue(value.subSectionId);
        this.subSectionForm.get('shortName').setValue(value.shortName);
        this.subSectionForm.get('sectionId').setValue(value.sectionId);
    }

    logFormErrors(formGroup: FormGroup = this.subSectionForm) {
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
        if (this.subSectionForm.valid) {
            //console.log("this.sectionForm >>>", this.sectionForm.value)
            this.subSectionService.save(this.subSectionForm.value).subscribe((reasponse) => {
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