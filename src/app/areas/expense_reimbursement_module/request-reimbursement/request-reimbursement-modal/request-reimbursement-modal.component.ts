import { DatePipe } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { CustomModalService } from 'src/app/shared/services/custom-modal.service';
import { UserService } from 'src/app/shared/services/user.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { EmployeeRequestSerive } from '../../employee-request/employee-request.service';
import { ReimbursementSerive } from '../reimbursement.service';

@Component({
  selector: 'expense-reimbursement-module-request-reimbursement-modal',
  templateUrl: './request-reimbursement-modal.component.html',
  styleUrls: ['./request-reimbursement-modal.component.css']
})
export class RequestReimbursementModalComponent implements OnInit {

  @Input() id: number = 0;
  @Input() transactionType: string = '';
  @Input() emailFlag: string = '';
  @Input() spendMode : string = '';
  @Output() closeModalEvent = new EventEmitter<string>();
  @ViewChild('expenseRequestModal', { static: true }) expenseRequestModal!: ElementRef;
  modalTitle: string = "Expense Request";
  select2Config: any = this.utilityService.select2Config();

  datePickerConfig: Partial<BsDatepickerConfig> = {
    ...this.utilityService.datePickerConfig(),
    minDate: new Date(),
  };

  constructor(
    private fb: FormBuilder,
    public modalService: CustomModalService,
    private utilityService: UtilityService,
    private userService: UserService,
    private datepipe: DatePipe,
    private employeeRequestSerive: EmployeeRequestSerive,
    public reimbursementSerive: ReimbursementSerive
  ) { }

  formArray: any;
  requestFormConveyance: FormGroup;
  requestFormTravels: FormGroup;
  requestFormEntertainment: FormGroup;
  transactionForm: FormGroup;
  requestExpatForm: FormGroup;
  requestFormTraining: FormGroup;
  btnSubmit: boolean = false;

  User() {
    return this.userService.User();
  }

  logger(msg: any, options: any) {
    this.utilityService.consoleLog(msg, options);
  }

  ngOnInit(): void {
    this.formInit();
    this.openModal();
    this.loadTransactionType();
    this.loadSpendMode();

    // console.log("spendMode >>>", this.spendMode);

    if (this.id > 0) {
      this.transactionForm.get('transactionType').setValue(this.transactionType);
      this.transactionForm.get('spendMode').setValue(this.spendMode);
      this.getRequestDataList();
      this.getRequestData();
      this.modalTitle = this.id > 0 ? "Update Request" : "New Request";
    };

  }


  isSpendModeDisabled = false;
  isTransactionTypeDisabled = false;

  formInit() {
    this.transactionForm = this.fb.group({
      requestId: new FormControl(this.id),
      transactionDate: new FormControl(null),
      transactionType: [{ value: '', disabled: true }, Validators.required],
      spendMode: new FormControl('', Validators.required)
    });

    this.transactionForm.get('spendMode').valueChanges.subscribe(value => {
      this.spendMode = value;
      // this.isSpendModeDisabled = !!value;
      // if (this.emailFlag !== 'Edit') {
      //   this.transactionForm.get('transactionType').setValue('');
      // }
    });

    this.transactionForm.get('transactionType').valueChanges.subscribe(value => {
      // this.isTransactionTypeDisabled = !!value;      
      this.transactionType = value;

      if (this.transactionType != "") {

        if (value == 'Expat') {
          this.requestFormExpatInit();
          this.loadTransactionType();
          this.loadSpendMode();
          this.calculateExpatTotalAmount();
        }
        if (value == 'Conveyance') {
          this.requestFormConveyanceInit();          
          this.loadTransportation();
          this.calculateConveyanceTotalAmount();
        }
        if (value == 'Travels') {
          this.requestFormTravelsInit();
          this.loadTransactionTravels();
          this.loadlocation();
        }
        if (value == 'Training') {
          this.requestFormTrainingInit();
        }
        if (value == 'Purchase') {
          this.requestFormEntertainmentInit();
        }
        if (value == 'Entertainment') {
          this.requestFormEntertainmentInit();
        }

        // this.updateAdvanceAmountValidators(this.spendMode, this.transactionType);
      };

    });

  }


  updateAdvanceAmountValidators(spendMode: string, transactionType: string) {
    console.log("transactionType >>",transactionType);
    let advanceAmountControl;

    if (transactionType == 'Expat') {

    }
    if (transactionType == 'Conveyance') {
      advanceAmountControl = this.requestFormConveyance.get('advanceAmount');
    }
    if (transactionType == 'Travels') {

    }
    if (transactionType == 'Training') {

    }
    if (transactionType == 'Purchase') {
      advanceAmountControl = this.requestFormEntertainment.get('advanceAmount');
    }
    if (transactionType == 'Entertainment') {
      advanceAmountControl = this.requestFormEntertainment.get('advanceAmount');
    }

    if (transactionType === 'Expat' || transactionType === 'Training' || transactionType === 'Travels') {

    }
    else {

      if (spendMode === 'Advance') {
        advanceAmountControl.setValidators([Validators.required, Validators.pattern('^[0-9]*$')]);
      } else {
        advanceAmountControl.clearValidators();
      }

      advanceAmountControl.updateValueAndValidity();
      
    }


  }

  openModal() {
    this.modalService.open(this.expenseRequestModal, 'xl');
  }

  select2Options = {
    width: "100%",
    containerCssClass: "form-control form-control-sm text-x-small",
    theme: "bootstrap4",
  }

  ddlTransactionType: string[] = [];
  loadTransactionType() {
    this.ddlTransactionType = ['Conveyance', 'Expat', 'Travels', 'Entertainment', 'Training', 'Purchase'];
  }

  ddlSpendMode: string[] = [];
  loadSpendMode() {
    this.ddlSpendMode = ['Advance', 'Self'];
  }

