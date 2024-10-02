import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { LeaveTypeSerive } from "../leave-type.service";
import { CustomModalService } from "src/app/shared/services/custom-modal.service";
import { UtilityService } from "src/app/shared/services/utility.service";
@Component({
    selector: 'leave-module-leave-type-insert-update-modal',
    templateUrl: './leave-type-insert-update-modal.component.html'
})

export class LeaveTypeInsertUpdateModal implements OnInit {
    @Input() id: any = 0;
    modalTitle: string = "Add Leave Type";
    @Output() closeModalEvent = new EventEmitter<string>();
    @ViewChild('leaveTypeModal', { static: true }) leaveTypeModal!: ElementRef;

    constructor(private leaveTypeSerive: LeaveTypeSerive, private modalService: CustomModalService, 
        private utilityService: UtilityService, private fb: FormBuilder) { }
    ngOnInit(): void {
        this.formInit();
        this.openModal();
        if(this.id > 0){
            this.modalTitle ="Update Leave Type";
            this.getById();
        }
    }

    form: FormGroup;
    duplicateLeaveTitle: any;
    duplicateLeaveShortName: any;

    openModal() {
        this.modalService.open(this.leaveTypeModal, "lg");
    }

    getById() {
        this.leaveTypeSerive.getById({ leaveTypeId: this.id }).subscribe(response => {
            this.set_form_value(response);
        }, (error) => {
            console.log("error >>>", error);
            this.utilityService.fail("Something went wrong","Server Response");
        })
    }

    formInit() {
        this.form = this.fb.group({
            id: new FormControl(this.id),
            title: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(100)]),
            titleInBangali: new FormControl('', [Validators.maxLength(100)]),
            shortName: new FormControl('', [Validators.minLength(2), Validators.maxLength(10)]),
            shortNameInBangali: new FormControl(),
            isActive: new FormControl(true)
        })
    }

    set_form_value(data: any){
        this.form.get('title').setValue(data.title);
        this.form.get('titleInBangali').setValue(data.titleInBengali);
        this.form.get('shortName').setValue(data.shortName);
        this.form.get('shortNameInBangali').setValue(data.shortNameInBangali);
        this.form.get('isActive').setValue(data.isActive);
    }

    btnSubmit: boolean = false;
    submit() {
        if(this.form.valid){
            this.leaveTypeSerive.save(this.form.value).subscribe(response=>{
                console.log("response >>>", response);
                if (response.body?.status) {
                    this.utilityService.success(response?.msg, "Server Response");
                    this.closeModal(this.utilityService.SuccessfullySaved);
                }
                else {
                    if (response.body?.msg == "Validation Error") {
                        this.utilityService.fail(response.body?.msg,"Server Response");
                    }
                    else {
                        this.utilityService.fail(response?.msg, "Server Response");
                    }
                }
            },(error)=>{
                console.log("error >>>", error);
                this.utilityService.fail("Something went wrong","Server Response");
            })
        }
        else{
            this.utilityService.fail("Invalid form submission","Server Response");
        }
    }

    closeModal(reason: any){
        this.closeModalEvent.emit(reason);
        this.modalService.service.dismissAll(reason);
    }

}