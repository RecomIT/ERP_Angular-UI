import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { CustomModalService } from "src/app/shared/services/custom-modal.service";
import { UserService } from "src/app/shared/services/user.service";
import { UtilityService } from "src/app/shared/services/utility.service";
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { ToastrService } from 'ngx-toastr';
import { EmployeePFActivationService } from "../employee-pf-activation.service";


@Component({
  selector: 'app-hr-approval-employee-pf-activation-modal',
  templateUrl: './approval-employee-pf-activation-modal.component.html'
})
export class ApprovalEmployeePfActivationModalComponent implements OnInit {

  @Input() pfActivationId: any = 0;
  @Input() approvalData: any = {};
  @Output() closeModalEvent = new EventEmitter<string>(); //pop-up modal cancel or add
  @ViewChild('approvalPFActivationModal', { static: true }) approvalPFActivationModal!: ElementRef;
  modalTitle: string = "Approval Employee PF Activation";
  datePickerConfig: Partial<BsDatepickerConfig> = this.utilityService.datePickerConfig();

  constructor(private fb: FormBuilder, // strongly type form build
    private userService: UserService, // user service user id
    public utilityService: UtilityService, // utility 
    public modalService: CustomModalService, // modal service
    private employeePFActivationService: EmployeePFActivationService,
    public toastr: ToastrService) { }

  pfActivationApprovalForm: FormGroup;
  ngOnInit(): void {
    console.log("approvalData >>>", this.approvalData);
    this.pfActivationFormInit();
    console.log("getpfActivationIdById", this.pfActivationId);
    if (this.pfActivationId > 0) {
      this.getPFActivationById(this.pfActivationId);
    }
  }

  User() {
    return this.userService.getUser();
  }

  defaultValue: string = 'Approved';

  pfActivationFormInit() {
    this.pfActivationApprovalForm = this.fb.group({
      pfActivationId: new FormControl(0, [Validators.required]),
      employeeId: new FormControl([{ value: 0, disabled: true }, Validators.required]),
      remarks: new FormControl(''),
      stateStatus: new FormControl('Approved', [Validators.required]),
    })
    // open modal
    this.modalService.open(this.approvalPFActivationModal, "lg");
  }

  getPFActivationById(pfActivationId: any) {
    this.employeePFActivationService.getById({ pfActivationId: pfActivationId }).subscribe(response => {
      console.log("response >>>", response);
      if (response.body != null && response.body.pfActivationId > 0) {
        this.setFormValue(response.body);
      }
    }, (error) => {
      this.utilityService.httpErrorHandler(error);
    })

  }

  setFormValue(response_data: any) {
    this.pfActivationFormInit();
    console.log("setFormValue >>>", response_data);
    this.pfActivationApprovalForm.get('pfActivationId').setValue(response_data.pfActivationId);
    this.pfActivationApprovalForm.get('employeeId').setValue(response_data.employeeId);
    this.pfActivationApprovalForm.get('stateStatus').setValue(response_data.stateStatus);
  }

  submitPFActivationApproval() {
    if (this.pfActivationApprovalForm.valid) {
      this.employeePFActivationService.approval(this.pfActivationApprovalForm.value).subscribe(response => {
        let data = response as any;
        if (data.status) {
          this.toastr.success("Saved Successfully", "Server Response", { timeOut: 800 })
          this.closeModal('Save Complete');
        }
        else {
          this.toastr.error(data.msg, "Server Response", { timeOut: 800 })

        }
      }, (error) => {
        this.utilityService.httpErrorHandler(error);
      })
    }
    else {
      this.utilityService.fail("Invalid form submission", "Site Response");
    }
  }

  closeModal(reason: string) {
    this.modalService.service.dismissAll(reason);
    this.closeModalEvent.emit(reason);
  }

}
