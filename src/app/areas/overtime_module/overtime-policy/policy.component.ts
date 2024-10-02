import { transition, trigger, useAnimation } from '@angular/animations';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { bounceIn, fadeIn, fadeInRight, slideInUp } from 'ng-animate';
import { ApiArea, ApiController, AppConstants } from 'src/app/shared/constants';
import { CustomModalService } from 'src/app/shared/services/custom-modal.service';
import { UserService } from 'src/app/shared/services/user.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { Select2OptionData } from 'ng-select2';
import { OvertimePolicy } from 'src/models/payroll/overtime/overtime-policy';
import { OvertimeConfiguration } from 'src/models/payroll/overtime/overtime-configuration';
import { AreasHttpService } from '../../areas.http.service';

@Component({
  selector: 'overtime-policy',
  templateUrl: './policy.component.html',
  animations: [
    trigger('slideInUp', [transition('* => *', useAnimation(slideInUp, { params: { timing: 0.5 } }))]),
    trigger('fadeIn', [transition('void => *', useAnimation(fadeIn, { params: { timing: 0.3 } }))]),
    trigger('fadeInRight', [transition('void => *', useAnimation(fadeInRight, { params: { timing: 0.5 } }))]),
    trigger('bounceIn', [transition('void => *', useAnimation(bounceIn, { params: { timing: 1 } }))]),
  ],
})
export class OvertimePolicyComponent implements OnInit {

  @ViewChild('overtimePolicyModal', { static: true }) overtimePolicyModal!: ElementRef;
  @ViewChild('approverDetailsModal', { static: true }) approverDetailsModal!: ElementRef;

  modalTitle: string;
  buttonAction: string = 'Submit';
  fieldsetDisabled : boolean = false;
  policy : OvertimePolicy;
  policyList : OvertimePolicy[];
  configurations : OvertimeConfiguration;
  units : Array<Select2OptionData>;
  amountTypes : Array<Select2OptionData>; 

  constructor(public modalService: CustomModalService, private areasHttpService: AreasHttpService, private userService: UserService, private utilityService: UtilityService) { }

  ngOnInit(): void {
    this.modalTitle = "";

    this.policy =  new OvertimePolicy();
    this.policyList = [];
    this.configurations = new OvertimeConfiguration();
    this.units=[];
    this.amountTypes =[];

    this.getAllPolicy();
    this.getConfigurations();
    
  }

  User() { return this.userService.User(); }
  logger(msg: any, optionsParams: any) { this.utilityService.consoleLog(msg, optionsParams) }

  // Functions Starts
  onUnitChange(){
    //console.log(this.policy.unit);
  }
  onAmountTypeChange(){
     // console.log(this.policy.amountType);
     this.policy.amount=0;
     this.policy.amountRate=1;
     
    if(this.policy.amountType.toLocaleLowerCase().includes("flat")){
      this.policy.isFlatAmountType = true;
      this.policy.isPercentageAmountType = false;
    }
    else{
      this.policy.isPercentageAmountType = true;
      this.policy.isFlatAmountType = false;
    }
   
  }

  onLimitationOfUnit(){
    this.policy.minUnit=0;
    this.policy.maxUnit=0;

    if (this.policy.limitationOfUnit.toString() == AppConstants.True) {
      this.policy.limitationOfUnit = true;
    } else {
      this.policy.limitationOfUnit = false;
    }
    //console.log(this.policy.limitationOfUnit);
  }

  onLimitationOfAmount(){ 
    this.policy.minAmount=0;
    this.policy.maxAmount=0;

    if (this.policy.limitationOfAmount.toString() == AppConstants.True) {
      this.policy.limitationOfAmount = true;
    } else {
      this.policy.limitationOfAmount = false;
    }
    //console.log(this.policy.limitationOfAmount);
  }
  

  // Functions Ends
  
  // Modals Starts

  openOvertimePolicyModal(id: number, action : string) {
    
    this.policy = new OvertimePolicy();
    if(action == 'Create'){
      this.fieldsetDisabled = false;
      this.modalTitle = "Overtime Policy";
      this.buttonAction = 'Submit';
      this.modalService.open(this.overtimePolicyModal, 'lg');
    }
    else{
      
      if(action == 'Edit'){
        this.fieldsetDisabled = false;
        this.modalTitle = "Edit Overtime Policy";
        this.buttonAction = "Update";
      }
      else if (action == 'Delete'){
        this.fieldsetDisabled = true;
        this.modalTitle = "Delete Policy";
        this.buttonAction = "Delete";
      }

      this.policy = Object.assign({},this.policyList.find(x=>x.overtimeId==id));
      this.modalService.open(this.overtimePolicyModal, 'lg');
    }
  }
  //Modals End


  //API Calls Starts  

  getAllPolicy() {
    var request = this.areasHttpService.observable_get<OvertimePolicy[]>((ApiArea.payroll + ApiController.Overtime + "/GetAllPolicy"), {
      responseType: "json", observe: 'response', params: {}
    });

    request.subscribe((response) => {
      let result = response as any;
      if (result?.status == 200) {
        this.policyList = result.body as OvertimePolicy[];
      }},
      (error) => {
        if (error?.status == 404) {
          this.policyList = [];
        }
        this.utilityService.fail(error.msg?.message, "Server Response");
      }
    )
  }

  getConfigurations() {
    var request = this.areasHttpService.observable_get<OvertimeConfiguration[]>((ApiArea.payroll + ApiController.Overtime + "/CreatePolicy"), {
      responseType: "json", observe: 'response', params: {}
    });

    request.subscribe((response) => {
      let result = response as any;
      if (result?.status == 200) {
        this.configurations = result.body as OvertimeConfiguration;

        this.configurations.units.forEach((x=>{
          this.units.push({id : x.name.toString(), text : x.name});
        }))
        this.configurations.amountTypes.forEach((x=>{
          this.amountTypes.push({id : x.name.toString(), text : x.name});
        }))
      }},
      (error) => {
        if (error?.status == 404) {
          this.configurations = new OvertimeConfiguration();
        }
        this.utilityService.fail(error.msg?.message, "Server Response");
      }
    )
  }

  overtimePolicyMappingForm(form: NgForm) {
    // console.log(form);
    // console.log(this.policy);

    var request = 

    this.buttonAction == "Submit" ?
      /// Save  
      this.areasHttpService.observable_post((ApiArea.payroll + ApiController.Overtime + "/SavePolicy"),
      
      JSON.stringify(this.policy), 
      { 'headers': { 'Content-Type': 'application/json' }, observe: 'response', params: {} })
      :
      /// Update
      this.buttonAction == "Update" ?
      this.areasHttpService.observable_put((ApiArea.payroll + ApiController.Overtime + "/UpdatePolicy/" + 
      this.policy.overtimeId),
        JSON.stringify(this.policy), { 'headers': { 'Content-Type': 'application/json' }, observe: 'response', params: {} })
      :
      /// Delete 
      this.areasHttpService.observable_delete((ApiArea.payroll + ApiController.Overtime + "/DeletePolicy/" + 
      this.policy.overtimeId),
        { 'headers': { 'Content-Type': 'application/json' }, observe: 'response', params: {} })

    request.subscribe((response) => {
      let result = response as any;
      if (result?.status == 200) {
        this.utilityService.success(result.body.message, "Server Response")
        this.modalService.service.dismissAll("Save Complete");
        this.getAllPolicy();
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

  //API Calls Ends

  select2Options = {
    width: "100%",
    containerCssClass: "form-control form-control-sm text-x-small font-bold",
    theme: "bootstrap4"
  }

}
