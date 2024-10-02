import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { EmployeeLeaveRequestService } from '../../leave_module/employee-leave-request/employee-leave-request.service';
import { SharedmethodService } from 'src/app/shared/services/shared-method/sharedmethod.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { CustomModalService } from 'src/app/shared/services/custom-modal.service';
import { EmployeeLeaveDashboardRoutingService } from '../../common-dashboard/common-dashboard-routing/employee-leave-dashboard-routing/employee-leave-dashboard-routing.service';
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-approve',
  templateUrl: './approve.component.html',
  styleUrls: ['./approve.component.css'],
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
export class ApproveComponent implements OnInit {

  animationState: string;


  startAnimation() {
    this.animationState = 'initial';
    setTimeout(() => {
      this.animationState = 'final';
    }, 100);
  }






  
  @ViewChild('approveModal', { static: true }) approveModal!: ElementRef;


  @Output() closeModalEvent = new EventEmitter();

  id: number;
  employeeLeaveRequestId: any; 

  constructor(
    private modalService: CustomModalService,
    private utilityService: UtilityService,
    private employeeLeaveRequestService: EmployeeLeaveRequestService,
    private sharedmethodService: SharedmethodService,
    private employeesLeave: EmployeeLeaveDashboardRoutingService,
    private route: ActivatedRoute
  ) { 

    this.route.params.subscribe( params => {
      this.id = +params['id'];
    });
  }

  ngOnInit(): void {

   

    this.employeeLeaveRequestId = 43;
    this.getEmployeesLeaveApproval();

    this.openApprovalModal();
  }


  openApprovalModal() {
    this.modalService.open(this.approveModal, "md");
  }


  closeApprovalModal(reason: any) {
    this.modalService.service.dismissAll(reason);
    this.closeModalEvent.emit(reason);
  }



  status: number = null;

  submitLeaveRequestApproval(leaveRequestApproavalForm: NgForm, remarks: string) {
    if (leaveRequestApproavalForm.valid) {

      this.employeeLeaveRequestService.approvalByEmail({ 
        employeeId: this.employeesLeaveList[0].employeeId, 
        employeeLeaveRequestId: this.employeesLeaveList[0].employeeLeaveRequestId, 
        remarks: remarks, 
        stateStatus: 'Approved' 
      }).subscribe(response => {
        var data = response as any;
        this.sendEmailNew(data);
        if (data?.status) {

          this.status = 1;
          console.log('status',this.status);

          console.log('data',data);
          
          this.closeApprovalModal('close');

        }
        else {
          this.status = 0;
          console.log('status',this.status);
          this.closeApprovalModal('close');
        }
        
      },
        (error) => { console.log("errors >>>", error);})
    }
    else {   
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


  getEmployeesLeaveApproval() {

    const params: any = {};

    if (this.employeeLeaveRequestId && this.employeeLeaveRequestId > 0) {
      params['employeeLeaveRequestId'] = this.id;
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
