import { Component, OnInit } from "@angular/core";
import { EmployeeLogService } from "./employee-log.service";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { UserService } from "src/app/shared/services/user.service";
import { UtilityService } from "src/app/shared/services/utility.service";
import { EmployeeInfoService } from "../employee-info.service";
import { ControlPanelWebService } from "src/app/shared/services/control-panel.service";
import { UserLogReportService } from "src/app/areas/control-panel/user-management/log-report/user-log-report.service";
import { DatePipe } from "@angular/common";

@Component({
    selector: 'app-employee-module-employee-log',
    templateUrl: './employee-log.component.html'
})

export class EmployeeLogComponent implements OnInit {


    constructor(
        private fb: FormBuilder,
        private userService: UserService,
        public utilityService: UtilityService,
        private employeeInfoService: EmployeeInfoService,
        private controlPanelWebService: ControlPanelWebService,
        private employeeLogService: EmployeeLogService,
        private datePipe: DatePipe
    ) { }

    datePickerConfig: any = this.utilityService.datePickerConfig();


    get() {

    }

    ngOnInit(): void {
        this.formInit();
        this.loadBranch();
        this.loadEmployeeDropdown();
    }

    form: FormGroup;
    types_of_report: string[] = ["User Access Activation Report", "User Privilege Report"];
    select2Config: any = this.utilityService.select2Config();

    formInit() {
        this.form = this.fb.group({
            dateRange: new FormControl(null),
            employeeId: new FormControl(0),
            branchId: new FormControl(0)
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

    ddlBranch: any[] = [];
    loadBranch() {
        this.ddlBranch = [];
        this.controlPanelWebService.getBranchExtension<any[]>("7").then((data) => {
            this.ddlBranch = data;
        })
    }

    submit() {
        if (this.form.valid) {
            // User Access Report
            let dateRange = this.form.get("dateRange").value;
            if (dateRange != null) {
                let fromDate = this.datePipe.transform(dateRange[0], "yyyy-MM-dd");
                let toDate = this.datePipe.transform(dateRange[1], "yyyy-MM-dd");
                dateRange = fromDate + "~" + toDate;
            }

            // this.employeeLogService.get({
            //     dateRange:dateRange,
            //     userId: this.form.get('employeeId').value,
            //     branchId: this.form.get('branchId').value
            // }).subscribe((response) => {
            //     if (response instanceof Blob) {
            //         if (response.size > 0) {
            //             this.utilityService.downloadFile(response, 'application/pdf', "User_Access_Report.pdf")
            //         }
            //     }
            //     else {
            //         this.utilityService.fail('No data available for report generation', "Server Response");
            //     }
            // }, (error) => {
            //     console.log("error >>>", error);
            // })

            this.employeeLogService.get({
                dateRange:dateRange,
                userId: this.form.get('employeeId').value,
                branchId: this.form.get('branchId').value
            }).subscribe((response) => {
                if (response instanceof Blob) {
                    if (response.size > 0) {
                        this.utilityService.downloadFile(response, 'application/pdf', "Employee_History_Log_Report.pdf")
                    }
                }
                else {
                    this.utilityService.fail('No data available for report generation', "Server Response");
                }
            }, (error) => {
                console.log("error >>>", error);
            })

        }
        else {
            this.utilityService.fail("Invalid form submission", "Site Response");
        }
    }

}