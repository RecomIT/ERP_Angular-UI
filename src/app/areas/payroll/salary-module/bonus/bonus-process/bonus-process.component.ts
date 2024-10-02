import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { ControlPanelWebService } from "src/app/shared/services/control-panel.service";
import { CustomModalService } from "src/app/shared/services/custom-modal.service";
import { HrWebService } from "src/app/shared/services/hr-web.service";
import { PayrollWebService } from "src/app/shared/services/payroll-web.service";
import { UserService } from "src/app/shared/services/user.service";
import { UtilityService } from "src/app/shared/services/utility.service";
import { AreasHttpService } from "../../../../areas.http.service";
import { transition, trigger, useAnimation } from "@angular/animations";
import { bounceIn, fadeIn, fadeInRight, slideInUp } from "ng-animate";
import { BsDatepickerConfig } from "ngx-bootstrap/datepicker";
import { BonusProcessService } from "../../../../payroll-services/bonus-process/bonus-process.service";

@Component({
    selector: 'app-payroll-bonus-process',
    templateUrl: './bonus-process.component.html',
    animations: [
        trigger('slideInUp', [transition('* => *', useAnimation(slideInUp, { params: { timing: 0.5 } }))]),
        trigger('fadeIn', [transition('void => *', useAnimation(fadeIn, { params: { timing: 0.3 } }))]),
        trigger('fadeInRight', [transition('void => *', useAnimation(fadeInRight, { params: { timing: 0.5 } }))]),
        trigger('bounceIn', [transition('void => *', useAnimation(bounceIn, { params: { timing: 1 } }))]),
    ]
})

export class BonusProcessComponent implements OnInit {

    datePickerConfig: Partial<BsDatepickerConfig> = {};

    constructor(private utilityService: UtilityService, private payrollWebService: PayrollWebService, private controlPanelWebService: ControlPanelWebService, private hrWebService: HrWebService, private fb: FormBuilder,
        private userService: UserService, public modalService: CustomModalService, private areasHttpService: AreasHttpService, private bonusProcessService: BonusProcessService) { }
    ngOnInit(): void {
        this.searchFormInit();
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
        this.loadBonus();
        this.loadFiscalYear();
        this.getBonusProcessesInfo();
        this.getBonusProcessDetails();
    }
    pagePrivilege: any = this.userService.getPrivileges();;

    /// Page Basic Setting //
    logger(msg: any, options: any) {
        this.utilityService.consoleLog(msg, options);
    }

    User() {
        return this.userService.User();
    }

    select2Options = {
        width: "100%",
        containerCssClass: "form-control form-control-sm text-x-small font-bold",
        theme: "bootstrap4"
    }
    //===================//

    bonusProcessSearchForm: FormGroup;

    bonusProcessDetailSearchForm: FormGroup;

    showProcessView: boolean = false;
    showHide() {
        this.showProcessView = !this.showProcessView;
    }

    ddlBonus: any[] = [];
    loadBonus() {
        this.payrollWebService.getBonusExtension<any[]>().then(response => {
            //console.log("ddlBonus >>>", response)
            this.ddlBonus = response;
        })
    }

    ddlFiscalYear: any[] = [];
    loadFiscalYear() {
        this.payrollWebService.getFiscalYears<any[]>().then(response => {
            this.ddlFiscalYear = response;
        })
    }

    bonusProcess_pager: any = this.userService.pageConfigInit("bonusProcess_pager", 1, 1, 0);
    bonus_pagesize: number = 15;
    bonus_pageno: number = 1;

    bonusProcessdetail_pager: any = this.userService.pageConfigInit("bonusProcessdetail_pager", 1, 1, 0);
    bonusdetail_pagesize: number = 15;
    bonusdetail_pageno: number = 1;


