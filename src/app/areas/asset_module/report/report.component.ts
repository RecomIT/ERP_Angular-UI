import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { CustomModalService } from "src/app/shared/services/custom-modal.service";
import { UserService } from "src/app/shared/services/user.service";
import { UtilityService } from "src/app/shared/services/utility.service";
import { ToastrService } from 'ngx-toastr';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { TypeaheadMatch } from "ngx-bootstrap/typeahead";
import { transition, trigger, useAnimation } from "@angular/animations";
import { bounceIn, fadeIn, fadeInRight, slideInUp } from "ng-animate";
import { EmployeeInfoService } from "../../employee_module/employee/employee-info.service";
import { CategoryService } from "../setting/category/category.service";
import { SubCategoryService } from "../setting/category/sub-category-modal/subCategory.service";
import { VendorSerive } from "../setting/vendor/vendor.service";
import { BrandService } from "../setting/category/brand-modal/brand.service";
import { DatePipe } from "@angular/common";
import { ReportService } from "./report.service";
import { CreateSerive } from "../create/create.service";
import { AssigningSerive } from "../assigning/assigning.service";


@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  animations: [
    trigger('slideInUp', [transition('* => *', useAnimation(slideInUp, { params: { timing: 0.5 } }))]),
    trigger('fadeIn', [transition('void => *', useAnimation(fadeIn, { params: { timing: 0.3 } }))]),
    trigger('fadeInRight', [transition('void => *', useAnimation(fadeInRight, { params: { timing: 0.5 } }))]),
    trigger('bounceIn', [transition('void => *', useAnimation(bounceIn, { params: { timing: 1 } }))]),
  ]
})
export class ReportComponent implements OnInit {

  @Output() closeModalEvent = new EventEmitter<string>();
  modalTitle: string = "Asset Reports";
  datePickerConfig: Partial<BsDatepickerConfig> = this.utilityService.datePickerConfig();
  searchByDate: any[] = [];
  isButtonDisabled: boolean = true;

  constructor(private fb: FormBuilder,   
    private userService: UserService,
    public utilityService: UtilityService,
    public modalService: CustomModalService,
    public toastr: ToastrService,
    private employeeInfoService: EmployeeInfoService,
    private categoryService: CategoryService,
    private subCategoryService: SubCategoryService,
    private brandService: BrandService,
    private vendorSerive: VendorSerive,
    private datepipe: DatePipe,
    private reportService : ReportService,
    private createSerive : CreateSerive,
    private assigningSerive: AssigningSerive, 
    
  ) { }

  User() {
    return this.userService.User();
  }

  select2Options = this.utilityService.select2Config();
  ngOnInit(): void {
    this.reportsFormInit();  
    this.loadReportsName();
    this.loadReportsType();
  }


  closeModal(reason: string) {
    this.modalService.service.dismissAll(reason);
    this.closeModalEvent.emit(reason); // fire
  }


  ddlReportsName: any[] = [];
  loadReportsName() {
    this.ddlReportsName = [
      'Asset Report',
      'Stock Report',
      'Assigning Report',
      'Servicing Report',
      'Replacement Report',
      'Handover Report',
        'Repaired Report'];
      // 'Damage Report'];
  }

  ddlReportsType: any[] = [];
  loadReportsType() {
    this.ddlReportsType = ['All', 'Category Wise'];
  }

  ddlEmployees: any[] = [];
  loadEmployee() {
    this.employeeInfoService.loadDropdownData({});
    this.employeeInfoService.ddl_employee_data$.subscribe(data => {
      this.employeeInfoService.loadDropdown(data);
      this.ddlEmployees = this.employeeInfoService.ddl$;
      this.employees = this.ddlEmployees;
    }, error => {
      console.error('Error while fetching data:', error);
    });
  }

  employeeWise: string = '';
  ddlEmployeeWise: any[] = [];
  loadEmployeeWise() {
    this.ddlEmployeeWise = ['All', 'Selected Employees'];
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

    console.log("categoryId", CategoryId);

    this.subCategoryService.loadSubCategoryDropdown(CategoryId);
    this.subCategoryService.ddl$.subscribe(data => {
      this.ddlSubCategory = data;
    }, (error) => {
      console.log("error  while fetching data >>>", error);
    })
  }

