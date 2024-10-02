import { Component, OnInit } from "@angular/core";
import { UserService } from "src/app/shared/services/user.service";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { fadeIn, fadeInUp, fadeOutLeft, slideInUp } from "ng-animate";
import { transition, trigger, useAnimation } from "@angular/animations";
import { UtilityService } from "src/app/shared/services/utility.service";
import { PeriodicalVariableAllowanceService } from "../periodical-variable-allowance.service";

@Component({
    selector: 'app-payroll-periodical-variable-allowance-list',
    templateUrl: './periodical-variable-allowance-list.component.html',
    animations: [
        trigger('fadeIn', [transition('void => *', useAnimation(fadeIn, { params: { timing: 0.3 } }))]),
        trigger('slideInUp', [transition('* => *', useAnimation(slideInUp, { params: { timing: 0.5 } }))]),
        trigger('fadeInUp', [transition('void => *', useAnimation(fadeInUp))]),
        trigger('fadeOutLeft', [transition('* => void', useAnimation(fadeOutLeft, { params: { timing: 0.3 } }))]),
    ],
})

export class PeriodicalVariableAllowanceListComponent implements OnInit {

    constructor(
        private userService: UserService,
        private utilityService: UtilityService,
        private info_service: PeriodicalVariableAllowanceService,
        private fb: FormBuilder
    ) {
    }

    pageNumber: number = 1;
    pageSize: number = 15;
    pagePrivilege: any = this.userService.getPrivileges();
    list_page_config: any = this.userService.pageConfigInit("list_of_info", this.pageSize, 1, 0);

    ngOnInit(): void {
        this.getInfo();
    }

    showInsertUpdateModal: boolean = false;

    infoSearchForm: FormGroup;
    searchFormInit() {
        this.infoSearchForm = this.fb.group({
            allowanceNameId: new FormControl(),
            amountBaseOn: new FormControl(),
            specifyFor: new FormControl(''),
            stateStatus: new FormControl(''),
            sortingCol: new FormControl(''),
            sortType: new FormControl(''),
            pageNumber: new FormControl(this.pageNumber),
            pageSize: new FormControl(this.pageSize)
        })
    }

    list_page_changed(event: any) {
        this.pageNumber = event;
        this.infoSearchForm.get('pageNumber').setValue(this.pageNumber);
        this.getInfo();
    }

    list: any = []

    getInfo() {
        this.info_service.getAll(this.infoSearchForm).subscribe({
            next: (response) => {
                console.log("response >>>", response);
                this.list = response.body;
                console.log("list >>>", this.list);
                let xPaginate = JSON.parse(response.headers.get('X-Pagination'));
                this.list_page_config = this.userService.pageConfigInit("list_of_info", xPaginate.itemsPerPage, xPaginate.currentPage, xPaginate.totalItems);
            },
            error: (error) => {
                this.utilityService.fail(error.msg, "Server Response");
            }
        })
    }

    showModal() {
        this.showInsertUpdateModal = true;
    }

    closeModal(reason: any) {
        this.getInfo();
        this.showInsertUpdateModal = false;
    }

    //#region head-info
    showHeadInfo: boolean = false;
    itemId: number = 0;
    openHeadInfoModal(id: number) {
        this.itemId = id;
        this.showHeadInfo = true;
    }

    closeHeadInfoModal(reason: any) {
        this.itemId = 0;
        this.showHeadInfo = false;
    }
    //#endregion head-info


    //#region principle-amount
    showPrincipleInfo: boolean = false;
    openPrincipleInfoModal(id: number) {
        this.itemId = id;
        this.showPrincipleInfo = true;
    }

    closePrincipleInfoModal(reason: any) {
        this.itemId = 0;
        this.showPrincipleInfo = false;
    }
    //#endregion head-info

}