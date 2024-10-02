import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { AreasHttpService } from "src/app/areas/areas.http.service";
import { ApiArea, ApiController } from "src/app/shared/constants";
import { CustomModalService } from "src/app/shared/services/custom-modal.service";
import { PayrollWebService } from "src/app/shared/services/payroll-web.service";
import { UserService } from "src/app/shared/services/user.service";
import { UtilityService } from "src/app/shared/services/utility.service";
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { uploadSalaryReviewHeads } from 'src/models/payroll/salary-model';
import { SalaryReviewService } from "../salary-review.service";

@Component({
  selector: 'app-salary-module-upload-salary-review-modal',
  templateUrl: './upload-salary-review-modal.component.html'
})
export class UploadSalaryReviewModalComponent implements OnInit {

  @ViewChild('uploadSalaryReviewModal', { static: true }) uploadSalaryReviewModal!: ElementRef;
  @Input() salaryReviewInfoId: any = 0;
  @Output() closeModalEvent = new EventEmitter<string>();
  modalTitle: string = "";

  constructor(private fb: FormBuilder,
  private areasHttpService: AreasHttpService, 
  private userService: UserService, 
  public utilityService: UtilityService,
  public modalService: CustomModalService, 
  private payrollWebService: PayrollWebService,
  private uploadSalaryReviewService: SalaryReviewService) { }

  ngOnInit(): void {
    this.formInit();
    //this.loadIncrementReason();
  }

  uploadFormGroup: FormGroup;
  formInit() {
    this.uploadFormGroup = this.fb.group({        
      excelFile: new FormControl(null, [Validators.required])

    })
    this.modalService.open(this.uploadSalaryReviewModal, "sm");
  }
 
  ddlIncrementReason: any[] = [];
  incrementReason: any = '';
  loadIncrementReason() {  
    this.ddlIncrementReason = []; 
    let params = { incrementReason: this.incrementReason};
    this.uploadSalaryReviewService.getIncrementReasonExtensionAsync(params).subscribe((response) => {
      var res = response as any;
      this.ddlIncrementReason = res.body;   
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

  uploadSalaryReviewHead: uploadSalaryReviewHeads = {  
    salaryReviewInfoId: 0,  
    effectiveFrom: null,   
    incrementReason: '',   
    activationDate: null,   
    arrearCalculatedDate: null,   
    excelFile: null
  }

  fileExtension(fileName: string) {
    var name = fileName.split('.')
    return name[1].toString();
  }

  clearUploadHeadObj() {
    this.excelFileName = "";
    this.uploadSalaryReviewHead = {
      salaryReviewInfoId: 0,  
      effectiveFrom: null,   
      incrementReason: '',   
      activationDate: null,   
      arrearCalculatedDate: null,   
      excelFile: null
    };
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
  submitSalaryReviewExcel() {
    if (this.uploadFormGroup.valid && this.excelFileName != "Choose Your excel file") {
      this.btnUploadExcel = true;
      const formData = new FormData();       
      formData.append("ExcelFile", this.uploadFormGroup.get('excelFile').value);  
     this.uploadSalaryReviewService.uploadSalaryReviewExcel(formData).subscribe(result => {
          var data = result as any;
          console.log("UploadSalaryReviewExcel data >>", data);
          this.btnUploadExcel = false;
          if (data?.status) {
            this.clearUploadHeadObj();
            this.closeModal('Save Complete');
            this.utilityService.success(data.msg, "Server Response");
            window.location.reload();
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
    else if (this.fileExtension(this.uploadSalaryReviewHead.excelFile.name) != 'xls' || this.fileExtension(this.uploadSalaryReviewHead.excelFile.name) != 'xlsx') {
      this.utilityService.fail("Invalid File format")
    }
  }

  downloadSalaryReviewExcelFile() {    
    let params = { fileName: "UploadSalaryReviewExcelFile.xlsx"};
    this.uploadSalaryReviewService.downloadSalaryReviewExcelFile(params).subscribe((response: any) => {     
      if (response.size > 0) {
        var blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = 'UploadSalaryReviewExcelFile.xlsx';
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
