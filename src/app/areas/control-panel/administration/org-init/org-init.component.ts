import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { AreasHttpService } from 'src/app/areas/areas.http.service';
import { ApiArea, ApiController } from 'src/app/shared/constants';
import { branch, company, district, division, organization, zone } from 'src/models/control-panel/org-init.model';
import { application } from 'src/models/control-panel/app-config.model';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { transition, trigger, useAnimation } from '@angular/animations';
import { bounceIn, fadeIn, fadeInRight, slideInUp } from 'ng-animate';
import { UserService } from 'src/app/shared/services/user.service';


@Component({
  selector: 'app-org-init',
  templateUrl: './org-init.component.html',
  animations: [
    trigger('slideInUp', [transition('* => *', useAnimation(slideInUp, { params: { timing: 0.5 } }))]),
    trigger('fadeIn', [transition('void => *', useAnimation(fadeIn, { params: { timing: 0.3 } }))]),
    trigger('fadeInRight', [transition('void => *', useAnimation(fadeInRight, { params: { timing: 0.5 } }))]),
    trigger('bounceIn', [transition('void => *', useAnimation(bounceIn, { params: { timing: 1 } }))]),
  ]
})
export class OrgInitComponent implements OnInit {

  // modal element
  @ViewChild('orgModal', { static: true }) orgModal!: ElementRef;
  @ViewChild('companyModal', { static: true }) companyModal!: ElementRef;
  @ViewChild('divisionModal', { static: true }) divisionModal!: ElementRef;
  @ViewChild('districtModal', { static: true }) districtModal!: ElementRef;
  @ViewChild('zoneModal', { static: true }) zoneModal!: ElementRef;
  @ViewChild('branchModal', { static: true }) branchModal!: ElementRef;


  datePickerConfig: Partial<BsDatepickerConfig> = {};

  closeResult: string = '';
  modalTitle: string = "";
 
  appList: application[] = [];
  constructor(public modalService: NgbModal, public areasHttpService: AreasHttpService, public toastr: ToastrService, private userService: UserService) { }

  userData: any = { OrgId: 0, ComId: 0, BranchId: 0, UserId: this.userService.User().UserId };
  imagePath: string = this.areasHttpService.imageRoot;
  pagePrivilege: any= this.userService.getPrivileges();
  ngOnInit(): void {
    this.datePickerConfig = Object.assign({}, {
      containerClass: "theme-dark-blue",
      showWeekNumbers: false,
      dateInputFormat: "DD-MMM-YYYY",
      isAnimated: true,
      showClearButton: true,
      showTodayButton: true,
      todayPosition: "left"
    })
    this.getApplications();
    this.getOrganizations();
    this.getCompanies();
    this.getDivisions();
    // this.getDistricts();
    // this.getZones();
    this.getBranches();
  }

  // modal 
  open(content: any, size: string) {
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title', size: size, backdrop:
        'static', keyboard: false
    }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  getApplications() {
    this.areasHttpService.observable_get((ApiArea.controlpanel + ApiController.administration + "/GetApplications"), { responseType: "json", params: this.userData }).subscribe(data => {
      this.appList = data as application[];
    })
  }

  //#region org
  organization: organization = {
    organizationId: 0,
    orgCode:"",
    organizationName: "",
    shortName: "",
    address: "",
    email: "",
    phoneNumber: "",
    mobileNumber: "",
    website: "",
    fax: "",
    isActive: false,
    contractStartDate: null,
    contractExpireDate: null,
    remarks: null,
    orgPic: null,
    orgPicFile: null,
    orgLogoPath: "",
    orgBase64Pic: null,
    orgImageFormat: "",
    reportPic: null,
    reportPicFile: null,
    reportLogoPath: "",
    reportImageFormat: "",
    reportBase64Pic: null,
    appId: 0,
    appName: "",
    createdBy: null,
    createdDate: null,
    updatedBy: null,
    updatedDate: null

  }

