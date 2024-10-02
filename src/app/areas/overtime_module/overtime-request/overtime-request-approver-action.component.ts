import { transition, trigger, useAnimation } from '@angular/animations';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { bounceIn, fadeIn, fadeInRight, slideInUp } from 'ng-animate';
import { ApiArea, ApiController } from 'src/app/shared/constants';
import { CustomModalService } from 'src/app/shared/services/custom-modal.service';
import { UserService } from 'src/app/shared/services/user.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { Select2OptionData } from 'ng-select2';
import { OvertimeCreateRequest } from 'src/models/payroll/overtime/overtime-create-request';
import { OvertimeRequest } from 'src/models/payroll/overtime/overtime-request';
import { OvertimeSaveRequest } from 'src/models/payroll/overtime/overtime-save-request';
import { OvertimeRequestAction } from 'src/models/payroll/overtime/overtime-request-action';
import { AreasHttpService } from '../../areas.http.service';

@Component({
  selector: 'overtime-request-approver-action',
  templateUrl: './overtime-request-approver-action.component.html',
  animations: [
    trigger('slideInUp', [transition('* => *', useAnimation(slideInUp, { params: { timing: 0.5 } }))]),
    trigger('fadeIn', [transition('void => *', useAnimation(fadeIn, { params: { timing: 0.3 } }))]),
    trigger('fadeInRight', [transition('void => *', useAnimation(fadeInRight, { params: { timing: 0.5 } }))]),
    trigger('bounceIn', [transition('void => *', useAnimation(bounceIn, { params: { timing: 1 } }))]),
  ],
})
export class OvertimeRequestApproverActionComponent implements OnInit {

  @ViewChild('requestDetailsModal', { static: true }) requestDetailsModal!: ElementRef; 
  @ViewChild('approvalActionModal', { static: true }) approvalActionModal!: ElementRef;

  modalTitle: string;
  buttonAction: string = 'Submit';
  fieldsetDisabled : boolean = false;

  configurations : OvertimeCreateRequest;
  request : OvertimeRequest;
  requestList : OvertimeRequest[];
  status : string;
  employeeName : string;
  overtimeName : String;
  overtimeList : Array<Select2OptionData>;
  saveRequest : OvertimeSaveRequest;
  requestAction : OvertimeRequestAction;

  constructor(public modalService: CustomModalService, private areasHttpService: AreasHttpService, private userService: UserService, private utilityService: UtilityService) { }

  ngOnInit(): void {

    this.modalTitle = "";
    this.configurations = new OvertimeCreateRequest();
    this.request  = new OvertimeRequest();
    this.requestList = [];
    this.status = "";
    this.employeeName = "";
    this.overtimeName = "";
    this.overtimeList =[];
    this.saveRequest = new OvertimeSaveRequest();
    this.requestAction = new OvertimeRequestAction();

    this.getAllRequest(this.status);
  }

  User() { return this.userService.User(); }
  logger(msg: any, optionsParams: any) { this.utilityService.consoleLog(msg, optionsParams) }

  // Functions Starts

  onStatusChange()
  {
    this.getAllRequest(this.status);
  }

  onRequestActionChange(){
    //console.log( this.requestAction.status);
  }

  // Functions Ends
  
  // Modals Starts

  openApprovalActionModal(id: number) {

    this.request = new OvertimeRequest();
    this.saveRequest = new OvertimeSaveRequest();
    this.requestAction = new OvertimeRequestAction();

    this.fieldsetDisabled = true;
    this.modalTitle = "Overtime Approval Action";
    this.buttonAction = 'Submit';

    this.request = Object.assign({}, this.requestList.find(x => x.overtimeRequestId == id));

    this.employeeName = this.request.employee.name
    this.overtimeName = this.request.overtimeType.overtimeName;
    
    this.saveRequest.employeeId = this.request.employee.employeeId;
    this.saveRequest.overtimeId = this.request.overtimeType.overtimeId;
    this.saveRequest.requestDate = this.request.requestDate;
    this.saveRequest.startTime = this.request.startTime;
    this.saveRequest.endTime = this.request.endTime;
    this.saveRequest.remarks = this.request.remarks;

    
    this.request.overtimeRequestDetails.forEach((x) => {
      if (this.saveRequest.approvers.find(f=> f.overtimeApproverId == x.approver.overtimeApproverId) == null) {
        x.approver.approvalOrder = x.approvalOrder;
        this.saveRequest.approvers.push(x.approver)
      }

      // this.request.overtimeRequestDetails.forEach((x) => {
      //   x.approver.approvalOrder = x.approvalOrder;
      //   this.saveRequest.approvers.push(x.approver)
      // });
      
    });

    // this.saveRequest.approvers.sort((n1, n2) => {
    //   //Sort By approvalLevel
    //   return n1.approvalOrder - n2.approvalOrder; //ASEN
    // });

    this.requestAction.overtimeRequestId = this.request.overtimeRequestId;
    this.modalService.open(this.approvalActionModal, 'lg');

  }

