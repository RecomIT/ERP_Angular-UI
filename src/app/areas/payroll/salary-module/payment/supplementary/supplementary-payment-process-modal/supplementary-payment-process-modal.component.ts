import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { UserService } from "src/app/shared/services/user.service";
import { CustomModalService } from "src/app/shared/services/custom-modal.service";
import { PayrollWebService } from "src/app/shared/services/payroll-web.service";
import { HrWebService } from "src/app/shared/services/hr-web.service";
import { UtilityService } from "src/app/shared/services/utility.service";
import { error } from "console";
import { ApiArea } from "src/app/shared/constants";
import { AreasHttpService } from "src/app/areas/areas.http.service";
import { SupplementaryProcessService } from "../supplementary-process-info/supplementary-process.service";
import { EmployeeInfoService } from "src/app/areas/employee_module/employee/employee-info.service";
import { AllowanceNameService } from "../../../allowance/allowance-head/allowance-name.service";

@Component({
    selector: 'app-payroll-supplementary-payment-process-modal',
    templateUrl: './supplementary-payment-process-modal.component.html'
})

export class SupplementaryPaymentProcessModalComponent implements OnInit {

    @Input() process_id: any = 0;
    @Output() closeModalEvent = new EventEmitter<string>();
    @ViewChild('supplementaryProcessModal', { static: true }) supplementaryProcessModal!: ElementRef;

    select2Config: any = this.utilityService.select2Config();
    datePickerConfig: any = this.utilityService.datePickerConfig();
    ddlPaymentModes: any[] = this.utilityService.getPaymentModes();
    ddlAgents: any[] = this.utilityService.getMobileBankAgents();
    months: any[] = this.utilityService.getMonths();
    years: any[] = this.utilityService.getYears(2);

    currentMonth: any = this.utilityService.currentMonth;
    currentYear: any = this.utilityService.currentYear;
    process_message: string ="";

    constructor(private fb: FormBuilder, private user: UserService,
        private service: SupplementaryProcessService,
        private modalService: CustomModalService,
        private utilityService: UtilityService,
        private areasHttpService: AreasHttpService,
        private payrollWebService: PayrollWebService,
        public hrWebService: HrWebService,
        private supplementaryProcessService: SupplementaryProcessService,
        private employeeInfoService: EmployeeInfoService,
        private allowanceNameService: AllowanceNameService) {

    }
    ngOnInit(): void {
        this.search_form_init()
        this.process_form_init()
        this.openModal();
        this.loadEmployees();
        this.loadAllowances();
        console.log("this.excelFile >>>", this.excelFile);
    }

    search_form: FormGroup;
    isRunProcessDisabled: boolean = true;
    search_form_init() {
        this.search_form = this.fb.group({
            employeeId: new FormControl(0),
            allowanceNameId: new FormControl(0, [Validators.required]),
            paymentMode: new FormControl('', [Validators.required]),
            paymentMonth: new FormControl(this.currentMonth),
            paymentYear: new FormControl(this.currentYear)
        })

        this.search_form.valueChanges.subscribe(value => {
            this.process_form.get('paymentMonth').setValue(this.search_form.get('paymentMonth').value);
            this.process_form.get('paymentYear').setValue(this.search_form.get('paymentYear').value);
            this.process_form.get('paymentMode').setValue(this.search_form.get('paymentMode').value);
        })
    }


    process_form: FormGroup;
    process_form_init() {
        this.process_form = this.fb.group({
            paymentMonth: new FormControl(this.currentMonth, [Validators.min(1), Validators.max(12)]),
            paymentYear: new FormControl(this.currentYear, [Validators.min(2022), Validators.max(2050)]),
            paymentAmountIds: new FormControl(''),
            allowanceNameId: new FormControl(0, [Validators.required]),
            paymentMode: new FormControl('', [Validators.required]),
            processType: new FormControl('Out Of Salary', [Validators.required]),
            showInPayslip: new FormControl(false),
            showInSalarySheet: new FormControl(false),
            withCOC: new FormControl(false)
        })

        this.process_form.get('processType').valueChanges.subscribe(value => {
            if (value == 'Out Of Salary') {
                this.process_form.get('showInPayslip').setValue(false);
                this.process_form.get('showInSalarySheet').setValue(false);
            }
            else {
                this.process_form.get('showInPayslip').setValue(true);
                this.process_form.get('showInSalarySheet').setValue(true);
            }
        })
    }

    list_getSupplementaryAmount: any[] = [];
    paymentAmountIds: any[] = [];
    getSupplementaryAmountsForProcess(params: any) {
        this.paymentAmountIds = [];
        this.list_getSupplementaryAmount = [];
        let filters = params;
        filters.employeeId = params.employeeId == 'null' || params.employeeId == null ? 0 : params.employeeId;
        filters.allowanceNameId = params.allowanceNameId == 'null' || params.allowanceNameId == null ? 0 : params.allowanceNameId;
        this.service.getSupplementaryAmountsForProces(filters).subscribe(response => {
            this.list_getSupplementaryAmount = response.body;
            let payments = []
            this.list_getSupplementaryAmount.forEach(item => {
                payments.push(item.paymentAmountId)
            });
            this.paymentAmountIds = payments;
        })
    }