  // employeeRequestCount: number = 0;
  // getRequestCountEmployeeWise() {
  //   const transactionType = this.transactionForm.get('transactionType').value;
  //   this.employeeRequestSerive.RequestCountEmployeeWise({ employeeId: this.User().EmployeeId, transactionType: transactionType }).subscribe(response => {
  //     this.employeeRequestCount = response;
  //     this.updateRefNos(transactionType);
  //   }, (error) => {
  //     this.utilityService.fail("Something went wrong", "Server Response")
  //     console.log("error >>>", error);
  //   })
  // }

  // generateNextRefNo(date: Date, transactionType: string): string {
  //   const year = date.getFullYear();
  //   const month = ('0' + (date.getMonth() + 1)).slice(-2);
  //   const day = ('0' + date.getDate()).slice(-2);
  //   const user = this.userService.User();

  //   const abbreviation = transactionType.slice(0, 4).toUpperCase();
  //   // console.log("abbreviation>>>", abbreviation);

  //   // console.log("employeeRequestCount>>>", this.employeeRequestCount);

  //   const prefix = `${abbreviation}-${user.EmployeeCode}-${year}-${month}-${day}`;
  //   const refNo = `${prefix}-${('0' + this.employeeRequestCount).slice(-3)}`;
  //   // this.employeeRequestCount++;
  //   return refNo;
  // }

  // updateRefNos(selectedTransactionType: any) {
  //   const transactionDate = this.transactionForm.get('transactionDate').value;
  //   const transactionType = this.transactionForm.get('transactionType').value;
  //   const refNo = this.generateNextRefNo(transactionDate, transactionType);
  //   // this.requestFormConveyance.get('refNo').setValue(refNo);

  //   if (selectedTransactionType == "Conveyance") {
  //     this.requestFormConveyance.get('refNo').setValue(refNo);
  //   }
  //   else
  //     if (selectedTransactionType == "Travels") {
  //       this.requestFormTravels.get('refNo').setValue(refNo);
  //     }
  //     else
  //       if (selectedTransactionType == "Entertainment") {
  //         this.requestFormEntertainment.get('refNo').setValue(refNo);
  //       }
  //       else
  //         if (selectedTransactionType == "Expat") {
  //           this.requestExpatForm.get('refNo').setValue(refNo);
  //         }
  //         else
  //           if (selectedTransactionType == "Training") {
  //             this.requestFormTraining.get('refNo').setValue(refNo);
  //           }
  //           else
  //             if (selectedTransactionType == "Purchase") {
  //               this.requestFormEntertainment.get('refNo').setValue(refNo);
  //             }

  //   // console.log("Reference No>>>", refNo);
  // }

  getRequestData() {
    this.employeeRequestSerive.getById({ requestId: this.id, employeeId: this.User().EmployeeId, transactionType: this.transactionType }).subscribe(response => {

      // console.log("response >>>", response);

      if (this.transactionType == "Conveyance") {
        this.load_RequestFormConveyance_Value(response);
        this.getRequestDataList();
      }
      else
        if (this.transactionType == "Travels") {
          this.load_RequestFormTravels_Value(response);
        }
        else
          if (this.transactionType == "Entertainment") {
            this.load_RequestFormEntertainment_Value(response);
            this.getRequestDataList();
          }
          else
            if (this.transactionType == "Expat") {
              this.load_RequestFormExpat_Value(response);
              this.getRequestDataList();
            }
            else
              if (this.transactionType == "Training") {
                this.load_RequestFormTraining_Value(response);
              }
              else
                if (this.transactionType == "Purchase") {                  
                  this.load_RequestFormEntertainment_Value(response);
                  this.getRequestDataList();
                }

    }, (error) => {
      this.utilityService.fail("Something went wrong", "Server Response")
      console.log("error >>>", error);
    })
  }

  requestDataList: any[];
  getRequestDataList() {
    let params = {
      transactionType: this.transactionType,
      requestId: this.id,
      employeeId: this.User().EmployeeId
    };

    this.employeeRequestSerive.getList(params).subscribe(response => {
      if ((response.body as any[]).length > 0) {
        this.requestDataList = response.body;

        if (this.transactionType == "Entertainment" || this.transactionType == "Purchase") {
          if (this.spendMode != 'Advance') {
            const entertainmentArray = this.requestFormEntertainment?.get('entertainment') as FormArray;
            entertainmentArray?.clear();
            this.requestDataList.forEach(entertainment => {
              entertainmentArray?.push(this.fb.group({
                entertainmentDetailId: [entertainment.entertainmentDetailId],
                item: [entertainment.item, Validators.required],
                quantity: [entertainment.quantity, Validators.required],
                price: [entertainment.price, Validators.required],
                amount: [entertainment.amount, Validators.required]
              }));
            });

            this.calculateTotalAmount();
          }
          else {

            this.updateAdvanceAmountValidators(this.spendMode, this.transactionType);

            const entertainmentArray = this.requestFormEntertainment.get('entertainment') as FormArray;
            entertainmentArray.controls.forEach(control => {
              control.get('item')?.clearValidators();
              control.get('quantity')?.clearValidators();
              control.get('price')?.clearValidators();
              control.get('amount')?.clearValidators();

              control.get('item')?.updateValueAndValidity();
              control.get('quantity')?.updateValueAndValidity();
              control.get('price')?.updateValueAndValidity();
              control.get('amount')?.updateValueAndValidity();
            });

          };
        };

        if (this.transactionType == "Conveyance") {
          
          // if (this.spendMode == 'Advance') {  
            const transportationArray = this.requestFormConveyance?.get('transportation') as FormArray;
            transportationArray?.clear();
            this.requestDataList.forEach(transportation => {
              transportationArray?.push(this.fb.group({
                conveyanceDetailId: [transportation.conveyanceDetailId],
                place: [transportation.destination, Validators.required],
                type: [transportation.mode, Validators.required],
                cost: [transportation.cost, Validators.required]
              }));
            });
          // }
          // else {

          //   this.updateAdvanceAmountValidators(this.spendMode, this.transactionType);

          //   const transportationArray = this.requestFormConveyance.get('transportation') as FormArray;
          //   transportationArray.controls.forEach(control => {
          //     control.get('place')?.clearValidators();
          //     control.get('type')?.clearValidators();
          //     control.get('cost')?.clearValidators();

          //     control.get('place')?.updateValueAndValidity();
          //     control.get('type')?.updateValueAndValidity();
          //     control.get('cost')?.updateValueAndValidity();
          //   });

          // };

        };

        if (this.transactionType == "Expat") {
          const expatArray = this.requestExpatForm?.get('expat') as FormArray;
          expatArray.clear();
          this.requestDataList.forEach(expat => {
            expatArray.push(this.fb.group({
              expatDetailId: [expat.expatDetailId],
              companyName: [expat.companyName, Validators.required],
              particular: [expat.particular, Validators.required],
              billType: [expat.billType, Validators.required],
              cost: [expat.cost, Validators.required]
            }));
          });
        };

      }
    }, (error) => {
      this.utilityService.fail("Something went wrong", "Server Response")
      console.log("error >>>", error);
    });
  }


