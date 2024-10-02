import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { UtilityService } from "src/app/shared/services/utility.service";
import { EmployeeInfoService } from "../../employee-info.service";
import { CustomModalService } from "src/app/shared/services/custom-modal.service";
import { ControlPanelWebService } from "src/app/shared/services/control-panel.service";
import { DesignationService } from "../../../Organizational/designation/designation.service";
import { DepartmentService } from "../../../Organizational/department/department.service";
import { DataLabelService } from "../../../miscellaneous/data-label/data-label.service";
import { DatePipe } from "@angular/common";

@Component({
  selector: 'app-employee-module-download-employee-info-modal',
  templateUrl: './download-employee-info-modal.component.html'
})
export class DownloadEmployeeInfoModalComponent implements OnInit {

  @ViewChild('downloadEmployeeInfoModal', { static: true }) downloadEmployeeInfoModal!: ElementRef;

  @Output() closeModalEvent = new EventEmitter<string>();
  modalTitle: string = "Download Employee Information";

  constructor(
    private fb: FormBuilder,
    private utilityService: UtilityService,
    private modalService: CustomModalService,
    private employeeInfoService: EmployeeInfoService,
    private controlPanelWebService: ControlPanelWebService,
    private desingationService: DesignationService,
    private departmentService: DepartmentService,
    private dataLabelService: DataLabelService,
    private datePipe: DatePipe

  ) { }

  datePickerConfig: any = this.utilityService.datePickerConfig();

  ngOnInit(): void {
    this.formInit();
    this.loadDataLabel();
    this.loadBranch();
    this.loadDesignation();
    this.loadDepartment();
  }

  ddlBranch: any[] = [];
  loadBranch() {
    this.ddlBranch = [];
    this.controlPanelWebService.getBranchExtension<any[]>("7").then((data) => {
      this.ddlBranch = data;
    })
  }

  ddlDesignation: any;
  loadDesignation() {
    this.desingationService.loadDesignationDropdown();
    this.desingationService.ddl$.subscribe(data => {
      this.ddlDesignation = data;
    });
  }

  ddlDepartment: any;
  loadDepartment() {
    this.departmentService.loadDepartmentDropdown();
    this.ddlDepartment = this.departmentService.ddl$;
  }

  columns: any = [];
  loadDataLabel() {
    this.dataLabelService.get({ label: "Employee Info" }).subscribe({
      next: (response) => {
        this.columns = response;
        this.addColumns();
      },
      error: (err) => {
      },
    })
  }


  form: FormGroup;
  formArray: any;

  types_of_merital: any[] = this.utilityService.getMaritals();
  types_of_jobStatus: any[] = [{ value: '1', text: 'Active' }, { value: '0', text: 'Inactive' }];
  types_of_status: any[] = this.utilityService.getDataStatus();
  types_of_gender: any[] = this.utilityService.getGenders();
  types_of_bloodGroup: any[] = this.utilityService.getBloodGroup();
  type_of_religion: any[] = this.utilityService.getReligions();


  formInit() {
    this.form = this.fb.group({
      name: new FormControl(''),
      id: new FormControl(''),
      branchId: new FormControl(0),
      joiningDate: new FormControl(null),
      status: new FormControl(''),
      jobStaus: new FormControl(''),
      department: new FormControl(0),
      designation: new FormControl(0),
      maritalStatus: new FormControl(''),
      religion: new FormControl(''),
      bloodGroup: new FormControl(''),
      gender: new FormControl(''),
      serviceLength: new FormControl(0),
      age: new FormControl(0),
      terminationDate: new FormControl(null),
      dateOfBirth: new FormControl(null),
      isCheckedAll: new FormControl(false),
      columns: this.fb.array([])
    });

    this.formArray = (<FormArray>this.form.get('columns')).controls;
    this.addColumns();
    this.modalService.open(this.downloadEmployeeInfoModal, "xl");
  }

  item_Checked(event: any) {
    let checkedItems = 0;
    this.formArray.forEach((fg) => {
      if (fg instanceof FormGroup) {
        let formGroup = fg as FormGroup;
        let formControlValue = formGroup.get('isChecked').value;
        if (formControlValue) {
          checkedItems = checkedItems + 1;
        }
      }
    });

    const formArrayLength = (this.formArray as FormArray).length;
    if (checkedItems == formArrayLength) {
      this.form.get('isCheckedAll').setValue(true);
    }
    else {
      this.form.get('isCheckedAll').setValue(false);
    }
  }

