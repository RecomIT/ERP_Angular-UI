import { transition, trigger, useAnimation } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { fadeIn, fadeInUp, fadeOutLeft, slideInUp } from 'ng-animate';
import { ChartConfiguration, Color } from 'chart.js';
import { AreasHttpService } from '../areas.http.service';
import { UserService } from 'src/app/shared/services/user.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { CustomModalService } from 'src/app/shared/services/custom-modal.service';
import { ApiArea } from 'src/app/shared/constants';
import { DatePipe } from '@angular/common';
import { LeaveReportService } from '../leave_module/leave-report/leave-report.service';
import { SubordinatesLeaveDashboardRoutingService } from './common-dashboard-routing/subordinates-leave-dashboard-rouing/subordinates-leave-dashboard-routing.service';

@Component({
  selector: 'app-common-dashboard',
  templateUrl: './common-dashboard.component.html',
  styleUrls: ['./common-dashboard.component.css'],
  animations: [
    trigger('fadeIn', [transition('void => *', useAnimation(fadeIn, { params: { timing: 0.3 } }))]),
    trigger('slideInUp', [transition('* => *', useAnimation(slideInUp, { params: { timing: 0.5 } }))]),
    trigger('fadeInUp', [transition('void => *', useAnimation(fadeInUp))]),
    trigger('fadeOutLeft', [transition('* => void', useAnimation(fadeOutLeft, { params: { timing: 0.3 } }))]),
  ]
})
export class CommonDashboardComponent implements OnInit {

  constructor(
    public modalService: CustomModalService, 
    private areasHttpService: AreasHttpService, 
    private userService: UserService, 
    private utilityService: UtilityService, 
    private leaveReportService: LeaveReportService, 
    private datePipe: DatePipe,
    private subordinatesLeave: SubordinatesLeaveDashboardRoutingService,
    ) { }

  public doughnutChartLabels: string[] = [
    'Present',
    'Late',
    'Absent',
    'Leave'
  ];

  ddlYears: any = this.utilityService.getYears(2);
  ddlMonths: any = this.utilityService.getMonths();

  public attnMonth: number = parseInt(this.utilityService.currentMonth);
  public attnYear: number = parseInt(this.utilityService.currentYear);

