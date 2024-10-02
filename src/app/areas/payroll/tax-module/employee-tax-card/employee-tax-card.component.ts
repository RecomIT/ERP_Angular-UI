import { transition, trigger, useAnimation } from "@angular/animations";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { bounceIn, fadeIn, fadeInRight, slideInUp } from "ng-animate";
import { UtilityService } from "src/app/shared/services/utility.service";
import { UserService } from "src/app/shared/services/user.service";
import { EmployeeInfoService } from "src/app/areas/employee_module/employee/employee-info.service";
import { IncomeTaxReportService } from "../income-tax-process/income-tax-report.service";
import { FinalTaxCardService } from "../income-tax-process/final-tax-card-process/final-tax-card-process.service";

@Component({
    selector: 'app-payroll-employee-tax-card',
    templateUrl: './employee-tax-card.component.html',
    animations: [
        trigger('slideInUp', [transition('* => *', useAnimation(slideInUp, { params: { timing: 0.5 } }))]),
        trigger('fadeIn', [transition('void => *', useAnimation(fadeIn, { params: { timing: 0.3 } }))]),
        trigger('fadeInRight', [transition('void => *', useAnimation(fadeInRight, { params: { timing: 0.5 } }))]),
        trigger('bounceIn', [transition('void => *', useAnimation(bounceIn, { params: { timing: 1 } }))]),
    ]
})

export class ExployeeTaxCardComponent implements OnInit {
    constructor(
        private fb: FormBuilder,
        private utilityService: UtilityService,
        private employeeInfoService: EmployeeInfoService,
        private finalTaxCardService: FinalTaxCardService,
        private incomeTaxReportService: IncomeTaxReportService,
        private userService: UserService) {
    }

    ngOnInit(): void {
        this.taxCardFormInit();
    }

    pagePrivilege: any = this.userService.getPrivileges();;

    logger(msg: any, options: any) {
        this.utilityService.consoleLog(msg, options);
    }

    User() {
        return this.userService.User();
    }

    select2Options = this.utilityService.select2Config();

    ddlYears: any = this.utilityService.getYears(2);
    ddlMonths: any = this.utilityService.getMonths();

    public month: number = parseInt(this.utilityService.currentMonth);
    public year: number = parseInt(this.utilityService.currentYear);

    taxCardForm: FormGroup;

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

    taxCardFormInit() {
        this.taxCardForm = this.fb.group({
            employeeId: new FormControl(0),
            taxMonth: new FormControl(this.month),
            taxYear: new FormControl(this.year)
        })
        this.loadEmployees();
    }

    taxCardInfo: any;
    taxCardDetails: any[] = [];
    taxCardSlabs: any[] = [];

    viewTaxCard() {
        this.clearTotal();
        const emp_id = this.taxCardForm.get('employeeId').value
        const tax_month = this.taxCardForm.get('taxMonth').value;
        const tax_year = this.taxCardForm.get('taxYear').value;

        this.incomeTaxReportService.getTaxcardInformation({ employeeId: emp_id, month: tax_month, year: tax_year }).subscribe(response => {
            if (response.body != null && response.body.taxCardDetails.length) {
                this.taxCardInfo = response.body.taxCardInfo[0]
                this.taxCardDetails = response.body.taxCardDetails;
                this.taxCardSlabs = response.body.taxCardSlabs
                this.intotalAmount();
            }
            else {
                this.utilityService.fail("No data found", "Site Response");
            }
        }, (error) => {
            this.utilityService.httpErrorHandler(error);
        })
    }

    // Tax Detail
    totaltillDateIncome: any = 0;
    totalCurrentMonthIncome: any = 0;
    totalProjectedIncome: any = 0;
    totalGrossAnnualIncome: any = 0;
    totalLessExemptedAmount: any = 0;
    totalTaxableIncome: any = 0;

    // Tax Slab
    totalTaxableIncomeInSlab: any = 0;
    totalIndividualTaxLiablility: any = 0;

    tillDateTaxDeducted: any = 0;
    taxTobeAdjusted: any = 0;


    clearTotal() {
        this.totaltillDateIncome = 0.00;
        this.totalCurrentMonthIncome = 0.00;
        this.totalProjectedIncome = 0.00;
        this.totalGrossAnnualIncome = 0.00;
        this.totalLessExemptedAmount = 0.00;
        this.totalTaxableIncome = 0.00;
        this.totalTaxableIncomeInSlab = 0.00;
        this.totalIndividualTaxLiablility = 0.00;
        this.tillDateTaxDeducted = 0.00;
        this.taxTobeAdjusted = 0.00;
    }

    intotalAmount() {
        this.tillDateTaxDeducted = (this.taxCardInfo?.paidTotalTax - this.taxCardInfo?.monthlyTax);
        this.taxTobeAdjusted = (this.taxCardInfo?.yearlyTax - this.taxCardInfo?.paidTotalTax);
        this.taxCardDetails.forEach(item => {
            this.totaltillDateIncome += item.tillDateIncome;
            this.totalCurrentMonthIncome += item.currentMonthIncome;
            this.totalProjectedIncome += item.projectedIncome;
            this.totalGrossAnnualIncome += item.grossAnnualIncome;
            this.totalLessExemptedAmount += item.lessExempted;
            this.totalTaxableIncome += item.totalTaxableIncome;
        })
        this.taxCardSlabs.forEach(item => {
            this.totalTaxableIncomeInSlab += item.taxableIncome;
            this.totalIndividualTaxLiablility += item.taxLiability;
        })
    }

    downloadTaxCard() {
        const emp_id = this.taxCardForm.get('employeeId').value
        const tax_month = this.taxCardForm.get('taxMonth').value;
        const tax_year = this.taxCardForm.get('taxYear').value;
        this.incomeTaxReportService.downloadTaxCard({ employeeId: emp_id, month: tax_month, year: tax_year }).subscribe(response => {
            var blob = new Blob([response], { type: 'application/pdf' });
            let pdfUrl = window.URL.createObjectURL(blob);
            var PDF_link = document.createElement('a');
            PDF_link.href = pdfUrl;
            window.open(pdfUrl, '_blank');
        }, (error) => {
            this.utilityService.httpErrorHandler(error);
        })
    }

    btnDownloadFinalTaxCard: boolean= false;
    finalTaxCard() {
        const emp_id = this.taxCardForm.get('employeeId').value
        const tax_month = this.taxCardForm.get('taxMonth').value;
        const tax_year = this.taxCardForm.get('taxYear').value;
        if (emp_id > 0 && tax_month > 0 && tax_year > 0) {
            this.btnDownloadFinalTaxCard = true;
            this.finalTaxCardService.downloadTaxCardFromAdminPart({ employeeId: emp_id, month: tax_month, year: tax_year }).subscribe({
                next: (response) => {
                    if (response instanceof Blob) {
                        if (response.size > 0) {
                            this.utilityService.downloadFile(response, 'application/pdf', 'Tax Card.pdf')
                        }
                        else {
                            this.utilityService.fail('No data available for report', "Server Response");
                        }
                    }
                    else {
                        this.utilityService.fail('No data available for report', "Server Response");
                    }
                    this.btnDownloadFinalTaxCard = false;
                },
                error: (error) => {
                    console.log("error in download108Report>>>", error);
                    this.btnDownloadFinalTaxCard = false;
                    if (typeof error.msg === 'object') {
                        this.utilityService.fail(error.msg?.msg, "Server Response");
                    }
                    else {
                        this.utilityService.fail(error.msg, "Server Response");
                    }
                }
            })
        }
        else {
            this.utilityService.fail("Please select a employee, year & month", "Site Response");
        }
    }
}