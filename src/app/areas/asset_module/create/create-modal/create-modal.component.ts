import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, FormsModule, FormArray } from '@angular/forms';
import { CustomModalService } from 'src/app/shared/services/custom-modal.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { CreateSerive } from '../create.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { CategoryService } from '../../setting/category/category.service';
import { SubCategoryService } from '../../setting/category/sub-category-modal/subCategory.service';
import { BrandService } from '../../setting/category/brand-modal/brand.service';
import { StoreSerive } from '../../setting/store/store.service';
import { VendorSerive } from '../../setting/vendor/vendor.service';
import { DatePipe } from '@angular/common';
import { UserService } from 'src/app/shared/services/user.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';


@Component({
    selector: 'asset-module-create-modal',
    templateUrl: './create-modal.component.html'

})
export class CreateModalComponent implements OnInit {

    @Input() id: number = 0;
    @Input() approved: boolean = false;

    @Output() closeModalEvent = new EventEmitter<string>();
    @ViewChild('createModal', { static: true }) createModal!: ElementRef;
    @ViewChild('uploadModal', { static: true }) uploadModal!: ElementRef;
    @ViewChild('productDetailModal', { static: true }) productDetailModal!: ElementRef;

    modalTitle: string = "Add Asset";
    createForm: FormGroup;
    btnSubmit: boolean = false;
    server_errors: any;
    datePickerConfig: Partial<BsDatepickerConfig> = this.utilityService.datePickerConfig();
    select2Config: any = this.utilityService.select2Config();
    modalRef: NgbModalRef;
    isRowHidden: boolean = true;
    isProductEdit: boolean = true;

    constructor(
        private fb: FormBuilder,
        private utilityService: UtilityService,
        private userService: UserService,
        private createSerive: CreateSerive,
        private categoryService: CategoryService,
        private subCategoryService: SubCategoryService,
        private brandService: BrandService,
        private storeSerive: StoreSerive,
        private vendorSerive: VendorSerive,
        public modalService: CustomModalService,
        private modalService1: NgbModal
    ) { }

    ngOnInit(): void {
        this.formInit();
        this.openModal();
        this.loadCategoryDropdown();
        this.loadVendorDropdown();
        this.loadStoreDropdown();
        this.uploadFormInit();
        this.productDetailFormInit();
        this.loadFormat();

        console.log(this.approved);

        if (this.id > 0) {
            this.getById();
            this.modalTitle = this.id > 0 ? "Update Asset" : "Add New Asset";
        };

        this.createForm.get('transactionDate').valueChanges.subscribe(transactionDate => {
            if (transactionDate) {
                const futurDate = new Date(transactionDate);
                const todayDate = new Date();
                todayDate.setHours(0, 0, 0, 0);
                const numberOfDays = Math.abs(Math.ceil((futurDate.getTime() - todayDate.getTime()) / (1000 * 60 * 60 * 24)));
                this.createForm.get('durationDays').setValue(numberOfDays.toString());
            } else {
                this.createForm.get('durationDays').setValue('');
            }
        });

        this.createForm.get('quantity').valueChanges.subscribe(() => this.calculateTotalAmount());
        this.createForm.get('amount').valueChanges.subscribe(() => this.calculateTotalAmount());
    }


    logger(msg: any, options: any) {
        this.utilityService.consoleLog(msg, options);
    }

    User() {
        return this.userService.User();
    }

    select2Options = {
        width: "100%",
        containerCssClass: "form-control form-control-sm text-x-small",
        theme: "bootstrap4",
    }

    calculateTotalAmount() {
        const quantity = this.createForm.get('quantity').value;
        const amount = this.createForm.get('amount').value;

        const totalAmount = quantity && amount ? quantity * amount : null;
        this.createForm.patchValue({ totalAmount }, { emitEvent: false });
    }

