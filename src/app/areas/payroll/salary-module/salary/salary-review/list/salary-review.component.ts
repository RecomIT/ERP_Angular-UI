import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { CustomModalService } from 'src/app/shared/services/custom-modal.service';
import { HrWebService } from 'src/app/shared/services/hr-web.service';
import { PayrollWebService } from 'src/app/shared/services/payroll-web.service';
import { UserService } from 'src/app/shared/services/user.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { salaryReviewDetail, salaryReviewInfo } from 'src/models/payroll/allowance-model';
import { AreasHttpService } from '../../../../../areas.http.service';
import { trigger, transition, useAnimation } from '@angular/animations';
import { fadeIn, slideInUp } from 'ng-animate';
import { EmployeeInfoService } from 'src/app/areas/employee_module/employee/employee-info.service';
import { SalaryReviewService } from '../salary-review.service';


@Component({
  selector: 'app-salary-review',
  templateUrl: './salary-review.component.html',
  animations: [
    trigger('slideInUp', [transition('* => *', useAnimation(slideInUp, { params: { timing: 0.5 } }))]),
    trigger('fadeIn', [transition('* => *', useAnimation(fadeIn, { params: { timing: 0.5 } }))]),
  ]
})
export class SalaryReviewComponent implements OnInit {

  @ViewChild('salaryReviewApproavalModal', { static: true }) salaryReviewApproavalModal!: ElementRef;
  modalTitle: string = "";
  datePickerConfig: Partial<BsDatepickerConfig> = this.utilityService.datePickerConfig();
  employeeInfo: any = null;
  pageNumber: number = 1;
  pageSize: number = 15;
  salaryReviewListPageConfig: any = this.userService.pageConfigInit("salaryReviewData", this.pageSize, this.pageNumber, 0);

  constructor(
    private payrollWebService: PayrollWebService,
    private utilityService: UtilityService,
    private userService: UserService,
    public modalService: CustomModalService,
    private employeeInfoService: EmployeeInfoService,
    private salaryReviewService: SalaryReviewService) {
  }

  ddlEmployees: any[] = [];
  isEntryScreen: boolean = true;
  pagePrivilege: any = this.userService.getPrivileges();

  ngOnInit(): void {
    this.viewShowAndHide();
    console.log("pagePrivilege >>>", this.pagePrivilege);
    var nextDate =
      console.log("nextDate >>>", nextDate);
  }


  select2Options = this.utilityService.select2Config();

  logger(msg: any, options: any) {
    this.utilityService.consoleLog(msg, options);
  }

  User() {
    return this.userService.User();
  }
  loadEmployees() {
    this.ddlEmployees = [];
    this.employeeInfoService.loadDropdownData({});
    this.employeeInfoService.ddl_employee_data$.subscribe(data => {
      this.employeeInfoService.loadDropdown(data);
      this.ddlEmployees = this.employeeInfoService.ddl$;
    }, error => {
      console.error('Error while fetching data:', error);
    });
  }

  ddlYears: any[] = this.utilityService.getYears(2);

  //#region list

  //#endregion list


  viewShowAndHide() {
    this.clearSalaryReviewInfoObj();
    this.isEntryScreen = !this.isEntryScreen;
    this.employeeReviewData = [];
    this.ddlEmployees = [];
    this.employeeSalaryBreakdownData = [];
    this.salaryReviewDetails = [];

    if (this.isEntryScreen) {
      this.newSalaryAmount = 0;
      this.loadEmployees();
    }
    else {
      this.getSalaryReviews({ employeeId: this.utilityService.IntTryParse(this.searchByEmployee), slaryConfigCategory: this.searchByConfigCategory, stateStatus: this.searchByStatus, pageNumber: this.pageNumber, pageSize: this.pageSize });
      this.loadEmployees();
    }
  }

  // Salary Review List
  salaryReviewList: salaryReviewInfo[] = [];

  getSalaryReviews(params: any) {
    this.salaryReviewService.get(params).subscribe(response => {
      this.salaryReviewList = response.body;
      var xPaginate = JSON.parse(response.headers.get('X-Pagination'));
      this.salaryReviewListPageConfig = this.userService.pageConfigInit("salaryReviewData", xPaginate.itemsPerPage, xPaginate.currentPage, xPaginate.totalItems);
    }, (error) => { console.log("error >>>", error); })
  }

