import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient} from '@angular/common/http';
import { DeviceDetectorService } from 'ngx-device-detector';
import { googleAuthenticatorservice } from './google-authenticator.sevice';
import { AreasHttpService } from 'src/app/areas/areas.http.service';
import { UserService } from 'src/app/shared/services/user.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { ApiArea, ApiController } from 'src/app/shared/constants';

@Component({
  selector: 'app-google-authenticator',
  templateUrl: './google-authenticator.component.html',
  styleUrls: ['./google-authenticator.component.css']
})
export class GoogleAuthenticatorComponent implements OnInit {
  form: FormGroup;
  email: string;
  mes: string;
  setupCode: string;
  message: string;
  barcodeImageUrl: string;
  constructor(public httpClient: HttpClient, private router: Router, private areasHttpService: AreasHttpService,
    private utilityService: UtilityService, private deviceService: DeviceDetectorService, private fb: FormBuilder, private userService: UserService, private googleAuth: googleAuthenticatorservice) { }

  ngOnInit(): void {
    this.getQRcode('');


    this.form = this.fb.group({
      codeDigit: ['', Validators.required],

      sendToEmail: [false]

    });
  }



  User = this.userService.User();
  qRdata: any[] = null;
  showNoDataMessages: boolean = false;
  getQRcode(params: any) {

    if (this.User.UserId != null) {
      console.log('EmployeeId', this.User.EmployeeId)
      console.log('UserId', this.User.UserId)
      this.googleAuth.getQRcode(params)
        .subscribe((response: any) => {
          this.qRdata = response.body;
          console.log('qRdata:', this.qRdata);
          if (this.qRdata) {
            this.setupCode = response.body.setupCode;
            this.barcodeImageUrl = response.body.barcodeImageUrl;
            this.email = response.body.email;
            this.message = response.body.message;
            localStorage.setItem('googleAuthCompleted', 'false');
            if(params == 'sendToEmail'){
              this.utilityService.success("Email has been sent to your email", "Server Response");
            }
          }
          this.showNoDataMessages = !this.qRdata || this.qRdata.length === 0;

          if (this.showNoDataMessages) {
            this.utilityService.info("No data found", "Server Response");
          }
        }, (error) => {
          this.utilityService.fail("Something went wrong", "Server Response");
        });
    }
  }

  sendToEmail: string = 'sendToEmail';
  onCheckboxChange(event: any) {
    if (event.target.checked) {
      this.getQRcode(this.sendToEmail)
    }
  }

  sendEmail() {
    this.form.get('sendToEmail').setValue(true);
    this.getQRcode(this.sendToEmail)
  }




  onSubmit() {
    console.log('fromValue', this.form.value);
    if (this.form.valid) {
      console.log(this.form.value);
      // Get the current value of failedAttempts from localStorage
      let failedAttempts = +localStorage.getItem('failedAttempts');
      // If failedAttempts is null or undefined, set it to 0
      failedAttempts = failedAttempts ? failedAttempts : 0;

      const codeDigit = this.form.get("codeDigit").value;
      const checked = this.form.get('sendToEmail').value;
      // Prepare the headers
      const headers = {
        'Content-Type': 'application/json',
        'codeDigit': codeDigit,
        'sendToEmail': checked.toString(),
        'failedAttempts': failedAttempts.toString() // Convert to string to ensure it's stored as a string
      };

      this.areasHttpService.observable_post<any>(
        ApiArea.controlpanel + ApiController.googleAuth + "/TwoFactorAuthenticate",
        null,
        { headers }
      ).subscribe((response) => {
        console.log(response);
        if (response.status === true) {
          const message = response.msg;
          this.utilityService.success(message, "Server Response", 1000);
          localStorage.setItem('googleAuthCompleted', 'true');
          failedAttempts = 0;
          localStorage.setItem('failedAttempts', failedAttempts.toString());
          this.router.navigate(['/areas/common-dashboard']);
        } else {
          const message = response.msg;
          this.utilityService.fail(message, "Server Response", 1000);
          failedAttempts++;
          if(failedAttempts < 3){
            this.utilityService.fail("Invalid attempt! If invalid attempt is happened 3 time you will be redirect to login page again.", "Server Response", 1000);
          }
          localStorage.setItem('failedAttempts', failedAttempts.toString());
          if (response.msg === "Validation Error") {
            //console.log("Validation Error >>>", response.msg);
          } else if (failedAttempts >= 3) {
            const message = "Too many failed attempts";
            this.utilityService.fail(message, "Server Response", 1000);
            failedAttempts = 0;
            localStorage.setItem('failedAttempts', failedAttempts.toString());
            this.router.navigate(['/login']);
          }
        }
      });
    } else {
      this.utilityService.fail("Invalid form", "Site Response");
    }
  }


  //   onSubmit() {
  //     console.log('fromValue',this.form.value)
  //     if (this.form.valid) {
  //         console.log(this.form.value);
  //         let num ='0';
  //        var failedAttempts= localStorage.setItem("failedAttempts",num );
  //      //   console.log('failedAttempts',failedAttempts)
  //         const codeDigit = this.form.get("codeDigit").value;
  //         const checked = this.form.get('sendToEmail').value;
  //         // Prepare the headers
  //         const headers = {     
  //             'Content-Type': 'application/json',
  //             'codeDigit': codeDigit ,// Use the extracted value here
  //             'sendToEmail': checked.toString(),
  //             'failedAttempts':failedAttempts
  //         };

  //         this.areasHttpService.observable_post<any>(
  //             ApiArea.controlpanel + ApiController.googleAuth + "/TwoFactorAuthenticate",
  //             null, // Sending null in the body, since you are using the headers for codeDigit
  //             { headers }
  //         ).subscribe((response) => {
  //             console.log(response);
  //             if (response.status === true) {
  //               //failedAttempts=0;
  //                 const message = response.msg;
  //                 this.utilityService.success(message, "Server Response", 1000);
  //                 localStorage.setItem('googleAuthCompleted', 'true');
  //                 this.router.navigate(['/areas/common-dashboard']);
  //                 // Uncomment the following line if you want to close the modal upon success
  //                 // this.closeModal("Save Complete");
  //             } else {
  //                 const message = response.msg;
  //                 this.utilityService.fail(message, "Server Response", 1000);
  //                 if (response.msg === "Validation Error") {
  //                     console.log("Validation Error >>>", response.msg);
  //                    // failedAttempts++;
  //                 }
  //                 else if (4>3) {
  //                   const message = "Too many failed attempts";
  //                   this.utilityService.fail(message, "Server Response", 1000);
  //                   this.router.navigate(['/login']);
  //               }
  //             }
  //         });
  //     } else {
  //         this.utilityService.fail("Invalid form", "Site Response");

  //     }
  // }


}
