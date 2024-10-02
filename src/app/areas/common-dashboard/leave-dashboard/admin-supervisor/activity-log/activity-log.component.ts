import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { CustomModalService } from 'src/app/shared/services/custom-modal.service';

@Component({
  selector: 'app-activity-log',
  templateUrl: './activity-log.component.html',
  styleUrls: ['./activity-log.component.css']
})
export class ActivityLogComponent implements OnInit {

  
  @ViewChild('activityLoggerModal', { static: true }) activityLoggerModal!: ElementRef;

  @Input() activityLogDetails: any; 
  @Output() closeModalEvent = new EventEmitter();

  constructor(
    private modalService: CustomModalService,
    
  ) { }

  ngOnInit(): void {
    this.openActivityLogModal();
  }


  
  
  openActivityLogModal() {
    this.modalService.open(this.activityLoggerModal, "sm");
  }


  closeActivityModal(reason: any) {
    this.modalService.service.dismissAll(reason);
    this.closeModalEvent.emit(reason);
  }

}
