import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { CustomModalService } from "src/app/shared/services/custom-modal.service";
import { HrWebService } from "src/app/shared/services/hr-web.service";
import { PayrollWebService } from "src/app/shared/services/payroll-web.service";
import { UserService } from "src/app/shared/services/user.service";
import { UtilityService } from "src/app/shared/services/utility.service";
import { AddSupplementaryAmountService } from "./add-supplementary-amount-modal.service";
import { EmployeeInfoService } from "src/app/areas/employee_module/employee/employee-info.service";
import { AllowanceNameService } from "../../../allowance/allowance-head/allowance-name.service";


@Component({
    selector: 'app-payroll-add-supplementary-amount',
    templateUrl: './add-supplementary-amount-modal.component.html'
})


export class AddSupplementaryAmountComponent implements OnInit {

    @Output() closeModalEvent = new EventEmitter<string>();
    @ViewChild('supplementaryAmountModal', { static: true }) supplementaryAmountModal!: ElementRef;
    modalTitle: string = "";

    constructor(
        private fb: FormBuilder,
        private userService: UserService,
        public utilityService: UtilityService,
        public modalService: CustomModalService,
        public payrollWebService: PayrollWebService,
        public hrWebService: HrWebService,
        public service: AddSupplementaryAmountService,
        private employeeInfoService: EmployeeInfoService,
        private allowanceNameService: AllowanceNameService

    ) { }

    ngOnInit(): void {
        this.openModal();
    }

    currentMonth: number = parseInt(this.utilityService.currentMonth);
    currentYear: number = parseInt(this.utilityService.currentYear);
    baseOfPayments: any = ["Flat", "Basic", "Gross"]

    form: FormGroup;
    formArray: any;
    paymentsArray: any;
    formInit() {
        this.form = this.fb.group({
            payments: this.fb.array([
                this.fb.group({
                    paymentAmountId: new FormControl(0),
                    employeeId: new FormControl(0, [Validators.min(1)]),
                    allowanceNameId: new FormControl(0, [Validators.min(1)]),
                    paymentMonth: new FormControl(this.currentMonth, [Validators.required]),
                    paymentYear: new FormControl(this.currentYear, [Validators.required]),
                    baseOfPayment: new FormControl('Flat', [Validators.required]),
                    amount: new FormControl(0),
                    percentage: new FormControl(0)
                })
            ])
        })

        this.formArray = (<FormArray>this.form.get('payments')).controls;
        this.formControlChanged();
    }

    // Declare an array to store subscriptions
    private subscriptions: any[] = [];
    formControlChanged() {
        this.formArray = (this.form.get('payments') as FormArray).controls;

        // Unsubscribe from the previous subscription, if it exists
        if (this.subscriptions != null && this.subscriptions.length > 0) {
            this.subscriptions.forEach((item: FormGroup, i) => {
                this.subscriptions[i].unsubscribe();
            })
        }

        this.formArray.forEach((fromGroup: FormGroup, index) => {
            // Declare a variable to hold the subscription
            let subscription;

            // Subscribe to valueChanges
            subscription = fromGroup.get('baseOfPayment').valueChanges.subscribe((newValue) => {
                console.log(`Value changed at index ${index}`, newValue);
            });

            // Store the new subscription in an array
            this.subscriptions[index] = subscription;
        });
    }

    btnSubmit: boolean = false;

    submit() {
        if (this.form.valid) {
            var payments: any = [];
            this.formArray.forEach((formGroup: FormGroup) => {
                console.log("formGroup >>>", formGroup.get('amount').value);

                var empCode = this.ddlEmployees.find(item=> item.id == this.utilityService.IntTryParse(formGroup.get('employeeId').value).toString());

                console.log("emp code >>>", empCode);
                
                payments.push({
                    paymentAmountId: 0,
                    employeeId: this.utilityService.IntTryParse(formGroup.get('employeeId').value),
                    allowanceNameId: this.utilityService.IntTryParse(formGroup.get('allowanceNameId').value),
                    paymentMonth: formGroup.get('paymentMonth').value,
                    paymentYear: formGroup.get('paymentYear').value,
                    baseOfPayment: formGroup.get('baseOfPayment').value,
                    amount: formGroup.get('amount').value,
                    percentage: 0,
                    employeeCode: empCode?.code
                    
                })
            })
            // console.log("payments >>>", payments);
            // return;
            this.service.saveBulk(payments).subscribe(response => {
                console.log("response >>>", response);
                if(response?.status){
                    this.utilityService.success(response?.msg,"Server Response")
                    this.closeModal('Save Successful')
                }
            }, error => {
                this.utilityService.fail("Something went wrong", "Server Reponse");
            })
        }
        else {
            this.utilityService.fail("Invalid form submission", "Site Response", 1000);
        }
    }

    select2Options = this.utilityService.select2Config();

    logger(msg: any, options: any) {
        this.utilityService.consoleLog(msg, options);
    }

    User() {
        return this.userService.User();
    }

    ddlYears: any = this.utilityService.getYears(2);
    ddlMonths: any = this.utilityService.getMonths();

    openModal() {
        this.formInit();
        this.modalTitle = "Add Supplementary Payment"
        this.modalService.open(this.supplementaryAmountModal, "xl");
        this.loadEmployees();
        this.loadAllowanceNames();
    }

    closeModal(reason: any) {
        this.form.reset();
        this.modalService.service.dismissAll(reason);
        this.closeModalEvent.emit(reason);
    }

    addAllowance(): void {
        (<FormArray>this.form.get('payments')).push(this.add());
        this.formControlChanged();
    }

    add() {
        return this.fb.group({
            paymentAmountId: new FormControl(0),
            employeeId: new FormControl(0, [Validators.min(1)]),
            allowanceNameId: new FormControl(0, [Validators.min(1)]),
            paymentMonth: new FormControl(this.currentMonth, [Validators.required]),
            paymentYear: new FormControl(this.currentYear, [Validators.required]),
            baseOfPayment: new FormControl('Flat', [Validators.required]),
            amount: new FormControl(0, [Validators.min(1)]),
            percentage: new FormControl(0)
        })
    }

    remove(index: number) {
        if ((<FormArray>this.form.get('payments')).length > 1) {
            (<FormArray>this.form.get('payments')).removeAt(index);
            this.formControlChanged();
        }
        else {
            this.utilityService.fail("You can't delete last item", "Site Response");
        }
    }


 //Added by Monzur 30-Dec-2023

    ddlAllowances: any[] = []
    loadAllowanceNames() {
        this.allowanceNameService.loadAllowanceNameDropdown();
        this.allowanceNameService.ddl$.subscribe(data=>{
            this.ddlAllowances = data;
        })
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
}