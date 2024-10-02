import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { CustomModalService } from 'src/app/shared/services/custom-modal.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { DatePipe, formatDate } from '@angular/common';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { DatePickerConfigService } from 'src/app/shared/services/DatePicker/date-picker-config.service';
import { ResignationRequestRoutingService } from '../../routing-service/resignation-request/resignation-request-routing.service';
import { AdminRoutingService } from '../../routing-service/admin/admin-routing.service';
import { NotifyService } from 'src/app/shared/services/notify-service/notify.service';

@Component({
  selector: 'app-edit-last-working-date',
  templateUrl: './edit-last-working-date.component.html',
  styleUrls: ['./edit-last-working-date.component.css']
})
export class EditLastWorkingDateComponent implements OnInit {

  @ViewChild('editLastWorkingDateModal', { static: true }) editLastWorkingDateModal!: ElementRef;
  @Output() closeModalEvent = new EventEmitter<string>();

  @Input() resignationRequestId: number;

  @Output() acceptedLastWorkingDateChanged: EventEmitter<{ date: Date, resignationRequestId: number }> = new EventEmitter<{ date: Date, resignationRequestId: number }>();
  
  datePickerConfig: Partial<BsDatepickerConfig> = {};

  constructor(
    private modalService: CustomModalService,
    private resignationRequestRoutingService: ResignationRequestRoutingService,
    private fb: FormBuilder,
    private datePickerConfigService : DatePickerConfigService,
    private adminRoutingService: AdminRoutingService,
    private notifyService: NotifyService,
    private datePipe: DatePipe
  ) { }


  showEditLastWorkingDateModal: boolean = false;


  ngOnInit(): void {
    this.initializeForm();
    this.openEditLastWorkingDateModal();
    this.datePickerConfig = this.datePickerConfigService.getRangeConfig();
  }



  resignationForm: FormGroup;
  
  initializeForm(): void {
    this.resignationForm = this.fb.group({

      ResignationRequestId: new FormControl(0),
      NoticePeriod: new FormControl(null),
      NoticeDate: new FormControl(),
      RequestLastWorkingDate: new FormControl(''),

      IsAcceptedLastWorkingDate: new FormControl(0),
      AcceptedLastWorkingDate: new FormControl('', Validators.required)

    });
  }
  
  
  openEditLastWorkingDateModal() {
    this.modalService.open(this.editLastWorkingDateModal, "md");
    this.getEmployeeResignationList();

    this.showEditLastWorkingDateModal = true;

  }


  closeEditLastWorkingDateModal(reason: any) {
    this.resignationRequestId = 0;
    this.modalService.service.dismissAll(reason);
    this.closeModalEvent.emit(reason);

    this.showEditLastWorkingDateModal = false;
  }



  
  
  resignationRequestList: any[]=[];

  getEmployeeResignationList() {

    const params: any = {};
    if (this.resignationRequestId && this.resignationRequestId > 0) {
      params['resignationRequestId'] = this.resignationRequestId;
    }

    this.adminRoutingService.getApprovedResignationRequestsBySupervisorApi<any[]>(params).subscribe({
      next: (response: any) => {
        this.resignationRequestList = response.body;
        if (this.resignationRequestList.length > 0) {
         this.setFormValues();
        }

      },
      error: (err) => {
        console.error(err);
        this.notifyService.handleApiError(err);
      }
    });
  }


  setFormValues() {
    this.resignationForm.get('ResignationRequestId').setValue(this.resignationRequestList[0].resignationRequestId);
   
    this.resignationForm.get('NoticePeriod').setValue(this.resignationRequestList[0].noticePeriod);
   
    const noticeDateString = this.resignationRequestList[0].noticeDate;
    const noticeDateObject = noticeDateString ? new Date(noticeDateString) : null;
    this.resignationForm.get('NoticeDate').setValue(noticeDateObject);

    const lastWorkingDateString = this.resignationRequestList[0].requestLastWorkingDate;
    const lastWorkingDateObject = lastWorkingDateString ? new Date(lastWorkingDateString) : null;
    this.resignationForm.get('RequestLastWorkingDate').setValue(lastWorkingDateObject);
  }

  

  calculateShortfallByApprovedLWD(): { differenceInDays: number, shortfall: number } {

    const noticeDate = new Date(this.resignationForm.get('NoticeDate').value);
    const lastWorkingDate = new Date(this.resignationForm.get('AcceptedLastWorkingDate').value);
    const noticePeriod = this.resignationForm.get('NoticePeriod').value; 
  
    const differenceInMillis = lastWorkingDate.getTime() - noticeDate.getTime();
  

    const differenceInDays = Math.floor(differenceInMillis / (1000 * 60 * 60 * 24));
  
    const shortfall = differenceInDays > 0 ? noticePeriod - differenceInDays : 0;

    this.resignationForm.patchValue({
      ActualShortfall: shortfall,
          });
  
    return { differenceInDays, shortfall };
  }


  clearAcceptedLastWorkingDate(): void {
    this.resignationForm.get('AcceptedLastWorkingDate').setValue(null);
  }


  ExecutionFlag: string;

  insertStatus: any = {};

  submit() {
      if (!this.resignationForm.invalid) {
          const formData = new FormData();

          this.ExecutionFlag = 'ELWDUpdate';
          formData.append('ResignationRequestId', this.resignationForm.get('ResignationRequestId').value);
          formData.append('AcceptedLastWorkingDate', this.formatDate(this.resignationForm.get('AcceptedLastWorkingDate').value));
          formData.append('ExecutionFlag', this.ExecutionFlag);

          this.resignationRequestRoutingService.save(formData).subscribe(
              (response: any) => {
                  this.insertStatus = response;

                  if (this.insertStatus && this.insertStatus.Status) {

                      this.notifyService.showSuccessToast(this.insertStatus.Msg);

                      const acceptedLastWorkingDate = this.resignationForm.get('AcceptedLastWorkingDate').value;
                      const resignationRequestId = this.resignationForm.get('ResignationRequestId').value;

                      this.acceptedLastWorkingDateChanged.emit({ date: acceptedLastWorkingDate, resignationRequestId });

                      this.closeEditLastWorkingDateModal('close');

                  } else {
                      this.notifyService.showErrorToast(this.insertStatus.Msg);
                      this.initializeForm();
                      this.closeEditLastWorkingDateModal('close');
                  }

              },
              (error) => {
                  this.notifyService.handleApiError(error);
              }
          );
      } else {
          this.notifyService.invalidFormError;
      }
  }


  
  formatDate(date: any): string {

    if (date) {
      const formattedDate = formatDate(date, 'yyyy-MM-ddTHH:mm:ss', 'en-US');
      return formattedDate;
    }
  
    return '';
  }


  stringToDate(date: any): string {
    // Check if the date is not null or undefined
    if (date) {
        return this.datePipe.transform(date, 'dd MMM, yyyy') || '';
    }
    return '';
  }




  
  showAcceptedLastWorkingDate: boolean = false;

  toggleAcceptLastWorkingDate(): void {
    this.showAcceptedLastWorkingDate = !this.showAcceptedLastWorkingDate;

    if (!this.showAcceptedLastWorkingDate) {
        this.resignationForm.patchValue({
            AcceptedLastWorkingDate: ''
        });
    } else {
        const requestLastWorkingDate = this.resignationForm.get('RequestLastWorkingDate').value;
        this.resignationForm.patchValue({
            AcceptedLastWorkingDate: requestLastWorkingDate
        });
    }
  }


}
