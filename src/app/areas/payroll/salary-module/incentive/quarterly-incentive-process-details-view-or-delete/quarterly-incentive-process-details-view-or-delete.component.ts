import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { CustomModalService } from 'src/app/shared/services/custom-modal.service';
import { QuarterlyIncentiveRoutingService } from '../routing/quarterly-incentive-routing.service';
import { isDelegatedFactoryMetadata } from '@angular/compiler/src/render3/r3_factory';

@Component({
  selector: 'app-quarterly-incentive-process-details-view-or-delete',
  templateUrl: './quarterly-incentive-process-details-view-or-delete.component.html',
  styleUrls: ['./quarterly-incentive-process-details-view-or-delete.component.css']
})
export class QuarterlyIncentiveProcessDetailsViewOrDeleteComponent implements OnInit {

  @ViewChild('quarterlyIncentiveProcessDetailsViewOrDeleteModal', { static: true }) quarterlyIncentiveProcessDetailsViewOrDeleteModal!: ElementRef;

  @Output() closeModalEvent = new EventEmitter<string>();
  @Output() mainModalHide = new EventEmitter<void>();
  @Output() refresh = new EventEmitter<void>();

  @Input() quarterlyProcessDetailsId: number = 0;
  @Input() flag: string;


  action: string;


  constructor(
    private modalService: CustomModalService,
    private quarterlyIncentiveRoutingService: QuarterlyIncentiveRoutingService,
  ) { }

  ngOnInit(): void {
    this.openQuarterlyIncentiveProcessDetailsViewOrDeleteModal();

    this.quarterlyIncentiveProcessDetailId = this.quarterlyProcessDetailsId;
    this.getQuarterlyIncentiveDetails();

    console.log('flag',this.flag);

    if(this.flag === 'view'){
      this.action = 'view'
    }
    else if(this.flag === 'update'){
      this.action = 'update'
    }
    else if(this.flag === 'delete'){
      this.action = 'delete'
    }



  }




  
  openQuarterlyIncentiveProcessDetailsViewOrDeleteModal() {
    this.modalService.open(this.quarterlyIncentiveProcessDetailsViewOrDeleteModal, "lg")
  }



  closeQuarterlyIncentiveProcessDetailsViewOrDeleteModal(reason: any) {
    this.quarterlyProcessDetailsId = 0;
    this.modalService.service.dismissAll(reason);
    this.closeModalEvent.emit(reason);
  }




  
  listOfQuarterlyIncentiveDetails: any[] = [];

  quarterlyIncentiveProcessId: number = null;
  quarterlyIncentiveProcessDetailId: number = null;


  employeeIdForSearch: number = null;

  getQuarterlyIncentiveDetails() {
    
    const params: any = {};

    if (this.quarterlyIncentiveProcessId && this.quarterlyIncentiveProcessId > 0) {
      params['quarterlyIncentiveProcessId'] = this.quarterlyIncentiveProcessId;
    }

    if (this.quarterlyIncentiveProcessDetailId && this.quarterlyIncentiveProcessDetailId > 0) {
      params['quarterlyIncentiveProcessDetailId'] = this.quarterlyIncentiveProcessDetailId;
    }

    if (this.employeeIdForSearch && this.employeeIdForSearch > 0) {
      params['employeeIdForSearch'] = this.employeeIdForSearch;
    }

    if (this.action && this.action !== null) {
      params['action'] = this.action;
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





  resultOfQuarterlyIncentiveDetailsDelete: any[] = [];
  deleteQuarterlyIncentiveDetails() {
    
    const params: any = {};

    if (this.quarterlyIncentiveProcessDetailId && this.quarterlyIncentiveProcessDetailId > 0) {
      params['quarterlyIncentiveProcessDetailId'] = this.quarterlyIncentiveProcessDetailId;
    }

    if (this.flag && this.flag !== null) {
      params['action'] = this.flag;
    }

    this.quarterlyIncentiveRoutingService.getQuarterlyIncentiveDeails<any>(params)
      .toPromise()
      .then((response: any) => {
        if (Array.isArray(response)) {
          this.resultOfQuarterlyIncentiveDetailsDelete = response;
          console.log('resultOfQuarterlyIncentiveDetailsDelete', this.resultOfQuarterlyIncentiveDetailsDelete);
        }

        this.closeQuarterlyIncentiveProcessDetailsViewOrDeleteModal('delete');
        this.afterDelete();
        
        return this.resultOfQuarterlyIncentiveDetailsDelete;
      })
      .catch((error: any) => {
        console.error(error);
        throw error;
      });
  }



  afterDelete() {
    this.refresh.emit();
  }



  resultOfQuarterlyIncentiveDetailsUpdate: any[] = [];
   // Function to update values
   updateQuarterlyIncentiveDetail(item: any) {
    // Log the updated values
    console.log('Updated Values:', item);

    this.quarterlyIncentiveRoutingService.updateQuarterlyIncentiveDetail<any>(item)
    .toPromise()
    .then((response: any) => {
      if (Array.isArray(response)) {
        this.resultOfQuarterlyIncentiveDetailsUpdate = response;
        console.log('resultOfQuarterlyIncentiveDetailsUpdate', this.resultOfQuarterlyIncentiveDetailsUpdate);
      }

      this.closeQuarterlyIncentiveProcessDetailsViewOrDeleteModal('delete');
      this.afterDelete();
      
      return this.resultOfQuarterlyIncentiveDetailsUpdate;
    })
    .catch((error: any) => {
      console.error(error);
      throw error;
    });
  }
  
}
