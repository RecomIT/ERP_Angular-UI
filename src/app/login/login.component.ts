import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AreasHttpService } from '../areas/areas.http.service';
import { UserService } from '../shared/services/user.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { trigger, transition, useAnimation } from '@angular/animations';
import { fadeIn } from 'ng-animate';
import { NotifyService } from '../shared/services/notify-service/notify.service';
import { LoginService } from './login.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { EncryptorDecryptor } from '../shared/services/encryptor-decryptor';
import { AppConstants } from '../shared/constants';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  // templateUrl: './wunderman-thompson-login.component.html',
  // styleUrls: ['./wunderman-thompson-login.component.css'],
  animations: [
    trigger('fadeIn', [transition('* => *', useAnimation(fadeIn, { params: { timing: 0.3 } }))]),
  ],
})
export class LoginComponent implements OnInit {

  private ngUnsubscribe = new Subject<void>();
  userloginForm: FormGroup;
  username: string;
  password: string;
  invalidLogin: boolean;
  ipAddress: any;
  deviceInfo: any;

  constructor(
    public httpClient: HttpClient,
    private router: Router,
    private areasHttpService: AreasHttpService,
    private userService: UserService,
    private deviceService: DeviceDetectorService,
    private notifyService: NotifyService,
    private loginService: LoginService) {

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

    this.deviceInfo = this.deviceService.getDeviceInfo();
  }

  username_changed() {
    let username = this.userloginForm.get('username').value
    if (username != null && username != "" && username != undefined) {
      this.userloginForm.get('username').setValue(this.userloginForm.get('username').value.trim())
    }
  }

  password_changed() {
    let password = this.userloginForm.get('password').value
    if (password != null && password != "" && password != undefined) {
      this.userloginForm.get('password').setValue(this.userloginForm.get('password').value.trim())
    }
  }

  showPassword: boolean = false;
  passwordFieldType: string = 'password';
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
    this.passwordFieldType = this.showPassword ? 'text' : 'password';
  }

  btnLogin: boolean = false;
  loginErrorMsg: string = "";

  login() {

    if (this.userloginForm.valid) {
      this.btnLogin = true;

      let username = this.userloginForm.get('username').value.trim();
      let password = this.userloginForm.get('password').value.trim();
      let data = { username: EncryptorDecryptor.encryptUsingAES256(username), password: EncryptorDecryptor.encryptUsingAES256(password) };
      //let data = { username: username, password: password };
      this.loginService.login(data)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe({
          next: (response: any) => {
            localStorage.setItem("jwt", response.token);
            localStorage.setItem("userprivileges", response.encrypt);
            localStorage.setItem("x-site-session", response.passObj);
            this.invalidLogin = false;
            //this.router.navigate(['/areas/common-dashboard']);
            //// Check if GoogleAuthenticatorComponent should be the next destination after login
            // console.log("this.userService.getUser() >>>", this.userService.getUser());
            if (this.userService.getUser().ComId == 19 && this.userService.getUser().OrgId == 11) {
              if (this.userService.getUser().EmployeeId > 0 && AppConstants.app_environment == "Public") {
                localStorage.setItem('googleAuthCompleted', 'false');
                this.router.navigate(['/google-authenticator']);
              }
              else {
                localStorage.setItem('googleAuthCompleted', 'true');
                this.router.navigate(['/areas/common-dashboard']);
              }
            }
            else {
              localStorage.setItem('googleAuthCompleted', 'true');
              this.router.navigate(['/areas/common-dashboard']);
            }
          },
          error: (err: any) => {
            this.invalidLogin = true;
            this.btnLogin = false;
            this.notifyService.handleApiError(err);
          }
        });
    }
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
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
      event.preventDefault();
      return;
    }
  }
}
