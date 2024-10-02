import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { ApiArea, ApiController } from 'src/app/shared/constants';
import { CustomModalService } from 'src/app/shared/services/custom-modal.service';
import { UserService } from 'src/app/shared/services/user.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { employeeWorkShift, workShift } from 'src/models/hrm/work-shift-model';
import { AreasHttpService } from '../../../../areas.http.service';
import { trigger, transition, useAnimation } from '@angular/animations';
import { HrWebService } from 'src/app/shared/services/hr-web.service';
import { fadeIn, fadeInUp, fadeOutLeft, slideInUp } from 'ng-animate';
import { WorkShiftService } from '../../work-shit.service';
import { DepartmentService } from 'src/app/areas/employee_module/Organizational/department/department.service';
import { EmployeeInfoService } from 'src/app/areas/employee_module/employee/employee-info.service';
import { EmployeeRousterService } from '../../rouster/employee-rouster.service';
import { DesignationService } from 'src/app/areas/employee_module/Organizational/designation/designation.service';
import { SectionService } from 'src/app/areas/employee_module/Organizational/section/section.service';
import { SubSectionService } from 'src/app/areas/employee_module/Organizational/subsection/subsection.service';

@Component({
  selector: 'app-work-shift',
  templateUrl: './work-shift.component.html',
  animations: [
    trigger('fadeIn', [transition('void => *', useAnimation(fadeIn, { params: { timing: 0.3 } }))]),
    trigger('slideInUp', [transition('* => *', useAnimation(slideInUp, { params: { timing: 0.5 } }))]),
    trigger('fadeInUp', [transition('void => *', useAnimation(fadeInUp))]),
    trigger('fadeOutLeft', [transition('* => void', useAnimation(fadeOutLeft, { params: { timing: 0.3 } }))]),
  ],
})
export class WorkShiftComponent implements OnInit {

  @ViewChild('workShiftModal', { static: true }) workShiftModal!: ElementRef;
  @ViewChild('workShiftApprovalModal', { static: true }) workShiftApprovalModal!: ElementRef;
  modalTitle: string = "";

  pageTabs: boolean = true;
  employeeWorkShiftEntry: boolean = false;
  employeeWorkShiftChecking: boolean = false;
  pageSize: number = 15;
  pageNo: number = 1;
  datePickerConfig: Partial<BsDatepickerConfig> = {};

  employeesWorkShiftPageConfig: any = this.userService.pageConfigInit("employeeShiftData", this.pageSize, 1, 0);

  constructor(public modalService: CustomModalService,
    private areasHttpService: AreasHttpService, private userService: UserService,
    private departmentService: DepartmentService,
    private designationService: DesignationService,
    private sectionService: SectionService,
    private subSectionService: SubSectionService,
    private utilityService: UtilityService,
    private employeeInfoService: EmployeeInfoService,
    private workShiftService: WorkShiftService,
    private employeeRousterService: EmployeeRousterService) { }

  ngOnInit(): void {
    this.loadDepartments();
    this.loadEmployees("", 0, 0, 0);
    this.getWorkShifts();
    this.getEmployeesWorkShifts();
    this.datePickerConfig = Object.assign({}, {
      containerClass: "theme-dark-blue",
      showWeekNumbers: false,
      dateInputFormat: "DD-MMM-YYYY",
      isAnimated: true,
      showClearButton: false,
      showTodayButton: false,
      todayPosition: "left",
      rangeInputFormat: "DD-MMM-YYYY",
      rangeSeparator: " ~ "
    })
  }

  User() {
    return this.userService.User();
  }

  touchedSelect2(select2: any) {
    select2.control.touched = true;
  }

  select2Options = {
    width: "100%",
    containerCssClass: "form-control form-control-sm text-x-small font-bold",
    theme: "bootstrap4",
    multiple: true
  }

  employeeShiftSelect2Options = {
    width: "100%",
    containerCssClass: "form-control form-control-sm text-x-small font-bold",
    theme: "bootstrap4"
  }

  days: any[] = [{ id: "Friday", text: "Friday" }, { id: "Saturday", text: "Saturday" }, { id: "Sunday", text: "Sunday" }, { id: "Monday", text: "Monday" }, { id: "Tuesday", text: "Tuesday" }, { id: "Wednesday", text: "Wednesday" }, { id: "Thursday", text: "Thursday" }]

