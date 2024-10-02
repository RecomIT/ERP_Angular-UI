import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { LeaveSettingSerive } from "../leave-setting.service";
import { CustomModalService } from "src/app/shared/services/custom-modal.service";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { UtilityService } from "src/app/shared/services/utility.service";
import { LeaveTypeSerive } from "../../leave-type/leave-type.service";
import { DatePipe } from "@angular/common";
import { animate, state, style, transition, trigger } from "@angular/animations";
import { DatePickerConfigService } from "src/app/shared/services/date-picker-config.service";
import { BsDatepickerConfig } from "ngx-bootstrap/datepicker";
import { NotifyService } from "src/app/shared/services/notify-service/notify.service";
declare var $: any;

@Component({
    selector: 'leave-module-leave-setting-insert-update-modal',
    templateUrl: './leave-setting-insert-update-modal.component.html',
    styleUrls:['leave-setting-insert-update-modal.component.css'],
    animations: [
        trigger('fadeInOut', [
            state('void', style({
                opacity: 0
            })),
            transition(':enter', [
                style({
                    opacity: 0,
                    transform: 'scale(0.9)'
                }),
                animate('300ms ease-out', style({
                    opacity: 1,
                    transform: 'scale(1)' 
                }))
            ]),
            transition(':leave', [
                animate('300ms ease-in', style({
                    opacity: 0,
                    transform: 'scale(0.9)' 
                }))
            ])
        ]),
        
        trigger('slideInOut', [
            state('in', style({
                transform: 'translateY(0)',
                opacity: 1
            })),
            transition('void => *', [
                style({
                    transform: 'translateY(-10%)', 
                    opacity: 0
                }),
                animate('300ms ease-in-out', style({
                    transform: 'translateY(0)', 
                    opacity: 1
                }))
            ]),
            transition('* => void', [
                animate('300ms ease-in-out', style({
                    transform: 'translateY(-10%)', 
                    opacity: 0
                }))
            ])
        ]),
        
        trigger('fade', [
            state('in', style({ opacity: 1 })),
            transition(':enter', [
                style({ opacity: 0, transform: 'scale(0.9)' }), 
                animate('300ms ease-out', style({ opacity: 1, transform: 'scale(1)' })) 
            ]),
            transition(':leave', [
                animate('300ms ease-in', style({ opacity: 0, transform: 'scale(0.9)' })) 
            ])
        ])
        
      ]
})

export class LeaveSettingInsertUpdateModalComponent implements OnInit {
    @Input() id: any = 0;
    modalTitle: string = "Apply Leave Setting";


    @Output() closeModalEvent = new EventEmitter<string>();
    @ViewChild('leaveSettingModal', { static: true }) leaveSettingModal!: ElementRef;

    constructor(
        private leaveSettingSerive: LeaveSettingSerive, 
        private modalService: CustomModalService,
        private utilityService: UtilityService, 
        private fb: FormBuilder, 
        private leaveTypeSerive: LeaveTypeSerive, 
        private datePipe: DatePipe,
        private el: ElementRef,
        private datePickerConfigService: DatePickerConfigService,
        private notifyService: NotifyService
    ) { }
   
   
    ngOnInit(): void {

    
        this.formInit();
        // Date Picker
        this.datePickerConfig = this.datePickerConfigService.getConfig();


        // custom validations
        this.subscribeToMandatoryNoOfDaysChanges();
        this.subscribeToCarryForwardChanges();
        // this.subscribeToNoOfDaysChanges();
        this.subscribeToDeadlineForUtilizationLeaveChanges();
        this.subscribeToMinAndMaxEncashablePercentageChanges();
        this.subscribeToCalculateBalanceBasedOnChange();
        this.subscribeToMinimumServicePeriodOnChange();
        this.subscribeToIsLeaveEncashableAndMandatoryNoOfDaysLeaveChange();
        // this.subscribeToLeaveTypeChange();
        this.subscribeToRequiredDaysBeforeEDDChanges();
        
        

        // no 0 input
        this.subscribeToFileAttachedChanges();
        // this.subscribeToMaxDaysCarryForward();
        // this.subscribeToMaxDaysLeaveAtATime();
        // this.subscribeToRequiredDaysForFileAttached();
        // this.subscribeToDeadlineForUtilizationLeave();
        // this.subscribeToRequestDaysBeforeTakingLeave();
        // this.subscribeToMaximumTimesInServicePeriod();
        // this.subscribeToMinimumServicePeriod();
        // this.subscribeToRequiredDaysBeforeEDD();
        // this.subscribeToDaysPerCycle();
        // this.subscribeToGainDaysPerCycle();

        this.openModal();
        this.loadDropdown();
            
        if (this.id > 0) {
            this.getById();
        }

        
    }



