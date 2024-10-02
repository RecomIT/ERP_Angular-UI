import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ResignationRequestRoutingService } from '../../routing-service/resignation-request/resignation-request-routing.service';
import { UserService } from 'src/app/shared/services/user.service';
import { UserRoutingService } from '../../routing-service/user/user-routing.service';
import { NotifyService } from 'src/app/shared/services/notify-service/notify.service';
import { SharedmethodService } from 'src/app/shared/services/shared-method/sharedmethod.service';


@Component({
  selector: 'app-resignation-request-list',
  templateUrl: './resignation-request-list.component.html',
  styleUrls: ['./resignation-request-list.component.css','./expansion-panel.css','./chip.css']
})
export class ResignationRequestListComponent implements OnInit {



  constructor(
    private resignationRequestRoutingService : ResignationRequestRoutingService,
    private userService: UserService,
    private cdr: ChangeDetectorRef,
    private userRoutingService: UserRoutingService,
    private notifyService: NotifyService,
    private sharedMethod: SharedmethodService

  ) { }

  ngOnInit(): void {
    
    this.getUserResignations();

    this.sharedMethod.methodCall$.subscribe(
      () => {
      this.getUserResignations();
      });
      
  }



  pageSize: number = 5;
  pageNumber: number = 1;

  userResignationRequestPageConfig: any = this.userService.pageConfigInit("userResignationRequest", this.pageSize, 1, 0);
 
  userResignationRequestPageChanged(pageNo: any) {
    this.pageNumber = pageNo;
    this.getUserResignations();
  }



  resignationRequestList: any[]=[];

  
  getUserResignations() {

    const params: any = {};

    if (this.pageNumber && this.pageNumber > 0) {
      params['pageNumber'] = this.pageNumber;
    }
    if (this.pageSize && this.pageSize > 0) {
      params['pageSize'] = this.pageSize;
    }

    this.userRoutingService.getUserResignationRequestsApi<any[]>(params).subscribe({
      next: (response: any) => {
      this.resignationRequestList = response.body;

      var xPaginate = JSON.parse(response.headers.get('X-Pagination'));
      this.userResignationRequestPageConfig = this.userService.pageConfigInit("userResignationRequest", xPaginate.itemsPerPage, 
      xPaginate.currentPage, xPaginate.totalItems);
      },
      error: (err) => {
      console.error(err);
      this.notifyService.handleApiError(err);
      }
      });
  }









  flag: string= '';

  employeeId: number;
  



  
  showCancelResignationRequestModal: boolean = false;
  resignationRequestId: number;
  
  openCancelResignationRequestModal(id) {

      this.resignationRequestId = id;
  
      this.showCancelResignationRequestModal = true;
  
  }
  
  
  closeCancelResignationRequestModal(reason: any) {

    this.showCancelResignationRequestModal = false;
    this.resignationRequestId = null;
  }





  

 



  refresh(){
    this.getUserResignations();
  }



  isCollapsed: { [key: string]: boolean } = {};

