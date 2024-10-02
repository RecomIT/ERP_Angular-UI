import { transition, trigger, useAnimation } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { slideInUp } from 'ng-animate';
import { CustomModalService } from 'src/app/shared/services/custom-modal.service';
import { UserService } from 'src/app/shared/services/user.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { DatePipe } from '@angular/common';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { EmployeeInfoService } from 'src/app/areas/employee_module/employee/employee-info.service';
import { HrReportService } from './hr-report.service';

@Component({
  selector: 'app-hr-report',
  templateUrl: './hr-report.component.html',
  animations: [
    trigger('slideInUp', [transition('* => *', useAnimation(slideInUp, { params: { timing: 0.5 } }))]),
  ],
})
export class HrReportComponent implements OnInit {

  isNgInit = false;
  modalTitle: string = "";
  datePickerConfig: Partial<BsDatepickerConfig> = this.utilityService.datePickerConfig();
  
  constructor( 
    private utilityService: UtilityService, 
    private userService: UserService, 
    public modalService: CustomModalService, 
    private datepipe: DatePipe, 
    private hrReportService: HrReportService, 
    private employeeInfoService: EmployeeInfoService) { }

  ngOnInit(): void {
    this.datePickerConfig = this.utilityService.datePickerConfig();
    this.loadEmployees();
    this.loadReportsName(); 
    this.loadLettersName(); 
    this.loadReportsFormat();
  }

 

  logger(msg: any, options: any) {
    this.utilityService.consoleLog(msg, options);
  }

  User() {
    return this.userService.User();
  }

  clearTheDate(): void {
    this.theDate = null;
  }

  employeeId: number = 0;  
  dateRange: any[] = [];
  theDate:string | null = null;

  pagePrivilege: any = this.userService.getPrivileges();
  select2Options = this.utilityService.select2Config();

  rptFormat: string = '';
  ddlReportsFormat: any[] = [];
  loadReportsFormat() {
    this.ddlReportsFormat = ['PDF', 'WORD'];
  }

  ddlEmployee: any[] = [];
  loadEmployees() {
    this.employeeInfoService.loadDropdownData({});
    this.employeeInfoService.ddl_employee_data$.subscribe(data => {
      this.employeeInfoService.loadDropdown(data);
      this.ddlEmployee = this.employeeInfoService.ddl$;
    }, error => {
      console.error('Error while fetching data:', error);
    });
  }

  downloadEmploymentCertificate() {
    let format = this.rptFormat;
    let theDate = this.datepipe.transform(this.theDate, 'yyyy-MM-dd');
    let params = {
      employeeId: this.employeeId.toString(),
      theDate: theDate,
      format: format
    };

    let extension: string;
    if (format.toLowerCase() == 'pdf') {
      extension = 'pdf';
    } else if (format.toLowerCase()  == 'word') {
      extension = 'doc';
    } 

    console.log("response >>>", params);   

    if (this.employeeId === 0) {
      this.utilityService.warning("Please Select Employee ID");
    }
    if (this.rptFormat === '') {
      this.utilityService.warning("Please Select Format");
    }

    let fileName = `Employment_Certificate_${this.employeeId}.${extension}`;

    if (this.employeeId > 0 && this.rptFormat != '') {
      this.hrReportService.downloadEmploymentCertificate(params).subscribe((response) => {

        var blob = new Blob([response.body],
          {
            type:
              format == 'pdf'
                ? 'application/pdf'
                : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
          });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
      },
        (error) => {
          this.utilityService.httpErrorHandler(error);
        }
      );
    }

  }