    calculateDurationDays() {
        const transactionDate = this.createForm.get('transactionDate').value;
        console.log("transactionDate >>>", transactionDate);
        if (transactionDate) {
            const futureDate = new Date(transactionDate);
            futureDate.setHours(0, 0, 0, 0);
            const todayDate = new Date();
            todayDate.setHours(0, 0, 0, 0);
            const numberOfDays = Math.abs(Math.ceil((futureDate.getTime() - todayDate.getTime()) / (1000 * 60 * 60 * 24)));
            this.createForm.get('durationDays').setValue(numberOfDays.toString());
        } else {
            this.createForm.get('durationDays').setValue('');
        }

    };

    info: any;
    formInit() {
        this.createForm = this.fb.group({
            assetId: new FormControl(this.id),
            transactionDate: new FormControl(null, Validators.required),
            assetName: new FormControl(this.info?.assetName, [Validators.required, Validators.maxLength(100), Validators.minLength(2)]),
            vendorId: new FormControl(0, [Validators.min(1)]),
            storeId: new FormControl(0, [Validators.min(1)]),
            categoryId: new FormControl(0, [Validators.min(1)]),
            subCategoryId: new FormControl(0, [Validators.min(1)]),
            brandId: new FormControl(0, [Validators.min(1)]),
            depreciation: new FormControl(true),
            condition: new FormControl(true),
            itAccess: new FormControl(true),
            quantity: new FormControl(''),
            amount: new FormControl(''),
            totalAmount: new FormControl(0),
            durationDays: new FormControl(''),
            remarks: new FormControl(''),
            warrantyDate: new FormControl(),
            wDay: new FormControl(''),
            wMonth: new FormControl(''),
            wYear: new FormControl('')
    
        });

        this.createForm.get('categoryId').valueChanges.subscribe((item) => {
            this.loadSubCategoryDropdown(item);
        });

        this.createForm.get('subCategoryId').valueChanges.subscribe((item) => {
            this.loadBrandDropdown(item);
        });

    }

    load_value(value: any) {
        this.createForm.get('assetId').setValue(this.id);
        this.createForm.get('transactionDate').setValue(new Date(value.transactionDate));
        this.createForm.get('vendorId').setValue(value.vendorId);
        this.createForm.get('storeId').setValue(value.storeId);
        this.createForm.get('categoryId').setValue(value.categoryId);
        this.createForm.get('subCategoryId').setValue(value.subCategoryId);
        this.createForm.get('brandId').setValue(value.brandId);
        this.createForm.get('assetName').setValue(value.assetName);

        const datePipe = new DatePipe('en-US');
        const formattedWarrantyDate = datePipe.transform(value.warrantyDate, 'dd-MMM-yyyy');
        this.createForm.get('warrantyDate').setValue(formattedWarrantyDate);

        this.createForm.get('quantity').setValue(value.quantity);
        this.createForm.get('amount').setValue(value.amount);
        this.createForm.get('totalAmount').setValue(value.totalAmount);

        this.createForm.get('itAccess').setValue(value.itAccess);
        this.createForm.get('remarks').setValue(value.remarks);
        this.createForm.get('condition').setValue(value.condition);
        this.createForm.get('depreciation').setValue(value.depreciation);
    }


    openModal() {
        this.modalService.open(this.createModal, 'lg');
    }

    ddlCategory: any[] = [];
    loadCategoryDropdown() {
        this.categoryService.loadCategoryDropdown();
        this.categoryService.ddl$.subscribe(data => {
            this.ddlCategory = data;
        }, (error) => {
            console.log("error  while fetching data >>>", error);
        })
    }

    ddlSubCategory: any[] = [];
    loadSubCategoryDropdown(CategoryId: any) {
        this.subCategoryService.loadSubCategoryDropdown(CategoryId);
        this.subCategoryService.ddl$.subscribe(data => {
            this.ddlSubCategory = data;
        }, (error) => {
            console.log("error  while fetching data >>>", error);
        })
    }

    ddlBrand: any[] = [];
    loadBrandDropdown(SubCategoryId: any) {
        this.brandService.loadBrandDropdown(SubCategoryId);
        this.brandService.ddl$.subscribe(data => {
            this.ddlBrand = data;
        }, (error) => {
            console.log("error  while fetching data >>>", error);
        })
    }

