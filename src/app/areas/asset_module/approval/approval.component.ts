import { transition, trigger, useAnimation } from '@angular/animations';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { bounceIn, fadeIn, fadeInRight, slideInUp } from 'ng-animate';
import { CreateSerive } from '../create/create.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { UserService } from 'src/app/shared/services/user.service';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CustomModalService } from 'src/app/shared/services/custom-modal.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { AssigningSerive } from '../assigning/assigning.service';
import { EmployeeInfoService } from '../../employee_module/employee/employee-info.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-approval',
  templateUrl: './approval.component.html',
  animations: [
    trigger('slideInUp', [transition('* => *', useAnimation(slideInUp, { params: { timing: 0.5 } }))]),
    trigger('fadeIn', [transition('void => *', useAnimation(fadeIn, { params: { timing: 0.3 } }))]),
    trigger('fadeInRight', [transition('void => *', useAnimation(fadeInRight, { params: { timing: 0.5 } }))]),
    trigger('bounceIn', [transition('void => *', useAnimation(bounceIn, { params: { timing: 1 } }))]),
  ],
})


export class ApprovalComponent implements OnInit {


  constructor(
    private createSerive: CreateSerive,
    private utilityService: UtilityService,
    private userService: UserService,
    private datepipe: DatePipe,
    private fb: FormBuilder,
    public toastr: ToastrService,
    public modalService: CustomModalService,
    private assigningSerive: AssigningSerive,
    private employeeInfoService: EmployeeInfoService,
    private route: ActivatedRoute
  ) { }

  datePickerConfig: Partial<BsDatepickerConfig> = this.utilityService.datePickerConfig();

  data: string;
  ngOnInit(): void {
    this.assetCreateSearchFormInit();
    this.assetAssigningSearchFormInit();

    this.loadStatus();
    this.loadEmployees();

    this.getAssetData();
    this.getAssignedData();

    this.route.queryParams.subscribe(params => {
      this.data = params['data'];
      console.log('Received data:', this.data);
      if (this.data === 'Assigning') {
        this.activeTab = 'assetAssigningApproval';
      } else {
        this.activeTab = 'assetCreateApproval';
      }
    });


  }

  

  logger(msg: any, options: any) {
    this.utilityService.consoleLog(msg, options);
  }

  User() {
    return this.userService.User();
  }

  select2Options = {
    width: "100%",
    containerCssClass: "form-control form-control-sm text-x-small",
    theme: "bootstrap4",
  }

  //#region Lsit Pager 
  pagePrivilege: any = this.userService.getPrivileges();
  pageNumber: number = 1;
  pageSize: number = 10;
  list_pager: any = this.userService.pageConfigInit("list_pager", this.pageSize, 1, 0);

  assetCreateList: any[] = [];
  assetAssigningList: any[] = [];
  list_loading_label: string = null;

  list_pageChanged(event: any) {
    this.pageNumber = event;
    this.assetCreateSearchForm.get('pageNumber').setValue(this.pageNumber);
    this.getAssetData();
    this.assetAssigningSearchForm.get('pageNumber').setValue(this.pageNumber);
    this.getAssignedData();
  }
  //#endregion

  ddlStatus: any[] = [];
  loadStatus() {
    this.ddlStatus = ['Pending', 'Approved'];
  }

  ddlEmployees: any[] = [];
  loadEmployees() {
    this.employeeInfoService.loadDropdownData({});
    this.employeeInfoService.ddl_employee_data$.subscribe(data => {
      this.employeeInfoService.loadDropdown(data);
      this.ddlEmployees = this.employeeInfoService.ddl$;
    }, error => {
      console.error('Error while fetching data:', error);
    });
  }


  showingModal: boolean = false;
  assetId: number = 0;
  activeTab : string
  assigningId: number = 0;
  employeeId : number = 0;
  type: string;
  showModal(id: any,assigningId : any,employeeId : any, activeTab, type : any) {
    this.showingModal = true;
    this.assetId = id;
    this.activeTab = activeTab;
    this.assigningId = assigningId;
    this.employeeId = employeeId;
    this.type = type;
    // console.log("Active Tab >>>", this.activeTab);
    // console.log("Asset ID >>>", this.assetId);
    // console.log("Assigning ID >>>", this.assigningId);
  }

  closeModal(reason: any) {
    this.showingModal = false;
    this.assetId = 0;
    this.activeTab = '';
    this.assigningId = 0;

    console.log("Active Tab >>>", reason);

    if (reason == 'Successfully Saved') {
      this.getAssetData();
      this.getAssignedData();
    };

    if (reason === 'assetAssigningApproval') {
      this.activeTab = 'assetAssigningApproval';
    } else {
      this.activeTab = 'assetCreateApproval';
    };

  }


