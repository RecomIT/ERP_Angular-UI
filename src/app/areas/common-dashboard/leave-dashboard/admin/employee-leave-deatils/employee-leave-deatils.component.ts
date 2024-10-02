import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { SubordinatesLeaveDashboardRoutingService } from '../../../common-dashboard-routing/subordinates-leave-dashboard-rouing/subordinates-leave-dashboard-routing.service';
import { Select2ConfigService } from 'src/app/shared/services/Select2/select2-config.service';
import { DatePipe } from '@angular/common';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import * as XLSX from 'xlsx';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { EmployeeLeaveDashboardRoutingService } from '../../../common-dashboard-routing/employee-leave-dashboard-routing/employee-leave-dashboard-routing.service';
import { UserService } from 'src/app/shared/services/user.service';
import { EmployeeService } from '../service/employee.service';
import { SharedmethodService } from 'src/app/shared/services/shared-method/sharedmethod.service';
import { DatePickerConfigService } from 'src/app/shared/services/DatePicker/date-picker-config.service';



@Component({
  selector: 'app-employee-leave-deatils',
  templateUrl: './employee-leave-deatils.component.html',
  styleUrls: ['./employee-leave-deatils.component.css']
})
export class EmployeeLeaveDeatilsComponent implements OnInit {


  today = new Date();
  sevenDaysAgo = new Date();
  
  constructor(
    private subordinatesLeave: SubordinatesLeaveDashboardRoutingService,
    private select2ConfigService: Select2ConfigService,
    private datePickerConfigService : DatePickerConfigService,
    private datePipe: DatePipe,
    private utilityService: UtilityService,
    private employeeLeave: EmployeeLeaveDashboardRoutingService,
    private userService: UserService,
    private employeeService: EmployeeService,
    private sharedMethodService: SharedmethodService,
    private cdr : ChangeDetectorRef
  ) { }



  
  datePickerConfig: Partial<BsDatepickerConfig> = {};
  ngOnInit(): void {

    this.sharedMethodService.methodCall$.subscribe(
      ()=> {
        this.getEmployeesLeaveDetails();
      }
    )

    this.getEmployees();
    this.getEmployeesLeaveDetails();

    this.employeeSelect2Options = this.select2ConfigService.getDefaultConfig();

    this.datePickerConfig = this.datePickerConfigService.getRangeConfig();

    // this.searchByDate = [new Date(), new Date()];



    this.sevenDaysAgo.setDate(this.today.getDate() - 7);

    this.searchByDate = [this.sevenDaysAgo, this.today];

  }


  employeeSelect2Options:any = [];


  searchByEmployeeId: number;
  employeeList: any[]=[];

  getEmployees() {

    this.employeeLeave.getEmployeesAsync<any[]>(null).subscribe({
      next: (response: any[]) => {
        this.employeeList = response;

      },
      error: (err) => {
        console.error(err);
        this.utilityService.fail("Something went wrong", "Server Response");
      }
    });
  }


  
  employeeId: number;
  onEmployeeSelectionChange(selectedEmployee: any) {
    
    this.employeeId = selectedEmployee;

    this.employeeService.setLeaveHistoryCount(0);

    this.getEmployeesLeaveDetails();


    this.cdr.detectChanges();

  }


  
  startDate: any = null;
  endDate: any = null;


  employeesLeaveList: any[] = [];

  totalEmployees: number = 0;
  leaveDays: number = 0;
  
  pageSize: number = 5;
  pageNumber: number = 1;

  employeeLeaveHistoryPageConfig: any = this.userService.pageConfigInit("historyData", this.pageSize, 1, 0);

  historyPageChanged(pageNo: any) {
    this.pageNumber = pageNo;
    this.getEmployeesLeaveDetails();
  }

  onPageSizeChange() {
    this.pageNumber = this.employeeLeaveHistoryPageConfig.currentPage;
    this.getEmployeesLeaveDetails();
  }


  getEmployeesLeaveDetails() {

    const params: any = {};

    if(this.searchByDate !== null){
      this.startDate = this.searchByDate[0] ? this.searchByDate[0].toISOString() : null;
      this.endDate = this.searchByDate[1] ? this.searchByDate[1].toISOString() : null;

      
    if (this.startDate && this.startDate != null) {
      params['startDate'] = this.startDate;
    }

    if (this.endDate && this.endDate != null) {
      params['endDate'] = this.endDate;
    }

    }

    if (this.employeeId && this.employeeId > 0) {
      params['employeeId'] = this.employeeId;
    }

    if (this.pageNumber && this.pageNumber > 0) {
      params['pageNumber'] = this.pageNumber;
    }
    if (this.pageSize && this.pageSize > 0) {
      params['pageSize'] = this.pageSize;
    }

    this.employeeLeave.getEmployeesLeaveDetailsApi<any>(params).subscribe({
      next: (response) => {
       
          this.employeesLeaveList = response.body;

          if(this.employeesLeaveList.length > 0){

          var xPaginate = JSON.parse(response.headers.get('X-Pagination'));
          this.employeeLeaveHistoryPageConfig = this.userService.pageConfigInit("data", xPaginate.itemsPerPage, xPaginate.currentPage, xPaginate.totalItems);
  
       
          this.leaveDays = this.employeesLeaveList[0].grandTotalLeaveCount;
  
          this.totalEmployees = this.employeesLeaveList[0].totalEmployees;

          this.employeeService.setLeaveHistoryCount(this.totalEmployees > 0 ? this.totalEmployees : 0);
       
         }
    
      },
      error: (error: any) => {
        console.error(error);
        
      }
    });
    
  }






