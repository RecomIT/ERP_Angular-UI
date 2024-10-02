import { Component, OnInit } from '@angular/core';
import { CustomModalService } from 'src/app/shared/services/custom-modal.service';
import { UserService } from 'src/app/shared/services/user.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { transition, trigger, useAnimation } from '@angular/animations';
import { bounceIn, fadeIn, fadeInRight, slideInUp } from 'ng-animate';
import { BsDatepickerConfig } from "ngx-bootstrap/datepicker";
import { EmployeeYearlyInvestmentService } from '../employee-yearly-investment.service';

@Component({
    selector: 'app-payroll-employee-yearly-investment',
    templateUrl: './employee-yearly-investment.component.html',
    animations: [
        trigger('slideInUp', [transition('* => *', useAnimation(slideInUp, { params: { timing: 0.5 } }))]),
        trigger('fadeIn', [transition('void => *', useAnimation(fadeIn, { params: { timing: 0.3 } }))]),
        trigger('fadeInRight', [transition('void => *', useAnimation(fadeInRight, { params: { timing: 0.5 } }))]),
        trigger('bounceIn', [transition('void => *', useAnimation(bounceIn, { params: { timing: 1 } }))])
    ],
})

export class EmployeeYearlyInvestmentComponent implements OnInit {
    modalTitle: string = "";
    datePickerConfig: Partial<BsDatepickerConfig> = {};
    pageNumber: number = 1;
    pageSize: number = 15;
    pageConfig: any = this.userService.pageConfigInit("data_list", this.pageSize, 1, 0);
    constructor(private utilityService: UtilityService, private fb: FormBuilder,
        private userService: UserService, public modalService: CustomModalService, private employeeYarlyInvestmentService: EmployeeYearlyInvestmentService) { }

    ngOnInit(): void {
        this.employeeYearlyInvestmentFormInit();
        this.getEmployeeYearlyInvestments();
    }

    logger(msg: any, options: any) {
        this.utilityService.consoleLog(msg, options);
    }
    pagePrivilege: any = this.userService.getPrivileges();;

    User() {
        return this.userService.User();
    }

    employeeYearlyInvestmentForm: FormGroup;
    employeeYearlyInvestmentFormInit() {
        this.employeeYearlyInvestmentForm = this.fb.group({
            id: new FormControl(0),
            fiscalYearId: new FormControl(0),
            fiscalYear: new FormControl(''),
            employeeId: new FormControl(0),
            employeeCode: new FormControl(''),
            employeeName: new FormControl(''),
            investmentAmount: new FormControl(0),
            sortingCol: new FormControl(''),
            sortType: new FormControl(''),
            pageNumber: new FormControl(this.pageNumber),
            pageSize: new FormControl(this.pageSize)
        })

        this.employeeYearlyInvestmentForm.valueChanges.subscribe(value => {
            this.getEmployeeYearlyInvestments();
        })
    }

    page_Changed(event: any) {
        this.pageNumber = event;
        this.employeeYearlyInvestmentForm.get('pageNumber').setValue(this.pageNumber);
    }

    list: any[] = [];
    getEmployeeYearlyInvestments() {
        let params = Object.assign({}, this.employeeYearlyInvestmentForm.value);
        params.id = params.id == null ? 0 : params.id;
        params.fiscalYearId = params.fiscalYearId == null ? 0 : params.fiscalYearId;
        params.employeeId = params.employeeId == null ? 0 : params.employeeId;
        this.employeeYarlyInvestmentService.getEmployeeYearlyInvestments(params).subscribe(response => {
            this.list = response.body;
            let xPaginate = JSON.parse(response.headers.get('X-Pagination'));
            this.pageConfig = this.userService.pageConfigInit("data_list", xPaginate.itemsPerPage, xPaginate.currentPage, xPaginate.totalItems);
        }, error => {
            console.log(error)
        })
    }


    id: any = 0;
    showInvestmentInsertModal: boolean = false;
    showInvestmentModal(id: any) {
        this.id = id;
        this.showInvestmentInsertModal = !this.showInvestmentInsertModal;
    }

    closeInvestmentModal(reason: any) {
        this.showInvestmentInsertModal = !this.showInvestmentInsertModal;
        this.id = 0
        if (reason == 'Save Successful') {
            this.getEmployeeYearlyInvestments();
        }
    }

    showUploadInvestmentModal: boolean = false;
    openUploadInvestmentModal() {
        this.id = 0
        this.showUploadInvestmentModal = !this.showUploadInvestmentModal;
    }

    closeUploadInvestmentModal(reason: any) {
        this.showUploadInvestmentModal = !this.showUploadInvestmentModal;
        this.id = 0
        if (reason == 'Save Successful') {
            this.getEmployeeYearlyInvestments();
        }
    }
}