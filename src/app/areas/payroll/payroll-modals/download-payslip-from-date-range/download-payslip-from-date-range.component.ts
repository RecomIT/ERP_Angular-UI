import { transition, trigger, useAnimation } from "@angular/animations";
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild, Injectable } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup, NgForm, Validators } from "@angular/forms";
import { bounceIn, fadeIn, fadeInRight, slideInUp } from "ng-animate";
import { CustomModalService } from "src/app/shared/services/custom-modal.service";
import { PayrollWebService } from "src/app/shared/services/payroll-web.service";
import { UserService } from "src/app/shared/services/user.service";
import { UtilityService } from "src/app/shared/services/utility.service";
import { AreasHttpService } from "src/app/areas/areas.http.service";
import { ApiArea, ApiController } from 'src/app/shared/constants';
import { HrWebService } from 'src/app/shared/services/hr-web.service';
import { DomSanitizer } from '@angular/platform-browser';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { DatePipe } from "@angular/common";

@Component({
  selector: 'app-payroll-download-payslip-from-date-range',
  templateUrl: './download-payslip-from-date-range.component.html'
})
export class DownloadPayslipFromDateRangeComponent implements OnInit {

  @ViewChild('DownloadPayslipFromDateRange', { static: true }) DownloadPayslipFromDateRange!: ElementRef;
  @Input() paySlipEmployeeId: number = 0;
  @Input() isRequestFromSelfService:boolean=false;
  @Output() closeModalEvent = new EventEmitter<string>(); 
  modalTitle: string = "";
  datePickerConfig: Partial<BsDatepickerConfig> = {};

  constructor(private fb: FormBuilder, 
    private areasHttpService: AreasHttpService, 
    private userService: UserService,
    public utilityService: UtilityService, 
    public modalService: CustomModalService, 
    private hrWebService: HrWebService,
    private payrollWebService: PayrollWebService,
    private sanitizer: DomSanitizer,
    private datepipe: DatePipe) { 
      
    }

  ngOnInit(): void {

    console.log("isRequestFromSelfService >>>",this.isRequestFromSelfService);
    this.formInit();
    this.loadEmployees();
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

  select2Options = {
    width: "100%",
    containerCssClass: "form-control form-control-sm text-x-small font-bold",
    theme: "bootstrap4"
  }
 
  ddlEmployees: any[] = [];
  loadEmployees() {
    this.ddlEmployees = [];
    this.hrWebService.getEmployees<any[]>().then((data) => {
      this.ddlEmployees = data;
    })
  }

  downloadFormGroup: FormGroup = null;
  formInit() {
    this.downloadFormGroup = this.fb.group({     
      paySlipDateRange: new FormControl(),
      paySlipEmployeeId : new FormControl(this.paySlipEmployeeId)
    })  

    // this.downloadFormGroup.valueChanges.subscribe(value=>{
    //   console.log("Value", value);
    //   this.searchByDate = value;
    // })

    this.modalService.open(this.DownloadPayslipFromDateRange, "lg");
  }

  closeModal(reason: string) {
    this.modalService.service.dismissAll(reason);
    this.closeModalEvent.emit(reason);
  }

  // paySlipDateRange_changed(){   
  //     this.downloadFormGroup.get('paySlipDateRange').setValue(this.downloadFormGroup.controls.paySlipDateRange.value);     
  //   }

  btnDownloadFile: boolean = false;
  searchByEmployee: any = '';
  searchByDate: any[] = [];

  getPayslipFromDate() {
    // console.log("form values >>>", this.downloadFormGroup.value);
    // return;
    let fromDate;
    let toDate;
    this.searchByDate = this.downloadFormGroup.controls.paySlipDateRange.value;
    this.searchByEmployee = this.downloadFormGroup.controls.paySlipEmployeeId.value;
    if (this.searchByDate?.length > 0) {
      fromDate = this.datepipe.transform(this.searchByDate[0], 'yyyy-MM-dd');
      toDate = this.datepipe.transform(this.searchByDate[1], 'yyyy-MM-dd');
    }
    console.log("fromDate >>>", fromDate);
    console.log("toDate >>>", toDate);
    console.log("this.searchByEmployee >>>",  this.searchByEmployee);
    let params = { employeeId: this.searchByEmployee.toString(), fromDate: fromDate.toString() ?? '', toDate: toDate.toString() ?? '' };
    
    this.areasHttpService.observable_get<any>((ApiArea.payroll + ApiController.reports + "/GetPayslipFromDateRange"), {
      responseType: 'blob',  params: params
    }).subscribe((response: any) => {
      if (response.size > 0) {
        var blob = new Blob([response], { type: 'application/pdf' });
        let pdfUrl = window.URL.createObjectURL(blob);
        var PDF_link = document.createElement('a');
        PDF_link.href = pdfUrl;
        window.open(pdfUrl, '_blank');       
      }
      else {
        this.utilityService.warning("No Payslip found");
      }
    }, (error) => {
      this.utilityService.fail("Something went wrong", "Server Response");

    })
 
  }
 


}
