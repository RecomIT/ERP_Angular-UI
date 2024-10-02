import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { BsDatepickerConfig } from "ngx-bootstrap/datepicker";
import { CustomModalService } from "src/app/shared/services/custom-modal.service";
import { UtilityService } from "src/app/shared/services/utility.service";
import { EmployeeInfoService } from "../../employee-info.service";
import { SharedmethodService } from "src/app/shared/services/shared-method/sharedmethod.service";
@Component({
  selector: 'app-employee-module-personal-insert-update-modal',
  templateUrl: './personal-insert-update-modal.component.html'
})

export class EmployeePersonalInsertUpdateModalComponent implements OnInit {

  @Input() employeeDetail: any = null;
  @Output() closeModalEvent = new EventEmitter<string>();

  @ViewChild('personalModal', { static: true }) personalModal!: ElementRef;
  modalTitle: string = "Update Personal Info";

  datePickerConfig: Partial<BsDatepickerConfig> = {};

  constructor(private fb: FormBuilder, // strongly type form build
    private employeeInfoService: EmployeeInfoService, // http request
    public utilityService: UtilityService, // utility 
    public modalService: CustomModalService,
    private sharedmethodService: SharedmethodService) {
  }

  ngOnInit(): void {
    if (this.employeeDetail != null) {
      this.personalFormInit();
    }
    this.datePickerConfig = Object.assign({}, {
      containerClass: "theme-dark-blue",
      showWeekNumbers: false,
      dateInputFormat: "DD-MMM-YYYY",
      isAnimated: true,
      showClearButton: false,
      showTodayButton: false,
      todayPosition: "left"
    });
  }

  ddlGender: any[] = this.utilityService.getGenders();
  ddlReligions: any[] = this.utilityService.getReligions();
  ddlBloodGroups: any[] = this.utilityService.getBloodGroup();
  ddlRelations: any[] = this.utilityService.getRelations();
  maritals() {
    return this.utilityService.getMaritals();
  }

  personalForm: FormGroup;

  formErrors = {
    fatherName: '',
    motherName: '',
    maritalStatus: '',
    spouseName: '',
    gender: '',
    dateOfBirth: '',
    religion: '',
    feet: '',
    inch: '',
    bloodGroup: '',
    personalMobileNo: '',
    personalEmailAddress: '',
    presentAddress: '',
    permanentAddress: '',
    numberOfChild:'',

    emergencyContactPerson: '',
    relationWithEmergencyContactPerson: '',
    emergencyContactNo: '',
    emergencyContactAddress: '',
    emergencyContactEmailAddress: '',

    emergencyContactPerson2: '',
    relationWithEmergencyContactPerson2: '',
    emergencyContactNo2: '',
    emergencyContactAddress2: '',
    emergencyContactEmailAddress2: ''
  };

  validationMessages = {
    'fatherName': {
      'maxlength': 'Maximum length is 100'
    },
    'motherName': {
      'maxlength': 'Maximum length is 100'
    },
    'maritalStatus': {
      'maxlength': 'Maximum length is 10'
    },
    'spouseName': {
      'maxlength': 'Maximum length is 100'
    },
    'numberOfChild': {
      'maxlength': 'Maximum length is 20'
    },
    'gender': {
      'required': 'Gender is required'
    },
    'dateOfBirth': {
      'required': 'Date of birth is required'
    },
    'religion': {
      'required': 'Religion is required',
      'maxlength': 'Maximum length is 100'
    },
    'feet': {
      'maxlength': 'Maximum length is 5'
    },
    'inch': {
      'maxlength': 'Maximum length is 5'
    },
    'bloodGroup': {
      'maxlength': 'Maximum length is 100',
      'required': 'Blood group is required',
    },
    'personalMobileNo': {
      'maxlength': 'Maximum length is 15'
    },
    'personalEmailAddress': {
      'maxlength': 'Maximum length is 200',
    },
    'presentAddress': {
      'maxlength': 'Maximum length is 200',
    },
    'permanentAddress': {
      'maxlength': 'Maximum length is 200',
      'required': 'Permanent address is required',
    },
    'emergencyContactPerson': {
      'maxlength': 'Maximum length is 200',
    },
    'relationWithEmergencyContactPerson': {
      'maxlength': 'Maximum length is 100',
    },
    'emergencyContactNo': {
      'maxlength': 'Maximum length is 15',
    },
    'emergencyContactAddress': {
      'maxlength': 'Maximum length is 200',
    }
  }

