import { Component, OnInit } from '@angular/core';
import { SnackbarService } from 'src/app/shared/services/Snackbar/snackbar.service';
import { CommonDashboardRoutingService } from '../../common-dashboard-routing/common-dashboard-routing.service';
import { SharedmethodService } from 'src/app/shared/services/shared-method/sharedmethod.service';
import { UserService } from 'src/app/shared/services/user.service';
import { LunchService } from '../lunch-request-service';
import { DatePipe } from '@angular/common';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

@Component({
  selector: 'app-lunch-requests',
  templateUrl: './lunch-requests.component.html',
  styleUrls: ['./lunch-requests.component.css'],
})
export class LunchRequestsComponent implements OnInit {
  totalLunches: number | null = null;
  selectedDate: any = new Date(); // Default to today

  datePickerConfig: Partial<BsDatepickerConfig> = this.utilityService.datePickerConfig();

  roleName: string;
  companyEventsControl: boolean = false;

  constructor(
    private notifyService: SnackbarService,
    private apiEndpointsService: CommonDashboardRoutingService,
    private sharedMethodService: SharedmethodService,
    private lunchRequestService: LunchService,
    private userService: UserService,
    private datePipe: DatePipe,
    private utilityService: UtilityService
  ) { }

  ngOnInit() {
    this.getCompanyHolidaysAndEvents();
    this.getTotalRequests();

    this.sharedMethodService.methodCall$.subscribe(() => {
      this.getCompanyHolidaysAndEvents();
    });

    this.roleName = this.User().RoleName;
    if (this.roleName === 'Admin' || this.roleName === 'System Admin') {
      this.companyEventsControl = true;
    } else {
      this.companyEventsControl = false;
    }
  }

  User() {
    return this.userService.User();
  }

  // ----------------------------------- >>> listOfCompanyHolidaysAndEvents
  // ------------------------- Start
  // ------------------------------------------------------------------->>>
  listOfCompanyHolidaysAndEvents: any[] = [];

  getCompanyHolidaysAndEvents() {
    this.apiEndpointsService
      .getCompanyHolidayAndEventsApi<any[]>(null)
      .subscribe({
        next: (response: any[]) => {
          this.listOfCompanyHolidaysAndEvents = response;
        },
        error: (err) => {
          console.error(err);
          this.notifyService.handleApiError(err);
        },
      });
  }

  getTotalRequests() {
    let date = this.datePipe.transform(this.selectedDate, 'yyyy-MM-dd');
    this.selectedDate = new Date(date);
    this.totalLunches = 0;
    this.lunchRequestService.getTotalLunchRequestsForDate(date).subscribe(
      (response) => {
        console.log('response in lunch req >>>', response);
        this.totalLunches = response.body.totalLunches;
        console.log('totalLunches >>>', this.totalLunches);
      },
      (error) => {
        console.error('Error fetching total lunch requests:', error);
      }
    );
  }

  // ------------------------- End listOfCompanyHolidaysAndEvents
  // ------------------------------------------------------------------->>>

  /// ----------------------------
  /// Child Components
  /// ----------------------------

  // --------------------------------------

  selectedEvent: any = {};
  showEditCompanyEventsModal: boolean = false;

  openEditCompanyEventsModal(selectedItem: any) {
    this.selectedEvent = selectedItem;
    this.showEditCompanyEventsModal = true;
  }

  closeEditCompanyEventsModal(reason: any) {
    this.showEditCompanyEventsModal = false;
  }

  // --------------------------------------

  showDeleteCompanyEventsModal: boolean = false;
  eventId: number;
  openDeleteCompanyEventsModal(selectedItem: any) {
    this.eventId = selectedItem;
    this.showDeleteCompanyEventsModal = true;
  }

  closeDeleteCompanyEventsModal(reason: any) {
    this.showDeleteCompanyEventsModal = false;
    this.eventId = null;
  }

  // Open Add Lunch Request Modal Start
  showAddLunchRequestModal: boolean = false;

  openAddLunchRequestModal() {
    this.showAddLunchRequestModal = true;
  }

  closeAddLunchRequestModal(reason: any) {
    this.showAddLunchRequestModal = false;
    this.getTotalRequests();
  }

  // Open Add Lunch Request Modal End

  showLunchRequestReportModal: boolean = false;
  openLunchRequestReportModal() {
    this.showLunchRequestReportModal = true;
  }

  closeLunchRequestReportModal(reason: any) {
    this.showLunchRequestReportModal = false;
  }

  showDetailsModal: boolean = false;
  openDetailsModal(){
    this.showDetailsModal = true;
  }

  closeDetailsModal(reason: any){
    this.showDetailsModal = false;
  }
}


