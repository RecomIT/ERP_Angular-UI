import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { ApiArea, ApiController } from 'src/app/shared/constants';
import { CustomModalService } from 'src/app/shared/services/custom-modal.service';
import { HrWebService } from 'src/app/shared/services/hr-web.service';
import { PayrollWebService } from 'src/app/shared/services/payroll-web.service';
import { UserService } from 'src/app/shared/services/user.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { uploadSalaryHeads } from 'src/models/payroll/salary-model';
import { AreasHttpService } from '../../../../areas.http.service';

@Component({
  selector: 'app-upload-salary-component',
  templateUrl: './upload-salary-component.component.html'
})
export class UploadSalaryComponentComponent implements OnInit {

  @ViewChild('uploadExcelFileModal', { static: true }) uploadExcelFileModal!: ElementRef;
  @ViewChild('updateAllowanceModal', { static: true }) updateAllowanceModal!: ElementRef;
  @ViewChild('updateDeductionModal', { static: true }) updateDeductionModal!: ElementRef;

  uploadAllowancePageSize: number = 15;
  uploadAllowancePageNo: number = 1;

  uploadAllowancePageConfig: any = this.userService.pageConfigInit("uploadAllowanceData", this.uploadAllowancePageSize, 1, 0);

  uploadDeductionPageSize: number = 15;
  uploadDeductionPageNo: number = 1;

  uploadDeductionPageConfig: any = this.userService.pageConfigInit("uploadDeductionData", this.uploadDeductionPageSize, 1, 0);
  pagePrivilege: any= this.userService.getPrivileges();
  modalTitle: string = "";
  constructor(private datepipe: DatePipe, private fb: FormBuilder, private areasHttpService: AreasHttpService, private payrollWebService: PayrollWebService, private utilityService: UtilityService, private hrWebService: HrWebService, private userService: UserService, private modalService: CustomModalService) { }

  ngOnInit(): void {
    this.loadAllowances();
    this.loadDeductions();
    this.getUploadAllowances(1);
  }

  logger(msg: any, options: any) {
    this.utilityService.consoleLog(msg, options);
  }

  User() {
    return this.userService.User();
  }

  ddlAllowances: any[] = [];
  loadAllowances() {
    this.ddlAllowances = [];
    this.payrollWebService.getAllowanceNames<any[]>("").then((data) => {
      this.ddlAllowances = data;
      this.logger("ddlAllowances >>>", this.ddlAllowances);
    });
  }

  ddlDeductions: any[] = [];
  loadDeductions() {
    this.ddlDeductions = [];
    this.payrollWebService.getDeductionNames<any[]>("").then((data) => {
      this.ddlDeductions = data;
      this.logger("ddlDeductions", this.ddlDeductions);
    })
  }

  uploadFormGroup: FormGroup;
  formInit() {
    this.uploadFormGroup = this.fb.group({
      salaryComponent: new FormControl('', [Validators.required]),
      allowanceId: new FormControl(0),
      deductionId: new FormControl(0),
      salaryMonthAndYear: new FormControl(''),
      excelFile: new FormControl(null),
      userId: new FormControl(''),
      branchId: new FormControl(''),
      companyId: new FormControl(this.User().ComId),
      organizationId: new FormControl(this.User().OrgId)
    })

    this.uploadFormGroup.get('salaryComponent').valueChanges.subscribe((data) => {
      if (data == "Allowance") {
        this.uploadFormGroup.get("allowanceId").setValue(0);
      }
      else if (data == "Deduction") {
        this.uploadFormGroup.get("deductionId").setValue(0);
      }
    })
  }

  uploadSalaryHead: uploadSalaryHeads = {
    salaryComponent: '',
    allowanceId: 0,
    deductionId: 0,
    salaryMonthAndYear: '',
    excelFile: null
  }

  clearUploadSalaryHeadObj() {
    this.excelFileName = "";
    this.uploadSalaryHead = {
      salaryComponent: '',
      allowanceId: 0,
      deductionId: 0,
      salaryMonthAndYear: '',
      excelFile: null
    };
  }

  excelFileName: string = "Choose Your excel file";
  excelFileUpload(file: any) {
    this.logger("file", file);
    const selectedFile = (file.target as HTMLInputElement).files[0];
    this.logger("selectedFile", selectedFile);
    if (selectedFile != null && selectedFile != undefined && (this.fileExtension(selectedFile.name) == 'xls' || this.fileExtension(selectedFile.name) == 'xlsx')) {
      this.excelFileName = selectedFile.name;
      this.uploadSalaryHead.excelFile = selectedFile;
      this.logger("this.uploadSalaryHead.excelFile >>>", this.uploadSalaryHead.excelFile);
    }
    else {
      this.excelFileName = "Choose Your excel file";
    }
  }

