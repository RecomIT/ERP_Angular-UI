import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { DatePipe, formatDate } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DatePickerConfigService } from 'src/app/shared/services/DatePicker/date-picker-config.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ResignationRequestRoutingService } from '../../routing-service/resignation-request/resignation-request-routing.service';
import { SupervisorRoutingService } from '../../routing-service/supervisor/supervisor-routing.service';
import { UserService } from 'src/app/shared/services/user.service';
import { NotifyService } from 'src/app/shared/services/notify-service/notify.service';
import { SharedmethodService } from 'src/app/shared/services/shared-method/sharedmethod.service';
import { Select2ConfigService } from 'src/app/shared/services/Select2/select2-config.service';
import { ServiceLengthService } from '../../service/service-length/service-length.service';

@Component({
  selector: 'app-employee-resignation-request-list',
  templateUrl: './employee-resignation-request-list.component.html',
  styleUrls: ['./employee-resignation-request-list.component.css','./expansion-panel.css','./chip.css']
})
export class EmployeeResignationRequestListComponent implements OnInit {

  datePickerConfig: Partial<BsDatepickerConfig> = {};
  employeeSelect2Options :any = [];

  constructor(
    private fb: FormBuilder,
    public utilityService: UtilityService, 
    private resignationRequestRoutingService: ResignationRequestRoutingService,
    private datePickerConfigService : DatePickerConfigService,
    private supervisorRoutingService: SupervisorRoutingService,
    private userService : UserService,
    private cdr: ChangeDetectorRef,
    private notifyService: NotifyService,
    private sharedMethod: SharedmethodService,
    private select2ConfigService: Select2ConfigService,
    private serviceLengthService: ServiceLengthService,

  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.getEmployeeResignationList();
    this.datePickerConfig = this.datePickerConfigService.getRangeConfig();



    this.getEmployees();

    this.employeeId = null;
    this.sharedMethod.methodCall$.subscribe(
      () => {
      this.getEmployeeResignationList();
      });
      
      this.employeeSelect2Options = this.select2ConfigService.getDefaultConfig();
      this.initializEditInterviewForm();
  }

  employeeId: number = null;
  searchByEmployeeId: number;

  employeeList: any[]=[];

  getEmployees() {

    this.resignationRequestRoutingService.getEmployeesAsync<any[]>(null).subscribe({
      next: (response: any[]) => {
        this.employeeList = response;
      },
      error: (err) => {
        console.error(err);
        this.utilityService.fail("Something went wrong", "Server Response");
      }
    });
  }

  
  onEmployeeSelectionChange(selectEmployee: any) {

    this.employeeId = selectEmployee;
    this.searchByEmployeeId = selectEmployee;
    this.getEmployeeResignationList();

    this.cdr.detectChanges();

  }
  

  pageSize: number = 5;
  pageNumber: number = 1;


  resignationRequestsApprovalPageConfig: any = this.userService.pageConfigInit("ResignationRequest", this.pageSize, 1, 0);

  approvalPageChanged(pageNo: any) {
    this.pageNumber = pageNo;
    this.getEmployeeResignationList();
  }


  onPageSizeChange() {
    this.pageNumber = this.resignationRequestsApprovalPageConfig.currentPage;
    this.getEmployeeResignationList();
  }


  resignationRequestList: any[] = [];

  getEmployeeResignationList() {
    const params: any = {};

    if (this.pageNumber && this.pageNumber > 0) {
      params['pageNumber'] = this.pageNumber;
    }
    if (this.pageSize && this.pageSize > 0) {
      params['pageSize'] = this.pageSize;
    }

    if (this.searchByEmployeeId && this.searchByEmployeeId > 0) {
      params['employeeId'] = this.searchByEmployeeId;
    }


    this.supervisorRoutingService.getUserResignationRequestsForSupervisor<any[]>(params).subscribe({
      next: (response: any) => {
        this.resignationRequestList = response.body; 

        var xPaginate = JSON.parse(response.headers.get('X-Pagination'));
        this.resignationRequestsApprovalPageConfig = this.userService.pageConfigInit("ResignationRequest", xPaginate.itemsPerPage, xPaginate.currentPage, xPaginate.totalItems);

     
      this.resignationRequestList.forEach((resignation: any) => {
        const { photoPath, photo, dateOfJoining } = resignation;

        this.photoPath = photoPath + '/' + photo;
        resignation.serviceLength = this.calculateServiceLength(new Date(dateOfJoining));
      });


      },
      error: (err) => {
        console.error(err);
        this.notifyService.handleApiError(err);
      }
    });
  }


  serviceLength : string = null;

  calculateServiceLength(dateOfJoining: Date): void {
    this.serviceLength = this.serviceLengthService.calculateServiceLength(dateOfJoining);
  }

  photoPath : string="";
  setDefaultPhoto() {
    const defaultPath = 'assets/img/user.png'; 
    this.photoPath = defaultPath;
  }




  resignationForm: FormGroup;

  initializeForm(): void {
    this.resignationForm = this.fb.group({
      ResignationRequestId: new FormControl(0),

      NoticePeriod: new FormControl(null),
      NoticeDate: new FormControl(),
      RequestLastWorkingDate: new FormControl(''),

      IsAcceptedLastWorkingDate: new FormControl(0),
      AcceptedLastWorkingDate: new FormControl(''),

      RescheduleExitInterviewByHR: new FormControl(0),
      HRExitInterviewDate: new FormControl(''),

      EmployeeExitInterviewDate: new FormControl(''),

    });
  }