  // #region Conveyance Request

  ddlTransportation: string[] = [];
  loadTransportation() {
    this.ddlTransportation = ['Metro Rail', 'Bus', 'CNG', 'Bike', 'Taxi', 'Rickshaw'];
  }

  load_RequestFormConveyance_Value(value: any) {

    this.transactionForm.get('transactionDate').setValue(new Date(value.transactionDate));
    // this.transactionForm.get('transactionType').setValue(value.transactionType);
    // this.transactionForm.get('spendMode').setValue(value.spendMode);

    this.requestFormConveyance.get('refNo').setValue(value.referenceNumber);
    this.requestFormConveyance.get('requestDate').setValue(new Date(value.requestDate));
    this.requestFormConveyance.get('companyName').setValue(value.companyName);
    this.requestFormConveyance.get('purpose').setValue(value.purpose);
    this.requestFormConveyance.get('advanceAmount').setValue(value.advanceAmount);
    this.requestFormConveyance.get('description').setValue(value.description);
  
  }

  calculateConveyanceTotalAmount() {
    const transportationArray = this.requestFormConveyance.get('transportation') as FormArray;
    transportationArray.valueChanges.subscribe(values => {
      const total = values.reduce((acc: number, curr: any) => acc + (parseFloat(curr.cost) || 0), 0);
      this.requestFormConveyance.get('totalAmount')?.setValue(total);
    });
  }

  requestFormConveyanceInit() {
    this.requestFormConveyance = this.fb.group({
      transportation: this.fb.array([]),
      refNo: new FormControl('', Validators.required),
      requestDate: new FormControl(null, Validators.required),
      companyName: new FormControl('', Validators.required),
      purpose: new FormControl('', Validators.required),
      description: new FormControl(''),
      advanceAmount: new FormControl('', [Validators.pattern('^[0-9]*$')]),
      totalAmount: new FormControl({ value: '', disabled: true }),
    });

    this.formArray = (<FormArray>this.requestFormConveyance.get('transportation')).controls;
    this.resetFormArray();

  }

  submitConveyance(flag: string) {
    var conveyance: any = [];
    let place: any;
    let type: any;
    let cost: any;
    let transportationString = '';

    if (this.spendMode == 'Advance') {
      conveyance = [
        {
          employeeId: this.User().EmployeeId,
          requestId: this.id,
          transactionDate: new Date(this.transactionForm.get('transactionDate').value).toISOString(),
          transactionType: this.transactionForm.get('transactionType').value,
          referenceNumber: this.requestFormConveyance.get('refNo').value,
          requestDate: this.requestFormConveyance.get('requestDate').value,
          companyName: this.requestFormConveyance.get('companyName').value,
          purpose: this.requestFormConveyance.get('purpose').value,
          transportation: transportationString,
          spendMode: this.transactionForm.get('spendMode').value,
          description: this.requestFormConveyance.get('description').value,
          advanceAmount: this.requestFormConveyance.get('advanceAmount').value,

          flag: this.emailFlag === "" ? flag : this.emailFlag
        }
      ];
    }
    else {
      this.formArray.forEach((formGroup: FormGroup, index: number) => {
        place = formGroup.get('place')?.value;
        type = formGroup.get('type')?.value;
        cost = formGroup.get('cost')?.value;
        transportationString += `${place},${type},${cost}`;
        if (index < this.formArray.length - 1) {
          transportationString += ',';
        }
      });

      this.formArray.forEach((formGroup: FormGroup) => {
        conveyance.push({
          employeeId: this.User().EmployeeId,
          conveyanceDetailId: formGroup.get('conveyanceDetailId')?.value,
          requestId: this.id,
          transactionDate: new Date(this.transactionForm.get('transactionDate').value).toISOString(),
          transactionType: this.transactionForm.get('transactionType').value,
          referenceNumber: this.requestFormConveyance.get('refNo').value,
          requestDate: this.requestFormConveyance.get('requestDate').value,
          companyName: this.requestFormConveyance.get('companyName').value,
          purpose: this.requestFormConveyance.get('purpose').value,
          transportation: transportationString,
          spendMode: this.transactionForm.get('spendMode').value,
          description: this.requestFormConveyance.get('description').value,
          advanceAmount: this.requestFormConveyance.get('advanceAmount').value || 0,

          destination: formGroup.get('place')?.value,
          mode: formGroup.get('type')?.value,
          cost: parseFloat(formGroup.get('cost')?.value) || 0,
          flag: this.emailFlag === "" ? flag : this.emailFlag
        })
      });
    }

    // console.log("params Conveyance >>", conveyance);

    let emailData = {
      employeeId: this.User().EmployeeId,
      requestId: this.id,
      transactionDate: new Date(this.transactionForm.get('transactionDate').value).toISOString(),
      transactionType: this.transactionForm.get('transactionType').value,
      referenceNumber: this.requestFormConveyance.get('refNo').value,
      requestDate: this.requestFormConveyance.get('requestDate').value,
      companyName: this.requestFormConveyance.get('companyName').value,
      purpose: this.requestFormConveyance.get('purpose').value,
      transportation: transportationString,
      spendMode: this.transactionForm.get('spendMode').value,
      description: this.requestFormConveyance.get('description').value,
      flag: this.emailFlag === "" ? flag : this.emailFlag
    };

    this.employeeRequestSerive.saveConveyance(conveyance).subscribe(
      response => {
        // console.log("response Conveyance>>", response);
        if (response.body.msg == "Validation Error") {
          this.utilityService.warning(response.body.errorMsg, "Server Response");
        }
        else {
          if (response.body.status == true) {
            this.sendEmail(emailData);
            this.utilityService.success(response.body.msg, "Server Response");
            this.closeModal(this.utilityService.SuccessfullySaved);
          }
        }
      },
      error => {
        console.log("error >>>", error);
        this.utilityService.fail("Error");
      }
    );
  }

