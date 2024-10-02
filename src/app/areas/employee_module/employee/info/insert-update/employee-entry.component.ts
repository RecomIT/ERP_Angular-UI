import { transition, trigger, useAnimation } from "@angular/animations";
import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { bounceIn, fadeIn, fadeInRight, slideInUp } from "ng-animate";
import { CustomModalService } from "src/app/shared/services/custom-modal.service";
import { UserService } from "src/app/shared/services/user.service";
import { UtilityService } from "src/app/shared/services/utility.service";
import Stepper from 'bs-stepper';
import { BsDatepickerConfig } from "ngx-bootstrap/datepicker";
import { ControlPanelWebService } from "src/app/shared/services/control-panel.service";
import { ToastrService } from "ngx-toastr";
import { DatePipe } from "@angular/common";
import { DepartmentService } from "../../../Organizational/department/department.service";
import { DesignationService } from "../../../Organizational/designation/designation.service";
import { WorkShiftService } from "src/app/areas/attendance_module/Workshift/work-shit.service";
import { BankService } from "../../../Account/bank/bank.service";
import { BankBranchService } from "../../../Account/bank-branch/bank-branch.service";
import { EmployeeInfoService } from "../../employee-info.service";
import { EmployeeTypeService } from "../../../Organizational/employee-type/employee-type.service";
import { JobCategoryService } from "../../../Organizational/job-category/job-category.service";
import { CostCenterService } from "../../../Organizational/costcenter/costcenter.service";
import { officeEmailValidator } from "../../../validators/office-email.validator";
import { employeeCodeValidator } from "../../../validators/employee-code-validator";


@Component({
    selector: 'app-employee-module-employee-entry-form',
    templateUrl: './employee-entry.component.html',
    animations: [
        trigger('slideInUp', [transition('* => *', useAnimation(slideInUp, { params: { timing: 0.5 } }))]),
        trigger('fadeIn', [transition('void => *', useAnimation(fadeIn, { params: { timing: 0.3 } }))]),
        trigger('fadeInRight', [transition('void => *', useAnimation(fadeInRight, { params: { timing: 0.5 } }))]),
        trigger('bounceIn', [transition('void => *', useAnimation(bounceIn, { params: { timing: 1 } }))]),
    ],
})

export class EmployeeEntryComponent implements OnInit {
    @Output() childToParent = new EventEmitter<any>();

    private stepper: Stepper;
    datePickerConfig: Partial<BsDatepickerConfig> = this.utilityService.datePickerConfig();
    constructor(private datePipe: DatePipe, private utilityService: UtilityService, private fb: FormBuilder,
        private userService: UserService, public modalService: CustomModalService,
        private controlPanelWebService: ControlPanelWebService, public toastr: ToastrService,
        private departmentService: DepartmentService,
        private desingationService: DesignationService,
        private workShiftService: WorkShiftService,
        private bankService: BankService,
        private bankBranchService: BankBranchService,
        private employeeInfoService: EmployeeInfoService,
        private employeeTypeService: EmployeeTypeService,
        private jobCategoryService: JobCategoryService,
        private costCenterService: CostCenterService,
    ) {

    }

    ngOnInit(): void {

        this.stepper = new Stepper(document.querySelector('#employee-stepper'), {
            linear: false,
            animation: true,
        });
        this.employeeEntryFormInit();
        this.loadBranch();
        this.loadDepartment();
        this.loadDesignation();
        this.loadWorkShift();
        this.loadBanks();
        this.loadEmployeeType();

        this.loadEmployeeDropdown();
        this.loadCostCenter();
        this.loadJobCategory();
    }


    employeeEntryForm: FormGroup;
    ddlJobtypes: any[] = this.utilityService.getJobTypes();
    ddlGender: any[] = this.utilityService.getGenders();
    ddlReligions: any[] = this.utilityService.getReligions();
    ddlBloodGroups: any[] = this.utilityService.getBloodGroup();
    ddlRelations: any[] = this.utilityService.getRelations();
    ddlPaymentTypes: any[] = this.utilityService.getPaymentTypes();

