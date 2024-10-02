import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { CustomModalService } from 'src/app/shared/services/custom-modal.service';
import { UserService } from 'src/app/shared/services/user.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { FiscalYearService } from './fiscalYear.service';

@Component({
  selector: 'app-setup',
  templateUrl: './setup.component.html'
})
export class SetupComponent implements OnInit {

  @ViewChild('fiscalYearModal', { static: true }) fiscalYearModal!: ElementRef;
  modalTitle: string = "";
  datePickerConfig: Partial<BsDatepickerConfig> = this.utilityService.datePickerConfig();

  constructor(public modalService: CustomModalService,private utilityService: UtilityService, 
    private fb: FormBuilder, private userService: UserService, private fiscalYearService: FiscalYearService) { }

  pagePrivilege: any = this.userService.getPrivileges();
  ngOnInit(): void {
    this.getFiscalYears();
  }

  User() {
    return this.userService.User();
  }

  logger(msg: any, options: any) {
    this.utilityService.consoleLog(msg, options);
  }

  //#region fiscalYear
  fiscalYearForm: FormGroup;
  fiscalYearFormInit() {
    this.fiscalYearForm = this.fb.group({
      fiscalYearId: [0],
      fiscalYearRange: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(9)]],
    })
  }

  openFiscalYearModal(isCreate: boolean) {
    this.fiscalYearFormInit();
    this.modalTitle = isCreate ? "Add Fiscal Year" : "Update Fiscal Year";
    this.btnFiscalYear = false;
    this.modalService.open(this.fiscalYearModal, "sm");
  }

  listOfFiscalYears: any[] = [];
  getFiscalYears() {
    this.fiscalYearService.get({}).subscribe(response => {
      this.listOfFiscalYears = response.body;
    }, (error) => {
      console.log("error >>>", error);
      this.utilityService.fail('Something went wrong', 'Server Response');
    })
  }

  btnFiscalYear: boolean = false;
  submitFiscalYear() {
    if (this.fiscalYearForm.valid) {
      this.btnFiscalYear = true;
      this.fiscalYearService.save(this.fiscalYearForm.value).subscribe(response => {
        if (response.status) {
          this.utilityService.success("Saved Successfull", "Server Response")
          this.modalService.service.dismissAll("Save Complete");
          this.fiscalYearForm.reset;
          this.getFiscalYears();
        }
        else {
          if (response.msg == "Validation Error") {
            this.utilityService.fail(response.msg, "Server Response")
          }
          else {
            this.utilityService.success(response.msg, "Server Response")
          }
        }
      }, (error) => {
        console.log("error >>>", error);
        this.utilityService.fail('Something went wrong', 'Server Response')
      })
    }
  }

  editFiscalYear(id: any) {
    const fiscalYear = Object.assign({}, this.listOfFiscalYears.find(item => item.fiscalYearId == id));
    fiscalYear.updatedBy = this.User().UserId;
    fiscalYear.companyId = this.User().ComId;
    fiscalYear.organizationId = this.User().OrgId;

    this.openFiscalYearModal(false);
    this.fiscalYearForm.patchValue(fiscalYear);
  }

  //#endregion fiscalYear

}
