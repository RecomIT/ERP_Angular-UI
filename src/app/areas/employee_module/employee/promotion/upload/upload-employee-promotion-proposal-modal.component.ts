import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { AreasHttpService } from "src/app/areas/areas.http.service";
import { ApiArea, ApiController } from "src/app/shared/constants";
import { CustomModalService } from "src/app/shared/services/custom-modal.service";
import { PayrollWebService } from "src/app/shared/services/payroll-web.service";
import { UserService } from "src/app/shared/services/user.service";
import { UtilityService } from "src/app/shared/services/utility.service";
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { uploadPromotionProposalHeads } from 'src/models/hrm/employee-model';

@Component({
  selector: 'app-employee-module-upload-employee-promotion-proposal-modal',
  templateUrl: './upload-employee-promotion-proposal-modal.component.html'
})
export class UploadEmployeePromotionProposalModalComponent implements OnInit {

  @ViewChild('uploadEmployeePromotionProposalModal', { static: true }) uploadEmployeePromotionProposalModal!: ElementRef;
  @Input() promotionProposalId: any = 0;
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
  head: any[] = ["Designation"];
  uploadFormGroup: FormGroup;
  formInit() {
    this.uploadFormGroup = this.fb.group({
      promotionProposalId: new FormControl(0),    
      employeeCode: new FormControl(''),    
      head: new FormControl('', [Validators.required]),      
      proposalValue: new FormControl(''),
      effectiveDate: new FormControl(null),
      excelFile: new FormControl(null, [Validators.required])

    })
    this.modalService.open(this.uploadEmployeePromotionProposalModal, "sm");
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

  uploadPromotionProposal: uploadPromotionProposalHeads = {  
    promotionProposalId: 0,  
    employeeCode: '',   
    head: '',   
    proposalValue: '',   
    effectiveDate: null,
    excelFile: null  

  }

  fileExtension(fileName: string) {
    var name = fileName.split('.')
    return name[1].toString();
  }

  clearUploadHeadObj() {
    this.excelFileName = "";
    this.uploadPromotionProposal = {
      promotionProposalId: 0,  
      employeeCode: '',   
      head: '',   
      proposalValue: '',   
      effectiveDate: null,
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
  submitPromotionProposalExcel() {
    if (this.uploadFormGroup.valid && this.excelFileName != "Choose Your excel file") {
      this.btnUploadExcel = true;
      const formData = new FormData();  
      formData.append("head", this.uploadFormGroup.get('head').value);
      formData.append("ExcelFile", this.uploadFormGroup.get('excelFile').value);
      this.areasHttpService.observable_post<any>((ApiArea.hrms + ApiController.employees + "/UploadPromotionProposal"),
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
    else if (this.fileExtension(this.uploadPromotionProposal.excelFile.name) != 'xls' || this.fileExtension(this.uploadPromotionProposal.excelFile.name) != 'xlsx') {
      this.utilityService.fail("Invalid File format")
    }
  }

  downloadPromotionProposalExcelFile() {
    this.areasHttpService.observable_get<any>((ApiArea.hrms + ApiController.employees + "/DownloadPromotionProposalExcelFile"), {
      responseType: 'blob', params: { fileName: "UploadEmpPromotionProposalFile.xlsx" }
    }).subscribe((response: any) => {
      //console.log("file response >>>", response);
      if (response.size > 0) {
        var blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = 'Employee Promotion Proposal.xlsx';
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

