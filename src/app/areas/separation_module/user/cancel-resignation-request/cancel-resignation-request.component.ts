import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { CustomModalService } from 'src/app/shared/services/custom-modal.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ResignationRequestRoutingService } from '../../routing-service/resignation-request/resignation-request-routing.service';
import { NotifyService } from 'src/app/shared/services/notify-service/notify.service';

@Component({
  selector: 'app-cancel-resignation-request',
  templateUrl: './cancel-resignation-request.component.html',
  styleUrls: ['./cancel-resignation-request.component.css']
})
export class CancelResignationRequestComponent implements OnInit {

  @ViewChild('cancelResignationRequestModal', { static: true }) cancelResignationRequestModal!: ElementRef;

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
    this.openCancelResignationRequestModal();
    this.initializeForm();
  }


  openCancelResignationRequestModal() {
    this.modalService.open(this.cancelResignationRequestModal, "md");
  }



  closeCancelResignationRequestModal(reason: any) {
    this.resignationRequestId = 0;
    this.modalService.service.dismissAll(reason);
    this.closeModalEvent.emit(reason);
  }



  cancelForm: FormGroup;

  initializeForm() {
    this.cancelForm = this.fb.group({
      ResignationRequestId: new FormControl(this.resignationRequestId),
      CancelRemarks: ['', [Validators.maxLength(200),Validators.required]]
    });
  }


  reset(){
    this.initializeForm();
  }


  ExecutionFlag : string;

  canceltStatus: { Status: string, Msg: string };


  submitCancel() {
    if (this.cancelForm != null) {
      const formData = new FormData();
      
      this.ExecutionFlag = 'D'
      formData.append('ResignationRequestId', this.cancelForm.get('ResignationRequestId').value);
     
      formData.append('CancelRemarks', this.cancelForm.get('CancelRemarks').value);
      formData.append('ExecutionFlag',  this.ExecutionFlag);
      
  
      this.resignationRequestRoutingService.cancel(formData).subscribe(
        (response:any) => {

          this.canceltStatus = response;

          if (this.canceltStatus && this.canceltStatus.Status) {
          
            this.notifyService.showSuccessToast(this.canceltStatus.Msg);


            const cancelText = 'Cancel'
            const resignationRequestId = this.cancelForm.get('ResignationRequestId').value;
            this.statusChanged.emit({ status: cancelText, resignationRequestId });

            this.closeCancelResignationRequestModal('close');

          } else {
   
            this.notifyService.showErrorToast(this.canceltStatus.Msg);
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