  searchByConfigCategory: string = "";
  searchByStatus: string = "";
  searchByEmployee: string = "";

  searchEmployeeChanged(event: any) {
    this.getSalaryReviews({
      employeeId: this.utilityService.IntTryParse(event), slaryConfigCategory: this.searchByConfigCategory, stateStatus: this.searchByStatus, pageNumber: 1, pageSize: this.pageSize
    })
  }

  searchSalaryReviewInfos() {
    this.getSalaryReviews({
      employeeId: this.utilityService.IntTryParse(this.searchByEmployee), slaryConfigCategory: this.searchByConfigCategory, stateStatus: this.searchByStatus, pageNumber: this.pageNumber, pageSize: this.pageSize
    })
  }

  salaryReviewPageChanged(event: any) {
    this.pageNumber = event;
    this.getSalaryReviews({ employeeId: this.utilityService.IntTryParse(this.searchByEmployee), slaryConfigCategory: this.searchByConfigCategory, stateStatus: this.searchByStatus, pageNumber: this.pageNumber, pageSize: this.pageSize });
  }
  // Salary Review Entry & Update

  employeeReviewData: any[] = [];
  employeeSalaryBreakdownData: any[] = [];
  salaryReviewDetails: salaryReviewDetail[] = [];
  baseOfSalary: string = '';
  newSalaryAmount: number = 0;

  salaryReviewInfo = {
    salaryReviewInfoId: 0,
    employeeId: 0,
    designationId: 0,
    internalDesignationId: 0,
    departmentId: 0,
    sectionId: 0,
    branchId: 0,
    currentSalaryAmount: 0,
    previousSalaryAmount: 0,
    salaryConfigCategory: '',
    incrementReason: '',
    description: '',
    stateStatus: '',
    isActive: false,
    remarks: '',
    activationDate: undefined,
    deactivationDate: undefined,
    isArrearCalculated: false,
    arrearCalculatedDate: undefined,
    employeeCode: '',
    fullName: '',
    designationName: '',
    internalDesignationName: '',
    departmentName: '',
    sectionName: '',
    branchName: '',
    salaryReviewDetails: [],
    userId: '',
    createdBy: '',
    createdDate: undefined,
    updatedBy: '',
    updatedDate: undefined,
    approvedBy: '',
    approvedDate: undefined,
    checkedBy: '',
    checkedDate: undefined,
    divisionId: 0,
    divisionName: '',
    companyId: 0,
    companyName: '',
    organizationId: 0,
    organizationName: '',
    salaryAllowanceConfigId: 0,
    salaryBaseAmount: 0,
    isAutoCalculate: true,
    baseType: "",
    effectiveFrom: null,
    effectiveTo: null,
    activationMonth: 0,
    activationYear: 0,
    arrearMonth: 0,
    arrearYear: 0,
    previousReviewId: 0,
    yearlyCTC: 0,
    monthlyCTC: 0,
    monthlyPF: 0,
    monthlyFB: 0
  }

  clearSalaryReviewInfoObj() {
    this.salaryReviewInfo = {
      salaryReviewInfoId: 0,
      employeeId: 0,
      designationId: 0,
      internalDesignationId: 0,
      departmentId: 0,
      sectionId: 0,
      branchId: 0,
      currentSalaryAmount: 0,
      previousSalaryAmount: 0,
      salaryConfigCategory: '',
      incrementReason: '',
      description: '',
      stateStatus: '',
      isActive: false,
      remarks: '',
      activationDate: undefined,
      deactivationDate: undefined,
      isArrearCalculated: false,
      arrearCalculatedDate: undefined,
      employeeCode: '',
      fullName: '',
      designationName: '',
      internalDesignationName: '',
      departmentName: '',
      sectionName: '',
      branchName: '',
      salaryReviewDetails: [],
      userId: '',
      createdBy: '',
      createdDate: undefined,
      updatedBy: '',
      updatedDate: undefined,
      approvedBy: '',
      approvedDate: undefined,
      checkedBy: '',
      checkedDate: undefined,
      divisionId: 0,
      divisionName: '',
      companyId: 0,
      companyName: '',
      organizationId: 0,
      organizationName: '',
      salaryAllowanceConfigId: 0,
      salaryBaseAmount: 0,
      isAutoCalculate: true,
      baseType: "",
      effectiveFrom: null,
      effectiveTo: null,
      activationMonth: 0,
      activationYear: 0,
      arrearMonth: 0,
      arrearYear: 0,
      previousReviewId: 0,
      yearlyCTC: 0,
      monthlyCTC: 0,
      monthlyPF: 0,
      monthlyFB: 0
    }
  }

