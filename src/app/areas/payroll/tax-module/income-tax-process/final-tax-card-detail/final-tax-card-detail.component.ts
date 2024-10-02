import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { UtilityService } from "src/app/shared/services/utility.service";
import { FinalTaxCardService } from "../final-tax-card-process/final-tax-card-process.service";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { error } from "console";
import { EmployeeInfoService } from "src/app/areas/employee_module/employee/employee-info.service";
import { CustomModalService } from "src/app/shared/services/custom-modal.service";

@Component({
    selector: 'app-payroll-final-tax-card-detail-modal',
    templateUrl: './final-tax-card-detail.component.html'
})

export class FinalTaxCardDetailComponent implements OnInit {
    @Input() fiscalYearId: number = 0;
    @Input() branchId: number = 0;
    @Input() branchName: string = "";
    @Input() year: number = 0;

    @ViewChild("modal", { static: true }) modal !: ElementRef;
    @Output() closeModalEvent = new EventEmitter<string>();

    constructor(
        private fb: FormBuilder,
        public utilityService: UtilityService,
        private finalTaxCardService: FinalTaxCardService,
        private employeeInfoService: EmployeeInfoService,
        private modalService: CustomModalService,
    ) {
    }

    ngOnInit(): void {
        this.formInit();
        this.loadEmployeeDropdown();
        this.getDetails();
    }

    openModal() {
        this.modalService.open(this.modal, "xl");
    }

    ddlEmployees: any[];
    loadEmployeeDropdown() {
        this.employeeInfoService.loadDropdownData({});
        this.employeeInfoService.ddl_employee_data$.subscribe(data => {
            this.employeeInfoService.loadDropdown(data);
            this.ddlEmployees = this.employeeInfoService.ddl$;
        }, error => {
            console.error('Error while fetching data:', error);
        });
    }

    form: FormGroup;
    formInit() {
        this.form = this.fb.group({
            employeeId: new FormControl(0),
            fiscalYearId: new FormControl(this.fiscalYearId),
            branchId: new FormControl(this.branchId),
            year: new FormControl(this.year),
        })
        this.openModal();

        this.form.get('employeeId').valueChanges.subscribe({
            next: (value) => {
                setTimeout(() => {
                    this.getDetails();
                }, 5)
            }
        })
    }

    list_of_detail: any = null;
    select2Config: any = this.utilityService.select2Config();
    getDetails() {
        let params = {
            employeeId: this.utilityService.IntTryParse(this.form.get('employeeId').value),
            fiscalYearId: this.fiscalYearId,
            branchId: this.branchId,
            year: this.year
        }
        this.finalTaxCardService.getFinalTaxProcesSummaries(params).subscribe({
            next: (response) => {
                this.list_of_detail = response.body;
                console.log("list_of_detail >>>", this.list_of_detail);
            },
            error: (error) => {
            }
        })
    }

    downloadReport(employeeId: number) {
        let params = {
            employeeId: employeeId,
            fiscalYearId: this.form.get('fiscalYearId').value,
            branchId: this.form.get('branchId').value,
            year: this.form.get('year').value
        };

        this.finalTaxCardService.downloadTaxCard(params).subscribe({
            next: (response) => {
                this.utilityService.downloadFile(response, 'application/pdf', 'Tax Card.pdf')
            },
            error: (error) => {
                console.log("error >>>", error);
            }
        })
    }

    closeModal(reason: any) {
        this.modalService.service.dismissAll(reason);
        this.closeModalEvent.emit(reason);
    }
}