  ddlBrand: any[] = [];
  loadBrandDropdown(SubCategoryId: any) {

    console.log("categoryId", SubCategoryId);

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

  ddlAssetName: any[] = [];
  loadAssetNameDropdown() {
    this.createSerive.loadAssetNameDropdown();
    this.createSerive.ddl$.subscribe(data => {
      this.ddlAssetName = data;
    }, (error) => {
      console.log("error  while fetching data >>>", error);
    })
  }

  ddlProduct: any[] = [];
  loadProductDropdown() {
    this.assigningSerive.loadProductDropdown();
    this.assigningSerive.ddl$.subscribe(data => {
      this.ddlProduct = data;
    }, (error) => {
      console.log("error  while fetching data >>>", error);
    })
  }


  reportsName_changed() {
    this.reportsFilterForm.get('searchByDate').setValue('');
    this.reportsFilterForm.get('reportsType').setValue('');  

    this.reportsFilterForm.get('productId').setValue('');
    this.reportsFilterForm.get('assetId').setValue(0);
    this.reportsFilterForm.get('vendorId').setValue(0);
    this.reportsFilterForm.get('categoryId').setValue(0);
    this.reportsFilterForm.get('subCategoryId').setValue(0);
    this.reportsFilterForm.get('brandId').setValue(0);
    this.reportsFilterForm.get('employeeWise').setValue('');
    this.reportsFilterForm.get('selectedEmployees').setValue('');
    this.reportsFilterForm.get('employee').setValue('');    
    this.employeesList = [];
    this.isButtonDisabled = true;  
  }

  reportsForm: FormGroup;
  reportsFormInit() {
    this.reportsForm = this.fb.group({
      reportsName: ['', [Validators.required]]
    });

    this.reportsForm.get('reportsName').valueChanges.subscribe((item) => {
      console.log("reportsName valueChanges");
      this.reportsFilterFormInit();
      this.reportsName_changed();
    });

  }

  reportsFilterForm: FormGroup;
  reportsFilterFormInit() {
    this.reportsFilterForm = this.fb.group({
      reportsType: new FormControl(''),
      assetId: new FormControl(0),
      productId: new FormControl(''),
      vendorId: new FormControl(0),
      categoryId: new FormControl(0),
      subCategoryId: new FormControl(0),
      brandId: new FormControl(0),
      employeeWise: new FormControl(''),
      searchByDate: new FormControl(''),
      employee: new FormControl(),
      selectedEmployees: new FormControl(this.selectedEmployees)

    });

    
    this.reportsFilterForm.get('reportsType').valueChanges.subscribe((item) => {
      this.loadVendorDropdown();
      this.loadCategoryDropdown();
      this.loadEmployeeWise();
      this.loadAssetNameDropdown(); 
      this.loadProductDropdown();
      this.reportsType_changed();
    });
    
    this.reportsFilterForm.get('employeeWise').valueChanges.subscribe((item) => {
     this.loadEmployee();
    });

    this.reportsFilterForm.get('categoryId').valueChanges.subscribe((item) => {
      this.loadSubCategoryDropdown(item);
    });

    this.reportsFilterForm.get('subCategoryId').valueChanges.subscribe((item) => {
      this.loadBrandDropdown(item);
    });

    this.reportsFilterForm.get('searchByDate').valueChanges.subscribe((item) => {
      this.searchByDate_changed();
    });

  }

  //#region Selected-Employee

  selectedEmployee?: string;
  employees: any[] = [];
  employeesList: any[] = [];
  selected?: string;

  deleteEmployee(id: any) {
    const index = this.employeesList.findIndex(s => s.id == id);
    if (index > -1) {
      this.employeesList.splice(index, 1);
    }

    if (this.employeesList.length == 0) {
      this.isButtonDisabled = true;
    }
    else {
      this.isButtonDisabled = false;
    }

  }

  employeeOnSelect(e: TypeaheadMatch) {
    var isEmployee = null;
    if (this.employeesList.length > 0) {
      isEmployee = this.employeesList.find(s => s.id == e.item.id);
    }
    if (isEmployee != null) {
      this.utilityService.fail("Duplicate employee detected", "Site Response");
    }
    else {
      this.employeesList.push({
        id: e.item.id,
        text: e.item.text
      })
    }
    this.selectedEmployee = "";
    this.selected = "";
    this.getSelectedEmployees();
  }

  commaSeparatedEmployee?: string;
  loadEmployeeByCommaSeparatedData() {
    if (this.commaSeparatedEmployee != null && this.commaSeparatedEmployee != "") {
      this.employeesList = [];
      this.employeeInfoService.getServiceData({ includedEmployeeCode: this.commaSeparatedEmployee }).then(result => {
        if (result.length == 0) {
          this.utilityService.info("No Employee(s) Found", "Server Response");
        }
        else {
          result.forEach(item => {
            this.employeesList.push({
              id: item.employeeId,
              text: item.fullName + '~' + item.employeeCode
            })
          });
          this.getSelectedEmployees();
        }
      })
    }
  }

  selectedEmployees: string = "";
  getSelectedEmployees() {
    this.selectedEmployees = "";
    this.employeesList.forEach(item => {
      this.selectedEmployees += item.id + ","
    });
    this.reportsFilterForm.get("selectedEmployees").setValue(this.selectedEmployees)
  }
  //#endregion

  searchByDate_changed() {
    if (this.reportsForm.get('reportsName').value == "Asset Report" 
    || this.reportsForm.get('reportsName').value == "Assigning Report"
    || this.reportsForm.get('reportsName').value == "Servicing Report"
    || this.reportsForm.get('reportsName').value == "Handover Report"
    || this.reportsForm.get('reportsName').value == "Repaired Report"
    || this.reportsForm.get('reportsName').value == "Replacement Report") {
      if (this.reportsFilterForm.get('searchByDate').value.length != 0 && this.reportsFilterForm.get('reportsType').value != '') {
        this.isButtonDisabled = false;
      }
      else {
        this.isButtonDisabled = true;
      }
    };

  }

  reportsType_changed() {
    console.log('reportsType_changed');
    this.reportsFilterForm.get('assetId').setValue(0);
    this.reportsFilterForm.get('productId').setValue('');
    this.reportsFilterForm.get('vendorId').setValue(0);
    this.reportsFilterForm.get('categoryId').setValue(0);
    this.reportsFilterForm.get('subCategoryId').setValue(0);
    this.reportsFilterForm.get('brandId').setValue(0);
    this.reportsFilterForm.get('employeeWise').setValue('');
    this.reportsFilterForm.get('selectedEmployees').setValue('');
    this.reportsFilterForm.get('employee').setValue('');    
    this.employeesList = []; 

    if (this.reportsForm.get('reportsName').value == "Asset Report" 
    || this.reportsForm.get('reportsName').value == "Assigning Report"
    || this.reportsForm.get('reportsName').value == "Servicing Report"
    || this.reportsForm.get('reportsName').value == "Handover Report"
    || this.reportsForm.get('reportsName').value == "Repaired Report"
    || this.reportsForm.get('reportsName').value == "Replacement Report") {
      if (this.reportsFilterForm.get('searchByDate').value.length != 0 && this.reportsFilterForm.get('reportsType').value != '') {
        this.isButtonDisabled = false;
      }
      else {
        this.isButtonDisabled = true;
      }
    };

    if (this.reportsForm.get('reportsName').value == "Stock Report") {
      if (this.reportsFilterForm.get('reportsType').value != '') {
        this.isButtonDisabled = false;
      }
      else {
        this.isButtonDisabled = true;
      }
    };


  }


  downloadReports() {
    const selectedReport = this.reportsForm.controls.reportsName.value;
    console.log("selected Report & Data >>>>", selectedReport);
    if (selectedReport === 'Asset Report') {
      this.generateAssetReport();
    };

    if (selectedReport === 'Assigning Report') {
      this.generateAssigningReport();
    };

    if (selectedReport === 'Servicing Report') {
      this.generateServicingReport();
    };

    if (selectedReport === 'Replacement Report') {
      this.generateReplacementReport();
    };

    if (selectedReport === 'Handover Report') {
      this.generateHandoverReport();
    };

    if (selectedReport === 'Repaired Report') {
      this.generateRepairedReport();
    };

    if (selectedReport === 'Damage Report') {
      this.generateDamageReport();
    };

    if (selectedReport === 'Stock Report') {
      this.generateStockReport();
    };

  }


  clearSearchByDate() {
    this.reportsFilterForm.get('searchByDate').setValue('');
  }


  generateAssetReport() {
    const assetId = this.reportsFilterForm.controls.assetId.value !== null ? this.reportsFilterForm.controls.assetId.value : 0;
    const vendorId = this.reportsFilterForm.controls.vendorId.value !== null ? this.reportsFilterForm.controls.vendorId.value : 0;
    const categoryId = this.reportsFilterForm.controls.categoryId.value !== null ? this.reportsFilterForm.controls.categoryId.value : 0;
    const subCategoryId = this.reportsFilterForm.controls.subCategoryId.value !== null ? this.reportsFilterForm.controls.subCategoryId.value : 0;
    const brandId = this.reportsFilterForm.controls.brandId.value !== null ? this.reportsFilterForm.controls.brandId.value : 0;

    const selectedReport = this.reportsForm.controls.reportsName.value;

    let fromDate = (this.reportsFilterForm.get('searchByDate').value.length > 0) ?
      this.datepipe.transform(this.reportsFilterForm.get('searchByDate').value[0], 'yyyy-MM-dd') : "";
    let toDate = (this.reportsFilterForm.get('searchByDate').value.length > 0) ?
      this.datepipe.transform(this.reportsFilterForm.get('searchByDate').value[1], 'yyyy-MM-dd') : "";

    // let params = Object.assign({}, this.reportsFilterForm.value, { fromDate: fromDate, toDate: toDate, reportName: selectedReport });
    let params = Object.assign({ assetId: assetId,vendorId: vendorId, categoryId: categoryId,subCategoryId: subCategoryId,brandId: brandId ,fromDate: fromDate, toDate: toDate, reportName: selectedReport });
    params.format = 'xlsx';
    let fileName = `${selectedReport}.xlsx`;

    console.log("params [] >>>>", params);

    this.reportService.generateAssetReport(params).subscribe(response => {
      let result = response as any;
      if (result?.status == 200) {
        var blob = new Blob([response.body],
          { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
      }    
    }, (error) => {    
      this.utilityService.warning('The requested data could not be found', 'Site Reponse')
    })

  }

  generateAssigningReport() {

    const assetId = this.reportsFilterForm.controls.assetId.value !== null ? this.reportsFilterForm.controls.assetId.value : 0;
    const vendorId = this.reportsFilterForm.controls.vendorId.value !== null ? this.reportsFilterForm.controls.vendorId.value : 0;
    const categoryId = this.reportsFilterForm.controls.categoryId.value !== null ? this.reportsFilterForm.controls.categoryId.value : 0;
    const subCategoryId = this.reportsFilterForm.controls.subCategoryId.value !== null ? this.reportsFilterForm.controls.subCategoryId.value : 0;
    const brandId = this.reportsFilterForm.controls.brandId.value !== null ? this.reportsFilterForm.controls.brandId.value : 0;

    const selectedReport = this.reportsForm.controls.reportsName.value;

    let fromDate = (this.reportsFilterForm.get('searchByDate').value.length > 0) ?
      this.datepipe.transform(this.reportsFilterForm.get('searchByDate').value[0], 'yyyy-MM-dd') : "";
    let toDate = (this.reportsFilterForm.get('searchByDate').value.length > 0) ?
      this.datepipe.transform(this.reportsFilterForm.get('searchByDate').value[1], 'yyyy-MM-dd') : "";

     let params = Object.assign({ selectedEmployees: this.selectedEmployees, assetId: assetId,vendorId: vendorId, categoryId: categoryId,subCategoryId: subCategoryId,brandId: brandId ,fromDate: fromDate, toDate: toDate, reportName: selectedReport });
    params.format = 'xlsx';
    let fileName = `${selectedReport}.xlsx`;

    console.log("params [] >>>>", params);

    this.reportService.generateAssigningReport(params).subscribe(response => {
      let result = response as any;
      if (result?.status == 200) {
        var blob = new Blob([response.body],
          { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
      }
    }, (error) => {
      this.utilityService.warning('The requested data could not be found', 'Site Reponse')
    })

  }

  generateServicingReport() {
    const assetId = this.reportsFilterForm.controls.assetId.value !== null ? this.reportsFilterForm.controls.assetId.value : 0;
    const vendorId = this.reportsFilterForm.controls.vendorId.value !== null ? this.reportsFilterForm.controls.vendorId.value : 0;
    const categoryId = this.reportsFilterForm.controls.categoryId.value !== null ? this.reportsFilterForm.controls.categoryId.value : 0;
    const subCategoryId = this.reportsFilterForm.controls.subCategoryId.value !== null ? this.reportsFilterForm.controls.subCategoryId.value : 0;
    const brandId = this.reportsFilterForm.controls.brandId.value !== null ? this.reportsFilterForm.controls.brandId.value : 0;

    const selectedReport = this.reportsForm.controls.reportsName.value;

    let fromDate = (this.reportsFilterForm.get('searchByDate').value.length > 0) ?
      this.datepipe.transform(this.reportsFilterForm.get('searchByDate').value[0], 'yyyy-MM-dd') : "";
    let toDate = (this.reportsFilterForm.get('searchByDate').value.length > 0) ?
      this.datepipe.transform(this.reportsFilterForm.get('searchByDate').value[1], 'yyyy-MM-dd') : "";

    let params = Object.assign({ assetId: assetId,vendorId: vendorId, categoryId: categoryId,subCategoryId: subCategoryId,brandId: brandId ,fromDate: fromDate, toDate: toDate, reportName: selectedReport });
    params.format = 'xlsx';
    let fileName = `${selectedReport}.xlsx`;

    console.log("params [] >>>>", params);

    this.reportService.generateServicingReport(params).subscribe(response => {
      let result = response as any;
      if (result?.status == 200) {
        var blob = new Blob([response.body],
          { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
      }
    }, (error) => {
      this.utilityService.warning('The requested data could not be found', 'Site Reponse')
    })

  }

  generateReplacementReport() {
    const assetId = this.reportsFilterForm.controls.assetId.value !== null ? this.reportsFilterForm.controls.assetId.value : 0;
    const vendorId = this.reportsFilterForm.controls.vendorId.value !== null ? this.reportsFilterForm.controls.vendorId.value : 0;
    const categoryId = this.reportsFilterForm.controls.categoryId.value !== null ? this.reportsFilterForm.controls.categoryId.value : 0;
    const subCategoryId = this.reportsFilterForm.controls.subCategoryId.value !== null ? this.reportsFilterForm.controls.subCategoryId.value : 0;
    const brandId = this.reportsFilterForm.controls.brandId.value !== null ? this.reportsFilterForm.controls.brandId.value : 0;

    const selectedReport = this.reportsForm.controls.reportsName.value;

    let fromDate = (this.reportsFilterForm.get('searchByDate').value.length > 0) ?
      this.datepipe.transform(this.reportsFilterForm.get('searchByDate').value[0], 'yyyy-MM-dd') : "";
    let toDate = (this.reportsFilterForm.get('searchByDate').value.length > 0) ?
      this.datepipe.transform(this.reportsFilterForm.get('searchByDate').value[1], 'yyyy-MM-dd') : "";

    let params = Object.assign({ assetId: assetId,vendorId: vendorId, categoryId: categoryId,subCategoryId: subCategoryId,brandId: brandId ,fromDate: fromDate, toDate: toDate, reportName: selectedReport });
    params.format = 'xlsx';
    let fileName = `${selectedReport}.xlsx`;

    console.log("params [] >>>>", params);

    this.reportService.generateReplacementReport(params).subscribe(response => {
      let result = response as any;
      if (result?.status == 200) {
        var blob = new Blob([response.body],
          { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
      }
    }, (error) => {
      this.utilityService.warning('The requested data could not be found', 'Site Reponse')
    })

  }

  generateHandoverReport() {
    const assetId = this.reportsFilterForm.controls.assetId.value !== null ? this.reportsFilterForm.controls.assetId.value : 0;
    const vendorId = this.reportsFilterForm.controls.vendorId.value !== null ? this.reportsFilterForm.controls.vendorId.value : 0;
    const categoryId = this.reportsFilterForm.controls.categoryId.value !== null ? this.reportsFilterForm.controls.categoryId.value : 0;
    const subCategoryId = this.reportsFilterForm.controls.subCategoryId.value !== null ? this.reportsFilterForm.controls.subCategoryId.value : 0;
    const brandId = this.reportsFilterForm.controls.brandId.value !== null ? this.reportsFilterForm.controls.brandId.value : 0;

    const selectedReport = this.reportsForm.controls.reportsName.value;

    let fromDate = (this.reportsFilterForm.get('searchByDate').value.length > 0) ?
      this.datepipe.transform(this.reportsFilterForm.get('searchByDate').value[0], 'yyyy-MM-dd') : "";
    let toDate = (this.reportsFilterForm.get('searchByDate').value.length > 0) ?
      this.datepipe.transform(this.reportsFilterForm.get('searchByDate').value[1], 'yyyy-MM-dd') : "";

    let params = Object.assign({ assetId: assetId,vendorId: vendorId, categoryId: categoryId,subCategoryId: subCategoryId,brandId: brandId ,fromDate: fromDate, toDate: toDate, reportName: selectedReport });
    params.format = 'xlsx';
    let fileName = `${selectedReport}.xlsx`;

    console.log("params [] >>>>", params);

    this.reportService.generateHandoverReport(params).subscribe(response => {
      let result = response as any;
      if (result?.status == 200) {
        var blob = new Blob([response.body],
          { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
      }
    }, (error) => {
      this.utilityService.warning('The requested data could not be found', 'Site Reponse')
    })

  }

  generateRepairedReport() {
    const assetId = this.reportsFilterForm.controls.assetId.value !== null ? this.reportsFilterForm.controls.assetId.value : 0;
    const vendorId = this.reportsFilterForm.controls.vendorId.value !== null ? this.reportsFilterForm.controls.vendorId.value : 0;
    const categoryId = this.reportsFilterForm.controls.categoryId.value !== null ? this.reportsFilterForm.controls.categoryId.value : 0;
    const subCategoryId = this.reportsFilterForm.controls.subCategoryId.value !== null ? this.reportsFilterForm.controls.subCategoryId.value : 0;
    const brandId = this.reportsFilterForm.controls.brandId.value !== null ? this.reportsFilterForm.controls.brandId.value : 0;

    const selectedReport = this.reportsForm.controls.reportsName.value;

    let fromDate = (this.reportsFilterForm.get('searchByDate').value.length > 0) ?
      this.datepipe.transform(this.reportsFilterForm.get('searchByDate').value[0], 'yyyy-MM-dd') : "";
    let toDate = (this.reportsFilterForm.get('searchByDate').value.length > 0) ?
      this.datepipe.transform(this.reportsFilterForm.get('searchByDate').value[1], 'yyyy-MM-dd') : "";

    let params = Object.assign({ assetId: assetId,vendorId: vendorId, categoryId: categoryId,subCategoryId: subCategoryId,brandId: brandId ,fromDate: fromDate, toDate: toDate, reportName: selectedReport });
    params.format = 'xlsx';
    let fileName = `${selectedReport}.xlsx`;

    console.log("params [] >>>>", params);

    this.reportService.generateRepairedReport(params).subscribe(response => {
      let result = response as any;
      if (result?.status == 200) {
        var blob = new Blob([response.body],
          { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
      }
    }, (error) => {
      this.utilityService.warning('The requested data could not be found', 'Site Reponse')
    })

  }

  generateDamageReport() {
    const assetId = this.reportsFilterForm.controls.assetId.value !== null ? this.reportsFilterForm.controls.assetId.value : 0;
    const vendorId = this.reportsFilterForm.controls.vendorId.value !== null ? this.reportsFilterForm.controls.vendorId.value : 0;
    const categoryId = this.reportsFilterForm.controls.categoryId.value !== null ? this.reportsFilterForm.controls.categoryId.value : 0;
    const subCategoryId = this.reportsFilterForm.controls.subCategoryId.value !== null ? this.reportsFilterForm.controls.subCategoryId.value : 0;
    const brandId = this.reportsFilterForm.controls.brandId.value !== null ? this.reportsFilterForm.controls.brandId.value : 0;

    const selectedReport = this.reportsForm.controls.reportsName.value;

    let fromDate = (this.reportsFilterForm.get('searchByDate').value.length > 0) ?
      this.datepipe.transform(this.reportsFilterForm.get('searchByDate').value[0], 'yyyy-MM-dd') : "";
    let toDate = (this.reportsFilterForm.get('searchByDate').value.length > 0) ?
      this.datepipe.transform(this.reportsFilterForm.get('searchByDate').value[1], 'yyyy-MM-dd') : "";

    let params = Object.assign({ assetId: assetId,vendorId: vendorId, categoryId: categoryId,subCategoryId: subCategoryId,brandId: brandId ,fromDate: fromDate, toDate: toDate, reportName: selectedReport });
    params.format = 'xlsx';
    let fileName = `${selectedReport}.xlsx`;

    console.log("params [] >>>>", params);

    this.reportService.generateDamageReport(params).subscribe(response => {
      let result = response as any;
      if (result?.status == 200) {
        var blob = new Blob([response.body],
          { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
      }
    }, (error) => {
      this.utilityService.warning('The requested data could not be found', 'Site Reponse')
    })

  }

  generateStockReport() {
    const assetId = this.reportsFilterForm.controls.assetId.value !== null ? this.reportsFilterForm.controls.assetId.value : 0;
    const vendorId = this.reportsFilterForm.controls.vendorId.value !== null ? this.reportsFilterForm.controls.vendorId.value : 0;
    const categoryId = this.reportsFilterForm.controls.categoryId.value !== null ? this.reportsFilterForm.controls.categoryId.value : 0;
    const subCategoryId = this.reportsFilterForm.controls.subCategoryId.value !== null ? this.reportsFilterForm.controls.subCategoryId.value : 0;
    const brandId = this.reportsFilterForm.controls.brandId.value !== null ? this.reportsFilterForm.controls.brandId.value : 0;

    const selectedReport = this.reportsForm.controls.reportsName.value;

    let fromDate = (this.reportsFilterForm.get('searchByDate').value.length > 0) ?
      this.datepipe.transform(this.reportsFilterForm.get('searchByDate').value[0], 'yyyy-MM-dd') : "";
    let toDate = (this.reportsFilterForm.get('searchByDate').value.length > 0) ?
      this.datepipe.transform(this.reportsFilterForm.get('searchByDate').value[1], 'yyyy-MM-dd') : "";

    let params = Object.assign({ assetId: assetId,vendorId: vendorId, categoryId: categoryId,subCategoryId: subCategoryId,brandId: brandId ,fromDate: fromDate, toDate: toDate, reportName: selectedReport });
    params.format = 'xlsx';
    let fileName = `${selectedReport}.xlsx`;

    console.log("params [] >>>>", params);

    this.reportService.generateStockReport(params).subscribe(response => {
      let result = response as any;
      if (result?.status == 200) {
        var blob = new Blob([response.body],
          { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
      }
    }, (error) => {
      this.utilityService.warning('The requested data could not be found', 'Site Reponse')
    })

  }

}
