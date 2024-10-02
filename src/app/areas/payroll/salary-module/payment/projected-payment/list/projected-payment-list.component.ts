import { Component, OnInit } from "@angular/core";
import { BsDatepickerConfig } from "ngx-bootstrap/datepicker";
import { UserService } from "src/app/shared/services/user.service";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { bounceIn, fadeIn, fadeInRight, slideInUp } from "ng-animate";
import { ProjectedPaymentService } from "../projected-payment.service";
import { transition, trigger, useAnimation } from "@angular/animations";
import { UtilityService } from "src/app/shared/services/utility.service";
import { FiscalYearService } from "../../../setup/fiscalYear/fiscalYear.service";
import { AllowanceNameService } from "../../../allowance/allowance-head/allowance-name.service";
import { EmployeeInfoService } from "src/app/areas/employee_module/employee/employee-info.service";

@Component({
    selector: 'app-payroll-projected-payment-list',
    templateUrl: './projected-payment-list.component.html',
    animations: [
        trigger('slideInUp', [transition('* => *', useAnimation(slideInUp, { params: { timing: 0.5 } }))]),
        trigger('fadeIn', [transition('void => *', useAnimation(fadeIn, { params: { timing: 0.3 } }))]),
        trigger('fadeInRight', [transition('void => *', useAnimation(fadeInRight, { params: { timing: 0.5 } }))]),
        trigger('bounceIn', [transition('void => *', useAnimation(bounceIn, { params: { timing: 1 } }))]),
    ]
})

export class ProjectedPaymentListComponent implements OnInit {
    modalTitle: string = "";
    project_payment_page_size: number = 15;
    project_payment_page_nubmer: number = 1;
    project_payment_page_config: any = this.userService.pageConfigInit("project_payment_list", this.project_payment_page_size, 1, 0);

    list_of_status: any[] = this.utilityService.getDataStatus().filter(item => item == 'Pending' || item == 'Approved' || item == 'Cancelled' || item == 'Recheck' || item == 'Processed' || item == 'Disbursed');


    datePickerConfig: Partial<BsDatepickerConfig> = this.utilityService.datePickerConfig();
    select2Config = this.utilityService.select2Config();

    constructor(
        private userService: UserService, 
        public utilityService: UtilityService, 
        private fb: FormBuilder, 
        private projectedPaymentService: ProjectedPaymentService, 
        private allowanceNameService: AllowanceNameService, 
        private fiscalYearService: FiscalYearService, 
        private employeeInfoService: EmployeeInfoService) { }

    paymentSearchForm: FormGroup;
    ngOnInit(): void {
        this.paymentFormInit();
        this.processSearchFormInit();
        this.get_project_payment();
        this.getProjectedPaymentProcessInfos();
        this.loadEmployeeDropdown();
        this.loadAllowancesDropdown();
        this.loadFiscalYearDropdown();
    }

    ddlAllowances: any[] = [];
    isAllowanceLoadCompleted: boolean = false;
    loadAllowancesDropdown() {
        this.allowanceNameService.loadAllowanceNameDropdown();
        this.allowanceNameService.ddl$.subscribe(data => {
            this.ddlAllowances = data;
            this.isAllowanceLoadCompleted = true;
        }, (error) => {
            console.log("error  while fetching data >>>", error);
        })
    }


    ddlEmployees: any[];
    isEmployeeLoadCompleted: boolean = false;
    loadEmployeeDropdown() {
        this.employeeInfoService.loadDropdownData({});
        this.employeeInfoService.ddl_employee_data$.subscribe(data => {
            this.employeeInfoService.loadDropdown(data);
            this.ddlEmployees = this.employeeInfoService.ddl$;
            this.isEmployeeLoadCompleted = true;
        }, error => {
            console.error('Error while fetching data:', error);
        });
    }

    ddlFiscalYearDropdown: any[] = [];
    loadFiscalYearDropdown() {
        this.fiscalYearService.loadDropdown();
        this.fiscalYearService.ddl$.subscribe(response => {
            this.ddlFiscalYearDropdown = response;
        })
    }

    paymentFormInit() {
        this.paymentSearchForm = this.fb.group({
            employeeId: new FormControl(0),
            allowanceNameId: new FormControl(0),
            paymentMonth: new FormControl(0),
            paymentYear: new FormControl(0),
            fiscalYearId: new FormControl(0),
            sortingCol: new FormControl(''),
            sortType: new FormControl(''),
            pageNumber: new FormControl(this.project_payment_page_nubmer),
            pageSize: new FormControl(this.project_payment_page_size)
        })

        this.paymentSearchForm.get('employeeId').valueChanges.subscribe(data => {
            this.resetPage();
            this.get_project_payment();
        })

        this.paymentSearchForm.get('allowanceNameId').valueChanges.subscribe(data => {
            this.resetPage();
            this.get_project_payment();
        })

        this.paymentSearchForm.get('fiscalYearId').valueChanges.subscribe(data => {
            this.resetPage();
            this.get_project_payment();
        })
    }

