import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NotifyService } from 'src/app/shared/services/notify-service/notify.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { ResignationRequestRoutingService } from '../../routing-service/resignation-request/resignation-request-routing.service';
import { NoticePeriodRoutingService } from '../../routing-service/notice-period/notice-period-routing.service';
import { Select2ConfigService } from 'src/app/shared/services/Select2/select2-config.service';
import { DatePickerConfigService } from 'src/app/shared/services/date-picker-config.service';
import { CustomModalService } from 'src/app/shared/services/custom-modal.service';
import { ResignationCategoryService } from '../../service/category-subcategory/resignation-category.service';
import { SharedmethodService } from 'src/app/shared/services/shared-method/sharedmethod.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { Subscription } from 'rxjs';
import { formatDate } from '@angular/common';
import { SharedDataService } from 'src/app/shared/services/shared-data/shared-data.service';


type UpdateChangeEvent = {
  resignationReason: string;
  secondaryReason: string; 
  resignationRequestId: number;
  resignationSubCategoryId: number;
  noticePeriod: number;
  createdShortfall: number;
};



@Component({
  selector: 'app-update-resignation-request',
  templateUrl: './update-resignation-request.component.html',
  styleUrls: ['./update-resignation-request.component.css']
})
export class UpdateResignationRequestComponent implements OnInit {

  @ViewChild('editResignationRequestModal', { static: true }) editResignationRequestModal!: ElementRef;

  @Output() closeModalEvent = new EventEmitter<string>();
  @Output() mainModalHide = new EventEmitter<void>();
  @Output() refresh = new EventEmitter<void>();

  @Input() resignationRequestId: number = 0;
  @Input() resignationRequestForUpdate: any;

  @Input() flag: string;

  
  @Output() updateChanged: EventEmitter<UpdateChangeEvent> = new EventEmitter<UpdateChangeEvent>();

  
  datePickerConfig: Partial<BsDatepickerConfig> = {};
  
  resignationForm: FormGroup;

  @Input() employeeId: number = 0;
  
  photoPath : string="";

  

  constructor(
    private notifyService: NotifyService,
    private fb: FormBuilder,
    public utilityService: UtilityService, 
    private resignationRequestRoutingService: ResignationRequestRoutingService,
    private noticePeriodRoutingService: NoticePeriodRoutingService,
    private select2ConfigService: Select2ConfigService,
    private datePickerConfigService : DatePickerConfigService,
    private modalService: CustomModalService,
    private sharedDataService: SharedDataService,
    private resignationCategoryService: ResignationCategoryService,
    private sharedMethod: SharedmethodService

  ) {}


  currentDate: Date = new Date();



  ngOnInit(): void {
    this.initializeForm();
    this.getEmployeeInfo();
    this.getResignationCategories();
    this.resignationCategorySelect2Options = this.select2ConfigService.getDefaultConfig();
    this.resignationSubCategorySelect2Options = this.select2ConfigService.getDefaultConfig();
    this.datePickerConfig = this.datePickerConfigService.getRangeConfig();

    this.openEditResignationRequestModal(); 
  }



  
  openEditResignationRequestModal() {
    this.modalService.open(this.editResignationRequestModal, "xl");

    this.getResignationCategories();
    this.getResignationSubCategories();
    this.getEmployeeResignationList();

  }


  closeEditResignationRequestModal(reason: any) {
    this.resignationRequestId = 0;
    this.modalService.service.dismissAll(reason);
    this.closeModalEvent.emit(reason);
    this.initializeForm();
  }




  calculateDateDifference(): { differenceInDays: number, shortfall: number } {
    const noticeDate = new Date(this.resignationForm.get('NoticeDate').value);
    const lastWorkingDate = new Date(this.resignationForm.get('RequestLastWorkingDate').value);
    const noticePeriod = this.resignationForm.get('NoticePeriod').value; 
  
    const differenceInMillis = lastWorkingDate.getTime() - noticeDate.getTime();
  
    const differenceInDays = Math.floor(differenceInMillis / (1000 * 60 * 60 * 24));
  
    const shortfall = differenceInDays > 0 ? noticePeriod - differenceInDays : 0;

    this.resignationForm.patchValue({
            CreatedShortfall: shortfall,
          });
  
    return { differenceInDays, shortfall };
  }


  disabledResignationCategoryId: boolean = true;