    ddlEmployees: any[] = [];
    loadEmployeeDropdown() {
        this.employeeInfoService.loadDropdownData({});
        this.employeeInfoService.ddl_employee_data$.subscribe(data => {
            this.employeeInfoService.loadDropdown(data);
            this.ddlEmployees = this.employeeInfoService.ddl$;
        }, error => {
            console.error('Error while fetching data:', error);
        });
    }

    ddlProbotionMonth = [1, 2, 3, 4, 5, 6];


    backToList(value: any) {
        this.childToParent.emit(value);
    }

    formErrors = {
        employeeCode: '',
        firstName: '',
        lastName: '',
        branchId: '',
        designationId: '',
        departmentId: '',
        gender: '',
        dateOfJoining: '',
        workshiftId: '',
        officeEmail: '',
        jobType: '',
        taxZone: '',
        minimunTaxAmount: 0,
        parmanentAddress: '',
        religion: '',
    };

    validationMessages = {
        'employeeCode': {
            'required': 'ID is required',
            'maxlength': 'Max length is 50',
            'taken': 'Id is already taken'
        },
        'firstName': {
            'required': 'Name is required',
            'maxlength': 'Max length is 100',
            'minlength': 'min length is 3'
        },
        'lastName': {
            'required': 'Last name is required',
            'maxlength': 'Max length is 30',
            'minlength': 'min length is 3'
        },
        'branchId': {
            'min': 'Branch is required'
        },
        'designationId': {
            'min': 'Designation is required'
        },
        'departmentId': {
            'min': 'Department is required'
        },
        'gender': {
            'required': 'Gender is required',
        },
        'dateOfJoining': {
            'required': 'Joining date is required',
        },
        'workshiftId': {
            'min': 'Shift is required',
        },
        'officeEmail': {
            'required': 'Office email is required',
            'taken': 'Email is already taken',
            'email': "Invalid email"
        },
        'jobType': {
            'required': 'Job type is required',
        },
        'minimunTaxAmount': {
            'required': 'Field is required',
        },
        'legalName':{
            'maxlength': 'Max length is 200',
        },
        'fatherName':{
            'maxlength': 'Max length is 100',
        },
        'motherName':{
            'maxlength': 'Max length is 100',
        },
        'religion': {
            'required': 'Religion is required',
        },
        'parmanentAddress': {
            'required': 'Parmanent address is required',
        }
    }

    logFormErrors(formGroup: FormGroup): boolean {
        let isValid = true;
        Object.keys(formGroup.controls).forEach((key: string) => {
            const abstractControl = formGroup.get(key);
            this.formErrors[key] = '';
            if (abstractControl && !abstractControl.valid) {
                const messages = this.validationMessages[key];
                for (const errorKey in abstractControl.errors) {
                    console.log(`key :${key}, errorKey: ${errorKey}`);
                    this.formErrors[key] += messages[errorKey];
                    isValid = false;
                }
            }
        })
        return isValid;
    }

    findInvalidControls(formGroupName: string = '') {
        if (formGroupName != null && formGroupName != '') {
            let formGroup = this.employeeEntryForm.controls[formGroupName] as FormGroup;
            this.logFormErrors(formGroup);
        }
        else {
            let controls = this.employeeEntryForm.controls;
            for (let formGroup in controls) {
                let groups = this.employeeEntryForm.controls[formGroup] as FormGroup;
                for (let name in groups.controls) {
                    if (groups.controls[name].invalid) {
                        console.log(name);
                    }
                }
            }
        }

    }

    get officeEmail() {
        return this.employeeEntryForm.get('professionalInfo.officeEmail');
    }

