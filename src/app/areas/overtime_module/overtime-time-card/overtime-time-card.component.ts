import { transition, trigger, useAnimation } from '@angular/animations';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { copyFileSync } from 'fs';
import { bounceIn, fadeIn, fadeInRight, slideInUp } from 'ng-animate';
import { Select2OptionData } from 'ng-select2';
import { ApiArea, ApiController, AppConstants } from 'src/app/shared/constants';
import { CustomModalService } from 'src/app/shared/services/custom-modal.service';
import { UserService } from 'src/app/shared/services/user.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { OvertimePolicy } from 'src/models/payroll/overtime/overtime-policy';
import { OvertimeTimeCard } from 'src/models/payroll/overtime/overtime-time-card';
import { AreasHttpService } from '../../areas.http.service';



@Component({
  selector: 'overtime-time-card',
  templateUrl: './overtime-time-card.component.html',
  animations: [
    trigger('slideInUp', [transition('* => *', useAnimation(slideInUp, { params: { timing: 0.5 } }))]),
    trigger('fadeIn', [transition('void => *', useAnimation(fadeIn, { params: { timing: 0.3 } }))]),
    trigger('fadeInRight', [transition('void => *', useAnimation(fadeInRight, { params: { timing: 0.5 } }))]),
    trigger('bounceIn', [transition('void => *', useAnimation(bounceIn, { params: { timing: 1 } }))]),
  ],
})
export class OvertimeTimeCardComponent implements OnInit {

  @ViewChild('overtimeTimeCardModal', { static: true }) overtimeTimeCardModal!: ElementRef;
  @ViewChild('overtimeTimeCardRollBackModal', { static: true }) overtimeTimeCardRollBackModal!: ElementRef;


  modalTitle: string;
  buttonAction: string = 'Submit';
  btnApprovalLevel: boolean = false;
  overtimeTimeCard: OvertimeTimeCard;
  overtimeProcessList: OvertimeTimeCard[];
  fieldsetDisabled: boolean = false;
  months: Array<Select2OptionData>;
  years: Array<Select2OptionData>;
  excelFileName: string = "Choose Your excel file";
  overtimeList : Array<Select2OptionData>;
  policyList : OvertimePolicy[];

  constructor(public modalService: CustomModalService, private areasHttpService: AreasHttpService, private userService: UserService, private utilityService: UtilityService) { }

