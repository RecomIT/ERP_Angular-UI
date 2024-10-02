import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Select2ConfigService } from 'src/app/shared/services/Select2/select2-config.service';

import { UtilityService } from 'src/app/shared/services/utility.service';
import { DatePipe, formatDate } from '@angular/common';
import { CustomModalService } from 'src/app/shared/services/custom-modal.service';
import { DatePickerConfigService } from 'src/app/shared/services/DatePicker/date-picker-config.service';

import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { ResignationRequestRoutingService } from '../../routing-service/resignation-request/resignation-request-routing.service';

import { NoticePeriodRoutingService } from '../../routing-service/notice-period/notice-period-routing.service';
import { NotifyService } from 'src/app/shared/services/notify-service/notify.service';
import { SharedmethodService } from 'src/app/shared/services/shared-method/sharedmethod.service';
import { ResignationCategoryRoutingService } from '../../routing-service/resignation-category/resignation-category-routing.service';

@Component({
  selector: 'app-add-employee-resignation-request',
  templateUrl: './add-employee-resignation-request.component.html',
  styleUrls: ['./add-employee-resignation-request.component.css']
})
export class AddEmployeeResignationRequestComponent implements OnInit {

  @ViewChild('editResignationRequestModal', { static: true }) editResignationRequestModal!: ElementRef;

  @Output() closeModalEvent = new EventEmitter<string>();
  @Output() mainModalHide = new EventEmitter<void>();
  @Output() refresh = new EventEmitter<void>();

  @Input() resignationRequestId: number;
  @Input() flag: string;


  
  datePickerConfig: Partial<BsDatepickerConfig> = {};
  
  resignationForm: FormGroup;

  photoPath : string="";

  constructor(
    private fb: FormBuilder,
    public utilityService: UtilityService, 
    private resignationRequestRoutingService: ResignationRequestRoutingService,
    private resignationCategoryRoutingService: ResignationCategoryRoutingService,
    private select2ConfigService: Select2ConfigService,
    private datePickerConfigService : DatePickerConfigService,
    private modalService: CustomModalService,
    private noticePeriodRoutingService: NoticePeriodRoutingService,
    private notifyService: NotifyService,
    private sharedMethod: SharedmethodService
  ) {}


  currentDate: Date = new Date();


  ngOnInit(): void {
    this.initializeForm();

    this.getEmployees();

    this.getResignationCategory();

    this.resignationCategorySelect2Options = this.select2ConfigService.getDefaultConfig();
    this.resignationSubCategorySelect2Options = this.select2ConfigService.getDefaultConfig();
    this.employeeSelect2Options = this.select2ConfigService.getDefaultConfig();

    this.datePickerConfig = this.datePickerConfigService.getConfig();


    if(this.resignationRequestId > 0){
      this.openEditResignationRequestModal();
    }


  }



  
  openEditResignationRequestModal() {
    this.modalService.open(this.editResignationRequestModal, "xl");

    this.getResignationCategory();
    this.getResignationSubCategory();
    this.getEmployeeResignationList();

  }


  closeEditResignationRequestModal(reason: any) {
    this.resignationRequestId = 0;
    this.modalService.service.dismissAll(reason);
    this.closeModalEvent.emit(reason);
    this.initializeForm();
  }



  employeeList: any[]=[];

  getEmployees() {

    this.resignationRequestRoutingService.getEmployeesAsync<any[]>(null).subscribe({
      next: (response: any[]) => {
        this.employeeList = response;
      },
      error: (err) => {
        console.error(err);
        this.utilityService.fail("Something went wrong", "Server Response");
      }
    });
  }




  searchByEmployeeId: number;
  employeeDetails: any[]=[];

  getEmployeesDetails() {

    const params: any = {};

    if (this.employeeId && this.employeeId > 0) {
      params['employeeId'] = this.employeeId;
    }

    this.resignationRequestRoutingService.getEmployeesDetailsAsync<any[]>(params).subscribe({
      next: (response: any[]) => {
        this.employeeDetails = response;

        if(this.employeeDetails.length > 0 && this.employeeDetails[0].PhotoPath && this.employeeDetails[0].Photo){
          this.photoPath = `${this.employeeDetails[0].PhotoPath}/${this.employeeDetails[0].Photo}`;
        }
        else{
          this.photoPath = "assets/img/user.png";
        }

      },
      error: (err) => {
        console.error(err);
        this.utilityService.fail("Something went wrong", "Server Response");
      }
    });
  }



  // ---------------------------- resignation category


  resignationCategories: any[]=[];
  resignationCategorySelect2Options:any = [];
  employeeSelect2Options :any = [];

  categoryId: number;

  getResignationCategory() {

    this.resignationCategoryRoutingService.getResignationCategory<any[]>(null).subscribe({
      next: (response: any[]) => {
        this.resignationCategories = response;
      },
      error: (err) => {
        console.error(err);
        this.utilityService.fail("Something went wrong", "Server Response");
      }
    });
  }

  onResignationCategorySelectionChange(selectedCategory: any) {
    this.categoryId = selectedCategory;
    this.getResignationSubCategory();
  }

  resignationSubCategories: any[]=[];
  resignationSubCategorySelect2Options:any = [];
  subCategoryId: number;

