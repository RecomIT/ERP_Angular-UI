import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-dashboard-popup',
  templateUrl: './dashboard-popup.component.html',
  styleUrls: ['./dashboard-popup.component.css']
})
export class DashboardPopupComponent implements OnInit {


  @Output() showAttendanceDashboard = new EventEmitter<void>();
  @Output() showLeaveDashboard = new EventEmitter<void>();
  @Output() toggleAllDashboard = new EventEmitter<void>();
  @Output() showHrDashboard = new EventEmitter<void>();
  @Output() showPayrollDashboard = new EventEmitter<void>();

  
  showPopup = false;



  constructor(
    private userService: UserService
  ) { }


  roleName: string | null = null;
  showHrDashboardLink: boolean = false;
  showPayrollDashboardLink: boolean = false;

  ngOnInit(): void {
    
    this.roleName = this.User().RoleName;

    this.hideAttendanceDashboard();
    this.hidePayrollDashboard();


    if(this.roleName === 'Admin' || this.roleName === 'System Admin'){
      this.showHrDashboardLink = true;
      this.showPayrollDashboardLink = true;
    }

  }

  User() {
    return this.userService.User();
  }


  companyId: number;
  visibleAttendanceDashboard: boolean = true;
  
  hideAttendanceDashboard() {
    this.companyId = this.User().ComId;
  
    switch (this.User().OrgId) {
      case 14:
        if (this.companyId === 21) {
          this.visibleAttendanceDashboard = false;
        }
        break;
      case 13:
        if (this.companyId === 19) {
          this.visibleAttendanceDashboard = false;
        }
        break;
      default:
        this.visibleAttendanceDashboard = true;
        break;
    }
  }
  



  visiblePayrollDashboard: boolean = true;
  
  hidePayrollDashboard() {
    this.companyId = this.User().ComId;
  
    switch (this.User().OrgId) {
      case 14:
        if (this.companyId === 21) {
          this.visiblePayrollDashboard = false;
        }
        break;
      case 13:
        if (this.companyId === 19) {
          this.visiblePayrollDashboard = false;
        }
        break;
      default:
        this.visiblePayrollDashboard = true;
        break;
    }
  }



  togglePopup() {
    this.showPopup = !this.showPopup;
  }

  showAllDashboard(){
    // this.hideAttendanceDashboard();
    this.toggleAllDashboard.emit();
    this.togglePopup();
  }


  showHR() {
    this.showHrDashboard.emit();
    this.togglePopup();
  }

  
  showAttendance() {
    this.showAttendanceDashboard.emit();
    this.togglePopup();
  }

  showLeave() {
    this.showLeaveDashboard.emit();
    this.togglePopup();
  }

  showPayroll() {
    this.showPayrollDashboard.emit();
    this.togglePopup();
  }

}
