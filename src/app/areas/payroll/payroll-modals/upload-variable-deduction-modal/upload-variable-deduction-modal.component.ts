import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { BsDatepickerConfig } from "ngx-bootstrap/datepicker";
import { AreasHttpService } from "src/app/areas/areas.http.service";
import { ApiArea, ApiController } from "src/app/shared/constants";
import { ControlPanelWebService } from "src/app/shared/services/control-panel.service";
import { CustomModalService } from "src/app/shared/services/custom-modal.service";
import { HrWebService } from "src/app/shared/services/hr-web.service";
import { PayrollWebService } from "src/app/shared/services/payroll-web.service";
import { UserService } from "src/app/shared/services/user.service";
import { UtilityService } from "src/app/shared/services/utility.service";

@Component({
    selector: 'app-payroll-upload-variable-deduction-modal',
    templateUrl: './upload-variable-deduction-modal.component.html'
})

export class UploadVariableDeductionModalComponent implements OnInit {
    datePickerConfig: Partial<BsDatepickerConfig> = {};
    @Output() closeModalEvent = new EventEmitter<string>();

    @ViewChild('uploadMonthlyVariableDeductionModal', { static: true }) uploadMonthlyVariableDeductionModal!: ElementRef;

    constructor(private utilityService: UtilityService, private payrollWebService: PayrollWebService, private controlPanelWebService: ControlPanelWebService, private hrWebService: HrWebService, private fb: FormBuilder,
        private userService: UserService, public modalService: CustomModalService, private areasHttpService: AreasHttpService) {
    }

    ddlYears: any = this.utilityService.getYears(2);
    ddlMonths: any = this.utilityService.getMonths();

    public month: number = parseInt(this.utilityService.currentMonth);
    public year: number = parseInt(this.utilityService.currentYear);

    ngOnInit(): void {
        this.uploadFormInit();
    }

    logger(msg: any, options: any) {
        this.utilityService.consoleLog(msg, options);
    }

    uploadForm: FormGroup;
    excelFileName: string = "";
    uploadFormInit() {
        this.uploadForm = this.fb.group({
            deductionNameId: new FormControl(0, [Validators.min(1)]),
            salaryMonth: new FormControl(this.month, [Validators.min(1)]),
            salaryYear: new FormControl(this.year, [Validators.min(1)]),
            uploadedFile: new FormControl(null, [Validators.required]),
        })

        this.excelFileName = "Choose Your excel file";

        this.loadDeductions();
        this.modalService.open(this.uploadMonthlyVariableDeductionModal, "sm");

    }

    excelFileUpload(file: any) {
        this.logger("file", file);
        const selectedFile = (file.target as HTMLInputElement).files[0];
        this.logger("selectedFile", selectedFile);
        if (selectedFile != null && selectedFile != undefined && (this.utilityService.fileExtension(selectedFile.name) == 'xls' || this.utilityService.fileExtension(selectedFile.name) == 'xlsx')) {
            this.excelFileName = selectedFile.name;
            this.uploadForm.get('uploadedFile').setValue(selectedFile);
        }
        else {
            this.excelFileName = "Choose Your excel file";
        }
    }

    ddlDeductions: any[] = [];

    loadDeductions() {
        this.ddlDeductions = [];
        this.payrollWebService.getDeductionNames<any[]>("").then((data) => {
            this.ddlDeductions = data;
        })
    }

    btnUploadExcel: boolean = false;
    submit() {
        if (this.uploadForm.valid) {
            var formData = new FormData();
            formData.append('DeductionNameId', this.uploadForm.get('deductionNameId').value.toString());
            formData.append('SalaryMonth', this.uploadForm.get('salaryMonth').value.toString());
            formData.append('SalaryYear', this.uploadForm.get('salaryYear').value.toString());
            formData.append('UploadedFile', this.uploadForm.get('uploadedFile').value);

            this.areasHttpService.observable_post<any>((ApiArea.payroll + "/Salary/VariableDeduction" + "/UploadMonthlyVariableDeductions"),
                formData, {}).subscribe(response => {
                    if(response?.status){
                        this.utilityService.success(response.msg,"Server Response");
                        this.closeModal('Save Complete')
                    }
                    else {
                        if (response.msg == "Validation Error") {
                          this.utilityService.fail(response.errors?.duplicateDeduction, "Server Response", 5000);
                        }
                        else {
                          this.utilityService.fail(response.msg, "Server Response")
                        }
                      }
                }, (error) => {
                    this.btnUploadExcel = false;
                    this.utilityService.fail("Something went wrong", "Server Response");
                })

        }
        else {
            this.utilityService.fail("Invalid Form", 'Site Response');
        }
    }

    closeModal(reason: string) {
        this.modalService.service.dismissAll(reason);
        this.closeModalEvent.emit(reason); // fair
    }

}