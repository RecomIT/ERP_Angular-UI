import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { CustomModalService } from "src/app/shared/services/custom-modal.service";
import { UtilityService } from "src/app/shared/services/utility.service";
import { DiscontinuedEmployeeService } from "../discontinued-employee.service";

@Component({
    selector: 'employee-module-approval-discontinued-employee-modal',
    templateUrl: './approval-discountinued-employee.component.html'
})

export class ApprovalDiscontinuedEmployeeModalComponent implements OnInit {
    @Input() id: number = 0;
    @Output() closeModalEvent = new EventEmitter<string>();
    @ViewChild('discontinuedEmployeeApprovalModal', { static: true }) discontinuedEmployeeApprovalModal!: ElementRef;
    select2Config: any = this.utilityService.select2Config();
    datePickerConfig: any = this.utilityService.datePickerConfig();

    constructor(
        private fb: FormBuilder,
        private utilityService: UtilityService,
        public modalService: CustomModalService,
        private discontinuedEmployeeService: DiscontinuedEmployeeService
    ) { }

    ngOnInit(): void {
        console.log("Approval of discontinued employee")
        this.formInit();
        if (this.id > 0) {
            this.getById();
        }
    }

    closeModal(reason: any) {
        this.closeModalEvent.emit(reason);
        this.modalService.service.dismissAll(reason);
    }

    discontinued_item: any;
    getById() {
        this.discontinuedEmployeeService.getById({ discontinuedId: this.id }).subscribe(response => {
            this.discontinued_item = response.body;
            this.load_value(response.body);
        })
    }

    openModal() {
        this.modalService.open(this.discontinuedEmployeeApprovalModal, "sm")
    }

    form: FormGroup;

    formInit() {
        this.form = this.fb.group({
            discontinuedId: new FormControl(this.id, [Validators.min(1)]),
            employeeId: new FormControl(0),
            employeeCode: new FormControl(''),
            stateStatus: new FormControl('Approved', [Validators.required]),
            lastWorkingDate: new FormControl(''),
            calculateFestivalBonusTaxProratedBasis: new FormControl(false),
            calculateProjectionTaxProratedBasis: new FormControl(false),
            releasetype: new FormControl('Voluntary'),
        })
        this.openModal();
    }

    employeeName: any = "";
    employeeCode: any = "";
    lastWorkingDate: any = "";
    calculateFestivalBonusTaxProratedBasis: boolean = false;
    calculateProjectionTaxProratedBasis: boolean = false;
    releasetype: string = "";

    load_value(value: any) {
        this.form.get('discontinuedId').setValue(this.id);
        this.form.get('employeeId').setValue(value?.employeeId);
        this.form.get('employeeCode').setValue(value?.employeeCode);
        this.employeeName = value?.employeeName;
        this.employeeCode = value?.employeeCode;
        this.lastWorkingDate = value?.lastWorkingDate;
        this.calculateFestivalBonusTaxProratedBasis = value?.calculateFestivalBonusTaxProratedBasis;
        this.calculateProjectionTaxProratedBasis = value?.calculateProjectionTaxProratedBasis;
        this.releasetype = value?.releasetype;
    }

    server_errors: any;
    submit() {
        if (this.form.valid) {
            this.discontinuedEmployeeService.approval(this.form.value).subscribe((reasponse) => {
                if (reasponse.body?.status) {
                    this.utilityService.success(reasponse?.msg, "Server Response");
                    this.closeModal(this.utilityService.SuccessfullySaved);
                }
                else {
                    if (reasponse.body?.msg == "Validation Error") {
                        this.server_errors = JSON.parse(reasponse.body?.errorMsg)
                    }
                    else {
                        this.utilityService.fail(reasponse?.msg, "Server Response");
                    }
                }
            }, (error) => {
                this.utilityService.fail("Something went wrong");
            })
        }
        else {
            this.utilityService.fail("Invalid Form Submission", "Site Response");
        }
    }


}