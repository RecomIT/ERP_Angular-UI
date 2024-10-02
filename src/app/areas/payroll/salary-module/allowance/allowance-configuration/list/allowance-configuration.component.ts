import { transition, trigger, useAnimation } from '@angular/animations';
import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { bounceIn, fadeIn, fadeInRight, slideInUp } from 'ng-animate';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { ApiArea } from 'src/app/shared/constants';
import { CustomModalService } from 'src/app/shared/services/custom-modal.service';
import { HrWebService } from 'src/app/shared/services/hr-web.service';
import { PayrollWebService } from 'src/app/shared/services/payroll-web.service';
import { UserService } from 'src/app/shared/services/user.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AreasHttpService } from '../../../../../areas.http.service';
import { AllowanceConfigurationService } from '../allowance-configuration.service';
import { AllowanceNameService } from '../../allowance-head/allowance-name.service';

@Component({
  selector: 'app-allowance-configuration',
  templateUrl: './allowance-configuration.component.html',
  animations: [
    trigger('slideInUp', [transition('* => *', useAnimation(slideInUp, { params: { timing: 0.5 } }))]),
    trigger('fadeIn', [transition('void => *', useAnimation(fadeIn, { params: { timing: 0.3 } }))]),
    trigger('fadeInRight', [transition('void => *', useAnimation(fadeInRight, { params: { timing: 0.5 } }))]),
    trigger('bounceIn', [transition('void => *', useAnimation(bounceIn, { params: { timing: 1 } }))]),
  ],
})
export class AllowanceConfigurationComponent implements OnInit {

  @ViewChild('allowanceConfigModal', { static: true }) allowanceConfigModal!: ElementRef;
  @ViewChild('allowanceConfigViewAndApprovalModal', { static: true }) allowanceConfigViewAndApprovalModal!: ElementRef;
  allowanceConfigForm: FormGroup;

  allowanceConfigPageSize: number = 15;
  allowanceConfigPageNo: number = 1;
  allowanceConfigPageConfig: any = this.userService.pageConfigInit("allowanceData", this.allowanceConfigPageSize, 1, 0);

  isNgInit = false;

  datePickerConfig: Partial<BsDatepickerConfig> = this.utilityService.datePickerConfig();;
  datePickerConfig2: Partial<BsDatepickerConfig> = {};
  pagePrivilege: any = this.userService.getPrivileges();;
  constructor(private datepipe: DatePipe, private fb: FormBuilder, private areasHttpService: AreasHttpService, private allowanceNameService: AllowanceNameService, private utilityService: UtilityService, private allowanceConfigurationService: AllowanceConfigurationService, private userService: UserService, public modalService: CustomModalService, private el: ElementRef) { }

  ngOnInit(): void {
    this.loadAllowanceNames();
    this.getAllowanceConfigs(1);
  }

  select2Options = this.utilityService.select2Config();

  logger(msg: any, options: any) {
    this.utilityService.consoleLog(msg, options);
  }

  User() {
    return this.userService.User();
  }

  getAllowanceNames() {

  }

  allowanceConfigFormInit() {
    this.allowanceConfigForm = this.fb.group({
      configId: [0],
      allowanceNameId: [0, [Validators.required]],
      isActive: [false],
      isMonthly: [false],
      isTaxable: [false],
      isIndividual: [false],
      Gender: [''],
      isConfirmationRequired: [false],
      depandsOnWorkingHour: [false],
      activationDate: [null, [Validators.required]],
      deactivationDate: [null, [Validators.required]],
      projectRestYear: [null],
      onceOffDeduction: [null],
      isOnceOffTax: [null],
      flatAmount: [null, Validators.min(0)],
      percentageAmount: [null, [Validators.min(0), Validators.max(100)]],
      maxAmount: [null],
      minAmount: [null],
      exemptedAmount: [null],
      exemptedPercentage: [null],
      branchId: [this.User().BranchId],
      createdBy: [this.User().UserId],
      updatedBy: [this.User().UserId],
      companyId: [this.User().ComId],
      organizationId: [this.User().OrgId]
    })
    //
  }