    employeeEntryFormInit() {
        this.employeeEntryForm = this.fb.group({
            professionalInfo: this.fb.group({
                employeeId: [0],
                employeeCode: ['', [Validators.required, Validators.maxLength(50)], [employeeCodeValidator(this.employeeInfoService)]],
                firstName: ['', [Validators.required, Validators.maxLength(100), Validators.minLength(3)]],
                lastName: ['', [Validators.maxLength(30)]],
                //lastName: ['', [Validators.required, Validators.maxLength(30), Validators.min(3)]],
                branchId: [this.first_branch_id, [Validators.min(1)]],
                designationId: [0, [Validators.min(1)]],
                departmentId: [0, [Validators.min(1)]],
                dateOfJoining: [null, [Validators.required]],
                workshiftId: [0, [Validators.min(1)]],
                officeMobile: [''],
                officeEmail: ['', [Validators.required, Validators.email], [officeEmailValidator(this.employeeInfoService)]],
                referenceNo: [''],
                fingureId: [''],
                jobType: ['', Validators.required],
                taxZone: [''],
                minimunTaxAmount: [0],
                employeeTypeId: [0],
                jobCategoryId: [0],
                costCenterId: [0],
                internalDesignationId: [0],
                supervisorId: [0],
                hodId: [0],
                probationMonth: [1],
                isPFMember: [false]
            }),
            personalInfo: this.fb.group({
                legalName:['',[Validators.maxLength(200)]],
                fatherName: ['',[Validators.maxLength(100)]],
                motherName: ['',[Validators.maxLength(100)]],
                dateOfBirth: [null],
                gender: ['', [Validators.required]],
                feet: ['N/A'],
                inch: ['N/A'],
                bloodGroup: [''],
                religion: [''], //[Validators.required]
                maritalStatus: ['N/A'],
                spouseName: [''],
                numberOfChild: [0],
                presentAddress: [''],
                parmanentAddress: [''], //[Validators.required]
                personalMobileNo: [''],
                personalEmailAddress: [''],
                ResidentialStatus: [true],

            }),
            paymentInfo: this.fb.group({
                paymentMode: [""],
                accountNo: [""],
                bankId: [0],
                bankBranchId: [0]
            }),
            emergancyContactInfo: this.fb.group({
                emergencyContactPersoneName: [''],
                emergencyContactPersoneRelation: [''],
                emergencyContactPersoneContactNo: [''],
                emergencyContactPersoneAddress: [''],
                emergencyContactEmailAddress: [''],
                emergencyContactPersoneName2: [''],
                emergencyContactPersoneRelation2: [''],
                emergencyContactPersoneContactNo2: [''],
                emergencyContactPersoneAddress2: [''],
                emergencyContactEmailAddress2: ['']
            })
        })

        // if (this.employeeEntryForm.get('professionalInfo') instanceof FormGroup) {
        //     //console.log("this.employeeEntryForm.get('professionalInfo') >>>", this.employeeEntryForm.get('professionalInfo'));
        // }

        // this.employeeEntryForm.get('professionalInfo').valueChanges.subscribe(value => {
        //     //this.employeeEntryForm.get('professionalInfo.officeEmail').updateValueAndValidity({ onlySelf: true, emitEvent: false });
        // });
        // this.employeeEntryForm.get('professionalInfo').valueChanges.subscribe(value => {
        //     //this.employeeEntryForm.get('professionalInfo.officeEmail').updateValueAndValidity({ onlySelf: true, emitEvent: false });
        // });

        this.employeeEntryForm.get('professionalInfo').valueChanges.subscribe(value => {
            this.logFormErrors(this.employeeEntryForm.get('professionalInfo') as FormGroup);
        })

        this.employeeEntryForm.get('professionalInfo').get('jobType').valueChanges.subscribe(value => {
            if (value != "Probation") {
                this.employeeEntryForm.get('professionalInfo').get('probationMonth').setValue(0)
            }
            else if (value = "Probation") {
                this.employeeEntryForm.get('professionalInfo').get('probationMonth').setValue(6)
            }
            else {
                this.employeeEntryForm.get('professionalInfo').get('probationMonth').setValue(0)
            }
        })

        // this.employeeEntryForm.get('personalInfo').valueChanges.subscribe(value => {
        //     //this.findInvalidControls('personalInfo');
        // });

        // this.employeeEntryForm.get('paymentInfo').valueChanges.subscribe(value => {
        //     //this.findInvalidControls('paymentInfo');
        // });

        // this.employeeEntryForm.get('emergancyContactInfo').valueChanges.subscribe(value => {
        //     //this.findInvalidControls('emergancyContactInfo');
        // });

        this.employeeEntryForm.get('paymentInfo').get('paymentMode').valueChanges.subscribe(paymentMode => {
            this.employeeEntryForm.get('paymentInfo').get('bankId').clearValidators();
            this.employeeEntryForm.get('paymentInfo').get('bankBranchId').clearValidators();
            this.employeeEntryForm.get('paymentInfo').get('accountNo').clearValidators();
            if (paymentMode == 'Bank') {
                this.employeeEntryForm.get('paymentInfo').get('bankId').setValidators(Validators.min(1));
                this.employeeEntryForm.get('paymentInfo').get('bankBranchId').setValidators(Validators.min(1));
                this.employeeEntryForm.get('paymentInfo').get('accountNo').setValidators(Validators.required);
            }
            else if (paymentMode == 'Bkash' || paymentMode == 'Nagad' || paymentMode == 'Rocket') {
                this.employeeEntryForm.get('paymentInfo').get('accountNo').setValidators(Validators.required);
            }
        })

        this.employeeEntryForm.get('paymentInfo').get('bankId').valueChanges.subscribe(bankId => {
            this.employeeEntryForm.get('paymentInfo').get('bankBranchId').setValue(0);
            const bank_id = this.utilityService.IntTryParse(bankId);
            this.loadBankBranches(bank_id);
        })
    }



