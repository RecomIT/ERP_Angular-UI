import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/shared/services/user.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { RequestApprovalSerive } from '../../request-approval/requestApproval.service';
import { CustomModalService } from 'src/app/shared/services/custom-modal.service';
import { ReimbursementSerive } from '../../request-reimbursement/reimbursement.service';
import { transition, trigger, useAnimation } from '@angular/animations';
import { fadeIn, fadeInUp, fadeOutLeft, slideInUp } from 'ng-animate';

@Component({
  selector: 'app-request-approval-account',
  templateUrl: './request-approval-account.component.html',
  styleUrls: ['./request-approval-account.component.css'],
  animations: [
    trigger('fadeIn', [transition('void => *', useAnimation(fadeIn, { params: { timing: 0.3 } }))]),
    trigger('slideInUp', [transition('* => *', useAnimation(slideInUp, { params: { timing: 0.5 } }))]),
    trigger('fadeInUp', [transition('void => *', useAnimation(fadeInUp))]),
    trigger('fadeOutLeft', [transition('* => void', useAnimation(fadeOutLeft, { params: { timing: 0.3 } }))]),
  ],
})
export class RequestApprovalAccountComponent implements OnInit {

  userRoll : any;

  constructor(
    private utilityService:UtilityService,
    private userService: UserService,
    private fb: FormBuilder,
    public toastr: ToastrService,
    private requestApprovalSerive: RequestApprovalSerive,
    public modalService: CustomModalService,
    public reimbursementSerive: ReimbursementSerive

  ) { }

  ngOnInit(): void {
    this.getRequestCountAdvance();
    this.getRequestCountReimbursement();     
    this.userRoll = this.User().RoleName;
  }

  logger(msg: any, options: any) {
    this.utilityService.consoleLog(msg, options);
  }

  User() {
    return this.userService.User();
  }

  rawDataAdvance: any[] = [];
  dashboardDataAdvance: any[] = [];
  getRequestCountAdvance() {
    this.requestApprovalSerive.getRequestCountAdvance({ authorityId: this.User().EmployeeId }).subscribe(response => {
      // console.log("Request>>>", response);
      if ((response.body as any[]).length > 0) {
        // console.log("Request Data >>>", response.body);
        this.rawDataAdvance = response.body;
        this.processDataAdvance();
      }
    }, (error) => {
      this.utilityService.fail("Something went wrong", "Server Response")
      console.log("error >>>", error);
    })
  }

  processDataAdvance() {
    const typeCounts = {};
    this.rawDataAdvance.forEach(item => {
      if (typeCounts[item.type]) {
        typeCounts[item.type] += item.request;
      } else {
        typeCounts[item.type] = item.request;
      }
    });

    this.dashboardDataAdvance = Object.keys(typeCounts).map(type => ({
      icon: this.getIconForType(type),
      title: `${type} Request`,
      value: typeCounts[type]
    }));
  }

  rawDataSelf: any[] = [];
  dashboardDataReimbursement: any[] = [];
  getRequestCountReimbursement() {
    this.reimbursementSerive.getRequestCountReimbursement({ authorityId: this.User().EmployeeId }).subscribe(response => {
      // console.log("Request>>>", response);
      if ((response.body as any[]).length > 0) {
        // console.log("Request Data >>>", response.body);
        this.rawDataSelf = response.body;
        this.processDataReimbursement();
      }
    }, (error) => {
      this.utilityService.fail("Something went wrong", "Server Response")
      console.log("error >>>", error);
    })
  }

  processDataReimbursement() {
    const typeCounts = {};
    this.rawDataSelf.forEach(item => {
      if (typeCounts[item.type]) {
        typeCounts[item.type] += item.request;
      } else {
        typeCounts[item.type] = item.request;
      }
    });

    this.dashboardDataReimbursement = Object.keys(typeCounts).map(type => ({
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
  dashboardId: string = '';
  onDashboardItemClick(type: string,dashboardId: string) {
    this.showingModal = true;
    this.transactionType = type;
    this.dashboardId = dashboardId;
  }

  closeModal(reason: any) {
    this.showingModal = false;
    this.transactionType = "";
    this.dashboardId = "";
    // if (reason == 'Successfully Saved') {
      this.getRequestCountAdvance();
    // }
  }

  showingDetailsModal: boolean = false;
  requestId: number = 0;
  employeeId: number = 0;
  stateStatus : string = '';
  spendMode : string = '';

  handleOpenDetailsModal(event: { transactionType: string, requestId: number, employeeId: number, stateStatus : string, spendMode : string}) {
    this.transactionType = event.transactionType;
    this.requestId = event.requestId;
    this.employeeId = event.employeeId;
    this.stateStatus = event.stateStatus;
    this.spendMode = event.spendMode;
    this.showingModal = false;
    this.showingDetailsModal = true;    
  }

  closeRequestDetailsModal(reason: any) {
    this.showingDetailsModal = false;
    this.showingModal = true;
  }

}
