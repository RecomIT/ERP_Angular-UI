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
import { PfCardService } from "../services/pf-card.service";
import { DatePipe } from "@angular/common";

@Component({
  selector: 'app-pf-pfreport-employee-card',
  templateUrl: './self-pf-card.component.html',
  animations: [
    trigger('slideInUp', [transition('* => *', useAnimation(slideInUp, { params: { timing: 0.5 } }))]),
    trigger('fadeIn', [transition('void => *', useAnimation(fadeIn, { params: { timing: 0.3 } }))]),
    trigger('fadeInRight', [transition('void => *', useAnimation(fadeInRight, { params: { timing: 0.5 } }))]),
    trigger('bounceIn', [transition('void => *', useAnimation(bounceIn, { params: { timing: 1 } }))]),
  ]
})
export class SelfPfCardComponent implements OnInit {
  modalTitle: string = "";
  datePickerConfig: Partial<BsDatepickerConfig> = {};

  constructor(private fb: FormBuilder,
    private areasHttpService: AreasHttpService,
    private userService: UserService,
    public utilityService: UtilityService,
    public modalService: CustomModalService,
    private pfCardService: PfCardService,
    private datePipe: DatePipe,
    public toastr: ToastrService) {
  }

  ngOnInit(): void {
    this.searchFormInit();

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

  pfSummaryForm: FormGroup;

  searchFormInit() {
    this.pfSummaryForm = this.fb.group({
      pfSummaryFromDate: new FormControl(null, Validators.required),
      pfSummaryToDate: new FormControl(null, Validators.required)
    });
  }

  pfSummaryData: any = null;
  getPFSummary() {
    if (this.pfSummaryForm.valid) {
      const fromDate = this.datePipe.transform(this.pfSummaryForm.get('pfSummaryFromDate').value,"yyyy-MM-dd") ;
      const toDate = this.datePipe.transform(this.pfSummaryForm.get('pfSummaryToDate').value,"yyyy-MM-dd");
      this.pfCardService.getEmployeePFCardSummery({
        employeeCode: '16',
        fromDate: fromDate,
        toDate: toDate
      }).subscribe((response: any) => {
        const file = new Blob([response], { type: 'application/pdf' });
        const fileURL = URL.createObjectURL(file);
        window.open(fileURL);
        this.pfSummaryData = response;
        if (this.pfSummaryData == null) {
          this.utilityService.info("No data found", "Server Response")
        }
      }, (error) => {
        this.utilityService.fail("Something went wrong", "Server Response")
      })
    }
  }

  pfCardLetterData: any = null;
  getPFCardLetter() {
    if (this.pfSummaryForm.valid) {
      const fromDate = this.datePipe.transform(this.pfSummaryForm.get('pfSummaryFromDate').value,"yyyy-MM-dd") ;
      const toDate = this.datePipe.transform(this.pfSummaryForm.get('pfSummaryToDate').value,"yyyy-MM-dd");

      this.pfCardService.getEmployeePFCardLetter({
        employeeCode: '16',
        fromDate: fromDate,
        toDate: toDate
      }).subscribe((response: any) => {
        const file = new Blob([response], { type: 'application/pdf' });
        const fileURL = URL.createObjectURL(file);
        window.open(fileURL);
        this.pfSummaryData = response;
        if (this.pfSummaryData == null) {
          this.utilityService.info("No data found", "Server Response")
        }
      }, (error) => {
        this.utilityService.fail("Something went wrong", "Server Response")
      })
    }
  }

}