  openOrgModal() {
    this.organization = {
      organizationId: 0,
      orgCode:"",
      organizationName: "",
      shortName: "",
      address: "",
      email: "",
      phoneNumber: "",
      mobileNumber: "",
      website: "",
      fax: "",
      isActive: false,
      contractStartDate: null,
      contractExpireDate: null,
      remarks: null,
      orgPic: null,
      orgPicFile: null,
      orgLogoPath: "",
      orgBase64Pic: null,
      orgImageFormat: "",
      reportPic: null,
      reportPicFile: null,
      reportLogoPath: "",
      reportBase64Pic: null,
      reportImageFormat: "",
      appId: 0,
      appName: "",
      createdBy: null,
      createdDate: null,
      updatedBy: null,
      updatedDate: null
    }
    this.modalTitle = "Add Organization";
    this.open(this.orgModal, "xl");
  }

  imageURL: string = "";

  showPreview(file: any, pic: string) {
    //this.organization.orgBase64Pic="";
    //this.organization.reportBase64Pic="";
    
    if (file != null || file != undefined) {
      let previewImage = "";
      console.log(file)
      var img = (file.target as HTMLInputElement).files[0];
      // File Preview
      if (img != null && img != undefined) {
        const reader = new FileReader();
        reader.onload = () => {
          if (pic == "orgPic") {
            this.organization.orgBase64Pic = reader.result as string;
          }
          if (pic == "orgRptPic") {
            this.organization.reportBase64Pic = reader.result as string;
          }
          if (pic == "comPic") {
            this.company.companyBase64Pic = reader.result as string;
          }
          if (pic == "comRptPic") {
            this.company.reportBase64Pic = reader.result as string;
          }
        }
        if (pic == "orgPic") {
          this.organization.orgPicFile = img;
          this.organization.orgImageFormat = img.type;
        } // orgPic
        if (pic == "orgRptPic") {
          this.organization.reportPicFile = img;
          this.organization.reportImageFormat = img.type;
        } // orgRptPic
        if (pic == "comPic") {
          this.company.companyPicFile = img;
          this.company.companyImageFormat = img.type;
        } // comPic
        if (pic == "comRptPic") {
          this.company.reportPicFile = img;
          this.company.reportImageFormat = img.type;
        }
        reader.readAsDataURL(img)
      }
    }
  }

  submitOrganization() {
    const formData = new FormData();
    formData.append("OrganizationId", this.organization.organizationId.toString());
    formData.append("IsActive", this.organization.isActive.toString());
    formData.append("OrganizationName", this.organization.organizationName);
    formData.append("ShortName", this.organization.shortName);
    formData.append("OrgCode", this.organization.orgCode);
    formData.append("Address", this.organization.address);
    formData.append("Email", this.organization.email);
    formData.append("PhoneNumber", this.organization.phoneNumber = this.organization.phoneNumber == null ? "" : this.organization.phoneNumber);
    formData.append("MobileNumber", this.organization.mobileNumber = this.organization.mobileNumber == null ? "" : this.organization.mobileNumber);
    formData.append("Website", (this.organization.website = this.organization.website == null ? "" : this.organization.website));
    formData.append("Fax", this.organization.fax = (this.organization.fax = this.organization.fax == null ? "" : this.organization.fax));
    formData.append("ContractStartDate", this.organization.contractStartDate.toUTCString());
    formData.append("ContractExpireDate", this.organization.contractExpireDate.toUTCString());
    formData.append("AppId", this.organization.appId.toString());
    formData.append("Remarks", this.organization.remarks = this.organization.remarks == null ? "" : this.organization.remarks);
    formData.append("OrgPicFile", this.organization.orgPicFile);
    formData.append("ReportPicFile", this.organization.reportPicFile);
    formData.append("OrgImageFormat", this.organization.orgImageFormat = this.organization.orgImageFormat == null ? "" : this.organization.orgImageFormat);
    formData.append("ReportImageFormat", this.organization.reportImageFormat = this.organization.reportImageFormat == null ? "" : this.organization.reportImageFormat);

    this.areasHttpService.observable_post((ApiArea.controlpanel + ApiController.administration + "/SaveOrgnaization"),
      formData,
      {
        params: this.userData
      }).subscribe(status => {
        if (status) {
          this.toastr.success("Saved Successfull", "Server Response", { timeOut: 800 })
          this.modalService.dismissAll("Save Complete");
          this.getOrganizations();
        }
      })
  }
  
  orgList: organization[] = null;
  getOrganizations() {
    this.areasHttpService.observable_get((ApiArea.controlpanel + ApiController.administration + "/GetOrganizations"), { params: this.userData }).subscribe(data => {
      this.orgList = data as organization[];
      console.log("data >>>",data);
    })
  }

