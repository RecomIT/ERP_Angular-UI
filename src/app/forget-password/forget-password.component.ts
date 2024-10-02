import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { trigger, transition, useAnimation } from '@angular/animations';
import { bounce, fadeIn, fadeOutRight } from 'ng-animate';
import { Router } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';
import { AreasHttpService } from '../areas/areas.http.service';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { UtilityService } from '../shared/services/utility.service';
import { AppConstants } from '../shared/constants';

@Component({
    selector: 'app-forget-password',
    templateUrl: './forget-password.component.html',
    styleUrls: ['./forget-password.component.css'],
    animations: [
        trigger('fadeIn', [transition('* => *', useAnimation(fadeIn, { params: { timing: 0.3 } }))]),
    ]
})

export class ForgetPasswordComponent implements OnInit {

    ipAddress: any;
    deviceInfo: any;
    userForgetPassword: FormGroup;
    year: string = (new Date()).getFullYear().toString();

    constructor(public httpClient: HttpClient, private router: Router, private areasHttpService: AreasHttpService,
        private deviceService: DeviceDetectorService, private utilityService: UtilityService) {
    }
    ngOnInit(): void {
    }

    emailAddress: string = "";
    isEmailVerified: boolean = false;
    OTPBox1: string = "";
    OTPBox2: string = "";
    OTPBox3: string = "";
    OTPBox4: string = "";
    OTPBox5: string = "";
    systemOTP: string = "";
    token: string = "";

    otp_marged() {
        this.systemOTP = (this.OTPBox1 + this.OTPBox2 + this.OTPBox3 + this.OTPBox4 + this.OTPBox5);
    }

    btnSendOTP: boolean = false;

    sendOTP() {
        this.isEmailVerified = false;
        this.token = "";
        if (this.emailAddress != null && this.emailAddress != "") {
            this.btnSendOTP = true;
            var data = {
                requestId: 0, email: this.emailAddress, publicIP: this.ipAddress?.ip, privateIP: "",
                deviceType: this.deviceService.deviceType.toUpperCase(), os: this.deviceService.os,
                osVersion: this.deviceService.os_version, browserVersion: this.deviceService.browser_version, browser: this.deviceService.browser
            };
            const url = this.areasHttpService.apiRoot+"/controlpanel/access/ForgetPassword";
            this.httpClient.post(url, data, {
                headers: new HttpHeaders({
                    "Content-Type": "application/json"
                })
            }).subscribe({
                next: (response: any) => {
                    this.token = "";
                    this.isEmailVerified = response?.status;
                    if (this.isEmailVerified) {
                        this.utilityService.success("OTP has been sent to Email <br> Please Enter the OTP", "Server Response");
                        this.token = response.token;
                    }
                    else {
                        this.utilityService.fail("Email does not exist");
                    }
                    this.btnSendOTP = false;
                },
                error: (err: HttpErrorResponse) => { this.isEmailVerified = false; this.token = ""; this.btnSendOTP = false; }
            })
        }
        else{
            this.utilityService.fail("Please enter valid email","Site Response");
        }
    }

    otp_changed(){
        if(this.systemOTP != null && this.systemOTP!="" && this.systemOTP != undefined){
            this.systemOTP = this.systemOTP.trim()
        }
    }

    btnVerifyOTP: boolean = false;
    verifyOTP() {
        if (this.systemOTP.length == 5 && this.emailAddress != '' && this.emailAddress != null && this.token != '' && this.token != null) {
            this.btnVerifyOTP = true;
            var data = { email: this.emailAddress, otp: this.systemOTP, token: this.token };
            const url = this.areasHttpService.apiRoot+"/controlpanel/access/ForgetPasswordVerification";
            this.httpClient.post(url, data, {
                headers: new HttpHeaders({
                    "Content-Type": "application/json"
                })
            }).subscribe({
                next: (response: any) => {
                    if (response?.status) {
                        this.utilityService.success(response?.msg, "Server Response");
                        this.router.navigate(["/login"]);
                    }
                    else {
                        this.utilityService.fail(response?.msg);
                    }
                    this.btnVerifyOTP = false;
                },
                error: (err: HttpErrorResponse) => { this.isEmailVerified = false, this.token = ""; this.btnVerifyOTP = false; }
            })
        }
    }

}