  getUniqueEmployeeIds(): string[] {
    return Array.from(new Set(this.employeesLeaveList.map(leaveDetail => leaveDetail.employeeId)));
  }

  getEmployeeFullName(employeeId: string): string {
    const firstLeaveDetail = this.employeesLeaveList.find(leaveDetail => leaveDetail.employeeId === employeeId);
    return firstLeaveDetail ? firstLeaveDetail.name : '';
  }

  getLeaveDetailsByEmployeeId(employeeId: string): any[] {
    return this.employeesLeaveList.filter(leaveDetail => leaveDetail.employeeId === employeeId);
  }


  
  getEmployeePhotoPath(employeeId: string): string {
    const firstLeaveDetail = this.employeesLeaveList.find(leaveDetail => leaveDetail.employeeId === employeeId);
    return firstLeaveDetail ? firstLeaveDetail.photoPath : '';
  }
  
  getEmployeePhoto(employeeId: string): string {
    const firstLeaveDetail = this.employeesLeaveList.find(leaveDetail => leaveDetail.employeeId === employeeId);
    return firstLeaveDetail ? firstLeaveDetail.photo : '';
  }
  
  getCombinedEmployeePhoto(employeeId: string): string {
    const photoPath = this.getEmployeePhotoPath(employeeId);
    const photo = this.getEmployeePhoto(employeeId);
  
    // If photoPath is available, use it; otherwise, use the default path
    const src = photoPath ? photoPath : 'assets/img/user.png';
  
    // If photo is available, append it to the src
    return photo ? `${src}/${photo}` : src;
  }


  setDefaultPhoto() {
    const defaultPath = 'assets/img/user.png';
    const defaultImage = document.querySelector('.employee-photo') as HTMLImageElement;
    defaultImage.src = defaultPath;
  }




  searchByDate: any[] = [];

  onSearchByDateChange() {
  
    this.getEmployeesLeaveDetails();
  }

  clearSearchByDate() {
    this.searchByDate = [this.sevenDaysAgo, this.today];

    this.employeeService.setLeaveHistoryCount(0);

    this.getEmployeesLeaveDetails();
  }




  // downloadExcel() {
  //   // Create a new array without EmployeeId and LeaveTypeId columns
  //   const filteredLeaveList = this.employeesLeaveList.map(item => {
  //     const { employeeId, leaveTypeId, photoPath, photo, ...filteredItem } = item;
  //     return filteredItem;
  //   });
  
  //   // Create a worksheet manually, excluding EmployeeId and LeaveTypeId columns
  //   const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(filteredLeaveList.map(item => {
  //     // Omit EmployeeId and LeaveTypeId properties
  //     const { employeeId, leaveTypeId, photoPath, photo, ...filteredItem } = item;
  //     return filteredItem;
  //   }));
  
  //   // Create a new workbook and append the modified worksheet
  //   const wb: XLSX.WorkBook = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(wb, ws, 'Employees Leave List');
  
  //   // Generate the file name based on dates
  //   let fileName = 'Employees Leave List';
  
  //   if (this.startDate && this.endDate && this.startDate !== this.endDate) {
  //     fileName += `_${this.formatDate(this.startDate)}_${this.formatDate(this.endDate)}`;
  //   } else if (this.startDate) {
  //     fileName += `_${this.formatDate(this.startDate)}`;
  //   }
  
  //   fileName += '.xlsx';
  
  //   // Write the workbook to an Excel file
  //   XLSX.writeFile(wb, fileName);
  // }

  

  // formatDate(date: Date): string {
  //   return this.datePipe.transform(date, 'yyyy-MM-dd') || '';
  // }
  



  downloadExcel() {
    const filteredLeaveList = this.employeesLeaveList.map(item => {
      const { employeeId, leaveTypeId, photoPath, photo, totalEmployees, grandTotalLeaveCount, ...filteredItem } = item;
      return filteredItem;
    });
  
    const columnNames = [
      'Name',
      'Leave Type Name',
      'Leave Type Short Name',
      'Leave Count',
      'Leave Dates',
      'Total Leave Per Employee'
    ];
  

    const columnWidths = [
      { wch: 30 }, 
      { wch: 25 }, 
      { wch: 20 }, 
      { wch: 10 }, 
      { wch: 45 }, 
      { wch: 25 }  
    ];
  

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
  
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet([columnNames, ...filteredLeaveList.map(item => Object.values(item))]);

    ws['!cols'] = columnWidths;
  
    XLSX.utils.book_append_sheet(wb, ws, 'Employees Leave List');
  

    let fileName = 'Employees Leave List';
  
    if (this.startDate && this.endDate && this.startDate !== this.endDate) {
      fileName += `_${this.formatDate(this.startDate)}_${this.formatDate(this.endDate)}`;
    } else if (this.startDate) {
      fileName += `_${this.formatDate(this.startDate)}`;
    }
  
    fileName += '.xlsx';
  
    XLSX.writeFile(wb, fileName);
  }
  
  formatDate(date: Date): string {
    return this.datePipe.transform(date, 'yyyy-MM-dd') || '';
  }
  

}
