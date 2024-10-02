import { transition, trigger, useAnimation } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { fadeIn, fadeInUp, fadeOutLeft, slideInUp } from 'ng-animate';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { CustomModalService } from 'src/app/shared/services/custom-modal.service';
import { UserService } from 'src/app/shared/services/user.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { EmployeeInfoService } from 'src/app/areas/employee_module/employee/employee-info.service';
import { AllowanceArrearAdjustmentService } from '../salary-allowance-arrear-adjustment.service';
import { AllowanceNameService } from '../../../allowance/allowance-head/allowance-name.service';

@Component({
  selector: 'app-salary-allowance-arrear-adjustment',
  templateUrl: './salary-allowance-arrear-adjustment.component.html',
  animations: [
    trigger('fadeIn', [transition('void => *', useAnimation(fadeIn, { params: { timing: 0.3 } }))]),
    trigger('slideInUp', [transition('* => *', useAnimation(slideInUp, { params: { timing: 0.5 } }))]),
    trigger('fadeInUp', [transition('void => *', useAnimation(fadeInUp))]),
    trigger('fadeOutLeft', [transition('* => void', useAnimation(fadeOutLeft, { params: { timing: 0.3 } }))]),
  ]
})
export class SalaryAllowanceArrearAdjustmentComponent implements OnInit {
  modalTitle: string = "";
  pageNumber_arrear: number = 1;
  pageSize_arrear: number = 15;
  pageConfig_arrear: any = this.userService.pageConfigInit("arrear_data_list", this.pageSize_arrear, 1, 0);

  pageNumber_adjustment: number = 1;
  pageSize_adjustment: number = 15;
  pageConfig_adjustment: any = this.userService.pageConfigInit("adjustment_data_list", this.pageSize_arrear, 1, 0);

  approvalData: any;
  datePickerConfig: Partial<BsDatepickerConfig> = this.utilityService.datePickerConfig();
  allowanceArrearAdjustmentDTLabel: string = null;
  isNgInit = false;

  constructor(
    private utilityService: UtilityService,
    private userService: UserService, public modalService: CustomModalService,
    private allowanceArrearAdjustmentService: AllowanceArrearAdjustmentService,
    private allowanceNameService: AllowanceNameService,
    private employeeInfoService: EmployeeInfoService) { }

  pagePrivilege: any = this.userService.getPrivileges();
  ngOnInit(): void {
    console.log("arrear & adjustment : pagePrivilege >>>", this.pagePrivilege);
    this.getAllowanceArrear(1);
    this.getAllowanceAdjustment(1);
    this.loadAllowanceNames();
    this.loadEmployees();
  }

  select2Options = this.utilityService.select2Config();

  logger(msg: any, options: any) {
    this.utilityService.consoleLog(msg, options);
  }

  User() {
    return this.userService.User();
  }

  ddlYears: any = this.utilityService.getYears(2);
  ddlMonths: any = this.utilityService.getMonths();

  currentMonth: number = parseInt(this.utilityService.currentMonth);
  currentYear: number = parseInt(this.utilityService.currentYear);

