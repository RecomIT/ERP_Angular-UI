import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { ApiArea, ApiController } from 'src/app/shared/constants';
import { CustomModalService } from 'src/app/shared/services/custom-modal.service';
import { HrWebService } from 'src/app/shared/services/hr-web.service';
import { UserService } from 'src/app/shared/services/user.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AreasHttpService } from "src/app/areas/areas.http.service";
import { THIS_EXPR } from "@angular/compiler/src/output/output_ast";

@Component({
  selector: 'app-add-late-consider-request-model',
  templateUrl: './add-late-consider-request-model.component.html',
  
})
export class AddLateConsiderRequestModelComponent implements OnInit {

  
  @Input() assignmentId: any = 0;
  @Input() assignmentDetailId: any = 0;
  @Output() closeModalEvent = new EventEmitter<string>();
  @ViewChild('addApprovalHierarchyModal', { static: true }) addApprovalHierarchyModal!: ElementRef;
  datePickerConfig: Partial<BsDatepickerConfig> = {};
  modalTitle: string = "";
  constructor(private fb: FormBuilder, // strongly type form build
    private areasHttpService: AreasHttpService, // http request
    private userService: UserService, // user service user id
    public utilityService: UtilityService, // utility 
    public modalService: CustomModalService, // modal service 
    private hrWebService: HrWebService) {
  }


  ngOnInit(): void {
    this.addLateConsideraionFormInit();  
    this.loadEmployees();
    //this.loadApprovalHierarchyType();

    this.datePickerConfig = Object.assign({}, {
      containerClass: "theme-dark-blue",
      showWeekNumbers: false,
      dateInputFormat: "DD-MMMM-YYYY",
      isAnimated: true,
      showClearButton: false,
      showTodayButton: false,
      todayPosition: "left",
      rangeInputFormat: "DD-MMM-YYYY",
      rangeSeparator: " ~ ",
      size: "sm",
      customTodayClass: 'custom-today-class'
    })
    this.getSupervisorId();
    this.getLateReason();
    this.getLateTransactionDate();
  }

  closeModal(reason: string) {
    this.modalService.service.dismissAll(reason);
    this.closeModalEvent.emit(reason); // fire
  }

  User() {
    //return this.userService.getUser();
    const userData = this.userService.getUser();
    return userData;
    
  }

  select2Options = {
    width: "100%",
    containerCssClass: "form-control form-control-sm text-x-small font-bold",
    theme: "bootstrap4"
  }

  ddlEmployees: any[] = [];
  loadEmployees() {
    this.ddlEmployees = [];
    this.hrWebService.getEmployees<any[]>().then((data) => {
      this.ddlEmployees = data;
    })
  }



 ddlLateTransactionDate: any[] = [];

  getLateTransactionDate() {
    this.areasHttpService.observable_get<any>(ApiArea.hrms + ApiController.LateConsideration + "/GetLateTransactionDate", {
     
    }).subscribe((data) => {
      this.ddlLateTransactionDate = data;
      //console.log("com data", data);
    });
  }





  ddlLateReasons: any[] = [];

  getLateReason() {
    this.areasHttpService.observable_get<any>(ApiArea.hrms + ApiController.LateConsideration + "/GetLateReasons", {
     
    }).subscribe((data) => {
      this.ddlLateReasons = data;
      //console.log("com data", data);
      
    });
  }

  ddlSupervisor: any[] = [];

  getSupervisorId() {
    this.areasHttpService.observable_get<any>(ApiArea.hrms + ApiController.LateConsideration + "/GetSupervisor", {
     
    }).subscribe((data) => {
      this.ddlSupervisor = data;
      //console.log("com data", data);
    });
  }

