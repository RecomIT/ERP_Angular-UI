
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, FormsModule } from '@angular/forms';
import { CustomModalService } from 'src/app/shared/services/custom-modal.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { UserService } from 'src/app/shared/services/user.service';
import { AssigningSerive } from '../assigning.service';
import { EmployeeInfoService } from 'src/app/areas/employee_module/employee/employee-info.service';
import { CreateSerive } from '../../create/create.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';



@Component({
  selector: 'asset-module-assigning-modal',
  templateUrl: './assigning-modal.component.html'

})
export class AssigningModalComponent implements OnInit {

  @Input() id: number = 0;
  @Input() approved: boolean = false;
  @Input() type: string = '';

  @Output() closeModalEvent = new EventEmitter<string>();
  @ViewChild('assigninModal', { static: true }) assetAssigninModal!: ElementRef;
  @ViewChild('assetSearchModal', { static: true }) assetSearchModal!: ElementRef;

  searchTitle: string = "Asset Search";
  modalTitle: string = "Asset Assignin";
  assigningForm: FormGroup;
  assetSearchForm: FormGroup;
  btnSubmit: boolean = false;
  server_errors: any;
  datePickerConfig: Partial<BsDatepickerConfig> = this.utilityService.datePickerConfig();
  select2Config: any = this.utilityService.select2Config();
  assetSearchModalRef: NgbModalRef;

  constructor(
    private fb: FormBuilder,
    private utilityService: UtilityService,
    private userService: UserService,
    public modalService: CustomModalService,
    private employeeInfoService: EmployeeInfoService,
    private createSerive : CreateSerive,
    private assigningSerive : AssigningSerive,
    private modalpService: NgbModal

  ) { }

  ngOnInit(): void {
    this.assetAssigningFormInit();
    this.openAssigningModal();
    this.loadEmployees();

    if (this.id > 0) {
      this.getById();
      this.modalTitle = this.id > 0 ? "Update Asset" : "Add New Asset";
    };

  }

  select2Options = {
    width: "100%",
    containerCssClass: "form-control form-control-sm text-x-small",
    theme: "bootstrap4",
  }

  openAssigningModal() {
    this.modalService.open(this.assetAssigninModal, "lg");
  }

  openAssetSearchModal() {
    this.assetSearchModalRef = this.modalpService.open(this.assetSearchModal,{ size: 'lg' });
  }


  assetAssigningFormInit() {
    this.assigningForm = this.fb.group({
      assigningId: new FormControl(this.id),
      transactionDate: new FormControl(null, Validators.required),
      remarks: new FormControl(''),   
      employeeId: new FormControl(0, Validators.required),
      productId : new FormControl('', Validators.required)

    });
  }


  loadAssignedvalue(value: any) {
    this.assigningForm.get('employeeId').setValue(value.employeeId);
    this.assigningForm.get('transactionDate').setValue(new Date(value.transactionDate));
    this.assigningForm.get('productId').setValue(value.productId);
    this.assigningForm.get('remarks').setValue(value.remarks);
  }

  assetSearchFormInit() {
    this.assetSearchForm = this.fb.group({
      sortingCol: new FormControl(''),
      sortType: new FormControl(''),
      pageNumber: new FormControl(this.pageNumber),
      pageSize: new FormControl(this.pageSize)
    })
  }


