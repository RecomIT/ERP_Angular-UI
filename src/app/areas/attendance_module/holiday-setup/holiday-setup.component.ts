import { transition, trigger, useAnimation } from '@angular/animations';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { fadeIn, fadeInUp, fadeOutLeft, slideInUp } from 'ng-animate';
import { parseDate } from 'ngx-bootstrap/chronos';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { ToastrService } from 'ngx-toastr';
import { CustomModalService } from 'src/app/shared/services/custom-modal.service';
import { UserService } from 'src/app/shared/services/user.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { publicHoliday, YearlyHoliday } from 'src/models/hrm/holiday-setup-model';
import { AreasHttpService } from '../../areas.http.service';
import { HolidaySetupService } from './holiday-setup.service';

@Component({
  selector: 'app-holiday-setup',
  templateUrl: './holiday-setup.component.html',
  animations: [
    trigger('fadeIn', [transition('void => *', useAnimation(fadeIn, { params: { timing: 0.3 } }))]),
    trigger('slideInUp', [transition('* => *', useAnimation(slideInUp, { params: { timing: 0.5 } }))]),
    trigger('fadeInUp', [transition('void => *', useAnimation(fadeInUp))]),
    trigger('fadeOutLeft', [transition('* => void', useAnimation(fadeOutLeft, { params: { timing: 0.3 } }))]),
  ],
})
export class HolidaySetupComponent implements OnInit {

  @ViewChild('publicHolidayModal', { static: true }) publicHolidayModal!: ElementRef;
  @ViewChild('yearlyHolidayModal', { static: true }) yearlyHolidayModal!: ElementRef;
  modalTitle: string = "";

  datePickerConfig: Partial<BsDatepickerConfig> = this.utilityService.datePickerConfig();

  constructor(public modalService: CustomModalService,
    public toastr: ToastrService, private userService: UserService,
    private holidaySetupService: HolidaySetupService, private utilityService: UtilityService) { }

  ngOnInit(): void {
    this.getPublicHolidays();
    this.getYearlyHolidays();

  }

  User() {
    return this.userService.User();
  }

  logger(msg: any, optionsParams: any) {
    this.utilityService.consoleLog(msg, optionsParams)
  }

  //#region public Holiday

  months: any[] = this.utilityService.getMonths();
  days: any[] = [];

  getDatesOfMonth(monthNo: any) {
    this.days = [];
    if (monthNo > 0) {
      let monthDaysCount = this.months.find(m => m.monthNo == monthNo).days;
      this.days = this.utilityService.getDates().filter(d => d <= monthDaysCount);
    }
  }

  clearServerErrorText(flag: string) {
    if (flag == "publicHoliday") {
      this.duplicatePublicHoliday = "";
    }
    if (flag == "yearlyHoliday") {
      this.duplicateYearlyHolidayTitle = "";
    }
  }

  ddlReligion: any[] = this.utilityService.getReligions();

  duplicatePublicHoliday: string = "";
  publicHoliday: publicHoliday = {
    publicHolidayId: 0,
    title: "",
    titleInBengali: "",
    description: "",
    month: 0,
    date: 0,
    monthName: "",
    isDepandentOnMoon: false,
    religionId: 0,
    stateStatus: "",
    isApproved: false,
    remarks: "",
    createdBy: "",
    createdDate: null,
    updatedBy: "",
    updatedDate: null,
    approvedBy: "",
    approvedDate: null,
    checkedBy: "",
    checkedDate: null,
    branchId: 0,
    branchName: "",
    divisionId: 0,
    divisionName: "",
    companyId: 0,
    companyName: "",
    organizationId: 0,
    organizationName: "",
    userId: "",
    religionName: "",
    type: ""
  }

  clearPublicHolidayObj() {
    this.publicHoliday = {
      publicHolidayId: 0,
      title: "",
      titleInBengali: "",
      description: "",
      month: 0,
      date: 0,
      isDepandentOnMoon: false,
      religionId: 0,
      stateStatus: "",
      isApproved: false,
      remarks: "",
      createdBy: "",
      createdDate: null,
      updatedBy: "",
      updatedDate: null,
      approvedBy: "",
      approvedDate: null,
      checkedBy: "",
      checkedDate: null,
      branchId: 0,
      branchName: "",
      divisionId: 0,
      divisionName: "",
      companyId: 0,
      companyName: "",
      organizationId: 0,
      organizationName: "",
      userId: "",
      religionName: "",
      monthName: "",
      type: ""
    }
  }

  openPublicHolidayModal() {
    this.modalTitle = "Add Public Holiday";
    this.days = [];
    this.clearPublicHolidayObj();
    this.modalService.open(this.publicHolidayModal, "lg");
  }

  publicHolidayList: any[] = [];
  getPublicHolidays() {
    this.holidaySetupService.getPublicHolidays({ publicHolidayId: 0 }).subscribe(response => {
      this.publicHolidayList = response.body as any[];
    }, (error) => {
      console.log("error >>>>", error);
      this.utilityService.fail('Something went wrong', 'Server Response');
    })
  }

