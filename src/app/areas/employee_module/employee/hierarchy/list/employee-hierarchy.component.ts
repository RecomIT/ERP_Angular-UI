import { DatePipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { BsDatepickerConfig } from "ngx-bootstrap/datepicker";
import { AreasHttpService } from "src/app/areas/areas.http.service";
import { ApiArea } from "src/app/shared/constants";
import { CustomModalService } from "src/app/shared/services/custom-modal.service";
import { HrWebService } from "src/app/shared/services/hr-web.service";
import { UserService } from "src/app/shared/services/user.service";
import { UtilityService } from "src/app/shared/services/utility.service";
import { ToastrService } from 'ngx-toastr';
import { transition, trigger, useAnimation } from "@angular/animations";
import { fadeIn, fadeInUp, fadeOutLeft, slideInUp } from "ng-animate";
import { EmployeeInfoService } from "../../employee-info.service";

@Component({
  selector: 'app-employee-hierarchy',
  templateUrl: './employee-hierarchy.component.html',
  animations: [
    trigger('fadeIn', [transition('void => *', useAnimation(fadeIn, { params: { timing: 0.3 } }))]),
    trigger('slideInUp', [transition('* => *', useAnimation(slideInUp, { params: { timing: 0.5 } }))]),
    trigger('fadeInUp', [transition('void => *', useAnimation(fadeInUp))]),
    trigger('fadeOutLeft', [transition('* => void', useAnimation(fadeOutLeft, { params: { timing: 0.3 } }))]),
  ],
})
export class EmployeeHierarchyComponent implements OnInit {

  modalTitle: string = "";
  datePickerConfig: Partial<BsDatepickerConfig> = this.utilityService.datePickerConfig();
  isNgInit = false;


  constructor(private fb: FormBuilder, // strongly type form build
    private areasHttpService: AreasHttpService, // http request
    private userService: UserService, // user service user id      
    public utilityService: UtilityService, // utility 
    public modalService: CustomModalService, // modal service 
    private employeeInfoService: EmployeeInfoService,
    public toastr: ToastrService,
    private datepipe: DatePipe) { }

  ngOnInit(): void {
    this.loadEmployees();
    this.getEmployeeHierarchy();
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


  ddlSearchByEmployee: any[] = [];
  searchByEmployee: any = 0
  ddlSearchByHierarchy: any[] = [];
  searchByHierarchy: any = ''


  loadEmployees() {
    this.employeeInfoService.loadDropdownData({});
    this.employeeInfoService.ddl_employee_data$.subscribe(data => {
      this.employeeInfoService.loadDropdown(data);
      this.ddlSearchByEmployee = this.employeeInfoService.ddl$;
    }, error => {
      console.error('Error while fetching data:', error);
    });
  }


  onEmployeeChanged() {
    if (this.isNgInit) {
      this.getEmployeeHierarchy();
    }
    this.isNgInit = true;
    console.log("searchByEmployee >>>", this.searchByEmployee);
  }


  employeeHierarchyList: any[] = null;
  getEmployeeHierarchy() {
    let params = { employeeId: this.utilityService.IntTryParse(this.searchByEmployee), hierarchy: this.searchByHierarchy };
    this.areasHttpService.observable_get<any[]>((ApiArea.hrms + "/Employee/Hierarchy" + "/GetEmployeeHierarchy"), {
      responseType: "json", params: params
    }).subscribe(data => {
      this.employeeHierarchyList = data;
      console.log("employeeHierarchyList >>> ", this.employeeHierarchyList)
    })
  }



  showEmployeeHierarchyModal: boolean = false;
  employeeId: number = 0;
  openEmployeeHierarchyModal(id: number) {
    this.showEmployeeHierarchyModal = true;
    this.employeeId = id;
    console.log("employeeHierarchy id>>>>> " + id);
  }

  closeEmployeeHierarchyModal(reason: any) {
    this.showEmployeeHierarchyModal = false;
    this.employeeId = 0;
    if (reason == 'Save Complete') {
      this.getEmployeeHierarchy();
    }
  }




}
