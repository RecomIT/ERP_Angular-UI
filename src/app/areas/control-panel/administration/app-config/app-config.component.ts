import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { AreasHttpService } from 'src/app/areas/areas.http.service';
import { ApiArea, ApiController, AppConstants } from 'src/app/shared/constants';
import { application, appModule, mainmenu, pageTab, submenu } from 'src/models/control-panel/app-config.model';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { PaginatedResult } from 'src/models/web-service/web-extension';
import { catchError, map } from 'rxjs/operators';
import { Observable } from "rxjs";
import { UserService } from 'src/app/shared/services/user.service';
import { transition, trigger, useAnimation } from '@angular/animations';
import { bounceIn, fadeIn, fadeInRight, slideInUp } from 'ng-animate';
// import { OidcSecurityService } from 'angular-auth-oidc-client';

@Component({
  selector: 'app-app-config',
  templateUrl: './app-config.component.html',
  animations: [
    trigger('slideInUp', [transition('* => *', useAnimation(slideInUp, { params: { timing: 0.5 } }))]),
    trigger('fadeIn', [transition('void => *', useAnimation(fadeIn, { params: { timing: 0.3 } }))]),
    trigger('fadeInRight', [transition('void => *', useAnimation(fadeInRight, { params: { timing: 0.5 } }))]),
    trigger('bounceIn', [transition('void => *', useAnimation(bounceIn, { params: { timing: 1 } }))]),
  ]

})

export class AppConfigComponent implements OnInit {

  @ViewChild('appModal', { static: true }) appModal!: ElementRef;
  @ViewChild('moduleModal', { static: true }) moduleModal!: ElementRef;
  @ViewChild('mainmenuModal', { static: true }) mainmenuModal!: ElementRef;
  @ViewChild('submenuModal', { static: true }) submenuModal!: ElementRef;
  @ViewChild('pageTabModal', { static: true }) pageTabModal!: ElementRef;

  modalTitle: string = "";
  pageSize: number = 15;

  constructor(public modalService: NgbModal, private areasHttpService: AreasHttpService, public toastr: ToastrService,
    private httpClient: HttpClient, private userService: UserService) {
  }

  userData: any = { OrgId: 0, ComId: 0, BranchId: 0, UserId: this.userService.User().UserId };

  submenuPageNo: number = 1;
  tabPageNo: number = 1;

  pagePrivilege: any = this.userService.getPrivileges();
  submenuConfig: any = this.userService.pageConfigInit("submenuData", this.pageSize, 1, 0);
  pageTabConfig: any = this.userService.pageConfigInit("pageTabData", this.pageSize, 1, 0);

  app: application = {
    applicationId: 0,
    applicationName: "",
    applicationType: "",
    isActive: false,
    createdBy: null,
    createdDate: null,
    updatedBy: null,
    updatedDate: null
  };


  appList: application[] = null;

  appTypes = ["ERP Web", "Mobile App"];

  closeResult: string = '';

  ngOnInit(): void {
    //, public oidcSecurityService: OidcSecurityService
    // this.oidcSecurityService.checkAuth().subscribe(({ isAuthenticated, userData }) => {
    // console.log("User Data", userData)
    // console.log("Is Authentic", isAuthenticated)
    // console.log("Token", this.oidcSecurityService.getAccessToken())
    // }
    // );
    //this.getTest();
    this.getApplications();
    this.getModules();
    this.getMainmenus();
    this.getSubmenus({ submenuName: "", mainmenuId: 0, moduleId: 0, applicationId: 0, pageNumber: 1, pageSize: this.pageSize });
    this.loadSubmenu("hasTabSearch");
    this.getPagetabs({ tabName: "", submenuId: 0, mainmenuId: 0, pageNumber: 1, pageSize: this.pageSize });
  }

