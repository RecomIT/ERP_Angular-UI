import { Component, OnInit, ViewChild } from '@angular/core';
import { EmployeeLeaveDashboardRoutingService } from '../../../common-dashboard-routing/employee-leave-dashboard-routing/employee-leave-dashboard-routing.service';
import { Chart, ChartType } from 'chart.js';
import dayGridPlugin from '@fullcalendar/daygrid';
import { RandomColorService } from 'src/app/shared/services/random-color/random-color.service';
import { UserService } from 'src/app/shared/services/user.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { NotifyService } from 'src/app/shared/services/notify-service/notify.service';


@Component({
  selector: 'app-my-leave-history',
  templateUrl: './my-leave-history.component.html',
  styleUrls: ['./my-leave-history.component.css']
})


export class MyLeaveHistoryComponent implements OnInit {

  constructor(
    private employeeLeaveDashboardRoutingService: EmployeeLeaveDashboardRoutingService,
    private userService: UserService,
    private utilityService : UtilityService,
    private notifyService : NotifyService
  ) { }

  ngOnInit(): void {

    this.currentYear = new Date().getFullYear();
    this.currentMonth = new Date().getMonth() + 1;

    this.fromYear = this.currentYear;
    this.fromMonth = this.currentMonth;

    this.toYear = 0;
    this.toMonth = 0;

    this.getLeavePeriodYears();

    this.getLeavePeriodFromMonths();
    this.getLeavePeriodToMonths();

    this.getMyLeaveHistory();

  }



  currentYear: number;
  currentMonth: number;

  fromYear: number;
  toYear: number;

  leavePeriodYear: { id: number, text: string }[] = [];

  getLeavePeriodYears() {

    this.employeeLeaveDashboardRoutingService.getLeavePeriodYearAsync<any>(null).subscribe({
      next: (response) => {
        if (Array.isArray(response)) {
          this.leavePeriodYear = response;

        }
      },
      error: (error: any) => {
        console.error(error);

      }
    });

  }

  downloadLeaveCard() {
    this.employeeLeaveDashboardRoutingService.downloadLeaveCard<any>(this.userService.User().EmployeeId).subscribe({
      next: (response) => {
        if (response instanceof Blob) {
          if (response.size > 0) {
            this.utilityService.downloadFile(response, response.type, "Annual leave card" + ".pdf")
          }
        }
        else {
          this.utilityService.fail('No data available for report generation', "Server Response");
        }
      },
      error: (error) => {
        this.notifyService.handleApiError(error)
      }
    });
  }


  onFromYearChange() {

    this.getLeavePeriodFromMonths();

    this.fromMonth = 0;

    this.getMyLeaveHistory();

  }




  onToYearChange() {

    this.getLeavePeriodToMonths();

    this.toMonth = 0;

    this.getMyLeaveHistory();

  }



  leavePeriodFromMonth: { id: number, text: string }[] = [];

  getLeavePeriodFromMonths() {

    const params: any = {};

    if (this.fromYear && this.fromYear != null) {
      params['year'] = this.fromYear;
    }

    this.employeeLeaveDashboardRoutingService.getLeavePeriodMonthAsync<any>(params).subscribe({
      next: (response) => {
        if (Array.isArray(response)) {
          this.leavePeriodFromMonth = response;
        }
      },
      error: (error: any) => {
        console.error(error);

      }
    });

  }




  leavePeriodToMonth: { id: number, text: string }[] = [];

  getLeavePeriodToMonths() {

    const params: any = {};

    if (this.toYear && this.toYear != null) {
      params['year'] = this.toYear;
    }

    this.employeeLeaveDashboardRoutingService.getLeavePeriodMonthAsync<any>(params).subscribe({
      next: (response) => {
        if (Array.isArray(response)) {
          this.leavePeriodToMonth = response;
        }
      },
      error: (error: any) => {
        console.error(error);

      }
    });

  }




  fromMonth: number;
  toMonth: number;


