import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonDashboardRoutingService } from '../../common-dashboard-routing/common-dashboard-routing.service';
import { SnackbarService } from 'src/app/shared/services/Snackbar/snackbar.service';
import { CustomModalService } from 'src/app/shared/services/custom-modal.service';
import { AreasHttpService } from 'src/app/areas/areas.http.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { animate, state, style, transition, trigger, useAnimation } from '@angular/animations';
import { AttendanceCommonDashboardRoutingService } from '../../common-dashboard-routing/attendance-common-dashboard-routing/attendance-common-dashboard-routing.service';
import { UserService } from 'src/app/shared/services/user.service';
import { bounceIn, fadeIn, fadeInRight, slideInUp } from 'ng-animate';
import { SharedmethodService } from 'src/app/shared/services/shared-method/sharedmethod.service';
import { NotifyService } from 'src/app/shared/services/notify-service/notify.service';

@Component({
  selector: 'app-geo-location-attendance',
  templateUrl: './geo-location-attendance.component.html',
  styleUrls: ['./geo-location-attendance.component.css','./custom-tooltip.css'],
  animations: [
    trigger('flipInOut', [
      state('true', style({ transform: 'rotateY(0deg)' })),
      state('false', style({ transform: 'rotateY(180deg)' })),
      transition('true <=> false', animate('0.5s ease-in-out'))
    ]),
    trigger('slideInUp', [transition('* => *', useAnimation(slideInUp, { params: { timing: 0.5 } }))]),
    trigger('fadeIn', [transition('void => *', useAnimation(fadeIn, { params: { timing: 0.3 } }))]),
    trigger('fadeRight', [transition('void => *', useAnimation(fadeInRight, { params: { timing: 0.5 } }))]),
    trigger('bounceIn', [transition('void => *', useAnimation(bounceIn, { params: { timing: 1 } }))]),

    trigger('fadeInRight', [
      state('show', style({ opacity: 1, transform: 'translateX(0)' })),
      state('hide', style({ opacity: 0, transform: 'translateX(100%)' })),
      transition('hide => show', animate('0.5s ease-in')),
      transition('show => hide', animate('0.5s ease-out'))
    ]),
  ],

})


export class GeoLocationAttendanceComponent implements OnInit {

  constructor(
    private notifyService: NotifyService,
    public modalService: CustomModalService,
    public areasHttpService : AreasHttpService,
    public utilityService : UtilityService,
    private datePipe: DatePipe,
    private attendanceRoutingService: AttendanceCommonDashboardRoutingService,
    private userService: UserService,
    private cdr: ChangeDetectorRef,
    private sharedmethodService: SharedmethodService
    
  ) { }
    

  actionName: string = 'Get';
  attendanceDate : Date = null;
  attendanceTime : Date = null;
  attendanceLocation : String = null;
  today: Date = new Date();
  
  ngOnInit() {
    const user = this.User();

    if (user.ComId === 21 && user.OrgId === 14) {
      console.log("ComId is 21 and OrgId is 14. Skipping certain methods.");
      return; 
    }
  
    // If ComId and OrgId don't match the specified values, continue with other methods
    this.sharedmethodService.methodCall$.subscribe(() => {
      this.getCheckPunchInPunchOut();
    });
  
    this.updateTime();
  
    setInterval(() => {
      this.updateTime();
    }, 1000);
  
    this.getLocationFromOpenStreetMap();
  
    this.setupAutoRefresh();
  
    this.getMyGeoLocationAttendance();
  }
  
  User() {
    return this.userService.User();
  }
  
  

  setupAutoRefresh() {
    this.getCheckPunchInPunchOut();

    setInterval(() => {
      this.getCheckPunchInPunchOut();
    }, 24 * 60 * 60 * 1000);
  }
  



  getLocationFromOpenStreetMap() {
    var geoLocationAPI = "https://nominatim.openstreetmap.org/reverse";
    navigator.geolocation.getCurrentPosition(
      (position) => {
        var lat = position.coords.latitude;
        var long = position.coords.longitude
        geoLocationAPI = `${geoLocationAPI}?format=json&lat=${lat}&lon=${long}&accept-language=en-US`;
        this.getAddressFromOpenStreetMap(geoLocationAPI);
      });
  }

  getAddressFromOpenStreetMap(apiEndpoint: string) {

    var request = this.areasHttpService.observable_get_by_url((apiEndpoint), {responseType: "json", observe: 'response', params: {}});

    request.subscribe((response) => {
      let result = response as any;
      if (result?.status == 200) {
        this.attendanceLocation  = result.body.display_name;
      }
    },
      (error) => {
        if (error?.status == 404) {
        }
        this.utilityService.fail(error.msg?.message, "Server Response");
      }
    )
  }

