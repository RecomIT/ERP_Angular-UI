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
  selector: 'app-hr-view-and-check-late-request',
  templateUrl: './hr-view-and-check-late-request.component.html',
  
})
export class HrViewAndCheckLateRequestComponent implements OnInit {
  @Input() lateRequestsId: any = 0;
  @Input() checkModalFlag: any = "";
  @Input() approvalData: any = {};
  @Output() closeModalEvent = new EventEmitter<string>();
  @ViewChild('ViewAndCheckLateCosiderationModal', { static: true }) ViewAndCheckLateCosiderationModal!: ElementRef;

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
    this.ViewAndCheckHierarchyGroupFormInit();
    this.modalTitle = (this.checkModalFlag == "View" ? "Late Consideration View" : "Hierarchy Group Assignment Approval"); 
    
    if (this.lateRequestsId > 0) {
      this.getLateConsiderationDetail(this.lateRequestsId);
    }
   
    
  }


  searchByStatus: any = '';

  ViewAndCheckHierarchyGroupForm: FormGroup;
 

  btnAddApprovalHierarchy: boolean = false;
 
  
  // handleCheckboxChange(detailFormGroup: FormGroup, action: string) {
  //   // Update the selected checkboxes based on the action (approve, reject, recheck)
  //   if (action === 'approve') {
  //     detailFormGroup.get('approve').setValue(true);
  //     detailFormGroup.get('reject').setValue(false);
  //     detailFormGroup.get('recheck').setValue(false);
  //   } else if (action === 'reject') {
  //     detailFormGroup.get('approve').setValue(false);
  //     detailFormGroup.get('reject').setValue(true);
  //     detailFormGroup.get('recheck').setValue(false);
  //   } else if (action === 'recheck') {
  //     detailFormGroup.get('approve').setValue(false);
  //     detailFormGroup.get('reject').setValue(false);
  //     detailFormGroup.get('recheck').setValue(true);
  //   }
  // }
  handleCheckboxChange(detailFormGroup: FormGroup, action: string) {
    const status = detailFormGroup.get('status').value;
  
    if (status === 'Pending') {
      // Update the selected checkboxes based on the action (approve, reject, recheck)
      if (action === 'approve') {
        detailFormGroup.get('approve').setValue(true);
        detailFormGroup.get('reject').setValue(false);
        detailFormGroup.get('recheck').setValue(false);
      } else if (action === 'reject') {
        detailFormGroup.get('approve').setValue(false);
        detailFormGroup.get('reject').setValue(true);
        detailFormGroup.get('recheck').setValue(false);
      } else if (action === 'recheck') {
        detailFormGroup.get('approve').setValue(false);
        detailFormGroup.get('reject').setValue(false);
        detailFormGroup.get('recheck').setValue(true);
      }
    } else {
      // If status is not 'Approved', do not allow changes to checkboxes
      detailFormGroup.get('approve').setValue(false);
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







ViewAndCheckHierarchyGroupFormInit() {
  
  this.ViewAndCheckHierarchyGroupForm = this.fb.group({
    
    LateRequestsDetailId: new FormControl(0),
   
  
    edit: this.fb.array([
      this.fb.group({
        lateRequestsDetailId: new FormControl(0),  
        lateRequestsId: new FormControl(0),           
        reason:  new FormControl(''),    
        requestedForDate: new FormControl(''),
        otherReason: new FormControl(''),
        IsApproved: new FormControl(false),
        status: new FormControl(''),
        comment: new FormControl(''),
        inMinute: new FormControl(0),
        attendanceId : new FormControl(0),
        approvalRemarks: new FormControl(''),               
        approve:  new FormControl(false),
        reject: new FormControl(false),
        recheck: new FormControl(false),
        fullName: new FormControl(''),
        employeeCode: new FormControl(''),
        officeEmail: new FormControl(''),
        supervisorEmail: new FormControl(''),
        appliedDate: new FormControl(null)
       
      })
    ]),
  
   
  });
  this.formArray = (<FormArray>this.ViewAndCheckHierarchyGroupForm.get('edit')).controls;
 // this.formArraycheckbox = (<FormArray>this.ViewAndCheckHierarchyGroupForm.get('checkbox')).controls;  
}









getLateConsiderationDetail(lateRequestsId: any) {
  this.areasHttpService.observable_get<any>(ApiArea.hrms + ApiController.LateConsideration + "/GetLateConsiderationDetail", {
    responseType: "json",
    params: { lateRequestsId: lateRequestsId }
  }).subscribe((response: any) => {
    if (response != null && response.length > 0) {
      // Clear any previous form values before patching new ones
      this.ViewAndCheckHierarchyGroupForm.reset();

      this.lateRequestsDetails = response; // Assign response to lateRequestsDetails
      this.fullName = response[0].fullName;
      this.employeeCode = response[0].employeeCode;
      console.log('name', this.fullName)
      console.log('code', this.employeeCode)

      // Clear any previous form values before patching new ones
      const editArray = this.ViewAndCheckHierarchyGroupForm.get('edit') as FormArray;
      editArray.clear();

      response.forEach((detail, index) => {
        // Create a new FormGroup for each detail
        const detailFormGroup = this.fb.group({
          lateRequestsId: new FormControl(detail.lateRequestsId),
          lateRequestsDetailId:new FormControl(detail.lateRequestsDetailId),
          reason: new FormControl(detail.reason),
          requestedForDate: new FormControl(detail.requestedForDate),
          otherReason: new FormControl(detail.otherReason),      
          status: new FormControl(detail.status),
          inMinute: new FormControl(detail.inMinute),
          comment: new FormControl(detail.comment),
          attendanceId: new FormControl(detail.attendanceId),
          action: new FormControl(detail.approvalRemarks),
          approve:  new FormControl(detail.approve),
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
      this.modalService.open(this.ViewAndCheckLateCosiderationModal, "xl");

      // Log the form values
      console.log('Form values after initialization:', this.ViewAndCheckHierarchyGroupForm.value);
    }
    console.log("this.lateRequestsDetails >>>", this.lateRequestsDetails);
  });
}


 dataToSubmit = [];

onSubmit() {
  if (this.ViewAndCheckHierarchyGroupForm.valid) {
    this.btnApproval = true;
    const formValues = this.ViewAndCheckHierarchyGroupForm.value;
    

    formValues.edit.forEach((detail, index) => {
      const flag = {
        approve: detail.approve ? 'Approve' : null,
        reject: detail.reject ? 'Reject' : null,
        recheck: detail.recheck ? 'Recheck' : null,
      };

      const detailData = {
        lateRequestsId: detail.lateRequestsId,
        lateRequestsDetailId: detail.lateRequestsDetailId,
        attendanceId: detail.attendanceId,
        comment: detail.comment,
        fullName: detail.fullName,
        employeeCode: detail.employeeCode,
        requestedForDate: detail.requestedForDate,      
        officeEmail: detail.officeEmail,
        supervisorEmail: detail.supervisorEmail,
        appliedDate: detail.appliedDate,
        flag: [flag.approve, flag.reject, flag.recheck].filter(Boolean).join(', '), // Merge and remove nulls
      };

      this.dataToSubmit.push(detailData);
    });

    // Send dataToSubmit to the server for each item in the array
    this.dataToSubmit.forEach((data) => {
      this.processItem(data);
    });
    





    this.sendEmail();
   
  }
}

processItem(data: any) {
  const requestData = {
    lateRequestsDetailId: data.lateRequestsDetailId,
    flag: data.flag,
    comment: data.comment,
    attendanceId: data.attendanceId,
    lateRequestsId: data.lateRequestsId,
  };

  if (data.lateRequestsDetailId > 0) {
    this.areasHttpService.observable_post<any>(
      ApiArea.hrms + ApiController.LateConsideration + '/UpdateStatusLateRequestDetaile',
      null,
      { params: requestData }
    ).subscribe(
      (result) => {
        let response = result as any;
        if (response.status) {
          // Send an email with the details for this item
         // this.sendEmail();
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

// sendEmail(data: any) {
//   // Create and send an email with the details for the current item
//   const emailBody = `Full Name: ${data.fullName}<br/>Employee Code: ${data.employeeCode}<br/>Requested For Date: ${data.requestedForDate}<br/>Flag: ${data.flag}<br/>Comment: ${data.comment}`;
//   console.log('email', emailBody)

//   // You can use an email library or service to send the email with the above emailBody
//   // This example assumes an HTML email format, adjust as needed

//   // Example using Angular's HttpClient to send the email (assumes a corresponding API endpoint)
//   // this.httpClient.post('your-email-sending-api-url', { subject: 'Email Subject', body: emailBody }).subscribe(
//   //   (response) => {
//   //     console.log('Email sent successfully');
//   //   },
//   //   (error) => {
//   //     console.error('Error sending email: ' + error);
//   //   }
//   // );
//   const recipientData = [
//     {
//       fullName: data.fullName,
//       employeeCode: data.employeeCode,
//       recipientEmail: data.email,
//     },
//     // Add more recipient data as needed
//   ];
  


//   const emailData = [];
  
//   // Assuming you have an array of requestedForDates, flags, and comments

  
  
//   // Loop through the common properties and create email data objects
//   for (let i = 0; i < requestedForDates.length; i++) {
//     const data = {
//       requestedForDate: requestedForDates[i],
//       flag: flags[i],
//       comment: comments[i],
//     };
//     emailData.push(data);
//   }
  
//   // Loop through recipientData and emailData to generate emails for the same recipient with different data
//   recipientData.forEach((recipient) => {
//     emailData.forEach((data) => {
//       const emailMessage = `
//         Full Name: ${recipient.fullName}<br/>
//         Employee Code: ${recipient.employeeCode}<br/>
//         Requested For Date: ${data.requestedForDate}<br/>
//         Flag: ${data.flag}<br/>
//         Comment: ${data.comment}
//       `;
  
//       // You can use the 'emailMessage' variable to send an email to 'recipient.recipientEmail'.
//       // Implement your email sending logic here, depending on your technology stack.
//       console.log(`Sending email to: ${recipient.recipientEmail}`);
//       console.log(emailMessage);
//     });
//   });
  
// }
// sendEmail() {
//   if (this.dataToSubmit != null) {
//     let data = [];
//     let idToDataMap = {};

//     this.dataToSubmit.forEach((item) => {
//       if (!idToDataMap[item.lateRequestsId]) {
//         idToDataMap[item.lateRequestsId] = {
//           lateRequestsId: item.lateRequestsId,
//           fullName: item.fullName,
//           employeeCode: item.employeeCode,
//           officeEmail: item.officeEmail,
//           supervisorEmail: item.supervisorEmail,
//           appliedDate: item.appliedDate,
//           feedBackDetails: [],
//         };
//         data.push(idToDataMap[item.lateRequestsId]);
//       }

//       idToDataMap[item.lateRequestsId].feedBackDetails.push({
//         lateRequestsDetailId: item.lateRequestsDetailId,
//         attendanceId: item.attendanceId,
//         comment: item.comment,
//         requestedForDate: item.requestedForDate,
//         flag: item.flag,
//       });
//     });

//     this.areasHttpService.observable_post<any>(
//       ApiArea.hrms + ApiController.LateConsideration + '/feedbackEmailLateRequest',
//       data, // Send the 'data' array as the request body
//       {}
      
//     ).subscribe(
//       (result) => {
//         let response = result as any;
//         if (response.status) {
//           this.toastr.success('Mail Successfully Sent', 'Server Response', { timeOut: 800 });
//           this.closeModal('Save Complete');
//         } else {
//           this.toastr.error(response.msg, 'Server Response', { timeOut: 800 });
//         }
//       },
//       (error) => {
//         this.toastr.error('Something went wrong', 'Server Response', { timeOut: 800 });
//       }
      
//     );
//   } else {
//     this.utilityService.fail('Invalid form submission', 'Site Response');
//   }
  
// }

sendEmail() {
  if (this.dataToSubmit != null) {
    let data = [];
    let idToDataMap = {};

    this.dataToSubmit.forEach((item) => {
      if (!idToDataMap[item.lateRequestsId]) {
        idToDataMap[item.lateRequestsId] = {
          lateRequestsId: item.lateRequestsId,
          fullName: item.fullName,
          employeeCode: item.employeeCode,
          officeEmail: item.officeEmail,
          supervisorEmail: item.supervisorEmail,
          appliedDate: item.appliedDate,
          feedBackDetails: [],
        };
        data.push(idToDataMap[item.lateRequestsId]);
      }

      idToDataMap[item.lateRequestsId].feedBackDetails.push({
        lateRequestsDetailId: item.lateRequestsDetailId,
        attendanceId: item.attendanceId,
        comment: item.comment,
        requestedForDate: item.requestedForDate,
        flag: item.flag,
      });
    });

    this.areasHttpService.observable_post<any>(
      ApiArea.hrms + ApiController.LateConsideration + '/feedbackEmailLateRequest',
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


}
