  onFromMonthChange() {
    this.getMyLeaveHistory();
  }


  onToMonthChange() {
    this.getMyLeaveHistory();
  }







  myleaveHistoryList: any[] = [];

  getMyLeaveHistory() {

    const params: any = {};


    if (this.fromYear && this.fromYear > 0) {
      params['fromYear'] = this.fromYear;
    }

    if (this.toYear && this.toYear > 0) {
      params['toYear'] = this.toYear;
    }

    if (this.fromMonth && this.fromMonth > 0) {
      params['fromMonth'] = this.fromMonth;
    }

    if (this.toMonth && this.toMonth > 0) {
      params['toMonth'] = this.toMonth;
    }

    this.employeeLeaveDashboardRoutingService.getMyLeaveHistoryAsync<any>(params).subscribe({
      next: (response) => {
        if (Array.isArray(response)) {
          this.myleaveHistoryList = response;

          const allCalendarEvents = [];
          const colorMap: { [key: string]: string } = {};

          for (const leaveDetail of this.myleaveHistoryList) {
            // Check if LeaveDates is not null before attempting to split
            if (leaveDetail.LeaveDates && typeof leaveDetail.LeaveDates === 'string') {
              const leaveTypeShortName = leaveDetail.LeaveTypeShortName;

              // Assign a color if not already assigned
              colorMap[leaveTypeShortName] = colorMap[leaveTypeShortName] || getRandomColor();

              const leaveTypeEvents = leaveDetail.LeaveDates.split(', ').map((date: string) => ({
                title: leaveTypeShortName,
                start: new Date(date),
                color: colorMap[leaveTypeShortName],
              }));

              allCalendarEvents.push(...leaveTypeEvents);
            }
          }

          this.myAttendnceCalendarEvents = allCalendarEvents;

          // Function to generate a random color
          function getRandomColor() {
            return '#' + Math.floor(Math.random() * 16777215).toString(16);
          }


        }
      },
      error: (error: any) => {
        console.error(error);

      }
    });

  }



  // ------------------------------ Leave Type 



  getUniqueLeaveType(): Set<number> {
    return new Set(this.myleaveHistoryList.map(leaveDetail => leaveDetail.LeaveTypeId));
  }

  getLeaveTypeName(leaveTypeId: number): string {
    const leaveDetails = this.myleaveHistoryList.find(leaveDetail => leaveDetail.LeaveTypeId === leaveTypeId);
    return leaveDetails ? leaveDetails.LeaveTypeName : '';
  }

  getAllottedLeave(leaveTypeId: number): number {
    const leaveDetails = this.myleaveHistoryList.find(leaveDetail => leaveDetail.LeaveTypeId === leaveTypeId);
    return leaveDetails ? leaveDetails.AllottedLeave : '';
  }

  getLeaveAvailed(leaveTypeId: number): number {
    const leaveDetails = this.myleaveHistoryList.find(leaveDetail => leaveDetail.LeaveTypeId === leaveTypeId);
    return leaveDetails ? leaveDetails.YearlyLeaveTypeAvailed : 0;
  }

  getLeaveBalance(leaveTypeId: number): number {
    const leaveDetails = this.myleaveHistoryList.find(leaveDetail => leaveDetail.LeaveTypeId === leaveTypeId);
    return leaveDetails ? leaveDetails.YearlyLeaveTypeBalance : '';
  }


  getLeaveDetailsByType(leaveTypeId: number): any {
    return this.myleaveHistoryList.filter(leaveDetail => leaveDetail.LeaveTypeId === leaveTypeId);
  }



  // ------------------------------ Months

  getUniqueMonths(): number[] {
    return Array.from(new Set(this.myleaveHistoryList.map(leaveDetail => leaveDetail.Month)));
  }


  getMonthName(month: number): string {
    const leaveDetails = this.myleaveHistoryList.find(leaveDetail => leaveDetail.Month === month);
    return leaveDetails ? leaveDetails.MonthName : '';
  }


