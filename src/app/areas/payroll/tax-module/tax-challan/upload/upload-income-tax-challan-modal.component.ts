import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { UtilityService } from "src/app/shared/services/utility.service";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { CustomModalService } from "src/app/shared/services/custom-modal.service";
import { transition, trigger, useAnimation } from "@angular/animations";
import { bounceIn, fadeIn, fadeInRight, slideInUp } from "ng-animate";
import { FiscalYearService } from "src/app/areas/payroll/salary-module/setup/fiscalYear/fiscalYear.service";
import { TaxChallanService } from "../tax-challan.service";

@Component({
    selector: 'app-payroll-upload-income-tax-challan-modal',
    templateUrl: './upload-income-tax-challan-modal.component.html',
    animations: [
        trigger('slideInUp', [transition('* => *', useAnimation(slideInUp, { params: { timing: 0.5 } }))]),
        trigger('fadeIn', [transition('void => *', useAnimation(fadeIn, { params: { timing: 0.3 } }))]),
        trigger('fadeInRight', [transition('void => *', useAnimation(fadeInRight, { params: { timing: 0.5 } }))]),
        trigger('bounceIn', [transition('void => *', useAnimation(bounceIn, { params: { timing: 1 } }))]),
    ]
})
export class UploadIncomeTaxChallanModalComponent implements OnInit {

    @ViewChild('uploadIncomeTaxChallanModal', { static: true }) uploadIncomeTaxChallanModal!: ElementRef;
    @Input() month: number = 0;
    @Input() year: number = 0;
    @Input() fiscalYearId: number = 0;
    @Output() closeModalEvent = new EventEmitter<string>();
    modalTitle: string = "";

    constructor(private utilityService: UtilityService,
        private fb: FormBuilder,
        private modalService: CustomModalService,
        private service: TaxChallanService,
        private fiscalYearService: FiscalYearService,
    ) { }

    ngOnInit(): void {
        this.formInit();
        this.openModal();
        this.loadFiscalYearDropdown();
    }
    select2Config = this.utilityService.select2Config();
    months: any[] = this.utilityService.getMonths();
    years: any[] = this.utilityService.getYears(2);


    isTaxMonthDisabled: boolean = true;
    isTaxYearDisabled: boolean = true;
    isFiscalYearDisabled: boolean = true;

    ddlFiscalYearDropdown: any[] = [];
    loadFiscalYearDropdown() {
        this.fiscalYearService.loadDropdown();
        this.fiscalYearService.ddl$.subscribe(response => {
            this.ddlFiscalYearDropdown = response;
            this.count++;
            console.log("this.count >>>", this.count);
        })
    }

    count: number = 0;

    openModal() {
        this.modalService.open(this.uploadIncomeTaxChallanModal, "sm");
    }

    closeModal(reason: any) {
        this.closeModalEvent.emit(reason);
        this.modalService.service.dismissAll(reason);
    }

    download() {
        this.service.downloadIncomeTaxChallanFormat().subscribe((response): any => {
            if (response.size > 0) {
                this.utilityService.downloadFile(response, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', "Tax-Challan-Uploader.xlsx")
            }
            else {
                this.utilityService.warning("No Excel File found");
            }
        }, (error) => {
            this.utilityService.httpErrorHandler(error);
        })
    }

    form: FormGroup;
    formInit() {
        this.form = this.fb.group({
            taxMonth: new FormControl(this.month, [Validators.required]),
            taxYear: new FormControl(this.year, [Validators.required]),
            fiscalYearId: new FormControl(this.fiscalYearId, [Validators.required]),
            file: new FormControl(null, [Validators.required])
        })
    }



    btnSubmit: boolean = false;
    submit() {
        if (this.form.valid) {
            this.btnSubmit = true;
            let formData = new FormData();
            formData.append("taxMonth", this.form.get('taxMonth').value);
            formData.append("taxYear", this.form.get('taxYear').value);
            formData.append("fiscalYearId", this.form.get('fiscalYearId').value);
            formData.append("file", this.form.get('file').value);

            this.service.uploadChallan(formData).subscribe(response => {
                this.btnSubmit = false;
                if (response?.status) {
                    this.utilityService.success(response?.msg, "Server Response");
                    this.closeModal(this.utilityService.SuccessfullySaved);
                }
            }, (error) => {
                this.btnSubmit = false;
                this.utilityService.fail("Something went wrong", "Server Response");
            })
        }
        else {
            this.utilityService.fail("Invalid Form Submission", "Site Response");
        }
    }


    excelFile: any;
    excelFileName: string = "Click here to choose excel file";
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
            this.excelFileName = "Choose Your PDF/JPG/PNG file";
        }
    }




}
