import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { CustomModalService } from "src/app/shared/services/custom-modal.service";
import { UtilityService } from "src/app/shared/services/utility.service";
import { FiscalYearService } from "../../../salary-module/setup/fiscalYear/fiscalYear.service";
import { esLocale } from "ngx-bootstrap/chronos";
import { EmployeeAdvancedIncomeTaxSubmissionService } from "../employee-advance-income-tax-submission.service";
import { WebFileService } from "src/app/areas/common-services/web-file.service";
import { EmployeeTaxRefundService } from "../employee-tax-refund.service";

@Component({
    selector: 'app-payroll-upload-tax-document',
    templateUrl: './tax-document-upload.component.html'
})

export class TaxDocumentUploadComponent implements OnInit {

    @Output() closeModalEvent = new EventEmitter<string>();

    @ViewChild('modal', { static: true }) modal!: ElementRef;

    constructor(
        private utilityService: UtilityService,
        private modalService: CustomModalService,
        private fb: FormBuilder,
        private fiscalYearService: FiscalYearService,
        private aitService: EmployeeAdvancedIncomeTaxSubmissionService,
        private fileService: WebFileService,
        private employeeTaxRefundService: EmployeeTaxRefundService
    ) {

    }

    ngOnInit(): void {
        this.loadFiscalYears();
        this.openModal();
    }

    openModal() {
        this.formInit();
        this.modalService.open(this.modal, "sm");
    }

    certificate_types: any[] = [
        {
            text: 'AIT',
            value: 'AIT'
        },
        {
            text: 'Tax Refund',
            value: 'CET'
        },
    ]

    ddlFiscalYears: any[] = [];
    loadFiscalYears() {
        this.ddlFiscalYears = [];
        this.fiscalYearService.loadDropdown();
        this.fiscalYearService.ddl$.subscribe(response => {
            this.ddlFiscalYears = response;
        })
    }


    form: FormGroup;

    formInit() {
        this.form = this.fb.group({
            fiscalYearId: new FormControl(0, [Validators.required, Validators.min(1)]),
            certificateType: new FormControl('', [Validators.required]),
            file: new FormControl(null, [Validators.required]),
        })

        this.form.valueChanges.subscribe(value => {
            this.logFormErrors();
        })
    }

    formErrors = {
        'fiscalYearId': '',
        'certificateType': '',
        'file': ''
    };

    download() {
        let fileName = "Upload_AIT_OR_TAX_Refund.xlsx";
        let params = { fileName: fileName };
        this.fileService.downloadFormatExcelFile(params).subscribe(
            {
                next: (response) => {
                    if (response.size > 0) {
                        this.utilityService.downloadFile(response, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', fileName)
                    }
                },
                error: (error) => {
                }
            }
        );
    }

    validationMessages = {
        'fiscalYearId': {
            'min': 'Field is required',
            'required': 'Field is required'
        },
        'certificateType': {
            'required': 'Field is required'
        },
        'file': {
            'required': 'File is required'
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
                    this.formErrors[key] += messages[errorKey];
                    isValid = false;
                }
            }
        })
        return isValid;
    }

    excelFileName: string = "Choose only Excel file";
    fileUpload(file: any) {
        const selectedFile = (file.target as HTMLInputElement).files[0];
        if (selectedFile != null
            && selectedFile != undefined
            && (this.utilityService.fileExtension(selectedFile.name) == 'xlsx'
                || this.utilityService.fileExtension(selectedFile.name) == 'xls')) {
            this.excelFileName = selectedFile.name;
            this.form.get('file').setValue(selectedFile);
        }
        else {
            this.excelFileName = "Choose only Excel file";
        }
    }

    btnSubmit: boolean = false;
    submit() {
        if (this.form.valid && this.btnSubmit == false) {
            this.btnSubmit = true;
            let certificateType = this.form.get('certificateType').value;
            let formData = new FormData();
            formData.append("FiscalYearId", this.utilityService.IntTryParse(this.form.get('fiscalYearId').value).toString());
            formData.append("CertificateType", this.form.get('certificateType').value);
            formData.append("File", this.form.get('file').value);

            if (certificateType == "AIT") {

                this.aitService.uploadAIT(formData).subscribe({
                    next: (response) => {
                        this.btnSubmit = false;
                        this.utilityService.toastr.success(response?.msg, "Server Response");
                        this.closeModal('Save Complete')
                    },
                    error: (error) => {
                        if (typeof error.msg === 'object') {
                            this.utilityService.fail(error.msg?.msg, "Server Response");
                        }
                        else {
                            this.utilityService.fail(error.msg, "Server Response");
                        }
                        this.btnSubmit = false;
                    },
                })
            }
            if (certificateType == "CET") {
                this.employeeTaxRefundService.uploadRefund(formData).subscribe({
                    next: (response) => {
                        this.btnSubmit = false;
                        this.utilityService.toastr.success(response?.msg, "Server Response");
                        this.closeModal('Save Complete')
                    },
                    error: (error) => {
                        if (typeof error.msg === 'object') {
                            this.utilityService.fail(error.msg?.msg, "Server Response");
                        }
                        else {
                            this.utilityService.fail(error.msg, "Server Response");
                        }
                        this.btnSubmit = false;
                    },
                })
            }
        }
        else {
            this.utilityService.fail("One or more form field is invalid", "Site Response")
        }
    }

    closeModal(reason: any) {
        if (this.btnSubmit == false) {
            this.modalService.service.dismissAll(reason);
            this.closeModalEvent.emit(reason); // fire
        }
    }


}