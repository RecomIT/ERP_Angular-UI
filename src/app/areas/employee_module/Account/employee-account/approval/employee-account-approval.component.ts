import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { UtilityService } from "src/app/shared/services/utility.service";
import { EmployeeAccountService } from "../employee-account.service";
import { CustomModalService } from "src/app/shared/services/custom-modal.service";

@Component({
    selector: 'app-employee-module-account-aproval-modal',
    templateUrl: './employee-account-approval.component.html'
})

export class EmployeeAccountApprovalModalComponent implements OnInit {

    @Input() id: number = 0;
    @Input() employeeId: number = 0;
    modalTitle: string ="Approval of Employee Account"

    @Output() closeModalEvent = new EventEmitter<string>();
    @ViewChild('EmployeeAccountApprovalModal', { static: true }) employeeAccountApprovalModal!: ElementRef;

    constructor(private fb: FormBuilder, private utilityService: UtilityService, private employeeAccountService: EmployeeAccountService, private modalService: CustomModalService) {
    }

    ngOnInit(): void {
        this.formInit();
        this.getById();
    }

    form: FormGroup;

    formInit() {
        this.form = this.fb.group({
            accountInfoId: new FormControl(this.id, [Validators.min(1)]),
            employeeId: new FormControl(this.employeeId, [Validators.min(1)]),
            stateStatus: new FormControl('Approved', [Validators.required]),
            remarks: new FormControl(''),
        })

        this.openModal();
    }

    employeeAccountInfo: any;
    getById() {
        this.employeeAccountService.getById({ employeeId: this.employeeId, accountInfoId: this.id }).subscribe(response => {
            if (Object.keys(response.body as any).length > 0) {
                this.employeeAccountInfo = response.body;
                console.log("this.employeeAccountInfo >>>", this.employeeAccountInfo);
            }
        }, (error) => {
            console.log("error >>>", error);
            this.utilityService.fail('Something went wrong','Server Response');
        })
    }

    openModal(){
        this.modalService.open(this.employeeAccountApprovalModal,"lg");
    }

    submit() {
        if (this.form.valid) {
            this.employeeAccountService.approval(this.form.value).subscribe(response => {
                if (response.status) {
                    this.utilityService.success(response.msg, 'Server Response')
                    this.closeModal('Save Complete');
                }
                else {
                    this.utilityService.fail(response.msg, 'Server Response');
                }
            }, (error) => {
                console.log("error >>>", error);
                this.utilityService.fail('Something went wrong', 'Server Response');
            })
        }
        else {
            this.utilityService.fail('Invalid Form Submission', 'Site Response');
        }
    }

    closeModal(reason: any) {
        this.modalService.service.dismissAll(reason);
        this.closeModalEvent.emit(reason);
    }

}