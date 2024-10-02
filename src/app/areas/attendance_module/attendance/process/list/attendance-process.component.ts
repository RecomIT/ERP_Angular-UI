import * as XLSX from 'xlsx';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { UserService } from 'src/app/shared/services/user.service';
import { HrWebService } from 'src/app/shared/services/hr-web.service';
import { bounceIn, fadeIn, fadeInRight, slideInUp } from 'ng-animate';
import { transition, trigger, useAnimation } from '@angular/animations';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AttendanceProcessService } from '../attendance-process.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CustomModalService } from 'src/app/shared/services/custom-modal.service';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { EmployeeInfoService } from 'src/app/areas/employee_module/employee/employee-info.service';

@Component({
  selector: 'attendance-module-process',
  templateUrl: './attendance-process.component.html',
  animations: [
    trigger('slideInUp', [transition('* => *', useAnimation(slideInUp, { params: { timing: 0.5 } }))]),
    trigger('fadeIn', [transition('void => *', useAnimation(fadeIn, { params: { timing: 0.3 } }))]),
    trigger('fadeInRight', [transition('void => *', useAnimation(fadeInRight, { params: { timing: 0.5 } }))]),
    trigger('bounceIn', [transition('void => *', useAnimation(bounceIn, { params: { timing: 1 } }))]),
  ],
})
export class AttendanceProcessComponent implements OnInit {

  @ViewChild("attendanceProcessModal", { static: false }) attendanceProcessModal !: ElementRef;
  @ViewChild("uploadAttendanceRowModal", { static: false }) uploadAttendanceRowModal !: ElementRef;
  datePickerConfig: Partial<BsDatepickerConfig> = this.utilityService.datePickerConfig();
  constructor(private fb: FormBuilder,
    private utilityService: UtilityService,
    private hrWebService: HrWebService,
    private employeeInfoService: EmployeeInfoService,
    private userService: UserService,
    private attendanceProcessService: AttendanceProcessService,
    public modalService: CustomModalService) { }
  pagePrivilege: any = this.userService.getPrivileges();
  year: any[] = this.utilityService.getYears(2);
  ngOnInit(): void {
    this.getAttendanceProcessInfo();
  }

  logger(msg: any, options: any) {
    this.utilityService.consoleLog(msg, options);
  }

  User = this.userService.User();

  attendanceProcessForm: FormGroup;
  formArray: any;

  validationMessages = {
    'month': {
      'min': 'Month is required'
    },
    'year': {
      'min': 'Year is required'
    },
    'fromDate': {
      'required': 'Fromdate is required'
    },
    'toDate': {
      'required': 'Todate is required'
    },
    'dateGroup': {
      'wrongDate': 'Todate must be >= Fromdate',
    }
  };

  formErrors = {
    'month': '',
    'year': '',
    'fromDate': '',
    'toDate': '',
    'dateGroup': '',
  }

  formErrorLogged(formGroup: FormGroup = this.attendanceProcessForm) {
    Object.keys(formGroup.controls).forEach((key: string) => {
      const abstractControl = formGroup.get(key);
      this.formErrors[key] = '';
      if (!abstractControl.valid && (abstractControl.touched || abstractControl.dirty)) {

        const messages = this.validationMessages[key];
        for (const errorKey in abstractControl.errors) {
          this.formErrors[key] += messages[errorKey];
        }
      }
      if (abstractControl instanceof FormGroup) {
        this.formErrorLogged(abstractControl);
      }
    })
  }

  attendanceProcessFormInit() {
    this.attendanceProcessForm = this.fb.group({
      month: new FormControl(0, [Validators.min(1)]),
      year: new FormControl(0, [Validators.min(1)]),
      dateGroup: new FormGroup({
        fromDate: new FormControl(null, [Validators.required]),
        toDate: new FormControl(null, [Validators.required]),
      }, { validators: wrongDate }),

      selectedEmployee: new FormControl(null),
      createdBy: new FormControl(this.User.UserId),
      companyId: new FormControl(this.User.ComId),
      branchId: new FormControl(this.User.BranchId),
      organizationId: new FormControl(this.User.OrgId),
      checkAll: new FormControl(),
      employees: this.fb.array([]),
    })
    this.formArray = (<FormArray>this.attendanceProcessForm.get('employees')).controls;

    this.employeeInfoService.getServiceData({}).then(data => {
      data.forEach(element => {
        this.formArray.push(this.fb.group({
          isChecked: new FormControl(false),
          employeeId: new FormControl(element.employeeId),
          employeeName: new FormControl(element.employeeName),
          isActive: new FormControl(element.isActive)
        }));
      });
    })
    
    this.attendanceProcessForm.valueChanges.subscribe((form) => {
      this.formErrorLogged();
      if (form.month != null && form.month != '' && form.year != null && form.year != '') {
        this.datePickerConfig.minDate = this.utilityService.getFirstDate(parseInt(form.month), parseInt(form.year));
        this.datePickerConfig.maxDate = this.utilityService.getLastDate(parseInt(form.month), parseInt(form.year));

      }
    })
  }

