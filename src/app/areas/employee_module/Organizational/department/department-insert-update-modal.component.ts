import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { UtilityService } from "src/app/shared/services/utility.service";
import { DepartmentService } from "./department.service";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { CustomModalService } from "src/app/shared/services/custom-modal.service";
import { GradeService } from "../grade/grade.service";

@Component({
    selector: 'employee-module-department-insert-update-modal',
    templateUrl: './department-insert-update-modal.component.html'
})

export class DepartmentInsertUpdateModalComponent implements OnInit {

    @Input() id: number = 0;
    @Output() closeModalEvent = new EventEmitter<string>();
    @ViewChild('departmentModal', { static: true }) departmentModal!: ElementRef;

    modalTitle: string = "Add New Department";

    constructor(
        private fb: FormBuilder,
        private utilityService: UtilityService,
        private departmentService: DepartmentService,
        public modalService: CustomModalService,
        private gradeService : GradeService) {
    }

    ngOnInit(): void {
        this.formInit();
        this.openModal();
        this.loadDropdown();
        if (this.id > 0) {
            this.getById();
            this.modalTitle = this.id > 0 ? "Update Department" : "Add New Department";
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
        this.departmentService.getById({ departmentId: this.id }).subscribe((response) => {
            this.load_value(response);
        }, (error) => {
            this.utilityService.fail("Something went wrong", "Server Wrong");
        })
    }

    departmentForm: FormGroup;

    formErrors = {
        'departmentName': '',
        'shortName': '',
    }

    validationMessages = {
        'departmentName': {
            'required': 'Field is required',
            'maxlength': 'Max length is 100',
            'minlength': 'Min length is 2'
        },
        'shortName':{
            'maxlength': 'Max length is 100',
        }
    }
    openModal() {
        this.modalService.open(this.departmentModal, "sm");
    }


    formInit() {
        this.departmentForm = this.fb.group({
            departmentId: new FormControl(this.id),
            departmentName: new FormControl(this.info?.departmentName, [Validators.required, Validators.maxLength(100), Validators.minLength(2)]),
            shortName : new FormControl('',[Validators.maxLength(100)])
        })
    }

    load_value(value: any) {
        this.departmentForm.get('departmentName').setValue(value.departmentName);
        this.departmentForm.get('departmentId').setValue(value.departmentId);
        this.departmentForm.get('shortName').setValue(value.shortName);
    }

    logFormErrors(formGroup: FormGroup = this.departmentForm) {
        Object.keys(formGroup.controls).forEach((key: string) => {
            const abstractControl = formGroup.get(key);
            this.formErrors[key] = '';
            if (abstractControl && !abstractControl.valid && (abstractControl.touched || abstractControl.dirty)) {
                const messages = this.validationMessages[key];
                for (const errorKey in abstractControl.errors) {
                    this.formErrors[key] += messages[errorKey];
                }
            }
        })
    }

    btnSubmit: boolean = false;
    server_errors: any;
    submit() {
        if (this.departmentForm.valid) {
            //console.log("this.departmentForm >>>", this.departmentForm.value)
            this.departmentService.save(this.departmentForm.value).subscribe((reasponse) => {
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