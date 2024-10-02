import { Component, ElementRef, EventEmitter, Input, NgModule, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CustomModalService } from 'src/app/shared/services/custom-modal.service';
import { UserService } from 'src/app/shared/services/user.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { RequestApprovalSerive } from '../requestApproval.service';
import { EmployeeInfoService } from 'src/app/areas/employee_module/employee/employee-info.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { AreasHttpService } from 'src/app/areas/areas.http.service';
import { transition, trigger, useAnimation } from '@angular/animations';
import { fadeIn, fadeInUp, fadeOutLeft, slideInUp } from 'ng-animate';

@Component({
  selector: 'expense-reimbursement-module-request-approval-details-modal',
  templateUrl: './request-approval-details-modal.component.html',
  styleUrls: ['./request-approval-details-modal.component.css'],
  animations: [
    trigger('fadeIn', [transition('void => *', useAnimation(fadeIn, { params: { timing: 0.3 } }))]),
    trigger('slideInUp', [transition('* => *', useAnimation(slideInUp, { params: { timing: 0.5 } }))]),
    trigger('fadeInUp', [transition('void => *', useAnimation(fadeInUp))]),
    trigger('fadeOutLeft', [transition('* => void', useAnimation(fadeOutLeft, { params: { timing: 0.3 } }))]),
  ],
})


export class RequestApprovalDetailsModalComponent implements OnInit {

  modalTitle: string = "Expense Request Details";
  datePickerConfig: Partial<BsDatepickerConfig> = this.utilityService.datePickerConfig();   
  userRoll : any;
  
  @Input() transactionType: string = '';
  @Input() requestId: number = 0;
  @Input() employeeId: number = 0;
  @Input() stateStatus: string = '';
  @ViewChild('requestDetailsModal', { static: true }) requestDetailsModal!: ElementRef;
  @Output() closeModalEvent = new EventEmitter<string>();
  

  constructor(
    private modalService: CustomModalService,
    private fb: FormBuilder,
    private utilityService: UtilityService,
    private userService: UserService,
    private requestApprovalSerive: RequestApprovalSerive,
    private employeeInfoService: EmployeeInfoService,
    private areasHttpService: AreasHttpService,
  ) { }

  ngOnInit(): void {
    this.approvedFormInit();
    this.openRequestModal();
    console.log("showModal >>>", this.transactionType ,this.requestId, this.employeeId, this.stateStatus);
    this.getRequestData();
    this.getRequestDetailsData();
    this.getEmployeeProfileInfo();
    this.userRoll = this.User().RoleName;
  }
  
  openRequestModal() {
    this.modalService.open(this.requestDetailsModal, "xl")
  }

  logger(msg: any, options: any) {
    this.utilityService.consoleLog(msg, options);
  }

  User() {
    return this.userService.User();
  }  

  image_path: any = null;
  getEmployeeProfileInfo() {
    this.employeeInfoService.getProfileInfo({ id: this.employeeId }).subscribe(response => {
      // this.image_path = this.areasHttpService.imageRoot + response.body.photoPath    
      this.image_path = 'assets/img/yeasinahmed.jpg';
      console.log(this.image_path);
    }, (error) => {
      this.utilityService.httpErrorHandler(error);
    })
  }

  accountStatus : string;
  spendMode : string;
  requestList: any[] = [];
  employeeData: any = {};
  getRequestData() {
    let params = {
      userId: this.User().EmployeeId,
      transactionType: this.transactionType.replace('Request', '').trim(),
      requestId: this.requestId,
      employeeId: this.employeeId,
      stateStatus: this.stateStatus
    };  
    // console.log("params Data >>>", params);
    this.requestApprovalSerive.getById(params).subscribe(response => {
      if (Array.isArray(response)) {
        this.requestList = response;
      } else {
        this.requestList = [response];
      };

      if (this.requestList.length > 0) {
        this.employeeData = this.requestList[0];
        this.spendMode = this.employeeData.spendMode;
        this.accountStatus = this.employeeData.accountStatus;
      };
      this.load_ApprovedForm_Value([response]);
      // console.log("response [] >>>", [response]);

    }, (error) => {
      this.utilityService.fail("Something went wrong", "Server Response")
      console.log("error >>>", error);
    });
  }

  requestDetailsTitle : string;
  requestDetailsList : any[] = [];
  getRequestDetailsData() {

    if (this.transactionType.replace('Request', '').trim() == "Conveyance") {
      this.requestDetailsTitle = "Transportation's Info";
    }
    else{
      this.requestDetailsTitle = "Description";
    }; 

    let params = {
      userId: this.User().EmployeeId,
      transactionType: this.transactionType.replace('Request', '').trim(),
      requestId: this.requestId,
      employeeId: this.employeeId,
      stateStatus: this.stateStatus
    };

    // console.log("Request Data >>>", params);

    this.requestApprovalSerive.getRequestDetails(params).subscribe(response => {
      if ((response.body as any[]).length > 0) {
        console.log("Request Data >>>", response.body);
        this.requestDetailsList = response.body;    
        this.totalAmount();  
        this.totalAmountC(); 
      }; 

    }, (error) => {
      this.utilityService.fail("Something went wrong", "Server Response")
      console.log("error >>>", error);
    })
  }

