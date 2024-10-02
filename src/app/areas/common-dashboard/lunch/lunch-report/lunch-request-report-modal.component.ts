import { DatePipe } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { AreasHttpService } from 'src/app/areas/areas.http.service';
import { ApiArea } from 'src/app/shared/constants';
import { CustomModalService } from 'src/app/shared/services/custom-modal.service';
import { UserService } from 'src/app/shared/services/user.service';
import { UtilityService } from 'src/app/shared/services/utility.service';

@Component({
  selector: 'app-lunch-request-report-modal',
  templateUrl: './lunch-request-report-modal.component.html'
})
export class LunchRequestReportModalComponent implements OnInit {

  @ViewChild('lunchRequestReportModal', { static: true }) lunchRequestReportModal!: ElementRef;

  @Output() closeModalEvent = new EventEmitter<string>();

  modalTitle: string = 'Lunch Request Report'; 

 
  datePickerConfig: Partial<BsDatepickerConfig> = this.utilityService.datePickerConfig();

  constructor(
    private formBuilder: FormBuilder,
    private modalService: CustomModalService, 
    private userService: UserService, private utilityService: UtilityService,
    private datepipe: DatePipe, private areasHttpService: AreasHttpService
    ) { }


    User() {
      return this.userService.User();
  }

  select2Config: any = this.utilityService.select2Config();

  ngOnInit() {
    this.lunchReportFormInit();
    this.openModal();
}



  openModal() {
    this.modalService.open(this.lunchRequestReportModal, "md");
  }


  requestDateRange_changed() {
      this.lunchReportForm.get('requestDateRange').setValue(this.requestDateRange);
    
   
  }
  
  lunchReportForm: FormGroup;
  lunchReportFormInit() {
    this.lunchReportForm = this.formBuilder.group({
      fromDate: new FormControl(null, [Validators.required]),
      toDate: new FormControl(null, [Validators.required])
    })
  }
  
  btnDownloadSheet: boolean = false; 
  requestDateRange: any[] = [];
  downloadDateRangeLunchRequestSheet() {
    if (!this.requestDateRange || this.requestDateRange.length === 0) {
      this.utilityService.warning("Please select a Request Date Range.");
      return;
  }
    let fromDate;
    let toDate;
     fromDate = (this.requestDateRange != null && this.requestDateRange.length > 0) ? this.datepipe.transform(this.requestDateRange[0], 'yyyy-MM-dd') : "";
     toDate = (this.requestDateRange != null && this.requestDateRange.length > 0) ? this.datepipe.transform(this.requestDateRange[1], 'yyyy-MM-dd') : "";
     this.btnDownloadSheet = true;
      let params = { fromDate: fromDate.toString() ?? '', toDate: toDate.toString() ?? '', format: 'xlsx' };
      let fileName = `Lunch_Request_${fromDate}_To_${toDate}.xlsx`;
      this.areasHttpService.observable_get<any>((ApiArea.hrms + "/LunchRequest" + "/DownloadLunchRequestSheet"), {
        responseType: "blob", params: params
      }).subscribe((response) => {
        if (response.size > 0) {
          var blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          const link = document.createElement('a');
          link.href = window.URL.createObjectURL(blob);
          link.download = fileName;
          link.click();
        }
        else {
          this.utilityService.warning("No Excel File found");
        }
      }, (error) => {
        this.utilityService.fail("Something went wrong", "Server Response")

      })
    
  }



  closeModal(reason: any) {
    this.modalService.service.dismissAll(reason);
    this.closeModalEvent.emit(reason);
  }

 

 
  
}
  