    searchFormInit() {
        this.bonusProcessSearchForm = this.fb.group({
            bonusId: new FormControl(0),
            bonusConfigId: new FormControl(0),
            batchNo: new FormControl(''),
            fiscalYearId: new FormControl(0),
            sortingCol: new FormControl(''),
            sortType: new FormControl(''),
            pageSize: new FormControl(this.bonus_pagesize),
            pageNumber: new FormControl(this.bonus_pageno)
        });

        this.bonusProcessSearchForm.valueChanges.subscribe(value => {
            this.getBonusProcessesInfo();
        })

        this.bonusProcessDetailSearchForm = this.fb.group({
            bonusId: new FormControl(0),
            bonusConfigId: new FormControl(0),
            batchNo: new FormControl(''),
            fiscalYearId: new FormControl(0),
            sortingCol: new FormControl(''),
            sortType: new FormControl(''),
            pageSize: new FormControl(this.bonusdetail_pagesize),
            pageNumber: new FormControl(this.bonusdetail_pageno)
        });
        this.bonusProcessDetailSearchForm.valueChanges.subscribe(value => {
            this.getBonusProcessDetails();
        })

    }

    //#region bonus_process_list

    listOfBonusProcessInfo: any[] = [];
    getBonusProcessesInfo() {
        this.bonusProcessService.getBonusProcessesInfo(this.bonusProcessSearchForm.value).subscribe((response) => {
            var res = response as any;
            this.listOfBonusProcessInfo = res.body;
            var xPaginate = JSON.parse(res.headers.get('X-Pagination'));
            this.bonusProcess_pager = this.userService.pageConfigInit("bonusProcess_pager", xPaginate.itemsPerPage, xPaginate.currentPage, xPaginate.totalItems);
        }, (error) => { this.utilityService.httpErrorHandler(error) })
    }

    bonusProcess_pager_changed(event: any) {

    }

    //#endregion

    //#region bonus_process_detail
    listOfBonusProcessDetail: any[] = [];
    getBonusProcessDetails() {
        this.bonusProcessService.getBonusProcessDetails(this.bonusProcessDetailSearchForm.value).subscribe((response) => {
            var res = response as any;
            this.listOfBonusProcessDetail = res.body;
            var xPaginate = JSON.parse(res.headers.get('X-Pagination'));
            this.bonusProcessdetail_pager = this.userService.pageConfigInit("bonusProcessdetail_pager", xPaginate.itemsPerPage, xPaginate.currentPage, xPaginate.totalItems);
        }, (error) => { this.utilityService.httpErrorHandler(error) })
    }

    bonusProcessdetail_pager_changed(event: any) {

    }
    //#endregion

    //#region Disbursed-Modal
    disbursedableItem: any = null;
    showDisbursedModal: boolean = false;
    openDisbursedModal(id: any) {
        this.disbursedableItem = Object.assign({}, this.listOfBonusProcessInfo.find(item => item.bonusProcessId == id));
        console.log('this.disbursedableItem >>>', this.disbursedableItem);
        if (this.disbursedableItem != null) {
            this.showDisbursedModal = true;
        }
    }

    closeDisbursedModal(reason: any) {
        this.disbursedableItem = null;
        this.showDisbursedModal = false;
        if (reason == 'Save Complete') {
            this.getBonusProcessesInfo();
        }
    }
    //#endregion

    //#region Undo-Modal
    undoItem: any = null;
    showUndoModal: boolean = false;
    openUndoModal(id: any) {
        this.undoItem = Object.assign({}, this.listOfBonusProcessInfo.find(item => item.bonusProcessId == id));
        console.log('this.undoItem >>>', this.undoItem);
        if (this.undoItem != null) {
            this.showUndoModal = true;
        }
    }

    closeUndoModal(reason: any) {
        this.undoItem = null;
        this.showUndoModal = false;
        if (reason == 'Save Complete') {
            this.getBonusProcessesInfo();
        }
    }
    //#endregion

    //#region Undo Employee Modal
    undoEmployeeBonus: any = null;
    showEmployeeBonusUndo: boolean = false
    openEmployeeBonusUndoModal(id: any) {
        this.undoEmployeeBonus = Object.assign({}, this.listOfBonusProcessDetail.find(item => item.bonusProcessDetailId == id));
        console.log("this.undoEmployeeBonus >>>", this.undoEmployeeBonus);
        if (this.undoEmployeeBonus != null) {
            this.showEmployeeBonusUndo = true;
        }
    }

    closeEmployeeBonusUndoModal(reason: any) {
        this.undoEmployeeBonus = null;
        this.showEmployeeBonusUndo = false;
        if (reason == 'Save Complete') {
            this.getBonusProcessDetails();
        }
    }
    //#endregion

}