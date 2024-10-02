import { transition, trigger, useAnimation } from '@angular/animations';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { bounceIn, fadeIn, fadeInRight, slideInUp } from 'ng-animate';
import { Select2OptionData } from 'ng-select2';
import { ToastrService } from 'ngx-toastr';
import { ApiArea, ApiController } from 'src/app/shared/constants';
import { CustomModalService } from 'src/app/shared/services/custom-modal.service';
import { UserService } from 'src/app/shared/services/user.service';
import { country, district, division, policeStation, location } from 'src/models/hrm/locational-model';
import { AreasHttpService } from '../../areas.http.service';
import { JsonPipe } from '@angular/common';
declare let $: any;



@Component({
  selector: 'app-locational',
  templateUrl: './locational.component.html',
  animations: [
    trigger('slideInUp', [transition('* => *', useAnimation(slideInUp, { params: { timing: 0.5 } }))]),
    trigger('fadeIn', [transition('void => *', useAnimation(fadeIn, { params: { timing: 0.3 } }))]),
    trigger('fadeInRight', [transition('void => *', useAnimation(fadeInRight, { params: { timing: 0.5 } }))]),
    trigger('bounceIn', [transition('void => *', useAnimation(bounceIn, { params: { timing: 1 } }))]),
  ]
})
export class LocationalComponent implements OnInit {
  @ViewChild('countryModal', { static: true }) countryModal!: ElementRef;
  @ViewChild('divisionModal', { static: true }) divisionModal: ElementRef;
  @ViewChild('districtModal', { static: true }) districtModal: ElementRef;
  @ViewChild('policeStationModal', { static: true }) policeStationModal: ElementRef;
  @ViewChild('locationModal', { static: true }) locationModal: ElementRef;

  modalTitle: string = "";
  // options: Options;
  constructor(public modalService: CustomModalService, private areasHttpService: AreasHttpService, public toastr: ToastrService, private userService: UserService) { }

  ngOnInit(): void {
    this.getCountries();
    this.getDivisons();
    this.getDistricts();
    this.getPoliceStation();
    this.getLocations();
    // this.options = {
    // theme: "classic",
    // width: "300"
    // };

    $("#test").select2({
      theme: "bootstrap4",
      placeholder: "Select an option"
    });
  }

  User() {
    return this.userService.getUser();
  }

  clearServerErrorText(objName: string) {
    if (objName = "division") {
      this.duplicateDivision = "";
      this.duplicateDivisionCode = "";
    }
    if (objName = "district") {
      this.duplicateDistrict = "";
      this.duplicateDistrictCode = "";
    }
    if (objName == "location") {
      this.duplicateLocation = "";
    }
  }

  // options: {} = {
  // theme: "default",
  // //classic
  // // dropdownCssClass:"form-control form-control-sm",
  // width:"100%",
  // placeholder:"---Select District---",
  // }

  //#region country

  country: country = {
    countryId: 0,
    countryName: "",
    countryCode: "",
    isoCode: "",
    nationality: "",
    organizationId: 0,
    createdBy: "",
    createdDate: null,
    updatedBy: "",
    updatedDate: null
  }

  countryList: country[] = null;

  openCountryModal() {
    this.country_server_error = null;
    this.country = {
      countryId: 0,
      countryName: "",
      countryCode: "",
      nationality: "",
      isoCode: "",
      organizationId: 0,
      createdBy: "",
      createdDate: null,
      updatedBy: "",
      updatedDate: null
    }
    this.clearServerErrorText("country");
    this.modalTitle = "Add Country";
    this.modalService.open(this.countryModal, "lg");
    this.btnCountry = false;
  }


  editCountry(id: number) {
    this.modalTitle = "Update Country";
    this.btnCountry = false;
    this.country = Object.assign({}, this.countryList.find(c => c.countryId == id));
    this.clearServerErrorText("country");
    this.modalService.open(this.countryModal, "lg");
  }

