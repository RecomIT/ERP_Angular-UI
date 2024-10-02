import { transition, trigger, useAnimation } from '@angular/animations';
import { Component, ElementRef, OnInit } from '@angular/core';
import { fadeIn, fadeInUp, fadeOutLeft, slideInUp } from 'ng-animate';
import { ApiArea, ApiController } from 'src/app/shared/constants';
import { CustomModalService } from 'src/app/shared/services/custom-modal.service';
import { HrWebService } from 'src/app/shared/services/hr-web.service';
import { PayrollWebService } from 'src/app/shared/services/payroll-web.service';
import { UserService } from 'src/app/shared/services/user.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AreasHttpService } from '../../../areas.http.service';
import { ControlPanelWebService } from 'src/app/shared/services/control-panel.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { DatePipe } from '@angular/common';
import { EmployeePayslipService } from './employee-payslip.service';

@Component({
  selector: 'app-employee-payslip',
  templateUrl: './employee-payslip.component.html',
  animations: [
    trigger('fadeIn', [transition('void => *', useAnimation(fadeIn, { params: { timing: 0.3 } }))]),
    trigger('slideInUp', [transition('* => *', useAnimation(slideInUp, { params: { timing: 0.5 } }))]),
    trigger('fadeInUp', [transition('void => *', useAnimation(fadeInUp))]),
    trigger('fadeOutLeft', [transition('* => void', useAnimation(fadeOutLeft, { params: { timing: 0.3 } }))]),
  ]
})
export class EmployeePayslipComponent implements OnInit {

  isNgInit = false;
  modalTitle: string = "";

  constructor(private areasHttpService: AreasHttpService, private utilityService: UtilityService, private hrWebService: HrWebService, private userService: UserService, public modalService: CustomModalService, private datepipe: DatePipe, private employeePayslipService: EmployeePayslipService) { }
  ngOnInit(): void {
  }
  datePickerConfig: Partial<BsDatepickerConfig> = this.utilityService.datePickerConfig();

  logger(msg: any, options: any) {
    this.utilityService.consoleLog(msg, options);
  }

  User() {
    return this.userService.User();
  }

  pagePrivilege: any = this.userService.getPrivileges();;

  pageInit() {

  }

  select2Options = this.utilityService.select2Config();

  ddlYears: any = this.utilityService.getYears(2);

  paySlipMonth: number = parseInt(this.utilityService.currentMonth);
  paySlipYear: number = parseInt(this.utilityService.currentYear);
  paySlipEmployeeId: number = 0;
  ddlPaySlipEmployee: any[] = [];

  loadEmployees() {
    this.ddlPaySlipEmployee = [];
    this.hrWebService.getEmployees<any[]>().then((data) => {
      this.ddlPaySlipEmployee = data;
    })
  }

  // payslipData: any = null;
  // viewReport() {
  //   if (this.paySlipMonth > 0 && this.paySlipYear > 0){
  //     this.areasHttpService.observable_get((ApiArea.payroll + ApiController.reports + "/PayslipExtension"), {
  //       responseType: 'json',
  //       params: { employeeId: this.User().EmployeeId, month: this.paySlipMonth, year: this.paySlipYear}
  //     }).subscribe((response: any) => {
  //       this.logger("response  data >>>", response);
  //       this.payslipData = response;
  //       if (this.payslipData == null) {
  //         this.utilityService.info("No data found", "Server Response")
  //       }
  //     }, (error) => {
  //       this.utilityService.fail("Something went wrong", "Server Response")
  //     })
  //   }
  //   else{
  //     this.utilityService.fail('Please Select Month & Year','Site Reponse')
  //   }
  // }

  // downloadPayslip() {
  //   var mediaType = 'application/pdf';
  //   if (this.paySlipMonth > 0 && this.paySlipYear > 0) {

