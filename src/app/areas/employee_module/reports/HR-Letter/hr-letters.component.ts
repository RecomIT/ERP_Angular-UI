import { Component, OnInit } from "@angular/core";
import { HRLetterService } from "./hr-letter.service";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { UtilityService } from "src/app/shared/services/utility.service";
import { EmployeeInfoService } from "../../employee/employee-info.service";
import { transition, trigger, useAnimation } from "@angular/animations";
import { slideInUp } from "ng-animate";
import { error } from "console";
import { DatePipe } from "@angular/common";

@Component({
    selector: 'app-employee-module-hr-letter',
    templateUrl: './hr-letter.component.html',
    animations: [
        trigger('slideInUp', [transition('* => *', useAnimation(slideInUp, { params: { timing: 0.5 } }))]),
    ]
})

export class HRLetterComponent implements OnInit {

    constructor(
        private utilityService: UtilityService,
        private employeeInfoService: EmployeeInfoService,
        private hrLetterService: HRLetterService,
        private datePipe: DatePipe,
        private fb: FormBuilder) {
    }
    // Common Variables //
    select2Config: any = this.utilityService.select2Config();
    datePickerConfig: any = this.utilityService.datePickerConfig();

    ngOnInit() {
        this.loadEmployeeDropdown();
        this.formInit();
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

    //Salary Certificate
    letters: string[] = ["Clearance Letter", "Experience Letter", "NOC", "Salary Certificate"]

    fileFormat: any[] = [{ type: "PDF", extension: "pdf" }, { type: "Word", extension: "docx" }];
    selectedFileFormat: string = "pdf";

    form: FormGroup;
    formInit() {
        this.form = this.fb.group({
            employeeId: new FormControl('', [Validators.required]),
            issueDate: new FormControl(null, [Validators.required]),
            reportName: new FormControl('', [Validators.required]),
            format: new FormControl(this.selectedFileFormat)
        })

        this.form.get('employeeId').valueChanges.subscribe(id => {
            if (this.utilityService.IntTryParse(id) > 0) {
                this.getInfo();
            }
            else {
                this.employeeInfo = null;
            }
        })
    }

    download() {
        // employee id & issue date
        if (this.form.valid) {
            var reportName = this.form.get('reportName').value;
            let params = {
                id: this.utilityService.IntTryParse(this.form.get('employeeId').value),
                issueDate: this.form.get('issueDate').value == null ? "" : this.datePipe.transform(this.form.get('issueDate').value, 'yyyy-MM-dd'),
                format: this.form.get('format').value
            }

            // console.log("params >>>", params);
            // return;
            if (reportName == "Clearance Letter") {
                this.hrLetterService.downloadClearanceLetter(params).subscribe({
                    next: (response) => {
                        if (response instanceof Blob) {
                            if (response.size > 0) {
                                this.utilityService.downloadFile(response, 'application/pdf', "Clearance Letter.pdf")
                            }
                        }
                        else {
                            this.utilityService.fail('No data available for report generation', "Server Response");
                        }
                    },
                    error: (error) => {

                    }
                });
            }
            else if (reportName == "Experience Letter") {
                this.hrLetterService.downloadExperienceLetter(params).subscribe({
                    next: (response) => {
                        if (response instanceof Blob) {
                            if (response.size > 0) {
                                this.utilityService.downloadFile(response, 'application/pdf', "Experience Letter.pdf")
                            }
                        }
                        else {
                            this.utilityService.fail('No data available for report generation', "Server Response");
                        }
                    },
                    error: (error) => {

                    }
                });
            }
            else if (reportName == "NOC") {
                this.hrLetterService.downloadNOC(params).subscribe({
                    next: (response) => {
                        // var res = response as any;
                        // console.log("response >>>", response);
                        // let extension = res.headers.get('X-Doc-Type');
                        // console.log("res.headers >>>", res.headers);
                        if (response.body instanceof Blob) {
                            if (response.body.size > 0) {
                                this.utilityService.downloadFile(response.body, response.body.type, "NOC." + params.format)
                            }
                        }
                        else {
                            this.utilityService.fail('No data available for report generation', "Server Response");
                        }
                    },
                    error: (error) => {

                    }
                });
            }
            else if (reportName == "Salary Certificate") {
                this.hrLetterService.downloadSalaryCertificate(params).subscribe({
                    next: (response) => {
                        if (response instanceof Blob) {
                            if (response.size > 0) {
                                this.utilityService.downloadFile(response, 'application/pdf', "Salary Certificate.pdf")
                            }
                        }
                        else {
                            this.utilityService.fail('No data available for report generation', "Server Response");
                        }
                    },
                    error: (error) => {

                    }
                });
            }
        }
        else {
            this.utilityService.fail("Invalid form", "Site Response");
        }
    }

    employeeInfo: any = null;
    profile_image: any = null;
    getInfo() {
        let id = this.form.get('employeeId').value;
        this.hrLetterService.getEmployeeData(id).subscribe({
            next: (data) => {
                this.employeeInfo = data;
                if (this.employeeInfo?.employeeId > 0) {
                    this.profile_image = { imagePath: this.employeeInfo?.profilePicPath, gender: this.employeeInfo?.gender, id: this.employeeInfo?.employeeId }
                }
            },
            error: (error) => {
                console.log("error >>>", error);
            }
        })
    }
}