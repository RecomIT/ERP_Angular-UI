import { Component, OnInit } from '@angular/core';
import { CommonDashboardRoutingService } from '../../common-dashboard-routing/common-dashboard-routing.service';
import { SnackbarService } from 'src/app/shared/services/Snackbar/snackbar.service';
import { Time } from '@angular/common';
import { SharedmethodService } from 'src/app/shared/services/shared-method/sharedmethod.service';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-upcoming-holidays-and-events',
  templateUrl: './upcoming-holidays-and-events.component.html',
  styleUrls: ['./upcoming-holidays-and-events.component.css']
})
export class UpcomingHolidaysAndEventsComponent implements OnInit {


  roleName : string;
  companyEventsControl : boolean = false;
 
  constructor(
    private notifyService: SnackbarService,
    private apiEndpointsService: CommonDashboardRoutingService,
    private sharedMethodService: SharedmethodService,
    private userService: UserService
  ) { }

  ngOnInit(){
    this.getCompanyHolidaysAndEvents();

    this.sharedMethodService.methodCall$.subscribe(()=>{
      this.getCompanyHolidaysAndEvents();
    })

    this.roleName = this.User().RoleName;
    if(this.roleName === 'Admin' || this.roleName === 'System Admin'){
      this.companyEventsControl = true;
    }
    else{
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
    this.apiEndpointsService.getCompanyHolidayAndEventsApi<any[]>(null).subscribe({
      next: (response: any[]) => {
        this.listOfCompanyHolidaysAndEvents = response;
      },
      error: (err) => {
        console.error(err);
        this.notifyService.handleApiError(err);
      }
    });
  }

  // ------------------------- End listOfCompanyHolidaysAndEvents
  // ------------------------------------------------------------------->>>





  
  /// ----------------------------
  /// Child Components
  /// ----------------------------

  showAddCompanyEventsModal: boolean = false;

  openAddCompanyEventsModal() {
    this.showAddCompanyEventsModal = true;
  }

  closeAddCompanyEventsModal(reason: any) {

    this.showAddCompanyEventsModal = false;
  }

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
  eventId : number;
  openDeleteCompanyEventsModal(selectedItem: any){
    this.eventId = selectedItem;
    this.showDeleteCompanyEventsModal = true;
  }


  closeDeleteCompanyEventsModal(reason: any) {
    this.showDeleteCompanyEventsModal = false; 
    this.eventId = null;
  }
  




}
