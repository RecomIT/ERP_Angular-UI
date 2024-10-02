import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { CustomModalService } from 'src/app/shared/services/custom-modal.service';
import { UserService } from 'src/app/shared/services/user.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { ResignationSerive } from '../resignation.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

@Component({
  selector: 'asset-module-resignation-modal',
  templateUrl: './resignation-modal.component.html',

})
export class ResignationModalComponent implements OnInit {

  @Input() employeeId: number = 0;
  @Input() assigningId: number = 0;
  @Output() closeModalEvent = new EventEmitter<string>();
  @ViewChild('resignationModal', { static: true }) resignationModal!: ElementRef;
  modalTitle: string = "Employee Asset Details";
  resignationForm: FormGroup;
  btnSubmit: boolean = false;
  server_errors: any;
  datePickerConfig: Partial<BsDatepickerConfig> = this.utilityService.datePickerConfig();


  constructor(
    private fb: FormBuilder,
    private utilityService: UtilityService,
    private userService: UserService,
    public modalService: CustomModalService,
    private resignationSerive: ResignationSerive
  ) { }

  ngOnInit(): void {
    this.formInit();
    this.openModal();
    this.getAssetData();
    this.loadCondition();
    // console.log("assigningId >>>", this.assigningId);
    // console.log("employeeId >>>", this.employeeId);
  }

  logger(msg: any, options: any) {
    this.utilityService.consoleLog(msg, options);
  }

  User() {
    return this.userService.User();
  }

  openModal() {
    this.modalService.open(this.resignationModal, 'xl');
  }


  formInit() {
    this.resignationForm = this.fb.group({
      transactionDate: new FormControl(null, Validators.required),
      condition: new FormControl('', Validators.required),
      remarks: new FormControl('')
    });
  }

  isCheckboxChecked: boolean = false;
  checkboxChanged() {
      this.isCheckboxChecked = this.selectedCheckboxes.some(checkbox => checkbox);
  }

  load_value(value: any) {
    this.resignationForm.get('transactionDate').setValue(value.transactionDate);
    this.resignationForm.get('condition').setValue(value.condition);
    this.resignationForm.get('remarks').setValue(value.remarks);
  }

  ddlCondition: any[] = [];
  loadCondition() {
    this.ddlCondition = ['New', 'Used','Damage'];
  }

  pagePrivilege: any = this.userService.getPrivileges();
  pageNumber: number = 1;
  pageSize: number = 10;
  list_pager: any = this.userService.pageConfigInit("list_pager", this.pageSize, 1, 0);

  list_pageChanged(event: any) {
    this.pageNumber = event;
    this.resignationForm.get('pageNumber').setValue(this.pageNumber);
    this.getAssetData();
  }

  list: any[] = [];
  list_loading_label: string = null;
  getAssetData() {
    let params = {
      employeeId: this.employeeId,
      assigningId: this.assigningId
    };

    this.list = []
    this.resignationSerive.get(params).subscribe(response => {
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

  selectedCheckboxes: boolean[] = [];
  submit() {
    const data = this.resignationForm.value;
    for (let i = 0; i < this.list.length; i++) {
      if (this.selectedCheckboxes[i]) {
        const selectedItem = this.list[i];

        const assetId = selectedItem.assetId;
        const assigningId = selectedItem.assigningId;
        const productId = selectedItem.productId;
        const employeeId = selectedItem.employeeId;

        data['assetId'] = assetId;
        data['assigningId'] = assigningId;
        data['productId'] = productId;
        data['employeeId'] = employeeId;
      }
    }

    if (this.resignationForm.valid) {
      data.transactionDate = new Date(data.transactionDate).toISOString();   
      this.resignationSerive.save(data).subscribe((response) => {
        if (response.body.status) {
          this.utilityService.success("The asset has been successfully submitted", "Server Response");
          this.closeModal(this.utilityService.SuccessfullySaved);
        }
        else {
          if (response.body.msg == "Validation Error") {
            this.server_errors = JSON.parse(response.body.errorMsg)
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

  closeModal(reason: any) {
    this.closeModalEvent.emit(reason);
    this.modalService.service.dismissAll(reason);
  }

}
