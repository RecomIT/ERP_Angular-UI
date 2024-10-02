import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CustomModalService } from 'src/app/shared/services/custom-modal.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { EmployeeLeaveRequestService } from '../../leave_module/employee-leave-request/employee-leave-request.service';
import { SharedmethodService } from 'src/app/shared/services/shared-method/sharedmethod.service';
import { EmployeeLeaveDashboardRoutingService } from '../../common-dashboard/common-dashboard-routing/employee-leave-dashboard-routing/employee-leave-dashboard-routing.service';

@Component({
  selector: 'app-reject',
  templateUrl: './reject.component.html',
  styleUrls: ['./reject.component.css'],
  animations: [
    trigger('fadeIn', [
      state('initial', style({
        opacity: 0,
        transform: 'translateY(20px)'
      })),
      state('final', style({
        opacity: 1,
        transform: 'translateY(0)'
      })),
      transition('initial => final', animate('500ms ease-in')),
    ])
  ]
})
export class RejectComponent implements OnInit {

  animationState: string;


  startAnimation() {
    this.animationState = 'initial';
    setTimeout(() => {
      this.animationState = 'final';
    }, 100);
  }



  @ViewChild('rejectModal', { static: true }) rejectModal!: ElementRef;

  @Output() closeModalEvent = new EventEmitter();

  constructor(
    private modalService: CustomModalService,
    private utilityService: UtilityService,
    private employeeLeaveRequestService: EmployeeLeaveRequestService,
    private sharedmethodService: SharedmethodService,
    private employeesLeave: EmployeeLeaveDashboardRoutingService
    
  ) { }

  ngOnInit(): void {

    this.employeeLeaveRequestId = 44;
    this.getEmployeesLeaveApproval();

    this.openRejectModal();
  }


  openRejectModal() {
    this.modalService.open(this.rejectModal, "md");
  }


  closeRejectModal(reason: any) {
    this.modalService.service.dismissAll(reason);
    this.closeModalEvent.emit(reason);
  }



  status: number = null;

  submitLeaveRequestApproval(leaveRequestApproavalForm: NgForm, remarks: string) {
    if (leaveRequestApproavalForm.valid) {

      this.employeeLeaveRequestService.approval({ 
        employeeId: this.employeesLeaveList[0].employeeId, 
        employeeLeaveRequestId: this.employeesLeaveList[0].employeeLeaveRequestId, 
        remarks: remarks, 
        stateStatus: 'Rejected' 
      }).subscribe(response => {
        var data = response as any;
        if (data?.status) {

          this.status = 1;
          console.log('status',this.status);

          console.log('data',data);
          // this.sendEmailNew(data);
          this.closeRejectModal('close');

        }
        else {
          this.status = 0;
          console.log('status',this.status);
          this.closeRejectModal('close');
        }
      },
        (error) => { console.log("errors >>>", error);})
    }
    else {
      this.utilityService.info("Invalid Form Value", "Site Response");
    }
  }


  
  sendEmailNew(params: any) {
    this.employeeLeaveRequestService.sendEmailNew(params).subscribe(response => {
        console.log("response >>>", response);
    }, (error) => {
        //console.log("error >>>", error);
        //this.utilityService.fail("Something went wrong", "Server Response");
    })
  }






  
  employeesLeaveList: any[] = [];


  employeeLeaveRequestId: any; 

  getEmployeesLeaveApproval() {

    const params: any = {};

    if (this.employeeLeaveRequestId && this.employeeLeaveRequestId > 0) {
      params['employeeLeaveRequestId'] = this.employeeLeaveRequestId;
    }


    console.log('params', params);

    this.employeesLeave.getEmployeesLeaveApprovalApiForEmail<any>(params).subscribe({
      next: (response) => {
        this. employeesLeaveList = response.body;
        console.log(' employeesLeaveList', this. employeesLeaveList);

      },
      error: (error: any) => {
        console.error(error);

      }
    });

  }


}
