import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { BsDatepickerConfig } from "ngx-bootstrap/datepicker";
import { ToastrService } from "ngx-toastr";
import { CustomModalService } from "src/app/shared/services/custom-modal.service";
import { UtilityService } from "src/app/shared/services/utility.service";
import { EmploymentConfirmationSerivce } from "../employment-confirmation.service";
import { EmployeeInfoService } from "../../employee-info.service";
import { esLocale } from "ngx-bootstrap/chronos";

@Component({
    selector: 'app-employee-module-confirmation-insert-update-modal',
    templateUrl: './employee-confirmation-modal.component.html'
})

export class EmployeeConfirmationModalComponent implements OnInit {

    @Input() id: number = 0;
    @Output() closeModalEvent = new EventEmitter<string>();

    @ViewChild('employeeConfirmationModal', { static: true }) employeeConfirmationModal !: ElementRef;
    modalTitle: string = "";
    datePickerConfig: Partial<BsDatepickerConfig> = {};


    constructor(
        private fb: FormBuilder,
        public toastr: ToastrService,
        public utilityService: UtilityService,
        public modalService: CustomModalService,
        private employmentConfirmationSerivce: EmploymentConfirmationSerivce,
        private employeeInfoService: EmployeeInfoService,
    ) {
    }

    ngOnInit(): void {
        this.datePickerConfig = Object.assign({}, {
            containerClass: "theme-dark-blue",
            showWeekNumbers: false,
            dateInputFormat: "DD-MMM-YYYY",
            isAnimated: true,
            showClearButton: false,
            showTodayButton: false,
            todayPosition: "left"
        });
        this.confirmationFormInit();
        if (this.id > 0) {
            this.getConfirmationProposalById();
        }
    }

    select2Options = this.utilityService.select2Config();

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

    getUnconfirmedEmployeeInfosInApply() {
        this.employmentConfirmationSerivce.getUnconfirmedEmployeeInfosInApply().subscribe(response => {
            this.ddlEmployees = response.body
        }, (error) => {
            this.utilityService.httpErrorHandler(error);
        })
    }


    getUnconfirmedEmployeeInfosInUpdate() {
        this.employmentConfirmationSerivce.getUnconfirmedEmployeeInfosInUpdate().subscribe(response => {
            this.ddlEmployees = response.body
        }, (error) => {
            this.utilityService.httpErrorHandler(error);
        })
    }

    confirmationForm: FormGroup;

    confirmationFormInit() {
        this.confirmationForm = this.fb.group({
            confirmationProposalId: new FormControl(this.id),
            employeeId: new FormControl(null, [Validators.required]),
            confirmationDate: new FormControl(null, [Validators.required]),
            totalRatingScore: new FormControl(''),
            effectiveDate: new FormControl(null, [Validators.required]),
            appraiserComment: new FormControl(''),
            withPFActivation: new FormControl(false),
            pfEffectiveDate: new FormControl(null),
            pfActivationDate: new FormControl(null),
        })

        this.confirmationForm.get('confirmationDate').valueChanges.subscribe(data => {
            this.confirmationForm.get('effectiveDate').setValue(data)
        });

        this.confirmationForm.get('withPFActivation').valueChanges.subscribe(data => {
            if (data == true) {
                this.confirmationForm.get('pfEffectiveDate').setValue(this.confirmationForm.get('confirmationDate').value);
                this.confirmationForm.get('pfActivationDate').setValue(this.confirmationForm.get('confirmationDate').value);
            }
        })

        this.modalTitle = this.id > 0 ? 'Update Confirmation Proposal' : 'Add Confirmation Proposal';
        if (this.id > 0) {
            this.getUnconfirmedEmployeeInfosInUpdate();
        }
        else {
            this.getUnconfirmedEmployeeInfosInApply();
        }
        this.modalService.open(this.employeeConfirmationModal, "lg");
    }

    submit() {
        if (this.confirmationForm.valid) {

            this.confirmationForm.get('employeeId').setValue(this.id > 0 ? this.employeeId_in_update : this.confirmationForm.get('employeeId').value);
            this.employmentConfirmationSerivce.save(this.confirmationForm.value).subscribe(response => {
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

    getConfirmationProposalById() {
        this.employmentConfirmationSerivce.getById({ id: this.id }).subscribe(response => {
            console.log("getConfirmationProposalById response >>>",response)
            this.setFormValue(response.body);
        }, (error) => {
            console.log("error >>>", error);
            this.utilityService.fail("Someting went wrong", "Server Response", 1000)
        })
    }

    employeeId_in_update: any = 0;
    setFormValue(data: any) {
        if (data != null) {
            this.confirmationForm.get('employeeId').setValue(data.employeeId);
            this.employeeId_in_update = data.employeeId;
            this.confirmationForm.get('confirmationDate').setValue(new Date(data.confirmationDate));
            this.confirmationForm.get('totalRatingScore').setValue(data.totalRatingScore);
            this.confirmationForm.get('effectiveDate').setValue(new Date(data.effectiveDate));
            this.confirmationForm.get('appraiserComment').setValue(data.appraiserComment);
            this.confirmationForm.get('withPFActivation').setValue(data.withPFActivation);
            this.confirmationForm.get('pfEffectiveDate').setValue(new Date(data.pfEffectiveDate));
            this.confirmationForm.get('pfActivationDate').setValue(new Date(data.pfActivationDate));
        }
    }

    closeModal(reason: any) {
        this.modalService.service.dismissAll(reason);
        this.closeModalEvent.emit(reason);
    }

}