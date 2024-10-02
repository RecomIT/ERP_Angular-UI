import { DatePipe } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { CustomModalService } from 'src/app/shared/services/custom-modal.service';
import { UserService } from 'src/app/shared/services/user.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { EmployeeRequestSerive } from '../../employee-request/employee-request.service';
import { ToastrService } from 'ngx-toastr';
import { transition, trigger, useAnimation } from '@angular/animations';
import { bounceIn, fadeIn, fadeInRight, slideInUp } from 'ng-animate';
import { ReimbursementSerive } from '../reimbursement.service';

@Component({
  selector: 'app-request-reimbursement',
  templateUrl: './request-reimbursement.component.html',
  styleUrls: ['./request-reimbursement.component.css'],
  animations: [
    trigger('slideInUp', [transition('* => *', useAnimation(slideInUp, { params: { timing: 0.5 } }))]),
    trigger('fadeIn', [transition('void => *', useAnimation(fadeIn, { params: { timing: 0.3 } }))]),
    trigger('fadeInRight', [transition('void => *', useAnimation(fadeInRight, { params: { timing: 0.5 } }))]),
    trigger('bounceIn', [transition('void => *', useAnimation(bounceIn, { params: { timing: 1 } }))]),
  ],
})
export class RequestReimbursementComponent implements OnInit {

  // @ViewChild("employeeRequestDeleteModal", { static: false }) employeeRequestDeleteModal !: ElementRef;


  constructor(
    private utilityService:UtilityService,
    private userService: UserService,
    private datepipe: DatePipe,
    private fb: FormBuilder,
    public toastr: ToastrService,
    private employeeRequestSerive: EmployeeRequestSerive,
    public modalService: CustomModalService,
    public reimbursementSerive: ReimbursementSerive
    ){}

  select2Options = this.utilityService.select2Config();
  datePickerConfig: Partial<BsDatepickerConfig> = this.utilityService.datePickerConfig();

  ngOnInit(): void {    
    this.searchFormInit();
    this.loadStatus();
    this.loadTransactionType();
  }

  logger(msg: any, options: any) {
    this.utilityService.consoleLog(msg, options);
  }

  User() {
    return this.userService.User();
  }

  showingModal : boolean= false;
  requestId: number=0;
  transactionType: string = '';
  spendMode: string = '';
  emailFlag: string = '';

  showModal(id: any,transactionType: string, spendMode: string, emailFlag: string){    
      this.showingModal = true;
      this.requestId = id;
      this.transactionType = transactionType;
      this.emailFlag = emailFlag;
      this.spendMode = spendMode;

      // console.log("showModal >>>", id,transactionType,emailFlag);
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
    this.reimbursementSerive.get(params).subscribe(response => {
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


  closeModal(reason: any) {
    this.showingModal = false;
    this.requestId = 0;
    // if (reason == 'Successfully Saved') {
    //   this.getRequestData();
    // }
  }
  
}
