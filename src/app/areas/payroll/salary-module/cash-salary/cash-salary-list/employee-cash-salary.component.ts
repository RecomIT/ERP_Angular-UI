import { transition, trigger, useAnimation } from "@angular/animations";
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup, NgForm, Validators } from "@angular/forms";
import { bounceIn, fadeIn, fadeInRight, slideInUp } from "ng-animate";
import { BsDatepickerConfig } from "ngx-bootstrap/datepicker";
import { CustomModalService } from "src/app/shared/services/custom-modal.service";
import { PayrollWebService } from "src/app/shared/services/payroll-web.service";
import { UserService } from "src/app/shared/services/user.service";
import { UtilityService } from "src/app/shared/services/utility.service";
import { ApiArea, ApiController } from 'src/app/shared/constants';
import { HrWebService } from 'src/app/shared/services/hr-web.service';
import { ToastrService } from 'ngx-toastr';
import { AreasHttpService } from "src/app/areas/areas.http.service";
import { DatePipe } from "@angular/common";
import { CashSalaryService } from "../cash-salary.service";
import { EmployeeInfoService } from "src/app/areas/employee_module/employee/employee-info.service";

@Component({
  selector: 'app-employee-cash-salary',
  templateUrl: './employee-cash-salary.component.html'
})
export class EmployeeCashSalaryComponent implements OnInit {

  modalTitle: string = "";
  datePickerConfig: Partial<BsDatepickerConfig> = {};
  isNgInit = false;
  cashSalaryPageSize: number = 15;
  cashSalaryPageNo: number = 1;
  cashSalaryPageConfig: any = this.userService.pageConfigInit("cashSalaryData", this.cashSalaryPageSize, 1, 0);
  pagePrivilege: any= this.userService.getPrivileges();

  constructor(private fb: FormBuilder,
  private areasHttpService: AreasHttpService,
  private userService: UserService,
  private datePipe: DatePipe,
  public utilityService: UtilityService,
  public modalService: CustomModalService,
  private hrWebService: HrWebService,
  private payrollWebService: PayrollWebService,
  private cashSalaryService: CashSalaryService,
  public toastr: ToastrService,
  private employeeInfoService: EmployeeInfoService
  ) {}

  ngOnInit(): void {
    this.uploadCashSalaryFormInit();   
    this.salaryProcessInfoSearchFormInit();
    this.salaryProcessInfoSearchFormInit();
    this.salaryProcessDetailFormInit();
    this.salarySheetFormInit();
    this.getSalaryProcessInfos();
    this.getSalaryProcessDetails();       
 
    this.getCashSalaryHeads(1);
    this.loadEmployees();
    this.uploadCashSalaryList();
    this.loadCashSalaryHead();
    this.datePickerConfig = this.utilityService.datePickerConfig();
    this.pagePrivilege = this.userService.getPrivileges();
  }
  select2Config = this.utilityService.select2Config();
  logger(msg: any, options: any) {
    this.utilityService.consoleLog(msg, options);
  }  


  User() {
      return this.userService.User();
  }


  cashSalaryForm: FormGroup;
  cashSalaryFormInit() {
    this.cashSalaryForm = this.fb.group({
    })
  }
  searchByCashSalaryHead: any = '';
  searchByCashSalaryHeadCode: any = '';
  searchByCashSalaryHeadInBng: any = '';
  ddlSearchByCashSalaryHead: any[] = [];
  searchByCashSalaryHeadId: any = 0;

  listOfCashSalaryHead: any[] = [];
  cashSalaryHeadDTLabel: string = null;

  onCashSalaryHeadChanged() {
    if (this.isNgInit) {
      this.getCashSalaryHeads(1);
    }
    this.isNgInit = true;
    console.log("searchByCashSalaryHead >>>", this.searchByCashSalaryHead);
  }
  cashSalaryPageChanged(event: any) {
    this.cashSalaryPageChanged = event;
    this.getCashSalaryHeads(this.cashSalaryPageNo);
  }

