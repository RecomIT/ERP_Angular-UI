import { DatePipe, formatDate } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { DatePickerConfigService } from 'src/app/shared/services/DatePicker/date-picker-config.service';
import { SharedEventService } from 'src/app/shared/services/Event/shared-event.service';
import { ResignationRequestRoutingService } from '../../routing-service/resignation-request/resignation-request-routing.service';
import { AdminRoutingService } from '../../routing-service/admin/admin-routing.service';
import { UserService } from 'src/app/shared/services/user.service';
import { NotifyService } from 'src/app/shared/services/notify-service/notify.service';
import { UserRoutingService } from '../../routing-service/user/user-routing.service';
import { Select2ConfigService } from 'src/app/shared/services/Select2/select2-config.service';
import { ServiceLengthService } from '../../service/service-length/service-length.service';

@Component({
  selector: 'app-employee-resignation-details',
  templateUrl: './employee-resignation-details.component.html',
  styleUrls: ['./employee-resignation-details.component.css','./chip.css','./expansion-panel.css']
})
export class EmployeeResignationDetailsComponent implements OnInit {

  
  datePickerConfig: Partial<BsDatepickerConfig> = {};
  
  constructor(
    private fb: FormBuilder,
    public utilityService: UtilityService, 
    private datePipe: DatePipe,
    private resignationRequestRoutingService: ResignationRequestRoutingService,
    private datePickerConfigService : DatePickerConfigService,
    private sharedEventService: SharedEventService,
    private adminRoutingService: AdminRoutingService,
    private userService: UserService,
    private cdr : ChangeDetectorRef,
    private notifyService: NotifyService,
    private userRoutingService: UserRoutingService,
    private select2ConfigService: Select2ConfigService,
    private serviceLengthService: ServiceLengthService

  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.getApprovedResignationRequestsBySupervisor();
    this.datePickerConfig = this.datePickerConfigService.getRangeConfig();

    this.sharedEventService.submitSuccessEvent.subscribe(() => {
      this.getApprovedResignationRequestsBySupervisor();
    });

    this.getAllEmployees();
    this.employeeSelect2Options = this.select2ConfigService.getDefaultConfig();

  }


  employeeId : number = 0;
  

  
  pageSize: number = 5;
  pageNumber: number = 1;


  resignationRequestsApprovalPageConfig: any = this.userService.pageConfigInit("ResignationRequest", this.pageSize, 1, 0);

  approvalPageChanged(pageNo: any) {
    this.pageNumber = pageNo;
    this.getApprovedResignationRequestsBySupervisor();
  }


  onPageSizeChange() {
    this.pageNumber = this.resignationRequestsApprovalPageConfig.currentPage;
    this.getApprovedResignationRequestsBySupervisor();
  }



  
  
  resignationRequestList: any[]=[];

  getApprovedResignationRequestsBySupervisor() {

    const params: any = {};

    if (this.pageNumber && this.pageNumber > 0) {
      params['pageNumber'] = this.pageNumber;
    }
    if (this.pageSize && this.pageSize > 0) {
      params['pageSize'] = this.pageSize;
    }

    if (this.employeeId && this.employeeId > 0) {
      params['employeeId'] = this.employeeId;
    }

    this.adminRoutingService.getApprovedResignationRequestsBySupervisorApi<any[]>(params).subscribe({
      next: (response: any) => {
      this.resignationRequestList = response.body;

      var xPaginate = JSON.parse(response.headers.get('X-Pagination'));
      this.resignationRequestsApprovalPageConfig = this.userService.pageConfigInit("ResignationRequest", xPaginate.itemsPerPage, xPaginate.currentPage, xPaginate.totalItems);

      this.resignationRequestList.forEach((resignation: any) => {
        const { photoPath, photo, dateOfJoining } = resignation;
        resignation.photoPath = photoPath + '/' + photo;
        resignation.serviceLength = this.calculateServiceLength(new Date(dateOfJoining));
      });

      },
      error: (err) => {
      console.error(err);
      this.notifyService.handleApiError(err);
      }
      });
  }


  
  photoPath : string="";
  setDefaultPhoto() {
    const defaultPath = 'assets/img/user.png'; 
    this.photoPath = defaultPath;
  }

  serviceLength : string = null;