  getById() {
    this.assigningSerive.getById({ assigningId: this.id }).subscribe((response) => {
      //console.log("getById >>>", response);            
      this.loadAssignedvalue(response);
      const assetId = response.assetId;
      this.showSearchItem(assetId,'Assigning');
    }, (error) => {
      this.utilityService.fail("Something went wrong", "Server Wrong");
    })
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

  formErrors = {
    'productID': ''
  }

  validationMessages = {
    'productID': {
      'required': 'Field is required',
      'maxlength': 'Max length is 100',
      'minlength': 'Min length is 2'
    }
  }

  logFormErrors(formGroup: FormGroup = this.assigningForm) {
    Object.keys(formGroup.controls).forEach((key: string) => {
      const abstractControl = formGroup.get(key);
      this.formErrors[key] = '';
      if (abstractControl && !abstractControl.valid && (abstractControl.touched || abstractControl.dirty)) {
        const messages = this.validationMessages[key];
        for (const errorKey in abstractControl.errors) {
          this.formErrors[key] += messages[errorKey];
        }
      }
    })
  }


  openSearchProductModal() {
    this.assetSearchFormInit(); 
    this.openAssetSearchModal();
    this.getAssetData();
  }

  submit() {
    if (this.assigningForm.valid) {
      let data = this.assigningForm.value;
      data.assetId = this.assetId;
      let employeeId = data.employeeId;
      // console.log("Assigning Form EmployeeId >>>", employeeId);

      this.assigningSerive.save(data).subscribe((response) => {
        if (response?.status) {
          this.sendEmail(employeeId);
          // this.utilityService.success("The asset assigning has been successfully submitted for approval", "Server Response");
          // this.closeModal(this.utilityService.SuccessfullySaved);
        }
        else {
          if (response?.msg == "Validation Error") {
            this.server_errors = JSON.parse(response?.errorMsg)
          }
          else {
            this.utilityService.fail(response?.msg, "Server Response");
          }
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

  pagePrivilege: any = this.userService.getPrivileges();
  pageNumber: number = 1;
  pageSize: number = 8;
  list_pager: any = this.userService.pageConfigInit("list_pager", this.pageSize, 1, 0);

  list_pageChanged(event: any) {
    this.pageNumber = event;
    this.assetSearchForm.get('pageNumber').setValue(this.pageNumber);
    this.getAssetData();
  }


  list: any[] = [];
  list_loading_label: string = null;
  getAssetData() {
    let params = {
      sortingCol: this.assetSearchForm.get('sortingCol').value,
      sortType: this.assetSearchForm.get('sortType').value,
      pageNumber: this.assetSearchForm.get('pageNumber').value,
      pageSize: this.assetSearchForm.get('pageSize').value,
    };

    this.list = []
    this.assigningSerive.getAsset(params).subscribe(response => {
      if ((response.body as any[]).length > 0) {
        ///console.log("getAssetData >>>", response.body);
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

  isRowHidden: boolean = true;
  assetId: number=0;
  showSearchItem(id: any, type : any) {
    this.assetId = id;
    this.type = type;

    this.getProductData();
    this.getAssetDetails();
    if (this.assetSearchModalRef) {
      this.assetSearchModalRef.close();
    }
    this.isRowHidden = false;
    //console.log("assetId >>>", this.assetId);
  }

 
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

    this.updateFormValue();
  }

  updateFormValue() {
    if (this.selectedItems.length > 0) {
      this.assigningForm.get('productId').setValue(this.selectedItems[0].productId);
    } else {
      this.assigningForm.get('productId').setValue('');
    }
  }

  list_Product_loading_label: string = null;
  listProduct: any[] = [];
  getProductData() {
    let params = {
      assigningId: this.id,
      assetId: this.assetId,
      approved: this.approved,
      type : this.type 
    };

    // console.log("ProductData >>>", params);
    
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

  listOfAssetDetails : any[] = [];
  getAssetDetails() {
    this.listOfAssetDetails = []
    let params = {
      assetId: this.assetId
    };

    this.createSerive.getAssetDetails(params).subscribe(response => {
      //console.log("getAssetDetails >>>", response.body);
      //this.listOfAssetDetails = response.body;
      if (response?.status) {
        this.listOfAssetDetails = response.body;
      }
      else {
        this.utilityService.fail(response?.msg, "Server Response");
      }

    }, (error) => {
      this.utilityService.fail("Something went wrong", "Server Response")
      console.log("error >>>", error);
    })

  }

  sendEmail(employeeId: any) {
    let params = {
      employeeId: employeeId
    };

    // console.log("params >>>", params);

    this.assigningSerive.sendEmail(params).subscribe(response => {
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

 
}
