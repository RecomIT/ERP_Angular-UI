
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/shared/services/user.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { CustomModalService } from 'src/app/shared/services/custom-modal.service';

import { RepairedSerive } from '../repairedservice';
import { VendorSerive } from '../../../setting/vendor/vendor.service';


@Component({
  selector: 'asset-module-repaired-modal',
  templateUrl: './repaired-modal.component.html'
})
export class RepairedModalComponent implements OnInit {

  @Input() id: number = 0;
  @Output() closeModalEvent = new EventEmitter<string>();
  @ViewChild('repairedModal', { static: true }) repairedModal!: ElementRef;  
  modalTitle: string = "Asset Repaired";  
  repairedForm: FormGroup;  
  server_errors: any;
  btnSubmit: boolean = false;

  datePickerConfig: Partial<BsDatepickerConfig> = this.utilityService.datePickerConfig();
  select2Options = this.utilityService.select2Config();

  constructor(
    private fb: FormBuilder,
    private utilityService: UtilityService,
    private userService: UserService,
    public modalService: CustomModalService,    
    private vendorSerive: VendorSerive,
    private repairedSerive: RepairedSerive, 
  ) { }

  ngOnInit(): void {
    this.formInit();
    this.openModal();    
    this.getServicingAssetData();

    // if (this.id > 0) {
    //   this.getReceivedAssetData();
    // }

  }

  logger(msg: any, options: any) {
    this.utilityService.consoleLog(msg, options);
  }

  User() {
    return this.userService.User();
  }

  openModal() {
    this.modalService.open(this.repairedModal, 'xl');
  }


  ddlVendor: any[] = [];
  loadVendorDropdown() {
      this.vendorSerive.loadVendorDropdown();
      this.vendorSerive.ddl$.subscribe(data => {
          this.ddlVendor = data;
      }, (error) => {
          console.log("error  while fetching data >>>", error);
      })
  }


  formInit() {
    this.repairedForm = this.fb.group({
      transactionDate: new FormControl(null, Validators.required),
      costingAmount: new FormControl(0, Validators.required),
      remarks : new FormControl(''),      
      checkbox: new FormControl(false) 
    });  

  }

 
  selectedProductId: string = null;
  selectedAssetId: number = 0;  
  selectedNumber: string = null;
  selectedVendorId: number = 0;  
  selectedServicingId: number = 0; 
  selectedToken: string = null;
  
  onCheckboxChange(event, productId: string, assetId : number, number : string, vendorId : number, servicingId : number, token : string) {
    if (this.selectedProductId === productId) {
      event.target.checked = false;
      this.selectedProductId = null;
      this.selectedAssetId = 0;    
      this.selectedNumber = null;
      this.selectedVendorId = 0;  
      this.selectedServicingId = 0; 
      this.selectedToken = null;
    } else {
      this.selectedProductId = productId; 
      this.selectedAssetId = assetId;    
      this.selectedNumber = number;
      this.selectedVendorId = vendorId;  
      this.selectedServicingId = servicingId;  
      this.selectedToken = token;     
    }   
      // console.log('Checked Asset ID:', this.selectedAssetId);
      // console.log('Checked Product ID:', this.selectedProductId);
      
  }  


  load_value(value: any) {
    this.repairedForm.get('costingAmount').setValue(value.costingAmount);
    this.repairedForm.get('transactionDate').setValue(new Date(value.transactionDate));
    this.repairedForm.get('remarks').setValue(value.remarks);
  }

  pagePrivilege: any = this.userService.getPrivileges();
  pageNumber: number = 1;
  pageSize: number = 10;
  list_pager: any = this.userService.pageConfigInit("list_pager", this.pageSize, 1, 0);

  list_pageChanged(event: any) {
    this.pageNumber = event;
    this.repairedForm.get('pageNumber').setValue(this.pageNumber);
    this.getServicingAssetData();
  }

  
  list: any[] = [];
  list_loading_label: string = null;
  getServicingAssetData() {
    this.list = []
    this.repairedSerive.getAsset([]).subscribe(response => {
      if ((response.body as any[]).length > 0) {
        // console.log("getReceivedAssetData >>>", response.body);
        this.list = response.body;
        let xPaginate = JSON.parse(response.headers.get('X-Pagination'));
        this.list_pager = this.userService.pageConfigInit("list_pager", xPaginate.itemsPerPage, xPaginate.currentPage, xPaginate.totalItems);
      }
      else {
        this.list_loading_label = "No record(s) found";
      }

    }, (error) => {
      this.utilityService.fail("Something went wrong", "Server Response")
      console.log("error >>>", error);
    })
  }


    submit() {
    // console.log("repairedForm.valid >>>", this.repairedForm.valid);

    if (this.repairedForm.valid) { 
      let data = this.repairedForm.value;
      data.transactionDate = new Date(data.transactionDate).toISOString();
      data.productId = this.selectedProductId;
      data.assetId = this.selectedAssetId;       
      data.number = this.selectedNumber;   
      data.vendorId = this.selectedVendorId;   
      data.servicingId = this.selectedServicingId;
      data.token = this.selectedToken;        
      console.log("repairedForm data>>>", data);

      this.repairedSerive.save(data).subscribe((reasponse) => {
        if (reasponse?.status) {
          this.utilityService.success("The asset successfully replacement", "Server Response");
          this.closeModal(this.utilityService.SuccessfullySaved);
        }
        else {
          this.utilityService.fail(reasponse?.msg, "Server Response");
        }
      }, (error) => {
        console.log("error >>>", error);
        this.utilityService.fail("Something went wrong");
      })
    }
    else {
      this.utilityService.fail("Invalid Form Submission", "Site Response");
    }
  }

  

  closeModal(reason: any) {
    this.closeModalEvent.emit(reason);
    this.modalService.service.dismissAll(reason);
  }

}
