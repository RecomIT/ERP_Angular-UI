import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { AreasHttpService } from "src/app/areas/areas.http.service";
import { ApiArea, ApiController } from "src/app/shared/constants";
import { CustomModalService } from "src/app/shared/services/custom-modal.service";
import { UserService } from "src/app/shared/services/user.service";
import { UtilityService } from "src/app/shared/services/utility.service";

@Component({
    selector:'app-hr-employment-probationary-approval-modal',
    templateUrl:'./employment-probationary-approval-modal.component.html'
})
export class EmploymentProbationaryApprovalModalComponent implements OnInit{
    
    @Input() id: number =0;
    @Input() employeeId: number =0;
    @Input() data: any;
    @Output() closeModalEvent = new EventEmitter<string>(); 

    @ViewChild('employmentProbationaryApprovaModal', { static: true }) employmentProbationaryApprovaModal !: ElementRef;

    modalTitle: any="Employment Probationary Approval";

    constructor(private fb: FormBuilder, private areasHttpService: AreasHttpService,
        public toastr: ToastrService,
        private userService: UserService,
        public utilityService: UtilityService,
        public modalService: CustomModalService){
    }

    ngOnInit(): void {
        console.log("data >>>", this.data);
        this.employeeApprovalFormInit();
    }

    employeeApprovalForm : FormGroup;

    employeeApprovalFormInit(){
        this.employeeApprovalForm = this.fb.group({
            probationaryExtensionId: new FormControl(this.id,Validators.min(1)),
            employeeId: new FormControl(this.employeeId,Validators.min(1)),
            remarks: new FormControl(),
            stateStatus: new FormControl()
        })
        this.modalService.open(this.employmentProbationaryApprovaModal,"lg");
    }

    submit(){
        if (this.employeeApprovalForm.valid) {
            this.areasHttpService.observable_post<any>((ApiArea.hrms + ApiController.employees + '/SaveEmploymentProbationaryExtensionStatus'),
                JSON.stringify(this.employeeApprovalForm.value), {
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

    closeModal(reason: any){
        this.modalService.service.dismissAll(reason);
        this.closeModalEvent.emit(reason);
    }

}