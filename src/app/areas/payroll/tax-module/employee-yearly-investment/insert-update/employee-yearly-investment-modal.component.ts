import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { EmployeeInfoService } from "src/app/areas/employee_module/employee/employee-info.service";
import { CustomModalService } from "src/app/shared/services/custom-modal.service";
import { UserService } from "src/app/shared/services/user.service";
import { UtilityService } from "src/app/shared/services/utility.service";
import { EmployeeYearlyInvestmentService } from "../employee-yearly-investment.service";
@Component({
    selector: 'app-payroll-employee-yearly-investment-modal',
    templateUrl: './employee-yearly-investment-modal.component.html'
})

export class EmployeeYearlyInvestmentModalComponent implements OnInit {
    @Input() id: any = 0;
    @Output() closeModalEvent = new EventEmitter<string>();
    modalTitle: any = "Add Yearly Investment Submission";
    @ViewChild('yearinvestmentmodal', { static: true }) yearinvestmentmodal!: ElementRef;

    constructor(private utilityService: UtilityService, private fb: FormBuilder,
        private userService: UserService, public modalService: CustomModalService,
        private employeeYarlyInvestmentService: EmployeeYearlyInvestmentService,
        private employeeInfoService: EmployeeInfoService) { }

    ngOnInit(): void {
        this.openModal();
        this.saveFormInit();
        this.getCurrentFiscalYear();
        this.loadEmployeeDropdown();
        if (this.id > 0) {
            this.getEmployeeYearlyInvestmentById(this.id);
        }
    }
    select2Config = this.utilityService.select2Config();
    fiscal_year_range: string = "";
    current_fiscal_year: any;
    getCurrentFiscalYear() {
        this.current_fiscal_year = this.employeeYarlyInvestmentService.getCurrentFiscalYear<any>().then(data => {
            this.current_fiscal_year = data;
            this.saveForm.get('fiscalYearId').setValue(this.current_fiscal_year.fiscalYearId);
            this.fiscal_year_range = this.current_fiscal_year.fiscalYearRange;
        })
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

    saveForm: FormGroup;
    saveFormInit() {
        this.saveForm = this.fb.group({
            id: new FormControl(0),
            employeeId: new FormControl(0, [Validators.min(1)]),
            fiscalYearId: new FormControl(0),
            investmentAmount: new FormControl(0, [Validators.min(1)])
        })
    }

    employeeName: string="";

    User() {
        return this.userService.User();
    }

    openModal() {
        this.modalService.open(this.yearinvestmentmodal, 'md');
    }

    closeModal(reason: any) {
        this.modalService.service.dismissAll(reason);
        this.closeModalEvent.emit(reason);
    }

    getEmployeeYearlyInvestmentById(id: any) {
        let params = { id: id }
        this.employeeYarlyInvestmentService.getEmployeeYearlyInvestmentByIdAsync(params).subscribe(response => {
            if (response != null && response[0]?.id > 0) {
                this.setFormValue(response[0]);
            }
        })
    }

    setFormValue(response_data: any) {
        this.modalTitle = "Edit Yearly Investment Submission";
        this.saveForm.get('id').setValue(response_data.id);
        this.saveForm.get('employeeId').setValue(response_data.employeeId);
        this.employeeName = response_data.employeeName;
        //this.saveForm.get('employeeId').disable();
        this.saveForm.get('fiscalYearId').setValue(response_data.fiscalYearId);
        this.saveForm.get('investmentAmount').setValue(response_data.investmentAmount);
    }

    btnSave: boolean = false;
    submit() {
        if (this.saveForm.valid) {
            this.btnSave = true;
            this.employeeYarlyInvestmentService.saveEmployeeYearlyInvestment(this.saveForm.value).subscribe(response => {
                this.btnSave = false;
                if (response.body?.status) {
                    this.utilityService.success(response.body?.msg, 'Server Response');
                    this.closeModal('Save Successful');
                }
                else {
                    this.utilityService.warning(response.body?.msg, 'Server Response');
                }
            }, error => {
                this.btnSave = false;
                this.utilityService.fail('Something went wrong', 'Server Response');
            })
        }
        else {
            this.btnSave = false;
        }
    }

} 