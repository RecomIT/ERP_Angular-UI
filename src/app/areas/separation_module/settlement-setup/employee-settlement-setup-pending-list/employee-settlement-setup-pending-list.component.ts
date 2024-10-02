import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Select2ConfigService } from 'src/app/shared/services/Select2/select2-config.service';
import { UserService } from 'src/app/shared/services/user.service';
import { NotifyService } from 'src/app/shared/services/notify-service/notify.service';
import { SharedmethodService } from 'src/app/shared/services/shared-method/sharedmethod.service';
import { SettlementSetupRoutingService } from '../../routing-service/settlement-setup/settlement-setup-routing.service';

@Component({
  selector: 'app-employee-settlement-setup-pending-list',
  templateUrl: './employee-settlement-setup-pending-list.component.html',
  styleUrls: ['./employee-settlement-setup-pending-list.component.css']
})
export class EmployeeSettlementSetupPendingListComponent implements OnInit {

  setupEmployeeSelect2Options:any = [];

  constructor(
    private separtionRoutingService: SettlementSetupRoutingService,
    private select2ConfigService: Select2ConfigService,
    private settlementSetupRoutingService: SettlementSetupRoutingService,
    private cdr: ChangeDetectorRef,
    private userService: UserService,
    private notifyService: NotifyService,
    private sharedMethodService: SharedmethodService
  ) { }

  ngOnInit(): void {

    this.setupEmployeeSelect2Options = this.select2ConfigService.getDefaultConfig();

    this.getSettlementSetupEmployees();

    this.getSettlementSetupResignations();


    this.sharedMethodService.methodCall$.subscribe(()=>{
      this.getSettlementSetupResignations();
    })

  }


  settlementSetupEmployeeId: number;
  settlementSetupEmployees: { id: string, text: string }[] = [];

  getSettlementSetupEmployees() {
    this.settlementSetupRoutingService.getPendingSettlementSetupEmployeesApi<any>(null).subscribe({
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
  listOfPendingSetupPageConfig: any = this.userService.pageConfigInit("PendingListOfSetup", this.pageSize, 1, 0);

  pageChanged(pageNo: any) {
    this.pageNumber = pageNo;
    this.getSettlementSetupResignations();
  }

  onPageSizeChange() {
    this.pageNumber = this.listOfPendingSetupPageConfig.currentPage;
    this.getSettlementSetupResignations();
  }

  listOfEmployee: any[] = [];
  employeeId: number = null;

  getSettlementSetupResignations() {

    const params: any = {};

    if (this.pageNumber && this.pageNumber > 0) {
      params['pageNumber'] = this.pageNumber;
    }
    if (this.pageSize && this.pageSize > 0) {
      params['pageSize'] = this.pageSize;
    }

    this.separtionRoutingService.getPendingEmployeeSettlementSetup<any[]>(params).subscribe({
      next: (response: any) => {
        this.listOfEmployee = response.body; 
 
        var xPaginate = JSON.parse(response.headers.get('X-Pagination'));
        this.listOfPendingSetupPageConfig = this.userService.pageConfigInit("PendingListOfSetup", xPaginate.itemsPerPage, xPaginate.currentPage, xPaginate.totalItems);
   
        this.listOfEmployee.forEach((data: any) => {
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

  




  
  showSettlementSetupModal: boolean = false;
  resignationRequestId: number;
  resignationEmployeeId: number;

  ExecutionFlag : string = '';


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

    this.getSettlementSetupResignations();

    this.ExecutionFlag = null;
  }



  // -------------------------------- Search 
  
  
  searchByEmployeeId : number;
  
  onEmployeeSelectChange(selectedEmployee: any) {
    this.employeeId = selectedEmployee;
    this.getSettlementSetupResignations();

    this.cdr.detectChanges();
  }



  
  showEmployeeInfoModal: boolean = false;

  openEmployeeInfoModal(employeeId: any) {
      this.employeeId = employeeId;
      this.showEmployeeInfoModal = true;
  }
  
  closeEmployeeInfoModal(reason: any) {
    this.showEmployeeInfoModal = false;
    this.employeeId = null;
  }


}