  logger(msg: any, optionsParams: any) {
    this.utilityService.consoleLog(msg, optionsParams)
  }

  //#region Work-Shift
  workShift: workShift = {
    workShiftId: 0,
    title: "",
    titleInBengali: "",
    name: "",
    nameDetail: "",
    nameInBengali: "",
    nameDetailInBengali: "",
    remarks: "",
    startTime: null,
    endTime: null,
    inBufferTime: 0,
    maxInTime: null,
    lunchStartTime: null,
    lunchEndTime: null,
    oTStartTime: null,
    maxOTHour: 0,
    maxBeforeTime: 0,
    maxAfterTime: 0,
    exceededMaxAfterTime: 0,
    weekendDayName: "",
    weekends: [],
    stateStatus: "",
    isApproved: false,
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
    branchId: 0,
    branchName: "",
    divisionId: 0,
    divisionName: "",
    userId: ""
  }
  workShiftList: any[] = [];
  btnWorkShift: boolean = false;

  openWorkShiftModal() {
    this.modalTitle = "Add Work Shift";
    this.modalService.open(this.workShiftModal, "lg")
    this.btnWorkShift = false;
  }

  clearWorkShiftObj() {
    this.workShift = {
      workShiftId: 0,
      title: "",
      titleInBengali: "",
      name: "",
      nameDetail: "",
      nameInBengali: "",
      nameDetailInBengali: "",
      remarks: "",
      startTime: null,
      endTime: null,
      inBufferTime: 0,
      maxInTime: null,
      lunchStartTime: null,
      lunchEndTime: null,
      oTStartTime: null,
      maxOTHour: 0,
      maxBeforeTime: 0,
      maxAfterTime: 0,
      exceededMaxAfterTime: 0,
      weekendDayName: "",
      weekends: [],
      stateStatus: "",
      isApproved: false,
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
      branchId: 0,
      branchName: "",
      divisionId: 0,
      divisionName: "",
      userId: ""
    }
  }

  getWorkShifts() {
    this.workShiftService.get({}).subscribe(response => {
      this.workShiftList = response.body as any[];
    }, (error) => {
      console.log('error >>>', error);
      this.utilityService.fail('Something went wrong', 'Server Response');
    })
  }

  submitWorkShiftForm(workShiftForm: NgForm) {
    if (workShiftForm.valid) {
      this.btnWorkShift = true;
      this.workShiftService.save(this.workShift).subscribe(response => {
        this.btnWorkShift = false;
        if (response.status) {
          this.modalService.service.dismissAll()
          this.utilityService.success(response.msg, 'Server Response')
          this.getWorkShifts();
        }
        else {
          if (response.msg == "Validation Error") {
          }
          else {
            this.utilityService.fail(response.msg, "Server Response")
          }
        }
      }, error => {
        this.btnWorkShift = false;
        this.logger("error", error);
        this.utilityService.fail(error, "Server Response")
      })
    }
    else {
      this.utilityService.fail('Invalid form submission', 'Site Response');
    }
  }

  editWorkShift(id: any) {
    this.modalTitle = "Update Work Shift";
    this.workShift = Object.assign({}, this.workShiftList.find(s => s.workShiftId == id));
    this.workShift.weekends = this.workShift.weekendDayName.split(',');
    this.workShift.startTime = this.utilityService.getDateWithSetTime(this.workShift.startTime?.toString());
    this.workShift.endTime = this.utilityService.getDateWithSetTime(this.workShift.endTime?.toString());
    this.workShift.lunchStartTime = this.utilityService.getDateWithSetTime(this.workShift.lunchStartTime?.toString());
    this.workShift.lunchEndTime = this.utilityService.getDateWithSetTime(this.workShift.lunchEndTime?.toString());
    this.workShift.maxInTime = this.utilityService.getDateWithSetTime(this.workShift.maxInTime?.toString());
    this.workShift.oTStartTime = this.utilityService.getDateWithSetTime(this.workShift.oTStartTime?.toString());
    this.openWorkShiftModal();
  }

