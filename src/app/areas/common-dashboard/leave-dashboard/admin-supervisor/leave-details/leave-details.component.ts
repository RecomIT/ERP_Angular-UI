import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { CustomModalService } from 'src/app/shared/services/custom-modal.service';

@Component({
  selector: 'app-leave-details',
  templateUrl: './leave-details.component.html',
  styleUrls: ['./leave-details.component.css']
})
export class LeaveDetailsComponent implements OnInit {

  
  @ViewChild('approvalDetails', { static: true }) approvalDetails!: ElementRef;

  @Input() employeeDetails: any; 
  @Output() closeModalEvent = new EventEmitter();

  constructor(
    private modalService: CustomModalService,
    
  ) { }

  ngOnInit(): void {
    this.openApprovalModal();
  }


  
  
  openApprovalModal() {
    this.modalService.open(this.approvalDetails, "lg");
  }


  closeApprovalModal(reason: any) {
    this.modalService.service.dismissAll(reason);
    this.closeModalEvent.emit(reason);
  }


}
