import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormBuilder, FormGroup } from '@angular/forms';
import { CustomModalService } from 'src/app/shared/services/custom-modal.service';
import { UserService } from 'src/app/shared/services/user.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { ItSupportSerive } from '../it-support.service';

@Component({
  selector: 'asset-module-it-support-modal',
  templateUrl: './it-support-modal.component.html'
})
export class ItSupportModalComponent implements OnInit {


  @Input() assigningId: number = 0;
  @Output() closeModalEvent = new EventEmitter<string>();
  @ViewChild('itSupportModal', { static: true }) itSupportModal!: ElementRef;
  modalTitle: string = "Add Address";
  itSupportForm: FormGroup;
  server_errors: any;
  btnSubmit: boolean = false;

  constructor(
    private fb: FormBuilder,
    private utilityService: UtilityService,
    private userService: UserService,
    public modalService: CustomModalService,
    public itSupportSerive : ItSupportSerive
  ) { }

  ngOnInit(): void {
    this.formInit();
    this.openModal();
    if (this.assigningId > 0) {
      this.getAssetDataByID();

    }
  }

  logger(msg: any, options: any) {
    this.utilityService.consoleLog(msg, options);
  }

  User() {
    return this.userService.User();
  }

  openModal() {
    this.modalService.open(this.itSupportModal, 'lg');
  }


  formInit() {
    this.itSupportForm = this.fb.group({
      lanmac: new FormControl(''),
      lanip: new FormControl(''),
      wifimac: new FormControl(''),
      wifiip: new FormControl('')
    });
  }

  load_value(value: any) {
    this.itSupportForm.get('lanmac').setValue(value.lanmac);
    this.itSupportForm.get('lanip').setValue(value.lanip);
    this.itSupportForm.get('wifimac').setValue(value.wifimac);
    this.itSupportForm.get('wifiip').setValue(value.wifiip);
  }

  submit() {
    console.log("itSupportForm >>>", this.itSupportForm.valid);
    console.log("itSupportForm >>>", this.itSupportForm.value);

    if (this.itSupportForm.valid) {
      let data = this.itSupportForm.value;
      data.assigningId = this.assigningId;
      this.itSupportSerive.save(data).subscribe((reasponse) => {
        if (reasponse?.status) {
          this.utilityService.success(reasponse?.msg, "Server Response");
          this.closeModal(this.utilityService.SuccessfullySaved);
        }
        else {
          this.utilityService.fail(reasponse?.msg, "Server Response");
        }
      }, (error) => {
        console.log("error >>>", error);
        this.utilityService.fail("Something went wrong");
      })
    }
    else {
      this.utilityService.fail("Invalid Form Submission", "Site Response");
    }
  }

  getAssetDataByID() {
    let params = {
      assigningId: this.assigningId
    };

    this.itSupportSerive.getById(params).subscribe(response => {
      console.log("getAssetData >>>", response);
      console.log("getAssetData >>>", response.body);
      this.load_value(response);

    }, (error) => {
      this.utilityService.fail("Something went wrong", "Server Response")
      console.log("error >>>", error);
    })
  }

  closeModal(reason: any) {
    this.closeModalEvent.emit(reason);
    this.modalService.service.dismissAll(reason);
  }

}
