import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { AreasHttpService } from "src/app/areas/areas.http.service";
import { ApiArea, ApiController } from "src/app/shared/constants";
import { CustomModalService } from "src/app/shared/services/custom-modal.service";
import { PayrollWebService } from "src/app/shared/services/payroll-web.service";
import { UserService } from "src/app/shared/services/user.service";
import { UtilityService } from "src/app/shared/services/utility.service";
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { uploadCashSalaryHeads } from 'src/models/payroll/cash-salary-model';
@Component({
  selector: 'app-salary-module-upload-cash-salary-head-modal',
  templateUrl: './upload-cash-salary-head-modal.component.html'
})
export class UploadCashSalaryHeadModalComponent implements OnInit {
    @ViewChild('uploadEmployeeCashSalaryHeadModal', { static: true }) uploadEmployeeCashSalaryHeadModal!: ElementRef;
    @Input() cashSalaryHeadId: any = 0;
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
    }
  
    uploadFormGroup: FormGroup;
    formInit() {
      this.uploadFormGroup = this.fb.group({
        cashSalaryHeadId: new FormControl(0),      
        cashSalaryHeadName: new FormControl(''),
        excelFile: new FormControl(null, [Validators.required])
  
      })
      this.modalService.open(this.uploadEmployeeCashSalaryHeadModal, "sm");
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
  
    uploadCashSalaryHead: uploadCashSalaryHeads = {  
      cashSalaryHeadId: 0,  
      cashSalaryHeadName: '',   
      excelFile: null
    }
  
    fileExtension(fileName: string) {
      var name = fileName.split('.')
      return name[1].toString();
    }
  
    clearUploadHeadObj() {
      this.excelFileName = "";
      this.uploadCashSalaryHead = {
        cashSalaryHeadId: 0,  
        cashSalaryHeadName: '',   
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
        this.uploadFormGroup.get('excelFile').setValue(selectedFile);
        //this.logger("this.uploadCashSalaryHead.excelFile >>>", this.uploadCashSalaryHead.excelFile);
      }
      else {
        this.excelFileName = "Choose Your excel file";
      }
    }
  
    btnUploadExcel: boolean = false;
    submitCashSalaryHeadUploadExcel() {
      if (this.uploadFormGroup.valid && this.excelFileName != "Choose Your excel file") {
        this.btnUploadExcel = true;
        const formData = new FormData();   
        formData.append("ExcelFile", this.uploadFormGroup.get('excelFile').value);
        this.areasHttpService.observable_post<any>((ApiArea.payroll + "/Salary/CashSalary" + "/UploadCashSalaryHeadExcel"),
          formData, {}).subscribe(result => {
            var data = result as any;
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
      else if (this.fileExtension(this.uploadCashSalaryHead.excelFile.name) != 'xls' || this.fileExtension(this.uploadCashSalaryHead.excelFile.name) != 'xlsx') {
        this.utilityService.fail("Invalid File format")
      }
    }
  
    downloadCashSalaryHeadExcelFile() {
      this.areasHttpService.observable_get((ApiArea.payroll + "/Salary/CashSalary" + "/DownloadCashSalaryHeadExcel"), {
        responseType: 'blob', params: { fileName: "CashSalaryHeadFile.xlsx" }
      }).subscribe((response: any) => {
        console.log("file response >>>", response);
        if (response.size > 0) {
          var blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          const link = document.createElement('a');
          link.href = window.URL.createObjectURL(blob);
          link.download = 'CashSalaryHeadFile.xlsx';
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
  