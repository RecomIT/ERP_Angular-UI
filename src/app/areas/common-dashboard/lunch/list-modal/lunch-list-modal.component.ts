import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { LunchService } from "../lunch-request-service";
import { error } from "console";
import { CustomModalService } from "src/app/shared/services/custom-modal.service";
import { DatePipe } from "@angular/common";
@Component({
    selector: 'app-lunch-list-modal',
    templateUrl: './lunch-list-modal.component.html'
})

export class LunchListModalComponent implements OnInit {

    @Input() date: any;
    @ViewChild('modal', { static: true }) modal!: ElementRef;
    @Output() closeModalEvent = new EventEmitter();

    constructor(
        private service: LunchService,
        private modalService: CustomModalService,
        private datePipe: DatePipe
    ) {

    }

    ngOnInit(): void {
        this.get();
    }

    get() {
        this.service.GetLunchDetails(this.datePipe.transform(this.date,"yyyy-MM-dd")).subscribe({
            next: (response) => {
                console.log("response >>>", response);
            },
            error: (error) => {

            }
        })
    }

    closeModal(reason: any) {
        this.closeModalEvent.emit(reason);
        this.modalService.service.dismissAll();
    }

}