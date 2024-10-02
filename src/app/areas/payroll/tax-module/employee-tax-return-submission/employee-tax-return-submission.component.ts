import { transition, trigger, useAnimation } from "@angular/animations";
import { Component, OnInit } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { bounceIn, fadeIn, fadeInRight, slideInUp } from "ng-animate";
import { CustomModalService } from "src/app/shared/services/custom-modal.service";
import { UserService } from "src/app/shared/services/user.service";
import { UtilityService } from "src/app/shared/services/utility.service";
import { TaxReturnSubmissioinService } from "../../../payroll-services/tax-return-submission/tax-return-submission.service";

@Component({
    selector: 'app-payroll-employee-tax-return-submission',
    templateUrl: './employee-tax-return-submission.component.html',
    animations: [
        trigger('slideInUp', [transition('* => *', useAnimation(slideInUp, { params: { timing: 0.5 } }))]),
        trigger('fadeIn', [transition('void => *', useAnimation(fadeIn, { params: { timing: 0.3 } }))]),
        trigger('fadeInRight', [transition('void => *', useAnimation(fadeInRight, { params: { timing: 0.5 } }))]),
        trigger('bounceIn', [transition('void => *', useAnimation(bounceIn, { params: { timing: 1 } }))])
    ],
})

export class EmployeeTaxReturnSubmissionComponent implements OnInit {

    constructor(private utilityService: UtilityService, private fb: FormBuilder,
        private userService: UserService, public modalService: CustomModalService, private taxReturnSubmissioinService: TaxReturnSubmissioinService) { }
    pagePrivilege: any = this.userService.getPrivileges();;

    ngOnInit(): void {
        this.getEmployeeTaxReturnSubmissionList();
    }

    logger(msg: any, options: any) {
        this.utilityService.consoleLog(msg, options);
    }

    User() {
        return this.userService.User();
    }

    list: any[] = [];

    getEmployeeTaxReturnSubmissionList() {
        this.taxReturnSubmissioinService.getEmployeeTaxReturnSubmissionAsync({ employeeId: "0" }).subscribe(response => {
            this.list = response;
            console.log("this.list >>>", this.list);
        }, error => {
            this.utilityService.fail('Data retrival Issue', 'Server Response');
        })
    }

    downloadFile(path: any) {
        if (path != null && path != '') {
            this.taxReturnSubmissioinService.downloadEmployeeTaxReturnFile(path).subscribe(response => {

                if (response.size > 64) {
                    var blob = new Blob([response], { type: response.type });
                    let pdfUrl = window.URL.createObjectURL(blob);

                    var PDF_link = document.createElement('a');
                    PDF_link.href = pdfUrl;
                    window.open(pdfUrl, '_blank');
                }
                else {
                    this.utilityService.warning("No file found")
                }
            }, error => {
                this.utilityService.fail('Data retrival Issue', 'Server Response');
            })
        }
    }

    showTaxReturnInsertModal: boolean = false;
    showTaxModal(id: any) {
        this.showTaxReturnInsertModal = !this.showTaxReturnInsertModal;
    }

    closeModal(reason: any) {
        this.showTaxReturnInsertModal = !this.showTaxReturnInsertModal;
        if (reason == 'Save Successful') {
            this.getEmployeeTaxReturnSubmissionList();
        }
    }

} 