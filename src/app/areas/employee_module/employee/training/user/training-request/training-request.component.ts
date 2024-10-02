import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/shared/services/user.service';
import { TrainingRoutingService } from '../routing-service/training-routing.service';
import { NotifyService } from 'src/app/shared/services/notify-service/notify.service';
import { SharedmethodService } from 'src/app/shared/services/shared-method/sharedmethod.service';

@Component({
  selector: 'app-training-request',
  templateUrl: './training-request.component.html',
  styleUrls: ['./training-request.component.css']
})
export class TrainingRequestComponent implements OnInit {

  constructor(
    private userService: UserService,
    private trainingRoutingService: TrainingRoutingService,
    private notifyService: NotifyService,
    private sharedMethodService: SharedmethodService
  ) { }


  ngOnInit(): void {
    this.getAllTraining();

    this.sharedMethodService.methodCall$.subscribe(()=>{
      this.getAllTraining();
    });
  }


  
  pageSize: number = 5;
  pageNumber: number = 1;

  trainingPageConfig: any = this.userService.pageConfigInit("training", this.pageSize, 1, 0);
 
  trainingPageChanged(pageNo: any) {
    this.pageNumber = pageNo;
    this.getAllTraining();
  }



  trainingList: any[]=[];

  
  getAllTraining() {

    const params: any = {};

    if (this.pageNumber && this.pageNumber > 0) {
      params['pageNumber'] = this.pageNumber;
    }
    if (this.pageSize && this.pageSize > 0) {
      params['pageSize'] = this.pageSize;
    }

    this.trainingRoutingService.getAllTrainingApi<any[]>(params).subscribe({
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





  
  // Enroll Modal 
  // ----------------- Starting ...
  ExecutionFlag: string = null;
  showEnrollModal: boolean = false;
  selectedTraining: any;

  openEnrollModal(training: any) {
    this.ExecutionFlag = 'I';
    this.showEnrollModal = true;
    this.selectedTraining = training;
  }


  closeEnrollModal(reason: any) {

    this.showEnrollModal = false;
    this.selectedTraining = null;
    this.ExecutionFlag = null;

  }





}