  btnUploadExcel: boolean = false;

  submitUploadExcel(form: NgForm) {
    if (form.valid && this.excelFileName !="Choose Your excel file") {
      this.btnUploadExcel = true;
      const formData = new FormData();
      formData.append("OrganizationId", this.User().OrgId);
      formData.append("CompanyId", this.User().ComId);
      formData.append("UserId", this.User().UserId);
      formData.append("SalaryComponent", this.uploadSalaryHead.salaryComponent);
      formData.append("AllowanceId", this.uploadSalaryHead.allowanceId.toString());
      formData.append("DeductionId", this.uploadSalaryHead.deductionId.toString());
      formData.append("SalaryMonthAndYear", this.uploadSalaryHead.salaryMonthAndYear.toString());
      formData.append("ExcelFile", this.uploadSalaryHead.excelFile);

      this.areasHttpService.observable_post((ApiArea.payroll + "/UploadComponent" + "/UploadExcel"),
        formData, {}).subscribe(result => {
          var data = result as any;
          this.btnUploadExcel = false;
          if (data?.status) {
            this.clearUploadSalaryHeadObj();
            this.modalService.service.dismissAll();
            this.utilityService.success(data.msg, "Server Response");
            if(this.srcSalaryComponent == "Allowance"){
              this.getUploadAllowances(this.uploadAllowancePageNo);
            }
            else{
              this.getUploadDeductions(this.uploadDeductionPageNo);
            }
          }
          else {
            if (data.msg == "Validation Error") {
              this.utilityService.fail("Validation Error", "Server Response", 5000);
            }
            else {
              this.logger("foooo >>>", "foooo");
              this.utilityService.fail(data.msg, "Server Response")
            }
          }
        }, (error) => {
          this.btnUploadExcel = false;
          this.utilityService.fail("Something went wrong", "Server Response");
        })
    }
    else if(this.excelFileName !="Choose Your excel file"){
      this.utilityService.fail("Please select your file")
    }
    else if(this.fileExtension(this.uploadSalaryHead.excelFile.name) != 'xls' || this.fileExtension(this.uploadSalaryHead.excelFile.name) != 'xlsx'){
      this.utilityService.fail("Invalid File format")
    }
    //this.logger("this.uploadSalaryHeads >>>", this.uploadSalaryHead);

  }

  fileExtension(fileName: string) {
    var name = fileName.split('.')
    return name[1].toString();
  }

  openUploadExcelFileModal() {
    this.clearUploadSalaryHeadObj();
    this.modalTitle = "Upload Excel File";
    this.modalService.open(this.uploadExcelFileModal, "sm");
  }

  srcSalaryComponent: string = "Allowance"
  salary_Component_changed(){
    this.listOfUploadAllowances =[];
    this.listOfUploadDeductions =[];
    if(this.srcSalaryComponent =='Allowance'){
      this.uploadAllowancePageNo=1;
      this.getUploadAllowances(1);
    }else{
      this.uploadDeductionPageNo=1;
      this.getUploadDeductions(1);
    }
  }

  // ALlowance

  listOfUploadAllowances: any[] = [];
  uploadAllowancesDTLabel: string = null;
  getUploadAllowances(pageNo: number) {
    this.uploadAllowancePageNo = pageNo;
    this.listOfUploadAllowances = [];
    let params = { pageSize: this.uploadAllowancePageSize, pageNumber: pageNo, companyId: this.User().ComId, organizationId: this.User().OrgId }
    this.areasHttpService.observable_get<any[]>((ApiArea.payroll + "/UploadComponent" + "/GetUploadAllowances"), {
      responseType: "json", observe: 'response', params: params
    }).subscribe((response) => {
      var res = response as any;
      this.listOfUploadAllowances = res.body;
      this.logger("list >>>",this.listOfUploadAllowances);
      this.uploadAllowancesDTLabel = this.listOfUploadAllowances.length == 0 ? 'No record(s) found' : null;
      var xPaginate = JSON.parse(res.headers.get('X-Pagination'));
      this.uploadAllowancePageConfig = this.userService.pageConfigInit("uploadAllowanceData", xPaginate.itemsPerPage, xPaginate.currentPage, xPaginate.totalItems);
    },
      (error) => { console.log(error) }
    )
  }

  uploadedAllowancesPageChanged(event: any) {
    this.uploadAllowancePageNo = event;
    this.getUploadAllowances(this.uploadAllowancePageNo);
  }

