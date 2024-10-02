import { transition, trigger, useAnimation } from '@angular/animations';
import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { fadeIn, fadeInUp, fadeOutLeft, slideInUp } from 'ng-animate';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { ApiArea, ApiController } from 'src/app/shared/constants';
import { CustomModalService } from 'src/app/shared/services/custom-modal.service';
import { HrWebService } from 'src/app/shared/services/hr-web.service';
import { PayrollWebService } from 'src/app/shared/services/payroll-web.service';
import { UserService } from 'src/app/shared/services/user.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { userInfo } from 'os';
import { AreasHttpService } from 'src/app/areas/areas.http.service';

@Component({
  selector: 'app-time-adjustment-facilitator',
  templateUrl: './time-adjustment-facilitator.component.html',
 // styleUrls: ['./time-adjustment-facilitator.component.css']
 animations: [
  trigger('fadeIn', [transition('void => *', useAnimation(fadeIn, { params: { timing: 0.3 } }))]),
  trigger('slideInUp', [transition('* => *', useAnimation(slideInUp, { params: { timing: 0.5 } }))]),
  trigger('fadeInUp', [transition('void => *', useAnimation(fadeInUp))]),
  trigger('fadeOutLeft', [transition('* => void', useAnimation(fadeOutLeft, { params: { timing: 0.3 } }))]),
],
})
export class TimeAdjustmentFacilitatorComponent implements OnInit {
  modalTitle: string = "";
  datePickerConfig: Partial<BsDatepickerConfig> = {};
  isNgInit = false;
  pageNumber: number = 1;
  pageSize: number = 15;
  approvalHierarchyPageConfig: any = this.userService.pageConfigInit("employeeList", this.pageSize, 1, 0);
  pagePrivilege: any= this.userService.getPrivileges();
  approvalData2: any;
  lateRequestForm: any;
  lateRequestList: any;
  id: any;
  lateRequestsId2: any;


  

  constructor(private fb: FormBuilder,
    private areasHttpService: AreasHttpService,
    private userService: UserService,
    private datePipe: DatePipe,
    public utilityService: UtilityService,
    public modalService: CustomModalService,
    private hrWebService: HrWebService,
    private payrollWebService: PayrollWebService,
    public toastr: ToastrService,
    private http: HttpClient) {

  }

  ngOnInit(): void {
    
    this.lateConsiderationInit();    
    this.loadEmployees();
    this.approvalHierarchyList();
    
    this.datePickerConfig = Object.assign({}, {
      containerClass: "theme-dark-blue",
      showWeekNumbers: false,
      dateInputFormat: "DD-MMM-YYYY",
      isAnimated: true,
      showClearButton: false,
      showTodayButton: false,
      todayPosition: "left",
      rangeInputFormat: "DD-MMM-YYYY",
      rangeSeparator: " ~ "
    })
    this.pagePrivilege = this.userService.getPrivileges();
    this.lateConsiderationByIdInit();
     // Set the id variable with the user's employeeId (you need to define the logic to fetch the user)
    //  const user = this.User(); // Assuming this returns the user object
    //  this.id = user.EmployeeId;
     
    //  // Now, you can call loadlateConsiderationById with the id variable
     this.loadlateConsiderationById(this.id);
    
     this.earlyDepartureFormInit();
     //this.getEarlyDepartureList();
     this.earlyMaster();
     this.earlyDepartureByIdFormInit();
     this.earlyMasterById();
  }
 