  initializeForm(): void {
    this.resignationForm = this.fb.group({
      ResignationRequestId: new FormControl(0),

      
      EmployeeId: new FormControl(null),
      EmployeeName: new FormControl(null),
      SupervisorId: new FormControl(null),

      ResignationCategoryId: new FormControl({
          value: this.ResignationCategoryId,
          disabled: true,
        }, Validators.required),

      ResignationSubCategoryId: new FormControl(0),
      NoticePeriod: new FormControl(null),
      NoticeDate: new FormControl(),
      RequestLastWorkingDate: new FormControl(''),
      ResignationReason: new FormControl(null),
      SecondaryReason: new FormControl(null),
  
      CreatedShortfall: new FormControl(null),
      EmployeeComment: new FormControl(null),
      EmployeeExitInterviewDate: new FormControl(''),
      File: new FormControl(null),
      ExistsFileName: new FormControl(null),
      ExistsFilePath: new FormControl(null)
    });
  }
  
  
  clearNoticeDate(): void {
    this.resignationForm.get('NoticeDate').setValue(null);
  }


  clearRequestLastWorkingDate(): void {
    this.resignationForm.get('RequestLastWorkingDate').setValue(null);
  }

  
  clearEmployeeExitInterviewDate(): void {
    this.resignationForm.get('EmployeeExitInterviewDate').setValue(null);
  }




  onFileChange(event: any): void {
    const fileInput = event.target;
    const file = fileInput.files[0];
  
    
    this.resignationForm.patchValue({
      FileAttachment: file,
    });
  
    
  }
  


  ExecutionFlag: string = '';

  insertStatus: { Status: string, Msg: string };

  submit() {
    if (this.resignationForm.valid) {
      const formData = new FormData();

      this.ExecutionFlag = 'C'
      
      formData.append('ResignationRequestId', this.resignationForm.get('ResignationRequestId').value);
      
      
      formData.append('EmployeeId', this.employeeInfo.employeeId);
      formData.append('EmployeeName', this.employeeInfo.fullName);
      formData.append('SupervisorId', this.employeeInfo.supervisorId);

      formData.append('ResignationCategoryId', this.resignationForm.get('ResignationCategoryId').value);
      formData.append('ResignationSubCategoryId', this.resignationForm.get('ResignationSubCategoryId').value);
       
      const noticePeriod = this.resignationForm.get('NoticePeriod').value;
      formData.append('NoticePeriod', noticePeriod !== undefined ? noticePeriod : null);

      formData.append('NoticeDate', this.formatDate(this.resignationForm.get('NoticeDate').value));
      formData.append('RequestLastWorkingDate', this.formatDate(this.resignationForm.get('RequestLastWorkingDate').value));
      formData.append('EmployeeExitInterviewDate', this.formatDate(this.resignationForm.get('EmployeeExitInterviewDate').value));

      formData.append('ResignationReason', this.resignationForm.get('ResignationReason').value);
      formData.append('SecondaryReason', this.resignationForm.get('SecondaryReason').value);
      
      formData.append('CreatedShortfall', this.resignationForm.get('CreatedShortfall').value);
      formData.append('EmployeeComment', this.resignationForm.get('EmployeeComment').value);
      
      
      const selectedFile = this.resignationForm.get('File').value;
      formData.append('File', selectedFile);

      formData.append('ExistsFileName', this.resignationForm.get('ExistsFileName').value);
      formData.append('ExistsFilePath', this.resignationForm.get('ExistsFilePath').value);

      formData.append('ExecutionFlag',  this.ExecutionFlag);

  
      this.resignationRequestRoutingService.save(formData).subscribe(
        (response:any) => {

          this.insertStatus = response;

          if (this.insertStatus && this.insertStatus.Status) {

            this.notifyService.showSuccessToast(this.insertStatus.Msg);

            this.initializeForm();

            this.sharedMethod.callMethod();

          } else {
   
           this.notifyService.showErrorToast(this.insertStatus.Msg);
            this.initializeForm();
          }
      
        },
        (error) => {
          this.notifyService.handleApiError(error);
        }
      );
    } else {
      this.notifyService.invalidFormError();
    }
  }



  updatedChanged(updatedResignation: any) {
    const index = this.resignationRequestList.findIndex(item => item.resignationRequestId === updatedResignation.resignationRequestId);
  
    if (index !== -1) {
      this.resignationRequestList[index] = updatedResignation;
    }
  }

