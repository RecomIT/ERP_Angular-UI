import { transition, trigger, useAnimation } from '@angular/animations';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { bounceIn, fadeIn, fadeInRight, jello, slideInUp } from 'ng-animate';
import { ApiArea } from 'src/app/shared/constants';
import { CustomModalService } from 'src/app/shared/services/custom-modal.service';
import { PayrollWebService } from 'src/app/shared/services/payroll-web.service';
import { UserService } from 'src/app/shared/services/user.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AreasHttpService } from '../../../../areas.http.service';
import { FiscalYearService } from '../../../salary-module/setup/fiscalYear/fiscalYear.service';
import { IncomeTaxSlabService } from '../income-tax-slab.service';
import { error } from 'console';

@Component({
  selector: 'app-income-tax-slab',
  templateUrl: './income-tax-slab.component.html',
  animations: [
    trigger('slideInUp', [transition('* => *', useAnimation(slideInUp, { params: { timing: 0.5 } }))]),
    trigger('fadeIn', [transition('void => *', useAnimation(fadeIn, { params: { timing: 0.3 } }))]),
    trigger('fadeInRight', [transition('void => *', useAnimation(fadeInRight, { params: { timing: 0.5 } }))]),
    trigger('bounceIn', [transition('void => *', useAnimation(bounceIn, { params: { timing: 1 } }))]),
  ]
})
export class IncomeTaxSlabComponent implements OnInit {

  pagePrivilege: any = this.userService.getPrivileges();

  @ViewChild('IncomeTaxSlabInsertModal', { static: true }) IncomeTaxSlabInsertModal!: ElementRef;
  @ViewChild('IncomeTaxSlabEditModal', { static: true }) IncomeTaxSlabEditModal!: ElementRef;

  isNgInit = false;
  modalTitle: string = "";
  constructor(private areasHttpService: AreasHttpService, private fb: FormBuilder, private utilityService: UtilityService,
    private incomeTaxSlabService: IncomeTaxSlabService,
    private userService: UserService, public modalService: CustomModalService, private fiscalYearService: FiscalYearService) { }

  ngOnInit(): void {
    this.loadFicalYear();
    this.getIncomeTaxes();
  }

  /// Page Basic Setting //
  logger(msg: any, options: any) {
    this.utilityService.consoleLog(msg, options);
  }

  User() {
    return this.userService.User();
  }

  select2Options = this.utilityService.select2Config();
  //===================//

  public ddlImpliedConditionInFilter = this.utilityService.getTaxSlabImpliedCondition();
  public ddlFiscalYearInFilter: any[] = [];

  //#region Slab Entry //
  public ddlImpliedConditionInEntry = this.utilityService.getTaxSlabImpliedCondition();
  ddlFiscalYearInEntry: any[] = [];

  loadFicalYear() {
    this.ddlFiscalYearInEntry = [];
    this.ddlFiscalYearInFilter = [];
    this.fiscalYearService.loadDropdown();
    this.fiscalYearService.ddl$.subscribe(response => {
      this.ddlFiscalYearInEntry = response;
      this.ddlFiscalYearInFilter = this.ddlFiscalYearInEntry;
    })
  }
  incomeTaxSlabInsertFrom: FormGroup;
  formArray: any;

  incomeTaxSlabInsertFromInit() {
    this.incomeTaxSlabInsertFrom = this.fb.group({
      fiscalYearId: new FormControl(0, [Validators.min(1)]),
      impliedCondition: new FormControl("", [Validators.required]),
      userId: new FormControl(this.User().UserId),
      companyId: new FormControl(this.User().ComId),
      organizationId: new FormControl(this.User().OrgId),
      slabs: this.fb.array([
        this.fb.group({
          slabMininumAmount: new FormControl(null, [Validators.minLength(1), Validators.min(0)]),
          slabMaximumAmount: new FormControl(null, [Validators.minLength(1), Validators.min(1)]),
          slabPercentage: new FormControl(null, [Validators.minLength(1)])
        })
      ])
    });
    this.formArray = (<FormArray>this.incomeTaxSlabInsertFrom.get('slabs')).controls;

    this.incomeTaxSlabInsertFrom.valueChanges.subscribe((form) => {
      console.log("Fired...");
      this.logFormErrors();
    })
  }

  btnInsertSlab: boolean = false;

  addNewSlabClick(): void {
    (<FormArray>this.incomeTaxSlabInsertFrom.get('slabs')).push(this.addNewSlab());
  }

  addNewSlab() {
    return this.fb.group({
      slabMininumAmount: new FormControl(null, [Validators.minLength(1), Validators.min(0)]),
      slabMaximumAmount: new FormControl(null, [Validators.minLength(1), Validators.min(1)]),
      slabPercentage: new FormControl(null)
    })
  }

  openInsertModal() {
    this.incomeTaxSlabInsertFromInit();
    this.modalService.open(this.IncomeTaxSlabInsertModal, "lg");
    this.loadFicalYear();
  }

  removeSlabButtonClick(index: number) {
    if ((<FormArray>this.incomeTaxSlabInsertFrom.get('slabs')).length > 1) {
      (<FormArray>this.incomeTaxSlabInsertFrom.get('slabs')).removeAt(index);
    }
    else {
      this.utilityService.fail("You can't delete last item", "Site Response");
    }
  }

  formErrors = {
    'fiscalYearId': '',
    'impliedCondition': '',
    'slabMininumAmount': '',
    'slabMaximumAmount': ''
  }

  validationMessages = {
    'fiscalYearId': {
      'min': 'Field is required'
    },
    'impliedCondition': {
      'required': 'Field is required'
    },
    'slabMininumAmount': {
      'minLength': 'Field is required',
      'min': 'Field is required'
    },
    'slabMaximumAmount': {
      'minLength': 'Field is required',
      'min': 'Field is required'
    }
  }