  personalFormInit() {
    this.personalForm = this.fb.group({
      employeeId: new FormControl(this.employeeDetail.employeeId),
      employeeDetailId: new FormControl(this.employeeDetail.employeeDetailId),
      fatherName: new FormControl((this.employeeDetail.fatherName ?? ""), [Validators.maxLength(100)]),
      motherName: new FormControl((this.employeeDetail.motherName ?? ""), [Validators.maxLength(100)]),
      maritalStatus: new FormControl((this.employeeDetail.maritalStatus ?? ""), [Validators.maxLength(10)]),
      spouseName: new FormControl((this.employeeDetail.spouseName ?? ""), [Validators.maxLength(100)]),
      gender: new FormControl((this.employeeDetail.gender ?? ""), [Validators.required, Validators.maxLength(100)]),
      dateOfBirth: new FormControl(new Date(this.employeeDetail.dateOfBirth), [Validators.required]),
      religion: new FormControl(((this.employeeDetail.religion ?? "")).toUpperCase(), [Validators.required, Validators.maxLength(100)]),
      feet: new FormControl(((this.employeeDetail.feet ?? "N/A")).toUpperCase(), [Validators.maxLength(5)]),
      inch: new FormControl(((this.employeeDetail.inch ?? "N/A")).toUpperCase(), [Validators.maxLength(5)]),
      bloodGroup: new FormControl((this.employeeDetail.bloodGroup ?? ""), [Validators.required, Validators.maxLength(100)]),
      personalMobileNo: new FormControl((this.employeeDetail.personalMobileNo ?? ""), [Validators.maxLength(15)]),
      personalEmailAddress: new FormControl((this.employeeDetail.personalEmailAddress ?? ""), [Validators.maxLength(200)]),
      presentAddress: new FormControl((this.employeeDetail.presentAddress ?? ""), [Validators.maxLength(200)]),
      permanentAddress: new FormControl((this.employeeDetail.permanentAddress ?? ""), [Validators.required, Validators.maxLength(200)]),
      isResidential: new FormControl(this.employeeDetail.isResidential),
      numberOfChild: new FormControl(this.employeeDetail.numberOfChild,[Validators.maxLength(20)]),

      emergencyContactPerson: new FormControl((this.employeeDetail.emergencyContactPerson ?? ""), [Validators.maxLength(100)]),
      relationWithEmergencyContactPerson: new FormControl((this.employeeDetail.relationWithEmergencyContactPerson ?? ""), [Validators.maxLength(50)]),
      emergencyContactNo: new FormControl((this.employeeDetail.emergencyContactNo ?? ""), [Validators.maxLength(15)]),
      emergencyContactAddress: new FormControl((this.employeeDetail.emergencyContactAddress ?? ""), [Validators.maxLength(200)]),
      emergencyContactEmailAddress: new FormControl((this.employeeDetail.emergencyContactEmailAddress ?? ""), [Validators.maxLength(200)]),

      emergencyContactPerson2: new FormControl((this.employeeDetail.emergencyContactPerson2 ?? ""), [Validators.maxLength(100)]),
      relationWithEmergencyContactPerson2: new FormControl((this.employeeDetail.relationWithEmergencyContactPerson2 ?? ""), [Validators.maxLength(50)]),
      emergencyContactNo2: new FormControl((this.employeeDetail.emergencyContactNo2 ?? ""), [Validators.maxLength(15)]),
      emergencyContactAddress2: new FormControl((this.employeeDetail.emergencyContactAddress2 ?? ""), [Validators.maxLength(200)]),
      emergencyContactEmailAddress2: new FormControl((this.employeeDetail.emergencyContactEmailAddress2 ?? ""), [Validators.maxLength(200)]),

    })
    this.modalService.open(this.personalModal, "xl");
  }


  logFormErrors(formGroup: FormGroup = this.personalForm) {
    Object.keys(formGroup.controls).forEach((key: string) => {
      const abstractControl = formGroup.get(key);
      this.formErrors[key] = '';
      if (abstractControl && !abstractControl.valid) {
        // && (abstractControl.touched || abstractControl.dirty)
        const messages = this.validationMessages[key];
        for (const errorKey in abstractControl.errors) {
          console.log("key >>>", key);
          console.log("errorKey >>>", errorKey);
          this.formErrors[key] += messages[errorKey];
        }
      }
    })
  }

  submitForm() {
    this.logFormErrors();
    if (this.personalForm.valid) {
      this.employeeInfoService.savePersonalInfo(this.personalForm.value).subscribe(response => {
        if (response?.status != null && response?.status) {
          this.sharedmethodService.callMethod();
          this.modalService.service.dismissAll();
          this.closeModal('Save Complete');
          this.utilityService.success(response?.msg, "Server Response");
        }
        else {
          this.utilityService.fail(response?.msg, "Server Response");
        }
      }, (error) => {
        this.utilityService.fail("One or More field value is invalid", "Site Response");
        console.log("error >>>", error);
      })
    }
    else {
      this.utilityService.fail('Invalid form submission', 'Site Response')
    }
  }

  closeModal(reason: string) {
    this.modalService.service.dismissAll(reason);
    this.closeModalEvent.emit(reason); // fair
  }

  findInvalidControls() {
    let controls = this.personalForm.controls;
    for (let name in controls) {
      if (this.personalForm.get(name).invalid) {
        console.log("invalid control >>>", name)
      }
    }

  }


}