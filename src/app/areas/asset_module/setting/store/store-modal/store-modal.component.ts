import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CustomModalService } from 'src/app/shared/services/custom-modal.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { StoreSerive } from '../store.service';

@Component({
  selector: 'asset-module-store-modal',
  templateUrl: './store-modal.component.html'
})
export class StoreModalComponent implements OnInit {

    @Input() id: number = 0;
    @Output() closeModalEvent = new EventEmitter<string>();
    @ViewChild('storeModal', { static: true }) storeModal!: ElementRef;

    modalTitle: string = "Add Store";
    storeForm: FormGroup;
    btnSubmit: boolean = false;
    server_errors: any;

  constructor(
    private fb: FormBuilder,
    private utilityService: UtilityService,
    private storeService: StoreSerive,
    public modalService: CustomModalService
  ) { }

  ngOnInit(): void {
    this.formInit();
    this.openModal();
    if (this.id > 0) {
        this.getById();
        this.modalTitle = this.id > 0 ? "Update Store" : "Add New Store";
    }
}

info: any;
formInit() {
    this.storeForm = this.fb.group({
        storeId: new FormControl(this.id),
        name: new FormControl(this.info?.storeName, [Validators.required, Validators.maxLength(100), Validators.minLength(2)]),
        nameInBengali: new FormControl('', [Validators.maxLength(150)]),
        isActive: new FormControl(true),
        remarks: new FormControl('', [Validators.maxLength(200)])
    })
}


load_value(value: any) {
    this.storeForm.get('name').setValue(value.storeName);
    this.storeForm.get('nameInBengali').setValue(value.storeInBengali);
    this.storeForm.get('isActive').setValue(value.storeIsActive);
    this.storeForm.get('remarks').setValue(value.storeRemarks);
}

openModal() {
    this.modalService.open(this.storeModal, "lg");
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

logFormErrors(formGroup: FormGroup = this.storeForm) {
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
    this.storeService.getById({ storeId: this.id }).subscribe((response) => {    
        //console.log("storeForm ID >>>", this.id);
        this.load_value(response.body);        
    }, (error) => {
        this.utilityService.fail("Something went wrong", "Server Wrong");
    })
}

submit() {
    //console.log("storeForm >>>", this.categoryForm.valid);
    if (this.storeForm.valid) {
        let data = this.storeForm.value;
        this.storeService.save(data).subscribe((reasponse) => {            
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
