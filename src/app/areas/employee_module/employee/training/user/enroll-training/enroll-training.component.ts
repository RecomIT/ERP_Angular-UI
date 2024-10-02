import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { CustomModalService } from 'src/app/shared/services/custom-modal.service';
import { TrainingRoutingService } from '../routing-service/training-routing.service';
import { NotifyService } from 'src/app/shared/services/notify-service/notify.service';
import { SharedmethodService } from 'src/app/shared/services/shared-method/sharedmethod.service';

@Component({
  selector: 'app-enroll-training',
  templateUrl: './enroll-training.component.html',
  styleUrls: ['./enroll-training.component.css']
})
export class EnrollTrainingComponent implements OnInit {

  @ViewChild('enrollSetupModal', { static: true }) enrollSetupModal!: ElementRef;
  @Output() closeModalEvent = new EventEmitter<string>();
  @Input() ExecutionFlag: string = '';
  @Input() enrollTraining: any;


  constructor(
    private modalService: CustomModalService,
    private fb: FormBuilder,
    private trainingRoutingService: TrainingRoutingService,
    private notifyService: NotifyService,
    private sharedMethodService: SharedmethodService
  ) { }

  ngOnInit(): void {
    this.modalTitle = this.getModalTitle(); 

    this.openEnrollModal();

    console.log('enrollTraining',this.enrollTraining);

    this.initializeForm();

  }


  
  openEnrollModal() {
    this.modalService.open(this.enrollSetupModal, "md");
    this.getModalTitle();
  }


  closeEnrollModal(reason: any) {
    this.modalService.service.dismissAll(reason);
    this.closeModalEvent.emit(reason);
  }



  modalTitle: string = '';
  getModalTitle(): string {

    if(this.ExecutionFlag === 'I'){
      return 'Enroll Training';
    }
    else if (this.ExecutionFlag === 'Approve') {
      return 'Approve Training';
    }
    else if(this.ExecutionFlag === 'Reject'){
      return 'Reject Training';
    }

    else{
      return ''
    }
  }


  trainingForm: FormGroup;

  initializeForm() {
    this.trainingForm = this.fb.group({
        trainingId: new FormControl(this.enrollTraining.trainingID),
        trainingRequestId: new FormControl(this.enrollTraining.trainingRequestId ? this.enrollTraining.trainingRequestId : null)
    });
  }





  
  enrollStatus: { Status: string, Msg: string };

  submit() {
    if (this.trainingForm.valid) {
     
      const formDataWithExecutionFlag = {
        ...this.trainingForm.value,
        executionFlag: this.ExecutionFlag
      };


      // Log the formDataWithExecutionFlag before sending it to the server
      console.log('Form data with execution flag:', formDataWithExecutionFlag);

      this.trainingRoutingService.save(formDataWithExecutionFlag).subscribe(
        (response: any) => {
          this.enrollStatus = response;

          if (this.enrollStatus && this.enrollStatus.Status) {
            this.notifyService.showSuccessToast(this.enrollStatus.Msg);
            this.sharedMethodService.callMethod();
            this.trainingForm.reset();
            this.closeEnrollModal('close');
          } else {
            this.notifyService.showErrorToast(this.enrollStatus.Msg);
          }

        },
        (error) => {
          this.notifyService.handleApiError(error);
        }
      );
    }

  }


}
