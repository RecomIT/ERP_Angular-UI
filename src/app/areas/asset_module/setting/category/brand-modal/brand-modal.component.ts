import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CustomModalService } from 'src/app/shared/services/custom-modal.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { BrandService } from './brand.service';
import { SubCategoryService } from '../sub-category-modal/subCategory.service';

@Component({
    selector: 'asset-module-brand-modal',
    templateUrl: './brand-modal.component.html'
})
export class BrandModalComponent implements OnInit {

    @Input() id: number = 0;
    @Output() closeModalEvent = new EventEmitter<string>();
    @ViewChild('brandModal', { static: true }) brandModal!: ElementRef;

    modalTitle: string = "Add Brand";
    brandForm: FormGroup;
    btnSubmit: boolean = false;
    server_errors: any;
    select2Options = this.utilityService.select2Config();

    constructor(
        private fb: FormBuilder,
        private utilityService: UtilityService,
        private brandService: BrandService,
        private subCategoryService : SubCategoryService,
        public modalService: CustomModalService
    ) { }

    ngOnInit(): void {
        this.formInit();
        this.openModal();
        this.loadSubCategoryDropdown();
        if (this.id > 0) {
            this.getById();
            this.modalTitle = this.id > 0 ? "Update Brand" : "Add New Brand";
        }
    }


    info: any;
    formInit() {
        this.brandForm = this.fb.group({
            brandId: new FormControl(this.id),
            subCategoryId: new FormControl(0, [Validators.min(1)]),
            name: new FormControl(this.info?.brandName, [Validators.required, Validators.maxLength(100), Validators.minLength(2)]),
            nameInBengali: new FormControl('', [Validators.maxLength(150)]),
            isActive: new FormControl(true),
            remarks: new FormControl('', [Validators.maxLength(200)])
        })
    }


    load_value(value: any) {
        this.brandForm.get('brandId').setValue(this.id);
        this.brandForm.get('subCategoryId').setValue(value.subCategoryId);        
        this.brandForm.get('name').setValue(value.brandName);
        this.brandForm.get('nameInBengali').setValue(value.brandInBengali);
        this.brandForm.get('isActive').setValue(value.brandIsActive);
        this.brandForm.get('remarks').setValue(value.brandRemarks);
    }

    openModal() {
        this.modalService.open(this.brandModal, "lg");
    }

    ddlSubCategory: any[] = [];
    loadSubCategoryDropdown() {
        this.subCategoryService.loadSubCategory();
        this.subCategoryService.ddl$.subscribe(data => {
            //console.log("data >>>", data);
            this.ddlSubCategory = data;
        }, (error) => {
            console.log("error  while fetching data >>>", error);
        })
    }



    formErrors = {
        'subCategoryId': '',
        'name': ''
    }

    validationMessages = {
        'subCategoryId': {
            'required': 'Field is required'
        },
        'name': {
            'required': 'Field is required',
            'maxlength': 'Max length is 100',
            'minlength': 'Min length is 2'
        }
    }

    logFormErrors(formGroup: FormGroup = this.brandForm) {
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
        this.brandService.getById({ brandId: this.id }).subscribe((response) => {
            //console.log("data >>>", response);
            this.load_value(response.body);
        }, (error) => {
            this.utilityService.fail("Something went wrong", "Server Wrong");
        })
    }

    submit() {
        if (this.brandForm.valid) {
            this.brandService.save(this.brandForm.value).subscribe((reasponse) => {
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