  select2Options = {
    width: "100%",
    containerCssClass: "form-control form-control-sm text-x-small font-bold",
    theme: "bootstrap4"
  }
  logger(msg: any, options: any) {
    this.utilityService.consoleLog(msg, options);
  }  


lateConsideration: FormGroup;
lateConsiderationInit() {
  this.lateConsideration = this.fb.group({
   
    lateRequestsId: new FormControl(0),   
    fullName: new FormControl(''),
    employeeCode: new FormControl(''),
    emailNotificationStatus: new FormControl(''),
    SupervisorName: new FormControl(''),   
    appliedDate: new FormControl(null),
    sortingCol: new FormControl(''),
    sortType: new FormControl(''),
    pageNumber: new FormControl(this.pageNumber),
    pageSize: new FormControl(this.pageSize),
    checkedBy:new FormControl('')
  })

  this.lateConsideration.get('lateRequestsId').valueChanges.subscribe((item) => {
    this.resetPage()
    this.approvalHierarchyList();
  })
 
  // this.lateConsideration.get('typeId').valueChanges.subscribe((item) => {
  //   this.resetPage()
  //   this.approvalHierarchyList();
  //   this.lateConsideration.get('groupId').setValue(0);
  //   this.loadApprovalHierarchyGroup(item);
  // })  
  // this.lateConsideration.get('groupId').valueChanges.subscribe((item) => {
  //   this.resetPage()
  //   this.approvalHierarchyList();
  // })  

}

resetPage() {
  this.lateConsideration.get('pageNumber').setValue(1);
}

ddlSearchByEmployee: any[] = [];


searchByEmployee: any = 0;
typeId: any = 0; 
groupId: any = 0;
searchByStatus: any = ''

listOfApprovalHierarchy: any[] = [];
approvalHierarchyDTLabel: string = null;

ddlEmployees: any[] = [];
loadEmployees() {
  this.ddlEmployees = [];
  this.ddlSearchByEmployee = [];
  this.hrWebService.getEmployees<any[]>().then((data) => {
    this.ddlSearchByEmployee = data;
    this.ddlEmployees = data;
  })
}






onEmployeeChanged() {
  if (this.isNgInit) {
    this.approvalHierarchyList();
  }
  this.isNgInit = true;
}

employeeListPageChanged(event: any) {
  this.pageNumber = event;
  this.lateConsideration.get('pageNumber').setValue(this.pageNumber);
  this.approvalHierarchyList();
}

employeeList: any[] = null;
approvalHierarchyList() {
  let params = Object.assign({}, this.lateConsideration.value);
  params.lateRequestsId = params.lateRequestsId == null ? 0 : params.lateRequestsId;
  // params.typeId = params.typeId == null ? 0 : params.typeId;  
  // params.groupId = params.groupId == null ? 0 : params.groupId;   
  // return ;
  this.areasHttpService.observable_get<any[]>((ApiArea.hrms + ApiController.LateConsideration + "/GetLateConsiderationMaster"), {
    responseType: "json", observe: 'response', params: params
  }).subscribe((response) => {
    var res = response as any;    
    this.employeeList = res.body;
    console.log("this.employeeList >>>", this.employeeList);
    var xPaginate = JSON.parse(res.headers.get('X-Pagination'));   
    this.approvalHierarchyPageConfig = this.userService.pageConfigInit("employeeList", xPaginate.itemsPerPage, xPaginate.currentPage, xPaginate.totalItems);
  },
    (error) => {
      this.toastr.error("Something went wrong", "Server Response", { timeOut: 1000 })
    })
}

///// Employee Approval Assignment


assignmentId: any = 0;
showaddLateConsiderationModal: boolean = false;
openLateConsideration(id: any) {
  this.showaddLateConsiderationModal = true; 
  this.assignmentId=id;

}

closeAddLateConsiderationModal(reason: any) {
  this.assignmentId = 0;
  this.showaddLateConsiderationModal = false;
  if (reason == 'Save Complete') {
    this.approvalHierarchyList();
  }
}

lateRequestsId: any = 0;
showEditApprovalHierarchyModal: boolean = false;
openEditApprovalHierarchyModal(id: any) {
  this.showEditApprovalHierarchyModal = true;
  this.lateRequestsId = id;  
}

 closeEditApprovalHierarchyModal(reason: string) {
  this.showEditApprovalHierarchyModal = false;
  this.lateRequestsId = 0;
  if (reason == 'Save Complete') {
    this.approvalHierarchyList();
  }
 }

  showCheckAndApprovalHierarchyGroupModal: boolean = false;
  approvalData: any = null;
  checkModalFlag: any = "";
  openCheckAndApprovalHierarchyGroupModal(id: any, flag: any) {
    this.checkModalFlag = "";
    this.showCheckAndApprovalHierarchyGroupModal = true;  
    this.lateRequestsId = id;   
    this.approvalData = Object.assign({}, this.employeeList.find(item => item.lateRequestsId == id));   
    this.checkModalFlag = flag;
  }

  closeCheckAndApprovalHierarchyGroupModal(reason: any) {
    this.showCheckAndApprovalHierarchyGroupModal = false;
    this.approvalData = 0;
    this.lateRequestsId = 0;
    if (reason == 'Save Complete') {
      this.approvalHierarchyList();
    }
  }
 
