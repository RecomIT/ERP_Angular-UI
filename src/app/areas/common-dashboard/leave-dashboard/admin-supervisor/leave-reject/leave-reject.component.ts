import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { EmployeeLeaveRequestService } from 'src/app/areas/leave_module/employee-leave-request/employee-leave-request.service';
import { CustomModalService } from 'src/app/shared/services/custom-modal.service';
import { SharedmethodService } from 'src/app/shared/services/shared-method/sharedmethod.service';
import { UtilityService } from 'src/app/shared/services/utility.service';

@Component({
  selector: 'app-leave-reject',
  templateUrl: './leave-reject.component.html',
  styleUrls: ['./leave-reject.component.css']
})
export class LeaveRejectComponent implements OnInit {

 
  @ViewChild('rejectModal', { static: true }) rejectModal!: ElementRef;

  @Input() employeeDetails: any; 
  @Output() closeModalEvent = new EventEmitter();

  constructor(
    private modalService: CustomModalService,
    private utilityService: UtilityService,
    private employeeLeaveRequestService: EmployeeLeaveRequestService,
    private sharedmethodService: SharedmethodService
    
  ) { }

  ngOnInit(): void {

    this.openRejectModal();
  }


  openRejectModal() {
    this.modalService.open(this.rejectModal, "md");
  }


  closeRejectModal(reason: any) {
    this.modalService.service.dismissAll(reason);
    this.closeModalEvent.emit(reason);
  }




  submitLeaveRequestApproval(leaveRequestApproavalForm: NgForm, remarks: string) {
    if (leaveRequestApproavalForm.valid) {

      this.employeeLeaveRequestService.approval({ 
        employeeId: this.employeeDetails.employeeId, 
        employeeLeaveRequestId: this.employeeDetails.employeeLeaveRequestId, 
        remarks: remarks, 
        stateStatus: 'Rejected' 
      }).subscribe(response => {
        var data = response as any;
        if (data?.status) {

          this.sendEmailNew(data);

          this.utilityService.success("Saved Successfull", "Server Response")

          this.sharedmethodService.callMethod();

          this.closeRejectModal('close');

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