    ddlVendor: any[] = [];
    loadVendorDropdown() {
        this.vendorSerive.loadVendorDropdown();
        this.vendorSerive.ddl$.subscribe(data => {
            this.ddlVendor = data;
        }, (error) => {
            console.log("error  while fetching data >>>", error);
        })
    }

    ddlStore: any[] = [];
    loadStoreDropdown() {
        this.storeSerive.loadStoreDropdown();
        this.storeSerive.ddl$.subscribe(data => {
            this.ddlStore = data;
        }, (error) => {
            console.log("error  while fetching data >>>", error);
        })
    }

    formErrors = {
        'assetName': ''
    }

    validationMessages = {
        'assetName': {
            'required': 'Field is required',
            'maxlength': 'Max length is 100',
            'minlength': 'Min length is 2'
        }
    }

    logFormErrors(formGroup: FormGroup = this.createForm) {
        Object.keys(formGroup.controls).forEach((key: string) => {
            const abstractControl = formGroup.get(key);
            this.formErrors[key] = '';
            if (abstractControl && !abstractControl.valid && (abstractControl.touched || abstractControl.dirty)) {
                const messages = this.validationMessages[key];
                for (const errorKey in abstractControl.errors) {
                    this.formErrors[key] += messages[errorKey];
                }
            }
        })
    }


    isEditClick: boolean = false;
    getById() {
        this.createSerive.getById({ assetId: this.id, approved: this.approved }).subscribe((response) => {
            //console.log("data >>>", response);            
            this.load_value(response);
            this.calculateDurationDays();
            this.getProductData();
            this.isRowHidden = false;
            this.isProductEdit = false;
            this.isEditClick = true;
        }, (error) => {
            this.utilityService.fail("Something went wrong", "Server Wrong");
        })

        //console.log("isProductEdit >>>", this.isProductEdit);  
    }

    submitAsset() {
        if (this.createForm.valid) {
            let data = this.createForm.value;
            data.warrantyDate = new Date(data.warrantyDate).toISOString();
            console.log("data >>>", data);        
            this.createSerive.save(data).subscribe((response) => {
                if (response.body.status) {
                    this.submitProduct();
                    this.sendEmail();
                    this.utilityService.success("The asset has been successfully submitted for approval", "Server Response");
                    this.closeModal(this.utilityService.SuccessfullySaved);
                }
                else {
                    if (response.body.msg == "Validation Error") {
                        this.server_errors = JSON.parse(response.body.errorMsg)
                    }
                    else {
                        this.utilityService.fail(response?.msg, "Server Response");
                    }
                }
            }, (error) => {
                console.log("error >>>", error);
                this.utilityService.fail("Something went wrong");
            })
        }
        else {
            this.utilityService.fail("Invalid Form Submission", "Site Response");
        }
    }

    checkProductValidation() {
        const assetId = this.createForm.get('assetId').value;
        const format = this.uploadForm.get('downloadFormat').value;
        const formatAdd = this.productDetailForm.get('downloadFormat').value; 

        this.list.forEach(item => {
            item.format = format;
            item.assetId = assetId;
        });

        var product: any = [];
        this.formArray.forEach((formGroup: FormGroup) => {
            // console.log("Product Group Validation>>>", formGroup.value);
            product.push({
                format: formatAdd, 
                productId: formGroup.get('productId')?.value,
                number: formGroup.get('number')?.value || null,
                imei1: formGroup.get('imei1')?.value || null,
                imei2: formGroup.get('imei2')?.value || null,
                pin: formGroup.get('pin')?.value || null,
                puk: formGroup.get('puk')?.value || null
            })
        });

        let dataToSend;
        if (this.list && this.list.length > 0) {
            dataToSend = this.list;
        } else {
            dataToSend = product;
        }

        // console.log("Product Group Validation>>>", dataToSend);

        this.createSerive.checkProductValidation(dataToSend).subscribe(
            response => {
                // console.log("response >>>", response);
                if (response?.status) {
                    this.closeAddProductModal();
                }
                else {
                    if (response?.status == false) {
                        this.server_errors = response?.msg;
                    }
                    else {
                        this.utilityService.fail(response?.msg, "Server Response");
                    }
                }
            },
            error => {
                console.log("error >>>", error);
                this.utilityService.fail("Error saving Excel file");
            }
        );
    }


