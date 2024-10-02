import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from "@angular/core";
import { SalaryReviewService } from "../salary-review.service";
import { CustomModalService } from "src/app/shared/services/custom-modal.service";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { UtilityService } from "src/app/shared/services/utility.service";

@Component({
    selector:'app-salary-review-flat-amount-uploader-modal',
    templateUrl:'./flat-amount-uploader-modal.component.html'

})

export class FlatAmountUploaderModalComponent implements OnInit{

    @ViewChild('flatSalaryAmountUploaderModal', { static: true }) flatSalaryAmountUploaderModal!: ElementRef;
    
    @Output() closeModalEvent = new EventEmitter<string>();
    modalTitle: string = "";

    constructor(
        private fb: FormBuilder,
        private utilityService: UtilityService,
        private SalaryReviewService: SalaryReviewService,
        private modalService : CustomModalService
    ) {
    }

    ngOnInit(): void {
        this.formInit();
    }

    form: FormGroup;

    formInit() {
        this.form = this.fb.group({
            file: new FormControl()
        })

        this.openModal();
    }

    openModal(){
        this.modalService.open(this.flatSalaryAmountUploaderModal,"sm");
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
    btnSubmit: boolean = false;
    submit() {
        if (this.form.valid) {
            this.btnSubmit= true;
            const formData = new FormData();
            formData.append("file", this.form.get('file').value);
            this.SalaryReviewService.flatAmountUploader(formData).subscribe(response=>{
                this.btnSubmit = false;
                console.log("response >>>", response);
                if(response.status){
                    this.utilityService.success(response.msg,"Server Response");
                    this.closeModal(this.utilityService.SuccessfullySaved);
                }
            },(error)=>{
                this.btnSubmit = false;
                this.utilityService.httpErrorHandler(error);
            })
        }
        else {
            this.utilityService.fail("Invalid Form Submission", "Site Response");
        }
    }

    downloadSalaryReviewFlatAmountFile() {
        let params= { fileName: "UploadFlatSalaryReview.xlsx" };
        this.SalaryReviewService.downloadSalaryReviewFlatAmountFile(params).subscribe((response: any) => {
          //console.log("file response >>>", response);
          if (response.size > 0) {
            var blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = 'UploadFlatSalaryReview.xlsx';
            link.click();
    
          }
          else {
            this.utilityService.warning("No Excel File found");
          }
        }, (error) => {
          this.utilityService.fail("Something went wrong", "Server Response")
    
        })
      }


}