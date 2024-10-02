import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/shared/services/user.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { CustomModalService } from 'src/app/shared/services/custom-modal.service';
import { ServicingSerive } from '../servicingservice';
import { VendorSerive } from '../../../setting/vendor/vendor.service';


@Component({
  selector: 'asset-module-servicing-modal',
  templateUrl: './servicing-modal.component.html'  
})
export class ServicingModalComponent implements OnInit {

  @Input() id: number = 0;
  @Output() closeModalEvent = new EventEmitter<string>();
  @ViewChild('servicingModal', { static: true }) servicingModal!: ElementRef;  
  modalTitle: string = "Asset Servicing";  
  servicingForm: FormGroup;  
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
    private servicingSerive: ServicingSerive, 
  ) { }

  ngOnInit(): void {
    this.formInit();
    this.openModal();
    this.loadVendorDropdown(); 
    this.getReceivedAssetData();

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
    this.modalService.open(this.servicingModal, 'xl');
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
    this.servicingForm = this.fb.group({
      transactionDate: new FormControl(null, Validators.required),
      vendorId: new FormControl(0, Validators.required),
      remarks : new FormControl('', Validators.required),      
      checkbox: new FormControl(false) 
    });  

  }

 
  selectedProductId: string = null;
  selectedAssetId: number = 0;  
  selectedNumber: string = null; 
  onCheckboxChange(event, productId: string, assetId : number, number : string) {
    if (this.selectedProductId === productId) {
      event.target.checked = false;
      this.selectedProductId = null;
      this.selectedAssetId = 0;    
      this.selectedNumber = null;  
    } else {
      this.selectedProductId = productId; 
      this.selectedAssetId = assetId;        
      this.selectedNumber = number;
    }   
      // console.log('Checked Asset ID:', this.selectedAssetId);
      // console.log('Checked Product ID:', this.selectedProductId);
      
  }  


  load_value(value: any) {
    this.servicingForm.get('vendorId').setValue(value.vendorId);
    this.servicingForm.get('transactionDate').setValue(new Date(value.transactionDate));
    this.servicingForm.get('remarks').setValue(value.remarks);
  }

  pagePrivilege: any = this.userService.getPrivileges();
  pageNumber: number = 1;
  pageSize: number = 10;
  list_pager: any = this.userService.pageConfigInit("list_pager", this.pageSize, 1, 0);

  list_pageChanged(event: any) {
    this.pageNumber = event;
    this.servicingForm.get('pageNumber').setValue(this.pageNumber);
    this.getReceivedAssetData();
  }

  
  list: any[] = [];
  list_loading_label: string = null;
  getReceivedAssetData() {
    this.list = []
    this.servicingSerive.getAsset([]).subscribe(response => {
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
    // console.log("servicingForm.valid >>>", this.servicingForm.valid);

    if (this.servicingForm.valid) { 
      let data = this.servicingForm.value;
      data.transactionDate = new Date(data.transactionDate).toISOString();
      data.productId = this.selectedProductId;
      data.assetId = this.selectedAssetId;         
      data.number = this.selectedNumber;  

      function generateToken(productId, assetId, number, transactionDate) {
        const datePart = new Date(transactionDate).toISOString().split('T')[0];
        return `Rep-${productId}-${assetId}-${number}-${datePart}`;
      }
      data.token = generateToken(data.productId, data.assetId, data.number, data.transactionDate);  

      console.log("servicingForm data>>>", data);

      this.servicingSerive.save(data).subscribe((reasponse) => {
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
