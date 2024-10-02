import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { BsDatepickerConfig } from "ngx-bootstrap/datepicker";
import { ToastrService } from "ngx-toastr";
import { CustomModalService } from "src/app/shared/services/custom-modal.service";
import { UtilityService } from "src/app/shared/services/utility.service";
import { EmployeeInfoService } from "../../employee-info.service";
import { EmploymentPromotionSerivce } from "../employee-promotion.service";
import { DesignationService } from "../../../Organizational/designation/designation.service";

@Component({
    selector: 'app-employee-module-promotion-insert-update-modal',
    templateUrl: './employee-promotion-insert-update.component.html'
})

export class EmployeePromotionInsertUpdateModalComponent implements OnInit {

    @Input() id: any = 0;
    @Output() closeModalEvent = new EventEmitter<string>();

    @ViewChild('promotionProposalModal', { static: true }) promotionProposalModal!: ElementRef;
    modalTitle: string = "Promotion Proposal Request";

    datePickerConfig: Partial<BsDatepickerConfig> = this.utilityService.datePickerConfig();

    constructor(private fb: FormBuilder,
        public toastr: ToastrService,
        private employeeInfoService: EmployeeInfoService,
        public utilityService: UtilityService,
        private employmentPromotionSerivce: EmploymentPromotionSerivce,
        public modalService: CustomModalService,
        private designationService: DesignationService) {
    }

    ngOnInit(): void {
        this.existingText = null;
        this.modalTitle = this.id > 0 ? "Update Promotion Proposal" : "Promotion Proposal Request";
        this.selectedEmployee = null;
        this.loadEmployees();
        this.promotionProposalFormInit();
        this.openModal();
        if (this.id > 0) {
            this.getById();
        }
        this.datePickerConfig.maxDate = new Date();
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

    select2Options: any = this.utilityService.select2Config();

    getById() {
        this.employmentPromotionSerivce.getById({ id: this.id }).subscribe(response => {
            this.setEmployeePromotionProposal(response.body);
        }, (error) => {
            console.log("error >>>", error);
            this.toastr.error("Something went wrong", "Server Response", { timeOut: 1000 })
        })
    }

    setEmployeePromotionProposal(response_data: any) {
        this.promotionProposalForm.get('promotionProposalId').setValue(response_data.promotionProposalId);
        this.promotionProposalForm.get('employeeId').setValue(response_data.employeeId);
        this.promotionProposalForm.get('head').setValue(response_data.head);
        this.promotionProposalForm.get('proposalValue').setValue(response_data?.proposalValue);
        this.promotionProposalForm.get('effectiveDate').setValue(new Date(response_data.effectiveDate));
        this.promotionProposalForm.get('remarks').setValue('');
    }

    head = ["Designation"]
    ddlProposalId: any = []

    loadDesignations() {
        this.ddlProposalId = [];
        this.designationService.loadDesignationDropdown();
        this.designationService.ddl$.subscribe(data => {
            this.ddlProposalId = data;
            console.log("designationService >>>", this.ddlProposalId)
        });
    }

    employeeId: number = 0;
    selectedEmployee: any;
    promotionProposalForm: FormGroup;
    existingText: string = "";
    promotionProposalFormInit() {
        this.promotionProposalForm = this.fb.group({
            promotionProposalId: new FormControl(0),
            employeeId: new FormControl(0, [Validators.min(1)]),
            head: new FormControl('', [Validators.required]),
            proposalValue: new FormControl('', [Validators.min(1)]),
            effectiveDate: new FormControl(null, [Validators.required]),
            remarks: new FormControl('', [Validators.maxLength(200)])
        });

        this.promotionProposalForm.get('employeeId').valueChanges.subscribe((value: any) => {
            this.selectedEmployee = null;
            this.employeeId = this.utilityService.IntTryParse(value);
            if (this.employeeId > 0) {
                this.getEmployeeInfoById();
            }

            this.existingText = "";
            this.promotionProposalForm.get('head').setValue('');
            this.promotionProposalForm.get('proposalValue').setValue('');
            this.promotionProposalForm.get('effectiveDate').setValue(null);
            this.promotionProposalForm.get('remarks').setValue('');
        })

        this.promotionProposalForm.get('head').valueChanges.subscribe((value: string) => {
            this.existingText = "";
            if (value == "Designation") {
                this.loadDesignations();
            }
            else if (value == "Grade") {
            }
            this.findExistingValue();
        })
    }

    findExistingValue() {
        this.existingText = "";
        const headValue = this.promotionProposalForm.get('head').value;
        if (headValue == 'Designation') {
            this.existingText = this.selectedEmployee != null ? (this.selectedEmployee?.designationName ?? 'N/A') : '';
            console.log("this.existingText >>>", this.existingText);
        }
        else if (headValue == 'Grade') {
            this.existingText = this.selectedEmployee != null ? (this.selectedEmployee?.gradeName ?? 'N/A') : '';
        }
    }

    submitProposal() {
        if (this.promotionProposalForm.valid) {
            this.employmentPromotionSerivce.save(this.promotionProposalForm.value).subscribe(response => {
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
                this.utilityService.fail(error?.msg, "Server Response");
            })
        }
        else {
            this.utilityService.fail("Invalid Form", "Site Response");
        }
    }

    openModal() {
        this.modalService.open(this.promotionProposalModal, "lg");
    }


    closeModal(reason: string) {
        this.modalService.service.dismissAll(reason);
        this.closeModalEvent.emit(reason); // fair
    }

    getEmployeeInfoById() {
        this.employeeInfoService.getEmployeeInfos({ employeeId: this.employeeId }).subscribe(response => {
            console.log('response >>>', response);
            this.selectedEmployee = response.body[0] as any;
            console.log('selectedEmployee >>>', this.selectedEmployee);
            this.findExistingValue();
        }, (error) => {
            console.log("error >>>", error);
            this.toastr.error("Something went wrong", "Server Response", { timeOut: 1000 })
        })

    }
}