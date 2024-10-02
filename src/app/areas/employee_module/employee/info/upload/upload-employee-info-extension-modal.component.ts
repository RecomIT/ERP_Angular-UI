import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { UtilityService } from "src/app/shared/services/utility.service";
import { EmployeeInfoService } from "../../employee-info.service";
import { CustomModalService } from "src/app/shared/services/custom-modal.service";
import { AreasHttpService } from "src/app/areas/areas.http.service";
import { WebFileService } from "src/app/areas/common-services/web-file.service";
import { TableConfigService } from "src/app/areas/common-services/table-config.service";


@Component({
    selector: 'employee-module-upload-employee-info-extension-modal',
    templateUrl: './upload-employee-info-extension-modal.component.html'
})

export class UploadEmployeeInfoExtensionModalComponent implements OnInit {

    @ViewChild('uploadEmployeeInfoModal', { static: true }) uploadEmployeeInfoModal!: ElementRef;

    @Output() closeModalEvent = new EventEmitter<string>();
    modalTitle: string = "";

    constructor(
        private fb: FormBuilder,
        private utilityService: UtilityService,
        private employeeInfoService: EmployeeInfoService,
        private modalService: CustomModalService,
        private areasHttpService: AreasHttpService,
        private webFileService: WebFileService,
        private tableConfigService: TableConfigService,
    ) {
    }

    ngOnInit(): void {
        this.formInit();
        this.openModal();
        this.getColumns();
    }

    form: FormGroup;
    formArray: any;

    formInit() {
        this.form = this.fb.group({
            file: new FormControl(),
            isCheckedAll: new FormControl(true),
            file2: new FormControl(),
            columns: this.fb.array([])
        })
        this.formArray = (<FormArray>this.form.get('columns')).controls;

    }

    formatForm: FormGroup;


    addColumns() {
        this.columns.forEach((item, index) => {
            let display = (item?.label ?? "") == "" ? (item?.column) : item?.label;
            this.formArray.push(this.fb.group({
                displayName: new FormControl(display),
                isChecked: new FormControl(true),
                isDisabled: new FormControl(item?.isDisabled),
                isRequired: new FormControl(item?.isMandatory),
                parent: new FormControl(item?.parent),
            }))
        })
    }

    item_Checked(event: any) {
        let checkedItems = 0;
        this.formArray.forEach((fg) => {
            if (fg instanceof FormGroup) {
                let formGroup = fg as FormGroup;
                let formControlValue = formGroup.get('isChecked').value;
                if (formControlValue) {
                    checkedItems = checkedItems + 1;
                }
            }
        });

        const formArrayLength = (this.formArray as FormArray).length;
        if (checkedItems == formArrayLength) {
            this.form.get('isCheckedAll').setValue(true);
        }
        else {
            this.form.get('isCheckedAll').setValue(false);
        }
    }

    checkAll(event: any) {
        let isChecked = event.target.checked;
        this.formArray.forEach((fg) => {
            if (fg instanceof FormGroup) {
                let formGroup = fg as FormGroup;
                if (formGroup.get('isDisabled').value == false) {
                    formGroup.get('isChecked').setValue(isChecked);
                }
            }
        })
    }

    openModal() {

        this.modalService.open(this.uploadEmployeeInfoModal, "xl");
    }

    columns: any = null
    getColumns() {
        this.tableConfigService.getColumns({ table: "Employee Uploader", purpose: "Upload" }).subscribe({
            next: (response) => {
                this.columns = response;
                this.addColumns();
            },
            error: (error) => {
                console.log("error >>>", error)
            }
        })
    }

    closeModal(reason: string) {
        if (this.btnSave == false) {
            this.modalService.service.dismissAll(reason);
            this.closeModalEvent.emit(reason);
        }
    }

    btnSubmit: boolean = false;

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


    excelFileName2: string = "Choose Your excel file";
    excelFileUpload2(file: any) {
        const selectedFile = (file.target as HTMLInputElement).files[0];
        if (selectedFile != null && selectedFile != undefined && (this.utilityService.fileExtension(selectedFile.name) == 'xls' || this.utilityService.fileExtension(selectedFile.name) == 'xlsx')) {
            this.excelFileName2 = selectedFile.name;
            this.form.get('file2').setValue(selectedFile);
        }
        else {
            this.excelFileName2 = "Choose Your excel file";
        }
    }