  resetFormArray() {

    // if (this.spendMode == 'Advance') {
      const transportationArray = this.requestFormConveyance.get('transportation') as FormArray;
      transportationArray.clear();
      transportationArray.push(this.fb.group({
        place: new FormControl('', Validators.required),
        type: new FormControl('', Validators.required),
        cost: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$')])
      }));
    // }
    // else {
    //   const transportationArray = this.requestFormConveyance.get('transportation') as FormArray;
    //   transportationArray.controls.forEach(control => {
    //     control.get('place')?.clearValidators();
    //     control.get('type')?.clearValidators();
    //     control.get('cost')?.clearValidators();

    //     control.get('place')?.updateValueAndValidity();
    //     control.get('type')?.updateValueAndValidity();
    //     control.get('cost')?.updateValueAndValidity();
    //   });

    // }



  }

  addClick(): void {
    const transportationArray = <FormArray>this.requestFormConveyance.get('transportation');
    transportationArray.push(this.addproductGroup());
  }

  addproductGroup() {
    return this.fb.group({
      place: new FormControl('', Validators.required),
      type: new FormControl('', Validators.required),
      cost: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$')])
    });
  }

  removeClick(index: number) {
    const transportationArray = <FormArray>this.requestFormConveyance.get('transportation');
    if (transportationArray.length > 1) {
      transportationArray.removeAt(index);
    } else {
      this.utilityService.fail("You can't delete the last item", "Site Response");
    }
    this.calculateConveyanceTotalAmount();
  }

  // #endregion

  // #region Travels Request

  requestFormTravelsInit() {
    this.requestFormTravels = this.fb.group({
      refNo: new FormControl('', Validators.required),
      requestDate: new FormControl(null),
      spendMode: new FormControl('', Validators.required),
      location: new FormControl('', Validators.required),
      purpose: new FormControl('', Validators.required),
      transportationTravels: new FormControl('', Validators.required),
      transportationCosts: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$')]),
      accommodationCosts: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$')]),
      subsistenceCosts: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$')]),
      otherCosts: new FormControl('', [Validators.pattern('^[0-9]*$')]),
      description: new FormControl('')
    });
  }

  ddlTransportationTravels: string[] = [];
  loadTransactionTravels() {
    this.ddlTransportationTravels = ['Airfare', 'Rail', 'Bus', 'Car', 'Launch'];
  }

  location: any[] = [];
  loadlocation() {
    this.employeeRequestSerive.loadLocationDropdownData({});
    this.employeeRequestSerive.ddl_data$.subscribe(data => {
      this.employeeRequestSerive.loadLocationDropdown(data);
      this.location = this.employeeRequestSerive.ddl$;
      // console.log("location >>>", this.employeeRequestSerive.ddl$);
    }, error => {
      console.error('Error while fetching data:', error);
    });
  }

  load_RequestFormTravels_Value(value: any) {
    this.transactionForm.get('transactionDate').setValue(new Date(value.transactionDate));
    this.transactionForm.get('transactionType').setValue(value.transactionType);
    this.requestFormTravels.get('refNo').setValue(value.referenceNumber);
    this.requestFormTravels.get('requestDate').setValue([new Date(value.fromDate), new Date(value.toDate)])
    this.requestFormTravels.get('transportationTravels').setValue(value.transportation);
    this.requestFormTravels.get('location').setValue(value.location);
    this.requestFormTravels.get('purpose').setValue(value.purpose);
    this.requestFormTravels.get('spendMode').setValue(value.spendMode);
    this.requestFormTravels.get('description').setValue(value.description);
    this.requestFormTravels.get('transportationCosts').setValue(value.transportationCosts);
    this.requestFormTravels.get('accommodationCosts').setValue(value.accommodationCosts);
    this.requestFormTravels.get('subsistenceCosts').setValue(value.subsistenceCosts);
    this.requestFormTravels.get('otherCosts').setValue(value.otherCosts);

  }

