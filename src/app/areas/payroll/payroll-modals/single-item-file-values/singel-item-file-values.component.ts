import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { UtilityService } from "src/app/shared/services/utility.service";
import { WebFileService } from "../../../common-services/web-file.service";
import { isArray } from "ngx-bootstrap/chronos";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
@Component({
    selector: 'app-payroll-singel-item-file-values',
    templateUrl: './singel-item-file-values.component.html'
})

export class SingelItemFileValueComponent implements OnInit {
    @Input() key: string;
    @ViewChild('uploadExcelModal', { static: true }) uploadExcelModal;
  
    @Output() closeModalEvent = new EventEmitter<any>();
    private modalRef: NgbModalRef;

    constructor(
        private modalService: NgbModal,
        private utilityService: UtilityService,
        private fb: FormBuilder,
        private fileService: WebFileService
    ) {

    }
    ngOnInit(): void {
        this.openModal();
    }

    openModal() {
        this.formInit();
        this.modalRef=this.modalService.open(this.uploadExcelModal, {size:"sm"});
    }

    closeModal(data: any) {
        this.modalRef.close();
        this.closeModalEvent.emit([{}]);
    }

    passData(data: any) {
        this.modalRef.close();
        this.closeModalEvent.emit(data);
    }

    form: FormGroup;
    formInit() {
        this.form = this.fb.group({
            key: new FormControl(this.key, [Validators.required]),
            file: new FormControl()
        })
    }

    excelFileName: string = "Choose Your excel file";
    excelFileUpload(file: any) {
        const selectedFile = (file.target as HTMLInputElement).files[0];
        if (selectedFile != null && selectedFile != undefined && (this.utilityService.fileExtension(selectedFile.name) == 'xls' || this.utilityService.fileExtension(selectedFile.name) == 'xlsx')) {
            this.excelFileName = selectedFile.name;
            this.form.get('file').setValue(selectedFile);
        }
        else {
            this.excelFileName = "Choose Your excel file";
        }
    }


    downloadFormat() {
        let fileName = "AddDataList.xlsx";
        let params = { fileName: fileName };
        this.fileService.downloadFormatExcelFile(params).subscribe(
            {
                next: (response) => {
                    if (response.size > 0) {
                        this.utilityService.downloadFile(response, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', fileName)
                    }
                },
                error: (error) => {
                }
            }
        );
    }

    btnSubmit: boolean = false;
    submit() {
        if (this.form.valid && !this.btnSubmit) {
            this.btnSubmit = true;
            this.fileService.getFileValues(this.form.get('file').value, this.key).subscribe({
                next: (response: any) => {
                    if (isArray(response)) {
                        if (response.length > 0) {
                            this.passData(response);
                        }
                    }
                    this.btnSubmit = false;
                },
                error: (error: any) => {
                    this.utilityService.httpErrorHandler(error);
                    this.btnSubmit = false;
                }
            })
        }
        else {
            this.utilityService.fail("Invalid Form Submission", "Site Response");
        }
    }

}