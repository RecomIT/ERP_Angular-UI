import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { BsDatepickerConfig } from "ngx-bootstrap/datepicker";
import { AreasHttpService } from "src/app/areas/areas.http.service";
import { ApiArea, ApiController } from "src/app/shared/constants";
import { CustomModalService } from "src/app/shared/services/custom-modal.service";
import { UtilityService } from "src/app/shared/services/utility.service";
import { EmployeeDocumentService } from "../employee-document.service";

@Component({
    selector: 'app-employee-module-document-insert-update-modal',
    templateUrl: './employee-document-insert-update-modal.component.html'
})

export class EmployeeDocumentInsertUpdateModalComponent implements OnInit {

    @Input() document: any = { employeeId: 0, id: 0 }
    @Output() closeModalEvent = new EventEmitter<string>();

    @ViewChild('documentModal', { static: true }) documentModal!: ElementRef;
    modalTitle: string = "Add New Document";

    datePickerConfig: Partial<BsDatepickerConfig> = {};

    constructor(
        private fb: FormBuilder,
        private employeeDocumentService: EmployeeDocumentService,
        public utilityService: UtilityService,
        public modalService: CustomModalService) {

    }
    ngOnInit(): void {
        this.modalTitle = this.document.id > 0 ? "Update Document" : "Add New Document";
        this.datePickerConfig = Object.assign({}, {
            containerClass: "theme-dark-blue",
            showWeekNumbers: false,
            dateInputFormat: "DD-MMM-YYYY",
            isAnimated: true,
            showClearButton: false,
            showTodayButton: false,
            todayPosition: "left"
        });

        this.documentFormInit();
        this.modalService.open(this.documentModal, "lg");

        if (this.document.id > 0) {
            this.getEmployeeDocumentById()
        }
    }

    logger(msg: any, options: any) {
        this.utilityService.consoleLog(msg, options);
    }

    documentForm: FormGroup;

    documents: any = ["Birth Certificate", "NID", "Passport", "TIN","Driving License"]

    documentFormInit() {
        this.documentForm = this.fb.group({
            documentId: new FormControl(this.document?.id ?? 0),
            employeeId: new FormControl(this.document.employeeId),
            documentName: new FormControl('', [Validators.required]),
            documentNumber: new FormControl('', [Validators.required]),
            filePath: new FormControl(''),
            file: new FormControl(null, [Validators.required])
        })

        if (this.document?.id > 0) {
            this.documentForm.get('file').clearValidators();
            let filePath= this.documentForm.get('filePath').value;
            if(filePath != null && filePath !="" && filePath != undefined){
                this.documentForm.get('filePath').setValidators([Validators.required])
            }
        }
    }

    employeeDocument: any = null;

    setFormValues() {
        this.documentForm.get('documentId').setValue(this.employeeDocument.documentId);
        this.documentForm.get('employeeId').setValue(this.employeeDocument.employeeId);
        this.documentForm.get('documentName').setValue(this.employeeDocument.documentName);
        this.documentForm.get('documentNumber').setValue(this.employeeDocument.documentNumber);
        this.documentForm.get('filePath').setValue(this.employeeDocument.filePath??"");
    }

    submitForm() {
        if (this.documentForm.valid) {
            let formData = new FormData();
            formData.append("DocumentId", this.document.id.toString());
            formData.append("EmployeeId", this.document.employeeId.toString());
            formData.append("DocumentName", this.documentForm.get('documentName').value);
            formData.append("DocumentNumber", this.documentForm.get('documentNumber').value);
            formData.append("File", this.documentForm.get('file').value);
            formData.append("FilePath", this.documentForm.get('filePath').value);

            this.employeeDocumentService.save(formData).subscribe(response => {
                if (response?.status) {
                    this.utilityService.toastr.success(response?.msg, "Server Response");
                    this.modalService.service.dismissAll();
                    this.closeModal('Save Complete')
                }
                else {
                    this.utilityService.toastr.error(response?.msg, "Server Response");
                }
            }, (error) => {
                console.log("error >>>", error);
                this.utilityService.fail('Something went wrong', "Server Response");
            })
        }
        else {
            this.utilityService.fail("Invalid Form Submission", "Site Response");
        }
    }

    uploadFileName: string = "Choose Your PDF/JPG/PNG file";
    fileUpload(file: any) {
        this.logger("file", file);
        const selectedFile = (file.target as HTMLInputElement).files[0];
        this.logger("selectedFile", selectedFile);
        if (selectedFile != null
            && selectedFile != undefined
            && (this.utilityService.fileExtension(selectedFile.name) == 'pdf'
                || this.utilityService.fileExtension(selectedFile.name) == 'jpg'
                || this.utilityService.fileExtension(selectedFile.name) == 'png')) {
            this.uploadFileName = selectedFile.name;
            this.documentForm.get('file').setValue(selectedFile);
        }
        else {
            this.uploadFileName = "Choose Your PDF/JPG/PNG file";
        }
    }

    getEmployeeDocumentById() {

        this.employeeDocumentService.getById({ id: this.document.id, employeeId: this.document.employeeId }).subscribe(response => {
            this.employeeDocument = response.body;
            this.setFormValues();
        }, (error) => {
            console.log("error >>>", error);
            this.utilityService.fail('Something went wrong', 'Server Response');
        })
    }

    closeModal(reason: string) {
        this.modalService.service.dismissAll(reason);
        this.closeModalEvent.emit(reason); // fair
    }
}