    maritals() {
        return this.utilityService.getMaritals();
    }

    ddlBranch: any[] = [];
    first_branch_id: number = 0;
    loadBranch() {
        this.ddlBranch = [];
        this.controlPanelWebService.getBranchExtension<any[]>("7").then((data) => {
            this.ddlBranch = data;
            if (this.ddlBranch != null && this.ddlBranch.length > 0) {
                this.first_branch_id = this.ddlBranch[0].id;
                this.employeeEntryForm.get("professionalInfo").get("branchId").setValue(this.first_branch_id);
            }
        })
    }

    logger(msg: any, options: any) {
        this.utilityService.consoleLog(msg, options);
    }

    User() {
        return this.userService.User();
    }

    next(formGroupName: string = '', click: boolean = false) {
        let formGroup = this.employeeEntryForm.controls[formGroupName] as FormGroup;
        let isValid = this.logFormErrors(formGroup);
        if (isValid && click) {
            this.stepper.next();
        }
    }

    previous() {
        this.stepper.previous();
    }

    onSubmit() {
        this.findInvalidControls();
        if (this.employeeEntryForm.valid) {
            // EmployeeOfficeInfo
            let new_employeeCode = this.employeeEntryForm.get("professionalInfo").get("employeeCode").value;
            let new_firstName = this.employeeEntryForm.get("professionalInfo").get("firstName").value;
            let new_lastName = this.employeeEntryForm.get("professionalInfo").get("lastName").value;
            let new_branchId = this.employeeEntryForm.get("professionalInfo").get("branchId").value;
            let new_designationId = this.employeeEntryForm.get("professionalInfo").get("designationId").value;
            let new_departmentId = this.employeeEntryForm.get("professionalInfo").get("departmentId").value;
            let new_sectionId = 0;
            let new_subsectionId = 0;
            let new_dateOfJoining = this.datePipe.transform(this.employeeEntryForm.get("professionalInfo").get("dateOfJoining").value, 'yyyy-MM-dd');


            let new_workshiftId = this.employeeEntryForm.get("professionalInfo").get("workshiftId").value;
            let new_officeMobile = this.employeeEntryForm.get("professionalInfo").get("officeMobile").value;
            let new_officeEmail = this.employeeEntryForm.get("professionalInfo").get("officeEmail").value;
            let new_referenceNo = this.employeeEntryForm.get("professionalInfo").get("referenceNo").value;
            let new_fingureId = this.employeeEntryForm.get("professionalInfo").get("fingureId").value;
            let new_jobType = this.employeeEntryForm.get("professionalInfo").get("jobType").value;
            let new_taxZone = this.employeeEntryForm.get("professionalInfo").get("taxZone").value;
            let new_minimunTaxAmount = this.employeeEntryForm.get("professionalInfo").get("minimunTaxAmount").value;
            let employeeType = this.employeeEntryForm.get("professionalInfo").get("employeeTypeId").value;
            let jobCategory = this.employeeEntryForm.get("professionalInfo").get("jobCategoryId").value;
            let costCenter = this.employeeEntryForm.get("professionalInfo").get("costCenterId").value;
            let internalDesignationId = this.employeeEntryForm.get("professionalInfo").get("internalDesignationId").value;
            let supervisorId = this.employeeEntryForm.get("professionalInfo").get("supervisorId").value;
            let hodId = this.employeeEntryForm.get("professionalInfo").get("hodId").value;
            let isPFMember = this.employeeEntryForm.get("professionalInfo").get("isPFMember").value;

            let employeeOfficeInfo = {
                employeeId: 0,
                employeeCode: new_employeeCode,
                firstName: new_firstName,
                lastName: new_lastName,
                branchId: new_branchId,
                designationId: new_designationId,
                departmentId: new_departmentId,
                sectionId: new_sectionId,
                subsectionId: new_subsectionId,
                dateOfJoining: new_dateOfJoining,
                workshiftId: new_workshiftId,
                officeMobile: new_officeMobile,
                officeEmail: new_officeEmail,
                referenceNo: new_referenceNo,
                fingureId: new_fingureId,
                jobType: new_jobType,
                taxZone: 0,
                minimumTaxAmount: 0,
                employeeTypeId: employeeType,
                jobCategoryId: jobCategory,
                costCenterId: costCenter,
                internalDesignationId: internalDesignationId,
                supervisorId: supervisorId,
                hodId: hodId,
                isPFMember: isPFMember
            }

            //console.log("employeeOfficeInfo >>>", employeeOfficeInfo);

            let new_legalName = this.employeeEntryForm.get("personalInfo").get("legalName").value;
            let new_fatherName = this.employeeEntryForm.get("personalInfo").get("fatherName").value;
            let new_motherName = this.employeeEntryForm.get("personalInfo").get("motherName").value;
            let new_dateOfBirth = this.datePipe.transform(this.employeeEntryForm.get("personalInfo").get("dateOfBirth").value, "yyyy-MM-dd");


            let new_gender = this.employeeEntryForm.get("personalInfo").get("gender").value;
            let new_religion = this.employeeEntryForm.get("personalInfo").get("religion").value;
            let new_maritalStatus = this.employeeEntryForm.get("personalInfo").get("maritalStatus").value;
            let new_spouseName = this.employeeEntryForm.get("personalInfo").get("spouseName").value;
            let new_numberOfChild = this.employeeEntryForm.get("personalInfo").get("numberOfChild").value;
            let new_feet = this.employeeEntryForm.get("personalInfo").get("feet").value;
            let new_inch = this.employeeEntryForm.get("personalInfo").get("inch").value;
            let new_bloodGroup = this.employeeEntryForm.get("personalInfo").get("bloodGroup").value;
            let new_personalMobileNo = this.employeeEntryForm.get("personalInfo").get("personalMobileNo").value;
            let new_personalEmailAddress = this.employeeEntryForm.get("personalInfo").get("personalEmailAddress").value;
            let new_presentAddress = this.employeeEntryForm.get("personalInfo").get("presentAddress").value;
            let new_parmanentAddress = this.employeeEntryForm.get("personalInfo").get("parmanentAddress").value;
            let new_residentialStatus = this.employeeEntryForm.get("personalInfo").get("ResidentialStatus").value;
            let new_emergencyContactPersoneName = this.employeeEntryForm.get("emergancyContactInfo").get("emergencyContactPersoneName").value;
            let new_emergencyContactPersoneRelation = this.employeeEntryForm.get("emergancyContactInfo").get("emergencyContactPersoneRelation").value;
            let new_emergencyContactPersoneContactNo = this.employeeEntryForm.get("emergancyContactInfo").get("emergencyContactPersoneContactNo").value;
            let new_emergencyContactPersoneAddress = this.employeeEntryForm.get("emergancyContactInfo").get("emergencyContactPersoneAddress").value;
            let new_emergencyContactEmailAddress = this.employeeEntryForm.get("emergancyContactInfo").get("emergencyContactEmailAddress").value;

            let new_emergencyContactPersoneName2 = this.employeeEntryForm.get("emergancyContactInfo").get("emergencyContactPersoneName2").value;
            let new_emergencyContactPersoneRelation2 = this.employeeEntryForm.get("emergancyContactInfo").get("emergencyContactPersoneRelation2").value;
            let new_emergencyContactPersoneContactNo2 = this.employeeEntryForm.get("emergancyContactInfo").get("emergencyContactPersoneContactNo2").value;
            let new_emergencyContactPersoneAddress2 = this.employeeEntryForm.get("emergancyContactInfo").get("emergencyContactPersoneAddress2").value;
            let new_emergencyContactEmailAddress2 = this.employeeEntryForm.get("emergancyContactInfo").get("emergencyContactEmailAddress2").value;

            let employeePersonalInfo = {
                legalName:new_legalName,
                fatherName: new_fatherName,
                motherName: new_motherName,
                dateOfBirth: new_dateOfBirth,
                gender: new_gender,
                religion: new_religion,
                maritalStatus: new_maritalStatus,
                spouseName: new_spouseName,
                numberOfChild: new_numberOfChild.toString(),
                feet: new_feet,
                inch: new_inch,
                bloodGroup: new_bloodGroup,
                personalMobileNo: new_personalMobileNo,
                personalEmailAddress: new_personalEmailAddress,
                presentAddress: new_presentAddress,
                permanentAddress: new_parmanentAddress,
                isResidential: new_residentialStatus,
                emergencyContactPerson: new_emergencyContactPersoneName,
                relationWithEmergencyContactPerson: new_emergencyContactPersoneRelation,
                emergencyContactNo: new_emergencyContactPersoneContactNo,
                emergencyContactAddress: new_emergencyContactPersoneAddress,
                emergencyContactEmailAddress: new_emergencyContactEmailAddress,
                emergencyContactPerson2: new_emergencyContactPersoneName2,
                relationWithEmergencyContactPerson2: new_emergencyContactPersoneRelation2,
                emergencyContactNo2: new_emergencyContactPersoneContactNo2,
                emergencyContactAddress2: new_emergencyContactPersoneAddress2,
                emergencyContactEmailAddress2: new_emergencyContactEmailAddress2,
            };

            let new_paymentMode = this.employeeEntryForm.get("paymentInfo").get("paymentMode").value;
            let new_accountNo = this.employeeEntryForm.get("paymentInfo").get("accountNo").value;
            let new_bankId = this.employeeEntryForm.get("paymentInfo").get("bankId").value;
            let new_bankBranchId = this.employeeEntryForm.get("paymentInfo").get("bankBranchId").value;

            let agentName = new_paymentMode == "Bank" ? "" : "Mobile Banking"

            let employeePaymentInfo = {
                paymentMode: new_paymentMode, agentName: agentName, accountNo: new_accountNo, bankId: new_bankId, bankBranchId: new_bankBranchId
            }

            let employeeInit = { professionalInfo: employeeOfficeInfo, personalInfo: employeePersonalInfo, paymentInfo: employeePaymentInfo };

            console.log("employeeInit >>>", employeeInit);

            this.employeeInfoService.save(employeeInit).subscribe(response => {
                if (response?.status != null && response?.status) {
                    this.utilityService.success("Saved Successfull", "Server Response")
                }
                else {
                    if (response?.msg == 'Validation Error') {
                        let errorMsg = JSON.parse(response.errorMsg);
                        console.log("errorMsg >>>", errorMsg);
                        let messages = "";
                        if (errorMsg != null) {
                            let keys = Object.keys(errorMsg[0]);
                            keys.forEach(key => {
                                let keyValue = errorMsg[0][key] + "<br/>";
                                messages = messages + keyValue;
                            })
                            this.utilityService.fail(messages, "Server Response", 2000);
                        }
                    }
                    else {
                        this.utilityService.fail("Invalid form submission", "Server Response");
                    }
                }
            }, error => {
                this.utilityService.fail("One or More field value is invalid", "Site Response");
            })
        }
    }