    ngAfterViewInit(): void {
        $(this.el.nativeElement).find('input').iCheck({
          checkboxClass: 'icheckbox_square-blue',
          radioClass: 'iradio_square-blue',
        });
      }

    form: FormGroup;
    duplicateLeaveTitle: any;
    duplicateLeaveShortName: any;

    // Date Picker
    datePickerConfig: Partial<BsDatepickerConfig> = {};

    openModal() {
        this.modalService.open(this.leaveSettingModal, "xl");
    }



    getById() {
        this.leaveSettingSerive.getById({ leaveSettingId: this.id }).subscribe(response => {
            // console.log("Response from getById:", response); 
            this.set_form_value(response);
        }, (error) => {
            // console.log("error >>>", error);
            this.utilityService.fail("Something went wrong", "Server Response");
        })
    }




    formInit() {
        this.form = this.fb.group({
          leaveSettingId: [this.id],
          leaveTypeId: [null, Validators.required],
    
          mandatoryNumberOfDays: [false],
          noOfDays: [0], 
    
          maxDaysLeaveAtATime: [0],
          effectiveDateFromTo: [null],
          isHolidayIncluded: [false],
          isDayOffIncluded: [false],
          isActive: [true],
    
          isCarryForward: [false],
          maxDaysCarryForward: [0],
    
          leaveApplicableFor: ['Both',Validators.required],
          requestDaysBeforeTakingLeave: [],
          maximumTimesInServicePeriod: [],

          daysPerCycle: [0],
          gainDaysPerCycle: [0],

          calculateBalanceBasedOn: [''],
          isConfirmationRequired: [false],
          isMinimumServicePeroid: [false],
          minimumServicePeroid: [],
        
        //   isLeaveFileAttached: [false],
          acquiredViaOffDayWork: [false],
          showFullCalender: [false],
          leaveTypeName: [''],


          fileAttachedOption: ['',Validators.required],
          isMinimumDaysRequiredForFileAttached: [false],
          requiredDaysForFileAttached: [null],
          deadlineForUtilizationLeave: [],

          // Leave Encashment
          isLeaveEncashable: [false],
          isProratedLeaveBalanceApplicable: [false],
          minEncashablePercentage: [],
          maxEncashablePercentage: [],

          isRequiredEstimatedDeliveryDate:[false],
          isRequiredToApplyMinimumDaysBeforeEDD:[false],
          requiredDaysBeforeEDD:[]

        });
    }

    subscribeToMandatoryNoOfDaysChanges() {
        this.form.get('mandatoryNumberOfDays').valueChanges.subscribe((value: boolean) => {
            const noOfDaysControl = this.form.get('noOfDays');
    
            if (value) {
                noOfDaysControl.setValidators([Validators.required]);
            } else {
                noOfDaysControl.clearValidators();
            }
            noOfDaysControl.updateValueAndValidity();
    
            const daysPerCycleControl = this.form.get('daysPerCycle');
            const gainDaysPerCycleControl = this.form.get('gainDaysPerCycle');
    
            if (!noOfDaysControl.value && this.form.get('isLeaveEncashable').value) {
                daysPerCycleControl.setValidators([Validators.required]);
                gainDaysPerCycleControl.setValidators([Validators.required]);
            } else {
                daysPerCycleControl.clearValidators();
                gainDaysPerCycleControl.clearValidators();
            }
            daysPerCycleControl.updateValueAndValidity();
            gainDaysPerCycleControl.updateValueAndValidity();
        });
    }
    

    subscribeToFileAttachedChanges() {
        this.form.get('isMinimumDaysRequiredForFileAttached').valueChanges.subscribe((value: boolean) => {
            const requiredDaysControl = this.form.get('requiredDaysForFileAttached');
            if (value) {
                requiredDaysControl.setValidators([Validators.required]);
            } else {
                requiredDaysControl.clearValidators();
            }
            requiredDaysControl.updateValueAndValidity();
        });
    }