  openAttendanceProcessModal() {
    this.attendanceProcessFormInit();
    this.modalService.open(this.attendanceProcessModal, "lg");
  }

  allEmployeeChecked() {
    const allChecked = this.attendanceProcessForm.get('checkAll').value;
    const employees = this.attendanceProcessForm.controls.employees as FormArray;
    let selectedEmployee = "";
    employees.controls.forEach((formGroupItem: any) => {
      formGroupItem.controls.isChecked.setValue(allChecked);
      if (allChecked) {
        selectedEmployee += formGroupItem.controls.employeeId.value + ",";
      }
    })
    selectedEmployee = selectedEmployee != "" ? selectedEmployee.substring(0, selectedEmployee.length - 1) : "";
    this.attendanceProcessForm.get('selectedEmployee').setValue(selectedEmployee);
  }

  searchEmpfilter: string = null;
  checkSingleEmployee() {
    const employees = this.attendanceProcessForm.controls.employees as FormArray;
    let count = employees.controls.filter(s => s.get('isChecked').value == true).length;
    this.attendanceProcessForm.get('checkAll').setValue((count == employees.length ? true : false));

    let checkedEmployee = employees.controls.filter(s => s.get('isChecked').value == true);
    let selectedEmployee = "";
    checkedEmployee.forEach((formGroup: any) => {
      selectedEmployee += formGroup.controls.employeeId.value + ",";
    })

    selectedEmployee = selectedEmployee != "" ? selectedEmployee.substring(0, selectedEmployee.length - 1) : "";
    this.attendanceProcessForm.get('selectedEmployee').setValue(selectedEmployee);
  }

  btnAttendanceProcess: boolean = false;

  runAttendanceProcess() {
    if (this.attendanceProcessForm.valid) {
      this.btnAttendanceProcess = true;
      var processData = {
        month: parseInt(this.attendanceProcessForm.controls.month.value),
        year: parseInt(this.attendanceProcessForm.controls.year.value),
        fromDate: this.attendanceProcessForm.get('dateGroup').get('fromDate').value,
        toDate: this.attendanceProcessForm.get('dateGroup').get('toDate').value,
        selectedEmployees: this.attendanceProcessForm.controls.selectedEmployee.value
      }

      this.attendanceProcessService.process(processData).subscribe(response => {
        this.btnAttendanceProcess = false;
        if (response.status) {
          this.attendanceProcessForm.reset();
          this.utilityService.success(response.msg, "Server Response");
          this.modalService.service.dismissAll();
          this.getAttendanceProcessInfo();
        }
        else {
          if (response.msg == "Validation Error") {
            this.utilityService.fail("Validation Error", "Server Response")
          }
          else {
            this.utilityService.fail(response.msg, "Server Response")
          }
        }
      }, (error) => {
        this.btnAttendanceProcess = false;
        console.log("error >>>", error);
        this.utilityService.fail("Something went wrong", 'Server Response');
      })
    }
    else {
      this.utilityService.fail("Invalid Form", "Site Response");
    }
  }

  listOfAttendanceInfo: any[] = [];
  attendanceInfoDTLabel: string = null;
  searchByMonth: number = 0;
  searchByYear: number = 0;

  getAttendanceProcessInfo() {
    this.listOfAttendanceInfo = [];
    let params = { month: this.searchByMonth, year: this.searchByYear }
    this.attendanceProcessService.get(params).subscribe(response => {
      this.listOfAttendanceInfo = response.body as any[];
    }, (error) => {
      console.log("error >>>", error);
      this.utilityService.fail("Somethign went wrong", 'Server Response');
    })
  }

  disabledAllLocked: boolean = false;
  LockUnlockAttendanceProcess(processId: number, month: number, year: number, lock: boolean) {
    var params = {
      attendanceProcessId: processId, month: month, year: year,
      isLocked: lock ? "True" : "False"
    };

    this.disabledAllLocked = true;
    if (lock) {
      this.attendanceProcessService.lock(params).subscribe(response => {
        if (response.status) {
          this.utilityService.success(response.msg, "Server Response");
          this.getAttendanceProcessInfo();
        }
        else {
          if (response.msg == "Validation Error") {
            this.utilityService.fail("Validation Error", "Server Response")
          }
          else {
            this.utilityService.fail(response.msg, "Server Response")
          }
        }
        this.disabledAllLocked = false;
      }, (error) => {
        this.disabledAllLocked = false;
        console.log("error >>>", error);
        this.utilityService.fail("Something went wrong", "Server Response")
      })
    }
    else {
      this.attendanceProcessService.unlock(params).subscribe(response => {
        if (response.status) {
          this.utilityService.success(response.msg, "Server Response");
          this.getAttendanceProcessInfo();
        }
        else {
          if (response.msg == "Validation Error") {
            this.utilityService.fail("Validation Error", "Server Response")
          }
          else {
            this.utilityService.fail(response.msg, "Server Response")
          }
        }
        this.disabledAllLocked = false;
      }, (error) => {
        this.disabledAllLocked = false;
        console.log("error >>>", error);
        this.utilityService.fail("Something went wrong", "Server Response")
      })
    }
  }

