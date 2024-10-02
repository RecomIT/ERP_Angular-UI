import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { CustomModalService } from "src/app/shared/services/custom-modal.service";
import { UtilityService } from "src/app/shared/services/utility.service";
import { SalaryReviewService } from "../salary-review.service";
import { HrWebService } from "src/app/shared/services/hr-web.service";
import { DatePipe } from "@angular/common";
import { BsDatepickerConfig } from "ngx-bootstrap/datepicker";
import { EmployeeInfoService } from "src/app/areas/employee_module/employee/employee-info.service";

@Component({
    selector: 'app-salary-review-bulk-approval-Modal',
    templateUrl: './salary-review-bulk-approval-modal.component.html'
})

export class SalaryReviewBulkApprovalModalComponent implements OnInit {

    @ViewChild('blukApporvalModal', { static: true }) blukApporvalModal!: ElementRef;
    datePickerConfig: Partial<BsDatepickerConfig> = this.utilityService.datePickerConfig();
    select2Options: any = this.utilityService.select2Config();
    @Output() closeModalEvent = new EventEmitter<string>();

    constructor(
        private fb: FormBuilder,
        public modalService: CustomModalService,
        private utilityService: UtilityService,
        private service: SalaryReviewService,
        public hrWebService: HrWebService,
        private datepipe: DatePipe,
        private employeeInfoService: EmployeeInfoService
    ) {

    }
    ngOnInit(): void {
        this.loadEmployees();
        this.openModal();
        this.loadData();
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


    form: FormGroup;
    formArray: any;
    rows: any = [];
    total_rows: number = 0;
    types_of_status: any = ["Approved", "Cancelled"];


    openModal() {
        this.formInit();
        this.modalService.open(this.blukApporvalModal, "lg");
    }


    formInit() {
        this.form = this.fb.group({
            employeeId: new FormControl(0),
            dateRange: new FormControl(null),
            status: new FormControl(''),
            isCheckedAll: new FormControl(false),
            rows: this.fb.array([])
        })
        this.form.get('employeeId').valueChanges.subscribe(value => {
            this.loadData();
        })
        this.formArray = (<FormArray>this.form.get('rows')).controls;
    }

    checkAll(event: any) {
        let isChecked = event.target.checked;
        let arry = this.formArray;
        this.formArray.forEach((fg) => {
            if (fg instanceof FormGroup) {
                let formGroup = fg as FormGroup;
                formGroup.get('isChecked').setValue(isChecked);
            }
        })
    }

    item_Checked(event: any) {
        let checkedItems = 0;
        this.formArray.forEach((fg) => {
            if (fg instanceof FormGroup) {
                let formGroup = fg as FormGroup;
                let formControlValue = formGroup.get('isChecked').value;
                if (formControlValue) {
                    checkedItems = checkedItems + 1;
                }
            }
        });

        const formArrayLength = (this.formArray as FormArray).length;
        if (checkedItems == formArrayLength) {
            this.form.get('isCheckedAll').setValue(true);
        }
        else {
            this.form.get('isCheckedAll').setValue(false);
        }
    }

    loadData() {
        var params = {
            employeeId: this.utilityService.IntTryParse(this.form.get('employeeId').value)
        };

        this.service.getAllPendingSalaryReviewes(params).subscribe({
            next: (response) => {
                this.rows = response.body;
                this.addRows();
            },
            error: (error) => {
                console.log("error", error);
            }
        })
    }

    addRows() {
        this.removeRows();
        this.rows.forEach((item, index) => {
            this.formArray.push(this.fb.group({
                salaryReviewInfoId: new FormControl(item.salaryReviewInfoId),
                employeeId: new FormControl(item.employeeId),
                employeeName: new FormControl(item.fullName + "~" + item.employeeCode),
                proposalSalary: new FormControl(item.currentSalaryAmount),
                currentSalary: new FormControl(item.previousSalaryAmount),
                reason: new FormControl(item.incrementReason),
                isChecked: new FormControl(false),
            }))
        })
    }

    removeRows() {
        if ((<FormArray>this.form.get('rows')).length >= 1) {
            (<FormArray>this.form.get('rows')).clear();
        }
    }

    removeRow(index: number) {
        if ((<FormArray>this.form.get('rows')).length >= 1) {
            (<FormArray>this.form.get('rows')).removeAt(index);
        }
    }

    btnSubmit: boolean = false;
    approvalItems: any[] = [];
    submit() {
        if (this.validation() && this.btnSubmit == false) {
            let status = this.form.get('status').value;;
            if (confirm("Are you sure you want to " + status + " these salary review")) {
                this.btnSubmit = true;
                let approvalItemsLength = this.approvalItems.length;
                this.approvalItems.forEach((item, index) => {
                    this.service.approval(item).subscribe({
                        next: (response) => {
                        },
                        error: (error) => {
                        }
                    })
                    if (approvalItemsLength == index + 1) {
                        this.removeRows();
                        this.loadData();
                        this.utilityService.success("Data has been approved successfully", "Server Response");
                        this.btnSubmit = false;
                    }
                })
            }
        }
        else {
            this.utilityService.fail("Invalid form submission", "Site Response");
        }

    }

    validation() {
        let hasCheckedItem = false;
        this.approvalItems = [];
        if (this.form.get('status').value == '' || this.form.get('status').value == null || this.form.get('status').value == undefined) {
            this.utilityService.fail("Please select status field", "Site Response");
            return false;
        }
        this.formArray.forEach((fg) => {
            if (fg instanceof FormGroup) {
                let formGroup = fg as FormGroup;
                if (formGroup.get('isChecked').value) {
                    hasCheckedItem = true;
                    this.approvalItems.push({
                        salaryReviewInfoId: formGroup.get('salaryReviewInfoId').value,
                        employeeId: formGroup.get('employeeId').value,
                        stateStatus: this.form.get('status').value
                    })
                }
            }
        })
        if (!hasCheckedItem) {
            this.utilityService.fail("Please check at least one item to proceed", "Site Response");
        }
        return hasCheckedItem;
    }

    closeModal(reason: string) {
        this.modalService.service.dismissAll(reason);
        this.closeModalEvent.emit(reason);
    }

}