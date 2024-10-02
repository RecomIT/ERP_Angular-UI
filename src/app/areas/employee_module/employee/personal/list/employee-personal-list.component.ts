import { ToastrService } from "ngx-toastr";
import { Component, Input, OnInit } from "@angular/core";
import { BsDatepickerConfig } from "ngx-bootstrap/datepicker";
import { ApiArea, ApiController } from "src/app/shared/constants";
import { EmployeeInfoService } from "../../employee-info.service";
import { AreasHttpService } from "../../../../areas.http.service";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { UtilityService } from "src/app/shared/services/utility.service";
import { CustomModalService } from "src/app/shared/services/custom-modal.service";

@Component({
    selector: 'app-employee-module-employee-personal-list',
    templateUrl: './employee-personal-list.component.html'
})


export class EmployeePersonalListComponent implements OnInit {
    @Input() inputEmployeeId: any = 0;
    employeeId: number = 0;

    constructor(
        private utilityService: UtilityService, private fb: FormBuilder,
        public modalService: CustomModalService,
        public toastr: ToastrService, private employeeInfoService: EmployeeInfoService) {
    }

    ddlGender: any[] = this.utilityService.getGenders();
    ddlReligions: any[] = this.utilityService.getReligions();
    ddlBloodGroups: any[] = this.utilityService.getBloodGroup();
    ddlRelations: any[] = this.utilityService.getRelations();
    maritals() {
        return this.utilityService.getMaritals();
    }

    datePickerConfig: Partial<BsDatepickerConfig> = {};
    ngOnInit(): void {
        this.employeeId = this.inputEmployeeId;

        this.datePickerConfig = Object.assign({}, {
            containerClass: "theme-dark-blue",
            showWeekNumbers: false,
            dateInputFormat: "DD-MMM-YYYY",
            isAnimated: true,
            showClearButton: false,
            showTodayButton: false,
            todayPosition: "left"
        });
        console.log("Employee Personal Info >>>")
        this.getEmployeePersonalInfoById();
        this.employeePersonalFormInit();
    }

    personalForm: FormGroup;

    employeePersonalFormInit() {
        this.personalForm = this.fb.group({
            employeeId: new FormControl(this.employeeId),
            employeeDetailId: new FormControl(0),
            legalName: new FormControl('',[Validators.maxLength(200)]), 
            fatherName: new FormControl(''),
            motherName: new FormControl(''),
            maritalStatus: new FormControl(''),
            spouseName: new FormControl(''),
            numberOfChild: new FormControl('0'),
            gender: new FormControl('', [Validators.required]),
            dateOfBirth: new FormControl(null),
            religion: new FormControl(''),
            feet: new FormControl(''),
            inch: new FormControl(''),
            bloodGroup: new FormControl(''),
            personalMobileNo: new FormControl(''),
            personalEmailAddress: new FormControl(''),
            presentAddress: new FormControl(''),
            permanentAddress: new FormControl(''),
            isResidential: new FormControl(false),

            emergencyContactPerson: new FormControl(''),
            relationWithEmergencyContactPerson: new FormControl(''),
            emergencyContactNo: new FormControl(''),
            emergencyContactAddress: new FormControl(''),
            emergencyContactEmailAddress: new FormControl(''),


            emergencyContactPerson2: new FormControl(''),
            relationWithEmergencyContactPerson2: new FormControl(''),
            emergencyContactNo2: new FormControl(''),
            emergencyContactAddress2: new FormControl(''),
            emergencyContactEmailAddress2: new FormControl(''),
        })
    }

    employeePersonalInfo: any;
    getEmployeePersonalInfoById() {

        this.employeeInfoService.getPersonalInfo({ employeeId: this.employeeId }).subscribe(response => {
            this.employeePersonalInfo = response.body;
            this.setEmployeePersonalValues();
            console.log("this.employeePersonalInfo >>>", this.employeePersonalInfo);
        }, (error) => {
            console.log("error >>>", error);
            this.toastr.error("Something went wrong", "Server Response", { timeOut: 1000 })
        })
    }

