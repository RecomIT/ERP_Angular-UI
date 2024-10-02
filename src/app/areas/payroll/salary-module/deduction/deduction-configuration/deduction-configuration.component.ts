import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { ApiArea, ApiController } from 'src/app/shared/constants';
import { CustomModalService } from 'src/app/shared/services/custom-modal.service';
import { HrWebService } from 'src/app/shared/services/hr-web.service';
import { PayrollWebService } from 'src/app/shared/services/payroll-web.service';
import { UserService } from 'src/app/shared/services/user.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AreasHttpService } from '../../../../areas.http.service';
import { transition, trigger, useAnimation } from '@angular/animations';
import { bounceIn, fadeIn, fadeInRight, slideInUp } from 'ng-animate';

@Component({
  selector: 'app-deduction-configuration',
  templateUrl: './deduction-configuration.component.html',
  animations: [
    trigger('slideInUp', [transition('* => *', useAnimation(slideInUp, { params: { timing: 0.5 } }))]),
    trigger('fadeIn', [transition('void => *', useAnimation(fadeIn, { params: { timing: 0.3 } }))]),
    trigger('fadeInRight', [transition('void => *', useAnimation(fadeInRight, { params: { timing: 0.5 } }))]),
    trigger('bounceIn', [transition('void => *', useAnimation(bounceIn, { params: { timing: 1 } }))]),
],
})
export class DeductionConfigurationComponent implements OnInit {

  @ViewChild('deductionConfigModal', { static: true }) deductionConfigModal!: ElementRef;
  @ViewChild('deductionConfigViewAndApprovalModal', { static: true }) deductionConfigViewAndApprovalModal!: ElementRef;
  deductionConfigForm: FormGroup;

  deductionConfigPageSize: number = 15;
  deductionConfigPageNo: number = 1;
  deductionConfigPageConfig: any = this.userService.pageConfigInit("deductionData", this.deductionConfigPageSize, 1, 0);
  pagePrivilege: any= this.userService.getPrivileges();;

  isNgInit=false;

  datePickerConfig: Partial<BsDatepickerConfig> = {};  
  constructor(private datepipe: DatePipe, private fb: FormBuilder, private areasHttpService: AreasHttpService, private payrollWebService: PayrollWebService, private utilityService: UtilityService, private hrWebService: HrWebService, private userService: UserService, public modalService: CustomModalService, private el: ElementRef) { }

  ngOnInit(): void {
    this.datePickerConfig = Object.assign({}, {
      containerClass: "theme-dark-blue",  
      showWeekNumbers: false,
      dateInputFormat: "DD-MMMM-YYYY",
      isAnimated: true,
      showClearButton: false,
      showTodayButton: false,
      todayPosition: "left",
      rangeInputFormat: "DD-MMM-YYYY",
      rangeSeparator: " ~ ",
      size: "sm",
      customTodayClass: 'custom-today-class'
    })
    this.loadDeductionNames();
    this.getDeductionConfigs(1);
  }

  select2Options = {
    width: "100%",
    containerCssClass: "form-control form-control-sm text-x-small font-bold",
    theme: "bootstrap4"
  }

  logger(msg: any, options: any) {
    this.utilityService.consoleLog(msg, options);
  }

  User() {
    return this.userService.User();
  }

  deductionConfigFormInit(){
    this.deductionConfigForm= this.fb.group({
      configId:[0],
      deductionNameId:[0,[Validators.required]],
      isActive:[false],
      isMonthly:[false],
      isTaxable:[false],
      isIndividual:[false],
      Gender:[''],
      isConfirmationRequired:[false],
      depandsOnWorkingHour:[false],
      activationDate:[null, [Validators.required]],
      deactivationDate:[null,[Validators.required]],
      projectRestYear:[null],
      onceOffDeduction:[null],
      isOnceOffTax:[null],
      flatAmount:[null,Validators.min(0)],
      percentageAmount:[null,[Validators.min(0),Validators.max(100)]],
      maxAmount:[null],
      minAmount:[null],
      exemptedAmount:[null],
      exemptedPercentage:[null],
      branchId: [this.User().BranchId],
      createdBy: [this.User().UserId],
      updatedBy: [this.User().UserId],
      companyId: [this.User().ComId],
      organizationId: [this.User().OrgId]
    })
    //
  }

