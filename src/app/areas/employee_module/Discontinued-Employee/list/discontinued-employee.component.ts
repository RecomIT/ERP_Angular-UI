import { transition, trigger, useAnimation } from "@angular/animations";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { bounceIn, fadeIn, fadeInRight, slideInUp } from "ng-animate";
import { UtilityService } from "src/app/shared/services/utility.service";
import { DiscontinuedEmployeeService } from "../discontinued-employee.service";
import { UserService } from "src/app/shared/services/user.service";
import { BsDatepickerConfig } from "ngx-bootstrap/datepicker";
import { EmployeeInfoService } from "../../employee/employee-info.service";
import { release } from "os";

@Component({
    selector:'employee-module-discontinued-employee',
    templateUrl:'./discontinued-employee.component.html',
    animations: [
        trigger('slideInUp', [transition('* => *', useAnimation(slideInUp, { params: { timing: 0.5 } }))]),
        trigger('fadeIn', [transition('void => *', useAnimation(fadeIn, { params: { timing: 0.3 } }))]),
        trigger('fadeInRight', [transition('void => *', useAnimation(fadeInRight, { params: { timing: 0.5 } }))]),
        trigger('bounceIn', [transition('void => *', useAnimation(bounceIn, { params: { timing: 1 } }))]),
      ]
})
export class DiscontinuedEmployeeComponent implements OnInit {


    datePickerConfig: Partial<BsDatepickerConfig> = this.utilityService.datePickerConfig();
    select2Config: any = this.utilityService.select2Config();
  
    pageNo: number = 1;
    pageSize: number = 15;
    pageConfig = this.userService.pageConfigInit("data_list", this.pageSize, 1, 0);
  
    constructor(private fb: FormBuilder, private utilityService: UtilityService,
      private userService: UserService, private discontinuedEmployeeService: DiscontinuedEmployeeService,
      private employeeInfoService: EmployeeInfoService) { }
  
  
    ngOnInit(): void {
      this.searchFormInit();
      this.get();
      this.loadEmployeeDropdown();
    }
  
    select2Options: any = this.utilityService.select2Config();
    list: any[] = [];
  
    list_loading_label: string = null;
  
    searchForm: FormGroup;
  
    ddlEmployees: any[];
    loadEmployeeDropdown() {
      this.employeeInfoService.loadDropdownData({});
      this.employeeInfoService.ddl_employee_data$.subscribe(data => {
        this.employeeInfoService.loadDropdown(data);
        this.ddlEmployees = this.employeeInfoService.ddl$;
      }, error => {
        console.error('Error while fetching data:', error);
      });
    }
  
    list_pageChanged(event: any) {
      this.pageNo = event;
      this.searchForm.get('pageNo').setValue(this.pageNo);
    }
  
    searchFormInit() {
      this.searchForm = this.fb.group({
        employeeId: new FormControl(''),
        stateStatus: new FormControl(''),
        releasetype: new FormControl(''),
        pageNo: new FormControl(this.pageNo),
        pageSize: new FormControl(this.pageSize),
      })
  
      this.searchForm.valueChanges.subscribe(value => {
        this.get()
      })
    }
  
    ddstatus: any[] = this.utilityService.getDataStatus().filter(item=> item == 'Pending' || item == 'Approved' || item == 'Cancelled')
  
    get() {
      this.discontinuedEmployeeService.get(this.searchForm.value).subscribe((response) => {
        this.list = response.body;
        this.list_loading_label = this.list.length == 0 ? 'No record(s) found' : null;
      }, (error) => {
        this.utilityService.fail("Something went wrong", "Server Response");
      })
    }

    isShowingInsertUpdateModal: boolean = false;
    itemId: number = 0;

    showModal(id: number) {
        console.log("id >>>", id);
        this.isShowingInsertUpdateModal = true;
        this.itemId = id;
    }

    closeModal(reason: any) {
        this.isShowingInsertUpdateModal = false;
        this.itemId = 0;
        if (this.utilityService.SuccessfullySaved) {
            this.get();
        }
    }

    isShowingApprovalModal: boolean = false;
    showApprovalModal(id: number) {
        console.log("id >>>", id);
        this.isShowingApprovalModal = true;
        this.itemId = id;
    }

    closeApprovalModal(reason: any) {
        this.isShowingApprovalModal = false;
        this.itemId = 0;
        if (this.utilityService.SuccessfullySaved) {
            this.get();
        }
    }

    isShowingUndoModal: boolean = false;
    item: any;
    showUndoModal(item: any) {
        this.isShowingUndoModal = true;
        this.item = item;
    }

    closeUndoModal(reason: any) {
        this.isShowingUndoModal = false;
        this.item = null;
        this.get();   
    }

  }
  