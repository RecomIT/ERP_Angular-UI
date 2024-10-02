import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Select2ConfigService } from 'src/app/shared/services/Select2/select2-config.service';
import { DatePickerConfigService } from 'src/app/shared/services/DatePicker/date-picker-config.service';
import { DatePipe } from '@angular/common';
import { UserService } from 'src/app/shared/services/user.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { EmployeeLeaveDashboardRoutingService } from '../../../common-dashboard-routing/employee-leave-dashboard-routing/employee-leave-dashboard-routing.service';
import { EmployeeService } from '../service/employee.service';
import { SharedmethodService } from 'src/app/shared/services/shared-method/sharedmethod.service';
import { EmployeeLeaveRequestService } from 'src/app/areas/leave_module/employee-leave-request/employee-leave-request.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { DownloadfileService } from 'src/app/shared/services/download-file/downloadfile.service';
import { NotifyService } from 'src/app/shared/services/notify-service/notify.service';

@Component({
  selector: 'app-employees-leave-approval',
  templateUrl: './employees-leave-approval.component.html',
  styleUrls: ['./employees-leave-approval.component.css']
})
export class EmployeesLeaveApprovalComponent implements OnInit {

 
  constructor(
    private employeesLeave: EmployeeLeaveDashboardRoutingService,
    private select2ConfigService: Select2ConfigService,
    private datePickerConfigService: DatePickerConfigService,
    private datePipe: DatePipe,
    private userService: UserService,
    private employeeService: EmployeeService,
    private cdr: ChangeDetectorRef,
    private sharedmethodService: SharedmethodService,
    private employeeLeaveRequestService: EmployeeLeaveRequestService,
    private utilityService: UtilityService,
    private downloadfileService: DownloadfileService,
    private notifyService: NotifyService

  ) { 
   
  }




  datePickerConfig: Partial<BsDatepickerConfig> = {};
  privilege: any;

  ngOnInit(): void {

    this.sharedmethodService.methodCall$.subscribe(
      () => {
      this.getEmployeesLeaveApproval();
      this.cdr.detectChanges();
    });

    this.getSubordinatesEmployees();
    this.getEmployeesLeaveApproval();

    this.employeeSelect2Options = this.select2ConfigService.getDefaultConfig();

    this.datePickerConfig = this.datePickerConfigService.getRangeConfig();



    this.searchByDate = [new Date(), new Date()];

  }


  employeeSelect2Options: any = [];


  searchBySubordinatesId: number;
  subordiantesEmployeeList: any[] = [];

  getSubordinatesEmployees() {

    this.employeesLeave.getEmployeesAsync<any>(null).subscribe({
      next: (response) => {
        if (Array.isArray(response)) {
          this.subordiantesEmployeeList = response;

        }
      },
      error: (error: any) => {
        console.error(error);

      }
    });
  }




  employeeId: number;
  onEmployeeSelectionChange(selectedEmployee: any) {

    this.employeeId = selectedEmployee;

    this.getEmployeesLeaveApproval();


    this.cdr.detectChanges();


  }



  startDate: any = null;
  endDate: any = null;

  totalEmployees: number = 0;
  
  employeesLeaveList: any[] = [];


  
  pageSize: number = 5;
  pageNumber: number = 0;

  employeeApprovalPageConfig: any = this.userService.pageConfigInit("employeeLeaveData", this.pageSize, 1, 0);

  approvalPageChanged(pageNo: any) {
    this.pageNumber = pageNo;
    this.getEmployeesLeaveApproval();
    this.cdr.detectChanges();
  }


  
  onPageSizeChange() {

    this.pageNumber = this.employeeApprovalPageConfig.currentPage;

    this.getEmployeesLeaveApproval();

    this.cdr.detectChanges();
  }


  getEmployeesLeaveApproval() {

    const params: any = {};

    if (this.employeeId && this.employeeId > 0) {
      params['employeeId'] = this.employeeId;
    }

    if (this.pageNumber && this.pageNumber > 0) {
      params['pageNumber'] = this.pageNumber;
    }
    if (this.pageSize && this.pageSize > 0) {
      params['pageSize'] = this.pageSize;
    }


    this.employeesLeave.getEmployeesLeaveApprovalApi<any>(params).subscribe({
      next: (response) => {
        this.employeesLeaveList = response.body;

        console.log('this.employeesLeaveList',this.employeesLeaveList);

        var xPaginate = JSON.parse(response.headers.get('X-Pagination'));
        this.employeeApprovalPageConfig = this.userService.pageConfigInit("employeeLeaveData", xPaginate.itemsPerPage, xPaginate.currentPage, xPaginate.totalItems);


        
        if(this. employeesLeaveList.length > 0){
          this.totalEmployees = this. employeesLeaveList[0].totalRowCount;
        }
        else{
          this.totalEmployees = 0;
        }

        if(this.totalEmployees > 0){
          this.employeeService.setApprovalEmployees(this.totalEmployees);
        }
        else{
          this.employeeService.setApprovalEmployees(0);
        }

      },
      error: (error: any) => {
        console.error(error);

      }
    });

  }









  searchByDate: any[] = [];

  onSearchByDateChange() {

    this.getEmployeesLeaveApproval();
  }

  clearSearchByDate() {
    this.searchByDate = null;

    this.getEmployeesLeaveApproval();
  }





  /// ----------------------------
  /// Child Components
  /// ----------------------------

  showApprovalDetailsModal: boolean = false;

