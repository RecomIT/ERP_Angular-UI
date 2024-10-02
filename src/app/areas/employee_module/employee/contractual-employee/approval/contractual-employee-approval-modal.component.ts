import { UtilityService } from "src/app/shared/services/utility.service";
import { ContractualEmployeeService } from "../contractual-employee.service";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { CustomModalService } from "src/app/shared/services/custom-modal.service";
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { error } from "console";
@Component({
    selector: 'employee-module-contractual-employee-approval-modal',
    templateUrl: './contractual-employee-approval-modal.component.html'
})

export class ContractualEmployeeApprovalModalComponent implements OnInit {

    @Input() contractId: number = 0;
    @Input() employeeId: number = 0;
    @Input() lastContractId: number = 0;
    @Input() lastContractEndDate: any = 0;
    @ViewChild('approvalModal', { static: true }) approvalModal!: ElementRef;
    @Output() closeModalEvent = new EventEmitter<string>();

    constructor(private fb: FormBuilder, private utilityService: UtilityService,
        private contractualEmployeeService: ContractualEmployeeService, public modalService: CustomModalService) {
    }
    ngOnInit(): void {
        console.log("contractId in modal >>>", this.contractId);
        this.formInit();
        this.getInfoById();
    }

    infoInDb: any = null;
    getInfoById() {
        this.contractualEmployeeService.getById({ contractId: this.contractId, employeeId: this.employeeId }).subscribe(response => {
            console.log("response body", response);
            this.infoInDb = response.body;
            this.setFormValue(this.infoInDb);
        }, (error) => { this.utilityService.httpErrorHandler(error) })
    }

    form: FormGroup;

    formInit() {
        this.form = this.fb.group({
            contractId: new FormControl(0, [Validators.min(1)]),
            employeeId: new FormControl(0, [Validators.min(1)]),
            lastContractId: new FormControl(0, [Validators.min(1)]),
            lastContractEndDate: new FormControl(null),
            stateStatus: new FormControl('Approved', [Validators.required]),
            remarks: new FormControl({ value: '', disabled: true })
        })
        this.openModal();
    }

    setFormValue(data: any) {
        if (data != null && Object.keys(data).length > 0) {
            this.form.get('contractId').setValue(data.contractId);
            this.form.get('employeeId').setValue(data.employeeId);
            this.form.get('lastContractId').setValue(data.lastContractId);
            this.form.get('lastContractEndDate').setValue(data.lastContractEndDate);
        }
    }

    btnSubmit: boolean = false;
    submit() {
        if (this.form.valid) {
            this.contractualEmployeeService.approval(this.form.value).subscribe(response=>{
                console.log("response >>>", response);
            },(error)=>{
                this.utilityService.httpErrorHandler(error);
            })
        }
        else {
            this.utilityService.fail("Invalid Form Submission", "Site Response");
        }
    }

    openModal() {
        this.modalService.open(this.approvalModal, "lg");
    }

    closeModal(reason: any) {
        this.closeModalEvent.emit(reason);
        this.modalService.service.dismissAll(reason);
    }

}