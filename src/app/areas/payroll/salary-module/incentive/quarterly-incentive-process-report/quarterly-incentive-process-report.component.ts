import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { CustomModalService } from 'src/app/shared/services/custom-modal.service';
import { QuarterlyIncentiveRoutingService } from '../routing/quarterly-incentive-routing.service';
import { Select2ConfigService } from 'src/app/shared/services/Select2/select2-config.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AreasHttpService } from 'src/app/areas/areas.http.service';
import { ApiArea, ApiController } from 'src/app/shared/constants';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-quarterly-incentive-process-report',
  templateUrl: './quarterly-incentive-process-report.component.html',
  styleUrls: ['./quarterly-incentive-process-report.component.css']
})
export class QuarterlyIncentiveProcessReportComponent implements OnInit {

  @ViewChild('reportModal', { static: true }) reportModal!: ElementRef;
  @Output() closeModalEvent = new EventEmitter<string>();
  

  constructor(
    private modalService: CustomModalService,
    private quarterlyIncentiveRoutingService: QuarterlyIncentiveRoutingService,
    private select2ConfigService: Select2ConfigService,
    private utilityService: UtilityService,
    private areasHttpService: AreasHttpService
  ) { }


  yearSelect2Options:any = [];
  quarterSelect2Options:any = [];

  ngOnInit(): void {
    this.openReportModal();

    this.yearSelect2Options = this.select2ConfigService.getDefaultConfig();
    this.quarterSelect2Options = this.select2ConfigService.getDefaultConfig();

    this.getQuarterlyIncenitveYear();
    // this.getQuarterlyIncenticeExcelReport();
  }


  openReportModal() {
    this.modalService.open(this.reportModal, "lg")
  }

  closeModal(reason: string) {
    this.modalService.service.dismissAll(reason);
    this.closeModalEvent.emit(reason);
  }




  listOfYear: any[] = [];
  searchByYear: any = null;
  getQuarterlyIncenitveYear() {
    return this.quarterlyIncentiveRoutingService.getQuarterlyIncenitveYear<any>(null)
    .toPromise()
    .then((response: any) => {
      if (Array.isArray(response)) {
        this.listOfYear = response;
        console.log('listOfYear', this.listOfYear);
      }
      return this.listOfYear; 
    })
    .catch((error: any) => {
      console.error(error);
      throw error;
    });
      
  }


  onYearSelectionChange(selectedYear: any) {

    console.log("selectedYear >>>", selectedYear);
    this.incentiveYear = selectedYear;

    this.getQuarterlyIncentiveQuarter();
  }


  
  listOfQuarter: any[] = [];
  searchByQuarter: number = null;
  incentiveYear: number = null;
  incentiveQuarterNumber: any = null;
  employeeIdForSearch: number = null;

  getQuarterlyIncentiveQuarter() {
    
    const params: any = {};
    if (this.incentiveYear && this.incentiveYear > 0) {
      params['incentiveYear'] = this.incentiveYear;
    }

    this.quarterlyIncentiveRoutingService.getQuarterlyIncentiveQuarter<any>(params)
      .toPromise()
      .then((response: any) => {
        if (Array.isArray(response)) {
          this.listOfQuarter = response;
          console.log('listOfQuarter', this.listOfQuarter);
        }
        return this.listOfQuarter;
      })
      .catch((error: any) => {
        console.error(error);
        throw error;
      });
  }


  
  onQuarterSelectionChange(selectedQuarter: any) {
    console.log("selectedQuarter >>>", selectedQuarter);
    this.incentiveQuarterNumber = selectedQuarter;

    this.getQuarterlyIncentiveEmployees();
  }






  
  listOfEmployee: any[] = [];
  searchByEmployeeId: number = null;

  getQuarterlyIncentiveEmployees() {
    
    const params: any = {};

    if (this.incentiveYear && this.incentiveYear > 0) {
      params['incentiveYear'] = this.incentiveYear;
    }

    if (this.incentiveQuarterNumber && this.incentiveQuarterNumber !== null) {
      params['incentiveQuarter'] = this.incentiveQuarterNumber;
    }

    this.quarterlyIncentiveRoutingService.getQuarterlyIncentiveEmployees<any>(params)
      .toPromise()
      .then((response: any) => {
        if (Array.isArray(response)) {
          this.listOfEmployee = response;
          console.log('listOfEmployee', this.listOfEmployee);
        }
        return this.listOfEmployee;
      })
      .catch((error: any) => {
        console.error(error);
        throw error;
      });
  }


  
  onEmployeeSelectionChange(selectedEmployee: any) {
    console.log("selectedEmployee >>>", selectedEmployee);
    this.employeeIdForSearch = selectedEmployee;
  }













  generateReport() {

    const params: any = {};
  
    if (this.incentiveYear && this.incentiveYear > 0) {
      params['year'] = this.incentiveYear;
    }

    if (this.incentiveQuarterNumber && this.incentiveQuarterNumber !== null) {
        params['quarter'] = this.incentiveQuarterNumber;
    }

    if (this.employeeIdForSearch && this.employeeIdForSearch !== null) {
      params['employeeIdForSearch'] = this.employeeIdForSearch;
    }

    console.log('params',params);

    this.quarterlyIncentiveRoutingService.getQuarterlyIncentiveReport<any>(params)
    .toPromise()
    .then((response: any) => {
        console.log("file response >>>", response);
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
    });


  }




  listOfQuarterlyIncentiveExcelReport: any[] = [];

 
  xlsxDownload(){
    this.format = 'xlsx';
    this.downloadQuarterlyIncentiveExcelReport();
  }

  xlsDownload(){
    this.format = 'xls';
    this.downloadQuarterlyIncentiveExcelReport();
  }

  format: string = '';
  

  downloadQuarterlyIncentiveExcelReport() {
    const params: any = {};
  
    if (this.incentiveYear && this.incentiveYear > 0) {
      params['year'] = this.incentiveYear;
    }
  
    if (this.incentiveQuarterNumber && this.incentiveQuarterNumber !== null) {
      params['quarter'] = this.incentiveQuarterNumber;
    }
  
    if (this.format && this.format !== null) {
      params['format'] = this.format;
    }

    if (this.employeeIdForSearch && this.employeeIdForSearch !== null) {
      params['employeeIdForSearch'] = this.employeeIdForSearch;
    }
  
    console.log('params', params);
  
    this.quarterlyIncentiveRoutingService.getQuarterlyIncentiveExcelReport<any>(params).subscribe(
      (response) => {
        console.log("response >>>", response);
        if (response.size > 0) {

          let fileName = `QuarterlyIncentive_${this.incentiveYear}`;

          if (this.incentiveQuarterNumber !== null) {
            fileName += `_${this.incentiveQuarterNumber}`;
          }
          
          if (this.format && this.format !== null) {
            fileName += `.${this.format}`;
          } else {
            fileName += '.xlsx'; 
          }
          
  
          const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  
          const link = document.createElement('a');
          link.href = window.URL.createObjectURL(blob);
          link.download = fileName;
          link.click();
        } else {
          this.utilityService.warning("No file found");
        }
      },
      (error) => { this.utilityService.httpErrorHandler(error); }
    );
  }
  
  

}
