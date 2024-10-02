import { Component, ElementRef, OnInit } from "@angular/core";
import { UtilityService } from "src/app/shared/services/utility.service";
import { UserService } from "src/app/shared/services/user.service";
import { transition, trigger, useAnimation } from "@angular/animations";
import { bounceIn, fadeIn, fadeInRight, slideInUp } from "ng-animate";
import { SalaryAllowanceConfigService } from "../salary-allowance-config/salary-allowance-config.service";

@Component({
    selector: 'app-payroll-salary-allowance-config-extension',
    templateUrl: './salary-allowance-config-extension.component.html',
    animations: [
        trigger('slideInUp', [transition('* => *', useAnimation(slideInUp, { params: { timing: 0.5 } }))]),
        trigger('fadeIn', [transition('void => *', useAnimation(fadeIn, { params: { timing: 0.3 } }))]),
        trigger('fadeInRight', [transition('void => *', useAnimation(fadeInRight, { params: { timing: 0.5 } }))]),
        trigger('bounceIn', [transition('void => *', useAnimation(bounceIn, { params: { timing: 1 } }))]),
    ],
})

export class SalaryAllowanceConfigExtensionComponent implements OnInit {
    constructor(
        private salaryAllowanceConfigService: SalaryAllowanceConfigService,
        private utilityService: UtilityService,
        private userService: UserService, private el: ElementRef) {
    }

    User() {
        return this.userService.User();
    }

    ngOnInit(): void {
        this.getAll();
    }

    select2Options = {
        width: "100%",
        containerCssClass: "form-control form-control-sm text-x-small font-bold",
        theme: "bootstrap4"
    }

    logger(msg: any, options: any) {
        this.utilityService.consoleLog(msg, options);
    }

    listOfSalaryAllowanceConfig: any[] = [];
    getAll() {
        this.salaryAllowanceConfigService.getAll({}).subscribe({
            next: (response) => {
                console.log("response >>>", response);
                this.listOfSalaryAllowanceConfig = response.body;
            },
            error: (error) => {
            }
        })
    }

    seeHeadInfo(item: any) {
        if (this.btnSubmit == false) {
            let params = { salaryAllowanceConfigId: item?.salaryAllowanceConfigId, configCategory: item?.configCategory, id: item?.selectedItems }
            this.salaryAllowanceConfigService.getHeadsInfo(params).subscribe({
                next: (response) => {
                    if (response.body != null && response.body.length > 0) {
                        let text = "";
                        (response.body).forEach((item: any, index) => {
                            text += item?.value + ","
                        })
                        text = text.substring(0, text.length - 1);
                        alert(text);
                    }
                },
                error: (error) => {
                    console.log("error >>>", error)
                }
            })
        }
    }

    btnSubmit: boolean = false;
    delete(item: any, index: number) {
        this.listOfSalaryAllowanceConfig[index].isOnProcess = true;
        if (confirm("Are you sure you want to delete salary breakdown setup") && this.btnSubmit == false) {
            this.btnSubmit = true;
            this.salaryAllowanceConfigService.delete(item?.salaryAllowanceConfigId).subscribe({
                next: (response) => {
                    this.btnSubmit = false;
                    if (response?.status) {
                        this.getAll();
                        this.utilityService.toastr.success(response?.msg, "Server Response");
                    }
                },
                error: (error) => {
                    this.btnSubmit = false;
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
            this.listOfSalaryAllowanceConfig[index].isOnProcess = false;
        }
    }

    approved(item: any, index: number) {
        this.listOfSalaryAllowanceConfig[index].isOnProcess = true;
        if (confirm("Are you sure you want to approved salary breakdown setup") && this.btnSubmit == false) {
            this.btnSubmit = true;
            let params = {
                salaryAllowanceConfigId: item?.salaryAllowanceConfigId,
                configCategory: item?.configCategory,
                id: item?.selectedItems,
                jobType: item?.jobType
            };
            this.salaryAllowanceConfigService.approved(params).subscribe({
                next: (response) => {
                    this.btnSubmit = false;
                    if (response.body?.status) {
                        this.getAll();
                        this.utilityService.toastr.success(response.body?.status?.msg, "Server Response");
                    }
                },
                error: (error) => {
                    this.btnSubmit = false;
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
            this.listOfSalaryAllowanceConfig[index].isOnProcess = false;
        }
    }

    //#region Insert Modal //
    showInsertUpdateModal: boolean = false;
    config_id: number = 0;
    openInsertUpdateModal(id: any) {
        this.showInsertUpdateModal = !this.showInsertUpdateModal;
        this.config_id = id;
    }

    closeInsertUpdateModal(reason: any) {
        this.showInsertUpdateModal = false;
        this.config_id = 0;
        if (reason == 'Save Complete') {
            this.getAll();
        }
    }
    //#endregion Modal
}