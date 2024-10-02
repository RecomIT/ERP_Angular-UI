import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { error } from "console";
import { AreasHttpService } from "src/app/areas/areas.http.service";
import { EmployeeInfoService } from "src/app/areas/employee_module/employee/employee-info.service";
import { BonusConfigService } from "src/app/areas/payroll-services/bonus-config/bonus-config.service";
import { CustomModalService } from "src/app/shared/services/custom-modal.service";
import { HrWebService } from "src/app/shared/services/hr-web.service";
import { PayrollWebService } from "src/app/shared/services/payroll-web.service";
import { UserService } from "src/app/shared/services/user.service";
import { UtilityService } from "src/app/shared/services/utility.service";

@Component({
    selector: 'app-payroll-bonus-exclude-employee-modal',
    templateUrl: './bonus-exclude-employee-modal.component.html'
})

export class BonusExcludeEmployeeModal implements OnInit {

    @Input() bonusId: number = 0;
    @Input() bonusConfigId: number = 0;

    @Output() closeModalEvent = new EventEmitter<string>();

    @ViewChild('excludeEmployeeFromBonusModal', { static: true }) modal!: ElementRef;
    modalTitle: string = "Exclude Employee List";

    constructor(private fb: FormBuilder, // strongly type form build
        public utilityService: UtilityService, // utility 
        public modalService: CustomModalService, // modal service 
        private hrWebService: HrWebService,
        private bonusConfigService: BonusConfigService,
        private employeeInfoService: EmployeeInfoService) { }

    ngOnInit(): void {
        this.filter_formInit();
        this.saveForm_init();
        this.getExcludeEployeeList();
        this.loadEmployeeDropdown();
    }

    select2Options = this.utilityService.select2Config();
    select2Config = this.utilityService.select2Config();

    filter: FormGroup;

    filter_formInit() {
        this.filter = this.fb.group({
            employeeId: new FormControl(0),
            bonusId: new FormControl(this.bonusId),
            bonusConfigId: new FormControl(this.bonusConfigId)
        })

        this.modalService.open(this.modal, 'lg')
    }

    saveForm: FormGroup;
    saveForm_init() {
        this.saveForm = this.fb.group({
            employeeId: new FormControl('', [Validators.required]),
            bonusId: new FormControl(this.bonusId, [Validators.min(1)]),
            bonusConfigId: new FormControl(this.bonusConfigId, [Validators.min(1)])
        })
    }

    employees: any[] = [];
    loadEmployeeDropdown() {
        this.employeeInfoService.loadDropdownData({});
        this.employeeInfoService.ddl_employee_data$.subscribe(data => {
        this.employeeInfoService.loadDropdown(data);
        this.employees = this.employeeInfoService.ddl$;
        }, error => {
        console.error('Error while fetching data:', error);
        });
    }

    excludeList: any[] = [];
    getExcludeEployeeList() {
        this.bonusConfigService.getExcludedEmployeesFromBonus(this.filter.value).subscribe(response => {
            //console.log("response >>>",response);
            this.excludeList = response;
        }, error => {
            this.utilityService.fail(error.message, 'Server Response')
        })
    }

    submit() {
        if (this.saveForm.valid) {
            const server_data = {
                employeeId: this.utilityService.IntTryParse(this.saveForm.get('employeeId').value),
                bonusId: this.saveForm.get('bonusId').value, bonusConfigId: this.saveForm.get('bonusConfigId').value
            }
            this.bonusConfigService.saveExcludeEmployeeFromBonus(server_data).subscribe(response => {
                if(response.body?.status){
                    this.utilityService.success(response.body?.msg)
                    this.saveForm.get('employeeId').setValue('');
                    this.getExcludeEployeeList();
                }
                else{
                    this.utilityService.fail(response.body?.msg)
                }
            }, error => {
                this.utilityService.fail(error.message, 'Server Response')
            })
        }
        else {
            this.utilityService.fail('Invalid Form', 'Site Response');
        }
    }

    delete(employeeId: number){
        const server_data = {
            employeeId: employeeId,
            bonusId: this.bonusId, bonusConfigId: this.bonusConfigId
        }
        this.bonusConfigService.deleteEmployeeFromExcludeListAsync(server_data).subscribe(response => {
            if(response.body?.status){
                this.utilityService.success(response.body?.msg)
                this.getExcludeEployeeList();
            }
            else{
                this.utilityService.fail(response.body?.msg)
            }
        }, error => {
            this.utilityService.fail(error.message, 'Server Response')
        })
    }

    closeModal(reason: any) {
        this.closeModalEvent.emit(reason); // fair
        this.modalService.service.dismissAll(reason);
    }

}