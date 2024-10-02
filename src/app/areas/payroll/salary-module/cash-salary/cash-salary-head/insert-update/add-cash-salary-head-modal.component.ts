import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { AreasHttpService } from "src/app/areas/areas.http.service";
import { ApiArea, ApiController } from "src/app/shared/constants";
import { CustomModalService } from "src/app/shared/services/custom-modal.service";
import { HrWebService } from "src/app/shared/services/hr-web.service";
import { UserService } from "src/app/shared/services/user.service";
import { UtilityService } from "src/app/shared/services/utility.service";
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';


@Component({
  selector: 'app-salary-module-add-cash-salary-head-modal',
  templateUrl: './add-cash-salary-head-modal.component.html'
})
export class AddCashSalaryHeadModalComponent implements OnInit {
    @Input() cashSalaryHeadId: any = 0;
    @Output() closeModalEvent = new EventEmitter<string>();
    @ViewChild('cashSalaryHeadModal', { static: true }) cashSalaryHeadModal!: ElementRef;
    modalTitle: string = "Add New Cash Salary Head";
  
    cashSalaryHeadForm: FormGroup; 
  
    constructor(private fb: FormBuilder, 
      private areasHttpService: AreasHttpService, 
      private userService: UserService, 
      public utilityService: UtilityService, 
      public modalService: CustomModalService, 
      private hrWebService: HrWebService) { }
  
    ngOnInit(): void {
      this.cashSalaryHeadFormInit(); 
   
      if(this.cashSalaryHeadId > 0){
        this.cashSalaryHeadById(this.cashSalaryHeadId);
      }    
    }
  
    cashSalaryHeadFormInit() {
      this.cashSalaryHeadForm = this.fb.group({
        cashSalaryHeadId: new FormControl(0),      
        cashSalaryHeadName: new FormControl('', [Validators.required]),
        cashSalaryHeadCode: new FormControl('', [Validators.required]),
        cashSalaryHeadNameInBengali: new FormControl(''),
        isActive: new FormControl(true)
        
      })    
      this.modalService.open(this.cashSalaryHeadModal, "sm");
    }  
  
    submitCashSalaryHead() {
      if (this.cashSalaryHeadForm.valid) {
          console.clear();     
          this.areasHttpService.observable_post<any>((ApiArea.payroll + "/Salary/CashSalary"+ "/SaveCashSalaryHead"),
              JSON.stringify(this.cashSalaryHeadForm.value),
              {
                  'headers': {
                      'Content-Type': 'application/json'
                  },
              }).subscribe((response) => {
                  console.log(response)
                  if (response.status == true) {
                      this.utilityService.success("Saved Successfully", "Server Response", 1000)
                      this.closeModal("Save Complete");
                  }
                  else {
                      this.utilityService.fail("Someting went wrong", "Server Response", 1000)
                      if (response.msg == "Validation Error") {
                          console.log("Validation Error >>>",response.msg);
                      }
                  }
              })
      }
      else {
          this.utilityService.fail("Invaild form", "Site Response");
      }
    }
  
    cashSalaryHeadById(cashSalaryHeadId: any) {
      this.areasHttpService.observable_get<any>((ApiArea.payroll + "/Salary/CashSalary"+ "/GetCashSalaryHeadById"), {
          responseType: "json", params: { cashSalaryHeadId: cashSalaryHeadId }
      }).subscribe(response => {
          console.log("response >>>", response)
          if (response != null && response[0]?.cashSalaryHeadId > 0) {
              this.setFormValue(response[0]);
          }
      })
   }
  
    setFormValue(response_data: any) {        
        this.modalTitle = "Update Cash Salary Head";
        this.cashSalaryHeadForm.get('cashSalaryHeadId').setValue(response_data.cashSalaryHeadId);
        this.cashSalaryHeadForm.get('cashSalaryHeadName').setValue(response_data.cashSalaryHeadName);
        this.cashSalaryHeadForm.get('cashSalaryHeadCode').setValue(response_data.cashSalaryHeadCode);
        this.cashSalaryHeadForm.get('cashSalaryHeadNameInBengali').setValue(response_data.cashSalaryHeadNameInBengali);      
        this.cashSalaryHeadForm.get('isActive').setValue(response_data.isActive);   
    }
  
    closeModal(reason: string) {
      this.modalService.service.dismissAll(reason);
      this.closeModalEvent.emit(reason); // fire
    }
  
  
  }
  