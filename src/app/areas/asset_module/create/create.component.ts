import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { CreateSerive } from './create.service';
import { transition, trigger, useAnimation } from '@angular/animations';
import { bounceIn, fadeIn, fadeInRight, slideInUp } from 'ng-animate';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { UserService } from 'src/app/shared/services/user.service';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CustomModalService } from 'src/app/shared/services/custom-modal.service';
import { ApiArea } from 'src/app/shared/constants';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  animations: [
    trigger('slideInUp', [transition('* => *', useAnimation(slideInUp, { params: { timing: 0.5 } }))]),
    trigger('fadeIn', [transition('void => *', useAnimation(fadeIn, { params: { timing: 0.3 } }))]),
    trigger('fadeInRight', [transition('void => *', useAnimation(fadeInRight, { params: { timing: 0.5 } }))]),
    trigger('bounceIn', [transition('void => *', useAnimation(bounceIn, { params: { timing: 1 } }))]),
  ],
})
export class CreateComponent implements OnInit {



  constructor(
    private createSerive: CreateSerive, 
    private utilityService:UtilityService,
    private userService: UserService,
    private datepipe: DatePipe,
    private fb: FormBuilder,
    public toastr: ToastrService,
    public modalService: CustomModalService
    ){}

  datePickerConfig: Partial<BsDatepickerConfig> = this.utilityService.datePickerConfig();

  ngOnInit(): void {    
    this.searchFormInit();
    this.loadStatus();
    this.getAssetData();
  }

  logger(msg: any, options: any) {
    this.utilityService.consoleLog(msg, options);
  }

  User() {
    return this.userService.User();
  }

  select2Options = {
    width: "100%",
    containerCssClass: "form-control form-control-sm text-x-small",
    theme: "bootstrap4",
  }

  showingModal : boolean= false;
  assetId: number=0;
  approved: boolean = false;
  showModal(id: any, approved: any){
      this.showingModal = true;
      this.assetId=id;
      this.approved = approved;

      console.log("Asset ID >>>", this.assetId);
      console.log("Approved >>>", this.approved);
  }


  pagePrivilege: any = this.userService.getPrivileges();
  pageNumber: number = 1;
  pageSize: number = 10;
  list_pager: any = this.userService.pageConfigInit("list_pager", this.pageSize, 1, 0);

  list_pageChanged(event: any) {
    this.pageNumber = event;
    this.searchForm.get('pageNumber').setValue(this.pageNumber);
    this.getAssetData();
  }


  ddlStatus: any[] = [];
  loadStatus() {
    this.ddlStatus = ['Pending', 'Approved'];
  }


  list: any[] = [];
  list_loading_label: string = null;
  getAssetData() {
    let params = {
      fromDate:
        this.searchForm.get('transactionDate').value != null
          && this.searchForm.get('transactionDate').value != undefined ?
          this.datepipe.transform(this.searchForm.get('transactionDate').value[0], "yyyy-MM-dd").toString() : '',
      toDate:
        this.searchForm.get('transactionDate').value != null &&
          this.searchForm.get('transactionDate').value != undefined ?
          this.datepipe.transform(this.searchForm.get('transactionDate').value[1], "yyyy-MM-dd").toString() : '',
      status: this.searchForm.get('status').value,
      sortingCol: this.searchForm.get('sortingCol').value,
      sortType: this.searchForm.get('sortType').value,
      pageNumber: this.searchForm.get('pageNumber').value,
      pageSize: this.searchForm.get('pageSize').value,
    };

    this.list = []
    this.createSerive.get(params).subscribe(response => {
      if ((response.body as any[]).length > 0) {

        //console.log("getAssetData >>>", response.body);

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

  searchForm: FormGroup;
  searchFormInit() {
    this.searchForm = this.fb.group({
      transactionDate: new FormControl(null),
      status: new FormControl(''),
      sortingCol: new FormControl(''),
      sortType: new FormControl(''),
      pageNumber: new FormControl(this.pageNumber),
      pageSize: new FormControl(this.pageSize)
    })


    this.searchForm.get('transactionDate').valueChanges.subscribe((item) => {
      this.pageSize = 1;
      this.getAssetData();
    });

    this.searchForm.get('status').valueChanges.subscribe((item) => {
      this.pageSize = 1;
      console.log('Status changed:', item);
      this.getAssetData();
    });

  }


  closeModal(reason: any){
    this.showingModal = false;
    this.assetId=0;
    if(reason == 'Successfully Saved'){
        this.getAssetData();
    }
}






}
