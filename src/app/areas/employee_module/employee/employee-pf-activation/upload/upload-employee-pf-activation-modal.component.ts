import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators, NgForm } from "@angular/forms";
import { AreasHttpService } from "src/app/areas/areas.http.service";
import { ApiArea, ApiController } from "src/app/shared/constants";
import { CustomModalService } from "src/app/shared/services/custom-modal.service";
import { HrWebService } from "src/app/shared/services/hr-web.service";
import { UserService } from "src/app/shared/services/user.service";
import { UtilityService } from "src/app/shared/services/utility.service";
import { uploadPFActivationHeads } from 'src/models/hrm/employee-model';

@Component({
  selector: 'app-hr-upload-employee-pf-activation-modal',
  templateUrl: './upload-employee-pf-activation-modal.component.html'
})
export class UploadEmployeePfActivationModalComponent implements OnInit {

  @ViewChild('uploadPFActivationExcelFileModal', { static: true }) uploadPFActivationExcelFileModal!: ElementRef;
  @Input() pfActivationId: any = 0;
  @Output() closeModalEvent = new EventEmitter<string>();
  modalTitle: string = "";

  constructor(private fb: FormBuilder, // strongly type form build
  private areasHttpService: AreasHttpService, // http request
  private userService: UserService, // user service user id
  public utilityService: UtilityService, // utility 
  public modalService: CustomModalService, // modal service
  private hrWebService: HrWebService) { }

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
      pfActivationId: new FormControl(0),
      employeeId: new FormControl(0),
      pfBasedAmount: new FormControl(''),
      pfPercentage: new FormControl(0),      
      pfEffectiveDate: new FormControl(null),
      pfActivationDate: new FormControl(null),
      remarks: new FormControl(''),
      excelFile: new FormControl(null, [Validators.required])

    })
    this.modalService.open(this.uploadPFActivationExcelFileModal, "sm");
  }

  closeModal(reason: string) {
    this.modalService.service.dismissAll(reason);
    this.closeModalEvent.emit(reason);
  }

  uploadPFActivationHead: uploadPFActivationHeads = {  
    pfActivationId: 0,
    employeeId: 0,
    pfBasedAmount: '',
    pfPercentage: 0,      
    pfEffectiveDate: null,
    pfActivationDate: null,
    remarks: '',
    excelFile: null
  }

  fileExtension(fileName: string) {
    var name = fileName.split('.')
    return name[1].toString();
  }

  clearUploadBankHeadObj() {
    this.excelFileName = "";
    this.uploadPFActivationHead = {
      pfActivationId: 0,
      employeeId: 0,
      pfBasedAmount: '',
      pfPercentage: 0,      
      pfEffectiveDate: null,
      pfActivationDate: null,
      remarks: '',
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
      this.logger("this.uploadPFActivationHead.excelFile >>>", this.uploadPFActivationHead.excelFile);
    }
    else {
      this.excelFileName = "Choose Your excel file";
    }
  }

  btnUploadExcel: boolean = false;
  submitPFActivationUploadExcel() {
    if (this.uploadFormGroup.valid && this.excelFileName != "Choose Your excel file") {
      this.btnUploadExcel = true;
      const formData = new FormData();   
      formData.append("ExcelFile", this.uploadFormGroup.get('excelFile').value);
      this.areasHttpService.observable_post((ApiArea.hrms + ApiController.employees + "/UploadPFActivationExcel"),
        formData, {}).subscribe(result => {
          var data = result as any;
          this.btnUploadExcel = false;
          if (data?.status) {
            this.clearUploadBankHeadObj();
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
    else if (this.fileExtension(this.uploadPFActivationHead.excelFile.name) != 'xls' || this.fileExtension(this.uploadPFActivationHead.excelFile.name) != 'xlsx') {
      this.utilityService.fail("Invalid File format")
    }
  }

  downloadPFActivationExcelFile() {
    this.areasHttpService.observable_get((ApiArea.hrms + ApiController.employees + "/DownloadPFActivationExcel"), {
      responseType: 'blob', params: { fileName: "EmployeePFActivationFile.xlsx" }
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