  getCountries() {
    this.areasHttpService.observable_get((ApiArea.hrms + ApiController.setup + "/GetCountries"),
      { responseType: "json", params: { CountryId: 0, CountryName: "", nationality: "", CountryCode: "", IsoCode: "" } }).subscribe(data => {
        this.countryList = data as country[];
      })
  }

  // Server side error property
  country_server_error: any = null;
  btnCountry: boolean = false;

  submitCountry() {
    this.country_server_error=null;
    this.btnCountry = true;
    this.clearServerErrorText("country");
    this.areasHttpService.observable_post((ApiArea.hrms + ApiController.setup + "/SaveCountry"),
      JSON.stringify(this.country),
      {
        'headers': {
          'Content-Type': 'application/json'
        },
        params: { OrgId: this.User().OrgId, UserId: this.User().UserId }
      }).subscribe((result) => {
        this.btnCountry = false;
        let data = result as any;
        console.log(data)
        if (data.status) {
          this.toastr.success("Saved Successfull", "Server Response", { timeOut: 800 })
          this.modalService.service.dismissAll("Save Complete");
          this.getCountries();
        }
        else {
          if (data.msg == "Validation Error") {
            this.country_server_error = JSON.parse(data.errorMsg)
            console.log("Validation Error");
          }
          else {
            this.toastr.error(data.msg, "Server Response", { timeOut: 800 })
          }
        }
      })
  }
  //#endregion

  //#region division

  division: division = {
    divisionId: 0,
    divisionName: "",
    divisionCode: "",
    countryId: 0,
    countryName: "",
    organizationId: 0,
    createdBy: null,
    createdDate: null,
    updatedBy: null,
    updatedDate: null
  }

  openDivisionModal() {
    this.division_server_error = null;
    this.btnDivision = false;
    this.clearServerErrorText("division");
    this.modalTitle = "Add Division";
    this.division = {
      divisionId: 0,
      divisionName: "",
      divisionCode: "",
      countryId: 0,
      countryName: "",
      organizationId: 0,
      createdBy: null,
      createdDate: null,
      updatedBy: null,
      updatedDate: null
    }
    this.loadDdlCountry();
    this.modalService.open(this.divisionModal, "lg");
  }

  divisionList: division[] = null;
  getDivisons() {
    this.areasHttpService.observable_get((ApiArea.hrms + ApiController.hr + "/GetDivisions"), {
      responseType: "json", params: { divisionId: 0, divisionName: "", divisionCode: "", countryId: 0 }
    }).subscribe(data => {
      this.divisionList = data as division[];
      //console.log("this.divisionList >>>", this.divisionList)
    })
  }

  ddlCountry: any[] = [];
  loadDdlCountry() {
    this.ddlCountry = [];
    this.areasHttpService.observable_get((ApiArea.hrms + ApiController.hr + "/GetCountries"), {
      responseType: "json", params: {
        CountryId: 0, CountryName: "", CountryCode: "", IsoCode: "",
        OrgId: this.User().OrgId
      }
    }).subscribe(data => {
      this.ddlCountry = (data as country[]);
    })
  }

  editDivision(id: number) {
    this.modalTitle = "Update Division";
    this.btnDivision = false;
    this.division = Object.assign({}, this.divisionList.find(d => d.divisionId == id));
    this.clearServerErrorText("division");
    this.modalService.open(this.divisionModal, "lg");
  }

  duplicateDivision: string = "";
  duplicateDivisionCode: string = ""
  division_server_error: any;
  btnDivision: boolean = false;
  submitDivision() {
    this.division_server_error = null;
    this.clearServerErrorText("division");
    this.btnDivision = true;
    this.areasHttpService.observable_post((ApiArea.hrms + ApiController.setup + "/SaveDivision"),
      JSON.stringify(this.division),
      {
        'headers': {
          'Content-Type': 'application/json'
        }
      }).subscribe((result) => {
        this.btnDivision = false;
        let data = result as any;
        console.log(data)
        if (data.status) {
          this.toastr.success("Saved Successfull", "Server Response", { timeOut: 800 })
          this.modalService.service.dismissAll("Save Complete");
          this.getDivisons();
        }
        else {
          if (data.msg == "Validation Error") {
            this.division_server_error = JSON.parse(data.errorMsg);
            console.log("Validation Error");
          }
          else {
            this.toastr.error(data.msg, "Server Response", { timeOut: 800 })
          }
        }
      })
  }
  //#endregion