    submitProduct() {
        let assetId = this.createForm.get('assetId').value;
        let format = this.uploadForm.get('downloadFormat').value;
        let formatAdd = this.productDetailForm.get('downloadFormat').value;
        let condition = this.createForm.get('condition').value;

        // console.log("condition>>>", cond);

        this.list.forEach(item => {
            item.format = format;
            item.assetId = assetId;
            item.condition = condition;
        });

        var product: any = [];
        this.formArray.forEach((formGroup: FormGroup) => {           
            product.push({
                format: formatAdd,
                condition: condition,
                productId: formGroup.get('productId')?.value,
                number: formGroup.get('number')?.value || null,
                imei1: formGroup.get('imei1')?.value || null,
                imei2: formGroup.get('imei2')?.value || null,
                pin: formGroup.get('pin')?.value || null,
                puk: formGroup.get('puk')?.value || null
            })
        });
 
        let dataToSend;
        if (this.list && this.list.length > 0) {
            dataToSend = this.list;
        } else {
            dataToSend = product;
        }

        // console.log("dataToSend>>>", dataToSend);

        this.createSerive.saveExcelFile(dataToSend).subscribe(
            response => {
                // console.log("response >>>", response);
                if (response?.status) {
                    this.closeAddProductModal();
                }
                else {
                    this.utilityService.fail(response?.msg, "Server Response");
                }
            },
            error => {
                console.log("error >>>", error);
                this.utilityService.fail("Error saving Excel file");
            }
        );
    }

    sendEmail() {
        this.createSerive.sendEmail().subscribe(response => {
            // console.log("response >>>", response);
            // if (response?.status) {
            //     this.utilityService.success("The asset has been successfully submitted for approval", "Server Response");
            //     this.closeModal(this.utilityService.SuccessfullySaved);
            // }
            // else {
            //     this.utilityService.fail(response?.msg, "Server Response");
            // }
        }, (error) => {
            console.log("error >>>", error);
        })
    }

    closeModal(reason: any) {
        this.closeModalEvent.emit(reason);
        this.modalService.service.dismissAll(reason);
    }

    onDayChange(event: Event): void {
        this.createForm.patchValue({
            wDay: (event.target as HTMLInputElement).value,
            wMonth: null,
            wYear: null,
        });

        const wDayValue = (event.target as HTMLInputElement).value;

        if (!wDayValue) {
            this.createForm.get('warrantyDate').setValue(null);
        } else {
            if (!isNaN(Number(wDayValue))) {
                // const currentDate = new Date();
                const transactionDate = this.createForm.get('transactionDate').value;          
                const currentDate = new Date(transactionDate);

                // currentDate.setDate(currentDate.getDate() + Number(wDayValue) + 1);
                currentDate.setDate(currentDate.getDate() + Number(wDayValue));

                const datePipe = new DatePipe('en-US');
                const formattedDate = datePipe.transform(currentDate, 'dd-MMM-yyyy');

                this.createForm.patchValue({
                    warrantyDate: formattedDate
                });
            }
        }
    }

    onMonthChange(event: Event): void {
        this.createForm.patchValue({
            wMonth: (event.target as HTMLInputElement).value,
            wDay: null,
            wYear: null,
        });

        const wMonthValue = (event.target as HTMLInputElement).value;

        if (!wMonthValue) {
            this.createForm.get('warrantyDate').setValue(null);
        } else {
            if (!isNaN(Number(wMonthValue))) {
                // const currentDate = new Date();
                const transactionDate = this.createForm.get('transactionDate').value;          
                const currentDate = new Date(transactionDate);

                currentDate.setMonth(currentDate.getMonth() + Number(wMonthValue));

                const datePipe = new DatePipe('en-US');
                const formattedDate = datePipe.transform(currentDate, 'dd-MMM-yyyy');

                this.createForm.patchValue({
                    warrantyDate: formattedDate
                });
            }
        }
    }

