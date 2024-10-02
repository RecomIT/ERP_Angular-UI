import { transition, trigger, useAnimation } from '@angular/animations';
import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { bounceIn, fadeIn, fadeInRight, slideInUp } from 'ng-animate';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { CustomModalService } from 'src/app/shared/services/custom-modal.service';
import { UserService } from 'src/app/shared/services/user.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { DailyAttendanceService } from './daily-attendance.service';

@Component({
  selector: 'attendance-module-daily-attendance-list',
  templateUrl: './daily-attendance.component.html',
  animations: [
    trigger('slideInUp', [transition('* => *', useAnimation(slideInUp, { params: { timing: 0.5 } }))]),
    trigger('fadeIn', [transition('void => *', useAnimation(fadeIn, { params: { timing: 0.3 } }))]),
    trigger('fadeInRight', [transition('void => *', useAnimation(fadeInRight, { params: { timing: 0.5 } }))]),
    trigger('bounceIn', [transition('void => *', useAnimation(bounceIn, { params: { timing: 1 } }))]),
  ]
})
export class DailyAttendanceComponent implements OnInit {
  pagePrivilege: any= this.userService.getPrivileges();
  attnSummeryPageSize: number = 15;
  attnSummeryPageNo: number = 1;
  attnSummeryPageConfig: any = this.userService.pageConfigInit("attnSummeryData", this.attnSummeryPageSize, 1, 0);

  dailyAttnPageSize: number = 31;
  dailyAttnPageNo: number = 1;
  dailyAttnPageConfig: any = this.userService.pageConfigInit("dailyAttnData", this.dailyAttnPageSize, 1, 0);

  datePickerConfig: Partial<BsDatepickerConfig> = this.utilityService.datePickerConfig();
  constructor(private datepipe: DatePipe,
    private utilityService: UtilityService, private userService: UserService, 
    public modalService: CustomModalService, 
    private dailyAttendanceService: DailyAttendanceService) {
    
  }

  ngOnInit(): void {
    this.getYears();
    this.getEmployeeAttendanceSummery()
    this.getEmployeeDailyAttendance();
  }

  select2Options = this.utilityService.select2Config()

  logger(msg: any, options: any) {
    this.utilityService.consoleLog(msg, options);
  }

  User() {
    return this.userService.User();
  }

  attendanceSummeryPageChanged(pageNo: any) {
    this.attnSummeryPageNo = pageNo;
    this.getEmployeeAttendanceSummery(this.attnSummeryPageNo);
    
  }

  isSummeryInit: boolean = false;
  summeryEmployeeChanged() {
    if (this.isSummeryInit) {
      this.getEmployeeAttendanceSummery()
    }
    this.isSummeryInit = true;
  }

  searchBySummeryEmployee: any = 0;
  searchByMonth: number = 0;
  searchByYear: number = 0;

  listOfAttendanceSummery: any[] = [];
  summeryAttendanceDTLabel: string = null;

  getEmployeeAttendanceSummery(pageNo: number = 1) {
    this.attnSummeryPageNo = pageNo;
    let params = { employeeId: this.User().EmployeeId, month: this.searchByMonth, year: this.searchByYear, pageNumber: this.attnSummeryPageNo, pageSize: this.attnSummeryPageSize };

    this.dailyAttendanceService.get(params).subscribe(response=>{
      this.listOfAttendanceSummery = response.body;
      this.summeryAttendanceDTLabel = this.listOfAttendanceSummery.length == 0 ? 'No record(s) found' : null;
      var xPaginate = JSON.parse(response.headers.get('X-Pagination'));
      this.attnSummeryPageConfig = this.userService.pageConfigInit("attnSummeryData", xPaginate.itemsPerPage, xPaginate.currentPage, xPaginate.totalItems);
    })
  }

  searchByAttnEmployee: any = 0;
  searchByDate: any[]  = [];
  searchByToDate: string = "";
  searchByAttStatus: string = "";

  listOfDailyAttendance: any[] = [];
  dailyAttendanceDTLabel: string = null;

  dailyAttendancePageChanged(pageNo: any) {
    this.dailyAttnPageNo = pageNo;
    this.getEmployeeDailyAttendance(this.dailyAttnPageNo);
  }

  isDailyInit: boolean = false;
  dailyEmployeeChanged() {
    if (this.isDailyInit) {
      this.getEmployeeDailyAttendance()
    }
    this.isDailyInit = true;
  }

  years: any[] = [];
  getYears() {
    this.years = this.utilityService.getYears(2);
  }

  getEmployeeDailyAttendance(pageNo: number = 1) {
    this.dailyAttnPageNo = pageNo;
    let fromDate = '';
    let toDate = '';
    if(this.searchByDate.length){
      fromDate = this.searchByDate.length >  0 ? this.datepipe.transform(this.searchByDate[0], 'yyyy-MM-dd') : "";
      toDate = this.searchByDate.length >  0 ? this.datepipe.transform(this.searchByDate[1], 'yyyy-MM-dd') : "";
    } 
    
    this.dailyAttendanceService.getById({ employeeId: this.User().EmployeeId, fromDate: fromDate, toDate: toDate, pageNumber: this.dailyAttnPageNo, pageSize: this.dailyAttnPageSize })
    .subscribe(response=>{
      this.listOfDailyAttendance = response.body;
      this.dailyAttendanceDTLabel = this.listOfDailyAttendance.length == 0 ? 'No record(s) found' : null;
      var xPaginate = JSON.parse(response.headers.get('X-Pagination'));
      this.dailyAttnPageConfig = this.userService.pageConfigInit("dailyAttnData", xPaginate.itemsPerPage, xPaginate.currentPage, xPaginate.totalItems);
    },(error)=>{
      console.log("error >>>", error);
      this.utilityService.fail('Something went wrong','Server Response')
    })
  }

  downloadEmployeeDailyAttendanceReport(employeeId: number, month: number, year: number) {
    this.dailyAttendanceService.employeeReport({employeeId:employeeId,attendanceMonth:month,attendanceYear:year}).subscribe(response=>{
      this.utilityService.randerFile(response,'application/pdf');
    },(error)=>{
      console.log("error >>>", error);
      this.utilityService.fail("Something went wrong","Server Response");
    })
  }

}
