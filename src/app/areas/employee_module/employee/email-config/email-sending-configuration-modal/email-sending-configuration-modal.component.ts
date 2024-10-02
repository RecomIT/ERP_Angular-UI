import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { AreasHttpService } from "src/app/areas/areas.http.service";
import { ApiArea, ApiController } from "src/app/shared/constants";
import { CustomModalService } from "src/app/shared/services/custom-modal.service";
import { UserService } from "src/app/shared/services/user.service";
import { UtilityService } from "src/app/shared/services/utility.service";

@Component({
  selector: 'app-hr-email-sending-configuration-modal',
  templateUrl: './email-sending-configuration-modal.component.html'
})
export class EmailSendingConfigurationModalComponent implements OnInit {

  @Input() id: any = 0;
  @Output() closeModalEvent = new EventEmitter<string>(); //pop up modal cancel or add

  @ViewChild('emailSendingConfigurationModal', { static: true }) emailSendingConfigurationModal!: ElementRef;
  modalTitle: string = "Add  New Email Sending Configuration";

  constructor(private fb: FormBuilder, // strongly type form build
      private areasHttpService: AreasHttpService, // http request
      private userService: UserService, // user service user id
      public utilityService: UtilityService, // utility 
      public modalService: CustomModalService, // modal service 
  ) { }

  emailSendingConfigurationForm: FormGroup; // class = null;
  ngOnInit(): void {
    
      console.log("modal clicked");
      console.log("id" , this.id );

      this.loadModuleName();

      if (this.id > 0) {
          this.getEmailSendingConfigurationId(this.id);
      }
      else {
          this.emailSendingConfigurationFormInit(); 
      }     
      
  }

  objErrorMsg: any;

  emailSendingConfigurationFormInit() {
      this.emailSendingConfigurationForm = this.fb.group({
          id: new FormControl(0),
          moduleName: new FormControl('', [Validators.required]),
          emailStage: new FormControl('', [Validators.required]),
          emailCC1: new FormControl(''),
          emailCC2: new FormControl(''),
          emailCC3: new FormControl(''),
          emailBCC1: new FormControl(''),
          emailBCC2: new FormControl(''),
          emailTo: new FormControl('', [Validators.required]),
          isActive: new FormControl(true)
  
      })
      // open modal
      this.modalService.open(this.emailSendingConfigurationModal, "lg");
  }

  closeModal(reason: string) {
      this.modalService.service.dismissAll(reason);
      this.closeModalEvent.emit(reason); // fire
  }
 

  submitEmailSendingConfiguration() {
    console.log("this.emailSendingConfigurationForm.valid >>>", this.emailSendingConfigurationForm.valid);
    console.log("this.emailSendingConfigurationForm.value >>>", this.emailSendingConfigurationForm.value);

      if (this.emailSendingConfigurationForm.valid) {       
          this.areasHttpService.observable_post<any>((ApiArea.hrms + "/EmailConfig" + "/SaveEmailSendingConfiguration"),
              JSON.stringify(this.emailSendingConfigurationForm.value),
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
                         this.objErrorMsg = JSON.parse(response.errorMsg);
                        //   console.log("Validation Error >>>", response.msg);
                      }
                  }
              })
      }
      else {
          this.utilityService.fail("Invaild form", "Site Response");
      }
  }

  getEmailSendingConfigurationId(Id: any) {
      this.areasHttpService.observable_get<any[]>((ApiArea.hrms + ApiController.leave + "/GetEmailSendingConfiguration"), {
          responseType: "json", params: { id: Id }
      }).subscribe(response => {
          //console.log("emailSendingConfiguration response >>>", response)
          if (response != null && response[0]?.id > 0) {
              let item = response[0];
              this.setFormValue(item);
          }
      })

  }

  setFormValue(response_data: any) {
      this.emailSendingConfigurationFormInit();
      console.log("setFormValue >>>", response_data);
      this.modalTitle = "Update Email Sending Configuration";
      //console.log("this.modalTitle >>>", this.modalTitle);
      this.emailSendingConfigurationForm.get('id').setValue(response_data.id);
      this.emailSendingConfigurationForm.get('moduleName').setValue(response_data.moduleName);
      this.emailSendingConfigurationForm.get('emailStage').setValue(response_data.emailStage);
      this.emailSendingConfigurationForm.get('emailCC1').setValue(response_data.emailCC1);
      this.emailSendingConfigurationForm.get('emailCC2').setValue(response_data.emailCC2);
      this.emailSendingConfigurationForm.get('emailCC3').setValue(response_data.emailCC3);
      this.emailSendingConfigurationForm.get('emailBCC1').setValue(response_data.emailBCC1);
      this.emailSendingConfigurationForm.get('emailBCC2').setValue(response_data.emailBCC2);
      this.emailSendingConfigurationForm.get('emailTo').setValue(response_data.emailTo);
      this.emailSendingConfigurationForm.get('isActive').setValue(response_data.isActive);
      //console.log("response_data.isActive "+response_data.isActive);
  }

  ddlModuleName: any = [];
  loadModuleName() {
      this.ddlModuleName = [];
      this.getModuleName<any[]>().then((data) => {
        // console.log("data >>>", data);
          data.forEach(v => {
              this.ddlModuleName.push({ id: v.id, text: v.text })
          })
      })
  }

  getModuleName<T>(): Promise<T> {
    return this.areasHttpService.promise_get<T>((ApiArea.hrms + "/EmailConfig" + "/LoadModuleName"), {
        responseType: "json",
    });
}

ddlEmailCCBC() {
    return ["Level 1", "Level 2", "Level 3","Level 4","Level 5"];
}


}
