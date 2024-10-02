import { transition, trigger, useAnimation } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { fadeIn, fadeInUp, fadeOutLeft, slideInUp } from 'ng-animate';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { ToastrService } from 'ngx-toastr';
import { CustomModalService } from 'src/app/shared/services/custom-modal.service';
import { HrWebService } from 'src/app/shared/services/hr-web.service';
import { UserService } from 'src/app/shared/services/user.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { EmployeeTransferService } from '../employee-transfer.service';
import { EmployeeInfoService } from '../../employee-info.service';

@Component({
  selector: 'app-employee-transfer',
  templateUrl: './employee-transfer.component.html',
  animations: [
    trigger('fadeIn', [transition('void => *', useAnimation(fadeIn, { params: { timing: 0.3 } }))]),
    trigger('slideInUp', [transition('* => *', useAnimation(slideInUp, { params: { timing: 0.5 } }))]),
    trigger('fadeInUp', [transition('void => *', useAnimation(fadeInUp))]),
    trigger('fadeOutLeft', [transition('* => void', useAnimation(fadeOutLeft, { params: { timing: 0.3 } }))]),
  ],
})
export class EmployeeTransferComponent implements OnInit {

  pagePrivilege: any = null;
  datePickerConfig: Partial<BsDatepickerConfig> = this.utilityService.datePickerConfig();
  pageNumber: number = 1;
  pageSize: number = 15;
  transfer_list_pager: any = this.userService.pageConfigInit("transfer_list_pager", this.pageSize, 1, 0);

  constructor(private fb: FormBuilder,
    public toastr: ToastrService,
    private userService: UserService,
    public utilityService: UtilityService,
    public modalService: CustomModalService,
    private employeeTransferService: EmployeeTransferService,
    private employeeInfoService: EmployeeInfoService) { }

  ngOnInit(): void {
    this.searchFormInit();
  }

  select2Options = this.utilityService.select2Config();

  searchForm: FormGroup;

  searchFormInit() {
    this.searchForm = this.fb.group({
      employeeId: new FormControl(''),
      employeeCode: new FormControl(''),
      fullName: new FormControl(''),
      head: new FormControl(''),
      effectiveDate: new FormControl(''),
      stateStatus: new FormControl(''),
      sortingCol: new FormControl(''),
      sortType: new FormControl(''),
      pageNumber: new FormControl(this.pageNumber),
      pageSize: new FormControl(this.pageSize)
    })

    this.loadEmployees();

    this.searchForm.valueChanges.subscribe((item) => {
      this.getEmployeeTransferProposals();
    })
  }

  transfer_list_pageChanged(event: any) {
    this.pageNumber = event;
    this.searchForm.get('pageNumber').setValue(this.pageNumber);
  }
  ddlEmployees: any[]; 
  loadEmployees() {
    this.employeeInfoService.loadDropdownData({});
    this.employeeInfoService.ddl_employee_data$.subscribe(data => {
    this.employeeInfoService.loadDropdown(data);
    this.ddlEmployees = this.employeeInfoService.ddl$;
    }, error => {
    console.error('Error while fetching data:', error);
    });
}

  listOfTransfer: any[] = [];
  transferDTLabel: string = null;
  getEmployeeTransferProposals() {
    let params = this.searchForm.value;
    params.employeeId = this.utilityService.IntTryParse(params.employeeId).toString();

    this.employeeTransferService.get(params).subscribe(response => {
      var res = response as any;
      this.listOfTransfer = res.body;
      this.transferDTLabel = this.listOfTransfer.length == 0 ? 'No record(s) found' : null;
      var xPaginate = JSON.parse(res.headers.get('X-Pagination'));
      this.transfer_list_pager = this.userService.pageConfigInit("transfer_list_pager", xPaginate.itemsPerPage, xPaginate.currentPage, xPaginate.totalItems);
    }, (error) => {
      this.utilityService.httpErrorHandler(error);
    })

  }

  transferProposalId: number = 0;
  showInsertUpdateModal: boolean = false;
  openModal(id: number) {
    this.transferProposalId = id;
    this.showInsertUpdateModal = true;
  }

  closeModal(reason: string) {
    this.showInsertUpdateModal = false;
    this.transferProposalId = 0;
    if (reason == 'Save Complete') {
      this.getEmployeeTransferProposals();
    }
  }


  //Added by MOnzur 16-Sep-2023
    showUploaTransferProposalModal: boolean = false;
    modalTitle: string = "";
    openUploadTransferProposalExcelFileModal() {
      this.showUploaTransferProposalModal = true;
      this.modalTitle = "Upload Transfer Proposal Excel File";
    }
  
    closeUploadTransferProposalExcelFileModal(reason: any) {
      this.transferProposalId = 0;
      this.showUploaTransferProposalModal = false;
      if (reason == 'Save Complete') {
        this.getEmployeeTransferProposals();
      }
    }
}