    select2Options = this.utilityService.select2Config();

    ddlDepartment: any;
    loadDepartment() {
        this.departmentService.loadDepartmentDropdown();
        this.departmentService.ddl$.subscribe(data => {
            this.ddlDepartment = data;
        });
    }

    ddlDesignation: any;
    loadDesignation() {
        this.desingationService.loadDesignationDropdown();
        this.desingationService.ddl$.subscribe(data => {
            this.ddlDesignation = data;
        });
    }

    ddlWorkShift: any;
    first_shift_id: number = 0;
    loadWorkShift() {
        this.workShiftService.loadWorkShiftDropdown();
        this.workShiftService.ddl$.subscribe(data => {
            this.ddlWorkShift = data;
            //console.log("this.ddlWorkShift >>>", this.ddlWorkShift);
            if (this.ddlWorkShift != null && this.ddlWorkShift.length > 0) {
                this.first_shift_id = this.ddlWorkShift[0].id;
                this.employeeEntryForm.get("professionalInfo").get("workshiftId").setValue(this.first_shift_id);
            }
        });
    }

    ddlBanks: any;
    loadBanks() {
        this.bankService.loadBankDropdown();
        this.bankService.ddl$.subscribe(data => {
            console.log("bank data >>>", data);
            this.ddlBanks = data;
        })
    }

