import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { CustomModalService } from 'src/app/shared/services/custom-modal.service';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { DatePickerConfigService } from 'src/app/shared/services/DatePicker/date-picker-config.service';
import { formatDate } from '@angular/common';
import { ResignationRequestRoutingService } from '../../routing-service/resignation-request/resignation-request-routing.service';

@Component({
  selector: 'app-edit-interview-date-by-supervisor',
  templateUrl: './edit-interview-date-by-supervisor.component.html',
  styleUrls: ['./edit-interview-date-by-supervisor.component.css']
})
export class EditInterviewDateBySupervisorComponent implements OnInit {

  
  @ViewChild('editInterviewModal', { static: true }) editInterviewModal!: ElementRef;
  @Output() closeModalEvent = new EventEmitter<string>();

  @Input() selectedResignation: any;


  @Output() exitInterviewDateChanged: EventEmitter<{ date: Date, resignationRequestId: number }> = new EventEmitter<{ date: Date, resignationRequestId: number }>();
  
  datePickerConfig: Partial<BsDatepickerConfig> = {};

  constructor(
    private modalService: CustomModalService,
    private resignationRequestRoutingService: ResignationRequestRoutingService,
    private fb: FormBuilder,
    private utilityService: UtilityService,
    private datePickerConfigService : DatePickerConfigService,
  ) { }


  showEditInterviewDateModal: boolean = false;

  ngOnInit(): void {
    this.initializeForm();

    this.openEditInterviewDateBySupervisorModal();
    this.datePickerConfig = this.datePickerConfigService.getRangeConfig();
  }



  resignationForm: FormGroup;
  
  initializeForm(): void {
    this.resignationForm = this.fb.group({
      ResignationRequestId: new FormControl(null,Validators.required),
      RescheduleExitInterviewBySupervisor: new FormControl(0),
      EmployeeExitInterviewDate: new FormControl(''),
      SupervisorExitInterviewDate: new FormControl('',Validators.required)

    });
  }
  

  setFormValues(): void {
    if (this.selectedResignation) {
        this.resignationForm.patchValue({
            ResignationRequestId: this.selectedResignation.resignationRequestId,
            RescheduleExitInterviewBySupervisor: this.selectedResignation.rescheduleExitInterviewBySupervisor ? 1 : 0,
            EmployeeExitInterviewDate: this.selectedResignation.employeeExitInterviewDate ? new Date(this.selectedResignation.employeeExitInterviewDate) : null,
            SupervisorExitInterviewDate: this.selectedResignation.supervisorExitInterviewDate ? new Date(this.selectedResignation.supervisorExitInterviewDate) : null
        });
    }
  }
  


  
  openEditInterviewDateBySupervisorModal() {
    this.modalService.open(this.editInterviewModal, "md");

    this.showEditInterviewDateModal = true;

    this.setFormValues();

  }


  closeEditInterviewDateBySupervisorModal(reason: any) {
    this.modalService.service.dismissAll(reason);
    this.closeModalEvent.emit(reason);

    this.showEditInterviewDateModal = false;

    this.initializeForm();
  }



  clearSupervisorExitInterviewDate(): void {
    this.resignationForm.get('SupervisorExitInterviewDate').setValue(null);
  }


  ExecutionFlag : string;



  insertStatus: any = {};

  submitInterviewDate() {
      if (!this.resignationForm.invalid) {
          const formData = new FormData();

          this.ExecutionFlag = 'EEIDUpdateBySupervisor';
          formData.append('ResignationRequestId', this.resignationForm.get('ResignationRequestId').value);
          formData.append('SupervisorExitInterviewDate', this.formatDate(this.resignationForm.get('SupervisorExitInterviewDate').value));
          formData.append('ExecutionFlag', this.ExecutionFlag);

          this.resignationRequestRoutingService.save(formData).subscribe(
              (response: any) => {
                  this.insertStatus = response;

                  if (this.insertStatus && this.insertStatus.Status) {

                      this.utilityService.toastr.success(this.insertStatus.Msg, 'Server Response');

                      const exitInterviewDate = this.resignationForm.get('SupervisorExitInterviewDate').value;
                      const resignationRequestId = this.resignationForm.get('ResignationRequestId').value;

                      this.exitInterviewDateChanged.emit({ date: exitInterviewDate, resignationRequestId });

                      this.closeEditInterviewDateBySupervisorModal('close');

                  } else {
                      this.utilityService.toastr.error(this.insertStatus?.Msg, 'Server Response');
                      this.initializeForm();
                      this.closeEditInterviewDateBySupervisorModal('close');
                  }

              },
              (error) => {
                  this.utilityService.toastr.error(error, 'Server Response');
              }
          );
      } else {
          this.utilityService.fail('Invalid Form Submission', 'Site Response');
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
  
  showSupervisorExitInterviewDate: boolean = false;

  toggleSupervisorExitInterviewDate(): void {
    this.showSupervisorExitInterviewDate = !this.showSupervisorExitInterviewDate;

    if (!this.showSupervisorExitInterviewDate) {
      const employeeExitInterviewDate = this.resignationForm.get('EmployeeExitInterviewDate').value;
        this.resignationForm.patchValue({
          SupervisorExitInterviewDate: employeeExitInterviewDate
        });
        this.resignationForm.patchValue({
          SupervisorExitInterviewDate: employeeExitInterviewDate
        });
    } else {
        const employeeExitInterviewDate = this.resignationForm.get('EmployeeExitInterviewDate').value;
        this.resignationForm.patchValue({
          SupervisorExitInterviewDate: employeeExitInterviewDate
        });
    }
  }


}
