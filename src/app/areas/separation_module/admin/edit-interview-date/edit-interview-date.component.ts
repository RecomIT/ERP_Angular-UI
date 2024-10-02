import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { CustomModalService } from 'src/app/shared/services/custom-modal.service';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DatePickerConfigService } from 'src/app/shared/services/DatePicker/date-picker-config.service';
import { DatePipe, formatDate } from '@angular/common';
import { ResignationRequestRoutingService } from '../../routing-service/resignation-request/resignation-request-routing.service';
import { AdminRoutingService } from '../../routing-service/admin/admin-routing.service';
import { NotifyService } from 'src/app/shared/services/notify-service/notify.service';

@Component({
  selector: 'app-edit-interview-date',
  templateUrl: './edit-interview-date.component.html',
  styleUrls: ['./edit-interview-date.component.css']
})
export class EditInterviewDateComponent implements OnInit {

  @ViewChild('editInterviewModal', { static: true }) editInterviewModal!: ElementRef;
  @Output() closeModalEvent = new EventEmitter<string>();

  @Input() resignationRequestId: number;

  @Output() exitInterviewDateChanged: EventEmitter<{ date: Date, resignationRequestId: number }> = new EventEmitter<{ date: Date, resignationRequestId: number }>();
  
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


  showEditInterviewDateModal: boolean = false;

  ngOnInit(): void {
    this.initializeForm();

    this.openEditInterviewDateModal();
    
    this.getEmployeeResignationList();

    this.datePickerConfig = this.datePickerConfigService.getRangeConfig();
  }



  resignationForm: FormGroup;
  
  initializeForm(): void {
    this.resignationForm = this.fb.group({
      ResignationRequestId: new FormControl(0),

      RescheduleExitInterviewByHR: new FormControl(0),
      EmployeeExitInterviewDate: new FormControl(''),

      HRExitInterviewDate: new FormControl('', Validators.required)

    });
  }
  
  

  
  openEditInterviewDateModal() {
    this.modalService.open(this.editInterviewModal, "md");
    this.getEmployeeResignationList();

    this.showEditInterviewDateModal = true;

  }


  closeEditInterviewDateModal(reason: any) {
    this.resignationRequestId = 0;
    this.modalService.service.dismissAll(reason);
    this.closeModalEvent.emit(reason);

    this.showEditInterviewDateModal = false;
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
    const employeeExitInterviewDateString = this.resignationRequestList[0].employeeExitInterviewDate;
    const employeeExitInterviewDateObject = employeeExitInterviewDateString ? new Date(employeeExitInterviewDateString) : null;
    this.resignationForm.get('EmployeeExitInterviewDate').setValue(employeeExitInterviewDateObject);
  }



  clearHRExitInterviewDate(): void {
    this.resignationForm.get('HRExitInterviewDate').setValue(null);
  }


  ExecutionFlag : string;

  updateStatus: { Status: string, Msg: string } = { Status: '', Msg: '' };

  submit() {
      if (!this.resignationForm.invalid) {
          const formData = new FormData();

          this.ExecutionFlag = 'EEIDUpdate';
          formData.append('ResignationRequestId', this.resignationForm.get('ResignationRequestId').value);
          formData.append('HRExitInterviewDate', this.formatDate(this.resignationForm.get('HRExitInterviewDate').value));
          formData.append('ExecutionFlag', this.ExecutionFlag);

          this.resignationRequestRoutingService.save(formData).subscribe(
              (response: any) => {
                  this.updateStatus = response;

                  if (this.updateStatus && this.updateStatus.Status) {

                      this.notifyService.showSuccessToast(this.updateStatus.Msg);
                     

                      const exitInterviewDate = this.resignationForm.get('HRExitInterviewDate').value;
                      const resignationRequestId = this.resignationForm.get('ResignationRequestId').value;

                      this.exitInterviewDateChanged.emit({ date: exitInterviewDate, resignationRequestId });

                      this.closeEditInterviewDateModal('close');
                  } else {
                      this.notifyService.showErrorToast(this.updateStatus.Msg);
                      this.initializeForm();
                      this.closeEditInterviewDateModal('close');
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



  



  // --------------------------- Interview Date
  
  showHRExitInterviewDate: boolean = false;

  toggleHRExitInterviewDate(): void {
    this.showHRExitInterviewDate = !this.showHRExitInterviewDate;

    if (!this.showHRExitInterviewDate) {
        this.resignationForm.patchValue({
          HRExitInterviewDate: ''
        });
    } else {
        const employeeExitInterviewDate = this.resignationForm.get('EmployeeExitInterviewDate').value;
        this.resignationForm.patchValue({
          HRExitInterviewDate: employeeExitInterviewDate
        });
    }
  }



  stringToDate(date: any): string {
    // Check if the date is not null or undefined
    if (date) {
        return this.datePipe.transform(date, 'dd MMM, yyyy') || '';
    }
    return '';
  }



}
