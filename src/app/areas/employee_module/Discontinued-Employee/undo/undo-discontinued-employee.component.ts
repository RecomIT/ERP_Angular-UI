import { transition, trigger, useAnimation } from "@angular/animations";
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { bounceIn, fadeIn, fadeInRight, slideInUp } from "ng-animate";
import { CustomModalService } from "src/app/shared/services/custom-modal.service";
import { UtilityService } from "src/app/shared/services/utility.service";
import { DiscontinuedEmployeeService } from "../discontinued-employee.service";
@Component({
    selector: 'employee-module-undo-discontinued-employee',
    templateUrl: './undo-discontinued-employee.component.html',
    animations: [
        trigger('slideInUp', [transition('* => *', useAnimation(slideInUp, { params: { timing: 0.5 } }))]),
        trigger('fadeIn', [transition('void => *', useAnimation(fadeIn, { params: { timing: 0.3 } }))]),
        trigger('fadeInRight', [transition('void => *', useAnimation(fadeInRight, { params: { timing: 0.5 } }))]),
        trigger('bounceIn', [transition('void => *', useAnimation(bounceIn, { params: { timing: 1 } }))]),
    ]
})

export class UndoDiscontinuedEmployeeModalComponent implements OnInit {
    @Input() item: any;
    @Output() closeModalEvent = new EventEmitter<string>();

    @ViewChild('deleteModal', { static: true }) modal!: ElementRef;
    modalTitle: string = "Undo Employee Discontinuation";

    constructor(
        private modalService: CustomModalService,
        private utilityService: UtilityService,
        private discontinuedEmployeeService: DiscontinuedEmployeeService,
    ) { }


    ngOnInit(): void {
        console.log("Discontinuation item >>>", this.item);
        this.openModal();
    }

    openModal() {
        this.modalService.open(this.modal, 'sm');
    }

    confirm() {
        this.discontinuedEmployeeService.delete({ discontinuedId: this.item.discontinuedId.toString(), employeeId: this.item.employeeId.toString() }).subscribe(response => {
            if (response?.status) {
                this.utilityService.success(response?.msg, "Server Response")
                this.closeModal('Successful');
            }
            else {
                this.utilityService.fail(response?.msg, "Server Response")
            }
        });
    }

    closeModal(reason: any) {
        this.modalService.service.dismissAll(reason);
        this.closeModalEvent.emit(reason);
    }

}