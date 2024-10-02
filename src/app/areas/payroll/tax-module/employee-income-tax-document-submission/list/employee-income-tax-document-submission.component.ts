import { transition, trigger, useAnimation } from "@angular/animations";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { bounceIn, fadeIn, fadeInRight, slideInUp } from "ng-animate";
import { BsDatepickerConfig } from "ngx-bootstrap/datepicker";
import { CustomModalService } from "src/app/shared/services/custom-modal.service";
import { UserService } from "src/app/shared/services/user.service";
import { UtilityService } from "src/app/shared/services/utility.service";
import { AreasHttpService } from "../../../../areas.http.service";
import { ToastrService } from 'ngx-toastr';
import { EmployeeAdvancedIncomeTaxSubmissionService } from "../employee-advance-income-tax-submission.service";
import { EmployeeInfoService } from "src/app/areas/employee_module/employee/employee-info.service";
import { FiscalYearService } from "../../../salary-module/setup/fiscalYear/fiscalYear.service";
import { EmployeeTaxRefundService } from "../employee-tax-refund.service";
import { WebFileService } from "src/app/areas/common-services/web-file.service";

@Component({
  selector: 'app-employee-income-tax-document-submission',
  templateUrl: './employee-income-tax-document-submission.component.html',
  animations: [
    trigger('slideInUp', [transition('* => *', useAnimation(slideInUp, { params: { timing: 0.5 } }))]),
    trigger('fadeIn', [transition('void => *', useAnimation(fadeIn, { params: { timing: 0.3 } }))]),
    trigger('fadeInRight', [transition('void => *', useAnimation(fadeInRight, { params: { timing: 0.5 } }))]),
    trigger('bounceIn', [transition('void => *', useAnimation(bounceIn, { params: { timing: 1 } }))]),
  ]
})
export class EmployeeIncomeTaxDocumentSubmissionComponent implements OnInit {

  modalTitle: string = "";
  datePickerConfig: Partial<BsDatepickerConfig> = this.utilityService.datePickerConfig();
  isNgInit = false;
  pageNumber: number = 1;
  pageSize: number = 15;
  list_of_ait_Page_config: any = this.userService.pageConfigInit("list_of_ait", this.pageSize, 1, 0);
  list_of_refund_Page_config: any = this.userService.pageConfigInit("list_of_refund", this.pageSize, 1, 0);
  pagePrivilege: any = this.userService.getPrivileges();;

  constructor(private fb: FormBuilder,
    private userService: UserService,
    public utilityService: UtilityService,
    public modalService: CustomModalService,
    private employeeInfoService: EmployeeInfoService,
    private fileService: WebFileService,
    private fiscalYearService: FiscalYearService,
    private employeeAdvancedIncomeTaxSubmissionService: EmployeeAdvancedIncomeTaxSubmissionService,
    private employeeTaxRefundService: EmployeeTaxRefundService,
    public toastr: ToastrService) {
  }
  ngOnInit(): void {
    this.aitFormInit();
    this.loadEmployees();
    this.loadFiscalYears();
    this.getAITDocuments();

    this.refundFormInit();
    this.getRefunds();

    console.log("pagePrivilege >>>", this.pagePrivilege)
  }

  logger(msg: any, options: any) {
    this.utilityService.consoleLog(msg, options);
  }

  User() {
    return this.userService.User();
  }

  select2Options = this.utilityService.select2Config();

  aitForm: FormGroup;

  aitFormInit() {
    this.aitForm = this.fb.group({
      submissionId: new FormControl(0),
      employeeId: new FormControl(0, [Validators.min(1)]),
      fiscalYearId: new FormControl(0, [Validators.min(1)]),
      fiscalYearRange: new FormControl(''),
      certificateType: new FormControl('', [Validators.required]),
      amount: new FormControl(0, [Validators.min(1)]),
      isAuction: new FormControl(false),
      filePath: new FormControl(''),
      file: new FormControl(null, [Validators.required]),
      sortingCol: new FormControl(''),
      sortType: new FormControl(''),
      pageNumber: new FormControl(this.pageNumber),
      pageSize: new FormControl(this.pageSize)
    })

    this.aitForm.get('employeeId').valueChanges.subscribe((item) => {
      this.aitResetPage()
      this.getAITDocuments();
    })

    this.aitForm.get('fiscalYearId').valueChanges.subscribe((item) => {
      this.aitResetPage()
      this.getAITDocuments();
    })

    this.aitForm.get('certificateType').valueChanges.subscribe((item) => {
      this.aitResetPage()
      this.getAITDocuments();
    })

    this.aitForm.get('isAuction').valueChanges.subscribe((item) => {
      this.aitResetPage()
      this.getAITDocuments();
    })
  }

  aitResetPage() {
    this.aitForm.get('pageNumber').setValue(1);
  }

  ddlSearchByEmployee: any[] = [];
  ddlSearchByFiscalYear: any[] = [];

  fiscalYearId: any = ''
  searchByEmployee: any = 0
  searchByStatus: any = ''
  searchByCertificateType: any = ''
  listOfEmployeeAdvanceIncomeTax: any[] = [];
  employeeAdvanceIncomeTaxDTLabel: string = null;

  onEmployeeChanged() {
    if (this.isNgInit) {
      this.getAITDocuments();
    }
    this.isNgInit = true;
  }

  list_of_aitPageChanged(event: any) {
    this.pageNumber = event;
    this.aitForm.get('pageNumber').setValue(this.pageNumber);
    this.getAITDocuments();
  }

