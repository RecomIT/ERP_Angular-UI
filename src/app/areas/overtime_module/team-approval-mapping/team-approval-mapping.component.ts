import { transition, trigger, useAnimation } from '@angular/animations';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { bounceIn, fadeIn, fadeInRight, slideInUp } from 'ng-animate';
import { ApiArea, ApiController } from 'src/app/shared/constants';
import { CustomModalService } from 'src/app/shared/services/custom-modal.service';
import { UserService } from 'src/app/shared/services/user.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { OvertimeApprover } from 'src/models/payroll/overtime/overtime-approver';
import { Select2OptionData } from 'ng-select2';
import { OvertimeTeamApprovalMapping } from 'src/models/payroll/overtime/overtime-team-approval-mapping';
import { OvertimeEmployeeApproverMapping } from 'src/models/payroll/overtime/overtime-employee-approver-mapping';
import { OvertimeEmployee } from 'src/models/payroll/overtime/overtime-employee';
import { AreasHttpService } from '../../areas.http.service';

@Component({
  selector: 'overtime-team-approval-mapping',
  templateUrl: './team-approval-mapping.component.html',
  animations: [
    trigger('slideInUp', [transition('* => *', useAnimation(slideInUp, { params: { timing: 0.5 } }))]),
    trigger('fadeIn', [transition('void => *', useAnimation(fadeIn, { params: { timing: 0.3 } }))]),
    trigger('fadeInRight', [transition('void => *', useAnimation(fadeInRight, { params: { timing: 0.5 } }))]),
    trigger('bounceIn', [transition('void => *', useAnimation(bounceIn, { params: { timing: 1 } }))]),
  ],
})
export class OvertimeTeamApprovalMappingComponent implements OnInit {

  @ViewChild('overtimeTeamApprovalMappingModal', { static: true }) overtimeTeamApprovalMappingModal!: ElementRef;
  @ViewChild('approverDetailsModal', { static: true }) approverDetailsModal!: ElementRef;

  modalTitle: string;
  buttonAction: string = 'Submit';
  disableEmployeeSelection : boolean = false;
  fieldsetDisabled : boolean = false;
  lavelDisabled : boolean = false;

  select2OptionDataforApprover : Array<Select2OptionData>;
  select2OptionDataforEmployee : Array<Select2OptionData>;

  //selectedEmployeeList :  OvertimeEmployee[];

  approver: OvertimeApprover;
  approverList: OvertimeApprover[];

  teamApprovalMapping : OvertimeTeamApprovalMapping; //N 
  teamApprovalMappingList : OvertimeTeamApprovalMapping[]; //N

  employeeApproverMapping : OvertimeEmployeeApproverMapping;//N
  employeeApproverMappingList : OvertimeEmployeeApproverMapping[]//N


  constructor(public modalService: CustomModalService, private areasHttpService: AreasHttpService, private userService: UserService, private utilityService: UtilityService) { }

  ngOnInit(): void {
    this.modalTitle = "";

    this.approver = new OvertimeApprover();
    this.approverList = [];

    this.teamApprovalMapping = new OvertimeTeamApprovalMapping();//N
    this.teamApprovalMappingList=[];//N

    this.employeeApproverMapping = new OvertimeEmployeeApproverMapping();//N
    this.employeeApproverMappingList = [];//N

    //this.selectedEmployeeList =[];

    this.select2OptionDataforApprover = new Array<Select2OptionData>();
    this.select2OptionDataforEmployee = new Array<Select2OptionData>();


    this.getAllTeamApprovalMapping();
    this.getAllApproverList();
    
  }

  User() { return this.userService.User(); }
  logger(msg: any, optionsParams: any) { this.utilityService.consoleLog(msg, optionsParams) }

  // Functions Starts
  onApproverIdChange(){

    //Call CreateOvertimeTeamApprovalMapping API
    this.getAvailableEmployeeForSelectedApprover(this.teamApprovalMapping.approver.overtimeApproverId);
    this.teamApprovalMapping.selectedEmployeeId = "0";
    this.teamApprovalMapping.selectedEmployeeList =[];
  }

  onSelectedEmployeeIdChange(){

    var employee = this.teamApprovalMapping.teamMembers.find(x=>x.employeeId.toString() == this.teamApprovalMapping.selectedEmployeeId);
    var alreadySelected = this.teamApprovalMapping.selectedEmployeeList.find(x=>x.employeeId.toString() == this.teamApprovalMapping.selectedEmployeeId);
    if(employee != null && alreadySelected == null){
      this.teamApprovalMapping.selectedEmployeeList.push(employee);
      //console.log(this.selectedEmployeeList);
    }
  }
  onSelectedEmployeeChipClick(employee: OvertimeEmployee){
   
    this.teamApprovalMapping.selectedEmployeeList = this.teamApprovalMapping.selectedEmployeeList.filter(x => x.employeeId !== employee.employeeId);
    //console.log(this.selectedEmployeeList);

  }

