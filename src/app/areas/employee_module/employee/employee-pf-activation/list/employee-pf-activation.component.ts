import { transition, trigger, useAnimation } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { fadeIn, fadeInUp, fadeOutLeft, slideInUp } from 'ng-animate';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { ApiArea, ApiController } from 'src/app/shared/constants';
import { CustomModalService } from 'src/app/shared/services/custom-modal.service';
import { HrWebService } from 'src/app/shared/services/hr-web.service';
import { UserService } from 'src/app/shared/services/user.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AreasHttpService } from '../../../../areas.http.service';
import { DatePipe } from '@angular/common';
import { EmployeePFActivationService } from '../employee-pf-activation.service';
import { EmployeeInfoService } from '../../employee-info.service';

@Component({
  selector: 'app-employee-pf-activation',
  templateUrl: './employee-pf-activation.component.html',
  animations: [
    trigger('fadeIn', [transition('void => *', useAnimation(fadeIn, { params: { timing: 0.3 } }))]),
    trigger('slideInUp', [transition('* => *', useAnimation(slideInUp, { params: { timing: 0.5 } }))]),
    trigger('fadeInUp', [transition('void => *', useAnimation(fadeInUp))]),
    trigger('fadeOutLeft', [transition('* => void', useAnimation(fadeOutLeft, { params: { timing: 0.3 } }))]),
  ],
})
export class EmployeePfActivationComponent implements OnInit {

  modalTitle: string = "";
  datePickerConfig: Partial<BsDatepickerConfig> = this.utilityService.datePickerConfig();
  isNgInit = false;
  employeePFActivationPageSize: number = 15;
  employeePFActivationPageNo: number = 1;
  employeePFActivationPageConfig: any = this.userService.pageConfigInit("employeePFActivationData", this.employeePFActivationPageSize, 1, 0);
  pagePrivilege: any = this.userService.getPrivileges();
  constructor(private fb: FormBuilder,
    private areasHttpService: AreasHttpService,
    private userService: UserService,
    public utilityService: UtilityService,
    public modalService: CustomModalService,
    private employeeInfoService: EmployeeInfoService,
    private datepipe: DatePipe, private employeePFActivationService: EmployeePFActivationService) { }

  ngOnInit(): void {
    this.loadConfirmedEmployeeDropdown();
    this.getEmployeePFActivation(1);
  }

  logger(msg: any, options: any) {
    this.utilityService.consoleLog(msg, options);
  }

  User() {
    return this.userService.User();
  }

  select2Options = this.utilityService.select2Config();

  searchForm: FormGroup;

  searchFormInit() {
    this.searchForm = this.fb.group({

    })
  }


  ddlSearchByEmployee: any[];
  loadConfirmedEmployeeDropdown() {
    this.employeeInfoService.loadDropdownData({});
    this.employeeInfoService.ddl_employee_data$.subscribe(data => {
    this.employeeInfoService.loadDropdown(data);
    this.ddlSearchByEmployee = this.employeeInfoService.ddl$;
    }, error => {
    console.error('Error while fetching data:', error);
    });
  }

  getEmployeesPFActivation<T>(notEmployee: number = 0, designationId: number = 0, departmentId: number = 0, sectionId: number = 0, subsectionId: number = 0): Promise<T> {
    return this.areasHttpService.promise_get<T>((ApiArea.hrms + ApiController.employees + "/GetEmployeesPFActivation"),
      {
        responseType: "json",
        params: {
          notEmployee: notEmployee, designationId: designationId, departmentId: departmentId,
          sectionId: sectionId, subsectionId: subsectionId
        }
      });
  }

  ddlPFBasedAmount: any[] = []
  ddlSearchByPFBasedAmount: any[] = []
  loadPFBasedAmount(type: string) {
    this.ddlPFBasedAmount = [];
    this.ddlSearchByPFBasedAmount = [];
    this.employeePFActivationService.loadBaseAmountDropdown({ pfBasedAmount: type }).then(data => {
      this.ddlSearchByPFBasedAmount = data;
    }, (error) => {
      this.utilityService.httpErrorHandler(error);
    })

  }

  getPFBasedAmountExtension<T>(type: string): Promise<T> {
    return this.areasHttpService.promise_get<T>((ApiArea.hrms + ApiController.employees + "/GetPFBasedAmountExtension"), {
      responseType: "json",
      params: {
        pfBasedAmount: type
      }
    });
  }


  ddlSearchByStatus: any[] = [];

  searchByEmployee: any = 0
  searchByStatus: any = ''
  searchByBasedAmount: any = ''

