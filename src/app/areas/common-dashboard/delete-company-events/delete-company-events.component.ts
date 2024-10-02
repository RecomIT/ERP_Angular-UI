import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { CustomModalService } from 'src/app/shared/services/custom-modal.service';
import { SharedmethodService } from 'src/app/shared/services/shared-method/sharedmethod.service';
import { CommonDashboardRoutingService } from '../common-dashboard-routing/common-dashboard-routing.service';
import { NotifyService } from 'src/app/shared/services/notify-service/notify.service';

@Component({
  selector: 'app-delete-company-events',
  templateUrl: './delete-company-events.component.html',
  styleUrls: ['./delete-company-events.component.css']
})
export class DeleteCompanyEventsComponent implements OnInit {

 
  @ViewChild('deleteCompanyEventsModal', { static: true }) deleteCompanyEventsModal!: ElementRef;

  @Input() eventId: number; 

  @Output() closeModalEvent = new EventEmitter();

  constructor(
    private modalService: CustomModalService,
    private apiEndpointsService: CommonDashboardRoutingService,
    private notifyService: NotifyService,
    private sharedmethodService: SharedmethodService
    
  ) { }

  ngOnInit(): void {

    this.openModal();
  }


  openModal() {
    this.modalService.open(this.deleteCompanyEventsModal, "md");
  }


  closeModal(reason: any) {
    this.modalService.service.dismissAll(reason);
    this.closeModalEvent.emit(reason);
  }





  
  onDelete() {
    if (this.eventId > 0) {
      const formData = {
        Id: this.eventId,
        action: 'Delete'
      };
  
      this.apiEndpointsService.save(formData).subscribe(
        (response: any[]) => {
   
          const responseData = response[0];
          if (responseData?.Status == 1) {
            this.notifyService.showToast(responseData?.Message, 'Success', 'success');
            this.closeModal('Saved');
            this.sharedmethodService.callMethod();
          } else {
            this.notifyService.showToast(responseData?.Message, 'Failed', 'error');
          }
        },
        error => {
          console.error('Error:', error);
          this.notifyService.handleApiError(error);
        }
      );
    } else {

    }
  }
  
  
 



}
