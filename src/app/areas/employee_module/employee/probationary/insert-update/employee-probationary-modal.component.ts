import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { BsDatepickerConfig } from "ngx-bootstrap/datepicker";
import { ToastrService } from "ngx-toastr";
import { AreasHttpService } from "src/app/areas/areas.http.service";
import { ApiArea, ApiController } from "src/app/shared/constants";
import { ControlPanelWebService } from "src/app/shared/services/control-panel.service";
import { CustomModalService } from "src/app/shared/services/custom-modal.service";
import { HrWebService } from "src/app/shared/services/hr-web.service";
import { UserService } from "src/app/shared/services/user.service";
import { UtilityService } from "src/app/shared/services/utility.service";

@Component({
    selector: 'app-hr-employee-probationary-modal',
    templateUrl: './employee-probationary-modal.component.html'
})

export class EmployeeProbationaryModalComponent implements OnInit {

    @Input() id: number = 0;
    @Output() closeModalEvent = new EventEmitter<string>();

    @ViewChild('employeeProbationaryModal', { static: true }) employeeProbationaryModal !: ElementRef;
    modalTitle: string = "";
    datePickerConfig: Partial<BsDatepickerConfig> = {};


    constructor(private router: Router, private fb: FormBuilder, private areasHttpService: AreasHttpService,
        public toastr: ToastrService,
        private userService: UserService,
        public utilityService: UtilityService,
        public modalService: CustomModalService,
        private hrWebService: HrWebService) {
    }

    User() {
        return this.userService.getUser();
    }

    ngOnInit(): void {
        this.datePickerConfig = Object.assign({}, {
            containerClass: "theme-dark-blue",
            showWeekNumbers: false,
            dateInputFormat: "DD-MMM-YYYY",
            isAnimated: true,
            showClearButton: false,
            showTodayButton: false,
            todayPosition: "left",
            rangeInputFormat: "DD-MMM-YYYY",
            rangeSeparator: " ~ "
        });
        this.serviceLength='';
        this.loadEmployees();
        this.probationaryFormInit();
        if (this.id > 0) {
            this.getProbationaryProposalById();
        }
    }

    select2Options = {
        width: "100%",
        containerCssClass: "form-control form-control-sm text-x-small",
        theme: "bootstrap4",
    }

    ddlEmployees: any[] = [];
    loadEmployees() {
        this.ddlEmployees = [];
        this.hrWebService.getProbationaryEmployees<any[]>().then((data) => {
            this.ddlEmployees = data;
            console.log("getProbationaryEmployees >>", data);
        })
    }

    probationaryForm: FormGroup;

    serviceLength: string = null;
    probationaryFormInit() {
        this.probationaryForm = this.fb.group({
            probationaryExtensionId: new FormControl(this.id),
            employeeId: new FormControl(null, [Validators.required]),
            probationaryDate: new FormControl(null, [Validators.required]),
            totalRatingScore: new FormControl(''),
            effectiveDate: new FormControl(null, [Validators.required]),
            appraiserComment: new FormControl('')
        })

        this.modalTitle = this.id > 0 ? 'Update Probationary Proposal' : 'Add Probationary Proposal';
        this.modalService.open(this.employeeProbationaryModal, "lg");

        this.probationaryForm.get('employeeId').valueChanges.subscribe(value => {
            if (value != null && value != 'null' && value != '') {
                this.serviceLength = this.ddlEmployees.find(item => item.id == value).duration;
                console.log("this.serviceLength >>>",this.serviceLength);
            }
            else{
                this.serviceLength = '';
            }
        })
    }

    submit() {
        if (this.probationaryForm.valid) {

            this.probationaryForm.get('employeeId').setValue(this.id > 0 ? this.employeeId_in_update : this.probationaryForm.get('employeeId').value);

            let formData = {
                probationaryExtensionId :this.probationaryForm.get('probationaryExtensionId').value,
                employeeId : this.probationaryForm.get('employeeId').value,
                extensionFrom : this.probationaryForm.get('probationaryDate').value[0],
                extensionTo : this.probationaryForm.get('probationaryDate').value[1],
                effectiveDate : this.probationaryForm.get('effectiveDate').value,
                totalRatingScore: null,
                appraiserComment : this.probationaryForm.get('appraiserComment').value
            }
            
            this.areasHttpService.observable_post<any>((ApiArea.hrms + ApiController.employees + '/SaveProbationaryExtension'),
                JSON.stringify(formData), {
                'headers': {
                    'Content-Type': 'application/json'
                },
            }).subscribe((response) => {
                if (response.status == true) {
                    this.utilityService.success("Saved Successfull", "Server Response", 1000)
                    this.closeModal("Save Complete");
                }
                else {
                    this.utilityService.fail("Someting went wrong", "Server Response", 1000)
                    if (response.msg == "Validation Error") {
                        console.log("Validation Error >>>", response.msg);
                    }
                }
            }, (error) => {
                console.log("Server Error >>>", error);
                this.utilityService.fail("Someting went wrong", "Server Response", 1000)
            })
        }
        else {
            this.utilityService.fail("Invalid Form", "Site Response");
        }
    }

    getProbationaryProposalById() {
        this.areasHttpService.observable_get<any>((ApiArea.hrms + ApiController.employees + "/GetEmploymentProbationaryExtensionById"), {
            responseType: "json", observe: 'response', params: { id: this.id }
        }).subscribe((response) => {
            //console.log("response >>>",response);
            //return;
            this.setFormValue(response.body);
        },
            (error) => {
                this.utilityService.fail("Something went wrong", "Server Response")
            })
    }

    employeeId_in_update: any = 0;
    setFormValue(data: any) {
        if (data != null) {
            this.probationaryForm.get('employeeId').setValue(data.employeeId);
            this.employeeId_in_update = data.employeeId;
            let extension_from_to = [];
            extension_from_to.push(new Date(data.extensionFrom));
            extension_from_to.push(new Date(data.extensionTo));
            this.probationaryForm.get('probationaryDate').setValue(extension_from_to);
            this.probationaryForm.get('totalRatingScore').setValue(data.totalRatingScore);
            this.probationaryForm.get('effectiveDate').setValue(new Date(data.effectiveDate));
            this.probationaryForm.get('appraiserComment').setValue(data.appraiserComment);
        }
    }

    closeModal(reason: any) {
        this.modalService.service.dismissAll(reason);
        this.closeModalEvent.emit(reason);
    }

}