  btnPublicHoliday: boolean = false;
  submitPublicHoliday(publicHolidayForm: NgForm) {

    if (publicHolidayForm.invalid || this.publicHoliday.title == "" || this.publicHoliday.title == null) {
      this.utilityService.fail("Form is invalid", "Site Response");
      this.logger("form invalid", null);
      return;
    }
    this.clearServerErrorText("publicHoliday")
    this.btnPublicHoliday = true;

    this.holidaySetupService.savePublicHoliday(this.publicHoliday).subscribe(response => {

      if (response.status) {
        this.toastr.success("Saved Successfull", "Server Response", { timeOut: 800 })
        this.modalService.service.dismissAll("Save Complete");
        this.getPublicHolidays();
      }
      else {
        if (response.msg == "Validation Error") {
          this.duplicatePublicHoliday = response.errors.duplicatePublicHoliday;
        }
        else {
          this.toastr.error(response.msg, "Server Response", { timeOut: 800 })
        }
      }
      this.btnPublicHoliday = false;
    }, (error) => {
      console.log("error >>>", error);
      this.btnPublicHoliday = false;
      this.utilityService.fail("Something went wrong");
    })

  }

  editPublicHoliday(id: any) {
    this.clearPublicHolidayObj();
    this.modalTitle = "Update Public Holiday"
    this.publicHoliday = Object.assign({}, this.publicHolidayList.find(s => s.publicHolidayId == id));
    this.getDatesOfMonth(this.publicHoliday.month);
    this.logger("this.publicHoliday in edit >>", this.publicHoliday);
    this.modalService.open(this.publicHolidayModal, "lg");
  } 
  //#endregion public Holiday

  //#region yealy holiday
  yearlyHolidayList: any[] = [];
  yearlyHoliday: YearlyHoliday = {
    yearlyHolidayId: 0,
    title: "",
    titleInBengali: "",
    startMonth: 0,
    startYear: 0,
    startDate: null,
    endMonth: 0,
    endYear: 0,
    endDate: null,
    type: "",
    remarks: "",
    stateStatus: "",
    isApproved: false,
    specifiedFor: "",
    designationId: "",
    departmentId: "",
    sectionId: "",
    branchId: "",
    divisionId: "",
    userId: "",
    isDepandentOnMoon: false,
    createdBy: "",
    createdDate: null,
    updatedBy: "",
    updatedDate: null,
    approvedBy: "",
    approvedDate: null,
    checkedBy: "",
    checkedDate: null,
    companyId: 0,
    companyName: "",
    organizationId: 0,
    organizationName: "",
    designationNames: "",
    designationlist: [],
    departmentNames: "",
    departmentlist: [],
    sectionNames: "",
    sectionlist: [],
    unitNames: "",
    unitlist: [],
    branchNames: "",
    branchlist: [],
    divisionNames: "",
    divisionlist: [],
    publicHolidayId: 0
  }

  yearlyHolidayStartAndEndDate: Date[] = [new Date(), new Date()];
  btnYearlyHoliday: boolean = false;
  clearYearlyHolidayObj() {
    this.yearlyHoliday = {
      yearlyHolidayId: 0,
      title: "",
      titleInBengali: "",
      startMonth: 0,
      startYear: 0,
      startDate: null,
      endMonth: 0,
      endYear: 0,
      endDate: null,
      type: "",
      remarks: "",
      stateStatus: "",
      isApproved: false,
      specifiedFor: "Company",
      designationId: "",
      departmentId: "",
      sectionId: "",
      branchId: "",
      divisionId: "",
      userId: "",
      isDepandentOnMoon: false,
      createdBy: "",
      createdDate: null,
      updatedBy: "",
      updatedDate: null,
      approvedBy: "",
      approvedDate: null,
      checkedBy: "",
      checkedDate: null,
      companyId: 0,
      companyName: "",
      organizationId: 0,
      organizationName: "",
      designationNames: "",
      designationlist: [],
      departmentNames: "",
      departmentlist: [],
      sectionNames: "",
      sectionlist: [],
      unitNames: "",
      unitlist: [],
      branchNames: "",
      branchlist: [],
      divisionNames: "",
      divisionlist: [],
      publicHolidayId: null,
    }
    this.yearlyHolidayStartAndEndDate = [new Date(), new Date()];
  }

  touchedSelect2(select2: any) {
    select2.control.touched = true;
  }

  select2Options = {
    width: "100%",
    containerCssClass: "form-control multi-form-control-sm text-x-small font-bold",
    theme: "bootstrap4",
    multiple: true
  }

  yearlyHolidayTypes: string[] = this.utilityService.getYearlyHolidayTypes();
  openYearlyHolidayModal() {
    this.clearYearlyHolidayObj();
    this, this.modalTitle = "Add Yearly Holiday";
    this.modalService.open(this.yearlyHolidayModal, "lg");
  }

  removePublicHolidayItem(index: any) {
    this.assignYearlyHolidayList.splice(index, 1);
    this.assignYearlyHolidayDate.splice(index, 1);
  }