  updateAllowanceObj: any= null;
  openUpdateAllowanceModal(uploadId:number,employeeId: number, allowanceNameId: number){
    this.updateAllowanceObj = Object.assign({}, this.listOfUploadAllowances.find(s=> s.id== uploadId && s.employeeId == employeeId && s.allowanceNameId == allowanceNameId))

    this.modalService.open(this.updateAllowanceModal,"sm");

    // this.logger("this.updateAllowanceObj >>>", this.updateAllowanceObj);
  }

  submitUpdateAllowance(form: NgForm){
    if(form.valid && this.updateAllowanceObj.amount > 0){
      this.btnUploadExcel = true;
      this.areasHttpService.observable_post((ApiArea.payroll + ApiController.salary + "/UpdateAllowance"),JSON.stringify(this.updateAllowanceObj), {
        'headers': {
        'Content-Type': 'application/json'
      },}).subscribe(result => {
          var data = result as any;
          this.btnUploadExcel = false;
          //this.logger("this.data >>>",data);
          if (data?.status) {
            this.updateAllowanceObj= {};
            this.modalService.service.dismissAll();
            this.utilityService.success(data.msg, "Server Response");
            this.logger("this.uploadAllowancePageNo >>>", this.uploadAllowancePageNo);
            this.getUploadAllowances(this.uploadAllowancePageNo);
          }
          else {
            if (data.msg == "Validation Error") {
              this.utilityService.fail("Validation Error", "Server Response", 5000);
            }
            else {
              this.utilityService.fail(data.msg, "Server Response")
            }
          }
        }, (error) => {
          this.btnUploadExcel = false;
          this.utilityService.fail("Something went wrong", "Server Response");
        })
    }
    else{
      this.utilityService.fail("Invalid form value","Site Response");
    }
  }

  // Deductions
  listOfUploadDeductions: any[] = [];
  uploadDeductionsDTLabel: string = null;
  getUploadDeductions(pageNo: number) {
    this.uploadDeductionPageNo = pageNo;
    this.listOfUploadDeductions = [];
    let params = { pageSize: this.uploadDeductionPageSize, pageNumber: pageNo, companyId: this.User().ComId, organizationId: this.User().OrgId }
    this.areasHttpService.observable_get<any[]>((ApiArea.payroll + ApiController.salary + "/GetUploadDeductions"), {
      responseType: "json", observe: 'response', params: params
    }).subscribe((response) => {
      var res = response as any;
      this.listOfUploadDeductions = res.body;
      this.logger("this.listOfUploadDeductions >>>",this.listOfUploadDeductions);
      this.uploadDeductionsDTLabel = this.listOfUploadDeductions.length == 0 ? 'No record(s) found' : null;
      var xPaginate = JSON.parse(res.headers.get('X-Pagination'));
      this.uploadDeductionPageConfig = this.userService.pageConfigInit("uploadDeductionData", xPaginate.itemsPerPage, xPaginate.currentPage, xPaginate.totalItems);
    },
      (error) => { console.log(error) }
    )
  }

  uploadedDeductionsPageChanged(event: any) {
    this.uploadDeductionPageNo = event;
    this.getUploadDeductions(this.uploadDeductionPageNo);
  }

  updateDeductionObj: any= null;
  openUpdateDeductionModal(uploadId:number,employeeId: number, deductionNameId: number){
    this.updateDeductionObj = Object.assign({}, this.listOfUploadDeductions.find(s=> s.id== uploadId && s.employeeId == employeeId && s.deductionNameId == deductionNameId))

    this.modalService.open(this.updateDeductionModal,"sm");

    this.logger("this.updateDeductionObj >>>", this.updateDeductionObj);
  }

  submitUpdateDeduction(form: NgForm){
    if(form.valid && this.updateDeductionObj.amount > 0){
      this.btnUploadExcel = true;
      this.areasHttpService.observable_post((ApiArea.payroll + ApiController.salary + "/UpdateDeduction"),JSON.stringify(this.updateDeductionObj), {
        'headers': {
        'Content-Type': 'application/json'
      },}).subscribe(result => {
          var data = result as any;
          this.btnUploadExcel = false;
          if (data?.status) {
            this.updateDeductionObj= {};
            this.modalService.service.dismissAll();
            this.utilityService.success(data.msg, "Server Response");
            this.logger("this.uploadDeductionPageNo >>>", this.uploadDeductionPageNo);
            this.getUploadDeductions(this.uploadDeductionPageNo);
          }
          else {
            if (data.msg == "Validation Error") {
              this.utilityService.fail("Validation Error", "Server Response", 5000);
            }
            else {
              this.utilityService.fail(data.msg, "Server Response")
            }
          }
        }, (error) => {
          this.btnUploadExcel = false;
          this.utilityService.fail("Something went wrong", "Server Response");
        })
    }
    else{
      this.utilityService.fail("Invalid form value","Site Response");
    }
  }



}
