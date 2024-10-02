import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AttendanceCommonDashboardRoutingService } from '../../common-dashboard-routing/attendance-common-dashboard-routing/attendance-common-dashboard-routing.service';
import { SnackbarService } from 'src/app/shared/services/Snackbar/snackbar.service';
import { UserService } from 'src/app/shared/services/user.service';
import { SharedmethodService } from 'src/app/shared/services/shared-method/sharedmethod.service';
import { NotifyService } from 'src/app/shared/services/notify-service/notify.service';

@Component({
  selector: 'app-geo-location-attendance-details',
  templateUrl: './geo-location-attendance-details.component.html',
  styleUrls: ['./geo-location-attendance-details.component.css','./custom-tooltip.css']
})
export class GeoLocationAttendanceDetailsComponent implements OnInit {

  constructor(
    private attendanceRoutingService: AttendanceCommonDashboardRoutingService,
    private notifyService: NotifyService,
    private userService: UserService,
    private cdr: ChangeDetectorRef,
    private sharedmethodService: SharedmethodService
  ) { }

  ngOnInit(): void {


    const user = this.User();
  
    // Check if ComId is 21 and OrgId is 14
    if (user.ComId === 21 && user.OrgId === 14) {
      console.log("ComId is 21 and OrgId is 14. Skipping certain methods.");
      return; 
    }


    this.getMyGeoLocationAttendance();

    this.sharedmethodService.methodCall$.subscribe(
      () => {
        this.getMyGeoLocationAttendance();
    });

  }

  User() {
    return this.userService.User();
  }
  



  actionName: string = 'Get';

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


}