  //#region Asset Create 
  assetCreateSearchForm: FormGroup;
  assetCreateSearchFormInit() {
    this.assetCreateSearchForm = this.fb.group({
      transactionDate: new FormControl(null),
      status: new FormControl(''),
      sortingCol: new FormControl(''),
      sortType: new FormControl(''),
      pageNumber: new FormControl(this.pageNumber),
      pageSize: new FormControl(this.pageSize)
    })



    this.assetCreateSearchForm.get('transactionDate').valueChanges.subscribe((item) => {
      this.pageSize = 1;
      this.getAssetData();
    })
    this.assetCreateSearchForm.get('status').valueChanges.subscribe((item) => {
      this.pageSize = 1;
      // console.log('Status changed:', item);
      this.getAssetData();
    })
  }

  getAssetData() {
    let params = {
      fromDate:
        this.assetCreateSearchForm.get('transactionDate').value != null
          && this.assetCreateSearchForm.get('transactionDate').value != undefined ?
          this.datepipe.transform(this.assetCreateSearchForm.get('transactionDate').value[0], "yyyy-MM-dd").toString() : '',
      toDate:
        this.assetCreateSearchForm.get('transactionDate').value != null &&
          this.assetCreateSearchForm.get('transactionDate').value != undefined ?
          this.datepipe.transform(this.assetCreateSearchForm.get('transactionDate').value[1], "yyyy-MM-dd").toString() : '',
      status: this.assetCreateSearchForm.get('status').value,
      sortingCol: this.assetCreateSearchForm.get('sortingCol').value,
      sortType: this.assetCreateSearchForm.get('sortType').value,
      pageNumber: this.assetCreateSearchForm.get('pageNumber').value,
      pageSize: this.assetCreateSearchForm.get('pageSize').value,
    };

    this.assetCreateList = []
    this.createSerive.get(params).subscribe(response => {
      if ((response.body as any[]).length > 0) {
        //console.log("getAssetData >>>", response.body);
        this.assetCreateList = response.body;
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
  //#endregion

  //#region Asset Assigning 
  assetAssigningSearchForm: FormGroup;
  assetAssigningSearchFormInit() {
    this.assetAssigningSearchForm = this.fb.group({
      employeeId: new FormControl(0),
      transactionDate: new FormControl(null),
      status: new FormControl(''),
      sortingCol: new FormControl(''),
      sortType: new FormControl(''),
      pageNumber: new FormControl(this.pageNumber),
      pageSize: new FormControl(this.pageSize)
    });



    this.assetAssigningSearchForm.get('employeeId').valueChanges.subscribe((item) => {
      this.pageSize = 1;
      this.getAssignedData();
    });

    this.assetAssigningSearchForm.get('transactionDate').valueChanges.subscribe((item) => {
      this.pageSize = 1;
      this.getAssignedData();
    });

    this.assetAssigningSearchForm.get('status').valueChanges.subscribe((item) => {
      this.pageSize = 1;
      //console.log('Status changed:', item);
      this.getAssignedData();
    });

  }

  getAssignedData() {
    let params = {
      fromDate:
        this.assetAssigningSearchForm.get('transactionDate').value != null
          && this.assetAssigningSearchForm.get('transactionDate').value != undefined ?
          this.datepipe.transform(this.assetAssigningSearchForm.get('transactionDate').value[0], "yyyy-MM-dd").toString() : '',
      toDate:
        this.assetAssigningSearchForm.get('transactionDate').value != null &&
          this.assetAssigningSearchForm.get('transactionDate').value != undefined ?
          this.datepipe.transform(this.assetAssigningSearchForm.get('transactionDate').value[1], "yyyy-MM-dd").toString() : '',

      status: this.assetAssigningSearchForm.get('status').value,
      employeeId: this.assetAssigningSearchForm.get('employeeId').value != null ? this.assetAssigningSearchForm.get('employeeId').value : 0,

      sortingCol: this.assetAssigningSearchForm.get('sortingCol').value,
      sortType: this.assetAssigningSearchForm.get('sortType').value,
      pageNumber: this.assetAssigningSearchForm.get('pageNumber').value,
      pageSize: this.assetAssigningSearchForm.get('pageSize').value,
    };

    this.assetAssigningList = []
    this.assigningSerive.get(params).subscribe(response => {
      if ((response.body as any[]).length > 0) {
        // console.log("Assigned Data >>>", response.body);
        this.assetAssigningList = response.body;
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
  //#endregion










}