  //#region District
  district: district = {
    districtId: 0,
    districtName: "",
    districtCode: "",
    divisionId: 0,
    divisionName: "",
    countryId: 0,
    countryName: "",
    organizationId: 0,
    createdBy: null,
    createdDate: null,
    updatedBy: null,
    updatedDate: null
  }

  districtList: district[] = null;

  ddlDivision: any[] = [];

  loadDdlDivision() {
    this.ddlDivision = [];
    this.areasHttpService.observable_get((ApiArea.webservice + ApiController.hrService + "/GetDivisionWithCountry"), {
      responseType: "json", params: {
        divisionName: "", OrgId: this.User().OrgId
      }
    }).subscribe(data => {
      this.ddlDivision = (data as any[]);
    })
  }

  btnDistrict: boolean = false;
  duplicateDistrict: string = "";
  duplicateDistrictCode: string = "";
  divisionAndCountryId: string = "0";

  openDistrictModal() {
    this.district_server_error= null;
    this.modalTitle = "Add District";
    this.district_server_error = null;
    this.divisionAndCountryId = "0";
    this.loadDdlDivision();
    this.district = {
      districtId: 0,
      districtName: "",
      districtCode: "",
      divisionId: 0,
      divisionName: "",
      countryId: 0,
      countryName: "",
      organizationId: 0,
      createdBy: null,
      createdDate: null,
      updatedBy: null,
      updatedDate: null
    }
    this.clearServerErrorText("district");
    this.modalService.open(this.districtModal, "lg");
  }

  getDistricts() {
    this.areasHttpService.observable_get((ApiArea.hrms + ApiController.setup + "/GetDistricts"), {
      responseType: "json", params: { districtId: 0, districtName: "", districtCode: "", divisionId: 0, countryId: 0 }
    }).subscribe(data => {
      console.log("district >>>", data)
      this.districtList = data as district[];
    })
  }

  district_server_error: any;
  submitDistrict() {
    this.district_server_error = null;
    this.btnDistrict = true;
    var dc = this.divisionAndCountryId.split('#');
    this.district.divisionId = parseInt(dc[0]);
    this.district.countryId = parseInt(dc[1]);
    this.areasHttpService.observable_post((ApiArea.hrms + ApiController.setup + "/SaveDistrict"),
      JSON.stringify(this.district),
      {
        'headers': {
          'Content-Type': 'application/json'
        },
        params: { OrgId: this.User().OrgId, UserId: this.User().UserId }
      }).subscribe((result) => {
        this.btnDistrict = false;
        let data = result as any;
        console.log(data)
        if (data.status) {
          this.toastr.success("Saved Successfull", "Server Response", { timeOut: 800 })
          this.modalService.service.dismissAll("Save Complete");
          this.getDistricts();
        }
        else {
          if (data.msg == "Validation Error") {
           this.district_server_error = JSON.parse(data.errorMsg);
            console.log("Validation Error");
          }
          else {
            this.toastr.error(data.msg, "Server Response", { timeOut: 800 })
          }
        }
      })
  }

  editDistrict(id: number) {
    this.modalTitle = "Update District";
    this.btnDistrict = false;
    this.district = Object.assign({}, this.districtList.find(d => d.districtId == id));
    this.divisionAndCountryId = this.district.divisionId.toString() + "#" + this.district.countryId.toString();
    this.loadDdlDivision();
    this.clearServerErrorText("district");
    this.modalService.open(this.districtModal, "lg");
  }

  //#endregion

  //#region PoliceStation

  policeStation: policeStation = {
    policeStationId: 0,
    policeStationName: "",
    districtId: 0,
    districtName: "",
    divisionId: 0,
    divisionName: "",
    countryId: 0,
    countryName: "",
    organizationId: 0,
    createdBy: "",
    createdDate: null,
    updatedBy: "",
    updatedDate: null
  };
  policeStationList: policeStation[] = null;

