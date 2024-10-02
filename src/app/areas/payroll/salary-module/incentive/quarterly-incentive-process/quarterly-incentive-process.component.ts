import { transition, trigger, useAnimation } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { slideInUp } from 'ng-animate';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { QuarterlyIncentiveRoutingService } from '../routing/quarterly-incentive-routing.service';
import { Select2ConfigService } from 'src/app/shared/services/Select2/select2-config.service';
import { AreasHttpService } from 'src/app/areas/areas.http.service';
import { ApiArea, ApiController } from 'src/app/shared/constants';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-quarterly-incentive-process',
  templateUrl: './quarterly-incentive-process.component.html',
  styleUrls: ['./quarterly-incentive-process.component.css'],
  animations: [
    trigger('slideInUp', [transition('* => *', useAnimation(slideInUp, { params: { timing: 0.5 } }))]),
  ]
})
export class QuarterlyIncentiveProcessComponent implements OnInit {

  modalTitle: string = "";

  constructor(
    private utilityService: UtilityService,
    private quarterlyIncentiveRoutingService: QuarterlyIncentiveRoutingService,
    private select2ConfigService: Select2ConfigService,
    private areasHttpService: AreasHttpService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    
    this.getBatchNo();
    this.batchNoSelect2Options = this.select2ConfigService.getDefaultConfig();
    this.yearSelect2Options = this.select2ConfigService.getDefaultConfig();
    this.quarterSelect2Options = this.select2ConfigService.getDefaultConfig();

    this.getQuarterlyIncentive();
    this.getQuarterlyIncenitveYear();
    this.getQuarterlyIncentiveQuarter();
  }




  showUploadTaxZoneModal: boolean = false;
  openUploadExcelFileModal() {
    this.showUploadTaxZoneModal = true;
    this.modalTitle = "Upload Excel File";
  }

  closeUploadExcelFileModal(reason: any) {
    this.showUploadTaxZoneModal = false;
    if (reason == 'Save Complete') {
    }

  }



  batchNoSelect2Options:any = [];
  yearSelect2Options:any = [];
  quarterSelect2Options:any = [];

  
  listOfBatchNo: any[] = [];
  searchByBatchNo: any = null;
  getBatchNo() {
    return this.quarterlyIncentiveRoutingService.getBatchNo<any>(null)
    .toPromise()
    .then((response: any) => {
      if (Array.isArray(response)) {
        this.listOfBatchNo = response;
        console.log('Batch No.', this.listOfBatchNo);
      }
      return this.listOfBatchNo; 
    })
    .catch((error: any) => {
      console.error(error);
      throw error;
    });
      
  }



  onBatchSelectionChange(selectedBatch: any) {

    console.log("selectedBatch >>>", selectedBatch);
    this.batchNo = selectedBatch;

    this.getQuarterlyIncentive();   
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
    this.getQuarterlyIncentive();   
  }



  






  
  
  listOfQuarter: any[] = [];
  searchByQuarter: number = null;
  incentiveYear: number = null;
  IncentiveQuarterNo: number = null;

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
    this.IncentiveQuarterNo = selectedQuarter;

    this.getQuarterlyIncentive();   
  }


  
  listOfQuarterlyIncentive: any[] = [];
  batchNo: number = null;

  getQuarterlyIncentive() {
    
    const params: any = {};
    if (this.batchNo && this.batchNo > 0) {
      params['batchNo'] = this.batchNo;
    }

    if (this.incentiveYear && this.incentiveYear > 0) {
      params['incentiveYear'] = this.incentiveYear;
    }
    
    if (this.IncentiveQuarterNo && this.IncentiveQuarterNo > 0) {
      params['IncentiveQuarterNo'] = this.IncentiveQuarterNo;
    }
    

    this.quarterlyIncentiveRoutingService.getQuarterlyIncentive<any>(params)
      .toPromise()
      .then((response: any) => {
        if (Array.isArray(response)) {
          this.listOfQuarterlyIncentive = response;
          console.log('listOfQuarterlyIncentive', this.listOfQuarterlyIncentive);
        }
        return this.listOfQuarterlyIncentive;
      })
      .catch((error: any) => {
        console.error(error);
        throw error;
      });
  }







  showQuarterlyIncentiveProcessDetails: boolean = false;
  quarterlyProcessId: number = 0;
  openQuarterlyIncentiveProcessDetailsModal(id) {
    console.log("Open modal clicked");
    this.quarterlyProcessId = id;
    this.showQuarterlyIncentiveProcessDetails = true;
  }

  closeQuarterlyIncentiveProcessDetailsModal(reason: any) {
    this.quarterlyProcessId = 0;
    this.showQuarterlyIncentiveProcessDetails = false;
  }



  
  showQuarterlyIncentiveProcessUndoOrDisbursed: boolean = false;
  undoFlag : string = '';
  disbursedFlag : string = '';


  openQuarterlyIncentiveProcessUndoModal(id) {
    console.log("Open modal clicked");
    this.quarterlyProcessId = id;
    this.undoFlag = 'undo';
    this.showQuarterlyIncentiveProcessUndoOrDisbursed = true;
  }

  openQuarterlyIncentiveProcessDisbursedModal(id) {
    console.log("Open modal clicked");
    this.quarterlyProcessId = id;
    this.disbursedFlag = 'disbursed'
    this.showQuarterlyIncentiveProcessUndoOrDisbursed = true;
  }

  closeQuarterlyIncentiveProcessUndoOrDisbursedModal(reason: any) {
    this.quarterlyProcessId = 0;
    this.undoFlag = '';
    this.disbursedFlag = '';
    this.showQuarterlyIncentiveProcessUndoOrDisbursed = false;
  }


  refresh(){
    this.getQuarterlyIncentive();
    this.getQuarterlyIncenitveYear();
  }




  // -------------------------------------------- >>> PDF

  User() {
    return this.userService.User();
  }


  // paySlipMonth: number = parseInt(this.utilityService.currentMonth);
  // paySlipYear: number = parseInt(this.utilityService.currentYear);
  // paySlipEmployeeId: number = 0;


  paySlipMonth: number = 8;
  paySlipYear: number = 2023;
  paySlipEmployeeId: number = 21;

  // quarter: string = 'Q1'
  // year: number = 2023;

  // generateReport() {
  //   var mediaType = 'application/pdf';

  //   const params: any = {};
  //   if (this.quarter && this.quarter !== null) {
  //     params['quarter'] = this.quarter;
  //   }

  //   if (this.year && this.year > 0) {
  //     params['year'] = this.year;
  //   }

  //   if (this.paySlipMonth > 0 && this.paySlipYear > 0) {
  //     this.areasHttpService.observable_get((ApiArea.payroll + "/Incentive/QuarterlyIncentive" + "/QuarterlyIncentiveReport"), {
  //       responseType: 'blob',
  //       params: { employeeId: this.paySlipEmployeeId, 
  //         month: this.paySlipMonth, 
  //         year: this.paySlipYear, 
  //         branchId: this.User().BranchId, 
  //         companyId: this.User().ComId, 
  //         organizationId: this.User().OrgId 
  //       }
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
  // }





quarter: string = null;
year: number = 2023;

generateReport() {
    const params: any = {};
    if (this.quarter && this.quarter !== null) {
        params['quarter'] = this.quarter;
    }

    if (this.year && this.year > 0) {
        params['year'] = this.year;
    }

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






showReportModal: boolean = false;
openReportModal() {
  this.showReportModal = true;
  this.modalTitle = "Upload Excel File";
}

closeReportModal(reason: any) {
  this.showReportModal = false;
  if (reason == 'Close') {
  }

}



}