  getMonthlyTotalLeaveAvailed(month: number): number {
    const leaveDetails = this.myleaveHistoryList.find(leaveDetail => leaveDetail.Month === month);
    return leaveDetails ? leaveDetails.MonthlyTotalLeaveAvailed : '';
  }


  getLeaveDetailsByMonth(month: number): any[] {
    return this.myleaveHistoryList.filter(leaveDetail => leaveDetail.Month === month);
  }





  //  ----------------------------------------------------------------- >>>
  //  -------------------------------------- >>> Calendar Start

  myAttendanceSummeryChart: Chart;

  @ViewChild('myAttendanceCalendarComponentRef', { static: false })
  myAttendanceCalendarComponent: any;

  myAttendanceDefaultMonth = '2023-01';

  myAttendanceCalendarOptions: any = {
    plugins: [dayGridPlugin],
    weekends: true,
    fixedWeekCount: false,
    initialView: 'dayGridMonth',
    initialDate: this.myAttendanceDefaultMonth + '-01',
    headerToolbar: {
      start: 'title',
      center: '',
      end: ''
    },
    displayEventTime: false,
    display: "background",
  };

  myAttendnceCalendarEvents = [
    {

    }
  ];




  //  ----------------------------------------------------------------- >>>
  //  -------------------------------------- >>> Calendar End



  //  ----------------------------------------------------------------- >>>
  //  ----------------- >>>   CreateMyAttendanceSummeryChart() Start


  isMyAttendanceSummeryPopupVisible: boolean = false;

  showMyAttendanceSummeryPopup() {
    this.isMyAttendanceSummeryPopupVisible = true;
  }

  closeMyAttendanceSummeryPopup() {
    this.isMyAttendanceSummeryPopupVisible = false;
  }







  refreshMyAttendanceCalendar() {
    if (this.myAttendanceCalendarComponent && this.myAttendanceCalendarComponent.getApi) {
      const calendarApi = this.myAttendanceCalendarComponent.getApi();
      if (calendarApi) {
        calendarApi.gotoDate(this.myAttendanceDefaultMonth);
        calendarApi.removeAllEventSources();
        calendarApi.addEventSource(this.myAttendnceCalendarEvents);
        const displayedEvents = calendarApi.getEvents();
      } else {
        console.error('calendarApi is null or undefined.');
      }
    } else {
      console.error('myAttendanceCalendarComponent is not available or initialized.');
    }
  }


  //  ----------------------------------------------------------------- >>>
  //  ----------------- >>>   CreateMyAttendanceSummeryChart() End
  openCalender(selectedMonth: number) {

    const selectedMonthYearMonth = this.getYearMonth(selectedMonth);

    this.myAttendanceDefaultMonth = selectedMonthYearMonth;

    // Check if the calendar chart exists and destroy it if it does
    if (this.myAttendanceSummeryChart) {
      this.myAttendanceSummeryChart.destroy();
    }

    // Delay the calendar destruction/rendering to the next tick using setTimeout
    setTimeout(() => {
      if (this.myAttendanceCalendarComponent && this.myAttendanceCalendarComponent.getApi) {
        const calendarApi = this.myAttendanceCalendarComponent.getApi();
        calendarApi.destroy();
        calendarApi.render();
      }
    }, 0);

    // Show the attendance summary popup
    this.showMyAttendanceSummeryPopup();

    // Refresh the attendance calendar
    this.refreshMyAttendanceCalendar();

    // Get the YearMonth for the selected month

  }

  getYearMonth(month: number): string {
    const leaveDetails = this.myleaveHistoryList.find(leaveDetail => leaveDetail.Month === month);
    return leaveDetails ? leaveDetails.YearMonth : '';
  }

  //----------------
  showLeaveRequest: boolean = false;
  showLeaveRequestModal() {
    this.showLeaveRequest = true;
  }

  hideLeaveRequestModal(reason: any) {
    this.showLeaveRequest = false;
  }

}




