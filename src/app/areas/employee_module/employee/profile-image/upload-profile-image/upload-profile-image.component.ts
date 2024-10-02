import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { CustomModalService } from "src/app/shared/services/custom-modal.service";
import { UtilityService } from "src/app/shared/services/utility.service";
import { EmployeeInfoService } from "../../employee-info.service";
import { SharedmethodService } from "src/app/shared/services/shared-method/sharedmethod.service";

@Component({
    selector: 'app-employee-module-upload-profile-image',
    templateUrl: './upload-profile-image.component.html'
})

export class UploadProfileImageComponent implements OnInit {
    @Input() data: any = { imagePath: '', gender: '', id: 0 };
    @Output() closeModalEvent = new EventEmitter<string>();

    @ViewChild('uploadProfileImageModal', { static: true }) uploadProfileImageModal!: ElementRef;

    constructor(private fb: FormBuilder, // strongly type form build
        public utilityService: UtilityService, // utility 
        public modalService: CustomModalService, // modal service 
        private employeeInfoService: EmployeeInfoService,
        private sharedmethodService: SharedmethodService
    ) { }

    uploadForm: FormGroup;
    imagePath: any;

    ngOnInit(): void {
        this.uploadFormInit();
    }

    logger(msg: any, options: any) {
        this.utilityService.consoleLog(msg, options);
    }

    uploadFormInit() {
        this.uploadForm = this.fb.group({
            employeeId: new FormControl(null),
            image: new FormControl(null, [Validators.required]),
            imagePath: new FormControl(this.data.imagePath)
        })
        this.modalService.open(this.uploadProfileImageModal, "sm");
        this.imagePath = (this.data.imagePath == '' || this.data.imagePath == null) ? 'assets/img/image_not_found.png' : this.data.imagePath;

        if (this.data?.id > 0 && this.data?.imagePath > '') {
            this.uploadForm.get('image').clearValidators();
            this.uploadForm.get('imagePath').setValidators([Validators.required])
        }
    }

    submitForm() {
        if (this.uploadForm.valid) {
            let formData = new FormData();
            formData.append("EmployeeId", this.data.id.toString());
            formData.append("ImagePath", this.uploadForm.get('imagePath').value);
            formData.append("Image", this.uploadForm.get('image').value);

            this.employeeInfoService.uploadProfilePic(formData).subscribe(response=>{
                if (response?.status) {
                    this.utilityService.toastr.success(response?.msg, "Server Response");
                    this.sharedmethodService.callMethod();
                    this.modalService.service.dismissAll();
                    this.closeModal('Save Complete')
                }
                else {
                    this.utilityService.toastr.error(response?.msg, "Server Response");
                }
            },(error)=>{
                this.utilityService.httpErrorHandler(error);
            })
        }
        else {
            this.utilityService.fail("Invalid Form Submission", "Site Response");
        }
    }

    uploadFileName: string = "Choose Your Image file";
    fileUpload(file: any) {
        this.logger("file", file);
        const selectedFile = (file.target as HTMLInputElement).files[0];
        this.logger("selectedFile", selectedFile);
        if (selectedFile != null
            && selectedFile != undefined
            && (this.utilityService.fileExtension(selectedFile.name).toLowerCase() == 'jpg'
            || this.utilityService.fileExtension(selectedFile.name).toLowerCase() == 'jpeg'
                || this.utilityService.fileExtension(selectedFile.name).toLowerCase() == 'png')) {
            const reader = new FileReader();
            reader.onload = () => {
                this.imagePath = reader.result as string;
            }
            this.uploadFileName = selectedFile.name;
            this.uploadForm.get('image').setValue(selectedFile);
            reader.readAsDataURL(selectedFile)
        }
        else {
            this.uploadFileName = "Choose Your Image file";
        }
    }

    closeModal(reason: string) {
        this.modalService.service.dismissAll(reason);
        this.closeModalEvent.emit(reason); // fair
    }

}