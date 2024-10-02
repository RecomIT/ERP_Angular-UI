
import { Component, OnInit } from '@angular/core';
import { NotifyService } from 'src/app/shared/services/notify-service/notify.service';

import { ServiceLengthService } from '../../service/service-length/service-length.service';
import { EmployeeInfoService } from '../../service/employee-info/employee-info.service';
import { SharedDataService } from 'src/app/shared/services/shared-data/shared-data.service';

@Component({
  selector: 'app-resignation-request-guide-lines',
  templateUrl: './resignation-request-guide-lines.component.html',
  styleUrls: ['./resignation-request-guide-lines.component.css']
})
export class ResignationRequestGuideLinesComponent implements OnInit {

  constructor(
    private notifyService: NotifyService,
    private sharedDataService: SharedDataService,
    private serviceLengthService: ServiceLengthService,
    private employeeInfoService: EmployeeInfoService,
    ) {      
  }

  
  photoPath : string="";
  serviceLength : string = null;


  ngOnInit(): void {
    this.getEmployeeinfo();
  }


  employeeInfo: any;
  getEmployeeinfo() {
    this.employeeInfoService.getEmployeeInfo(null).subscribe({
      next: (response: any[]) => {
        if (response && response.length > 0) {
          this.employeeInfo = response[0];

          this.photoPath = this.employeeInfo.photoPath + '/' + this.employeeInfo.photo;

          this.calculateServiceLength(this.employeeInfo?.dateOfJoining);

          this.sharedDataService.setEmployeeInfo(this.employeeInfo);
        }
      },
      error: (err) => {
        console.error(err);
        this.notifyService.handleApiError(err);
      }
    });
  }

  setDefaultPhoto() {
    const defaultPath = 'assets/img/user.png'; 
    this.photoPath = defaultPath;
  }


  calculateServiceLength(dateOfJoining: Date): void {
    this.serviceLength = this.serviceLengthService.calculateServiceLength(dateOfJoining);
  }
  
}
