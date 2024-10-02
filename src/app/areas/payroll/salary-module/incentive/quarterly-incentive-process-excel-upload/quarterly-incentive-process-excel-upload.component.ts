import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { AreasHttpService } from 'src/app/areas/areas.http.service';
import { ApiArea, ApiController } from 'src/app/shared/constants';
import { CustomModalService } from 'src/app/shared/services/custom-modal.service';
import { HrWebService } from 'src/app/shared/services/hr-web.service';
import { PayrollWebService } from 'src/app/shared/services/payroll-web.service';
import { UserService } from 'src/app/shared/services/user.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { QuarterlyIncentiveRoutingService } from '../routing/quarterly-incentive-routing.service';
import * as XLSX from 'xlsx';
import { parse } from 'path';



@Component({
  selector: 'app-quarterly-incentive-process-excel-upload',
  templateUrl: './quarterly-incentive-process-excel-upload.component.html',
  styleUrls: ['./quarterly-incentive-process-excel-upload.component.css']
})
export class QuarterlyIncentiveProcessExcelUploadComponent implements OnInit {

 
  @ViewChild('uploadExcelFileModal', { static: true }) uploadExcelFileModal!: ElementRef;
  @Input() employeeTaxZoneId: number = 0;
  @Output() closeModalEvent = new EventEmitter<string>();
  @Output() refresh = new EventEmitter<void>();



  modalTitle: string = "";

  constructor(
    private fb: FormBuilder, 
    private userService: UserService, 
    public utilityService: UtilityService, 
    public modalService: CustomModalService,
    private quarterlyIncentiveRoutingService : QuarterlyIncentiveRoutingService,
    private areasHttpService: AreasHttpService
    ) { }

  ngOnInit(): void {
    this.formInit();  
  }

  ddlYears: any = this.utilityService.getYears(2);
  currentYear: number = parseInt(this.utilityService.currentYear);

  logger(msg: any, options: any) {
    this.utilityService.consoleLog(msg, options);
  }
  User() {
    return this.userService.User();
  }

  uploadFormGroup: FormGroup;
  formInit() {
    this.uploadFormGroup = this.fb.group({
      quarterlyIncentiveProcessId: new FormControl(0), 
      incentiveYear: new FormControl(0, [Validators.required, Validators.min(1)]),
      incentiveQuarterNumber: new FormControl('0', [Validators.required]),
      excelFile: new FormControl(null)

    })
    this.modalService.open(this.uploadExcelFileModal, "sm");

  this.uploadFormGroup.get('incentiveYear').valueChanges.subscribe((year)=>{  
      this.uploadFormGroup.get('incentiveQuarterNumber').setValue(0);
      this.loadIncentiveQuarterNumber(year);
    })
  }

