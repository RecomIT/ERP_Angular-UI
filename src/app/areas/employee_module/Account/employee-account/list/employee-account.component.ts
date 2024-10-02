import { transition, trigger, useAnimation } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { fadeIn, fadeInUp, fadeOutLeft, slideInUp } from 'ng-animate';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { UserService } from 'src/app/shared/services/user.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { EmployeeAccountService } from '../employee-account.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { EmployeeInfoService } from '../../../employee/employee-info.service';

@Component({
    selector: 'employee-module-salary-account-list',
    templateUrl: './employee-account.component.html',
    animations: [
        trigger('fadeIn', [transition('void => *', useAnimation(fadeIn, { params: { timing: 0.3 } }))]),
        trigger('slideInUp', [transition('* => *', useAnimation(slideInUp, { params: { timing: 0.5 } }))]),
        trigger('fadeInUp', [transition('void => *', useAnimation(fadeInUp))]),
        trigger('fadeOutLeft', [transition('* => void', useAnimation(fadeOutLeft, { params: { timing: 0.3 } }))]),
    ],
})
export class EmployeeSalaryAccountComponent implements OnInit {

    pageSize: number = 15;
    pageNo: number = 1;
    pageConfig: any = this.userService.pageConfigInit("data_list", this.pageSize, 1, 0);
    datePickerConfig: Partial<BsDatepickerConfig> = this.utilityService.datePickerConfig();
    pagePrivilege: any = this.userService.getPrivileges();
    constructor(
        private fb: FormBuilder,
        private utilityService: UtilityService,
        private userService: UserService,
        private employeeInfoService: EmployeeInfoService,
        private employeeAccountService: EmployeeAccountService) {
    }

    ngOnInit(): void {
        this.searchFormInit();
        this.get();
        this.loadEmployeeDropdown();
        console.log("pagePrivilege >>>", this.pagePrivilege);
    }

    select2Options = this.utilityService.select2Config();
    paymentModes = this.utilityService.getPaymentModes();

    searchForm: FormGroup;
    ddlEmployees: any[];

    loadEmployeeDropdown() {
        this.employeeInfoService.loadDropdownData({});
        this.employeeInfoService.ddl_employee_data$.subscribe(data => {
            this.employeeInfoService.loadDropdown(data);
            this.ddlEmployees = this.employeeInfoService.ddl$;
        }, error => {
            console.error('Error while fetching data:', error);
        });
    }

    searchFormInit() {
        this.searchForm = this.fb.group({
            accountInfoId: new FormControl(''),
            employeeId: new FormControl(''),
            paymentMode: new FormControl(''),
            accountNo: new FormControl(''),
            bankId: new FormControl(''),
            bankBranchId: new FormControl(''),
            agentName: new FormControl(''),
            isActive: new FormControl(''),
            stateStatus: new FormControl(''),
            pageNumber: new FormControl(this.pageNo),
            pageSize: new FormControl(this.pageSize)
        })

        this.searchForm.get('employeeId').valueChanges.subscribe(item => {
            this.resetPage();
            this.get();
        });
        this.searchForm.get('paymentMode').valueChanges.subscribe(item => {
            this.resetPage();
            this.get();
        })
        this.searchForm.get('accountNo').valueChanges.subscribe(item => {
            this.resetPage();
            this.get();
        })
        this.searchForm.get('stateStatus').valueChanges.subscribe(item => {
            this.resetPage();
            this.get();
        })
    }

    list: any[] = [];
    list_loading_label: string = null;

    get() {
        this.employeeAccountService.get(this.searchForm.value).subscribe((response) => {
            this.list = response.body as any[];
            this.list_loading_label = this.list.length > 0 ? "" : 'No records found';
            let xPaginate = JSON.parse(response.headers.get('X-Pagination'));
            this.pageConfig = this.userService.pageConfigInit("data_list", xPaginate.itemsPerPage, xPaginate.currentPage, xPaginate.totalItems);
        }, (error) => {
            console.log("error >>>", error);
            this.utilityService.fail("Something went wrong", "Server Response");
        })
    }

    page_changed($event: any) {
        this.pageNo = $event;
        this.searchForm.get('pageNumber').setValue(this.pageNo);
        this.get();
    }

    isShowingInsertUpdateModal: boolean = false;
    itemId: number = 0;

    showModal(id: number) {
        console.log("id >>>", id);
        this.isShowingInsertUpdateModal = true;
        this.itemId = id;
    }

    resetPage() {
        this.searchForm.get('pageNumber').setValue(1);
    }

    modalObj: any = null;
    showInsertUpdateModal: boolean = false;
    accountAccountInfoId: number = 0;
    openModal(id: number) {
        this.showInsertUpdateModal = true;
        this.accountAccountInfoId = id;
    }

    closeModal(reason: any) {
        this.showInsertUpdateModal = false;
        this.modalObj = null;
        if (reason == 'Save Complete') {
            this.get();
        }
    }

    showApprovalModal: boolean = false;
    accountInfoId: number = 0;
    employeeId: number = 0;
    openApprovalModal(id: number, employeeId: number) {
        this.employeeId = employeeId;
        this.accountInfoId = id;
        this.showApprovalModal = true
    }

    closeApprovalModal(reason: any) {
        this.showApprovalModal = false;
        this.modalObj = null;
        if (reason == 'Save Complete') {
            this.get();
        }
    }

    // Added by Monzur 29-Nov-2023
    accountInfoIdId: any = 0;
    isUploadAccountInfoModal: boolean = false;
    openUploadAccountInfoModal() {
        this.isUploadAccountInfoModal = true;
        this.accountInfoIdId = 0;
    }

    closeUploadAccountInfoModal(reason: any) {
        this.isUploadAccountInfoModal = false;
        this.accountInfoIdId = 0;
        if (reason == 'Save Complete') {
            this.get();
        }
    }
}
