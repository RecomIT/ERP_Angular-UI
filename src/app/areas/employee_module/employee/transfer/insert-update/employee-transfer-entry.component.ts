import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { BsDatepickerConfig } from "ngx-bootstrap/datepicker";
import { ToastrService } from "ngx-toastr";
import { ControlPanelWebService } from "src/app/shared/services/control-panel.service";
import { CustomModalService } from "src/app/shared/services/custom-modal.service";
import { UtilityService } from "src/app/shared/services/utility.service";
import { AreasHttpService } from "../../../../areas.http.service";
import { EmployeeInfoService } from "../../employee-info.service";
import { EmployeeTransferService } from "../employee-transfer.service";
import { DepartmentService } from "../../../Organizational/department/department.service";

@Component({
    selector: 'app-employee-transfer-request-modal',
    templateUrl: './employee-transfer-entry.component.html'
})

export class EmployeeTransferEntryComponent implements OnInit {

    @Input() id: any = 0;
    @Output() closeModalEvent = new EventEmitter<string>();

    @ViewChild('transferProposalModal', { static: true }) transferProposalModal!: ElementRef;
    modalTitle: string = "Transfer Proposal Request";

    datePickerConfig: Partial<BsDatepickerConfig> = this.utilityService.datePickerConfig();

    constructor(
        private fb: FormBuilder,
        public toastr: ToastrService,
        public utilityService: UtilityService,
        public modalService: CustomModalService,
        private employeeTransferService: EmployeeTransferService,
        private employeeInfoService: EmployeeInfoService,
        private controlPanelWebService: ControlPanelWebService,
        private departmentService: DepartmentService) {

    }

    ngOnInit(): void {
        this.existingText = null;
        this.modalTitle = this.id > 0 ? "Update Transfer Proposal" : "Transfer Proposal Request";
        this.selectedEmployee = null;
        this.loadEmployees();
        this.transferProposalFormInit();
        this.openModal();
        if (this.id > 0) {
            this.getEmployeeTransferProposalById();
        }

    }

    head: any[] = ["Branch", "Department"];

    select2Options = this.utilityService.select2Config();

    getEmployeeTransferProposalById() {
        this.employeeTransferService.getById({ transferProposalId: this.id }).subscribe(response => {
            this.setEmployeeTransferProposal(response.body);
        }, (error) => {
            this.utilityService.httpErrorHandler(error);
        })
    }

    setEmployeeTransferProposal(response_data: any) {
        this.transferProposalForm.get('transferProposalId').setValue(response_data.transferProposalId);
        this.transferProposalForm.get('employeeId').setValue(response_data.employeeId);
        this.transferProposalForm.get('head').setValue(response_data.head);
        this.transferProposalForm.get('proposalValue').setValue(response_data.proposalValue);
        this.transferProposalForm.get('effectiveDate').setValue(new Date(response_data.effectiveDate));
        this.transferProposalForm.get('remarks').setValue('');
    }


    ddlEmployees: any[] = [];

    loadEmployees() {
        this.employeeInfoService.loadDropdownData({});
        this.employeeInfoService.ddl_employee_data$.subscribe(data => {
            this.employeeInfoService.loadDropdown(data);
            this.ddlEmployees = this.employeeInfoService.ddl$;
        }, error => {
            console.error('Error while fetching data:', error);
        });
    }

    ddlProposalId: any[] = []
    loadBranches() {
        this.ddlProposalId = [];
        this.controlPanelWebService.getBranchExtension<any[]>("7").then((data) => {
            console.log("getBranchExtension >>> ", data);
            this.ddlProposalId = data;
            this.findExistingValue();
        })
    }

    loadDepartments() {
        this.ddlProposalId = [];
        this.departmentService.loadDepartmentDropdown();
        this.departmentService.ddl$.subscribe(data => {
            this.ddlProposalId = data;
            this.findExistingValue();
        })
    }

    loadSections() {

    }

    loadSubsections() {

    }

    employeeId: number = 0;
    selectedEmployee: any;
    transferProposalForm: FormGroup;
    existingText: string = "";
    transferProposalFormInit() {
        this.transferProposalForm = this.fb.group({
            transferProposalId: new FormControl(0),
            employeeId: new FormControl(0, [Validators.min(1)]),
            head: new FormControl('', [Validators.required]),
            proposalValue: new FormControl('', [Validators.min(1)]),
            effectiveDate: new FormControl(null, [Validators.required]),
            remarks: new FormControl('', [Validators.maxLength(200)])
        });


        this.transferProposalForm.get('employeeId').valueChanges.subscribe((value: any) => {
            this.selectedEmployee = null;
            this.employeeId = this.utilityService.IntTryParse(value);
            if (this.employeeId > 0) {
                this.getEmployeeInfoById();
            }

            this.existingText = "";
            this.transferProposalForm.get('head').setValue('');
            this.transferProposalForm.get('proposalValue').setValue('');
            this.transferProposalForm.get('effectiveDate').setValue(null);
            this.transferProposalForm.get('remarks').setValue('');
        })

        this.transferProposalForm.get('head').valueChanges.subscribe((value: string) => {
            this.ddlProposalId = [];
            this.existingText = "";
            if (value == "Branch") {
                this.loadBranches();
            }
            else if (value == "Department") {
                this.loadDepartments();
            }
        })

        this.transferProposalForm.get('proposalValue').valueChanges.subscribe(data => {
            if (this.utilityService.IntTryParse(data) > 0) {
                if (this.utilityService.IntTryParse(data) == (this.selectedEmployee?.branchId ?? 0)) {
                    this.utilityService.fail("This branch/department is already exist", "Site Response");
                    this.transferProposalForm.get('proposalValue').setValue('');
                }
            }
        })
    }

    findExistingValue() {
        this.existingText = "";
        const headValue = this.transferProposalForm.get('head').value;
        console.log("this.ddlProposalId >>>", this.ddlProposalId);
        if (headValue != null && headValue != '' && headValue == 'Branch') {
            this.existingText = this.selectedEmployee != null ? (this.ddlProposalId.find(item => item.id == this.selectedEmployee.branchId).text ?? 'N/A') : '';
            //(this.selectedEmployee?.branchName ?? 'N/A') : '';
        }
        else if (headValue != null && headValue != '' && headValue == 'Department') {
            this.existingText = this.selectedEmployee != null ? (this.selectedEmployee?.departmentName ?? 'N/A') : '';
        }
    }

    submitProposal() {
        if (this.transferProposalForm.valid) {

            this.employeeTransferService.save(this.transferProposalForm.value).subscribe(response => {
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
                this.utilityService.httpErrorHandler(error);
            })
        }
        else {
            this.utilityService.fail("Invalid Form", "Site Response");
        }
    }

    openModal() {
        this.modalService.open(this.transferProposalModal, "lg");
    }

    setFormValue(response_data: any) {

    }

    closeModal(reason: string) {
        this.modalService.service.dismissAll(reason);
        this.closeModalEvent.emit(reason); // fair
    }

    getEmployeeInfoById() {
        this.employeeInfoService.getServiceData({ employeeId: this.employeeId }).then(data => {
            this.selectedEmployee = data[0];
            this.findExistingValue();
        })
    }
}