  //     this.areasHttpService.observable_get((ApiArea.payroll + ApiController.reports + "/DownloadPayslip"), {
  //       responseType: 'blob',
  //       params: { employeeId: this.User().EmployeeId, month: this.paySlipMonth, year: this.paySlipYear }
  //     }).subscribe((response: any) => {
  //       console.log("file response >>>", response);
  //       if (response.size > 0) {
  //         var blob = new Blob([response], { type: 'application/pdf' });
  //         let pdfUrl = window.URL.createObjectURL(blob);

  //         var PDF_link = document.createElement('a');
  //         PDF_link.href = pdfUrl;
  //         window.open(pdfUrl, '_blank');
  //       }
  //       else {
  //         this.utilityService.warning("No Payslip found")
  //       }
  //     }, (error) => {
  //       this.utilityService.fail("Something went wrong", "Server Response")

  //     })
  //   }
  //   else{
  //     this.utilityService.fail('Please Select Month & Year','Site Reponse')
  //   }
  // }

  // payslipByDateRange: any[] = [];
  // downloadPayslipByDateRange() {
  //   if (this.payslipByDateRange.length > 0) {
  //     let fromDate;
  //     let toDate;
  //     fromDate = this.datepipe.transform(this.payslipByDateRange[0], 'yyyy-MM-dd');
  //     toDate = this.datepipe.transform(this.payslipByDateRange[1], 'yyyy-MM-dd');

  //     let params = { employeeId: this.User().EmployeeId.toString(), fromDate: fromDate.toString() ?? '', toDate: toDate.toString() ?? '' };
  //     this.areasHttpService.observable_get<any>((ApiArea.payroll + ApiController.reports + "/DownloadPayslip"), {
  //       responseType: 'blob', params: params
  //     }).subscribe((response: any) => {
  //       if (response.size > 0) {
  //         var blob = new Blob([response], { type: 'application/pdf' });
  //         let pdfUrl = window.URL.createObjectURL(blob);
  //         var PDF_link = document.createElement('a');
  //         PDF_link.href = pdfUrl;
  //         window.open(pdfUrl, '_blank');
  //       }
  //       else {
  //         this.utilityService.warning("No Payslip found");
  //       }
  //     }, (error) => {
  //       this.utilityService.fail("Something went wrong", "Server Response");

  //     })
  //   }
  //   else{
  //     this.utilityService.fail('Please Enter Date Range','Site Reponse')
  //   }
  // }

  // salarySheetByDateRange: any[] = [];
  // downloadSalarySheetByDateRange() {
  //   if (this.salarySheetByDateRange.length > 0) {
  //     let fromDate;
  //     let toDate;
  //     fromDate = this.datepipe.transform(this.salarySheetByDateRange[0], 'yyyy-MM-dd');
  //     toDate = this.datepipe.transform(this.salarySheetByDateRange[1], 'yyyy-MM-dd');

  //     let params = { employeeId: this.User().EmployeeId.toString(), fromDate: fromDate.toString() ?? '', toDate: toDate.toString() ?? '' };
  //     this.areasHttpService.observable_get<any>((ApiArea.payroll + ApiController.reports + "/DownloadSalarySheet"), {
  //       responseType: 'blob', params: params
  //     }).subscribe((response: any) => {
  //       if (response.size > 0) {
  //         var blob = new Blob([response], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  //             const link = document.createElement('a');
  //             link.href = window.URL.createObjectURL(blob);
  //             link.download = 'SalarySheet.xlsx';
  //             link.click();
  //       }
  //       else {
  //         this.utilityService.warning("No Payslip found");
  //       }
  //     }, (error) => {
  //       this.utilityService.fail("Something went wrong", "Server Response");

  //     })
  //   }
  //   else{
  //     this.utilityService.fail('Please Enter Date Range','Site Reponse')
  //   }  
  // }

