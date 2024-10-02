import { transition, trigger, useAnimation } from "@angular/animations";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { bounceIn, fadeIn, fadeInRight, slideInUp } from "ng-animate";
import { BsDatepickerConfig } from "ngx-bootstrap/datepicker";
import { CustomModalService } from "src/app/shared/services/custom-modal.service";
import { PayrollWebService } from "src/app/shared/services/payroll-web.service";
import { UserService } from "src/app/shared/services/user.service";
import { UtilityService } from "src/app/shared/services/utility.service";
import { ToastrService } from 'ngx-toastr';
import { EmployeeTaxRefundSubmissionService } from "../employee-tax-refund/employee-tax-refund-submission.service";
import { EmployeeAdvancedIncomeTaxSubmissionService } from "../employee-income-tax-document-submission/employee-advance-income-tax-submission.service";

@Component({
  selector: 'app-self-tax-refund-submission',
  templateUrl: './self-tax-refund-submission.component.html',
  animations: [
    trigger('slideInUp', [transition('* => *', useAnimation(slideInUp, { params: { timing: 0.5 } }))]),
    trigger('fadeIn', [transition('void => *', useAnimation(fadeIn, { params: { timing: 0.3 } }))]),
    trigger('fadeInRight', [transition('void => *', useAnimation(fadeInRight, { params: { timing: 0.5 } }))]),
    trigger('bounceIn', [transition('void => *', useAnimation(bounceIn, { params: { timing: 1 } }))]),
  ]
})
export class SelfTaxRefundSubmissionComponent implements OnInit {

  modalTitle: string = "";
  datePickerConfig: Partial<BsDatepickerConfig> = {};
  isNgInit = false;
  pageNumber: number = 1;
  pageSize: number = 15;
  employeeTaxDocumentPageConfig: any = this.userService.pageConfigInit("employeeList", this.pageSize, 1, 0);

  constructor(private fb: FormBuilder,
    private userService: UserService,
    public utilityService: UtilityService,
    public modalService: CustomModalService,
    private payrollWebService: PayrollWebService,
    private employeeTaxRefundSubmissionService: EmployeeTaxRefundSubmissionService,
    private employeeAdvancedIncomeTaxSubmissionService: EmployeeAdvancedIncomeTaxSubmissionService,
    public toastr: ToastrService) {
  }

  ngOnInit(): void {
    this.searchFormInit();
    this.loadFiscalYears();
    this.getTaxRefundInfos();
  }

  pagePrivilege: any = this.userService.getPrivileges();

  logger(msg: any, options: any) {
    this.utilityService.consoleLog(msg, options);
  }

  User() {
    return this.userService.User();
  }

  select2Options = {
    width: "100%",
    containerCssClass: "form-control form-control-sm text-x-small font-bold",
    theme: "bootstrap4"
  }

  searchForm: FormGroup;

  searchFormInit() {
    this.searchForm = this.fb.group({
      submissionId: new FormControl(0),
      employeeId: new FormControl(this.User().EmployeeId),
      fiscalYearId: new FormControl(0)
    })

    this.searchForm.get('fiscalYearId').valueChanges.subscribe((item) => {
      setTimeout(() => {
        this.getTaxRefundInfos();
      }, 5)
    })

  }


  ddlSearchByEmployee: any[] = [];
  ddlSearchByFiscalYear: any[] = [];

  fiscalYearId: any = ''
  searchByEmployee: any = 0
  searchByStatus: any = ''
  searchByCertificateType: any = ''
  listOfData: any[] = [];
  employeeAdvanceIncomeTaxDTLabel: string = null;

  getTaxRefundInfos() {
    let params = Object.assign({}, this.searchForm.value);
    this.employeeTaxRefundSubmissionService.getTaxRefundInfos(params).subscribe(response => {
      this.listOfData = response.body;

    }, (error) => {
      this.utilityService.httpErrorHandler(error);
    })
  }


  ddlFiscalYears: any[] = [];
  loadFiscalYears() {
    this.ddlFiscalYears = [];
    this.payrollWebService.getFiscalYears<any[]>().then((data) => {
      this.ddlFiscalYears = data;
    })
  }

  modalObj: any = null;
  showRefundModal: boolean = false;
  id: number = 0;
  openRefundModal(id: number) {
    this.showRefundModal = true;
    this.id = id;
  }

  closeRefundModal(reason: string) {
    this.showRefundModal = false;
    this.id = 0;
    if (reason == 'Save Complete') {
      this.getTaxRefundInfos();
    }
  }

  showDocumentFile(path: string) {
    if (path != null && path != '') {
      this.employeeAdvancedIncomeTaxSubmissionService.download({ path: path }).subscribe(response => {
        console.log("response =>", response);
        if (response.size > 64 && response.type != 'text/plain') {
          var blob = new Blob([response], { type: response.type });
          let pdfUrl = window.URL.createObjectURL(blob);
          var PDF_link = document.createElement('a');
          PDF_link.href = pdfUrl;
          window.open(pdfUrl, '_blank');
        }
        else {
          this.utilityService.warning("No file found")
        }
      }, (error) => {
        this.utilityService.httpErrorHandler(error);
      })
    }
    else {
      this.utilityService.fail("Invalid paramter for file retrieving")
    }
  }
}