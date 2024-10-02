import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { UserService } from 'src/app/shared/services/user.service';
import { trigger, transition, useAnimation } from '@angular/animations';
import { slideInUp,flipInX,flipInY } from 'ng-animate';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  animations: [
    trigger('slideInUp', [transition('* => *', useAnimation(slideInUp))]),
    trigger('flipInX', [transition('* => *', useAnimation(flipInX))]),
    trigger('flipInY', [transition('* => *', useAnimation(flipInY))]),
  ],
})
export class DashboardComponent implements OnInit {

  constructor(public httpClient: HttpClient,private userService: UserService) { }

  isAuthenticated: any;
  ngOnInit(): void {
    //public oidcSecurityService: OidcSecurityService,
    // this.oidcSecurityService.checkAuth().subscribe(({ isAuthenticated, userData }) => {
    // console.log("User Data", userData)
    // console.log("Is Authentic", isAuthenticated)
    // this.isAuthenticated = isAuthenticated;
    // }
    // );
  }

  callApi() {
    // console.log("isAuthenticated >>>", this.isAuthenticated);
    // this.httpClient.get('http://localhost:5000/Home/Secret', {
    // headers: new HttpHeaders({
    // Authorization: "Bearer " + this.oidcSecurityService.getAccessToken()
    // }),
    // responseType: 'text'
    // })
    // .subscribe((data) => {
    // console.log("Api data", data);
    // }, (error)=>{

    // console.log("error >>>",error);
    // })
  }

}