    resetPage() {
        this.paymentSearchForm.get('pageNumber').setValue(1);
    }

    User() {
        return this.userService.User();
    }

    list_of_project_payment: any[] = null;
    get_project_payment() {
        if (this.isAllowanceLoadCompleted && this.isEmployeeLoadCompleted) {
            this.projectedPaymentService.get(this.paymentSearchForm.value).subscribe(response => {
                this.list_of_project_payment = response.body;
                var xPaginate = JSON.parse(response.headers.get('X-Pagination'));
                this.project_payment_page_config = this.userService.pageConfigInit("project_payment_list", xPaginate.itemsPerPage, xPaginate.currentPage, xPaginate.totalItems);
            }, (error) => {
                this.utilityService.fail("Something went wrong", "Server Response");
            })
        }
    }

    project_payment_page_changed(event: any) {
        this.project_payment_page_nubmer = event;
        this.paymentSearchForm.get('pageNumber').setValue(this.project_payment_page_nubmer);
        this.get_project_payment();
    }

    //#region projected payment insert update modal
    showProjectPaymentInsertUpdateModal: boolean = false;
    projectedPaymentId: number = 0;
    showProjectPaymentModal(id: number) {
        this.showProjectPaymentInsertUpdateModal = true;
        this.projectedPaymentId = id;
    }

    hideProjectPaymentModal(reason: any) {
        this.showProjectPaymentInsertUpdateModal = false;
        this.projectedPaymentId = 0;
        if (reason == this.utilityService.SaveComplete) {
            this.get_project_payment();
        }
    }
    //#endregion projected payment insert update modal

    //#region projected payment insert  modal
    showInsertModal: boolean = false;
    showProjectedPaymentInsertModal() {
        this.showInsertModal = true;
    }

    hideProjectedPaymentInsertModal(reason: any) {
        this.showInsertModal = false;
        if (reason == this.utilityService.SaveComplete) {
            this.get_project_payment();
        }
    }
    //#endregion projected payment insert modal

    //#region Projected Payment upload modal
    showDataUploadModal: boolean = false;
    showUploadModal() {
        this.showDataUploadModal = true;
    }

    hideUploadModal(reason: any) {
        this.showDataUploadModal = false;
        if (reason == this.utilityService.SuccessfullySaved) {
            this.get_project_payment();
        }
    }
    //#endregion Projected Payment upload modal

    //#region projected payment process
    pageNumber: number = 1;
    pageSize: number = 15;
    pageConfig: any = this.userService.pageConfigInit("info_list", this.pageSize, 1, 0);

    ddlYears: any = this.utilityService.getYears(2);
    ddlMonths: any = this.utilityService.getMonths();

    projectedPaymentProcessInfoId: any = 0;
    showProcessModal: boolean = false;
    openProcessModal() {
        this.showProcessModal = true;
    }

    closeProcessModal(reason: any) {
        this.showProcessModal = false;
        if (reason == this.utilityService.SuccessfullySaved) {
            this.get_project_payment();
            this.getProjectedPaymentProcessInfos();
        }
    }
    //#endregion

    //#region Projected Payment Info
    resetprocessSearchPage() {
        this.processSearchForm.get('pageNumber').setValue(1);
    }

    processSearchForm: FormGroup;
    processSearchFormInit() {
        this.processSearchForm = this.fb.group({
            paymentMonth: new FormControl(0),
            paymentYear: new FormControl(0),
            stateStatus: new FormControl(''),
            fiscalYearId: new FormControl(0),
            pageNumber: new FormControl(this.project_payment_info_page_nubmer),
            pageSize: new FormControl(this.project_payment_info_page_size)
        })

        this.processSearchForm.get('paymentMonth').valueChanges.subscribe(data => {
            this.resetprocessSearchPage();
            this.getProjectedPaymentProcessInfos();
        })
        this.processSearchForm.get('paymentYear').valueChanges.subscribe(data => {
            this.resetprocessSearchPage();
            this.getProjectedPaymentProcessInfos();
        })
        this.processSearchForm.get('fiscalYearId').valueChanges.subscribe(data => {
            this.resetprocessSearchPage();
            this.getProjectedPaymentProcessInfos();
        })
        this.processSearchForm.get('stateStatus').valueChanges.subscribe(data => {
            this.resetprocessSearchPage();
            this.getProjectedPaymentProcessInfos();
        })
    }