  editOrganization(id: number) {
    this.organization = Object.assign({}, this.orgList.find(org => org.organizationId == id));
    this.organization.contractStartDate = new Date(this.organization.contractStartDate);
    this.organization.contractExpireDate = new Date(this.organization.contractExpireDate);
    this.modalTitle = "Update Organization";
    this.open(this.orgModal, "xl");
  }

  deleteOrganization(id: number, name: string) {
    if (confirm("Are you sure you want to delete " + name + "?")) {
      if (id > 0) {
        this.areasHttpService.observable_delete((ApiArea.controlpanel + ApiController.
          administration + "/DeleteOrganization"), {
          params: { OrganizationId: id, OrgId: 1, ComId: 1, BranchId: 1, UserId: "1234567890" }
        }).subscribe(response => {
          if (response) {
            this.toastr.success("Delete is Successfull", "Server Response", { timeOut: 800 });
            this.getOrganizations();
          }
          else {
            this.toastr.error("Something went wrong", "Server Response", { timeOut: 800 });
          }
        });
      }
    }
  }
  //#endregion

  //#region Company
  company: company = {
    companyId: 0,
    companyName: "",
    companyCode: "",
    address: "",
    email: "",
    phoneNumber: "",
    mobileNumber: "",
    fax: "",
    website: "",
    isActive: false,
    contractExpireDate: null,
    remarks: "",
    companyPic: null,
    companyPicFile: null,
    companyImageFormat: "",
    companyBase64Pic: "",
    companyLogoPath: "",
    reportBase64Pic: "",
    reportImageFormat: "",
    reportLogoPath: null,
    reportPic: null,
    reportPicFile: null,
    organizationId: 0,
    organizationName: ""
  }
  companyList: company[] = null;

  openCompanyModal() {
    this.company = {
      companyId: 0,
      companyName: "",
      companyCode: "",
      address: "",
      email: "",
      phoneNumber: "",
      mobileNumber: "",
      fax: "",
      website: "",
      isActive: false,
      contractExpireDate: null,
      remarks: "",
      companyPic: null,
      companyPicFile: null,
      companyImageFormat: "",
      companyBase64Pic: "",
      companyLogoPath: "",
      reportBase64Pic: "",
      reportImageFormat: "",
      reportLogoPath: null,
      reportPic: null,
      reportPicFile: null,
      organizationId: 0,
      organizationName: ""
    }
    this.modalTitle = "Add Company";
    this.open(this.companyModal, "xl");
  }

  getCompanies() {
    this.areasHttpService.observable_get((ApiArea.controlpanel + ApiController.administration + "/GetCompanies"), { params: this.userData }).subscribe(data => {
      this.companyList = data as company[];
    })
  }

  submitCompany() {
    const formData = new FormData();
    formData.append("CompanyId", this.company.companyId.toString());
    formData.append("CompanyName", this.company.companyName);
    formData.append("CompanyCode", this.company.companyCode = this.company.companyCode == null ? "" : this.company.companyCode);
    formData.append("IsActive", this.company.isActive.toString());
    formData.append("Address", this.company.address);
    formData.append("Email", this.company.email);
    formData.append("PhoneNumber", this.company.phoneNumber = this.company.phoneNumber ==
      null ? "" : this.company.phoneNumber);
    formData.append("MobileNumber", this.company.mobileNumber = this.company.mobileNumber
      == null ? "" : this.company.mobileNumber);
    formData.append("Website", (this.company.website = this.company.website == null ? ""
      : this.company.website));
    formData.append("Fax", this.company.fax = (this.company.fax = this.company.fax
      == null ? "" : this.company.fax));
    //formData.append("ContractExpireDate", this.company.contractExpireDate.toUTCString());
    formData.append("OrganizationId", this.company.organizationId.toString());
    formData.append("Remarks", this.company.remarks = this.company.remarks == null ? "" :
      this.company.remarks);
    formData.append("CompanyPicFile", this.company.companyPicFile);
    formData.append("ReportPicFile", this.company.reportPicFile);
    formData.append("CompanyImageFormat", this.company.companyImageFormat = this.company.
      companyImageFormat == null ? "" : this.company.companyImageFormat);
    formData.append("ReportImageFormat", this.company.reportImageFormat = this.company.
      reportImageFormat == null ? "" : this.company.reportImageFormat);
    this.areasHttpService.observable_post((ApiArea.controlpanel + ApiController.administration + "/SaveCompany"),
      formData,
      {
        params: this.userData
      }).subscribe(status => {
        if (status) {
          this.toastr.success("Saved Successfull", "Server Response", { timeOut: 800 })
          this.modalService.dismissAll("Save Complete");
          this.getCompanies();
        }
      })
  }