  downloadConfirmationOfService() {
    let format = this.rptFormat;
    let theDate = this.datepipe.transform(this.theDate, 'yyyy-MM-dd');

    let params = {
      employeeId: this.employeeId.toString(),
      theDate: theDate, 
      format: format
    };

    let extension: string;
    if (format.toLowerCase() == 'pdf') {
      extension = 'pdf';
    } else if (format.toLowerCase()  == 'word') {
      extension = 'doc';
    } 

    console.log("response >>>", params);

    if (this.employeeId === 0) {
      this.utilityService.warning("Please Select Employee ID");
    }
    if (this.rptFormat === '') {
      this.utilityService.warning("Please Select Format");
    }

    let fileName = `Confirmation_Of_Service_${this.employeeId}.${extension}`;

    if (this.employeeId > 0 && this.rptFormat != '') {
      this.hrReportService.downloadConfirmationOfService(params).subscribe((response) => {
        var blob = new Blob([response.body],
          {
            type:
              format == 'pdf'
                ? 'application/pdf'
                : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
          });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
      },
        (error) => {
          this.utilityService.httpErrorHandler(error);
        }
      );
    }

  }


  reportsName: string = '';
  ddlReportsName: any[] = [];
  loadReportsName() {
    this.ddlReportsName = ['New Joiner Report', 
    'Confirmation Report'];
  }

  reportsName_changed() {
    this.employeeId = 0;
    this.dateRange = [];
  }

  lettersName: string = '';
  ddlLettersName: any[] = [];
  loadLettersName() {
    this.ddlLettersName = ['Employment Certificate',
      'Confirmation of Service'];
  }

  lettersName_changed() {
    this.employeeId = 0;
    this.theDate = '';
    this.rptFormat = '';
  }

  downloadLetters() {
    console.log("this.lettersName >>> ", this.lettersName);
    
    if (this.lettersName == 'Employment Certificate') {
      this.downloadEmploymentCertificate();
    }
    if (this.lettersName == 'Confirmation of Service') {
      this.downloadConfirmationOfService();
    }
  }

  downloadReports() {
    console.log("this.reportsName >>> ", this.reportsName);
    
    if (this.reportsName == 'New Joiner Report') {
      this.downloadNewJoinerReport();
    }
    if (this.reportsName == 'Confirmation Report') {
      this.downloadConfirmationReport();
    }
  }

  downloadNewJoinerReport() {
    let fromDate = this.datepipe.transform(this.dateRange[0], 'yyyy-MM-dd');
    let toDate = this.datepipe.transform(this.dateRange[1], 'yyyy-MM-dd');
    let format = "xlsx";
    let params = {
      employeeId: this.employeeId.toString(),
      fromDate: fromDate ?? null,
      toDate: toDate ?? null,
      format: format
    };

    if (this.dateRange === null || this.dateRange === undefined || this.dateRange.length === 0) {
      this.utilityService.warning("Please Select Date Range");
    } 

    let fileName = `New_Joiner_Report.${'xlsx'}`;

    if (fromDate !== null && toDate !== null) {
      this.hrReportService.downloadNewJoinerReport((params)).subscribe(response => {
        if (response.body.size > 0) {       
          var blob = new Blob([response.body], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          const link = document.createElement('a');
          link.href = window.URL.createObjectURL(blob);
          link.download = fileName;
          link.click();
        }
        else {
          this.utilityService.warning("No data found")
        }
      }, (error) => {
        this.utilityService.httpErrorHandler(error);
      })
    }
  }

  downloadConfirmationReport() {
    let fromDate = this.datepipe.transform(this.dateRange[0], 'yyyy-MM-dd');
    let toDate = this.datepipe.transform(this.dateRange[1], 'yyyy-MM-dd');
    let format = "xlsx";
    let params = {
      employeeId: this.employeeId.toString(),
      fromDate: fromDate ?? null,
      toDate: toDate ?? null,
      format: format
    };

    if (this.dateRange === null || this.dateRange === undefined || this.dateRange.length === 0) {
      this.utilityService.warning("Please Select Date Range");
    } 

    let fileName = `Confirmation_Report.${'xlsx'}`;

    if (fromDate !== null && toDate !== null) {
      this.hrReportService.downloadConfirmationReport((params)).subscribe(response => {
        if (response.body.size > 0) {       
          var blob = new Blob([response.body], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          const link = document.createElement('a');
          link.href = window.URL.createObjectURL(blob);
          link.download = fileName;
          link.click();
        }
        else {
          this.utilityService.warning("No data found")
        }
      }, (error) => {
        this.utilityService.httpErrorHandler(error);
      })
    }
  }

}