    downloadExcelFile() {
        let params = { fileName: "Upload_Supplementary_Amount_File.xlsx" };
        this.service.downloadExcelFile(params).subscribe((response: any) => {
            if (response.size > 0) {
                var blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                const link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.download = 'Upload_Supplementary_Amount.xlsx';
                link.click();

            }
            else {
                this.utilityService.warning("No Excel File found");
            }
        }, (error) => {
            this.utilityService.fail("Something went wrong", "Server Response")

        })
    }

    logger(arg0: string, file: any) {
        throw new Error("Method not implemented.");
    }

    fileExtension(fileName: string) {
        var name = fileName.split('.')
        return name[1].toString();
    }

    excelFileName: string = "Choose Your excel file";
    excelFile: any = null;
    excelFileUpload(file: any) {
        this.excelFile = null;
        const selectedFile = (file.target as HTMLInputElement).files[0];
        if (selectedFile != null && selectedFile != undefined && (this.fileExtension(selectedFile.name) == 'xls' ||
            this.fileExtension(selectedFile.name) == 'xlsx')) {
            this.excelFileName = selectedFile.name;
            this.excelFile = selectedFile;
        }
        else {
            this.excelFileName = "Choose Your excel file";
        }
    }

    btnUploadExcel: boolean = false;
    UploadExcelFile() {
        if (this.excelFile != null) {
            this.btnProcess = true;
            this.process_message="File is being uploaded.";
            var formData = new FormData();
            this.list_getSupplementaryAmount = [];
            formData.append('File', this.excelFile);
            this.areasHttpService.observable_post<any>((ApiArea.payroll + "/Salary/SupplementaryPayment" + "/UploadExcelFile"), formData, {})
                .subscribe(response => {
                    this.list_getSupplementaryAmount = response;
                    //console.log("this.list_getSupplementaryAmount >>>", this.list_getSupplementaryAmount);
                    this.btnProcess = false;
                }, (error) => {
                    //console.log("error >>>", error);
                    this.utilityService.fail("Something went wrong", "Server Response");
                    this.btnProcess = false;
                })
        }
        else {
            this.utilityService.fail("Invalid Form", 'Site Response');
        }

    }

    openModal() {
        this.modalService.open(this.supplementaryProcessModal, "xl");
    }


    btnProcess: boolean = false;
    submit() {
        if (this.process_form.valid && this.excelFileName != "Choose Your excel file" && this.btnProcess == false) {
            if (this.list_getSupplementaryAmount != null) {
                this.btnProcess = true;
                this.process_message="Payment is being processed.";
                let params = {
                    paymentMonth: this.process_form.get('paymentMonth').value,
                    paymentYear: this.process_form.get('paymentYear').value,
                    allowanceNameId: this.process_form.get('allowanceNameId').value,
                    paymentMode: this.process_form.get('paymentMode').value,
                    processType: this.process_form.get('processType').value,
                    showInPayslip: this.process_form.get('showInPayslip').value,
                    showInSalarySheet: this.process_form.get('showInSalarySheet').value,
                    withCOC: this.process_form.get('withCOC').value,
                    payments: []
                }
                let payments = [];
                this.list_getSupplementaryAmount.forEach(item => {
                    payments.push({
                        employeeCode: item.employeeCode,
                        employeeName: item.employeeName,
                        designation: item.designation,
                        employeeId: item.employeeId,
                        amount: item.amount,
                    })
                });
                params.payments = payments;

                this.supplementaryProcessService.process(params).subscribe({
                    next: (response) => {
                        this.utilityService.success(response.msg);
                        this.closeModal('Save Complete');
                        this.btnProcess = false;                        
                    },
                    error: (error) => {
                        this.utilityService.fail(error?.msg);
                        this.btnProcess = false;
                    }
                })
            }
        }
        else {
            this.utilityService.fail("Invalid Form Submission", "Site Response");
        }
    }



    getMonthName(monthNo: any) {
        let monthObj = this.utilityService.getMonths().find(item => item.monthNo == monthNo);
        return monthObj?.month;
    }

    ddlAllowances: any[] = []
    loadAllowances() {
        this.allowanceNameService.loadAllowanceNameDropdown();
        this.allowanceNameService.ddl$.subscribe(data => {
            this.ddlAllowances = data;
        })
    }

    ddlEmployees: any[] = [];
    loadEmployees() {
        this.employeeInfoService.loadDropdownData({});
        this.employeeInfoService.ddl_employee_data$.subscribe(data => {
            this.employeeInfoService.loadDropdown(data);
            this.ddlEmployees = this.employeeInfoService.ddl$;
        }, error => {
            console.error('Error while fetching data:', error);
        });
    }

    closeModal(reason: any) {
        this.modalService.service.dismissAll(reason);
        this.closeModalEvent.emit(reason);
    }

    removeItem(index: any) {
        this.list_getSupplementaryAmount.splice(index, 1);
        this.paymentAmountIds.splice(index, 1);
    }

    editItem(item: any) {
        item.isEdit = true;
    }

    editChange(item: any) {
        item.isEdit = false;
    }




}