  ddlAllowances: any[] = [];
  loadAllowanceNames() {
    this.allowanceNameService.loadAllowanceNameDropdown();
    this.allowanceNameService.ddl$.subscribe(data => {
      this.ddlAllowances = data;
    }, (error) => {
      console.log("error  while fetching data >>>", error);
    })
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

  searchByAllowance_in_arrear: any = 0
  searchByEmployee_in_arrear: any = 0
  searchByStatus_in_arrear: any = ''
  searchByFlag_in_arrear: any = ''
  salaryMonth_in_arrear: any = 0;
  salaryYear_in_arrear: any = parseInt(this.utilityService.currentYear);


  allowancesPageChanged_in_arrear(event: any) {
    this.pageNumber_arrear = event;
    this.getAllowanceArrear(this.pageNumber_arrear);
  }

  listOfAllowanceArrear: any[] = null;
  getAllowanceArrear(pageNumber: any) {
    this.listOfAllowanceArrear = null;
    let params = {
      employeeId: this.utilityService.IntTryParse(this.searchByEmployee_in_arrear),
      allowanceNameId: this.utilityService.IntTryParse(this.searchByAllowance_in_arrear),
      pageSize: this.pageSize_arrear,
      pageNumber: pageNumber,
      salaryMonth: this.salaryMonth_in_arrear,
      salaryYear: this.salaryYear_in_arrear,
      stateStatus: this.searchByStatus_in_arrear, flag: "Arrear"
    };

    this.allowanceArrearAdjustmentService.get(params).subscribe(response => {
      var res = response as any;
      this.listOfAllowanceArrear = res.body;
      let xPaginate = JSON.parse(response.headers.get('X-Pagination'));
      this.pageConfig_arrear = this.userService.pageConfigInit("arrear_data_list", xPaginate.itemsPerPage, xPaginate.currentPage, xPaginate.totalItems);
    }, error => {
      console.log(error)
    })
  }


  allowancesPageChanged_in_adjustment(event: any) {
    this.pageNumber_adjustment = event;
    this.getAllowanceAdjustment(this.pageNumber_adjustment);
  }

  searchByAllowance_in_adjustment: any = 0
  searchByEmployee_in_adjustment: any = 0
  searchByStatus_in_adjustment: any = ''
  searchByFlag_in_adjustment: any = ''
  salaryMonth_in_adjustment: any = 0;
  salaryYear_in_adjustment: any = parseInt(this.utilityService.currentYear);

  listOfAllowanceAdjustment: any[] = null;
  getAllowanceAdjustment(pageNumber: any) {
    this.listOfAllowanceAdjustment = null;
    let params = {
      employeeId: this.utilityService.IntTryParse(this.searchByEmployee_in_adjustment),
      allowanceNameId: this.utilityService.IntTryParse(this.searchByAllowance_in_adjustment),
      pageSize: this.pageSize_adjustment,
      pageNumber: pageNumber,
      salaryMonth: this.salaryMonth_in_adjustment,
      salaryYear: this.salaryYear_in_adjustment,
      stateStatus: this.searchByStatus_in_adjustment, flag: "Adjustment"
    };

    this.allowanceArrearAdjustmentService.get(params).subscribe(response => {
      var res = response as any;
      this.listOfAllowanceAdjustment = res.body;
      let xPaginate = JSON.parse(response.headers.get('X-Pagination'));
      this.pageConfig_arrear = this.userService.pageConfigInit("adjustment_data_list", xPaginate.itemsPerPage, xPaginate.currentPage, xPaginate.totalItems);
    }, error => {
      console.log(error)
    })
  }


  showInsertModal: boolean = false;
  insert_flag: string = "";
  openInsertModal(flag: string) {
    this.showInsertModal = true;
    this.insert_flag = flag;
  }

  closeInsertModal(reason: any) {
    this.showInsertModal = false;
    if (reason == 'Save Complete') {
      if (this.insert_flag == "Arrear") {
        this.getAllowanceArrear(1);
      }
      else {
        this.getAllowanceAdjustment(1);
      }
      this.insert_flag = "";
    }
  }

  id: any = 0;
  showUploadModal: boolean = false;
  openUploadExcelFileModal() {
    this.showUploadModal = true;
    this.modalTitle = "Upload Excel File";
  }

  closeUploadExcelFileModal(reason: any) {
    this.id = 0;
    this.showUploadModal = false;
    if (reason == 'Save Complete') {
      this.getAllowanceArrear(1);
      this.getAllowanceAdjustment(1);
    }
  }

  showUpdateModal: boolean = false;
  openUpdateModal(id: any) {
    this.showUpdateModal = true;
    this.id = id;
    this.modalTitle = "Update Modal";
  }

  closeUpdateModal(reason: any) {
    this.id = 0;
    this.showUpdateModal = false;
    if (reason == 'Save Complete') {
      this.getAllowanceArrear(1);
      this.getAllowanceAdjustment(1);
    }
  }

  showDeleteModal: boolean = false;
  salaryMonth: any = 0;
  salaryYear: any = 0;
  openDeleteModal(id: any, month: number, year: number) {
    this.showDeleteModal = true;
    this.id = id;
    this.salaryMonth = month;
    this.salaryYear = year;
    this.modalTitle = "Delete Modal";
  }

  closeDeleteModal(reason: any) {
    this.id = 0;
    this.salaryMonth = 0;
    this.salaryYear = 0;
    this.showDeleteModal = false;
    if (reason == 'Save Complete') {
      this.getAllowanceArrear(1);
      this.getAllowanceAdjustment(1);
    }
  }

  showBulkApprovalModal: boolean = false;
  openBulkApprovalModal() {
    this.showBulkApprovalModal = true;
  }

  closeBulkApprovalModal(reason: any) {
    this.showBulkApprovalModal = false;
    if (reason == "Save Complete") {
      this.getAllowanceArrear(1);
      this.getAllowanceAdjustment(1);
    }
  }

}
