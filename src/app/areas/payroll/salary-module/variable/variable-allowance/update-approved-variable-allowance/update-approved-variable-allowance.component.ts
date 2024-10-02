import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { UtilityService } from "src/app/shared/services/utility.service";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { MonthlyVariableAllowanceService } from "../monthly-variable-allowance.service";
import { AllowanceNameService } from "../../../allowance/allowance-head/allowance-name.service";
import { EmployeeInfoService } from "src/app/areas/employee_module/employee/employee-info.service";
import { CustomModalService } from "src/app/shared/services/custom-modal.service";
//import { isObject } from "ngx-bootstrap/chronos/utils/type-checks";

@Component({
    selector: 'app-payroll-update-approved-variable-allowance',
    templateUrl: './update-approved-variable-allowance.component.html'
})

export class UpdateApprovedVariableAllowanceComponent implements OnInit {

    @Input() id: number = 0;
    @ViewChild('modal', { static: true }) modal!: ElementRef;
    @Output() closeModalEvent = new EventEmitter<string>();

    constructor(
        private fb: FormBuilder,
        private service: MonthlyVariableAllowanceService,
        private employeeInfoService: EmployeeInfoService,
        private allowanceNameService: AllowanceNameService,
        private modalService: CustomModalService,
        private utilityService: UtilityService) {

    }

    ngOnInit(): void {
        this.openModal();
        this.loadAllowanceNames();
        this.loadEmployees();
        this.getById();

    }

    select2Options: any = this.utilityService.select2Config();
    ddlYears: any = this.utilityService.getYears(2);
    ddlMonths: any = this.utilityService.getMonths();

    openModal() {
        this.formInit();
        this.modalService.open(this.modal, "lg");
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

    ddlAllowances: any[] = [];
    loadAllowanceNames() {
        this.allowanceNameService.loadAllowanceNameDropdown();
        this.allowanceNameService.ddl$.subscribe(data => {
            this.ddlAllowances = data;
        }, (error) => {
            console.log("error  while fetching data >>>", error);
        })
    }

    itemInDb: any;
    getById() {
        this.service.getById(this.id).subscribe(response => {
            this.itemInDb = response.body;
            this.dataInit();
        })
    }

    form: FormGroup;
    formInit() {
        this.form = this.fb.group({
            monthlyVariableAllowanceId: new FormControl(this.id),
            employeeId: new FormControl({ value: 0, disabled: true }, [Validators.required, Validators.min(1)]),
            allowanceNameId: new FormControl(0, [Validators.required, Validators.min(1)]),
            salaryMonth: new FormControl(0, Validators.min(1)),
            salaryYear: new FormControl(0, Validators.min(1)),
            amount: new FormControl(0, [Validators.required]),
        })
    }

    dataInit() {
        this.form.get('employeeId').setValue(this.itemInDb.employeeId);
        this.form.get('allowanceNameId').setValue(this.itemInDb.allowanceNameId);
        this.form.get('salaryMonth').setValue(this.itemInDb.salaryMonth);
        this.form.get('salaryYear').setValue(this.itemInDb.salaryYear);
        this.form.get('amount').setValue(this.itemInDb.amount);
    }

    btnSubmit: boolean = false;

    submit() {
        if (this.form.valid && this.btnSubmit == false) {
            this.btnSubmit = true;
            var params = { monthlyVariableAllowanceId: this.id, allowanceNameId: this.itemInDb.allowanceNameId, employeeId: this.itemInDb.employeeId, amount: this.form.get('amount').value };
            this.service.updateApprovedAllowance(params).subscribe({
                next: (response) => {
                    //console.log("response >>>", response);
                    if (response?.status) {
                        this.utilityService.success(this.utilityService.SuccessfullySaved, "Server Response");
                        this.closeModal('Save Complete')
                    }
                    else {
                    }
                    this.btnSubmit = false;
                },
                error: (error) => {
                    console.log("error >>>", error);
                    if (error?.msg != null) {
                            
                        // if (isObject(error?.msg)) {
                        //     this.utilityService.fail(error?.msg?.msg, "Server Response")
                        // }
                        // else {
                        //     this.utilityService.fail(error?.msg, "Server Response")
                        // }
                    }
                    this.btnSubmit = false;
                }
            })
        }
        else {
            this.utilityService.fail("Form value(s) is invalid", "Site Response")
        }
    }

    closeModal(reason: any) {
        this.modalService.service.dismissAll(reason);
        this.closeModalEvent.emit(reason);
    }

}