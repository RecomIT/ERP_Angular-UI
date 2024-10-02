import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { CustomModalService } from 'src/app/shared/services/custom-modal.service';
import { SubCategoryService } from './subCategory.service';
import { CategoryService } from '../category.service';




@Component({
  selector: 'asset-module-sub-category-modal',
  templateUrl: './sub-category-modal.component.html'
})
export class SubCategoryModalComponent implements OnInit {

    @Input() id: number = 0;
    @Output() closeModalEvent = new EventEmitter<string>();
    @ViewChild('subCategoryModal', { static: true }) subCategoryModal!: ElementRef;

    modalTitle: string = "Add Sub Category";
    subCategoryForm: FormGroup;
    btnSubmit: boolean = false;
    server_errors: any;
    select2Options = this.utilityService.select2Config();

    constructor(
        private fb: FormBuilder,
        private utilityService: UtilityService,
        private subCategoryService: SubCategoryService,
        private categoryService: CategoryService,
        public modalService: CustomModalService
    ) { }

    ngOnInit(): void {
        this.formInit();
        this.openModal();
        this.loadDropdown();
        if (this.id > 0) {
            this.getById();
            this.modalTitle = this.id > 0 ? "Update Sub Category" : "Add New Sub Category";
        }
    }

    info: any;
    formInit() {
        this.subCategoryForm = this.fb.group({
            subCategoryId: new FormControl(this.id),
            categoryId: new FormControl(0, [Validators.min(1)]),
            name: new FormControl(this.info?.subCategoryName, [Validators.required, Validators.maxLength(100), Validators.minLength(2)]),
            nameInBengali: new FormControl('', [Validators.maxLength(150)]),
            isActive: new FormControl(true),
            remarks: new FormControl('', [Validators.maxLength(200)])
        })
    }
    

    load_value(value: any) {
        this.subCategoryForm.get('subCategoryId').setValue(this.id);
        this.subCategoryForm.get('categoryId').setValue(value.categoryId);
        this.subCategoryForm.get('name').setValue(value.subCategoryName);
        this.subCategoryForm.get('nameInBengali').setValue(value.subCategoryInBengali);
        this.subCategoryForm.get('isActive').setValue(value.subCategoryIsActive);
        this.subCategoryForm.get('remarks').setValue(value.subCategoryRemarks);
    }

    openModal() {
        this.modalService.open(this.subCategoryModal, "lg");
    }


    ddlCategory: any[] = [];
    loadDropdown() {
        this.categoryService.loadCategoryDropdown();
        this.categoryService.ddl$.subscribe(data => {
            //console.log("data >>>", data);
            this.ddlCategory = data;
        }, (error) => {
            console.log("error  while fetching data >>>", error);
        })
    }

    
    formErrors = {
        'categoryId': '',
        'name': ''
    }

    validationMessages = {
        'categoryId': {
            'required': 'Field is required'
        },
        'name': {
            'required': 'Field is required',
            'maxlength': 'Max length is 100',
            'minlength': 'Min length is 2'
        }
    }

    logFormErrors(formGroup: FormGroup = this.subCategoryForm) {
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
        this.subCategoryService.getById({ subCategoryId: this.id }).subscribe((response) => {
        //console.log("data >>>", response);
            this.load_value(response.body);
        }, (error) => {
            this.utilityService.fail("Something went wrong", "Server Wrong");
        })
    }

    submit() {
        if (this.subCategoryForm.valid) {
            let data = this.subCategoryForm.value;
            this.subCategoryService.save(data).subscribe((reasponse) => {                
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
