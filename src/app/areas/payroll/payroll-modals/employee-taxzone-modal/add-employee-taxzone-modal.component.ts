import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { ApiArea, ApiController } from 'src/app/shared/constants';
import { CustomModalService } from 'src/app/shared/services/custom-modal.service';
import { HrWebService } from 'src/app/shared/services/hr-web.service';
import { UserService } from 'src/app/shared/services/user.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AreasHttpService } from "src/app/areas/areas.http.service";

@Component({
  selector: 'app-payroll-addemployeetaxzone-modal',
  templateUrl: './add-employee-taxzone-modal.component.html'
})

export class AddEmployeeTaxZoneModalComponent implements OnInit {
  @Input() employeeTaxZoneId: number = 0;
  @Output() closeModalEvent = new EventEmitter<string>();
  @ViewChild('taxZoneModal', { static: true }) taxZoneModal!: ElementRef;
  @ViewChild('taxZoneEditModal', { static: true }) taxZoneEditModal!: ElementRef;
  modalTitle: string = "";

  datePickerConfig: Partial<BsDatepickerConfig> = {};
  constructor(private fb: FormBuilder, // strongly type form build
    private areasHttpService: AreasHttpService, // http request
    private userService: UserService, // user service user id
    public utilityService: UtilityService, // utility 
    public modalService: CustomModalService, // modal service 
    private hrWebService: HrWebService) {
  }

  ngOnInit(): void {
    this.loadEmployees();
    //console.log("employeeTaxZoneId >>>",this.employeeTaxZoneId)
    if (this.employeeTaxZoneId > 0) {
      console.log("employeeTaxZoneId >>>", this.employeeTaxZoneId)
      this.getEmployeeTaxZoneById(this.employeeTaxZoneId);
    }
    else {
      this.taxZoneFormInit();
    }

    this.datePickerConfig = Object.assign({}, {
      containerClass: "theme-dark-blue",
      showWeekNumbers: false,
      dateInputFormat: "DD-MMMM-YYYY",
      isAnimated: true,
      showClearButton: false,
      showTodayButton: false,
      todayPosition: "left",
      rangeInputFormat: "DD-MMM-YYYY",
      rangeSeparator: " ~ ",
      size: "sm",
      customTodayClass: 'custom-today-class'
    })

  }

  User() {
    return this.userService.getUser();
  }

  taxZoneForm: FormGroup;
  formArray: any;
  taxZoneFormInit() {
    this.taxZoneForm = this.fb.group({
      taxzones: this.fb.array([
        this.fb.group({
          employeeId: new FormControl(0, [Validators.min(1)]),
          employeeTaxZoneId: new FormControl(0),
          taxZone: new FormControl('', [Validators.required]),
          minimumTaxAmount: new FormControl(0, [Validators.min(1)]),
          effectiveDate: new FormControl(null)
        })
      ])
    })
    this.formArray = (<FormArray>this.taxZoneForm.get('taxzones')).controls;

    this.modalService.open(this.taxZoneModal, "xl");
  }

  select2Options = {
    width: "100%",
    containerCssClass: "form-control form-control-sm text-x-small font-bold",
    theme: "bootstrap4"
  }


  ddlEmployees: any[] = [];
  loadEmployees() {
    this.ddlEmployees = [];
    this.hrWebService.getEmployees<any[]>().then((data) => {
      this.ddlEmployees = data;
    })
  }

  addTaxzoneButtonClick(): void {
    (<FormArray>this.taxZoneForm.get('taxzones')).push(this.addTaxzoneGroup());
  }

  addTaxzoneGroup() {
    return this.fb.group({
      employeeId: new FormControl(0, [Validators.min(1)]),
      employeeTaxZoneId: new FormControl(0),
      taxZone: new FormControl('', [Validators.required]),
      minimumTaxAmount: new FormControl(0, [Validators.min(1)]),
      effectiveDate: new FormControl(null)
    })
  }

  removeTaxzoneButtonClick(index: number) {
    if ((<FormArray>this.taxZoneForm.get('taxzones')).length > 1) {
      (<FormArray>this.taxZoneForm.get('taxzones')).removeAt(index);
    }
    else {
      this.utilityService.fail("You can't delete last item", "Site Response");
    }
  }