  openDeductionConfigModal(){
    this.deductionConfigFormInit();
    this.modalService.open(this.deductionConfigModal,"lg");
  }

  ddlDeductionNames: any[] =[];
  ddlDeductionNamesSearch: any[] =[];
  loadDeductionNames() {
    this.ddlDeductionNames=[];
    this.payrollWebService.getDeductionNames<any[]>("").then((data) => {
      if(data.length > 0){
        data.forEach(item => {
          this.ddlDeductionNames.push({id: this.utilityService.IntTryParse(item.id),text:item.text+(item.type =='General'?' ['+item.type+']':' ['+item.type+'-'+(item.isFixed?'Fixed':'Flexible')+']')})
        });
        this.ddlDeductionNamesSearch = this.ddlDeductionNames;
      }
      //this.ddldeductionNames = data;
      this.logger("ddldeductionNames",this.ddlDeductionNames);
    })
  }

  dataBydeductionChanged(){
  }

  onceOffTax_projectRestYear_changed(controlName: string){
    let anotherControl = controlName == 'isOnceOffTax' ? 'projectRestYear' : 'isOnceOffTax';
    this.deductionConfigForm.get(anotherControl).setValue(null);
  }

  taxableChanged(){
    this.deductionConfigForm.get('isOnceOffTax').setValue(false);
    this.deductionConfigForm.get('projectRestYear').setValue(false);
  }

  dataByDeductionChanged(){}

  btnSubmitDeductionConfig:boolean=false;

  submitDeductionConfig(){
    if (this.deductionConfigForm.valid) {
      this.btnSubmitDeductionConfig = true;
      this.areasHttpService.observable_post((ApiArea.payroll + ApiController.deduction + "/SaveDeductionConfig"), JSON.stringify(this.deductionConfigForm.value), {
        'headers': {
          'Content-Type': 'application/json'
        },
      }).subscribe((result) => {
        this.logger("Submit result >>", result);
        var data = result as any;
        this.btnSubmitDeductionConfig = false;
        if (data.status) {
          this.deductionConfigForm.reset();
          this.utilityService.success(data.msg, "Server Response");
          this.modalService.service.dismissAll();
          this.getDeductionConfigs(1);
        }
        else {
          this.utilityService.fail(data.msg, "Server Response")
        }
      }, (error) => {
        this.utilityService.fail("Something went wrong", "Server Response")
        this.btnSubmitDeductionConfig = false;
      })
    }
  }

  searchByDeduction: any=null;
  searchByActivationDate: any[] = [];
  searchByDeactivationDate: any[] = [];
  searchByStatus: string = "";

  listOfDeductionConfigs: any[] =[];
  deductionConfigDTLabel: string = null;

  searchByDeductionChanged(){
    if(this.isNgInit){
      this.getDeductionConfigs(1)
    }
    this.isNgInit= true;
  }

  getDeductionConfigs(pageNo: number) {
    let activationFromDate;
    let activationToDate;

    let deactivationFromDate;
    let deactivationToDate;

    this.deductionConfigPageNo = pageNo;
    if (this.searchByActivationDate?.length > 0) {
      this.logger("this.searchByActivationDate length>>>", this.datepipe.transform(this.searchByActivationDate[0], 'yyyy-MM-dd'));
      activationFromDate = this.datepipe.transform(this.searchByActivationDate[0], 'yyyy-MM-dd');
      activationToDate = this.datepipe.transform(this.searchByActivationDate[1], 'yyyy-MM-dd');
    }

    if (this.searchByDeactivationDate?.length > 0) {
      this.logger("this.searchByDeactivationDate length>>>", this.datepipe.transform(this.searchByDeactivationDate[0], 'yyyy-MM-dd'));
      deactivationFromDate = this.datepipe.transform(this.searchByDeactivationDate[0], 'yyyy-MM-dd');
      deactivationToDate = this.datepipe.transform(this.searchByDeactivationDate[1], 'yyyy-MM-dd');
    }
    this.listOfDeductionConfigs = [];
    let params = { deductionNameId: this.utilityService.IntTryParse(this.searchByDeduction), activationDateFrom: activationFromDate ?? '', activationDateTo: activationToDate ?? '',deactivationDateFrom: deactivationFromDate ?? '',deactivationDateTo: deactivationToDate ?? '', status: this.searchByStatus, companyId: this.User().ComId, organizationId: this.User().OrgId, pageSize: this.deductionConfigPageSize, pageNumber: pageNo };

    this.areasHttpService.observable_get<any[]>((ApiArea.payroll + "/Salary/DeductionConfig/GetDeductionConfigurations"), {
      responseType: "json", observe: 'response', params: params
    }).subscribe((response) => {
      var res = response as any;
      this.listOfDeductionConfigs = res.body;
      this.deductionConfigDTLabel = this.listOfDeductionConfigs.length == 0 ? 'No record(s) found' : null;
      var xPaginate= JSON.parse(res.headers.get('X-Pagination'));
      this.deductionConfigPageConfig = this.userService.pageConfigInit("deductionData", xPaginate.itemsPerPage, xPaginate.currentPage, xPaginate.totalItems);
    },
      (error) => { this.logger("error>>>",error) }
    )
  }