  ddlIncentiveQuarterNumber: any[] = [];
  loadIncentiveQuarterNumber(year: any) {
    this.ddlIncentiveQuarterNumber = []; 
    this.areasHttpService.observable_get<any[]>((ApiArea.payroll + "/Salary/Incentive/QuarterlyIncentive" + "/GetQuarterNumberExtension"), {
      responseType: "json",
      observe: 'response',
      params: {
        incentiveYear: year
      }
    }).subscribe((response) => {
      var res = response as any;
      this.ddlIncentiveQuarterNumber = res.body;   
    })
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
      this.uploadFormGroup.get('excelFile').setValue(selectedFile);   
    }
    else {
      this.excelFileName = "Choose Your excel file";
    }
  }



  // btnUploadExcel: boolean = false;
  // submitUploadExcel() {
  //   if (this.uploadFormGroup.valid && this.excelFileName != "Choose Your excel file") {
  //     this.btnUploadExcel = true;
  //     const formData = new FormData();
  //     //formData.append("ExcelFile", this.uploadIncomeTaxZoneHead.excelFile);
  //     formData.append("ExcelFile", this.uploadFormGroup.get('excelFile').value);
  //     this.areasHttpService.observable_post((ApiArea.payroll + ApiController.tax + "/UploadEmployeeTaxZoneExcel"),
  //       formData, {}).subscribe(result => {
  //         var data = result as any;
  //         this.btnUploadExcel = false;
  //         if (data?.status) {
  //           this.clearUploadTaxZoneHeadObj();
  //           this.closeModal('Save Complete');
  //           this.utilityService.success(data.msg, "Server Response");
  //         }
  //         else {
  //           if (data.msg == "Validation Error") {
  //             this.utilityService.fail("Validation Error", "Server Response", 5000);
  //           }
  //           else {
  //             this.logger("foooo >>>", "foooo");
  //             this.utilityService.fail(data.msg, "Server Response")
  //           }
  //         }
  //       }, (error) => {
  //         this.btnUploadExcel = false;
  //         this.utilityService.fail("Something went wrong", "Server Response");
  //       })
  //   }
  //   else if (this.excelFileName != "Choose Your excel file") {
  //     this.utilityService.fail("Please select your file")
  //   }
  //   else if (this.fileExtension(this.uploadIncomeTaxZoneHead.excelFile.name) != 'xls' || this.fileExtension(this.uploadIncomeTaxZoneHead.excelFile.name) != 'xlsx') {
  //     this.utilityService.fail("Invalid File format")
  //   }
  // }




  btnUploadExcel: boolean = false;

  submitUploadExcel() {
    if (this.uploadFormGroup.valid && this.excelFileName !== "Choose Your excel file") {
      this.btnUploadExcel = true;
  
      const formData = new FormData();      
      formData.append("IncentiveYear",  this.uploadFormGroup.get('incentiveYear').value);
      formData.append("IncentiveQuarterNumber", this.uploadFormGroup.get('incentiveQuarterNumber').value);
      formData.append("ExcelFile", this.uploadFormGroup.get('excelFile').value);
  
      // Read the contents of the Excel file
      const reader = new FileReader();
      reader.onload = (event) => {
        const fileContent = reader.result as string;
  
        // Parse the content using xlsx
        const workbook = XLSX.read(fileContent, { type: 'binary' });
  
        // Process the first sheet
        const firstSheetName = workbook.SheetNames[0];
        const firstSheet = workbook.Sheets[firstSheetName];
        const firstSheetData = this.processSheet(firstSheet);
  
        // Process the second sheet
        const secondSheetName = workbook.SheetNames[1];
        const secondSheet = workbook.Sheets[secondSheetName];
        const secondSheetData = this.processSheet(secondSheet);
  
        // console.table(firstSheetData);
        // console.table(secondSheetData);
  
        const firstSheetDataString = JSON.stringify(firstSheetData);
        const secondSheetDataString = JSON.stringify(secondSheetData);
  
        formData.append("FirstSheetData", new Blob([firstSheetDataString], { type: 'application/json' }));
        formData.append("SecondSheetData", new Blob([secondSheetDataString], { type: 'application/json' }));
  
        this.quarterlyIncentiveRoutingService.uploadExcel(formData).subscribe(
          result => {
              var data = result as any;
              this.btnUploadExcel = false;
  
              console.log("Result:", result);
              console.log("Data:", data);
  
              if (data?.status) {
                this.clearUploadTaxZoneHeadObj();
                this.closeModal('Save Complete');
                this.utilityService.success(data.msg, "Server Response");

                this.afterSuccessfullyUpload();

              } else {
                if (data.msg == "Validation Error") {
                  this.utilityService.fail("Validation Error", "Server Response", 5000);
                } else {
                  this.logger("foooo >>>", "foooo");
  
                  console.log("Error Data:", data);
  
                  this.utilityService.fail(data.msg, "Server Response");
                }
              }
            },
            (error) => {
              this.btnUploadExcel = false;
  
              console.error("Error:", error);
  
              this.utilityService.fail("Something went wrong", "Server Response");
            }
          );
      };
  
      reader.readAsBinaryString(this.uploadFormGroup.get('excelFile').value);
  
    } else if (this.excelFileName !== "Choose Your excel file") {
      this.utilityService.fail("Please select your file");
    } else if (this.fileExtension(this.uploadIncomeTaxZoneHead.excelFile.name) !== 'xls' && this.fileExtension(this.uploadIncomeTaxZoneHead.excelFile.name) !== 'xlsx') {
      this.utilityService.fail("Invalid File format");
    }
  }



  
  processSheet(sheet: XLSX.WorkSheet): any[] {
    const jsonData: any[] = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as any[];
  
    // Filter out blank rows
    const nonEmptyRows: any[] = jsonData.filter((row: any) => row.some((cell: any) => cell !== null && cell !== ''));
  
    // Extract column-wise data
    const columnData: any[] = [];
    if (nonEmptyRows.length > 0) {
      const headers: any[] = nonEmptyRows[0];
      for (let i = 1; i < nonEmptyRows.length; i++) {
        const row: any[] = nonEmptyRows[i];
        const rowData: any = {};
        for (let j = 0; j < headers.length; j++) {
          rowData[headers[j]] = row[j];
        }
        columnData.push(rowData);
      }
    }
    return columnData;
  }
  

  afterSuccessfullyUpload() {
    this.refresh.emit();
  }


  downloadExcelFormat() {
    const fileName = "Upload Quarterly Incentive File.xlsx";
  
    this.quarterlyIncentiveRoutingService.downloadExcelFormat<any>(fileName).subscribe(
      (response: ArrayBuffer) => {
        if (response.byteLength > 0) {
          const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          const fileUrl = window.URL.createObjectURL(blob);
          const fileNameExtension = fileName;
          const a = document.createElement('a');
          a.href = fileUrl;
          a.download = fileNameExtension;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        } else {
          this.utilityService.warning("No Excel File found");
        }
      },
      (error) => {
        console.error("Error downloading Excel file:", error);
        this.utilityService.fail("Something went wrong", "Server Response");
      }
    );
  }



}