  toggleCollapse(resignCode: string): void {
    this.isCollapsed[resignCode] = !this.isCollapsed[resignCode];
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




  
  onStatusChanged(event: { status: string, resignationRequestId: number }) {

    const { status, resignationRequestId } = event;
    const index = this.resignationRequestList.findIndex(item => item.resignationRequestId === resignationRequestId);

    if (index !== -1) {
      this.resignationRequestList[index].stateStatus = status;
    }
  }


  
  // onUpdateChanged(event: { 
  //   resignationReason: string, 
  //   secondaryReason: string, 
  //   resignationRequestId: number, 
  //   resignationSubCategoryId: number,
  //   noticePeriod: number, 
  //   createdShortfall: number 
  // }) {

  //   const { 
  //     resignationReason, 
  //     secondaryReason,
  //     resignationRequestId, 
  //     resignationSubCategoryId, 
  //     noticePeriod, 
  //     createdShortfall 
  //   } = event;

  //   const index = this.resignationRequestList.findIndex(item => item.resignationRequestId === resignationRequestId);

  //   if (index !== -1) {
  //     this.resignationRequestList[index].resignationReason = resignationReason;
  //     this.resignationRequestList[index].secondaryReason = secondaryReason;
  //     this.resignationRequestList[index].resignationSubCategoryId = resignationSubCategoryId;
  //     this.resignationRequestList[index].noticePeriod = noticePeriod;
  //     this.resignationRequestList[index].createdShortfall = createdShortfall;
  //   }
  // }

  
  onUpdateChanged(updatedResignation: any) {

    const index = this.resignationRequestList.findIndex(item => item.resignationRequestId === updatedResignation.ResignationRequestId);
    
    if (index !== -1) {
      this.resignationRequestList[index].acceptedLastWorkingDate = updatedResignation.AcceptedLastWorkingDate;
      this.resignationRequestList[index].actualFileName = updatedResignation.ActualFileName;
      this.resignationRequestList[index].actualLastWorkingDate = updatedResignation.ActualLastWorkingDate;
      this.resignationRequestList[index].actualShortfall = updatedResignation.ActualShortfall;
      this.resignationRequestList[index].cancelRemarks = updatedResignation.CancelRemarks;
      this.resignationRequestList[index].cancelledBy = updatedResignation.CancelledBy;
      this.resignationRequestList[index].cancelledDate = updatedResignation.CancelledDate;
      this.resignationRequestList[index].companyId = updatedResignation.CompanyId;
      this.resignationRequestList[index].createdBy = updatedResignation.CreatedBy;
      this.resignationRequestList[index].createdDate = updatedResignation.CreatedDate;
      this.resignationRequestList[index].createdShortfall = updatedResignation.CreatedShortfall;
      this.resignationRequestList[index].employeeComment = updatedResignation.EmployeeComment;
      this.resignationRequestList[index].employeeExitInterviewDate = updatedResignation.EmployeeExitInterviewDate;
      this.resignationRequestList[index].employeeId = updatedResignation.EmployeeId;
      this.resignationRequestList[index].employeeName = updatedResignation.EmployeeName;
      this.resignationRequestList[index].fileName = updatedResignation.FileName;
      this.resignationRequestList[index].filePath = updatedResignation.FilePath;
      this.resignationRequestList[index].fileSize = updatedResignation.FileSize;
      this.resignationRequestList[index].fileType = updatedResignation.FileType;
      this.resignationRequestList[index].hrExitInterviewDate = updatedResignation.HRExitInterviewDate;
      this.resignationRequestList[index].hrStatus = updatedResignation.HRStatus;
      this.resignationRequestList[index].isResignationLetterUpload = updatedResignation.IsResignationLetterUpload;
      this.resignationRequestList[index].msg = updatedResignation.Msg;
      this.resignationRequestList[index].noticeDate = updatedResignation.NoticeDate;
      this.resignationRequestList[index].noticePeriod = updatedResignation.NoticePeriod;
      this.resignationRequestList[index].notifiedWithinNoticePeriod = updatedResignation.NotifiedWithinNoticePeriod;
      this.resignationRequestList[index].organizationId = updatedResignation.OrganizationId;
      this.resignationRequestList[index].requestLastWorkingDate = updatedResignation.RequestLastWorkingDate;
      this.resignationRequestList[index].rescheduleExitInterviewByHr = updatedResignation.RescheduleExitInterviewByHR;
      this.resignationRequestList[index].rescheduleExitInterviewBySupervisor = updatedResignation.RescheduleExitInterviewBySupervisor;
      this.resignationRequestList[index].resignCode = updatedResignation.ResignCode;
      this.resignationRequestList[index].resignationCategoryId = updatedResignation.ResignationCategoryId;
      this.resignationRequestList[index].resignationReason = updatedResignation.ResignationReason;
      this.resignationRequestList[index].resignationSubCategoryId = updatedResignation.ResignationSubCategoryId;
      this.resignationRequestList[index].secondaryReason = updatedResignation.SecondaryReason;
      this.resignationRequestList[index].stateStatus = updatedResignation.StateStatus;
      this.resignationRequestList[index].status = updatedResignation.Status;
      this.resignationRequestList[index].supervisorExitInterviewDate = updatedResignation.SupervisorExitInterviewDate;
      this.resignationRequestList[index].supervisorId = updatedResignation.SupervisorId;
      this.resignationRequestList[index].supervisorStatus = updatedResignation.SupervisorStatus;
      this.resignationRequestList[index].updatedBy = updatedResignation.UpdatedBy;
      this.resignationRequestList[index].updatedDate = updatedResignation.UpdatedDate;
    }
  }
  







   
  showEditResignationRequestModal: boolean = false;

  resignationRequestForUpdate: any;
  openEditResignationRequestModal(selected: any) {
    this.resignationRequestForUpdate = selected;
    this.showEditResignationRequestModal = true;
  }

  closeEditResignationRequestModal(reason: any) {

    this.showEditResignationRequestModal = false;

    this.resignationRequestForUpdate = null;
  }

}