  autocalculate_change() {
    this.salaryReviewInfo.isAutoCalculate = !this.salaryReviewInfo.isAutoCalculate;
    this.logger("this.salaryReviewInfo.isAutoCalculate >>>", this.salaryReviewInfo.isAutoCalculate);
  }

  ddlMonths: any[] = this.utilityService.getMonths();
  getEmployeeInfo(id: any) {
    this.clearSalaryReviewInfoObj();
    this.employeeReviewData = [];
    this.salaryReviewDetails = [];
    this.employeeSalaryBreakdownData = [];
    this.employeeInfo = null;

    if (id != null && id != '' && id > 0) {
      this.employeeInfoService.getOfficeInfo({ employeeId: id }).subscribe(response => {
        //console.log("getServiceData >>>", response);
        this.employeeInfo = response.body;
        this.salaryReviewInfo.previousReviewId = response.body.previousReviewId;
      }, (error) => {
        //console.log("error >>>", error);
      })

      this.payrollWebService.getSalaryReviewInfos<any[]>(0, id).then((data) => {
        this.employeeReviewData = data;
        if (this.employeeReviewData.length == 0) {
          this.salaryReviewInfo.incrementReason = 'Joining';
          this.salaryReviewInfo.previousReviewId = 0;
        }
        this.logger("this.employeeReviewData>>>", this.employeeReviewData)
      })

      this.salaryReviewService.getLastSalaryReviewInfoByEmployee({ employeeId: id }).subscribe(response => {
        //console.log("getLastSalaryReviewInfoByEmployee >>>", response);
        var data = response.body as any
        if ((data?.employeeLastApprovedSalaryReviewDetails).length > 0) {
          this.employeeSalaryBreakdownData = response.body.employeeLastApprovedSalaryReviewDetails;
        }


        this.salaryReviewInfo.previousReviewId = data?.salaryReviewInfoId
        this.salaryReviewInfo.previousSalaryAmount = data?.currentSalaryAmount;

      }, (error) => {
        //console.log("error >>>", error);
      })

      this.salaryReviewService.getSalaryAllowanceForReview({ employeeId: id }).subscribe(response => {
        //console.log("response >>>", response);
        this.salaryReviewDetails = response.body;
        this.findSalaryBase();
      }, (error) => {
        //console.log("error >>>", error);
        this.utilityService.fail("Something went wrong");
      })
    }
  }

  yearlyCTC_changed() {
    if (this.utilityService.FloatTryParse(this.salaryReviewInfo.yearlyCTC) > 0) {
      let yearlyCTC = this.utilityService.FloatTryParse(this.salaryReviewInfo.yearlyCTC);
      this.salaryReviewInfo.monthlyCTC = Math.round((yearlyCTC / 12))
    }
  }
  totalSalaryAmount: number = 0;

  newSalaryCalculation(value: any) {
    let newAmount = this.utilityService.FloatTryParse(value);
    if (this.salaryReviewInfo.isAutoCalculate) {
      if (this.baseOfSalary == 'Basic Base') {
        this.salaryReviewDetails.forEach((item) => {
          if (item.allowanceName == 'Basic Salary') {
            item.currentAmount = newAmount;
            this.newSalaryAmount = newAmount;
          }
          else if (item.allowanceBase == 'Basic') {
            //item.currentAmount = parseFloat((newAmount * (item.allowancePercentage / 100)).toFixed(2));
            item.currentAmount = Math.round((newAmount * (item.allowancePercentage / 100)));
          }
        })
      }
      else if (this.baseOfSalary == 'Gross Base') {
        this.newSalaryAmount = newAmount;
        if (this.salaryReviewDetails.length > 0) {
          newAmount = newAmount - this.salaryReviewDetails.filter(item => item.allowanceBase == 'Flat').map(s => s.currentAmount).reduce((a, b) => a + b, 0);
          this.salaryReviewDetails.forEach((item) => {
            if (item.allowanceBase == 'Gross') {
              item.currentAmount = Math.round(newAmount * (item.allowancePercentage / 100));
            }
          })
        }
      }
      this.salaryReviewInfo.currentSalaryAmount = Math.round(this.salaryReviewDetails.map(s => s.currentAmount).reduce((a, b) => a + b, 0));
    }
    this.newSalaryAmount = newAmount;
  }

