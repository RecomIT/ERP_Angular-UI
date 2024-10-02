import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { LeaveBalanceService } from '../../leave-balance/leave-balance.service';
import { FormGroup} from '@angular/forms';
import { CommonDashboardRoutingService } from 'src/app/areas/common-dashboard/common-dashboard-routing/common-dashboard-routing.service';
import { NotifyService } from 'src/app/shared/services/notify-service/notify.service';
import { Select2ConfigService } from 'src/app/shared/services/Select2/select2-config.service';
import { LeaveBalanceRoutingService } from '../../routing-service/leave-balance/leave-balance-routing.service';
import { UserService } from 'src/app/shared/services/user.service';
import { SharedmethodService } from 'src/app/shared/services/shared-method/sharedmethod.service';
import { DatePipe } from '@angular/common';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-employee-leave-balance-dashboard',
  templateUrl: './employee-leave-balance-dashboard.component.html',
  styleUrls: ['./employee-leave-balance-dashboard.component.css']
})
export class EmployeeLeaveBalanceDashboardComponent implements OnInit {

  
  leaveBalanceForm: FormGroup;

  listOfEmployee: any[] = [];
  ddlleaveTypes: any;

  

  employeeContactSelect2Options: any = [];
  leaveTypeSelect2Options: any = [];

  constructor(
    private notifyService: NotifyService,
    private select2ConfigService: Select2ConfigService,
    private apiEndpointsService: CommonDashboardRoutingService,
    private cdr: ChangeDetectorRef,
    private leaveBalanceRoutingService: LeaveBalanceRoutingService,
    private sharedMethod: SharedmethodService,
    private datePipe: DatePipe

  ) { }

  ngOnInit(): void {
    this.employeeContactSelect2Options = this.select2ConfigService.getDefaultConfig();
    this.getEmployees();
    this.getEmployeeLeaveBalances();
    

    this.sharedMethod.methodCall$.subscribe(
      () => {
      this.getEmployeeLeaveBalances();
      });
      
    this.getAllEmployeeLeaveBalances();

  }

    
  

  getEmployees() {
    this.apiEndpointsService.getEmployeeContactApi<any>({}).subscribe({
      next: (response) => {
        if (Array.isArray(response)) {
          this.listOfEmployee = response;
        }
      },
      error: (error: any) => {
        console.error(error);
        this.notifyService.handleApiError(error);
      }
    });
  }


  employeeId : number;
  searchByEmployeeId: number;

  onEmployeeSelectionChange(selectedEmployee: any) {
    this.pageNumber =1;
    this.employeeId = selectedEmployee;

    this.getEmployeeLeaveBalances();


    this.cdr.detectChanges();

  }




  
  leaveTypeId : number;


  
  pageSize: number = 5;
  pageNumber: number = 1;

  minPagesToShow: number = 2;
  minCurrentPage: number = 2;

  pageSizeOptions: number[] = [];

  totalPage: number;
  items : number;




  goToPage(pageNumber: number): void {
    //console.log('Handling pageChange event with value:', pageNumber);
    this.pageNumber = pageNumber;
    this.listOfLeaveBalance.pageNumber = pageNumber;
    this.getEmployeeLeaveBalances();
  }
  

  changePageSize(newPageSize: number): void {
    this.pageSize = newPageSize;
    this.getEmployeeLeaveBalances();
  }

  listOfLeaveBalance: any;

  getEmployeeLeaveBalances(): void {
      const params: any = {};
    
      if (!this.pageSize || this.pageSize < 1) {
        this.pageSize = 1;
      }

      if (!this.employeeId) {
        this.pageSize = 5;
      } else {
            params['employeeId'] = this.employeeId;
      }

      if (this.employeeId && this.employeeId != null) {
          params['employeeId'] = this.employeeId;
      }

      if (this.pageNumber && this.pageNumber > 0) {
          params['pageNumber'] = this.pageNumber;
      }

      if (this.pageSize >= 1) {
          params['pageSize'] = this.pageSize;
      } 

      // console.log('params',params);

      this.leaveBalanceRoutingService.getEmployeeLeaveBalances(params).subscribe({
        next: (response: any) => {
          this.listOfLeaveBalance = response;
          // console.log('listOfLeaveBalance', this.listOfLeaveBalance);

          const totalItems = response.totalItems;
          //console.log('Total data:', totalItems);

          this.items = response.items.length;
          //console.log('items',this.items);

          this.totalPage = this.listOfLeaveBalance.totalPages;
      

          this.pageSizeOptions = this.generatePageSizeOptions(totalItems);

          if (!this.pageSizeOptions.includes(this.pageSize)) {
            this.pageSize = this.pageSizeOptions[0];
          }

        },
        error: (error) => {
          console.error(error);
          this.notifyService.handleApiError(error);
        }
      });
  }



