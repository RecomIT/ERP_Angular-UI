import { Component, OnInit } from "@angular/core";
import { UtilityService } from "src/app/shared/services/utility.service";
import { SupplementaryAmountService } from "./supplementary-amount.service";
import { UserService } from "src/app/shared/services/user.service";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { EmployeeInfoService } from "src/app/areas/employee_module/employee/employee-info.service";
import { AllowanceNameService } from "../../../allowance/allowance-head/allowance-name.service";

@Component({
    selector: 'app-payroll-supplementary-amount',
    templateUrl: './supplementary-amount.component.html'
})

export class SupplementaryAmountComponent implements OnInit {

    pageNumber: number = 1;
    pageSize: number = 15;
    pageConfig: any = this.userService.pageConfigInit("data_list", this.pageSize, 1, 0);
    constructor(
        private fb: FormBuilder, private userService: UserService,
        private utilityService: UtilityService,
        private service: SupplementaryAmountService,
        private employeeInfoService: EmployeeInfoService,
        private allowanceNameService: AllowanceNameService) {
    }


    ddlEmployees: any[] = [];
    loadEmployees() {
        this.employeeInfoService.loadDropdownData({});
        this.employeeInfoService.ddl_employee_data$.subscribe(data => {
            this.employeeInfoService.loadDropdown(data);
            this.ddlEmployees = this.employeeInfoService.ddl$;
        }, error => {
            console.error('Error while fetching data:', error);
        });
    }


    ngOnInit(): void {
        this.formInit();
        this.getList();
        this.loadEmployees();
        this.loadAllowanceNames();
    }

    searchForm: FormGroup;

    formInit() {
        this.searchForm = this.fb.group({
            employeeId: new FormControl(''),
            allowanceNameId: new FormControl(0),
            paymentMonth: new FormControl(0),
            paymentYear: new FormControl(0),
            status: new FormControl(''),
            pageNumber: new FormControl(this.pageNumber),
            pageSize: new FormControl(this.pageSize)
        })

        this.searchForm.valueChanges.subscribe(value => {
            //console.log("searchForm values >>>", value);
            this.getList();
        })
    }

    select2Options = this.utilityService.select2Config();

    ddlAllowances: any[] = [];
    loadAllowanceNames() {
        this.allowanceNameService.loadAllowanceNameDropdown();
        this.allowanceNameService.ddl$.subscribe(data => {
            //console.log("data >>>", data);
            this.ddlAllowances = data;
        }, (error) => {
            console.log("error  while fetching data >>>", error);
        })
    }


    list: any[] = [];
    getList() {
        let params = this.searchForm.value;
        params.employeeId = params.employeeId == 'null' || params.employeeId == null ? 0 : params.employeeId;
        params.allowanceNameId = params.allowanceNameId == 'null' || params.allowanceNameId == null ? 0 : params.allowanceNameId;

        this.service.get(params).subscribe(response => {
            this.list = response.body;
            let xPaginate = JSON.parse(response.headers.get('X-Pagination'));
            this.pageConfig = this.userService.pageConfigInit("data_list", xPaginate.itemsPerPage, xPaginate.currentPage, xPaginate.totalItems);
        }, error => {
            console.log(error)
        })
    }

    ddlYears: any = this.utilityService.getYears(2);
    ddlMonths: any = this.utilityService.getMonths();
    ddlStatus: any = this.utilityService.getDataStatus().filter(item => item == "Pending" || item == "Approved" || item == "Rejected");

    page_Changed(event: any) {
        this.pageNumber = event;
        this.searchForm.get('pageNumber').setValue(this.pageNumber);
    }

    showSupplementaryAmountInsert: boolean = false;
    showSupplementaryAmountInsertModal() {
        this.showSupplementaryAmountInsert = true;
    }

    closeSupplementaryAmountInsertModal(reason: any) {
        this.showSupplementaryAmountInsert = false;
        if (reason == 'Save Successful') {
            this.getList();
        }
    }

    showSupplementaryAmountUpdateModal: boolean = false;
    employeeId: number=0;
    paymentAmountId: number=0;
    showUpdateModal(item: any) {
        this.paymentAmountId = item.paymentAmountId;
        this.showSupplementaryAmountUpdateModal = true;
    }

    closeUpdateModal(reason: any) {
        this.showSupplementaryAmountUpdateModal = false;
        this.getList();
    }



}