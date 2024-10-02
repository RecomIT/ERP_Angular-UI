import { Component, Input, OnInit } from "@angular/core";
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { BsDatepickerConfig } from "ngx-bootstrap/datepicker";
import { ToastrService } from "ngx-toastr";
import { ControlPanelWebService } from "src/app/shared/services/control-panel.service";
import { CustomModalService } from "src/app/shared/services/custom-modal.service";
import { UserService } from "src/app/shared/services/user.service";
import { UtilityService } from "src/app/shared/services/utility.service";
import { AreasHttpService } from "../../../../areas.http.service";
import { DepartmentService } from "../../../Organizational/department/department.service";
import { DesignationService } from "../../../Organizational/designation/designation.service";
import { WorkShiftService } from "src/app/areas/attendance_module/Workshift/work-shit.service";
import { BankService } from "../../../Account/bank/bank.service";
import { BankBranchService } from "../../../Account/bank-branch/bank-branch.service";
import { EmployeeInfoService } from "../../employee-info.service";
import { EmployeeTypeService } from "../../../Organizational/employee-type/employee-type.service";
import { JobCategoryService } from "../../../Organizational/job-category/job-category.service";
import { CostCenterService } from "../../../Organizational/costcenter/costcenter.service";
import { officeEmailInEditValidator } from "../../../validators/office-email.validator";
import { employeeCodeInEditValidator } from "../../../validators/employee-code-validator";

@Component({
    selector: 'app-employee-module-employee-professional-list',
    templateUrl: './employee-professional-list.component.html'

})

export class EmployeeProfessionalListComponent implements OnInit {

    @Input() inputEmployeeId: any = 0;
    employeeId: number = 0;

    datePickerConfig: Partial<BsDatepickerConfig> = {};

