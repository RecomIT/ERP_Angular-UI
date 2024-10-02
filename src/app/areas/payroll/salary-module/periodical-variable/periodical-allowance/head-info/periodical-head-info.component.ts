import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { UserService } from "src/app/shared/services/user.service";
import { UtilityService } from "src/app/shared/services/utility.service";
import { PeriodicalVariableAllowanceService } from "../periodical-variable-allowance.service";
import { CustomModalService } from "src/app/shared/services/custom-modal.service";

@Component({
    selector: 'app-payroll-periodical-head-info-modal',
    templateUrl: './periodical-head-info.component.html'
})

export class PeriodicalHeadInfoComponent implements OnInit {

    @Input() id: number = 0;
    @ViewChild('modal', { static: true }) modal!: ElementRef;
    modalTitle: string = "Head Info";
    @Output() closeModalEvent = new EventEmitter<string>();
    constructor(
        private userService: UserService,
        private utilityService: UtilityService,
        public modalService: CustomModalService,
        private info_service: PeriodicalVariableAllowanceService,) {
    }

    ngOnInit(): void {
        this.getHeadInfos();
        this.openModal();
    }

    openModal() {
        this.modalService.open(this.modal, "sm");
    }

    list: any = [];
    getHeadInfos() {
        this.info_service.getHeadInfos(this.id).subscribe(response => {
            this.list = response.body
        });
    }
    closeModal(reason: any) {

        this.modalService.service.dismissAll(reason);
        this.closeModalEvent.emit(reason);

    }

}