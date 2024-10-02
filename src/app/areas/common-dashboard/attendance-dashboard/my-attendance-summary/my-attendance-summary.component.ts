import { Component, OnInit, ViewChild } from '@angular/core';
import { Chart, ChartDataset, ChartType } from 'chart.js';
import { CommonDashboardRoutingService } from '../../common-dashboard-routing/common-dashboard-routing.service';
import dayGridPlugin from '@fullcalendar/daygrid';
import { SnackbarService } from 'src/app/shared/services/Snackbar/snackbar.service';
import { RandomColorService } from 'src/app/shared/services/random-color/random-color.service';
import { NotifyService } from 'src/app/shared/services/notify-service/notify.service';
import { UserService } from 'src/app/shared/services/user.service';


@Component({
  selector: 'app-my-attendance-summary',
  templateUrl: './my-attendance-summary.component.html',
  styleUrls: ['./my-attendance-summary.component.css']
})
export class MyAttendanceSummaryComponent implements OnInit {

  
constructor(
  private notifyService : NotifyService,
  private apiEndpointsService: CommonDashboardRoutingService,
  private randomColor: RandomColorService,
  private userService: UserService
){}


  //  ----------------------------------------------------------------- >>>
  //  -------------------------------------- >>> Calendar Start

  myAttendanceSummeryChart:Chart;

  @ViewChild('myAttendanceCalendarComponentRef', { static: false })
  myAttendanceCalendarComponent: any; 

  myAttendanceDefaultMonth= '2023-02'; 

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

  ngOnInit() {
    const user = this.User();

    if (user.ComId === 21 && user.OrgId === 14) {
      console.log("ComId is 21 and OrgId is 14. Skipping certain methods.");
      return;
    }
  
    this.getMyAttendanceSummary();
    this.CreateMyAttendanceSummeryChart();

    this.getListOfAttendanceYearByEmployee();  
  }
  
  User() {
    return this.userService.User();
  }
  


  //  ----------------------------------------------------------------- >>>
  //  ----------------- >>>   CreateMyAttendanceSummeryChart() Start


  isMyAttendanceSummeryPopupVisible: boolean = false;

  showMyAttendanceSummeryPopup() {
    this.isMyAttendanceSummeryPopupVisible = true;
  }