    onYearChange(event: Event): void {
        this.createForm.patchValue({
            wYear: (event.target as HTMLInputElement).value,
            wMonth: null,
            wDay: null,
        });

        const wYearValue = (event.target as HTMLInputElement).value;

        if (!wYearValue) {
            this.createForm.get('warrantyDate').setValue(null);
        } else {
            if (!isNaN(Number(wYearValue))) {
                // const currentDate = new Date();
                const transactionDate = this.createForm.get('transactionDate').value;          
                const currentDate = new Date(transactionDate);
                currentDate.setFullYear(currentDate.getFullYear() + Number(wYearValue));

                const datePipe = new DatePipe('en-US');
                const formattedDate = datePipe.transform(currentDate, 'dd-MMM-yyyy');

                this.createForm.patchValue({
                    warrantyDate: formattedDate
                });
            }
        }


        
    }


    openUploadModal() {
        this.modalRef = this.modalService1.open(this.uploadModal, {backdrop: 'static', size: 'lg' }); 
        this.excelFileName = "Choose Your excel file";
        this.server_errors = null;
        this.isRowHidden = true;
        this.uploadFormInit();
    }

    closeUploadModal() {
        if (this.modalRef) {
            this.modalRef.dismiss('Close click');
            // this.createForm.patchValue({
            //     quantity: 0
            // });
            this.createForm.get('quantity').reset(null);
        }
    }

    uploadForm: FormGroup;
    uploadFormInit() {
        this.uploadForm = this.fb.group({
            downloadFormat: new FormControl('')
        });

        this.uploadForm.get('downloadFormat').valueChanges.subscribe((item) => {
            this.list = [];
            this.excelFileName = "Choose Your excel file";
        });
    }

    load_UploadForm(value: any) {
        //console.log("value ", value);
        this.uploadForm.get('downloadFormat').setValue(value[0].format);
    }


    ddlFormat: string[] = [];
    loadFormat() {
        this.ddlFormat = ['Serial', 'SIM', 'Phone', 'Product ID'];
    }

    downloadExcelFile(fileName: any) {
        //console.log("fileName >>>", fileName);
        let params = { fileName: fileName + ".xlsx" };
        this.createSerive.downloadExcelFile(params).subscribe((response: any) => {
            if (response.size > 0) {
                var blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                const link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.download = fileName + ".xlsx";
                link.click();

            }
            else {
                this.utilityService.warning("No Excel File found");
            }
        }, (error) => {
            this.utilityService.fail("Something went wrong", "Server Response")

        })
    }


    list: any[] = [];
    UploadExcelFile() {
        if (this.excelFile != null) {
            var formData = new FormData();
            this.list = [];

            const specifiedFormat = this.uploadForm.get('downloadFormat').value;
            const selectFileName = this.excelFile.name;
            const fileName = selectFileName.split('.').slice(0, -1).join('.');
            if (fileName !== specifiedFormat) {
                this.utilityService.fail("Downloaded file doesn't match the selected file", 'Upload Error');
                return;
            }

            formData.append('File', this.excelFile);
            formData.append('Format', this.uploadForm.get('downloadFormat').value);
            this.createSerive.uploadExcelFile(formData)
                .subscribe(response => {
                    console.log("data >>>", response);                 
                    this.list = response;

                    const quantityInput = document.getElementById('quantity') as HTMLInputElement;
                    if (quantityInput) {
                        quantityInput.value = this.list.length.toString();
                        quantityInput.dispatchEvent(new Event('input'));
                    }

                    this.isRowHidden = false;

                }, (error) => {
                    console.log("error >>>", error);
                    this.utilityService.fail("Something went wrong", "Server Response");
                })
        }
        else {
            this.utilityService.fail("Invalid Form", 'Site Response');
        }

    }

    fileExtension(fileName: string) {
        var name = fileName.split('.')
        return name[1].toString();
    }