  ngOnInit(): void {
    this.modalTitle = "";
    this.overtimeTimeCard = new OvertimeTimeCard();
    this.months = [];
    this.years = [];
    this.overtimeProcessList = [];
    this.overtimeList=[];
    this.policyList = [];
    this.getMonths();
    this.getYears();
    this.getAllPolicy();
    //this.getOvertimeProcess();
  }

  
  getLocation() {

    var geoLocationAPI = "https://api.bigdatacloud.net/data/reverse-geocode-client"

    navigator.geolocation.getCurrentPosition(
      (position) => {

        var lat = position.coords.latitude;
        var long = position.coords.longitude

        geoLocationAPI = `${geoLocationAPI}?latitude=${lat}&longitude=${long}&localityLanguage=en`;
        this.getGeoLocation(geoLocationAPI);
      },
      (err) => { this.getGeoLocation(geoLocationAPI); },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      });
  }

  getGeoLocation(apiEndpoint: string) {
    var result = document.getElementById("json-result");
    const Http = new XMLHttpRequest();
    Http.open("GET", apiEndpoint);
    Http.send();
    Http.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        var jsonString = this.responseText;
        const jsonObject = JSON.parse(jsonString);
        result.innerHTML = jsonObject["locality"];
        //result.innerHTML = jsonString;
      }
    };
  }

  excelFileUpload(file: any) {
    const selectedFile = (file.target as HTMLInputElement).files[0];
    if (selectedFile != null && selectedFile != undefined && (this.fileExtension(selectedFile.name) == 'xls' || this.fileExtension(selectedFile.name) == 'xlsx')) {
      this.overtimeTimeCard.excelFile = selectedFile;
      this.excelFileName = selectedFile.name;
    }

    else {
      this.overtimeTimeCard.excelFile = null;
      this.excelFileName = "Choose Your Excel File";
    }
  }
  fileExtension(fileName: string) {
    var name = fileName.split('.')
    return name[1].toString();
  }
  onOvertimeChange(id : number){ 
    this.overtimeTimeCard.overtimeName = this.overtimeList.find(x=>x.id==id.toString()).text;
  }
  onTypeChange() {
    if (this.overtimeTimeCard.isUnitUpload.toString() == AppConstants.True) {
      this.overtimeTimeCard.isUnitUpload = true;
      this.overtimeTimeCard.isAmountUpload = false;
    } else {
      this.overtimeTimeCard.isAmountUpload = true;
      this.overtimeTimeCard.isUnitUpload = false;
    }
  }
  onYearChange() {
    this.overtimeTimeCard.year;
  }
  onMonthChange() {
    this.overtimeTimeCard.month;
  }

  getMonths() {
    this.months = [];
    this.utilityService.getMonths().forEach((x) => { this.months.push({ id: x.monthNo.toString(), text: x.month }); });

  }
  getYears() {
    this.years = [];
    this.utilityService.getYears(2).forEach((x) => { this.years.push({ id: x.toString(), text: x.toString() }); });
  }

  User() { return this.userService.User(); }
  logger(msg: any, optionsParams: any) { this.utilityService.consoleLog(msg, optionsParams) }


  openOvertimeTimeCardModal(id: number, action: string) {

    if (action == 'Upload') {
      this.fieldsetDisabled = false;
      this.buttonAction = 'Submit';
      this.overtimeTimeCard = new OvertimeTimeCard();
      this.excelFileName = "Choose Your excel file";
      this.modalTitle = "Upload Overtime Time Card";
      this.modalService.open(this.overtimeTimeCardModal, 'lg');
    }
    else {
      this.modalService.open(this.overtimeTimeCardModal, 'lg');
    }
  }

  openOvertimeTimeCardRollBackModal() {

      this.fieldsetDisabled = false;
      this.buttonAction = 'Roll Back';
      this.overtimeTimeCard = new OvertimeTimeCard();
      this.modalTitle = "Roll Back Upload Overtime Time Card";
      this.modalService.open(this.overtimeTimeCardRollBackModal, 'lg');
  }

  getOvertimeProcess() {
    var request = this.areasHttpService.observable_get<OvertimeTimeCard[]>((ApiArea.payroll + ApiController.Overtime + "/GetAllProcess"), {
      responseType: "json", observe: 'response', params: {}
    });

    request.subscribe((response) => {
      let result = response as any;
      if (result?.status == 200) {
        this.overtimeProcessList = result.body as OvertimeTimeCard[];
      }
    },
      (error) => {
        if (error?.status == 404) {
          this.overtimeProcessList = [];
        }
        this.utilityService.fail(error.msg?.message, "Server Response");
      }
    )
  }

  submitOvertimeTimeCardForm(form: NgForm) {

    //console.log("overtimeTimeCard >>",this.overtimeTimeCard)
    const formData = new FormData();
    formData.append("OvertimeId", this.overtimeTimeCard.overtimeId.toString());
    formData.append("OvertimeName", this.overtimeTimeCard.overtimeName.toString());
    formData.append("Month", this.overtimeTimeCard.month.toString());
    formData.append("Year", this.overtimeTimeCard.year.toString());
    formData.append("IsUnitUpload", this.overtimeTimeCard.isUnitUpload.toString());
    formData.append("IsAmountUpload", this.overtimeTimeCard.isAmountUpload.toString());
    formData.append("ExcelFile", this.overtimeTimeCard.excelFile);

    var request =  this.areasHttpService.observable_post((ApiArea.payroll + ApiController.Overtime + "/UploadTimeCard"), formData, {  observe: 'response', params: {} });
    
    request.subscribe((response) => {
      let result = response as any;
      if (result?.status == 200) {
        this.utilityService.success(result.body.message, "Server Response")
        this.modalService.service.dismissAll("Save Complete");
        this.overtimeTimeCard = new OvertimeTimeCard();
        this.excelFileName = "Choose Your excel file";
        //this.getOvertimeProcess();
      }
      else {
        this.utilityService.fail('Something went wrong', "Server Response")
      }
    },
      (error) => {
        if (error.havingValidationError) {
          Object.keys(error.validationErrors).forEach((propertyName: string) => {
            var errorMessages: string[] = error.validationErrors[propertyName];
            //errorMessages.push('The sfdsfs field is required 2');
            //console.log(`Property : ${propertyName}` + ` ${errorMessages.join(' | ')}`);
            this.utilityService.fail(`Property : ${propertyName}` + ` ${errorMessages.join(' | ')}`, "Server Response")
          });
        }
        else {
          this.utilityService.fail(error.msg?.message, "Server Response")
        }
      }
    )
  }
  submitOvertimeTimeCardRollBackForm(form: NgForm) {

    var request =  this.areasHttpService.observable_post((ApiArea.payroll + ApiController.Overtime + "/RollBackTimeCard"), JSON.stringify(this.overtimeTimeCard),
     { 'headers': { 'Content-Type': 'application/json' }, observe: 'response', params: {} })
    request.subscribe((response) => {
      let result = response as any;
      if (result?.status == 200) {
        this.utilityService.success(result.body.message, "Server Response")
        this.modalService.service.dismissAll("Save Complete");
        this.overtimeTimeCard = new OvertimeTimeCard();
      }
      else {
        this.utilityService.fail('Something went wrong', "Server Response")
      }
    },
      (error) => {
        if (error.havingValidationError) {
          Object.keys(error.validationErrors).forEach((propertyName: string) => {
            var errorMessages: string[] = error.validationErrors[propertyName];
            //errorMessages.push('The sfdsfs field is required 2');
            //console.log(`Property : ${propertyName}` + ` ${errorMessages.join(' | ')}`);
            this.utilityService.fail(`Property : ${propertyName}` + ` ${errorMessages.join(' | ')}`, "Server Response")
          });
        }
        else {
          this.utilityService.fail(error.msg?.message, "Server Response")
        }
      }
    )
  }

  select2Options = {
    width: "100%",
    containerCssClass: "form-control form-control-sm text-x-small font-bold",
    theme: "bootstrap4"
  }
  getAllPolicy() {
    var request = this.areasHttpService.observable_get<OvertimePolicy[]>((ApiArea.payroll + ApiController.Overtime + "/GetAllPolicy"), {
      responseType: "json", observe: 'response', params: {}
    });

    request.subscribe((response) => {
      let result = response as any;
      if (result?.status == 200) {
        this.policyList = result.body as OvertimePolicy[];
        this.generateOvertimeDropDownList();
      }},
      (error) => {
        if (error?.status == 404) {
          this.policyList = [];
        }
        this.utilityService.fail(error.msg?.message, "Server Response");
      }
    )
  }
  generateOvertimeDropDownList(){
    this.overtimeList = [];
    this.policyList.forEach((x)=>{this.overtimeList.push({id : x.overtimeId.toString(), text : x.overtimeName});});
  }

  downloadTimeCardExcelFile() {
    this.areasHttpService.observable_get<any>((ApiArea.payroll + ApiController.Overtime + "/DownloadTimeCardExcelFile"), {
      responseType: 'blob', params: { fileName: "OT-Time Card Upload Format.xlsx" }
    }).subscribe((response: any) => {
      if (response.size > 0) {
        var blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = "OT-Time Card Upload Format.xlsx";
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
