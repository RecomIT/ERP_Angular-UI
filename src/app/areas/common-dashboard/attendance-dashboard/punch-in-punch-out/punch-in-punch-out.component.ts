import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { CustomModalService } from 'src/app/shared/services/custom-modal.service';
import { CommonDashboardRoutingService } from '../../common-dashboard-routing/common-dashboard-routing.service';
import { NotifyService } from 'src/app/shared/services/notify-service/notify.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedmethodService } from 'src/app/shared/services/shared-method/sharedmethod.service';
import { AttendanceCommonDashboardRoutingService } from '../../common-dashboard-routing/attendance-common-dashboard-routing/attendance-common-dashboard-routing.service';
import { Select2ConfigService } from 'src/app/shared/services/Select2/select2-config.service';

enum AttendanceType {
  HomeOffice = 'Home Office',
  FactoryVisit = 'Factory Visit',
  outDoorMeeting = 'Outdoor Meeting',
  marketVisit = 'Market Visit',
  other = 'Other'
}


@Component({
  selector: 'app-punch-in-punch-out',
  templateUrl: './punch-in-punch-out.component.html',
  styleUrls: ['./punch-in-punch-out.component.css']
})
export class PunchInPunchOutComponent implements OnInit {


  @ViewChild('punchInPuncOutModal', { static: true }) punchInPuncOutModal!: ElementRef;
  @Output() closeModalEvent = new EventEmitter();
  @Input() attendanceDetails: any;
  

  modalTitle: string;

  attendanceTypeOptions: string[];

  constructor(
    private modalService: CustomModalService,
    private apiEndpointsService: CommonDashboardRoutingService,
    private notifyService: NotifyService,
    private formBuilder: FormBuilder,
    private sharedMethod: SharedmethodService,
    private attendanceDashboardRoutingService: AttendanceCommonDashboardRoutingService,
    private select2ConfigService: Select2ConfigService,
    private cdr: ChangeDetectorRef
  ) { }


  ngOnInit(): void {

    this.getEmployees();
    
    this.modalTitle = this.attendanceDetails.action;
    this.openPunchInPunchOutModal();

    this.initilizeForm();
    this.subscribeToAttendanceTypeChanges();

    this.attendanceTypeOptions = Object.values(AttendanceType);

    this.employeeSelect2Options = this.select2ConfigService.getDefaultConfig();

    

  }

  
  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }
  
  openPunchInPunchOutModal() {
    this.modalService.open(this.punchInPuncOutModal, "md");
  }


  closePunchInPunchOutModal(reason: any) {
    this.modalService.service.dismissAll(reason);
    this.closeModalEvent.emit(reason);
  }



  attendanceForm: FormGroup;

  initilizeForm(){
    this.attendanceForm = this.formBuilder.group({
      attendanceDate: [this.getFormattedDate(this.attendanceDetails?.attendanceDate), Validators.required],
      attendanceTime: [this.getFormattedTime(this.attendanceDetails?.attendanceTime), Validators.required],
      attendanceLocation: [this.attendanceDetails?.attendanceLocation, Validators.required],
      attendanceRemarks: [null],
      actionName: [this.attendanceDetails.action, Validators.required],
      attendanceType: ['Home Office', Validators.required],
      employeeId: [null]
    });

    this.attendanceForm.get('employeeId')?.valueChanges.subscribe((selectedEmployeeId: any) => {
      if (selectedEmployeeId) {
        const selectedEmployee = this.employeeList.find(employee => employee.id.toString() === selectedEmployeeId.toString());
    
        if (selectedEmployee) {
          this.selectedEmployees.push(selectedEmployee); 

          this.selectedEmployeeId.push(selectedEmployee.id)
        } else {
        }

        this.attendanceForm.get('employeeId')?.setValue(null);
      }
    });

  }


  subscribeToAttendanceTypeChanges() {
    this.attendanceForm.get('attendanceType')?.valueChanges.subscribe((type: string) => {
      if (type !== 'desired_attendance_type') {
        this.showAddEmployeeSection = false;
        this.selectedEmployees = [];
      } else {
        this.showAddEmployeeSection = true;
      }
    });
  }


  removeEmployee(index: number): void {
    this.selectedEmployees.splice(index, 1);
    this.selectedEmployeeId.splice(index, 1);
  }



  
  getFormattedDate(date: Date): string {
    return date ? date.toISOString().split('T')[0] : null;
  }

  getFormattedTime(time: Date): string {
    return time ? time.toTimeString().split(' ')[0] : null;
  }
  


  
  responseMessage: { Message: string, Status: number };

  submit() {

    const selectedEmployeeIdString = this.selectedEmployeeId.join(',');

    const formValue = { ...this.attendanceForm.value, selectedEmployeeId: selectedEmployeeIdString };

    this.apiEndpointsService.getMyRecentAttendanceApi<any[]>(formValue).subscribe({
      next: (response: any[]) => {
      
        if (response && response.length > 0) {
    
          const responseData = response[0];

          this.responseMessage = responseData;

          this.notifyService.showSuccessToast(this.responseMessage.Message);
          
        }

        this.sharedMethod.callMethod();
    
        this.modalService.service.dismissAll(); 
      },
      error: (err) => {
        console.error(err);
        this.notifyService.handleApiError(err);
      }
    });
  }
  



  // ------------------------------- Employee
  
  employeeSelect2Options: any = [];
  employeeList: any[] = [];
  selectedEmployees: any[] = [];
  selectedEmployeeId: any[] = [];

  getEmployees() {

    this.attendanceDashboardRoutingService.getEmployeesAsync<any>(null).subscribe({
      next: (response) => {
        if (Array.isArray(response)) {
          this.employeeList = response;
        }
      },
      error: (error: any) => {
        console.error(error);

      }
    });
  }



  isSpecialTypeSelected(): boolean {
    const selectedType = this.attendanceForm.get('attendanceType')?.value;
    const isDirty = this.attendanceForm.get('attendanceType')?.dirty;

    const isSpecialType = selectedType === AttendanceType.FactoryVisit ||
                          selectedType === AttendanceType.outDoorMeeting ||
                          selectedType === AttendanceType.marketVisit;
    
    if (isSpecialType && isDirty) {
      this.attendanceForm.get('employeeId')?.setValue(null);
    }

    return isSpecialType && isDirty;
  }
  

  showAddEmployeeSection: boolean = false;

  handleCheckboxChange(event: any) {
    const checked = event.target.checked;
    this.showAddEmployeeSection = checked;
  }


  

}
