import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { ControlPanelWebService } from "src/app/shared/services/control-panel.service";
import { CustomModalService } from "src/app/shared/services/custom-modal.service";
import { HrWebService } from "src/app/shared/services/hr-web.service";
import { PayrollWebService } from "src/app/shared/services/payroll-web.service";
import { UserService } from "src/app/shared/services/user.service";
import { UtilityService } from "src/app/shared/services/utility.service";
import { AreasHttpService } from "../../../../areas.http.service";
import { BsDatepickerConfig } from "ngx-bootstrap/datepicker";
@Component({
    selector: 'app-payroll-bonus-process-execution',
    templateUrl: './bonus-process-execution.component.html'
})

export class BonusProcessExecutionComponent implements OnInit {

    datePickerConfig: Partial<BsDatepickerConfig> = {};
    constructor(private utilityService: UtilityService, private payrollWebService: PayrollWebService, private controlPanelWebService: ControlPanelWebService, private hrWebService: HrWebService, private fb: FormBuilder,
        private userService: UserService, public modalService: CustomModalService, private areasHttpService: AreasHttpService) {

    }
    pagePrivilege: any= this.userService.getPrivileges();;

    ngOnInit(): void {
        this.bonusProcessExecutionFormInit();
        this.datePickerConfig = Object.assign({}, {
            containerClass: "theme-dark-blue",
            showWeekNumbers: false,
            dateInputFormat: "DD-MMMM-YYYY",
            isAnimated: true,
            showClearButton: false,
            showTodayButton: false,
            todayPosition: "left",
            rangeInputFormat: "DD-MMM-YYYY",
            rangeSeparator: " ~ ",
            size: "sm",
            customTodayClass: 'custom-today-class'
        })
    }

    /// Page Basic Setting //
    logger(msg: any, options: any) {
        this.utilityService.consoleLog(msg, options);
    }

    User() {
        return this.userService.User();
    }

    select2Options = {
        width: "100%",
        containerCssClass: "form-control form-control-sm text-x-small font-bold",
        theme: "bootstrap4"
    }
    //===================//

    bonusProcessExecutionForm: FormGroup;

    bonusProcessExecutionFormInit() {
        this.bonusProcessExecutionForm = this.fb.group({
            bonusAndConfig: new FormControl('', [Validators.required]),
            bonusId: new FormControl(0, [Validators.min(1)]),
            bonusConfigId: new FormControl(0, [Validators.min(1)]),
            bonusMonth: new FormControl(0, [Validators.min(1)]),
            bonusYear: new FormControl(0, [Validators.min(1)]),
            executionOn: new FormControl('', [Validators.required]),
            selectedEmployees: new FormControl(''),
            processByDepartmentId: new FormControl(0),
            processByBranchId: new FormControl(0),
            processDate: new FormControl(null, [Validators.required]),
            paymentDate: new FormControl(null, [Validators.required]),
        })

        this.loadBonusAndConfigDropdown();

        this.bonusProcessExecutionForm.get('bonusAndConfig').valueChanges.subscribe(value => {
            this.bonusProcessExecutionForm.get('bonusId').setValue(0);
            this.bonusProcessExecutionForm.get('bonusConfigId').setValue(0);
            if (value != '') {
                let values = value.split("#");
                if (values.length > 0) {
                    this.bonusProcessExecutionForm.get('bonusId').setValue(this.utilityService.IntTryParse(values[0]));
                    this.bonusProcessExecutionForm.get('bonusConfigId').setValue(this.utilityService.IntTryParse(values[1]));
                }
            }
        })

        this.bonusProcessExecutionForm.get("processDate").valueChanges.subscribe(value => {
            this.bonusProcessExecutionForm.get('bonusMonth').setValue(0);
            this.bonusProcessExecutionForm.get('bonusYear').setValue(0);
            this.bonusProcessExecutionForm.get('paymentDate').setValue(null);
            if (value != null) {
                const cutoff_month = (new Date(value)).getMonth()+1; 
                const cutoff_year = (new Date(value)).getFullYear();
                this.bonusProcessExecutionForm.get('bonusMonth').setValue(cutoff_month);
                this.bonusProcessExecutionForm.get('bonusYear').setValue(cutoff_year);
                this.bonusProcessExecutionForm.get('paymentDate').setValue(new Date(value));
            }
        })

        this.bonusProcessExecutionForm.get("executionOn").valueChanges.subscribe(value => {
            this.bonusProcessExecutionForm.get('selectedEmployees').clearValidators();
            this.bonusProcessExecutionForm.get('selectedEmployees').updateValueAndValidity();
            this.bonusProcessExecutionForm.get('processByBranchId').clearValidators();
            this.bonusProcessExecutionForm.get('processByBranchId').updateValueAndValidity();
            this.bonusProcessExecutionForm.get('processByDepartmentId').clearValidators();
            this.bonusProcessExecutionForm.get('processByDepartmentId').updateValueAndValidity();
            if (value == "Selected Employees") {
                this.bonusProcessExecutionForm.get('selectedEmployees').setValidators([Validators.required]);
                this.bonusProcessExecutionForm.get('selectedEmployees').updateValueAndValidity();
            }
            else if (value == "Branch") {
                this.bonusProcessExecutionForm.get('processByBranchId').setValidators([Validators.min(1)]);
                this.bonusProcessExecutionForm.get('processByBranchId').updateValueAndValidity();
            }
            else if (value == "Department") {
                this.bonusProcessExecutionForm.get('processByDepartmentId').setValidators([Validators.min(1)]);
                this.bonusProcessExecutionForm.get('processByDepartmentId').updateValueAndValidity();
            }
           // console.log("this.bonusProcessExecutionForm.invalid", this.bonusProcessExecutionForm.invalid);
           // console.log("this.bonusProcessExecutionForm", this.bonusProcessExecutionForm);
        })
    }

    ddlBonus: any[] = [];
    loadBonusAndConfigDropdown() {
        this.ddlBonus = [];
        this.payrollWebService.GetBonusAndConfigInThisFiscalYearExtension<any[]>().then((data) => {
            this.ddlBonus = data;
        })
    }

    submit() {

    }
}