    ddlBankBranches: any[] = [];
    loadBankBranches(bankId: number) {
        this.bankBranchService.loadBankBranchDropdown({ bankId: bankId });
        this.bankBranchService.ddl$.subscribe(data => {
            this.ddlBankBranches = data;
            console.log("bank branch data >>>", data);
        })
    }

    ddlEmployeeType: any[] = [];
    loadEmployeeType() {
        this.employeeTypeService.loadDropdown();
        this.employeeTypeService.ddl$.subscribe(data => {
            this.ddlEmployeeType = data;
        })
    }

    ddlJobCategory: any[] = [];
    loadJobCategory() {
        this.jobCategoryService.loadDropdown();
        this.jobCategoryService.ddl$.subscribe(data => {
            this.ddlJobCategory = data;
        })
    }

    ddlCostCenter: any[] = [];
    loadCostCenter() {
        this.costCenterService.loadCostCenterDropdown();
        this.costCenterService.ddl$.subscribe(data => {
            this.ddlCostCenter = data;
        })
    }

    //#region designation modal
    showDesignationModal: boolean = false;
    openDesignationModal() {
        this.showDesignationModal = true;
    }

    closeDesignationModal(reason: string) {
        this.showDesignationModal = false;
        if (reason == 'Successfully Saved') {
            this.loadDesignation();
        }
    }
    //#endregion

    //#region department modal
    showDepartmentModal: boolean = false;
    openDepartmentModal() {
        this.showDepartmentModal = true;
    }

    closeDepartmentModal(reason: string) {
        this.showDepartmentModal = false;
        if (reason == 'Successfully Saved') {
            this.loadDepartment();
        }
    }
    //#endregion

}


