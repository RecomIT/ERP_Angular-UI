import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/shared/services/user.service';
import { TrainingRoutingService } from '../../user/routing-service/training-routing.service';
import { NotifyService } from 'src/app/shared/services/notify-service/notify.service';
import { Select2ConfigService } from 'src/app/shared/services/Select2/select2-config.service';
import { SharedmethodService } from 'src/app/shared/services/shared-method/sharedmethod.service';

@Component({
  selector: 'app-training-approval',
  templateUrl: './training-approval.component.html',
  styleUrls: ['./training-approval.component.css']
})
export class TrainingApprovalComponent implements OnInit {



  constructor(
    private userService: UserService,
    private trainingRoutingService: TrainingRoutingService,
    private notifyService: NotifyService,
    private cdr: ChangeDetectorRef,
    private select2ConfigService: Select2ConfigService,
    private sharedMethodService: SharedmethodService
  ) { }


  ngOnInit(): void {
    this.getTrainingRequests();

    this.getSubordinatesEmployees();
    this.employeeSelect2Options = this.select2ConfigService.getDefaultConfig();

    this.sharedMethodService.methodCall$.subscribe(()=>{
      this.getTrainingRequests();
    });
  }


  
  pageSize: number = 5;
  pageNumber: number = 1;

  trainingPageConfig: any = this.userService.pageConfigInit("training", this.pageSize, 1, 0);
 
  trainingPageChanged(pageNo: any) {
    this.pageNumber = pageNo;
    this.getTrainingRequests();
  }



  trainingList: any[]=[];

  
  getTrainingRequests() {

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


    this.trainingRoutingService.getAllTrainingRequestsApi<any[]>(params).subscribe({
      next: (response: any) => {
      this.trainingList = response.body;

      console.log('this.trainingList',this.trainingList);

      var xPaginate = JSON.parse(response.headers.get('X-Pagination'));
      this.trainingPageConfig = this.userService.pageConfigInit("training", xPaginate.itemsPerPage, 
      xPaginate.currentPage, xPaginate.totalItems);
      },
      error: (err) => {
      console.error(err);
      this.notifyService.handleApiError(err);
      }
      });
  }










  employeeSelect2Options: any = [];
  

  
  searchBySubordinatesId: number;
  subordiantesEmployeeList: any[] = [];

  getSubordinatesEmployees() {

    this.trainingRoutingService.getSubordinatesEmployeesApi<any>(null).subscribe({
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

    this.getTrainingRequests();

    this.cdr.detectChanges();
  }








  
  // Approve Modal 
  // ----------------- Starting ...
  ExecutionFlag: string = null;
  showApproveModal: boolean = false;
  selectedTraining: any;

  openApproveModal(training: any) {
    this.ExecutionFlag = 'Approve';
    this.showApproveModal = true;
    this.selectedTraining = training;
  }


  closeApproveModal(reason: any) {

    this.showApproveModal = false;
    this.selectedTraining = null;
    this.ExecutionFlag = null;
    
  }





  
  // Reject Modal 
  // ----------------- Starting ...
  showRejectModal: boolean = false;

  openRejectModal(training: any) {
    this.ExecutionFlag = 'Reject';
    this.showRejectModal = true;
    this.selectedTraining = training;
  }


  closeRejectModal(reason: any) {

    this.showRejectModal = false;
    this.selectedTraining = null;
    this.ExecutionFlag = null;
    
  }

}
