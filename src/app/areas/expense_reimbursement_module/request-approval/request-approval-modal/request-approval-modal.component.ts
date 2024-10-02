import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { CustomModalService } from 'src/app/shared/services/custom-modal.service';
import { UserService } from 'src/app/shared/services/user.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { RequestApprovalSerive } from '../requestApproval.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { EmployeeInfoService } from 'src/app/areas/employee_module/employee/employee-info.service';
import { EmployeeRequestSerive } from '../../employee-request/employee-request.service';

@Component({
  selector: 'expense-reimbursement-module-request-approval-modal',
  templateUrl: './request-approval-modal.component.html',
  styleUrls: ['./request-approval-modal.component.css'],

})
export class RequestApprovalModalComponent implements OnInit {

  @Input() transactionType: string = '';
  @Input() paymentStatus: string = '';
  @ViewChild('requestApprovalModal', { static: true }) requestApprovalModal!: ElementRef;
  @Output() closeModalEvent = new EventEmitter<string>();
  @Output() openDetailsModalEvent = new EventEmitter<{ transactionType: string, requestId: number, employeeId: number, stateStatus: string }>();

  userRoll : any;
  modalTitle: string = "Expense Request Approval";

  select2Options = this.utilityService.select2Config();
  datePickerConfig: Partial<BsDatepickerConfig> = this.utilityService.datePickerConfig();  
  
  constructor(
    private fb: FormBuilder,
    public modalService: CustomModalService,
    private utilityService: UtilityService,
    private userService: UserService,
    private requestApprovalSerive: RequestApprovalSerive,
    private employeeInfoService: EmployeeInfoService,
    private employeeRequestSerive: EmployeeRequestSerive
  ) { }

  
  ngOnInit(): void {
    this.searchFormInit(); 
    this.openModal();
    this.loadStatus();
    this.loadEmployees();
    this.getRequestData(0);
    
    this.transactionType = this.transactionType.replace('Request', '').trim(); 

    this.userRoll = this.User().RoleName;   
    if (this.userRoll == 'Account') {
      this.modalTitle = "Expense Payment Request";
    } 
    // console.log("Roll", this.userRoll);
  }

  logger(msg: any, options: any) {
    this.utilityService.consoleLog(msg, options);
  }

  User() {
    return this.userService.User();
  }

  ddlStatus: any[] = [];
  loadStatus() {
    this.userRoll = this.User().RoleName;   
    // console.log("Roll >> ", this.userRoll);

    if (this.userRoll == 'Account') {
      this.ddlStatus = ['Pending', 'Payment'];
    } 
    else
    {
      this.ddlStatus = ['Pending', 'Rejected', 'Approved'];
    }
    
  }

  employeeId : number = 0;
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

  statusChange : number = 0;
  searchForm: FormGroup;
  searchFormInit() {
    this.searchForm = this.fb.group({
      transactionDate: new FormControl(null),
      employeeId: new FormControl(0),
      status: new FormControl(''),
      sortingCol: new FormControl(''),
      sortType: new FormControl(''),
      pageNumber: new FormControl(this.pageNumber),
      pageSize: new FormControl(this.pageSize)
    });


    this.searchForm.get('transactionDate').valueChanges.subscribe((item) => {
      this.pageSize = 1;
      this.getRequestData(0);
    });

    this.searchForm.get('status').valueChanges.subscribe((item) => {
      this.pageSize = 1;      
      this.statusChange = 1;  
      this.getRequestData(this.statusChange);
    });

    this.searchForm.get('employeeId').valueChanges.subscribe((item) => {
      this.pageSize = 1;
      this.getRequestData(0);        
    });

  }

  pagePrivilege: any = this.userService.getPrivileges();
  pageNumber: number = 1;
  pageSize: number = 10;
  list_pager: any = this.userService.pageConfigInit("list_pager", this.pageSize, 1, 0);
  list_pageChanged(event: any) {
    this.pageNumber = event;
    this.searchForm.get('pageNumber').setValue(this.pageNumber);
    this.getRequestData(0);
  }


  list: any[] = [];
  list_loading_label: string = null;
  getRequestData(statusChange: number) {
    // console.log("statusChange Data >>>", statusChange);  
    let params = {
      userId: this.User().EmployeeId,
      transactionType: this.transactionType.replace('Request', '').trim(),
      employeeId: this.searchForm.get('employeeId').value || 0,
      status: this.searchForm.get('status').value,
      sortingCol: this.searchForm.get('sortingCol').value,
      sortType: this.searchForm.get('sortType').value,
      pageNumber: this.searchForm.get('pageNumber').value,
      pageSize: this.searchForm.get('pageSize').value,
      statusChange : statusChange
    };

    // console.log("Request Data >>>", params);

    this.list = []
    this.list_loading_label = null
    this.requestApprovalSerive.get(params).subscribe(response => {
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
    });
    
  }

  openModal() {
    this.modalService.open(this.requestApprovalModal, 'xl');
  }

  closeModal(reason: any) {
    this.closeModalEvent.emit(reason);
    this.modalService.service.dismissAll(reason);
  }


  showRequestDetailsModal : boolean= false;
  requestId: number = 0;
  stateStatus : string = '';
  openRequestDetailsModal(transactionType : string ,requestId : number, employeeId : number, stateStatus : string) {
    this.showRequestDetailsModal = true;
    this.transactionType = transactionType;
    this.requestId = requestId;
    this.employeeId = employeeId; 
    this.stateStatus = stateStatus;

    // console.log("stateStatus >>>", stateStatus);

    this.modalService.service.dismissAll('Request Details');
    this.openDetailsModalEvent.emit({ transactionType, requestId, employeeId , stateStatus});
  }

  closeRequestDetailsModal(reason: any) {
    this.showRequestDetailsModal = false;
    this.requestId = 0;
    this.employeeId = 0;
    this.transactionType = "";
    this.stateStatus = "";
    // if (reason == 'Successfully Saved') {
      // this.getRequestCount();
    // }
  }

}