  payslipData: any = null;
  viewReport() {
    if (this.paySlipMonth > 0 && this.paySlipYear > 0) {
      this.employeePayslipService.showPayslip({ employeeId: this.User().EmployeeId, month: this.paySlipMonth, year: this.paySlipYear }).subscribe(
        {
          next: (response) => {
            this.payslipData = response;
            if (this.payslipData == null) {
              this.utilityService.info("No data found", "Server Response")
            }
          },
          error: (err) => {
            this.utilityService.fail("Something went wrong", "Server Response")
          }
        }
      )
    }
    else {
      this.utilityService.fail('Please Select Employee/Month & Year', 'Site Reponse')
    }
  }

  downloadPayslip() {
    if (this.paySlipMonth > 0 && this.paySlipYear > 0) {
      this.employeePayslipService.downloadPayslip({ employeeId: this.User().EmployeeId, month: this.paySlipMonth, year: this.paySlipYear }).subscribe({
        next: (response: any) => {
          if (response.size > 0) {
            var blob = new Blob([response], { type: 'application/pdf' });
            let pdfUrl = window.URL.createObjectURL(blob);

            var PDF_link = document.createElement('a');
            PDF_link.href = pdfUrl;
            window.open(pdfUrl, '_blank');
          }
          else {
            this.utilityService.warning("No Payslip found")
          }
        },
        error: (err) => {
          this.utilityService.fail("Something went wrong to download payslip", "Server Response")
        }
      })
    }
    else {
      this.utilityService.fail('Please Select Employee/Month & Year', 'Site Reponse')
    }
  }

  payslipByDateRange: any[] = [];
  downloadPayslipByDateRange() {
    if (this.payslipByDateRange.length > 0) {
      let fromDate = this.datepipe.transform(this.payslipByDateRange[0], 'yyyy-MM-dd');
      let toDate = this.datepipe.transform(this.payslipByDateRange[1], 'yyyy-MM-dd');
      let params = { employeeId: this.User().EmployeeId, fromDate: fromDate.toString() ?? '', toDate: toDate.toString() ?? '' };
      this.employeePayslipService.downloadPayslipByDateRange(params).subscribe({
        next: (response: any) => {
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
        },
        error: (error: any) => {
          this.utilityService.fail("Something went wrong", "Server Response");
        }
      })
    }
    else {
      this.utilityService.fail('Please Select Employee/Enter Date Range', 'Site Reponse')
    }
  }

  salarySheetByDateRange: any[] = [];
  downloadSalarySheetByDateRange() {
    if (this.salarySheetByDateRange.length > 0) {
      let fromDate = this.datepipe.transform(this.salarySheetByDateRange[0], 'yyyy-MM-dd');
      let toDate = this.datepipe.transform(this.salarySheetByDateRange[1], 'yyyy-MM-dd');

      let params = { employeeId: this.User().EmployeeId, fromDate: fromDate.toString() ?? '', toDate: toDate.toString() ?? '' };

      console.log("params >>>", params);

      this.employeePayslipService.downloadSalarySheetByDateRange(params).subscribe({
        next: (response: any) => {
          if (response.size > 0) {
            var blob = new Blob([response], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = 'SalarySheet.xlsx';
            link.click();
          }
          else {
            this.utilityService.warning("No Data found");
          }
        },
        error: (error: any) => {
          this.utilityService.fail("Something went wrong", "Server Response");
        }
      })
      // this.areasHttpService.observable_get<any>((ApiArea.payroll + "/Salary/SalaryReport" + "/DownloadSalarySheet"), {
      //   responseType: 'blob', params: params
      // }).subscribe((response: any) => {
      //   if (response.size > 0) {
      //     var blob = new Blob([response], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      //     const link = document.createElement('a');
      //     link.href = window.URL.createObjectURL(blob);
      //     link.download = 'SalarySheet.xlsx';
      //     link.click();
      //   }
      //   else {
      //     this.utilityService.warning("No Payslip found");
      //   }
      // }, (error) => {
      //   this.utilityService.fail("Something went wrong", "Server Response");

      // })
    }
    else {
      this.utilityService.fail('Please Select Employee/ Date Range', 'Site Reponse')
    }
  }

}
