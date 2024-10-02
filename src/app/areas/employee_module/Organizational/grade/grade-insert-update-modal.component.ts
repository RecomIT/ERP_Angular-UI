import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { UtilityService } from "src/app/shared/services/utility.service";
import { GradeService } from "./grade.service";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { CustomModalService } from "src/app/shared/services/custom-modal.service";

@Component({
    selector: 'employee-module-grade-insert-update-modal',
    templateUrl: './grade-insert-update-modal.component.html'
})

export class GradeInsertUpdateModalComponent implements OnInit {

    @Input() id: number = 0;
    @Output() closeModalEvent = new EventEmitter<string>();
    @ViewChild('gradeModal', { static: true }) gradeModal!: ElementRef;

    modalTitle: string = "Add New Grade";

    constructor(
        private fb: FormBuilder,
        private utilityService: UtilityService,
        private gradeService: GradeService,
        public modalService: CustomModalService) {
    }

    ngOnInit(): void {
        this.formInit();
        this.openModal();
        if (this.id > 0) {
            this.getById();
            this.modalTitle = this.id > 0 ? "Update Grade" : "Add New Grade";
        }
    }

    info: any;
    getById() {
        this.gradeService.getById({ gradeId: this.id }).subscribe((response) => {
            this.load_value(response);
        }, (error) => {
            this.utilityService.fail("Something went wrong", "Server Wrong");
        })
    }

    gradeForm: FormGroup;

    formErrors = {
        'gradeName': '',
    }

    validationMessages = {
        'gradeName': {
            'required': 'Field is required',
            'maxlength': 'Max length is 100',
            'minlength': 'Min length is 2'
        }
    }
    openModal() {
        this.modalService.open(this.gradeModal, "sm");
    }


    formInit() {
        this.gradeForm = this.fb.group({
            gradeId: new FormControl(this.id),
            gradeName: new FormControl(this.info?.gradeName, [Validators.required, Validators.maxLength(100), Validators.minLength(2)]),
        })
    }

    load_value(value: any) {
        this.gradeForm.get('gradeName').setValue(value.gradeName);
    }

    logFormErrors(formGroup: FormGroup = this.gradeForm) {
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
            // if (key == 'gradeName') {
            //     const messages = this.validationMessages[key];
            // }
        })
    }

    btnSubmit: boolean = false;
    server_errors: any;
    submit() {
        if (this.gradeForm.valid) {
            //console.log("this.gradeForm >>>", this.gradeForm.value)
            this.gradeService.save(this.gradeForm.value).subscribe((reasponse) => {
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