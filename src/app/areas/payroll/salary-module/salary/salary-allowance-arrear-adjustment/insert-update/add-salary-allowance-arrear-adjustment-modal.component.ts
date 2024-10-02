import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { EmployeeInfoService } from 'src/app/areas/employee_module/employee/employee-info.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AllowanceNameService } from '../../../allowance/allowance-head/allowance-name.service';
import { CustomModalService } from 'src/app/shared/services/custom-modal.service';
import { TypeaheadMatch } from 'ngx-bootstrap/typeahead';
import { AllowanceArrearAdjustmentService } from '../salary-allowance-arrear-adjustment.service';

@Component({
  selector: 'app-add-salary-allowance-arrear-adjustment-modal',
  templateUrl: './add-salary-allowance-arrear-adjustment-modal.component.html'
})
export class AddSalaryAllowanceArrearAdjustmentModalComponent implements OnInit {

  @Input() flag: string = "";
  @Output() closeModalEvent = new EventEmitter<string>();
  @ViewChild('modal', { static: true }) modal!: ElementRef;

  modalTitle: string = "";
  constructor(
    private fb: FormBuilder,
    private utilityService: UtilityService,
    private employeeInfoService: EmployeeInfoService,
    private allowanceNameService: AllowanceNameService,
    private modalService: CustomModalService,
    private service: AllowanceArrearAdjustmentService
  ) { }

  ngOnInit(): void {
    this.openModal();
    this.formInit();
    this.loadEmployees();
    this.loadAllowanceNames();
    this.modalTitle = this.flag == "Arrear" ? "Add Arrear" : "Add Adjustment";
  }