  editCompany(id: number) {
    this.company = Object.assign({}, this.companyList.find(com => com.companyId == id));
    this.company.contractExpireDate = new Date(this.company.contractExpireDate);
    this.modalTitle = "Update Company";
    this.open(this.companyModal, "xl");
  }

  deleteCompany(id: number, name: string) {
    if (confirm("Are you sure you want to delete " + name + "?")) {
      if (id > 0) {
        this.areasHttpService.observable_delete((ApiArea.controlpanel + ApiController.administration + "/DeleteCompany"), {
          params: { CompanyId: id, OrgId: 1, ComId: 1, BranchId: 1, UserId: "1234567890" }
        }).subscribe(response => {
          if (response) {
            this.toastr.success("Delete is Successfull", "Server Response", { timeOut: 800 });
            this.getCompanies();
          }
          else {
            this.toastr.error("Something went wrong", "Server Response", { timeOut: 800 });
          }
        });
      }
    }
  }

  //#endregion

  //#region division
  division: division = {
    divisionId: 0,
    divisionName: "",
    shortName: "",
    divCode: "",
    isActive: false,
    companyId: 0,
    companyName: "",
    organizationId: 0,
    organizationName: ""
  }

  divisionList: division[] = null;

  openDivisionModal() {
    this.division = {
      divisionId: 0,
      divisionName: "",
      shortName: "",
      divCode: "",
      isActive: false,
      companyId: 0,
      companyName: "",
      organizationId: 0,
      organizationName: ""
    }
    this.modalTitle = "Add Division";
    this.open(this.divisionModal, "lg");
  }

  ddlDivisionList: any[]=[];
  getddlDivision(){
    this.ddlDivisionList=[];
    this.divisionList.forEach(item=>{
      this.ddlDivisionList.push({
        value: item.divisionId, text: (item.divisionName + "-" + item.companyName)
      })
    })
  }


  getDivisions() {
    this.areasHttpService.observable_get((ApiArea.controlpanel + ApiController.administration + "/GetDivisions"), {
      responseType:"json", params: this.userData
    }).subscribe(data => {
      this.divisionList = data as division[];
      console.log("divisionList >>>>", this.divisionList);
    })
  }

  editDivision(id: number) {
    this.division = Object.assign({}, this.divisionList.find(div => div.divisionId == id));
    this.modalTitle = "Update Division";
    this.open(this.divisionModal, "lg");
  }

  submitDivision() {
    this.areasHttpService.observable_post((ApiArea.controlpanel + ApiController.administration + "/SaveDivision"),
      JSON.stringify(this.division),
      {
        'headers': {
          'Content-Type': 'application/json'
        },
        params: this.userData
      }).subscribe(status => {
        if (status) {
          this.toastr.success("Saved Successfull", "Server Response", { timeOut: 800 })
          this.modalService.dismissAll("Save Complete");
          this.getDivisions();
        }
      })
  }

  deleteDivision(id: number, name: string) {
    if (confirm("Are you sure you want to delete " + name + "?")) {
      if (id > 0) {
        this.areasHttpService.observable_delete((ApiArea.controlpanel + ApiController.administration + "/DeleteDivision"), {
          params: { DivisionId: id, OrgId: 1, ComId: 1, BranchId: 1, UserId: "1234567890" }
        }).subscribe(response => {
          if (response) {
            this.toastr.success("Delete is Successfull", "Server Response", { timeOut: 800 });
            this.getDivisions();
          }
          else {
            this.toastr.error("Something went wrong", "Server Response", { timeOut: 800 });
          }
        });
      }
    }
  }
  //#endregion

  //#region district
  district: district = {
    districtId: 0,
    districtName: "",
    shortName: "",
    disCode: "",
    isActive: false,
    divisionId: 0,
    divisionName: "",
    companyId: 0,
    companyName: "",
    organizationId: 0,
    organizationName: ""
  }

  districtList: district[] = null;

