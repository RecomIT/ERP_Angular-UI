import { Component, ElementRef, EventEmitter, Input, OnInit, Output, QueryList, ViewChild, ViewChildren } from "@angular/core";
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, RequiredValidator, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { ApiArea, ApiController } from 'src/app/shared/constants';
import { CustomModalService } from 'src/app/shared/services/custom-modal.service';
import { HrWebService } from 'src/app/shared/services/hr-web.service';
import { UserService } from 'src/app/shared/services/user.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AreasHttpService } from "src/app/areas/areas.http.service";
import { ToastrService } from 'ngx-toastr';
import { finalize } from "rxjs/operators";
import { REFERENCE_PREFIX } from "@angular/compiler/src/render3/view/util";

@Component({
  selector: 'app-check-early-depature-model',
  templateUrl: './check-early-depature-model.component.html',
 
})
export class CheckEarlyDepatureModelComponent implements OnInit {
  @Input() setModalType: any;
  @Input() earlyDepartureId: any = 0;
  @Input() checkEarlyDepartureModalFlagg: any = "";
  @Input() approvalData: any = {};
  @Output() closeModalEvent = new EventEmitter<string>();
  @ViewChild('showEarlyDepartureDetailModal', { static: true }) showEarlyDepartureDetailModal!: ElementRef;

  item: any; // Define 'item' here with its appropriate type
  
  modalTitle: string = ""; 
  showRejectButton: boolean = false;
  approvalHierarchyPageConfig: { id: any; itemsPerPage: number; currentPage: number; totalItems: number; };
  pageNumber: any;
  pageSize: any;
  formArray: any;
  formArraycheckbox: any;
  fullName: string;
  employeeCode: any;

  constructor(private fb: FormBuilder, // strongly type form build
    private areasHttpService: AreasHttpService, // http request
    private userService: UserService, // user service user id
    public utilityService: UtilityService, // utility 
    public modalService: CustomModalService, // modal service 
    private hrWebService: HrWebService,
    private toastr: ToastrService,
    ) {
      
      
  }
  
  
  response: any[] = [];

  ngOnInit(): void {    
    this.ViewAndCheckEarlyDepartureFormInit();
    this.modalTitle = (this.checkEarlyDepartureModalFlagg == "View" ? "Early Departure View" : "Hierarchy Group Assignment Approval"); 
    
    if (this.earlyDepartureId > 0) {
      this.getLateConsiderationDetail(this.earlyDepartureId);
    }

   
    
  }


  searchByStatus: any = '';

  ViewAndCheckEarlyDepartureForm: FormGroup;
 

  btnAddApprovalHierarchy: boolean = false;
 

  handleCheckboxChange(detailFormGroup: FormGroup, action: string) {
    const status = detailFormGroup.get('status').value;
  
    if (status === 'Pending') {
      // Update the selected checkboxes based on the action (approve, reject, recheck)
      if (action === 'approved') {
        detailFormGroup.get('approved').setValue(true);
        detailFormGroup.get('reject').setValue(false);
        detailFormGroup.get('recheck').setValue(false);
      } else if (action === 'reject') {
        detailFormGroup.get('approved').setValue(false);
        detailFormGroup.get('reject').setValue(true);
        detailFormGroup.get('recheck').setValue(false);
      } else if (action === 'recheck') {
        detailFormGroup.get('approved').setValue(false);
        detailFormGroup.get('reject').setValue(false);
        detailFormGroup.get('recheck').setValue(true);
      }
    } else {
      // If status is not 'Approved', do not allow changes to checkboxes
      detailFormGroup.get('approved').setValue(false);
      detailFormGroup.get('reject').setValue(false);
      detailFormGroup.get('recheck').setValue(false);
    }
  }
  

lateRequestsDetails: any[] = [];

  btnApproval: boolean = false;
  

