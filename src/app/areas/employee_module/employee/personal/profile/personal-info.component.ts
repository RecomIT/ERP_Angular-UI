import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { transition, trigger, useAnimation } from "@angular/animations";
import { bounceIn, fadeIn, fadeInRight, slideInUp } from "ng-animate";
import { BsDatepickerConfig } from "ngx-bootstrap/datepicker";
import { ApiArea, ApiController } from "src/app/shared/constants";
import { CustomModalService } from "src/app/shared/services/custom-modal.service";
import { UserService } from "src/app/shared/services/user.service";
import { UtilityService } from "src/app/shared/services/utility.service";
import { AreasHttpService } from "../../../../areas.http.service";
import { EmployeeInfoService } from "../../employee-info.service";
import { error } from "console";

@Component({
    selector: 'app-employee-module-personal-info',
    templateUrl: './personal-info.component.html',
    animations: [
        trigger('slideInUp', [transition('* => *', useAnimation(slideInUp, { params: { timing: 0.5 } }))]),
        trigger('fadeIn', [transition('void => *', useAnimation(fadeIn, { params: { timing: 0.3 } }))]),
        trigger('fadeInRight', [transition('void => *', useAnimation(fadeInRight, { params: { timing: 0.5 } }))]),
        trigger('bounceIn', [transition('void => *', useAnimation(bounceIn, { params: { timing: 1 } }))]),
    ]
})
export class PersonalInfoComponent implements OnInit {
    @Input() employeeId: number = null;
    datePickerConfig: Partial<BsDatepickerConfig> = this.utilityService.datePickerConfig();
    employeePersonalInfo: any;
    showEditBtn: boolean = true;

    constructor(private utilityService: UtilityService, private fb: FormBuilder,
        private userService: UserService, public modalService: CustomModalService, private areasHttpService: AreasHttpService,
        private employeeInfoService: EmployeeInfoService) { }
    ngOnInit(): void {
        this.showEditBtn = this.employeeId == this.userService.User().EmployeeId;
        if (this.employeeId > 0) {
            this.getEmployeePersonalInfoById()
        }
        else if (this.employeeId == 0) {
            this.employeeId = this.userService.User().EmployeeId;
            this.getEmployeePersonalInfoById()
        }
        this.employeePersonalFormInit();
    }


    ddlGender: any[] = this.utilityService.getGenders();
    ddlReligions: any[] = this.utilityService.getReligions();
    ddlBloodGroups: any[] = this.utilityService.getBloodGroup();
    ddlRelations: any[] = this.utilityService.getRelations();
    maritals() {
        return this.utilityService.getMaritals();
    }
    personalForm: FormGroup;
    employeePersonalFormInit() {
        this.personalForm = this.fb.group({
            employeeId: new FormControl(this.employeeId),
            employeeDetailId: new FormControl(0),
            fatherName: new FormControl(''),
            motherName: new FormControl(''),
            maritalStatus: new FormControl(''),
            spouseName: new FormControl(''),
            gender: new FormControl(''),
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

    getEmployeePersonalInfoById() {
        this.employeeInfoService.getPersonalInfo({ employeeId: this.employeeId }).subscribe(response => {
            this.employeePersonalInfo = response.body;
        }, (error) => {
            this.utilityService.httpErrorHandler(error);
        })
    }

    modalObj: any = null;
    showModal: boolean = false;
    openModal() {
        this.modalObj = this.employeePersonalInfo;
        this.showModal = true;
    }

    closeModal(reason: string) {
        this.showModal = false;
        this.modalObj = null;
        if (reason == 'Save Complete') {
            this.getEmployeePersonalInfoById();
        }
    }

}