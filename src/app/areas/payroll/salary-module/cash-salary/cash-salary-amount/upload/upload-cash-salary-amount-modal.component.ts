import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { AreasHttpService } from "src/app/areas/areas.http.service";
import { ApiArea, ApiController } from "src/app/shared/constants";
import { CustomModalService } from "src/app/shared/services/custom-modal.service";
import { PayrollWebService } from "src/app/shared/services/payroll-web.service";
import { UserService } from "src/app/shared/services/user.service";
import { UtilityService } from "src/app/shared/services/utility.service";
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { uploadCashSalary } from 'src/models/payroll/cash-salary-model';

@Component({
  selector: 'app-salary-module-upload-cash-salary-amount-modal',
  templateUrl: './upload-cash-salary-amount-modal.component.html'
})
export class UploadCashSalaryAmountModalComponent implements OnInit {
    @ViewChild('fileUploadCashSalaryModal', { static: true }) fileUploadCashSalaryModal!: ElementRef;
    @Input() uploadCashSalaryId: any = 0;
    @Output() closeModalEvent = new EventEmitter<string>();
    modalTitle: string = "";
  
    constructor(private fb: FormBuilder,
    private areasHttpService: AreasHttpService, 
    private userService: UserService, 
    public utilityService: UtilityService,
    public modalService: CustomModalService, 
    private payrollWebService: PayrollWebService) { }
  
    ngOnInit(): void {
      this.formInit();
      this.loadCashSalaryHead();
    }
    ddlYears: any = this.utilityService.getYears(2);
    ddlMonths: any = this.utilityService.getMonths();
    currentMonth: number = parseInt(this.utilityService.currentMonth);
    currentYear: number = parseInt(this.utilityService.currentYear);
  
    uploadFormGroup: FormGroup;
    formInit() {
      this.uploadFormGroup = this.fb.group({
        uploadCashSalaryId: new FormControl(0),       
        cashSalaryHeadId: new FormControl(0, [Validators.min(1)]),   
        cashSalaryHeadName: new FormControl(''),
        salaryMonth: new FormControl(this.utilityService.currentMonth, [Validators.required]),
        salaryYear: new FormControl(this.utilityService.currentYear, [Validators.required]),     
        excelFile: new FormControl(null, [Validators.required])
  
      })
      this.modalService.open(this.fileUploadCashSalaryModal, "sm");
    }
   
    ddlCashSalaryHead: any[] = [];
    cashSalaryHeadId: any = 0;
    loadCashSalaryHead() {
      this.ddlCashSalaryHead = []; 
      this.areasHttpService.observable_get<any[]>((ApiArea.payroll + "/Salary/CashSalary" + "/GetCashSalaryHeadExtension"), {
        responseType: "json",
        observe: 'response',
        params: {
          cashSalaryHeadId: this.cashSalaryHeadId
        }
      }).subscribe((response) => {
        var res = response as any;
        this.ddlCashSalaryHead = res.body;   
      })
    }
  
    logger(msg: any, options: any) {
      this.utilityService.consoleLog(msg, options);
    }
    User() {
      return this.userService.User();
    }
  
    closeModal(reason: string) {
      this.modalService.service.dismissAll(reason);
      this.closeModalEvent.emit(reason);
    } 
  
    uploadCashSalary: uploadCashSalary = {  
      uploadCashSalaryId: 0,  
      cashSalaryHeadName: '',   
      excelFile: null
    }
  
    fileExtension(fileName: string) {
      var name = fileName.split('.')
      return name[1].toString();
    }
  
    clearUploadHeadObj() {
      this.excelFileName = "";
      this.uploadCashSalary = {
        uploadCashSalaryId: 0,  
        cashSalaryHeadName: '',   
        excelFile: null
      };
    }
  
    excelFileName: string = "Choose Your excel file";
    excelFileUpload(file: any) {
      //this.logger("file", file);
      const selectedFile = (file.target as HTMLInputElement).files[0];
      //this.logger("selectedFile", selectedFile);
      if (selectedFile != null && selectedFile != undefined && (this.fileExtension(selectedFile.name) == 'xls' || this.fileExtension(selectedFile.name) == 'xlsx')) {
        this.excelFileName = selectedFile.name;    
        this.uploadFormGroup.get('excelFile').setValue(selectedFile);      
      }
      else {
        this.excelFileName = "Choose Your excel file";
      }
    }
  
    btnUploadExcel: boolean = false;
    submitCashSalaryExcel() {
      if (this.uploadFormGroup.valid && this.excelFileName != "Choose Your excel file") {
        this.btnUploadExcel = true;
        const formData = new FormData();   
        formData.append("CashSalaryHeadId", this.uploadFormGroup.get('cashSalaryHeadId').value);
        formData.append("SalaryMonth", this.uploadFormGroup.get('salaryMonth').value);
        formData.append("SalaryYear", this.uploadFormGroup.get('salaryYear').value);
        formData.append("ExcelFile", this.uploadFormGroup.get('excelFile').value);
        this.areasHttpService.observable_post<any>((ApiArea.payroll + "/Salary/CashSalary" + "/UploadCashSalaryExcel"),
          formData, {}).subscribe(result => {
            var data = result as any;
            console.log("submitCashSalaryExcel data >>", data);
            this.btnUploadExcel = false;
            if (data?.status) {
              this.clearUploadHeadObj();
              this.closeModal('Save Complete');
              this.utilityService.success(data.msg, "Server Response");
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
      else if (this.excelFileName != "Choose Your excel file") {
        this.utilityService.fail("Please select your file")
      }
      else if (this.fileExtension(this.uploadCashSalary.excelFile.name) != 'xls' || this.fileExtension(this.uploadCashSalary.excelFile.name) != 'xlsx') {
        this.utilityService.fail("Invalid File format")
      }
    }
  
    downloadCashSalaryExcelFile() {
      this.areasHttpService.observable_get<any>((ApiArea.payroll + "/Salary/CashSalary" + "/DownloadCashSalaryExcelFile"), {
        responseType: 'blob', params: { fileName: "UploadCashSalaryFile.xlsx" }
      }).subscribe((response: any) => {
        //console.log("file response >>>", response);
        if (response.size > 0) {
          var blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          const link = document.createElement('a');
          link.href = window.URL.createObjectURL(blob);
          link.download = 'CashSalaryFile.xlsx';
          link.click();
  
        }
        else {
          this.utilityService.warning("No Excel File found");
        }
      }, (error) => {
        this.utilityService.fail("Something went wrong", "Server Response")
  
      })
    }
  
  }
  