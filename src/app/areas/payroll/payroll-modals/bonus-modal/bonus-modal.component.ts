import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from "@angular/forms";
import { resourceUsage } from "process";
import { AreasHttpService } from "src/app/areas/areas.http.service";
import { ApiArea, ApiController } from "src/app/shared/constants";
import { CustomModalService } from "src/app/shared/services/custom-modal.service";
import { PayrollWebService } from "src/app/shared/services/payroll-web.service";
import { UserService } from "src/app/shared/services/user.service";
import { UtilityService } from "src/app/shared/services/utility.service";

@Component({
    selector: 'app-payroll-bonus-modal',
    templateUrl: './bonus-modal.component.html'
})


export class BonusModalComponent implements OnInit {
    @Input() id: number = 0;
    @Input() list: any[] = [];
    @Output() closeModalEvent = new EventEmitter<string>();

    @ViewChild('bonusModal', { static: true }) bonusModal!: ElementRef;
    modalTitle: string = "Add New Bonus";

    constructor(private fb: FormBuilder, // strongly type form build
        private areasHttpService: AreasHttpService, // http request
        private userService: UserService, // user service user id
        public utilityService: UtilityService, // utility 
        public modalService: CustomModalService, // modal service 
        private payrollWebService: PayrollWebService) {
    }

    bonusForm: FormGroup;

    ngOnInit(): void {
        console.log("list >>>", this.list)
        this.list = this.list == null ? [] : this.list;
        this.bonusFormInit();
        this.modalService.open(this.bonusModal, "sm");
    }

    formErrors = {
        'bonusName': '',
        'reason': '',
        'remarks': ''
    }

    validationMessages = {
        'bonusName': {
            'required': 'Field is required',
            'duplicate': 'Duplicate Bonus',
            'maxlength': 'Max length is 150',
            'minlength': 'Min length is 3'
        },
        'reason': {
            'maxlength': 'Max length is 100'
        },
        'remarks': {
            'maxlength': 'Max length is 200'
        }
    }

    bonusFormInit() {
        this.bonusForm = this.fb.group({
            bonusId: new FormControl(this.id),
            bonusName: new FormControl('', [Validators.required, Validators.maxLength(150), Validators.minLength(3), this.duplicateBonus(this.list)]),
            isActive: new FormControl(true, [Validators.required]),
            reason: new FormControl('', [Validators.maxLength(100)]),
            remarks: new FormControl('', [Validators.maxLength(200)])
        })
        //this.setFormValue();
        this.bonusForm.valueChanges.subscribe(() => {
            this.logFormErrors();
        })
    }

    setFormValue() {
        if (this.id > 0) {
            const current_bonus_item = this.list.find(item => item.bonusId == this.id);
            this.bonusForm.get('bonusName').setValue(current_bonus_item?.bonusName)
            this.bonusForm.get('isActive').setValue(current_bonus_item?.isActive)
            this.bonusForm.get('reason').setValue(current_bonus_item?.reason)
            this.bonusForm.get('remarks').setValue(current_bonus_item?.remarks)
        }
    }

    logFormErrors(formGroup: FormGroup = this.bonusForm) {
        Object.keys(formGroup.controls).forEach((key: string) => {
            const abstractControl = formGroup.get(key);
            this.formErrors[key] = '';
            if (abstractControl && !abstractControl.valid && (abstractControl.touched || abstractControl.dirty)) {
                const messages = this.validationMessages[key];
                for (const errorKey in abstractControl.errors) {
                    console.log("errorKey >>> ", errorKey)
                    this.formErrors[key] += messages[errorKey];
                }
            }
            if (key == 'bonusName') {
                const messages = this.validationMessages[key];
            }
        })
    }

    btnBonus: boolean = false;
    submit() {
        if (this.bonusForm.valid) {
            this.btnBonus = true;
            this.areasHttpService.observable_post<any>((ApiArea.payroll + ApiController.bonus + "/SaveBonus"), this.bonusForm.value, {}).subscribe(response => {
                if (response?.status) {
                    this.utilityService.toastr.success(response?.msg, "Server Response");
                    this.closeModal('Save Complete');
                }
                else {
                    this.utilityService.toastr.error(response?.msg, "Server Response");
                }
            }, (error) => {
                console.log("error >>>", error);
                this.btnBonus = false;
                this.utilityService.fail("Something went wrong", "Server Response");
            })
        }
        else {
            this.utilityService.fail('Invalid Form Submission', 'Site Response')
        }
    }

    closeModal(reason: string) {
        this.closeModalEvent.emit(reason); // fair
        this.modalService.service.dismissAll(reason);
    }

    // Validators
    duplicateBonus(list: any[]): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            if (list.length > 0) {
                const bonusName = control.value;
                let isDuplicate = list.find(item => item.bonusName.toLowerCase() == bonusName?.toLowerCase() && item.bonusId != this.id) ? true : false;
                if (isDuplicate) {
                    return { 'duplicate': true }
                }
            }
            return null;
        }
    }

}



