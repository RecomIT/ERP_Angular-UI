import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CustomModalService } from 'src/app/shared/services/custom-modal.service';
import { UserService } from 'src/app/shared/services/user.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { ReplacementSerive } from '../replacementservice';
import { EmployeeInfoService } from 'src/app/areas/employee_module/employee/employee-info.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { AssigningSerive } from '../../../assigning/assigning.service';



@Component({
  selector: 'asset-module-replacement-modal',
  templateUrl: './replacement-modal.component.html'
})
export class ReplacementModalComponent implements OnInit {


  @Input() id: number = 0;
  // @Input() employeeId: number = 0;
  // @Input() assetId: number = 0;
  // @Input() type: string = '';

  @Output() closeModalEvent = new EventEmitter<string>();
  @ViewChild('replacementModal', { static: true }) replacementModal!: ElementRef;
  // @ViewChild('assetSearchModal', { static: true }) assetSearchModal!: ElementRef;
  modalTitle: string = "Asset Replacement";
  // searchTitle: string = "Asset Search";
  replacementForm: FormGroup;
  // assetSearchForm: FormGroup;
  server_errors: any;
  btnSubmit: boolean = false;

  datePickerConfig: Partial<BsDatepickerConfig> = this.utilityService.datePickerConfig();
  select2Options = this.utilityService.select2Config();
  // assetSearchModalRef: NgbModalRef;

  constructor(
    private fb: FormBuilder,
    private utilityService: UtilityService,
    private userService: UserService,
    public modalService: CustomModalService,
    public replacementSerive : ReplacementSerive,
    private assigningSerive : AssigningSerive,
    private employeeInfoService: EmployeeInfoService
    // private modalpService: NgbModal
  ) { }

  ngOnInit(): void {
    this.formInit();
    this.openModal();
    this.loadEmployees();
    this.loadStatus(); 

    if (this.id > 0) {
      this.getAssetData();
    }

  }

  logger(msg: any, options: any) {
    this.utilityService.consoleLog(msg, options);
  }

  User() {
    return this.userService.User();
  }

  openModal() {
    this.modalService.open(this.replacementModal, 'xl');
  }

  ddlEmployees: any[] = [];
  loadEmployees() {
    this.employeeInfoService.loadDropdownData({});
    this.employeeInfoService.ddl_employee_data$.subscribe(data => {
      this.employeeInfoService.loadDropdown(data);
      this.ddlEmployees = this.employeeInfoService.ddl$;
    }, error => {
      console.error('Error while fetching data:', error);
    });
  }

  ddlStatus: any[] = [];
  loadStatus() {
    this.ddlStatus = ['Temporary', 'Permanent'];
  }

  formInit() {
    this.replacementForm = this.fb.group({
      transactionDate: new FormControl(null, Validators.required),
      employeeId: new FormControl(0, Validators.required),
      remarks : new FormControl('', Validators.required),
      replaceStatus: new FormControl(''),
      checkbox: new FormControl(false) 
    });

    this.replacementForm.get('employeeId').valueChanges.subscribe((item) => {         
         this.isModalVisible = false;
         this.replacementForm.get('checkbox').setValue(false);
         this.getAssetData();
    });

  }

 
  selectedProductId: string = null;
  selectedAssetId: number = 0;
  selectedAssigningId: number = 0;
  onCheckboxChange(event, productId: string, assetId : number, assigningId: number) {
    if (this.selectedProductId === productId) {
      event.target.checked = false;
      this.selectedProductId = null;
      this.selectedAssetId = 0;
      this.selectedAssigningId = 0;
    } else {
      this.selectedProductId = productId; 
      this.selectedAssetId = assetId;
      this.selectedAssigningId = assigningId;     
      this.getProductData();
    }    

      // this.replacementForm.get('productId').setValue('');
      // console.log('Checked Product ID:', this.selectedProductId);
      // console.log('Checked Product IDs:', this.selectedProductIds[0]);
  }  


  load_value(value: any) {
    this.replacementForm.get('employeeId').setValue(value.employeeId);
    this.replacementForm.get('transactionDate').setValue(new Date(value.transactionDate));
    this.replacementForm.get('productId').setValue(value.productId);
    this.replacementForm.get('remarks').setValue(value.remarks);
    this.replacementForm.get('replaceStatus').setValue(value.replaceStatus);
  }

  pagePrivilege: any = this.userService.getPrivileges();
  pageNumber: number = 1;
  pageSize: number = 10;
  list_pager: any = this.userService.pageConfigInit("list_pager", this.pageSize, 1, 0);