  addLateConsideraionForm: FormGroup;
  formArray: any;
  addLateConsideraionFormInit() {
    this.addLateConsideraionForm = this.fb.group({
      employeeId: new FormControl(this.User().EmployeeId, [Validators.min(1)]),
      supervisorId: new FormControl(0, [Validators.min(1)]),

      detailArray: this.fb.array([
        this.fb.group({
          lateRequestsId: new FormControl(0),           
          reason:  new FormControl(''),    
          requestedForDate: new FormControl(''),
          otherReason: new FormControl(''),
          IsApproved: new FormControl(false),
          status: new FormControl(''),
        
        })
      ])    
    })  
    this.formArray = (<FormArray>this.addLateConsideraionForm.get('detailArray')).controls;
    this.modalService.open(this.addApprovalHierarchyModal, "xl");

  //   this.addLateConsideraionForm.get('supervisorId').valueChanges.subscribe((id)=>{
  //     this.addLateConsideraionForm.get('requestedForDate').setValue(0);
     
      
  // })
  this.addLateConsideraionForm.get('supervisorId').valueChanges.subscribe((id) => {
    const requestedForDateControl = this.addLateConsideraionForm.get('requestedForDate');
    if (requestedForDateControl) {
      requestedForDateControl.setValue(0);
    }
  });
  
  
  }

  btnAddApprovalHierarchy: boolean = false;
  submitApprovalHierarchy() {
   if (this.addLateConsideraionForm.valid) {
     this.btnAddApprovalHierarchy = true;
     var detailArray: any = [];
     this.formArray.forEach((formGroup: FormGroup) => {
       //console.log("form group value >>>", formGroup.value);
       const userData = this.User();
       detailArray.push({
        lateRequestsId: formGroup.get('lateRequestsId').value,        
        supervisorId : this.addLateConsideraionForm.get('supervisorId').value,   
        requestedForDate: formGroup.get('requestedForDate').value,
        otherReason: formGroup.get('otherReason').value,
        reason: formGroup.get('reason').value,      
        emloyeeId: userData.EmployeeId
       })
    console.log('frm',detailArray)
     })  
 
     this.areasHttpService.observable_post<any>((ApiArea.hrms + ApiController.LateConsideration + "/SaveLateRequest"), JSON.stringify(detailArray), {
       'headers': {
         'Content-Type': 'application/json'
       },
     }).subscribe((result) => {
       var data = result as any;
       this.btnAddApprovalHierarchy = false;
       if (data.status) {
         this.utilityService.success(data.msg, "Server Response");
         this.closeModal('Save Complete');
       }
       else {
         if (data.msg == "Validation Error") {
           this.utilityService.fail(data.errors?.duplicateAllowance, "Server Response", 5000);
         }
         else {
           this.utilityService.fail(data.msg, "Server Response")
         }
       }
     }, (error) => {
       console.log("error >>", error)
       this.utilityService.fail("Something went wrong", "Server Response")
       this.btnAddApprovalHierarchy = false;
     })
   }
 }


 addApprovalHierarchyButtonClick(index: number): void {
  (<FormArray>this.addLateConsideraionForm.get('detailArray')).push(this.addApprovalHierarchyGroup(index));     
}

    // var index = this.formArray.length; 
addApprovalHierarchyGroup(index: number) { 
  // let controlDate = ((<FormArray>this.addLateConsideraionForm.get('detailArray')).controls[index] as FormGroup).controls?.effectiveFrom.value;
  // controlDate = controlDate == null ? new Date() : controlDate;
  return this.fb.group({
    
    lateRequestsId: new FormControl(0),           
    reason:  new FormControl(''),    
    requestedForDate: new FormControl(''),
    otherReason: new FormControl(''),
    IsApproved: new FormControl(false),
    status: new FormControl(''),
  })
}

removeApprovalHierarchyButtonClick(index: number) {
  if ((<FormArray>this.addLateConsideraionForm.get('detailArray')).length > 1) {
    (<FormArray>this.addLateConsideraionForm.get('detailArray')).removeAt(index);
  }
  else {
    this.utilityService.fail("You can't delete last item", "Site Response");
  }
}


showOtherReasonInput = false;

onReasonChange() {
  const selectedReason = this.addLateConsideraionForm.get('reason').value;

  // Check if the selected reason is 'other' and set showOtherReasonInput accordingly
  this.showOtherReasonInput = selectedReason === 'other';
  console.log('select',selectedReason)
}

}
