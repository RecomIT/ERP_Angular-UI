import { Component, Input, OnInit } from "@angular/core";
import { ApiArea, ApiController } from "src/app/shared/constants";
import { CustomModalService } from "src/app/shared/services/custom-modal.service";
import { UtilityService } from "src/app/shared/services/utility.service";
import { AreasHttpService } from "../../../../areas.http.service";
import { EmployeeDocumentService } from "../employee-document.service";

@Component({
    selector: 'app-employee-module-personal-document',
    templateUrl: './personal-document.component.html'
})

export class PersonalDocumentComponent implements OnInit {
    @Input() employeeId: number = 0;
    constructor(private utilityService: UtilityService, public modalService: CustomModalService, private areasHttpService: AreasHttpService,private employeeDocumentService : EmployeeDocumentService) { }

    ngOnInit(): void {
        this.getPersonalDocuments();
    }
    documents: any[];

    getPersonalDocuments() {
        this.employeeDocumentService.get({ employeeId: this.employeeId }).subscribe(response =>{
            this.documents = response.body;
        },(error)=>{
            this.utilityService.httpErrorHandler(error);
        })
    }

    modalObj: any = null;
    showInsertUpdateModal: boolean = false;
    openModal(id: number) {
        this.modalObj = { employeeId: this.employeeId, id: id };
        this.showInsertUpdateModal = true;
    }

    closeModal(reason: string) {
        this.showInsertUpdateModal = false;
        this.modalObj = null;
        if (reason == 'Save Complete') {
            this.getPersonalDocuments();
        }
    }

    showFile(path: string) {
        if (path != null && path != '') {
            this.areasHttpService.observable_get((ApiController.ApiBase + "/GetDocument"), {
                responseType: 'blob',
                params: { path: path }
            }).subscribe((response: any) => {
                if (response.size > 64) {
                    var blob = new Blob([response], { type: response.type });
                    let pdfUrl = window.URL.createObjectURL(blob);

                    var PDF_link = document.createElement('a');
                    PDF_link.href = pdfUrl;
                    window.open(pdfUrl, '_blank');
                }
                else {
                    this.utilityService.warning("No file found")
                }
            }, (error) => {
                this.utilityService.fail("Something went wrong", "Server Response")
            })
        }
        else {
            this.utilityService.fail("File path is not found.")
        }
    }

}