import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { ApiArea, ApiController } from 'src/app/shared/constants';
import { CustomModalService } from 'src/app/shared/services/custom-modal.service';
import { HrWebService } from 'src/app/shared/services/hr-web.service';
import { UserService } from 'src/app/shared/services/user.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AreasHttpService } from "src/app/areas/areas.http.service";
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-salary-module-view-and-check-cash-salary-modal',
  templateUrl: './view-and-check-cash-salary-modal.component.html'
})
export class ViewAndCheckCashSalaryModalComponent implements OnInit {
    @Input() uploadCashSalaryId: any = 0;
    @Input() checkModalFlag: any = "";
    @Input() approvalData: any = {};
    @Output() closeModalEvent = new EventEmitter<string>();
    @ViewChild('ViewAndCheckCashSalaryModal', { static: true }) ViewAndCheckCashSalaryModal!: ElementRef;
  
    modalTitle: string = ""; 
    constructor(private fb: FormBuilder, // strongly type form build
      private areasHttpService: AreasHttpService, // http request
      private userService: UserService, // user service user id
      public utilityService: UtilityService, // utility 
      public modalService: CustomModalService, // modal service 
      private hrWebService: HrWebService,
      private toastr: ToastrService) {
    }
  
    ngOnInit(): void {    
      this.ViewAndCheckCashSalaryFormInit();
      this.modalTitle = (this.checkModalFlag == "View" ? "Upload Cash Salary View" : "Upload Cash Salary Approval");    
      if(this.uploadCashSalaryId > 0){
        this.getUploadCashSalaryById(this.uploadCashSalaryId);
      }
     
    }
  
    ViewAndCheckCashSalaryForm: FormGroup;
    ViewAndCheckCashSalaryFormInit() {
      this.ViewAndCheckCashSalaryForm = this.fb.group({
        uploadCashSalaryId: new FormControl(0, [Validators.required]),       
        cashSalaryHeadId: new FormControl(0),   
        salaryMonth: new FormControl(0),
        salaryYear: new FormControl(0),  
        employeeId: new FormControl(0),         
        amount: new FormControl(0),  
        remarks: new FormControl(''),
        stateStatus: new FormControl('Approved', [Validators.required]),
      })    
      
      this.modalService.open(this.ViewAndCheckCashSalaryModal, "lg");
    }
  
    getUploadCashSalaryById(uploadCashSalaryId: any) {
      this.areasHttpService.observable_get<any>((ApiArea.payroll + "/Salary/CashSalary"+ "/UploadCashSalaryList"), {
        responseType: "json", params: { uploadCashSalaryId: uploadCashSalaryId }
      }).subscribe(response => {    
        if (response != null && response[0]?.uploadCashSalaryId > 0) {
          this.setFormValue(response[0]);
        }
      })
    }
  
    setFormValue(response_data: any) {   
      this.ViewAndCheckCashSalaryForm.get('uploadCashSalaryId').setValue(response_data.uploadCashSalaryId);
      this.ViewAndCheckCashSalaryForm.get('cashSalaryHeadId').setValue(response_data.cashSalaryHeadId);
      this.ViewAndCheckCashSalaryForm.get('employeeId').setValue(response_data.employeeId);    
      this.ViewAndCheckCashSalaryForm.get('stateStatus').setValue(response_data.stateStatus);   
    }
   
  btnApproval: boolean = false;
    submitUploadCashSalaryApproval() {
      if (this.ViewAndCheckCashSalaryForm.valid) {
        this.btnApproval = true;
        this.areasHttpService.observable_post<any>((ApiArea.payroll + "/Salary/CashSalary"+ "/SaveUploadCashSalaryApproval"), null,
          {
            params: this.ViewAndCheckCashSalaryForm.value
          }).subscribe(
            (result) => {
              let data = result as any;
              if (data.status) {            
                this.toastr.success("Saved Successfully", "Server Response", { timeOut: 800 })
                this.closeModal('Save Complete');
              }
              else {
                this.toastr.error(data.msg, "Server Response", { timeOut: 800 })
  
              }
            },
            (error) => {
              this.toastr.error("Something went wrong", "Server Response", { timeOut: 800 })
            }
          )
      }
      else {
        this.utilityService.fail("Invalid form submission", "Site Response");
      }
    }
  
    closeModal(reason: string) {
      this.modalService.service.dismissAll(reason);
      this.closeModalEvent.emit(reason);
    }
  
  }
  