  getResignationSubCategory() {

    const params: any = {};
    if (this.categoryId && this.categoryId > 0) {
      params['categoryId'] = this.categoryId;
    }

    this.resignationCategoryRoutingService.getResignationSubCategory<any[]>(params).subscribe({
      next: (response: any[]) => {
        this.resignationSubCategories = response;
      },
      error: (err) => {
        console.error(err);
        this.utilityService.fail("Something went wrong", "Server Response");
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

  initializeForm(): void {
    this.resignationForm = this.fb.group({
      ResignationRequestId: new FormControl(0),
      EmployeeId: new FormControl(null),
      EmployeeName: new FormControl(null),
      SupervisorId: new FormControl(null),

      ResignationCategoryId: new FormControl({
          value: null,
        }, Validators.required),

      ResignationSubCategoryId: new FormControl(0),
      NoticePeriod: new FormControl(null),
      NoticeDate: new FormControl(null,Validators.required),
      RequestLastWorkingDate: new FormControl('',Validators.required),
      ResignationReason: new FormControl(null,Validators.required),
      SecondaryReason: new FormControl(null),
  
      CreatedShortfall: new FormControl(0),
      EmployeeComment: new FormControl(null),
      EmployeeExitInterviewDate: new FormControl('',Validators.required),
      File: new FormControl(null),
      // FileName: new FormControl(null),
      ExistsFileName: new FormControl(null),
      ExistsFilePath: new FormControl(null)
    });

    this.resignationForm.get('EmployeeId').valueChanges.subscribe(employeeId => {
      this.onEmployeeIdChange(employeeId);
    });

  }
  
  onEmployeeIdChange(employeeId: any): void {
    this.employeeId = employeeId;
    this.searchByEmployeeId = employeeId;
   this.getEmployeesDetails();
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
  


  insertStatus: any;
  
  ExecutionFlag: string = '';

  submit() {
    if (!this.resignationForm.invalid) {

      const formData = new FormData();
      
      this.ExecutionFlag = 'C'

      formData.append('ResignationRequestId', this.resignationForm.get('ResignationRequestId').value);

      formData.append('EmployeeId', this.employeeDetails[0].EmployeeId);
      formData.append('EmployeeName', this.employeeDetails[0].FullName);
      formData.append('SupervisorId', this.employeeDetails[0].SupervisorId);

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

      // formData.append('FileName', this.resignationForm.get('FileName').value);
      formData.append('ExistsFileName', this.resignationForm.get('ExistsFileName').value);
      formData.append('ExistsFilePath', this.resignationForm.get('ExistsFilePath').value);

      formData.append('ExecutionFlag',  this.ExecutionFlag);
  
      this.resignationRequestRoutingService.save(formData).subscribe(
        (response:any[]) => {

          this.insertStatus = response;

          if (this.insertStatus && this.insertStatus.Status) {
          
            this.notifyService.showSuccessToast(this.insertStatus.Msg);
            this.sharedMethod.callMethod();

            this.resignationForm.reset();
            
            this.closeEditResignationRequestModal('close');

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
    this.resignationForm.get('ResignationRequestId').setValue(this.resignationRequestList[0].ResignationRequestId);
    this.resignationForm.get('EmployeeId').setValue(this.resignationRequestList[0].EmployeeId);
    this.resignationForm.get('EmployeeName').setValue(this.resignationRequestList[0].EmployeeName);
    this.resignationForm.get('SupervisorId').setValue(this.resignationRequestList[0].SupervisorId);
    

    
   
    this.resignationForm.get('NoticePeriod').setValue(this.resignationRequestList[0].NoticePeriod);
   
   
    this.resignationForm.get('ResignationReason').setValue(this.resignationRequestList[0].ResignationReason);
    this.resignationForm.get('SecondaryReason').setValue(this.resignationRequestList[0].SecondaryReason);
    this.resignationForm.get('CreatedShortfall').setValue(this.resignationRequestList[0].CreatedShortfall);
    this.resignationForm.get('EmployeeComment').setValue(this.resignationRequestList[0].EmployeeComment);


    
    this.ResignationCategoryId = this.ResignationSubCategoryId = this.resignationForm.get('ResignationCategoryId').setValue(this.resignationRequestList[0].ResignationCategoryId);


    this.ResignationSubCategoryId = this.resignationForm.get('ResignationSubCategoryId').setValue(this.resignationRequestList[0].ResignationSubCategoryId);

    
    const noticeDateString = this.resignationRequestList[0].NoticeDate;
    const noticeDateObject = noticeDateString ? new Date(noticeDateString) : null;
    this.resignationForm.get('NoticeDate').setValue(noticeDateObject);

    const lastWorkingDateString = this.resignationRequestList[0].RequestLastWorkingDate;
    const lastWorkingDateObject = lastWorkingDateString ? new Date(lastWorkingDateString) : null;
    this.resignationForm.get('RequestLastWorkingDate').setValue(lastWorkingDateObject);

    const interviewDateString = this.resignationRequestList[0].EmployeeExitInterviewDate;
    const interviewDateObject = interviewDateString ? new Date(interviewDateString) : null;
    this.resignationForm.get('EmployeeExitInterviewDate').setValue(interviewDateObject);



    const fileName = this.resignationRequestList[0].ActualFileName || this.resignationRequestList[0].FileName; 

    if (fileName) {
      this.selectedFileName = fileName;
      
    } else {
      this.selectedFileName = ''; 
      
    }

    this.resignationForm.get('ExistsFileName').setValue(this.resignationRequestList[0].FileName);
    this.resignationForm.get('ExistsFilePath').setValue(this.resignationRequestList[0].FilePath);

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







  employeeSupervisorList: any[]=[];

  onEmployeeSelectionChange(selectEmployee: any){
    
   
    this.searchByEmployeeId = selectEmployee;

    this.employeeId = selectEmployee;


    this.getEmployeesDetails();

  }




  showEmployeeInfoModal: boolean = false;
  employeeId: number;

  openEmployeeInfoModal() {

      this.employeeId = this.searchByEmployeeId;
      this.showEmployeeInfoModal = true;
  }
  
  closeEmployeeInfoModal(reason: any) {
    this.showEmployeeInfoModal = false;
    this.employeeId = null;
  }

}
