import { transition, trigger, useAnimation } from '@angular/animations';
import { Component, ElementRef, OnInit } from '@angular/core';
import { fadeIn, fadeInUp, fadeOutLeft, slideInUp } from 'ng-animate';
import { ApiArea, ApiController } from 'src/app/shared/constants';
import { CustomModalService } from 'src/app/shared/services/custom-modal.service';
import { HrWebService } from 'src/app/shared/services/hr-web.service';
import { PayrollWebService } from 'src/app/shared/services/payroll-web.service';
import { UserService } from 'src/app/shared/services/user.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AreasHttpService } from '../../../../areas.http.service';

@Component({
  selector: 'app-payroll-external-report',
  templateUrl: './external-report.component.html',
  animations: [
    trigger('fadeIn', [transition('void => *', useAnimation(fadeIn, { params: { timing: 0.3 } }))]),
    trigger('slideInUp', [transition('* => *', useAnimation(slideInUp, { params: { timing: 0.5 } }))]),
    trigger('fadeInUp', [transition('void => *', useAnimation(fadeInUp))]),
    trigger('fadeOutLeft', [transition('* => void', useAnimation(fadeOutLeft, { params: { timing: 0.3 } }))]),
  ]
})
export class ExternalReportComponent implements OnInit {

  isNgInit = false;
  modalTitle: string = "";
  constructor(private areasHttpService: AreasHttpService, private payrollWebService: PayrollWebService, private utilityService: UtilityService, private hrWebService: HrWebService, private userService: UserService, public modalService: CustomModalService, private el: ElementRef) { }
  ngOnInit(): void {

  }

  logger(msg: any, options: any) {
    this.utilityService.consoleLog(msg, options);
  }

  pagePrivilege: any = this.userService.getPrivileges();

  User() {
    return this.userService.User();
  }

  ddlYears: any = this.utilityService.getYears(2);

  select2Options = {
    width: "100%",
    containerCssClass: "form-control form-control-sm text-x-small font-bold mb-0",
    theme: "bootstrap4"
  }

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

  payslipData: any = null;
  viewReport() {
    this.areasHttpService.observable_get((ApiArea.payroll + "/Salary/SalaryReport" + "/PayslipExtension"), {
      responseType: 'json',
      params: { employeeId: this.User().EmployeeId, month: this.paySlipMonth, year: this.paySlipYear, companyId: this.User().ComId, organizationId: this.User().OrgId }
    }).subscribe((response: any) => {
      this.logger("response  data >>>", response);
      this.payslipData = response;
      if (this.payslipData == null) {
        this.utilityService.info("No data found", "Server Response")
      }
    }, (error) => {
      //this.logger("error >>>",error);
      this.utilityService.fail("Something went wrong", "Server Response")
    })
  }

  downloadSalaryPayslip() {
    if (this.paySlipMonth > 0 && this.paySlipYear > 0) {
      this.areasHttpService.observable_get((ApiArea.payroll + "/Salary/SalaryReport" + "/PayslipFromExternalSource"), {
        responseType: 'blob',
        params: { employeeCode: this.User().EmployeeCode, month: this.paySlipMonth, year: this.paySlipYear }
      }).subscribe((response: any) => {
        if (response.size > 64) {
          var blob = new Blob([response], { type: 'application/pdf' });
          let pdfUrl = window.URL.createObjectURL(blob);

          var PDF_link = document.createElement('a');
          PDF_link.href = pdfUrl;
          window.open(pdfUrl, '_blank');
        }
        else {
          this.utilityService.warning("No Payslip found")
        }
      }, (error) => {
        this.utilityService.fail("Something went wrong", "Server Response")

      })
    }
  }

  //#region Bonus Payslip
  bonuspaySlipMonth: number = parseInt(this.utilityService.currentMonth);
  bonuspaySlipYear: number = parseInt(this.utilityService.currentYear);
  bonuspaySlipEmployeeId: number = 0;
  bonusddlPaySlipEmployee: any[] = [];

  downloadBonusPayslip() {
    if (this.paySlipMonth > 0 && this.paySlipYear > 0) {
      this.logger("this.User().BranchId >>>", this.User().BranchId);
      this.areasHttpService.observable_get((ApiArea.payroll + "/Salary/SalaryReport" + "/BonusPayslipFromExternalSource"), {
        responseType: 'blob',
        params: { employeeCode: this.User().EmployeeCode, month: this.paySlipMonth, year: this.paySlipYear }
      }).subscribe((response: any) => {
        console.log("file response >>>", response);

        if (response.size > 64) {
          var blob = new Blob([response], { type: 'application/pdf' });
          let pdfUrl = window.URL.createObjectURL(blob);

          var PDF_link = document.createElement('a');
          PDF_link.href = pdfUrl;
          window.open(pdfUrl, '_blank');
        }
        else {
          this.utilityService.warning("No Payslip found")
        }
      }, (error) => {
        this.utilityService.fail("Something went wrong", "Server Response")

      })
    }
  }
  //#endregion

  taxCardMonth: number = parseInt(this.utilityService.currentMonth);
  taxCardYear: number = parseInt(this.utilityService.currentYear);
  taxCardEmployeeId: number = 0;
  
  downloadTaxCard() {
    if (this.taxCardMonth > 0 && this.taxCardYear > 0) {
      this.areasHttpService.observable_get((ApiArea.payroll + "/Salary/SalaryReport" + "/TaxCardFromExternalSource"), {
        responseType: 'blob',
        params: { employeeCode: this.User().EmployeeCode, month: this.taxCardMonth, year: this.taxCardYear }
      }).subscribe((response: any) => {
        console.log("file response >>>", response);

        if (response.size > 64) {
          var blob = new Blob([response], { type: 'application/pdf' });
          let pdfUrl = window.URL.createObjectURL(blob);

          var PDF_link = document.createElement('a');
          PDF_link.href = pdfUrl;
          window.open(pdfUrl, '_blank');
        }
        else {
          this.utilityService.warning("No Payslip found")
        }
      }, (error) => {
        this.utilityService.fail("Something went wrong", "Server Response")

      })
    }
  }
}