    subscribeToCarryForwardChanges() {
        this.form.get('isCarryForward').valueChanges.subscribe((value: boolean) => {
            const maxDaysCarryForwardControl = this.form.get('maxDaysCarryForward');
            if (value) {
                maxDaysCarryForwardControl.setValidators([Validators.required]);
            } else {
                maxDaysCarryForwardControl.clearValidators();
            }
            maxDaysCarryForwardControl.updateValueAndValidity();
        });
    }
    
    subscribeToDeadlineForUtilizationLeaveChanges() {
        this.form.get('acquiredViaOffDayWork').valueChanges.subscribe((value: boolean) => {
            const deadlineControl = this.form.get('deadlineForUtilizationLeave');
            if (value) {
                deadlineControl.setValidators([Validators.required]);
            } else {
                deadlineControl.clearValidators();
            }
            deadlineControl.updateValueAndValidity();
        });
    }

    subscribeToMinAndMaxEncashablePercentageChanges() {
        const minEncashableControl = this.form.get('minEncashablePercentage');
        const maxEncashableControl = this.form.get('maxEncashablePercentage');

        minEncashableControl.valueChanges.subscribe((value: number) => {
            if (value === 0) {
                this.form.patchValue({ minEncashablePercentage: null }, { emitEvent: false });
            }
            if (value !== null && value !== undefined && value > 0) {
                maxEncashableControl.setValidators([Validators.required]);
            } else {
                maxEncashableControl.clearValidators();
            }
            maxEncashableControl.updateValueAndValidity();
        });

        maxEncashableControl.valueChanges.subscribe((value: number) => {
            if (value === 0) {
                this.form.patchValue({ maxEncashablePercentage: null }, { emitEvent: false });
            }
        });
    }

    subscribeToCalculateBalanceBasedOnChange() {
        this.form.get('isLeaveEncashable').valueChanges.subscribe((value: string) => {
            const calculateBalanceControl = this.form.get('calculateBalanceBasedOn');
            if (value) {
                calculateBalanceControl.setValidators([Validators.required]);
            } else {
                calculateBalanceControl.clearValidators();
            }
            calculateBalanceControl.updateValueAndValidity();
        });
    }

    subscribeToMinimumServicePeriodOnChange() {
        this.form.get('isMinimumServicePeroid').valueChanges.subscribe((value: string) => {
            const minimumServicePeroidControl = this.form.get('minimumServicePeroid');
            if (value) {
                minimumServicePeroidControl.setValidators([Validators.required]);
            } else {
                minimumServicePeroidControl.clearValidators();
            }
            minimumServicePeroidControl.updateValueAndValidity();
        });
    }
    
    // --------------- Days Per Cycle && Gain Days Per Cycle
    subscribeToIsLeaveEncashableAndMandatoryNoOfDaysLeaveChange() {
        this.form.get('isLeaveEncashable').valueChanges
            .subscribe((isLeaveEncashable: string) => {
                const daysPerCycleControl = this.form.get('daysPerCycle');
                const gainDaysPerCycleControl = this.form.get('gainDaysPerCycle');
                
                if (isLeaveEncashable && !this.form.get('mandatoryNumberOfDays').value) {
                    daysPerCycleControl.setValidators([Validators.required]);
                    gainDaysPerCycleControl.setValidators([Validators.required]);
                } else {
                    daysPerCycleControl.clearValidators();
                    gainDaysPerCycleControl.clearValidators();
                }
                daysPerCycleControl.updateValueAndValidity();
                gainDaysPerCycleControl.updateValueAndValidity();
            });
    }

 
    subscribeToRequiredDaysBeforeEDDChanges() {
        this.form.get('isRequiredToApplyMinimumDaysBeforeEDD').valueChanges.subscribe((value: boolean) => {
            const requiredDaysBeforeEDDControl = this.form.get('requiredDaysBeforeEDD');
            if (value) {
                requiredDaysBeforeEDDControl.setValidators([Validators.required]);
            } else {
                requiredDaysBeforeEDDControl.clearValidators();
            }
            requiredDaysBeforeEDDControl.updateValueAndValidity();
        });
    }
    
    
    


