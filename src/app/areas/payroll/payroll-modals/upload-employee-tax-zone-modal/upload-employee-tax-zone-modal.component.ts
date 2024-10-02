import { transition, trigger, useAnimation } from "@angular/animations";
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild, Injectable } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup, NgForm, Validators } from "@angular/forms";
import { bounceIn, fadeIn, fadeInRight, slideInUp } from "ng-animate";
import { CustomModalService } from "src/app/shared/services/custom-modal.service";
import { PayrollWebService } from "src/app/shared/services/payroll-web.service";
import { UserService } from "src/app/shared/services/user.service";
import { UtilityService } from "src/app/shared/services/utility.service";
import { AreasHttpService } from "src/app/areas/areas.http.service";
import { ApiArea, ApiController } from 'src/app/shared/constants';
import { HrWebService } from 'src/app/shared/services/hr-web.service';
import { DomSanitizer } from '@angular/platform-browser';



@Component({
  selector: 'app-payroll-upload-employee-tax-zone-modal',
  templateUrl: './upload-employee-tax-zone-modal.component.html'
})

export class UploadEmployeeTaxZoneModalComponent implements OnInit {

  @ViewChild('uploadExcelFileModal', { static: true }) uploadExcelFileModal!: ElementRef;
  @Input() employeeTaxZoneId: number = 0;
  @Output() closeModalEvent = new EventEmitter<string>();
  modalTitle: string = "";

  constructor(private fb: FormBuilder, // strongly type form build
    private areasHttpService: AreasHttpService, // http request
    private userService: UserService, // user service user id
    public utilityService: UtilityService, // utility 
    public modalService: CustomModalService, // modal service 
    private hrWebService: HrWebService,
    private payrollWebService: PayrollWebService,
    private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.formInit();
  }

  logger(msg: any, options: any) {
    this.utilityService.consoleLog(msg, options);
  }
  User() {
    return this.userService.User();
  }

  uploadFormGroup: FormGroup;
  formInit() {
    this.uploadFormGroup = this.fb.group({
      employeeTaxZoneId: new FormControl(0),
      employeeId: new FormControl(0),
      taxZone: new FormControl(''),
      minimumTaxAmount: new FormControl(0),
      effectiveDate: new FormControl(null),
      excelFile: new FormControl(null)

    })
    this.modalService.open(this.uploadExcelFileModal, "sm");

  }

  closeModal(reason: string) {
    this.modalService.service.dismissAll(reason);
    this.closeModalEvent.emit(reason);
  }

  uploadIncomeTaxZoneHead: any = {
    employeeTaxZoneId: 0,
    taxZone: '',
    employeeId: 0,
    minimumTaxAmount: 0,
    effectiveDate: null,
    excelFile: null
  }

  fileExtension(fileName: string) {
    var name = fileName.split('.')
    return name[1].toString();
  }

  clearUploadTaxZoneHeadObj() {
    this.excelFileName = "";
    this.uploadIncomeTaxZoneHead = {
      employeeTaxZoneId: 0,
      taxZone: '',
      employeeId: 0,
      minimumTaxAmount: 0,
      effectiveDate: null,
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
      //this.uploadIncomeTaxZoneHead.excelFile = selectedFile;
      this.uploadFormGroup.get('excelFile').setValue(selectedFile);
      this.logger("this.uploadIncomeTaxZoneHead.excelFile >>>", this.uploadIncomeTaxZoneHead.excelFile);
    }
    else {
      this.excelFileName = "Choose Your excel file";
    }
  }

  btnUploadExcel: boolean = false;
  submitUploadExcel() {
    if (this.uploadFormGroup.valid && this.excelFileName != "Choose Your excel file") {
      this.btnUploadExcel = true;
      const formData = new FormData();
      //formData.append("ExcelFile", this.uploadIncomeTaxZoneHead.excelFile);
      formData.append("ExcelFile", this.uploadFormGroup.get('excelFile').value);
      this.areasHttpService.observable_post((ApiArea.payroll + ApiController.tax + "/UploadEmployeeTaxZoneExcel"),
        formData, {}).subscribe(result => {
          var data = result as any;
          this.btnUploadExcel = false;
          if (data?.status) {
            this.clearUploadTaxZoneHeadObj();
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
    else if (this.fileExtension(this.uploadIncomeTaxZoneHead.excelFile.name) != 'xls' || this.fileExtension(this.uploadIncomeTaxZoneHead.excelFile.name) != 'xlsx') {
      this.utilityService.fail("Invalid File format")
    }
  }


  downloadExcelFile() {
    this.areasHttpService.observable_get((ApiArea.payroll + ApiController.tax + "/DownloadEmployeeTaxZoneExcel"), {
      responseType: 'blob', params: { fileName: "EmployeeTaxZoneFile.xlsx" }
    }).subscribe((response: any) => {
      console.log("file response >>>", response);
      if (response.size > 0) {
        var blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        let fileUrl = window.URL.createObjectURL(blob);
        var filename = ""
        var path = window.location.pathname;
        filename = path.split("/").pop();
        let fileNameExtension = filename + ".xlsx";
        window.open(fileUrl, fileNameExtension);
        console.log("filename >>>>", filename);
        // let blob = new Blob([response], { type: 'application/vnd.ms-excel' });    
        // this.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(blob));        
        // console.log("senitizer >>>", this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(blob))); 

      }
      else {
        this.utilityService.warning("No Excel File found");
      }
    }, (error) => {
      this.utilityService.fail("Something went wrong", "Server Response")

    })
  }

}
