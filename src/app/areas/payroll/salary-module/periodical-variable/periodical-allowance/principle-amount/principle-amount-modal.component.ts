import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { CustomModalService } from "src/app/shared/services/custom-modal.service";
import { UserService } from "src/app/shared/services/user.service";
import { UtilityService } from "src/app/shared/services/utility.service";
import { PeriodicalVariableAllowanceService } from "../periodical-variable-allowance.service";

@Component({
    selector: 'app-payroll-principle-amount-modal',
    templateUrl: './principle-amount-modal.component.html'
})

export class PricipleAmountModalComponent implements OnInit {

    @Input() id: number = 0;
    @ViewChild('modal', { static: true }) modal!: ElementRef;
    modalTitle: string = "Principle Amount Info";
    @Output() closeModalEvent = new EventEmitter<string>();
    constructor(
        private userService: UserService,
        public utilityService: UtilityService,
        public modalService: CustomModalService,
        private info_service: PeriodicalVariableAllowanceService,) {
    }

    ngOnInit(): void {
        this.get();
        this.openModal();
    }

    openModal() {
        this.modalService.open(this.modal, "sm");
    }

    list: any = [];
    get() {
        this.info_service.getPendingPrincipleAmountInfos(this.id).subscribe(response => {
            this.list = response.body
        });
    }
    closeModal(reason: any) {

        this.modalService.service.dismissAll(reason);
        this.closeModalEvent.emit(reason);

    }

}