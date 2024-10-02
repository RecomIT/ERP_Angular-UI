import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { CustomModalService } from "src/app/shared/services/custom-modal.service";
import { UtilityService } from "src/app/shared/services/utility.service";
import { CostCenterService } from "./costcenter.service";

@Component({
    selector: 'employee-module-costcenter-insert-update-modal',
    templateUrl: './costcenter-insert-update-modal.component.html'
})

export class CostCenterInsertUpdateModalComponent implements OnInit {

    @Input() id: number = 0;
    @Output() closeModalEvent = new EventEmitter<string>();
    @ViewChild('costcenterModal', { static: true }) costcenterModal!: ElementRef;
    modalTitle: string = "Add New Cost Center";

    constructor(
        private fb: FormBuilder,
        private utilityService: UtilityService,
        private costCenterService: CostCenterService,
        public modalService: CustomModalService) {
    }
    ngOnInit(): void {
        this.formInit();
        if (this.id > 0) {
            this.getById();
            this.modalTitle = this.id > 0 ? "Update Cost Center" : "Add New Cost Center";
        } 
    }

    info: any;
    form: FormGroup;

    formErrors = {
        'costCenterName': '',
        'costCenterCode': '',
        'costcenterNameInBengali': '',
        'remarks': ''
    }

    validationMessages = {
        'costCenterName': {
            'required': 'Field is required',
            'maxlength': 'Max length is 150',
            'minlength': 'Min length is 2'
        },
        'costCenterCode': {
            'maxlength': 'Max length is 150',
        },
        'costCenterNameInBengali': {
            'maxlength': 'Max length is 150',
        },
        'remarks': {
            'maxlength': 'Max length is 150'
        }
    }

    getById(){
        this.costCenterService.getById({ costCenterId: this.id }).subscribe((response) => {
            this.load_value(response);
        }, (error) => {
            this.utilityService.fail("Something went wrong", "Server Wrong");
        })
    }

    formInit() {
        this.form = this.fb.group({
            costCenterId: new FormControl(this.id),
            costCenterName: new FormControl(this.info?.costCenterName, [Validators.required, Validators.maxLength(150), Validators.minLength(2)]),
            costCenterCode: new FormControl('', [Validators.maxLength(150)]),
            costcenterNameInBengali: new FormControl('', [Validators.maxLength(150)]),
            remarks: new FormControl('', [Validators.maxLength(200)])
        })
        this.openModal();
    }

    openModal() {
        this.modalService.open(this.costcenterModal, "sm");
    }

    load_value(value: any) {
        this.form.get('costCenterId').setValue(this.id);
        this.form.get('costCenterName').setValue(value.costCenterName);
        this.form.get('costCenterCode').setValue(value.costCenterCode);
        this.form.get('costcenterNameInBengali').setValue(value.costcenterNameInBengali);
        this.form.get('remarks').setValue(value.remarks);
    }

    logFormErrors(formGroup: FormGroup = this.form) {
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

    server_errors: any;
    btnSubmit: any;
    submit() {
        if (this.form.valid) {
            //console.log("this.departmentForm >>>", this.departmentForm.value)
            this.costCenterService.save(this.form.value).subscribe((reasponse) => {
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