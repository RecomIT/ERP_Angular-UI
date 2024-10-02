import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { UtilityService } from "src/app/shared/services/utility.service";
import { CustomModalService } from "src/app/shared/services/custom-modal.service";
import { SupplementaryProcessService } from "../supplementary-process-info/supplementary-process.service";

@Component({
    selector: 'app-supplementary-payment-disbursed-modal',
    templateUrl: './supplementary-payment-disbursed-modal.component.html'
})

export class SupplementaryPaymentDisbursedModalComponent implements OnInit {

    @Input() id: number = 0;
    @Output() closeModalEvent = new EventEmitter<string>();
    @ViewChild('modal', { static: true }) supplementaryProcessModal!: ElementRef;

    modalTitle: string ="Payment Disbursed / Undo";

    datePickerConfig: any = this.utilityService.datePickerConfig();
    constructor(
        private service: SupplementaryProcessService,
        private utilityService: UtilityService,
        private modalService: CustomModalService
    ) {
    }
    paymentMonth: string;
    paymentDate: any = null;
    ngOnInit(): void {

        this.get();
        this.openModal();
    }

    openModal() {
        this.modalService.open(this.supplementaryProcessModal, "xl");
    }

    info: any = null;
    list_getSupplementaryAmount: any = null;
    get() {
        this.service.undisbursedPayments(this.id).subscribe({
            next: (response) => {
                this.info = response.body.info;
                this.modalTitle = this.info.stateStatus == "Pending" ? this.modalTitle : "Payment Details"
                this.datePickerConfig.minDate = this.utilityService.getFirstDate(this.info.paymentMonth, this.info.paymentYear);
                this.datePickerConfig.maxDate = this.utilityService.getLastDate(this.info.paymentMonth, this.info.paymentYear);
                this.paymentMonth = this.utilityService.getMonthName(this.info.paymentMonth)
                this.list_getSupplementaryAmount = response.body.details;
            },
            error: (error) => {
                this.utilityService.fail(error?.msg, "Server Response");
            }
        })
    }

    btnDelete: boolean = false;
    process_message: string = "";
    delete(item: any) {
        if (this.btnDelete == false && this.btnSubmit == false) {
            if (confirm("Are you sure you want to delete this payment")) {
                this.process_message = "Payment is being removed from this process";
                this.btnDelete = true;
                let params = {
                    employeeId: item.employeeId,
                    processId: this.info.paymentProcessInfoId,
                    paymentId: item.paymentAmountId,
                    amount: item.amount,
                    taxAmount: item.onceOffAmount
                }
                this.service.deletePayment(params).subscribe({
                    next: (response) => {
                        this.utilityService.success(this.utilityService.SuccessfullySaved, "Server Response");
                        this.btnDelete = false;
                        this.get();
                    },
                    error: (error) => {
                        if (error?.status != null) {
                            this.utilityService.fail(error?.msg, "Server Response");
                        }
                        else {
                            this.utilityService.fail(error?.message, "Server Response");
                        }
                        this.btnDelete = false;
                    }
                })
            }
        }
    }


    btnSubmit: boolean = false;
    submit(status: any) {
        let id = this.info.paymentProcessInfoId;
        if (id > 0 && this.btnSubmit == false && this.btnDelete == false) {
            if (status == "Disbursed") {
                if (this.paymentDate == null || this.paymentDate == '' || this.paymentDate == undefined) {
                    this.utilityService.fail("Please enter payment date", "Validation Error");
                    return;
                }
            }
            if (confirm("Are you sure you want to " + status + " payment")) {
                let params = { id: id, status: status }
                this.btnSubmit = true;
                this.process_message = status == "Disbursed" ? "Payment process is being disbursed" : "Payment process is being undo";
                this.service.disbursedOrUndo(params).subscribe({
                    next: (response) => {
                        this.btnSubmit = false;
                        this.utilityService.success(response?.msg, "Server Response");
                        this.closeModal('Save Complete');
                    },
                    error: (error) => {
                        this.btnSubmit = false;
                        if (error?.status != null) {
                            this.utilityService.fail(error?.msg, "Server Response");
                        }
                        else {
                            this.utilityService.fail(error?.message, "Server Response");
                        }
                    }
                })
            }
        }
    }

    downloadPayslip(item: any) {
        let params = {
            employeeId: item.employeeId,
            processId: this.info.paymentProcessInfoId,
            paymentId: item.paymentAmountId,
            paymentMonth: this.info.paymentMonth,
            paymentYear: this.info.paymentYear,
        }
        // return;
        this.service.downloadPayslip(params).subscribe({
            next: (response) => {
                if (response instanceof Blob) {
                    if (response.size > 0) {
                        this.utilityService.downloadFile(response, 'application/pdf', "Payslip.pdf")
                    }
                }
                else {
                    this.utilityService.fail('No data available for payslip', "Server Response");
                }
            },
            error: (error) => {
                console.log("error");
                this.utilityService.fail(error?.message);
            }
        })
    }

    downloadTaxCard(item: any) {
        let params = {
            employeeId: item.employeeId,
            paymentAmountId: item.paymentAmountId,
            fiscalYearId: this.info.fiscalYearId,
            year: this.info.paymentYear
        }

        this.service.downloadTaxCard(params).subscribe({
            next: (response) => {
                if (response instanceof Blob) {
                    if (response.size > 0) {
                        this.utilityService.downloadFile(response, 'application/pdf', "Supplementary_TaxCard.pdf")
                    }
                }
                else {
                    this.utilityService.fail('No data available for Tax Card', "Server Response");
                }
            },
            error: (error) => {
                console.log("error");
                this.utilityService.fail(error?.message);
            }
        })
    }

    excelFileName: string = "Choose excel file to update tax amount";
    excelFile: any = null;
    excelFileUpload(file: any) {
        this.excelFile = null;
        const selectedFile = (file.target as HTMLInputElement).files[0];
        if (selectedFile != null && selectedFile != undefined && (this.utilityService.fileExtension(selectedFile.name) == 'xls' ||
            this.utilityService.fileExtension(selectedFile.name) == 'xlsx')) {
            this.excelFileName = selectedFile.name;
            this.excelFile = selectedFile;
        }
        else {
            this.excelFileName = "Choose excel file to update tax amount";
        }
    }

    uplaodExcel() {
        if (this.excelFile != null) {
            this.btnSubmit = true;
            var formData = new FormData();
            formData.append('File', this.excelFile);
            formData.append('ProcessId', this.info.paymentProcessInfoId);
            this.service.uploadDeductedTaxAmount(formData).subscribe(response => {
                this.btnSubmit = false;
                if (response.status == true) {
                    this.utilityService.success(response.msg, "Server Response")
                    this.get();
                }
                else {
                    if (response.msg == "Validation Error") {
                        this.utilityService.fail(response.errors?.duplicate, "Server Response", 5000);
                    }
                    else {
                        this.utilityService.fail(response.msg, "Server Response")
                    }
                }

            }, (error) => {
                this.btnSubmit = false;
                this.utilityService.fail("Something went wrong", "Server Response");
            })
        }
        else {
            this.utilityService.fail("Invalid Form", 'Site Response');
        }
    }

    closeModal(reason: any) {
        if (this.btnDelete == false && this.btnSubmit == false) {
            this.modalService.service.dismissAll();
            this.closeModalEvent.emit(reason);
        }
    }
}