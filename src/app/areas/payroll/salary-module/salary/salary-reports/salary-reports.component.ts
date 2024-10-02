import { transition, trigger, useAnimation } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { fadeIn, slideInUp } from 'ng-animate';
import { ApiArea } from 'src/app/shared/constants';
import { CustomModalService } from 'src/app/shared/services/custom-modal.service';
import { UserService } from 'src/app/shared/services/user.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AreasHttpService } from '../../../../areas.http.service';
import { DatePipe } from '@angular/common';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { SalaryReportService } from '../salary-process-extension-extra/salary-report.service';
import { EmployeeInfoService } from 'src/app/areas/employee_module/employee/employee-info.service';
import { ControlPanelWebService } from 'src/app/shared/services/control-panel.service';

@Component({
  selector: 'app-salary-reports',
  templateUrl: './salary-reports.component.html',
  animations: [
    trigger('slideInUp', [transition('* => *', useAnimation(slideInUp, { params: { timing: 0.5 } }))]),
    trigger('fadeIn', [transition('void => *', useAnimation(fadeIn, { params: { timing: 0.3 } }))]),
  ],
})
export class SalaryReportsComponent implements OnInit {

  isNgInit = false;
  modalTitle: string = "";
  datePickerConfig: Partial<BsDatepickerConfig> = this.utilityService.datePickerConfig();
  constructor(private areasHttpService: AreasHttpService, private utilityService: UtilityService, private userService: UserService, public modalService: CustomModalService, private datepipe: DatePipe, private salaryReportService: SalaryReportService, private employeeInfoService: EmployeeInfoService,
    private controlPanelWebService: ControlPanelWebService,
  ) { }
  ngOnInit(): void {
    this.loadEmployees();
    this.loadBranch();
  }

  logger(msg: any, options: any) {
    this.utilityService.consoleLog(msg, options);
  }

  User() {
    return this.userService.User();
  }

  pagePrivilege: any = this.userService.getPrivileges();

  select2Options = this.utilityService.select2Config();
  ddlYears: any = this.utilityService.getYears(2);

  selectedEmployee: any = 0;
  rptMonth: number = parseInt(this.utilityService.currentMonth);
  rptYear: number = parseInt(this.utilityService.currentYear);
  rptBranchId: number = 0;
  rptJobtype: string='';
  rptReportType: string='';
  paySlipMonth: number = parseInt(this.utilityService.currentMonth);
  paySlipYear: number = parseInt(this.utilityService.currentYear);
  paySlipEmployeeId: number = 0;
  ddlPaySlipEmployee: any[] = [];


  loadEmployees() {
    this.employeeInfoService.loadDropdownData({});
    this.employeeInfoService.ddl_employee_data$.subscribe(data => {
      this.employeeInfoService.loadDropdown(data);
      this.ddlPaySlipEmployee = this.employeeInfoService.ddl$;
    }, error => {
      console.error('Error while fetching data:', error);
    });
  }

  branches: any[] = [];
  loadBranch() {
    this.branches = [];
    this.controlPanelWebService.getBranchExtension<any[]>('1').then((data) => {
      this.branches = data;
    })
  }


  payslipData: any = null;
  viewReport() {
    if (this.paySlipMonth > 0 && this.paySlipYear > 0 && this.paySlipEmployeeId > 0) {
      this.salaryReportService.payslipExtension({ employeeId: this.paySlipEmployeeId, month: this.paySlipMonth, year: this.paySlipYear }).subscribe(response => {
        if (response.body != null) {
          this.payslipData = response.body;
        }
      }, (error) => {
        this.utilityService.httpErrorHandler(error)
      })
    }
    else {
      this.utilityService.fail('Please Select Employee/Month & Year', 'Site Reponse')
    }
  }

  downloadPayslip() {
    if (this.paySlipMonth > 0 && this.paySlipYear > 0 && this.paySlipEmployeeId > 0) {
      this.salaryReportService.downloadPayslip({ employeeId: this.paySlipEmployeeId, month: this.paySlipMonth, year: this.paySlipYear }).subscribe(response => {
        console.log('response >>>', response);
        if (response.body.size > 0) {
          var blob = new Blob([response.body], { type: 'application/pdf' });
          let pdfUrl = window.URL.createObjectURL(blob);
          var PDF_link = document.createElement('a');
          PDF_link.href = pdfUrl;
          window.open(pdfUrl, '_blank');
        }
        else {
          this.utilityService.warning("No Payslip found")
        }
      }, (error) => {
        this.utilityService.httpErrorHandler(error)
      })
    }
    else {
      this.utilityService.fail('Please Select Employee/Month & Year', 'Site Reponse')
    }
  }

