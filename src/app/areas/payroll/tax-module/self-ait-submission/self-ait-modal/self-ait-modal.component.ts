import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CustomModalService } from 'src/app/shared/services/custom-modal.service';
import { UserService } from 'src/app/shared/services/user.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AreasHttpService } from "src/app/areas/areas.http.service";
import { FiscalYearService } from "../../../salary-module/setup/fiscalYear/fiscalYear.service";
import { EmployeeAdvancedIncomeTaxSubmissionService } from "../../employee-income-tax-document-submission/employee-advance-income-tax-submission.service";

@Component({
  selector: 'app-payroll-self-ait-modal',
  templateUrl: './self-ait-modal.component.html'
})
export class SelfAITSubmissionModalComponent implements OnInit {

  @Input() id: any = 0;
  @Output() closeModalEvent = new EventEmitter<string>();

  @ViewChild('aitModal', { static: true }) aitModal!: ElementRef;
  modalTitle: string = "Add AIT";

  constructor(private fb: FormBuilder, // strongly type form build
    private areasHttpService: AreasHttpService, // http request
    private userService: UserService, // user service user id
    public utilityService: UtilityService, // utility 
    public modalService: CustomModalService, // modal service 
    private employeeAdvancedIncomeTaxSubmissionService: EmployeeAdvancedIncomeTaxSubmissionService,
    private fiscalYearService: FiscalYearService) {
  }
  ngOnInit(): void {
    this.modalTitle = this.id > 0 ? "Update AIT" : "Add AIT";
    this.aitFormInit();
    this.getCurrentFiscalYear();
    this.modalService.open(this.aitModal, "lg");
    console.log("this.submissionId init", this.id);
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
      this.aitForm.get('fiscalYearId').setValue(this.current_fiscal_year.fiscalYearId);
      this.fiscal_year_range = this.current_fiscal_year.fiscalYearRange;

    })
  }

  aitForm: FormGroup;
  aitFormInit() {
    this.aitForm = this.fb.group({
      submissionId: new FormControl(this.id ?? 0),
      employeeId: new FormControl(this.userService.User().EmployeeId, [Validators.min(1)]),
      fiscalYearId: new FormControl(0, [Validators.min(1)]),
      certificateType: new FormControl('AIT', [Validators.required]),
      amount: new FormControl(0, [Validators.min(1)]),
      isAuction: new FormControl(false),
      filePath: new FormControl(''),
      file: new FormControl(null, [Validators.required])
    })

    if (this.id > 0) {
      this.aitForm.get('file').clearValidators();
      this.aitForm.get('filePath').setValidators([Validators.required])
    }
  }

  employeeAIT: any = null;
  setFormValues() {
    this.aitForm.get('submissionId').setValue(this.employeeAIT.submissionId);
    this.aitForm.get('employeeId').setValue(this.employeeAIT.employeeId);
    this.aitForm.get('fiscalYearId').setValue(this.employeeAIT.fiscalYearId);
    this.aitForm.get('certificateType').setValue('AIT');
    this.aitForm.get('amount').setValue(this.employeeAIT.amount);
    this.aitForm.get('isAuction').setValue(this.employeeAIT.isAuction);
    this.aitForm.get('filePath').setValue(this.employeeAIT.filePath);
  }

  btnAITSubmission: boolean = false;
  submitAITForm() {
    if (this.aitForm.valid) {
      this.btnAITSubmission = true;
      let formData = new FormData();
      formData.append("SubmissionId", this.id.toString());
      formData.append("EmployeeId", this.utilityService.IntTryParse(this.aitForm.get('employeeId').value).toString());
      formData.append("FiscalYearId", this.utilityService.IntTryParse(this.aitForm.get('fiscalYearId').value).toString());
      formData.append("CertificateType", this.aitForm.get('certificateType').value);
      formData.append("Amount", this.aitForm.get('amount').value);
      formData.append("IsAuction", this.aitForm.get('isAuction').value);
      formData.append("File", this.aitForm.get('file').value);
      formData.append("FilePath", this.aitForm.get('filePath').value);

      this.employeeAdvancedIncomeTaxSubmissionService.saveBySelf(formData).subscribe(response => {
        if (response?.status) {
          this.utilityService.toastr.success(response?.msg, "Server Response");
          this.closeModal('Save Complete')
        }
        else {
          this.utilityService.toastr.error(response?.msg, "Server Response");
        }
        this.btnAITSubmission = false;
      }, (error) => {
        this.utilityService.httpErrorHandler(error);
        this.btnAITSubmission = false;
      })
    }
    else {
      this.utilityService.fail("Invalid Form Submission", "Site Response");
    }
  }

  uploadFileName: string = "Choose Your file";
  maxSize: number = 300 * 1024;
  fileUpload(file: any) {
    this.logger("file", file);
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
        this.aitForm.get('file').setValue(selectedFile);
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
    this.employeeAdvancedIncomeTaxSubmissionService.getAITById({ SubmissionId: this.id }).subscribe(response => {
      this.employeeAIT = response.body;
      //console.log("this.employeeAIT >>>",this.employeeAIT);
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


