import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { UserService } from "src/app/shared/services/user.service";
import { UtilityService } from "src/app/shared/services/utility.service";
import { HrWebService } from "src/app/shared/services/hr-web.service";
import { DatePipe } from '@angular/common';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { CustomModalService } from "src/app/shared/services/custom-modal.service";
import { SalaryReviewService } from "../salary-review.service";
import { EmployeeInfoService } from "src/app/areas/employee_module/employee/employee-info.service";
import { NotifyService } from "src/app/shared/services/notify-service/notify.service";
import { ControlPanelWebService } from "src/app/shared/services/control-panel.service";


@Component({
  selector: 'app-salary-module-download-salary-review-sheet-modal',
  templateUrl: './download-salary-review-sheet-modal.component.html'
})
export class DownloadSalaryReviewSheetModalComponent implements OnInit {
  @ViewChild('modal', { static: true }) modal!: ElementRef;
  @Input() salaryReviewInfoId: any = 0;
  @Output() closeModalEvent = new EventEmitter<string>();
  modalTitle: string = "";

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private controlPanelWebService: ControlPanelWebService,
    private notifyService: NotifyService,
    private utilityService: UtilityService,
    private service: SalaryReviewService,
    public hrWebService: HrWebService,
    private datepipe: DatePipe,
    public modalService: CustomModalService,
    private employeeInfoService: EmployeeInfoService
  ) { }

  datePickerConfig: Partial<BsDatepickerConfig> = {};
  isViewPage: boolean = true;

  ngOnInit(): void {
    this.datePickerConfig = this.utilityService.datePickerConfig();
    this.formInit();
    this.loadEmployeeDropdown();
    this.loadBranch();
  }


  select2Config = this.utilityService.select2Config();

  ddlEmployees: any[];
  loadEmployeeDropdown() {
    this.employeeInfoService.loadDropdownData({});
    this.employeeInfoService.ddl_employee_data$.subscribe(data => {
      this.employeeInfoService.loadDropdown(data);
      this.ddlEmployees = this.employeeInfoService.ddl$;
    }, error => {
      console.error('Error while fetching data:', error);
    });
  }

  ddlBranch: any[] = [];
  loadBranch() {
      this.ddlBranch = [];
      this.controlPanelWebService.getBranchExtension<any[]>("7").then((data) => {
          this.ddlBranch = data;
      })
  }

  ddlStatus: any[] = this.utilityService.getDataStatus().filter(item => item == "Pending" || item == "Approved")

  effectiveTo: string = null;
  effectiveDate: string[] = null;
  searchByEmployee: any = '';

  form: FormGroup;
  formInit() {
    this.form = this.fb.group({
      effectiveDate: new FormControl(null),
      employeeId: new FormControl(''),
      dateOfjoining: new FormControl(null),
      stateStatus: new FormControl(''),
      branchId: new FormControl(0),
    })
    this.modalService.open(this.modal, "lg")
  }


  btnDownload: boolean = false;

  validate() {
    let validate = true;
    let emptyCount = 0;
    if (this.form.get('effectiveDate').value == null || this.form.get('effectiveDate').value == '') {
      emptyCount++;
    }
    if (this.form.get('employeeId').value == null || this.form.get('employeeId').value == '') {
      emptyCount++;
    }
    if (this.form.get('dateOfjoining').value == null || this.form.get('dateOfjoining').value == '') {
      emptyCount++;
    }
    if (this.form.get('stateStatus').value == null || this.form.get('stateStatus').value == '') {
      emptyCount++;
    }
    if (this.form.get('branchId').value == null || this.form.get('branchId').value == '' || this.form.get('branchId').value == '0') {
      emptyCount++;
    }


    if (emptyCount == 5) {
      validate = false;
      this.utilityService.fail("Please select at least one, then click dowload", "Site Response")
    }
    return validate;
  }


  download() {
    if (this.validate()) {
      this.btnDownload = true;
      let params = {
        effectiveFrom: "",
        effectiveTo: "",
        joiningDateFrom: "",
        joiningDateTo: "",
        branchId: this.utilityService.IntTryParse(this.form.get('branchId').value),
        employeeId: this.utilityService.IntTryParse(this.form.get('employeeId').value),
        stateStatus: this.form.get('stateStatus').value
      };
      if (this.form.get('effectiveDate').value != null && this.form.get('effectiveDate').value != '' && this.form.get('effectiveDate').value.length > 0) {
        let effectiveFrom = this.datepipe.transform(this.form.get('effectiveDate').value[0], "yyyy-MM-dd")
        let effectiveTo = this.datepipe.transform(this.form.get('effectiveDate').value[1], "yyyy-MM-dd")
        params.effectiveFrom = effectiveFrom;
        params.effectiveTo = effectiveTo;
      }
      if (this.form.get('dateOfjoining').value != null && this.form.get('dateOfjoining').value != '' && this.form.get('dateOfjoining').value.length > 0) {
        let joiningDateFrom = this.datepipe.transform(this.form.get('dateOfjoining').value[0], "yyyy-MM-dd")
        let joiningDateTo = this.datepipe.transform(this.form.get('dateOfjoining').value[1], "yyyy-MM-dd")
        params.joiningDateFrom = joiningDateFrom;
        params.joiningDateTo = joiningDateTo;
      }

      this.service.downloadSalaryReviewSheet(params).subscribe({
        next: (response) => {
          this.btnDownload = false;
          if (response instanceof Blob) {
            if (response.size > 0) {
              this.utilityService.downloadFile(response, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', "SalaryReviewSheet.xlsx")
            }
          }
          else {
            this.utilityService.fail('No data available for report generation', "Server Response");
          }
        },
        error: (error) => {
          this.btnDownload = false;
          if (typeof error.msg === 'object') {
            this.utilityService.fail(error.msg?.msg, "Server Response");
          }
          else {
            this.notifyService.handleApiError(error);
          }
        }
      })
    }
    else {
      this.utilityService.fail("Invalid form submission", "Site Response");
    }
  }


  download1(format: string) {
    if (this.form.valid) {
      this.btnDownload = true;
      var effectiveDateValue = this.form.get('effectiveDate').value;
      let fromDate = this.datepipe.transform(effectiveDateValue, 'yyyy-MM-dd');

      this.searchByEmployee = this.form.controls.employeeId.value;
      let params = { fromDate: fromDate.toString() ?? '', employeeId: this.searchByEmployee.toString() ?? '0', format: format };
      let fileName = `SalaryReviewSheet_${fromDate}.xlsx`;
      this.service.getSalaryReviewSheetInfosAsync(params).subscribe((response: any) => {
        if (response.size > 0) {
          var blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          const link = document.createElement('a');
          link.href = window.URL.createObjectURL(blob);
          link.download = fileName;
          link.click();
        }
        else {
          this.utilityService.warning("No Excel File found");
        }
      }, (error) => {
        this.utilityService.fail("Something went wrong", "Server Response")

      })

    }
  }

  closeModal(reason: string) {
    this.modalService.service.dismissAll(reason);
    this.closeModalEvent.emit(reason);
  }


}

