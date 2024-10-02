import { transition, trigger, useAnimation } from '@angular/animations';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { bounceIn, fadeIn, fadeInRight, slideInUp } from 'ng-animate';
import { parse } from 'path';
import { ApiArea, ApiController, AppConstants } from 'src/app/shared/constants';
import { CustomModalService } from 'src/app/shared/services/custom-modal.service';
import { UserService } from 'src/app/shared/services/user.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { OvertimeApprover } from 'src/models/payroll/overtime/overtime-approver';
import { Select2OptionData } from 'ng-select2';
import { AreasHttpService } from '../../areas.http.service';

@Component({
  selector: 'overtime-approver-assignment',
  templateUrl: './approver-assignment.component.html',
  animations: [
    trigger('slideInUp', [transition('* => *', useAnimation(slideInUp, { params: { timing: 0.5 } }))]),
    trigger('fadeIn', [transition('void => *', useAnimation(fadeIn, { params: { timing: 0.3 } }))]),
    trigger('fadeInRight', [transition('void => *', useAnimation(fadeInRight, { params: { timing: 0.5 } }))]),
    trigger('bounceIn', [transition('void => *', useAnimation(bounceIn, { params: { timing: 1 } }))]),
  ],
})
export class OvertimeApproverAssignmentComponent implements OnInit {

  @ViewChild('overtimeApproverModal', { static: true }) overtimeApproverModal!: ElementRef;
  @ViewChild('proxyApproverDetailsModal', { static: true }) proxyApproverDetailsModal!: ElementRef;

  modalTitle: string;
  buttonAction: string = 'Submit';
  disableEmployeeSelection : boolean = false;
  fieldsetDisabled : boolean = false;
  overtimeApprover: OvertimeApprover;
  select2OptionData : Array<Select2OptionData>;
  employeeList: OvertimeApprover[];
  overtimeApproverList: OvertimeApprover[];
  proxyApproverList: OvertimeApprover[];

  constructor(public modalService: CustomModalService, private areasHttpService: AreasHttpService, private userService: UserService, private utilityService: UtilityService) { }

  ngOnInit(): void {
    this.modalTitle = "";
    this.overtimeApprover = new OvertimeApprover();
    this.select2OptionData = new Array<Select2OptionData>();
    this.employeeList=[];
    this.overtimeApproverList = [];
    this.proxyApproverList = [];
    this.getAllOvertimeApprovers();
    
  }

  User() { return this.userService.User(); }
  logger(msg: any, optionsParams: any) { this.utilityService.consoleLog(msg, optionsParams) }

  // Functions Starts
  onEmployeeIdChange(){
    //console.log(this.overtimeApprover.employeeId.toString());
  }

  onActiveChange()
  {
    if (this.overtimeApprover.isActive.toString() == AppConstants.True) {
      this.overtimeApprover.isActive = true;
    } else {
     this.overtimeApprover.isActive = false;
    }
  }
  onProxyEnableChange() {
    
    if (this.overtimeApprover.proxyEnabled.toString() == AppConstants.True) {
      this.overtimeApprover.proxyEnabled = true;
    } else {
      this.overtimeApprover.proxyEnabled = false;
      this.overtimeApprover.proxyApproverId = 0;
    }
  }

  getSelect2OptionData(){
    this.select2OptionData = [];
    this.employeeList.forEach((x)=>{
      this.select2OptionData.push({id : x.employeeId.toString(), text : x.name + ' (' + x.employeeCode + ')'});
    });
    //console.log(this.select2OptionData);
  }

  // Functions Ends
  
  // Modals Starts

