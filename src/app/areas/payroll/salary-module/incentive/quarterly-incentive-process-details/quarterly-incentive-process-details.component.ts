import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { CustomModalService } from 'src/app/shared/services/custom-modal.service';
import { QuarterlyIncentiveRoutingService } from '../routing/quarterly-incentive-routing.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { QuarterlyIncentiveProcessDetailsViewOrDeleteComponent } from '../quarterly-incentive-process-details-view-or-delete/quarterly-incentive-process-details-view-or-delete.component';

@Component({
  selector: 'app-quarterly-incentive-process-details',
  templateUrl: './quarterly-incentive-process-details.component.html',
  styleUrls: ['./quarterly-incentive-process-details.component.css']
})
export class QuarterlyIncentiveProcessDetailsComponent implements OnInit {


  @ViewChild('quarterlyIncentiveProcessDetailsModal', { static: true }) quarterlyIncentiveProcessDetailsModal!: ElementRef;

  @Output() closeModalEvent = new EventEmitter<string>();
  @Output() hide = new EventEmitter<void>();

  @Input() quarterlyProcessId: number = 0;

  constructor(
    private modalService: CustomModalService,
    private quarterlyIncentiveRoutingService: QuarterlyIncentiveRoutingService,
  ) { }

  ngOnInit(): void {
    this.openQuarterlyIncentiveProcessModal();

    console.log('quarterlyProcessId',this.quarterlyProcessId);

    this.quarterlyIncentiveProcessId = this.quarterlyProcessId;
    this.getQuarterlyIncentiveDetails();
    
  }


  openQuarterlyIncentiveProcessModal() {
    this.modalService.open(this.quarterlyIncentiveProcessDetailsModal, "xl")
  }


  closeQuarterlyIncentiveProcessModal(reason: any) {
    this.modalService.service.dismissAll(reason);
    this.closeModalEvent.emit(reason);
    
  }




  
  listOfQuarterlyIncentiveDetails: any[] = [];
  quarterlyIncentiveProcessId: number = null;

  employeeIdForSearch: number = null;
  

  getQuarterlyIncentiveDetails() {
    
    const params: any = {};

    if (this.quarterlyIncentiveProcessId && this.quarterlyIncentiveProcessId > 0) {
      params['quarterlyIncentiveProcessId'] = this.quarterlyIncentiveProcessId;
    }

    if (this.employeeIdForSearch && this.employeeIdForSearch > 0) {
      params['employeeIdForSearch'] = this.employeeIdForSearch;
    }

    this.quarterlyIncentiveRoutingService.getQuarterlyIncentiveDeails<any>(params)
      .toPromise()
      .then((response: any) => {
        if (Array.isArray(response)) {
          this.listOfQuarterlyIncentiveDetails = response;
          console.log('listOfQuarterlyIncentiveDetails', this.listOfQuarterlyIncentiveDetails);
        }
        return this.listOfQuarterlyIncentiveDetails;
      })
      .catch((error: any) => {
        console.error(error);
        throw error;
      });
  }


  



  quarterlyProcessDetailsId: number = 0;

  flag: string = '';



  showQuarterlyIncentiveProcessDetailsViewOrDeleteModal: boolean = false;
  customModalBodyClass = ''; 
  
  openQuarterlyIncentiveProcessDetailsViewModal(id) {
      console.log("Open modal clicked");
      this.quarterlyProcessDetailsId = id;

      this.flag = 'view';
      console.log('quarterlyProcessDetailsId', this.quarterlyProcessDetailsId);
  
      this.showQuarterlyIncentiveProcessDetailsViewOrDeleteModal = true;
  
      this.customModalBodyClass = 'custom-modal-styles';
  
  }
  

  openQuarterlyIncentiveProcessDetailsUpdateModal(id) {
    console.log("Open modal clicked");
    
    this.quarterlyProcessDetailsId = id;
    this.flag = 'update';

    console.log('quarterlyProcessDetailsId', this.quarterlyProcessDetailsId);

    this.showQuarterlyIncentiveProcessDetailsViewOrDeleteModal = true;

    this.customModalBodyClass = 'custom-modal-styles';

  }


  
  openQuarterlyIncentiveProcessDetailsDeleteModal(id) {
    console.log("Open modal clicked");
    this.quarterlyProcessDetailsId = id;
    this.flag = 'delete';
    console.log('quarterlyProcessDetailsId', this.quarterlyProcessDetailsId);

    this.showQuarterlyIncentiveProcessDetailsViewOrDeleteModal = true;

    this.customModalBodyClass = 'custom-modal-styles';

  }


  closeQuarterlyIncentiveProcessDetailsViewOrDeleteModal(reason: any) {

      this.showQuarterlyIncentiveProcessDetailsViewOrDeleteModal = false;
  
      this.customModalBodyClass = '';
      this.flag = '';
      this.quarterlyProcessDetailsId = null;
  
      this.openQuarterlyIncentiveProcessModal();
  }
  





  refresh(){
    this.getQuarterlyIncentiveDetails();
  }

  

}
