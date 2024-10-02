import { transition, trigger, useAnimation } from '@angular/animations';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { fadeIn } from 'ng-animate';
import { UserService } from '../shared/services/user.service';
import { Router } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';
import { AreasHttpService } from '../areas/areas.http.service';
import { NotifyService } from '../shared/services/notify-service/notify.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-wunderman-thompson-login',
  templateUrl: './wunderman-thompson-login.component.html',
  styleUrls: ['./wunderman-thompson-login.component.css'],
  animations: [
    trigger('fadeIn', [transition('* => *', useAnimation(fadeIn, { params: { timing: 0.3 } }))]),
  ],
})
export class WundermanThompsonLoginComponent implements OnInit {

  userloginForm: FormGroup;
  username: string;
  password: string;
  invalidLogin: boolean;
  ipAddress: any;
  deviceInfo: any;

  constructor(public httpClient: HttpClient, private router: Router, private areasHttpService: AreasHttpService,
    private userService: UserService, private deviceService: DeviceDetectorService,
    private notifyService: NotifyService,
    private snackBar: MatSnackBar) {
    // this.httpClient.get<{ip:string}>('https://jsonip.com')
    // .subscribe( (data: any) => {
    //   this.ipAddress = data;
    //   // console.log('ip objects>>>', this.ipAddress);
    //   // //this.ipAddress = data
    // })
  }

  getDeviceType(): string | null {
    return null;
  }
  year: string = (new Date()).getFullYear().toString();

  ngOnInit() {
    this.userloginForm = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    })

    // let deviceInfo = this.deviceInfo
    // console.log("deviceInfo >>>", deviceInfo);

    this.deviceInfo = this.deviceService.getDeviceInfo();
    console.log(this.deviceInfo);
    
  }

  btnLogin: boolean = false;
  loginErrorMsg: string = "";

  login() {
    if (this.userloginForm.valid) {
      this.btnLogin = true;
      const url = this.areasHttpService.apiRoot + "/controlpanel/access/login";
      this.httpClient.post(url, this.userloginForm.value, {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
          // 'X-Browser-Agent': this.deviceService.browser,
          // 'X-Browser-Version': this.deviceService.browser_version,
          // 'X-OS': this.deviceService.os,
          // 'X-OS-Version': this.deviceService.os_version,
        })
      }).subscribe({
        next: (response: any) => {
          localStorage.setItem("jwt", response.token);
          localStorage.setItem("userprivileges", response.encrypt);
          localStorage.setItem("x-site-session", response.passObj);
          this.router.navigate(['/areas/common-dashboard']);
          this.invalidLogin = false;
          console.log(this.httpClient.request as any)
        },
        error: (err: any) => {
          
          this.invalidLogin = true; this.btnLogin = false; 
          console.log(err);

          this.notifyService.handleApiError(err);
              
        }
      })
    }
  }

  userprivileges() {
    this.areasHttpService.observable_get<any>("/controlpanel/access/userprivileges", {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("jwt")
      }
      , responseType: "json"
      , params: { username: this.userService.getUserName() }
    }).subscribe((data) => {
      localStorage.setItem("userprivileges", data.encrypt);
      localStorage.setItem("x-site-session", data.passObj);
      this.router.navigate(['/areas/dashboard']);
      this.btnLogin = false;
    })
  }


  handleClick(event: Event): void {
    if (this.userloginForm.invalid || this.btnLogin) {
      // If form is invalid or button is in a loading state, prevent default action
      event.preventDefault();
      return;
    }
  }
}