    // no 0 input
    // -- Start

    // subscribeToNoOfDaysChanges() {
    //         this.form.get('noOfDays').valueChanges.subscribe(value => {
    //             if (value === 0) {
    //                 this.form.patchValue({ noOfDays: null }, { emitEvent: false });
    //             }
    //         });
    // }

    // subscribeToMaxDaysCarryForward() {
    //     this.form.get('maxDaysCarryForward').valueChanges.subscribe(value => {
    //         if (value === 0) {
    //             this.form.patchValue({ maxDaysCarryForward: null }, { emitEvent: false });
    //         }
    //     });
    // }

    // subscribeToMaxDaysLeaveAtATime() {
    //     this.form.get('maxDaysLeaveAtATime').valueChanges.subscribe(value => {
    //         if (value === 0) {
    //             this.form.patchValue({ maxDaysLeaveAtATime: null }, { emitEvent: false });
    //         }
    //     });
    // }

    subscribeToRequiredDaysForFileAttached() {
        this.form.get('requiredDaysForFileAttached').valueChanges.subscribe(value => {
            if (value === 0) {
                this.form.patchValue({ requiredDaysForFileAttached: null }, { emitEvent: false });
            }
        });
    }

    subscribeToDeadlineForUtilizationLeave() {
        this.form.get('deadlineForUtilizationLeave').valueChanges.subscribe(value => {
            if (value === 0) {
                this.form.patchValue({ deadlineForUtilizationLeave: null }, { emitEvent: false });
            }
        });
    }

    subscribeToRequestDaysBeforeTakingLeave() {
        this.form.get('requestDaysBeforeTakingLeave').valueChanges.subscribe(value => {
            if (value === 0) {
                this.form.patchValue({ requestDaysBeforeTakingLeave: null }, { emitEvent: false });
            }
        });
    }

    subscribeToMaximumTimesInServicePeriod() {
        this.form.get('maximumTimesInServicePeriod').valueChanges.subscribe(value => {
            if (value === 0) {
                this.form.patchValue({ maximumTimesInServicePeriod: null }, { emitEvent: false });
            }
        });
    }

    subscribeToMinimumServicePeriod() {
        this.form.get('minimumServicePeroid').valueChanges.subscribe(value => {
            if (value === 0) {
                this.form.patchValue({ minimumServicePeroid: null }, { emitEvent: false });
            }
        });
    }

    subscribeToRequiredDaysBeforeEDD() {
        this.form.get('requiredDaysBeforeEDD').valueChanges.subscribe(value => {
            if (value === 0) {
                this.form.patchValue({ requiredDaysBeforeEDD: null }, { emitEvent: false });
            }
        });
    }

    // subscribeToDaysPerCycle() {
    //     this.form.get('daysPerCycle').valueChanges.subscribe(value => {
    //         if (value === 0) {
    //             this.form.patchValue({ daysPerCycle: '' }, { emitEvent: false });
    //         }
    //     });
    // }
    
    // subscribeToGainDaysPerCycle() {
    //     this.form.get('gainDaysPerCycle').valueChanges.subscribe(value => {
    //         if (value === 0) {
    //             this.form.patchValue({ gainDaysPerCycle: '' }, { emitEvent: false });
    //         }
    //     });
    // }
    

    // mo 0 input 
    // -- End
    
    