    submit() {
        if (this.form.valid) {
            if (this.btnSubmit == false) {
                this.btnSubmit = true;
                const formData = new FormData();
                formData.append("file", this.form.get('file').value);
                this.employeeInfoService.upload(formData).subscribe({
                    next: (response: any) => {
                        this.utilityService.success("Data has been saved successfully", "Server Response", 3000)
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

    downloadEmployeeInfoExcelFile() {
        let fileName = "EmployeeDataUploader_Format.xlsx";
        let params = { fileName: fileName };
        this.webFileService.downloadFormatExcelFile(params).subscribe(
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

    downloadExcel() {
        let columns = [];
        this.formArray.forEach((fg) => {
            if (fg instanceof FormGroup) {
                let formGroup = fg as FormGroup;
                if (formGroup.get('isChecked').value == true) {
                    columns.push(formGroup.get('displayName').value)
                }
            }
        })
        this.tableConfigService.downloadUploader(columns).subscribe({
            next: (response) => {
                console.log("response >>>", response);
                if (response instanceof Blob) {
                    if (response.size > 0) {
                        this.utilityService.downloadFile(response, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', "EmployeeDataUploader_Format.xlsx")
                    }
                }
                else {
                    this.utilityService.fail('No data available for report generation', "Server Response");
                }
            },
            error: (error) => {

            }
        })
    }

    list_of_data: any[] = [];
    list_of_column: any[] = [];
    sever_main_object: any;
    new_employee_count: number = 0;
    old_employee_count: number = 0;
    invalid_employee_count: number = 0;
    valid_employee_count: number = 0;
    btnReadExcel: boolean = false;
    uploadExcel() {
        let excelFile = this.form.get('file2').value;
        if (this.btnReadExcel == false) {
            if (excelFile != null && excelFile != null) {
                this.btnReadExcel = true;
                this.new_employee_count = 0;
                this.old_employee_count = 0;
                const formData = new FormData();
                formData.append("file", this.form.get('file2').value);
                this.employeeInfoService.readExcel(formData).subscribe({
                    next: (response: any) => {
                        this.btnReadExcel = false;
                        this.sever_main_object = response;
                        this.list_of_column = response?.columns
                        this.list_of_data = response?.collections
                        if (this.list_of_data != null && this.list_of_data.length > 0) {
                            this.old_employee_count = this.list_of_data.filter(item => item.id > 0).length;
                            this.new_employee_count = this.list_of_data.filter(item => item.id == 0).length;
                            this.invalid_employee_count = this.list_of_data.filter(item => item?.isValid == false).length;
                            this.valid_employee_count = this.list_of_data.filter(item => item?.isValid == true).length;
                        }
                    },
                    error: (error: any) => {
                        this.btnReadExcel = false;
                        this.utilityService.httpErrorHandler(error);
                    }
                })
            }
            else {
                this.utilityService.fail("Excel file not found", "Site Response");
            }
        }
    }

    delete(index: number) {
        console.log("index >>>", index);
        if (this.list_of_data != null && this.list_of_data.length > 0) {
            this.list_of_data.splice(index, 1);
        }
    }

    btnSave: boolean = false;
    save() {
        if (this.btnSave == false) {
            if (this.check_row_validatity()) {
                this.btnSave = true;
                let items = [];
                this.list_of_data.forEach((row, index) => {
                    if (row.isValid == true) {
                        items.push(row);
                    }
                })
                if (items.length > 0) {
                    this.employeeInfoService.saveExcelData(items).subscribe({
                        next: (response) => {
                            this.list_of_data = [];
                            this.list_of_column = [];
                            this.btnSave = false;
                            this.utilityService.success(this.utilityService.SuccessfullySaved, "Server Response");
                        },
                        error: (error) => {
                            this.btnSave = false;
                            this.utilityService.fail(this.utilityService.SomethingWentWrong, "Server Response");
                            this.utilityService.httpErrorHandler(error);
                        }
                    })
                }
                else {
                    this.btnSave = false;
                }
            }
            else {
            }
        }
    }

    check_row_validatity() {
        let isValid = true;
        let msg = "";
        let rows = (this.list_of_data == null || this.list_of_data.length == 0) ? 0 : this.list_of_data.length;
        let invalidRows = 0;
        if (this.list_of_data == null || this.list_of_data.length == 0) {
            msg = "No row(s) found.";
            isValid = false;
        }
        else {
            this.list_of_data.forEach((row, index) => {
                if (row.isValid == false) {
                    invalidRows = invalidRows + 1;
                }
            })
        }

        if (rows == invalidRows) {
            isValid = false;
            msg = msg + "There is no valid row(s) to process Save operation.";
        }

        if (isValid == false) {
            this.utilityService.fail(msg, "Site");
        }
        return isValid;
    }

}