  getCashSalaryHeads(pageNo: number) {
    this.cashSalaryPageNo = pageNo;
    this.listOfCashSalaryHead = [];
    let params = { cashSalaryHeadId: this.utilityService.IntTryParse(this.searchByCashSalaryHeadId), cashSalaryHeadName: this.searchByCashSalaryHead, cashSalaryHeadCode: this.searchByCashSalaryHeadCode, cashSalaryHeadNameInBengali: this.searchByCashSalaryHeadInBng, pageSize: this.cashSalaryPageSize, pageNumber: pageNo };

    this.areasHttpService.observable_get<any[]>((ApiArea.payroll + "/Salary/CashSalary" + "/GetCashSalaryHeadList"), {
      responseType: "json", observe: 'response', params: params
    }).subscribe((response) => {
      console.log("response >>>>", response);
      var res = response as any;
      this.listOfCashSalaryHead = res.body;
      this.cashSalaryHeadDTLabel = this.listOfCashSalaryHead.length == 0 ? 'No record(s) found' : null;
      var xPaginate = JSON.parse(res.headers.get('X-Pagination'));
      this.cashSalaryPageConfig = this.userService.pageConfigInit("cashSalaryData", xPaginate.itemsPerPage, xPaginate.currentPage, xPaginate.totalItems);

    },
      (error) => { console.log(error) }
    )
  }

  showCashSalaryHeadModal: boolean = false;
  cashSalaryHeadId: number = 0;
  openCashSalaryHeadModal(id: number) {
    this.showCashSalaryHeadModal = true;
    this.cashSalaryHeadId = id;  
  }
  closeCashSalaryHeadModal(reason: any) {
    this.showCashSalaryHeadModal = false;
    this.cashSalaryHeadId = 0;
    if (reason == 'Save Complete') {
      this.getCashSalaryHeads(1);
    }
  }

  //Upload Excel File
  showUploadCashSalaryHeadModal: boolean = false;
  openUploadExcelFileModal() {
    this.showUploadCashSalaryHeadModal = true;
    this.modalTitle = "Upload Excel File";
  }

