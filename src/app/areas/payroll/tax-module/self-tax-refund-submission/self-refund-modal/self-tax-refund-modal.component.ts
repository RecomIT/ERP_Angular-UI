import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CustomModalService } from 'src/app/shared/services/custom-modal.service';
import { UserService } from 'src/app/shared/services/user.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { FiscalYearService } from "../../../salary-module/setup/fiscalYear/fiscalYear.service";
import { EmployeeTaxRefundSubmissionService } from "../../employee-tax-refund/employee-tax-refund-submission.service";

@Component({
  selector: 'app-payroll-self-tax-refund-modal',
  templateUrl: './self-tax-refund-modal.component.html'
})
export class SelfTaxRefundModalComponent implements OnInit {

  @Input() id: any = 0;
  @Output() closeModalEvent = new EventEmitter<string>();

  @ViewChild('taxRefundModal', { static: true }) taxRefundModal!: ElementRef;
  modalTitle: string = "Add Tax Refund";

  constructor(private fb: FormBuilder,
    private userService: UserService,
    public utilityService: UtilityService,
    public modalService: CustomModalService,
    private employeeTaxRefundSubmissionService: EmployeeTaxRefundSubmissionService,
    private fiscalYearService: FiscalYearService) {
  }
  ngOnInit(): void {
    this.modalTitle = this.id > 0 ? "Update Tax-Refund" : "Add Tax-Refund";
    this.taxRefundFormInit();
    this.getCurrentFiscalYear();
    this.modalService.open(this.taxRefundModal, "lg");
    if (this.id > 0) {
      this.getById();
    }
  }


  logger(msg: any, options: any) {
    this.utilityService.consoleLog(msg, options);
  }

  fiscal_year_range: string = "";
  current_fiscal_year: any;
  getCurrentFiscalYear() {
    this.fiscalYearService.getCurrentFiscalYear().then(data => {
      this.current_fiscal_year = data;
      this.taxRefundForm.get('fiscalYearId').setValue(this.current_fiscal_year.fiscalYearId);
      this.fiscal_year_range = this.current_fiscal_year.fiscalYearRange;
    })
  }

  taxRefundForm: FormGroup;
  taxRefundFormInit() {
    this.taxRefundForm = this.fb.group({
      submissionId: new FormControl(this.id ?? 0),
      employeeId: new FormControl(this.userService.User().EmployeeId, [Validators.min(1)]),
      fiscalYearId: new FormControl(0, [Validators.min(1)]),
      certificateType: new FormControl('CET', [Validators.required]),
      amount: new FormControl(0, [Validators.min(1)]),
      filePath: new FormControl(''),
      file: new FormControl(null, [Validators.required])
    })

    if (this.id > 0) {
      this.taxRefundForm.get('file').clearValidators();
      this.taxRefundForm.get('filePath').setValidators([Validators.required])
    }
  }

  employeetaxRefund: any = null;
  setFormValues() {
    this.taxRefundForm.get('submissionId').setValue(this.employeetaxRefund.submissionId);
    this.taxRefundForm.get('employeeId').setValue(this.employeetaxRefund.employeeId);
    this.taxRefundForm.get('fiscalYearId').setValue(this.employeetaxRefund.fiscalYearId);
    this.taxRefundForm.get('certificateType').setValue('CET');
    this.taxRefundForm.get('amount').setValue(this.employeetaxRefund.amount);
    this.taxRefundForm.get('filePath').setValue(this.employeetaxRefund.filePath);
  }

  btntaxRefundSubmission: boolean = false;
  submittaxRefundForm() {
    if (this.taxRefundForm.valid) {
      this.btntaxRefundSubmission = true;
      let formData = new FormData();
      formData.append("SubmissionId", this.id.toString());
      formData.append("EmployeeId", this.utilityService.IntTryParse(this.taxRefundForm.get('employeeId').value).toString());
      formData.append("FiscalYearId", this.utilityService.IntTryParse(this.taxRefundForm.get('fiscalYearId').value).toString());
      formData.append("CertificateType", this.taxRefundForm.get('certificateType').value);
      formData.append("Amount", this.taxRefundForm.get('amount').value);
      formData.append("File", this.taxRefundForm.get('file').value);
      formData.append("FilePath", this.taxRefundForm.get('filePath').value);

      this.employeeTaxRefundSubmissionService.saveBySelf(formData).subscribe(response => {
        if (response?.status) {
          this.utilityService.toastr.success(response?.msg, "Server Response");
          this.closeModal('Save Complete')
        }
        else {
          this.utilityService.toastr.error(response?.msg, "Server Response");
        }
        this.btntaxRefundSubmission = false;
      }, (error) => {
        this.btntaxRefundSubmission = false;
        this.utilityService.httpErrorHandler(error);
      })
    }
    else {
      this.utilityService.fail("Invalid Form Submission", "Site Response");
    }
  }

  uploadFileName: string = "Choose Your file";
  maxSize: number = 300 * 1024;
  fileUpload(file: any) {
    const selectedFile = (file.target as HTMLInputElement).files[0];
    this.logger("selectedFile", selectedFile);
    if (selectedFile != null
      && selectedFile != undefined
      && (this.utilityService.fileExtension(selectedFile.name) == 'pdf'
        || this.utilityService.fileExtension(selectedFile.name) == 'jpg'
        || this.utilityService.fileExtension(selectedFile.name) == 'jpeg'
        || this.utilityService.fileExtension(selectedFile.name) == 'png')) {
      if (selectedFile.size <= this.maxSize) {
        this.uploadFileName = selectedFile.name;
        this.taxRefundForm.get('file').setValue(selectedFile);
      }
      else {
        this.utilityService.fail("Please select a file within 300 KB","Site Response")
      }
    }
    else {
      this.uploadFileName = "Choose Your file";
    }
  }

  getById() {
    this.employeeTaxRefundSubmissionService.getTaxRefundById({ SubmissionId: this.id }).subscribe(response => {
      this.employeetaxRefund = response.body;
      this.setFormValues();
    }, (error) => {
      this.utilityService.fail("Something went wrong", "Server Response")
    })
  }

  closeModal(reason: string) {
    this.modalService.service.dismissAll(reason);
    this.closeModalEvent.emit(reason); // fire
  }

}