  updateStatus: any;
  submitUpdate() {
    if (this.resignationForm.valid) {
      const formData = new FormData();

      this.ExecutionFlag = 'U'
      
      formData.append('ResignationRequestId', this.resignationForm.get('ResignationRequestId').value);
      formData.append('EmployeeId', this.resignationForm.get('EmployeeId').value);
      formData.append('ResignationSubCategoryId', this.resignationForm.get('ResignationSubCategoryId').value);
       
      const noticePeriod = this.resignationForm.get('NoticePeriod').value;
      formData.append('NoticePeriod', noticePeriod !== undefined ? noticePeriod : null);

      formData.append('NoticeDate', this.formatDate(this.resignationForm.get('NoticeDate').value));
      formData.append('RequestLastWorkingDate', this.formatDate(this.resignationForm.get('RequestLastWorkingDate').value));
      formData.append('EmployeeExitInterviewDate', this.formatDate(this.resignationForm.get('EmployeeExitInterviewDate').value));



      formData.append('ResignationReason', this.resignationForm.get('ResignationReason').value);
      formData.append('SecondaryReason', this.resignationForm.get('SecondaryReason').value);
      
      formData.append('CreatedShortfall', this.resignationForm.get('CreatedShortfall').value);
      formData.append('EmployeeComment', this.resignationForm.get('EmployeeComment').value);
      
      
      const selectedFile = this.resignationForm.get('File').value;
      formData.append('File', selectedFile);

      // formData.append('FileName', this.resignationForm.get('FileName').value);
      formData.append('ExistsFileName', this.resignationForm.get('ExistsFileName').value);
      formData.append('ExistsFilePath', this.resignationForm.get('ExistsFilePath').value);

      formData.append('ExecutionFlag',  this.ExecutionFlag);
  
      this.resignationRequestRoutingService.save(formData).subscribe(
        (response:any) => {

          this.updateStatus = response;

          if (this.updateStatus && this.updateStatus.Status) {
          
            this.notifyService.showSuccessToast(this.updateStatus.Msg);

 
            // this.updateChanged.emit({
            //   resignationReason: this.updateStatus.ResignationReason,
            //   secondaryReason: this.updateStatus.SecondaryReason, 
            //   resignationRequestId: this.updateStatus.ResignationRequestId,
            //   resignationSubCategoryId: this.updateStatus?.resignationCategoryId,
            //   noticePeriod: this.updateStatus?.NoticePeriod,
            //   createdShortfall: this.updateStatus?.CreatedShortfall
            // });


            this.updateChanged.emit(this.updateStatus);




            this.closeEditResignationRequestModal('Close');

          } else {
   
            this.notifyService.showErrorToast(this.updateStatus.Msg);
            this.initializeForm();
          }
      
        },
        (error) => {
          this.notifyService.handleApiError(error);
        }
      );
    } else {
      this.notifyService.invalidFormError();
    }
  }



  
  formatDate(date: any): string {

    if (date) {
      const formattedDate = formatDate(date, 'yyyy-MM-ddTHH:mm:ss', 'en-US');
      return formattedDate;
    }
  
    return '';
  }
  
  
  




  
  resignationRequestList: any[]=[];

  getEmployeeResignationList() {

    const params: any = {};
    if (this.resignationRequestId && this.resignationRequestId > 0) {
      params['resignationRequestId'] = this.resignationRequestId;
    }

    this.resignationRequestRoutingService.getEmployeeResignationListAsync<any[]>(params).subscribe({
      next: (response: any[]) => {
        this.resignationRequestList = response;

        if (this.resignationRequestList.length > 0) {
         this.setFormValues();
        }

      },
      error: (err) => {
        console.error(err);
        this.utilityService.fail("Something went wrong", "Server Response");
      }
    });
  }


  selectedFileName: string = '';

  ResignationCategoryId: any = 1;
  ResignationSubCategoryId: any;

 


  setFormValues() {
    const resignationRequest = this.resignationRequestForUpdate; 
  
    this.resignationForm.get('ResignationRequestId').setValue(resignationRequest.resignationRequestId);
    this.resignationForm.get('EmployeeId').setValue(resignationRequest.employeeId);
    this.resignationForm.get('EmployeeName').setValue(resignationRequest.employeeName);
    this.resignationForm.get('SupervisorId').setValue(resignationRequest.supervisorId);
    this.resignationForm.get('ResignationCategoryId').setValue(resignationRequest.resignationCategoryId);
    this.resignationForm.get('ResignationSubCategoryId').setValue(resignationRequest.resignationSubCategoryId);
    this.resignationForm.get('NoticePeriod').setValue(resignationRequest.noticePeriod);
    this.resignationForm.get('ResignationReason').setValue(resignationRequest.resignationReason);
    this.resignationForm.get('SecondaryReason').setValue(resignationRequest.secondaryReason);
    this.resignationForm.get('CreatedShortfall').setValue(resignationRequest.createdShortfall);
    this.resignationForm.get('EmployeeComment').setValue(resignationRequest.employeeComment);
  
    // Set date values
    this.resignationForm.get('NoticeDate').setValue(new Date(resignationRequest.noticeDate));
    this.resignationForm.get('RequestLastWorkingDate').setValue(new Date(resignationRequest.requestLastWorkingDate));
    this.resignationForm.get('EmployeeExitInterviewDate').setValue(new Date(resignationRequest.employeeExitInterviewDate));
  
    // Set file values
    const fileName = resignationRequest.actualFileName || resignationRequest.fileName;
    this.selectedFileName = fileName || '';
  
    this.resignationForm.get('ExistsFileName').setValue(fileName);
    this.resignationForm.get('ExistsFilePath').setValue(resignationRequest.filePath);
  }
  


