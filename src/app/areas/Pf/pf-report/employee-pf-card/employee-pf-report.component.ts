import { transition, trigger, useAnimation } from "@angular/animations";
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup, NgForm, Validators } from "@angular/forms";
import { bounceIn, fadeIn, fadeInRight, slideInUp } from "ng-animate";
import { BsDatepickerConfig } from "ngx-bootstrap/datepicker";
import { CustomModalService } from "src/app/shared/services/custom-modal.service";
import { PayrollWebService } from "src/app/shared/services/payroll-web.service";
import { UserService } from "src/app/shared/services/user.service";
import { UtilityService } from "src/app/shared/services/utility.service";
import { HrWebService } from 'src/app/shared/services/hr-web.service';
import { ToastrService } from 'ngx-toastr';
import { AreasHttpService } from "src/app/areas/areas.http.service";
import { DatePipe } from "@angular/common";
import { EmployeeInfoService } from "src/app/areas/employee_module/employee/employee-info.service";
import { PfReportService } from "../services/pf-report.service";

@Component({
  selector: 'app-employee-pf-report',
  templateUrl: './employee-pf-report.component.html',
  animations: [
    trigger('slideInUp', [transition('* => *', useAnimation(slideInUp, { params: { timing: 0.5 } }))]),
    trigger('fadeIn', [transition('void => *', useAnimation(fadeIn, { params: { timing: 0.3 } }))]),
    trigger('fadeInRight', [transition('void => *', useAnimation(fadeInRight, { params: { timing: 0.5 } }))]),
    trigger('bounceIn', [transition('void => *', useAnimation(bounceIn, { params: { timing: 1 } }))]),
  ],
})
export class EmployeePfReportComponent implements OnInit {
  modalTitle: string = "";
  datePickerConfig: Partial<BsDatepickerConfig> = {};

  constructor(private fb: FormBuilder,
    private areasHttpService: AreasHttpService,
    private userService: UserService,
    private datePipe: DatePipe,
    public utilityService: UtilityService,
    public modalService: CustomModalService,
    private employeeInfoService: EmployeeInfoService,
    private pfReportService: PfReportService,
    public toastr: ToastrService) {
  }

  ngOnInit(): void {
    this.formInit();
    this.loadEmployeeDropdown();
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

  logger(msg: any, options: any) {
    this.utilityService.consoleLog(msg, options);
  }

  User() {
    return this.userService.getUser();
  }

  reports: any = ["PF Summary", "PF Letter", "PF Loan"];
  select2Options = {
    width: "100%",
    containerCssClass: "form-control form-control-sm text-x-small",
    theme: "bootstrap4",
  }

  ddlSearchByEmployee: any[] = [];
  ddlEmployees: any[] = [];

  loadEmployeeDropdown() {
    this.employeeInfoService.loadDropdownData({});
    this.employeeInfoService.ddl_employee_data$.subscribe(data => {
      this.employeeInfoService.loadDropdown(data);
      this.ddlSearchByEmployee = this.employeeInfoService.ddl$;
    }, error => {
      console.error('Error while fetching data:', error);
    });
  }

  form: FormGroup;

  formInit() {
    this.form = this.fb.group({
      reportName: new FormControl('', [Validators.required]),
      employeeId: new FormControl('', [Validators.required]),
      fromDate: new FormControl(null),
      toDate: new FormControl(null)
    });

    this.form.get('reportName').valueChanges.subscribe(value => {
      if (value == 'PF Summary' || value == 'PF Letter') {
        this.form.get('fromDate').setValidators([Validators.required]);
        this.form.get('fromDate').updateValueAndValidity();
        this.form.get('toDate').setValidators([Validators.required]);
        this.form.get('toDate').updateValueAndValidity();
      }
      else if (value == "PF Loan") {
        this.form.get('fromDate').clearValidators();
        this.form.get('fromDate').updateValueAndValidity();
        this.form.get('toDate').clearValidators();
        this.form.get('toDate').updateValueAndValidity();
      }
    })

  }

  download() {
    if (this.form.valid) {
      let report_name = this.form.get('reportName').value;
      const employeeId = this.form.get('employeeId').value;
      let employeeInfo = this.ddlSearchByEmployee.find(item => item.id == this.utilityService.IntTryParse(employeeId));
      if (report_name == 'PF Summary' || report_name == 'PF Letter') {

        const fromDate = this.datePipe.transform(this.form.get('fromDate').value, "yyyy-MM-dd");
        const toDate = this.datePipe.transform(this.form.get('toDate').value, "yyyy-MM-dd");

        let params = {
          employeeCode: employeeInfo.code,
          fromDate: fromDate,
          toDate: toDate
        };
        if (report_name == 'PF Summary') {
          this.downloadPFSummary(params);
        }
        if (report_name == 'PF Letter') {
          this.downloadPFLetter(params);
        }
      }
      else if (report_name == 'PF Loan') {
        let params = {
          employeeCode: employeeInfo.code
        };
        this.downloadLoan(params);
      }
    }
    else {
      this.utilityService.fail("Invalid form submission", "Site Response")
    }
  }

  downloadPFSummary(params: any) {
    this.pfReportService.downloadPFCardSummery(params).subscribe({
      next: (response) => {
        if (response instanceof Blob) {
          if (response.size > 0) {
            this.utilityService.downloadFile(response, 'application/pdf', "PF Card Summary.pdf")
          }
        }
        else {
          this.utilityService.fail('No data available for report generation', "Server Response");
        }
      }
    })
  }

  downloadPFLetter(params: any) {
    this.pfReportService.downloadPFLetter(params).subscribe({
      next: (response) => {
        if (response instanceof Blob) {
          if (response.size > 0) {
            this.utilityService.downloadFile(response, 'application/pdf', "PF Letter.pdf")
          }
        }
        else {
          this.utilityService.fail('No data available for report generation', "Server Response");
        }
      }
    })
  }

  downloadLoan(params: any) {
    this.pfReportService.downloadPFLoan(params).subscribe({
      next: (response) => {
        if (response instanceof Blob) {
          if (response.size > 0) {
            this.utilityService.downloadFile(response, 'application/pdf', "Loan Card.pdf")
          }
        }
        else {
          this.utilityService.fail('No data available for report generation', "Server Response");
        }
      }
    })
  }
}
