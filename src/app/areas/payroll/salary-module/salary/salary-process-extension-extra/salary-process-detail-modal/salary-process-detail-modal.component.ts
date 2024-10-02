import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { CustomModalService } from "src/app/shared/services/custom-modal.service";
import { UserService } from "src/app/shared/services/user.service";
import { UtilityService } from "src/app/shared/services/utility.service";
import { SalaryProcessService } from "../salary-process.service";

@Component({
    selector: 'app-payroll-salary-process-detail-modal',
    templateUrl: './salary-process-detail-modal.component.html'
})

export class SalaryProcessDetailModalComponent implements OnInit {

    @ViewChild('salaryProcessDetailModal', { static: true }) salaryProcessDetailModal!: ElementRef;
    @Output() closeModalEvent = new EventEmitter<string>();
    @Input() id: number = 0;
    constructor(private utilityService: UtilityService,
        private userService: UserService, public modalService: CustomModalService, private salaryProcessService: SalaryProcessService) { }

    ngOnInit(): void {
        this.getSalaryProcessDetails(this.id);
    }

    User() {
        return this.userService.User();
    }

    select2Options = this.utilityService.select2Config();

    logger(msg: any, options: any) {
        this.utilityService.consoleLog(msg, options);
    }

    openSalaryProcessDetailsModal() {
        this.modalService.open(this.salaryProcessDetailModal, "xl")
    }

    listOfsalaryProcessDetail: any[] = [];
    footerOfsalaryProcessDetail: any = {};
    getSalaryProcessDetails(id: any) {
        this.salaryProcessService.getSalaryProcessDetails({
            salaryProcessId: id
        }).subscribe(response=>{
            this.listOfsalaryProcessDetail = response.body;
            this.openSalaryProcessDetailsModal();
            this.footerOfsalaryProcessDetail.totalAllowance = this.listOfsalaryProcessDetail.map(s => s.totalAllowance).reduce((a, b) => a + b, 0);
            this.footerOfsalaryProcessDetail.pfAmount = this.listOfsalaryProcessDetail.map(s => s.pfAmount).reduce((a, b) => a + b, 0);
            this.footerOfsalaryProcessDetail.pfArrear = this.listOfsalaryProcessDetail.map(s => s.pfArrear).reduce((a, b) => a + b, 0);
            this.footerOfsalaryProcessDetail.totalDeduction = this.listOfsalaryProcessDetail.map(s => s.totalDeduction).reduce((a, b) => a + b, 0);
            this.footerOfsalaryProcessDetail.grossPay = this.listOfsalaryProcessDetail.map(s => s.grossPay).reduce((a, b) => a + b, 0);
            this.footerOfsalaryProcessDetail.netPay = this.listOfsalaryProcessDetail.map(s => s.netPay).reduce((a, b) => a + b, 0);
        },(error)=>{
            console.log("error >>>", error);
            this.utilityService.fail("Something went wrong","Server Response");
        })
    }

    closeModal(reason: any) {
        this.modalService.service.dismissAll(reason);
        this.closeModalEvent.emit(reason);
    }

}