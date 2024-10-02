import { Component, OnInit } from "@angular/core";
import { ActualTaxDeductionService } from "./actual-tax-deduction.component.service";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { UtilityService } from "src/app/shared/services/utility.service";
import { UserService } from "src/app/shared/services/user.service";
import { HrWebService } from "src/app/shared/services/hr-web.service";
import { transition, trigger, useAnimation } from "@angular/animations";
import { bounceIn, fadeIn, fadeInRight, slideInUp } from "ng-animate";
import { EmployeeInfoService } from "src/app/areas/employee_module/employee/employee-info.service";

@Component({
    selector:'app-payroll-employee-actual-tax-deduction',
    templateUrl:'./actual-tax-deduction.component.html',
    animations: [
        trigger('slideInUp', [transition('* => *', useAnimation(slideInUp, { params: { timing: 0.5 } }))]),
        trigger('fadeIn', [transition('void => *', useAnimation(fadeIn, { params: { timing: 0.3 } }))]),
        trigger('fadeInRight', [transition('void => *', useAnimation(fadeInRight, { params: { timing: 0.5 } }))]),
        trigger('bounceIn', [transition('void => *', useAnimation(bounceIn, { params: { timing: 1 } }))]),
    ]
})

export class ActualTaxDeductionComponent implements OnInit{

    constructor(
        private fb: FormBuilder,
        public utilityService: UtilityService,
        private userService: UserService,
        private componetService: ActualTaxDeductionService,
        private employeeInfoService: EmployeeInfoService) {
    }

    ngOnInit(): void {
        this.searchFormInit();
        this.loadEmployees();
    }

    User() {
        this.userService.User()
    }

    select2Options = this.utilityService.select2Config();

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

    list: any[] = [];
    getActualTaxDeductionInfos() {
        let params = this.searchForm.value;
        params.employeeId = params.employeeId == null ? "0" : params.employeeId;
        this.componetService.getActualTaxDeductionInfos(params).subscribe(response=>{
            this.list= response;
        },error=>{
            this.utilityService.httpErrorHandler(error);
        })
    }

    searchForm:FormGroup;

    searchFormInit(){
        this.searchForm = this.fb.group({
            employeeId: new FormControl('0'),
            salaryMonth: new FormControl('0'),
            salaryYear : new FormControl('0'),
            stateStatus : new FormControl('')
        })
        this.searchForm.valueChanges.subscribe(value=>{
            console.log("this.searchForm.valueChanges >>>", this.searchForm.value);
            this.getActualTaxDeductionInfos();
        })
        this.getActualTaxDeductionInfos();
    }

    showUploadModal:boolean = false;
    openUploadModal(){
        this.showUploadModal= true;
    }

    closeUploadModal(reason: any){
        this.showUploadModal = false;
        if(reason=='Save Complete'){
            this.getActualTaxDeductionInfos();
        }
    }

    showInsertUpdateModal: boolean = false;
    actualTaxDeductionId: any = 0;
    openInsertUpdateModal(id: any) {
        this.showInsertUpdateModal = true;
        this.actualTaxDeductionId = id;
    }

    closeInsertUpdateModal(reason: any) {
        this.showInsertUpdateModal = false;
        this.actualTaxDeductionId = 0;
        if(reason=='Save Complete'){
            this.getActualTaxDeductionInfos();
        }
    }

    showApprovalModal: boolean = false;
    openApprovalModal() {
        this.showApprovalModal = true;
    }

    closeApprovalModal(reason: any){
        this.showApprovalModal = false;
        if(reason=='Save Successful'){
            this. getActualTaxDeductionInfos();
        }
    }
}