  workShiftApprovalOrReject(id: any) {
    this.modalTitle = "Checking Work-Shift";
    this.workShift = Object.assign({}, this.workShiftList.find(s => s.workShiftId == id));
    this.modalService.open(this.workShiftApprovalModal, "lg");
  }

  btnWorkShiftChecking: boolean = false;
  submitWorkShiftChecking(remarks: string, status: string) {
    if (status != null && status != '') {
      this.btnWorkShiftChecking = true;
      this.workShiftService.approval({ workShiftId: this.workShift.workShiftId, remarks: remarks, stateStatus: status }).subscribe(response => {
        if (response.status) {
          this.utilityService.success(response.msg, 'Server Response');
          this.modalService.service.dismissAll();
          this.getWorkShifts();
        }
        else {
          if (response?.msg == 'Validation error') {
            this.utilityService.fail('Validation', 'Server Response')
          }
          else {
            this.utilityService.fail(response.msg, 'Server Response')
          }
        }
      }, (error) => {
        console.log('error >>>', error);
        this.utilityService.fail('Something went wrong', 'Server Response');
      })
    }
    else {
      this.utilityService.fail('Invalid form submission', 'Site Response');
    }
  }

  //#endregion

  //#region Employee-Work-Shift
  ddlEmployees: any;

  employeeWorkShift: employeeWorkShift = {
    employeeWorkShiftId: 0,
    employeeId: 0,
    isActive: false,
    isApproved: false,
    stateStatus: "",
    activeDate: null,
    inActiveDate: null,
    gradeId: 0,
    designationId: 0,
    departmentId: 0,
    sectionId: 0,
    subsectionId: 0,
    unitId: 0,
    workShiftId: 0,
    gradeName: "",
    designationName: "",
    departmentName: "",
    sectionName: "",
    unitName: "",
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
    branchId: 0,
    branchName: "",
    divisionId: 0,
    divisionName: "",
    userId: "",
    subSectionName: "",
    workShiftName: "",
    fullName: "",
    employeeCode: "",
    remarks: "",
    currentWorkShiftId: 0,
    error: false,
    currentWorkShiftName: "",
    isSelected: false
  }

  btnEmployeeWorkShift: boolean = false;

  clearEmployeeWorkShift() {
    this.employeeWorkShift = {
      employeeWorkShiftId: 0,
      employeeId: 0,
      isActive: false,
      isApproved: false,
      stateStatus: "",
      activeDate: null,
      inActiveDate: null,
      gradeId: 0,
      designationId: 0,
      departmentId: 0,
      sectionId: 0,
      subsectionId: 0,
      unitId: 0,
      workShiftId: 0,
      gradeName: "",
      designationName: "",
      departmentName: "",
      sectionName: "",
      unitName: "",
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
      branchId: 0,
      branchName: "",
      divisionId: 0,
      divisionName: "",
      userId: "",
      subSectionName: "",
      workShiftName: "",
      fullName: "",
      employeeCode: "",
      remarks: "",
      currentWorkShiftId: 0,
      error: false,
      currentWorkShiftName: "",
      isSelected: false
    }
  }

  showHidePageSection(flag: string) {
    if (flag == "pageTabs") {
      this.pageTabs = true;
      this.employeeWorkShiftEntry = false;
      this.employeeWorkShiftChecking = false;
      this.loadDepartments();
      this.loadEmployees("", 0, 0, 0);
      this.getWorkShifts();
      this.getEmployeesWorkShifts();
    }
    else if (flag == "employeeWorkShiftEntry") {
      this.pageTabs = false;
      this.employeeWorkShiftEntry = true;
      this.employeeWorkShiftChecking = false;
      this.shiftEmployeesData = [];
      this.loadDesignations();
      this.loadDepartments();
      this.loadEmployees("", 0, 0, 0);
      this.loadWorkShift();
    }
    else if (flag == "employeeWorkShiftChecking") {
      this.pageTabs = false;
      this.employeeWorkShiftEntry = false;
      this.employeeWorkShiftChecking = true;
      this.getEmployeesWorkShifts();
      this.loadDesignations();
      this.loadDepartments();
      this.loadEmployees("", 0, 0, 0);
      this.loadWorkShift();
    }
  }