  // getTest(){
  // this.httpClient.get('https://localhost:44363/secret', {
  // // headers: new HttpHeaders({
  // // Authorization: "Bearer " + this.oidcSecurityService.getAccessToken()
  // // }),
  // responseType: 'text'
  // })
  // .subscribe((data) => {
  // console.log("Api data", data);
  // })
  // }

  // modal 
  open(content: any, size: string) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: size, backdrop: 'static', keyboard: false }).result.then((result) => {
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
    this.areasHttpService.observable_get((ApiArea.controlpanel + ApiController.administration + "/GetApplications"),
      {
        // headers: new HttpHeaders({
        // Authorization: "Bearer " + this.userService.getToken()
        // }),
        responseType: "json", params: this.userData
      }).subscribe(data => {
        this.appList = data as application[];
      })
  }

  openAppModal() {
    this.app = {
      applicationId: 0,
      applicationName: "",
      applicationType: "",
      isActive: false,
      createdBy: null,
      createdDate: null,
      updatedBy: null,
      updatedDate: null
    }
    this.modalTitle = "Add New Application";
    this.open(this.appModal, "lg");
  }

  editApplication(id: number) {
    this.modalTitle = "Update Application";
    this.app = Object.assign({}, this.appList.find(a => a.applicationId == id));
    this.open(this.appModal, "lg");
  }

  deleteApplication(id: number, name: string) {
    if (confirm("Are you sure you want to delete " + name + "?")) {
      if (id > 0) {
        this.areasHttpService.observable_delete((ApiArea.controlpanel + ApiController.administration + "/DeleteApplication"), {
          params: { ApplicationId: id, OrgId: 1, ComId: 1, BranchId: 1, UserId: "1234567890" }
        }).subscribe(response => {
          if (response) {
            this.toastr.success("Delete is Successfull", "Server Response", { timeOut: 800 });
            this.getApplications();
          }
          else {
            this.toastr.error("Delete is Unsuccessfull", "Server Response", { timeOut: 800 });
          }
        });
      }
    }
  }

  submitApplication() {
    this.areasHttpService.observable_post((ApiArea.controlpanel + ApiController.administration + "/SaveApplication"),
      JSON.stringify(this.app),
      {
        'headers': {
          'Content-Type': 'application/json'
        },
        params: this.userData
      }).subscribe(status => {
        if (status) {
          this.toastr.success("Saved Successfull", "Server Response", { timeOut: 800 })
          this.modalService.dismissAll("Save Complete");
          this.getApplications();
        }
      })
  }

  // module tab //
  module: appModule = {
    moduleId: 0,
    moduleName: "",
    applicationId: 0,
    applicationName: "",
    isActive: false,
    createdBy: null,
    createdDate: null,
    updatedBy: null,
    updatedDate: null
  };

  moduleList: appModule[] = null;

  getModules() {
    this.areasHttpService.observable_get((ApiArea.controlpanel + ApiController.administration + "/GetModules"), { responseType: "json", params: this.userData }).subscribe(data => {
      this.moduleList = data as appModule[];
    })
  }

  openModuleModal() {
    this.module = {
      moduleId: 0,
      moduleName: "",
      applicationId: 0,
      applicationName: "",
      isActive: false,
      createdBy: null,
      createdDate: null,
      updatedBy: null,
      updatedDate: null
    };
    this.modalTitle = "Add New Module";
    this.open(this.moduleModal, "lg");
  }

  editModule(id: number) {
    this.modalTitle = "Update Module";
    this.module = Object.assign({}, this.moduleList.find(m => m.moduleId == id));
    this.open(this.moduleModal, "lg");
  }

  deleteModule(id: number, name: string) {
    if (confirm("Are you sure you want to delete " + name + "?")) {
      if (id > 0) {
        this.areasHttpService.observable_delete((ApiArea.controlpanel + ApiController.administration + "/DeleteModule"), {
          params: { moduleId: id, OrgId: 1, ComId: 1, BranchId: 1, UserId: "1234567890" }
        }).subscribe(response => {
          if (response) {
            this.toastr.success("Delete is Successfull", "Server Response", { timeOut: 800 });
            this.getModules();
          }
          else {
            this.toastr.error("Delete is Unsuccessfull", "Server Response", { timeOut: 800 });
          }
        });
      }
    }
  }

  submitModule() {
    this.areasHttpService.observable_post((ApiArea.controlpanel + ApiController.administration + "/SaveModule"),
      JSON.stringify(this.module),
      {
        'headers': {
          'Content-Type': 'application/json'
        },
        params: this.userData
      }).subscribe(status => {
        if (status) {
          this.toastr.success("Saved Successfull", "Server Response", { timeOut: 800 })
          this.modalService.dismissAll("Save Complete");
          this.getModules();
        }
      })
  }
  // mainmenu tab
  mainmenu: mainmenu = {
    mmId: 0,
    menuName: "",
    shortName: "",
    iconColor: "",
    iconClass: "",
    mId: 0,
    moduleName: "",
    applicationId: 0,
    applicationName: "",
    isActive: false,
    createdBy: null,
    createdDate: null,
    updatedBy: null,
    updatedDate: null,
    sequenceNo: 0
  }

  mainmenuList: mainmenu[] = null;

  openMainmenuModal() {
    this.modalTitle = "Add Mainmenu";
    this.mainmenu = {
      mmId: 0,
      menuName: "",
      shortName: "",
      iconColor: "",
      iconClass: "",
      mId: 0,
      moduleName: "",
      applicationId: 0,
      applicationName: "",
      isActive: false,
      createdBy: null,
      createdDate: null,
      updatedBy: null,
      updatedDate: null,
      sequenceNo: 0
    }
    this.open(this.mainmenuModal, "lg");
  }

  getMainmenus() {
    this.areasHttpService.observable_get((ApiArea.controlpanel + ApiController.administration + "/GetMainmenus"), { responseType: "json", params: this.userData }).subscribe(data => {
      this.mainmenuList = data as mainmenu[];
    })
  }

  editMainmenu(id: number) {
    this.modalTitle = "Update Mainmenu";
    this.mainmenu = Object.assign({}, this.mainmenuList.find(m => m.mmId == id));
    this.open(this.mainmenuModal, "lg");
  }

  deleteMainmenu(id: number, name: string) {
    if (confirm("Are you sure you want to delete " + name + "?")) {
      if (id > 0) {
        this.areasHttpService.observable_delete((ApiArea.controlpanel + ApiController.administration + "/DeleteMainmenu"), {
          params: { MainmenuId: id, OrgId: 1, ComId: 1, BranchId: 1, UserId: "1234567890" }
        }).subscribe(response => {
          if (response) {
            this.toastr.success("Delete is Successfull", "Server Response", { timeOut: 800 });
            this.getModules();
          }
          else {
            this.toastr.error("Delete is Unsuccessfull", "Server Response", { timeOut: 800 });
          }
        });
      }
    }
  }

  submitMainmenu() {
    this.areasHttpService.observable_post((ApiArea.controlpanel + ApiController.administration + "/SaveMainmenu"),
      JSON.stringify(this.mainmenu),
      {
        'headers': {
          'Content-Type': 'application/json'
        },
        params: this.userData
      }).subscribe(status => {
        if (status) {
          this.toastr.success("Saved Successfull", "Server Response", { timeOut: 800 })
          this.modalService.dismissAll("Save Complete");
          this.getMainmenus();
        }
      })
  }

  //submenu
  submenu: submenu = {
    submenuId: 0,
    submenuName: "",
    controllerName: null,
    actionName: null,
    path: "",
    component: "",
    iconClass: null,
    iconColor: null,
    isViewable: false,
    isActAsParent: false,
    hasTab: false,
    isActive: false,
    parentSubmenuId: 0,
    mmId: 0,
    menuName: "",
    moduleId: 0,
    moduleName: "",
    applicationId: 0,
    applicationName: "",
    createdBy: null,
    createdDate: null,
    updatedBy: null,
    updatedDate: null,
    menuSequence: 0
  }

  submenuList: submenu[] = [];
  parentSubmenus: any[] = [];
  searchByMainmenu: number = 0;
  searchBySubmenu: string = "";
  searchByParentSubmenu: number = 0;
  parentSubmenuList_Searchlist: any[] = [];

  searchInSubmenu() {
    var params = { submenuName: this.searchBySubmenu, mainmenuId: this.searchByMainmenu, parentSubmenuId:this.searchByParentSubmenu, pageNumber: this.submenuPageNo, pageSize: this.pageSize };
    this.getSubmenus(params);
  }

  searchByMainmenu_changed() {
    this.parentSubmenuList_Searchlist=[];
    let params = { hasTab: false, mainMenuId: this.searchByMainmenu, isActAsParent: true };
    if (this.searchByMainmenu > 0) {
      this.areasHttpService.observable_get((ApiArea.webservice + ApiController.controlPanelService + "/GetSubemenuExtension"), {
        responseType:
          "json", params: params
      }).subscribe(data => {
        let values = data as any[];
        if (values.length > 0) {
          values.forEach(element => {
            this.parentSubmenuList_Searchlist.push({ value: parseInt(element.value), text: element.text });
          });
        }
      })
    }
  }

  getSubmenus(params: any) {
    this.getSubmenuData(params).subscribe((response: PaginatedResult<submenu[]>) => {
      this.submenuConfig = this.userService.pageConfigInit("submenuData", response.pagination.itemsPerPage, response.pagination.currentPage, response.pagination.totalItems)
      this.submenuList = response.resut as submenu[];
    })
  }

  submenuPageChanged(event: any) {
    this.submenuPageNo = event;
    this.getSubmenus({ submenuName: this.searchBySubmenu, mainmenuId: this.searchByMainmenu, moduleId: 0, applicationId: 0, pageNumber: this.submenuPageNo, pageSize: this.pageSize });
  }

  openSubmenuModal() {
    this.modalTitle = "Add Submenu";
    //this.parentSubmenus = Object.assign([], this.submenuList.filter(s => s.isActAsParent));
    this.loadSubmenu("parentSubmenu");
    this.submenu = {
      submenuId: 0,
      submenuName: "",
      controllerName: null,
      actionName: null,
      path: "",
      component: "",
      iconClass: null,
      iconColor: null,
      isViewable: false,
      isActAsParent: false,
      hasTab: false,
      isActive: false,
      parentSubmenuId: 0,
      mmId: 0,
      menuName: "",
      moduleId: 0,
      moduleName: "",
      applicationId: 0,
      applicationName: "",
      createdBy: null,
      createdDate: null,
      updatedBy: null,
      updatedDate: null,
      menuSequence: 0
    }
    this.open(this.submenuModal, "lg");
  }

  mainmenu_changed() {
    this.loadSubmenu("parentSubmenu");
  }

  editSubmenu(id: number) {
    this.modalTitle = "Update Submenu";
    this.submenu = Object.assign({}, this.submenuList.find(m => m.submenuId == id));
    this.loadSubmenu("parentSubmenu");
    //this.parentSubmenus = Object.assign([], this.submenuList.filter(s => s.isActAsParent));
    this.open(this.submenuModal, "lg");
  }

  submitSubmenu() {
    this.areasHttpService.observable_post((ApiArea.controlpanel + ApiController.administration + "/SaveSubmenu"),
      JSON.stringify(this.submenu),
      {
        'headers': {
          'Content-Type': 'application/json'
        },
        params: this.userData
      }).subscribe(status => {
        if (status) {
          this.toastr.success("Saved Successfull", "Server Response", { timeOut: 800 })
          this.modalService.dismissAll("Save Complete");
          this.searchInSubmenu();
          this.getSubmenus({
            submenuName: this.searchBySubmenu, mainmenuId: this.searchByMainmenu, moduleId: 0, applicationId: 0, pageNumber: this.submenuPageNo,
            pageSize: this.pageSize
          });
        }
      })
  }

  SubmenuActAsParent(element: string, val: boolean) {
    if (element == "checkbox" && val) {
      this.submenu.parentSubmenuId = 0;
    }
    else if (element == "select" && val) {
      this.submenu.isActAsParent = false;
    }
    else {
      this.submenu.parentSubmenuId = 0;
      this.submenu.isActAsParent = false;
    }
  }

  deleteSubmenu(id: number, name: string) {
    if (confirm("Are you sure you want to delete " + name + "?")) {
      if (id > 0) {
        this.areasHttpService.observable_delete((ApiArea.controlpanel + ApiController.
          administration + "/DeleteSubmenu"), {
          params: { SubmenuId: id, OrgId: 1, ComId: 1, BranchId: 1, UserId: "1234567890" }
        }).subscribe(response => {
          if (response) {
            this.toastr.success("Delete is Successfull", "Server Response", { timeOut: 800 });
            this.searchInSubmenu();
          }
          else {
            this.toastr.error("Delete is Unsuccessfull", "Server Response", { timeOut: 800 });
          }
        });
      }
    }
  }

  getSubmenuData(params: any) {
    const paginatedResults: PaginatedResult<submenu[]> = new PaginatedResult<submenu[]>();
    return this.httpClient.get<submenu[]>(
      (this.areasHttpService.apiRoot + ApiArea.controlpanel + ApiController.administration + "/GetSubmenus"),
      { responseType: "json", observe: 'response', params: params })
      .pipe(
        map(res => {
          paginatedResults.resut = res.body;
          if (res.headers.get('X-Pagination') != null) {
            paginatedResults.pagination = JSON.parse(res.headers.get('X-Pagination'))
            //console.log("paginatedResults.pagination >>>", paginatedResults.pagination);
          }
          return paginatedResults;
        }),
        //catchError(this.handleError)
      );
  }

  // pagetab

  pageTabSubmenus: any[] = [];
  pageTabSubmenusForSearch: any[] = [];

  searchByTabname: string = "";
  searchByPagetabSubmenu: number = 0;

  searchInPageTab() {
    this.getPagetabs({ tabName: this.searchByTabname, submenuId: this.searchByPagetabSubmenu, mainmenuId: 0, pageNumber: this.tabPageNo, pageSize: this.pageSize });
  }

  loadSubmenu(flag: string) {
    let params = {};
    if (flag == "hasTab") {
      this.pageTabSubmenus = [];
      params = { hasTab: true, isActAsParent: false };
    }
    else if (flag == "hasTabSearch") {
      this.pageTabSubmenusForSearch = [];
      params = { hasTab: true, isActAsParent: false };
    }
    else if (flag == "parentSubmenu") {
      this.parentSubmenus = [];
      params = { hasTab: false, mainMenuId: this.submenu.mmId, isActAsParent: true };
    }
    this.areasHttpService.observable_get((ApiArea.webservice + ApiController.controlPanelService + "/GetSubemenuExtension"), {
      responseType:
        "json", params: params
    }).subscribe(data => {
      let values = data as any[];
      if (values.length > 0) {
        values.forEach(element => {
          if (flag == "hasTab") {
            this.pageTabSubmenus.push({ value: parseInt(element.value), text: element.text });
          }
          else if (flag == "hasTabSearch") {
            this.pageTabSubmenusForSearch.push({ value: parseInt(element.value), text: element.text });
          }
          else if (flag == "parentSubmenu") {
            this.parentSubmenus.push({ value: parseInt(element.value), text: element.text });
          }
        });
      }
    })
  }

  pageTab: pageTab = {
    tabId: 0,
    tabName: "",
    iconClass: "",
    iconColor: "",
    isActive: false,
    submenuId: 0,
    submenuName: "",
    createdBy: null,
    createdDate: null,
    updatedBy: null,
    updatedDate: null
  }

  pageTabList: pageTab[] = [];

  openPagetabModal() {
    this.pageTab = {
      tabId: 0,
      tabName: "",
      iconClass: "",
      iconColor: "",
      isActive: false,
      submenuId: 0,
      submenuName: "",
      createdBy: null,
      createdDate: null,
      updatedBy: null,
      updatedDate: null
    }
    this.modalTitle = "Add New Tab";
    this.loadSubmenu("hasTab");
    this.open(this.pageTabModal, "lg");
  }

  pagetabPageChanged(event: any) {
    this.tabPageNo = event;
    this.getPagetabs({ tabName: this.searchByTabname, submenuId: this.searchByPagetabSubmenu, mainmenuId: 0, pageNumber: event, pageSize: this.pageSize });
  }

  getPagetabs(params: any) {
    this.getPageTabData(params).subscribe((response: PaginatedResult<pageTab[]>) => {
      this.pageTabConfig = this.userService.pageConfigInit("pageTabData", response.pagination.itemsPerPage, response.pagination.currentPage, response.pagination.totalItems)
      //console.log("response.resut page-tab >>>", response.resut)
      this.pageTabList = response.resut as pageTab[];
    })
  }

  editPageTab(id: number) {
    this.modalTitle = "Update Page-Tab";
    this.pageTab = Object.assign({}, this.pageTabList.find(t => t.tabId == id));
    this.loadSubmenu("hasTab");
    this.open(this.pageTabModal, "lg");

  }

  deletePageTab(id: number, name: string) {
    if (confirm("Are you sure you want to delete " + name + "?")) {
      if (id > 0) {
        this.areasHttpService.observable_delete((ApiArea.controlpanel + ApiController.
          administration + "/DeletePageTab"), {
          params: { tabId: id, OrgId: 1, ComId: 1, BranchId: 1, UserId: "1234567890" }
        }).subscribe(response => {
          if (response) {
            this.toastr.success("Delete is Successfull", "Server Response", { timeOut: 800 });
            this.getPagetabs({});
          }
          else {
            this.toastr.error("Delete is Unsuccessfull", "Server Response", { timeOut: 800 });
          }
        });
      }
    }
  }

  SubmitPageTab() {
    this.areasHttpService.observable_post((ApiArea.controlpanel + ApiController.administration + "/SavePageTab"),
      JSON.stringify(this.pageTab),
      {
        'headers': {
          'Content-Type': 'application/json'
        },
        params: this.userData
      }).subscribe(status => {
        if (status) {
          this.toastr.success("Saved Successfull", "Server Response", { timeOut: 800 })
          this.modalService.dismissAll("Save Complete");
          this.getPagetabs({
            tabName: this.searchByTabname, submenuId: this.searchByPagetabSubmenu, mainmenuId: 0,
            pageNumber: this.tabPageNo, pageSize: this.pageSize
          });
        }
      })
  }

  getPageTabData(params: any) {
    const paginatedResults: PaginatedResult<pageTab[]> = new PaginatedResult<pageTab[]>();
    return this.httpClient.get<pageTab[]>(
      (this.areasHttpService.apiRoot + ApiArea.controlpanel + ApiController.administration + "/GetPageTabs"),
      { responseType: "json", observe: 'response', params: params })
      .pipe(
        map(res => {
          paginatedResults.resut = res.body;
          if (res.headers.get('X-Pagination') != null) {
            paginatedResults.pagination = JSON.parse(res.headers.get('X-Pagination'))
            //console.log("paginatedResults.pagination >>>", paginatedResults.pagination);
          }
          return paginatedResults;
        })
        //,catchError(this.handleError)
      );
  }

}
