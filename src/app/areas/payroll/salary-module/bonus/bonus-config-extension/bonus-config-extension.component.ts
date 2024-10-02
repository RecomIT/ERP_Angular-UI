import { transition, trigger, useAnimation } from '@angular/animations';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormControlName, FormGroup, Validators } from '@angular/forms';
import { bounceIn, fadeIn, fadeInRight, slideInUp } from 'ng-animate';
import { ApiArea, ApiController } from 'src/app/shared/constants';
import { ControlPanelWebService } from 'src/app/shared/services/control-panel.service';
import { CustomModalService } from 'src/app/shared/services/custom-modal.service';
import { HrWebService } from 'src/app/shared/services/hr-web.service';
import { PayrollWebService } from 'src/app/shared/services/payroll-web.service';
import { UserService } from 'src/app/shared/services/user.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AreasHttpService } from '../../../../areas.http.service';

@Component({
  selector: 'app-bonus-config-extension',
  templateUrl: './bonus-config-extension.component.html',
  animations: [
    trigger('slideInUp', [transition('* => *', useAnimation(slideInUp, { params: { timing: 0.5 } }))]),
    trigger('fadeIn', [transition('void => *', useAnimation(fadeIn, { params: { timing: 0.3 } }))]),
    trigger('fadeInRight', [transition('void => *', useAnimation(fadeInRight, { params: { timing: 0.5 } }))]),
    trigger('bounceIn', [transition('void => *', useAnimation(bounceIn, { params: { timing: 1 } }))])
  ],
})

export class BonusConfigExtensionComponent implements OnInit {

  @ViewChild('bonusInsertModal', { static: true }) bonusInsertModal!: ElementRef;
  @ViewChild('bonusEditModal', { static: true }) bonusEditModal!: ElementRef;
  constructor(private utilityService: UtilityService, private payrollWebService: PayrollWebService, private controlPanelWebService: ControlPanelWebService, private hrWebService: HrWebService, private fb: FormBuilder,
    private userService: UserService, public modalService: CustomModalService, private areasHttpService: AreasHttpService) { }

  pagePrivilege: any = this.userService.getPrivileges();;
  ngOnInit(): void {
    this.getBonuses();
    this.getBonusConfigs();
    this.getPayrollModuleConfig();
  }

  /// Page Basic Setting //
  logger(msg: any, options: any) {
    this.utilityService.consoleLog(msg, options);
  }

  User() {
    return this.userService.User();
  }

  select2Options = {
    width: "100%",
    containerCssClass: "form-control form-control-sm text-x-small font-bold",
    theme: "bootstrap4"
  }
  //===================//

