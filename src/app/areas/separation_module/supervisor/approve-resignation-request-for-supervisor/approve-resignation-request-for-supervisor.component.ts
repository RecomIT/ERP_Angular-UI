import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { CustomModalService } from 'src/app/shared/services/custom-modal.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ResignationRequestRoutingService } from '../../routing-service/resignation-request/resignation-request-routing.service';
import { NotifyService } from 'src/app/shared/services/notify-service/notify.service';

@Component({
  selector: 'app-approve-resignation-request-for-supervisor',
  templateUrl: './approve-resignation-request-for-supervisor.component.html',
  styleUrls: ['./approve-resignation-request-for-supervisor.component.css']
})
export class ApproveResignationRequestForSupervisorComponent implements OnInit {

  
  @ViewChild('approveResignationRequestModal', { static: true }) approveResignationRequestModal!: ElementRef;
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
    this.openApproveResignationRequestModal();
    this.initializeForm();
  }


  openApproveResignationRequestModal() {
    this.modalService.open(this.approveResignationRequestModal, "md");

  }


  closeApproveResignationRequestModal(reason: any) {
    this.resignationRequestId = null;
    this.modalService.service.dismissAll(reason);
    this.closeModalEvent.emit(reason);
  }



  approveForm: FormGroup;

  initializeForm() {
    this.approveForm = this.fb.group({
      ResignationRequestId: new FormControl(this.resignationRequestId),
      ApprovalRemarks: ['', [Validators.maxLength(200),Validators.required]]
    });
  }



  ExecutionFlag : string;

  approvedStatus: { Status: string, Msg: string };
  submitApprove() {
      if (this.approveForm.valid) {
          const formData = new FormData();

          this.ExecutionFlag = 'SupervisorApprove';
          formData.append('ResignationRequestId', this.approveForm.get('ResignationRequestId').value);

          formData.append('ApprovalRemarks', this.approveForm.get('ApprovalRemarks').value);
          formData.append('ExecutionFlag', this.ExecutionFlag);


          this.resignationRequestRoutingService.save(formData).subscribe(
              (response: any) => {

                  this.approvedStatus = response;

                  if (this.approvedStatus && this.approvedStatus.Status) {


                      this.notifyService.showSuccessToast(this.approvedStatus.Msg);

                      const approveText = 'Approved'
                      const resignationRequestId = this.approveForm.get('ResignationRequestId').value;
                     
                      this.statusChanged.emit({ status: approveText, resignationRequestId });

                      this.closeApproveResignationRequestModal('close');

                  } else {
                    this.notifyService.showErrorToast(this.approvedStatus.Msg);
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
