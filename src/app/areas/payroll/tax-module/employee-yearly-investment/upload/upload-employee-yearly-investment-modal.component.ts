import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild, Injectable, OnDestroy } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { UtilityService } from "src/app/shared/services/utility.service";
import { UserService } from "src/app/shared/services/user.service";
import { HrWebService } from "src/app/shared/services/hr-web.service";
import { CustomModalService } from "src/app/shared/services/custom-modal.service";
import { AreasHttpService } from "src/app/areas/areas.http.service";
import { EmployeeYearlyInvestmentService } from "src/app/areas/payroll-services/employee-yearly-investment/employee-yearly-investment.service";
import { WebFileService } from "src/app/areas/common-services/web-file.service";

@Component({
  selector: 'app-payroll-upload-employee-yearly-investment-modal',
  templateUrl: './upload-employee-yearly-investment-modal.component.html'
})
export class UploadEmployeeYearlyInvestmentModalComponent implements OnInit {

  @ViewChild('uploadEmployeeYearlyInvestmentModal', { static: true }) uploadEmployeeYearlyInvestmentModal!: ElementRef;
  @Input() id: number = 0;
  @Output() closeModalEvent = new EventEmitter<string>(); 
  modalTitle: string = "Upload Yearly Investment";
 
  constructor(private fb: FormBuilder,   
    private userService: UserService,
    public utilityService: UtilityService, 
    public modalService: CustomModalService, 
    private hrWebService: HrWebService,
    private employeeYearlyInvestmentService: EmployeeYearlyInvestmentService,
    private webFileService: WebFileService,
    private areasHttpService : AreasHttpService) { }

  ngOnInit(): void {
    this.formInit();
    this.getCurrentFiscalYear();
  }
 
  uploadFormGroup: FormGroup;
  formInit() {
    this.uploadFormGroup = this.fb.group({      
      fiscalYearId: new FormControl(0),
      excelFile: new FormControl(null, [Validators.required])

    })
    this.modalService.open(this.uploadEmployeeYearlyInvestmentModal, "sm");
  }
 
  fiscal_year_range: string = "";
  current_fiscal_year: any;
  getCurrentFiscalYear() {
      this.current_fiscal_year = this.employeeYearlyInvestmentService.getCurrentFiscalYear<any>().then(data => {
          this.current_fiscal_year = data;
          this.uploadFormGroup.get('fiscalYearId').setValue(this.current_fiscal_year.fiscalYearId);
          this.fiscal_year_range = this.current_fiscal_year.fiscalYearRange;
      })
  }
 
  logger(msg: any, options: any) {
    this.utilityService.consoleLog(msg, options);
  }
  User() {
    return this.userService.User();
  }


  fileExtension(fileName: string) {
    var name = fileName.split('.')
    return name[1].toString();
  }

  clearUploadHeadObj() {
    this.excelFileName = "";   
  }

  excelFileName: string = "Choose Your excel file";
  excelFileUpload(file: any) {   
    const selectedFile = (file.target as HTMLInputElement).files[0];  
    if (selectedFile != null && selectedFile != undefined && (this.fileExtension(selectedFile.name) == 'xls' || this.fileExtension(selectedFile.name) == 'xlsx')) {
      this.excelFileName = selectedFile.name;    
      this.uploadFormGroup.get('excelFile').setValue(selectedFile);      
    }
    else {
      this.excelFileName = "Choose Your excel file";
    }
  }
  
  btnUploadExcel: boolean = false;
  submitEmployeeYearlyInvestmentExcel() {
    if (this.uploadFormGroup.valid && this.excelFileName != "Choose Your excel file") {
      this.btnUploadExcel = true;
      const formData = new FormData();     
      formData.append("FiscalYearId", this.uploadFormGroup.get('fiscalYearId').value);    
      formData.append("ExcelFile", this.uploadFormGroup.get('excelFile').value);  
     this.employeeYearlyInvestmentService.uploadEmployeeYearlyInvestmentExcel(formData).subscribe(result => {
          var data = result as any;     
          this.btnUploadExcel = false;
          if (data?.status) {
            this.clearUploadHeadObj();
            this.closeModal('Save Successful');
            this.utilityService.success(data.msg, "Server Response");
            //window.location.reload();
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
    
  }

  downloadEmployeeYearlyInvestmentExcelFile() {    
    let params = { fileName: "Upload_Yearly_Investment_Excel_File.xlsx"};
    this.webFileService.downloadFormatExcelFile(params).subscribe((response: any) => {     
      if (response.size > 0) {
        var blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = 'UploadYearlyInvestmentExcelFile.xlsx';
        link.click();

      }
      else {
        this.utilityService.warning("No Excel File found");
      }
    }, (error) => {
      this.utilityService.fail("Something went wrong", "Server Response")

    })
  }

  closeModal(reason: string) {
    this.modalService.service.dismissAll(reason);
    this.excelFileName = null;
    this.closeModalEvent.emit(reason);
  } 
}
