import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild, Injectable } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup, NgForm, Validators } from "@angular/forms";
import { UtilityService } from "src/app/shared/services/utility.service";
import { UserService } from "src/app/shared/services/user.service";
import { HrWebService } from "src/app/shared/services/hr-web.service";
import { CustomModalService } from "src/app/shared/services/custom-modal.service";
import { ApiArea, ApiController } from "src/app/shared/constants";
import { AreasHttpService } from "src/app/areas/areas.http.service";
import { DatePipe } from '@angular/common';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { InternalDesignationService } from "../internal-designation.service";
@Component({
  selector: 'app-employee-module-insert-update-internal-designation',
  templateUrl: './insert-update-internal-designation.component.html'
})
export class InsertUpdateInternalDesignationComponent implements OnInit {

  @ViewChild('addInternalDesignationModal', { static: true }) addInternalDesignationModal!: ElementRef;
  @Input() internalDesignationId: number = 0;
  @Output() closeModalEvent = new EventEmitter<string>(); 
  modalTitle: string = "Add Internal Designation";

  constructor(private fb: FormBuilder,   
    private userService: UserService,
    public utilityService: UtilityService, 
    public modalService: CustomModalService, 
    private hrWebService: HrWebService,
    private addInternalDesignationService: InternalDesignationService,
    private areasHttpService : AreasHttpService
    ) {}

    internalDesignationForm: FormGroup; 
    ngOnInit(): void {       
      this.internalDesignationFormInit();    
      if(this.internalDesignationId > 0){
        this.getInternalDesignationById(this.internalDesignationId);      
      }   
                
    }   
  
    internalDesignationFormInit() {
      this.internalDesignationForm = this.fb.group({
        internalDesignationId: new FormControl(0),
        internalDesignationName: new FormControl('', [Validators.required]),
        isActive: new FormControl(true),      
        remarks: new FormControl(''),
        
      })     
      this.modalService.open(this.addInternalDesignationModal, "sm");
    }
   
    getInternalDesignationById(internalDesignationId: any) {
      let params ={ internalDesignationId: internalDesignationId };
      this.addInternalDesignationService.getInternalDesignationByIdAsync(params).subscribe(response => {         
          if (response != null && response[0]?.internalDesignationId > 0) {
              this.setFormValue(response[0]);
          }
      })
   }
  
    setFormValue(response_data: any) {        
        this.modalTitle = "Update Internal Designation";
        this.internalDesignationForm.get('internalDesignationId').setValue(response_data.internalDesignationId);
        this.internalDesignationForm.get('internalDesignationName').setValue(response_data.internalDesignationName);
        this.internalDesignationForm.get('isActive').setValue(response_data.isActive);   
        this.internalDesignationForm.get('remarks').setValue(response_data.remarks);    
    }

    submitInternalDesignation() {
      if (this.internalDesignationForm.valid) {              
         let data = this.internalDesignationForm.value;
         this.addInternalDesignationService.SaveInternalDesignationAsync(data).subscribe((response) => {
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
  
    closeModal(reason: string) {
      this.modalService.service.dismissAll(reason);
      this.closeModalEvent.emit(reason); 
    }

}
