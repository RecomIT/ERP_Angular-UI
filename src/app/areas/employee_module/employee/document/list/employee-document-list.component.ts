import { Component, Input, OnInit } from "@angular/core";
import { BsDatepickerConfig } from "ngx-bootstrap/datepicker";
import { CustomModalService } from "src/app/shared/services/custom-modal.service";
import { UtilityService } from "src/app/shared/services/utility.service";
import { EmployeeDocumentService } from "../employee-document.service";

@Component({
    selector: 'app-employee-module-employee-document-list',
    templateUrl: './employee-document-list.component.html'
})


export class EmployeeDocumentListComponent implements OnInit {
    @Input() inputEmployeeId: any = 0;
    employeeId: number = 0;

    constructor(private employeeDocumentService: EmployeeDocumentService,
        public utilityService: UtilityService,
        public modalService: CustomModalService) { }

    datePickerConfig: Partial<BsDatepickerConfig> = {};
    ngOnInit(): void {
        this.employeeId = this.inputEmployeeId;
        this.datePickerConfig = Object.assign({}, {
            containerClass: "theme-dark-blue",
            showWeekNumbers: false,
            dateInputFormat: "DD-MMM-YYYY",
            isAnimated: true,
            showClearButton: false,
            showTodayButton: false,
            todayPosition: "left"
        });
        this.getEmployeeDocuments();
    }

    listOfEmployeeDocument: any[] = null;

    getEmployeeDocuments() {
        this.employeeDocumentService.get({employeeId: this.employeeId}).subscribe(response=>{
            this.listOfEmployeeDocument = response.body;
        },(error)=>{
            console.log("error >>>", error);
            this.utilityService.fail("Something went wrong", "Server Response")
        })
    }

    modalObj: any = null;
    showInsertUpdateModal: boolean = false;
    openModal(id: number) {
        this.modalObj = { employeeId: this.inputEmployeeId, id: id };
        this.showInsertUpdateModal = true;
    }

    closeModal(reason: string) {
        this.showInsertUpdateModal = false;
        this.modalObj = null;
        if (reason == 'Save Complete') {
            this.getEmployeeDocuments();
        }
    }

    showFile(path: string) {
        if (path != null && path != '') {
            this.employeeDocumentService.getFile({path:path}).subscribe(file=>{
                if (file.size > 64) {
                    var blob = new Blob([file], { type: file.type });
                    let pdfUrl = window.URL.createObjectURL(blob);

                    var PDF_link = document.createElement('a');
                    PDF_link.href = pdfUrl;
                    window.open(pdfUrl, '_blank');
                }
                else {
                    this.utilityService.warning("No file found")
                }
            },error=>{
                console.log("error >>>", error);
                this.utilityService.warning("Something went wrong")
            })
        }
        else {
            this.utilityService.fail("Invalid paramter for file retrieving")
        }
    }

}