  generateApproverDropDownList(){
    this.select2OptionDataforApprover = [];
    this.approverList.forEach((x)=>{this.select2OptionDataforApprover.push({id : x.overtimeApproverId.toString(), text : x.name + ' (' + x.employeeCode + ')'});});
    //console.log(this.select2OptionData);
  }

  generateEmployeeDropDownList(){
    this.select2OptionDataforEmployee = [];
    this.teamApprovalMapping.teamMembers.forEach((x)=>{this.select2OptionDataforEmployee.push({id : x.employeeId.toString(), text : x.name + ' (' + x.employeeCode + ')'});});
    //console.log(this.select2OptionDataforEmployee);
  }

  // Functions Ends
  
  // Modals Starts

  openApproverDetailsModal(approver: OvertimeApprover) {
    this.modalTitle = "Approver Details";
    this.approver = Object.assign({}, approver);
    this.modalService.open(this.approverDetailsModal, 'lg');
  }

  openOvertimeTeamApprovalMappingModal(id: number, action : string) {
    
    // Creating  Approver List for Select2OptionData from this.approverList;
    this.generateApproverDropDownList();
    
    if(action == 'Create'){
      this.fieldsetDisabled = false;
      this.lavelDisabled = false;
      this.modalTitle = "Overtime Team Approval Mapping";
      this.buttonAction = 'Submit';
      
      this.teamApprovalMapping = new OvertimeTeamApprovalMapping();
      this.select2OptionDataforEmployee = [];
      this.modalService.open(this.overtimeTeamApprovalMappingModal, 'lg');
    }
    else{
      
      if(action == 'Edit'){
        this.fieldsetDisabled = true;
        this.lavelDisabled = false;
        this.modalTitle = "Edit Overtime Team Approval Mapping";
        this.buttonAction = "Update";
      }
      else if (action == 'Delete'){
        this.fieldsetDisabled = true;
        this.lavelDisabled = true;
        this.modalTitle = "Delete Overtime Team Approval Mapping";
        this.buttonAction = "Delete";
      }

      
      
      var selectedEmployee = this.employeeApproverMappingList.find(x=>x.overtimeTeamApprovalMappingId == id);
      this.teamApprovalMapping = new OvertimeTeamApprovalMapping();
      this.teamApprovalMapping.overtimeTeamApprovalMappingId = id;
      this.teamApprovalMapping.approvalLevel = selectedEmployee.approvalLevel;
      this.teamApprovalMapping.approver = selectedEmployee.approver;
      this.teamApprovalMapping.maxApprovalLevel = selectedEmployee.maxApprovalLevel;
      this.teamApprovalMapping.minApprovalLevel = selectedEmployee.minApprovalLevel;
      this.teamApprovalMapping.teamMembers.push(selectedEmployee.employee);
      this.teamApprovalMapping.selectedEmployeeId = selectedEmployee.employee.employeeId.toString(); //teamApprovalMapping.selectedEmployeeId
      this.teamApprovalMapping.selectedEmployeeList.push(selectedEmployee.employee);
      this.generateEmployeeDropDownList();

      this.modalService.open(this.overtimeTeamApprovalMappingModal, 'lg');
    }
  }
  //Modals End


  //API Calls Starts  

  getAllTeamApprovalMapping() {
    var request = this.areasHttpService.observable_get<OvertimeTeamApprovalMapping[]>((ApiArea.payroll + ApiController.Overtime + "/GetAllTeamApprovalMapping"), {
      responseType: "json", observe: 'response', params: {}
    });

    request.subscribe((response) => {
      let result = response as any;
      if (result?.status == 200) {
        
        //this.approverList = result.body as OvertimeApprover[];
        this.teamApprovalMappingList = result.body as OvertimeTeamApprovalMapping[];
        this.employeeApproverMappingList = [];

        this.teamApprovalMappingList.forEach(mappings => {
          mappings.teamMembers.forEach((member)=>{

            var obj = new OvertimeEmployeeApproverMapping();
            obj.overtimeTeamApprovalMappingId = member.overtimeTeamApprovalMappingId;
            obj.approver = mappings.approver;
            obj.employee = member;
            obj.approvalLevel = member.approvalLevel;
            obj.minApprovalLevel= mappings.minApprovalLevel;
            obj.maxApprovalLevel = mappings.maxApprovalLevel;
            this.employeeApproverMappingList.push(obj);

            this.employeeApproverMappingList.sort((n1,n2) => {
              //Sort By Created Date
              return new Date(n2.employee.createdDate).getTime() - new Date(n1.employee.createdDate).getTime() 
              // if (new Date(n2.employee.createdDate).getTime() > new Date(n1.employee.createdDate).getTime() ) {return 1;} 
              // if (new Date(n2.employee.createdDate).getTime() < new Date(n1.employee.createdDate).getTime() ) {return -1;} 
             
              //Sort By employeeId 
              // return n2.employee.employeeId - n1.employee.employeeId  //Desc
              // if (n1.employee.employeeId > n2.employee.employeeId ) {return 1;} 
              // if (n1.employee.employeeId < n2.employee.employeeId ) {return -1;} 

              //Sort By approvalLevel
              // return n2.employee.approvalLevel - n1.employee.approvalLevel //Desc
              // if (n1.employee.approvalLevel > n2.employee.approvalLevel ) {return 1;} 
              // if (n1.employee.approvalLevel < n2.employee.approvalLevel ) {return -1;} 
              //return 0;
            });
          })
        });

      }},
      (error) => {
        if (error?.status == 404) {
          this.teamApprovalMappingList = [];
          this.employeeApproverMappingList = [];
        }
        this.utilityService.fail(error.msg?.message, "Server Response");
      }
    )
  }

