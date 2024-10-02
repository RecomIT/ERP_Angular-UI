import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { EmployeeInfoService } from "src/app/areas/employee_module/employee/employee-info.service";
import { ControlPanelWebService } from "src/app/shared/services/control-panel.service";
import { UserService } from "src/app/shared/services/user.service";
import { UtilityService } from "src/app/shared/services/utility.service";
import { UserLogReportService } from "./user-log-report.service";

@Component({
    selector: 'user-log-report',
    templateUrl: './user-log-report.component.html'
})

export class UserLogReportComponent implements OnInit {

    constructor(
        private fb: FormBuilder,
        private userService: UserService,
        public utilityService: UtilityService,
        private employeeInfoService: EmployeeInfoService,
        private controlPanelWebService: ControlPanelWebService,
        private userLogReportService: UserLogReportService
    ) { }

    ngOnInit(): void {
        this.formInit();
        this.loadBranch();
        this.loadEmployeeDropdown();
    }

    form: FormGroup;
    types_of_report: string[] = ["User Access Activation Report", "User Privilege Report", "User Role Privilege Report"];
    select2Config: any = this.utilityService.select2Config();

    formInit() {
        this.form = this.fb.group({
            reportType: new FormControl('', [Validators.required]),
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
            let selected_report_type = this.form.get('reportType').value;
            if (selected_report_type == "User Access Activation Report") {
                this.userLogReportService.userAccessReport({
                    employeeId: this.form.get('employeeId').value,
                    branchId: this.form.get('branchId').value
                }).subscribe((response) => {
                    if (response instanceof Blob) {
                        if (response.size > 0) {
                            this.utilityService.downloadFile(response, 'application/pdf', "User_Access_Report.pdf")
                        }
                    }
                    else {
                        this.utilityService.fail('No data available for report generation', "Server Response");
                    }
                }, (error) => {
                    console.log("error >>>", error);
                })
            }
            if (selected_report_type == "User Privilege Report") {
                this.userLogReportService.userPrivilegeReport({
                    employeeId: this.form.get('employeeId').value,
                    branchId: this.form.get('branchId').value
                }).subscribe((response) => {
                    if (response instanceof Blob) {
                        if (response.size > 0) {
                            this.utilityService.downloadFile(response, 'application/pdf', "User_Privilege_Report.pdf")
                        }
                    }
                    else {
                        this.utilityService.fail('No data available for report generation', "Server Response");
                    }
                }, (error) => {
                    console.log("error >>>", error);
                })
            }
            if (selected_report_type == "User Role Privilege Report") {
                this.userLogReportService.userRolePrivilegeReport({
                    branchId: this.form.get('branchId').value
                }).subscribe((response) => {
                    if (response instanceof Blob) {
                        if (response.size > 0) {
                            this.utilityService.downloadFile(response, 'application/pdf', "User_Role_Privilege_Report.pdf")
                        }
                    }
                    else {
                        this.utilityService.fail('No data available for report generation', "Server Response");
                    }
                }, (error) => {
                    console.log("error >>>", error);
                })
            }

        }
        else {
            this.utilityService.fail("Invalid form submission", "Site Response");
        }
    }

    submitRole() {
        if (this.form.valid) {
            let selected_report_type = this.form.get('reportType').value;
            if (selected_report_type == "User Access Activation Report") {
                this.userLogReportService.userRolePrivilegeReport({
                    branchId: this.form.get('branchId').value
                }).subscribe((response) => {
                    if (response instanceof Blob) {
                        if (response.size > 0) {
                            this.utilityService.downloadFile(response, 'application/pdf', "User_Access_Report.pdf")
                        }
                    }
                    else {
                        this.utilityService.fail('No data available for report generation', "Server Response");
                    }
                }, (error) => {
                    console.log("error >>>", error);
                })
            }
            if (selected_report_type == "User Privilege Report") {
                this.userLogReportService.userPrivilegeReport({
                    employeeId: this.form.get('employeeId').value,
                    branchId: this.form.get('branchId').value
                }).subscribe((response) => {
                    if (response instanceof Blob) {
                        if (response.size > 0) {
                            this.utilityService.downloadFile(response, 'application/pdf', "User_Privilege_Report.pdf")
                        }
                    }
                    else {
                        this.utilityService.fail('No data available for report generation', "Server Response");
                    }
                }, (error) => {
                    console.log("error >>>", error);
                })
            }
        }
        else {
            this.utilityService.fail("Invalid form submission", "Site Response");
        }
    }
}