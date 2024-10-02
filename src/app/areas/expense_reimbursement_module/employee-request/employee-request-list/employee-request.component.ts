import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { transition, trigger, useAnimation } from '@angular/animations';
import { bounceIn, fadeIn, fadeInRight, slideInUp } from 'ng-animate';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { UserService } from 'src/app/shared/services/user.service';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { EmployeeRequestSerive } from '../employee-request.service';
import { CustomModalService } from 'src/app/shared/services/custom-modal.service';

@Component({
  selector: 'app-employee-request',
  templateUrl: './employee-request.component.html',
  styleUrls: ['./employee-request.component.css'],
  animations: [
    trigger('slideInUp', [transition('* => *', useAnimation(slideInUp, { params: { timing: 0.5 } }))]),
    trigger('fadeIn', [transition('void => *', useAnimation(fadeIn, { params: { timing: 0.3 } }))]),
    trigger('fadeInRight', [transition('void => *', useAnimation(fadeInRight, { params: { timing: 0.5 } }))]),
    trigger('bounceIn', [transition('void => *', useAnimation(bounceIn, { params: { timing: 1 } }))]),
  ],
})
export class EmployeeRequestComponent implements OnInit {

  @ViewChild("employeeRequestDeleteModal", { static: false }) employeeRequestDeleteModal !: ElementRef;


  constructor(
    private utilityService:UtilityService,
    private userService: UserService,
    private datepipe: DatePipe,
    private fb: FormBuilder,
    public toastr: ToastrService,
    private employeeRequestSerive: EmployeeRequestSerive,
    public modalService: CustomModalService
    ){}

  select2Options = this.utilityService.select2Config();
  datePickerConfig: Partial<BsDatepickerConfig> = this.utilityService.datePickerConfig();

  ngOnInit(): void {    
    this.searchFormInit();
    this.loadStatus();
    // this.getRequestData();
    this.loadTransactionType();
  }

  logger(msg: any, options: any) {
    this.utilityService.consoleLog(msg, options);
  }

  User() {
    return this.userService.User();
  }

  reason: string = '';
  showingModal : boolean= false;
  requestId: number=0;
  transactionType: string = '';
  spendMode: string = '';
  emailFlag: string = '';

  showModal(id: any,transactionType: string, spendMode: string, emailFlag: string){    
      this.showingModal = true;
      this.requestId = id;
      this.transactionType = transactionType;
      this.spendMode = spendMode;
      this.emailFlag = emailFlag;
      // console.log("showModal >>>", id,transactionType,spendMode,emailFlag);
  }

  pagePrivilege: any = this.userService.getPrivileges();
  pageNumber: number = 1;
  pageSize: number = 10;
  list_pager: any = this.userService.pageConfigInit("list_pager", this.pageSize, 1, 0);
  selectedTransactionType: string = '';

  list_pageChanged(event: any) {
    this.pageNumber = event;
    this.searchForm.get('pageNumber').setValue(this.pageNumber);
    this.getRequestData();
  }

  ddlStatus: any[] = [];
  loadStatus() {
    this.ddlStatus = ['Pending', 'Canceled', 'Approved'];
  }

  ddlTransactionType: string[] = [];
  loadTransactionType() {
    this.ddlTransactionType = ['Conveyance', 'Expat','Travels', 'Entertainment', 'Training', 'Purchase'];
  }


