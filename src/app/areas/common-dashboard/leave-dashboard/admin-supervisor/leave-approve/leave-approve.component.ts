import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { EmployeeLeaveRequestService } from 'src/app/areas/leave_module/employee-leave-request/employee-leave-request.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { CustomModalService } from 'src/app/shared/services/custom-modal.service';
import { SharedmethodService } from 'src/app/shared/services/shared-method/sharedmethod.service';

@Component({
  selector: 'app-leave-approve',
  templateUrl: './leave-approve.component.html',
  styleUrls: ['./leave-approve.component.css']
})
export class LeaveApproveComponent implements OnInit {


  @ViewChild('approveModal', { static: true }) approveModal!: ElementRef;

  @Input() employeeDetails: any; 
  @Output() closeModalEvent = new EventEmitter();

  constructor(
    private modalService: CustomModalService,
    private utilityService: UtilityService,
    private employeeLeaveRequestService: EmployeeLeaveRequestService,
    private sharedmethodService: SharedmethodService
    
  ) { }

  ngOnInit(): void {

    this.openApprovalModal();
  }


  openApprovalModal() {
    this.modalService.open(this.approveModal, "md");
  }


  closeApprovalModal(reason: any) {
    this.modalService.service.dismissAll(reason);
    this.closeModalEvent.emit(reason);
  }


  submitLeaveRequestApproval(leaveRequestApproavalForm: NgForm, remarks: string) {
    if (leaveRequestApproavalForm.valid) {

      this.employeeLeaveRequestService.approval({ 
        employeeId: this.employeeDetails.employeeId, 
        employeeLeaveRequestId: this.employeeDetails.employeeLeaveRequestId, 
        remarks: remarks, 
        stateStatus: 'Approved' 
      }).subscribe(response => {
        var data = response as any;
        if (data?.status) {

          this.utilityService.success("Saved Successfull", "Server Response")
      
          this.sendEmailNew(data);

          this.sharedmethodService.callMethod();

          this.closeApprovalModal('close');

        }
        else {
          if (data?.msg == "Validation Error") {
            data.msg = '';
            Object.keys(data.errors).forEach((key) => {
              data.msg += data.errors[key] + '</br>';
            })
            this.utilityService.fail(data.msg, "Server Response", 5000)
          }
          else {
            this.utilityService.fail(data.msg, "Server Response")
          }

        }
        
      },
        // (error) => { console.log("errors >>>", error);})
        (error) => { 
          console.error(error);
        })
    }
    else {
      this.utilityService.info("Invalid Form Value", "Site Response");
    }
  }



  sendEmailNew(params: any) {
      this.employeeLeaveRequestService.sendEmailNew(params).subscribe(response => {
 
      }, (error) => {
          //console.log("error >>>", error);
          //this.utilityService.fail("Something went wrong", "Server Response");
      })
  }





}
