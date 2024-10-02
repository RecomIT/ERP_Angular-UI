import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { ApiArea, ApiController } from 'src/app/shared/constants';
import { CustomModalService } from 'src/app/shared/services/custom-modal.service';
import { HrWebService } from 'src/app/shared/services/hr-web.service';
import { UserService } from 'src/app/shared/services/user.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AreasHttpService } from "src/app/areas/areas.http.service";
import { ToastrService } from "ngx-toastr";
@Component({
  selector: 'app-add-early-departure-request',
  templateUrl: './add-early-departure-request.component.html',

})
export class AddEarlyDepartureRequestComponent implements OnInit {

  
  
  @Input() earlyDepartureId: any = 0;
  @Output() closeModalEvent = new EventEmitter<string>();
  @ViewChild('addearlyDepartureModal', { static: true }) addearlyDepartureModal!: ElementRef;
  datePickerConfig: Partial<BsDatepickerConfig> = {};
  modalTitle: string = "";


  pageSize: number = 15;
  pageNo: number = 1;

  manualAttnPageConfig: any = this.userService.pageConfigInit("manualAttn", this.pageSize, 1, 0);

  minTime: Date = new Date();
  maxTime: Date = new Date();
  constructor(private fb: FormBuilder, // strongly type form build
    private areasHttpService: AreasHttpService, // http request
    private userService: UserService, // user service user id
    public utilityService: UtilityService, // utility 
    public modalService: CustomModalService, // modal service 
    private hrWebService: HrWebService,
    private toastr: ToastrService,
    ) {
      
      
  }

  
  ngOnInit(): void {
    this.addEarlyDepartureFormInit();  
    this.loadEmployees();
    //this.loadApprovalHierarchyType();

    this.datePickerConfig = Object.assign({}, {
      containerClass: "theme-dark-blue",
      showWeekNumbers: false,
      dateInputFormat: "DD-MMMM-YYYY",
      isAnimated: true,
      showClearButton: false,
      showTodayButton: false,
      todayPosition: "left",
      rangeInputFormat: "DD-MMM-YYYY",
      rangeSeparator: " ~ ",
      size: "sm",
      customTodayClass: 'custom-today-class'
    })
    this.getSupervisorId();
    this.getLateReason();
    

  }

  closeModal(reason: string) {
    this.modalService.service.dismissAll(reason);
    this.closeModalEvent.emit(reason); // fire
  }

  User() {
    //return this.userService.getUser();
    const userData = this.userService.getUser();
    return userData;
    
  }

  select2Options = {
    width: "100%",
    containerCssClass: "form-control form-control-sm text-x-small font-bold",
    theme: "bootstrap4"
  }

  ddlEmployees: any[] = [];
  loadEmployees() {
    this.ddlEmployees = [];
    this.hrWebService.getEmployees<any[]>().then((data) => {
      this.ddlEmployees = data;
    })
  }





  ddlLateReasons: any[] = [];

  getLateReason() {
    this.areasHttpService.observable_get<any>(ApiArea.hrms + ApiController.LateConsideration + "/GetLateReasons", {
     
    }).subscribe((data) => {
      this.ddlLateReasons = data;
      //console.log("com data", data);
      
    });
  }

  ddlSupervisor: any[] = [];

  getSupervisorId() {
    this.areasHttpService.observable_get<any>(ApiArea.hrms + ApiController.LateConsideration + "/GetSupervisor", {
     
    }).subscribe((data) => {
      this.ddlSupervisor = data;
      //console.log("com data", data);
    });
  }
  