  uploadAttendanceForm: FormGroup;

  uploadAttendanceFormInit() {
    this.uploadAttendanceForm = this.fb.group({
      processDate: new FormControl(null),
      excelFile: new FormControl(null, [Validators.required])
    })
    this.excelFileName = "Choose Your excel file";
    this.uploadAttendanceForm.reset()
  }

  openAttendanceRowDataUpload() {
    this.uploadAttendanceFormInit();
    this.modalService.open(this.uploadAttendanceRowModal, "lg");
  }

  excelJsonData: any[] = null;
  excelColumn: any[] = null
  excelFileName: string = "Choose Your excel file";
  excelFileUpload(file: any) {
    this.excelJsonData = null;
    this.excelColumn = null;
    this.logger("file", file);
    const selectedFile = (file.target as HTMLInputElement).files[0];
    this.logger("selectedFile", selectedFile);
    if (selectedFile != null && selectedFile != undefined && (this.utilityService.fileExtension(selectedFile.name) == 'xls' || this.utilityService.fileExtension(selectedFile.name) == 'xlsx')) {
      this.excelFileName = selectedFile.name;
      this.uploadAttendanceForm.get('excelFile').setValue(selectedFile);
    }
    else {
      this.excelFileName = "Choose Your excel file";
    }

    const fileReader: FileReader = new FileReader();
    fileReader.onload = (e: any) => {
      const arrayBuffer: any = e.target.result;
      const workbook: XLSX.WorkBook = XLSX.read(arrayBuffer, { type: 'array' });
      const worksheet: XLSX.WorkSheet = workbook.Sheets[workbook.SheetNames[0]];
      this.excelJsonData = XLSX.utils.sheet_to_json(worksheet, {
        raw: false,
        header: 1,
        dateNF: 'd"/"m"/"yyyy',
      });
      this.excelColumn = this.excelJsonData[0];
      this.excelJsonData = this.excelJsonData.slice(1)
      console.log(this.excelColumn);
      console.log(this.excelJsonData);
    };
    fileReader.readAsArrayBuffer(selectedFile);
  }

  json2array(json) {
    var result = [];
    var keys = Object.keys(json);
    keys.forEach(function (key) {
      console.log("json[key] >>>", json[key]);
      result.push(json[key]);
    });
    return result;
  }

  btnUploadExcel: boolean = false;
  submitExcelFile() {
    if (this.uploadAttendanceForm.valid) {
      const formData = new FormData();
      let fromDate = null;
      let toDate = null;
      if (this.uploadAttendanceForm.get('processDate').value != null && this.uploadAttendanceForm.get('processDate').value != '') {
        fromDate = this.uploadAttendanceForm.get('processDate').value.toUTCString();
        toDate = this.uploadAttendanceForm.get('processDate').value.toUTCString();
      }

      formData.append("FromDate", fromDate ?? '')
      formData.append("ToDate", toDate ?? '')
      formData.append("ExcelFile", this.uploadAttendanceForm.get('excelFile').value)

      this.attendanceProcessService.upload(formData).subscribe(response => {
        if (response?.status) {
          this.utilityService.toastr.success(response?.msg, "Server Response");
          this.modalService.service.dismissAll();
        }
        else {
          this.utilityService.toastr.error(response?.msg, "Server Response");
        }
        this.btnUploadExcel = false;
      }, (error) => {
        console.log("error >>>", error);
        this.utilityService.fail('Something went wrong', 'Server Response');
      })
    }
  }

}


function wrongDate(group: AbstractControl): { [key: string]: any } | null {
  let fromDate = group.get('fromDate').value != null ? new Date(group.get('fromDate').value) : null;
  fromDate = fromDate != null && fromDate.getFullYear() == 1970 ? null : fromDate;
  let toDate = group.get('toDate').value != null ? new Date(group.get('toDate').value) : null;
  toDate = toDate != null && toDate.getFullYear() == 1970 ? null : toDate;
  let fromDateWithoutTime = fromDate == null ? null : new Date(fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate());
  let toDateWithoutTime = toDate == null ? null : new Date(toDate.getFullYear(), toDate.getMonth(), toDate.getDate());
  if (fromDateWithoutTime === null || toDateWithoutTime == null || fromDateWithoutTime <= toDateWithoutTime) {
    return null;
  }
  else {
    return { 'wrongDate': true };
  }
}