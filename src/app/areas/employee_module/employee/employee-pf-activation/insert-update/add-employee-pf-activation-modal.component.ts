import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { ApiArea, ApiController } from "src/app/shared/constants";
import { UserService } from "src/app/shared/services/user.service";
import { AreasHttpService } from "src/app/areas/areas.http.service";
import { UtilityService } from "src/app/shared/services/utility.service";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { CustomModalService } from "src/app/shared/services/custom-modal.service";
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { EmployeePFActivationService } from '../employee-pf-activation.service';

@Component({
  selector: 'app-hr-add-employee-pf-activation-modal',
  templateUrl: './add-employee-pf-activation-modal.component.html'
})
export class AddEmployeePfActivationModalComponent implements OnInit {
  @Input() pfActivationId: any = 0;
  @Output() closeModalEvent = new EventEmitter<string>();
  @ViewChild('pfActivationModal', { static: true }) pfActivationModal!: ElementRef;
  modalTitle: string = "Add New Employee PF Activation";
  datePickerConfig: Partial<BsDatepickerConfig> = this.utilityService.datePickerConfig();

  constructor(private fb: FormBuilder, // strongly type form build
    private userService: UserService, // user service user id
    public utilityService: UtilityService, // utility 
    public modalService: CustomModalService, // modal service
    private employeePFActivationService : EmployeePFActivationService
  ) { }

  pfActivationForm: FormGroup;
  ngOnInit(): void {
    this.pfActivationFormInit();
    console.log("getpfActivationIdById", this.pfActivationId);
    this.loadEmployees();
    if (this.pfActivationId > 0) {
      this.getPFActivationById();
    }
  }

  User() {
    return this.userService.getUser();
  }
  select2Options = this.utilityService.select2Config()

  basedAmount: any[] = ["Basic", "Gross"];

  ddlSearchByEmployee: any[] = [];
  ddlEmployees: any[] = [];
  loadEmployees() {
    this.employeePFActivationService.loadConfirmedEmployeeDrodown({}).then(data=>{
      this.ddlEmployees = data;
    })
  }


  pfActivationFormInit() {
    this.pfActivationForm = this.fb.group({
      pfActivationId: new FormControl(0),
      employeeId: new FormControl(0, [Validators.required],),
      pfBasedAmount: new FormControl('', [Validators.required]),
      pfPercentage: new FormControl(0, [Validators.min(1)]),
      pfEffectiveDate: new FormControl(null),
      pfActivationDate: new FormControl(null),
      remarks: new FormControl(''),

    })
    // open modal
    this.modalService.open(this.pfActivationModal, "lg");
  }

  getPFActivationById() {
    this.employeePFActivationService.getById({ pfActivationId: this.pfActivationId }).subscribe(response=>{
      this.setFormValue(response.body);
    },(error)=>{
      this.utilityService.httpErrorHandler(error);
    })
  }

  setFormValue(response_data: any) {
    console.log("setFormValue >>>", response_data);
    this.modalTitle = "Update Employee PF Activation";
    this.pfActivationForm.get('pfActivationId').setValue(response_data.pfActivationId);
    this.pfActivationForm.get('employeeId').setValue(response_data.employeeId);
    this.pfActivationForm.get('pfBasedAmount').setValue(response_data.pfBasedAmount);
    this.pfActivationForm.get('pfPercentage').setValue(response_data.pfPercentage);
    this.pfActivationForm.get('pfEffectiveDate').setValue(new Date(response_data.pfEffectiveDate));
    this.pfActivationForm.get('pfActivationDate').setValue(new Date(response_data.pfActivationDate));
    this.pfActivationForm.get('remarks').setValue(response_data.remarks);
  }

  submitPFActivation() {
    if (this.pfActivationForm.valid) {
      console.clear();
      console.log("this.pfActivationForm.value >>>", this.pfActivationForm.value);
      this.employeePFActivationService.save(this.pfActivationForm.value).subscribe(response=>{
        if (response.status == true) {
          this.utilityService.success("Saved Successfully", "Server Response", 1000)
          this.closeModal("Save Complete");
        }
        else {
          this.utilityService.fail("Someting went wrong", "Server Response", 1000)
          if (response.msg == "Validation Error") {
            console.log("Validation Error >>>", response.msg);
          }
        }
      },(error)=>{
        this.utilityService.httpErrorHandler(error);
      })

    }
    else {
      this.utilityService.fail("Invaild form", "Site Response");
    }
  }

  closeModal(reason: string) {
    this.modalService.service.dismissAll(reason);
    this.closeModalEvent.emit(reason); // fire
  }


}