  setFormValues() {
    this.resignationForm.get('ResignationRequestId').setValue(this.resignationRequestList[0].ResignationRequestId);
   
    this.resignationForm.get('NoticePeriod').setValue(this.resignationRequestList[0].NoticePeriod);

    const noticeDateString = this.resignationRequestList[0].NoticeDate;
    const noticeDateObject = noticeDateString ? new Date(noticeDateString) : null;
    this.resignationForm.get('NoticeDate').setValue(noticeDateObject);

    const lastWorkingDateString = this.resignationRequestList[0].RequestLastWorkingDate;
    const lastWorkingDateObject = lastWorkingDateString ? new Date(lastWorkingDateString) : null;
    this.resignationForm.get('RequestLastWorkingDate').setValue(lastWorkingDateObject);

    const interviewDateString = this.resignationRequestList[0].EmployeeExitInterviewDate;
    const interviewDateObject = interviewDateString ? new Date(interviewDateString) : null;
    this.resignationForm.get('EmployeeExitInterviewDate').setValue(interviewDateObject);

  }


  downloadFile(fileName: string, filePath: string) {


    const params: any = {};
    if (fileName && fileName != null) {
      params['fileName'] = fileName;
    }

    if (filePath && filePath != null) {
      params['filePath'] = filePath;
    }


    this.resignationRequestRoutingService.downloadFile<any[]>(params).subscribe(data => {

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
      console.error('Error downloading file:', error);
    });


  }


  // ------------------------ Edit Inteview Modal
  // ------- Starting ...
  
  resignationRequestId: number;


  selectedResignation: any;
  showEditInterviewDateBySupervisorModal: boolean = false;

  openEditInterviewDateBySupervisorModal(selectedResignation: any) {
    this.selectedResignation = selectedResignation;

    this.showEditInterviewDateBySupervisorModal = true;
  }


  closeEditInterviewDateBySupervisorModal(reason: any) {

    this.showEditInterviewDateBySupervisorModal = false;

    this.resignationRequestId = null;

  }


  onInterviewDateBySupervisorChanged(event: { date: Date, resignationRequestId: number }) {

    const { date, resignationRequestId } = event;
    const index = this.resignationRequestList.findIndex(item => item.resignationRequestId === resignationRequestId);

    if (index !== -1) {
      this.resignationRequestList[index].supervisorExitInterviewDate = date;
    }
  }


  // ------------------------ Edit Inteview Modal
  // ------- Starting ...



  
  // ------------------------ Approve Modal
  // ------- Starting ...
  
  showApproveResignationRequestModal: boolean = false;

  openApproveResignationRequestModal(id) {
      this.resignationRequestId = id;

      this.showApproveResignationRequestModal = true;
  }
  
  
  closeApproveResignationRequestModal(reason: any) {

    this.showApproveResignationRequestModal = false;
    this.resignationRequestId = null;
  }


  
  
  onStatusChanged(event: { status: string, resignationRequestId: number }) {

    const { status, resignationRequestId } = event;
    const index = this.resignationRequestList.findIndex(item => item.resignationRequestId === resignationRequestId);

    if (index !== -1) {
      this.resignationRequestList[index].supervisorStatus = status;
    }
  }


  // ------------------------ Approve Modal
  // ------- EndingE ...
  


  // ------------------------ Reject Modal
  // ------- Starting ...
  
  showRejectResignationRequestModal: boolean = false;

  openRejectResignationRequestModal(id) {
      this.resignationRequestId = id;
      this.showRejectResignationRequestModal = true;
  
  }
  
  
  closeRejectResignationRequestModal(reason: any) {
    this.showRejectResignationRequestModal = false;
    this.resignationRequestId = null;
  }


  
  onRejectStatusChanged(event: { status: string, resignationRequestId: number }) {
    const { status, resignationRequestId } = event;
    const index = this.resignationRequestList.findIndex(item => item.resignationRequestId === resignationRequestId);

    if (index !== -1) {
      this.resignationRequestList[index].supervisorStatus = status;
    }
  }


  // ------------------------ Reject Modal
  // ------- Ending ...




  
  editInterviewForm: FormGroup;

  initializEditInterviewForm(): void {
    this.editInterviewForm = this.fb.group({
      ResignationRequestId: new FormControl(null, Validators.required),
      RescheduleExitInterviewBySupervisor: new FormControl(0),
      SupervisorExitInterviewDate: new FormControl('', Validators.required)
    });
  }

  printExitInterviewStatus(event: any, res: any) {
    const selectedValue = event.target.value === 'true';

    // Ensure editInterviewForm is defined
    if (this.editInterviewForm) {
      this.editInterviewForm.patchValue({
        ResignationRequestId: res.resignationRequestId,
        SupervisorExitInterviewDate: res.employeeExitInterviewDate ? new Date(res.employeeExitInterviewDate) : null,
      })

      if (selectedValue) {
        this.yesMethod();
      } else {
        this.noMethod();
      }
    } else {
      console.error("editInterviewForm is not initialized.");
    }
  }
  



  
  yesMethod() {

  }
  
  noMethod() {

  }



}
