import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { CustomModalService } from "src/app/shared/services/custom-modal.service";
import { UserService } from "src/app/shared/services/user.service";
import { UtilityService } from "src/app/shared/services/utility.service";
import { PayslipTaxCardEmailingServiceModel } from "./payslip-taxcard-emailing.service";

@Component({
    selector: 'app-payroll-payslip-taxcard-email',
    templateUrl: './payslip-taxcard-emailing.component.html'
})

export class PayslipTaxCardEmailingModalComponent implements OnInit {

    @Input() salaryMonth: any = 0;
    @Input() salaryYear: any = 0;

    @Output() closeModalEvent = new EventEmitter<string>();
    @ViewChild('emailingModal', { static: true }) emailingModal!: ElementRef;

    modalTitle: string = "";

    emailingForm: FormGroup;

    constructor(private userService: UserService,
        public utilityService: UtilityService,
        public modalService: CustomModalService,
        private fb: FormBuilder,
        private service:PayslipTaxCardEmailingServiceModel) {
    }

    user() {
        return this.userService.User();
    }

    ngOnInit(): void {
        this.formInit();
        this.openModal();
    }

    formInit(){
        this.emailingForm= this.fb.group({
            selectedEmployees: new FormControl(''),
            month: new FormControl(this.salaryMonth,[Validators.min(1),Validators.max(12)]),
            year: new FormControl(this.salaryYear,[Validators.min(2022),Validators.max(2050)]),
            reportFileName: new FormControl('Payslip',[Validators.required]),
            withPasswordProtected: new FormControl(true),
            fileFormat: new FormControl('PDF',[Validators.required])
        })

        console.log("this.emailingForm value", this.emailingForm.value)
    }

    openModal(){
        this.modalService.open(this.emailingModal, "sm");
    }

    btnSubmit:boolean=false;
    submit(){
        if(this.emailingForm.valid){
            this.btnSubmit=true;
            this.service.sendEmail(this.emailingForm.value).subscribe(response=>{
                console.log("email service response >>>", response);
                this.btnSubmit=false;
            },error=>{
                console.log("email service error >>>", error);
                this.btnSubmit=false;
            })
        }
        else{
            this.utilityService.fail("Invalid Form Submission","Site Reponse");
        }
    }

    closeModal(reason:any){
        this.modalService.service.dismissAll(reason);
        this.closeModalEvent.emit(reason);
    }
}