import { transition, trigger, useAnimation } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { bounceIn, fadeIn, fadeInRight, slideInUp } from 'ng-animate';
import { ToastrService } from 'ngx-toastr';
import { CustomModalService } from 'src/app/shared/services/custom-modal.service';
import { UserService } from 'src/app/shared/services/user.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { RequestApprovalSerive } from '../requestApproval.service';

@Component({
  selector: 'app-request-approval',
  templateUrl: './request-approval.component.html',
  styleUrls: ['./request-approval.component.css'],
  animations: [
    trigger('slideInUp', [transition('* => *', useAnimation(slideInUp, { params: { timing: 0.5 } }))]),
    trigger('fadeIn', [transition('void => *', useAnimation(fadeIn, { params: { timing: 0.3 } }))]),
    trigger('fadeInRight', [transition('void => *', useAnimation(fadeInRight, { params: { timing: 0.5 } }))]),
    trigger('bounceIn', [transition('void => *', useAnimation(bounceIn, { params: { timing: 1 } }))]),
  ],

})
export class RequestApprovalComponent implements OnInit {

  userRoll : any;

  constructor(
    private utilityService:UtilityService,
    private userService: UserService,
    private fb: FormBuilder,
    public toastr: ToastrService,
    private requestApprovalSerive: RequestApprovalSerive,
    public modalService: CustomModalService

  ) { }

  ngOnInit(): void {
    this.getRequestCount();    
    this.userRoll = this.User().RoleName;
  }

  logger(msg: any, options: any) {
    this.utilityService.consoleLog(msg, options);
  }

  User() {
    return this.userService.User();
  }

  rawData: any[] = [];
  dashboardData: any[] = [];
  getRequestCount() {
    this.requestApprovalSerive.getRequestCount({ authorityId: this.User().EmployeeId }).subscribe(response => {
      // console.log("Request>>>", response);
      if ((response.body as any[]).length > 0) {
        // console.log("Request Data >>>", response.body);
        this.rawData = response.body;
        this.processData();
      }
    }, (error) => {
      this.utilityService.fail("Something went wrong", "Server Response")
      console.log("error >>>", error);
    })
  }

  processData() {
    const typeCounts = {};
    this.rawData.forEach(item => {
      if (typeCounts[item.type]) {
        typeCounts[item.type] += item.request;
      } else {
        typeCounts[item.type] = item.request;
      }
    });

    this.dashboardData = Object.keys(typeCounts).map(type => ({
      icon: this.getIconForType(type),
      title: `${type} Request`,
      value: typeCounts[type]
    }));
  }


  getIconForType(type: string) {
    const icons = {
      'Expat': 'fa-plane',
      'Conveyance': 'fa-car',
      'Entertainment': 'fa-music',
      'Purchase': 'fa-shopping-cart',
      'Training': 'fa-graduation-cap',
      'Travel': 'fa-suitcase'
    };
    return icons[type] || 'fa-question-circle';
  }

  showingModal : boolean= false;
  transactionType: string = '';
  onDashboardItemClick(type: string) {
    this.showingModal = true;
    this.transactionType = type;
  }

  closeModal(reason: any) {
    this.showingModal = false;
    this.transactionType = "";
    // if (reason == 'Successfully Saved') {
      this.getRequestCount();
    // }
  }

  showingDetailsModal: boolean = false;
  requestId: number = 0;
  employeeId: number = 0;
  stateStatus : string = '';

  handleOpenDetailsModal(event: { transactionType: string, requestId: number, employeeId: number, stateStatus : string }) {
    this.transactionType = event.transactionType;
    this.requestId = event.requestId;
    this.employeeId = event.employeeId;
    this.stateStatus = event.stateStatus;
    this.showingModal = false;
    this.showingDetailsModal = true;
  }

  closeRequestDetailsModal(reason: any) {
    this.showingDetailsModal = false;
    this.showingModal = true;
  }

}
