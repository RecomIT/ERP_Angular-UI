import { Component, OnInit, ViewChild, ElementRef, LOCALE_ID, Inject } from '@angular/core';
import { formatDate } from '@angular/common';
import { CustomModalService } from 'src/app/shared/services/custom-modal.service';
import { ToastrService } from 'ngx-toastr';
import { ApiArea, ApiController } from 'src/app/shared/constants';
import { UserService } from 'src/app/shared/services/user.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { parseDate } from 'ngx-bootstrap/chronos';
import { NgForm, Validators } from '@angular/forms';
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { transition, trigger, useAnimation } from '@angular/animations';
import { bounceIn, fadeIn, fadeInRight, slideInUp } from 'ng-animate';
import { AreasHttpService } from 'src/app/areas/areas.http.service';
import { InternalDesignationService } from '../internal-designation.service';

@Component({
  selector: 'app-internal-designation',
  templateUrl: './internal-designation.component.html',
  animations: [
    trigger('slideInUp', [transition('* => *', useAnimation(slideInUp, { params: { timing: 0.5 } }))]),
    trigger('fadeIn', [transition('void => *', useAnimation(fadeIn, { params: { timing: 0.3 } }))]),
    trigger('fadeInRight', [transition('void => *', useAnimation(fadeInRight, { params: { timing: 0.5 } }))]),
    trigger('bounceIn', [transition('void => *', useAnimation(bounceIn, { params: { timing: 1 } }))]),
  ]
})
export class InternalDesignationComponent implements OnInit {

  modalTitle: string = "";
  datePickerConfig: Partial<BsDatepickerConfig> = {};
  pageNumber: number = 1;
  pageSize: number = 15;
  pageConfig: any = this.userService.pageConfigInit("data_list", this.pageSize, 1, 0);

  constructor(public modalService: CustomModalService, private areasHttpService: AreasHttpService, 
    public toastr: ToastrService, private userService: UserService, 
    private utilityService: UtilityService,   
    private fb: FormBuilder,
    public internalDesignationService: InternalDesignationService,
    @Inject(LOCALE_ID) private locale: string
    ) { }

    
  ngOnInit(): void {

    this.internalDesignationFormInit();
    this.getInternalDesignations();
   
  }

  //#region Internal Designation

  internalDesignationForm: FormGroup;
  internalDesignationFormInit() {
      this.internalDesignationForm = this.fb.group({
          internalDesignationId: new FormControl(0),
          internalDesignationName: new FormControl(''),
          isActive: new FormControl(true),     
          remarks : new FormControl(''),   
          sortingCol: new FormControl(''),
          sortType: new FormControl(''),
          pageNumber: new FormControl(this.pageNumber),
          pageSize: new FormControl(this.pageSize)        
      })

      this.internalDesignationForm.valueChanges.subscribe(value => {          
          this.getInternalDesignations();
      })
  }

  page_Changed(event: any){
      this.pageNumber = event;
      this.internalDesignationForm.get('pageNumber').setValue(this.pageNumber);
  }

  internalDesignationList: any[] = [];
  getInternalDesignations() {
      let params = Object.assign({}, this.internalDesignationForm.value);      
      params.internalDesignationId = params.internalDesignationId == null ? 0 : params.internalDesignationId;  
      params.internalDesignationName = params.internalDesignationName == null ? '' : params.internalDesignationName;  
      // this.areasHttpService.observable_get<any>((ApiArea.hrms +  "/Employee/InternalDesignation" + "/GetInternalDesignations"), {
      //  responseType: "json", observe: 'response', params: params})
      this.internalDesignationService.getInternalDesignationAsync(params).subscribe(response => {
         console.log("response >>>",response);          
          this.internalDesignationList = response.body;           
     
          let xPaginate = JSON.parse(response.headers.get('X-Pagination'));
          console.log("xPaginate >>>",xPaginate);
          this.pageConfig = this.userService.pageConfigInit("data_list", xPaginate.itemsPerPage, xPaginate.currentPage, xPaginate.totalItems);
      }, error => {
          console.log(error)
      })
  }

 

  isShowInternalDesignationModal: boolean = false;
  internalDesignationId: any = 0;

  openInternalDesignationModal(id: any) {
      this.isShowInternalDesignationModal = true;
      this.internalDesignationId = id;      
  }

  closeInternalDesignationModal(reason: any) {
      this.isShowInternalDesignationModal = false;
      this.internalDesignationId = 0;
      if (reason == 'Save Complete') {
        this.getInternalDesignations();
      }
  }


  isUploadInternalDesignationModal: boolean = false;
  openUploadInternalDesignationModal() {
      this.isUploadInternalDesignationModal = true;
      this.internalDesignationId = 0;
  }

  closeUploadInternalDesignationModal(reason: any) {
      this.isUploadInternalDesignationModal = false;
      this.internalDesignationId = 0;
      if (reason == 'Save Complete') {
        this.getInternalDesignations();
      }
  }




//#endregion
}