  closeMyAttendanceSummeryPopup() {
    this.isMyAttendanceSummeryPopupVisible = false;
  }     
  
  
  CreateMyAttendanceSummeryChart() {

    // Check if the chart instance already exists and destroy it
    if (this.myAttendanceSummeryChart) {
      this.myAttendanceSummeryChart.destroy();
    }

    this.myAttendanceSummeryChart = new Chart("myAttendanceSummeryChart", {
      type: 'doughnut' as ChartType,
      data: {
        labels: [],
        datasets: [{
          label: ' No. of Days ',
          data: [],
          backgroundColor: this.randomColor.generateRandomColor()
        }]
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: '',
            
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const label = context.label;
                const value = context.parsed;
                return ` No. of days: ${value} Click the chart for more details`;
              }
            }
          },
          legend: {
            display: true,
            labels: {
              usePointStyle: true,
              boxWidth: 12,
              font: {
                size: 10,
              },
            },
          },
        },
        onClick: (event, elements) => {
          if (elements && elements.length > 0) {
            const clickedElement = elements[0];
            const clickedIndex = clickedElement.index;
  
            setTimeout(() => {
              if (this.myAttendanceCalendarComponent && this.myAttendanceCalendarComponent.getApi) {
                const calendarApi = this.myAttendanceCalendarComponent.getApi();
                calendarApi.destroy();
                calendarApi.render();
              }
            }, 0);

            this.showMyAttendanceSummeryPopup();
            this.refreshMyAttendanceCalendar();
          }
        },
      },
    });
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




  // ---------------------------------- >>>  listOfAttendanceYearByEmployee
  // ----------------------- >> Start
  // ------------------------------------------------------------------->>>
  listOfAttendanceYearByEmployee: any[] = [];

  getListOfAttendanceYearByEmployee(){
    this.apiEndpointsService.getMyAttendanceYearsApi<any>(null).subscribe({
      next: (response:any) => {
        this.listOfAttendanceYearByEmployee = response;
  
      },
  
      error: (error: any) => {
        console.error(error);
        //this.notifyService.handleApiError(error);
      },
  
    });
  }
  // ----------------------- >> End listOfAttendanceYearByEmployee
  // ------------------------------------------------------------------->>>

  
  // ---------------------------------- >>>  listofAttendanceMonthWithDataByYear
  // ----------------------- >> Start
  // ------------------------------------------------------------------->>>
  listofAttendanceMonthWithDataByYear: any[] = [];
  attendanceYear: number = 0;

  getListofAttendanceMonthWithDataByYear() {
    let params = {
      year: this.myAttendanceSearchByYear 
    };
  
    this.apiEndpointsService.getMyAttendanceMonthsByYearApi<any>(params).subscribe({
      next: (response:any) => {
        this.listofAttendanceMonthWithDataByYear = response;
  
      },
  
      error: (error: any) => {
        console.error(error);
        //this.notifyService.handleApiError(error);
      },
    });
  }
  // ----------------------- >> End listofAttendanceMonthWithDataByYear
  // ------------------------------------------------------------------->>>




  // ---------------------------------- >>>  OnYearSelect
  // ----------------------- >> Start
  // ------------------------------------------------------------------->>>
  onYearSelect() {
    
    if (this.myAttendanceSearchByYear) {
      
      this.getListofAttendanceMonthWithDataByYear();

      this.myAttendanceSearchByMonth = 0;
        
    } else {
      this.myAttendanceSearchByYear = 0; 
      this.myAttendanceSearchByMonth = null;
    }
    
  }
  // ----------------------- >> End OnYearSelect
  // ------------------------------------------------------------------->>>


  // ---------------------------------- >>>  OnMonthSelect
  // ----------------------- >> Start
  // ------------------------------------------------------------------->>>
  onMonthSelect() {

    if (this.myAttendanceSearchByMonth != 0) {
      this.getMyAttendanceSummary();
    }
    else{
      
    }
  }
  // ----------------------- >> End OnMonthSelect
  // ------------------------------------------------------------------->>>

  

  // ---------------------------------- >>>  My Attendance Summery
  // ----------------------- >> Start
  // ------------------------------------------------------------------->>>
  listOfMyAttendanceSummery: any[] = [];
  ListofValidProperties: any[] = [];

  myAttendanceSearchByMonth: number = 0;
  myAttendanceSearchByYear: number = 0;

  searchBySummeryEmployee: any = 0;

  getMyAttendanceSummary() {

    this.getListofAttendanceMonthWithDataByYear();

    let params = {
      month: this.myAttendanceSearchByMonth,
      year: this.myAttendanceSearchByYear
    };

    this.apiEndpointsService.getMyAttendanceApi<any>(params).subscribe({
      next: (response:any) => {
        this.listOfMyAttendanceSummery = response;

        if (this.listOfMyAttendanceSummery) {
          const firstItem = this.listOfMyAttendanceSummery[0];
          this.myAttendanceDefaultMonth = `${firstItem?.Year}-${firstItem?.Month.toString().padStart(2, '0')}`;
        }

        if (this.myAttendanceSummeryChart && this.myAttendanceSummeryChart.data) {
          this.myAttendanceSummeryChart.data.labels = [];
          this.myAttendanceSummeryChart.data.datasets = [];

          const excludedProperties = [
            'AbsentDates',
            'HolidayDates',
            'LateDates',
            'LeaveDates',
            'PresentDates',
            'ShortLeaveDates',
            'WeekendDates',
            'Year',
            'Month',
            'MonthName',
          ];
          
          if (this.listOfMyAttendanceSummery.length > 0) {
            const dataItem = this.listOfMyAttendanceSummery[0];

            const validProperties = Object.keys(dataItem).filter((prop) => dataItem[prop] !== 0 && !excludedProperties.includes(prop));

            this.ListofValidProperties = validProperties.map(prop => ({
              name: prop.charAt(0).toUpperCase() + prop.slice(1),
              value: dataItem[prop],
            }));

            // Filter out "Weekend" and "Holiday" from validProperties
            const validLabelProperties = Object.keys(dataItem).filter((prop) => {
              return dataItem[prop] != 0 && !excludedProperties.includes(prop) && prop !== 'Weekend' && prop !== 'Holiday';
            });

            // Calculate total for valid properties
            const total = validLabelProperties.reduce((acc, prop) => acc + dataItem[prop], 0);

            // Generate chart labels
            this.myAttendanceSummeryChart.data.labels.push(
              ...validLabelProperties.map(prop => `${prop.charAt(0).toUpperCase() + prop.slice(1)} (${((dataItem[prop] / total) * 100).toFixed(2)}%)`)
            );


        
            const dataset: ChartDataset = {
              label: 'No. of Days',
              data: validLabelProperties.map((prop) => dataItem[prop]) as number[],
              backgroundColor: validLabelProperties.map(() => this.randomColor.generateRandomColor()),
              borderWidth: 2,
              borderRadius: 5,
            };

            this.myAttendanceSummeryChart.data.datasets.push(dataset);

            const formattedTitle = `Attendance Summary On ${dataItem.MonthName.charAt(0).toUpperCase() + dataItem.MonthName.slice(1)}, ${dataItem.Year}`;

            this.myAttendanceSummeryChart.options.plugins = {
              title: {
                display: true,
                text: formattedTitle,
                align: 'center',
                padding: {
                  top: 5,
                  bottom: 5,
                },
                font: {
                  size: 12,
                },
              },

              legend: {
                display: true,
                labels: {
                  usePointStyle: true,
                  boxWidth: 12,
                  font: {
                    size: 9,
                  },
                },
              },
            };

            this.myAttendanceSummeryChart.options.plugins.title.color = 'rgba(109, 91, 100, 1.0)';

            this.myAttendanceSummeryChart.update();
            this.myAttendanceSummeryChart.update();

            this.myAttendanceSearchByYear = dataItem.Year;
            this.myAttendanceSearchByMonth = dataItem.Month;
          
          }


          // -------------------------------------- Calendar start
          const allCalendarEvents = [];


          if (this.listOfMyAttendanceSummery[0]?.PresentDates) {
            const presentEvents = this.listOfMyAttendanceSummery[0].PresentDates.split(', ').map((date: string) => ({
              title: 'Present',
              start: new Date(date),
              color: 'green',
            }));
            allCalendarEvents.push(...presentEvents);
          }


          if (this.listOfMyAttendanceSummery[0]?.AbsentDates) {
            const absentEvents = this.listOfMyAttendanceSummery[0].AbsentDates.split(', ').map((date: string) => ({
              title: 'Absent',
              start: new Date(date),
              color: '#B03A2E',
            }));
            allCalendarEvents.push(...absentEvents);
          }



          if (this.listOfMyAttendanceSummery[0]?.HolidayDates) {
            const holidayEvents = this.listOfMyAttendanceSummery[0].HolidayDates.split(', ').map((date: string) => ({
              title: 'Holiday',
              start: new Date(date),
              color: 'blue',
            }));
            allCalendarEvents.push(...holidayEvents);
          }



          if (this.listOfMyAttendanceSummery[0]?.LateDates) {
            const lateEvents = this.listOfMyAttendanceSummery[0].LateDates.split(', ').map((date: string) => ({
              title: 'Late',
              start: new Date(date),
              color: 'red',
            }));
            allCalendarEvents.push(...lateEvents);
          }



          if (this.listOfMyAttendanceSummery[0]?.LeaveDates) {
            const leaveEvents = this.listOfMyAttendanceSummery[0].LeaveDates.split(', ').map((date: string) => ({
              title: 'Leave',
              start: new Date(date),
              color: '#7CFC00',
            }));
            allCalendarEvents.push(...leaveEvents);
          }



          if (this.listOfMyAttendanceSummery[0]?.WeekendDates) {
            const weekendEvents = this.listOfMyAttendanceSummery[0].WeekendDates.split(', ').map((date: string) => ({
              title: 'Weekend',
              start: new Date(date),
              color: '#249991',
            }));
            allCalendarEvents.push(...weekendEvents);
          }



          if (this.listOfMyAttendanceSummery[0]?.ShortLeaveDates) {
            const shortLeaveEvents = this.listOfMyAttendanceSummery[0].ShortLeaveDates.split(', ').map((date: string) => ({
              title: 'S Leave',
              start: new Date(date),
              color: '#32CD32',
            }));
            allCalendarEvents.push(...shortLeaveEvents);
          }


          this.myAttendnceCalendarEvents = allCalendarEvents;

          // -------------------------------------- Calendar end
        }

      },

      error: (error: any) => {
        console.error(error);
        //this.notifyService.handleApiError(error);
      },

    });
  }
  // ----------------------- >> End My Attendance Summery
  // ------------------------------------------------------------------->>>


}