  formatDate(date: Date): string {
    return this.datePipe.transform(date, 'dd MMM, yyyy');
  }

  generatePageSizeOptions(totalItems: number): number[] {
   
    let options: number[] = [];
    let currentPageSize = this.pageSize;

    if (currentPageSize >= 1 && currentPageSize <= totalItems) {
        options.push(currentPageSize);
    }

    for (let i = 5; i <= totalItems; i += 5) {
        if (i !== currentPageSize) {
            options.push(i);
        }
    }

    if (totalItems % 5 !== 0 && totalItems > 5 && totalItems !== currentPageSize) {
        options.push(totalItems);
    }

    if (totalItems < 5 && totalItems !== currentPageSize) {
        options.push(totalItems);
    }
    options.sort((a, b) => a - b);

    return options;

  }


  



  // Add Employee Leave Modal
  showAddEmployeeLeaveBalanceModal: boolean = false;

  openAddEmployeeLeaveBalanceModal() {
    this.showAddEmployeeLeaveBalanceModal = true;
  }

  closeAddEmployeeLeaveBalanceModal(reason: any) {
    this.showAddEmployeeLeaveBalanceModal = false;
  }



  showEditEmployeeLeaveBalanceModal: boolean = false;
  selectedEmployeeForEdit: any = null;
  openEditEmployeeLeaveBalanceModal(employee: any) {
    this.selectedEmployeeForEdit = employee;
    //console.log('current employee',employee);
    this.showEditEmployeeLeaveBalanceModal = true;
  }

  closeEditEmployeeLeaveBalanceModal(reason: any) {
    this.showEditEmployeeLeaveBalanceModal = false;
    this.selectedEmployeeForEdit = null;
  }





  listOfAllLeaveBalance: any;

  getAllEmployeeLeaveBalances(): void {
      
    this.leaveBalanceRoutingService.getAllEmployeeLeaveBalances().subscribe({
      next: (response: any) => {
        this.listOfAllLeaveBalance = response;
        // console.log('listOfAllLeaveBalance', this.listOfAllLeaveBalance);  

      },
      error: (error) => {
        console.error(error);
        this.notifyService.handleApiError(error);
      }
    });
  }



  downloadExcel(): void {
    const wsData: any[][] = [];
  
    const headers = ['Employee Code', 'Employee Name'];
    const leaveTypes = this.getLeaveTypes(this.listOfAllLeaveBalance);
    headers.push(...leaveTypes);
  
    wsData.push(headers);
  
    this.listOfAllLeaveBalance.forEach((employee: any) => {
      const row = [employee.EmployeeCode, employee.EmployeeName];
      leaveTypes.forEach((type) => {
        row.push(employee[type] || 0);
      });
      wsData.push(row);
    });
  
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
  

    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(wsData);
  

    const columnWidths = [
      { wch: 20 }, 
      { wch: 30 }, 
      ...leaveTypes.map(() => ({ wch: 20 }))  
    ];
    ws['!cols'] = columnWidths;
  
  
    XLSX.utils.book_append_sheet(wb, ws, 'Employees Leave List');
  
    const fileName = 'Employees Leave List.xlsx';
    XLSX.writeFile(wb, fileName);
  }
  
  private getLeaveTypes(list: any[]): string[] {
    const leaveTypesSet = new Set<string>();
    list.forEach((employee: any) => {
      Object.keys(employee).forEach((key) => {
        if (key !== 'EmployeeCode' && key !== 'EmployeeName') {
          leaveTypesSet.add(key);
        }
      });
    });
    return Array.from(leaveTypesSet);
  }

  

}