  btnTaxZone: boolean = false;
  submitTaxZone() {
    if (this.taxZoneForm.valid) {
      this.btnTaxZone = true;
      var taxzones: any = [];
      this.formArray.forEach((formGroup: FormGroup) => {
        console.log("form group value >>>", formGroup.value);
        taxzones.push({
          employeeTaxZoneId: this.utilityService.IntTryParse(formGroup.get('employeeTaxZoneId').value),
          taxZone: formGroup.get('taxZone').value,
          minimumTaxAmount: formGroup.get('minimumTaxAmount').value,
          effectiveDate: new Date(formGroup.get('effectiveDate').value),
          employeeId: this.utilityService.IntTryParse(formGroup.get('employeeId').value),
        })
      })

      
      this.areasHttpService.observable_post((ApiArea.payroll + "/TaxZone" + "/SaveEmployeeTaxZone"), JSON.stringify(taxzones), {
        'headers': {
          'Content-Type': 'application/json'
        },
      }).subscribe((result) => {
        var data = result as any;
        this.btnTaxZone = false;
        if (data.status) {
          this.utilityService.success(data.msg, "Server Response");
          this.closeModal('Save Complete');
        }
        else {
          if (data.msg == "Validation Error") {
            this.utilityService.fail(data.errors?.duplicateAllowance, "Server Response", 5000);
          }
          else {
            this.utilityService.fail(data.msg, "Server Response")
          }
        }
      }, (error) => {
        console.log("error >>", error)
        this.utilityService.fail("Something went wrong", "Server Response")
        this.btnTaxZone = false;
      })
    }
  }

  closeModal(reason: string) {
    this.modalService.service.dismissAll(reason);
    this.closeModalEvent.emit(reason); // fire
  }

  getEmployeeTaxZoneById(id: any) {
    //console.log("getEmployeeTaxZoneById >>>")
    this.areasHttpService.observable_get<any[]>((ApiArea.payroll + "/TaxZone" + "/GetEmployeeTaxZoneById"), {
      responseType: "json", params: { id: id }
    }).subscribe(response => {
      console.log("employeeTaxZoneId response >>>", response)
      this.employeeTaxZoneForEdit(response);
    })
  }

  listOfEmployeeTaxZone: any[] = null;
  getEmployeeTaxZones() {
    this.areasHttpService.observable_get<any[]>((ApiArea.payroll + "/TaxZone" + "/GetEmployeeTaxZones"), {
      responseType: "json", params: { empTaxZoneId: 0, branchId: this.User().BranchId, ComId: this.User().ComId, OrgId: this.User().OrgId }
    }).subscribe(data => {
      this.listOfEmployeeTaxZone = data;
      console.log("listOfEmployeeTaxZone >>> ", this.listOfEmployeeTaxZone);
    })
  }

  //Edit Modal
  employeeTaxZoneEditForm: FormGroup;
  employeeTaxZoneForEdit(data: any) {
    this.btnTaxZone = false;
    this.employeeTaxZoneEditForm = this.fb.group({
      employeeTaxZoneId: new FormControl(data.employeeTaxZoneId),
      employeeId: new FormControl({ value: data.employeeId, disabled: true }, [Validators.required, Validators.min(1)]),
      taxZone: new FormControl(data.taxZone, [Validators.required]),
      minimumTaxAmount: new FormControl(data.minimumTaxAmount, [Validators.min(1)]),
      effectiveDate: new FormControl(new Date(data.effectiveDate))
    })
    this.modalService.open(this.taxZoneEditModal, "sm");
  }

  updateTaxZone() {
    if (this.employeeTaxZoneEditForm.valid) {
      this.btnTaxZone = true;
      for (const prop in this.employeeTaxZoneEditForm.controls) {
        this.employeeTaxZoneEditForm.value[prop] = this.employeeTaxZoneEditForm.controls[prop].value;
      }

      this.areasHttpService.observable_put((ApiArea.payroll + "/TaxZone" + "/UpdateTaxZone"), JSON.stringify(this.employeeTaxZoneEditForm.value), {
        'headers': {
          'Content-Type': 'application/json'
        },
      }).subscribe((result) => {
        //this.logger("Submit result >>", result);
        var data = result as any;
        this.btnTaxZone = false;
        if (data.status) {
          this.utilityService.success(data.msg, "Server Response");
          this.closeModal('Save Complete');
        }
        else {
          this.utilityService.fail(data.msg, "Server Response")
        }
      }, (error) => {
        this.utilityService.fail("Something went wrong", "Server Response")
        this.btnTaxZone = false;
      })
    }
  }


}