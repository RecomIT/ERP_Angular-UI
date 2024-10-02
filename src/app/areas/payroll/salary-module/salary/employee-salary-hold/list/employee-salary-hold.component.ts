import { transition, trigger, useAnimation } from "@angular/animations";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { bounceIn, fadeIn, fadeInRight, slideInUp } from "ng-animate";
import { UserService } from "src/app/shared/services/user.service";
import { UtilityService } from "src/app/shared/services/utility.service";
import { EmployeeSalaryHoldService } from "../employee-salary-hold.service";
import { EmployeeInfoService } from "src/app/areas/employee_module/employee/employee-info.service";
@Component({
    selector: 'app-payroll-employee-salary-hold',
    templateUrl: './employee-salary-hold.component.html',
    animations: [
        trigger('slideInUp', [transition('* => *', useAnimation(slideInUp, { params: { timing: 0.5 } }))]),
        trigger('fadeIn', [transition('void => *', useAnimation(fadeIn, { params: { timing: 0.3 } }))]),
        trigger('fadeInRight', [transition('void => *', useAnimation(fadeInRight, { params: { timing: 0.5 } }))]),
        trigger('bounceIn', [transition('void => *', useAnimation(bounceIn, { params: { timing: 1 } }))])
    ],
})

export class EmployeeSalaryHoldComponent implements OnInit {

    constructor(
        private fb: FormBuilder,
        public utilityService: UtilityService,
        private userService: UserService,
        private componetService: EmployeeSalaryHoldService,
        private employeeInfoService: EmployeeInfoService) {
    }

    ngOnInit(): void {
        this.searchFormInit();
        this.loadEmployees();
        this.getSalaryHoldInfos();
    }

    User() {
        this.userService.User()
    }

    select2Options: any = this.utilityService.select2Config();
    months: any[] = this.utilityService.getMonths();
    years: any[] = this.utilityService.getYears(2);
    statusList: any[] = this.utilityService.getDataStatus().filter(item => item == 'Pending' || item == 'Approved' || item == 'Cancelled');

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

    listOfSalaryHolds: any[] = [];
    getSalaryHoldInfos() {
        let formData = this.searchForm.value;
        formData.employeeId = formData.employeeId == null ? "0" : formData.employeeId;
        this.componetService.getSalaryHoldInfos(formData).subscribe(response => {
            console.log("response list >>>", response);
            this.listOfSalaryHolds = response;
        })
    }

    searchForm: FormGroup;

    searchFormInit() {
        this.searchForm = this.fb.group({
            employeeId: new FormControl('0'),
            salaryMonth: new FormControl('0'),
            salaryYear: new FormControl('0'),
            stateStatus: new FormControl('')
        })
        this.searchForm.valueChanges.subscribe(value => {
            console.log("this.searchForm.valueChanges >>>", this.searchForm.value);
            this.getSalaryHoldInfos();
        })
    }

    showHoldInsertUpdateModal: boolean = false;
    holdId: any = 0;
    openHoldModal(id: any) {
        this.showHoldInsertUpdateModal = true;
        this.holdId = id;
    }

    closeHoldModal(reason: any) {
        this.showHoldInsertUpdateModal = false;
        this.holdId = 0;
        if (reason == 'Save Complete') {
            this.getSalaryHoldInfos();
        }
    }

    showUploadModal: boolean = false;
    openUploadModal() {
        this.showUploadModal = true;
    }

    closeUploadModal(reason: any) {
        this.showUploadModal = false;
        if (reason == 'Save Complete') {
            this.getSalaryHoldInfos();
        }
    }

}