  loadEmployees(designation: any, department: any, section: any, subsection: any) {
    this.employeeInfoService.loadDropdownData({ designationId: designation, departmentId: department, sectionId: section, subSectionId: subsection });
    this.employeeInfoService.ddl_employee_data$.subscribe(data => {
      this.employeeInfoService.loadDropdown(data);
      this.ddlEmployees = this.employeeInfoService.ddl$;
    }, error => {
      console.error('Error while fetching data:', error);
    });
  }

  designationList: any;
  loadDesignations() {
    this.designationService.loadDesignationDropdown();
    this.designationList = this.designationService.ddl$;
  }

  departmentList: any;
  loadDepartments() {
    this.sectionList = [];
    this.subsectionList = [];
    this.departmentService.loadDepartmentDropdown();
    this.departmentList = this.departmentService.ddl$;
  }

  sectionList: any = [];
  loadSections(deptId: any) {
    this.sectionList = [];
    this.subsectionList = [];

    this.sectionService.loadSectionDropdown({ departmentId: deptId });
    this.sectionService.ddl$.subscribe(data => {
      this.sectionList = data;
    });
    console.log("this.sectionList >>>", this.sectionList);
  }

  subsectionList: any[] = [];
  loadSubsections(sectionId: any) {
    this.subsectionList = [];
    this.subSectionService.loadSubSectionDropdown({ sectionId: sectionId });
    this.subSectionService.ddl$.subscribe(data => {
      this.subsectionList = data;
    });
  }

  ddlWorkShiftList: any[] = [];
  loadWorkShift() {
    this.ddlWorkShiftList = [];
    this.workShiftService.loadWorkShiftDropdown();
    this.workShiftService.ddl$.subscribe(data => {
      this.ddlWorkShiftList = data;
    })
  }

  shiftEmployeesData: any[] = [];
  loadEmployeesForShiftAssign(employeeId: any, designationId: any, departmentId: any, sectionId: any, subsectionId: any, single: boolean) {
    let desig = 0;
    if (designationId != "") {
      desig = designationId.split('#')[0];
    }
    this.areasHttpService.observable_get((ApiArea.hrms + "/Employee/Info" + "/GetEmployeesForShiftAssign"), {
      responseType: "json",
      params: {
        employeeId: (employeeId == null || employeeId == '' ? 0 : employeeId), designationId: desig, departmentId: departmentId, sectionId: sectionId, subsectionId: subsectionId,
      }
    }).subscribe(data => {
      let emp = data as any[];
      console.log("response emp ", emp);
      if (single) {
        this.addSingleEmployee(emp[0]);
      }
      else {
        this.shiftEmployeesData = [];
        this.shiftEmployeesData = emp;
      }
      this.logger("data >>> ", data)
    })
  }

  assignAllShiftTogether(shift: any, activeDate: any, remarks: any) {
    if (this.shiftEmployeesData.length > 0) {
      this.shiftEmployeesData.forEach(s => {
        s.workShiftId = shift;
        s.activeDate = (activeDate != null && activeDate != '') ? new Date(activeDate) : null;
        s.remarks = remarks;
      });
    }
  }

  loadEmployeeSingly(employeeId: any) {
    if (employeeId != null && employeeId != "" && employeeId > 0) {
      this.loadEmployeesForShiftAssign(employeeId, 0, 0, 0, 0, true)
    }
  }

  addSingleEmployee(data: any) {
    let employeeExist = this.shiftEmployeesData.find(s => s.employeeId == data.employeeId) != null;
    if (!employeeExist) {
      this.shiftEmployeesData.push(data);
    }
  }

  validateUnChanged() {
    let isValid = true
    this.shiftEmployeesData.forEach(e => {
      console.log("e.currentWorkShiftId >>>", e.currentWorkShiftId);
      console.log("e.workShiftId >>>", e.workShiftId);
      e.error = e.currentWorkShiftId == e.workShiftId || e.workShiftId == 0;
      if (e.error) {
        isValid = false;
      }
    });
    return isValid;
  }