  closeUploadExcelFileModal(reason: any) {
    this.cashSalaryHeadId = 0;
    this.showUploadCashSalaryHeadModal = false;
    if (reason == 'Save Complete') {
      this.getCashSalaryHeads(1);
    }
  }


///---------------------Upload Cash Salary----------------------------
pageNumber: number = 1;
pageSize: number = 15;
uploadCashSalaryPageConfig: any = this.userService.pageConfigInit("employeeList", this.pageSize, 1, 0);

ddlYears: any = this.utilityService.getYears(2);
ddlMonths: any = this.utilityService.getMonths();

currentMonth: number = parseInt(this.utilityService.currentMonth);
currentYear: number = parseInt(this.utilityService.currentYear);


uploadCashSalaryForm: FormGroup;
uploadCashSalaryFormInit() {
  this.uploadCashSalaryForm = this.fb.group({
    uploadCashSalaryId: new FormControl(0),
    cashSalaryHeadId: new FormControl(0),
    cashSalaryHeadName: new FormControl(''),
    employeeCode: new FormControl('', [Validators.required]),
    employeeId: new FormControl(0),
    employeeName: new FormControl(''),
    gradeId: new FormControl(0),  
    designationId: new FormControl(0),  
    departmentId: new FormControl(0),   
    salaryMonth: new FormControl(0),
    salaryYear: new FormControl(0),     
    amount: new FormControl(0, [Validators.min(1)]),
    stateStatus: new FormControl(''),
    isActive: new FormControl(true),
    sortingCol: new FormControl(''),
    sortType: new FormControl(''),
    pageNumber: new FormControl(this.pageNumber),
    pageSize: new FormControl(this.pageSize)
  })
  this.uploadCashSalaryForm.get('cashSalaryHeadId').valueChanges.subscribe((item) => {
    this.resetPage()
    this.uploadCashSalaryList();
  })
  this.uploadCashSalaryForm.get('employeeId').valueChanges.subscribe((item) => {
    this.resetPage()
    this.uploadCashSalaryList();
  })
  this.uploadCashSalaryForm.get('stateStatus').valueChanges.subscribe((item) => {
    this.resetPage()
    this.uploadCashSalaryList();
  })
  this.uploadCashSalaryForm.get('salaryMonth').valueChanges.subscribe((item) => {
    this.resetPage()
    this.uploadCashSalaryList();
  })  
  this.uploadCashSalaryForm.get('salaryYear').valueChanges.subscribe((item) => {
    this.resetPage()
    this.uploadCashSalaryList();
  })  

}

resetPage() {
  this.uploadCashSalaryForm.get('pageNumber').setValue(1);
}

ddlSearchByEmployee: any[] = [];
ddlSearchByUploadCashSalary: any[] = [];

searchByEmployee: any = 0;
searchByUploadCashSalary: any = ''; 
searchByUploadCashSalaryId: any = 0;
searchByStatus: any = ''

listOfUploadCashSalary: any[] = [];
uploadCashSalaryDTLabel: string = null;


ddlCashSalaryHead: any[] = [];
loadCashSalaryHead() {
  this.ddlCashSalaryHead = []; 
  this.areasHttpService.observable_get<any[]>((ApiArea.payroll + "/Salary/CashSalary" + "/GetCashSalaryHeadExtension"), {
    responseType: "json",
    observe: 'response',
    params: {
      cashSalaryHeadId: this.cashSalaryHeadId
    }
  }).subscribe((response) => {
    var res = response as any;
    this.ddlCashSalaryHead = res.body;   
  })
}

ddlEmployees: any[]; 
loadEmployees() {
    this.employeeInfoService.loadDropdownData({});
    this.employeeInfoService.ddl_employee_data$.subscribe(data => {
    this.employeeInfoService.loadDropdown(data);
    this.ddlEmployees = this.employeeInfoService.ddl$;
    }, error => {
    console.error('Error while fetching data:', error);
    });
}

onEmployeeChanged() {
  if (this.isNgInit) {
    this.uploadCashSalaryList();
  }
  this.isNgInit = true;
}

employeeListPageChanged(event: any) {
  this.pageNumber = event;
  this.uploadCashSalaryForm.get('pageNumber').setValue(this.pageNumber);
  this.uploadCashSalaryList();
}

employeeList: any[] = null;
uploadCashSalaryList() {
  let params = Object.assign({}, this.uploadCashSalaryForm.value);
  params.employeeId = params.employeeId == null ? 0 : params.employeeId;
  params.cashSalaryHeadId = params.cashSalaryHeadId == null ? 0 : params.cashSalaryHeadId;  
  // console.log("employeeId >>>", params);
  // return ;
  this.areasHttpService.observable_get<any[]>((ApiArea.payroll + "/Salary/CashSalary" + "/UploadCashSalaryList"), {
    responseType: "json", observe: 'response', params: params
  }).subscribe((response) => {
    var res = response as any;    
    this.employeeList = res.body;
    //console.log("this.employeeList >>>", this.employeeList);
    var xPaginate = JSON.parse(res.headers.get('X-Pagination'));   
    this.uploadCashSalaryPageConfig = this.userService.pageConfigInit("employeeList", xPaginate.itemsPerPage, xPaginate.currentPage, xPaginate.totalItems);
  },
    (error) => {
      this.toastr.error("Something went wrong", "Server Response", { timeOut: 1000 })
    })
}


uploadCashSalaryId: any = 0;
showUploadCashSalaryModal: boolean = false;
openUploadCashSalaryExcelFileModal() {
  this.showUploadCashSalaryModal = true;
  this.modalTitle = "Upload Cash Salary Excel File";
}

closeUploadCashSalaryExcelFileModal(reason: any) {
  this.uploadCashSalaryId = 0;
  this.showUploadCashSalaryModal = false;
  if (reason == 'Save Complete') {
    this.uploadCashSalaryList();
  }
}

modalObj: any = null;
showCreateCashSalaryModal: boolean = false;
openCreateCashSalaryModal(id: number) {
  this.showCreateCashSalaryModal = true;
  this.uploadCashSalaryId = id;
}

closeCreateCashSalaryModal(reason: string) {
  this.showCreateCashSalaryModal = false;
  this.uploadCashSalaryId = 0;
  if (reason == 'Save Complete') {
    this.uploadCashSalaryList();
  }
}

showEditCashSalaryModal: boolean = false;
openEditCashSalaryModal(id: number) {
  this.showEditCashSalaryModal = true;
  this.uploadCashSalaryId = id;
}

closeEditCashSalaryModal(reason: string) {
  this.showEditCashSalaryModal = false;
  this.uploadCashSalaryId = 0;
  if (reason == 'Save Complete') {
    this.uploadCashSalaryList();
  }
}

  showApprovalCashSalaryModal: boolean = false;
  approvalData: any = null;
  checkModalFlag: any = "";
  openApprovalCashSalaryModal(id: any, flag: any) {
    this.checkModalFlag = "";
    this.showApprovalCashSalaryModal = true;  
    this.uploadCashSalaryId = id;   
    this.approvalData = Object.assign({}, this.employeeList.find(item => item.uploadCashSalaryId == id));   
    this.checkModalFlag = flag;
  }