  payslipByDateRange: any[] = [];
  downloadPayslipByDateRange() {
    if (this.payslipByDateRange.length > 0 && this.paySlipEmployeeId > 0) {
      let fromDate = this.datepipe.transform(this.payslipByDateRange[0], 'yyyy-MM-dd');;
      let toDate = this.datepipe.transform(this.payslipByDateRange[1], 'yyyy-MM-dd');;
      let params = { employeeId: this.paySlipEmployeeId.toString(), fromDate: fromDate.toString() ?? '', toDate: toDate.toString() ?? '' };


      this.areasHttpService.observable_get<any>((ApiArea.payroll + "/Salary/SalaryReport" + "/DownloadPayslip"), {
        responseType: 'blob', params: params
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
    else {
      this.utilityService.fail('Please Select Employee/Enter Date Range', 'Site Reponse')
    }
  }

  salarySheetByDateRange: any[] = [];
  downloadSalarySheetByDateRange() {
    if (this.salarySheetByDateRange.length > 0 && this.paySlipEmployeeId > 0) {
      let fromDate;
      let toDate;
      fromDate = this.datepipe.transform(this.salarySheetByDateRange[0], 'yyyy-MM-dd');
      toDate = this.datepipe.transform(this.salarySheetByDateRange[1], 'yyyy-MM-dd');

      let params = { employeeId: this.paySlipEmployeeId, fromDate: fromDate.toString() ?? '', toDate: toDate.toString() ?? '' };
      let fileName = `SalarySheet_${fromDate}_To_${toDate}.xlsx`;
      this.areasHttpService.observable_get<any>((ApiArea.payroll + "/Salary/SalaryReport" + "/DownloadSalarySheet"), {
        responseType: 'blob', params: params
      }).subscribe((response: any) => {
        if (response.size > 0) {
          var blob = new Blob([response], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
          const link = document.createElement('a');
          link.href = window.URL.createObjectURL(blob);
          link.download = fileName;
          link.click();
        }
        else {
          this.utilityService.warning("No Payslip found");
        }
      }, (error) => {
        this.utilityService.fail("Something went wrong", "Server Response");

      })
    }
    else {
      this.utilityService.fail('Please Select Employee/ Date Range', 'Site Reponse')
    }
  }

  //Added By Nur 27-Nov-2023

  downloadOtherReport(){
    if(this.rptReportType=="Reconciliation Statement"){
      this.downloadReconciliationStatement();
    }
    if(this.rptReportType=="Reconciliation Breakdown"){
      this.downloadReconciliationBreakdown();
    }
    if(this.rptReportType=="Payment Authorization"){
      
    }
    if(this.rptReportType=="Payment Authorization Cash"){
      
    }
  }

  downloadReconciliationStatement() {
    if (this.rptMonth > 0 && this.rptYear > 0) {
      this.areasHttpService.observable_get((ApiArea.payroll + "/Salary/SalaryReport" + "/ReconciliationRpt"), {
        responseType: 'blob',
        params: { salaryMonth: this.rptMonth, salaryYear: this.rptYear, format: 'xlsx', branchId: this.rptBranchId }
      }).subscribe((response: any) => {
        if (response.size > 0) {
          var blob = new Blob([response], { type: 'application/pdf' });
          let pdfUrl = window.URL.createObjectURL(blob);
          var PDF_link = document.createElement('a');
          PDF_link.href = pdfUrl;
          window.open(pdfUrl, '_blank');
        }
        else {
          this.utilityService.fail(response.msg, "Server Response")
        }
      }, (error) => {
        this.utilityService.fail("Something went wrong", "Server Response")
      })
    }
    else {
      this.utilityService.fail('Please Select Month & Year', 'Site Reponse')
    }
  }

  downloadReconciliationBreakdown() {
    if (this.rptMonth > 0 && this.rptYear > 0) {     
      this.areasHttpService.observable_get((ApiArea.payroll + "/Salary/SalaryReport"+ "/SalaryBreakdownRpt"), {
        responseType: 'blob',
        params: {branchId: this.rptBranchId,jobType:this.rptJobtype ,salaryMonth: this.rptMonth, salaryYear: this.rptYear, format: 'xlsx' }
      }).subscribe((response: any) => {        
        if (response.size > 0) {
          var blob = new Blob([response], { type: 'application/pdf' });
          let pdfUrl = window.URL.createObjectURL(blob);
          var PDF_link = document.createElement('a');
          PDF_link.href = pdfUrl;
          window.open(pdfUrl, '_blank');
        }
        else {
          this.utilityService.fail(response.msg, "Server Response")         
        }
      }, (error) => {
        this.utilityService.fail("Something went wrong", "Server Response")
      })      
    }
    else {
      this.utilityService.fail('Please Select Month & Year', 'Site Reponse')
    }
  }


}
