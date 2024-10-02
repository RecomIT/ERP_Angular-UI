
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { UtilityService } from "src/app/shared/services/utility.service";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { CustomModalService } from "src/app/shared/services/custom-modal.service";
import { DiscontinuedEmployeeService } from "../discontinued-employee.service";
import { EmployeeInfoService } from "../../employee/employee-info.service";

@Component({
    selector: 'employee-module-discontinued-employee-insert-update-modal',
    templateUrl: './insert-update-discontinued-employee.component.html'
})

export class DiscontinuedEmployeeInsertUpdateModalComponent implements OnInit {

    @Input() id: number = 0;
    @Output() closeModalEvent = new EventEmitter<string>();
    @ViewChild('discontinuedEmployeeModal', { static: true }) discontinuedEmployeeModal!: ElementRef;
    select2Config: any = this.utilityService.select2Config();
    datePickerConfig: any = this.utilityService.datePickerConfig();

    modalTitle: string = this.id == 0 ?"Add AN Employee" : "Update Discontinued Employee";

    constructor(
        private fb: FormBuilder,
        private utilityService: UtilityService,
        public modalService: CustomModalService,
        private employeeInfoService: EmployeeInfoService,
        private discontinuedEmployeeService: DiscontinuedEmployeeService) {
    }

    ngOnInit(): void {
        this.loadEmployeeDropdown();
        this.formInit();
        this.openModal();
        if (this.id > 0) {
            this.getById();
            this.modalTitle = this.id == 0 ?"Add An Employee" : "Update Discontinued Employee";
        }        
    }

    
    info: any;
    getById() {
        this.discontinuedEmployeeService.getById({ discontinuedId: this.id }).subscribe((response) => {
            this.load_value(response?.body);
        }, (error) => {
            this.utilityService.fail("Something went wrong", "Server Wrong");
        })
    }

    ddlEmployees: any[];
    list_of_employees: any[];

    loadEmployeeDropdown() {
        this.employeeInfoService.loadDropdownData({});
        this.employeeInfoService.ddl_employee_data$.subscribe(data => {
            this.list_of_employees = data;
            this.employeeInfoService.loadDropdown(data);
            this.ddlEmployees = this.employeeInfoService.ddl$;
        }, error => {
            console.error('Error while fetching data:', error);
        });        
    }

    types_of_releasetype: any=["Resigned","Involuntary","Terminated"];

    form: FormGroup;

    formErrors = {
        'discontinuedId':'',
        'employeeId': '',
        'lastWorkingDate': '',
        'calculateFestivalBonusTaxProratedBasis':'',
        'calculateProjectionTaxProratedBasis':'',
        'releasetype':''
    }

    validationMessages = {
        'employeeId': {
            'required': 'Field is required',
            'min': 'Field is required'
        },
        'lastWorkingDate':{
            'required': 'Field is required',
        },
        'releasetype':{
            'required': 'Field is required',
        }
    }
    openModal() {
        this.modalService.open(this.discontinuedEmployeeModal, "lg");
    }


    formInit() {
        this.form = this.fb.group({
            discontinuedId : new FormControl(this.id),
            employeeId : new FormControl(0,[Validators.required,Validators.min(1)]),
            lastWorkingDate: new FormControl(null,[Validators.required]),
            calculateFestivalBonusTaxProratedBasis: new FormControl(false),
            calculateProjectionTaxProratedBasis: new FormControl(false),
            releasetype : new FormControl('Resigned',[Validators.required]),
            isFullMonthSalaryHold: new FormControl(false)
        })

        this.form.get('lastWorkingDate').valueChanges.subscribe(value =>{
            this.logFormErrors();
            this.logFormErrors();
        })
    }

    load_value(value: any) {
        console.log("value >>>",value);
        this.form.get('discontinuedId').setValue(value?.discontinuedId);
        this.form.get('employeeId').setValue(value?.employeeId);
        this.form.get('lastWorkingDate').setValue(new Date(value?.lastWorkingDate));
        this.form.get('calculateFestivalBonusTaxProratedBasis').setValue(value?.calculateFestivalBonusTaxProratedBasis);
        this.form.get('calculateProjectionTaxProratedBasis').setValue(value?.calculateProjectionTaxProratedBasis);
        this.form.get('releasetype').setValue(value?.releasetype);
        this.form.get('isFullMonthSalaryHold').setValue(value?.isFullMonthSalaryHold);
    }

    logFormErrors(formGroup: FormGroup = this.form) {
        Object.keys(formGroup.controls).forEach((key: string) => {
            const abstractControl = formGroup.get(key);
            this.formErrors[key] = '';
            if (abstractControl && !abstractControl.valid && (abstractControl.touched || abstractControl.dirty)) {
                const messages = this.validationMessages[key];
                for (const errorKey in abstractControl.errors) {
                    this.formErrors[key] += messages[errorKey];
                }
            }
        })
    }

    btnSubmit: boolean = false;
    server_errors: any;
    submit() {
        if (this.form.valid) {
            this.discontinuedEmployeeService.save(this.form.value).subscribe((reasponse) => {
                if (reasponse.body?.status) {
                    this.utilityService.success(reasponse?.msg, "Server Response");
                    this.closeModal(this.utilityService.SuccessfullySaved);
                }
                else {
                    if (reasponse.body?.msg == "Validation Error") {
                        this.server_errors = JSON.parse(reasponse.body?.errorMsg)
                    }
                    else {
                        this.utilityService.fail(reasponse?.msg, "Server Response");
                    }
                }
            }, (error) => {
                this.utilityService.fail("Something went wrong");
            })
        }
        else {
            this.utilityService.fail("Invalid Form Submission", "Site Response");
        }
    }


    closeModal(reason: any) {
        this.closeModalEvent.emit(reason);
        this.modalService.service.dismissAll(reason);
    }
}