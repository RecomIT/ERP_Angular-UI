import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { AreasHttpService } from 'src/app/areas/areas.http.service';
import { ApiArea, ApiController } from 'src/app/shared/constants';
import { CustomModalService } from 'src/app/shared/services/custom-modal.service';
import { HrWebService } from 'src/app/shared/services/hr-web.service';
import { UserService } from 'src/app/shared/services/user.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AllowanceArrearAdjustmentService } from '../salary-allowance-arrear-adjustment.service';
import { AllowanceNameService } from '../../../allowance/allowance-head/allowance-name.service';


@Component({
  selector: 'app-salary-module-upload-salary-allowance-arrear-adjustment-modal',
  templateUrl: './upload-salary-allowance-arrear-adjustment-modal.component.html'
})
export class UploadSalaryAllowanceArrearAdjustmentModalComponent implements OnInit {

  @ViewChild('uploadAllowanceArrearAdjustmentModal', { static: true }) uploadAllowanceArrearAdjustmentModal!: ElementRef;
  @Input() id: any = 0;
  @Output() closeModalEvent = new EventEmitter<string>();
  modalTitle: string = "";
  datePickerConfig: Partial<BsDatepickerConfig> = {};
 
  constructor(private fb: FormBuilder, // strongly type form build
    private areasHttpService: AreasHttpService, // http request
    private userService: UserService, // user service user id
    public utilityService: UtilityService, // utility 
    public modalService: CustomModalService, // modal service
    private hrWebService: HrWebService,
    private allowanceAdjustmentService: AllowanceArrearAdjustmentService,
    private allowanceNameService: AllowanceNameService) { }

    ngOnInit(): void {
      this.loadAllowanceNames();
      this.formInit();
    }
  
    select2Config = this.utilityService.select2Config();
    ddlYears: any = this.utilityService.getYears(2);
    ddlMonths: any = this.utilityService.getMonths();
    currentMonth: number = parseInt(this.utilityService.currentMonth);
    currentYear: number = parseInt(this.utilityService.currentYear);

    logger(msg: any, options: any) {
      this.utilityService.consoleLog(msg, options);
    }
    User() {
      return this.userService.User();
    }
  
    ddlAllowances: any[]=[];
    loadAllowanceNames(){
    this.allowanceNameService.loadAllowanceNameDropdown();
    this.allowanceNameService.ddl$.subscribe(data=>{       
        this.ddlAllowances = data;
    },(error)=>{
        console.log("error  while fetching data >>>", error);
    })
}
    
    uploadFormGroup: FormGroup;
    formInit() {
      this.uploadFormGroup = this.fb.group({
        id: new FormControl(0),          
        allowanceNameId: new FormControl(0, [Validators.required, Validators.min(1)]),    
        salaryMonth: new FormControl(this.currentMonth, [Validators.required, Validators.min(1)]),
        salaryYear: new FormControl(this.currentYear, [Validators.required,  Validators.min(1)]),  
        excelFile: new FormControl(null, [Validators.required])
      })
      this.modalService.open(this.uploadAllowanceArrearAdjustmentModal, "sm");         
    }
  
    
    downloadExcelFile() {
      let params = { fileName: "UploadSalaryAllowanceArrearAdjustmentFile.xlsx" }
      this.allowanceAdjustmentService.downloadExcelFormat(params)
      .subscribe((response: any) => {      
        if (response.size > 0) {
          var blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          const link = document.createElement('a');
          link.href = window.URL.createObjectURL(blob);
          link.download = 'Upload_Salary_Allowance_Arrear_Adjustment.xlsx';
          link.click();
  
        }
        else {
          this.utilityService.warning("No Excel File found");
        }
      }, (error) => {
        this.utilityService.fail("Something went wrong", "Server Response")
  
      })
    }
  

  excelFileName: string = "Choose Your excel file";
  excelFileUpload(file: any) {
    this.logger("file", file);
    const selectedFile = (file.target as HTMLInputElement).files[0];
    this.logger("selectedFile", selectedFile);
    if (selectedFile != null && selectedFile != undefined && (this.fileExtension(selectedFile.name) == 'xls' || this.fileExtension(selectedFile.name) == 'xlsx')) {
      this.excelFileName = selectedFile.name;    
      this.uploadFormGroup.get('excelFile').setValue(selectedFile);
      //this.logger("this.excelFileUpload.excelFile >>>", this.excelFileUpload.excelFile);
    }
    else {
      this.excelFileName = "Choose Your excel file";
    }
  }


  fileExtension(fileName: string) {
    var name = fileName.split('.')
    return name[1].toString();
  }


  btnUploadExcel: boolean = false;   
  submit() {
    if (this.uploadFormGroup.valid && this.excelFileName != "Choose Your excel file") {
      this.btnUploadExcel = true;
      const formData = new FormData();   
      formData.append("AllowanceNameId", parseInt(this.uploadFormGroup.get('allowanceNameId').value).toString());
      formData.append("SalaryMonth", parseInt(this.uploadFormGroup.get('salaryMonth').value).toString());
      formData.append("SalaryYear", parseInt(this.uploadFormGroup.get('salaryYear').value).toString());   
      formData.append("ExcelFile", this.uploadFormGroup.get('excelFile').value);
      this.allowanceAdjustmentService.uploadExcel(formData).subscribe(result => {
          var data = result as any;
          this.btnUploadExcel = false;
          if (data?.status) {
            this.clearHeadObj();
            this.closeModal('Save Complete');
            this.utilityService.success(data.msg, "Server Response");
          }
          else {
            if (data.msg == "Validation Error") {
              this.utilityService.fail("Validation Error", "Server Response", 5000);
            }
            else {             
              this.utilityService.warning(data.msg, "Warning");
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

  clearHeadObj() {
    this.excelFileName = "";   
  }

  closeModal(reason: string) {
    this.modalService.service.dismissAll(reason);
    this.closeModalEvent.emit(reason);
    this.excelFileName = "Choose Your excel file"
  }


}