    excelFileName: string = "Choose Your excel file";
    excelFile: any = null;
    excelFileUpload(file: any) {
        this.excelFile = null;
        const selectedFile = (file.target as HTMLInputElement).files[0];
        if (selectedFile != null && selectedFile != undefined && (this.fileExtension(selectedFile.name) == 'xls' ||
            this.fileExtension(selectedFile.name) == 'xlsx')) {
            this.excelFileName = selectedFile.name;
            this.excelFile = selectedFile;
        }
        else {
            this.excelFileName = "Choose Your excel file";
        }
    }



    toggleEditMode(item: any) {
        item.isEdit = !item.isEdit;     
    }

    saveChanges(item: any) {
        item.isEdit = false;        
    }

    removeItem(index: any) {
        this.list.splice(index, 1);
        this.createForm.get('quantity').setValue(this.list.length);
    }

    cancelEdit(item: any) {
        item.isEdit = false;        
    }

    getProductData() {

        let params = {
            assetId: this.createForm.get('assetId').value,
            approved: this.approved
        };
        this.list = []
        this.createSerive.getProduct(params).subscribe(response => {
            // console.log("getProductData >>>", response);            
            this.load_UploadForm(response);
            this.list = response;
        }, (error) => {
            this.utilityService.fail("Something went wrong", "Server Response")
            console.log("error >>>", error);
        })
    }

    openProductDetailModal() {
        this.productDetailFormInit();
        this.modalRef = this.modalService1.open(this.productDetailModal, {backdrop: 'static', size: 'lg' }); 
        this.server_errors = null;
    }

    closeAddProductModal() {
        if (this.modalRef) {
            this.modalRef.dismiss('Close click');
        }
    }

    productDetailForm: FormGroup;
    formArray: any;
    productDetailFormInit() {
        this.productDetailForm = this.fb.group({
            downloadFormat: new FormControl(''),   
            product: this.fb.array([])
            
        });          


        this.formArray = (<FormArray>this.productDetailForm.get('product')).controls;        
        this.productDetailForm.get('downloadFormat').valueChanges.subscribe((item) => {
            this.resetFormArray(item);
            this.createForm.patchValue({
                quantity: 1
            });
        });


    }

    resetFormArray(downloadFormat: string) {
        const productArray = this.productDetailForm.get('product') as FormArray;
        productArray.clear(); 

        if (downloadFormat === 'SIM') {
            productArray.push(this.fb.group({
                productId: new FormControl('', Validators.required),
                number: new FormControl('', Validators.required),
                pin: new FormControl('', Validators.required),
                puk: new FormControl('', Validators.required)
            }));
        } 
        else if (downloadFormat === 'Phone') {
            productArray.push(this.fb.group({
                productId: new FormControl('', Validators.required),
                number: new FormControl('', Validators.required),
                imei1: new FormControl('', Validators.required),
                imei2: new FormControl('', Validators.required)
            }));
        }
        else if (downloadFormat === 'Serial') {
            productArray.push(this.fb.group({
                productId: new FormControl('', Validators.required),
                number: new FormControl('', Validators.required)
            }));
        }
        else if (downloadFormat === 'Product ID') {
            productArray.push(this.fb.group({
                productId: new FormControl('', Validators.required)
            }));
        }

    }


    // load_ProductDetailForm(value: any) {
    //     //console.log("value ", value);
    //     // this.productDetailForm.get('downloadFormat').setValue(value[0].format);
    //     // this.productDetailForm.get('productId').setValue(value.productId);
    //     // this.productDetailForm.get('number').setValue(value.number);
    //     // this.productDetailForm.get('imei1').setValue(value.imei1);
    //     // this.productDetailForm.get('imei2').setValue(value.imei2);
    //     // this.productDetailForm.get('pin').setValue(value.pin);
    //     // this.productDetailForm.get('puk').setValue(value.puk);


    //     this.productDetailForm.get('downloadFormat').setValue(value[0].format);
    //     const productArray = this.productDetailForm.get('product') as FormArray;
    //     productArray.clear(); // Clear existing form groups