  approvedForm: FormGroup;
  approvedFormInit() {
    this.approvedForm = this.fb.group({
      commentsUser: new FormControl(''),
      commentsAccount: new FormControl(''),
    });

  }

  totalAmount(): number {
    return this.requestDetailsList.reduce((sum, item) => sum + item.amount, 0);
  }

  totalAmountC(): number {
    return this.requestDetailsList.reduce((sum, item) => sum + item.cost, 0);
  }

  load_ApprovedForm_Value(value: any) {
    if (value && value.length > 0) {
      const firstItem = value[0]; // Adjust index based on which item you want to access
      this.approvedForm.get('commentsUser').setValue(firstItem.commentsUser);
      this.approvedForm.get('commentsAccount').setValue(firstItem.commentsAccount);
    };
  }

  downloadFile(path: any) {
    if (path != null && path != '') {
      this.requestApprovalSerive.downloadFile(path).subscribe(response => {

        if (response.size > 64) {
          var blob = new Blob([response], { type: response.type });
          let pdfUrl = window.URL.createObjectURL(blob);

          var PDF_link = document.createElement('a');
          PDF_link.href = pdfUrl;
          window.open(pdfUrl, '_blank');
        }
        else {
          this.utilityService.warning("No file found")
        }
      }, error => {
        this.utilityService.fail('Data retrival Issue', 'Server Response');
      })
    }
  }

  submitApproved(flag: string) {

    let params: any = {
      userId: this.User().EmployeeId,
      transactionType: this.transactionType.replace('Request', '').trim(),
      requestId: this.requestId,
      employeeId: this.employeeId,
      commentsUser: this.approvedForm.get('commentsUser').value,
      commentsAccount: this.approvedForm.get('commentsAccount').value,
      spendMode : this.spendMode,
      // requestDate : new Date(this.requestList[0]?.requestDate.value).toISOString(),
      flag: flag
    }; 

    if (this.transactionType == "Conveyance") {
        params.companyName = this.requestList[0]?.companyName
    }
    else
      if (this.transactionType == "Travels") {
        params.fromDate = this.requestList[0]?.requestDate.value[0].toString('yyyy-MM-dd'),
          params.toDate = this.requestList[0]?.requestDate.value[1].toString('yyyy-MM-dd'),
          params.location = this.requestList[0]?.location,
          params.transportation = this.requestList[0]?.transportation,
          params.transportationCosts = this.requestList[0]?.transportationCosts,
          params.accommodationCosts = this.requestList[0]?.accommodationCosts,
          params.subsistenceCosts = this.requestList[0]?.subsistenceCosts,
          params.otherCosts = this.requestList[0]?.otherCosts,
          params.description = this.requestList[0]?.description
      }
      else
        if (this.transactionType == "Entertainment") {
            params.purpose = this.requestList[0]?.purpose
        }
        else
          if (this.transactionType == "Expat") {
              params.expat = this.requestList[0]?.expat
          }
          else
            if (this.transactionType == "Training") {
              params.institutionName = this.requestList[0]?.institutionName,
                params.course = this.requestList[0]?.course,
                params.description = this.requestList[0]?.description,
                params.admissionDate = new Date(this.requestList[0]?.admissionDate.value).toISOString(),
                params.duration = this.requestList[0]?.duration,
                params.trainingCosts = this.requestList[0]?.trainingCosts,
                params.purpose = this.requestList[0]?.purpose
            }
            else
              if (this.transactionType == "Purchase") {
                params.purpose = this.requestList[0]?.purpose
              }

    // console.log("response sendEmail>>", params);

    // this.sendEmail(params);
    // return;
    this.requestApprovalSerive.approved(params).subscribe(
      response => {
        // console.log("response Approved>>", response);
        if (response.body.status == true) {
          this.sendEmail(params);
          this.utilityService.success(response.body.msg, "Server Response");
          this.closeRequestModal(this.utilityService.SuccessfullySaved);
        }
      },
      error => {
        console.log("error >>>", error);
        this.utilityService.fail("Error");
      }
    );


  }

  sendEmail(params: any) {
    if (params.requestDate) {
      params.requestDate = new Date(params.requestDate).toISOString();
    }
    if (params.transactionDate) {
      params.transactionDate = new Date(params.transactionDate).toISOString();
    }

    console.log("sendEmail params>>>", params);

    this.requestApprovalSerive.sendEmail(params).subscribe(response => {
      // console.log("response >>>", response);
    }, (error) => {
      console.log("error >>>", error);
      this.utilityService.fail("Something went wrong", "Server Response");
    })
  }

  closeRequestModal(reason: any) {
    this.modalService.service.dismissAll(reason);
    this.closeModalEvent.emit(reason);   

  }


}
