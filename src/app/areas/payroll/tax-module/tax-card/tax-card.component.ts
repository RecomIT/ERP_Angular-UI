import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { UtilityService } from "src/app/shared/services/utility.service";
import { UserService } from "src/app/shared/services/user.service";
import { transition, trigger, useAnimation } from "@angular/animations";
import { slideInUp } from "ng-animate";
import { IncomeTaxReportService } from "../income-tax-process/income-tax-report.service";
import { TaxCardService } from "./tax-card.service";
import { FinalTaxCardService } from "../income-tax-process/final-tax-card-process/final-tax-card-process.service";

@Component({
    selector: 'app-payroll-tax-card',
    templateUrl: './tax-card.component.html',
    animations: [
        trigger('slideInUp', [transition('* => *', useAnimation(slideInUp, { params: { timing: 0.5 } }))])
    ]
})

export class TaxCardComponent implements OnInit {

    constructor(
        private fb: FormBuilder,
        private utilityService: UtilityService,
        private taxCardService: TaxCardService,
        private userService: UserService,
        private finalTaxCardService: FinalTaxCardService,
        private incomeTaxReportService: IncomeTaxReportService) {
    }
    pagePrivilege: any = this.userService.getPrivileges();
    ngOnInit(): void {
        this.taxCardFormInit();
    }

    logger(msg: any, options: any) {
        this.utilityService.consoleLog(msg, options);
    }

    User() {
        return this.userService.User();
    }

    ddlYears: any = this.utilityService.getYears(2);
    ddlMonths: any = this.utilityService.getMonths();

    public month: number = parseInt(this.utilityService.currentMonth);
    public year: number = parseInt(this.utilityService.currentYear);

    user_company = this.User().ComId;
    user_organization = this.User().OrgId;

    taxCardForm: FormGroup;

    taxCardFormInit() {
        this.taxCardForm = this.fb.group({
            taxMonth: new FormControl(this.month),
            taxYear: new FormControl(this.year)
        })
    }

    taxCardInfo: any;
    taxCardDetails: any[] = [];
    taxCardSlabs: any[] = [];

    viewTaxCard() {
        const tax_month = this.taxCardForm.get('taxMonth').value;
        const tax_year = this.taxCardForm.get('taxYear').value;
        this.taxCardService.showTaxCardInfo({ employeeId: this.User().EmployeeId, month: tax_month, year: tax_year }).subscribe({
            next: (response: any) => {
                if (response.body != null) {
                    this.taxCardInfo = response.body.taxCardInfo[0]
                    this.taxCardDetails = response.body.taxCardDetails;
                    this.taxCardSlabs = response.body.taxCardSlabs
                    this.intotalAmount();
                }
            },
            error: (error: any) => {
                this.utilityService.httpErrorHandler(error);
            }
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

    //
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
        this.clearTotal();
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
        const emp_id = this.User().EmployeeId;
        const tax_month = this.taxCardForm.get('taxMonth').value;
        const tax_year = this.taxCardForm.get('taxYear').value;

        this.taxCardService.downloadTaxCard({ employeeId: emp_id, month: tax_month, year: tax_year }).subscribe({
            next: (response: any) => {
                var blob = new Blob([response], { type: 'application/pdf' });
                let pdfUrl = window.URL.createObjectURL(blob);

                var PDF_link = document.createElement('a');
                PDF_link.href = pdfUrl;
                window.open(pdfUrl, '_blank');
            },
            error: (error: any) => {
                this.utilityService.httpErrorHandler(error);
            }
        })
    }

    finalTaxCard() {
        const tax_month = this.taxCardForm.get('taxMonth').value;
        const tax_year = this.taxCardForm.get('taxYear').value;
        if (tax_month > 0 && tax_year > 0) {
            this.finalTaxCardService.downloadTaxCardFromSelfService({ month: tax_month, year: tax_year }).subscribe({
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
                },
                error: (error) => {
                    console.log("error in download108Report>>>", error);
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
            this.utilityService.fail("Please select year & month", "Site Response");
        }
    }
}