import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NotifyService } from 'src/app/shared/services/notify-service/notify.service';
import { EmployeeInfoService } from '../../service/employee-info/employee-info.service';
import { ServiceLengthService } from '../../service/service-length/service-length.service';
import { CustomModalService } from 'src/app/shared/services/custom-modal.service';
import { UserRoutingService } from '../../routing-service/user/user-routing.service';

@Component({
  selector: 'app-employee-info-modal',
  templateUrl: './employee-info-modal.component.html',
  styleUrls: ['./employee-info-modal.component.css']
})
export class EmployeeInfoModalComponent implements OnInit {

  @ViewChild('employeeInfoModal', { static: true }) employeeInfoModal!: ElementRef;
  @Output() closeModalEvent = new EventEmitter<string>();
  @Input() employeeId: number;

  isModalOpen: boolean = false;

  constructor(
    private notifyService: NotifyService,
    private serviceLengthService: ServiceLengthService,
    private modalService: CustomModalService,
    private userRoutingService: UserRoutingService
  ) { }

  ngOnInit(): void {
    this.openEmployeeInfoModal();
    this.getEmployeeDetails();
  }

  photoPath : string="";

  employeeDetails: any;

  getEmployeeDetails() {
    
    const params: any = {};

    if (this.employeeId && this.employeeId > 0) {
      params['employeeId'] = this.employeeId;
    }


    this.userRoutingService.getEmployeesDetailsAsync(params).subscribe({
      next: (response: any) => {
        if (response) {
          this.employeeDetails = response;

          this.photoPath = this.employeeDetails.photoPath + '/' + this.employeeDetails.photo;
          this.calculateServiceLength(this.employeeDetails.dateOfJoining);
        }
      },
      error: (err) => {
        console.error(err);
        this.notifyService.handleApiError(err);
      }
    });
  }
  

  setDefaultPhoto() {
    const defaultPath = 'assets/img/user.png'; 
    this.photoPath = defaultPath;
  }

  serviceLength : string = null;

  calculateServiceLength(dateOfJoining: Date): void {
    this.serviceLength = this.serviceLengthService.calculateServiceLength(dateOfJoining);
  }



  // --------------- Modal
  // --- Starting ....

  openEmployeeInfoModal() {
    this.modalService.open(this.employeeInfoModal, "lg");
    this.isModalOpen = true;
  }

  closeEmployeeInfoModal(reason: any) {
    this.employeeId = null;
    this.modalService.service.dismissAll(reason);
    this.closeModalEvent.emit(reason);
    this.isModalOpen = false;
  }
 

}
