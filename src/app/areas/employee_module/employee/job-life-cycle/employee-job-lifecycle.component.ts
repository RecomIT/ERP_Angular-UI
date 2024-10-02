import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { UserService } from 'src/app/shared/services/user.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { ApiArea, ApiController } from 'src/app/shared/constants';
import { transition, trigger, useAnimation } from '@angular/animations';
import { slideInUp } from 'ng-animate';
import { AreasHttpService } from 'src/app/areas/areas.http.service';

@Component({
  selector: 'app-employee-job-lifecycle',
  templateUrl: './employee-job-lifecycle.component.html',
  styleUrls: ['./employee-job-lifecycle.component.css'],
  animations: [
    trigger('slideInUp', [transition('* => *', useAnimation(slideInUp, { params: { timing: 0.5 } }))])
  ],
})


export class EmployeeJobLifecycleComponent implements OnInit {

 

  @Input() employeeId: number = 0;
  
  profile_image: any = null;



  constructor(
    private areasHttpService: AreasHttpService, 
    private userService: UserService,
    public utilityService: UtilityService, 
    private datePipe: DatePipe
    ) {      
  }

  profileInfo:any;
  infoComponent: string = "Personal";
  title: string = "Personal Information";


  serviceLength : string = null;
  ngOnInit(): void {
      if (this.employeeId == 0) {
          this.employeeId = this.userService.User().EmployeeId;
          //console.log("employeeId >>>",this.employeeId);
          //console.log("this.userService.User().EmployeeId; >>>",this.userService.User().EmployeeId);
      }

      this.getEmployeeProfileInfo();

      if(this.User().PhotoPath == null || this.User().PhotoPath=="" || this.User().PhotoPath == 'default'){
        this.photoPath= "assets/img/user.png";
      }
      else{
        this.photoPath = `${this.areasHttpService.imageRoot}/${this.User().PhotoPath}`;
      }


      console.log('serviceLength',this.serviceLength);

  }

  ngAfterViewInit(){
    
    if(this.User().PhotoPath == null || this.User().PhotoPath=="" || this.User().PhotoPath == 'default'){
      this.photoPath= "assets/img/user.png";
    }
    else{
      this.photoPath = `${this.areasHttpService.imageRoot}/${this.User().PhotoPath}`;
    }
  }

  getServiceLength() {
    // Assuming you have the dateOfJoining in the profileInfo
    const dateOfJoining: any = this.profileInfo?.dateOfJoining; // Update this line if needed

    console.log('dateOfJoining',dateOfJoining)
  
    if (dateOfJoining) {
      // Calculate the serviceLength using DatePipe
      const currentDate = new Date();
      const formattedDateOfJoining = this.datePipe.transform(dateOfJoining, 'yyyy-MM-dd');
      const formattedCurrentDate = this.datePipe.transform(currentDate, 'yyyy-MM-dd');
  
      if (formattedDateOfJoining && formattedCurrentDate) {
        const joinedDate = new Date(formattedDateOfJoining);
        const today = new Date(formattedCurrentDate);
  
        let yearsDifference = today.getFullYear() - joinedDate.getFullYear();
        let monthsDifference = today.getMonth() - joinedDate.getMonth();
        let daysDifference = today.getDate() - joinedDate.getDate();
  
        // Adjust for negative months or days
        if (daysDifference < 0) {
          monthsDifference--;
          daysDifference += new Date(today.getFullYear(), today.getMonth(), 0).getDate();
        }
  
        if (monthsDifference < 0) {
          yearsDifference--;
          monthsDifference += 12;
        }
  
        // Create a string to display years, months, and days
        const yearString = yearsDifference > 0 ? `${yearsDifference} ${yearsDifference === 1 ? 'year' : 'years'}` : '';
        const monthString = monthsDifference > 0 ? `${monthsDifference} ${monthsDifference === 1 ? 'month' : 'months'}` : '';
        const dayString = daysDifference > 0 ? `${daysDifference} ${daysDifference === 1 ? 'day' : 'days'}` : '';
  
        this.serviceLength = `${yearString} ${monthString} ${dayString}`;
      } else {
        console.error('Error formatting dates.');
      }
    } else {
      console.error('dateOfJoining is undefined or null.');
    }
  }

  getEmployeeProfileInfo() {
      this.areasHttpService.observable_get<any[]>((ApiArea.hrms + ApiController.employees + "/GetEmployeeProfileInfo"), {
          responseType: "json", observe: 'response', params: { id: this.employeeId }
      }).subscribe((response) => {
          var res = response as any;
          console.log("response body >>>", res.body);
          this.profileInfo = res.body
          this.profile_image = { imagePath: (this.profileInfo.photoPath != null && this.profileInfo.photoPath !='' ) ? (this.areasHttpService.imageRoot+this.profileInfo.photoPath) :'', gender: 'Male', id: this.employeeId }
      
      
          this.getServiceLength();
      

        },
          (error) => {
              this.utilityService.fail("Something went wrong", "Server Response")
          })
  }


  changeProfile() {
      alert("Change Photo")
  }


  
 
  events = [
    { EmployeeId: 174, date: new Date('2017-07-01'), label: 'Joining', description: 'Employee hired on this date.' },
    { EmployeeId: 174, date: new Date('2017-10-01'), label: 'Confirmation', description: 'Employee Confirm on this date.' },
    { EmployeeId: 174, date: new Date('2017-11-01'), label: 'PF Start', description: 'PF Start on this date.' },
    { EmployeeId: 174, date: new Date('2018-01-01'), label: 'Annual Increment', description: 'Get a salary increment on this date' },
    { EmployeeId: 174, date: new Date('2018-07-01'), label: 'Promoted & Salary Review', description: 'Received an award for outstanding performance on this date.' },
    { EmployeeId: 174, date: new Date('2019-06-01'), label: 'Transfer', description: 'Transferred to a different department on this date.' },
    { EmployeeId: 174, date: new Date('2020-01-01'), label: 'Annual Increment', description: 'Successfully completed a major project on this date.' },
    { EmployeeId: 174, date: new Date('2021-01-01'), label: 'Promoted & Salary Review', description: 'Received recognition for contributions to the team on this date.' },
    { EmployeeId: 174, date: new Date('2022-09-01'), label: 'Resign', description: 'Participated in a workshop for professional development on this date.' },
    { EmployeeId: 174, date: new Date('2022-10-01'), label: 'Inactive', description: 'Promoted to a higher position on this date.' },
   
  ];
  
  photoPath : string="";


  User() {
    return this.userService.User();
  }

}