  closeApprovalCashSalaryModal(reason: any) {
    this.showApprovalCashSalaryModal = false;
    this.approvalData = 0;
    this.uploadCashSalaryId = 0;
    if (reason == 'Save Complete') {
      this.uploadCashSalaryList();
    }
  }

 //#region Salary Process Information List
 listOfsalaryProcess: any[] = [];
 salaryProcessInfoSearchForm: FormGroup;
 salaryProcessInfoSearchFormInit() {
   this.salaryProcessInfoSearchForm = this.fb.group({
     cashcashSalaryProcessId: new FormControl(0),
     batchNo: new FormControl(''),
     salaryMonth: new FormControl(0),
     salaryYear: new FormControl(0),
   })
   this.salaryProcessInfoSearchForm.valueChanges.subscribe((item) => {
     this.getSalaryProcessInfos();
   })
 }

 getSalaryProcessInfos() {
   this.areasHttpService.observable_get<any>((ApiArea.payroll + "/Salary/CashSalary" + "/GetCashSalaryProcessInfos"), {
     responseType: "json", params: this.salaryProcessInfoSearchForm.value
   }).subscribe((response) => {
     var res = response as any[];
     this.listOfsalaryProcess = res;
   },
     (error) => { this.utilityService.httpErrorHandler(error) }
   )
 }
 //#endregion Salary Process Information List

 //#region Salary Process Details

 salaryProcessDetailSearchForm: FormGroup;
 salaryProcessDetailFormInit() {
   this.salaryProcessDetailSearchForm = this.fb.group({
     employeeId: new FormControl(0),
     batchNo: new FormControl(''),
     month: new FormControl(0),
     year: new FormControl(0),
   })

   this.salaryProcessDetailSearchForm.valueChanges.subscribe((item) => {
     this.getSalaryProcessDetails();
   })
 }

 listOfSalaryProcessDetail: any[] = []
 getSalaryProcessDetails() {
   let formValues = this.salaryProcessDetailSearchForm.value;
   formValues.employeeId = formValues.employeeId == null ? 0 : formValues.employeeId;
   this.areasHttpService.observable_get<any[]>((ApiArea.payroll + "/Salary/CashSalary"+ "/GetCashSalaryProcessDetail"), {
     responseType: "json", params: formValues
   }).subscribe((response) => {
     this.listOfSalaryProcessDetail = response;
   },
     (error) => { this.utilityService.httpErrorHandler(error) }
   )
 }
 //#endregion Salary Process Deails


 //#region Salary Sheet

 cashSalarySheetForm: FormGroup;
 jsonKeys: any[] = []; 
 listOfSalarySheetInfo: any[] = [];
//  getSalarySheetInfos() {
//    this.areasHttpService.observable_get<any>((ApiArea.payroll + "/Salary/CashSalary" + "/GetCashSalarySheet"), {
//      responseType: "json", params: this.cashSalarySheetForm.value
//    }).subscribe((response) => {
//      this.jsonKeys = [];
//      console.log("response >>>", response);
//      if (response != null) {
//        this.listOfSalarySheetInfo = JSON.parse(response?.json);
//        if (this.listOfSalarySheetInfo != null && this.listOfSalarySheetInfo.length > 0) {
//          this.jsonKeys = Object.keys(this.listOfSalarySheetInfo[0]);
//        }
//      }
//    },
//      (error) => { this.utilityService.httpErrorHandler(error) }
//    )
//  }

 salarySheetFormInit() {
   this.cashSalarySheetForm = this.fb.group({
     employeeId: new FormControl(0),
     batchNo: new FormControl(''),
     salaryMonth: new FormControl(0, [Validators.required, Validators.min(1)]),
     salaryYear: new FormControl(0, [Validators.required, Validators.min(1)]),
     format: new FormControl('.xlsx')
   })

   this.cashSalarySheetForm.valueChanges.subscribe((value) => {
     //this.getSalarySheetInfos();
   })
 }

