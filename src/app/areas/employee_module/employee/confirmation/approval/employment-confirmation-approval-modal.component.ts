import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { CustomModalService } from "src/app/shared/services/custom-modal.service";
import { UtilityService } from "src/app/shared/services/utility.service";
import { EmployeeInfoService } from "../../employee-info.service";
import { EmploymentConfirmationSerivce } from "../employment-confirmation.service";

@Component({
    selector: 'app-employee-module-employment-confirmation-approval-modal',
    templateUrl: './employment-confirmation-approval-modal.component.html'
})
export class EmploymentConfirmationApprovalModalComponent implements OnInit {

    @Input() id: number = 0;
    @Input() employeeId: number = 0;
    @Input() data: any;
    @Output() closeModalEvent = new EventEmitter<string>();

    @ViewChild('employmentConfirmationApprovaModal', { static: true }) employmentConfirmationApprovaModal !: ElementRef;

    modalTitle: any = "Employment Confirmation Approval";

    constructor(private fb: FormBuilder,
        public toastr: ToastrService,
        private employeeInfoService: EmployeeInfoService,
        public utilityService: UtilityService,
        public modalService: CustomModalService,
        private employmentConfirmationSerivce: EmploymentConfirmationSerivce) {
    }

    ngOnInit(): void {
        console.log("data >>>", this.data);
        this.employeeApprovalFormInit();
    }

    employeeApprovalForm: FormGroup;

    employeeApprovalFormInit() {
        this.employeeApprovalForm = this.fb.group({
            confirmationProposalId: new FormControl(this.id, Validators.min(1)),
            employeeId: new FormControl(this.employeeId, Validators.min(1)),
            remarks: new FormControl(),
            stateStatus: new FormControl('Approved', [Validators.required])
        })
        this.modalService.open(this.employmentConfirmationApprovaModal, "lg");
    }

    ddlEmployees: any[];
    loadEmployees() {
        this.ddlEmployees = [];
        this.employeeInfoService.loadDropdownData({});
        this.employeeInfoService.ddl_employee_data$.subscribe(data => {
            this.employeeInfoService.loadDropdown(data);
            this.ddlEmployees = this.employeeInfoService.ddl$;
        }, error => {
            console.error('Error while fetching data:', error);
        });
    }

    submit() {
        if (this.employeeApprovalForm.valid) {
            this.employmentConfirmationSerivce.approval(this.employeeApprovalForm.value).subscribe(response => {
                if (response.status == true) {
                    this.utilityService.success("Saved Successfull", "Server Response", 1000)
                    this.closeModal("Save Complete");
                }
                else {
                    this.utilityService.fail("Someting went wrong", "Server Response", 1000)
                    if (response.msg == "Validation Error") {
                        console.log("Validation Error >>>", response.msg);
                    }
                }
            }, (error) => {
                console.log("error >>>", error);
                this.utilityService.fail("Someting went wrong", "Server Response", 1000)
            })
        }
        else {
            this.utilityService.fail("Invalid Form", "Site Response");
        }
    }
    closeModal(reason: any) {
        this.modalService.service.dismissAll(reason);
        this.closeModalEvent.emit(reason);
    }

}