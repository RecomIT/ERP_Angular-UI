import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild, Injectable } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup, NgForm, Validators } from "@angular/forms";
import { UtilityService } from "src/app/shared/services/utility.service";
import { UserService } from "src/app/shared/services/user.service";
import { HrWebService } from "src/app/shared/services/hr-web.service";
import { CustomModalService } from "src/app/shared/services/custom-modal.service";
import { uploadInternalDesignationHeads } from "src/models/hrm/organizational-model";
import { InternalDesignationService } from "../internal-designation.service";

@Component({
  selector: 'app-employee-module-upload-internal-designation',
  templateUrl: './upload-internal-designation.component.html'
})
export class UploadInternalDesignationModalComponent implements OnInit {

  @ViewChild('uploadInternalDesignationModal', { static: true }) uploadInternalDesignationModal!: ElementRef;
  @Input() internalDesignationId: number = 0;
  @Output() closeModalEvent = new EventEmitter<string>(); 
  modalTitle: string = "Upload Internal Designation";

  constructor(private fb: FormBuilder,   
    private userService: UserService,
    public utilityService: UtilityService, 
    public modalService: CustomModalService, 
    private hrWebService: HrWebService,
    private uploadInternalDesignationService: InternalDesignationService) { }

  ngOnInit(): void {
    this.formInit();
  }

  uploadFormGroup: FormGroup;
  formInit() {
    this.uploadFormGroup = this.fb.group({        
      excelFile: new FormControl(null, [Validators.required])

    })
    this.modalService.open(this.uploadInternalDesignationModal, "sm");
  }
 
  logger(msg: any, options: any) {
    this.utilityService.consoleLog(msg, options);
  }
  User() {
    return this.userService.User();
  }

  uploadInternalDesignationHead: uploadInternalDesignationHeads = {  
    internalDesignationId: 0,  
    excelFile: null
  }

  fileExtension(fileName: string) {
    var name = fileName.split('.')
    return name[1].toString();
  }

  clearUploadHeadObj() {
    this.excelFileName = "";
    this.uploadInternalDesignationHead = {
      internalDesignationId: 0,      
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
  submitInternalDesignationExcel() {
    if (this.uploadFormGroup.valid && this.excelFileName != "Choose Your excel file") {
      this.btnUploadExcel = true;
      const formData = new FormData();       
      formData.append("ExcelFile", this.uploadFormGroup.get('excelFile').value);  
     this.uploadInternalDesignationService.uploadInternalDesignationExcel(formData).subscribe(result => {
          var data = result as any;     
          this.btnUploadExcel = false;
          if (data?.status) {
            this.clearUploadHeadObj();
            this.closeModal('Save Complete');
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
    else if (this.fileExtension(this.uploadInternalDesignationHead.excelFile.name) != 'xls' || this.fileExtension(this.uploadInternalDesignationHead.excelFile.name) != 'xlsx') {
      this.utilityService.fail("Invalid File format")
    }
  }

  downloadInternalDesignationExcelFile() {    
    let params = { fileName: "Upload_Internal_Designation_Excel_File.xlsx"};
    this.uploadInternalDesignationService.downloadInternalDesignationExcelFile(params).subscribe((response: any) => {     
      if (response.size > 0) {
        var blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = 'uploadInternalDesignationExcelFile.xlsx';
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
    this.closeModalEvent.emit(reason);
  } 


}