  openAllowanceConfigModal() {
    this.allowanceConfigFormInit();
    this.modalService.open(this.allowanceConfigModal, "lg");
  }

  ddlAllowanceNames: any = [];
  ddlAllowanceNamesSearch: any = [];
  loadAllowanceNames() {

    this.allowanceNameService.loadAllowanceNameDropdown();
    this.allowanceNameService.ddl$.subscribe(data => {
      console.log("ddl data >>>", data);
      this.ddlAllowanceNames = data;
      this.ddlAllowanceNamesSearch = data;
    })
    // this.ddlAllowanceNames=[];
    // this.payrollWebService.getAllowanceNames<any[]>("").then((data) => {
    //   if(data.length > 0){
    //     data.forEach(item => {
    //       this.ddlAllowanceNames.push({id: this.utilityService.IntTryParse(item.id),text:item.text+(item.type =='General'?' ['+item.type+']':' ['+item.type+'-'+(item.isFixed?'Fixed':'Flexible')+']')})
    //     });
    //     this.ddlAllowanceNamesSearch = this.ddlAllowanceNames;
    //   }
    //   this.logger("ddlAllowanceNames",this.ddlAllowanceNames);
    // })
  }

  dataByAllowanceChanged() {
  }

  onceOffTax_projectRestYear_changed(controlName: string) {
    let anotherControl = controlName == 'isOnceOffTax' ? 'projectRestYear' : 'isOnceOffTax';
    this.allowanceConfigForm.get(anotherControl).setValue(null);
  }

  taxableChanged() {
    this.allowanceConfigForm.get('isOnceOffTax').setValue(false);
    this.allowanceConfigForm.get('projectRestYear').setValue(false);
  }

  btnSubmitAllowanceConfig: boolean = false;

  submitAllowanceConfig() {
    if (this.allowanceConfigForm.valid) {
      this.btnSubmitAllowanceConfig = true;
      this.allowanceConfigurationService.save(this.allowanceConfigForm.value).subscribe(response => {
        this.btnSubmitAllowanceConfig = false;
        if (response.status) {
          this.allowanceConfigForm.reset();
          this.utilityService.success(response.msg, "Server Response")
          this.modalService.service.dismissAll();
          this.getAllowanceConfigs(1);
          //this.getSchedulerRequests(this.schedulerRequestPageNo)
        }
        else {
          this.utilityService.fail(response.msg, "Server Response")
        }
      }, (error) => {
        console.log("error >>>", error);
        this.utilityService.fail("Somthing went wrong", "Server Reponse");
      })
      // this.areasHttpService.observable_post((ApiArea.payroll + "/AllowanceConfig/SaveAllowanceConfig"), JSON.stringify(this.allowanceConfigForm.value), {
      //   'headers': {
      //     'Content-Type': 'application/json'
      //   },
      // }).subscribe((result) => {
      //   this.logger("Submit result >>", result);
      //   var data = result as any;
      //   this.btnSubmitAllowanceConfig = false;
      //   if (data.status) {
      //     this.allowanceConfigForm.reset();
      //     this.utilityService.success(data.msg, "Server Response")
      //     this.modalService.service.dismissAll();
      //     this.getAllowanceConfigs(1);
      //     //this.getSchedulerRequests(this.schedulerRequestPageNo)
      //   }
      //   else {
      //     this.utilityService.fail(data.msg, "Server Response")
      //   }
      // }, (error) => {
      //   this.utilityService.fail("Something went wrong", "Server Response")
      //   this.btnSubmitAllowanceConfig = false;
      // })
    }
  }

  searchByAllowance: any = null;
  searchByActivationDate: any[] = [];
  searchByDeactivationDate: any[] = [];
  searchByStatus: string = "";

  listOfAllowanceConfigs: any[] = [];
  allowanceConfigDTLabel: string = null;

  searchByAllowanceChanged() {
    if (this.isNgInit) {
      this.getAllowanceConfigs(1)
    }
    this.isNgInit = true;
  }