  showFileInput: boolean = false;

  toggleFileInput(): void {
    this.showFileInput = !this.showFileInput;

    if (!this.showFileInput) {
      this.resignationForm.get('File').setValue(null);
    }
  }
  
  fileUpload(event: any): void {
    const selectedFile = (event.target as HTMLInputElement).files?.[0];
    this.resignationForm.get('File').setValue(selectedFile);
  
    // Set the selectedFileName for display
    this.selectedFileName = selectedFile ? selectedFile.name : '';
  }



  reset(){
    this.initializeForm();
  }






  // ----------------------------------------------------
  // ------------------------- >>> 

  employeeInfo: any;
  private employeeInfoSubscription: Subscription;
  
  getEmployeeInfo() {
    this.employeeInfoSubscription = this.sharedDataService.getEmployeeInfo().subscribe((employeeInfo: any) => {
      this.employeeInfo = employeeInfo;
    });
  }
  

  // Resignation Category

  resignationCategories: any[] = [];
  private resignationCategoriesSubscription: Subscription;

  resignationCategorySelect2Options:any = [];
  categoryId: number;


  getResignationCategories(){
    this.resignationCategoriesSubscription = this.resignationCategoryService.getResignationCategories().subscribe(categories => {
      this.resignationCategories = categories;
    });
  }

  onResignationCategorySelectionChange(selectedCategory: any) {
    this.categoryId = selectedCategory;

    this.getResignationSubCategories();
  }




  // Resignation Sub Category

  resignationSubCategories: any[] = [];
  private resignationSubCategoriesSubscription: Subscription;

  resignationSubCategorySelect2Options:any = [];
  subCategoryId: number;


  getResignationSubCategories(): void {
    const params: any = {};
    if (this.categoryId && this.categoryId > 0) {
      params['categoryId'] = this.categoryId;
    }
  
    this.resignationSubCategoriesSubscription = this.resignationCategoryService.getResignationSubCategories(params).subscribe({
      next: (subCategories: any[]) => {
        this.resignationSubCategories = subCategories;
      },
      error: (err) => {
        console.error(err);
        this.notifyService.handleApiError(err);
      }
    });
  }
  

  onResignationSubCategorySelectionChange(selectedSubCategory: any) {
    this.subCategoryId = selectedSubCategory;
    this.getResignationNoticePeriod();
  }


  
  // ---------------------------- resignation Notice Period
  resignationNoticePeriod: any;

  getResignationNoticePeriod() {
    const params: any = {};
    if (this.categoryId && this.categoryId > 0) {
      params['categoryId'] = this.categoryId;
    }
  
    if (this.subCategoryId && this.subCategoryId > 0) {
      params['subCategoryId'] = this.subCategoryId;
    }

  
    this.noticePeriodRoutingService.getResignationNoticePeriodApi<any>(params).subscribe({
      next: (response: any) => { 
        if (response) {
          this.resignationNoticePeriod = response; 
  
          if (this.resignationNoticePeriod) {
            this.resignationForm.patchValue({
              NoticePeriod: this.resignationNoticePeriod.noticePeriod 
            });
          }
        }
      },
      error: (err) => {
        console.error(err);
        this.notifyService.handleApiError(err);
      }
    });
  }
  


  ngOnDestroy(): void {
    if (this.employeeInfoSubscription) {
      this.employeeInfoSubscription.unsubscribe();
    }

    if (this.resignationCategoriesSubscription) {
      this.resignationCategoriesSubscription.unsubscribe();
    }

    if (this.resignationSubCategoriesSubscription) {
      this.resignationSubCategoriesSubscription.unsubscribe();
    }

  }







  
}
