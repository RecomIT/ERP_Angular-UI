import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Select2ConfigService } from 'src/app/shared/services/Select2/select2-config.service';
import { UserService } from 'src/app/shared/services/user.service';
import { NotifyService } from 'src/app/shared/services/notify-service/notify.service';
import { SharedmethodService } from 'src/app/shared/services/shared-method/sharedmethod.service';
import { SettlementSetupRoutingService } from '../../routing-service/settlement-setup/settlement-setup-routing.service';

@Component({
  selector: 'app-employee-settlement-setup-list',
  templateUrl: './employee-settlement-setup-list.component.html',
  styleUrls: ['./employee-settlement-setup-list.component.css']
})
export class EmployeeSettlementSetupListComponent implements OnInit {


  employeeSelect2Options:any = [];


  constructor(
    private select2ConfigService: Select2ConfigService,
    private settlementSetupRoutingService: SettlementSetupRoutingService,
    private cdr: ChangeDetectorRef,
    private userService: UserService,
    private notifyService: NotifyService,
    private sharedMethodService: SharedmethodService
  ) { }

  ngOnInit(): void {

    this.employeeSelect2Options = this.select2ConfigService.getDefaultConfig();

    this.getSettlementSetupEmployees();

    this.getEmployeeSettlementSetup();

    this.sharedMethodService.methodCall$.subscribe(()=>{
      this.getEmployeeSettlementSetup();
    });
  }


  pendingSettlementSetupEmployeeId: number;
  settlementSetupEmployees: { id: string, text: string }[] = [];

  getSettlementSetupEmployees() {
    this.settlementSetupRoutingService.getResignationSetupEmployeeListApi<any>(null).subscribe({
      next: (response) => {
        if (Array.isArray(response)) {

          this.settlementSetupEmployees = response.map(item => ({
            id: item.id,
            text: item.text
          }));
        }
      },
      error: (error: any) => {
        console.error(error);
      }
    });
  }






  pageSize: number = 8;
  pageNumber: number = 1;


  listOfSetupPageConfig: any = this.userService.pageConfigInit("ListOfSetup", this.pageSize, 1, 0);

  pageChanged(pageNo: any) {
    this.pageNumber = pageNo;
    this.getEmployeeSettlementSetup();
  }


  onPageSizeChange() {
    this.pageNumber = this.listOfSetupPageConfig.currentPage;
    this.getEmployeeSettlementSetup();
  }



  listOfSetup: any[] = [];
  employeeId: number = null;


  getEmployeeSettlementSetup() {

    const params: any = {};

    if (this.pageNumber && this.pageNumber > 0) {
      params['pageNumber'] = this.pageNumber;
    }
    if (this.pageSize && this.pageSize > 0) {
      params['pageSize'] = this.pageSize;
    }

    this.settlementSetupRoutingService.getEmployeeSettlementSetup<any[]>(params).subscribe({
      next: (response: any) => {
        this.listOfSetup = response.body;

        var xPaginate = JSON.parse(response.headers.get('X-Pagination'));
        this.listOfSetupPageConfig = this.userService.pageConfigInit("ListOfSetup", xPaginate.itemsPerPage, xPaginate.currentPage, xPaginate.totalItems);

         this.listOfSetup.forEach((data: any) => {
          const { photoPath, photo } = data;
          this.photoPath = photoPath + '/' + photo;
        });
      },
      error: (error: any) => {
        console.error(error);
        this.notifyService.handleApiError(error);
      }
    });

  }




  photoPath : string="";
  setDefaultPhoto() {
    const defaultPath = 'assets/img/user.png'; 
    this.photoPath = defaultPath;
  }










  // -------------------------------- Search


  searchByEmployeeId : number;

  onEmployeeSelectionChange(selectedEmployee: any) {
    this.employeeId = selectedEmployee;
    this.getEmployeeSettlementSetup();

    this.cdr.detectChanges();

  }








  // Setup Modal 
  // ----------------- Starting ...

  ExecutionFlag: string = null;
  
  showSettlementSetupModal: boolean = false;
  resignationRequestId: number;
  resignationEmployeeId: number;

  openSettlementSetupModal(employee: any) {
    this.ExecutionFlag = 'C';
    this.resignationRequestId = employee.resignationRequestId;
    this.resignationEmployeeId = employee.employeeId;
    this.showSettlementSetupModal = true;
  }

  closeSetttlementSetupModal(reason: any) {

    this.showSettlementSetupModal = false;
    this.resignationRequestId = null;
    this.resignationEmployeeId = null;

    this.getEmployeeSettlementSetup();

    this.ExecutionFlag = null;
  }



  // Details Modal 
  // ----------------- Starting ...

  showDetailsSettlementSetupModal: boolean = false;
  selectedSettlementSetupDataForDetails: any;

  openDetailsModal(employee: any) {
    this.ExecutionFlag = 'I';
    this.showDetailsSettlementSetupModal = true;
    this.selectedSettlementSetupDataForDetails = employee;
  }


  closeDetailsSettlementSetupModal(reason: any) {

    this.showDetailsSettlementSetupModal = false;
    this.selectedSettlementSetupDataForDetails = null;

    this.ExecutionFlag = null;
  }




  // Edit Modal 
  // ----------------- Starting ...

  showEditSettlementSetupModal: boolean = false;
  selectedSettlementSetupData: any;

  openEditModal(employee: any) {
    this.ExecutionFlag = 'U';
    this.showEditSettlementSetupModal = true;
    this.selectedSettlementSetupData = employee;
  }


  closeEditSettlementSetupModal(reason: any) {

    this.showEditSettlementSetupModal = false;
    this.selectedSettlementSetupData = null;

    this.ExecutionFlag = null;
  }




  
  // Delete Modal 
  // ----------------- Starting ...

  showDeleteSettlementSetupModal: boolean = false;
  selectedSettlementSetupDataForDelete: any;

  openDeleteModal(employee: any) {

    this.ExecutionFlag = 'D';

    this.showDeleteSettlementSetupModal = true;
    this.selectedSettlementSetupDataForDelete = employee;
  }


  closeDeleteSettlementSetupModal(reason: any) {

    this.showDeleteSettlementSetupModal = false;
    this.selectedSettlementSetupDataForDelete = null;

    this.ExecutionFlag = null;
  }


}
