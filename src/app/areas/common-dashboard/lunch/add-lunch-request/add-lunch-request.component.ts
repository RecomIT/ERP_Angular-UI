import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { CustomModalService } from 'src/app/shared/services/custom-modal.service';
import { DatePickerConfigService } from 'src/app/shared/services/date-picker-config.service';
import { CommonDashboardRoutingService } from '../../common-dashboard-routing/common-dashboard-routing.service';
import { NotifyService } from 'src/app/shared/services/notify-service/notify.service';
import { SharedmethodService } from 'src/app/shared/services/shared-method/sharedmethod.service';
import { DatePipe } from '@angular/common';
import { LunchService } from '../lunch-request-service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { Observable } from 'rxjs';
import { debounceTime, first, map, switchMap } from 'rxjs/operators';
import { requestExist } from '../lunch-request.validator';



type UpdateChangeEvent = {
  resignationReason: string;
  secondaryReason: string;
  resignationRequestId: number;
  resignationSubCategoryId: number;
  noticePeriod: number;
  createdShortfall: number;
};



@Component({
  selector: 'app-add-lunch-request',
  templateUrl: './add-lunch-request.component.html',
  styleUrls: ['./add-lunch-request.component.css']
})
export class AddLunchRequestComponent implements OnInit {
  dateRange: Date[];

  @ViewChild('addLunchRequest', { static: true }) addLunchRequest!: ElementRef;

  @Output() closeModalEvent = new EventEmitter();

  @Input() selectedEvent: any;


  modalTitle: string = 'Lunch Request';

  @Output() updateChanged: EventEmitter<UpdateChangeEvent> = new EventEmitter<UpdateChangeEvent>();


  lunchRequestForm: FormGroup;


  datePickerConfig: any = this.datePickerConfigService.getConfig({ minDate: new Date() });


  constructor(
    private formBuilder: FormBuilder,
    private modalService: CustomModalService,
    private datePickerConfigService: DatePickerConfigService,
    private apiEndpointsService: CommonDashboardRoutingService,
    private notifyService: NotifyService,
    private sharedMethodService: SharedmethodService,
    private datepipe: DatePipe,
    private service: LunchService,
    private utilityService: UtilityService
  ) { }



  formErrors = {
    'lunchDate': ''
  }

  validationMessages = {
    'lunchDate': {
      'required': 'Field is required',
      'exist': 'Lunch already request with this date'
    }
  }

  logFormErrors(formGroup: FormGroup = this.lunchRequestForm): boolean {
    console.log("logFormErrors >>>")
    let isValid = true;
    Object.keys(formGroup.controls).forEach((key: string) => {
      const abstractControl = formGroup.get(key);
      console.log("key ........... >>>", key)
      this.formErrors[key] = '';
      if (abstractControl && !abstractControl.valid) {
        const messages = this.validationMessages[key];
        for (const errorKey in abstractControl.errors) {
          console.log(`key :${key}, errorKey: ${errorKey}`);
          this.formErrors[key] += messages[errorKey];
          isValid = false;
        }
      }
    })
    return isValid;
  }


  initilizeForm() {
    this.lunchRequestForm = this.formBuilder.group({
      lunchDate: [new Date(), [Validators.required]]
    });
    //,[requestExist(this.service)]
    this.lunchRequestForm.valueChanges.subscribe(value => {
      this.logFormErrors();
    })
  }

  ngOnInit() {

    this.initilizeForm();
    this.openLunchRequestModal();
  }



  openLunchRequestModal() {
    this.modalService.open(this.addLunchRequest, "md");
  }

  closeLunchRequestModal(reason: any) {
    if (this.btnSubmit == false) {
      this.modalService.service.dismissAll(reason);
      this.closeModalEvent.emit(reason);
    }
  }

  clearEventDate() {
    this.lunchRequestForm.get('eventDate').setValue(null);
  }




  btnSubmit: boolean = false;
  onSubmit() {
    if (this.lunchRequestForm.valid && this.btnSubmit == false) {
      const formData = this.lunchRequestForm.value;
      this.btnSubmit = true;

      if (this.selectedEvent) {
        // Append id and tableName if they are not null
        formData.id = this.selectedEvent['eventId'];
      }

      // Format the date field correctly
      let lunchDate = this.datepipe.transform(this.lunchRequestForm.get("lunchDate")?.value, 'yyyy-MM-dd');
      formData.lunchDate = lunchDate; // Add or overwrite the formatted date

      // Check if id is not null or 0 to determine the action
      formData.action = formData.id && formData.id !== 0 ? 'Update' : 'Insert';
      // formData.lunchDate = this.selectedEvent && this.selectedEvent['lunchDate'] ? new Date(this.selectedEvent['lunchDate']) : '';




      // console.log("this.lunchRequestForm.value",this.lunchRequestForm.value);


      this.service.addLunchRequest(formData).subscribe(
        (response: any) => {
          this.btnSubmit = false;
          if (response.status == 1) {
            this.notifyService.showToast(response.message, 'Success', 'success');
            this.closeLunchRequestModal('Saved');
            this.sharedMethodService.callMethod();

          } else {
            this.notifyService.showToast(response.message, 'Failed', 'error');
          }
          
        },
        error => {
          console.error('Error:', error);
          this.utilityService.fail(error.msg?.message);
          this.btnSubmit = false;
        }
      );
    } else {
    }
  }




}


