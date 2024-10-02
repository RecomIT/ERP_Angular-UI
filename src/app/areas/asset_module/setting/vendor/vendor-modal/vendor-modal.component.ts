import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CustomModalService } from 'src/app/shared/services/custom-modal.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { VendorSerive } from '../vendor.service';

@Component({
  selector: 'asset-module-vendor-modal',
  templateUrl: './vendor-modal.component.html'

})
export class VendorModalComponent implements OnInit {

  @Input() id: number = 0;
  @Output() closeModalEvent = new EventEmitter<string>();
  @ViewChild('vendorModal', { static: true }) vendorModal!: ElementRef;

  modalTitle: string = "Add Vendor";
  vendorForm: FormGroup;
  btnSubmit: boolean = false;
  server_errors: any;

  constructor(
    private fb: FormBuilder,
    private utilityService: UtilityService,
    private vendorSerive: VendorSerive,
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

vendorId: number = 0;
list: any[]=[];
list_loading_label: string = null;

info: any;
formInit() {
    this.vendorForm = this.fb.group({
        vendorId: new FormControl(this.id),
        name: new FormControl(this.info?.name, [Validators.required, Validators.maxLength(100), Validators.minLength(2)]),
        nameInBengali: new FormControl('', [Validators.maxLength(150)]),
        isActive: new FormControl(true),
        remarks: new FormControl('', [Validators.maxLength(200)])
    })
}


load_value(value: any) {
    this.vendorForm.get('name').setValue(value.name);
    this.vendorForm.get('nameInBengali').setValue(value.nameInBengali);
    this.vendorForm.get('isActive').setValue(value.isActive);
    this.vendorForm.get('remarks').setValue(value.remarks);
}

openModal() {
    this.modalService.open(this.vendorModal, "lg");
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

logFormErrors(formGroup: FormGroup = this.vendorForm) {
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
    this.vendorSerive.getById({ vendorId: this.id }).subscribe((response) => {    
        //console.log("vendorForm ID >>>", this.id);
        this.load_value(response.body);        
    }, (error) => {
        this.utilityService.fail("Something went wrong", "Server Wrong");
    })
}

submit() {
    //console.log("vendorForm >>>", this.categoryForm.valid);
    if (this.vendorForm.valid) {
        let data = this.vendorForm.value;
        this.vendorSerive.save(data).subscribe((reasponse) => {            
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