  closeModal(reason: string) {
    this.modalService.service.dismissAll(reason);
    this.closeModalEvent.emit(reason);
  }







ViewAndCheckEarlyDepartureFormInit() {
  
  this.ViewAndCheckEarlyDepartureForm = this.fb.group({
    
    earlyDepartureId: new FormControl(0),
   
  
    edit: this.fb.array([
      this.fb.group({
        earlyDepartureId: new FormControl(0),           
        reason:  new FormControl(''),    
        requestedForDate: new FormControl(''),
        otherReason: new FormControl(''),
        IsApproved: new FormControl(false),
        status: new FormControl(''),
        comment: new FormControl(''),      
       
        approvalRemarks: new FormControl(''),               
        approved:  new FormControl(false),
        reject: new FormControl(false),
        recheck: new FormControl(false),
        fullName: new FormControl(''),
        employeeCode: new FormControl(''),
        officeEmail: new FormControl(''),
        supervisorEmail: new FormControl(''),
        appliedDate: new FormControl(null),
        appliedTime: new FormControl(null)
       
      })
    ]),
  
   
  });
  this.formArray = (<FormArray>this.ViewAndCheckEarlyDepartureForm.get('edit')).controls;
 // this.formArraycheckbox = (<FormArray>this.ViewAndCheckEarlyDepartureForm.get('checkbox')).controls; 
 this.modalService.open(this.showEarlyDepartureDetailModal, "xl"); 
}









getLateConsiderationDetail(earlyDepartureId: any) {
  this.areasHttpService.observable_get<any>(ApiArea.hrms + ApiController.LateConsideration + "/GetEarlyDepartureById", {
    responseType: "json",
    params: { earlyDepartureId: earlyDepartureId }
  }).subscribe((response: any) => {
    if (response != null && response.length > 0) {
      // Clear any previous form values before patching new ones
      this.ViewAndCheckEarlyDepartureForm.reset();

      this.lateRequestsDetails = response; // Assign response to lateRequestsDetails
      this.fullName = response[0].fullName;
      this.employeeCode = response[0].employeeCode;
      console.log('name', this.fullName)
      console.log('code', this.employeeCode)

      // Clear any previous form values before patching new ones
      const editArray = this.ViewAndCheckEarlyDepartureForm.get('edit') as FormArray;
      editArray.clear();

      response.forEach((detail, index) => {
        // Create a new FormGroup for each detail
        const detailFormGroup = this.fb.group({
          earlyDepartureId: new FormControl(detail.earlyDepartureId),          
          reason: new FormControl(detail.reason),
          requestedForDate: new FormControl(detail.requestedForDate),
          otherReason: new FormControl(detail.otherReason),      
          status: new FormControl(detail.status),
          appliedTime: new FormControl(detail.appliedTime),
          comment: new FormControl(detail.comment),         
          action: new FormControl(detail.approvalRemarks),
          approved:  new FormControl(detail.approved),
          reject: new FormControl(detail.reject),
          recheck: new FormControl(detail.recheck),
         fullName: new FormControl(detail.fullName),
         employeeCode: new FormControl(detail.employeeCode),
         officeEmail: new FormControl(detail.officeEmail),
         supervisorEmail: new FormControl(detail.supervisorEmail),
         appliedDate: new FormControl(detail.appliedDate)
        

         
        });

        // Push the new FormGroup into the 'edit' array
        editArray.push(detailFormGroup);
      });

      // Open the modal (if required)
      this.modalService.open(this.showEarlyDepartureDetailModal, "xl");

      // Log the form values
      console.log('Form values after initialization:', this.ViewAndCheckEarlyDepartureForm.value);
    }
    console.log("this.lateRequestsDetails >>>", this.lateRequestsDetails);
  });
}