  touched(element: any) {
    element.control.touched = true;
  }

  btnSalaryReviewSubmit: boolean = false;
  errrorObject: any;
  saveSalaryReview(form: NgForm) {
    if (form.valid) {
      this.btnSalaryReviewSubmit = true;
      this.salaryReviewInfo.salaryReviewDetails = this.salaryReviewDetails;
      if (this.salaryReviewInfo.salaryReviewInfoId == 0) {
        this.salaryReviewInfo.companyId = this.User().ComId;
        this.salaryReviewInfo.organizationId = this.User().OrgId;
        this.salaryReviewInfo.branchId = this.User().BranchId;
        this.salaryReviewInfo.createdBy = this.User().UserId;
        this.salaryReviewInfo.salaryConfigCategory = this.salaryReviewDetails[0].salaryConfigCategory;
        this.salaryReviewInfo.salaryAllowanceConfigId = this.salaryReviewDetails[0].salaryConfigCategoryInfoId;
        this.salaryReviewInfo.salaryBaseAmount = this.newSalaryAmount;
        this.salaryReviewInfo.baseType = this.baseOfSalary;
        this.salaryReviewInfo.activationDate = this.utilityService.getFirstDate(this.salaryReviewInfo.activationMonth, this.salaryReviewInfo.activationYear);
      }
      else if (this.salaryReviewInfo.salaryReviewInfoId > 0) {
        this.salaryReviewInfo.updatedBy = this.User().UserId;
      }

      this.salaryReviewService.saveReview(this.salaryReviewInfo).subscribe(response => {
        console.log("response >>>", response);
        this.btnSalaryReviewSubmit = false;
        if (response.status) {
          form.resetForm();
          this.viewShowAndHide();

          this.utilityService.success("Saved Successfull", "Server Response")
        }
        else {
          if (response.msg == "Validation Error") {
            this.utilityService.fail(response.msg, "Server Response")
            this.errrorObject = JSON.parse(response.errorMsg);
            console.log("errorJson >>>", this.errrorObject);
          }
          else {
            this.utilityService.success(response.msg, "Server Response")
          }
        }
      }, (error) => {
        this.utilityService.fail("Something went profile", 'Server Response');
        console.log("error >>>", error);
      })
    }
  }

  amount_changed() {
    this.salaryReviewInfo.currentSalaryAmount = 0;
    this.salaryReviewDetails.forEach(item => {
      this.salaryReviewInfo.currentSalaryAmount += item.currentAmount;
    })
    this.logger("this.salaryReviewDetails >>>", this.salaryReviewDetails);
    if (this.baseOfSalary == 'Basic Base') {
      var newGrossBasic = this.salaryReviewDetails.find(s => s.allowanceFlag.toLowerCase() == "basic");
      this.newSalaryAmount = newGrossBasic.currentAmount;
    }
    else {
      this.newSalaryAmount = this.salaryReviewInfo.currentSalaryAmount;
    }

  }

  activation_changed() {
    this.salaryReviewInfo.arrearMonth = this.salaryReviewInfo.activationMonth;
    this.salaryReviewInfo.arrearYear = this.salaryReviewInfo.activationYear;
  }

  //#region salary-review edit