    project_payment_info_page_size: number = 15;
    project_payment_info_page_nubmer: number = 1;
    project_payment_info_page_config: any = this.userService.pageConfigInit("project_payment_info_list", this.project_payment_info_page_size, 1, 0);

    project_payment_info_page_changed(event: any) {
        this.project_payment_info_page_nubmer = event;
        this.paymentSearchForm.get('pageNumber').setValue(this.project_payment_info_page_nubmer);
        this.getProjectedPaymentProcessInfos();
    }

    listOfProjectedPaymentInfos: any[] = []
    getProjectedPaymentProcessInfos() {
        this.projectedPaymentService.getProjectedPaymentProcessInfos(this.processSearchForm.value).subscribe(response => {
            console.log("response >>>", response);
            this.listOfProjectedPaymentInfos = response.body;
            var xPaginate = JSON.parse(response.headers.get('X-Pagination'));
            this.project_payment_info_page_config = this.userService.pageConfigInit("project_payment_info_list", xPaginate.itemsPerPage, xPaginate.currentPage, xPaginate.totalItems);
        }, (error) => {
            this.utilityService.httpErrorHandler(error);
        })
    }


    downloadProjectedPaymentSheet(processCode: string, projectedAllowanceProcessInfoId: number, fiscalYearId: number, month: number, year: number, format: string) {
        let params = { projectedAllowanceProcessInfoId: projectedAllowanceProcessInfoId, employeeId: 0, fiscalYearId: fiscalYearId, paymentMonth: month, paymentYear: year, format: format };
        let monthName = this.utilityService.getMonthName(month);
        let fileName = `Projected_Payment_Sheet_${monthName}_${year}_${processCode}.xlsx`;
        this.projectedPaymentService.downloadProjectedPaymentSheet(params).subscribe((response) => {
            if (response.size > 0) {
                var blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                const link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.download = fileName;
                link.click();
            }
            else {
                this.utilityService.warning("No file found")
            }
        },
            (error) => { this.utilityService.httpErrorHandler(error) }
        )
    }

    //#endregion Projected Payment Info

    //#region Delete Pending projected payment
    showPendingProjectedAllowanceDeleteModal: boolean = false;
    pendingAllowanceItemId: number = 0

    openPendingProjectedAllowanceDeleteModal(id: number) {
        this.pendingAllowanceItemId = id;
        this.showPendingProjectedAllowanceDeleteModal = true;
    }

    closePendingProjectedAllowanceDeleteModal(reason: any) {
        this.pendingAllowanceItemId = 0;
        this.showPendingProjectedAllowanceDeleteModal = false;
        if (reason == this.utilityService.SaveComplete) {
            this.get_project_payment();
        }
    }

    //#endregion Delete Pending projected payment

    //#region Delete Approved projected payment
    showApprovedProjectedAllowanceDeleteModal: boolean = false;
    approvedAllowanceItemId: number = 0

    openApprovedProjectedAllowanceDeleteModal(id: number) {
        this.approvedAllowanceItemId = id;
        this.showApprovedProjectedAllowanceDeleteModal = true;
    }

    closeApprovedProjectedAllowanceDeleteModal(reason: any) {
        this.approvedAllowanceItemId = 0;
        this.showApprovedProjectedAllowanceDeleteModal = false;
        if (reason == this.utilityService.SaveComplete) {
            this.get_project_payment();
        }
    }

    //#endregion Delete Approved projected payment

    //#region Update Projected Payment
    payment_id_in_update_modal: number=0;
    showUpdateModal: boolean = false;
    openUpdateModal(id: any){
        this.payment_id_in_update_modal = id;
        this.showUpdateModal= true;
    }
    closeUpdateModal(event : any){
        this.payment_id_in_update_modal = 0;
        this.showUpdateModal= false;
        if(event == 'Save Complete'){
            this.get_project_payment();
        }
    }
    //#endregion Update Projected Payment

    //#region Approval
    payment_id_in_approval_modal: number=0;
    showApprovalModal: boolean = false;
    openApprovalModal(id: any){
        this.payment_id_in_approval_modal = id;
        this.showApprovalModal= true;
    }
    closeApprovalModal(event : any){
        this.payment_id_in_approval_modal = 0;
        this.showApprovalModal= false;
        if(event == 'Save Complete'){
            this.get_project_payment();
        }
    }
    //#endregion Approval
}