  getAllApproverList() {
    var request = this.areasHttpService.observable_get<OvertimeApprover[]>((ApiArea.payroll + ApiController.Overtime + "/GetAllApprover"), {
      responseType: "json", observe: 'response', params: {}
    });

    request.subscribe((response) => {
      let result = response as any;
      if (result?.status == 200) {
        this.approverList = result.body as OvertimeApprover[];
      }},
      (error) => {
        if (error?.status == 404) {
          this.approverList = [];
        }
        this.utilityService.fail(error.msg?.message, "Server Response");
      }
    )
  }

  getAvailableEmployeeForSelectedApprover(id : number) {
    var request = this.areasHttpService.observable_get<OvertimeTeamApprovalMapping>((ApiArea.payroll + ApiController.Overtime + "/CreateTeamApprovalMapping?overtimeApproverId=" + id), {
        responseType: "json", observe: 'response', params: {}
    });

    request.subscribe((response) => {
      let result = response as any;
      if (result?.status == 200) {
        this.teamApprovalMapping  = result.body as  OvertimeTeamApprovalMapping;
        this.teamApprovalMapping.selectedEmployeeList = [];
        this.generateEmployeeDropDownList();
      }
    },
      (error) => {
        if (error?.status == 404) {
          this.teamApprovalMapping = new OvertimeTeamApprovalMapping();
        }
        this.utilityService.fail(error.msg?.message, "Server Response");
      }
    )
  }

  overtimeTeamApprovalMappingForm(form: NgForm) {
    //console.log(form);
    //console.log(this.overtimeTeamApprovalMapping);

    this.teamApprovalMapping.teamMembers = this.teamApprovalMapping.selectedEmployeeList;
    var selectedEmployeeForUpdate = this.teamApprovalMapping.selectedEmployeeList[0];
    selectedEmployeeForUpdate.approvalLevel = this.teamApprovalMapping.approvalLevel;
    
    var request = 

    this.buttonAction == "Submit" ?
      /// Save  
      this.areasHttpService.observable_post((ApiArea.payroll + ApiController.Overtime + "/SaveTeamApprovalMapping"),
      
      JSON.stringify(
        { approver : this.teamApprovalMapping.approver,
          approvalLevel : this.teamApprovalMapping.approvalLevel,
          teamMembers: this.teamApprovalMapping.teamMembers
        }), 
      { 'headers': { 'Content-Type': 'application/json' }, observe: 'response', params: {} })
      :
      /// Update
      this.buttonAction == "Update" ?
      this.areasHttpService.observable_put((ApiArea.payroll + ApiController.Overtime + "/UpdateTeamApprovalMappingLevel/" + 
      this.teamApprovalMapping.overtimeTeamApprovalMappingId),
        JSON.stringify(selectedEmployeeForUpdate), { 'headers': { 'Content-Type': 'application/json' }, observe: 'response', params: {} })
      :
      /// Delete 
      this.areasHttpService.observable_delete((ApiArea.payroll + ApiController.Overtime + "/DeleteTeamMemberByApprovalMappingId/" + 
      this.teamApprovalMapping.overtimeTeamApprovalMappingId),
        { 'headers': { 'Content-Type': 'application/json' }, observe: 'response', params: {} })

    request.subscribe((response) => {
      let result = response as any;
      if (result?.status == 200) {
        this.utilityService.success(result.body.message, "Server Response")
        this.modalService.service.dismissAll("Save Complete");
        this.getAllTeamApprovalMapping();
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
