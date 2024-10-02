import { transition, trigger, useAnimation } from "@angular/animations";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { bounceIn, fadeIn, fadeInRight, slideInUp } from "ng-animate";
import { BsDatepickerConfig } from "ngx-bootstrap/datepicker";
import { CustomModalService } from "src/app/shared/services/custom-modal.service";
import { UserService } from "src/app/shared/services/user.service";
import { UtilityService } from "src/app/shared/services/utility.service";
import { ToastrService } from 'ngx-toastr';
import { AreasHttpService } from "src/app/areas/areas.http.service";
import { DatePipe } from "@angular/common";
import { PfReportService } from "../services/pf-report.service";

@Component({
  selector: 'app-pf-self-report',
  templateUrl: './self-pf-report.component.html',
  animations: [
    trigger('slideInUp', [transition('* => *', useAnimation(slideInUp, { params: { timing: 0.5 } }))]),
  ]
})
export class SelfPfReportComponent implements OnInit {
  modalTitle: string = "";
  datePickerConfig: Partial<BsDatepickerConfig> = {};

  constructor(private fb: FormBuilder,
    private areasHttpService: AreasHttpService,
    private userService: UserService,
    public utilityService: UtilityService,
    public modalService: CustomModalService,
    private pfReportService: PfReportService,
    private datePipe: DatePipe,
    public toastr: ToastrService) {
  }

  ngOnInit(): void {
    this.formInit();
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
    return this.userService.User();
  }

  form: FormGroup;

  reports: any = ["PF Summary", "PF Letter", "PF Loan"];

  formInit() {
    this.form = this.fb.group({
      reportName: new FormControl('', [Validators.required]),
      fromDate: new FormControl(null, Validators.required),
      toDate: new FormControl(null, Validators.required)
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
      if (report_name == 'PF Summary' || report_name == 'PF Letter') {

        const fromDate = this.datePipe.transform(this.form.get('fromDate').value, "yyyy-MM-dd");
        const toDate = this.datePipe.transform(this.form.get('toDate').value, "yyyy-MM-dd");

        let params = {
          employeeCode: this.User().EmployeeCode,
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
          employeeCode: this.User().EmployeeCode,
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



