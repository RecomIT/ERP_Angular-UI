import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Select2ConfigService } from 'src/app/shared/services/Select2/select2-config.service';
import { CustomModalService } from 'src/app/shared/services/custom-modal.service';
import { LeaveTypeService } from '../../service/leave-type/leave-type.service';
import { LeaveTypeRoutingService } from '../../routing-service/leave-type/leave-type-routing.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotifyService } from 'src/app/shared/services/notify-service/notify.service';

@Component({
  selector: 'app-add-encashment-request',
  templateUrl: './add-encashment-request.component.html',
  styleUrls: ['./add-encashment-request.component.css']
})
export class AddEncashmentRequestComponent implements OnInit {
  
  @ViewChild('addEncashmentRequest', { static: true }) addEncashmentRequest!: ElementRef;
  @Output() closeModalEvent = new EventEmitter<string>();
  @Input() isEditMode: boolean;

  leaveTypeSelect2Options: any = [];


  encashmentForm: FormGroup;

  constructor(
    private modalService: CustomModalService,
    private select2ConfigService: Select2ConfigService,
    private leaveTypeRoutingService: LeaveTypeRoutingService,
    private leaveTypeService: LeaveTypeService,
    private fb: FormBuilder,
    private notifyService: NotifyService
  ) { 
    this.initilizeForm();
  }

  initilizeForm(){
    this.encashmentForm = this.fb.group({
      leaveTypeId: [null, Validators.required]
    });
  }

  leaveTypeId: number;

  monitorLeaveTypeIdChanges(): void {
    this.encashmentForm.get('leaveTypeId').valueChanges.subscribe(
      (value) => {
        const parsedValue = parseInt(value, 10); // Parse value to integer
        if (!isNaN(parsedValue)) {
          this.leaveTypeId = parsedValue;
          console.log('this.leaveTypeId:', this.leaveTypeId);
          this.getEncashableLeaveSettings(); // Call method to fetch data
        } else {
          console.error('Invalid leaveTypeId:', value);
          // Handle error or set a default value
          // For example, this.leaveTypeId = 0; // Or any default value that makes sense
        }
      }
    );
  }

  ngOnInit(): void {
    this.leaveTypeSelect2Options = this.select2ConfigService.getDefaultConfig();
    
    if(this.isEditMode == false){
      this.openEncashmentRequestModal();
    }else{
      
    }

    // this.getLeaveTypes();
    // this.loadLeaveTypes();
    // this.printDdlEmployees();
    // this.leaveTypeService.loadLeaveTypes();

    this.loadEncashableLeaveTypes();
    this.monitorLeaveTypeIdChanges();
    
  }

  openEncashmentRequestModal() {
    this.isEditMode = false;
    this.modalService.open(this.addEncashmentRequest, "lg");
  }


  closeEncashmentRequestModal(reason: any) {
    this.modalService.service.dismissAll(reason);
    this.closeModalEvent.emit(reason);
  }




  // ............................................
  // .................... Leave Type
  // ...... Starting

  getLeaveTypes(): void {

    const params: any = {};

    this.leaveTypeRoutingService.getSelect2LeaveType(params).subscribe(
      (data) => {
       // console.log('Leave Types:', data); 
      },
      (error) => {
        console.error('Error fetching leave types:', error);
      }
    );

  }



  leaveTypes: any[] = [];

  ddlEmployees$ = this.leaveTypeService.ddlLeaveTypes$;

  loadLeaveTypes(): void {
    this.leaveTypeService.loadLeaveTypes();


    this.leaveTypeService.ddlLeaveTypes$.subscribe(
      (data) => {
        this.leaveTypes = data;
        // console.log('Loaded leave types:', data);
      },
      (error) => {
        console.error('Error loading leave types:', error);
      }
    );

  }

  printDdlEmployees(): void {
    this.ddlEmployees$.subscribe(
      (data) => {
        // console.log('ddlEmployees$ values:', data);
      },
      (error) => {
        console.error('Error fetching ddlEmployees$:', error);
      }
    );
  }


  // ............................................
  // .................... Leave Type
  // ...... End



  // ............................................
  // .................... Encashable Leave Type
  // ...... Starting


  ddlEncashableLeaveTypes$ = this.leaveTypeService.ddlEncashableLeaveTypes$;

  loadEncashableLeaveTypes(): void {
    this.leaveTypeService.loadEncashableLeaveTypes();

    // this.leaveTypeService.ddlEncashableLeaveTypes$.subscribe(
    //   (data) => {
    //     this.leaveTypes = data;
    //     console.log('Loaded encashable leave types:', data);
    //   },
    //   (error) => {
    //     console.error('Error loading encashable leave types:', error);
    //   }
    // );
  }

  printDdlEncashableLeaveTypes(): void {
    this.ddlEncashableLeaveTypes$.subscribe(
      (data) => {
        // console.log('ddlEncashableLeaveTypes$ values:', data);
      },
      (error) => {
        console.error('Error fetching ddlEncashableLeaveTypes$:', error);
      }
    );
  }


  // ............................................
  // .................... Encashable Leave Type
  // ...... End




  // ............................................
  // .................... Encashable Leave Type Settings
  // ...... Starting

  encashableLeaveSettings: any[] = [];

  getEncashableLeaveSettings(): void {
    const params: any = {};
  
    if (this.leaveTypeId && this.leaveTypeId > 0) {
      params['leaveTypeId'] = this.leaveTypeId;
    }
  
    console.log('params', params);
  
    this.leaveTypeRoutingService.getEncashableLeaveSettings(params).subscribe(
      (data) => {
        this.encashableLeaveSettings = data;
        console.log('encashableLeaveSettings:', this.encashableLeaveSettings); 
      },
      (error) => {
        console.error('Error fetching leave type settings:', error);
        this.notifyService.handleApiError(error);
      }
    );
  }


  // ............................................
  // .................... Encashable Leave Type Settings
  // ...... End



  saveEncashmentRequest() {
    if (this.encashmentForm.valid) {
      const formData = this.encashmentForm.value;
      // console.log('Encashment Request Data:', formData);
      // Add your save logic here
      this.closeEncashmentRequestModal('Save Click');
    } else {
      // console.log('Form is invalid');
    }
  }

}