  openDistrictModal() {
    this.district = {
      districtId: 0,
      districtName: "",
      shortName: "",
      disCode: "",
      isActive: false,
      divisionId: 0,
      divisionName: "",
      companyId: 0,
      companyName: "",
      organizationId: 0,
      organizationName: ""
    }
    this.modalTitle = "Add District";
    this.open(this.districtModal, "lg");
  }

  getDistricts() {
    this.areasHttpService.observable_get((ApiArea.controlpanel + ApiController.administration + "/GetDistricts"), {
      responseType:
        "json", params: this.userData
    }).subscribe(data => {
      this.districtList = data as district[];
      console.log("districtList >>>>", this.districtList);
    })
  }

  editDistrict(id: number) {
    this.district = Object.assign({}, this.districtList.find(dis => dis.districtId == id));
    this.modalTitle = "Update District";
    this.open(this.districtModal, "lg");
  }

  deleteDistrict(id: number, name: string) {
    if (confirm("Are you sure you want to delete " + name + "?")) {
      if (id > 0) {
        this.areasHttpService.observable_delete((ApiArea.controlpanel + ApiController.
          administration + "/DeleteDistrict"), {
          params: { DistrictId: id, OrgId: 1, ComId: 1, BranchId: 1, UserId: "1234567890" }
        }).subscribe(response => {
          if (response) {
            this.toastr.success("Delete is Successfull", "Server Response", { timeOut: 800 });
            this.getDistricts();
          }
          else {
            this.toastr.error("Something went wrong", "Server Response", { timeOut: 800 });
          }
        });
      }
    }
  }

  submitDistrict() {
    this.areasHttpService.observable_post((ApiArea.controlpanel + ApiController.administration + "/SaveDistrict"),
      JSON.stringify(this.district),
      {
        'headers': {
          'Content-Type': 'application/json'
        },
        params: this.userData
      }).subscribe(status => {
        if (status) {
          this.toastr.success("Saved Successfull", "Server Response", { timeOut: 800 })
          this.modalService.dismissAll("Save Complete");
          this.getDistricts();
        }
      })
  }
  //#endregion

  //#region zone
  zone: zone = {
    zoneId: 0,
    zoneName: "",
    shortName: "",
    zoneCode: "",
    isActive: false,
    districtId: 0,
    districtName: "",
    divisionName: "",
    divisionId: 0,
    companyId: 0,
    companyName: "",
    organizationId: 0,
    organizationName: ""
  }
  zoneList: zone[] = null;
  ddlDistrict: any = [];

  getddlDistrict() {
    this.ddlDistrict = [];
    this.districtList.forEach(dist => {
      var dis = Object.assign({}, dist);
      var div = Object.assign({}, this.divisionList.find(d => d.divisionId == dis.divisionId));
      var com = Object.assign({}, this.companyList.find(c => c.companyId == div.companyId));
      dis.districtName = dis.districtName + " [" + div.divisionName + "-" + com.companyName + "]";
      this.ddlDistrict.push({ value: dis.districtId, text: dis.districtName });
    });
  }

  getZones() {
    this.areasHttpService.observable_get((ApiArea.controlpanel + ApiController.administration + "/GetZones"), {
      responseType:
        "json", params: this.userData
    }).subscribe(data => {
      this.zoneList = data as zone[];
      console.log("zoneList >>>>", this.zoneList);
    })
  }

  openZoneModal() {
    this.zone = {
      zoneId: 0,
      zoneName: "",
      shortName: "",
      zoneCode: "",
      isActive: false,
      districtId: 0,
      districtName: "",
      divisionName: "",
      divisionId: 0,
      companyId: 0,
      companyName: "",
      organizationId: 0,
      organizationName: ""
    }
    this.modalTitle = "Add Zone";
    this.open(this.zoneModal, "lg");
    this.getddlDistrict();
  }

  submitZone() {

    this.areasHttpService.observable_post((ApiArea.controlpanel + ApiController.administration + "/SaveZone"),
      JSON.stringify(this.zone),
      {
        'headers': {
          'Content-Type': 'application/json'
        },
        params: this.userData
      }).subscribe(status => {
        if (status) {
          this.toastr.success("Saved Successfull", "Server Response", { timeOut: 800 })
          this.modalService.dismissAll("Save Complete");
          this.getZones();
        }
      })
  }

  editZone(id: number) {
    this.zone = Object.assign({}, this.zoneList.find(zn => zn.zoneId == id));
    this.modalTitle = "Update Zone";
    this.open(this.zoneModal, "lg");
    this.getddlDistrict();
  }