 dataToSubmit = [];

onSubmit() {
  if (this.ViewAndCheckEarlyDepartureForm.valid ) {
    this.btnApproval = true;
    const formValues = this.ViewAndCheckEarlyDepartureForm.value;
    

    formValues.edit.forEach((detail, index) => {
      const flag = {
        approved: detail.approved ? 'Approved' : null,
        reject: detail.reject ? 'Reject' : null,
        recheck: detail.recheck ? 'Recheck' : null,
      };

      const detailData = {
        earlyDepartureId: detail.earlyDepartureId,      
        comment: detail.comment,
        fullName: detail.fullName,
        employeeCode: detail.employeeCode,
        requestedForDate: detail.requestedForDate,      
        officeEmail: detail.officeEmail,
        supervisorEmail: detail.supervisorEmail,
        appliedDate: detail.appliedDate,
        flag: [flag.approved, flag.reject, flag.recheck].filter(Boolean).join(', '), // Merge and remove nulls
      };

      this.dataToSubmit.push(detailData);
    });

    // Send dataToSubmit to the server for each item in the array
    this.dataToSubmit.forEach((data) => {
      this.processItem(data);
    });
    
    console.log('data', this.dataToSubmit);






    //this.sendEmail();
   
  }
}
processItem(data: any) {
  const requestData = {
    flag: data.flag,
    comment: data.comment,
    earlyDepartureId: data.earlyDepartureId,
  };

  console.log('Processing item:', data);

  if (data.earlyDepartureId > 0) {
    this.areasHttpService.observable_post<any>(
      ApiArea.hrms + ApiController.LateConsideration + '/UpdateEarlyDeparture',
      {}, // Use an empty object as the request body
      { params: requestData }
    ).subscribe(
      (result) => {
        let response = result as any;
        if (response.status) {
          // Send an email with the details for this item
           this.sendEmail();
          this.toastr.success('Saved Successfully', 'Server Response', { timeOut: 800 });
          this.closeModal('Save Complete');
        } else {
          this.toastr.error(response.msg, 'Server Response', { timeOut: 800 });
        }
      },
      (error) => {
        this.toastr.error('Something went wrong', 'Server Response', { timeOut: 800 });
      }
    );
  } else {
    this.utilityService.fail('Invalid form submission', 'Site Response');
  }
}

sendEmail() {
  if (this.dataToSubmit != null) {
    let data = [];
    let idToDataMap = {};

    this.dataToSubmit.forEach((item) => {
      if (!idToDataMap[item.earlyDepartureId]) {
        idToDataMap[item.earlyDepartureId] = {
          earlyDepartureId: item.earlyDepartureId,
          fullName: item.fullName,
          employeeCode: item.employeeCode,
          officeEmail: item.officeEmail,
          supervisorEmail: item.supervisorEmail,
          appliedDate: item.appliedDate,
          earlyDepartureFeedBackDetail: [],
        };
        data.push(idToDataMap[item.earlyDepartureId]);
      }

      idToDataMap[item.earlyDepartureId].earlyDepartureFeedBackDetail.push({       
        comment: item.comment,
        requestedForDate: item.requestedForDate,
        flag: item.flag,
      });
    });

    this.areasHttpService.observable_post<any>(
      ApiArea.hrms + ApiController.LateConsideration + '/feedbackEmailEarlyDeparture',
      data, // Send the 'data' array as the request body
      {}
      
    ).subscribe(
      (result) => {
        let response = result as any;
        if (response.status) {
          this.toastr.success('Mail Successfully Sent', 'Server Response', { timeOut: 800 });
          this.closeModal('Save Complete');
        } else {
          this.toastr.error(response.msg, 'Server Response', { timeOut: 800 });
        }
      },
      (error) => {
        this.toastr.error('Something went wrong', 'Server Response', { timeOut: 800 });
      }
    );

    // Log the 'data' array
    console.log('mailcontrol', data);
  } else {
    this.utilityService.fail('Invalid form submission', 'Site Response');
  }
}
formatTime(time: string | null | undefined): string {
  if (!time) {
    return '';  // or any default value you want to display for null/undefined time
  }

  const [hours, minutes] = time.split(':');

  if (hours == null || minutes == null) {
    return '';  // handle the case where the split result is not as expected
  }

  const timeObj = { hour: parseInt(hours, 10), minute: parseInt(minutes, 10) };
  return new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }).format(new Date(0, 0, 0, timeObj.hour, timeObj.minute));
}


modalType: string = ''; // Initialize it with an empty string



}