  submitTravel(flag: string) {

    let travel = {
      requestId: this.id,
      employeeId: this.User().EmployeeId,
      transactionDate: this.transactionForm.get('transactionDate').value,
      transactionType: this.transactionForm.get('transactionType').value,
      referenceNumber: this.requestFormTravels.get('refNo').value,
      fromDate: this.datepipe.transform(this.requestFormTravels.get('requestDate').value[0], 'yyyy-MM-dd'),
      toDate: this.datepipe.transform(this.requestFormTravels.get('requestDate').value[1], 'yyyy-MM-dd'),
      spendMode: this.requestFormTravels.get('spendMode').value,
      location: this.requestFormTravels.get('location').value,
      purpose: this.requestFormTravels.get('purpose').value,
      transportation: this.requestFormTravels.get('transportationTravels').value,
      transportationCosts: this.requestFormTravels.get('transportationCosts').value,
      accommodationCosts: this.requestFormTravels.get('accommodationCosts').value,
      subsistenceCosts: this.requestFormTravels.get('subsistenceCosts').value,
      otherCosts: this.requestFormTravels.get('otherCosts').value,
      description: this.requestFormTravels.get('description').value,
      flag: this.emailFlag === "" ? flag : this.emailFlag
    };

    // console.log("params Travels>>", Travels);

    this.employeeRequestSerive.saveTravel(travel).subscribe(
      response => {
        console.log("response Travels>>", response);
        if (response.body.msg == "Validation Error") {
          this.utilityService.warning(response.body.errorMsg, "Server Response");
        }
        else {
          if (response.body.status == true) {
            this.sendEmail(travel);
            this.utilityService.success(response.body.msg, "Server Response");
            this.closeModal(this.utilityService.SuccessfullySaved);
          }
        }
      },
      error => {
        console.log("error >>>", error);
        this.utilityService.fail("Error");
      }
    );
  }


  // #endregion

  // #region Entertainment Request  