  addEarlyDepartureForm: FormGroup;
  formArray: any;
  addEarlyDepartureFormInit() {
    
    this.addEarlyDepartureForm = this.fb.group({
      employeeId: new FormControl(this.User().EmployeeId, [Validators.min(1)]),
          supervisorId: new FormControl(0, [Validators.min(1)]),    
          earlyDepartureId: new FormControl(0),           
          reason:  new FormControl('',[Validators.required]),    
          requestedForDate: new FormControl(null,[Validators.required]),
          otherReason: new FormControl(''),
          IsApproved: new FormControl(false),
          status: new FormControl(''),
          appliedDate:new FormControl(null),
          appliedTime: new FormControl(null, [Validators.required]),
          empEmailNotificationStatus: new FormControl(''),
          adminEmailNotificationStatus: new FormControl(''),
          
        
       
       
    })  
   
    this.modalService.open(this.addearlyDepartureModal, "xl");

    this.addEarlyDepartureForm.reset;
    this.minTime.setHours(0);
    this.minTime.setMinutes(0);
    this.maxTime.setHours(23);
    this.maxTime.setMinutes(59);
 
  
  
  }

  btnEarlyDeparture: boolean = false;
//   submitaddEarlyDeparture() {
//    if (this.addEarlyDepartureForm.valid) {
//      this.btnEarlyDeparture = true;
    
//      this.formArray.forEach((formGroup: FormGroup) => {
//        //console.log("form group value >>>", formGroup.value);
//        const userData = this.User();
//        detailArray.push({
//         lateRequestsId: formGroup.get('lateRequestsId').value,        
//         supervisorId : this.addEarlyDepartureForm.get('supervisorId').value,   
//         requestedForDate: formGroup.get('requestedForDate').value,
//         otherReason: formGroup.get('otherReason').value,
//         reason: formGroup.get('reason').value,      
//         emloyeeId: userData.EmployeeId
//        })
//     console.log('frm',detailArray)
//      })  
 
//      this.areasHttpService.observable_post<any>((ApiArea.hrms + ApiController.LateConsideration + "/SaveLateRequest"), JSON.stringify(detailArray), {
//        'headers': {
//          'Content-Type': 'application/json'
//        },
//      }).subscribe((result) => {
//        var data = result as any;
//        this.btnEarlyDeparture = false;
//        if (data.status) {
//          this.utilityService.success(data.msg, "Server Response");
//          this.closeModal('Save Complete');
//        }
//        else {
//          if (data.msg == "Validation Error") {
//            this.utilityService.fail(data.errors?.duplicateAllowance, "Server Response", 5000);
//          }
//          else {
//            this.utilityService.fail(data.msg, "Server Response")
//          }
//        }
//      }, (error) => {
//        console.log("error >>", error)
//        this.utilityService.fail("Something went wrong", "Server Response")
//        this.btnEarlyDeparture = false;
//      })
//    }
//  }

logger(msg: any, options: any) {
  this.utilityService.consoleLog(msg, options);
}
submitaddEarlyDeparture() {
  if (this.addEarlyDepartureForm.valid) {
    console.log("this.addEarlyDepartureForm.valid >>>", this.addEarlyDepartureForm.valid);
    console.log("this.addEarlyDepartureForm.value >>>", this.addEarlyDepartureForm);
    console.log("this.addEarlyDepartureForm.value >>>", this.addEarlyDepartureForm.value);
    const user = this.User();
    this.btnEarlyDeparture = true;
    this.areasHttpService.observable_post((ApiArea.hrms + ApiController.LateConsideration + "/SaveEarlyDeparture"), 
    JSON.stringify(this.addEarlyDepartureForm.value), {
      'headers': {
        'Content-Type': 'application/json'
      },
    }).subscribe((result) => {
      this.logger("Submit result >>", result);
      var data = result as any;
      this.btnEarlyDeparture = false;
      if (data.status) {
        this.addEarlyDepartureForm.reset;
        
        this.utilityService.success(data.msg, "Server Response")
        this.modalService.service.dismissAll();
        //this.getManualAttendances(this.manualAttnPageNo)
      
      }
      else {
        this.utilityService.fail(data.msg, "Server Response")
      }
    }, (error) => {
      this.utilityService.fail("Something went wrong", "Server Response")
      this.btnEarlyDeparture = false;
    })
  }
}




}