  list_pageChanged(event: any) {
    this.pageNumber = event;
    this.replacementForm.get('pageNumber').setValue(this.pageNumber);
    this.getAssetData();
  }

  
  list: any[] = [];
  list_loading_label: string = null;
  getAssetData() {
    const employeeId = this.replacementForm.get('employeeId').value;
    let params = {    
      employeeId: employeeId ? employeeId : 0,
      type : 'Show'
    };

    this.list = []
    this.replacementSerive.getAsset(params).subscribe(response => {
      if ((response.body as any[]).length > 0) {
        // console.log("getAssetData >>>", response.body);
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


  list_Product_loading_label: string = null;
  listProduct: any[] = [];
  getProductData() {
    let params = {
      assetId: this.selectedAssetId,
      type : 'Create'
    };
    
    this.listProduct = []
    this.assigningSerive.getProduct(params).subscribe(response => {
      //console.log("ProductData >>>", response);
      if (response && response.length > 0) {
        this.listProduct = response;
        this.downloadFormat = response[0].format;
      } else {
        this.list_Product_loading_label = "No product(s) found";
      }

    }, (error) => {
      this.utilityService.fail("Something went wrong", "Server Response")
      console.log("error >>>", error);
    })
  }

  isModalVisible: boolean = false;
  downloadFormat : string;
  selectedItems: any[] = [];
  isSelected(item: any): boolean {
      return this.selectedItems.some(product => product.productId === item.productId);
  }

  toggleSelection(item: any) {
    // Uncheck all checkboxes
    this.listProduct.forEach(product => {
      if (product !== item) {
        const index = this.selectedItems.findIndex(selectedProduct => selectedProduct.productId === product.productId);
        if (index !== -1) {
          this.selectedItems.splice(index, 1);
        }
      }
    });

    // Check or uncheck the selected item
    const index = this.selectedItems.findIndex(selectedProduct => selectedProduct.productId === item.productId);
    if (index !== -1) {
      this.selectedItems.splice(index, 1);
    } else {
      this.selectedItems.push(item);      
    }

    
    this.isModalVisible = this.selectedItems.length > 0;

    // this.updateFormValue();
  }


  submit() {
    // console.log("replacementForm.valid >>>", this.replacementForm.valid);

    if (this.replacementForm.valid) { 

      let data = this.replacementForm.value;
      data.transactionDate = new Date(data.transactionDate).toISOString();
      data.previousProductId = this.selectedProductId;
      data.assetId = this.selectedAssetId;
      data.previousAssigningId = this.selectedAssigningId;
      data.productId = this.selectedItems[0].productId;
      data.assetId = this.selectedItems[0].assetId;

      console.log("replacementForm data>>>", data);

      this.replacementSerive.save(data).subscribe((reasponse) => {
        if (reasponse?.status) {
          // this.insertReceived();
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

  insertReceived() {

    let data = this.replacementForm.value;
    data.transactionDate = new Date(data.transactionDate).toISOString();
    data.previousProductId = this.selectedProductId;
    data.assetId = this.selectedAssetId;
    data.assigningId = this.selectedAssigningId;
    data.newProductId = this.selectedItems[0].productId;

    console.log("replacementForm data>>>", data);

    this.assigningSerive.sendEmail(data).subscribe(response => {
      // console.log("response >>>", response);
      if (response) {
        this.utilityService.success("The asset has been successfully submitted for approval", "Server Response");
        this.closeModal(this.utilityService.SuccessfullySaved);
      }
      else {
        this.utilityService.fail(response?.msg, "Server Response");
      }
    }, (error) => {
      console.log("error >>>", error);
    })
  }


  closeModal(reason: any) {
    this.closeModalEvent.emit(reason);
    this.modalService.service.dismissAll(reason);
  }



  // updateFormValue() {
  //   if (this.selectedItems.length > 0) {
  //     this.replacementForm.get('productId').setValue(this.selectedItems[0].productId);
  //   } else {
  //     this.replacementForm.get('productId').setValue('');
  //   }

  //   if (this.assetSearchModalRef) {
  //     this.assetSearchModalRef.close();
  //   }
  // }



  // openAssetSearchModal() {
  //   this.assetSearchModalRef = this.modalpService.open(this.assetSearchModal,{ size: 'lg' });
  // }

  // assetSearchFormInit() {
  //   this.assetSearchForm = this.fb.group({
  //     sortingCol: new FormControl(''),
  //     sortType: new FormControl(''),
  //     pageNumber: new FormControl(this.pageNumber),
  //     pageSize: new FormControl(this.pageSize)
  //   })
  // }

  // listSearch: any[] = [];
  // getAssetSearch() {
  //   let params = {
  //     sortingCol: this.assetSearchForm.get('sortingCol').value,
  //     sortType: this.assetSearchForm.get('sortType').value,
  //     pageNumber: this.assetSearchForm.get('pageNumber').value,
  //     pageSize: this.assetSearchForm.get('pageSize').value,
  //   };

  //   this.listSearch = []
  //   this.replacementSerive.getAsset(params).subscribe(response => {
  //     if ((response.body as any[]).length > 0) {
  //       // console.log("getAssetData >>>", response.body);
  //       this.listSearch = response.body;
  //       let xPaginate = JSON.parse(response.headers.get('X-Pagination'));
  //       this.list_pager = this.userService.pageConfigInit("list_pager", xPaginate.itemsPerPage, xPaginate.currentPage, xPaginate.totalItems);
  //     }
  //     else {
  //       // this.list_loading_label = "No record(s) found";
  //     }

  //   }, (error) => {
  //     this.utilityService.fail("Something went wrong", "Server Response")
  //     console.log("error >>>", error);
  //   })
  // }


  // isRowHiddenAsset: boolean = false;
  // isRowHidden: boolean = true;
  // showSearchItem(id: any, type : any) {
  //   // this.assetId = id;
  //   // this.type = type;
  //   this.getProductData();
  //   this.isRowHidden = false;
  //   this.isRowHiddenAsset = true
  //   //console.log("assetId >>>", this.assetId);
  // }


  // openSearchProductModal() {
  //   this.isRowHidden = true;
  //   this.isRowHiddenAsset = false
  //   this.replacementForm.get('productId').setValue('');

  //   this.listProduct.forEach(item => {
  //     if (this.isSelected(item)) {
  //       this.toggleSelection(item);
  //     }
  //   });

  //   this.assetSearchFormInit(); 
  //   this.openAssetSearchModal();

  //   this.getAssetSearch();
  // }

  // closePorductForm() {
  //   this.isRowHidden = true;
  //   this.isRowHiddenAsset = false
  //   this.replacementForm.get('productId').setValue('');
  // }

}