  deleteZone(id: number, name: string) {
    if (confirm("Are you sure you want to delete " + name + "?")) {
      if (id > 0) {
        this.areasHttpService.observable_delete((ApiArea.controlpanel + ApiController.
          administration + "/DeleteZone"), {
          params: { ZoneId: id, OrgId: 1, ComId: 1, BranchId: 1, UserId: "1234567890" }
        }).subscribe(response => {
          if (response) {
            this.toastr.success("Delete is Successfull", "Server Response", { timeOut: 800 });
            this.getZones();
          }
          else {
            this.toastr.error("Something went wrong", "Server Response", { timeOut: 800 });
          }
        });
      }
    }
  }
  //#endregion

  //#region branch
  branch: branch = {
    branchId: 0,
    branchName: "",
    branchCode: "",
    shortName: "",
    mobileNo: "",
    phoneNo: "",
    email: "",
    fax: "",
    address: "",
    isActive: false,
    remarks: "",
    zoneId: 0,
    zoneName: "",
    districtId: 0,
    districtName: "",
    divisionId: 0,
    divisionName: "",
    companyId: 0,
    companyName: "",
    organizationId: 0,
    organizationName: ""
  }
  branchList: branch[] = null;
  ddlZone: any = [];

  openBranchModal() {
    this.branch = {
      branchId: 0,
      branchName: "",
      branchCode: "",
      shortName: "",
      mobileNo: "",
      phoneNo: "",
      email: "",
      fax: "",
      address: "",
      isActive: false,
      remarks: "",
      zoneId: 0,
      zoneName: "",
      districtId: 0,
      districtName: "",
      divisionId: 0,
      divisionName: "",
      companyId: 0,
      companyName: "",
      organizationId: 0,
      organizationName: ""
    }
    this.modalTitle = "Add Branch";
    this.open(this.branchModal, "xl");
    //this.getddlZone();
    this.getddlDivision();
  }

  getddlZone() {
    this.ddlZone = [];
    this.zoneList.forEach(zn => {
      var z = Object.assign({}, zn);
      var dis = Object.assign({}, this.districtList.find(d => d.districtId == z.districtId));
      var div = Object.assign({}, this.divisionList.find(d => d.divisionId == dis.divisionId));
      var com = Object.assign({}, this.companyList.find(c => c.companyId == div.companyId));
      z.zoneName = z.zoneName + " [" + dis.districtName + "-" + div.divisionName + "-" + com.companyName + "]";
      this.ddlZone.push({ value: z.zoneId, text: z.zoneName });
    });
  }

  getBranches() {
    this.areasHttpService.observable_get((ApiArea.controlpanel + ApiController.administration + "/GetBranches"), { responseType: "json", params: this.userData }).subscribe(data => {
      this.branchList = data as branch[];
    })
  }

  submitBranch() {
    this.areasHttpService.observable_post((ApiArea.controlpanel + ApiController.administration + "/SaveBranch"),
      JSON.stringify(this.branch),
      {
        'headers': {
          'Content-Type': 'application/json'
        },
        params: this.userData
      }).subscribe(status => {
        if (status) {
          this.toastr.success("Saved Successfull", "Server Response", { timeOut: 800 })
          this.modalService.dismissAll("Save Complete");
          this.getBranches();
        }
      })
  }

  editBranch(id: number) {
    this.branch = Object.assign({}, this.branchList.find(b => b.branchId == id));
    this.modalTitle = "Update Branch";
    this.open(this.branchModal, "xl");
    this.getddlDivision();
  }

  deleteBranch(id: number, name: string) {
    if (confirm("Are you sure you want to delete " + name + "?")) {
      if (id > 0) {
        this.areasHttpService.observable_delete((ApiArea.controlpanel + ApiController.
          administration + "/DeleteBranch"), {
          params: { Id: id, OrgId: 1, ComId: 1, BranchId: 1, UserId: "1234567890" }
        }).subscribe(response => {
          if (response) {
            this.toastr.success("Delete is Successfull", "Server Response", { timeOut: 800 });
            this.getBranches();
          }
          else {
            this.toastr.error("Something went wrong", "Server Response", { timeOut: 800 });
          }
        });
      }
    }
  }

  //#endregion

} // end of component