  duplicateYearlyHolidayTitle: string = "";
  submitYearlyHoliday(yearlyHolidayForm: NgForm) {
    this.clearServerErrorText("Yearly Holiday");
    if (this.yearlyHoliday.type != 'Public') {
      this.yearlyHoliday.startDate = parseDate(this.yearlyHolidayStartAndEndDate[0]);
      this.yearlyHoliday.endDate = parseDate(this.yearlyHolidayStartAndEndDate[1]);

      this.btnYearlyHoliday = true;
      this.holidaySetupService.saveYearlyHoliday(this.yearlyHoliday).subscribe(response => {
        if (response.status) {
          this.toastr.success("Saved Successfull", "Server Response", { timeOut: 800 })
          this.modalService.service.dismissAll("Save Complete");
          this.getYearlyHolidays();
        }
        else {
          if (response.msg == "Validation Error") {
            this.duplicateYearlyHolidayTitle = response.errors.duplicateYearlyHolidayTitle;
          }
          else {
            this.toastr.error(response.msg, "Server Response", { timeOut: 800 })
          }
        }
        this.btnYearlyHoliday = false;
      }, (error) => {
        this.btnYearlyHoliday = false;
        this.utilityService.httpErrorHandler(error);
      })
    }
    else if (this.yearlyHoliday.type == 'Public') {
      this.assignYearlyHolidayList.forEach((value, index) => {
        if (value?.isDepandentOnMoon) {
          value.startDate = this.assignYearlyHolidayDate[index][0];
          value.endDate = this.assignYearlyHolidayDate[index][1];
          value.startMonth = value.startDate.getMonth();
          value.startYear = value.startDate.getFullYear();
          value.endMonth = value.endDate.getMonth();
          value.endYear = value.endDate.getFullYear();
        }
      });

      this.btnYearlyHoliday = true;
      this.holidaySetupService.saveYearlyPublicHoliday(this.assignYearlyHolidayList).subscribe(response => {
        if (response.status) {
          this.toastr.success("Saved Successfull", "Server Response", { timeOut: 800 })
          this.modalService.service.dismissAll("Save Complete");
          this.getYearlyHolidays();
        }
        else {
          if (response.msg == "Validation Error") {
            this.duplicateYearlyHolidayTitle = response.errors.duplicateYearlyHolidayTitle;
          }
          else {
            this.toastr.error(response.msg, "Server Response", { timeOut: 800 })
          }
        }
        this.btnYearlyHoliday = false;
      }, (error) => {
        this.utilityService.httpErrorHandler(error);
        this.btnYearlyHoliday = false;
      })
      this.logger("this.assignYearlyHolidayList >>", this.assignYearlyHolidayList);
    }
  }

  getYearlyHolidays() {
    this.holidaySetupService.getYearlyHolidays({}).subscribe(response => {
      this.yearlyHolidayList = response.body;
    })
  }

  edityearlyHoliday(id: any) {
    this.clearYearlyHolidayObj();
    this.modalTitle = "Update Yearly Holiday";
    this.yearlyHoliday = Object.assign({}, this.yearlyHolidayList.find(yh => yh.yearlyHolidayId == id));
    this.yearlyHoliday.startDate = new Date(this.yearlyHoliday.startDate);
    this.yearlyHoliday.endDate = new Date(this.yearlyHoliday.endDate);
    this.yearlyHolidayStartAndEndDate = [this.yearlyHoliday.startDate, this.yearlyHoliday.endDate];
    this.modalService.open(this.yearlyHolidayModal, "lg");
  }

  assignYearlyHolidayList: any[] = [];
  assignYearlyHolidayDate: Date[][];
  assignYearlyHoliday() {
    this.assignYearlyHolidayList = [];
    this.assignYearlyHolidayDate = [];

    this.holidaySetupService.getAssignYearlyHoliday({}).subscribe(response => {
      console.log("getAssignYearlyHoliday >>", response);
      this.assignYearlyHolidayList = response.body;
      if (this.assignYearlyHolidayList != null && this.assignYearlyHolidayList.length > 0) {
        this.assignYearlyHolidayList.forEach((value, index) => {
          if (value.startDate == null) {
            this.assignYearlyHolidayDate.push([])
          }
          else {
            this.assignYearlyHolidayDate.push([new Date(value.startDate), new Date(value.endDate)])
          }

        })
        console.log("this.assignYearlyHolidayDate >>>", this.assignYearlyHolidayDate);
      }
    }, (error) => {
      console.log("error >>>", error);
      this.utilityService.fail("Something went wrong", "Server Response");
    })

  }

  branchData: any[] = [
    { id: "branch1", text: "Branch1" },
    { id: "branch2", text: "Branch2" },
    { id: "branch3", text: "Branch3" },
    { id: "branch4", text: "Branch4" },
    { id: "branch5", text: "Branch5" },
    { id: "branch6", text: "Branch6" },
    { id: "branch7", text: "Branch7" },
    { id: "branch8", text: "Branch8" },
    { id: "branch9", text: "Branch9" },
    { id: "branch10", text: "Branch10" }
  ]

  //#endregion

}
