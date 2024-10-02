import { Component, OnInit } from '@angular/core';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { ServiceAnniversaryAllowanceService } from '../service-anniversary-allowance.service';

@Component({
  selector: 'app-service-anniversary-allowance-list',
  templateUrl: './service-anniversary-allowance-list.component.html',
  styleUrls: ['./service-anniversary-allowance-list.component.css']
})
export class ServiceAnniversaryAllowanceListComponent implements OnInit {

  constructor(
    private utilityService: UtilityService,
    private serviceAnniversaryAllowanceService: ServiceAnniversaryAllowanceService
  ) { }

  ngOnInit(): void {
    this.get();
  }

  list: any[] = [];

  get() {

    this.serviceAnniversaryAllowanceService.get({}).subscribe({
      next: (response: any) => {
        this.list = response.body;
        console.log('list', this.list);
      },
      error: (err) => {
        console.error(err);
        this.utilityService.fail("Something went wrong", "Server Response");
      }
    });
  }



  serviceAnniversaryAllowanceId: any = 0;
  showAddServiceAnniversaryModal: boolean = false;

  openServiceAnniversaryModal() {
    this.showAddServiceAnniversaryModal = true;
  }

  closeServiceAnniversaryModal(reason: any) {
    this.showAddServiceAnniversaryModal = false;
  }

}
