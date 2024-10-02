import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup} from '@angular/forms';
import { ApiArea, ApiController } from 'src/app/shared/constants';
import { CustomModalService } from 'src/app/shared/services/custom-modal.service';
import { HrWebService } from 'src/app/shared/services/hr-web.service';
import { UserService } from 'src/app/shared/services/user.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AreasHttpService } from "src/app/areas/areas.http.service";
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-view-late-request-by-id-model',
  templateUrl: './view-late-request-by-id-model.component.html'

})
export class ViewLateRequestByIdModelComponent implements OnInit {

  @Input() lateRequestsId: any = 0;
  @Input() checkModalFlagg: any = "";
  @Input() approvalDataforId: any = {};
  @Output() closeModalEvent = new EventEmitter<string>();
  @ViewChild('lateConsiderationDetailById', { static: true }) lateConsiderationDetailById!: ElementRef;

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
    this.ViewAndCheckLateCosideratioFormInit();
    this.modalTitle = (this.checkModalFlagg == "View" ? "Late Consideration View" : "Hierarchy Group Assignment Approval"); 
    
    if (this.lateRequestsId > 0) {
      this.getLateConsiderationDetail(this.lateRequestsId);
    }
   
    
  }


  searchByStatus: any = '';

 ViewAndCheckLateCosideratioForm: FormGroup;
 

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







 ViewAndCheckLateCosideratioFormInit() {
  
  this.ViewAndCheckLateCosideratioForm = this.fb.group({
    
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
        employeeCode: new FormControl('')
       
      })
    ]),
  
   
  });
  this.modalService.open(this.lateConsiderationDetailById, "xl");
  this.formArray = (<FormArray>this.ViewAndCheckLateCosideratioForm.get('edit')).controls;

 // this.formArraycheckbox = (<FormArray>this.ViewAndCheckLateCosideratioForm.get('checkbox')).controls;  
}









getLateConsiderationDetail(lateRequestsId: any) {
  this.areasHttpService.observable_get<any>(ApiArea.hrms + ApiController.LateConsideration + "/GetLateConsiderationDetail", {
    responseType: "json",
    params: { lateRequestsId: lateRequestsId }
  }).subscribe((response: any) => {
    if (response != null && response.length > 0) {
      // Clear any previous form values before patching new ones
      this.ViewAndCheckLateCosideratioForm.reset();

      this.lateRequestsDetails = response; // Assign response to lateRequestsDetails
      this.fullName = response[0].fullName;
      this.employeeCode = response[0].employeeCode;
      console.log('name', this.fullName)
      console.log('code', this.employeeCode)

      // Clear any previous form values before patching new ones
      const editArray = this.ViewAndCheckLateCosideratioForm.get('edit') as FormArray;
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
         employeeCode: new FormControl(detail.employeeCode)
         
        });

        // Push the new FormGroup into the 'edit' array
        editArray.push(detailFormGroup);
      });

      // Open the modal (if required)
      this.modalService.open(this.lateConsiderationDetailById, "xl");

      // Log the form values
      console.log('Form values after initialization:', this.ViewAndCheckLateCosideratioForm.value);
    }
    console.log("this.lateRequestsDetails >>>", this.lateRequestsDetails);
  });
}





// // onSubmit() {
// //   if (this.ViewAndCheckLateCosideratioForm.valid) {
// //     this.btnApproval = true;
// //     const formValues = this.ViewAndCheckLateCosideratioForm.value;
// //     const dataToSubmit = [];
// //     formValues.edit.forEach((detail, index) => {
     
// //       const flag = {
// //         approve: detail.approve ? 'Approve' : null,
// //         reject: detail.reject ? 'Reject' : null,
// //         recheck: detail.recheck ? 'Recheck' : null,
// //       };
// //       const detailData = {
// //         lateRequestsId: detail.lateRequestsId,
// //         lateRequestsDetailId: detail.lateRequestsDetailId,
// //         attendanceId: detail.attendanceId,
// //         comment: detail.comment, 
// //         flag: [flag.approve, flag.reject, flag.recheck].filter(Boolean).join(', '), // Merge and remove nulls                      // Include the selected actions
// //       };

// //       dataToSubmit.push(detailData);
// //     });
    

   
 
// //     // Send dataToSubmit to the server
// //     console.log(dataToSubmit); // This is what you'll send to the server
// //   }
// // }
// //////////////////////////////////////////////////////////////////////////

