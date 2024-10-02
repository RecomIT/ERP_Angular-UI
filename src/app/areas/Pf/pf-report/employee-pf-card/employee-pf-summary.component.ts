import { transition, trigger, useAnimation } from "@angular/animations";
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup, NgForm, Validators } from "@angular/forms";
import { bounceIn, fadeIn, fadeInRight, slideInUp } from "ng-animate";
import { BsDatepickerConfig } from "ngx-bootstrap/datepicker";
import { CustomModalService } from "src/app/shared/services/custom-modal.service";
import { PayrollWebService } from "src/app/shared/services/payroll-web.service";
import { UserService } from "src/app/shared/services/user.service";
import { UtilityService } from "src/app/shared/services/utility.service";
import { ApiArea, ApiController } from 'src/app/shared/constants';
import { HrWebService } from 'src/app/shared/services/hr-web.service';
import { ToastrService } from 'ngx-toastr';
import { AreasHttpService } from "src/app/areas/areas.http.service";
import { DatePipe } from "@angular/common";
import { EmployeeInfoService } from "src/app/areas/employee_module/employee/employee-info.service";

@Component({
  selector: 'app-employee-pf-summary',
  templateUrl: './employee-pf-summary.component.html',
  animations: [
    trigger('slideInUp', [transition('* => *', useAnimation(slideInUp, { params: { timing: 0.5 } }))]),
    trigger('fadeIn', [transition('void => *', useAnimation(fadeIn, { params: { timing: 0.3 } }))]),
    trigger('fadeInRight', [transition('void => *', useAnimation(fadeInRight, { params: { timing: 0.5 } }))]),
    trigger('bounceIn', [transition('void => *', useAnimation(bounceIn, { params: { timing: 1 } }))]),
  ],
})
export class EmployeePfSummaryComponent implements OnInit {
  modalTitle: string = "";
  datePickerConfig: Partial<BsDatepickerConfig> = {};

  constructor(private fb: FormBuilder,
    private areasHttpService: AreasHttpService,
    private userService: UserService,
    private datePipe: DatePipe,
    public utilityService: UtilityService,
    public modalService: CustomModalService,
    private hrWebService: HrWebService,
    private payrollWebService: PayrollWebService,
    private employeeInfoService : EmployeeInfoService,
    public toastr: ToastrService) {
  }

  ngOnInit(): void {
    this.searchFormInit();
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
  select2Options = {
    width: "100%",
    containerCssClass: "form-control form-control-sm text-x-small",
    theme: "bootstrap4",
  }

  ddlSearchByEmployee: any[] = [];
  ddlEmployees: any[] = [];
  loadEmployees() {
    this.ddlSearchByEmployee = [];
    this.getPFEmployees<any[]>().then((data) => {
      this.ddlSearchByEmployee = data;
    })
  }

  loadEmployeeDropdown() {
    this.employeeInfoService.loadDropdownData({});
    this.employeeInfoService.ddl_employee_data$.subscribe(data => {
      this.employeeInfoService.loadDropdown(data);
      this.ddlSearchByEmployee = this.employeeInfoService.ddl$;
    }, error => {
      console.error('Error while fetching data:', error);
    });
  }

  getPFEmployees<T>(notEmployee: number = 0, designationId: number = 0, departmentId: number = 0, sectionId: number = 0, subsectionId: number = 0): Promise<T> {
    return this.areasHttpService.promise_get<T>(("/Fund" + "/PF/Service" + "/GetPFEmployees"),
      {
        responseType: "json",
        params: {
          notEmployee: notEmployee, designationId: designationId, departmentId: departmentId,
          sectionId: sectionId, subsectionId: subsectionId
        }
      });
  }

  pfSummaryForm: FormGroup;

  searchFormInit() {
    this.pfSummaryForm = this.fb.group({
      employeeId: new FormControl('', [Validators.required]),
      pfSummaryFromDate: new FormControl(null, Validators.required),
      pfSummaryToDate: new FormControl(null, Validators.required)

    });
  }

  pfSummaryData: any = null;

  getPFSummary() {
    if (this.pfSummaryForm.valid) {
      const employeeId = this.pfSummaryForm.get('employeeId').value;
      const fromDate = this.datePipe.transform(this.pfSummaryForm.get('pfSummaryFromDate').value, "yyyy-MM-dd");
      const toDate = this.datePipe.transform(this.pfSummaryForm.get('pfSummaryToDate').value, "yyyy-MM-dd");

      this.areasHttpService.observable_get<any>(("/Fund" + "/PF/External" + "/GetPFSummaryPdf"), {
        responseType: 'blob',
        params: {
          employeeCode: employeeId,
          fromDate: fromDate,
          toDate: toDate
        }
      }).subscribe((response: any) => {
        const file = new Blob([response], { type: 'application/pdf' });
        const fileURL = URL.createObjectURL(file);
        window.open(fileURL);

        this.pfSummaryData = response;
        if (this.pfSummaryData == null) {
          this.utilityService.info("No data found", "Server Response")
        }
      }, (error) => {
        //this.logger("error >>>",error);
        this.utilityService.fail("Something went wrong", "Server Response")
      })
    }
  }

  pfCardLetterData: any = null;
  getPFCardLetter() {
    if (this.pfSummaryForm.valid) {
      const employeeId = this.pfSummaryForm.get('employeeId').value;
      const fromDate = this.datePipe.transform(this.pfSummaryForm.get('pfSummaryFromDate').value, "yyyy-MM-dd");
      const toDate = this.datePipe.transform(this.pfSummaryForm.get('pfSummaryToDate').value, "yyyy-MM-dd");


      this.areasHttpService.observable_get(("/Fund" + "/PF/External" + "/GetPFCardLetterPdf"), {
        responseType: 'blob',
        params: {
          employeeCode: employeeId,
          fromDate: fromDate,
          toDate: toDate
        }
      }).subscribe((response: any) => {
        const file = new Blob([response], { type: 'application/pdf' });
        const fileURL = URL.createObjectURL(file);
        window.open(fileURL);
        this.pfCardLetterData = response;
        if (this.pfCardLetterData == null) {
          this.utilityService.info("No data found", "Server Response")
        }
      }, (error) => {
        //this.logger("error >>>",error);
        this.utilityService.fail("Something went wrong", "Server Response")
      })
    }
  }
}
