import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { CustomModalService } from "src/app/shared/services/custom-modal.service";
import { UtilityService } from "src/app/shared/services/utility.service";
import { EmployeeInfoService } from "../../../employee/employee-info.service";
import { BankService } from "../../bank/bank.service";
import { BankBranchService } from "../../bank-branch/bank-branch.service";
import { EmployeeAccountService } from "../employee-account.service";
@Component({
    selector: 'app-employee-module-account-insert-update-modal',
    templateUrl: './insert-update-employee-account.component.html'
})

export class EmployeeAccountInsertUpdateModal implements OnInit {

    @Input() id: any = 0;
    @Output() closeModalEvent = new EventEmitter<string>();
    @ViewChild('EmployeeAccountInsertUpdateModal', { static: true }) employeeAccountInsertUpdateModal!: ElementRef;
    modalTitle: string = "Add Employee Account Info";

    constructor(
        private modalService: CustomModalService,
        private utilityService: UtilityService,
        private fb: FormBuilder,
        private employeeInfoService: EmployeeInfoService,
        private employeeAccountService: EmployeeAccountService,
        private bankService: BankService,
        private bankBranchesService: BankBranchService) {
    }
    ngOnInit() {
        this.formInit();
        this.loadEmployeeDropdown();
        if (this.id > 0) {
            this.modalTitle = this.id > 0 ? "Add Employee Account Info" : "Update Employee Account Info";
            this.getById()
        }
    }
    datePickerConfig: any = this.utilityService.datePickerConfig();
    ddlPaymentModes: any[] = this.utilityService.getPaymentModes();
    ddlAgents: any[] = this.utilityService.getMobileBankAgents();
    select2Options: any = this.utilityService.select2Config();

    form: FormGroup;

    formInit() {
        this.form = this.fb.group({
            accountInfoId: new FormControl(0),
            employeeId: new FormControl(0, [Validators.required]),
            paymentMode: new FormControl('', [Validators.required, Validators.maxLength(30)]), // Bank, Mobile Banking, Cash
            bankId: new FormControl(0),
            bankBranchId: new FormControl(0),
            agentName: new FormControl('', [Validators.maxLength(50)]),
            accountNo: new FormControl('', [Validators.maxLength(50)]),
            activationReason: new FormControl('', [Validators.maxLength(300)]),
            remarks: new FormControl('', [Validators.maxLength(200)])
        });
        this.openModal();

        this.form.get('paymentMode').valueChanges.subscribe(value => {
            this.form.get('bankId').clearValidators();
            this.form.get('bankBranchId').clearValidators();
            this.form.get('agentName').clearValidators();
            this.form.get('accountNo').clearValidators();
            if (value == "Bank") {
                this.loadBankDropdown();
                this.form.get('bankId').setValidators([Validators.min(1)])
                this.form.get('bankBranchId').setValidators([Validators.min(1)]);
                this.form.get('accountNo').setValidators([Validators.required, Validators.maxLength(50)])
            }
            else if (value == "Mobile Banking") {
                this.form.get('agentName').setValidators([Validators.required])
                this.form.get('accountNo').setValidators([Validators.required, Validators.maxLength(50)])
            }
        })

        this.form.get('bankId').valueChanges.subscribe(value => {
            this.ddlBankBranches = [];
            this.form.get('bankBranchId').setValue(0);
            if (this.utilityService.IntTryParse(value) > 0) {
                this.loadBankBrancheDropdown(value)
            }
        })
    }

    checkValidaty() {
        const controls = Object.keys(this.form.controls);
        console.log('controls >>>', controls);
        controls.forEach(item => {
            if (this.form.get(item).invalid) {
                console.log("invalid >>>", item);
            }
        })
    }

    isSubmitButtonDisabled() {
        return this.btnSubmit || this.form.invalid;
    }


    ddlEmployees: any[];
    loadEmployeeDropdown() {
        this.employeeInfoService.loadDropdownData({});
        this.employeeInfoService.ddl_employee_data$.subscribe(data => {
            this.employeeInfoService.loadDropdown(data);
            this.ddlEmployees = this.employeeInfoService.ddl$;
        }, error => {
            console.error('Error while fetching data:', error);
        });
    }

    ddlBanks: any[] = [];
    loadBankDropdown() {
        this.ddlBanks = [];
        this.ddlBankBranches = [];
        this.bankService.loadBankDropdown();
        this.bankService.ddl$.subscribe(data => {
            this.ddlBanks = data;
        });
    }

    ddlBankBranches: any[] = [];
    loadBankBrancheDropdown(id: any) {
        this.ddlBankBranches = [];
        this.bankBranchesService.loadBankBranchDropdown({ bankId: id });
        this.bankBranchesService.ddl$.subscribe(data => {
            this.ddlBankBranches = data;
        })
    }

    openModal() {
        this.modalService.open(this.employeeAccountInsertUpdateModal, "lg")
    }

    getById() {
        this.employeeAccountService.getById({ accountInfoId: this.id }).subscribe(response => {
            this.setFormValue(response.body)
        }, (error) => {
            console.log("error >>>", error);
            this.utilityService.fail('Someting went wrong', 'Server Response');
        })
    }

    btnSubmit: boolean = false;
    submit() {
        if (this.form.valid) {
            this.employeeAccountService.save(this.form.value).subscribe(response => {
                if (response.status) {
                    this.utilityService.success(response.msg, 'Server Response');
                    this.closeModal('Save Complete')
                }
                else {
                    this.utilityService.fail(response.msg, 'Server Response');
                }
            }, (error) => {
                console.log('error >>>', error);
                this.utilityService.fail('Something went wrong');
            })
        }
        else {
            this.utilityService.fail('Invalid Form Submission', 'Site Response');
        }
    }

    closeModal(reason: any) {
        this.closeModalEvent.emit(reason);
        this.modalService.service.dismissAll(reason);
    }

    setFormValue(response: any) {
        this.form.get('accountInfoId').setValue(response?.accountInfoId);
        this.form.get('employeeId').setValue(response?.employeeId);
        this.form.get('paymentMode').setValue(response?.paymentMode);
        this.form.get('bankId').setValue(response?.bankId);
        this.form.get('bankBranchId').setValue(response?.bankBranchId);
        this.form.get('agentName').setValue(response?.agentName);
        this.form.get('accountNo').setValue(response?.accountNo);
        this.form.get('activationReason').setValue(response?.activationReason);
        this.form.get('remarks').setValue(response?.remarks);
    }

    //#region bank
    showBankModal: boolean = false;
    openBankModal() {
        this.showBankModal = true;
    }

    closeBankModal(reason: string) {
        this.showBankModal = false;
        if (reason == 'Successfully Saved') {
            this.loadBankDropdown();
        }
    }
    //#endregion bank

    //#region bank-brach
    showBankBranchModal: boolean = false;
    openBankBranchModal() {
        this.showBankBranchModal = true;
    }

    closeBankBranchModal(reason: string) {
        this.showBankBranchModal = false;
        if (reason == 'Successfully Saved') {
            this.loadBankBrancheDropdown(this.utilityService.IntTryParse(this.form.get('bankId').value));
        }
    }
    //#endregion bank
}