  //#region bonus-insert
  bonusInsertForm: FormGroup;
  bonusInsertFormInit() {
    this.bonusInsertForm = this.fb.group({
      bonusId: new FormControl(0),
      bonusName: new FormControl('', [Validators.required]),
      isActive: new FormControl(true, [Validators.required]),
      isReligious: new FormControl(true, [Validators.required]),
      religionId: new FormControl(0, [Validators.min(1)]),
      reason: new FormControl(''),
      remarks: new FormControl(''),
      fiscalYearId: new FormControl(0, [Validators.min(1)]),
      isConfirmedEmployee: new FormControl(true),
      isFestival: new FormControl(true),
      isTaxable: new FormControl(true),
      taxConditionType: new FormControl('', [Validators.required]),
      basedOn: new FormControl('Basic'),
      percentage: new FormControl(this.payrollModuleConfig?.unitOfBonus, [Validators.min(1)]),
      bonusCount: new FormControl(0, [Validators.min(1)]),
      amount: new FormControl(0),
      createdBy: new FormControl(this.User().UserId),
      updatedBy: new FormControl(this.User().UserId),
      companyId: new FormControl(this.User().ComId),
      organizationId: new FormControl(this.User().OrgId)
    })

    this.bonusInsertForm.controls.basedOn.valueChanges.subscribe(data => {
      this.bonusInsertForm.controls.bonusCount.setValue(1);
    })

    this.bonusInsertForm.controls.isTaxable.valueChanges.subscribe(val => {
      // this.logger("isTaxable >>>", val);
      if (val == 'false' || val == '') {
        // this.logger("if isTaxable >>>", val);
        this.bonusInsertForm.controls.taxConditionType.setValue('');
        this.bonusInsertForm.controls.taxConditionType.clearValidators();
      }
      else {
        this.bonusInsertForm.controls.taxConditionType.setValue('');
        this.bonusInsertForm.controls.taxConditionType.setValidators([Validators.required])
      }
    })

    this.bonusInsertForm.controls.isReligious.valueChanges.subscribe(control => {
      this.bonusInsertForm.controls.religionId.setValue(0);
      if (control.value == true) {
        this.bonusInsertForm.controls.religionId.setValidators(Validators.min(1))
      }
      else if (control.value == false) {
        this.bonusInsertForm.controls.religionId.clearValidators()
      }
    })

    this.bonusInsertForm.controls.basedOn.valueChanges.subscribe(control => {
      //this.logger("Bonus Control >>>", control);
      this.bonusInsertForm.controls.percentage.setValue(0);
      this.bonusInsertForm.controls.percentage.clearValidators();
      this.bonusInsertForm.controls.amount.setValue(0);
      this.bonusInsertForm.controls.amount.clearValidators();

      if (control == "Basic" || control == "Gross") {
        this.bonusInsertForm.controls.percentage.setValidators(Validators.min(1));
      }
      else if (control == "Flat") {
        this.bonusInsertForm.controls.amount.setValidators(Validators.min(1));
      }
    })
  }

  openBonusInsertModal() {
    this.modalService.open(this.bonusInsertModal, "lg");
  }


  ddlReligion: any[];
  loadReligion() {
    this.ddlReligion = [];
    this.hrWebService.getReligionExtension().then((data: any) => {
      this.ddlReligion = data;
      this.logger("religions >>>", data);
    })
  }

  ddlFiscalyear: any[];
  loadFiscalYear() {
    this.ddlFiscalyear = [];
    this.payrollWebService.getFiscalYears().then((data: any) => {
      this.ddlFiscalyear = data;
      this.logger("fiscal years >>>", data);
    })
  }


  btnInsertBonus: boolean = false;
  //#endregion

  saveBonusWithConfig() {
    if (this.bonusInsertForm.valid) {
      this.logger("Bonus Form Value", this.bonusInsertForm.value);
      var formValue = this.bonusInsertForm.value;
      console.log("formValue", formValue);

      var isReligious = formValue.isReligious == null ? false : (formValue.isReligious.toString() == "true" ? true : false);
      var isActive = formValue.isActive == null ? false : (formValue.isActive.toString() == "true" ? true : false);
      var isConfirmedEmployee = formValue.isConfirmedEmployee == null ? false : (formValue.isConfirmedEmployee.toString() == "true" ? true : false);
      var isFestival = formValue.isFestival == null ? false : (formValue.isFestival.toString() == "true" ? true : false);
      var isTaxable = formValue.isTaxable == null ? false : (formValue.isTaxable.toString() == "true" ? true : false);

      let info = {
        religionId: this.utilityService.IntTryParse(formValue.religionId),
        bonusId: formValue.bonusId, bonusName: formValue.bonusName, companyId: formValue.companyId,
        userId: formValue.createdBy, isReligious: isReligious, isActive: isActive, organizationId: formValue.organizationId
      };

      let bonusConfig = {
        bonusConfigId: 0, fiscalYearId: this.utilityService.IntTryParse(formValue.fiscalYearId), isConfirmedEmployee: isConfirmedEmployee,
        isFestival: isFestival, isTaxable: isTaxable, basedOn: formValue.basedOn, percentage: this.utilityService.FloatTryParse(formValue.percentage),
        amount: formValue.amount, bonusId: formValue.bonusId, organizationId: formValue.organizationId, companyId: formValue.companyId,
        userId: formValue.createdBy, bonusCount: formValue.bonusCount
      }

      var model = { bonusInfo: info, bonusConfig: bonusConfig };

      console.log("model", model);

      //return;

      this.areasHttpService.observable_post((ApiArea.payroll + "/Salary/BonusProcess" + "/SaveBonusWithConfig"), JSON.stringify(model), {
        'headers': {
          'Content-Type': 'application/json'
        },
      }).subscribe((result) => {
        var data = result as any;
        this.btnInsertBonus = false;
        if (data.status) {
          this.utilityService.success(data.msg, "Server Response");
          this.modalService.service.dismissAll();
        }
        else {
          if (data.msg == "Validation Error") {
            this.utilityService.fail(data.errors?.duplicateAllowance, "Server Response", 5000);
          }
          else {
            this.utilityService.fail(data.msg, "Server Response")
          }
        }
      }, (error) => {
        this.utilityService.fail("Something went wrong", "Server Response")
        this.btnInsertBonus = false;
      })

    }
    else {
      this.utilityService.fail("Invalid Form submission", "Site Response");
    }
  }