 downloadCashSalarySheetExcel(format: string) {
   let params = Object.assign({}, this.cashSalarySheetForm.value);
   params.format = format;
   let month = this.utilityService.IntTryParse(params.salaryMonth);
   let year = this.utilityService.IntTryParse(params.salaryYear);
   if (month > 0 && year > 0) {
    let monthName = this.utilityService.getMonthName(month);     
    let fileName = `CashPaymentSalarySheet_${monthName}_${year}.xlsx`;
    this.cashSalaryService.downloadCashSalarySheetAsync(params).subscribe((response) => {   
      if (response.size > 0) {
       var blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
       const link = document.createElement('a');
       link.href = window.URL.createObjectURL(blob);
       link.download = fileName;
       link.click();
      }
      else {
        this.utilityService.warning("No file found")
      }
    },
      (error) => { this.utilityService.httpErrorHandler(error) }
    )
   }
 
 }

 downloadActualCashSalarySheetExcel(format: string) {
  let params = Object.assign({}, this.cashSalarySheetForm.value);
  params.format = format;
  let month = this.utilityService.IntTryParse(params.salaryMonth);
  let year = this.utilityService.IntTryParse(params.salaryYear);
  let monthName = this.utilityService.getMonthName(month);     
  let fileName = `CashActualSalarySheet_${monthName}_${year}.xlsx`;
  if (month > 0 && year > 0) {
  this.cashSalaryService.downloadActualCashSalarySheetAsync(params).subscribe((response) => {   
    if (response.size > 0) {
     var blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
     const link = document.createElement('a');
     link.href = window.URL.createObjectURL(blob);
     link.download = fileName;
     link.click();
    }
    else {
      this.utilityService.warning("No file found")
    }
  },
    (error) => { this.utilityService.httpErrorHandler(error) }
  )
}
}
 //#endregion



 //#region Salary Process modal
 showSalaryProcessModal: boolean = false;
 openProcessModal() {
   console.log("openProcessModal clicked");
   this.showSalaryProcessModal = true;
 }

 closeProcessModal(reason: any) {
   this.showSalaryProcessModal = false;
   if (reason = 'Save Complete') {
     this.getSalaryProcessInfos();
   }
 }
 //#endregion

 //#region Salary Process Details Modal
 showSalaryProcessDetailModal: boolean = false; 
 cashSalaryProcessId: number = 0;
 openProcessDetailModal(id: any) {
   this.cashSalaryProcessId = id;
   this.showSalaryProcessDetailModal = true;
 }

 closeSalaryProcessDetailModal(reason: any) {
   this.cashSalaryProcessId = 0;
   this.showSalaryProcessDetailModal = false;
 }

 //#endregion Salary Process Details Modal

 //#region Salary Process Disbursed Modal
 showSalaryProcessDisbursedModal: boolean = false;
 openSalaryProcessStatusModal(id: any) {  
   this.showSalaryProcessDisbursedModal = true;
   this.cashSalaryProcessId = id;
 }

 closeSalaryProcessStatusModal(reason: any) {
   this.showSalaryProcessDisbursedModal = false;
   this.cashSalaryProcessId = 0;
   if (reason == 'Save Complete') {
     this.getSalaryProcessInfos();
   }
 }
 //#endregion Salary Process Disbursed Modal

 //#region Employee Salary Allowance Modal
 showEmployeeSalaryAllowanceDeductionModal: boolean = false;
 salaryProcessDetailId_SalaryAllowance: number = 0;
 employeeId_SalaryAllowance: number = 0;
 openEmployeeSalaryAllowanceDeductionModal(employeeId: any, processDetailId: any) {
   console.log("openProcessModal clicked");
   this.showEmployeeSalaryAllowanceDeductionModal = true;
   this.employeeId_SalaryAllowance = employeeId;
   this.salaryProcessDetailId_SalaryAllowance = processDetailId;
 }

 closeEmployeeSalaryAllowanceDeductionModal(reason: any) {
   this.showEmployeeSalaryAllowanceDeductionModal = false;
   this.employeeId_SalaryAllowance = 0;
   this.salaryProcessDetailId_SalaryAllowance = 0;
 }
 //#endregion Employee Salary Allowance Modal

 //#region Emailing
 showEmailingModal: boolean = false;
 salaryMonthInMailing: number = 0;
 salaryYearInMailing: number = 0;
 openEmailingModal(month: number, year: number) {
   this.showEmailingModal = true;  
   this.salaryMonthInMailing = month;
   this.salaryYearInMailing = year;
 }

 closeEmailingModal(reason: any) {
   this.showEmailingModal = false;
   this.salaryMonthInMailing = 0;
   this.salaryYearInMailing = 0;
 }

 

}