  list: any[] = [];
  list_loading_label: string = null;
  getRequestData() {
    let params = {
      fromDate:
        this.searchForm.get('transactionDate').value != null
          && this.searchForm.get('transactionDate').value != undefined ?
          this.datepipe.transform(this.searchForm.get('transactionDate').value[0], "yyyy-MM-dd").toString() : '',
      toDate:
        this.searchForm.get('transactionDate').value != null &&
          this.searchForm.get('transactionDate').value != undefined ?
          this.datepipe.transform(this.searchForm.get('transactionDate').value[1], "yyyy-MM-dd").toString() : '',
      transactionType: this.searchForm.get('transactionType').value,
      employeeId: this.User().EmployeeId,
      status: this.searchForm.get('status').value,
      sortingCol: this.searchForm.get('sortingCol').value,
      sortType: this.searchForm.get('sortType').value,
      pageNumber: this.searchForm.get('pageNumber').value,
      pageSize: this.searchForm.get('pageSize').value,
    };

    this.list = []
    this.list_loading_label = null
    this.employeeRequestSerive.get(params).subscribe(response => {
      if ((response.body as any[]).length > 0) {
        // console.log("Request Data >>>", response.body);
        this.list = response.body;
        let xPaginate = JSON.parse(response.headers.get('X-Pagination'));
        this.list_pager = this.userService.pageConfigInit("list_pager", xPaginate.itemsPerPage, xPaginate.currentPage, xPaginate.totalItems);
      }
      else {
        this.list_loading_label = "No record(s) found";
      }

    }, (error) => {
      this.utilityService.fail("Something went wrong", "Server Response")
      console.log("error >>>", error);
    })
  }

  searchForm: FormGroup;
  searchFormInit() {
    this.searchForm = this.fb.group({
      transactionDate: new FormControl(null),
      transactionType: new FormControl(''),
      status: new FormControl(''),
      sortingCol: new FormControl(''),
      sortType: new FormControl(''),
      pageNumber: new FormControl(this.pageNumber),
      pageSize: new FormControl(this.pageSize)
    });


    this.searchForm.get('transactionDate').valueChanges.subscribe((item) => {
      this.pageSize = 1;
      this.getRequestData();
    });

    this.searchForm.get('status').valueChanges.subscribe((item) => {
      this.pageSize = 1;      
      this.getRequestData();
    });

    this.searchForm.get('transactionType').valueChanges.subscribe((item) => {
      this.pageSize = 1;
      var value = item;
      // console.log("value >>>", value);
      if (value != "") {
        this.getRequestData();
      }
      this.selectedTransactionType = this.searchForm.get('transactionType')?.value;
    });

  }

  requestDeleteItem: any;
  openRequestDeleteModal(item: any) {
    this.requestDeleteItem = null;
    this.requestDeleteItem = item;
    this.modalService.open(this.employeeRequestDeleteModal, "md");
  }

