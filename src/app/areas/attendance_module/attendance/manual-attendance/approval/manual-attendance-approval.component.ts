import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, NgForm } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { ApiArea, ApiController } from 'src/app/shared/constants';
import { CustomModalService } from 'src/app/shared/services/custom-modal.service';
import { HrWebService } from 'src/app/shared/services/hr-web.service';
import { PayrollWebService } from 'src/app/shared/services/payroll-web.service';
import { UserService } from 'src/app/shared/services/user.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AreasHttpService } from '../../../../areas.http.service';

@Component({
  selector: 'app-manual-attendance-approval',
  templateUrl: './manual-attendance-approval.component.html',
})
export class ManualAttendanceApprovalComponent implements OnInit {

  @ViewChild("manualAttendanceApprovalModal", { static: true }) manualAttendanceApprovalModal!: ElementRef;
  modalTitle: string = "";
  manualAttnApprovalPageSize: number = 15;
  manualAttnApprovalPageNo: number = 1;
  datePickerConfig: Partial<BsDatepickerConfig> = {};
  mattCode: string = "";

  ngInIt: boolean = false;

  manualAttnApprovalPageConfig: any = this.userService.pageConfigInit("manualAttn", this.manualAttnApprovalPageSize, 1, 0);

  constructor(private datepipe: DatePipe, private fb: FormBuilder, private areasHttpService: AreasHttpService, private payrollWebService: PayrollWebService, private utilityService: UtilityService, private hrWebService: HrWebService, private userService: UserService, public modalService: CustomModalService, private el: ElementRef) { }

  ngOnInit(): void {
    this.getManualAttendancesApproval(1);
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
    this.loadEmployeesForSearchManualAttendance();
    
  }

  select2Options = {
    width: "100%",
    containerCssClass: "form-control form-control-sm text-x-small font-bold",
    theme: "bootstrap4"
  }

  logger(msg: any, options: any) {
    this.utilityService.consoleLog(msg, options);
  }

  User() {
    return this.userService.User();
  }

  btnManualAttendanceApproval: boolean = false;
  listOfManualAttendanceApproval: any[] = [];
  manualAttendanceApprovalDTLabel: string = null;

  searchByDate: any[] = [];
  searchByReason: string = '';
  searchByRequestFor: string = '';
  searchByStatus: string = '';
  searchByCode: string = '';
  searchByEmployee: any='';

  getManualAttendancesApproval(pageNo: number) {
    let fromDate;
    let toDate;
    this.manualAttnApprovalPageNo = pageNo;

    if (this.searchByDate?.length > 0) {
      this.logger("this.searchByDate>>>", this.datepipe.transform(this.searchByDate[0], 'yyyy-MM-dd'));
      fromDate = this.datepipe.transform(this.searchByDate[0], 'yyyy-MM-dd');
      toDate = this.datepipe.transform(this.searchByDate[1], 'yyyy-MM-dd');
    }

    this.listOfManualAttendanceApproval = [];
    let params = { manualAttendanceCode: this.searchByCode, reason: this.searchByReason, timeRequestFor: this.searchByRequestFor, fromDate: fromDate ?? '', toDate: toDate ?? '', status: this.searchByStatus, employeeId: this.utilityService.IntTryParse(this.searchByEmployee), pageSize: this.manualAttnApprovalPageSize, pageNumber: pageNo };

    this.areasHttpService.observable_get<any[]>((ApiArea.hrms + ApiController.attendance + "/GetEmployeeManualAttendancesInApproval"), {
      responseType: "json", observe: 'response', params: params
    }).subscribe((response) => {
      var res = response as any;
      this.listOfManualAttendanceApproval = res.body;
      this.manualAttendanceApprovalDTLabel = this.listOfManualAttendanceApproval.length == 0 ? 'No record(s) found' : null;
      var xPaginate= JSON.parse(res.headers.get('X-Pagination'));
      this.manualAttnApprovalPageConfig = this.userService.pageConfigInit("manualAttn", xPaginate.itemsPerPage, xPaginate.currentPage, xPaginate.totalItems);
    },
      (error) => { this.logger("error>>>", error) }
    )
  }

  manualAttendanceApprovalItem: any = null;
  openManualAttendancePermission(item: any) {
    this.manualAttendanceApprovalItem = item;
    this.modalService.open(this.manualAttendanceApprovalModal, "lg")
  }

  btnManualAttStatusSubmit: boolean = false;

  submitManualAttendancePermission(form: NgForm, remarks: any, checkStatus: any) {
    if (form.valid && checkStatus.value != '' && remarks.value != '') {
      this.btnManualAttStatusSubmit = true;
      this.areasHttpService.observable_post((ApiArea.hrms + ApiController.attendance + "/SaveManualAttendancePermission"), null, {
        'headers': {
          'Content-Type': 'application/json'
        },
        params: { manualAttendanceId: this.manualAttendanceApprovalItem.manualAttendanceId, status: checkStatus, remarks: remarks}
      }).subscribe((result) => {
        var data = result as any;
        this.btnManualAttStatusSubmit = false;
        if (data.status) {
          this.utilityService.success(data.msg, "Server Response")
          this.modalService.service.dismissAll();
          this.getManualAttendancesApproval(this.manualAttnApprovalPageNo);
        }
        else {
          this.utilityService.fail(data.msg, "Server Response")
        }
      }, (error) => {
        this.utilityService.fail("Something went wrong", "Server Response")
      })
    }
    else {
      this.utilityService.fail("One or More field value is invalid", "Site Response");
    }
  }

  ddlEmployees: any[] = [];
  loadEmployeesForSearchManualAttendance() {
    this.ddlEmployees = [];
    this.hrWebService.getEmployees<any[]>().then((data) => {
      this.ddlEmployees = data;
      this.logger("this.ddlEmployees >>", this.ddlEmployees);
    }).catch(error => {
      this.logger("error>", error);
    })
  }

  searchByEmployeeChanged(){
    if(this.ngInIt){
      this.getManualAttendancesApproval(1);
    }
    this.ngInIt = true;
  }

  manualAttendancePageChanged(event: any) {
    this.manualAttnApprovalPageNo = event;
    this.getManualAttendancesApproval(this.manualAttnApprovalPageNo);
  }
  

}