  checkAll(event: any) {
    let isChecked = event.target.checked;
    this.formArray.forEach((fg) => {
      if (fg instanceof FormGroup) {
        let formGroup = fg as FormGroup;
        formGroup.get('isChecked').setValue(isChecked);
      }
    })
  }

  addColumns() {
    this.columns.forEach((item, index) => {
      this.formArray.push(this.fb.group({
        displayName: new FormControl(item.text),
        alias: new FormControl(item.value),
        isChecked: new FormControl(false),
      }))
    })
  }


  closeModal(reason: string) {
    this.modalService.service.dismissAll(reason);
    this.closeModalEvent.emit(reason);
  }

  list: any[] = [];
  jsonKeys: any[] = [];
  btnSearch: boolean = false;
  showData() {
    if (this.btnSearch == false) {
      this.btnSearch = true;
      let params = this.getParams();
      this.list = [];
      this.jsonKeys = [];
      this.employeeInfoService.postEmployeeInfoInDynamicReport(params).subscribe(response => {
        var res = response as any;
        this.list = res;
        if (this.list.length > 0) {
          let maxPropertiesCount = -1;
          let maxPropertiesIndex = -1;
          this.list.forEach((obj, index) => {
            const propertiesCount = Object.keys(obj).length;
            if (propertiesCount > maxPropertiesCount) {
              maxPropertiesCount = propertiesCount;
              maxPropertiesIndex = index;
            }
          });
          this.jsonKeys = Object.keys(this.list[maxPropertiesIndex]);
          this.btnSearch = false;
        }
      }, (error) => {
        this.btnSearch = false;
      })
    }
  }

  getParams() {
    let joiningDates = this.form.get('joiningDate').value
    let joiningDateFrom = joiningDates != "" && joiningDates != null ? this.datePipe.transform(joiningDates[0], "yyyy-MM-dd") : "";
    let joiningDateTo = joiningDates != "" && joiningDates != null ? this.datePipe.transform(joiningDates[1], "yyyy-MM-dd") : "";

    let terminationDates = this.form.get('terminationDate').value
    let terminationDateFrom = terminationDates != "" && terminationDates != null ? this.datePipe.transform(terminationDates[0], "yyyy-MM-dd") : "";
    let terminationDateTo = terminationDates != "" && terminationDates != null ? this.datePipe.transform(terminationDates[1], "yyyy-MM-dd") : "";

    let dateOfBirth = this.form.get('dateOfBirth').value
    let dateOfBirthFrom = dateOfBirth != "" && dateOfBirth != null ? this.datePipe.transform(dateOfBirth[0], "yyyy-MM-dd") : "";
    let dateOfBirthTo = dateOfBirth != "" && dateOfBirth != null ? this.datePipe.transform(dateOfBirth[1], "yyyy-MM-dd") : "";

    var params = {
      id: this.form.get('id').value,
      name: this.form.get('name').value,
      branchId: this.form.get('branchId').value.toString(),
      dateOfJoiningFrom: joiningDateFrom,
      dateOfJoiningTo: joiningDateTo,
      status: this.form.get('status').value,
      jobStatus: this.form.get('jobStaus').value,
      departmentId: this.form.get('department').value.toString(),
      designationId: this.form.get('designation').value.toString(),
      maritalStatus: this.form.get('maritalStatus').value,
      religion: this.form.get('religion').value,
      bloodGroup: this.form.get('bloodGroup').value != null && this.form.get('bloodGroup').value != "" ? encodeURIComponent(this.form.get('bloodGroup').value) : "",
      gender: this.form.get('gender').value,
      serviceLength: this.utilityService.FloatTryParse(this.form.get('serviceLength').value).toString(),
      age: this.utilityService.FloatTryParse(this.form.get('age').value).toString(),
      lastWorkingDateFrom: terminationDateFrom,
      lastWorkingDateTo: terminationDateTo,
      dateOfBirthFrom: dateOfBirthFrom,
      DateOfBirthTo: dateOfBirthTo,
      columns: [],
      columnsJson: ""
    };

    this.formArray.forEach((item, index) => {
      if (item instanceof FormGroup) {
        let formGroup = item as FormGroup;
        if (formGroup.get('isChecked').value == true) {
          params.columns.push({
            Key: formGroup.get('alias').value,
            Value: formGroup.get('displayName').value
          });
        }
      }
    })

    params.columnsJson = params.columns.length > 0 ? JSON.stringify(params.columns) : null;
    return params;
  }

