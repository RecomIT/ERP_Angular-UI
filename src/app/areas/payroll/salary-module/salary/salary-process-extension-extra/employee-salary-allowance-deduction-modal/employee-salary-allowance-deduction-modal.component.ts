import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { CustomModalService } from "src/app/shared/services/custom-modal.service";
import { UserService } from "src/app/shared/services/user.service";
import { UtilityService } from "src/app/shared/services/utility.service";
import { SalaryProcessService } from "../salary-process.service";

@Component({
    selector: 'app-payroll-employee-salary-allowance-deduction-modal',
    templateUrl: './employee-salary-allowance-deduction-modal.component.html'
})

export class EmployeeSalaryAllowanceDeductionModalComponent implements OnInit {

    @Input() employeeId: any = 0;
    @Input() salaryDetailId: any = 0;

    @Output() closeModalEvent = new EventEmitter<boolean>();
    @ViewChild('employeeSalaryAllowanceDeductionModal', { static: true }) employeeSalaryAllowanceDeductionModal!: ElementRef;

    constructor(
        private utilityService: UtilityService,
        private userService: UserService, public modalService: CustomModalService,
        private salaryProcessService: SalaryProcessService) {

    }
    ngOnInit(): void {
        this.clearAllowanceTotal();
        this.clearDeductionTotal();
        this.getEmployeeSalaryDetail();
        this.getEmployeeSalaryAllowanceDetail();
        this.getEmployeeSalaryDeductionDetail();
        this.modalService.open(this.employeeSalaryAllowanceDeductionModal, "lg");
    }

    select2Options = this.utilityService.select2Config();

    logger(msg: any, options: any) {
        this.utilityService.consoleLog(msg, options);
    }

    User() {
        return this.userService.User();
    }

    isDisbursed: boolean= false;

    salaryInformation: any;
    getEmployeeSalaryDetail() {
        this.salaryProcessService.getSalaryProcessDetails({ employeeId: this.employeeId, salaryProcessDetailId: this.salaryDetailId }).subscribe(response => {
            console.log("response of getEmployeeSalaryDetail >>>", response)
            this.salaryInformation = response.body[0];
            this.isDisbursed =(this.salaryInformation?.isDisbursed??false)
            this.with_tax_process = (this.salaryInformation?.taxDeductedAmount??0) > 0 ? true : false;
        }, (error) => {
            console.log("error >>>", error);
            this.utilityService.fail("Something went wrong", "Server Response");
        })
    }

    with_tax_process: boolean=false;

    listEmployeeSalaryAllowance: any[] = [];
    totalAllowance: number = 0;
    totalAllowanceArrear: number = 0;
    totalAllowanceAdjustment: number = 0;
    getEmployeeSalaryAllowanceDetail() {
        this.salaryProcessService.getEmployeeSalaryAllowanceById({ employeeId: this.employeeId, salaryProcessDetailId: this.salaryDetailId }).subscribe(response => {
            //console.log("getEmployeeSalaryAllowanceById >>>", response);
            this.listEmployeeSalaryAllowance = response.body;
            this.totalAllowanceCalculation();
        }, (error) => {
            console.log("error >>>", error);
            this.utilityService.fail("Something went wrong", "Server Response");
        })
    }

    listEmployeeSalaryDeduction: any[] = [];
    totalDeduction: number = 0;
    totalDeductionArrear: number = 0;
    totalDeductionAdjustment: number = 0;
    getEmployeeSalaryDeductionDetail() {
        this.salaryProcessService.getEmployeeSalaryDeductionById({ employeeId: this.employeeId, salaryProcessDetailId: this.salaryDetailId }).subscribe(response => {
            this.listEmployeeSalaryDeduction = response.body;
            this.totalDeductionCalculation();
        }, (error) => {
            console.log("error >>>", error);
            this.utilityService.fail("Somethign went wrong", "Server Response");
        })
    }

    clearAllowanceTotal() {
        this.totalAllowance = 0;
        this.totalAllowanceArrear = 0;
        this.totalAllowanceAdjustment = 0;
    }

    clearDeductionTotal() {
        this.totalDeduction = 0;
        this.totalDeductionArrear = 0;
        this.totalDeductionAdjustment = 0;
    }

    totalAllowanceCalculation() {
        this.clearAllowanceTotal();
        this.listEmployeeSalaryAllowance.forEach(item => {
            this.totalAllowanceArrear += item.arrearAmount;
            this.totalAllowanceAdjustment += item.adjustmentAmount;
            this.totalAllowance += item.amount;
        })
    }

    totalDeductionCalculation() {
        this.clearDeductionTotal();
        this.listEmployeeSalaryDeduction.forEach(item => {
            this.totalDeductionArrear += item.arrearAmount;
            this.totalDeductionAdjustment += item.adjustmentAmount;
            this.totalDeduction += item.amount;
        })

        console.log("totalDeduction >>>", this.totalDeduction);
    }

    btnProcess: boolean = false;
    salaryReporcess() {
        if (this.employeeId > 0 && this.salaryInformation.salaryProcessId > 0 && this.salaryInformation.salaryProcessDetailId > 0
            && this.salaryInformation.salaryMonth > 0 && this.salaryInformation.salaryYear > 0) {
            this.btnProcess = true;
            let params = {
                employeeId: this.employeeId, salaryProcessId: this.salaryInformation.salaryProcessId, salaryProcessDetailId: this.salaryInformation.salaryProcessDetailId,
                month: this.salaryInformation.salaryMonth, year: this.salaryInformation.salaryYear,withTaxProcess: this.with_tax_process
            };
            console.log("salary reprocess params:", params);

            this.salaryProcessService.salaryReprocess(params).subscribe(response => {
                console.log("salaryReprocess response >>>", response);
                this.btnProcess = false;
                
                if (response?.status == true) {
                    this.reprocessDone= true;
                    this.utilityService.success(response.msg, "Server Response");
                    this.salaryInformation=null;
                    this.salaryDetailId = (response?.itemId??0);
                    this.getEmployeeSalaryDetail();
                    this.listEmployeeSalaryAllowance=[];
                    this.getEmployeeSalaryAllowanceDetail();
                    this.listEmployeeSalaryDeduction=[];
                    this.getEmployeeSalaryDeductionDetail();
                }
                else {
                    this.reprocessDone= false;
                    this.utilityService.fail(response.msg, "Server Response");
                }
            }, (error) => {
                this.utilityService.httpErrorHandler(error);
                this.btnProcess = false;
            })
        }
        else {
            this.utilityService.fail("Invalid Form Submission", "Site Response");
        }
    }

    reprocessDone: boolean=false;
    closeModal(reason: any) {
        this.modalService.service.dismissAll(reason);
        this.closeModalEvent.emit(this.reprocessDone);
    }


}