  calculateServiceLength(dateOfJoining: Date): void {
    this.serviceLength = this.serviceLengthService.calculateServiceLength(dateOfJoining);
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


  clearAcceptedLastWorkingDate(): void {
    this.resignationForm.get('AcceptedLastWorkingDate').setValue(null);
  }



  
  // showHRExitInterviewDate: boolean = false;

  // toggleHRExitInterviewDate(): void {
  //   this.showHRExitInterviewDate = !this.showHRExitInterviewDate;

  //   if (!this.showHRExitInterviewDate) {
  //       this.resignationForm.patchValue({
  //         HRExitInterviewDate: ''
  //       });
  //   } else {
  //       const employeeExitInterviewDate = this.resignationForm.get('EmployeeExitInterviewDate').value;
  //       this.resignationForm.patchValue({
  //         HRExitInterviewDate: employeeExitInterviewDate
  //       });
  //   }
  // }




  showHRExitInterviewDate: boolean = false;

  toggleHRExitInterviewDate(): void {
    this.showHRExitInterviewDate = !this.showHRExitInterviewDate;

    
    if (!this.showHRExitInterviewDate) {
      this.resignationForm.patchValue({
        HRExitInterviewDate: ''
      });
    } else {
      const employeeExitInterviewDate = this.resignationForm.get('EmployeeExitInterviewDate').value;
      this.resignationForm.patchValue({
        HRExitInterviewDate: employeeExitInterviewDate
      });
    }
  }



  
  showAcceptedLastWorkingDate: boolean = false;

  toggleAcceptLastWorkingDate(): void {
    this.showAcceptedLastWorkingDate = !this.showAcceptedLastWorkingDate;

    if (!this.showAcceptedLastWorkingDate) {
        this.resignationForm.patchValue({
            AcceptedLastWorkingDate: ''
        });
    } else {
        const requestLastWorkingDate = this.resignationForm.get('RequestLastWorkingDate').value;
        this.resignationForm.patchValue({
            AcceptedLastWorkingDate: requestLastWorkingDate
        });
    }
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




  
  insertStatus: any[]=[];


  submit() {
    if (this.resignationForm != null) {

      const formData = new FormData();
      
      formData.append('ResignationRequestId', this.resignationForm.get('ResignationRequestId').value);
      formData.append('EmployeeId', this.resignationForm.get('EmployeeId').value);
      formData.append('EmployeeName', this.resignationForm.get('EmployeeName').value);
      formData.append('SupervisorId', this.resignationForm.get('SupervisorId').value);
      formData.append('ResignationCategoryId', this.resignationForm.get('ResignationCategoryId').value);
      formData.append('ResignationSubCategoryId', this.resignationForm.get('ResignationSubCategoryId').value);
       
      const noticePeriod = this.resignationForm.get('NoticePeriod').value;
      formData.append('NoticePeriod', noticePeriod !== undefined ? noticePeriod : null);

      formData.append('NoticeDate', this.formatDate(this.resignationForm.get('NoticeDate').value));
      formData.append('RequestLastWorkingDate', this.formatDate(this.resignationForm.get('RequestLastWorkingDate').value));
      formData.append('EmployeeExitInterviewDate', this.formatDate(this.resignationForm.get('EmployeeExitInterviewDate').value));



      formData.append('ResignationReason', this.resignationForm.get('ResignationReason').value);
      formData.append('SecondaryReason', this.resignationForm.get('SecondaryReason').value);
      
      formData.append('CreatedShortfall', this.resignationForm.get('CreatedShortfall').value);
      formData.append('EmployeeComment', this.resignationForm.get('EmployeeComment').value);
      
      
      const selectedFile = this.resignationForm.get('File').value;
      formData.append('File', selectedFile);

      formData.append('ExistsFileName', this.resignationForm.get('ExistsFileName').value);
      formData.append('ExistsFilePath', this.resignationForm.get('ExistsFilePath').value);
  
      this.resignationRequestRoutingService.save(formData).subscribe(
        (response:any[]) => {

          this.insertStatus = response;

          if (this.insertStatus && this.insertStatus.length > 0 && this.insertStatus[0].Status) {
          
            this.utilityService.toastr.success(this.insertStatus[0].Msg, 'Server Response');

            // this.getEmployeesDetails();
            this.initializeForm();

            this.sharedEventService.submitSuccessEvent.emit();

          } else {
   
            this.utilityService.toastr.error(this.insertStatus[0]?.Msg, 'Server Response');
            this.initializeForm();
          }
      
        },
        (error) => {
          this.utilityService.toastr.error(error, 'Server Response');
        }
      );
    } else {
      this.utilityService.fail('Invalid Form Submission', 'Site Response');
    }
  }

  
  formatDate(date: any): string {

    if (date) {
      const formattedDate = formatDate(date, 'yyyy-MM-ddTHH:mm:ss', 'en-US');
      return formattedDate;
    }
  
    return '';
  }
  



  resignationRequestListById: any[]=[];

  resignationRequestId: number;


  getEmployeeResignationListById() {

    const params: any = {};
    if (this.resignationRequestId && this.resignationRequestId > 0) {
      params['resignationRequestId'] = this.resignationRequestId;
    }

    this.resignationRequestRoutingService.getEmployeeResignationListAsync<any[]>(params).subscribe({
      next: (response: any[]) => {
        this.resignationRequestListById = response;

        if (this.resignationRequestListById.length > 0) {
         this.setFormValues();
        }


      },
      error: (err) => {
        console.error(err);
        this.utilityService.fail("Something went wrong", "Server Response");
      }
    });
  }



  
  calculateShortfallByApprovedLWD(): { differenceInDays: number, shortfall: number } {
    

    const noticeDate = new Date(this.resignationForm.get('NoticeDate').value);

    const lastWorkingDate = new Date(this.resignationForm.get('AcceptedLastWorkingDate').value);
    
    const noticePeriod = this.resignationForm.get('NoticePeriod').value; 

    const differenceInMillis = lastWorkingDate.getTime() - noticeDate.getTime();
  
    const differenceInDays = Math.floor(differenceInMillis / (1000 * 60 * 60 * 24));

    const shortfall = differenceInDays > 0 ? noticePeriod - differenceInDays : 0;

    this.resignationForm.patchValue({
      ActualShortfall: shortfall,
          });
  
    return { differenceInDays, shortfall };
  }
  




  flag: string;


  // ------------------ Edit Last Working Date 
  // --- Starting .....

  showEditLastWorkingDateModal: boolean = false;
  openEditLastWorkingDateModal(id) {
    this.resignationRequestId = id;
    this.flag = 'editLastWorkingDate'
    this.showEditLastWorkingDateModal = true;

  }

  closeEditLastWorkingDateModal(reason: any) {

    this.showEditLastWorkingDateModal = false;

    this.resignationRequestId = null;
  }


  
  onAcceptedLastWorkingDateChanged(event: { date: Date, resignationRequestId: number }) {

    const { date, resignationRequestId } = event;
    const index = this.resignationRequestList.findIndex(item => item.resignationRequestId === resignationRequestId);

    if (index !== -1) {
      this.resignationRequestList[index].acceptedLastWorkingDate = date;
    }
  }


  // ------------------ Edit Last Working Date 
  // --- Ending .....

  

  // --------------- Edit Interview Date
  // --- Starting ...

  showEditInterviewDateModal: boolean = false;
  openEditInterviewDateModal(id) {
    this.resignationRequestId = id;
    this.flag = 'editInterviewDate'
    this.showEditInterviewDateModal = true;

  }

  closeEditInterviewDateModal(reason: any) {

    this.showEditInterviewDateModal = false;
    this.resignationRequestId = null;
  }




  onInterviewDateChanged(event: { date: Date, resignationRequestId: number }) {
    const { date, resignationRequestId } = event;

    const index = this.resignationRequestList.findIndex(item => item.resignationRequestId === resignationRequestId);

    if (index !== -1) {
        this.resignationRequestList[index].hrExitInterviewDate = date;
    }
  }


  // --------------- Edit Interview Date
  // --- Ending ...


  // -------------------------- Employee Info
  showEmployeeInfo : boolean = false;
  // -------------------------- End





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
      this.resignationRequestList[index].stateStatus = status;
      this.resignationRequestList[index].hrStatus = status;
    }
  }



  
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
      this.resignationRequestList[index].stateStatus = status;
      this.resignationRequestList[index].hrStatus = status;
    }
  }













  /// -----------------------------

  
  employeeSelect2Options: any = [];


  searchBySubordinatesId: number;
  subordiantesEmployeeList: any[] = [];

  getAllEmployees() {

    this.userRoutingService.getEmployeesAsync<any>(null).subscribe({
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


  onEmployeeSelectionChange(selectedEmployee: any) {

    this.employeeId = selectedEmployee;
    this.getApprovedResignationRequestsBySupervisor();
    this.cdr.detectChanges();
  }

  
}
