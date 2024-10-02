import { DatePipe } from "@angular/common";
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { Router } from "@angular/router";
import { AreasHttpService } from "src/app/areas/areas.http.service";
import { ApiArea, ApiController } from "src/app/shared/constants";
import { ControlPanelWebService } from "src/app/shared/services/control-panel.service";
import { CustomModalService } from "src/app/shared/services/custom-modal.service";
import { HrWebService } from "src/app/shared/services/hr-web.service";
import { PayrollWebService } from "src/app/shared/services/payroll-web.service";
import { UserService } from "src/app/shared/services/user.service";
import { UtilityService } from "src/app/shared/services/utility.service";
@Component({
  selector: 'app-salary-module-cash-salary-process-detail-modal',
  templateUrl: './cash-salary-process-detail-modal.component.html'
})
export class CashSalaryProcessDetailModalComponent implements OnInit {
    @ViewChild('cashSalaryProcessDetailModal', { static: true }) cashSalaryProcessDetailModal!: ElementRef;
    @Output() closeModalEvent = new EventEmitter<string>();
    @Input() cashSalaryProcessId: number = 0;
    constructor(private fb: FormBuilder, private areasHttpService: AreasHttpService, private utilityService: UtilityService,
        private userService: UserService, public modalService: CustomModalService, private el: ElementRef) { }
  
    ngOnInit(): void {
        this.getSalaryProcessDetails(this.cashSalaryProcessId);
    }
  
    User() {
        return this.userService.User();
    }
  
    select2Options = {
        width: "100%",
        containerCssClass: "form-control form-control-sm text-x-small font-bold",
        theme: "bootstrap4"
    }
  
    logger(msg: any, options: any) {
        this.utilityService.consoleLog(msg, options);
    }
  
    openSalaryProcessDetailsModal() {
        this.modalService.open(this.cashSalaryProcessDetailModal, "xl")
    }
  
    listOfsalaryProcessDetail: any[] = [];
    footerOfsalaryProcessDetail: any = {};
    getSalaryProcessDetails(id: any) {
        this.areasHttpService.observable_get<any>((ApiArea.payroll + "/Salary/CashSalary" + "/GetCashSalaryProcessDetail"), {
            responseType: "json", params: {
                cashSalaryProcessId: id
            }
        }).subscribe((response) => {
            var res = response as any[];
            this.listOfsalaryProcessDetail = res;
            this.openSalaryProcessDetailsModal();
            console.log(" this.listOfsalaryProcessDetail >>>", this.listOfsalaryProcessDetail);
            this.footerOfsalaryProcessDetail.grossPay = this.listOfsalaryProcessDetail.map(s => s.grossPay).reduce((a, b) => a + b, 0);      
          },
            (error) => { this.utilityService.httpErrorHandler(error) }
        )
    }
  
    closeModal(reason: any) {
        this.modalService.service.dismissAll(reason);
        this.closeModalEvent.emit(reason);
    }
  
  
  }
  