  doughnutChartDatasets: ChartConfiguration<'doughnut'>['data']['datasets'];
  doughnutChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: false,
  };

  doughnutChartColors: any[] = [{
    backgroundColor: ["#a3e1d4", "#dedede", "#9CC3DA"]
  }];

  year: string = (new Date()).getFullYear().toString();


  roleName: string | null = null;

  isAdmin: boolean = false;
  
  ngOnInit(): void {
    // this.getDashboardData();

    this.roleName = this.User().RoleName;

    if(this.roleName === 'Admin' || this.roleName === 'System Admin'){
      this.showHrDashboard = true;
      this.showPayrollDashboard = true;
      this.isAdmin = true;
    }
    else{
      this.showHrDashboard = false;
    }


    this.getIsSupervisorOrFinalApproval();

    this.hideAttendanceDashboard();

  }


  User() {
    return this.userService.User();
  }


  companyId : number;
  organizationId: number;

  hideAttendanceDashboard(){
    this.companyId = this.User().ComId;
    this.organizationId = this.User().OrgId;
  
    switch(this.organizationId) {
      case 14:
        if(this.companyId === 21) {
          this.showAttendanceDashboard = false;
          this.showPayrollDashboard2 = false;
        }
        break;
      case 13:
        if(this.companyId === 19) {
          this.showAttendanceDashboard = false;
          this.showPayrollDashboard2 = false;
        }
        break;
      default:
        this.showAttendanceDashboard = true;
        this.showPayrollDashboard2 = true;
        break;
    }
  }
  


  attendanceSummery: any;
  leaveSummery: any[];
  employeeInfo: any[];
  pendingRequests: any[];
  workShift: any[] = [];

  getDashboardData() {
    this.areasHttpService.observable_get((ApiArea.hrms + "/dashboard" + "/SelfServiceDashboard"), {
      responseType: "json"
    }).subscribe((data: any) => {
      if (data != null && data.length > 0) {
        this.loadAttendanceSummery(data[0])
        this.loadEmployeeInfo(data[1]);
        this.loadLeaveSummery(data[2]);
        this.loadRequests(data[3]);
        this.loadWorkShifts(data[4]);
      }
    }, error => {
      if(this.User().EmployeeId > 0){
        this.utilityService.httpErrorMsg(error?.status, error?.msg);
      }
      else{
        this.utilityService.info("May be Super user access", "Server Response");
      }
    })
  }

  loadAttendanceSummery(data: any) {
    this.attendanceSummery = [0, 0, 0, 0];
    if (data?.key != null && data?.key != undefined && data?.key != '') {
      if (data?.value != null) {
        var json_attsummery = JSON.parse(data.value);

        this.attendanceSummery = [json_attsummery[0]?.PresentQty, json_attsummery[0]?.LateQty, json_attsummery[0]?.AbsentQty, json_attsummery[0]?.TotalLeaveQty]

        this.doughnutChartDatasets = [{ data: this.attendanceSummery, label: 'Series A' }];
      }
    }
    else {
      this.doughnutChartDatasets = [{ data: this.attendanceSummery, label: 'Series A' }];
    }
  }

  loadLeaveSummery(data: any) {
    this.leaveSummery = [];
    if (data?.key != null && data?.key != undefined && data?.key != '') {
      if (data?.value != null) {
        this.leaveSummery = JSON.parse(data.value);

      }
    }
  }

  loadEmployeeInfo(data: any) {
    this.employeeInfo = [];
    if (data?.key != null && data?.key != undefined && data?.key != '') {
      if (data?.value != null) {
        this.employeeInfo = JSON.parse(data.value);
      }
    }
  }

  loadRequests(data: any) {
    this.pendingRequests = [];
    if (data?.key != null && data?.key != undefined && data?.key != '') {
      if (data?.value != null) {
        this.pendingRequests = JSON.parse(data.value);
      }
    }
  }

  loadWorkShifts(data: any) {
    this.workShift = [];
    if (data?.key != null && data?.key != undefined && data?.key != '') {
      if (data?.value != null) {
        this.workShift = JSON.parse(data.value);
      }
    }
  }


  attendance_year_changed() {
    this.areasHttpService.observable_get((ApiArea.hrms + "/dashboard" + "/GetAttendanceSummary"), {
      responseType: "json", params: { year: this.attnYear, month: this.attnMonth }
    }).subscribe((data: any) => {
      if (data != null) {
        this.loadAttendanceSummery(data)
      }
    }, error => {
      this.utilityService.httpErrorMsg(error?.status, error?.msg);
    })
  }

  attendance_month_changed() {
    this.areasHttpService.observable_get((ApiArea.hrms + "/dashboard" + "/GetAttendanceSummary"), {
      responseType: "json", params: { year: this.attnYear, month: this.attnMonth }
    }).subscribe((data: any) => {
      if (data != null) {
        this.loadAttendanceSummery(data)
      }
    }, error => {
      this.utilityService.httpErrorMsg(error?.status, error?.msg);
    })
  }

  downloadEmployeeLeaveCard() {
    let today = this.datePipe.transform(new Date(), "yyyy-MM-dd");
    this.leaveReportService.generateEmployeeLeaveCard({ employeeId: this.User().EmployeeId, fromDate: today, toDate: today }).subscribe((response: any) => {

      if (response.size > 0) {
        var blob = new Blob([response], { type: 'application/pdf' });
        let pdfUrl = window.URL.createObjectURL(blob);
        var PDF_link = document.createElement('a');
        PDF_link.href = pdfUrl;
        window.open(pdfUrl, '_blank');
      }
      else {
        this.utilityService.warning("No data found")
      }

    }, (error) => {
      this.utilityService.fail("Something went wrong", "Server Response")
    })
  }








  dashboard: string = 'All'

  showHrDashboard: boolean = false;
  showAttendanceDashboard = true;
  showLeaveDashboard = true;

  toggleAllDashboard(){

    if(this.roleName === 'Admin' || this.roleName === 'System Admin'){
      this.showHrDashboard = true;
      this.showPayrollDashboard = true;
    }

    this.hideAttendanceDashboard();
    this.showLeaveDashboard = true;

    this.dashboard = 'All';
  }


  toggleHrDashboard() {
    this.showHrDashboard = true;
    this.showLeaveDashboard = false;
    this.showAttendanceDashboard = false;
    this.showPayrollDashboard = false;

    this.dashboard = 'HR';
  }

  toggleAttendanceDashboard() {
    //this.showAttendanceDashboard = !this.showAttendanceDashboard;
    this.showAttendanceDashboard = true;
    this.showHrDashboard = false;
    this.showLeaveDashboard = false;
    this.showPayrollDashboard = false;

    this.dashboard = 'Attendance';
  }

  toggleLeaveDashboard() {
    this.showLeaveDashboard = true;
    this.showAttendanceDashboard = false;
    this.showHrDashboard = false;
    this.showPayrollDashboard = false;

    this.dashboard = 'Leave';
  }



  togglePayrollDashboard() {
    this.showPayrollDashboard = true;
    this.showLeaveDashboard = false;
    this.showAttendanceDashboard = false;
    this.showHrDashboard = false;


    this.dashboard = 'Payroll';
  }




  // ------------------------------- Payroll Dashboard


  showPayrollDashboard: boolean = false;
  showPayrollDashboard2: boolean = false;

  activeEmployees = 1200;
  newEmployees = 50;
  discontinuedEmployees = 20;
  lastSalaryProcess = 'November, 2023';
  processedForEmployees = 1196;
  totalSalaryPaid = 'BDT. 12,00,00,250';
  averageSalary = 'BDT. 100,335';
  salaryGrowthRate = '8%';
  pfDeduction = 'BDT. 9,360,020';
  pfEmployerContribution = 'BDT. 9,360,020';
  tdsDeducted = 'BDT. 5,25,632';






  isSupervisorOrFinalApproval: boolean;
  Supervisor: any[] = [];

  getIsSupervisorOrFinalApproval() {

    this.subordinatesLeave.getIsSupervisorOrFinalApprovalApi<any>(null).subscribe({
      next: (response) => {
        if (Array.isArray(response)) {
          this.Supervisor = response;
          this.isSupervisorOrFinalApproval = response.length > 0 && response[0].Status;
      }},
      error: (error: any) => {
        console.error(error);
        
      }
    });
    
  }




}