  openPoliceStationModal() {
    this.police_server_error = null;
    this.policeStation = {
      policeStationId: 0,
      policeStationName: "",
      districtId: 0,
      districtName: "",
      divisionId: 0,
      divisionName: "",
      countryId: 0,
      countryName: "",
      organizationId: 0,
      createdBy: "",
      createdDate: null,
      updatedBy: "",
      updatedDate: null
    };
    this.modalTitle = "Add Police Station";
    this.btnPoliceStation = false;
    this.loadDdlDistrict();
    this.districtWithdivisionAndCountryId = "0";
    this.clearServerErrorText("policeStation");
    this.modalService.open(this.policeStationModal, "lg");
  }

  getPoliceStation() {
    this.areasHttpService.observable_get((ApiArea.hrms + ApiController.setup + "/GetPoliceStations"), {
      responseType: "json", params: { policeStationId: 0, policeStationName: "" }
    }).subscribe(data => {
      console.log("policeStation >>>", data)
      this.policeStationList = data as policeStation[];
    })
  }

  ddlDistrict: any[] = [];
  btnPoliceStation: boolean = false;
  districtWithdivisionAndCountryId: string = "0"

  loadDdlDistrict() {
    this.ddlDistrict = [];
    this.areasHttpService.observable_get((ApiArea.webservice + ApiController.hrService + "/GetDistrictsWithDivisionAndCountry"), {
      responseType: "json", params: {
        DistrictName: "", OrgId: this.User().OrgId
      }
    }).subscribe(data => {
      var value = (data as any[]);
      this.ddlDistrict = (data as any[]);
    })
  }
  editPoliceStation(id: number) {
    this.modalTitle = "Update Police Station";
    this.btnPoliceStation = false;
    this.policeStation = Object.assign({}, this.policeStationList.find(ps => ps.policeStationId == id));
    this.districtWithdivisionAndCountryId = this.policeStation.districtId.toString() + "#" + this.policeStation.divisionId.toString() + "#" + this.policeStation.countryId.
      toString();
    this.loadDdlDistrict();
    this.clearServerErrorText("policeStation");
    this.modalService.open(this.policeStationModal, "lg");
  }

  police_server_error : any;

  submitPoliceStation() {

    this.police_server_error = null;

    var dc = this.districtWithdivisionAndCountryId.split('#');
    this.policeStation.districtId = parseInt(dc[0]);
    this.policeStation.divisionId = parseInt(dc[1]);
    this.policeStation.countryId = parseInt(dc[2]);

    this.btnPoliceStation = true;
    this.areasHttpService.observable_post((ApiArea.hrms + ApiController.setup + "/SavePoliceStation"),
      JSON.stringify(this.policeStation),
      {
        'headers': {
          'Content-Type': 'application/json'
        },
        params: { OrgId: this.User().OrgId, UserId: this.User().UserId }
      }).subscribe((result) => {
        this.btnPoliceStation = false;
        let data = result as any;
        console.log(data)
        if (data.status) {
          this.toastr.success("Saved Successfull", "Server Response", { timeOut: 800 })
          this.modalService.service.dismissAll("Save Complete");
          this.getPoliceStation();
        }
        else {
          if (data.msg == "Validation Error") {
            console.log("Validation Error");
            this.police_server_error = JSON.parse(data.errorMsg);
          }
          else {
            this.toastr.error(data.msg, "Server Response", { timeOut: 800 })
          }
        }
      })
  }
  //#endregion

  //#region Location
  location: location = {
    locationId: 0,
    locationName: "",
    policeStationId: 0,
    policeStationName: "",
    districtId: 0,
    districtName: "",
    divisionId: 0,
    divisionName: "",
    countryId: 0,
    countryName: "",
    organizationId: 0,
    createdBy: null,
    createdDate: null,
    updatedBy: null,
    updatedDate: null,
  }
  btnLocation: boolean = false;
  duplicateLocation: string = "";
  policeStationExtentionValue: string = "0";
  ddlPoliceStation: any[] = [];
  locationList: location[] = null;

