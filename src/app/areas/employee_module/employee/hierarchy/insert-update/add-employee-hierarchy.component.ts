import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { AreasHttpService } from "src/app/areas/areas.http.service";
import { ApiArea, ApiController } from "src/app/shared/constants";
import { CustomModalService } from "src/app/shared/services/custom-modal.service";
import { UtilityService } from "src/app/shared/services/utility.service";
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { EmployeeInfoService } from "../../employee-info.service";
import { UserService } from "src/app/shared/services/user.service";

@Component({
    selector: 'app-hr-add-employee-hierarchy',
    templateUrl: './add-employee-hierarchy.component.html'
})
export class AddEmployeeHierarchyComponent implements OnInit {

    @Input() id: any = 0;
    @Output() closeModalEvent = new EventEmitter<string>(); //pop up modal cancel or add
    datePickerConfig: Partial<BsDatepickerConfig> = this.utilityService.datePickerConfig();
    @ViewChild('employeeHierarchyModal', { static: true }) employeeHierarchyModal!: ElementRef;
    modalTitle: string = "Add  New Employee Hierarchy";


    constructor(private fb: FormBuilder, // strongly type form build
        private areasHttpService: AreasHttpService, // http request
        public utilityService: UtilityService, // utility 
        public modalService: CustomModalService, // modal service 
        private employeeInfoService: EmployeeInfoService,
        private userService: UserService
    ) { }

    employeeHierarchyForm: FormGroup; // class = null;
    ngOnInit(): void {

        console.log("modal clicked");
        console.log("id", this.id);

        this.loadHierarchy();
        this.loadEmployees();

        if (this.id > 0) {
            this.getEmployeeHierarchy(this.id);
        }
        else {
            this.employeeHierarchyFormInit();
        }

    }

    User() {
        return this.userService.User();
    }

    userCompanyId: number = 0;

    select2Options = {
        width: "100%",
        containerCssClass: "form-control form-control-sm text-x-small text-dark",
        theme: "bootstrap4",
    }
    objErrorMsg: any;

    employeeHierarchyFormInit() {
        this.employeeHierarchyForm = this.fb.group({
            id: new FormControl(0),
            employeeId: new FormControl('', [Validators.required, Validators.min(1)]),
            supervisorId: new FormControl(0, [Validators.required, Validators.min(1)]),
            lineManagerId: new FormControl(0),
            managerId: new FormControl(0),
            headOfDepartmentId: new FormControl(0, [Validators.required, Validators.min(1)]),
            hrAuthorityId: new FormControl(0),
            activationDate: new FormControl(new Date(), [Validators.required]),
            isActive: new FormControl(true)
        })

        this.userCompanyId = this.User().ComId;
        console.log("this.userCompanyId >>>", this.userCompanyId);

        this.employeeHierarchyForm.valueChanges.subscribe(value => {
            console.log("value >>>", value);
            console.log("this.employeeHierarchyForm.value >>>", this.employeeHierarchyForm.value);
            console.log("this.employeeHierarchyForm.valid >>>", this.employeeHierarchyForm.valid);
        })

        this.employeeHierarchyForm.get('supervisorId').valueChanges.subscribe(value => {
            if (this.utilityService.IntTryParse(value) > 0) {
                if (this.utilityService.IntTryParse(this.employeeHierarchyForm.get('headOfDepartmentId').value) == 0) {
                    this.employeeHierarchyForm.get('headOfDepartmentId').setValue(value);
                }
            }

        })

        // open modal
        this.modalService.open(this.employeeHierarchyModal, "lg");
    }

    closeModal(reason: string) {
        this.modalService.service.dismissAll(reason);
        this.closeModalEvent.emit(reason); // fire
    }


    submitEmployeeHierarchy() {
        console.log("this.employeeHierarchyForm.valid >>>", this.employeeHierarchyForm.valid);
        console.log("this.employeeHierarchyForm.value >>>", this.employeeHierarchyForm.value);

        if (this.employeeHierarchyForm.valid) {
            this.areasHttpService.observable_post<any>((ApiArea.hrms + "/Employee/Hierarchy" + "/SaveEmployeeHierarchy"),
                JSON.stringify(this.employeeHierarchyForm.value),
                {
                    'headers': {
                        'Content-Type': 'application/json'
                    },
                }).subscribe((response) => {
                    console.log(response)
                    if (response.status == true) {
                        this.utilityService.success("Saved Successfully", "Server Response", 1000)
                        this.closeModal("Save Complete");
                    }
                    else {
                        this.utilityService.fail("Someting went wrong", "Server Response", 1000)
                        if (response.msg == "Validation Error") {
                            this.objErrorMsg = JSON.parse(response.errorMsg);
                            //   console.log("Validation Error >>>", response.msg);
                        }
                    }
                })
        }
        else {
            this.utilityService.fail("Invaild form submission", "Site Response");
        }
    }

    getEmployeeHierarchy(Id: any) {
        this.areasHttpService.observable_get<any[]>((ApiArea.hrms + "/Employee/Hierarchy" + "/GetEmployeeHierarchy"), {
            responseType: "json", params: { id: Id }
        }).subscribe(response => {
            if (response != null && response[0]?.id > 0) {
                let item = response[0];
                this.setFormValue(item);
            }
        })

    }

    setFormValue(response_data: any) {
        this.employeeHierarchyFormInit();
        console.log("setFormValue >>>", response_data);
        this.modalTitle = "Update Employee Hierarchy";
        this.employeeHierarchyForm.get('id').setValue(response_data.id);
        this.employeeHierarchyForm.get('moduleName').setValue(response_data.moduleName);
        this.employeeHierarchyForm.get('emailStage').setValue(response_data.emailStage);
        this.employeeHierarchyForm.get('emailCC1').setValue(response_data.emailCC1);
        this.employeeHierarchyForm.get('emailCC2').setValue(response_data.emailCC2);
        this.employeeHierarchyForm.get('emailCC3').setValue(response_data.emailCC3);
        this.employeeHierarchyForm.get('emailBCC1').setValue(response_data.emailBCC1);
        this.employeeHierarchyForm.get('emailBCC2').setValue(response_data.emailBCC2);
        this.employeeHierarchyForm.get('emailTo').setValue(response_data.emailTo);
        this.employeeHierarchyForm.get('isActive').setValue(response_data.isActive);
    }

    ddlSearchByEmployee: any[] = [];
    ddlEmployees: any[] = [];

    loadEmployees() {
        this.employeeInfoService.loadDropdownData({});
        this.employeeInfoService.ddl_employee_data$.subscribe(data => {
            this.employeeInfoService.loadDropdown(data);
            this.ddlSearchByEmployee = this.employeeInfoService.ddl$;
        }, error => {
            console.error('Error while fetching data:', error);
        });
    }



    ddlHierarchy: any = [];
    loadHierarchy() {
        // this.ddlHierarchy = [];
        // this.getHierarchy<any[]>().then((data) => {
        //     // console.log("data >>>", data);
        //     data.forEach(v => {
        //         this.ddlHierarchy.push({ id: v.id, text: v.text })
        //     })
        // })
    }

    getHierarchy<T>(): Promise<T> {
        return this.areasHttpService.promise_get<T>((ApiArea.hrms + ApiController.employees + "/LoadHierarchy"), {
            responseType: "json",
        });
    }


    ddlEmailCCBC() {
        return ["Level 1", "Level 2", "Level 3", "Level 4", "Level 5"];
    }

}