  uploadFileName: string = "Choose Your PDF file";
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
      this.requestFormEntertainment.get('file').setValue(selectedFile);
    }
    else {
      this.uploadFileName = "Choose Your PDF file";
    }
  }

  calculateAmount(index: number) {
    const entertainmentArray = <FormArray>this.requestFormEntertainment.get('entertainment');
    const group = entertainmentArray.at(index) as FormGroup;
    const quantity = group.get('quantity')?.value;
    const price = group.get('price')?.value;
    const amount = quantity * price;
    group.get('amount')?.setValue(amount, { emitEvent: false });

    let totalAmount = 0;
    for (let i = 0; i < entertainmentArray.length; i++) {
      const itemAmount = entertainmentArray.at(i).get('amount')?.value || 0;
      totalAmount += itemAmount;
    }

    this.requestFormEntertainment.get('totalAmount')?.setValue(totalAmount, { emitEvent: false });

    // console.log("totalAmount", totalAmount);

  }

  calculateTotalAmount() {
    const entertainmentArray = this.requestFormEntertainment?.get('entertainment') as FormArray;
    const total = entertainmentArray?.controls.reduce((sum, control) => {
      const amount = control.get('amount')?.value || 0;
      return sum + parseFloat(amount);
    }, 0);

    // Update the totalAmount control
    this.requestFormEntertainment?.controls.totalAmount.setValue(total);
  }

  requestFormEntertainmentInit() {
    this.requestFormEntertainment = this.fb.group({
      entertainment: this.fb.array([]),
      refNo: new FormControl('', Validators.required),
      requestDate: new FormControl(null, Validators.required),
      purpose: new FormControl('', Validators.required),
      advanceAmount: new FormControl('', [Validators.pattern('^[0-9]*$')]),
      totalAmount: new FormControl({ value: '', disabled: true }),
      filePath: new FormControl(''),
      file: new FormControl(null)
    });

    this.formArray = (<FormArray>this.requestFormEntertainment.get('entertainment')).controls;
    this.entertainmentResetFormArray();
  }

  load_RequestFormEntertainment_Value(value: any) {

    this.transactionForm.get('transactionDate').setValue(new Date(value.transactionDate));
    this.transactionForm.get('spendMode').setValue(value.spendMode);
    this.transactionForm.get('transactionType').setValue(value.transactionType);

    this.requestFormEntertainment.get('refNo').setValue(value.referenceNumber);
    this.requestFormEntertainment.get('requestDate').setValue(new Date(value.requestDate));
    this.requestFormEntertainment.get('purpose').setValue(value.purpose);

    this.uploadFileName = value.actualFileName;
    this.requestFormEntertainment.get('advanceAmount').setValue(value.advanceAmount);
    this.requestFormEntertainment.get('filePath').setValue(value.filePath);
  }

  entertainmentResetFormArray() {

    if (this.spendMode != 'Advance') {
      const entertainmentArray = this.requestFormEntertainment.get('entertainment') as FormArray;
      entertainmentArray.clear();
      entertainmentArray.push(this.fb.group({
        item: new FormControl('', Validators.required),
        quantity: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$')]),
        price: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$')]),
        amount: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$')])
      }));
    }
    else {
      const entertainmentArray = this.requestFormEntertainment.get('entertainment') as FormArray;
      entertainmentArray.controls.forEach(control => {
        control.get('item')?.clearValidators();
        control.get('quantity')?.clearValidators();
        control.get('price')?.clearValidators();
        control.get('amount')?.clearValidators();

        control.get('item')?.updateValueAndValidity();
        control.get('quantity')?.updateValueAndValidity();
        control.get('price')?.updateValueAndValidity();
        control.get('amount')?.updateValueAndValidity();
      });
    }

  }

  entertainmentAddClick(): void {
    // console.log("entertainmentAddClick >>", 'entertainmentAddClick');
    const entertainmentArray = <FormArray>this.requestFormEntertainment.get('entertainment');
    entertainmentArray.push(this.entertainmentAddproductGroup());
  }

  entertainmentAddproductGroup() {
    return this.fb.group({
      item: new FormControl('', Validators.required),
      quantity: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$')]),
      price: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$')]),
      amount: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$')])
    });
  }

  entertainmentRemoveClick(index: number) {
    const entertainmentArray = <FormArray>this.requestFormEntertainment.get('entertainment');
    if (entertainmentArray.length > 1) {
      entertainmentArray.removeAt(index);
    } else {
      this.utilityService.fail("You can't delete the last item", "Site Response");
    }

  }


  employeeRequestID: number = 0;
  getRequestID() {

    const transactionType = this.transactionForm.get('transactionType').value;
    const requestDate = new Date(this.requestFormEntertainment.get('requestDate').value).toISOString();

    this.employeeRequestSerive.GetRequestID({ employeeId: this.User().EmployeeId, transactionType: transactionType, requestDate: requestDate }).subscribe(response => {

      // console.log("response >>>", response);
      if (response != '') {
        this.employeeRequestID = response;
        this.submitEntertainmentUploadFile();
      };

    }, (error) => {
      this.utilityService.fail("Something went wrong", "Server Response")
      console.log("error >>>", error);
    })

  }

  submitEntertainment(flag: string) {

    let entertainmentString = '';
    this.formArray.forEach((formGroup: FormGroup, index: number) => {
      const items = formGroup.get('item')?.value;
      const quantity = formGroup.get('quantity')?.value;
      const price = formGroup.get('price')?.value;
      const amount = formGroup.get('amount')?.value;

      entertainmentString += `${items},${quantity},${price},${amount}`;
      if (index < this.formArray.length - 1) {
        entertainmentString += ',';
      }
    });

    var entertainment: any = [];
    this.formArray.forEach((formGroup: FormGroup) => {
      entertainment.push({
        employeeId: this.User().EmployeeId,
        requestId: this.id,

        transactionType: this.transactionForm.get('transactionType').value,
        transactionDate: new Date(this.transactionForm.get('transactionDate').value).toISOString(),

        requestDate: new Date(this.requestFormEntertainment.get('requestDate').value).toISOString(),
        referenceNumber: this.requestFormEntertainment.get('refNo').value,
        purpose: this.requestFormEntertainment.get('purpose').value,
        spendMode: this.transactionForm.get('spendMode').value,
        entertainments: entertainmentString,

        entertainmentDetailId: formGroup.get('entertainmentDetailId')?.value,
        item: formGroup.get('item')?.value,
        quantity: formGroup.get('quantity')?.value,
        price: formGroup.get('price')?.value,
        amount: formGroup.get('amount')?.value,
        flag: this.emailFlag === "" ? flag : this.emailFlag
      })
    });

    let emailData = {
      transactionDate: new Date(this.transactionForm.get('transactionDate').value).toISOString(),
      requestDate: new Date(this.requestFormEntertainment.get('requestDate').value).toISOString(),
      transactionType: this.transactionForm.get('transactionType').value,
      referenceNumber: this.requestFormEntertainment.get('refNo').value,
      purpose: this.requestFormEntertainment.get('purpose').value,
      spendMode: this.transactionForm.get('spendMode').value,
      entertainments: entertainmentString,
      file: this.requestFormEntertainment.get('file').value,
      flag: this.emailFlag === "" ? flag : this.emailFlag
    };

    // formData.forEach((value, key) => {
    //   console.log("formData entertainment>>",`${key}: ${value}`);
    // });

    // console.log("params entertainment>>", emailData);


    this.employeeRequestSerive.saveEntertainment(entertainment).subscribe(
      response => {
        // console.log("response entertainment>>", response);
        if (response.body.msg == "Validation Error") {
          this.utilityService.warning(response.body.errorMsg, "Server Response");
        }
        else {
          this.getRequestID();
          this.sendEmail(emailData);
          this.utilityService.success(response.body.msg, "Server Response");
          this.closeModal(this.utilityService.SuccessfullySaved);
        }
      },
      error => {
        console.log("error >>>", error);
        this.utilityService.fail("Error saving Excel file");
      }
    );
  }

  submitPurchase(flag: string) {

    let entertainmentString = '';
    this.formArray.forEach((formGroup: FormGroup, index: number) => {
      const items = formGroup.get('item')?.value;
      const quantity = formGroup.get('quantity')?.value;
      const price = formGroup.get('price')?.value;
      const amount = formGroup.get('amount')?.value;

      entertainmentString += `${items},${quantity},${price},${amount}`;
      if (index < this.formArray.length - 1) {
        entertainmentString += ',';
      }
    });

    var entertainment: any = [];
    this.formArray.forEach((formGroup: FormGroup) => {
      entertainment.push({
        employeeId: this.User().EmployeeId,
        requestId: this.id,

        transactionType: this.transactionForm.get('transactionType').value,
        transactionDate: new Date(this.transactionForm.get('transactionDate').value).toISOString(),
        spendMode: this.transactionForm.get('spendMode').value,

        requestDate: new Date(this.requestFormEntertainment.get('requestDate').value).toISOString(),
        referenceNumber: this.requestFormEntertainment.get('refNo').value,
        purpose: this.requestFormEntertainment.get('purpose').value,
        entertainments: entertainmentString,

        entertainmentDetailId: formGroup.get('entertainmentDetailId')?.value,
        item: formGroup.get('item')?.value,
        quantity: formGroup.get('quantity')?.value,
        price: formGroup.get('price')?.value,
        amount: formGroup.get('amount')?.value,
        flag: this.emailFlag === "" ? flag : this.emailFlag
      })
    });

    // console.log("entertainment Value >>", entertainment);

    let emailData = {
      transactionDate: new Date(this.transactionForm.get('transactionDate').value).toISOString(),
      requestDate: new Date(this.requestFormEntertainment.get('requestDate').value).toISOString(),
      transactionType: this.transactionForm.get('transactionType').value,
      referenceNumber: this.requestFormEntertainment.get('refNo').value,
      purpose: this.requestFormEntertainment.get('purpose').value,
      spendMode: this.transactionForm.get('spendMode').value,
      entertainments: entertainmentString,
      flag: this.emailFlag === "" ? flag : this.emailFlag
    };

    // console.log("params entertainment>>", emailData);

    this.employeeRequestSerive.saveEntertainment(entertainment).subscribe(
      response => {
        // console.log("response entertainment>>", response);
        // if (response.body.msg == "Validation Error") {
        //   this.utilityService.warning(response.body.errorMsg, "Server Response");
        // }
        // else {
          this.getRequestID();
          this.sendEmail(emailData);
          this.utilityService.success(response.body.msg, "Server Response");
          this.closeModal(this.utilityService.SuccessfullySaved);
        // }
      },
      error => {
        console.log("error >>>", error);
        this.utilityService.fail("Error saving Excel file");
      }
    );
  }


  submitEntertainmentUploadFile() {

    // console.log("submitEntertainmentUploadFile>>>", this.employeeRequestID);

    if (this.requestFormEntertainment.valid) {
      var formData = new FormData();
      formData.append('employeeId', this.User().EmployeeId);
      formData.append('requestId', this.employeeRequestID.toString());
      formData.append('transactionType', this.transactionForm.get('transactionType').value);
      const requestDate = new Date(this.requestFormEntertainment.get('requestDate').value).toISOString();
      formData.append('requestDate', requestDate);
      formData.append('referenceNumber', this.requestFormEntertainment.get('refNo').value);  
      formData.append("File", this.requestFormEntertainment.get('file').value);
      formData.append("FilePath", this.requestFormEntertainment.get('filePath').value);  

      this.employeeRequestSerive.saveEntertainmentUploadFile(formData).subscribe(response => {
        // console.log("SAVE response >>>", response);
        if (response?.status) {

        }
        else {
          this.utilityService.fail(response.msg, 'Server Response')
        }
      }, error => {
        this.utilityService.fail('Something went wrong', 'Server Response');
      })
    }
    else {
      this.utilityService.fail('Invalid Form Submission', 'Site Response');
    }
  }

  // #endregion

  // #region Expat Request

  companyName: any = [];
  loadCompanyName() {
    this.employeeRequestSerive.loadCompanyNameDropdownData({});
    this.employeeRequestSerive.ddl_data$.subscribe(data => {
      this.employeeRequestSerive.loadCompanyNameDropdown(data);
      this.companyName = this.employeeRequestSerive.ddl$;
      //console.log("this.companyName>>>", this.companyName);
    }, error => {
      console.error('Error while fetching data:', error);
    });
  }

  billType: any[] = [];
  loadBillType() {
    this.employeeRequestSerive.loadBillTypeDropdownData({});
    this.employeeRequestSerive.ddl_data_bill$.subscribe(data => {
      this.employeeRequestSerive.loadBillTypeDropdown(data);
      this.billType = this.employeeRequestSerive.ddl_bill$;
      //console.log("billType Load>>>", this.employeeRequestSerive.ddl_bill$);
    }, error => {
      console.error('Error while fetching data:', error);
    });
  }

  calculateExpatTotalAmount() {
    const expatArray = this.requestExpatForm.get('expat') as FormArray;
    expatArray.valueChanges.subscribe(values => {
      const total = values.reduce((acc: number, curr: any) => acc + (parseFloat(curr.cost) || 0), 0);
      this.requestExpatForm.get('totalAmount')?.setValue(total);
    });
  }

  requestFormExpatInit() {
    this.requestExpatForm = this.fb.group({
      expat: this.fb.array([]),
      refNo: new FormControl('', Validators.required),
      requestDate: new FormControl(null, Validators.required),
      description: new FormControl(''),
      spendMode: new FormControl('', Validators.required),
      totalAmount: new FormControl({ value: '', disabled: true }),
    });

    this.formArray = (<FormArray>this.requestExpatForm.get('expat')).controls;
    this.expatResetFormArray();

  }

  load_RequestFormExpat_Value(value: any) {

    this.transactionForm.get('transactionDate').setValue(new Date(value.transactionDate));
    this.transactionForm.get('spendMode').setValue(value.spendMode);
    this.transactionForm.get('transactionType').setValue(value.transactionType);

    this.requestExpatForm.get('refNo').setValue(value.referenceNumber);
    this.requestExpatForm.get('requestDate').setValue(new Date(value.requestDate));
    this.requestExpatForm.get('description').setValue(value.description);  
 
  }

  submitExpat(flag: string) {
    var expat: any = [];
    let companyName: any;
    let particular: any;
    let billType: any;
    let cost: any;

    let expatString = '';
    this.formArray.forEach((formGroup: FormGroup, index: number) => {
      companyName = formGroup.get('companyName')?.value;
      particular = formGroup.get('particular')?.value;
      billType = formGroup.get('billType')?.value;
      cost = formGroup.get('cost')?.value;

      expatString += `${companyName},${particular},${billType},${cost}`;
      if (index < this.formArray.length - 1) {
        expatString += ',';
      }
    });


    var expat: any = [];
    this.formArray.forEach((formGroup: FormGroup) => {
      expat.push({
        expatDetailId: formGroup.get('expatDetailId')?.value,
        requestId: this.id,
        employeeId: this.User().EmployeeId,
        transactionDate: new Date(this.transactionForm.get('transactionDate').value).toISOString(),
        transactionType: this.transactionForm.get('transactionType').value,
        referenceNumber: this.requestExpatForm.get('refNo').value,
        requestDate: new Date(this.requestExpatForm.get('requestDate').value).toISOString(),
        spendMode: this.requestExpatForm.get('spendMode').value,
        description: this.requestExpatForm.get('description').value,

        companyName: formGroup.get('companyName')?.value,
        particular: formGroup.get('particular')?.value,
        billType: formGroup.get('billType')?.value,
        cost: formGroup.get('cost')?.value,
        expats: expatString,

        flag: this.emailFlag === "" ? flag : this.emailFlag
      })
    });

    console.log("params Expat>>", expat);

    let emailData = {
      requestId: this.id,
      employeeId: this.User().EmployeeId,
      transactionDate: new Date(this.transactionForm.get('transactionDate').value).toISOString(),
      transactionType: this.transactionForm.get('transactionType').value,
      referenceNumber: this.requestExpatForm.get('refNo').value,
      requestDate: new Date(this.requestExpatForm.get('requestDate').value).toISOString(),
      spendMode: this.requestExpatForm.get('spendMode').value,
      description: this.requestExpatForm.get('description').value,
      flag: this.emailFlag === "" ? flag : this.emailFlag
    };

    this.employeeRequestSerive.saveExpat(expat).subscribe(
      response => {
        console.log("response Expat>>", response);
        if (response.body.msg == "Validation Error") {
          this.utilityService.warning(response.body.errorMsg, "Server Response");
        }
        else {
          if (response.body.status == true) {
            this.sendEmail(emailData);
            this.utilityService.success(response.body.msg, "Server Response");
            this.closeModal(this.utilityService.SuccessfullySaved);
          }
        }
      },
      error => {
        console.log("error >>>", error);
        this.utilityService.fail("Error");
      }
    );
  }

  expatResetFormArray() {
    const expatArray = this.requestExpatForm.get('expat') as FormArray;
    expatArray.clear();
    expatArray.push(this.fb.group({
      companyName: new FormControl('', Validators.required),
      particular: new FormControl('', Validators.required),
      billType: new FormControl('', Validators.required),
      cost: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$')])
    }));

  }

  expatAddClick(): void {
    const expatArray = <FormArray>this.requestExpatForm.get('expat');
    expatArray.push(this.expatAddproductGroup());
  }

  expatAddproductGroup() {
    return this.fb.group({
      companyName: new FormControl('', Validators.required),
      particular: new FormControl('', Validators.required),
      billType: new FormControl('', Validators.required),
      cost: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$')])
    });
  }

  expatRemoveClick(index: number) {
    const expatArray = <FormArray>this.requestExpatForm.get('expat');
    if (expatArray.length > 1) {
      expatArray.removeAt(index);
    } else {
      this.utilityService.fail("You can't delete the last item", "Site Response");
    }
    this.calculateExpatTotalAmount();
  }

  // #endregion

  // #region Training Request

  requestFormTrainingInit() {
    this.requestFormTraining = this.fb.group({
      refNo: new FormControl('', Validators.required),
      requestDate: new FormControl(null),
      institution: new FormControl('', Validators.required),
      course: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      admissionDate: new FormControl(null),
      duration: new FormControl('', Validators.required),
      costs: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$')]),
      purpose: new FormControl('', Validators.required)
    });

  }

  course: any[] = [];
  institution: any[] = [];

  load_RequestFormTraining_Value(value: any) {
    this.transactionForm.get('transactionDate').setValue(new Date(value.transactionDate));
    this.transactionForm.get('spendMode').setValue(value.spendMode);
    this.transactionForm.get('transactionType').setValue(value.transactionType);

    this.requestFormTraining.get('refNo').setValue(value.referenceNumber);
    this.requestFormTraining.get('requestDate').setValue(new Date(value.requestDate));
    this.requestFormTraining.get('institution').setValue(value.institutionName);
    this.requestFormTraining.get('course').setValue(value.course);
    this.requestFormTraining.get('description').setValue(value.description);
    this.requestFormTraining.get('admissionDate').setValue(new Date(value.admissionDate));
    this.requestFormTraining.get('duration').setValue(value.duration);
    this.requestFormTraining.get('costs').setValue(value.trainingCosts);
    this.requestFormTraining.get('purpose').setValue(value.purpose);
  }

  submitTraining(flag: string) {

    let training = {
      requestId: this.id,
      employeeId: this.User().EmployeeId,
      transactionDate: new Date(this.transactionForm.get('transactionDate').value).toISOString(),
      transactionType: this.transactionForm.get('transactionType').value,
      referenceNumber: this.requestFormTraining.get('refNo').value,
      requestDate: new Date(this.requestFormTraining.get('requestDate').value).toISOString(),
      institutionName: this.requestFormTraining.get('institution').value,
      course: this.requestFormTraining.get('course').value,
      description: this.requestFormTraining.get('description').value,
      admissionDate: new Date(this.requestFormTraining.get('admissionDate').value).toISOString(),
      duration: this.requestFormTraining.get('duration').value,
      trainingCosts: this.requestFormTraining.get('costs').value,
      purpose: this.requestFormTraining.get('purpose').value,
      flag: this.emailFlag === "" ? flag : this.emailFlag
    };

    console.log("params Training>>", training);

    this.employeeRequestSerive.saveTraining(training).subscribe(
      response => {
        console.log("response Training>>", response);
        if (response.msg == "Validation Error") {
          this.utilityService.warning(response.errorMsg, "Server Response");
        }
        else {
          if (response.body.status == true) {
            this.sendEmail(training);
            this.utilityService.success(response.msg, "Server Response");
            this.closeModal(this.utilityService.SuccessfullySaved);
          }
        }
      },
      error => {
        console.log("error >>>", error);
        this.utilityService.fail("Error");
      }
    );
  }


  // #endregion


  submit(flag: string) {
    const transactionType = this.transactionForm.get('transactionType').value;

    console.log("transactionType >>", transactionType);

    if (transactionType == "Conveyance") {
      this.submitConveyance(flag);
    }
    else
      if (transactionType == "Travels") {
        this.submitTravel(flag)
      }
      else
        if (transactionType == "Entertainment") {
          this.submitEntertainment(flag);
        }
        else
          if (transactionType == "Expat") {
            this.submitExpat(flag);
          }
          else
            if (transactionType == "Training") {
              this.submitTraining(flag);
            }
            else
              if (transactionType == "Purchase") {
                this.submitPurchase(flag);
              }
  }

  sendEmail(params: any) {
    if (params.requestDate) {
      params.requestDate = new Date(params.requestDate).toISOString();
    }
    if (params.transactionDate) {
      params.transactionDate = new Date(params.transactionDate).toISOString();
    }

    return;

    // params.flag = "Request";
    // console.log("sendEmail params>>>", params);

    this.employeeRequestSerive.sendEmail(params).subscribe(response => {
      // console.log("response >>>", response);
    }, (error) => {
      console.log("error >>>", error);
      this.utilityService.fail("Something went wrong", "Server Response");
    })
  }

  closeModal(reason: any) {
    this.closeModalEvent.emit(reason);
    this.modalService.service.dismissAll(reason);
  }

}
