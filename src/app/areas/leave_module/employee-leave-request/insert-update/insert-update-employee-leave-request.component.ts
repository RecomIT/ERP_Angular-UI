import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { BsDatepickerConfig } from "ngx-bootstrap/datepicker";
import { UserService } from "src/app/shared/services/user.service";
import { UtilityService } from "src/app/shared/services/utility.service";
import { LeaveSettingSerive } from "../../leave-setting/leave-setting.service";
import { DatePipe } from "@angular/common";
import { LeaveBalanceService } from "../../leave-balance/leave-balance.service";
import { CustomModalService } from "src/app/shared/services/custom-modal.service";
import { NgbCalendar, NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";
import { SharedmethodService } from "src/app/shared/services/shared-method/sharedmethod.service";
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { EmployeeLeaveRequestService } from "../../employee-leave-request/employee-leave-request.service";
import { EmployeeHierarchyService } from "src/app/areas/employee_module/employee/hierarchy/employee-hierarchy.service";
import { NotifyService } from "src/app/shared/services/notify-service/notify.service";
import { animate, state, style, transition, trigger } from "@angular/animations";
import { DatePickerConfigService } from "src/app/shared/services/date-picker-config.service";
import { DownloadfileService } from "src/app/shared/services/download-file/downloadfile.service";
import { EmployeeInfoService } from "src/app/areas/employee_module/employee/employee-info.service";

@Component({
    selector: 'leave-module-insert-update-employee-leave-request-modal',
    templateUrl: './insert-update-employee-leave-request.component.html',
    styleUrls: ['./insert-update-employee-leave-request.component.css'],
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

export class InsertUpdateEmployeeLeaveRequestModal implements OnInit {

    @Input() id: number = 0;
    @Input() leaveItem: any = null;

    @ViewChild('modal', { static: true }) employeeLeaveRequestModal!: ElementRef;
    @Output() closeModalEvent = new EventEmitter<string>();

    @Input() resignationRequestId: number;

    modalTitle: string = "";
    datePickerConfig: Partial<BsDatepickerConfig> = {};
    deliveryDatePickerConfig: Partial<BsDatepickerConfig> = {};
    replacementDatePickerConfig: Partial<BsDatepickerConfig> = this.utilityService.datePickerConfig();

    model: NgbDateStruct;
    date: { year: number, month: number };

    constructor(
        private fb: FormBuilder,
        private userService: UserService,
        public utilityService: UtilityService,
        private leaveSettingSerive: LeaveSettingSerive,
        private datepipe: DatePipe,
        private leaveBalanceService: LeaveBalanceService,
        public modalService: CustomModalService,
        public employeeLeaveRequestService: EmployeeLeaveRequestService,
        private calendar: NgbCalendar,
        private sharedmethodService: SharedmethodService,
        private employeeHierarchyService: EmployeeHierarchyService,
        private notifyService: NotifyService,
        private datePipe: DatePipe,
        private datePickerConfigService: DatePickerConfigService,
        private downloadfileService: DownloadfileService,
        private employeeInfoService: EmployeeInfoService
    ) {
    }

    User() {
        return this.userService.User();
    }

    organizationId: number;
    companyId: number;
    select2Config: any = this.utilityService.select2Config();

    leaveTypeDisabled: boolean = false;

    leaveTypeNameInEditMode: string = "";
    dayLeaveTypeInEditMode: string = "";

    ngOnInit(): void {
        this.loadEmployeeDropdown();
        if (this.leaveItem != null) {
            this.leaveTypeDisabled = true;
            this.modalTitle = "Update Leave Request";
            this.editEmployeeLeaveRequest(this.leaveItem);
        }
        else {
            this.openEmployeeLeaveRequestModal();
            this.modalTitle = "Apply A Leave Request"
        }

        this.organizationId = this.User().OrgId;
        this.companyId = this.User().ComId;

        this.getHierarchyInfo();

        this.deliveryDatePickerConfig = this.datePickerConfigService.getRangeConfig();

    }

    ddlEmployees: any[];
    loadEmployeeDropdown() {
        this.employeeInfoService.loadDropdownData({});
        this.employeeInfoService.ddl_employee_data$.subscribe(data => {
            this.employeeInfoService.loadDropdown(data);
            this.ddlEmployees = this.employeeInfoService.ddl$;
        }, error => {
            console.error('Error while fetching data:', error);
        });
    }

    hierarchyInfo: any;
    getHierarchyInfo() {
        this.employeeHierarchyService.getActiveHierarchy(this.User().EmployeeId).subscribe(response => {
            this.hierarchyInfo = response.body;
        }, (error) => {
            this.notifyService.handleApiError(error);
        })
    }


    validationMessages = {
        'employeeId': {
            'required': 'Employee Id is required',
            'min': 'Employee Id is required'
        },
        'leaveTypeId': {
            'min': 'Leave type is required'
        },
        'dayLeaveType': {
            'required': 'Day Leave Type is required'
        },
        'halfDayType': {
            'required': 'Portion Of Day is required'
        },
        'appliedFromDate': {
            'required': 'Applied date is required'
        },
        'leavePurpose': {
            'required': 'Leave purpose is required',
            'minlength': 'Character minimum length is 4',
            'maxlength': 'Character maximum length is 500'
        },
        'emergencyPhoneNo': {
            'maxlength': 'Character maximum length is 33'
        },
        'addressDuringLeave': {
            'maxlength': 'Character maximum length is 150'
        }
    }

    formErrors = {
        'employeeId': '',
        'leaveTypeId': '',
        'dayLeaveType': '',
        'halfDayType': '',
        'appliedFromDate': '',
        'leavePurpose': '',
        'emergencyPhoneNo': '',
        'addressDuringLeave': ''
    }

    employeeLeaveBalance: any = [];
    loadLeaveBalance(id: number) {
        this.leaveBalanceService.getLeaveBalanceAsync(id).subscribe(response => {
            this.employeeLeaveBalance = response;
            //console.log("employeeLeaveBalance >>>", response);
        })
    }


    totalLeave: number = 0;
    maxLeaveCanbeTakenAtATime: number = 0;
    employeeLeaveTypeForm: FormGroup;

    employeeLeaveTypeFormInit() {
        this.employeeLeaveTypeForm = this.fb.group({
            employeeLeaveRequestId: new FormControl(this.id),
            employeeId: new FormControl((this.leaveItem?.employeeId ?? 0), [Validators.required, Validators.min(1)]),
            leaveTypeId: new FormControl((this.leaveItem?.leaveTypeId ?? 0), [Validators.min(1)]),
            appliedTotalDays: new FormControl((this.leaveItem?.appliedTotalDays ?? 0), [Validators.min(.5)]),
            dayLeaveType: new FormControl('Full-Day', [Validators.required]),
            halfDayType: new FormControl(''),
            appliedFromDate: new FormControl(null, [Validators.required]),
            leavePurpose: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(500)]),
            emergencyPhoneNo: new FormControl('', [Validators.maxLength(33)]),
            addressDuringLeave: new FormControl('', [Validators.maxLength(150)]),
            remarks: new FormControl(''),
            file: new FormControl(null),
            estimatedDeliveryDate: new FormControl(null)
        })

        // this.loadLeaveBalance(this.User().EmployeeId);

        this.employeeLeaveTypeForm.get('employeeId').valueChanges.subscribe({
            next: (value) => {
                if (this.utilityService.IntTryParse(value) > 0) {
                    this.loadLeaveBalance(this.utilityService.IntTryParse(value));
                    this.loadEmployeeLeaveBalance();
                }
            }
        })

        this.employeeLeaveTypeForm.valueChanges.subscribe((data) => {
            this.logFormErrors();
        })

        this.employeeLeaveTypeForm.get('leaveTypeId').valueChanges.subscribe((value) => {
            // console.log("leaveTypeId in form >>>", value);
            this.maxLeaveCanbeTakenAtATime = 0;

            let leaveTypeObj = this.ddlEmployeeLeaveBalance.find(item => item.id == value);

            if (leaveTypeObj != null) {
                if ((leaveTypeObj?.max ?? 0) > 0 && (this.utilityService.FloatTryParse(leaveTypeObj?.count ?? 0)) > (leaveTypeObj?.max ?? 0)) {
                    this.maxLeaveCanbeTakenAtATime = (leaveTypeObj?.max ?? 0)
                }
                else if ((leaveTypeObj?.max ?? 0) > 0 && (this.utilityService.FloatTryParse(leaveTypeObj?.count ?? 0)) < (leaveTypeObj?.max ?? 0)) {
                    this.maxLeaveCanbeTakenAtATime = this.utilityService.FloatTryParse(leaveTypeObj?.count ?? 0);
                }
                else if ((leaveTypeObj?.max ?? 0) == 0) {
                    this.maxLeaveCanbeTakenAtATime = this.utilityService.FloatTryParse(leaveTypeObj?.count ?? 0);
                }
                else {
                    this.maxLeaveCanbeTakenAtATime = this.utilityService.FloatTryParse(leaveTypeObj?.count ?? 0);
                }
            }
            this.employeeLeaveTypeForm.get('appliedFromDate').setValue(null);
            this.getLeaveSetting(this.employeeLeaveTypeForm.get('leaveTypeId').value);


            // ------------ Start

            this.updateEstimatedDeliveryDateValidation(value);

            // // ------------ End





            // // ------------ Start
            // Disable appliedFromDate if estimatedDeliveryDate is null
            if ((this.employeeLeaveTypeForm.get('leaveTypeId').value == 5 && this.companyId == 21 && this.organizationId == 14) && this.employeeLeaveTypeForm.get('estimatedDeliveryDate').value === null) {
                this.employeeLeaveTypeForm.get('appliedFromDate').disable();
            } else {
                this.employeeLeaveTypeForm.get('appliedFromDate').enable();
            }
            // ------------ End



        })


        // Subscribe to estimatedDeliveryDate value changes
        this.employeeLeaveTypeForm.get('estimatedDeliveryDate').valueChanges.subscribe((estimatedDeliveryDate) => {
            // console.log('Estimated Delivery Date:', estimatedDeliveryDate);

            // Get the value of leaveTypeId
            const leaveTypeId = this.employeeLeaveTypeForm.get('leaveTypeId').value;
            // console.log('Leave Type ID:', leaveTypeId);


            if ((leaveTypeId == 5 && this.companyId == 21 && this.organizationId == 14) && estimatedDeliveryDate === null) {
                this.employeeLeaveTypeForm.get('appliedFromDate').disable();
            } else {
                this.employeeLeaveTypeForm.get('appliedFromDate').enable();
            }
            this.employeeLeaveTypeForm.get('appliedFromDate').updateValueAndValidity();


            let requestDaysBeforeTakingLeave = this.leaveSettingInfo?.requiredDaysBeforeEDD;
            var valueItemFrom = this.utilityService.IntTryParse(requestDaysBeforeTakingLeave);

            // Calculate the minimum date based on Estimated Delivery Date and requestDaysBeforeTakingLeave
            const minDate = this.utilityService.getDateBeforeEDD(estimatedDeliveryDate, valueItemFrom);
            // console.log('Min Date:', minDate);

            // Set the date picker configuration
            this.datePickerConfig = Object.assign({}, {
                containerClass: "theme-dark-blue",
                showWeekNumbers: false,
                dateInputFormat: "DD-MMMM-YYYY",
                isAnimated: true,
                showClearButton: false,
                showTodayButton: false,
                todayPosition: "left",
                rangeInputFormat: "DD-MMM-YYYY",
                rangeSeparator: " ~ ",
                size: "sm",
                minDate: new Date(minDate),
                maxDate: new Date(this.leaveSettingInfo?.leavePeriodEnd),
                customTodayClass: 'custom-today-class'
            });

        });


        this.employeeLeaveTypeForm.get('dayLeaveType').valueChanges.subscribe((value) => {
            this.employeeLeaveTypeForm.get('appliedFromDate').setValue(null);
            this.employeeLeaveTypeForm.get('halfDayType').setValue('');
            this.employeeLeaveTypeForm.get('halfDayType').clearValidators();
            this.employeeLeaveTypeForm.get('halfDayType').updateValueAndValidity();
            this.totalLeave = 0;
            if (value == "Full-Day") {
                this.employeeLeaveTypeForm.get('halfDayType').clearValidators();
            }
            else {
                this.totalLeave = 0.50;
                this.employeeLeaveTypeForm.get('halfDayType').clearValidators();
                this.employeeLeaveTypeForm.get('halfDayType').setValidators([Validators.required]);
                this.employeeLeaveTypeForm.get('halfDayType').updateValueAndValidity();
            }
        })


        this.employeeLeaveTypeForm.get('appliedFromDate').valueChanges.subscribe((value) => {
            this.totalLeave = 0;
            if (value != 'null' && value != null && value != '') {
                setTimeout(() => {
                    this.leaveDaysCalculation();
                }, 50);
            }
            this.logFormErrors();
        })

    }


    // Method to update file control validation based on leaveTypeId, fileAttachedOption, and leaveTypeDisabled
    updateFileValidation() {
        const fileAttachedOption = this.leaveSettingInfo?.fileAttachedOption;
        const leaveTypeDisabled = this.leaveTypeDisabled;

        console.log('fileAttachedOption', fileAttachedOption);

        // If leaveTypeDisabled is false, apply the fileAttachedOption validation rules
        if (!leaveTypeDisabled) {
            switch (fileAttachedOption) {
                case 'Mandatory':
                    this.employeeLeaveTypeForm.get('file').setValidators([Validators.required]);
                    break;
                case 'Optional':
                    // Optional case, no validators are set
                    this.employeeLeaveTypeForm.get('file').clearValidators();
                    break;
                case 'None':
                    // No file attachment allowed, clear validators and disable the control
                    this.employeeLeaveTypeForm.get('file').clearValidators();
                    // this.employeeLeaveTypeForm.get('file').disable();
                    break;
                default:
                    // Default case, clear validators
                    this.employeeLeaveTypeForm.get('file').clearValidators();
                    break;
            }
        } else {
            // If leaveTypeDisabled is true, clear validators and disable the control
            this.employeeLeaveTypeForm.get('file').clearValidators();
            // this.employeeLeaveTypeForm.get('file').disable();
        }

        // Update validity of the file control
        this.employeeLeaveTypeForm.get('file').updateValueAndValidity();
    }




    // Method to update validators for estimatedDeliveryDate based on leaveTypeId, companyId, and organizationId
    updateEstimatedDeliveryDateValidation(leaveTypeId: number) {
        switch (true) {
            case (leaveTypeId == 5 && this.companyId == 21 && this.organizationId == 14):
                this.employeeLeaveTypeForm.get('estimatedDeliveryDate').setValidators([Validators.required]);
                break;
            default:
                this.employeeLeaveTypeForm.get('estimatedDeliveryDate').clearValidators();
                break;
        }

        // Update validity of the estimatedDeliveryDate control
        this.employeeLeaveTypeForm.get('estimatedDeliveryDate').updateValueAndValidity();
    }





    isDeliveryDateInvalid(): string | null {
        const estimatedDeliveryDate = this.employeeLeaveTypeForm.get('estimatedDeliveryDate').value;
        const requiredDaysBeforeEDD = this.leaveSettingInfo?.requiredDaysBeforeEDD;
        const minDate = this.utilityService.getDateBeforeEDD(estimatedDeliveryDate, requiredDaysBeforeEDD);
        if (new Date(minDate) < new Date()) {
            return `Delivery Date must be more than today plus ${requiredDaysBeforeEDD} days.`;
        }
        return null;
    }



    fileName: string = null;
    filePath2: string = null;

    filePath: string = null;
    editEmployeeLeaveRequest(item: any) {
        this.openEmployeeLeaveRequestModal();
        this.employeeLeaveRequestService.getById({ employeeLeaveRequestId: item.employeeLeaveRequestId, employeeId: item.employeeId }).subscribe(response => {
            // console.log("editEmployeeLeaveRequest response >>>", response);
            if ((response.body?.stateStatus) == "Pending") {
                this.dayLeaveTypeInEditMode = response.body?.dayLeaveType;
                this.leaveItem.leaveTypeId = response.body?.leaveTypeId;
                this.getLeaveTypeNameInEditMode();
                this.employeeLeaveTypeForm.patchValue(response.body);

                if (response.body?.filePath != null && response.body?.fileName != null) {
                    this.filePath = response.body?.filePath + "//" + response.body?.fileName;

                    this.fileName = response.body?.fileName;
                    this.filePath2 = response.body?.filePath;
                }

                const fileName = response.body?.actualFileName || response.body?.fileName;
                this.selectedFileName = fileName || '';


                const data = {
                    appliedFromDate: new Date(response.body?.appliedFromDate),
                    appliedToDate: new Date(response.body?.appliedToDate)
                };
                if (this.employeeLeaveTypeForm.get('dayLeaveType').value == 'Half-Day') {
                    this.employeeLeaveTypeForm.get('appliedFromDate').setValue(new Date(data.appliedFromDate))
                }
                else {
                    this.employeeLeaveTypeForm.get('appliedFromDate').setValue([new Date(data.appliedFromDate), new Date(data.appliedToDate)])
                }

                if (response.body?.estimatedDeliveryDate != null) {
                    this.employeeLeaveTypeForm.get('estimatedDeliveryDate').setValue(new Date(response.body?.estimatedDeliveryDate))
                }
            }
            else {
                // this.utilityService.warning("This Leave already has been Approved/Rejected/Cancelled")
                this.notifyService.showWarningToast("This Leave already has been Approved/Rejected/Cancelled");
                this.closeModal("Save Complete");
            }
        }, (error) => {
            // console.log("error >>>", error);
            // this.utilityService.fail("Something went wrong", "Server Response");

            this.notifyService.handleApiError(error);
        })
    }



    logFormErrors(formGroup: FormGroup = this.employeeLeaveTypeForm) {
        Object.keys(formGroup.controls).forEach((key: string) => {
            const abstractControl = formGroup.get(key);
            this.formErrors[key] = '';
            if (abstractControl && !abstractControl.valid && (abstractControl.touched || abstractControl.dirty)) {
                const messages = this.validationMessages[key];
                for (const errorKey in abstractControl.errors) {
                    this.formErrors[key] += messages[errorKey];
                }
            }
        })
    }


    // Leave Settings
    leaveSettingInfo: any;
    replacementsDates: any[] = [];
    getLeaveSetting(leaveTypeId: number) {
        if (leaveTypeId > 0) {
            this.leaveSettingInfo = null;
            this.replacementsDates = [];


            this.leaveSettingSerive.getLeaveTypeSetting({ leaveTypeId: leaveTypeId, employeeId: this.User().EmployeeId }).subscribe(response => {
                if (response != null) {
                    this.leaveSettingInfo = response;
                    // console.log("leaveSettingSerive response >>>>", response);

                    this.updateFileValidation();

                    let leaveTypeName = response?.leaveTypeName;
                    let requestDaysBeforeTakingLeave = response?.requestDaysBeforeTakingLeave;
                    var valueItemFrom = this.utilityService.IntTryParse(requestDaysBeforeTakingLeave);

                    if ((response?.showFullCalender ?? false) == false) {

                        if (leaveTypeName != null && leaveTypeName.indexOf('Sick') > -1) {
                            // Calculate minDate and maxDate
                            const minDate = new Date(response.leavePeriodStart);
                            const maxDate = this.utilityService.getDateAfterToday(3);
                            // console.log('Min Date:', minDate);
                            // console.log('Max Date:', maxDate);

                            // Assign date picker configuration
                            this.datePickerConfig = Object.assign({}, {
                                containerClass: "theme-dark-blue",
                                showWeekNumbers: false,
                                dateInputFormat: "DD-MMMM-YYYY",
                                isAnimated: true,
                                showClearButton: false,
                                showTodayButton: false,
                                todayPosition: "left",
                                rangeInputFormat: "DD-MMM-YYYY",
                                rangeSeparator: " ~ ",
                                size: "sm",
                                minDate: minDate,
                                maxDate: maxDate,
                                customTodayClass: 'custom-today-class'
                            });
                        }


                        else {
                            this.datePickerConfig = Object.assign({}, {
                                containerClass: "theme-dark-blue",
                                showWeekNumbers: false,
                                dateInputFormat: "DD-MMMM-YYYY",
                                isAnimated: true,
                                showClearButton: false,
                                showTodayButton: false,
                                todayPosition: "left",
                                rangeInputFormat: "DD-MMM-YYYY",
                                rangeSeparator: " ~ ",
                                size: "sm",
                                minDate: this.utilityService.getDateAfterToday(valueItemFrom),
                                maxDate: new Date(response.leavePeriodEnd),
                                customTodayClass: 'custom-today-class'
                            })
                        }
                    }


                    else {
                        this.datePickerConfig = Object.assign({}, {
                            containerClass: "theme-dark-blue",
                            showWeekNumbers: false,
                            dateInputFormat: "DD-MMMM-YYYY",
                            isAnimated: true,
                            showClearButton: false,
                            showTodayButton: false,
                            todayPosition: "left",
                            rangeInputFormat: "DD-MMM-YYYY",
                            rangeSeparator: " ~ ",
                            size: "sm",
                            minDate: new Date(response.leavePeriodStart),
                            maxDate: new Date(response.leavePeriodEnd),
                            customTodayClass: 'custom-today-class'
                        })
                    }
                }
            }, (error) => {
                // console.log("error >>>", error);
                // this.utilityService.fail("Something went wrong", "Server Response");
                this.notifyService.handleApiError(error);
            })
        }
    }






    listOfeligibleLeaveDay: any[] = [];
    showMaternityLeaveDays: boolean = false;

    leaveDaysCalculation() {
        this.totalLeave = 0;
        this.listOfeligibleLeaveDay = []
        if (this.employeeLeaveTypeForm != null && this.employeeLeaveTypeForm.get('appliedFromDate').value != null
            && this.employeeLeaveTypeForm.get('appliedFromDate').value != 'null') {

            let fromDate = '';
            let toDate = '';
            if (this.employeeLeaveTypeForm.get("dayLeaveType").value == "Half-Day") {
                fromDate = this.datepipe.transform(this.employeeLeaveTypeForm.get('appliedFromDate').value, 'yyyy-MM-dd');
                toDate = this.datepipe.transform(this.employeeLeaveTypeForm.get('appliedFromDate').value, 'yyyy-MM-dd');
            }
            else {
                fromDate = this.datepipe.transform(this.employeeLeaveTypeForm.get('appliedFromDate').value[0], 'yyyy-MM-dd');
                toDate = this.datepipe.transform(this.employeeLeaveTypeForm.get('appliedFromDate').value[1], 'yyyy-MM-dd');
            }
            let leaveTypeId = this.employeeLeaveTypeForm.get('leaveTypeId').value;

            if (fromDate.indexOf('1970') < 0) {
                var params = { employeeLeaveRequestId: this.employeeLeaveTypeForm.get('employeeLeaveRequestId').value, employeeId: this.User().EmployeeId, leaveTypeId: leaveTypeId, appliedFromDate: fromDate ?? "", appliedToDate: toDate ?? "" };

                this.leaveSettingSerive.getTotalRequestDays(params).subscribe(response => {
                    if (response != null) {


                        if (this.maxLeaveCanbeTakenAtATime >= 0 || this.leaveSettingInfo?.acquiredViaOffDayWork) {
                            this.totalLeave = this.utilityService.IntTryParse(response.leaveCount);

                            if (this.maxLeaveCanbeTakenAtATime == null || this.maxLeaveCanbeTakenAtATime == 0 || this.totalLeave <= this.maxLeaveCanbeTakenAtATime) {
                                if (this.employeeLeaveTypeForm.get("dayLeaveType").value == "Half-Day") {
                                    this.totalLeave = .5;
                                }
                                this.employeeLeaveTypeForm.get('appliedTotalDays').setValue(this.totalLeave);
                                this.listOfeligibleLeaveDay = JSON.parse(response.list)





                                // Check if eligible leave days are greater than 3
                                if (this.employeeLeaveTypeForm.get('leaveTypeId').value == 5 && this.companyId == 21 && this.organizationId == 14 && this.leaveTypeDisabled == false) {


                                    const allcatedTotalLeave = this.leaveSettingInfo?.totalLeave;
                                    if (this.totalLeave < allcatedTotalLeave) {
                                        this.showMaternityLeaveDays = true;
                                    }
                                    else {
                                        this.showMaternityLeaveDays = false;
                                    }


                                    if (this.employeeLeaveTypeForm.get('appliedTotalDays').value != null) {
                                        this.employeeLeaveTypeForm.get('file').setValidators([Validators.required]);
                                        this.employeeLeaveTypeForm.get('file').updateValueAndValidity();
                                    }
                                    else {
                                        // Clear 'file' control validation
                                        this.employeeLeaveTypeForm.get('file').clearValidators();
                                        this.employeeLeaveTypeForm.get('file').updateValueAndValidity();
                                    }

                                } else {
                                    // Clear 'file' control validation
                                    this.employeeLeaveTypeForm.get('file').clearValidators();
                                    this.employeeLeaveTypeForm.get('file').updateValueAndValidity();
                                }





                                if (this.totalLeave > this.leaveSettingInfo.requiredDaysForFileAttached && this.companyId == 21 && this.organizationId == 14 && this.employeeLeaveTypeForm.get('leaveTypeId').value == 3 && this.leaveTypeDisabled == false) {
                                    this.employeeLeaveTypeForm.get('file').setValidators([Validators.required]);
                                    this.employeeLeaveTypeForm.get('file').updateValueAndValidity();
                                }






                                if (this.leaveSettingInfo != null && this.leaveSettingInfo?.acquiredViaOffDayWork == true) {
                                    this.listOfeligibleLeaveDay.forEach((value, index) => {
                                        if (value.ReplacementDate != null && value.ReplacementDate != "") {
                                            this.listOfeligibleLeaveDay[index].ReplacementDate = new Date(value.ReplacementDate);
                                        }
                                    })
                                }


                            }
                            else {
                                this.totalLeave = 0;
                                this.employeeLeaveTypeForm.get('appliedFromDate').setValue(null);

                                // this.utilityService.fail("You selected more than your limit. Your limit is " + this.maxLeaveCanbeTakenAtATime.toString() + " now.", "Site Response");

                                this.notifyService.showErrorToast("You selected more than your limit. Your limit is " + this.maxLeaveCanbeTakenAtATime.toString() + " now.");
                            }
                        }
                        else if (this.maxLeaveCanbeTakenAtATime == 0 && this.leaveSettingInfo?.acquiredViaOffDayWork) {
                            //this.utilityService.fail("You selected more than your limit. Your limit is " + this.maxLeaveCanbeTakenAtATime.toString() + " now.", "Site Response");
                            this.notifyService.showErrorToast("You selected more than your limit. Your limit is " + this.maxLeaveCanbeTakenAtATime.toString() + " now.");
                        }
                        else {
                            // this.utilityService.fail("You selected more than your limit. Your limit is " + this.maxLeaveCanbeTakenAtATime.toString() + " now.", "Site Response");
                            this.notifyService.showErrorToast("You selected more than your limit. Your limit is " + this.maxLeaveCanbeTakenAtATime.toString() + " now.");
                        }
                        // console.log("listOfeligibleLeaveDay >>>", this.listOfeligibleLeaveDay);
                        // console.log("totalLeave >>>", this.totalLeave);
                    }
                }, (error) => {
                    // console.log("error >>>", error);
                    // this.utilityService.fail("Something went wrong", "Server Response");
                    this.notifyService.handleApiError(error);
                })

            }
        }
    }


    validateMaternityLeave() {
        if (this.showMaternityLeaveDays) {
            const maternityLeave = this.leaveSettingInfo?.totalLeave;
            if (maternityLeave) {
                return `Your Maternity leave is ${maternityLeave}. You can proceed accordingly.`;
            } else {
                return "";
            }
        }
        return '';
    }







    btnEmployeeLeaveRequest: boolean = false;
    ddlEmployeeLeaveBalance: any[] = [];

    getLeaveTypeNameInEditMode() {
        if (this.ddlEmployeeLeaveBalance != null && this.ddlEmployeeLeaveBalance.length > 0) {
            let findleaveType = this.ddlEmployeeLeaveBalance.find(item => item.id == this.leaveItem?.leaveTypeId.toString());
            if (findleaveType != null && findleaveType.id != "") {
                this.leaveTypeNameInEditMode = findleaveType.text
                    + '- Avaliable: ' + findleaveType.count + ' - Max at once: ' + findleaveType.max;
            }
        }
    }




    // Show Leave Balance
    // Start
    loadEmployeeLeaveBalance() {
        this.ddlEmployeeLeaveBalance = [];
        let id = this.utilityService.IntTryParse(this.employeeLeaveTypeForm.get('employeeId').value);
        if (id > 0) {
            if (this.utilityService.IntTryParse(this.leaveItem?.employeeLeaveRequestId) > 0) {
                this.leaveBalanceService.loadEmployeeLeaveBalanceDropdownInEdit({ employeeLeaveRequestId: this.leaveItem.employeeLeaveRequestId, employeeId: id });
                this.leaveBalanceService.ddl$_2.subscribe(data => {
                    this.ddlEmployeeLeaveBalance = data;

                    //leaveTypeNameInEditMode
                    // console.log("this.ddlEmployeeLeaveBalance In edit >>>", this.ddlEmployeeLeaveBalance);
                })
            }
            else {
                this.leaveBalanceService.loadEmployeeLeaveBalanceDropdown({ employeeId: id });
                this.leaveBalanceService.ddl$.subscribe(data => {
                    this.ddlEmployeeLeaveBalance = data;
                    // console.log("this.ddlEmployeeLeaveBalance >>>", this.ddlEmployeeLeaveBalance);
                })

            }
        }
    }



    openEmployeeLeaveRequestModal() {
        Object.keys(this.formErrors).forEach((key: string) => { this.formErrors[key] = ''; })
        this.employeeLeaveTypeFormInit();
        this.listOfeligibleLeaveDay = [];
        //this.loadEmployeeLeaveBalance();
        this.btnEmployeeLeaveRequest = false;
        this.totalLeave = 0;
        this.modalService.open(this.employeeLeaveRequestModal, "xl");
        this.getLeavePeriod();
    }

    getLeavePeriod() {
        this.leaveSettingSerive.getLeavePeriod({ employeeId: this.User().EmployeeId }).subscribe(response => {
            this.getLeavePeriodValue(response);
        }, (error) => {
            // console.log("error >>>", error);
            this.notifyService.handleApiError(error);
        })
    }

    getLeavePeriodValue(response_data: any) {
        let fromDate = this.datepipe.transform(response_data.leavePeriodStart, 'yyyy-MM-dd');
        let toDate = this.datepipe.transform(response_data.leavePeriodEnd, 'yyyy-MM-dd');
        this.datePickerConfig = Object.assign({}, {
            containerClass: "theme-dark-blue",
            showWeekNumbers: false,
            dateInputFormat: "DD-MMMM-YYYY",
            isAnimated: true,
            showClearButton: false,
            showTodayButton: false,
            todayPosition: "left",
            rangeInputFormat: "DD-MMM-YYYY",
            rangeSeparator: " ~ ",
            size: "sm",
            customTodayClass: 'custom-today-class',
            minDate: new Date(fromDate),
            maxDate: new Date(toDate)
        })
    }

    submitEmployeeLeaveRequest2() {
        let isValidFromReplacementDate = true;
        if (this.leaveSettingInfo != null && this.leaveSettingInfo?.acquiredViaOffDayWork == true) {
            this.listOfeligibleLeaveDay.forEach((item, index) => {
                if (item.Status == "Leave") {
                    if (item.ReplacementDate == null || item.ReplacementDate == "null" || item.ReplacementDate == undefined || item.ReplacementDate == "undefined" || item.ReplacementDate == "") {
                        // this.utilityService.fail("Please add replacement date in all replacement box", "Site Response", 1000);
                        this.notifyService.showErrorToast("Please add replacement date in all replacement box")
                        isValidFromReplacementDate = false;
                        return;
                    }
                }
            })
        }

        if (this.employeeLeaveTypeForm.valid && isValidFromReplacementDate && this.btnEmployeeLeaveRequest == false) {

            this.btnEmployeeLeaveRequest = true;
            let appliedFrmDate = "";
            let appliedTDate = "";
            let estimatedDeliveryDate = this.employeeLeaveTypeForm.get('estimatedDeliveryDate').value;
            let appliedTotDays = this.totalLeave;

            if (this.employeeLeaveTypeForm.get('dayLeaveType').value == 'Half-Day') {
                appliedFrmDate = this.datepipe.transform(this.employeeLeaveTypeForm.get('appliedFromDate').value, 'yyyy-MM-dd');
                appliedTDate = this.datepipe.transform(this.employeeLeaveTypeForm.get('appliedFromDate').value, 'yyyy-MM-dd');
            }
            else {
                appliedFrmDate = this.datepipe.transform(this.employeeLeaveTypeForm.get('appliedFromDate').value[0], 'yyyy-MM-dd');
                appliedTDate = this.datepipe.transform(this.employeeLeaveTypeForm.get('appliedFromDate').value[1], 'yyyy-MM-dd');
            }

            let formData = Object.assign({}, this.employeeLeaveTypeForm.value);
            formData.appliedFromDate = appliedFrmDate;
            formData.appliedToDate = appliedTDate;
            formData.appliedTotalDays = appliedTotDays;

            //

            let form = new FormData();
            Object.keys(this.employeeLeaveTypeForm.value).forEach(key => {
                if (key != 'appliedFromDate' && key != 'appliedToDate' && key != 'appliedTotalDays' && key != 'estimatedDeliveryDate') {
                    form.append(key, this.employeeLeaveTypeForm.get(key).value);
                }
            });

            form.append("appliedFromDate", this.datePipe.transform(appliedFrmDate, "yyyy-MM-dd"));
            form.append("appliedToDate", this.datePipe.transform(appliedTDate, "yyyy-MM-dd"));
            form.append("filePath", this.filePath);

            form.append("appliedTotalDays", appliedTotDays.toString());


            form.append("leaveDaysJson", JSON.stringify(this.listOfeligibleLeaveDay));
            if (estimatedDeliveryDate != null && estimatedDeliveryDate != '') {
                estimatedDeliveryDate = this.datepipe.transform(estimatedDeliveryDate, 'yyyy-MM-dd');
                form.append("estimatedDeliveryDate", estimatedDeliveryDate);
            }


            this.employeeLeaveRequestService.save3(form).subscribe(response => {
                this.btnEmployeeLeaveRequest = false;
                if (response.status) {
                    // console.log('response',response);
                    response.leaveTypeId = this.utilityService.IntTryParse(this.employeeLeaveTypeForm.get('leaveTypeId').value);
                    response.action = this.utilityService.IntTryParse(this.employeeLeaveTypeForm.get('employeeLeaveRequestId').value) > 0 ? "Update" : "Insert";
                    //this.sendEmail2(response);
                    this.sharedmethodService.callMethod();
                    this.sendEmailNew(response);
                    // this.utilityService.success("Saved Successfull", "Server Response")
                    if (response.action == "Update") {
                        this.notifyService.showSuccessToast("Leave Updated Successfull");
                    }
                    else if (response.action == "Insert") {
                        this.notifyService.showSuccessToast("Leave Applied Successfull");
                    }


                    this.closeModal("Save Complete");
                }

                else {
                    if (response.msg == "Validation Error") {
                        response.msg = '';
                        Object.keys(response.errors).forEach((key) => {
                            response.msg += response.errors[key] + '</br>';
                        })
                        // this.utilityService.fail(response.msg, "Server Response", 5000)

                        this.notifyService.showErrorToast(response.msg);
                    }
                    else {
                        // this.utilityService.fail(response.msg, "Server Response")
                        this.notifyService.showErrorToast(response.msg);
                    }
                }
            }, (error) => {
                this.btnEmployeeLeaveRequest = false;
                // console.log("error >>>", error);
                // this.utilityService.fail("One or More field value is invalid", "Site Response");
                this.notifyService.handleApiError(error);
            })


        }
        else {
            // this.utilityService.fail("Invalid Form Values", "Site Response")
            // this.notifyService.defaultError();
        }
    }




    clearEstimatedDeliveryDate(formControlName: string) {
        this.employeeLeaveTypeForm.get(formControlName).setValue(null);
        this.employeeLeaveTypeForm.get('appliedFromDate').setValue(null);

        if (this.employeeLeaveTypeForm.get('estimatedDeliveryDate').value == null) {
            this.employeeLeaveTypeForm.get('appliedFromDate').disable();
        } else {
            this.employeeLeaveTypeForm.get('appliedFromDate').enable();
        }
        this.employeeLeaveTypeForm.get('appliedFromDate').updateValueAndValidity();
    }


    clearDate(formControlName: string) {
        this.employeeLeaveTypeForm.get(formControlName).setValue(null);
    }

    closeModal(reason: any) {
        if (this.btnEmployeeLeaveRequest == false) {
            this.modalService.service.dismissAll(reason);
            this.closeModalEvent.emit(reason);
        }
    }

    sendEmail2(params: any) {
        let leaveRequestId = params.itemId;
        let emailType = params.action == "Insert" ? "Request" : (params.action == "Update" ? "Modified" : "Cancelled");
        var leaveTypeId = this.utilityService.IntTryParse(params.leaveTypeId);
        this.employeeLeaveRequestService.sendEmail({ employeeId: this.User().EmployeeId, leaveTypeId: leaveTypeId, emailType: emailType, leaveRequestId: leaveRequestId }).subscribe(response => {
            // console.log("response >>>", response);
        }, (error) => {
            // console.log("error >>>", error);
            // this.utilityService.fail("Something went wrong", "Server Response");
            // this.notifyService.handleApiError(error);
        })
    }

    sendEmailNew(params: any) {
        this.employeeLeaveRequestService.sendEmailNew(params).subscribe(response => {
            // console.log("response >>>", response);
        }, (error) => {
            //console.log("error >>>", error);
            // this.notifyService.handleApiError(error);
        })
    }






    showFileInput: boolean = false;

    toggleFileInput(): void {
        this.showFileInput = !this.showFileInput;

        if (!this.showFileInput) {
            this.employeeLeaveTypeForm.get('file').setValue(null);
        }
    }



    selectedFileName: string = '';
    fileUpload(event: any): void {
        const selectedFile = (event.target as HTMLInputElement).files?.[0];
        this.employeeLeaveTypeForm.get('file').setValue(selectedFile);

        // Set the selectedFileName for display
        this.selectedFileName = selectedFile ? selectedFile.name : '';
    }


    downloadFile(fileName: string, filePath: string) {

        const params: any = {};
        if (fileName && fileName != null) {
            params['fileName'] = fileName;
        }

        if (filePath && filePath != null) {
            params['filePath'] = filePath;
        }

        this.downloadfileService.downloadFile<any[]>(params).subscribe(data => {

            const blob = new Blob([data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            const anchor = document.createElement('a');
            anchor.href = url;
            anchor.download = fileName;
            document.body.appendChild(anchor);
            anchor.click();
            document.body.removeChild(anchor);
            window.URL.revokeObjectURL(url);
        }, error => {
            //   console.error('Error downloading file:', error);
            this.notifyService.handleApiError(error);
        });


    }



}