  postParams() {
    let joiningDates = this.form.get('joiningDate').value
    let joiningDateFrom = joiningDates != "" && joiningDates != null ? this.datePipe.transform(joiningDates[0], "yyyy-MM-dd") : "";
    let joiningDateTo = joiningDates != "" && joiningDates != null ? this.datePipe.transform(joiningDates[1], "yyyy-MM-dd") : "";

    let terminationDates = this.form.get('terminationDate').value
    let terminationDateFrom = terminationDates != "" && terminationDates != null ? this.datePipe.transform(terminationDates[0], "yyyy-MM-dd") : "";
    let terminationDateTo = terminationDates != "" && terminationDates != null ? this.datePipe.transform(terminationDates[1], "yyyy-MM-dd") : "";

    let dateOfBirth = this.form.get('dateOfBirth').value
    let dateOfBirthFrom = dateOfBirth != "" && dateOfBirth != null ? this.datePipe.transform(dateOfBirth[0], "yyyy-MM-dd") : "";
    let dateOfBirthTo = dateOfBirth != "" && dateOfBirth != null ? this.datePipe.transform(dateOfBirth[1], "yyyy-MM-dd") : "";
    let formDate = new FormData();

    formDate.append("Id", this.form.get('id').value);
    formDate.append("Name", this.form.get('name').value);
    formDate.append("BranchId", this.form.get('branchId').value);
    formDate.append("designationId", this.form.get('designationId').value);
    formDate.append("departmentId", this.form.get('departmentId').value);
    formDate.append("dateOfJoiningFrom", joiningDateFrom);
    formDate.append("dateOfJoiningTo", joiningDateTo);
    formDate.append("status", this.form.get('status').value);
    formDate.append("jobStaus", this.form.get('jobStaus').value);
    formDate.append("serviceLength", this.utilityService.IntTryParse(this.form.get('serviceLength').value).toString());
    formDate.append("gender", this.form.get('gender').value);
    formDate.append("maritalStatus", this.form.get('maritalStatus').value);
    formDate.append("age", this.utilityService.IntTryParse(this.form.get('age').value).toString());
    formDate.append("lastWorkingDateFrom", terminationDateFrom);
    formDate.append("lastWorkingDateTo", terminationDateTo);
    formDate.append("dateOfBirthFrom", dateOfBirthFrom);
    formDate.append("dateOfBirthTo", dateOfBirthTo);
    formDate.append("religion", this.form.get('religion').value);
    formDate.append("bloodGroup", this.form.get('bloodGroup').value);

    let columns = [];
    this.formArray.forEach((item, index) => {
      if (item instanceof FormGroup) {
        let formGroup = item as FormGroup;
        if (formGroup.get('isChecked').value == true) {
          columns.push({
            Key: formGroup.get('alias').value,
            Value: formGroup.get('displayName').value
          });
        }
      }
    })
    formDate.append("columnsJson", JSON.stringify(columns));
    return formDate;
  }

  btnReport: boolean = false;
  download() {
    if (this.btnReport == false) {
      this.btnReport = true;
      let params = this.getParams();
      this.employeeInfoService.postDownloadEmployeeInfoInDynamicReport(params).subscribe((response) => {
        if (response instanceof Blob) {
          if (response.size > 0) {
            this.utilityService.downloadFile(response, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', "EmployeeInformation.xlsx")
          }
        }
        else {
          this.utilityService.fail('No data available for report generation', "Server Response");
        }
        this.btnReport = false;
      }, (error) => {
        this.btnReport = false;
      })
    }
  }

  btnSubmit: boolean = false;
  downloadExcel() {
    let checkedItems = this.form.get('downloadEmployeeInfos').value.filter(item => item.value == true);
    console.log("checkedItems >>>", checkedItems);
    this.employeeInfoService.downloadEmployeesInfo(checkedItems)
      .subscribe((response: any) => {
        console.log("response >>>", response);
        if (response.body.size > 0) {
          this.utilityService.downloadFile(response.body, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', "EmployeeInfo.xlsx")
        }
        else {
          this.utilityService.warning("No Excel File found");
        }
      }, (error) => {
        this.utilityService.fail("Something went wrong", "Server Response")
      })
  }

}
