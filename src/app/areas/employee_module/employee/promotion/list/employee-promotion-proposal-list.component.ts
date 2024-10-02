import { transition, trigger, useAnimation } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { fadeIn, fadeInUp, fadeOutLeft, slideInUp } from 'ng-animate';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { ToastrService } from 'ngx-toastr';
import { CustomModalService } from 'src/app/shared/services/custom-modal.service';
import { UserService } from 'src/app/shared/services/user.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { EmploymentPromotionSerivce } from '../employee-promotion.service';
import { EmployeeInfoService } from '../../employee-info.service';

@Component({
  selector: 'app-employee-module-promotion-proposal-list',
  templateUrl: './employee-promotion-proposal-list.component.html',
  animations: [
    trigger('fadeIn', [transition('void => *', useAnimation(fadeIn, { params: { timing: 0.3 } }))]),
    trigger('slideInUp', [transition('* => *', useAnimation(slideInUp, { params: { timing: 0.5 } }))]),
    trigger('fadeInUp', [transition('void => *', useAnimation(fadeInUp))]),
    trigger('fadeOutLeft', [transition('* => void', useAnimation(fadeOutLeft, { params: { timing: 0.3 } }))]),
  ],
})
export class EmployeePromotionProposalListComponent implements OnInit {

  // Common Variables
  pagePrivilege: any = this.userService.getPrivileges();
  datePickerConfig: Partial<BsDatepickerConfig> = this.utilityService.datePickerConfig();
  pageNumber: number = 1;
  pageSize: number = 15;
  promotion_list_pager: any = this.userService.pageConfigInit("promotion_list_pager", this.pageSize, 1, 0);

  constructor(private fb: FormBuilder,
    public toastr: ToastrService,
    private userService: UserService,
    public utilityService: UtilityService,
    public modalService: CustomModalService,
    private employmentPromotionSerivce: EmploymentPromotionSerivce,
    private employeeInfoService: EmployeeInfoService) { }

  ngOnInit(): void {
    this.searchFormInit();
  }

  select2Options = {
    width: "100%",
    containerCssClass: "form-control form-control-sm text-x-small",
    theme: "bootstrap4",
  }

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
      this.getEmployeePromotionProposals();
    })
  }

  promotion_list_pageChanged(event: any) {
    this.pageNumber = event;
    this.searchForm.get('pageNumber').setValue(this.pageNumber);
  }

  ddlEmployees: any[];
  loadEmployees() {
    this.ddlEmployees = [];
    this.employeeInfoService.loadDropdownData({});
    this.employeeInfoService.ddl_employee_data$.subscribe(data => {
      this.employeeInfoService.loadDropdown(data);
      this.ddlEmployees = this.employeeInfoService.ddl$;
    }, error => {
      console.error('Error while fetching data:', error);
    });
  }

  listOfPromotion: any[] = [];
  promotionDTLabel: string = null;
  getEmployeePromotionProposals() {
    this.listOfPromotion = [];
    this.employmentPromotionSerivce.get(this.searchForm.value).subscribe(response => {
      if ((response.body as any[]).length > 0) {
        this.listOfPromotion = response.body;
        var xPaginate = JSON.parse(response.headers.get('X-Pagination'));
        this.promotion_list_pager = this.userService.pageConfigInit("promotion_list_pager", xPaginate.itemsPerPage, xPaginate.currentPage, xPaginate.totalItems);
      }
      else {
        this.promotionDTLabel = "No record(s) found"
      }
    }, (error) => {
      this.toastr.error("Something went wrong", "Server Response", { timeOut: 1000 });
      console.log("error >>>", error);
    })
  }


  promotionProposalId: number = 0;
  showInsertUpdateModal: boolean = false;
  openModal(id: number) {

    this.promotionProposalId = id;
    this.showInsertUpdateModal = true;
  }

  closeModal(reason: string) {
    this.showInsertUpdateModal = false;
    this.promotionProposalId = 0;
    if (reason == 'Save Complete') {
      this.getEmployeePromotionProposals();
    }
  }


  // /Added by MOnzur 11-Sep-2023

  showUploadPromotionProposalModal: boolean = false;
  modalTitle: string = "";
  openUploadPromotionProposalExcelFileModal() {
    this.showUploadPromotionProposalModal = true;
    this.modalTitle = "Upload Promotion Proposal Excel File";
  }

  closeUploadPromotionProposalExcelFileModal(reason: any) {
    this.promotionProposalId = 0;
    this.showUploadPromotionProposalModal = false;
    if (reason == 'Save Complete') {
      this.getEmployeePromotionProposals();
    }
  }

  //#region open/close delete modal
  showDeleteModal: boolean = false;
  delete_item: any;
  delete_id: number = 0;
  delete_employeeId = 0;

  openProposalDeleteModal(item: any) {
    this.delete_item = item;
    this.delete_id = item.promotionProposalId;
    this.delete_employeeId = item.employeeId;
    this.showDeleteModal = true;
  }

  closeProposalDeleteModal(reason: any) {
    this.showDeleteModal = false;
    this.getEmployeePromotionProposals();
  }

  //#endregion open/close delete modal


  showApprovalModal: boolean = false;
  approval_item: any;
  approval_id: number = 0;
  approval_employeeId = 0;

  openProposalApprovalModal(item: any) {
    this.approval_item = item;
    this.approval_id = item.promotionProposalId;
    this.approval_employeeId = item.employeeId;
    this.showApprovalModal = true;
  }

  closeProposalApprovalModal(reason: any) {
    this.showApprovalModal = false;
    this.getEmployeePromotionProposals();
  }

}
