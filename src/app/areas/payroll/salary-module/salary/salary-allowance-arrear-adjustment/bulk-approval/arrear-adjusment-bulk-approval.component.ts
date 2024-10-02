import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from "@angular/core";
import { UtilityService } from "src/app/shared/services/utility.service";
import { AllowanceArrearAdjustmentService } from "../salary-allowance-arrear-adjustment.service";
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { UserService } from "src/app/shared/services/user.service";
import { AllowanceNameService } from "../../../allowance/allowance-head/allowance-name.service";
import { EmployeeInfoService } from "src/app/areas/employee_module/employee/employee-info.service";
import { CustomModalService } from "src/app/shared/services/custom-modal.service";
import { esLocale } from "ngx-bootstrap/chronos";
@Component({
    selector: 'app-payroll-arrear-adjustment-bulk-approval',
    templateUrl: 'arrear-adjusment-bulk-approval.component.html'
})

export class ArrearAdjustmentBulkApprovalComponent implements OnInit {

    @ViewChild('modal', { static: true }) modal!: ElementRef;
    @Output() closeModalEvent = new EventEmitter<string>();

    constructor(
        public utilityService: UtilityService,
        private fb: FormBuilder,
        private modalService: CustomModalService,
        private userService: UserService,
        private allowanceNameService: AllowanceNameService,
        private employeeInfoService: EmployeeInfoService,
        private service: AllowanceArrearAdjustmentService
    ) {
    }

    ngOnInit(): void {
        this.formInit();
        this.openModal();
        this.loadAllowanceNames();
        this.loadEmployees();
    }

    User() {
        return this.userService.User();
    }

    openModal() {
        this.modalService.open(this.modal, "lg");
    }

    select2Options: any = this.utilityService.select2Config();
    ddlYears: any = this.utilityService.getYears(2);
    ddlMonths: any = this.utilityService.getMonths();

    currentMonth: number = parseInt(this.utilityService.currentMonth);
    currentYear: number = parseInt(this.utilityService.currentYear);

    ddlAllowances: any[] = [];
    loadAllowanceNames() {
        this.allowanceNameService.loadAllowanceNameDropdown();
        this.allowanceNameService.ddl$.subscribe(data => {
            this.ddlAllowances = data;
        }, (error) => {
            console.log("error  while fetching data >>>", error);
        })
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
    formInit() {
        this.form = this.fb.group({
            employeeId: new FormControl(0),
            allowanceNameId: new FormControl(0),
            salaryMonth: new FormControl(this.currentMonth, [Validators.min(1), Validators.max(12)]),
            salaryYear: new FormControl(this.currentYear, [Validators.min(2023), Validators.max(2060)]),
            flag: new FormControl('', [Validators.required]),
            stateStatus: new FormControl('Approved', [Validators.required]),
            isCheckedAll: new FormControl(false),
            items: this.fb.array([])
        })

        this.form.get('employeeId').valueChanges.subscribe(value => {
            setTimeout(() => {
                this.getPendingItems()
            }, 5);
        })

        this.form.get('allowanceNameId').valueChanges.subscribe(value => {
            setTimeout(() => {
                this.getPendingItems()
            }, 5);
        })

        this.form.get('salaryMonth').valueChanges.subscribe(value => {
            setTimeout(() => {
                this.getPendingItems()
            }, 5);
        })

        this.form.get('salaryYear').valueChanges.subscribe(value => {
            setTimeout(() => {
                this.getPendingItems()
            }, 5);
        })

        this.form.get('flag').valueChanges.subscribe(value => {
            setTimeout(() => {
                this.getPendingItems()
            }, 5);
        })

        this.formArray = (<FormArray>this.form.get('items')).controls;
    }

    addColumns() {
        this.remove();
        this.data.forEach((item, index) => {
            this.formArray.push(this.fb.group({
                id: new FormControl(item.id),
                name: new FormControl(item.employeeName),
                code: new FormControl(item.employeeCode),
                allowance: new FormControl(item.allowanceName),
                month: new FormControl(item.salaryMonth),
                year: new FormControl(item.salaryYear),
                amount: new FormControl(item.amount),
                isChecked: new FormControl(false),
            }))
        })
    }

    remove() {
        if ((<FormArray>this.form.get('items')).length > 0) {
            (<FormArray>this.form.get('items')).clear()
        }
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

    checkAll(event: any) {
        let isChecked = event.target.checked;
        this.formArray.forEach((fg) => {
            if (fg instanceof FormGroup) {
                let formGroup = fg as FormGroup;
                formGroup.get('isChecked').setValue(isChecked);
            }
        })
    }

    data: any = null;
    getPendingItems() {
        this.data = null;
        let employeeId = this.utilityService.IntTryParse(this.form.get('employeeId').value);
        let allowanceNameId = this.utilityService.IntTryParse(this.form.get('allowanceNameId').value);
        let flag = this.form.get('flag').value;
        let salaryMonth = this.utilityService.IntTryParse(this.form.get('salaryMonth').value);
        let salaryYear = this.utilityService.IntTryParse(this.form.get('salaryYear').value);

        if (flag != "") {
            let params = {
                employeeId: employeeId.toString(),
                allowanceNameId: allowanceNameId.toString(),
                flag: flag,
                salaryMonth: salaryMonth.toString(),
                salaryYear: salaryYear.toString()
            };
            this.service.getPendingItems(params).subscribe({
                next: (response) => {
                    this.data = response.body;
                    this.addColumns();
                },
                error: (error) => {
                    console.log("getPendingItems error >>>>", error);
                }
            })
        }
        else {
            this.utilityService.fail("Please select amount type");
        }
    }

    btnSubmit: boolean = false;
    submit() {
        let params = { stateStatus: this.form.get('stateStatus').value, ids: [] };
        if (this.form.valid && this.btnSubmit == false) {
            if (this.checkValidaty()) {
                this.btnSubmit = true;
                this.formArray.forEach((item, index) => {
                    let formGroup = item as FormGroup;
                    if (formGroup instanceof FormGroup) {
                        params.ids.push(this.utilityService.IntTryParse(formGroup.get('id').value));
                    }
                })
                
                this.service.approval(params).subscribe({
                    next: (response) => {
                        this.utilityService.success(response.msg, "Server Response");
                        this.btnSubmit = false;
                        this.closeModal('Save Complete');
                    },
                    error: (error) => {
                        this.utilityService.httpErrorHandler(error);
                        this.btnSubmit = false;
                    }
                })

            }
            else {
                this.utilityService.fail("Please check at least one item", "Site Response");
            }
        }
        else {
            this.utilityService.fail("Invalid form submission", "Site Response");
        }
    }

    checkValidaty() {
        let isChecked = false;
        this.formArray.forEach((item, index) => {
            let formGroup = item as FormGroup;
            if (formGroup.get('isChecked').value == true) {
                isChecked = true;
            }
        })
        return isChecked;
    }

    closeModal(reason: any) {
        if (this.btnSubmit == false) {
            this.modalService.service.dismissAll(reason);
            this.closeModalEvent.emit(reason);
        }
        else {
            this.utilityService.fail("Something is running in this page, So You can not close this page now", "Site Response")
        }
    }

}