  getAllowanceConfigs(pageNo: number) {
    let activationFromDate;
    let activationToDate;

    let deactivationFromDate;
    let deactivationToDate;

    this.allowanceConfigPageNo = pageNo;
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

    this.listOfAllowanceConfigs = [];
    let params = { allowanceNameId: this.utilityService.IntTryParse(this.searchByAllowance), activationDateFrom: activationFromDate ?? '', activationDateTo: activationToDate ?? '', deactivationDateFrom: deactivationFromDate ?? '', deactivationDateTo: deactivationToDate ?? '', stateStatus: this.searchByStatus, pageSize: this.allowanceConfigPageSize, pageNumber: pageNo };

    this.allowanceConfigurationService.get(params).subscribe(response => {
      this.listOfAllowanceConfigs = response.body;
      this.allowanceConfigDTLabel = this.listOfAllowanceConfigs.length == 0 ? 'No record(s) found' : null;
      var xPaginate = JSON.parse(response.headers.get('X-Pagination'));
      this.allowanceConfigPageConfig = this.userService.pageConfigInit("allowanceData", xPaginate.itemsPerPage, xPaginate.currentPage, xPaginate.totalItems);
    }, (error) => {
      console.log("error >>>", error);
      this.utilityService.fail("Something went wrong", 'Server Response');
    })
  }

  allowanceConfigsPageChanged(event: any) {
    this.allowanceConfigPageNo = event;
    this.getAllowanceConfigs(this.allowanceConfigPageNo);
  }


  loadAllowanceConfigForEdit(id: number, allowanceNameId: number) {
    this.allowanceConfigurationService.getById({ configId: id, allowanceNameId: allowanceNameId }).subscribe(response => {
      this.populateDataForAllowanceConfigInEditMode(response.body);
    }, (error) => {
      console.log("error >>>", error);
      this.utilityService.fail("Something went wrong", "Server Response");
    })

  }

  populateDataForAllowanceConfigInEditMode(formData: any) {
    this.allowanceConfigFormInit();
    formData.activationDate = new Date(formData.activationDate.toString());
    formData.deactivationDate = new Date(formData.deactivationDate.toString());
    formData.allowanceNameId = formData.allowanceNameId.toString();

    this.btnSubmitAllowanceConfig = false;
    this.modalService.open(this.allowanceConfigModal, "lg");

    this.allowanceConfigForm.patchValue(formData);
  }

  isApproavlView: boolean = false;
  allowanceConfigData: any;
  openAllowanceConfigDetailAndApprovalView(flag: string, id: number) {
    this.allowanceConfigData = null;
    this.isApproavlView = flag == "approval" ? true : false;
    console.log("this.listOfAllowanceConfigs >>>>", this.listOfAllowanceConfigs);
    console.log("this.id >>>>", id);
    let data = Object.assign({}, this.listOfAllowanceConfigs.find(i => i.configId == id));
    this.allowanceConfigData = data;
    this.logger("view data >>>", this.allowanceConfigData);
    this.modalService.open(this.allowanceConfigViewAndApprovalModal, "lg");
  }

  submitAllowanceConfigStatus(form: NgForm, remarks: any, status: any) {
    if (form.valid) {
      this.btnSubmitAllowanceConfig = true;
      this.allowanceConfigurationService.approval({ configId: this.allowanceConfigData.configId, allowanceNameId: this.allowanceConfigData.allowanceNameId, stateStatus: status, statusRemarks: remarks }).subscribe(response => {
        this.btnSubmitAllowanceConfig = false;
        if (response.status) {
          this.utilityService.success(response.msg, "Server Response");
          this.modalService.service.dismissAll();
          this.getAllowanceConfigs(this.allowanceConfigPageNo);
        }
        else {
          this.utilityService.fail(response.msg, "Server Response")
          this.btnSubmitAllowanceConfig = false;
          if (response.status) {
            this.utilityService.success(response.msg, "Server Response");
            this.modalService.service.dismissAll();
            this.getAllowanceConfigs(this.allowanceConfigPageNo);
          }
          else {
            this.utilityService.fail(response.msg, "Server Response")
          }
        }
      }, (error) => {
        console.log("error >>>", error);
        this.utilityService.fail("Something went wrong", "Server Response");
      })
    }
    else {
      this.utilityService.fail("Invalid form value(s)", "Site Response", 3000);
    }
  }

}
