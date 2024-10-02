import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { UserService } from "src/app/shared/services/user.service";
import { AllowanceNameService } from "./allowance-name.service";
import { AllowanceHeadService } from "../allowance-head/allowance-head.service";
import { CustomModalService } from "src/app/shared/services/custom-modal.service";
import { UtilityService } from "src/app/shared/services/utility.service";
import { TypeaheadMatch } from "ngx-bootstrap/typeahead";
import { error } from "console";

@Component({
    selector:'app-payroll-salary-module-allowance-head-name-config-insert-update-modal',
    templateUrl:'./allowance-head-name-config-insert-update-modal.component.html'
})

export class AllowanceHeadNameConfigInsertUpdateModalComponent implements OnInit{

    @Input() id: number = 0;
    @Output() closeModalEvent = new EventEmitter<string>();
    @ViewChild('allowanceHeadNameConfigModal', { static: true }) modal!: ElementRef;
    modalTitle: string="Add An Allowance";
    constructor(private userService: UserService, private utilityService:UtilityService, private modalService: CustomModalService, private allowanceNameService: AllowanceNameService,private allowanceHeadService: AllowanceHeadService, private fb: FormBuilder){
        
    }
    ngOnInit(): void {
        this.formInit();
        this.openModal();
        this.loadDropdown();
        if(this.id > 0){

        }
    }

    User(){
        return this.userService.getUser();
    }

    openModal(){
        this.modalService.open(this.modal,"lg");
    }

    form: FormGroup;

    list_of_allowance_head: any[];

    ddlAllowanceHead: any;
    loadDropdown(){
        this.allowanceHeadService.loadAllowanceHeadDropdown();
        this.ddlAllowanceHead = this.allowanceHeadService.ddl$;
        console.log("ddlAllowanceHead >>>", this.ddlAllowanceHead);
    }

    selected?: string;
    submit(){
        if(this.form.valid){
            this.allowanceNameService.saveAllowanceWithConfig(this.form.value).subscribe(response=>{
                console.log("response >>>", response);
            },error=>{
                console.log("error >>>", error);
            })
        }
        else{
            this.utilityService.fail('Invalid Form submission','Site Response');
        }
    }

    btnSubmit: boolean=false;

    formInit(){
        this.form = this.fb.group({
            allowanceNameId : new FormControl(0),
            allowanceName: new FormControl('',[Validators.required,Validators.minLength(2),Validators.maxLength(200)]),
            allowanceHeadId : new FormControl(0),
            allowanceHeadName: new FormControl('',[Validators.required,Validators.minLength(2),Validators.maxLength(200)]),
            allowanceNameInBengali: new FormControl('',[Validators.maxLength(200)]),
            glCode: new FormControl('',[Validators.maxLength(20)]),
            allowanceFlag: new FormControl('',[Validators.maxLength(100)]),
            allowanceType: new FormControl('General',[Validators.maxLength(50)]),
            isFixed: new FormControl({ value: 0, disabled: true }),
            isTaxable: new FormControl(true),
            taxableType: new FormControl('OnceOff',[Validators.maxLength(50)])
        })


        this.form.get('allowanceHeadName').valueChanges.subscribe(response=>{
            this.form.get('allowanceHeadId').setValue(0);
        })

        this.form.get('allowanceType').valueChanges.subscribe(value=>{
            if(value=='General'){
                this.form.get('isFixed').setValue(null);
                this.form.get('isFixed').disable();
            }
            else{
                this.form.get('isFixed').setValue(true);
                this.form.get('isFixed').enable();
            }
        })

        this.form.get('isTaxable').valueChanges.subscribe(value=>{
            console.log("value >>>", value);
            if(value == 'true'){
                this.form.get('taxableType').setValue('OnceOff');
                this.form.get('taxableType').enable();
            }
            else{
                this.form.get('taxableType').setValue('');
                this.form.get('taxableType').disable();
            }
        })
    }

    formErrors = {
        'allowanceNameId': '',
        'allowanceName':'',
        'allowanceHeadId':'',
        'allowanceHeadName':'',
        'allowanceNameInBengali':'',
        'glCode':'',
        'allowanceFlag':'',
        'allowanceType':'',
        'isFixed':'',
        'isTaxble':'',
        'taxableType':''
    }

    validationMessages = {
       'allowanceName':{
        'required':'Field is required',
        'min':'Min length is 2',
        'max':'Max length is 200',
       },
       'allowanceHeadName':{
        'required':'Field is required',
        'min':'Field is required',
        'max':'Max length is 200',
       },
       'allowanceNameInBengali':{
        'max':'Max length is 200',
       },
       'glCode':{
        'max':'Max length is 20',
       },
       'allowanceFlag':{
        'max':'Max length is 100',
       },
       'allowanceType':{
        'max':'Max length is 50',
       },
       'taxableType':{
        'max':'Max length is 50',
       }
    }

    logFormErrors(formGroup: FormGroup = this.form){
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

    allowanceHeadOnSelect(e: TypeaheadMatch){
        this.form.get('allowanceHeadId').setValue(e.item.id);
        // console.log("allowanceHeadId >>>",this.form.get('allowanceHeadId').value);
    }

    load_value(value: any) {
        this.form.get('allowanceNameId').setValue(value.allowanceNameId);
        this.form.get('allowanceName').setValue(value.allowanceName);
        this.form.get('allowanceHeadId').setValue(value.allowanceHeadId);
        this.form.get('allowanceHeadName').setValue(value.allowanceHeadName);
        this.form.get('allowanceNameInBengali').setValue(value.allowanceNameInBengali);
        this.form.get('glCode').setValue(value.glCode);
        this.form.get('allowanceFlag').setValue(value.allowanceFlag);
        this.form.get('allowanceType').setValue(value.allowanceType);
        this.form.get('isFixed').setValue(value.isFixed);
        this.form.get('isTaxble').setValue(value.isTaxble);
        this.form.get('taxableType').setValue(value.taxableType);
    }

    closeModal(reason: any){
        this.modalService.service.dismissAll(reason);
        this.closeModalEvent.emit(reason);
    }

}