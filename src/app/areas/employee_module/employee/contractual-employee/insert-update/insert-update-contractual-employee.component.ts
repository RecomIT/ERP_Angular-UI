import { UtilityService } from "src/app/shared/services/utility.service";
import { ContractualEmployeeService } from "../contractual-employee.service";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { CustomModalService } from "src/app/shared/services/custom-modal.service";
import { EmployeeInfoService } from "../../employee-info.service";

@Component({
    selector: 'employee-module-insert-update-contractual-employee',
    templateUrl: "./insert-update-contractual-employee.component.html"
})


export class InsertUpdateContractualEmployeeComponent implements OnInit {
    modalTitle: string = "";
    @Input() contractId: number = 0;
    @Output() closeModalEvent = new EventEmitter<string>();
    @ViewChild('contractualEmployeeInsertupdate', { static: true }) contractualEmployeeInsertupdate!: ElementRef;

    public datePickerConfig: any = this.utilityService.datePickerConfig();
    ngOnInit(): void {
        this.formInit();
        this.loadEmployeeDropdown();
    }

    constructor(private utilityService: UtilityService, private fb: FormBuilder,
        private contractualEmployeeService: ContractualEmployeeService, private modalService: CustomModalService,
        private employeeInfoService: EmployeeInfoService) {
    }

    ddlEmployees: any[];
    loadEmployeeDropdown() {
        this.employeeInfoService.loadDropdownData({jobType:"Contractual"});
        this.employeeInfoService.ddl_employee_data$.subscribe(data => {
            this.employeeInfoService.loadDropdown(data);
            this.ddlEmployees = this.employeeInfoService.ddl$;
        }, error => {
            console.error('Error while fetching data:', error);
        });
    }

    select2Config: any = this.utilityService.select2Config();

    form: FormGroup;

    formInit() {
        this.form = this.fb.group({
            employeeId: new FormControl(0, [Validators.min(1)]),
            lastContractId: new FormControl(null),
            lastContractEndDate: new FormControl(null),
            contractStartDate: new FormControl(null, [Validators.required]),
            contractEndDate: new FormControl(null, [Validators.required]),
        })
        this.modalService.open(this.contractualEmployeeInsertupdate, "lg");
    }

    submit() {
        if (this.form.value) {
            this.contractualEmployeeService.save(this.form.value).subscribe(response => {

            }, (error) => {
                this.utilityService.httpErrorHandler(error);
            })
        }
        else {
            this.utilityService.fail("Invalid Form Submission", "Site Response");
        }
    }

    closeModal(reason: any) {

    }
}