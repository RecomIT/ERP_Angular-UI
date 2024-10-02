import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CustomModalService } from 'src/app/shared/services/custom-modal.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { CategoryService } from '../category.service';


@Component({
    selector: 'asset-module-category-modal',
    templateUrl: './category-modal.component.html'
})
export class CategoryModalComponent implements OnInit {

    @Input() id: number = 0;
    @Output() closeModalEvent = new EventEmitter<string>();
    @ViewChild('categoryModal', { static: true }) categoryModal!: ElementRef;

    modalTitle: string = "Add Category";
    categoryForm: FormGroup;
    btnSubmit: boolean = false;
    server_errors: any;

    constructor(
        private fb: FormBuilder,
        private utilityService: UtilityService,
        private categoryService: CategoryService,
        public modalService: CustomModalService
    ) { }

    ngOnInit(): void {
        this.formInit();
        this.openModal();
        if (this.id > 0) {
            this.getById();
            this.modalTitle = this.id > 0 ? "Update Category" : "Add New Category";
        }
    }

    info: any;
    formInit() {
        this.categoryForm = this.fb.group({
            categoryId: new FormControl(this.id),
            name: new FormControl(this.info?.categoryName, [Validators.required, Validators.maxLength(100), Validators.minLength(2)]),
            nameInBengali: new FormControl('', [Validators.maxLength(150)]),
            isActive: new FormControl(true),
            remarks: new FormControl('', [Validators.maxLength(200)])
        })
    }


    load_value(value: any) {
        this.categoryForm.get('name').setValue(value.categoryName);
        this.categoryForm.get('nameInBengali').setValue(value.categoryInBengali);
        this.categoryForm.get('isActive').setValue(value.categoryIsActive);
        this.categoryForm.get('remarks').setValue(value.categoryRemarks);
    }

    openModal() {
        this.modalService.open(this.categoryModal, "lg");
    }

    formErrors = {
        'name': ''
    }

    validationMessages = {
        'name': {
            'required': 'Field is required',
            'maxlength': 'Max length is 100',
            'minlength': 'Min length is 2'
        }
    }

    logFormErrors(formGroup: FormGroup = this.categoryForm) {
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

    getById() {
        this.categoryService.getById({ categoryId: this.id }).subscribe((response) => {    
            //console.log("categoryModal >>>", response);
            this.load_value(response.body);        
        }, (error) => {
            this.utilityService.fail("Something went wrong", "Server Wrong");
        })
    }

    submit() {
        //console.log("categoryForm >>>", this.categoryForm.valid);
        if (this.categoryForm.valid) {
            let data = this.categoryForm.value;
            this.categoryService.save(data).subscribe((reasponse) => {
                if (reasponse?.status) {
                    this.utilityService.success(reasponse?.msg, "Server Response");
                    this.closeModal(this.utilityService.SuccessfullySaved);
                }
                else {
                    if (reasponse?.msg == "Validation Error") {
                        this.server_errors = JSON.parse(reasponse?.errorMsg)
                    }
                    else {
                        this.utilityService.fail(reasponse?.msg, "Server Response");
                    }
                }
            }, (error) => {
                console.log("error >>>", error);
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