  logFormErrors(formGroup: FormGroup = this.incomeTaxSlabInsertFrom) {
    Object.keys(formGroup.controls).forEach((key: string) => {
      const abstractControl = formGroup.get(key);
      this.formErrors[key] = '';
      if (abstractControl instanceof FormArray) {
        abstractControl.controls.forEach(formGroup => {
          if (formGroup instanceof FormGroup) {
            this.logFormErrors(formGroup)
          }
        });
      }
      else if (abstractControl && !abstractControl.valid && (abstractControl.touched || abstractControl.dirty)) {
        const messages = this.validationMessages[key];
        for (const errorKey in abstractControl.errors) {
          console.log("errorKey", errorKey);
          this.formErrors[key] += messages[errorKey];
        }
      }
    })
  }

  submitTaxSlab() {
    if (this.incomeTaxSlabInsertFrom.valid) {
      this.btnInsertSlab = true;
      let fiscalYearId = this.incomeTaxSlabInsertFrom.get('fiscalYearId').value;
      let impliedCondition = this.incomeTaxSlabInsertFrom.get('impliedCondition').value;
      let model = {
        taxSlabDetails: []
      }

      var isMax0 = false;
      this.formArray.forEach((formGroup: FormGroup) => {
        var min = this.utilityService.FloatTryParse(formGroup.get('slabMininumAmount').value);
        var max = this.utilityService.FloatTryParse(formGroup.get('slabMaximumAmount').value);
        var per = this.utilityService.FloatTryParse(formGroup.get('slabPercentage').value);
        if (max == 0) {
          isMax0 = true;
        }
        model.taxSlabDetails.push({
          fiscalYearId: parseInt(fiscalYearId),
          impliedCondition: impliedCondition,
          slabMininumAmount: min,
          slabMaximumAmount: max,
          slabPercentage: per
        })
      })

      if (isMax0) {
        this.btnInsertSlab = false;
        this.utilityService.fail("One or More Max value is empty", "Site Response");
        return;
      }

      this.incomeTaxSlabService.save(model).subscribe(response => {
        if (response.status) {
          this.getIncomeTaxes();
          this.utilityService.success(response.msg, "Server Response");
          this.modalService.service.dismissAll();
        }
        else {
          if (response.msg == "Validation Error") {
            this.utilityService.fail(response.errors?.duplicateAllowance, "Server Response", 5000);
          }
          else {
            this.utilityService.fail(response.msg, "Server Response")
          }
        }
      }, (error) => {
        this.utilityService.httpErrorHandler(error);
      })
    }
    else {
      this.utilityService.fail("Invalid Form Submission", "Site Response");
    }
  }
  //#endregion //

  //#region List-Data

  list: any[] = [];
  getIncomeTaxes() {
    this.incomeTaxSlabService.getIncomeTaxSlabsData({
      incomeTaxSlabId: 0, impliedCondition: this.searchByImpliedCondition, fiscalYearId: this.searchByFiscalYear
    }).subscribe(response => {
      var result = response.body as any[];
      if (result.length == 0) {
        this.list = null;
      }
      else {
        this.list = result;
      }
    }, (error) => {
      this.utilityService.httpErrorHandler(error);
    })
  }

  searchByFiscalYear: number = 0;
  searchByImpliedCondition: string = "";

  //#endregion

  //#region Update a slab
  incomeTaxSlabUpdateForm: FormGroup;

  openUpdateModal(fiscalId: any, id: any, condition: any) {
    var mainItem = this.list.find(s => s.fiscalYearId == fiscalId && s.impliedCondition == condition);
    var detail = mainItem.taxSlabAmounts.find(s => s.incomeTaxSlabId == id);
    this.incomeTaxSlabUpdateForm = this.fb.group({
      incomeTaxSlabId: new FormControl(detail.incomeTaxSlabId, [Validators.min(1), Validators.minLength(1)]),
      fiscalYearId: new FormControl(mainItem.fiscalYearId, [Validators.min(1), Validators.minLength(1)]),
      impliedCondition: new FormControl(mainItem.impliedCondition, [Validators.required]),
      slabMininumAmount: new FormControl(detail.slabMininumAmount, [Validators.min(0), Validators.minLength(1)]),
      slabMaximumAmount: new FormControl(detail.slabMaximumAmount, [Validators.min(1), Validators.minLength(1)]),
      slabPercentage: new FormControl(detail.slabPercentage, [Validators.min(0), Validators.minLength(1)])
    })

    this.incomeTaxSlabUpdateForm.controls['fiscalYearId'].disable();
    this.incomeTaxSlabUpdateForm.controls['impliedCondition'].disable();

    this.modalService.open(this.IncomeTaxSlabEditModal, "lg");
    this.loadFicalYear();

  }

  submitUpdate() {
    if (this.incomeTaxSlabUpdateForm.valid) {
      this.btnInsertSlab = true;
      this.incomeTaxSlabService.update(this.incomeTaxSlabUpdateForm.value).subscribe(response => {
        this.btnInsertSlab = false;
        if (response.status) {
          this.getIncomeTaxes();
          this.utilityService.success(response.msg, "Server Response");
          this.modalService.service.dismissAll();
        }
        else {
          if (response.msg == "Validation Error") {
            this.utilityService.fail(response.errors?.duplicateAllowance, "Server Response", 5000);
          }
          else {
            this.utilityService.fail(response.msg, "Server Response")
          }
        }
      }, (error) => {
        this.utilityService.httpErrorHandler(error);
      });
    }
    else {
      this.utilityService.fail("Invalid Form", "Site Response")
    }
  }
  //#endregion

}
