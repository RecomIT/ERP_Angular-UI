import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { CustomModalService } from 'src/app/shared/services/custom-modal.service';
import { DatePickerConfigService } from 'src/app/shared/services/date-picker-config.service';
import { CommonDashboardRoutingService } from '../../common-dashboard-routing/common-dashboard-routing.service';
import { NotifyService } from 'src/app/shared/services/notify-service/notify.service';
import { SharedmethodService } from 'src/app/shared/services/shared-method/sharedmethod.service';

type UpdateChangeEvent = {
  resignationReason: string;
  secondaryReason: string; 
  resignationRequestId: number;
  resignationSubCategoryId: number;
  noticePeriod: number;
  createdShortfall: number;
};

@Component({
  selector: 'app-add-company-events',
  templateUrl: './add-company-events.component.html',
  styleUrls: ['./add-company-events.component.css']
})
export class AddCompanyEventsComponent implements OnInit {

  @ViewChild('addCompanyEvents', { static: true }) addCompanyEvents!: ElementRef;

  @Output() closeModalEvent = new EventEmitter();

  @Input() selectedEvent: any;

  modalTitle: string = 'Add New Event';
  
  @Output() updateChanged: EventEmitter<UpdateChangeEvent> = new EventEmitter<UpdateChangeEvent>();
  

  companyEventsForm: FormGroup;


  datePickerConfig: Partial<BsDatepickerConfig> = {};
  

  constructor(
    private formBuilder: FormBuilder,
    private modalService: CustomModalService,
    private datePickerConfigService : DatePickerConfigService,
    private apiEndpointsService: CommonDashboardRoutingService,
    private notifyService: NotifyService,
    private sharedMethodService: SharedmethodService
    ) { }

  initilizeForm(){
    this.companyEventsForm = this.formBuilder.group({
      eventTitle: ['', Validators.required],
      description: [''],
      eventDate: [new Date(),Validators.required],
      eventTime: ['',Validators.required]
    });
  }





  ngOnInit() {
    this.datePickerConfig = this.datePickerConfigService.getConfig();

    this.initilizeForm();

    if (this.selectedEvent != null && this.selectedEvent?.eventId > 0) {
      const formData = {
          id: this.selectedEvent['eventId'],
          tableName: this.selectedEvent['tableName'],
          eventTitle: this.selectedEvent['eventTitle'] || '',
          description: this.selectedEvent['description'] || '',
          eventDate: new Date(this.selectedEvent['date']),
          eventTime: this.selectedEvent['eventTime'] || ''
      };

      this.companyEventsForm.patchValue(formData);
      this.modalTitle = 'Update Event'
    }

    this.openAddCompanyEventModal();
}



  openAddCompanyEventModal() {
    this.modalService.open(this.addCompanyEvents, "md");
  }

  closeAddCompanyEventModal(reason: any) {
    this.modalService.service.dismissAll(reason);
    this.closeModalEvent.emit(reason);
  }

  clearEventDate() {
    this.companyEventsForm.get('eventDate').setValue(null);
  }



  onSubmit() {
    if (this.companyEventsForm.valid) {
      const formData = this.companyEventsForm.value;
      
      if (this.selectedEvent) {
        // Append id and tableName if they are not null
        formData.id = this.selectedEvent['eventId'];
      }

      // Check if id is not null or 0 to determine the action
      formData.action = formData.id && formData.id !== 0 ? 'Update' : 'Insert';
      //formData.eventDate = this.selectedEvent && this.selectedEvent['date'] ? new Date(this.selectedEvent['date']) : '';

  
      this.apiEndpointsService.save(formData).subscribe(
        (response: any[]) => {

          const responseData = response[0];
          if (responseData?.Status == 1) {
            this.notifyService.showToast(responseData?.Message, 'Success', 'success');
            this.companyEventsForm.reset();
            this.closeAddCompanyEventModal('Saved');

            this.sharedMethodService.callMethod();

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