  ///// Employee Approval Hierarchy
approvalHierarchyId: any = 0;
showAddEmpApprovalHierarchyModal: boolean = false;
openAddEmpApprovalHierarchyModal() {
  this.showAddEmpApprovalHierarchyModal = true;
}

closeAddEmpApprovalHierarchyModal(reason: any) {
  this.showAddEmpApprovalHierarchyModal = false;
  if (reason == 'Save Complete') {
    this.approvalHierarchyList();
  }
}  

//////////////////////////////


User() {
  return this.userService.User();
}

///////////////////////////////////////////////////////////////////////////////////

lateConsiderationById: FormGroup;
lateConsiderationByIdInit() {
  this.lateConsiderationById = this.fb.group({
   
    lateRequestsId: new FormControl(0),   
    fullName: new FormControl(''),
    employeeCode: new FormControl(''),
    emailNotificationStatus: new FormControl(''),
    SupervisorName: new FormControl(''),   
    appliedDate: new FormControl(null),
    sortingCol: new FormControl(''),
    sortType: new FormControl(''),
    pageNumber: new FormControl(this.pageNumber),
    pageSize: new FormControl(this.pageSize),
    checkedBy:new FormControl('')
  })

  this.lateConsideration.get('lateRequestsId').valueChanges.subscribe((item) => {
    this.resetPage()
    this.approvalHierarchyList();
  })
 

}
 
listById: any[] = null;
loadlateConsiderationById(id) {
    // Get the current user's data
    const user = this.User(); // Assuming this returns the user object

    // Set the 'id' variable to the employeeId from the user object
    id = user.EmployeeId;
  console.log('IDDDD',id)
  let params = Object.assign({}, this.lateConsideration.value);
  params.lateRequestsId = params.lateRequestsId == null ? 0 : params.lateRequestsId;
 
  // params.typeId = params.typeId == null ? 0 : params.typeId;  
  // params.groupId = params.groupId == null ? 0 : params.groupId;   
  // return ;
  this.areasHttpService.observable_get<any[]>((ApiArea.hrms + ApiController.LateConsideration + "/GetLateConsiderationMasterById"), {
    responseType: "json", observe: 'response', params: params
  }).subscribe((response) => {
    var res = response as any;    
    this.listById = res.body;
    console.log("this.employeeList >>>", this.listById);
    var xPaginate = JSON.parse(res.headers.get('X-Pagination'));   
    this.approvalHierarchyPageConfig = this.userService.pageConfigInit("listttt", xPaginate.itemsPerPage, xPaginate.currentPage, xPaginate.totalItems);
  },
    (error) => {
      this.toastr.error("Something went wrong", "Server Response", { timeOut: 1000 })
    })
}
showLateConsiderationDetailModal: boolean = false;
approvalDataforId: any = null;
checkModalFlagg: any = "";
openshowLateConsiderationDetailModal(id: any, flag: any) {
  this.checkModalFlagg = "";
  this.showLateConsiderationDetailModal = true;  
  this.lateRequestsId = id;   
  this.approvalDataforId = Object.assign({}, this.employeeList.find(item => item.lateRequestsId == id));   
  this.checkModalFlagg = flag;
  console.log("checkModalFlag ", this.checkModalFlagg);
  console.log("approvalDataforId ", this.approvalDataforId);
  console.log("lateRequestsId ", this.lateRequestsId);
}

closeLateConsiderationDetailModal(reason: any) {
  this.showLateConsiderationDetailModal = false;
  this.approvalDataforId = 0;
  this.lateRequestsId = 0;
  // if (reason == 'Save Complete') {
  //   this.approvalHierarchyList();
  // }
}
///////////////////////////////////////////////////////////////////////////////////////////
///HR_EarlyDeparture

earlyDepartureForm: FormGroup;
earlyDepartureFormInit() {
  this.earlyDepartureForm = this.fb.group({
   
    earlyDepartureId: new FormControl(0),   
    fullName: new FormControl(''),
    employeeCode: new FormControl(''),
    empEmailNotificationStatus: new FormControl(''),
    adminEmailNotificationStatus: new FormControl(''),
    SupervisorName: new FormControl(''),   
    appliedDate: new FormControl(null),
    sortingCol: new FormControl(''),
    sortType: new FormControl(''),
    pageNumber: new FormControl(this.pageNumber),
    pageSize: new FormControl(this.pageSize),
    checkedBy:new FormControl(''),
    flag: new FormControl(''),
    status: new FormControl('')
  })

  this.earlyDepartureForm.get('earlyDepartureId').valueChanges.subscribe((item) => {
    this.resetPage()
    this.getEarlyDepartureList();
  })
 
  // this.lateConsideration.get('typeId').valueChanges.subscribe((item) => {
  //   this.resetPage()
  //   this.approvalHierarchyList();
  //   this.lateConsideration.get('groupId').setValue(0);
  //   this.loadApprovalHierarchyGroup(item);
  // })  
  // this.lateConsideration.get('groupId').valueChanges.subscribe((item) => {
  //   this.resetPage()
  //   this.approvalHierarchyList();
  // })  

}
  getEarlyDepartureListearlyDepartureList() {
    throw new Error('Method not implemented.');
  }

// resetPage() {
//   this.lateConsideration.get('pageNumber').setValue(1);
// }

// ddlSearchByEmployee: any[] = [];


// searchByEmployee: any = 0;
// typeId: any = 0; 
// groupId: any = 0;
// searchByStatus: any = ''

// listOfApprovalHierarchy: any[] = [];
// approvalHierarchyDTLabel: string = null;

// ddlEmployees: any[] = [];
// loadEmployees() {
//   this.ddlEmployees = [];
//   this.ddlSearchByEmployee = [];
//   this.hrWebService.getEmployees<any[]>().then((data) => {
//     this.ddlSearchByEmployee = data;
//     this.ddlEmployees = data;
//   })
// }






// onEmployeeChanged() {
//   if (this.isNgInit) {
//     this.approvalHierarchyList();
//   }
//   this.isNgInit = true;
// }

// employeeListPageChanged(event: any) {
//   this.pageNumber = event;
//   this.lateConsideration.get('pageNumber').setValue(this.pageNumber);
//   this.approvalHierarchyList();
// }
flag:string='';
earlyDepartureList: any[] = null;
getEarlyDepartureList() {
  // let params = Object.assign({}, this.earlyDepartureForm.value);
  //params.earlyDepartureId = params.earlyDepartureId == null ? 0 : params.earlyDepartureId;
   
  const params = {
    // earlyDepartureId: null,  // Replace with your actual parameters
    // employeeId: null,        // Replace with your actual parameters
    flag: 'Master',          // Set the flag parameter to 'master'
  };  
  // params.groupId = params.groupId == null ? 0 : params.groupId;   
  // return ;
  this.areasHttpService.observable_get<any[]>((ApiArea.hrms + ApiController.LateConsideration + "/GetEarlyDeparture"), {
    responseType: "json", observe: 'response', params: params
  }).subscribe((response) => {
    var res = response as any;    
    this.earlyDepartureList = res.body;
    console.log("this.earlyDepartureList >>>", this.earlyDepartureList);
    var xPaginate = JSON.parse(res.headers.get('X-Pagination'));   
    this.approvalHierarchyPageConfig = this.userService.pageConfigInit("earlyDepartureList", xPaginate.itemsPerPage, xPaginate.currentPage, xPaginate.totalItems);
  },
    (error) => {
      this.toastr.error("Something went wrong", "Server Response", { timeOut: 1000 })
    })
}



earlyDepartureId: any = 0;
showaddEarlyDepartureModal: boolean = false;
openEarlyDepartureId(id: any) {
  this.showaddEarlyDepartureModal = true; 
  this.earlyDepartureId=id;

}

closeAddEarlyDepartureModal(reason: any) {
  this.earlyDepartureId = 0;
  this.showaddEarlyDepartureModal = false;
  if (reason == 'Save Complete') {
    this.earlyMaster();
  }
}

earlyMaster() {
  let params = Object.assign({}, this.earlyDepartureForm.value);
  params.earlyDepartureId = params.earlyDepartureId == null ? 0 : params.earlyDepartureId;
  // params.typeId = params.typeId == null ? 0 : params.typeId;  
  // params.groupId = params.groupId == null ? 0 : params.groupId;   
  // return ;
  this.areasHttpService.observable_get<any[]>((ApiArea.hrms + ApiController.LateConsideration + "/GetEarlyDepartureMaster"), {
    responseType: "json", observe: 'response', params: params
  }).subscribe((response) => {
    var res = response as any;    
    this.earlyDepartureList = res.body;
    console.log("this.employeeList >>>", this.earlyDepartureList);
    var xPaginate = JSON.parse(res.headers.get('X-Pagination'));   
    this.approvalHierarchyPageConfig = this.userService.pageConfigInit("employeeList", xPaginate.itemsPerPage, xPaginate.currentPage, xPaginate.totalItems);
  },
    (error) => {
      this.toastr.error("Something went wrong", "Server Response", { timeOut: 1000 })
    })
}


showEarlyDepartureDetailModal: boolean = false;
//earlyDepartureId: any = 0;
checkEarlyDepartureModalFlagg: any = "";
setModalType:any="";
openShowEarlyDepartureDetailModal(id: any, flag: any,setModalType:any) {
  this.checkEarlyDepartureModalFlagg = "";
  this.showEarlyDepartureDetailModal = true;
  this.earlyDepartureId = id;
  this.approvalData = Object.assign({}, this.earlyDepartureList.find(item => item.earlyDepartureId == id)); // Updated property name
  this.checkEarlyDepartureModalFlagg = flag;
  this.setModalType =setModalType;
  console.log("checkModalFlag ", this.checkModalFlagg);
  console.log("approvalData ", this.approvalData); // Updated property name
  console.log(" this.earlyDepartureById ", this.earlyDepartureId);
}


closeEarlyDepartureByIdDetailModal(reason: any) {
  this.showEarlyDepartureDetailModal = false;
  this.earlyDepartureId = 0;
  this.earlyDepartureId = 0;
  if (reason == 'Save Complete') {
    this.earlyMaster();
  }
}

earlyDepartureByIdForm: FormGroup;
earlyDepartureByIdFormInit() {
  this.earlyDepartureByIdForm = this.fb.group({
   
    earlyDepartureId: new FormControl(0),   
    fullName: new FormControl(''),
    employeeCode: new FormControl(''),
    empEmailNotificationStatus: new FormControl(''),
    adminEmailNotificationStatus: new FormControl(''),
    SupervisorName: new FormControl(''),   
    appliedDate: new FormControl(null),
    sortingCol: new FormControl(''),
    sortType: new FormControl(''),
    pageNumber: new FormControl(this.pageNumber),
    pageSize: new FormControl(this.pageSize),
    checkedBy:new FormControl(''),
    flag: new FormControl(''),
    status: new FormControl('')
  })

  this.earlyDepartureByIdForm.get('earlyDepartureId').valueChanges.subscribe((item) => {
    this.resetPage()
    this.earlyMaster();
  })
 
  // this.lateConsideration.get('typeId').valueChanges.subscribe((item) => {
  //   this.resetPage()
  //   this.approvalHierarchyList();
  //   this.lateConsideration.get('groupId').setValue(0);
  //   this.loadApprovalHierarchyGroup(item);
  // })  
  // this.lateConsideration.get('groupId').valueChanges.subscribe((item) => {
  //   this.resetPage()
  //   this.approvalHierarchyList();
  // })  

}

earlyDepartureListById: any[] = null;
earlyMasterById() {
  let params = Object.assign({}, this.earlyDepartureByIdForm.value);
  params.earlyDepartureId = params.earlyDepartureId == null ? 0 : params.earlyDepartureId;
  // params.typeId = params.typeId == null ? 0 : params.typeId;  
  // params.groupId = params.groupId == null ? 0 : params.groupId;   
  // return ;
  this.areasHttpService.observable_get<any[]>((ApiArea.hrms + ApiController.LateConsideration + "/GetEarlyDepartureByIdMaster"), {
    responseType: "json", observe: 'response', params: params
  }).subscribe((response) => {
    var res = response as any;    
    this.earlyDepartureListById = res.body;
    console.log("this.earlyDepartureListById >>>", this.earlyDepartureListById);
    var xPaginate = JSON.parse(res.headers.get('X-Pagination'));   
    this.approvalHierarchyPageConfig = this.userService.pageConfigInit("employeeList", xPaginate.itemsPerPage, xPaginate.currentPage, xPaginate.totalItems);
  },
    (error) => {
      this.toastr.error("Something went wrong", "Server Response", { timeOut: 1000 })
    })
}



}
  
  

