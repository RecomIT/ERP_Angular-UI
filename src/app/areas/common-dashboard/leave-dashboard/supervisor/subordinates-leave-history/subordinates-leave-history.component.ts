import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { SubordinatesLeaveDashboardRoutingService } from '../../../common-dashboard-routing/subordinates-leave-dashboard-rouing/subordinates-leave-dashboard-routing.service';
import { Select2ConfigService } from 'src/app/shared/services/Select2/select2-config.service';
import { DatePipe } from '@angular/common';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import * as XLSX from 'xlsx';
import { UserService } from 'src/app/shared/services/user.service';
import { SubordinatesService } from '../service/subordinates.service';
import { SharedmethodService } from 'src/app/shared/services/shared-method/sharedmethod.service';
import { DatePickerConfigService } from 'src/app/shared/services/DatePicker/date-picker-config.service';




@Component({
  selector: 'app-subordinates-leave-history',
  templateUrl: './subordinates-leave-history.component.html',
  styleUrls: ['./subordinates-leave-history.component.css']
})
export class SubordinatesLeaveHistoryComponent implements OnInit {


  today = new Date();
  sevenDaysAgo = new Date();


  constructor(
    private subordinatesLeave: SubordinatesLeaveDashboardRoutingService,
    private select2ConfigService: Select2ConfigService,
    private datePickerConfigService : DatePickerConfigService,
    private datePipe: DatePipe,
    private cdr: ChangeDetectorRef,
    private  userService: UserService,
    private subordinatesService: SubordinatesService,
    private sharedmethodService: SharedmethodService,
  ) { }



  
  datePickerConfig: Partial<BsDatepickerConfig> = {};
  ngOnInit(): void {
    
    this.sharedmethodService.methodCall$.subscribe(() => {
      this.getSubordinatesLeaveDetails();
    });
    


    this.getSubordinatesEmployees();
    this.getSubordinatesLeaveDetails();

    this.employeeSelect2Options = this.select2ConfigService.getDefaultConfig();

    this.datePickerConfig = this.datePickerConfigService.getRangeConfig();

    // this.searchByDate = [new Date(), new Date()];


    this.sevenDaysAgo.setDate(this.today.getDate() - 7);

    this.searchByDate = [this.sevenDaysAgo, this.today];

  }


  employeeSelect2Options:any = [];



  searchBySubordinatesId: number;
  subordiantesEmployeeList: any[] = [];

  getSubordinatesEmployees() {

    this.subordinatesLeave.getSubordinatesEmployeesApi<any>(null).subscribe({
      next: (response) => {
        if (Array.isArray(response)) {
          this.subordiantesEmployeeList = response;
  
      }},
      error: (error: any) => {
        console.error(error);
        
      }
    });
    
  }



  
  employeeId: number;
  onEmployeeSelectionChange(selectedEmployee: any) {

    this.employeeId = selectedEmployee;

    this.subordinatesService.setLeaveHistoryCount(0);

    this.getSubordinatesLeaveDetails();

    this.cdr.detectChanges();

  }


  
  startDate: any = null;
  endDate: any = null;

  teamMemberLeaveHistoryList: any[] = [];
  totalEmployees: number = 0;
  leaveDays: number = 0;
  
  pageSize: number = 5;
  pageNumber: number = 1;

  teamMemberLeaveHistoryConfig: any = this.userService.pageConfigInit("teamMemberData", this.pageSize, 1, 0);

  historyPageChanged(pageNo: any) {
    this.pageNumber = pageNo;
    this.getSubordinatesLeaveDetails();
  }

  onPageSizeChange() {
    this.pageNumber = this.teamMemberLeaveHistoryConfig.currentPage;

    this.getSubordinatesLeaveDetails();
  }


  getSubordinatesLeaveDetails() {

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

    this.subordinatesLeave.getSubordinatesLeaveDetailsApi<any>(params).subscribe({
      next: (response) => {

        this.teamMemberLeaveHistoryList = response.body;

        var xPaginate = JSON.parse(response.headers.get('X-Pagination'));
        this.teamMemberLeaveHistoryConfig = this.userService.pageConfigInit("teamMemberData", xPaginate.itemsPerPage, xPaginate.currentPage, xPaginate.totalItems);

       if(this.teamMemberLeaveHistoryList.length > 0){
        this.leaveDays = this.teamMemberLeaveHistoryList[0].grandTotalLeaveCount;

        this.totalEmployees = this.teamMemberLeaveHistoryList[0].totalEmployees;
        this.subordinatesService.setLeaveHistoryCount(this.totalEmployees);
       }

      },
      error: (error: any) => {
        console.error(error);
        
      }
    });
    
  }


  


  getUniqueEmployeeIds(): string[] {
    return Array.from(new Set(this.teamMemberLeaveHistoryList.map(leaveDetail => leaveDetail.employeeId)));
  }

  getEmployeeFullName(employeeId: string): string {
    const firstLeaveDetail = this.teamMemberLeaveHistoryList.find(leaveDetail => leaveDetail.employeeId === employeeId);
    return firstLeaveDetail ? firstLeaveDetail.name : '';
  }

  getLeaveDetailsByEmployeeId(employeeId: string): any[] {
    return this.teamMemberLeaveHistoryList.filter(leaveDetail => leaveDetail.employeeId === employeeId);
  }


  getEmployeePhotoPath(employeeId: string): string {
    const firstLeaveDetail = this.teamMemberLeaveHistoryList.find(leaveDetail => leaveDetail.employeeId === employeeId);
    return firstLeaveDetail ? firstLeaveDetail.photoPath : '';
  }
  
  getEmployeePhoto(employeeId: string): string {
    const firstLeaveDetail = this.teamMemberLeaveHistoryList.find(leaveDetail => leaveDetail.employeeId === employeeId);
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
    this.getSubordinatesLeaveDetails();
  }

  clearSearchByDate() {
    this.searchByDate = [this.sevenDaysAgo, this.today];

    this.subordinatesService.setLeaveHistoryCount(0);

    this.getSubordinatesLeaveDetails();



  }





  // downloadExcel() {
  //   // Create a new array without EmployeeId and LeaveTypeId columns
  //   const filteredLeaveList = this.teamMemberLeaveHistoryList.map(item => {
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
  //   XLSX.utils.book_append_sheet(wb, ws, 'Subordinates Leave List');
  
  //   // Generate the file name based on dates
  //   let fileName = 'Subordinates Leave List';
  
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
  //   // Use DatePipe to format the date
  //   return this.datePipe.transform(date, 'yyyy-MM-dd') || '';
  // }




  
  downloadExcel() {
    const filteredLeaveList = this.teamMemberLeaveHistoryList.map(item => {
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
  
    XLSX.utils.book_append_sheet(wb, ws, 'Subordinates Leave List');
  

    let fileName = 'Subordinates Leave List';
  
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
