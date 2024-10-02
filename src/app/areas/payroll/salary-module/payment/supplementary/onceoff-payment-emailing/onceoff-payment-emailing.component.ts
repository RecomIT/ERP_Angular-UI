import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { CustomModalService } from "src/app/shared/services/custom-modal.service";
import { UserService } from "src/app/shared/services/user.service";
import { UtilityService } from "src/app/shared/services/utility.service";
import { SupplementaryProcessService } from "../supplementary-process-info/supplementary-process.service";

@Component({
    selector: 'app-onceoff-payment-emailing',
    templateUrl: './once-off-payment-emailing.component.html'
})

export class OnceOffPaymentEmailingComponent implements OnInit {

    @Input() allowanceName: string = "";
    @Input() processId: any = 0;
    @Input() paymentMonth: any = 0;
    @Input() paymentYear: any = 0;

    @Output() closeModalEvent = new EventEmitter<string>();
    @ViewChild('modal', { static: true }) modal!: ElementRef;

    modalTitle: string = "";

    emailingForm: FormGroup;

    month: string = "";

    constructor(private userService: UserService,
        public utilityService: UtilityService,
        public modalService: CustomModalService,
        private fb: FormBuilder,
        private service: SupplementaryProcessService) {
    }

    user() {
        return this.userService.User();
    }

    ngOnInit(): void {
        this.formInit();
        this.openModal();
        this.month = this.utilityService.getMonthNameFull(this.paymentMonth);
    }

    formInit() {
        this.emailingForm = this.fb.group({
            allowanceName: new FormControl(this.allowanceName),
            processId: new FormControl(this.processId, [Validators.min(1)]),
            paymentMonth: new FormControl(this.paymentMonth, [Validators.min(1), Validators.max(12)]),
            paymentYear: new FormControl(this.paymentYear, [Validators.min(2022), Validators.max(2050)]),
            reportFileName: new FormControl('Payslip', [Validators.required]),
            withPasswordProtected: new FormControl(true),
            fileFormat: new FormControl('PDF', [Validators.required])
        })

        console.log("this.emailingForm value", this.emailingForm.value)
    }

    openModal() {
        this.modalService.open(this.modal, "sm");
    }

    btnSubmit: boolean = false;
    submit() {
        if (this.emailingForm.valid) {
            this.btnSubmit = true;
            this.service.emailing(this.emailingForm.value).subscribe(response => {
                console.log("email service response >>>", response);
                this.btnSubmit = false;
            }, error => {
                console.log("email service error >>>", error);
                this.btnSubmit = false;
            })
        }
        else {
            this.utilityService.fail("Invalid Form Submission", "Site Reponse");
        }
    }

    closeModal(reason: any) {
        this.modalService.service.dismissAll(reason);
        this.closeModalEvent.emit(reason);
    }
}