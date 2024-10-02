import { Component, OnInit } from "@angular/core";
import { UserService } from "src/app/shared/services/user.service";
import { UtilityService } from "src/app/shared/services/utility.service";
import { ConditionalProjectedPaymentService } from "../conditional-projected-payment.service";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { transition, trigger, useAnimation } from "@angular/animations";
import { bounceIn, fadeIn, fadeInRight, fadeOutLeft, slideInUp } from "ng-animate";
import { FiscalYearService } from "../../../setup/fiscalYear/fiscalYear.service";
import { AllowanceNameService } from "../../../allowance/allowance-head/allowance-name.service";


@Component({
    selector: 'app-payroll-conditional-deposit-allowance-list',
    templateUrl: './conditional-projected-payment-list.component.html',
    animations: [
        trigger('slideInUp', [transition('* => *', useAnimation(slideInUp, { params: { timing: 0.5 } }))]),
        trigger('fadeIn', [transition('void => *', useAnimation(fadeIn, { params: { timing: 0.3 } }))]),
        trigger('fadeInRight', [transition('void => *', useAnimation(fadeInRight, { params: { timing: 0.5 } }))]),
        trigger('bounceIn', [transition('void => *', useAnimation(bounceIn, { params: { timing: 1 } }))]),
        trigger('fadeOutLeft', [transition('* => void', useAnimation(fadeOutLeft, { params: { timing: 0.3 } }))]),
    ]
})

export class ConditionalProjectedPaymentList implements OnInit {
    pageNumber: number = 1;
    pageSize: number = 15;
    pagePrivilege: any = this.userService.getPrivileges();
    list_page_config: any = this.userService.pageConfigInit("list_of_data", this.pageSize, 1, 0);
    constructor(
        private service: ConditionalProjectedPaymentService,
        private userService: UserService,
        public utilityService: UtilityService,
        private fb: FormBuilder,
        private fiscalYearService: FiscalYearService,
        private allowanceNameService: AllowanceNameService
    ) {

    }
    ngOnInit(): void {
        this.serach_list_form_init();
        this.loadFiscalYearDropdown();
        this.loadAllowancesDropdown();
        this.get();
    }

    ddlFiscalYearDropdown: any[] = [];
    loadFiscalYearDropdown() {
        this.fiscalYearService.loadDropdown();
        this.fiscalYearService.ddl$.subscribe(response => {
            this.ddlFiscalYearDropdown = response;
        })
    }

    ddlAllowances: any[] = [];
    loadAllowancesDropdown() {
        this.allowanceNameService.loadAllowanceNameDropdown();
        this.allowanceNameService.ddl$.subscribe(data => {
            console.log("data >>>", data);
            this.ddlAllowances = data;
        }, (error) => {
            console.log("error  while fetching data >>>", error);
        })
    }

    serach_list_form: FormGroup;
    select2Config: any = this.utilityService.select2Config();
    serach_list_form_init() {
        this.serach_list_form = this.fb.group({
            allowanceNameId: new FormControl(0),
            fiscalYearId: new FormControl(0),
            stateStatus: new FormControl(''),
            sortingCol: new FormControl(''),
            sortType: new FormControl(''),
            pageNumber: new FormControl(this.pageNumber),
            pageSize: new FormControl(this.pageSize)
        })

        this.serach_list_form.valueChanges.subscribe({
            next: (value) => {
                this.get();
            }
        })
    }

    list: any = null;
    get() {
        this.list = null;
        this.service.get(this.serach_list_form.value).subscribe({
            next: (response) => {
                this.list = response.body
                var xPaginate = JSON.parse(response.headers.get('X-Pagination'));
                this.list_page_config = this.userService.pageConfigInit("list_pager", xPaginate.itemsPerPage, xPaginate.currentPage, xPaginate.totalItems);
            },
            error: (error) => {
                console.log(error)
            }
        })
    }

    pageChanged(event: any) {
        this.pageNumber = event;
        this.serach_list_form.get('pageNumber').setValue(this.pageNumber);
        this.get();
    }

    resetPage() {
        this.serach_list_form.get('pageNumber').setValue(1);
    }

    showInsertModal: boolean = false;
    openInsertModal() {
        this.showInsertModal = true;
    }

    closeInsertModal(reason: any) {
        this.showInsertModal = false;
        if(reason == 'Save Complete'){
            this.get();
        }
    }

    showApprovalModal: boolean = false;
    item_id: number;
    openApprovalModal(id: number) {
        this.item_id= id;
        this.showApprovalModal = true;
    }

    closeApprovalModal(reason: any) {
        this.showApprovalModal = false;
        if(reason == 'Save Complete'){
            this.get();
        }
    }

}