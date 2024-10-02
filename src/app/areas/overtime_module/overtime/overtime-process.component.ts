import { transition, trigger, useAnimation } from '@angular/animations';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { bounceIn, fadeIn, fadeInRight, slideInUp } from 'ng-animate';
import { Select2OptionData } from 'ng-select2';
import { ApiArea, ApiController } from 'src/app/shared/constants';
import { CustomModalService } from 'src/app/shared/services/custom-modal.service';
import { UserService } from 'src/app/shared/services/user.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { OvertimeProcess } from 'src/models/payroll/overtime/overtime-process';
import { AreasHttpService } from '../../areas.http.service';

@Component({
  selector: 'overtime-process',
  templateUrl: './overtime-process.component.html',
  animations: [
    trigger('slideInUp', [transition('* => *', useAnimation(slideInUp, { params: { timing: 0.5 } }))]),
    trigger('fadeIn', [transition('void => *', useAnimation(fadeIn, { params: { timing: 0.3 } }))]),
    trigger('fadeInRight', [transition('void => *', useAnimation(fadeInRight, { params: { timing: 0.5 } }))]),
    trigger('bounceIn', [transition('void => *', useAnimation(bounceIn, { params: { timing: 1 } }))]),
  ],
})
export class OvertimeProcessComponent implements OnInit {

  @ViewChild('overtimeProcessModal', { static: true }) overtimeProcessModal!: ElementRef;

  modalTitle: string;
  buttonAction: string = 'Submit';
  btnApprovalLevel: boolean = false;
  overtimeProcess: OvertimeProcess;
  overtimeProcessList: OvertimeProcess[];
  fieldsetDisabled : boolean = false;
  months : Array<Select2OptionData>;
  years : Array<Select2OptionData>;

  constructor(public modalService: CustomModalService, private areasHttpService: AreasHttpService, private userService: UserService, private utilityService: UtilityService) { }

  ngOnInit(): void {
    this.modalTitle = "";
    this.overtimeProcess = new OvertimeProcess();
    this.months=[];
    this.years=[];
    this.overtimeProcessList = [];
    this.getMonths();
    this.getYears();
    this.getOvertimeProcess();
    
  }
  onYearChange(){
    this.overtimeProcess.year;
  }
  onMonthChange(){
    this.overtimeProcess.month;
  }

  getMonths() {
    this.months = [];
    this.utilityService.getMonths().forEach((x)=>{this.months.push({id : x.monthNo.toString(), text : x.month});});
    
  }

  getYears() {
    this.years = [];
    this.utilityService.getYears(2).forEach((x)=>{this.years.push({id : x.toString(), text : x.toString()});});
  }

  User() { return this.userService.User(); }
  logger(msg: any, optionsParams: any) { this.utilityService.consoleLog(msg, optionsParams) }


  openOvertimeProcessModal(id: number, action : string) {

    if(action == 'Create'){
      this.fieldsetDisabled = false;
      this.buttonAction ='Submit';
      this.overtimeProcess = new OvertimeProcess();
      this.modalTitle = "Overtime Process";
      this.modalService.open(this.overtimeProcessModal, 'lg');

    }
    else{
      
        this.overtimeProcess = Object.assign({}, this.overtimeProcessList.find(x => x.id == id));
        var salaryMonth =  new Date(this.overtimeProcess.salaryMonth);
        this.overtimeProcess.month = salaryMonth.getUTCMonth() + 1;
        this.overtimeProcess.year = salaryMonth.getUTCFullYear();

      if(action == 'Disburse'){
        this.fieldsetDisabled = true;
        this.modalTitle = "Disburse Overtime Process";
        this.buttonAction = "Disburse";
        this.overtimeProcess.isDisbursed = true;
      }

      else if (action == 'Roll Back'){
        this.fieldsetDisabled = true;
        this.modalTitle = "Roll Back Overtime Process";
        this.buttonAction = "Roll Back";
      }
        
        this.modalService.open(this.overtimeProcessModal, 'lg');

    }
  }

  getOvertimeProcess() {
    var request = this.areasHttpService.observable_get<OvertimeProcess[]>((ApiArea.payroll + ApiController.Overtime + "/GetAllProcess"), {
      responseType: "json", observe: 'response', params: {}
    });

    request.subscribe((response) => {
      let result = response as any;
      if (result?.status == 200) {
        this.overtimeProcessList = result.body as OvertimeProcess[];
      }},
      (error) => {
        if (error?.status == 404) {
          this.overtimeProcessList = [];
        }
        this.utilityService.fail(error.msg?.message, "Server Response");
      }
    )
  }

  submitOvertimeProcessForm(form: NgForm) {

    var request = this.buttonAction == "Submit" ?
      /// Save  
      this.areasHttpService.observable_post((ApiArea.payroll + ApiController.Overtime + "/Process"),
        JSON.stringify(this.overtimeProcess), { 'headers': { 'Content-Type': 'application/json' }, observe: 'response', params: {} })
      :
      /// Update
      this.buttonAction == "Disburse" ?
      this.areasHttpService.observable_put((ApiArea.payroll + ApiController.Overtime + "/Disburse/" + this.overtimeProcess.id),
        JSON.stringify(this.overtimeProcess), { 'headers': { 'Content-Type': 'application/json' }, observe: 'response', params: {} })
      
      :

      /// Roll Back
      this.buttonAction == "Roll Back" ?
      this.areasHttpService.observable_delete((ApiArea.payroll + ApiController.Overtime + "/Roll-Back/" + this.overtimeProcess.id),
         { 'headers': { 'Content-Type': 'application/json' }, observe: 'response', params: {} })
      
      :
      
      /// Delete
      this.areasHttpService.observable_delete((ApiArea.payroll + ApiController.Overtime + "/Delete-Api/" + this.overtimeProcess.id),
        { 'headers': { 'Content-Type': 'application/json' }, observe: 'response', params: {} })

    request.subscribe((response) => {
      let result = response as any;
      if (result?.status == 200) {
        this.utilityService.success(result.body.message, "Server Response")
        this.modalService.service.dismissAll("Save Complete");
        this.overtimeProcess = new OvertimeProcess();
        this.getOvertimeProcess();
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

  select2Options = {
    width: "100%",
    containerCssClass: "form-control form-control-sm text-x-small font-bold",
    theme: "bootstrap4"
  }

}