    setEmployeePersonalValues() {
        this.personalForm.get('employeeId').setValue(this.employeePersonalInfo.employeeId);
        this.personalForm.get('employeeDetailId').setValue(this.employeePersonalInfo.employeeDetailId);
        this.personalForm.get('legalName').setValue(this.employeePersonalInfo.legalName);
        this.personalForm.get('fatherName').setValue(this.employeePersonalInfo.fatherName);
        this.personalForm.get('motherName').setValue(this.employeePersonalInfo.motherName);
        this.personalForm.get('maritalStatus').setValue(this.employeePersonalInfo?.maritalStatus ?? 'N/A');
        this.personalForm.get('spouseName').setValue(this.employeePersonalInfo?.spouseName ?? '');
        this.personalForm.get('numberOfChild').setValue((this.employeePersonalInfo?.numberOfChild) == null ? '0' : (this.employeePersonalInfo?.numberOfChild).toString());
        this.personalForm.get('gender').setValue(this.employeePersonalInfo?.gender ?? '');
        if (this.employeePersonalInfo?.dateOfBirth != null && this.employeePersonalInfo?.dateOfBirth != '') {
            this.personalForm.get('dateOfBirth').setValue(new Date(this.employeePersonalInfo.dateOfBirth));
        }
        this.personalForm.get('religion').setValue(this.employeePersonalInfo?.religion ?? '');
        this.personalForm.get('feet').setValue(this.employeePersonalInfo?.feet ?? 'N/A');
        this.personalForm.get('inch').setValue(this.employeePersonalInfo?.inch ?? 'N/A');
        this.personalForm.get('bloodGroup').setValue(this.employeePersonalInfo?.bloodGroup ?? '');
        this.personalForm.get('personalMobileNo').setValue(this.employeePersonalInfo.personalMobileNo);
        this.personalForm.get('personalEmailAddress').setValue(this.employeePersonalInfo.personalEmailAddress);
        this.personalForm.get('presentAddress').setValue(this.employeePersonalInfo.presentAddress);
        this.personalForm.get('permanentAddress').setValue(this.employeePersonalInfo.permanentAddress);
        this.personalForm.get('isResidential').setValue(this.employeePersonalInfo.isResidential);

        this.personalForm.get('emergencyContactPerson').setValue(this.employeePersonalInfo.emergencyContactPerson);
        this.personalForm.get('relationWithEmergencyContactPerson').setValue(this.employeePersonalInfo?.relationWithEmergencyContactPerson ?? '');
        this.personalForm.get('emergencyContactNo').setValue(this.employeePersonalInfo.emergencyContactNo);
        this.personalForm.get('emergencyContactAddress').setValue(this.employeePersonalInfo.emergencyContactAddress);
        this.personalForm.get('emergencyContactEmailAddress').setValue(this.employeePersonalInfo.emergencyContactEmailAddress);


        this.personalForm.get('emergencyContactPerson2').setValue(this.employeePersonalInfo.emergencyContactPerson2);
        this.personalForm.get('relationWithEmergencyContactPerson2').setValue(this.employeePersonalInfo?.relationWithEmergencyContactPerson2 ?? '');
        this.personalForm.get('emergencyContactNo2').setValue(this.employeePersonalInfo.emergencyContactNo2);
        this.personalForm.get('emergencyContactAddress2').setValue(this.employeePersonalInfo.emergencyContactAddress2);
        this.personalForm.get('emergencyContactEmailAddress2').setValue(this.employeePersonalInfo.emergencyContactEmailAddress2);
    }

    submitForm() {
        if (this.personalForm.valid) {
            let personalForm = this.personalForm.value;
            personalForm.numberOfChild = personalForm.numberOfChild == null || personalForm.numberOfChild == "" ? "0" : personalForm.numberOfChild.toString();
            this.employeeInfoService.savePersonalInfo(this.personalForm.value).subscribe(response => {
                if (response?.status != null && response?.status) {
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

}