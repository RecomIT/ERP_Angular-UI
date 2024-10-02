import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from "@angular/core";
import { ActualTaxDeductionService } from "../../tax-module/actual-tax-deduction/actual-tax-deduction.component.service";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { UtilityService } from "src/app/shared/services/utility.service";
import { CustomModalService } from "src/app/shared/services/custom-modal.service";
import { HrWebService } from "src/app/shared/services/hr-web.service";
import { DatePipe } from "@angular/common";

@Component({
    selector:'app-payroll-upload-employee-tax-deduction',
    templateUrl:'./upload-employee-tax-deduction.component.html'
})

export class UploadEmployeeTaxDeductionComponent implements OnInit{

    @Output() closeModalEvent = new EventEmitter<string>();
    @ViewChild('uploadEmployeeTaxDeductionModal', { static: true }) uploadEmployeeTaxDeductionModal!: ElementRef;


    constructor(private fb: FormBuilder,
        public utilityService: UtilityService,
        public modalService: CustomModalService,
        private hrService: HrWebService,
        private datePipe: DatePipe,private actualTaxDeductionService: ActualTaxDeductionService){}
    ngOnInit(): void {
        this.uploadFormInit();
    }


    uploadForm: FormGroup;

    months: any[] = this.utilityService.getMonths();
    years: any[] = this.utilityService.getYears(2);

    uploadFormInit() {
        this.uploadForm = this.fb.group({
            salaryMonth: new FormControl(0,[Validators.min(1),Validators.max(12)]),
            salaryYear: new FormControl(0,[Validators.min(2020),Validators.max(2050)]),
            uploadFile: new FormControl()
        })
        this.openModal();
    }

    excelFileName: string = "Choose Your excel file";
    excelFileUpload(file: any) {
        const selectedFile = (file.target as HTMLInputElement).files[0];
        if (selectedFile != null && selectedFile != undefined 
            && (this.utilityService.fileExtension(selectedFile.name) == 'xls' || this.utilityService.fileExtension(selectedFile.name) == 'xlsx')) {
            this.excelFileName = selectedFile.name;
            this.uploadForm.get('uploadFile').setValue(selectedFile);
        }
        else {
            this.excelFileName = "Choose Your excel file";
        }
    }

    openModal(){
        this.modalService.open(this.uploadEmployeeTaxDeductionModal,"sm");
    }


    submit() {
        if (this.uploadForm.valid && this.uploadForm.get('uploadFile').value != null) {
            var formData = new FormData();
            formData.append("SalaryMonth", this.uploadForm.get('salaryMonth').value.toString());
            formData.append("SalaryYear", this.uploadForm.get('salaryYear').value.toString());
            formData.append("File", this.uploadForm.get('uploadFile').value);

            this.actualTaxDeductionService.uploadActualDeductedTax(formData).subscribe(response => {
                console.log("response >>>", response);
            }, error => {
                console.log("error >>>", error);
                this.utilityService.fail("Something went wrong", "Server Response");
            })
        }
        else {
            this.utilityService.fail("Invalid Form", 'Site Response');
        }
    }

    closeModal(reason: any){
        this.modalService.service.dismissAll(reason);
        this.closeModalEvent.emit(reason);
    }
}