  submitEmployeesWorkShift(employeeShiftForm: NgForm) {
    if (employeeShiftForm.valid && this.validateUnChanged() == true && this.shiftEmployeesData.length > 0) {
      this.shiftEmployeesData[0].createdBy = this.User().UserId;
      this.areasHttpService.observable_post((ApiArea.hrms + "/Attendance/EmployeeShift" + "/SaveEmployeesWorkShift"),
        JSON.stringify(this.shiftEmployeesData),
        {
          'headers': {
            'Content-Type': 'application/json'
          },
        }).subscribe((result) => {
          let data = result as any;
          this.logger("data >>>", data)
          if (data.status) {
            this.utilityService.success("Saved Successfull", "Server Response")
            this.modalService.service.dismissAll("Save Complete");
          }
          else {
            if (data.msg == "Validation Error") {
              this.utilityService.fail(data.errors.duplicateEmployeeShift, "Server Response", 2000)
            }
            else {
              this.utilityService.success(data.msg, "Server Response")
            }
          }
        },
          (error) => {
            this.logger("error", error);
            this.utilityService.fail(error.error, "Server Response")
          })
    }
  }

  employeeWorkShiftDTLabel: string = null;
  employeeWorkShiftList: any[] = [];
  getEmployeesWorkShifts() {
    this.employeeRousterService.get({ employeeId: this.searchByEmployee, departmentId: this.searchByDepartment, stateFlag: 'Roster' }).subscribe(response => {
      this.employeeWorkShiftList = response.body as any[];
      this.employeeWorkShiftDTLabel = this.employeeWorkShiftList.length == 0 ? 'No record(s) found' : null;
    },
      (error) => {
        console.log("error >>>", error);
        this.utilityService.fail('Somthing went wrong', 'Server Response');
      })

  }

  searchByDepartment: number = 0;
  searchByEmployee: number = 0;

  employeeInit: boolean = false;
  searchByEmployee_changed() {
    if (this.employeeInit) {
      this.getEmployeesWorkShifts();
    }
    this.employeeInit = true;
  }

  employeesWorkShiftsPageChanged(event: any) {
    this.pageNo = event;
    this.getEmployeesWorkShifts()
  }

  // Employee-Work Shift Checking

  masterSelected: boolean;
  selectedRowsCount: number = 0;
  chkEmployeeWorkShiftList: employeeWorkShift[] = [];
  checkUncheckAll() {
    for (var i = 0; i < this.employeeWorkShiftList.length; i++) {
      this.employeeWorkShiftList[i].isSelected = this.masterSelected;
    }
    this.chkEmployeeWorkShiftList = Object.assign([], this.employeeWorkShiftList.filter(s => s.isSelected));
    this.selectedRowsCount = this.chkEmployeeWorkShiftList.length;
  }

  isAllSelected() {
    this.masterSelected = this.employeeWorkShiftList.every(function (item: any) {
      return item.isSelected == true;
    });
    this.chkEmployeeWorkShiftList = Object.assign([], this.employeeWorkShiftList.filter(s => s.isSelected));
    this.selectedRowsCount = this.chkEmployeeWorkShiftList.length;
  }

  btnEmployeesWorkShiftChecking: boolean = false;
  SubmitEmployeesWorkShiftChecking() {
    let data = Object.assign([], this.employeeWorkShiftList.filter(s => s.isSelected));
    if (data.length > 0) {
      data[0].approvedBy = this.User().UserId;
      this.btnEmployeesWorkShiftChecking = true;
      this.areasHttpService.observable_post((ApiArea.hrms + ApiController.hr + "/SaveEmployeesWorkShiftChecking"),
        JSON.stringify(data),
        {
          'headers': {
            'Content-Type': 'application/json'
          },
        }).subscribe((result) => {
          let data = result as any;
          this.btnEmployeesWorkShiftChecking = true;
          this.logger("data >>>", data)
          if (data.status) {
            this.utilityService.success("Saved Successfull", "Server Response")
            this.showHidePageSection("pageTabs");
          }
          else {
            if (data.msg == "Validation Error") {
              this.utilityService.fail(data.errors.duplicateEmployeeShift, "Server Response", 2000)
            }
            else {
              this.utilityService.success(data.msg, "Server Response")
            }
          }
        },
          (error) => {
            this.btnEmployeesWorkShiftChecking = true;
            this.logger("error", error);
            this.utilityService.fail(error.error, "Server Response")
          })
    }
  }

  //#endregion

}
