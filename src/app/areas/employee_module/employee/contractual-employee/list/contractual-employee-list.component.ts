import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { Component, OnInit } from "@angular/core";
import { EmployeeInfoService } from "../../employee-info.service";
import { UserService } from "src/app/shared/services/user.service";
import { UtilityService } from "src/app/shared/services/utility.service";
import { ContractualEmployeeService } from "../contractual-employee.service";
import { slideInUp } from "ng-animate";
import { transition, trigger, useAnimation } from "@angular/animations";
import { error } from "console";

@Component({
    selector: 'employee-module-contractual-employee-list',
    templateUrl: './contractual-employee-list.component.html',
    animations: [
        trigger('slideInUp', [transition('* => *', useAnimation(slideInUp, { params: { timing: 0.5 } }))])
    ],
})

export class ContractualEmployeeComponentList implements OnInit {

    pageNumber: number = 1;
    pageSize: number = 15;
    pageConfig = this.userService.pageConfigInit("data_list", this.pageSize, 1, 0);

    public datePickerConfig: any = this.utilityService.datePickerConfig();
    constructor(public utilityService: UtilityService, public userService: UserService,
        private contractualEmployeeService: ContractualEmployeeService,
        private employeeInfoService: EmployeeInfoService, private fb: FormBuilder) { }

    ngOnInit(): void {
        this.searchFormInit();
        this.loadEmployeeDropdown();
        this.getcontractualEmployees();
    }
    select2Options: any = this.utilityService.select2Config();

    list: any[] = [];
    listDTLabel: any = ''

    ddlStatus: any[] = this.utilityService.getDataStatus();

    ddlEmployees: any[] = [];
    loadEmployeeDropdown() {
        this.employeeInfoService.loadDropdownData({ jobType: 'Contractual' });
        this.employeeInfoService.ddl_employee_data$.subscribe(data => {
            this.employeeInfoService.loadDropdown(data);
            this.ddlEmployees = this.employeeInfoService.ddl$;
        }, error => {
            console.error('Error while fetching data:', error);
        });
    }

    searchForm: FormGroup;

    searchFormInit() {
        this.searchForm = this.fb.group({
            employeeId: new FormControl(0),
            contractDate: new FormControl(),
            stateStatus: new FormControl(),
            sortingCol: new FormControl(''),
            sortType: new FormControl(''),
            pageNumber: new FormControl(this.pageNumber),
            pageSize: new FormControl(this.pageSize)
        })

        this.searchForm.get('employeeId').valueChanges.subscribe(value => {
            this.resetPage();
            this.getcontractualEmployees();
        })

        this.searchForm.get('contractDate').valueChanges.subscribe(value => {
            this.resetPage();
            this.getcontractualEmployees();
        })

        this.searchForm.get('stateStatus').valueChanges.subscribe(value => {
            this.resetPage();
            this.getcontractualEmployees();
        })
    }

    resetPage() {
        this.searchForm.get('pageNumber').setValue(1);
    }

    getcontractualEmployees() {
        this.contractualEmployeeService.get(this.searchForm.value).subscribe(response => {
            console.log("response >>>", response);
            this.list = response.body;
            var xPaginate = JSON.parse(response.headers.get('X-Pagination'));
            this.pageConfig = this.userService.pageConfigInit("data_list", xPaginate.itemsPerPage, xPaginate.currentPage, xPaginate.totalItems);
        }, (error) => {
            this.utilityService.httpErrorHandler(error);
        })
    }

    list_pageChanged(event: any) {
        this.pageNumber = event;
    }

    showInsertUpdateModal: boolean = false;
    editedId: number = 0;
    openModal(id: any) {
        this.showInsertUpdateModal = true;
        this.editedId = id;
    }

    closeModal(reason: any) {
        this.showInsertUpdateModal = false;
        if (reason == this.utilityService.SuccessfullySaved) {
            this.getcontractualEmployees();
        }
    }

    contract_id_in_approval: number = 0;
    employee_id_in_approval: number = 0;
    lastContractId_in_approval: number = 0;
    showApprovalModal: boolean = false;
    openApprovalModal(id: any, employeeId: any, lastContractId: any) {
        this.contract_id_in_approval = id;
        this.employee_id_in_approval = employeeId;
        this.lastContractId_in_approval = lastContractId;
        this.showApprovalModal= true;
        console.log("this.contract_id_in_approval >>>", this.contract_id_in_approval);
        console.log("this.employee_id_in_approval >>>", this.employee_id_in_approval);
        console.log("this.lastContractId_in_approval >>>", this.lastContractId_in_approval);
    }

    closeApprovalModal(reason: any) {
        this.showApprovalModal = false;
    }

    showUploadModal: boolean = false;
    openUploadModal() {
        this.showUploadModal = true;
    }

    closeUploadModal(reason: any) {
        this.showUploadModal = false;
        if (reason == this.utilityService.SuccessfullySaved) {
            this.getcontractualEmployees();
        }
    }




}