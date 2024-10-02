import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { CustomModalService } from 'src/app/shared/services/custom-modal.service';
import { UserService } from 'src/app/shared/services/user.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { ApprovalSerive } from '../approval.service';
import { AssigningSerive } from '../../assigning/assigning.service';
import { CreateSerive } from '../../create/create.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'asset-module-approval-modal',
  templateUrl: './approval-modal.component.html'
})
export class ApprovalModalComponent implements OnInit {

  @Input() assetId: number = 0;
  @Input() employeeId: number = 0;
  @Input() activeTab: string = '';
  @Input() assigningId: number = 0;
  @Input() type: string = '';


  
  @Output() closeModalEvent = new EventEmitter<string>();
  @ViewChild('approvalModal', { static: true }) approvalModal!: ElementRef;
  modalTitle: string = "Asset Approval Details";

  constructor(
    private utilityService: UtilityService,
    private userService: UserService,
    public modalService: CustomModalService,
    private approvalSerive: ApprovalSerive,
    private assigningSerive: AssigningSerive,
    private createSerive: CreateSerive
  ) { }

  ngOnInit(): void {
    this.openModal();
    this.getAssetDetail();
    this.getProductData();
    this.getAssignedData();

    // console.log('assetCreateList:', this.assetCreateList);
    // console.log('assetAssignigList:', this.assetAssignigList);
    // console.log('productList:', this.productList);
    // console.log('activeTab:', this.activeTab);

    // console.log("assetId >>>", this.assetId);
    //console.log("employeeId >>>", this.employeeId);
    // console.log("assigningId >>>", this.assigningId);
    // console.log("activeTab >>>", this.activeTab);
  }

  logger(msg: any, options: any) {
    this.utilityService.consoleLog(msg, options);
  }

  User() {
    return this.userService.User();
  }

  openModal() {
    this.modalService.open(this.approvalModal, 'xl');
  }

  assetCreateList: any;
  getAssetDetail() {
    let params = {
      assetId: this.assetId
    };
    this.assetCreateList = []
    this.createSerive.getById(params).subscribe(response => {
      // this.assetCreateList = response.body[0];
      // console.log("Create Data >>>", response);
      this.assetCreateList = response;
    }, (error) => {
      console.log("error >>>", error);
      this.utilityService.fail("Something went wrong", "Server Response");
    })
  }

  productList: any[] = [];
  getProductData() {
    let params = {
      assetId: this.assetId,
      assigningId: this.assigningId,
      type : this.type
    };
    this.productList = []
    this.assigningSerive.getProduct(params).subscribe(response => {
      // console.log("getProductData >>>", response[0].assigned);           
      this.productList = response;
    }, (error) => {
      this.utilityService.fail("Something went wrong", "Server Response")
      console.log("error >>>", error);
    })
  }


  assetAssignigList: any;
  getAssignedData() {
    let params = {
      assetId: this.assetId,
      employeeId: this.employeeId
    };

    this.assetAssignigList = []
    this.assigningSerive.get(params).subscribe(response => {
      // console.log("Assigned Data >>>", response.body[0]);
      // console.log("Assigned Data >>>", response.body);
      // console.log("Assigned params >>>", params);
      this.assetAssignigList = response.body[0];
    }, (error) => {
      this.utilityService.fail("Something went wrong", "Server Response")
      console.log("error >>>", error);
    })
  }

  sendEmail() {
    let params = {
      employeeId: this.employeeId,
      sendingType : this.activeTab
    };

    this.approvalSerive.sendEmail(params).subscribe(response => {
      // console.log("response >>>", response);
      if (response) {
        this.utilityService.success("The asset has been successfully approved", "Server Response");
        this.closeModal(this.utilityService.SuccessfullySaved);
      }
      else {
        this.utilityService.fail(response?.msg, "Server Response");
      }
    }, (error) => {
      console.log("error >>>", error);
    })
  }

  approvedAsset() {
    let params = {
      assetId: this.assetId,
      assigningId: this.assigningId,
      activeTab: this.activeTab
    };

    console.log("assetAssignigList >>>", this.assetAssignigList);

    this.approvalSerive.save(params).subscribe((response) => {
      if (response.body.status) {
        // if (this.activeTab == "assetAssigningApproval") {
        //   this.sendEmail();
        // }
        // else {
        //   this.utilityService.success("The asset has been successfully approved", "Server Response");
        //   this.closeModal(this.utilityService.SuccessfullySaved);
        // }
        this.sendEmail();
      }
      else {
        this.utilityService.fail(response?.msg, "Server Response");
      }
    }, (error) => {
      console.log("error >>>", error);
      this.utilityService.fail("Something went wrong");
    })

  }


  closeModal(reason: any) {   
    this.closeModalEvent.emit(reason);
    this.modalService.service.dismissAll(reason);
  }




}
