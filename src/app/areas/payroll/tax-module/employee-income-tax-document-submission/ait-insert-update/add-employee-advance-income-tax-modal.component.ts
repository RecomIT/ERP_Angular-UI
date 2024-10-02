import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CustomModalService } from 'src/app/shared/services/custom-modal.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { EmployeeInfoService } from "src/app/areas/employee_module/employee/employee-info.service";
import { FiscalYearService } from "../../../salary-module/setup/fiscalYear/fiscalYear.service";
import { EmployeeAdvancedIncomeTaxSubmissionService } from "../employee-advance-income-tax-submission.service";

@Component({
  selector: 'app-payroll-add-employee-advance-income-tax-modal',
  templateUrl: './add-employee-advance-income-tax-modal.component.html'
})
export class AddEmployeeAdvanceIncomeTaxModalComponent implements OnInit {

  @Input() id: any = 0;
  @Output() closeModalEvent = new EventEmitter<string>();

  @ViewChild('modal', { static: true }) aitModal!: ElementRef;
  modalTitle: string = "Add Employee Advance Income Tax";

  constructor(private fb: FormBuilder,
    public utilityService: UtilityService,
    public modalService: CustomModalService,
    private employeeAdvancedIncomeTaxSubmissionService: EmployeeAdvancedIncomeTaxSubmissionService,
    private employeeInfoService: EmployeeInfoService,
    private fiscalYearService: FiscalYearService) {
  }
  ngOnInit(): void {
    this.modalTitle = this.id > 0 ? "Update Employee AIT" : "Add Employee AIT";
    this.loadEmployees();
    this.loadFiscalYears();
    this.modalService.open(this.aitModal, "lg");
    //console.log("this.submissionId init", this.id);
    if (this.id > 0) {
      this.getEmployeeTaxDocumentById();
    }
    this.formInit();

  }

  select2Options = this.utilityService.select2Config();

  ddlEmployees: any[];
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


  ddlFiscalYears: any[] = [];
  loadFiscalYears() {
    this.ddlFiscalYears = [];
    this.fiscalYearService.loadDropdown();
    this.fiscalYearService.ddl$.subscribe(response => {
      this.ddlFiscalYears = response;
    })
  }

  logger(msg: any, options: any) {
    this.utilityService.consoleLog(msg, options);
  }

  formErrors = {
    'employeeId': '',
    'fiscalYearId': '',
    'certificateType': '',
    'amount': ''
  };

  validationMessages = {
    'employeeId': {
      'min': 'Field is required',
      'required': 'Field is required'
    },
    'fiscalYearId': {
      'min': 'Field is required',
      'required': 'Field is required'
    },
    'certificateType': {
      'required': 'Field is required'
    },
    'amount': {
      'min': 'Amount should be greater then 0',
      'required': 'Amount should be greater then 0'
    }
  }

  logFormErrors(formGroup: FormGroup = this.form): boolean {
    let isValid = true;
    Object.keys(formGroup.controls).forEach((key: string) => {
      const abstractControl = formGroup.get(key);
      this.formErrors[key] = '';
      if (abstractControl && !abstractControl.valid) {
        const messages = this.validationMessages[key];
        for (const errorKey in abstractControl.errors) {
          console.log("key >>", key);
          console.log("errorKey >>", errorKey);
          this.formErrors[key] += messages[errorKey];
          isValid = false;
        }
      }
    })
    return isValid;
  }

  form: FormGroup;
  formInit() {
    this.form = this.fb.group({
      submissionId: new FormControl(this.id ?? 0),
      employeeId: new FormControl(0, [Validators.min(1), Validators.required]),
      fiscalYearId: new FormControl(0, [Validators.min(1), Validators.required]),
      certificateType: new FormControl('AIT', [Validators.required]),
      amount: new FormControl(0, [Validators.min(1), Validators.required]),
      isAuction: new FormControl(false),
      filePath: new FormControl(),
      file: new FormControl()
    })

    this.form.valueChanges.subscribe(value => {
      this.logFormErrors();
    })
  }

  employeeAIT: any = null;
  setFormValues() {
    this.form.get('submissionId').setValue(this.employeeAIT?.submissionId);
    this.form.get('employeeId').setValue(this.employeeAIT?.employeeId);
    this.form.get('fiscalYearId').setValue(this.employeeAIT?.fiscalYearId);
    this.form.get('certificateType').setValue(this.employeeAIT?.certificateType);
    this.form.get('amount').setValue(this.employeeAIT?.amount);
    this.form.get('isAuction').setValue(this.employeeAIT?.isAuction);
    this.form.get('filePath').setValue(this.employeeAIT?.filePath);
  }

  btnSubmit: boolean = false;
  submit() {
    if (this.form.valid) {
      this.btnSubmit = true;
      let formData = new FormData();
      formData.append("SubmissionId", this.id.toString());
      formData.append("EmployeeId", this.utilityService.IntTryParse(this.form.get('employeeId').value).toString());
      formData.append("FiscalYearId", this.utilityService.IntTryParse(this.form.get('fiscalYearId').value).toString());
      formData.append("CertificateType", this.form.get('certificateType').value);
      formData.append("Amount", this.form.get('amount').value);
      formData.append("IsAuction", this.form.get('isAuction').value);
      formData.append("File", this.form.get('file').value);
      formData.append("FilePath", this.form.get('filePath').value);

      this.employeeAdvancedIncomeTaxSubmissionService.save(formData).subscribe(response => {
        if (response?.status) {
          this.btnSubmit = false;
          this.utilityService.toastr.success(response?.msg, "Server Response");
          this.closeModal('Save Complete')
        }
        else {
          this.btnSubmit = false;
          this.utilityService.toastr.error(response?.msg, "Server Response");
        }
      }, (error) => {
        this.utilityService.httpErrorHandler(error);
        this.btnSubmit = false;
      })
    }
    else {
      this.utilityService.fail("Invalid Form Submission", "Site Response");
    }
  }

  uploadFileName: string = "Choose Your PDF file";
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
      this.uploadFileName = selectedFile.name;
      this.form.get('file').setValue(selectedFile);
    }
    else {
      this.uploadFileName = "Choose Your PDF file";
    }
  }

  getEmployeeTaxDocumentById() {
    this.employeeAdvancedIncomeTaxSubmissionService.getById({ id: this.id }).subscribe(response => {
      this.employeeAIT = response.body;
      console.log("this.employeeAIT >>>", response.body)
      this.setFormValues();
    }, (error) => {
      this.utilityService.httpErrorHandler(error);
    })
  }

  closeModal(reason: string) {
    this.modalService.service.dismissAll(reason);
    this.closeModalEvent.emit(reason); // fire
  }

}


