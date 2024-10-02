import { DatePipe } from "@angular/common";
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { BsDatepickerConfig } from "ngx-bootstrap/datepicker";
import { AreasHttpService } from "src/app/areas/areas.http.service";
import { ApiArea, ApiController } from "src/app/shared/constants";
import { CustomModalService } from "src/app/shared/services/custom-modal.service";
import { UserService } from "src/app/shared/services/user.service";
import { UtilityService } from "src/app/shared/services/utility.service";

@Component({
    selector: 'app-payroll-employee-salary-sheet-modal',
    templateUrl: './employee-salary-sheet-modal.component.html'
})

export class EmployeeSalarySheetModalComponent implements OnInit {

    @Input() employeeId: any = 0;
    @Output() closeModalEvent = new EventEmitter<string>();
    @ViewChild('downloadEmployeeSalarySheet', { static: true }) downloadEmployeeSalarySheet!: ElementRef;
    datePickerConfig: Partial<BsDatepickerConfig> = {};
    constructor(private modalService: CustomModalService, 
        private areasHttpService: AreasHttpService,
        private datePipe: DatePipe,
        private userService: UserService,
        public utilityService: UtilityService) {
    }

    ngOnInit(): void {
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
        this.openModal();
    }

    dateRange: any[] = [];

    openModal() {
        this.modalService.open(this.downloadEmployeeSalarySheet, "sm");
    }

    getSalaryDataBetweenDataRange() {
        let fromDate;
        let toDate;
       
        if (this.dateRange?.length > 0) {
            fromDate = this.datePipe.transform(this.dateRange[0], 'yyyy-MM-dd');
            toDate = this.datePipe.transform(this.dateRange[1], 'yyyy-MM-dd');
        }
        let params = { employeeId: this.userService.User().EmployeeId, fromDate: fromDate.toString() ?? '', toDate: toDate.toString() ?? '' };

        this.areasHttpService.observable_get<any>((ApiArea.payroll + ApiController.reports + "/DownloadDateRangeSalarySheet"), {
            responseType: 'blob', params: params
        }).subscribe((response: any) => {
            console.log("response >>>", response);
            if (response.size > 0) {
              var blob = new Blob([response], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
              const link = document.createElement('a');
              link.href = window.URL.createObjectURL(blob);
              link.download = 'DateRangeOfSalarySheet.xlsx';
              link.click();
            }
            else {
              this.utilityService.warning("No Excel File found");
            }
            this.closeModal('dismiss');
        }, (error) => {
            this.utilityService.fail("Something went wrong", "Server Response");

        })
    }

    closeModal(reason:any){
        this.closeModalEvent.emit(reason);
        this.modalService.service.dismissAll(reason);
    }

}