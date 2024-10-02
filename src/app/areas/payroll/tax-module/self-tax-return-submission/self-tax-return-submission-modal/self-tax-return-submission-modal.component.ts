import { DatePipe } from "@angular/common";
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { BsDatepickerConfig } from "ngx-bootstrap/datepicker";
import { TaxReturnSubmissioinService } from "src/app/areas/payroll-services/tax-return-submission/tax-return-submission.service";
import { CustomModalService } from "src/app/shared/services/custom-modal.service";
import { PayrollWebService } from "src/app/shared/services/payroll-web.service";
import { UserService } from "src/app/shared/services/user.service";
import { UtilityService } from "src/app/shared/services/utility.service";

@Component({
    selector: "app-payroll-self-tax-return-submission-modal",
    templateUrl: './self-tax-return-submission-modal.component.html'
})

export class SelfTaxReturnSubmissionModal implements OnInit {
    @Input() id: number = 0;
    @Output() closeModalEvent = new EventEmitter<string>();
    @ViewChild('taxreturnsubmission', { static: true }) yearinvestmentmodal!: ElementRef;

    datePickerConfig: Partial<BsDatepickerConfig> = {};

    constructor(private utilityService: UtilityService, private fb: FormBuilder,
        private datePipe: DatePipe,
        private userService: UserService, public modalService: CustomModalService,
        private taxReturnSubmissioinService: TaxReturnSubmissioinService, private payrollWebService: PayrollWebService) { }

    ngOnInit(): void {
        this.saveFormInit();
        this.openModal();
        this.getCurrentFiscalYear();

        this.datePickerConfig = Object.assign({}, {
            containerClass: "theme-dark-blue",
            showWeekNumbers: false,
            dateInputFormat: "DD-MMMM-YYYY",
            isAnimated: true,
            showClearButton: false,
            showTodayButton: false,
            todayPosition: "left",
            rangeInputFormat: "DD-MMM-YYYY",
            rangeSeparator: " ~ ",
            size: "sm",
            customTodayClass: 'custom-today-class'
        })
    }

    saveForm: FormGroup;

    saveFormInit() {
        this.saveForm = this.fb.group({
            taxSubmissionId: new FormControl(this.id),
            employeeId: new FormControl(this.User().EmployeeId, [Validators.min(1)]),
            fiscalYearId: new FormControl(0, [Validators.min(1)]),
            registrationNo: new FormControl('', [Validators.required]),
            taxZone: new FormControl('', [Validators.required]),
            taxCircle: new FormControl('', [Validators.required]),
            paidAmount: new FormControl(0, [Validators.min(1)]),
            taxPayable: new FormControl(0, [Validators.min(1)]),
            submissionDate: new FormControl(null, [Validators.required]),
            filePath: new FormControl(''),
            file: new FormControl(null, [Validators.required])
        })
    }

    fiscal_year_range: string = "";
    current_fiscal_year: any;
    getCurrentFiscalYear() {
        this.current_fiscal_year = this.payrollWebService.getCurrentFiscalYear<any>().then(data => {
            this.current_fiscal_year = data;
            console.log("current_fiscal_year >>>", this.current_fiscal_year);
            this.saveForm.get('fiscalYearId').setValue(this.current_fiscal_year.fiscalYearId);
            this.fiscal_year_range = this.current_fiscal_year.fiscalYearRange;
        })
    }

    User() {
        return this.userService.User();
    }

    openModal() {
        this.modalService.open(this.yearinvestmentmodal, 'lg');
    }

    closeModal(reason: any) {
        this.modalService.service.dismissAll(reason);
        this.closeModalEvent.emit(reason)
    }

    btnSave: boolean = false;
    submit() {
        if (this.saveForm.valid) {
            this.btnSave = true;
            var formData = new FormData();
            formData.append("TaxSubmissionId", this.saveForm.get('taxSubmissionId').value);
            formData.append("EmployeeId", this.User().EmployeeId.toString());
            formData.append("FiscalYearId", this.saveForm.get('fiscalYearId').value.toString());
            formData.append("RegistrationNo", this.saveForm.get('registrationNo').value.toString());
            formData.append("TaxZone", this.saveForm.get('taxZone').value.toString());
            formData.append("TaxCircle", this.saveForm.get('taxCircle').value.toString());
            formData.append("PaidAmount", this.saveForm.get('paidAmount').value.toString());
            formData.append("TaxPayable", this.saveForm.get('taxPayable').value.toString());
            formData.append("SubmissionDate", this.datePipe.transform(this.saveForm.get('submissionDate').value.toUTCString(), "yyyy-MM-dd"));

            formData.append("File", this.saveForm.get('file').value);
            formData.append("FilePath", this.saveForm.get('filePath').value.toString());


            this.taxReturnSubmissioinService.saveEmployeeTaxReturnSubmission(formData).subscribe(response => {

                this.btnSave = false;
                if (response?.status) {
                    this.utilityService.success(response.msg, 'Server Response')
                    this.closeModal('Save Successful')
                }
                else {
                    this.utilityService.fail(response.msg, 'Server Response')
                }
            }, error => {
                this.btnSave = false;
                this.utilityService.fail('Something went wrong', 'Server Response');
            })
        }
        else{
            this.utilityService.fail('Invalid Form Submission', 'Site Response');
        }
    }

    logger(msg: any, options: any) {
        this.utilityService.consoleLog(msg, options);
    }

    uploadFileName: string = "Choose Your PDF/JPG/PNG file";
    fileUpload(file: any) {
        this.logger("file", file);
        const selectedFile = (file.target as HTMLInputElement).files[0];
        this.logger("selectedFile", selectedFile);
        if (selectedFile != null
            && selectedFile != undefined
            && (this.utilityService.fileExtension(selectedFile.name) == 'pdf'
                || this.utilityService.fileExtension(selectedFile.name) == 'jpg'
                || this.utilityService.fileExtension(selectedFile.name) == 'png')) {
            this.uploadFileName = selectedFile.name;
            this.saveForm.get('file').setValue(selectedFile);
        }
        else {
            this.uploadFileName = "Choose Your PDF/JPG/PNG file";
        }
    }
}