  deductionConfigsPageChanged(event: any) {
    this.deductionConfigPageNo = event;
    this.getDeductionConfigs(this.deductionConfigPageNo);
  }

  getDeductionConfigForEdit(id: number, deductionNameId: number){
   return this.areasHttpService.observable_get<any>((ApiArea.payroll + "/Salary/DeductionConfig/GetDeductionConfiguration"), {
      responseType: "json", observe: 'response', params: {configId: id, deductionNameId:deductionNameId, branchId: this.User().BranchId, companyId: this.User().ComId, organizationId: this.User().OrgId}
    })
  }

  loadDeductionConfigForEdit(id: number, deductionNameId: number){
    this.getDeductionConfigForEdit(id, deductionNameId).subscribe((response) => {
      var res = response as any;
      //this.logger("res >>",res.body);
      this.populateDataForDeductionConfigInEditMode(res.body);
    },
      (error) => { this.logger("error>>>",error) }
    )
  }

  populateDataForDeductionConfigInEditMode(formData: any){
    this.logger("formData >>>",formData);
    //return;
    this.deductionConfigFormInit();
    formData.activationDate = new Date(formData.activationDate.toString());
    formData.deactivationDate = new Date(formData.deactivationDate.toString());
    formData.deductionNameId = formData.deductionNameId.toString(); 

    this.btnSubmitDeductionConfig = false;
    this.modalService.open(this.deductionConfigModal, "lg");

    this.deductionConfigForm.patchValue(formData);

  }

  isApprovalView: boolean = false;
  deductionConfigData : any;
  openDeductionConfigDetailAndApprovalView(flag: string, id: number){
    this.deductionConfigData = null;
    this.isApprovalView = flag == "approval" ? true: false;
    this.deductionConfigData = Object.assign({},this.listOfDeductionConfigs.find(i=> i.configId == id));
    this.logger("data >>>",this.deductionConfigData);
    this.modalService.open(this.deductionConfigViewAndApprovalModal,"lg");
  }

  submitDeductionConfigStatus(form:NgForm, remarks: any, status: any){
    if(form.valid){
      this.btnSubmitDeductionConfig = true;
      this.areasHttpService.observable_post((ApiArea.payroll+"/DeductionConfig/SaveDeductionConfigurationStatus"),null,{
        params:{configId:this.deductionConfigData.configId,status: status,remarks: remarks,companyId: this.User().ComId, organizationId: this.User().OrgId, deductionNameId: this.deductionConfigData.deductionNameId,userId: this.User().UserId}
      }).subscribe((result: any)=>{
        this.btnSubmitDeductionConfig = false;
        if (result.status) {
          this.utilityService.success(result.msg, "Server Response");
          this.modalService.service.dismissAll();
          this.getDeductionConfigs(this.deductionConfigPageNo);
        }
        else {
          this.utilityService.fail(result.msg, "Server Response")
        }
      }, (error) => {
        this.btnSubmitDeductionConfig = false;
        this.utilityService.fail("Something went wrong", "Server Response")
      })
    }
    else{
      this.utilityService.fail("Invalid form value(s)","Site Response",3000);
    }
  }
}