  openOvertimeRequestDetailsModal(id: number) {

    this.modalTitle = "Overtime Request Details";
    this.request = this.requestList.find(x=>x.overtimeRequestId==id);
  //   this.request.overtimeRequestDetails.sort((n1,n2) => {
  //     //Sort By approvalLevel
  //      return n1.approvalOrder - n2.approvalOrder; //ASEN
  // });

    this.modalService.open(this.requestDetailsModal, 'lg');
  }

  //Modals End


  //API Calls Starts  

  getAllRequest(status: string) {
    var request = this.areasHttpService.observable_get<OvertimeRequest[]>((ApiArea.payroll + ApiController.Overtime + "/GetAllRequestForApprover?status=" + status), {
      responseType: "json", observe: 'response', params: {}
    });

    request.subscribe((response) => {
      let result = response as any;
      if (result?.status == 200) {
        this.requestList = result.body as OvertimeRequest[];
      }},
      (error) => {
        if (error?.status == 404) {
          this.requestList = [];
        }
        this.utilityService.fail(error.msg?.message, "Server Response");
      }
    )
  }
  overtimeActionForm(form: NgForm) {
    
    console.log( this.requestAction);

    var request = this.areasHttpService.observable_post((ApiArea.payroll + ApiController.Overtime + "/ApprovalAction"),
      
      JSON.stringify(this.requestAction), 
      { 'headers': { 'Content-Type': 'application/json' }, observe: 'response', params: {} })
      

    request.subscribe((response) => {
      let result = response as any;
      if (result?.status == 200) {
        this.utilityService.success(result.body.message, "Server Response")
        this.modalService.service.dismissAll("Save Complete");
        this.getAllRequest(this.status);
      }
      else {
        this.utilityService.fail('Something went wrong', "Server Response")
      }
    },
      (error) => {
        if (error.havingValidationError) {
          Object.keys(error.validationErrors).forEach((propertyName: string) => {
            var errorMessages: string[] = error.validationErrors[propertyName];
            //errorMessages.push('The sfdsfs field is required 2');
            //console.log(`Property : ${propertyName}  ${errorMessages.join(' | ')}`);
            this.utilityService.fail(`Property : ${propertyName}` + ` ${errorMessages.join(' | ')}`, "Server Response")
          });
        }
        else {
          this.utilityService.fail(error.msg?.message, "Server Response")
        }
      }
    )
  }

  

  // overtimeRequestForm(form: NgForm) {
  //   // console.log(form);
  //    console.log(this.saveRequest);
  //    //return;

  //   var request = 

  //   this.buttonAction == "Submit" ?
  //     /// Save  
  //     this.areasHttpService.observable_post((ApiArea.payroll + ApiController.Overtime + "/SaveRequest"),
      
  //     JSON.stringify(this.saveRequest), 
  //     { 'headers': { 'Content-Type': 'application/json' }, observe: 'response', params: {} })
  //     :
  //     /// Update
  //     this.buttonAction == "Update" ?
  //     this.areasHttpService.observable_put((ApiArea.payroll + ApiController.Overtime + "/UpdateRequest/" + 
  //     this.request.overtimeRequestId),
  //       JSON.stringify(this.saveRequest), { 'headers': { 'Content-Type': 'application/json' }, observe: 'response', params: {} })
  //     :
  //     /// Delete 
  //     this.areasHttpService.observable_delete((ApiArea.payroll + ApiController.Overtime + "/DeleteRequest/" + 
  //     this.request.overtimeRequestId),
  //       { 'headers': { 'Content-Type': 'application/json' }, observe: 'response', params: {} })

  //   request.subscribe((response) => {
  //     let result = response as any;
  //     if (result?.status == 200) {
  //       this.utilityService.success(result.body.message, "Server Response")
  //       this.modalService.service.dismissAll("Save Complete");
  //       this.getAllRequest(this.status);
  //     }
  //     else {
  //       this.utilityService.fail('Something went wrong', "Server Response")
  //     }
  //   },
  //     (error) => {
  //       if (error.havingValidationError) {
  //         Object.keys(error.validationErrors).forEach((propertyName: string) => {
  //           var errorMessages: string[] = error.validationErrors[propertyName];
  //           //errorMessages.push('The sfdsfs field is required 2');
  //           //console.log(`Property : ${propertyName}  ${errorMessages.join(' | ')}`);
  //           this.utilityService.fail(`Property : ${propertyName}` + ` ${errorMessages.join(' | ')}`, "Server Response")
  //         });
  //       }
  //       else {
  //         this.utilityService.fail(error.msg?.message, "Server Response")
  //       }
  //     }
  //   )
  // }

  //API Calls Ends

}