    clearEstimatedDeliveryDate(): void {
        this.form.get('estimatedDeliveryDate').setValue(null);
      }

 
    set_form_value(data: any) {
        this.form.get('leaveSettingId').setValue(data.leaveSettingId);
        this.form.get('leaveTypeId').setValue(data.leaveTypeId);

        this.form.get('mandatoryNumberOfDays').setValue(data.mandatoryNumberOfDays);
        this.form.get('noOfDays').setValue(data.noOfDays);

        let effective = [new Date(data.effectiveFrom), new Date(data.effectiveTo)];
        this.form.get('effectiveDateFromTo').setValue(effective);
        this.form.get('maxDaysLeaveAtATime').setValue(data.maxDaysLeaveAtATime);
        this.form.get('isHolidayIncluded').setValue(data.isHolidayIncluded);
        this.form.get('isDayOffIncluded').setValue(data.isDayOffIncluded);
        this.form.get('isActive').setValue(data.isActive);
        this.form.get('isCarryForward').setValue(data.isCarryForward);
        this.form.get('maxDaysCarryForward').setValue(data.maxDaysCarryForward);
        this.form.get('leaveApplicableFor').setValue(data.leaveApplicableFor);
        this.form.get('requestDaysBeforeTakingLeave').setValue(data.requestDaysBeforeTakingLeave);


        this.form.get('maximumTimesInServicePeriod').setValue(data.maximumTimesInServicePeriod);
        this.form.get('daysPerCycle').setValue(data.daysPerCycle);
        this.form.get('gainDaysPerCycle').setValue(data.gainDaysPerCycle);
        this.form.get('calculateBalanceBasedOn').setValue(data.calculateBalanceBasedOn);
        this.form.get('isConfirmationRequired').setValue(data.isConfirmationRequired);
        this.form.get('isMinimumServicePeroid').setValue(data.isMinimumServicePeroid);
        this.form.get('minimumServicePeroid').setValue(data.minimumServicePeroid);
        this.form.get('isLeaveEncashable').setValue(data.isLeaveEncashable);
        // this.form.get('isLeaveFileAttached').setValue(data.isLeaveFileAttached);
        this.form.get('showFullCalender').setValue(data.showFullCalender);
        this.form.get('leaveTypeName').setValue(data.leaveTypeName);

        this.form.get('acquiredViaOffDayWork').setValue(data.acquiredViaOffDayWork);
        this.form.get('fileAttachedOption').setValue(data.fileAttachedOption);
        this.form.get('isMinimumDaysRequiredForFileAttached').setValue(data.isMinimumDaysRequiredForFileAttached);
        this.form.get('requiredDaysForFileAttached').setValue(data.requiredDaysForFileAttached);
        this.form.get('deadlineForUtilizationLeave').setValue(data.deadlineForUtilizationLeave);
        this.form.get('isProratedLeaveBalanceApplicable').setValue(data.isProratedLeaveBalanceApplicable);
        this.form.get('minEncashablePercentage').setValue(data.minEncashablePercentage);
        this.form.get('maxEncashablePercentage').setValue(data.maxEncashablePercentage);
        this.form.get('isRequiredEstimatedDeliveryDate').setValue(data.isRequiredEstimatedDeliveryDate);
        this.form.get('isRequiredToApplyMinimumDaysBeforeEDD').setValue(data.isRequiredToApplyMinimumDaysBeforeEDD);
        this.form.get('requiredDaysBeforeEDD').setValue(data.requiredDaysBeforeEDD);


        // Update modalTitle
        this.modalTitle = `Update ${this.form.get('leaveTypeName').value} Setting`;
    }




    ddlleaveTypes: any;
    loadDropdown() {
        this.leaveTypeSerive.loadLeaveTypeDropdown();
        this.ddlleaveTypes = this.leaveTypeSerive.ddl$;

        // console.log('ddlleaveTypes',this.ddlleaveTypes);
    }



    btnSubmit: boolean = false;
    submit() {
        if (this.form.valid) {
            
            let params =this.form.value;

            // console.log("Form Data >>>", params);
            this.leaveSettingSerive.save(this.form.value).subscribe(response => {
                //console.log("response >>>", response);
                if (response.status) {
                    
                    this.notifyService.showSuccessToast(response?.msg);
                    // this.utilityService.success(response?.msg, "Server Response");
                    this.closeModal(this.utilityService.SuccessfullySaved);
                }
                else {
                    if (response.msg == "Validation Error") {
                        // this.utilityService.fail(response?.msg, "Server Response");
                        this.notifyService.showErrorToast(response?.msg);
                    }
                    else {
                        // this.utilityService.fail(response?.msg, "Server Response");
                        this.notifyService.showErrorToast(response?.msg);
                    }
                }
            }, (error) => {
                // console.log("error >>>", error);
                // this.utilityService.fail("Something went wrong", "Server Response");
                this.notifyService.handleApiError(error);
            })
        }
        else {
            // this.utilityService.fail("Invalid form submission", "Server Response");
            this.notifyService.invalidFormError();
        }
    }

    closeModal(reason: any) {
        this.closeModalEvent.emit(reason);
        this.modalService.service.dismissAll(reason);
    }

}