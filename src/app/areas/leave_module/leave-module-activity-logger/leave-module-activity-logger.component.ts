import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { CustomModalService } from "src/app/shared/services/custom-modal.service";
import { UserService } from "src/app/shared/services/user.service";
import { UtilityService } from "src/app/shared/services/utility.service";
@Component({
    selector: 'leave-module-activity-logger',
    templateUrl: './leave-module-activity-logger.component.html'
})

export class LeaveModuleActivityLoggerComponent implements OnInit {

    @ViewChild("activityLoggerModal", { static: true }) activityLoggerModal : ElementRef;
    @Input() title: string = "";
    @Input() item: any;
    @Output() closeModalEvent = new EventEmitter<string>();

    ngOnInit(): void {
        this.modalService.open(this.activityLoggerModal, "sm")
        console.log("activity item >>>",this.item);
    }

    constructor(private utilityService: UtilityService, private userService: UserService, public modalService: CustomModalService, private el: ElementRef) {
    }

    closeModal(reason: any) {
        this.modalService.service.dismissAll(reason);

        this.closeModalEvent.emit(reason);
    }
    
}