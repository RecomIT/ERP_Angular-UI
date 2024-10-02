import { transition, trigger, useAnimation } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { fadeIn, fadeInUp, fadeOutLeft, slideInUp } from 'ng-animate';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { ToastrService } from 'ngx-toastr';
import { CustomModalService } from 'src/app/shared/services/custom-modal.service';
import { UserService } from 'src/app/shared/services/user.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { EmploymentConfirmationSerivce } from '../employment-confirmation.service';
import { EmployeeInfoService } from '../../employee-info.service';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-employee-module-confirmation-proposal-list',
    templateUrl: './employee-confirmation-proposal.component.html',
    animations: [
        trigger('fadeIn', [transition('void => *', useAnimation(fadeIn, { params: { timing: 0.3 } }))]),
        trigger('slideInUp', [transition('* => *', useAnimation(slideInUp, { params: { timing: 0.5 } }))]),
        trigger('fadeInUp', [transition('void => *', useAnimation(fadeInUp))]),
        trigger('fadeOutLeft', [transition('* => void', useAnimation(fadeOutLeft, { params: { timing: 0.3 } }))]),
    ],
})

export class EmployeeConfirmationProposalComponent implements OnInit {

    pagePrivilege: any = this.userService.getPrivileges();
    datePickerConfig: Partial<BsDatepickerConfig> = this.utilityService.datePickerConfig();
    pageNumber: number = 1;
    pageSize: number = 15;
    list_pager: any = this.userService.pageConfigInit("proposal_list_pager", this.pageSize, 1, 0);
    constructor(private fb: FormBuilder,
        public toastr: ToastrService,
        private userService: UserService,
        private datepipe: DatePipe,
        public utilityService: UtilityService,
        public modalService: CustomModalService,
        private employeeInfoService: EmployeeInfoService,
        private employmentConfirmationSerivce: EmploymentConfirmationSerivce) {

    }



    ngOnInit(): void {
        this.searchFormInit();
        this.getDataStatus();
        this.getEmploymentConfirmationProposal();
    }

    ddlStatus: any[] = [];
    getDataStatus() {
        this.ddlStatus = this.utilityService.getDataStatus().filter(item => item == "Pending" || item == "Approved" || item == "Cancelled")
    }

    select2Options = {
        width: "100%",
        containerCssClass: "form-control form-control-sm text-x-small",
        theme: "bootstrap4",
    }

    searchForm: FormGroup;

    ddlEmployees: any[];
    loadEmployees() {
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
            employeeId: new FormControl(''),
            employeeCode: new FormControl(''),
            confirmationDate: new FormControl(null),
            stateStatus: new FormControl(''),
            sortingCol: new FormControl(''),
            sortType: new FormControl(''),
            pageNumber: new FormControl(this.pageNumber),
            pageSize: new FormControl(this.pageSize)
        })

        this.loadEmployees();
        this.searchForm.get('employeeId').valueChanges.subscribe((item) => {
            this.pageNumber = 1;
            this.getEmploymentConfirmationProposal();
            this.searchForm.get('pageNumber').setValue(this.pageNumber);
        })
        this.searchForm.get('confirmationDate').valueChanges.subscribe((item) => {
            this.pageNumber = 1;
            this.getEmploymentConfirmationProposal();
            this.searchForm.get('pageNumber').setValue(this.pageNumber);
        })
        this.searchForm.get('stateStatus').valueChanges.subscribe((item) => {
            this.pageNumber = 1;
            this.getEmploymentConfirmationProposal();
            this.searchForm.get('pageNumber').setValue(this.pageNumber);
        })
    }

    list_pageChanged(event: any) {
        this.pageNumber = event;
        this.searchForm.get('pageNumber').setValue(this.pageNumber);
        this.getEmploymentConfirmationProposal();
    }

    listOfProposal: any[] = [];
    propsalDTLabel: any;
    getEmploymentConfirmationProposal() {
        let params = {
            confirmationProposalId: 0,
            employeeId: this.searchForm.get('employeeId').value == null ? 0 : this.searchForm.get('employeeId').value,
            employeeCode: this.searchForm.get('employeeCode').value,
            fromDate:
                this.searchForm.get('confirmationDate').value != null
                    && this.searchForm.get('confirmationDate').value != undefined ?
                    this.datepipe.transform(this.searchForm.get('confirmationDate').value[0], "yyyy-MM-dd").toString() : '',
            toDate:
                this.searchForm.get('confirmationDate').value != null &&
                    this.searchForm.get('confirmationDate').value != undefined ?
                    this.datepipe.transform(this.searchForm.get('confirmationDate').value[1], "yyyy-MM-dd").toString() : '',
            stateStatus: this.searchForm.get('stateStatus').value,
            sortingCol: this.searchForm.get('sortingCol').value,
            sortType: this.searchForm.get('sortType').value,
            pageNumber: this.searchForm.get('pageNumber').value,
            pageSize: this.searchForm.get('pageSize').value,
        };

        this.listOfProposal = []
        this.employmentConfirmationSerivce.get(params).subscribe(response => {
            this.listOfProposal = response.body;
            let xPaginate = JSON.parse(response.headers.get('X-Pagination'));
            this.list_pager = this.userService.pageConfigInit("proposal_list_pager", xPaginate.itemsPerPage, xPaginate.currentPage, xPaginate.totalItems);
            this.propsalDTLabel = this.listOfProposal.length == 0 ? "No record(s) found" : "";
        }, (error) => {
            this.utilityService.fail("Something went wrong", "Server Response")
            console.log("error >>>", error);
        })
    }

    modalId: number = 0;
    showInsertUpdateModal: boolean = false;
    openModal(id: number) {
        this.modalId = id;
        this.showInsertUpdateModal = true;
    }

    closeModal(reason: string) {
        this.showInsertUpdateModal = false;
        this.modalId = 0;
        if (reason == 'Save Complete') {
            this.getEmploymentConfirmationProposal()
        }
    }

    //#region approval modal
    approvalId: number = 0;
    showApprovalModal: boolean = false;
    confiramtion_data: any;
    employee_Id: any;
    openApprovalModal(id: number, emp_id: number) {
        this.approvalId = id;
        this.employee_Id = emp_id;
        this.confiramtion_data = Object.assign({}, this.listOfProposal.find(item => item.confirmationProposalId == id));
        this.showApprovalModal = true;
    }

    closeApprovalModal(reason: string) {
        this.showApprovalModal = false;
        this.approvalId = 0;
        this.employee_Id = 0;
        if (reason == 'Save Complete') {
            this.getEmploymentConfirmationProposal()
        }
    }
    //#endregion


}