  openModal() {
    this.modalService.open(this.modal, "lg");
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

  ddlAllowances: any[] = []
  loadAllowanceNames() {
    this.allowanceNameService.loadAllowanceNameDropdown();
    this.allowanceNameService.ddl$.subscribe(data => {
      this.ddlAllowances = data;
    })
  }

  select2Options: any = this.utilityService.select2Config();
  currentMonth: number = parseInt(this.utilityService.currentMonth);
  ddlMonths: any = this.utilityService.getMonths();
  currentYear: number = parseInt(this.utilityService.currentYear);
  ddlYears: any = this.utilityService.getYearsUp(2);

  formErrors = {
    'allowanceNameId': '',
    'flag': '',
    'month': '',
    'year': '',
    'selectedEmployees': '',
    'adjustmentMonth':'',
    'adjustmentYear':''
  };

  logFormErrors(formGroup: FormGroup = this.form): boolean {
    let isValid = true;
    Object.keys(formGroup.controls).forEach((key: string) => {
      const abstractControl = formGroup.get(key);
      this.formErrors[key] = '';
      if (abstractControl && !abstractControl.valid) {
        const messages = this.validationMessages[key];
        for (const errorKey in abstractControl.errors) {
          this.formErrors[key] += messages[errorKey];
          isValid = false;
        }
      }
    })
    return isValid;
  }

  validationMessages = {
    "allowanceNameId": {
      'min': 'Field is required',
      'required': 'Field is required'
    },
    "flag": {
      'required': 'Field is required'
    },
    "month": {
      'min': 'Field is required',
      'max': 'Month cannot be > 12'
    },
    "year": {
      'min': 'Field is required',
      'max': 'Month cannot be > 2060'
    },
    "adjustmentMonth": {
      'min': 'Field is required',
      'max': 'Month cannot be > 12'
    },
    "adjustmentYear": {
      'min': 'Field is required',
      'max': 'Month cannot be > 2060'
    },
    'selectedEmployees': {
      'required': 'Field is required'
    }
  }

  form: FormGroup;

  formInit() {
    this.form = this.fb.group({
      allowanceNameId: new FormControl(0, [Validators.required, Validators.min(1)]),
      flag: new FormControl(this.flag, [Validators.required]),
      month: new FormControl(this.currentMonth, [Validators.min(1), Validators.max(12)]),
      year: new FormControl(this.currentYear, [Validators.min(2023), Validators.max(2060)]),
      adjustmentMonth: new FormControl(this.currentMonth, [Validators.min(1), Validators.max(12)]),
      adjustmentYear: new FormControl(this.currentYear, [Validators.min(2023), Validators.max(2060)]),
      selectEmployee: new FormControl(''),
      selectedEmployees: new FormControl('', [Validators.required]),
    })

    this.form.valueChanges.subscribe(value => {
      this.logFormErrors();
    })
  }

  employeesList: any[] = [];
  employeeOnSelect(e: TypeaheadMatch) {
    var isEmployee = null;
    if (this.employeesList.length > 0) {
      isEmployee = this.employeesList.find(s => s.id == e.item.id);
    }
    if (isEmployee != null) {
      this.utilityService.fail("You have already selected this employee", "Site Response");
    }
    else {

      this.employeesList.push({
        id: e.item.id,
        text: e.item.text,
        code: e.item.code,
        designation: e.item.designation,
        isValid: false,
        amount: 0
      })
      this.rows_valid = false;
    }
    this.getSelectedEmployees();
  }

  getSelectedEmployees() {
    this.form.get("selectEmployee").setValue("");
    this.form.get("selectedEmployees").setValue("");
    let employees = "";
    this.employeesList.forEach(item => {
      employees += item.id + ","
    });
    this.form.get("selectedEmployees").setValue(employees)
  }


  deleteEmployee(id: any) {
    const index = this.employeesList.findIndex(s => s.id == id);
    if (index > -1) {
      this.employeesList.splice(index, 1);
    }
    let employees = "";
    this.employeesList.forEach(item => {
      employees += item.id + ","
    });
    this.form.get("selectedEmployees").setValue(employees)
  }

  rows_valid: boolean = false;
  rowChanged(index: number) {
    let amount = this.utilityService.FloatTryParse(this.employeesList[index].amount);
    let percentage = this.utilityService.FloatTryParse(this.employeesList[index].percentage);

    this.employeesList[index].amount = amount;
    this.employeesList[index].percentage = percentage;

    this.employeesList[index].isValid = amount == 0 && percentage == 0 ? false : true;

    let validRows = 0;
    this.employeesList.forEach((item, index) => {
      if (item.isValid) {
        validRows++;
      }
    })

    if (this.employeesList.length > 0 && (this.employeesList.length != validRows)) {
      this.rows_valid = false;
    }
    else {
      this.rows_valid = true;
    }
  }


  btnSubmit: boolean = false;
  submit() {
    if (this.form.valid && this.rows_valid && this.btnSubmit == false) {
      let params = {
        allowanceNameId: this.utilityService.IntTryParse(this.form.get('allowanceNameId').value),
        flag: this.form.get('flag').value,
        month: this.utilityService.IntTryParse(this.form.get('month').value),
        year: this.utilityService.IntTryParse(this.form.get('year').value),
        adjustmentMonth: this.utilityService.IntTryParse(this.form.get('adjustmentMonth').value),
        adjustmentYear: this.utilityService.IntTryParse(this.form.get('adjustmentYear').value),
        details: []
      }

      this.employeesList.forEach((item, index) => {
        params.details.push({
          employeeId: item.id,
          amount: item.amount
        });
      })

      this.service.save(params).subscribe({
        next: (response) => {
          this.btnSubmit = false;
          this.utilityService.success(response.msg, "Server Response");
          this.closeModal('Save Complete')
        },
        error: (error) => {
          this.btnSubmit = false;
          this.utilityService.fail(error.msg, "Server Response")
        }
      })

    }
    else {
      this.utilityService.fail("Invalid form", "Site Response");
    }
  }

  closeModal(reason: any) {
    if (this.btnSubmit == false) {
      this.modalService.service.dismissAll(reason);
      this.closeModalEvent.emit(reason);
    }
    else {
      this.utilityService.fail("Something is running in this page, So You can not close this page now", "Site Response")
    }
  }

}
