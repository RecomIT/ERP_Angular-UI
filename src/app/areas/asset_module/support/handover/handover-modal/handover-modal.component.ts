import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/shared/services/user.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { ReplacementSerive } from '../../replacement/replacementservice';
import { EmployeeInfoService } from 'src/app/areas/employee_module/employee/employee-info.service';

import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { CustomModalService } from 'src/app/shared/services/custom-modal.service';
import { HandoverSerive } from '../handoverservice';
import { AssigningSerive } from '../../../assigning/assigning.service';

@Component({
  selector: 'asset-module-handover-modal',
  templateUrl: './handover-modal.component.html'
  
})
export class HandoverModalComponent implements OnInit {

  @Input() id: number = 0;
  // @Input() employeeId: number = 0;
  // @Input() assetId: number = 0;
  // @Input() type: string = '';

  @Output() closeModalEvent = new EventEmitter<string>();
  @ViewChild('handoverModal', { static: true }) handoverModal!: ElementRef;  
  modalTitle: string = "Asset Handover";  
  handoverForm: FormGroup;  
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
    private handoverSerive: HandoverSerive,
    private employeeInfoService: EmployeeInfoService    
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
    this.modalService.open(this.handoverModal, 'xl');
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
    this.ddlStatus = ['New', 'Used'];
  }

  formInit() {
    this.handoverForm = this.fb.group({
      transactionDate: new FormControl(null, Validators.required),
      employeeId: new FormControl(0, Validators.required),
      remarks : new FormControl('', Validators.required),
      handoverStatus: new FormControl(''),
      checkbox: new FormControl(false) 
    });

    this.handoverForm.get('employeeId').valueChanges.subscribe((item) => {         
        //  this.isModalVisible = false;
         this.handoverForm.get('checkbox').setValue(false);
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
      
    }    

    //  this.handoverForm.get('productId').setValue('');
      console.log('Checked Asset ID:', this.selectedAssetId);
      console.log('Checked Product ID:', this.selectedProductId);
      
  }  


  load_value(value: any) {
    this.handoverForm.get('employeeId').setValue(value.employeeId);
    this.handoverForm.get('transactionDate').setValue(new Date(value.transactionDate));
    // this.handoverForm.get('productId').setValue(value.productId);
    this.handoverForm.get('remarks').setValue(value.remarks);
    this.handoverForm.get('handoverStatus').setValue(value.handoverStatus);
  }

  pagePrivilege: any = this.userService.getPrivileges();
  pageNumber: number = 1;
  pageSize: number = 10;
  list_pager: any = this.userService.pageConfigInit("list_pager", this.pageSize, 1, 0);

  list_pageChanged(event: any) {
    this.pageNumber = event;
    this.handoverForm.get('pageNumber').setValue(this.pageNumber);
    this.getAssetData();
  }

  
  list: any[] = [];
  list_loading_label: string = null;
  getAssetData() {
    const employeeId = this.handoverForm.get('employeeId').value;
    let params = {    
      employeeId: employeeId ? employeeId : 0
      // type : 'Show'
    };

    this.list = []
    this.handoverSerive.getAsset(params).subscribe(response => {
      if ((response.body as any[]).length > 0) {
        console.log("getAssetData >>>", response.body);
        this.list = response.body;
        // let xPaginate = JSON.parse(response.headers.get('X-Pagination'));
        // this.list_pager = this.userService.pageConfigInit("list_pager", xPaginate.itemsPerPage, xPaginate.currentPage, xPaginate.totalItems);
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
    // console.log("handoverForm.valid >>>", this.handoverForm.valid);

    if (this.handoverForm.valid) { 

      let data = this.handoverForm.value;
      data.transactionDate = new Date(data.transactionDate).toISOString();
      data.productId = this.selectedProductId;
      data.assetId = this.selectedAssetId;
      data.previousAssigningId = this.selectedAssigningId;      

      console.log("handoverForm data>>>", data);

      this.handoverSerive.save(data).subscribe((reasponse) => {
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



  closeModal(reason: any) {
    this.closeModalEvent.emit(reason);
    this.modalService.service.dismissAll(reason);
  }

}