  selectedEmployeeDetails: any;
  openApprovalDetailsModal(employee) {


    this.selectedEmployeeDetails = employee;
  
    this.showApprovalDetailsModal = true;
  }
  


  closeApprovalDetailsModal(reason: any) {

    this.showApprovalDetailsModal = false;
  }





  // -------------------------------------
  // 
  // -------------------------------------

  showApproveModal: boolean = false;
  approveEmployeeDetails: any;

  openApproveModal(employee) {


    this.approveEmployeeDetails = employee;
  
    this.showApproveModal = true;
  }
  

  closeApproveModal(reason: any) {
    this.showApproveModal = false;
  }





  showRejectModal: boolean = false;

  openRejectModal(employee) {

    this.approveEmployeeDetails = employee;
  
    this.showRejectModal = true;
  }
  

  closeRejectModal(reason: any) {
    this.showRejectModal = false;
  }




  // ------------------------- Bulk Approval
  selectAllChecked: boolean = false; 
  selectedEmployees: any[] = []; 

  selectAllEmployees(event: any) {
      const isChecked = event.target.checked;
      this.selectAllChecked = isChecked; // Update the state of "Select All" checkbox
  
      if (isChecked) {
          // If checkbox is checked, select all employees
          this. employeesLeaveList.forEach(employee => {
              if (!this.isSelected(employee)) {
                  this.checkBoxChange({ target: { checked: true } }, employee);
              }
          });
      } else {
          // If checkbox is unchecked, deselect all employees
          this. employeesLeaveList.forEach(employee => {
              if (this.isSelected(employee)) {
                  this.checkBoxChange({ target: { checked: false } }, employee);
              }
          });
      }

      this.printSelectedEmployees();
  }
  

  checkBoxChange(event: any, employee: any) {
      const isChecked = event.target.checked;
      if (isChecked) {
          // If checkbox is checked, add the employee details to selectedEmployees array
          this.selectedEmployees.push({
              employeeLeaveRequestId: employee.employeeLeaveRequestId,
              employeeId: employee.employeeId,
              stateStatus: employee.stateStatus
          });
      } else {
          // If checkbox is unchecked, remove the employee details from selectedEmployees array
          this.selectedEmployees = this.selectedEmployees.filter(selected => selected.employeeLeaveRequestId !== employee.employeeLeaveRequestId);
      }
  
      // Check whether all employees are selected or not
      this.selectAllChecked = this. employeesLeaveList.every(employee => this.isSelected(employee));
  
      // Print selected employees
      this.printSelectedEmployees();
  }
  
  printSelectedEmployees() {
      // console.log('Selected Employees:', this.selectedEmployees);
      // console.log('All Employees Selected:', this.selectAllChecked);
  }
  
  isSelected(employee: any): boolean {
      return this.selectedEmployees.some(selected => selected.employeeLeaveRequestId === employee.employeeLeaveRequestId);
  }
  

  approveAll() {
   
    this.selectedEmployees.forEach(employee => {
        const remarks = ''; 
        // Call the backend service for approval
        this.employeeLeaveRequestService.approval({
            employeeId: employee.employeeId,
            employeeLeaveRequestId: employee.employeeLeaveRequestId,
            remarks: remarks,
            stateStatus: 'Approved'
        }).subscribe(response => {
            var data = response as any;
            if (data?.status) {
                this.utilityService.success("Saved Successfully", "Server Response");
              
                this.sharedmethodService.callMethod();

                this.selectedEmployees = [];
              
            } else {
                
                if (data?.msg == "Validation Error") {
                    data.msg = '';
                    Object.keys(data.errors).forEach((key) => {
                        data.msg += data.errors[key] + '</br>';
                    })
                    this.utilityService.fail(data.msg, "Server Response", 5000);
                } else {
                    this.utilityService.fail(data.msg, "Server Response");
                }
            }
        });
    });


  }


  rejectAll() {
   
    this.selectedEmployees.forEach(employee => {
        const remarks = ''; 

        this.employeeLeaveRequestService.approval({
            employeeId: employee.employeeId,
            employeeLeaveRequestId: employee.employeeLeaveRequestId,
            remarks: remarks,
            stateStatus: 'Rejected'
        }).subscribe(response => {
            var data = response as any;
            if (data?.status) {
                this.utilityService.success("Saved Successfully", "Server Response");
              
                this.sharedmethodService.callMethod();

                this.selectedEmployees = [];
              
            } else {
                
                if (data?.msg == "Validation Error") {
                    data.msg = '';
                    Object.keys(data.errors).forEach((key) => {
                        data.msg += data.errors[key] + '</br>';
                    })
                    this.utilityService.fail(data.msg, "Server Response", 5000);
                } else {
                    this.utilityService.fail(data.msg, "Server Response");
                }
            }
        });
    });


  }












  // Activity Modal
  
  showActivityModal: boolean = false;

  activityLogDetails: any;
  openActivityLogModal(employee) {

    this.activityLogDetails = employee;
  
    this.showActivityModal = true;
  }

  
  
  closeActivityLogModal(reason: any) {

    this.showActivityModal = false;
  }




  downloadFile(fileName: string, filePath: string) {

    const params: any = {};
    if (fileName && fileName != null) {
      params['fileName'] = fileName;
    }

    if (filePath && filePath != null) {
      params['filePath'] = filePath;
    }

    this.downloadfileService.downloadFile<any[]>(params).subscribe(data => {

      const blob = new Blob([data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = fileName;
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      window.URL.revokeObjectURL(url);
    }, error => {
    //   console.error('Error downloading file:', error);
        this.notifyService.handleApiError(error);
    });


  }



}