  openProxyApproverDetailsModal(id: number) {
    this.modalTitle = "Proxy Approver Details";
    this.overtimeApprover = Object.assign({}, this.overtimeApproverList.find(x => x.overtimeApproverId == id));
    this.modalService.open(this.proxyApproverDetailsModal, 'lg');
  }
  openOvertimeApproverModal(id: number, action : string) {
    
    if(action == 'Create'){
      this.fieldsetDisabled = false;
      this.modalTitle = "Overtime Approver Assignment";
      this.buttonAction ='Submit';
      this.overtimeApprover = new OvertimeApprover();
      this.disableEmployeeSelection = false;
      this.getAvailableEmployeeForApproverList();
      this.proxyApproverList = this.overtimeApproverList;
      this.modalService.open(this.overtimeApproverModal, 'lg');

    }
    else{
      
      if(action == 'Edit'){
        this.fieldsetDisabled = false;
        this.modalTitle = "Edit Overtime Approver Assignment";
        this.buttonAction = "Update";
      }
      else if (action == 'Delete'){
        this.fieldsetDisabled = true;
        this.modalTitle = "Delete Overtime Approver Assignment";
        this.buttonAction = "Delete";
      }

      this.disableEmployeeSelection = true;
      this.overtimeApprover = Object.assign({}, this.overtimeApproverList.find(x => x.overtimeApproverId == id));
      this.employeeList = [this.overtimeApproverList.find(x => x.overtimeApproverId == id)];
      this.proxyApproverList = this.overtimeApproverList.filter((value)=> value.overtimeApproverId != id);
      this.getSelect2OptionData();
      this.modalService.open(this.overtimeApproverModal, 'lg');
    }
  }
  //Modals End


  //API Calls Starts

  getAllOvertimeApprovers() {
    var request = this.areasHttpService.observable_get<OvertimeApprover[]>((ApiArea.payroll + ApiController.Overtime + "/GetAllApprover"), {
      responseType: "json", observe: 'response', params: {}
    });

    request.subscribe((response) => {
      let result = response as any;
      if (result?.status == 200) {
        this.overtimeApproverList = result.body as OvertimeApprover[];
      }},
      (error) => {
        if (error?.status == 404) {
          this.overtimeApproverList = [];
        }
        this.utilityService.fail(error.msg?.message, "Server Response");
      }
    )
  }

  getAvailableEmployeeForApproverList() {
    var request = this.areasHttpService.observable_get<OvertimeApprover[]>((ApiArea.payroll + ApiController.Overtime + "/CreateApprover"), {
        responseType: "json", observe: 'response', params: {}
    });

    request.subscribe((response) => {
      let result = response as any;
      if (result?.status == 200) {
        this.employeeList = result.body as OvertimeApprover[]
        this.getSelect2OptionData();
      }
      
    },
      (error) => {
        if (error?.status == 404) {
          this.employeeList = [];
        }
        this.utilityService.fail(error.msg?.message, "Server Response");
      }
    )
  }

  overtimeApproverAssignmentForm(form: NgForm) {
    console.log(form);

    var request = 

    this.buttonAction == "Submit" ?
      /// Save  
      this.areasHttpService.observable_post((ApiArea.payroll + ApiController.Overtime + "/SaveApprover"),
      //Backend endpoint received List of overtimeApprover. Send as Arrey List [this.overtimeApprover]
      JSON.stringify([this.overtimeApprover]), { 'headers': { 'Content-Type': 'application/json' }, observe: 'response', params: {} })
      :
      /// Update
      this.buttonAction == "Update" ?
      this.areasHttpService.observable_put((ApiArea.payroll + ApiController.Overtime + "/UpdateApprover/" + this.overtimeApprover.overtimeApproverId),
        JSON.stringify(this.overtimeApprover), { 'headers': { 'Content-Type': 'application/json' }, observe: 'response', params: {} })
      :
      /// Delete
      this.areasHttpService.observable_delete((ApiArea.payroll + ApiController.Overtime + "/DeleteApprover/" + this.overtimeApprover.overtimeApproverId),
        { 'headers': { 'Content-Type': 'application/json' }, observe: 'response', params: {} })

    request.subscribe((response) => {
      let result = response as any;
      if (result?.status == 200) {
        this.utilityService.success(result.body.message, "Server Response")
        this.modalService.service.dismissAll("Save Complete");
        this.overtimeApprover = new OvertimeApprover();
        this.getAllOvertimeApprovers();
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
            //console.log(`Property : ${propertyName}` + ` ${errorMessages.join(' | ')}`);
            this.utilityService.fail(`Property : ${propertyName}` + ` ${errorMessages.join(' | ')}`, "Server Response")
          });
        }
        else {
          this.utilityService.fail(error.msg?.message, "Server Response")
        }
      }
    )
  }

  //API Calls Ends

  select2Options = {
    width: "100%",
    containerCssClass: "form-control form-control-sm text-x-small font-bold",
    theme: "bootstrap4"
  }

}