  getLocationFromBigDataCloud() {
    var geoLocationAPI = "https://api.bigdatacloud.net/data/reverse-geocode-client"
    navigator.geolocation.getCurrentPosition(
    (position) => {
      var lat = position.coords.latitude;
      var long = position.coords.longitude
      geoLocationAPI = `${geoLocationAPI}?latitude=${lat}&longitude=${long}&localityLanguage=en`;
      this.getAddressFromBigDataCloud(geoLocationAPI);
    },
    (err) => { this.getAddressFromBigDataCloud(geoLocationAPI); },
    {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    });
  }

  getAddressFromBigDataCloud(apiEndpoint: string) {

    var request = this.areasHttpService.observable_get_by_url((apiEndpoint), {responseType: "json", observe: 'response', params: {}});

    request.subscribe((response) => {
      let result = response as any;
      if (result?.status == 200) {
        var location  = result.body;
      }
    },
      (error) => {
        if (error?.status == 404) {
        }
        this.utilityService.fail(error.msg?.message, "Server Response");
      }
    )
  }





  // ----------------------------------------------------------------
  // ------------------------------ 

  isPunchedIn = false;

  togglePunch() {
    this.isPunchedIn = !this.isPunchedIn;
  }

  currentTime: string = '';
  updateTime(): void {
    this.currentTime = this.getTime();
  }

  getTime(): string {
    const currentTime = new Date();
    return this.datePipe.transform(currentTime, 'h:mm:ss a') || '';
  }



  getHourAndMinute(timeString: string): string {
    if (!timeString) {
      return '';
    }
    
    const [hour, minute] = timeString.split(':');
    return `${hour}:${minute}`;
  }
  



  // ----------------------------------------------------------------
  // ------------------------------ getCheckPunchInPunchOut
  
  checkPunchInPunchOut: any;
  getCheckPunchInPunchOut() {
    this.attendanceRoutingService.getCheckPunchInPunchOutApi<any>(null).subscribe({
      next: (response: any[]) => {
        if (response && response.length > 0) {
          this.checkPunchInPunchOut = response[0];

        }
      },
      error: (err) => {
        console.error(err);
        this.notifyService.handleApiError(err);
      }
    });
  }




  // ----------------------------------------------------------------
  // ------------------------------ Toggle

  showAttendanceContainer: boolean = true;

  toggleAttendanceContainer() {
    this.showAttendanceContainer = !this.showAttendanceContainer;
  }



  // -----------------------------------------------------------------
  // ----------------------------- Get My Geo Location Attendance

  
  pageSize: number = 5;
  pageNumber: number = 0;

  geoLocationAttendancePageConfig: any = this.userService.pageConfigInit("geoLocationAttendance", this.pageSize, 1, 0);

  geoLocationAttendancePageChanged(pageNo: any) {
    this.pageNumber = pageNo;
    this.getMyGeoLocationAttendance();
    this.cdr.detectChanges();
  }

  onPageSizeChange() {

    this.pageNumber = this.geoLocationAttendancePageConfig.currentPage;

    this.getMyGeoLocationAttendance();

    this.cdr.detectChanges();
  }


  listOfGeoLocationAttendance: any[] = [];

  getMyGeoLocationAttendance() {

    const params: any = {};

    if (this.actionName && this.actionName !== null) {
      params['actionName'] = this.actionName;
    }

    if (this.pageNumber && this.pageNumber > 0) {
      params['pageNumber'] = this.pageNumber;
    }
    
    if (this.pageSize && this.pageSize > 0) {
      params['pageSize'] = this.pageSize;
    }

    this.attendanceRoutingService.getMyGeoLocationAttendanceApi<any[]>(params).subscribe({
      next: (response: any) => {
        this.listOfGeoLocationAttendance = response.body;

        var xPaginate = JSON.parse(response.headers.get('X-Pagination'));
        this.geoLocationAttendancePageConfig = this.userService.pageConfigInit("geoLocationAttendance", xPaginate.itemsPerPage, xPaginate.currentPage, xPaginate.totalItems);
        
      },
      error: (err) => {
        console.error(err);
        this.notifyService.handleApiError(err);
      }
    });
  }





  // -----------------------------------------------------
  // ------------------------------ PunchIn PunchOut Modal

  attendanceDetails = {
    attendanceDate: null,
    attendanceTime: null,
    attendanceLocation: null,
    action: null
  };
  
   
  showPunchInModal: boolean = false;
  showPunchOutModal: boolean = false;

  openPunchInModal() {

    this.attendanceDetails.attendanceDate = new Date(); 
    this.attendanceDetails.attendanceTime = new Date(); 
    this.attendanceDetails.attendanceLocation = this.attendanceLocation; 
    this.attendanceDetails.action = 'Punch In'
    this.showPunchInModal = true;
  }


  openPunchOutModal() {

    this.attendanceDetails.attendanceDate = new Date(); 
    this.attendanceDetails.attendanceTime = new Date(); 
    this.attendanceDetails.attendanceLocation = this.attendanceLocation; 
    this.attendanceDetails.action = 'Punch Out'
    this.showPunchOutModal = true;
  }
  
  
  closePunchInOutModal(reason: any) {
    this.showPunchInModal = false;
    this.showPunchOutModal = false;
  }


}
