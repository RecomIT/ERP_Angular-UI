import { Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
import { WorkShiftService } from "../../work-shit.service";
import { UtilityService } from "src/app/shared/services/utility.service";
import { CustomModalService } from "src/app/shared/services/custom-modal.service";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { BsDatepickerConfig } from "ngx-bootstrap/datepicker";

@Component({
    selector: 'app-attendance-work-shit-insert-update-modal',
    templateUrl: './insert-update-work-shift.component.html'
})

export class WorkShiftInsertUpdateModal implements OnInit {

    @Input() id: number = 0;
    @Input() data: any;
    datePickerConfig: Partial<BsDatepickerConfig> = this.utilityService.datePickerConfig();

    @ViewChild('workShiftInsertUpdateModal', { static: true }) workShiftInsertUpdateModal!: ElementRef;
    ngOnInit() {

    }

    constructor(
        private fb: FormBuilder, private modalService: CustomModalService,
        private utilityService: UtilityService,
        private workShiftService: WorkShiftService) {
    }

    openModal() {
        this.modalService.open(this.workShiftInsertUpdateModal, "lg");
    }

    select2Options = {
        width: "100%",
        containerCssClass: "form-control form-control-sm text-x-small font-bold",
        theme: "bootstrap4",
        multiple: true
    }

    form: FormGroup;

    formInit() {
        this.form = this.fb.group({
            workShiftId : new FormControl(),
            title: new FormControl(),
            titleInBengali: new FormControl(),
            name: new FormControl(),
            nameDetail:new FormControl(),
            nameInBengali: new FormControl(),
            nameDetailInBengali: new FormControl(),
            remarks: new FormControl(),
            startTime : new FormControl(),
            endTime: new FormControl(),
            inBufferTime: new FormControl(),
            maxInTime: new FormControl(),
            lunchStartTime: new FormControl(),
            lunchEndTime: new FormControl(),
            oTStartTime: new FormControl(),
            maxOTHour: new FormControl(),
            maxBeforeTime: new FormControl(),
            maxAfterTime: new FormControl(),
            exceededMaxAfterTime: new FormControl(),
            weekendDayName: new FormControl(),
            weekends: new FormControl([])
        })
        this.openModal();
    }

    btnSubmit: boolean = false;

    submit() {

    }
}