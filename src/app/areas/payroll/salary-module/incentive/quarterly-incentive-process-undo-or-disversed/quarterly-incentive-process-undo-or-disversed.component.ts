import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { CustomModalService } from 'src/app/shared/services/custom-modal.service';
import { QuarterlyIncentiveRoutingService } from '../routing/quarterly-incentive-routing.service';

@Component({
  selector: 'app-quarterly-incentive-process-undo-or-disversed',
  templateUrl: './quarterly-incentive-process-undo-or-disversed.component.html',
  styleUrls: ['./quarterly-incentive-process-undo-or-disversed.component.css']
})
export class QuarterlyIncentiveProcessUndoOrDisversedComponent implements OnInit {


  @ViewChild('quarterlyIncentiveProcessUndoOrDisbursed', { static: true }) quarterlyIncentiveProcessUndoOrDisbursed!: ElementRef;

  @Output() closeModalEvent = new EventEmitter<string>();
  @Input() quarterlyProcessId: number = 0;
  @Input() undoFlag: string;
  @Input() disbursedFlag: string;

  @Output() refresh = new EventEmitter<void>();


  
  constructor(
    private modalService: CustomModalService,
    private quarterlyIncentiveRoutingService: QuarterlyIncentiveRoutingService,
  ) { }

  ngOnInit(): void {
    console.log('quarterlyProcessId',this.quarterlyProcessId);
    console.log('undoFlag',this.undoFlag);
    console.log('disbursedFlag',this.disbursedFlag);

    this.openQuarterlyIncentiveProcessModal();

    this.batchNo = this.quarterlyProcessId;
    this.quarterlyIncentiveProcessId = this.quarterlyProcessId;

    this.getQuarterlyIncentive();

    if(this.undoFlag === 'undo'){
      this.IsDisbursedOrUndo = 'undo';
    }
    else if(this.disbursedFlag === 'disbursed'){
      this.IsDisbursedOrUndo = 'disbursed';
    }
    else
    this.IsDisbursedOrUndo = '';

  }



  openQuarterlyIncentiveProcessModal() {
    this.modalService.open(this.quarterlyIncentiveProcessUndoOrDisbursed, "md")
  }


  closeQuarterlyIncentiveProcessModal(reason: any) {
    this.modalService.service.dismissAll(reason);
    this.closeModalEvent.emit(reason);
  }




  
  
  listOfQuarterlyIncentive: any[] = [];
  batchNo: number = null;

  getQuarterlyIncentive() {
    
    const params: any = {};
    if (this.batchNo && this.batchNo > 0) {
      params['batchNo'] = this.batchNo;
    }

    this.quarterlyIncentiveRoutingService.getQuarterlyIncentive<any>(params)
      .toPromise()
      .then((response: any) => {
        if (Array.isArray(response)) {
          this.listOfQuarterlyIncentive = response;
          console.log('listOfQuarterlyIncentive', this.listOfQuarterlyIncentive);
        }
        return this.listOfQuarterlyIncentive;
      })
      .catch((error: any) => {
        console.error(error);
        throw error;
      });
  }



  
  deleteQuarterlyIncentiveProcessResult: any[] = [];


  deleteQuarterlyIncentiveProcess() {
    
    const params: any = {};
    if (this.quarterlyIncentiveProcessId && this.quarterlyIncentiveProcessId > 0) {
      params['quarterlyIncentiveProcessId'] = this.quarterlyIncentiveProcessId;
    }

    this.quarterlyIncentiveRoutingService.deleteQuarterlyIncentiveProcess<any>(params)
      .toPromise()
      .then((response: any) => {
        if (Array.isArray(response)) {
          this.deleteQuarterlyIncentiveProcessResult = response;
          console.log('deleteQuarterlyIncentiveProcessResult', this.deleteQuarterlyIncentiveProcessResult);
        }

        this.quarterlyProcessId = null;
        this.quarterlyIncentiveProcessId = null;
        
        this.afterUndoOrDisverse();
        this.closeQuarterlyIncentiveProcessModal('close');

        return this.deleteQuarterlyIncentiveProcessResult;
      })
      .catch((error: any) => {
        console.error(error);
        throw error;
      });
  }





  
  undoOrDisbursedQuarterlyIncentiveProcessResult: any[] = [];
  quarterlyIncentiveProcessId: number = null;
  IsDisbursedOrUndo: string;

  undoOrDisbursedQuarterlyIncentiveProcess() {
    
    const params: any = {};

    if (this.quarterlyIncentiveProcessId && this.quarterlyIncentiveProcessId > 0) {
      params['quarterlyIncentiveProcessId'] = this.quarterlyIncentiveProcessId;
    }

    if (this.IsDisbursedOrUndo && this.IsDisbursedOrUndo !== null) {
      params['IsDisbursedOrUndo'] = this.IsDisbursedOrUndo;
    }


    this.quarterlyIncentiveRoutingService.undoOrDisbursedQuarterlyIncentiveProcess<any>(params)
      .toPromise()
      .then((response: any) => {
        if (Array.isArray(response)) {
          this.undoOrDisbursedQuarterlyIncentiveProcessResult = response;
          console.log('undoOrDisbursedQuarterlyIncentiveProcessResult', this.undoOrDisbursedQuarterlyIncentiveProcessResult);
        }

        this.quarterlyProcessId = null;
        this.quarterlyIncentiveProcessId = null;
        
        this.afterUndoOrDisverse();
        this.closeQuarterlyIncentiveProcessModal('close');

        return this.undoOrDisbursedQuarterlyIncentiveProcessResult;
      })
      .catch((error: any) => {
        console.error(error);
        throw error;
      });
  }


  afterUndoOrDisverse() {
    this.refresh.emit();
  }

}
