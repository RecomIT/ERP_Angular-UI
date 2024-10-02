import { DatePipe, formatDate } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { Select2ConfigService } from 'src/app/shared/services/Select2/select2-config.service';
import { DatePickerConfigService } from 'src/app/shared/services/DatePicker/date-picker-config.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { ResignationRequestRoutingService } from '../../routing-service/resignation-request/resignation-request-routing.service';
import { NotifyService } from 'src/app/shared/services/notify-service/notify.service';
import { Subscription } from 'rxjs';
import { ResignationCategoryService } from '../../service/category-subcategory/resignation-category.service';
import { NoticePeriodRoutingService } from '../../routing-service/notice-period/notice-period-routing.service';
import { SharedmethodService } from 'src/app/shared/services/shared-method/sharedmethod.service';
import { SharedDataService } from 'src/app/shared/services/shared-data/shared-data.service';


@Component({
  selector: 'app-add-resignation-request',
  templateUrl: './add-resignation-request.component.html',
  styleUrls: ['./add-resignation-request.component.css']
})

export class AddResignationRequestComponent implements OnInit, OnDestroy {

  datePickerConfig: Partial<BsDatepickerConfig> = {};
  
  resignationForm: FormGroup;

  constructor(

    private notifyService: NotifyService,
    private fb: FormBuilder,
    public utilityService: UtilityService, 
    private resignationRequestRoutingService: ResignationRequestRoutingService,
    private noticePeriodRoutingService: NoticePeriodRoutingService,
    private select2ConfigService: Select2ConfigService,
    private datePickerConfigService : DatePickerConfigService,
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
      // FileName: new FormControl(null),
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




  formatDate(date: any): string {

    if (date) {
      const formattedDate = formatDate(date, 'yyyy-MM-ddTHH:mm:ss', 'en-US');
      return formattedDate;
    }
  
    return '';
  }
  
  
  

  selectedFileName: string = '';

  ResignationCategoryId: any = 1;
  ResignationSubCategoryId: any;



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