  loadDdlPoliceStation() {
    this.ddlPoliceStation = [];
    this.areasHttpService.observable_get((ApiArea.webservice + ApiController.hrService + "/GetPolicaStationExtenstion"), {
      responseType: "json", params: {
        flag: "3", OrgId: this.User().OrgId
      }
    }).subscribe((data) => {
      this.ddlPoliceStation = (data as any[]);
    },
      (error) => {
        this.toastr.error(error.error, "Server Response", { timeOut: 1000 })
      })
  }
  openLocationModal() {
    this.location_server_error = null;
    this.modalTitle = "Add Location";
    this.btnLocation = false;
    this.clearServerErrorText("location");
    this.policeStationExtentionValue = "0";
    this.loadDdlPoliceStation();
    this.location = {
      locationId: 0,
      locationName: "",
      policeStationId: 0,
      policeStationName: "",
      districtId: 0,
      districtName: "",
      divisionId: 0,
      divisionName: "",
      countryId: 0,
      countryName: "",
      organizationId: 0,
      createdBy: null,
      createdDate: null,
      updatedBy: null,
      updatedDate: null,
    }
    this.modalService.open(this.locationModal, "lg");
  }
  getLocations() {
    //  
    this.areasHttpService.observable_get((ApiArea.hrms + ApiController.hr + "/GetLocations"), {
      responseType: "json", params: { locationId: 0, locationName: "", policeStationId: 0 }
    }).subscribe((data) => {
      console.log("locationList >>>", data)
      this.locationList = data as location[];
    },
      (error) => {
        this.toastr.error(error.error, "Server Response", { timeOut: 1000 })
      })
  }

  location_server_error: any;
  submitLocation() {
    this.location_server_error =null;
    this.btnLocation = true;
    this.clearServerErrorText("location");
    if (this.policeStationExtentionValue != "0") {
      var val = this.policeStationExtentionValue.split("#");
      this.location.policeStationId = parseInt(val[0]);
      this.location.districtId = parseInt(val[1]);
      this.location.divisionId = parseInt(val[2]);
      this.location.countryId = parseInt(val[3]);
    }
    else {
      this.location.policeStationId = 0;
      this.location.districtId = 0;
      this.location.divisionId = 0;
      this.location.countryId = 0;
    }
    this.areasHttpService.observable_post((ApiArea.hrms + ApiController.hr + "/SaveLocation"),
      JSON.stringify(this.location),
      {
        'headers': {
          'Content-Type': 'application/json'
        },
        params: { OrgId: this.User().OrgId, UserId: this.User().UserId }
      }).subscribe(
        (result) => {
          this.btnLocation = false;
          let data = result as any;
          //console.log(data)
          if (data.status) {
            this.toastr.success("Saved Successfull", "Server Response", { timeOut: 800 })
            this.modalService.service.dismissAll("Save Complete");
            this.getLocations();
          }
          else {
            if (data.msg == "Validation Error") {
              this.location_server_error = JSON.parse(data.errorMsg);
              console.log("Validation Error");
            }
            else {
              this.toastr.error(data.msg, "Server Response", { timeOut: 800 })
            }
          }
        },
        (error) => {
          this.btnLocation = false;
          this.toastr.error(error.error, "Server Response", { timeOut: 1000 })
        }
      )

  }
  editLocation(id: number) {
    this.modalTitle = "Update Location";
    this.btnLocation = false;
    this.loadDdlPoliceStation();
    this.location = Object.assign({}, this.locationList.find(l => l.locationId == id));
    this.policeStationExtentionValue = this.location.policeStationId.toString() + "#" +
      this.location.districtId.toString() + "#" +
      this.location.divisionId.toString() + "#" +
      this.location.countryId.toString();
    this.clearServerErrorText("location");
    this.modalService.open(this.locationModal, "lg");
  }

  //#endregion
}
