import { transition, trigger, useAnimation } from "@angular/animations";
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup, NgForm, Validators } from "@angular/forms";
import { bounceIn, fadeIn, fadeInRight, slideInUp } from "ng-animate";
import { BsDatepickerConfig } from "ngx-bootstrap/datepicker";
import { CustomModalService } from "src/app/shared/services/custom-modal.service";
import { PayrollWebService } from "src/app/shared/services/payroll-web.service";
import { UserService } from "src/app/shared/services/user.service";
import { UtilityService } from "src/app/shared/services/utility.service";
import { AreasHttpService } from "../../../areas.http.service";
import { ApiArea, ApiController } from 'src/app/shared/constants';
import { HrWebService } from 'src/app/shared/services/hr-web.service';

@Component({
  selector: 'app-employee-income-tax-zone',
  templateUrl: './employee-income-tax-zone.component.html',
  animations: [
    trigger('slideInUp', [transition('* => *', useAnimation(slideInUp, { params: { timing: 0.5 } }))]),
    trigger('fadeIn', [transition('void => *', useAnimation(fadeIn, { params: { timing: 0.3 } }))]),
    trigger('fadeInRight', [transition('void => *', useAnimation(fadeInRight, { params: { timing: 0.5 } }))]),
    trigger('bounceIn', [transition('void => *', useAnimation(bounceIn, { params: { timing: 1 } }))]),
  ]
})

export class EmployeeIncomeTaxZoneComponent implements OnInit {
  modalTitle: string = "";
  datePickerConfig: Partial<BsDatepickerConfig> = {};
  isNgInit = false;
  employeeeTaxZonePageSize: number = 15;
  employeeeTaxZonePageNo: number = 1;
  employeeeTaxZonePageConfig: any = this.userService.pageConfigInit("employeeeTaxZoneData", this.employeeeTaxZonePageSize, 1, 0);
  pagePrivilege: any= this.userService.getPrivileges();;

  constructor(private fb: FormBuilder, // strongly type form build
    private areasHttpService: AreasHttpService, // http request
    private userService: UserService, // user service user id
    public utilityService: UtilityService, // utility 
    public modalService: CustomModalService, // modal service 
    private hrWebService: HrWebService,
    private payrollWebService: PayrollWebService) {
  }
  ngOnInit(): void {
    this.loadEmployees();
    this.getEmployeeTaxZones(1);
    this.loadTaxZoneNames();
    this.datePickerConfig = Object.assign({}, {
      containerClass: "theme-dark-blue",
      showWeekNumbers: false,
      dateInputFormat: "DD-MMMM-YYYY",
      isAnimated: true,
      showClearButton: false,
      showTodayButton: false,
      todayPosition: "left",
      rangeInputFormat: "DD-MMM-YYYY",
      rangeSeparator: " ~ ",
      size: "sm",
      customTodayClass: 'custom-today-class'
    })
  }

  logger(msg: any, options: any) {
    this.utilityService.consoleLog(msg, options);
  }

  User() {
    return this.userService.User();
  }

  select2Options = {
    width: "100%",
    containerCssClass: "form-control form-control-sm text-x-small font-bold",
    theme: "bootstrap4"
  }

  searchForm: FormGroup;

  searchFormInit() {
    this.searchForm = this.fb.group({
        
    })
  }

  ddlSearchByEmployee: any[] = [];
  ddlSearchByTaxZone: any[] = [];

  searchByTaxZone: any = ''
  searchByEmployee: any = 0
  searchByStatus: any = ''
  listOfEmployeeTaxZones: any[] = [];
  employeeTaxZonesDTLabel: string = null;


  onEmployeeChanged() {
    if (this.isNgInit) {
      this.getEmployeeTaxZones(1);
    }
    this.isNgInit = true;
    console.log("searchByEmployee >>>",this.searchByEmployee);
  }

  employeeTaxZonesPageChanged(event: any) {
    this.employeeeTaxZonePageNo = event;
    this.getEmployeeTaxZones(this.employeeeTaxZonePageNo);
  }

  getEmployeeTaxZones(pageNo: number) {
    let fromDate;
    let toDate;
    this.employeeeTaxZonePageNo = pageNo;
    this.listOfEmployeeTaxZones = [];
    let params = { employeeId: this.utilityService.IntTryParse(this.searchByEmployee), taxZone: this.searchByTaxZone, pageSize: this.employeeeTaxZonePageSize, pageNumber: pageNo };

    this.areasHttpService.observable_get<any[]>((ApiArea.payroll + "/TaxZone" + "/GetEmployeeTaxZones"), {
      responseType: "json", observe: 'response', params: params
    }).subscribe((response) => {
      var res = response as any;
      this.listOfEmployeeTaxZones = res.body;
      this.employeeTaxZonesDTLabel = this.listOfEmployeeTaxZones.length == 0 ? 'No record(s) found' : null;
      var xPaginate = JSON.parse(res.headers.get('X-Pagination'));
      this.employeeeTaxZonePageConfig = this.userService.pageConfigInit("employeeeTaxZoneData", xPaginate.itemsPerPage, xPaginate.currentPage, xPaginate.totalItems);

    },
      (error) => { console.log(error) }
    )
  }

  ddlEmployees: any[] = [];
  loadEmployees() {
    this.ddlSearchByEmployee = [];
    this.hrWebService.getEmployees<any[]>().then((data) => {
      this.ddlSearchByEmployee = data;
    })
  }


  ddlEmployeeTaxZones: any[] = []
  loadTaxZoneNames() {
    this.ddlEmployeeTaxZones = [];
    this.ddlSearchByTaxZone = [];
    this.payrollWebService.getTaxZoneNames<any[]>("General").then((data) => {
      this.ddlEmployeeTaxZones = data;
      this.ddlSearchByTaxZone = data;
      //this.logger("ddlEmployeeTaxZones",this.ddlEmployeeTaxZones);
    })
  }  

  modalObj: any = null;
  showModal: boolean = false;
  employeeTaxZoneId: number = 0;
  openModal(id: number) {
    this.showModal = true;
    this.employeeTaxZoneId = id;
    console.log("employeeTaxZoneId id>>>>> " + id);
  }

  closeModal(reason: string) {
    this.showModal = false;
    this.employeeTaxZoneId = 0;
    if (reason == 'Save Complete') {
      this.getEmployeeTaxZones(this.employeeeTaxZonePageNo);
    }
  }

  //Upload Excel File

  showUploadTaxZoneModal: boolean = false;
  openUploadExcelFileModal() {
    this.showUploadTaxZoneModal = true;
    this.modalTitle = "Upload Excel File";
  }

  closeUploadExcelFileModal(reason: any) {
    this.employeeTaxZoneId = 0;
    this.showUploadTaxZoneModal = false;
    if (reason == 'Save Complete') {
      this.getEmployeeTaxZones(this.employeeeTaxZonePageNo);
    }

  }

}