  confirmDelete() {
    console.log("confirmDelete item >>>",this.requestDeleteItem);    
    if (Object.keys(this.requestDeleteItem).length > 0) {
      const transactionType = this.requestDeleteItem.transactionType;
      let params: any = {};  

      if (transactionType == "Conveyance") {
        params = {
          requestId: this.requestDeleteItem.requestId,
          employeeId: this.requestDeleteItem.employeeId,
          transportation: this.requestDeleteItem.transactionType,          
          transactionDate: this.requestDeleteItem.transactionDate,
          transactionType: this.requestDeleteItem.transactionType,
          referenceNumber: this.requestDeleteItem.referenceNumber,
          requestDate: this.requestDeleteItem.requestDate,
          companyName: this.requestDeleteItem.companyName,
          purpose: this.requestDeleteItem.purpose,
          spendMode: this.requestDeleteItem.spendMode,
          description: this.requestDeleteItem.description,
          cancelRemarks: this.reason,
          flag: 'Cancel'
        };
      }

      if (transactionType == "Travels") {
          params = {
            requestId: this.requestDeleteItem.requestId,
            employeeId: this.requestDeleteItem.employeeId,
            transactionDate: this.requestDeleteItem.transactionDate,
            transactionType: this.requestDeleteItem.transactionType,
            referenceNumber: this.requestDeleteItem.referenceNumber,
            fromDate: this.datepipe.transform(this.requestDeleteItem.requestDate[0], 'yyyy-MM-dd'),
            toDate: this.datepipe.transform(this.requestDeleteItem.requestDate[1], 'yyyy-MM-dd'),
            spendMode: this.requestDeleteItem.spendMode,
            location: this.requestDeleteItem.location,
            purpose: this.requestDeleteItem.purpose,
            transportation: this.requestDeleteItem.transportationTravels,
            transportationCosts: this.requestDeleteItem.transportationCosts,
            accommodationCosts: this.requestDeleteItem.accommodationCosts,
            subsistenceCosts: this.requestDeleteItem.subsistenceCosts,
            otherCosts: this.requestDeleteItem.otherCosts,
            description: this.requestDeleteItem.description,
            cancelRemarks: this.reason,
            flag: 'Cancel'
          };
      }

      if (transactionType == "Entertainment" || transactionType == "Purchase") {
         params = {
          requestId: this.requestDeleteItem.requestId,
          employeeId: this.requestDeleteItem.employeeId,
          transactionDate: this.requestDeleteItem.transactionDate,
          requestDate: this.requestDeleteItem.requestDate,
          transactionType: this.requestDeleteItem.transactionType,
          referenceNumber: this.requestDeleteItem.referenceNumber,
          purpose: this.requestDeleteItem.purpose,
          spendMode: this.requestDeleteItem.spendMode,
          description: this.requestDeleteItem.entertainment,
          cancelRemarks: this.reason,
          flag: 'Cancel'
        };
      }

      if (transactionType == "Training") {
          params = {
          requestId: this.requestDeleteItem.requestId,
          employeeId: this.requestDeleteItem.employeeId,
          transactionDate: this.requestDeleteItem.transactionDate,
          transactionType: this.requestDeleteItem.transactionType,
          referenceNumber: this.requestDeleteItem.referenceNumber,
          requestDate: this.requestDeleteItem.requestDate,

          institutionName: this.requestDeleteItem.institution,
          course: this.requestDeleteItem.course,
          description: this.requestDeleteItem.description,
          admissionDate: this.requestDeleteItem.admissionDate,
          duration: this.requestDeleteItem.duration,
          trainingCosts: this.requestDeleteItem.cost,
          purpose: this.requestDeleteItem.purpose,      
          cancelRemarks: this.reason,    
          flag: 'Cancel'
        };
      }

      if (transactionType == "Expat") {
        params = {
          requestId: this.requestDeleteItem.requestId,
          employeeId: this.requestDeleteItem.employeeId,
          transactionDate: this.requestDeleteItem.transactionDate,
          transactionType: this.requestDeleteItem.transactionType,
          referenceNumber: this.requestDeleteItem.referenceNumber,
          requestDate: this.requestDeleteItem.requestDate,
          spendMode: this.requestDeleteItem.spendMode,
          description: this.requestDeleteItem.description,
          cancelRemarks: this.reason,
          flag: 'Cancel'
        };
      }

      // let params = {
      //   employeeId: this.requestDeleteItem.employeeId,
      //   requestId: this.requestDeleteItem.requestId,
      //   transactionType : this.requestDeleteItem.transactionType,
      //   flag: 'Cancel'
      // };

      console.log("confirmDelete params >>>", params);  


      this.employeeRequestSerive.delete(params).subscribe(response => {
        var result = response as any;
        if (result?.status) {
          this.sendEmail(params)
          this.requestDeleteItem = null;
          this.pageNumber = 1
          this.getRequestData();
          this.modalService.service.dismissAll();
          this.utilityService.success(result.msg, "Server Response")
        }
        else {
          this.utilityService.fail(result.msg, "Server Response")
        }
      }, (error) => {
        console.log("error >>>", error);
        this.utilityService.fail("Something went wrong", "Server Response");
      })
    }
  }


  sendEmail(params: any) {
    this.employeeRequestSerive.sendEmail(params).subscribe(response => {
      // console.log("response >>>", response);
    }, (error) => {
      console.log("error >>>", error);
      this.utilityService.fail("Something went wrong", "Server Response");
    })
  }

  closeModal(reason: any) {
    this.showingModal = false;
    this.requestId = 0;
    // if (reason == 'Successfully Saved') {
    //   this.getRequestData();
    // }
  }


}