  listOfEmployeePFActivation: any[] = [];
  employeePFActivationDTLabel: string = null;

  onEmployeeChanged() {
    if (this.isNgInit) {
      this.getEmployeePFActivation(1);
    }
    this.isNgInit = true;
    console.log("searchByEmployee >>>", this.searchByEmployee);
  }

  employeePFActivationPageChanged(event: any) {
    this.employeePFActivationPageNo = event;
    this.getEmployeePFActivation(this.employeePFActivationPageNo);
  }

  searchByDate: any[] = [];
  getEmployeePFActivation(pageNo: number) {
    let fromDate;
    let toDate;
    if (this.searchByDate?.length > 0) {
      this.logger("this.searchByDate>>>", this.datepipe.transform(this.searchByDate[0], 'yyyy-MM-dd'));
      fromDate = this.datepipe.transform(this.searchByDate[0], 'yyyy-MM-dd');
      toDate = this.datepipe.transform(this.searchByDate[1], 'yyyy-MM-dd');
    }

    this.employeePFActivationPageNo = pageNo;
    this.listOfEmployeePFActivation = [];
    let params = { employeeId: this.utilityService.IntTryParse(this.searchByEmployee), basedAmount: this.searchByBasedAmount, stateStatus: this.searchByStatus, fromDate: fromDate ?? '', toDate: toDate ?? '', pageSize: this.employeePFActivationPageSize, pageNumber: pageNo };

    this.employeePFActivationService.get(params).subscribe(response => {
      var res = response as any;
      this.listOfEmployeePFActivation = res.body;
      this.employeePFActivationDTLabel = this.listOfEmployeePFActivation.length == 0 ? 'No record(s) found' : null;
      var xPaginate = JSON.parse(res.headers.get('X-Pagination'));
      this.employeePFActivationPageConfig = this.userService.pageConfigInit("employeePFActivationData", xPaginate.itemsPerPage, xPaginate.currentPage, xPaginate.totalItems);
    }, (error) => {
      this.utilityService.fail(error);
    })

    // this.areasHttpService.observable_get<any[]>((ApiArea.hrms + ApiController.employees + "/GetEmployeePFActivationList"), {
    //   responseType: "json", observe: 'response', params: params
    // }).subscribe((response) => {
    //   var res = response as any;
    //   this.listOfEmployeePFActivation = res.body;
    //   this.employeePFActivationDTLabel = this.listOfEmployeePFActivation.length == 0 ? 'No record(s) found' : null;
    //   var xPaginate = JSON.parse(res.headers.get('X-Pagination'));
    //   this.employeePFActivationPageConfig = this.userService.pageConfigInit("employeePFActivationData", xPaginate.itemsPerPage, xPaginate.currentPage, xPaginate.totalItems);

    // },
    //   (error) => { console.log(error) }
    // )
  }

  modalObj: any = null;
  showPFActivationModal: boolean = false;
  pfActivationId: number = 0;
  openPFActivationModal(id: number) {
    this.showPFActivationModal = true;
    this.pfActivationId = id;
    console.log("employeePFActivation id>>>>> " + id);
  }

  closePFActivationModal(reason: any) {
    this.showPFActivationModal = false;
    this.pfActivationId = 0;
    if (reason == 'Save Complete') {
      this.getEmployeePFActivation(this.employeePFActivationPageNo);
    }
  }

  //Upload PF-Activation Excel File
  showUploadPFActivationModal: boolean = false;
  openUploadExcelFileModal() {
    this.showUploadPFActivationModal = true;
    this.modalTitle = "Upload Excel File";
  }

  closeUploadExcelFileModal(reason: any) {
    this.pfActivationId = 0;
    this.showUploadPFActivationModal = false;
    if (reason == 'Save Complete') {
      this.getEmployeePFActivation(1);
    }
  }

  //Approval PF Activation
  showApprovalPFActivationModal: boolean = false;
  approvalData: any;
  openApprovalPFActivationModal(id: number) {
    this.showApprovalPFActivationModal = true;
    this.pfActivationId = id;
    console.log("this.listOfEmployeePFActivation >>>", this.listOfEmployeePFActivation);
    this.approvalData = Object.assign({}, this.listOfEmployeePFActivation.find(item => item.pfActivationId == id));
    console.log("this.approvalData >>>", this.approvalData)
    console.log("employeePFActivation id>>>>> ", id);
  }

  closeApprovalPFActivationModal(reason: any) {
    this.showApprovalPFActivationModal = false;
    this.approvalData = 0;
    this.pfActivationId = 0;
    if (reason == 'Save Complete') {
      this.getEmployeePFActivation(1);
    }
  }

}
