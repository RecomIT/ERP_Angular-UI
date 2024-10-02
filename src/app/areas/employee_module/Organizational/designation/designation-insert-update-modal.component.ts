import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { UtilityService } from "src/app/shared/services/utility.service";
import { DesignationService } from "./designation.service";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { CustomModalService } from "src/app/shared/services/custom-modal.service";
import { GradeService } from "../grade/grade.service";

@Component({
    selector: 'employee-module-designation-insert-update-modal',
    templateUrl: './designation-insert-update-modal.component.html'
})

export class DesignationInsertUpdateModalComponent implements OnInit {

    @Input() id: number = 0;
    @Output() closeModalEvent = new EventEmitter<string>();
    @ViewChild('designationModal', { static: true }) designationModal!: ElementRef;

    modalTitle: string = "Add New Designation";

    constructor(
        private fb: FormBuilder,
        private utilityService: UtilityService,
        private designationService: DesignationService,
        public modalService: CustomModalService,
        private gradeService : GradeService) {
    }

    ngOnInit(): void {
        this.formInit();
        this.openModal();
        this.loadDropdown();
        if (this.id > 0) {
            this.getById();
            this.modalTitle = this.id > 0 ? "Update Designation" : "Add New Designation";
        }        
    }

    // To use dropdown
    ddlGrade: any;
    // this.loadDropdown(); call in ngOnInit

    loadDropdown(){
        this.gradeService.loadGradeDropdown();
        this.ddlGrade = this.gradeService.ddl$;
        //console.log("grade dropdown list >>>", this.ddlGrade);
    }

    info: any;
    getById() {
        this.designationService.getById({ designationId: this.id }).subscribe((response) => {
            this.load_value(response);
        }, (error) => {
            this.utilityService.fail("Something went wrong", "Server Wrong");
        })
    }

    designationForm: FormGroup;

    formErrors = {
        'designationName': '',
        'gradeId': '',
        'shortName': '',
    }

    validationMessages = {
        'designationName': {
            'required': 'Field is required',
            'maxlength': 'Max length is 100',
            'minlength': 'Min length is 2'
        },
        'shortName':{
            'maxlength': 'Max length is 100',
        },
        'gradeId':{
            'min': 'Field is required'
        }
    }
    openModal() {
        this.modalService.open(this.designationModal, "sm");
    }


    formInit() {
        this.designationForm = this.fb.group({
            designationId: new FormControl(this.id),
            designationName: new FormControl(this.info?.designationName, [Validators.required, Validators.maxLength(100), Validators.minLength(2)]),
            shortName : new FormControl('',[Validators.maxLength(100)]),
            gradeId : new FormControl(0,[Validators.min(1)])
        })
    }

    load_value(value: any) {
        this.designationForm.get('designationName').setValue(value.designationName);
        this.designationForm.get('designationId').setValue(value.designationId);
        this.designationForm.get('gradeId').setValue(value.gradeId);
        this.designationForm.get('shortName').setValue(value.shortName);
    }

    logFormErrors(formGroup: FormGroup = this.designationForm) {
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
            // if (key == 'designationName') {
            //     const messages = this.validationMessages[key];
            // }
        })
    }

    btnSubmit: boolean = false;
    server_errors: any;
    submit() {
        if (this.designationForm.valid) {
            //console.log("this.designationForm >>>", this.designationForm.value)
            this.designationService.save(this.designationForm.value).subscribe((reasponse) => {
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