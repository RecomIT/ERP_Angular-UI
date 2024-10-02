import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { UserService } from "src/app/shared/services/user.service";
import { UtilityService } from "src/app/shared/services/utility.service";
import { SupplementaryProcessService } from "./supplementary-process.service";

@Component({
  selector: 'app-payroll-supplementary-process-info',
  templateUrl: './supplementary-process-info.component.html'
})

export class SupplementaryProcessInfoComponent implements OnInit {

  pageNumber: number = 1;
  pageSize: number = 15;
  pageConfig: any = this.userService.pageConfigInit("info_list", this.pageSize, 1, 0);
  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private utilityService: UtilityService,
    private service: SupplementaryProcessService) {

  }
  ngOnInit(): void {
    this.formInit();
    this.getList();
  }

  ddlYears: any = this.utilityService.getYears(2);
  ddlMonths: any = this.utilityService.getMonths();
  ddlStatus: any = this.utilityService.getDataStatus().filter(item => item == "Pending" || item == "Disbursed");

  searchForm: FormGroup;

  formInit() {
    this.searchForm = this.fb.group({
      paymentProcessInfoId: new FormControl(0),
      paymentMonth: new FormControl(0),
      paymentYear: new FormControl(0),
      stateStatus: new FormControl(''),
      pageNumber: new FormControl(this.pageNumber),
      pageSize: new FormControl(this.pageSize)
    })

    this.searchForm.valueChanges.subscribe(value => {
      console.log("searchForm values >>>", value);
      this.getList();
    })
  }

  page_Changed(event: any) {
    this.pageNumber = event;
    this.searchForm.get('pageNumber').setValue(this.pageNumber);
  }

  list: any[] = [];
  getList() {
    let params = this.searchForm.value;
    this.service.getSupplementaryProcessInfosAsync(params).subscribe(response => {
      this.list = response.body;
      let xPaginate = JSON.parse(response.headers.get('X-Pagination'));
      this.pageConfig = this.userService.pageConfigInit("info_list", xPaginate.itemsPerPage, xPaginate.currentPage, xPaginate.totalItems);
    }, error => {
      console.log(error)
    })
  }

  isShowingProcessModal: boolean = false;

  openProcessModal() {
    this.isShowingProcessModal = true;
  }

  clossProcessModal(reason: any) {
    this.isShowingProcessModal = false;
    if (reason == 'Save Complete') {
      this.getList();
    }
  }

  downloadSupplementaryTaxSheetDetailsExcel(batchNo: string, paymentProcessInfoId: number, fiscalYearId: number, month: number, year: number, format: string) {
    let params = { paymentProcessInfoId: paymentProcessInfoId, employeeId: 0, fiscalYearId: fiscalYearId, paymentMonth: month, paymentYear: year, format: format };
    let monthName = this.utilityService.getMonthName(month);
    let fileName = `Once-Off-Tax-Sheet-Details_${monthName}_${year}_${batchNo}.xlsx`;
    this.service.downloadSupplementaryTaxSheetDetailsExcel(params).subscribe((response) => {
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

  downloadSupplementaryPaymentSheet(batchNo: string, paymentProcessInfoId: number, fiscalYearId: number, month: number, year: number, format: string) {
    let params = { paymentProcessInfoId: paymentProcessInfoId, employeeId: 0, fiscalYearId: fiscalYearId, paymentMonth: month, paymentYear: year, format: format };
    let monthName = this.utilityService.getMonthName(month);
    let fileName = `Once_Off_Payment_Sheet_${monthName}_${year}_${batchNo}.xlsx`;
    this.service.downloadSupplementaryPaymentSheet(params).subscribe((response) => {
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

  //#region Disbursed Modal
  //app-supplementary-payment-disbursed-modal
  isShowingDisbursedModal: boolean = false;
  id: number = 0;

  openDisbursedModal(id: number) {
    this.isShowingDisbursedModal = true;
    this.id = id;
  }

  clossDisbursedModal(reason: any) {
    this.isShowingDisbursedModal = false;
    console.log("clossDisbursedModal >>", reason);
    if (reason == 'Save Complete') {
      this.getList();
    }
  }
  //#endregion

  showEmailingModal: boolean = false;
  processId: any = 0;
  allowanceName: any = "";
  paymentMonth: any = 0;
  paymentYear: any = 0;

  openEmailingModal(item: any) {
    console.log("item >>>", item);
    this.processId = item.paymentProcessInfoId;
    this.allowanceName = item.allowanceName
    this.paymentMonth = item.paymentMonth;
    this.paymentYear = item.paymentYear;
    this.showEmailingModal = true;
  }

  clossEmailingModal(reason: any) {
    this.showEmailingModal = false;
  }
}