import { transition, trigger, useAnimation } from '@angular/animations';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { bounceIn, fadeIn, fadeInRight, slideInUp } from 'ng-animate';
import { ApiArea, ApiController } from 'src/app/shared/constants';
import { CustomModalService } from 'src/app/shared/services/custom-modal.service';
import { UserService } from 'src/app/shared/services/user.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { OvertimeApprovalLevel } from 'src/models/payroll/overtime/overtime-approval-level';
import { AreasHttpService } from '../../areas.http.service';

@Component({
  selector: 'approval-level',
  templateUrl: './approval-level.component.html',
  animations: [
    trigger('slideInUp', [transition('* => *', useAnimation(slideInUp, { params: { timing: 0.5 } }))]),
    trigger('fadeIn', [transition('void => *', useAnimation(fadeIn, { params: { timing: 0.3 } }))]),
    trigger('fadeInRight', [transition('void => *', useAnimation(fadeInRight, { params: { timing: 0.5 } }))]),
    trigger('bounceIn', [transition('void => *', useAnimation(bounceIn, { params: { timing: 1 } }))]),
  ],
})
export class OvertimeApprovalLevelComponent implements OnInit {

  @ViewChild('overtimeApprovalLevelModal', { static: true }) overtimeApprovalLevelModal!: ElementRef;

  modalTitle: string;
  buttonAction: string = 'Submit';
  btnApprovalLevel: boolean = false;
  overtimeApprovalLevel: OvertimeApprovalLevel;
  overtimeApprovalLevelList: OvertimeApprovalLevel[];
  fieldsetDisabled : boolean = false;

  constructor(public modalService: CustomModalService, private areasHttpService: AreasHttpService, private userService: UserService, private utilityService: UtilityService) { }

  ngOnInit(): void {
    this.modalTitle = "";
    this.overtimeApprovalLevel = new OvertimeApprovalLevel();
    this.overtimeApprovalLevelList = [];
    this.getApprovalLevels();
  }

  User() { return this.userService.User(); }
  logger(msg: any, optionsParams: any) { this.utilityService.consoleLog(msg, optionsParams) }


  openOvertimeApprovalLevelModal(id: number, action : string) {

    if(action == 'Create'){
      this.fieldsetDisabled = false;
      this.buttonAction ='Submit';
      this.overtimeApprovalLevel = new OvertimeApprovalLevel();
      this.modalTitle = "Overtime Approval Level";
      this.modalService.open(this.overtimeApprovalLevelModal, 'lg');

    }
    else{
      
      if(action == 'Edit'){
        this.fieldsetDisabled = false;
        this.modalTitle = "Edit Approval Level";
        this.buttonAction = "Update";
        
      }
      else if (action == 'Delete'){
        this.fieldsetDisabled = true;
        this.modalTitle = "Delete Approval Level";
        this.buttonAction = "Delete";
      }
        this.overtimeApprovalLevel = Object.assign({}, this.overtimeApprovalLevelList.find(x => x.overtimeApprovalLevelId == id));
        this.modalService.open(this.overtimeApprovalLevelModal, 'lg');
    }
  }

  getApprovalLevels() {
    var request = this.areasHttpService.observable_get<OvertimeApprovalLevel[]>((ApiArea.payroll + ApiController.Overtime + "/GetAllApprovalLevel"), {
      responseType: "json", observe: 'response', params: {}
    });

    request.subscribe((response) => {
      let result = response as any;
      if (result?.status == 200) {
        this.overtimeApprovalLevelList = result.body as OvertimeApprovalLevel[];
      }},
      (error) => {
        if (error?.status == 404) {
          this.overtimeApprovalLevelList = [];
        }
        this.utilityService.fail(error.msg?.message, "Server Response");
      }
    )
  }

  submitOvertimeApprovalLevelForm(form: NgForm) {

    var request = this.buttonAction == "Submit" ?
      /// Save  
      this.areasHttpService.observable_post((ApiArea.payroll + ApiController.Overtime + "/SaveApprovalLevel"),
        JSON.stringify(this.overtimeApprovalLevel), { 'headers': { 'Content-Type': 'application/json' }, observe: 'response', params: {} })
      :
      /// Update
      this.buttonAction == "Update" ?
      this.areasHttpService.observable_put((ApiArea.payroll + ApiController.Overtime + "/UpdateApprovalLevel/" + this.overtimeApprovalLevel.overtimeApprovalLevelId),
        JSON.stringify(this.overtimeApprovalLevel), { 'headers': { 'Content-Type': 'application/json' }, observe: 'response', params: {} })
      
      :
      /// Delete
      this.areasHttpService.observable_delete((ApiArea.payroll + ApiController.Overtime + "/DeleteApprovalLevel/" + this.overtimeApprovalLevel.overtimeApprovalLevelId),
        { 'headers': { 'Content-Type': 'application/json' }, observe: 'response', params: {} })

    request.subscribe((response) => {
      let result = response as any;
      if (result?.status == 200) {
        this.utilityService.success(result.body.message, "Server Response")
        this.modalService.service.dismissAll("Save Complete");
        this.overtimeApprovalLevel = new OvertimeApprovalLevel();
        this.getApprovalLevels();
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

}