  hideme = [];
  Index: any;

  listOfBonus: any[] = [];
  listOfBonusDTLable: string = null;
  searchByBonusName: string = null;


  getBonuses() {
    this.areasHttpService.observable_get((ApiArea.payroll + "/Salary/Bonus" + "/GetBonuses"), {
      responseType: "json", params: {
        bonusId: 0, bonusName: this.searchByBonusName, fiscalYearId: 0, companyId: this.User().ComId, organizationId: this.User().OrgId
      }
    }).subscribe(data => {
      this.logger("data >>", data);
      var result = data as any[];
      if (result.length == 0) {
        this.listOfBonus = null;
        this.listOfBonusDTLable = "No record(s) found"
      }
      else {
        this.listOfBonus = result;
      }
    }, (error: any) => {
      this.utilityService.toastr.error("Data retrieval issue", "Server Response")
    })
  }

  payrollModuleConfig: any;
  getPayrollModuleConfig() {
    this.controlPanelWebService.getPayrollModuleConfig().then(data => {
      this.payrollModuleConfig = data;
    })
  }

  bonus_id: any = null;
  showBonusModal: boolean = false;
  openBonusModal(id: number) {
    this.bonus_id = id;
    this.showBonusModal = true;
  }

  closeBonusModal(reason: any) {
    console.log("reason >>>", reason);
    this.showBonusModal = false;
    this.bonus_id = null;
    if (reason == 'Save Complete') {
      this.getBonuses();
    }
  }

  //#region Bonus-Config
  listOfBonusConfig: any[] = [];
  getBonusConfigs() {
    this.areasHttpService.observable_get<any[]>((ApiArea.payroll + "/Salary/Bonus" + "/GetBonusConfigs"), {}).subscribe((data) => {
      this.listOfBonusConfig = data;
      console.log("listOfBonusConfig >>>", data);
    })
  }



  bonus_config_id: any = null;
  showBonusConfigModal: boolean = false;
  bonus_config_item: any = null;

  openBonusConfigModal(id: number) {
    this.bonus_config_item = this.listOfBonusConfig.find(item => item.bonusConfigId == id);
    this.bonus_config_id = id;
    this.showBonusConfigModal = true;
  }

  closeBonusConfigModal(reason: any) {
    //console.log("reason >>>",reason);
    this.showBonusConfigModal = false;
    this.bonus_config_id = null;
    if (reason == 'Save Complete') {
      this.getBonusConfigs();
    }
  }


  //#endregion Bonus-Config

  //#region Exclude Employee
  showExcludeEmployeeModal: boolean = false;
  openExcludeEmployeeModal(bonusId: any, bonusConfigId: any) {
    this.bonus_id = bonusId;
    this.bonus_config_id = bonusConfigId;
    this.showExcludeEmployeeModal = true;
  }

  closeExcludeEmployeeModal(reason: any) {
    console.log("reason >>>", reason);
    this.showExcludeEmployeeModal = false;
    this.bonus_config_id = null;
    this.bonus_id = null;
    // if (reason == 'Save Complete') {
    //   this.getBonusConfigs();
    // }
  }
  //#endregion

}
