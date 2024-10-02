import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from "@angular/core";
import { CustomModalService } from "src/app/shared/services/custom-modal.service";
import { UserService } from "src/app/shared/services/user.service";
import { UtilityService } from "src/app/shared/services/utility.service";
import { FiscalYearService } from "../../../salary-module/setup/fiscalYear/fiscalYear.service";
import { ControlPanelWebService } from "src/app/shared/services/control-panel.service";
import { FormArray, FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { FinalTaxCardService } from "./final-tax-card-process.service";
import { esLocale } from "ngx-bootstrap/chronos";

@Component({
    selector: 'app-payroll-final-tax-card-process-modal',
    templateUrl: './final-tax-card-process-modal.component.html'
})

export class FinalTaxCardProcessModalComponent implements OnInit {

    @ViewChild("modal", { static: true }) modal !: ElementRef;
    @Output() closeModalEvent = new EventEmitter<string>();

    constructor(
        public utilityService: UtilityService,
        private userService: UserService,
        private modalService: CustomModalService,
        private fiscalYearService: FiscalYearService,
        private controlPanelWebService: ControlPanelWebService,
        private finalTaxCardService: FinalTaxCardService,
        private fb: FormBuilder
    ) { }

    ngOnInit(): void {
        this.openModal();
        this.loadFiscalYears();
        this.loadBranch();
    }

    flags: string[] = ["All"];
    //,"Discountinued Employees before June", "June Employees"

    ddlFiscalYears: any[] = [];
    loadFiscalYears() {
        this.fiscalYearService.loadDropdown();
        this.fiscalYearService.ddl$.subscribe(response => {
            this.ddlFiscalYears = response;
        })
    }

    ddlBranch: any[] = [];
    first_branch_id: number = 0;
    loadBranch() {
        this.ddlBranch = [];
        this.controlPanelWebService.getBranchExtension<any[]>("7").then((data) => {
            this.ddlBranch = data;
            if (this.ddlBranch != null && this.ddlBranch.length > 0) {
                this.first_branch_id = this.ddlBranch[0].id;
            }
        })
    }

    openModal() {
        this.formInit();
        this.modalService.open(this.modal, "xl");
    }

    form: FormGroup;
    formArray: any;
    formInit() {
        this.form = this.fb.group({
            isCheckedAll: new FormControl(false),
            fiscalYear: new FormControl(0),
            flag: new FormControl("All"),
            branchId: new FormControl(0),
            employees: new FormArray([])
        })

        this.form.get('fiscalYear').valueChanges.subscribe(value => {
            this.get();
        })
        this.form.get('flag').valueChanges.subscribe(value => {
            this.get();
        })
        this.form.get('branchId').valueChanges.subscribe(value => {
            this.get();
        })

        this.formArray = (<FormArray>this.form.get('employees')).controls;
    }

    list_of_data: any = [];
    get() {
        if (this.validate()) {
            this.remove();
            this.list_of_data = [];
            let data = {
                fiscalYear: this.utilityService.IntTryParse(this.form.get('fiscalYear').value),
                flag: this.form.get('flag').value,
                branchId: this.utilityService.IntTryParse(this.form.get('branchId').value)
            }
            this.finalTaxCardService.getEmployee(data).subscribe({
                next: (response) => {
                    console.log("response >>>", response)
                    this.list_of_data = response.body;
                    this.add(this.list_of_data);
                },
                error: (error) => {
                    console.log("error >>>", error);
                }
            })
        }
    }

    checkedItems : number=0;
    item_Checked(event: any) {
        this.checkedItems = 0;
        this.formArray.forEach((fg) => {
            if (fg instanceof FormGroup) {
                let formGroup = fg as FormGroup;
                let formControlValue = formGroup.get('isChecked').value;
                if (formControlValue) {
                    this.checkedItems = this.checkedItems + 1;
                }
            }
        });

        const formArrayLength = (this.formArray as FormArray).length;
        if (this.checkedItems == formArrayLength) {
            this.form.get('isCheckedAll').setValue(true);
        }
        else {
            this.form.get('isCheckedAll').setValue(false);
        }
    }

    checkAll(event: any) {
        let isChecked = event.target.checked;
        this.formArray.forEach((fg) => {
            if (fg instanceof FormGroup) {
                let formGroup = fg as FormGroup;
                formGroup.get('isChecked').setValue(isChecked);   
            }
        })
        this.checkedItems = isChecked ? this.formArray.length : 0;
    }

    validate() {
        let isTrue = true;
        let fiscalYear = this.utilityService.IntTryParse(this.form.get('fiscalYear').value);
        let flag = this.form.get('flag').value;
        let branchId = this.utilityService.IntTryParse(this.form.get('branchId').value);
        if (fiscalYear == 0) {
            this.utilityService.fail("Please select income year", "Site Response");
            isTrue = false;
        }
        if (flag == null || flag == "") {
            this.utilityService.fail("Please select employee", "Site Response");
            isTrue = false;
        }
        return isTrue;
    }

    total_employees: number = 0;
    add(data: any) {
        if (data != null && data.length > 0) {
            this.total_employees = data.length;
            data.forEach((item, index) => {
                (<FormArray>this.form.get('employees')).push(this.fb.group({
                    isChecked: new FormControl(false),
                    employeeId: new FormControl(item.employeeId),
                    fullName: new FormControl(item.fullName),
                    employeeCode: new FormControl(item.employeeCode),
                    branch: new FormControl(item.branch),
                    designation: new FormControl(item.designation),
                    department: new FormControl(item.department),
                    section: new FormControl(item.section),
                    subSection: new FormControl(item.subSection),
                    gender: new FormControl(item.gender),
                    religion: new FormControl(item.religion),
                    isResidential: new FormControl(item.isResidential),
                    terminationDate: new FormControl(item.terminationDate),
                    lastMonth: new FormControl(item.lastMonth)
                }))
            })
        }
    }

    remove() {
        if ((<FormArray>this.form.get('employees')).length > 0) {
            (<FormArray>this.form.get('employees')).clear();
        }
    }

    btnProcess: boolean = false;

    process() {
        let ids = [];
        this.formArray.forEach((fg) => {
            if (fg instanceof FormGroup) {
                let formGroup = fg as FormGroup;
                if(formGroup.get('isChecked').value == true){
                    ids.push(formGroup.get('employeeId').value);
                }
            }
        })


        if (ids.length > 0) {
            this.btnProcess = true;
            let data = { employeeIds: ids, fiscalYearId: this.form.get('fiscalYear').value, flag: "" };
            console.log("data >>>", data);
            this.finalTaxCardService.runProcess(data).subscribe({
                next: (response) => {
                    console.log("response >>>", response);
                    this.btnProcess = false;
                    this.utilityService.success(response.msg,"Server Response")
                },
                error: (error) => {
                    console.log("error >>>", error)
                    this.btnProcess = false;
                    this.utilityService.success(error.msg,"Server Response")
                }
            })
        }
        else {
            this.utilityService.fail("Please select at least one row", "Site Response");
        }
    }

    closeModal(reason: any) {
        if (this.btnProcess == false) {
            this.modalService.service.dismissAll(reason);
            this.closeModalEvent.emit(reason);
        }
    }

}