  findSalaryBase() {
    if (this.salaryReviewDetails.length > 0) {
      const key = 'allowanceBase';
      const arrayUniqueByKey = [...new Map(this.salaryReviewDetails.map(item =>
        [item[key], item.allowanceBase])).values()];
      if (arrayUniqueByKey.indexOf("Gross") > -1 && arrayUniqueByKey.indexOf("Basic") == -1) {
        this.baseOfSalary = 'Gross Base';
      }
      else if (arrayUniqueByKey.indexOf("Basic") > -1 && arrayUniqueByKey.indexOf("Gross") == -1) {
        this.baseOfSalary = 'Basic Base';
      }
      else {
        this.baseOfSalary = 'Flat';
        this.salaryReviewInfo.isAutoCalculate = false;
      }
    }
    this.logger("this.baseOfSalary >>>", this.baseOfSalary);
  }

  getSalaryReviewForEdit(id: any, employeeId: any) {
    this.viewShowAndHide();
    this.employeeInfoService.getOfficeInfo({ employeeId: employeeId }).subscribe(response => {
      console.log("getServiceData >>>", response);
      this.employeeInfo = response.body;
      this.salaryReviewInfo.previousReviewId = response.body.previousReviewId;
    }, (error) => {
      console.log("error >>>", error);
    })

    this.salaryReviewService.getLastSalaryReviewInfoByEmployee({ employeeId: employeeId }).subscribe(response => {
      console.log("getLastSalaryReviewInfoByEmployee >>>", response);
      var data = response.body as any
      if (data != null) {
        if ((data?.employeeLastApprovedSalaryReviewDetails).length > 0) {
          this.employeeSalaryBreakdownData = response.body.employeeLastApprovedSalaryReviewDetails;
        }
        this.salaryReviewInfo.previousReviewId = data?.SalaryReviewInfoId
        this.salaryReviewInfo.previousSalaryAmount = data?.currentSalaryAmount;
      }
    }, (error) => {
      console.log("error >>>", error);
    })

    this.salaryReviewService.getSalaryReviewInfoAndDetails({ salaryReviewInfoId: id, employeeId: employeeId }).subscribe(response => {
      this.logger("SalaryReviewInfoAndDetails >>>", response)
      this.salaryReviewInfo = response.body;
      this.salaryReviewInfo.effectiveFrom = new Date(this.salaryReviewInfo.effectiveFrom);
      this.salaryReviewInfo.activationDate = new Date(this.salaryReviewInfo.activationDate);

      this.salaryReviewDetails = this.salaryReviewInfo.salaryReviewDetails;
      this.logger("this.salaryReviewInfo >>>", this.salaryReviewInfo);
      this.findSalaryBase();
      this.newSalaryCalculation(this.salaryReviewInfo.salaryBaseAmount.toString());
    }, (error) => {
      console.log("error >>>", error);
    })

  }
  //#endregion

  // #region salary-review approval
  btnSalaryReviewApproval: boolean = false;
  salaryReviewModalFlag: string = "";

  getSalaryReviewInfoAndDetail(id: any, employeeId: any, flag: any) {
    this.clearSalaryReviewInfoObj();
    this.salaryReviewService.getSalaryReviewInfoAndDetails({ salaryReviewInfoId: id, employeeId: employeeId }).subscribe(response => {
      this.salaryReviewInfo = response.body;
      this.salaryReviewInfo.activationDate = new Date(this.salaryReviewInfo.activationDate);
      this.salaryReviewDetails = this.salaryReviewInfo.salaryReviewDetails;
      this.findSalaryBase();
      this.openSalaryReviewApproavalModal(flag);
    }, (error) => {
      console.log("error >>>", error);
      this.utilityService.fail('Something went wrong', 'Server Response');
    })
  }

  openSalaryReviewApproavalModal(flag: string) {
    this.salaryReviewModalFlag = flag;
    this.modalTitle = flag == "View" ? "Salary Review Details" : "Salary Review Approval";
    this.modalService.open(this.salaryReviewApproavalModal, "lg");
  }

