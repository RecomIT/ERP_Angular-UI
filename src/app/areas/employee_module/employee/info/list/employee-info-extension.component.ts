import { Component, ElementRef, OnInit, ViewChild, Input } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ApiArea, ApiController } from 'src/app/shared/constants';
import { UserService } from 'src/app/shared/services/user.service';
import { AreasHttpService } from '../../../../areas.http.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CustomModalService } from 'src/app/shared/services/custom-modal.service';
import { ControlPanelWebService } from 'src/app/shared/services/control-panel.service';
import { transition, trigger, useAnimation } from '@angular/animations';
import { bounceIn, fadeIn, fadeInRight, slideInUp } from 'ng-animate';
import { EmployeeInfoService } from '../../employee-info.service';
import { DepartmentService } from '../../../Organizational/department/department.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-employee-module-employee-info',
  templateUrl: './employee-info-extension.component.html',
  animations: [
    trigger('slideInUp', [transition('* => *', useAnimation(slideInUp, { params: { timing: 0.5 } }))]),
    trigger('fadeIn', [transition('void => *', useAnimation(fadeIn, { params: { timing: 0.3 } }))]),
    trigger('fadeInRight', [transition('void => *', useAnimation(fadeInRight, { params: { timing: 0.5 } }))]),
    trigger('bounceIn', [transition('void => *', useAnimation(bounceIn, { params: { timing: 1 } }))]),
  ],
})
export class EmployeeInfoExtensionComponent implements OnInit {

  employeeId = 0;
  @ViewChild('ng-select2') ngSelect2: ElementRef;
  @ViewChild('employeeApprovalModal', { static: true }) employeeApprovalModal: ElementRef;
  pageNumber: number = 1;
  pageSize: number = 15;
  pagePrivilege: any = this.userService.getPrivileges();
  employeeListPageConfig: any = this.userService.pageConfigInit("employeeList", this.pageSize, 1, 0);
  datePickerConfig: Partial<BsDatepickerConfig> = this.utilityService.datePickerConfig();

  newEmployeeForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private areasHttpService: AreasHttpService,
    public toastr: ToastrService,
    private userService: UserService,
    public utilityService: UtilityService,
    public modalService: CustomModalService,
    private controlPanelWebService: ControlPanelWebService,
    private employeeInfoService: EmployeeInfoService,
    private departmentService: DepartmentService,
    private datepipe: DatePipe) { }

  ngOnInit(): void {
    this.datePickerConfig = Object.assign({}, {
      containerClass: "theme-dark-blue",
      showWeekNumbers: false,
      dateInputFormat: "DD-MMM-YYYY",
      isAnimated: true,
      showClearButton: false,
      showTodayButton: false,
      todayPosition: "left"
    })
    this.listPageInit();
  }

  logger(msg: string, ...options: any[]) {
    this.utilityService.consoleLog(msg, options);
  }

  listPageInit() {
    this.entryPage = false;
    this.listPage = true;
    this.detailsPage = false;
    this.searchFormInit();
    this.getEmployees();
    this.loadBranch();
    this.loadDepartment();
  }

  searchForm: FormGroup;
  searchFormInit() {
    this.searchForm = this.fb.group({
      fullName: new FormControl(''),
      employeeCode: new FormControl(''),
      stateStatus: new FormControl(''),
      gender: new FormControl(''),
      branchId: new FormControl(0),
      departmentId: new FormControl(0),
      jobStatus: new FormControl(null),
      dateOfJoining: new FormControl(null),
      sortingCol: new FormControl(''),
      sortType: new FormControl(''),
      pageNumber: new FormControl(this.pageNumber),
      pageSize: new FormControl(this.pageSize)
    })

    this.searchForm.get('fullName').valueChanges.subscribe((item) => {
      this.resetPage()
      this.getEmployees();
    })

    this.searchForm.get('dateOfJoining').valueChanges.subscribe((item) => {
      this.resetPage()
      this.getEmployees();
    })

    this.searchForm.get('departmentId').valueChanges.subscribe((item) => {
      this.resetPage()
      this.getEmployees();
    })

    this.searchForm.get('employeeCode').valueChanges.subscribe((item) => {
      this.resetPage()
      this.getEmployees();
    })

    this.searchForm.get('jobStatus').valueChanges.subscribe((item) => {
      this.resetPage()
      this.getEmployees();
    })

    this.searchForm.get('stateStatus').valueChanges.subscribe((item) => {
      this.resetPage()
      this.getEmployees();
    })

    this.searchForm.get('branchId').valueChanges.subscribe((item) => {
      this.resetPage()
      this.getEmployees();
    })
  }

  resetPage() {
    this.searchForm.get('pageNumber').setValue(1);
  }

  ddlDepartment: any;
  loadDepartment() {
    this.departmentService.loadDepartmentDropdown();
    this.departmentService.ddl$.subscribe(response => {
      this.ddlDepartment = response;
    });
  }

  showEmployeeDetail(id: any) {
    this.entryPage = false;
    this.listPage = false;
    this.detailsPage = true;
    this.employeeId = id;
  }

  User() {
    return this.userService.User();
  }

  select2Options = this.utilityService.select2Config();

  complexObj = { obj1: "foo" };

  entryPage: boolean = false;
  listPage: boolean = true;
  detailsPage: boolean = false;

  fnBackToList(event: any) {
    this.entryPage = false;
    this.listPage = true;
    this.detailsPage = false;
  }


  createEmployee() {
    this.listPage = false;
    this.entryPage = true;
  }

  employeeListPageChanged(event: any) {
    this.pageNumber = event;
    this.searchForm.get('pageNumber').setValue(this.pageNumber);
    this.getEmployees();
  }

  employeeList: any[] = null;
  ddlStateStatus: any[] = this.utilityService.getDataStatus().filter(item => item == 'Pending' || item == 'Approved' || item == 'Cancelled' || item == 'Recheck');

  getEmployees() {
    let params = this.searchForm.value;
    params.dateOfJoining = this.datepipe.transform(params.dateOfJoining, "yyyy-MM-dd");
    this.employeeInfoService.getEmployeeInfos(params).subscribe(response => {
      var res = response as any;
      this.employeeList = res.body;
      var xPaginate = JSON.parse(res.headers.get('X-Pagination'));
      this.employeeListPageConfig = this.userService.pageConfigInit("employeeList", xPaginate.itemsPerPage, xPaginate.currentPage, xPaginate.totalItems);
    }, (error) => {
      this.toastr.error("Something went wrong", "Server Response", { timeOut: 1000 })
    })
  }

  ddlBranch: any[] = [];
  loadBranch() {
    this.ddlBranch = [];
    this.controlPanelWebService.getBranchExtension<any[]>("7").then((data) => {
      this.ddlBranch = data;
    })
  }

  isSortAscending: boolean = true;
  sortingColumn(columnName: string) {
    this.isSortAscending = !this.isSortAscending;
    var sortType = this.isSortAscending ? "asc" : "desc";
    this.searchForm.get('sortingCol').setValue(columnName);
    this.searchForm.get('sortType').setValue(sortType);
    this.resetPage();
    this.getEmployees();
  }
  //#endregion

  //#region approval-modal
  employeeById: any;
  employeeApprovalForm: FormGroup;
  employeeApprovalFormInit() {
    this.employeeApprovalForm = this.fb.group({
      employeeId: new FormControl(0, [Validators.min(1)]),
      stateStatus: new FormControl('Approved', [Validators.required]),
      remarks: new FormControl()
    })
  }

  getEmployeeFromListById(id: any) {
    if (this.employeeList != null && this.employeeList.length > 0) {
      this.employeeById = this.employeeList.find(emp => emp.employeeId == id);
      if (this.employeeById != null && this.employeeById?.employeeId > 0) {
        this.employeeApprovalFormInit();
        this.employeeApprovalForm.get('employeeId').setValue(id)
        this.modalService.open(this.employeeApprovalModal, "lg")
      }
      else {
        this.utilityService.warning("Employee not found", "Site Response");
      }
    }
  }

  submitApproval() {
    if (this.employeeApprovalForm.valid) {
      this.employeeInfoService.approval(this.employeeApprovalForm.value).subscribe(response => {
        if (response.status) {
          this.getEmployees();
          this.toastr.success("Saved Successfull", "Server Response", { timeOut: 800 })
          this.modalService.service.dismissAll();
        }
        else {
          this.toastr.error(response.msg, "Server Response", { timeOut: 800 })
        }
      }, (error) => {
        this.toastr.error("Something went wrong", "Server Response", { timeOut: 800 })
      })
    }
    else {
      this.utilityService.fail("Invalid form submission", "Site Response");
    }
  }

  //#endregion

  showUploadEmployeeInfoModal: boolean = false;
  openUploadEmployeeInfoExcelFileModal() {
    this.showUploadEmployeeInfoModal = true;
    this.employeeId = 0;
  }

  closeUploadEmployeeInfoExcelFileModal(reason: any) {
    this.showUploadEmployeeInfoModal = false;
    if (reason == 'Save Complete') {
      this.getEmployees();
    }
  }

  downloadEmployeeInfo() {
    this.areasHttpService.observable_get((ApiArea.hrms + "/Employee/Uploader" + "/DownloadEmployeesInfo"), {
      responseType: 'blob', params: {}
    }).subscribe((response: any) => {
      console.log("file response >>>", response);
      if (response.size > 0) {
        this.utilityService.downloadFile(response, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', "EmployeeInfo.xlsx")
      }
      else {
        this.utilityService.warning("No Excel File found");
      }
    }, (error) => {
      this.utilityService.fail("Something went wrong", "Server Response")

    })
  }


  showUploadEmployeeInfoExtension: boolean = false;

  openUploadEmployeeInfoModal() {
    this.showUploadEmployeeInfoExtension = true;
  }

  closeUploadEmployeeInfoModal(reason: any) {
    this.showUploadEmployeeInfoExtension = false;
    if (this.utilityService.SuccessfullySaved == reason) {
      this.getEmployees();
    }
  }

  showDownloadEmployeeInfo: boolean = false;

  openDownloadEmployeeInfoModal() {
    this.showDownloadEmployeeInfo = true;
  }

  closeDownloadEmployeeInfoModal(reason: any) {
    this.showDownloadEmployeeInfo = false;   
      this.getEmployees();
  }

}
