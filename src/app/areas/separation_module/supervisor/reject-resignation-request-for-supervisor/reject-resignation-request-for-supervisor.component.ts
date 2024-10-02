import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { CustomModalService } from 'src/app/shared/services/custom-modal.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/shared/services/user.service';
import { ResignationRequestRoutingService } from '../../routing-service/resignation-request/resignation-request-routing.service';
import { NotifyService } from 'src/app/shared/services/notify-service/notify.service';

@Component({
  selector: 'app-reject-resignation-request-for-supervisor',
  templateUrl: './reject-resignation-request-for-supervisor.component.html',
  styleUrls: ['./reject-resignation-request-for-supervisor.component.css']
})
export class RejectResignationRequestForSupervisorComponent implements OnInit {

  
  @ViewChild('rejectResignationRequestModal', { static: true }) rejectResignationRequestModal!: ElementRef;

  @Output() closeModalEvent = new EventEmitter<string>();
  @Input() resignationRequestId: number = 0;

  @Output() statusChanged: EventEmitter<{ status: string, resignationRequestId: number }> = new EventEmitter<{ status: string, resignationRequestId: number }>();

  constructor(
    private modalService: CustomModalService,
    private resignationRequestRoutingService: ResignationRequestRoutingService,
    private fb: FormBuilder,
    private notifyService: NotifyService
  ) { }


  ngOnInit(): void {
    this.openRejectResignationRequestModal();
    this.initializeForm();
  }


  openRejectResignationRequestModal() {
    this.modalService.open(this.rejectResignationRequestModal, "md");

  }



  closeRejectResignationRequestModal(reason: any) {
    this.resignationRequestId = 0;
    this.modalService.service.dismissAll(reason);
    this.closeModalEvent.emit(reason);
  }



  rejectForm: FormGroup;

  initializeForm() {
    this.rejectForm = this.fb.group({
      ResignationRequestId: new FormControl(this.resignationRequestId),
      RejectedRemarks: ['', [Validators.maxLength(200),Validators.required]]
    });
  }



  ExecutionFlag : string;

  rejectedStatus: { Status: string, Msg: string };

  submitReject() {
      if (this.rejectForm != null) {
          const formData = new FormData();

          this.ExecutionFlag = 'SupervisorReject';
          formData.append('ResignationRequestId', this.rejectForm.get('ResignationRequestId').value);

          formData.append('RejectedRemarks', this.rejectForm.get('RejectedRemarks').value);
          formData.append('ExecutionFlag', this.ExecutionFlag);


          this.resignationRequestRoutingService.save(formData).subscribe(
              (response: any) => {

                  this.rejectedStatus = response;
          
                  if (this.rejectedStatus && this.rejectedStatus.Status) {

                      this.notifyService.showSuccessToast(this.rejectedStatus.Msg);

                      const rejectText = 'Rejected'
                      const resignationRequestId = this.rejectForm.get('ResignationRequestId').value;
                      
                      this.statusChanged.emit({ status: rejectText, resignationRequestId });

                      this.closeRejectResignationRequestModal('close');

                  } else {
                      this.notifyService.showErrorToast(this.rejectedStatus.Msg);
                  }

              },
              (error) => {
                  this.notifyService.handleApiError(error);
              }
          );
      } else {
          this.notifyService.invalidFormError();
      }
  }


}
