import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { BsDatepickerConfig } from "ngx-bootstrap/datepicker";
import { AreasHttpService } from "../../../../areas.http.service";
import { ToastrService } from "ngx-toastr";
import { UserService } from "src/app/shared/services/user.service";
import { UtilityService } from "src/app/shared/services/utility.service";
import { CustomModalService } from "src/app/shared/services/custom-modal.service";
import { ControlPanelWebService } from "src/app/shared/services/control-panel.service";
import { HrWebService } from "src/app/shared/services/hr-web.service";
import { DatePipe } from "@angular/common";
import { HttpErrorResponse } from "@angular/common/http";
import { ApiArea, ApiController } from "src/app/shared/constants";
import { transition, trigger, useAnimation } from "@angular/animations";
import { bounceIn, fadeIn, fadeInRight, slideInUp } from "ng-animate";

@Component({
    selector:'app-hr-employment-probationary-extension-proposal',
    templateUrl:'./employee-probation-extension-proposal.component.html',
    animations: [
        trigger('slideInUp', [transition('* => *', useAnimation(slideInUp, { params: { timing: 0.5 } }))]),
        trigger('fadeIn', [transition('void => *', useAnimation(fadeIn, { params: { timing: 0.3 } }))]),
        trigger('fadeInRight', [transition('void => *', useAnimation(fadeInRight, { params: { timing: 0.5 } }))]),
        trigger('bounceIn', [transition('void => *', useAnimation(bounceIn, { params: { timing: 1 } }))]),
    ]
})

export class EmployeeProbationaryExtensionProposalComponent implements OnInit{

    pagePrivilege: any= this.userService.getPrivileges();
    datePickerConfig: Partial<BsDatepickerConfig> = {};
    pageNumber: number = 1;
    pageSize: number = 15;
    list_pager: any = this.userService.pageConfigInit("proposal_list_pager", this.pageSize, 1, 0);
    
    constructor(private router: Router, private fb: FormBuilder, private areasHttpService: AreasHttpService,
        public toastr: ToastrService,
        private userService: UserService,
        public utilityService: UtilityService,
        public modalService: CustomModalService,
        private controlPanelWebService: ControlPanelWebService,
        private hrWebService: HrWebService,
        private datepipe: DatePipe){

    }

    ngOnInit(): void {
        this.datePickerConfig = Object.assign({}, {
            containerClass: "theme-dark-blue",
            showWeekNumbers: false,
            dateInputFormat: "DD-MMM-YYYY",
            isAnimated: true,
            showClearButton: false,
            showTodayButton: false,
            todayPosition: "left",
            rangeInputFormat: "DD-MMM-YYYY",
            rangeSeparator: " ~ "
        });

        this.searchFormInit();
        this.loadEmployees();
        this.getDataStatus();
        this.getEmploymentProbationaryExtension();
    }

    select2Options = {
        width: "100%",
        containerCssClass: "form-control form-control-sm text-x-small",
        theme: "bootstrap4",
    }

    ddlStatus: any[] = [];
    getDataStatus() {
        this.ddlStatus = this.utilityService.getDataStatus().filter(item => item == "Pending" || item == "Approved" || item == "Cancelled")
    }

    checkUserPrivilege(component: string) {
        this.controlPanelWebService.getCheckUserprivilege<any>(component).then((data: any) => {
            if (data != null) {
                this.pagePrivilege = data;
                console.log("pagePrivilege>>", this.pagePrivilege);
            }
            else {
                this.router.navigate(['/areas/unauthorized']);
            }
        }).catch((error) => {
            if (error instanceof HttpErrorResponse) {
            }
            this.router.navigate(['/areas/unauthorized']);
        })
    }

    searchForm: FormGroup;
    ddlEmployees: any[] = [];
    loadEmployees() {
        this.hrWebService.getEmployees<any[]>().then((data) => {
            this.ddlEmployees = data;
        })
    }

    searchFormInit(){
        this.searchForm = this.fb.group({
            employeeId: new FormControl(''),
            employeeCode: new FormControl(''),
            date: new FormControl(null),
            stateStatus: new FormControl(''),
            sortingCol: new FormControl(''),
            sortType: new FormControl(''),
            pageNumber: new FormControl(this.pageNumber),
            pageSize: new FormControl(this.pageSize)
        })


        this.searchForm.valueChanges.subscribe((item) => {
            this.pageNumber = 1;
            this.getEmploymentProbationaryExtension();
        })
    }

    listOfProposal: any[] = [];
    propsalDTLabel: any;

    list_pageChanged(event: any) {
        this.pageNumber = event;
        this.searchForm.get('pageNumber').setValue(this.pageNumber);
    }

    getEmploymentProbationaryExtension() {
        let params = {
            probationaryExtensionId: 0,
            employeeId: this.searchForm.get('employeeId').value == null ? 0 : this.searchForm.get('employeeId').value,
            employeeCode: this.searchForm.get('employeeCode').value,
            fromDate:
                this.searchForm.get('date').value != null
                    && this.searchForm.get('date').value != undefined ?
                    this.datepipe.transform(this.searchForm.get('date').value[0], "yyyy-MM-dd").toString() : '',
            toDate:
                this.searchForm.get('date').value != null &&
                    this.searchForm.get('date').value != undefined ?
                    this.datepipe.transform(this.searchForm.get('date').value[1], "yyyy-MM-dd").toString() : '',
            stateStatus: this.searchForm.get('stateStatus').value,
            sortingCol: this.searchForm.get('sortingCol').value,
            sortType: this.searchForm.get('sortType').value,
            pageNumber: this.searchForm.get('pageNumber').value,
            pageSize: this.searchForm.get('pageSize').value,
        };

        this.areasHttpService.observable_get<any>((ApiArea.hrms + ApiController.employees + "/GetEmploymentProbationaryExtension"), {
            responseType: "json", observe: 'response', params: params
        }).subscribe((response) => {

            // console.log("GetEmploymentProbationaryExtension >>>", response);
            // return;
            this.listOfProposal = response.body;
            this.propsalDTLabel = this.listOfProposal.length == 0 ? 'No record(s) found' : null;
            var xPaginate = JSON.parse(response.headers.get('X-Pagination'));
            this.list_pager = this.userService.pageConfigInit("proposal_list_pager", xPaginate.itemsPerPage, xPaginate.currentPage, xPaginate.totalItems);
        },
            (error) => {
                this.utilityService.fail("Something went wrong", "Server Response")
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
            this.getEmploymentProbationaryExtension()
        }
    }

    //#region approval modal
    approvalId: number = 0;
    showApprovalModal: boolean = false;
    probation_data: any;
    employee_Id: any;
    openApprovalModal(id: number, emp_id: number) {
        this.approvalId = id;
        this.employee_Id = emp_id;
        this.probation_data = Object.assign({},this.listOfProposal.find(item=> item.probationaryExtensionId == id));
        this.showApprovalModal = true;
    }

    closeApprovalModal(reason: string) {
        this.showApprovalModal = false;
        this.approvalId = 0;
        this.employee_Id = 0;
        if (reason == 'Save Complete') {
            this.getEmploymentProbationaryExtension()
        }
    }
    //#endregion

}