    //     if (value[0].format === 'SIM') {
    //         productArray.push(this.fb.group({
    //             productId: [value.productId, Validators.required],
    //             number: [value.number, Validators.required],
    //             pin: [value.pin, Validators.required],
    //             puk: [value.puk, Validators.required],
    //             imei1: '', // Set initial value to empty string or null
    //             imei2: ''
    //         }));
    //     } else if (value[0].format === 'Phone') {
    //         productArray.push(this.fb.group({
    //             productId: [value.productId, Validators.required],
    //             number: [value.number, Validators.required],
    //             imei1: [value.imei1], // Set initial value if available
    //             imei2: [value.imei2],
    //             pin: '',
    //             puk: ''
    //         }));
    //     } else if (value[0].format === 'Serial') {
    //         productArray.push(this.fb.group({
    //             productId: [value.productId, Validators.required],
    //             number: [value.number, Validators.required]
    //         }));
    //     } else if (value[0].format === 'Product ID') {
    //         productArray.push(this.fb.group({
    //             productId: [value.productId, Validators.required]
    //         }));
    //     }

    // }

    // load_ProductDetailForm(value: any) {
    //     this.productDetailForm.get('downloadFormat').setValue(value[0].format);
    //     const productArray = this.productDetailForm.get('product') as FormArray;
    //     productArray.clear(); // Clear existing form array
    
    //     // Dynamically add form controls based on downloadFormat
    //     const format = value[0].format;
    //     if (format === 'SIM') {
    //         productArray.push(this.fb.group({
    //             productId: [value.productId, Validators.required],
    //             number: [value.number, Validators.required],
    //             pin: [value.pin, Validators.required],
    //             puk: [value.puk, Validators.required],
    //             imei1: [''], // Add these lines to ensure controls are initialized
    //             imei2: ['']  // even if they are not present initially
    //         }));
    //     } else if (format === 'Phone') {
    //         productArray.push(this.fb.group({
    //             productId: [value.productId, Validators.required],
    //             number: [value.number, Validators.required],
    //             imei1: [value.imei1, Validators.required],
    //             imei2: [value.imei2, Validators.required],
    //             pin: [''], // Add these lines
    //             puk: ['']   // Add these lines
    //         }));
    //     } else if (format === 'Serial') {
    //         productArray.push(this.fb.group({
    //             productId: [value.productId, Validators.required],
    //             number: [value.number, Validators.required],
    //             imei1: [''], // Add these lines
    //             imei2: [''], // Add these lines
    //             pin: [''],   // Add these lines
    //             puk: ['']    // Add these lines
    //         }));
    //     } else if (format === 'Product ID') {
    //         productArray.push(this.fb.group({
    //             productId: [value.productId, Validators.required],
    //             number: [''], // Add these lines
    //             imei1: [''],  // Add these lines
    //             imei2: [''],  // Add these lines
    //             pin: [''],    // Add these lines
    //             puk: ['']     // Add these lines
    //         }));
    //     }
    // }
    


    addClick(): void {
        const productDetailFormArray = <FormArray>this.productDetailForm.get('product');
        productDetailFormArray.push(this.addproductGroup());    

        const totalProducts = productDetailFormArray.length;
        this.createForm.patchValue({
            quantity: totalProducts
        });
    }    

    addproductGroup() {
        return this.fb.group({
            productId: new FormControl('', Validators.required),
            number: new FormControl('', Validators.required),
            imei1: new FormControl(''),
            imei2: new FormControl(''),
            pin: new FormControl(''),
            puk: new FormControl('')
        })
    }

    removeClick(index: number) {
        const productDetailFormArray = <FormArray>this.productDetailForm.get('product');
        if (productDetailFormArray.length > 1) {
            productDetailFormArray.removeAt(index);

            const totalProducts = productDetailFormArray.length;
            this.createForm.patchValue({
                quantity: totalProducts
            });
        } else {
            this.utilityService.fail("You can't delete the last item", "Site Response");
        }
    }
    
    resetQuantityFormControl() {
        this.createForm.get('quantity').setValue('');
    }
    



}
