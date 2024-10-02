import { transition, trigger, useAnimation } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { bounceIn, fadeIn, fadeInRight, slideInUp } from 'ng-animate';
import { ResignationSerive } from './resignation.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { UserService } from 'src/app/shared/services/user.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CustomModalService } from 'src/app/shared/services/custom-modal.service';
import { DatePipe } from '@angular/common';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { EmployeeInfoService } from '../../employee_module/employee/employee-info.service';

@Component({
  selector: 'app-resignation',
  templateUrl: './resignation.component.html',
  animations: [
    trigger('slideInUp', [transition('* => *', useAnimation(slideInUp, { params: { timing: 0.5 } }))]),
    trigger('fadeIn', [transition('void => *', useAnimation(fadeIn, { params: { timing: 0.3 } }))]),
    trigger('fadeInRight', [transition('void => *', useAnimation(fadeInRight, { params: { timing: 0.5 } }))]),
    trigger('bounceIn', [transition('void => *', useAnimation(bounceIn, { params: { timing: 1 } }))]),
  ],

})
export class ResignationComponent implements OnInit {

  constructor(
    private resignationSerive: ResignationSerive,
    private utilityService: UtilityService,
    private userService: UserService,
    private datepipe: DatePipe,
    private fb: FormBuilder,
    public toastr: ToastrService,
    public modalService: CustomModalService,
    private employeeInfoService: EmployeeInfoService,
  ) { }


  logger(msg: any, options: any) {
    this.utilityService.consoleLog(msg, options);
  }

  User() {
    return this.userService.User();
  }

  datePickerConfig: Partial<BsDatepickerConfig> = this.utilityService.datePickerConfig();
  select2Options = this.utilityService.select2Config();

  ngOnInit(): void {
    this.searchFormInit();
    this.getEmployeeResignation();
    this.loadEmployees();
    this.loadStatus();
  }


  pagePrivilege: any = this.userService.getPrivileges();
  pageNumber: number = 1;
  pageSize: number = 10;
  list_pager: any = this.userService.pageConfigInit("list_pager", this.pageSize, 1, 0);

  list_pageChanged(event: any) {
    this.pageNumber = event;
    this.searchForm.get('pageNumber').setValue(this.pageNumber);
    this.getEmployeeResignation();
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

  
  ddlStatus: any[] = [];
  loadStatus() {
    this.ddlStatus = ['Pending', 'Returned'];
  }

  searchForm: FormGroup;
  searchFormInit() {
    this.searchForm = this.fb.group({
      employeeId: new FormControl(0),
      transactionDate: new FormControl(null),
      status: new FormControl(''),
      sortingCol: new FormControl(''),
      sortType: new FormControl(''),
      pageNumber: new FormControl(this.pageNumber),
      pageSize: new FormControl(this.pageSize)
    })

    this.searchForm.get('employeeId').valueChanges.subscribe((item) => {
      this.pageSize = 1;
      this.getEmployeeResignation();
    });

    this.searchForm.get('transactionDate').valueChanges.subscribe((item) => {
      this.pageSize = 1;
      this.getEmployeeResignation();
    })

    this.searchForm.get('status').valueChanges.subscribe((item) => {
      this.pageSize = 1;
      console.log('Status changed:', item);
      this.getEmployeeResignation();
    });

  }

  list: any[] = [];
  list_loading_label: string = null;
  getEmployeeResignation() {
    let params = {
      fromDate:
        this.searchForm.get('transactionDate').value != null
          && this.searchForm.get('transactionDate').value != undefined ?
          this.datepipe.transform(this.searchForm.get('transactionDate').value[0], "yyyy-MM-dd").toString() : '',
      toDate:
        this.searchForm.get('transactionDate').value != null &&
          this.searchForm.get('transactionDate').value != undefined ?
          this.datepipe.transform(this.searchForm.get('transactionDate').value[1], "yyyy-MM-dd").toString() : '',

      employeeId: this.searchForm.get('employeeId').value != null ? this.searchForm.get('employeeId').value : 0,
      status: this.searchForm.get('status').value,
      sortingCol: this.searchForm.get('sortingCol').value,
      sortType: this.searchForm.get('sortType').value,
      pageNumber: this.searchForm.get('pageNumber').value,
      pageSize: this.searchForm.get('pageSize').value,
    };

    this.list = []
    this.resignationSerive.getEmployeeResignation(params).subscribe(response => {
      if ((response.body as any[]).length > 0) {
        // console.log("getAssetData >>>", response.body);
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

  showingModal: boolean = false;
  employeeId: number = 0;
  assigningId: number = 0;
  showModal(assigningId: any, employeeId: any) {
    this.showingModal = true;
    this.assigningId = assigningId;
    this.employeeId = employeeId;
  }


  closeModal(reason: any) {
    this.showingModal = false;
    this.employeeId = 0;
    this.assigningId = 0;
    this.getEmployeeResignation();
    // if (reason == 'The asset has been successfully submitted') {
    //   this.getEmployeeResignation();
    // }
  }

}
