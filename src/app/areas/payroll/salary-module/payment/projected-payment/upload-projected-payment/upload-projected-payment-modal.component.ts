import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from "@angular/core";
import { UtilityService } from "src/app/shared/services/utility.service";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { CustomModalService } from "src/app/shared/services/custom-modal.service";
import { ProjectedPaymentService } from "../projected-payment.service";
import { FiscalYearService } from "../../../setup/fiscalYear/fiscalYear.service";
import { AllowanceNameService } from "../../../allowance/allowance-head/allowance-name.service";
import { transition, trigger, useAnimation } from "@angular/animations";
import { bounceIn, fadeIn, fadeInRight, slideInUp } from "ng-animate";
@Component({
    selector: 'app-payroll-upload-projected-payment-modal',
    templateUrl: './upload-projected-payment-modal.component.html',
    animations: [
        trigger('slideInUp', [transition('* => *', useAnimation(slideInUp, { params: { timing: 0.5 } }))]),
        trigger('fadeIn', [transition('void => *', useAnimation(fadeIn, { params: { timing: 0.3 } }))]),
        trigger('fadeInRight', [transition('void => *', useAnimation(fadeInRight, { params: { timing: 0.5 } }))]),
        trigger('bounceIn', [transition('void => *', useAnimation(bounceIn, { params: { timing: 1 } }))]),
    ]
})

export class UploadProjectedPaymentModalComponent implements OnInit {

    @Output() closeModalEvent = new EventEmitter<string>();
    @ViewChild('uploadProjectedPaymentModal', { static: true }) uploadProjectedPaymentModal!: ElementRef;
    constructor(private utilityService: UtilityService,
        private fb: FormBuilder,
        private projectedPaymentService: ProjectedPaymentService,
        private modalService: CustomModalService,
        private fiscalYearService: FiscalYearService,
        private allowanceNameService: AllowanceNameService) {

    }
    ngOnInit(): void {
        this.formInit();
        this.loadFiscalYearDropdown();
        this.loadAllowancesDropdown();
        this.openModal();
    }
    select2Config = this.utilityService.select2Config();

    download_format() {

    }

    ddlFiscalYearDropdown: any[] = [];
    loadFiscalYearDropdown() {
        this.fiscalYearService.loadDropdown();
        this.fiscalYearService.ddl$.subscribe(response => {
            this.ddlFiscalYearDropdown = response;
        })
    }

    ddlAllowances: any[] = [];
    loadAllowancesDropdown() {
        this.allowanceNameService.loadAllowanceNameDropdown();
        this.allowanceNameService.ddl$.subscribe(data => {
            this.ddlAllowances = data;
        }, (error) => {
            console.log("error  while fetching data >>>", error);
        })
    }


    openModal() {
        this.modalService.open(this.uploadProjectedPaymentModal, "lg");
    }

    closeModal(reason: any) {
        if (this.btnSubmit == false) {
            this.closeModalEvent.emit(reason);
            this.modalService.service.dismissAll(reason);
        }
        else {
            this.utilityService.fail("Something is running in this page, So You can not close this page now", "Site Response")
        }
    }

    download() {
        this.projectedPaymentService.downloadFormat().subscribe(response => {
            if (response.size > 0) {
                this.utilityService.downloadFile(response, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', "projected-payment-uploader.xlsx")
            }
            else {
                this.utilityService.warning("No Excel File found");
            }
        }, (error) => {
            this.utilityService.httpErrorHandler(error);
        })
    }

    formErrors = {
        'allowanceNameId': '',
        'allowanceReason': '',
        'payableYear': '',
        'selectedEmployees': '',
        'file': ''
    };

    validationMessages = {
        'allowanceNameId': {
            'min': 'Field is required',
            'required': 'Field is required'
        },
        'allowanceReason': {
            'required': 'Field is required',
            'maxLength': 'Field max character length is 150'
        },
        'payableYear': {
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

    excelFile: any;
    excelFileName: string = "Click here to choose excel file";

    form: FormGroup;

    currentYear: number = parseInt(this.utilityService.currentYear);
    ddlYears: any = this.utilityService.getYearsUp(2);//this.utilityService.getYears(2);
    reasons: string[] = ["Eid Ul Fitr", "Eid Ul Adha", "Yearly Bonus", "Half Yearly Bonus", "Durga Puja", "Christmas", "New Year Bonus"];
    formInit() {
        this.form = this.fb.group({
            allowanceNameId: new FormControl(0, [Validators.min(1)]),
            payableYear: new FormControl(this.currentYear, [Validators.min(1)]),
            allowanceReason: new FormControl('', [Validators.required]),
            file: new FormControl(null, [Validators.required])
        })

        this.form.valueChanges.subscribe(value => {
            this.logFormErrors();
        })
    }

    btnSubmit: boolean = false;
    submit() {
        if (this.form.valid && this.btnSubmit == false) {
            this.btnSubmit = true;
            let formData = new FormData();
            formData.append("allowanceNameId", this.form.get('allowanceNameId').value.toString());
            formData.append("payableYear", this.form.get('payableYear').value.toString());
            formData.append("allowanceReason", this.form.get('allowanceReason').value.toString());
            formData.append("file", this.form.get('file').value);

            this.projectedPaymentService.upload(formData).subscribe({
                next: (response) => {
                    this.btnSubmit = false;
                    this.utilityService.success(response.body.msg, "Server Response");
                    this.closeModal(this.utilityService.SuccessfullySaved)
                },
                error: (error) => {
                    if (typeof error.msg === 'object') {
                        this.utilityService.fail(error.msg?.msg, "Server Response");
                    }
                    else {
                        this.utilityService.fail(error.msg, "Server Response");
                    }
                    this.btnSubmit = false;
                }
            })
        }
        else {
            this.utilityService.fail("Invalid Form Submission", "Site Response");
        }
    }

    file_selected(file: any) {
        const selectedFile = (file.target as HTMLInputElement).files[0];
        if (selectedFile != null
            && selectedFile != undefined
            && (this.utilityService.fileExtension(selectedFile.name) == 'xls'
                || this.utilityService.fileExtension(selectedFile.name) == 'xlsx')) {
            this.excelFileName = selectedFile.name;
            this.excelFile = selectedFile;
            this.form.get('file').setValue(this.excelFile);
        }
        else {
            this.excelFileName = "Choose only XLS/XLSX file";
        }
    }

}