  list_of_ait: any = null;
  getAITDocuments() {
    let params = Object.assign({}, this.aitForm.value);
    params.employeeId = params.employeeId == null ? 0 : params.employeeId;
    this.employeeAdvancedIncomeTaxSubmissionService.get(params).subscribe(response => {
      this.list_of_ait = response.body;
      var xPaginate = JSON.parse(response.headers.get('X-Pagination'));
      this.list_of_ait_Page_config = this.userService.pageConfigInit("list_of_ait", xPaginate.itemsPerPage, xPaginate.currentPage, xPaginate.totalItems);
    }, (error) => {
      this.utilityService.httpErrorHandler(error);
    })
  }

  ddlEmployees: any = [];
  loadEmployees() {
    this.ddlSearchByEmployee = [];
    this.employeeInfoService.loadDropdownData({});
    this.employeeInfoService.ddl_employee_data$.subscribe(data => {
      this.employeeInfoService.loadDropdown(data);
      this.ddlEmployees = this.employeeInfoService.ddl$;
      this.ddlSearchByEmployee = this.ddlEmployees;
    }, error => {
      console.error('Error while fetching data:', error);
    });
  }

  ddlFiscalYears: any[] = [];
  loadFiscalYears() {
    this.ddlFiscalYears = [];
    this.fiscalYearService.loadDropdown();
    this.fiscalYearService.ddl$.subscribe(response => {
      this.ddlFiscalYears = response;
    })
  }

  modalObj: any = null;
  showAITModal: boolean = false;
  id: number = 0;
  openAITModal(id: number) {
    this.showAITModal = true;
    this.id = id;
    console.log("employeeAITId id>>>>> " + id);
  }

  closeAITModal(reason: string) {
    this.showAITModal = false;
    this.id = 0;
    if (reason == 'Save Complete') {
      this.getAITDocuments();
    }
  }

  downloadFile(path: string, fileName: string = "") {
    this.fileService.getFile(path, fileName);
  }

  // Tax Refund

  refundForm: FormGroup;

  refundFormInit() {
    this.refundForm = this.fb.group({
      submissionId: new FormControl(0),
      employeeId: new FormControl(0, [Validators.min(1)]),
      fiscalYearId: new FormControl(0, [Validators.min(1)]),
      fiscalYearRange: new FormControl(''),
      certificateType: new FormControl('', [Validators.required]),
      amount: new FormControl(0, [Validators.min(1)]),
      isAuction: new FormControl(false),
      filePath: new FormControl(''),
      file: new FormControl(null, [Validators.required]),
      sortingCol: new FormControl(''),
      sortType: new FormControl(''),
      pageNumber: new FormControl(this.pageNumber),
      pageSize: new FormControl(this.pageSize)
    })

    this.refundForm.get('employeeId').valueChanges.subscribe((item) => {
      this.aitResetPage()
      this.getAITDocuments();
    })

    this.refundForm.get('fiscalYearId').valueChanges.subscribe((item) => {
      this.aitResetPage()
      this.getAITDocuments();
    })

    this.refundForm.get('certificateType').valueChanges.subscribe((item) => {
      this.aitResetPage()
      this.getAITDocuments();
    })

    this.refundForm.get('isAuction').valueChanges.subscribe((item) => {
      this.aitResetPage()
      this.getAITDocuments();
    })
  }

  refundResetPage() {
    this.refundForm.get('pageNumber').setValue(1);
  }

  list_of_refund_PageChanged(event: any) {
    this.pageNumber = event;
    this.aitForm.get('pageNumber').setValue(this.pageNumber);
    this.getAITDocuments();
  }

  list_of_refund: any = null;
  getRefunds() {
    let params = Object.assign({}, this.refundForm.value);
    params.employeeId = params.employeeId == null ? 0 : params.employeeId;
    this.employeeTaxRefundService.get(params).subscribe(response => {
      this.list_of_refund = response.body;
      var xPaginate = JSON.parse(response.headers.get('X-Pagination'));
      this.list_of_refund_Page_config = this.userService.pageConfigInit("list_of_ait", xPaginate.itemsPerPage, xPaginate.currentPage, xPaginate.totalItems);
    }, (error) => {
      this.utilityService.httpErrorHandler(error);
    })
  }

  showRefundModal: boolean = false;
  openRefundModal(id: number) {
    this.showRefundModal = true;
    this.id = id;
  }

  closeRefundModal(reason: string) {
    this.showRefundModal = false;
    this.id = 0;
    if (reason == 'Save Complete') {
      this.getRefunds();
    }
  }

  showUploadModal: boolean = false;

  openUploadModal() {
    this.showUploadModal = true;
  }

  closeUploadModal(reason: string) {
    this.showUploadModal = false;
    this.id = 0;
    if (reason == 'Save Complete') {
      this.getAITDocuments();
      this.getRefunds();
    }
  }

  //#region delete
  delete_item_id: number = 0;
  delete_item_type: string = '';
  showDeleteModal: boolean = false;
  openDeleteModal(id: number, type: string) {
    this.showDeleteModal = true;
    this.delete_item_id = id;
    this.delete_item_type = type;
  }

  closeDeleteModal(reason: string) {
    this.showDeleteModal = false;
    this.delete_item_id = 0;
    this.delete_item_type = '';
    if (reason == 'Save Complete') {
      this.getAITDocuments();
      this.getRefunds();
    }
  }
  //#endregion delete
}