    constructor(private fb: FormBuilder,
        private areasHttpService: AreasHttpService,
        public toastr: ToastrService,
        private userService: UserService,
        public utilityService: UtilityService,
        public modalService: CustomModalService,
        private controlPanelWebService: ControlPanelWebService,
        private departmentService: DepartmentService,
        private desingationService: DesignationService,
        private workShiftService: WorkShiftService,
        private bankService: BankService,
        private bankBranchService: BankBranchService,
        private employeeTypeService: EmployeeTypeService,
        private employeeInfoService: EmployeeInfoService,
        private jobCategoryService: JobCategoryService,
        private costCenterService: CostCenterService
    ) {
    }

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
        this.loadEmployeeDropdown();
        this.professionalFormInit();
        this.loadBranch();
        this.loadDepartment();
        this.loadDesignation();
        this.loadWorkShift();
        this.loadBanks();
        this.loadEmployeeType();
        this.loadCostCenter();
        this.loadJobCategory();
        this.getEmployeeOfficeInfoById();
    }

    ddlJobtypes: any[] = this.utilityService.getJobTypes();
    ddlGender: any[] = this.utilityService.getGenders();
    ddlReligions: any[] = this.utilityService.getReligions();

    User() {
        return this.userService.User();
    }

    logger(msg: any, ...options: any[]) {
        this.utilityService.consoleLog(msg, options);
    }

    ddlBranch: any[] = [];
    loadBranch() {
        this.ddlBranch = [];
        this.controlPanelWebService.getBranchExtension<any[]>("7").then((data) => {
            this.ddlBranch = data;
        })
    }



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
    loadWorkShift() {
        this.workShiftService.loadWorkShiftDropdown();
        this.workShiftService.ddl$.subscribe(data => {
            this.ddlWorkShift = data;
        });
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

    select2Options = this.utilityService.select2Config();

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

    ddlProbotionMonth = [1, 2, 3, 4, 5, 6];

    formErrors = {
        employeeCode: '',
        firstName: '',
        lastName: '',
        branchId: '',
        designationId: '',
        departmentId:'',
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
            'maxlength': 'Max length is 30',
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
        
        'religion': {
            'required': 'Religion is required',
        },
        'parmanentAddress': {
            'required': 'Parmanent address is required',
        }
    }

    logFormErrors(formGroup: FormGroup = this.professionalForm): boolean {
        let isValid = true;
        Object.keys(formGroup.controls).forEach((key: string) => {
            const abstractControl = formGroup.get(key);
            this.formErrors[key] = '';
            //&& (abstractControl.touched || abstractControl.dirty)
            if (abstractControl && !abstractControl.valid) {
                const messages = this.validationMessages[key];
                for (const errorKey in abstractControl.errors) {
                    console.log("key >>>", key);
                    // console.log("errorKey >>>", errorKey);
                    console.log("errorKey >>>", errorKey);
                    this.formErrors[key] += messages[errorKey];
                    isValid = false;
                }
            }
        })
        return isValid;
    }


    professionalForm: FormGroup;
    professionalFormInit() {
        this.professionalForm = this.fb.group({
            employeeId: [this.employeeId, Validators.min(1)],
            employeeCode: ['', [Validators.required, Validators.maxLength(50)], [employeeCodeInEditValidator(this.employeeId, this.employeeInfoService)]],
            firstName: ['', [Validators.required,Validators.min(3), Validators.maxLength(100)]],
            lastName: ['', [Validators.maxLength(100)]], //Validators.required, 
            branchId: [0, [Validators.min(1)]],
            designationId: [0, [Validators.min(1)]],
            departmentId: [0,[Validators.min(1)]],
            dateOfJoining: [null, [Validators.required]],
            workshiftId: [0, [Validators.min(1)]],
            officeMobile: [''],
            officeEmail: ['', [Validators.required, Validators.email], [officeEmailInEditValidator(this.employeeId, this.employeeInfoService)]],
            referenceNo: [''],
            fingerId: [''],
            jobType: ['', Validators.required],
            jobCategoryId: [0],
            costCenterId: [0],
            stateStatus: [''],
            employeeTypeId: [0],
            supervisorId: [0],
            hodId: [0],
            probationMonth: [1],
            isPFMember: [false]
        })

        this.professionalForm.valueChanges.subscribe(value => {
            this.logFormErrors(this.professionalForm);
        })

        this.professionalForm.get('jobType').valueChanges.subscribe(value => {
            if (value != "Probation") {
                this.professionalForm.get('probationMonth').setValue(0)
            }
            else if (value = "Probation") {
                if ((this.employeeOfficeInfo.probationMonth ?? 0) > 0) {
                    this.professionalForm.get('probationMonth').setValue((this.employeeOfficeInfo.probationMonth ?? 0))
                }
                else {
                    this.professionalForm.get('probationMonth').setValue(6)
                }
            }
            else {
                this.professionalForm.get('probationMonth').setValue(0)
            }
        })
    }

    employeeOfficeInfo: any;

    getEmployeeOfficeInfoById() {
        this.employeeInfoService.getOfficeInfo({ employeeId: this.employeeId }).subscribe(response => {
            this.employeeOfficeInfo = response?.body;
            this.setEmployeeProfessionalValues();
            //console.log("this.employeeOfficeInfo >>>", this.employeeOfficeInfo);
        }, (error) => {
            console.log("error>>", error);
            this.utilityService.fail("Something went wrong", "Server Response");
        })
    }

    submitForm() {
        if (this.professionalForm.valid) {
            this.employeeInfoService.saveProfessionalInfo(this.professionalForm.value).subscribe(response => {
                console.log("response >>>", response);
                if (response?.status) {
                    this.utilityService.success(response.msg, 'Server Response');
                }
                else {

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

    setEmployeeProfessionalValues() {
        this.professionalForm.get('employeeCode').setValue(this.employeeOfficeInfo.employeeCode);
        this.professionalForm.get('firstName').setValue(this.employeeOfficeInfo.firstName);
        this.professionalForm.get('lastName').setValue(this.employeeOfficeInfo.lastName);
        this.professionalForm.get('branchId').setValue(this.employeeOfficeInfo.branchId);
        this.professionalForm.get('designationId').setValue(this.employeeOfficeInfo.designationId);
        this.professionalForm.get('departmentId').setValue(this.employeeOfficeInfo.departmentId);
        this.professionalForm.get('dateOfJoining').setValue(new Date(this.employeeOfficeInfo.dateOfJoining));
        this.professionalForm.get('workshiftId').setValue(this.employeeOfficeInfo.workshiftId);
        this.professionalForm.get('officeMobile').setValue(this.employeeOfficeInfo.officeMobile);
        this.professionalForm.get('officeEmail').setValue(this.employeeOfficeInfo.officeEmail);
        this.professionalForm.get('referenceNo').setValue(this.employeeOfficeInfo.referenceNo);
        this.professionalForm.get('fingerId').setValue(this.employeeOfficeInfo.fingerId);
        this.professionalForm.get('jobType').setValue(this.employeeOfficeInfo.jobType);
        this.professionalForm.get('employeeTypeId').setValue(this.employeeOfficeInfo.employeeTypeId ?? 0);
        this.professionalForm.get('costCenterId').setValue(this.employeeOfficeInfo.costCenterId ?? 0);
        this.professionalForm.get('jobCategoryId').setValue(this.employeeOfficeInfo.jobCategoryId ?? 0);
        this.professionalForm.get('supervisorId').setValue(this.employeeOfficeInfo.supervisorId);
        this.professionalForm.get('hodId').setValue(this.employeeOfficeInfo.hodId);
        this.professionalForm.get('probationMonth').setValue(this.employeeOfficeInfo.probationMonth);
        this.professionalForm.get('isPFMember').setValue(this.employeeOfficeInfo.isPFMember);
        this.findInvalidControls();
    }

    findInvalidControls() {
        let controls = this.professionalForm.controls;
        for (let formControl in controls) {
            if (this.professionalForm.get(formControl).invalid) {
                console.log("invalid  control name>>>", formControl);
            }
        }
    }
}