import { UtilityService } from "src/app/shared/services/utility.service";
import { ContractualEmployeeService } from "../contractual-employee.service";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { CustomModalService } from "src/app/shared/services/custom-modal.service";
import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from "@angular/core";

@Component({
    selector: 'employee-module-upload-contract-info-modal',
    templateUrl: './upload-contract-info-modal.component.html'
})


export class UploadContractInfoModalComponent implements OnInit {

    @ViewChild('flatSalaryAmountUploaderModal', { static: true }) flatSalaryAmountUploaderModal!: ElementRef;
    @Output() closeModalEvent = new EventEmitter<string>();
    modalTitle: string = "";

    ngOnInit(): void {
        this.formInit();
    }

    constructor(private fb: FormBuilder,
        private utilityService: UtilityService,
        private contractualEmployeeService: ContractualEmployeeService,
        private modalService: CustomModalService) { }

    form: FormGroup;

    formInit() {
        this.form = this.fb.group({
            file: new FormControl(null, [Validators.required])
        })
        this.openModal();
    }

    openModal() {
        this.modalService.open(this.flatSalaryAmountUploaderModal, "sm");
    }

    closeModal(reason: string) {
        this.closeModalEvent.emit(reason);
        this.modalService.service.dismissAll(reason);
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

    download() {
        this.contractualEmployeeService.downloadFormat().subscribe(response => {
            if (response.size > 0) {
                this.utilityService.downloadFile(response, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', "contract-info-uploader.xlsx")
            }
            else {
                this.utilityService.warning("No Excel File found");
            }
        }, (error) => {
            this.utilityService.httpErrorHandler(error);
        })
    }

    btnSubmit: boolean = false;
    submit() {
        if (this.form.valid) {
            this.btnSubmit = true;
            const formData = new FormData();
            formData.append("file", this.form.get('file').value);
            this.contractualEmployeeService.upload(formData).subscribe(response => {
                this.btnSubmit = false;
                console.log("response >>>", response);
                if (response.status) {
                    this.utilityService.success(response.msg, "Server Response");
                    this.closeModal(this.utilityService.SuccessfullySaved);
                }
            }, (error) => {
                this.btnSubmit = false;
                this.utilityService.httpErrorHandler(error);
            })
        }
        else {
            this.utilityService.fail("Invalid Form Submission", "Site Response");
        }
    }

}