  submitSalaryReviewStatus(form: NgForm, remarks: string, stateStatus: string) {
    if (form.valid) {
      this.btnSalaryReviewSubmit = true;

      this.salaryReviewService.approval({
        stateStatus: stateStatus, statusRemarks: remarks,
        salaryReviewInfoId: this.salaryReviewInfo.salaryReviewInfoId, employeeId: this.salaryReviewInfo.employeeId
      }).subscribe(response => {
        this.btnSalaryReviewSubmit = false;
        console.log(response)
        if (response.status) {
          form.resetForm();
          console.log("this.pageNumber in approval >>>", this.pageNumber);
          this.getSalaryReviews({ employeeId: this.utilityService.IntTryParse(this.searchByEmployee), slaryConfigCategory: this.searchByConfigCategory, stateStatus: this.searchByStatus, pageNumber: this.pageNumber, pageSize: this.pageSize });
          this.modalService.service.dismissAll();
          this.utilityService.success("Saved Successfull", "Server Response")
        }
        else {
          if (response.msg == "Validation Error") {
            this.utilityService.fail(response.msg, "Server Response")
          }
          else {
            this.utilityService.fail(response.msg, "Server Response")
          }
        }
      }, (error) => {
        console.log("errro >>>", error);
        this.utilityService.fail("Something went wrong", "Server Response")
      })
    }
    else {
      this.utilityService.fail("Form value(s) is invalid", "Site Response")
    }
  }

  //#endregion salary-review approval

  //#region show flat amount uploader modal component
  showFlatAmountUploader: boolean = false;
  openFlatAmountUploaderModal() {
    this.showFlatAmountUploader = true
  }

  closeFlatAmountUploaderModal(reason: string) {
    this.showFlatAmountUploader = false
  }
  //#endregion show flat amount uploader modal component

  //#region salary-review Upload

  salaryReviewInfoId: any = 0;
  showUploadSalaryReviewModal: boolean = false;
  openUploadSalaryReviewExcelFileModal() {
    this.showUploadSalaryReviewModal = true;
    this.modalTitle = "Upload Salary Review Excel File";
  }

  closeUploadSalaryReviewExcelFileModal(reason: any) {
    this.salaryReviewInfoId = 0;
    this.showUploadSalaryReviewModal = false;
    if (reason == 'Save Complete') {
      this.getSalaryReviews({ companyId: this.User().ComId, organizationId: this.User().OrgId, pageNumber: this.pageNumber, pageSize: this.pageSize });
    }
  }

  //#endregion salary-review Upload

  //#region salary-review Download


  showDownloadSalaryReviewModal: boolean = false;
  openDownloadSalaryReviewModal() {
    this.showDownloadSalaryReviewModal = true;
    this.modalTitle = "Download Salary Review Excel File";
  }

  closeDownloadSalaryReviewModal(reason: any) {
    this.salaryReviewInfoId = 0;
    this.showDownloadSalaryReviewModal = false;
    if (reason == 'Save Complete') {
      this.getSalaryReviews({ companyId: this.User().ComId, organizationId: this.User().OrgId, pageNumber: this.pageNumber, pageSize: this.pageSize });
    }
  }

  //#endregion salary-review Download


  //#region
  isBulkApproval: boolean = false;
  showBulkApproval() {
    this.isBulkApproval = true;
  }

  closeBulkApproval(reason: any) {
    this.isBulkApproval = false;
    this.getSalaryReviews({
      employeeId: this.utilityService.IntTryParse(this.searchByEmployee),
      slaryConfigCategory: this.searchByConfigCategory,
      stateStatus: this.searchByStatus,
      pageNumber: this.pageNumber,
      pageSize: this.pageSize
    });
  }
  //#endregion

  //#region delete modal

  showDeleteModal: boolean = false;
  id_delete_modal: number = 0;
  employee_id_delete_modal: number = 0;
  openDeleteModal(id: number, employeeId: number) {
    this.showDeleteModal = true;
    this.id_delete_modal = id;
    this.employee_id_delete_modal = employeeId;
  }

  closeDeleteModal(reason: any) {
    this.showDeleteModal = false;
    this.id_delete_modal = 0;
    this.employee_id_delete_modal = 0
    if (reason == "Delete Complete") {
      this.getSalaryReviews({
        employeeId: this.utilityService.IntTryParse(this.searchByEmployee),
        stateStatus: this.searchByStatus,
        companyId: this.User().ComId,
        organizationId: this.User().OrgId,
        pageNumber: this.pageNumber,
        pageSize: this.pageSize
      });
    }
  }

  //#endregion delete modal
}