// onSubmit() {
//   if (this.ViewAndCheckLateCosideratioForm.valid) {
//     this.btnApproval = true;
//     const formValues = this.ViewAndCheckLateCosideratioForm.value;
//     const dataToSubmit = [];
    
//     formValues.edit.forEach((detail, index) => {
//       const flag = {
//         approve: detail.approve ? 'Approve' : null,
//         reject: detail.reject ? 'Reject' : null,
//         recheck: detail.recheck ? 'Recheck' : null,
//       };
      
//       const detailData = {
//         lateRequestsId: detail.lateRequestsId,
//         lateRequestsDetailId: detail.lateRequestsDetailId,
//         attendanceId: detail.attendanceId,
//         comment: detail.comment,
//         fullName:detail.fullName,
//         employeeCode:detail.employeeCode,
//         requestedForDate:detail.requestedForDate,
//         flag: [flag.approve, flag.reject, flag.recheck].filter(Boolean).join(', '), // Merge and remove nulls
//       };

//       dataToSubmit.push(detailData);
//     });

//     // Send dataToSubmit to the server for each item in the array
//     dataToSubmit.forEach((data) => {
//       this.processItem(data.lateRequestsDetailId, data.flag, data.comment, data.attendanceId, data.lateRequestsId);
//     });
//   }
// }

// // processItem(lateRequestsDetailId: number, flag: string, comment: string, attendanceId: number, lateRequestsId: number) {
// //   const requestData = {
// //     lateRequestsDetailId: lateRequestsDetailId,
// //     flag: flag,
// //     comment: comment,
// //     attendanceId: attendanceId,
// //     lateRequestsId: lateRequestsId,
// //   };

// //   if (lateRequestsDetailId > 0) {
// //     this.areasHttpService.observable_post<any>(
// //       ApiArea.hrms + ApiController.LateConsideration + '/UpdateStatusLateRequestDetaile',
// //       null,
// //       { params: requestData }
// //     ).subscribe(
// //       (result) => {
// //         let data = result as any;
// //         if (data.status) {
// //           this.toastr.success('Saved Successfully', 'Server Response', { timeOut: 800 });
// //           this.closeModal('Save Complete');
// //         } else {
// //           this.toastr.error(data.msg, 'Server Response', { timeOut: 800 });
// //         }
// //       },
// //       (error) => {
// //         this.toastr.error('Something went wrong', 'Server Response', { timeOut: 800 });
// //       }
// //     );
// //   } else {
// //     this.utilityService.fail('Invalid form submission', 'Site Response');
// //   }
// // }
// ////////////////////////////////////////////////////////////////////////////


// onSubmit() {
//   if (this.ViewAndCheckLateCosideratioForm.valid) {
//     this.btnApproval = true;
//     const formValues = this.ViewAndCheckLateCosideratioForm.value;
//     const dataToSubmit = [];

//     formValues.edit.forEach((detail, index) => {
//       const flag = {
//         approve: detail.approve ? 'Approve' : null,
//         reject: detail.reject ? 'Reject' : null,
//         recheck: detail.recheck ? 'Recheck' : null,
//       };

//       const detailData = {
//         lateRequestsId: detail.lateRequestsId,
//         lateRequestsDetailId: detail.lateRequestsDetailId,
//         attendanceId: detail.attendanceId,
//         comment: detail.comment,
//         fullName: detail.fullName,
//         employeeCode: detail.employeeCode,
//         requestedForDate: detail.requestedForDate,
//         flag: [flag.approve, flag.reject, flag.recheck].filter(Boolean).join(', '), // Merge and remove nulls
//       };

//       dataToSubmit.push(detailData);
//     });

//     // Send dataToSubmit to the server for each item in the array
//     dataToSubmit.forEach((data) => {
//       this.processItem(data);
//     });
//   }
// }

// processItem(data: any) {
//   const requestData = {
//     lateRequestsDetailId: data.lateRequestsDetailId,
//     flag: data.flag,
//     comment: data.comment,
//     attendanceId: data.attendanceId,
//     lateRequestsId: data.lateRequestsId,
//   };

//   if (data.lateRequestsDetailId > 0) {
//     this.areasHttpService.observable_post<any>(
//       ApiArea.hrms + ApiController.LateConsideration + '/UpdateStatusLateRequestDetaile',
//       null,
//       { params: requestData }
//     ).subscribe(
//       (result) => {
//         let response = result as any;
//         if (response.status) {
//           // Send an email with the details for this item
//           this.sendEmail(data);
//           this.toastr.success('Saved Successfully', 'Server Response', { timeOut: 800 });
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
// }


}
