import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { CustomModalService } from "src/app/shared/services/custom-modal.service";
import { IncomeTaxProcessService } from "../../tax-module/income-tax-process/income-tax-process.service";
import { UtilityService } from "src/app/shared/services/utility.service";

@Component({
    selector: 'app-payroll-tax-delete-modal',
    templateUrl: './tax-delete-modal.componet.html'
})

export class TaxDeleteModalComponent implements OnInit {

    @Input() month: number = 0;
    @Input() year: number = 0;
    @Input() fiscalYearId: number = 0;
    @Input() batchNo: string="";
    @Input() salaryProcessId: number=0;
    @Output() closeModalEvent = new EventEmitter<string>();

    @ViewChild('deleteTaxInfo', { static: true }) deleteTaxInfo!: ElementRef;
    modalTitle: string = "Delete Tax Info";

    constructor(
        private modalService: CustomModalService, 
        private utilityService: UtilityService, 
        private incomeTaxProcessService: IncomeTaxProcessService) {
    }

    monthName: string = "";

    ngOnInit(): void {
        this.monthName = this.utilityService.getMonths().find(item => item.monthNo == this.month).month;
        this.openModal();

    }

    openModal() {
        this.modalService.open(this.deleteTaxInfo, 'sm');
    }

    closeModal(reason: any) {
        this.modalService.service.dismissAll(reason);
        this.closeModalEvent.emit(reason);
    }

    confirmDelete() {
        this.incomeTaxProcessService.deleteIncomeTaxInfo({ salaryMonth: this.month, salaryYear: this.year, salaryProcessId: this.salaryProcessId }).subscribe(response => {
            if (response?.status) {
                this.utilityService.success(response?.msg, "Server Response")
                this.closeModal('Successful');
            }
            else {
                this.utilityService.fail(response?.msg, "Server Response")
            }
        });
    }


}